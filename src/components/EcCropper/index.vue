
<template>
  <div class="ec-cropper">
    <div class="ec-cropper__image" v-loading="cropLoading" :style="{ minWidth: minContainerWidth + 'px', minHeight: minContainerHeight + 'px' }">
      <img :src="cropSrc" ref="cropImageRef" id="cropImageDom" :alt="alt" />
    </div>
    <div v-if="showPreview" class="ec-cropper__preview" ref="cropPreviewRef" :style="`width: ${minContainerWidth / 4}px; height: ${minContainerHeight / 4}px;`"></div>
    <input class="ec-cropper__input" ref="cropInputRef" type="file" name="image" accept="image/*" @change="changeCrop" />
    <div v-if="showActions" class="ec-cropper__actions">
      <template v-for="(item, index) in cropActions" :key="index">
        <el-divider v-if="item.divider" direction="vertical" />
        <el-tooltip :content="item.text" placement="top">
          <el-button :icon="item.icon" :type="item.type" link circle @click.prevent="item.method" :style="item.style" />
        </el-tooltip>
      </template>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, defineProps, defineEmits, defineModel, nextTick } from 'vue'
import { useEventListener } from '@vueuse/core'
import { isNumber, isString } from 'lodash-es'
import Decimal from 'decimal.js'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'



const props = defineProps({
  alt: { type: String, default: 'image' },
  aspectRatio: { type: Number, default: 4/3 },
  autoCrop: { type: Boolean, default: true },
  autoCropArea: { type: Number, default: 0.6 },
  background: { type: Boolean, default: true },
  center: { type: Boolean, default: false },
  cropType: { type: String, default: 'base64' },
  dragMode: { type: String, default: 'crop' },
  guides: { type: Boolean, default: true },
  maxSize: { type: String, default: '2M' },
  minContainerHeight: { type: Number, default: 480 },
  minContainerWidth: { type: Number, default: 640 },
  minCropBoxHeight: { type: Number, default: 0 },
  minCropBoxWidth: {type: Number, default: 0 },
  modal: { type: Boolean, default: true },
  movable: { type: Boolean, default: true },
  plugin: { type: [Object, Function], default: () => Cropper },
  quality: { type: Number, default: 0.92, validator: (value) => value <= 1 && value > 0 },
  rotatable: { type: Boolean, default: true },
  src: { type: String, default: '' },
  viewMode: { type: Number, default: 0 },
  wheelZoomRatio: { type: Number, default: 0.1 },
  zoomOnWheel: { type: Boolean, default: true },
  zoomable: { type: Boolean, default: true },
  showPreview: { type: Boolean, default: false },
  showActions: { type: Boolean, default: false }
})

const emits = defineEmits(['update:visible', 'ready', 'cropStart', 'cropMove', 'cropEnd', 'crop', 'cropData'])

const cropInputRef = ref(null)
const cropImageRef = ref(null)

const isNumeric = (value) => {
  if (isNumber(value)) return true
  if (!isString(value)) return false
  return !isNaN(parseFloat(value)) && isFinite(value)
}
const toDecimal = (value, fraction = 2, isTruncate = false) => {
  try {
    const decimal = new Decimal(value)
    const rounding = isTruncate ? Decimal.ROUND_DOWN : Decimal.ROUND_HALF_UP
    return decimal.toDecimalPlaces(fraction, rounding).toFixed(fraction)
  } catch {
    return 'NaN'
  }
}
const toFileSize = (value, unit, currUnit) => {
  if (isNumeric(value)) {
    value = Number(value)

    if (value === 0) {
      return `0${currUnit || unit || 'B'}`
    }

    const fileSize = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']

    let index = fileSize.indexOf(currUnit)
    if (index > -1) {
      for (let i = 0; i < index; i++) {
        value *= 1024
      }
    }

    index = fileSize.indexOf(unit)
    if (index < 0) {
      index = fileSize.length - 1
    }

    let level = 0
    for (let i = 0; i < index && (value <= -1024 || value >= 1024); i++) {
      value /= 1024.0
      level++
    }

    return toDecimal(value, 2) + fileSize[level]
  }

  return value
}
const cropPreviewRef = ref(null)
const cropEdit = ref(null)
const cropSrc = ref(props.src)
const cropLoading = ref(false)

const cropActions = ref([
  {
    method: () => addImage(),
    icon: 'ri-add-circle-fill',
    text: '选择图片',
    type: ''
  },
  {
    method: () => zoom(-0.1),
    icon: 'ri-zoom-out-fill',
    text: '缩小',
    type: '',
    divider: true
  },
  {
    method: () => zoom(0.1),
    icon: 'ri-zoom-in-fill',
    text: '放大',
    type: ''
  },
  {
    method: () => rotate(-45),
    icon: 'ri-direction-fill',
    text: '向左旋转',
    type: '',
    divider: true,
    style: {
      transform: 'scaleX(-1)'
    }
  },
  {
    method: () => rotate(45),
    icon: 'ri-direction-fill',
    text: '向右旋转',
    type: ''
  },
  {
    method: () => clear(),
    icon: 'ri-crop-2-fill',
    text: '关闭裁剪区域',
    type: '',
    divider: true
  },
  {
    method: () => reset(),
    icon: 'ri-artboard-2-fill',
    text: '重置裁剪区域',
    type: ''
  },
  // {
  //   method: () => closeCrop(),
  //   icon: 'ri-close-line',
  //   text: '关闭裁剪'
  // },
  {
    method: () => submit(),
    icon: 'ri-checkbox-circle-fill',
    text: '确认裁剪',
    type: 'primary',
    divider: true
  }
])

const zoom = (percent) => cropEdit.value?.zoom(percent)
const move = (offsetX, offsetY) => cropEdit.value?.move(offsetX, offsetY)
const clear = () => cropEdit.value?.clear()
const reset = () => cropEdit.value?.reset()
const scale = (scaleX, scaleY) => cropEdit.value?.scale(scaleX, scaleY)
const rotate = (deg) => cropEdit.value?.rotate(deg)
const enable = () => cropEdit.value?.enable()
const scaleX = (x) => cropEdit.value?.scaleX(x)
const scaleY = (x) => cropEdit.value?.scaleY(x)
const replace = (url) => cropEdit.value?.replace(url)
const setData = (data) => data !== null && typeof data === 'object' && cropEdit.value?.setData(data)

const getData = (rounded) => cropEdit.value?.getData(!!rounded)
const disable = () => cropEdit.value?.disable()
const destroy = () => cropEdit.value?.destroy()
const setDragMode = (s) => cropEdit.value?.setDragMode(s)
const getImageData = () => cropEdit.value?.getImageData()
const setCanvasData = ({ width, height, left, top }) => cropEdit.value?.setCanvasData({ width, height, left, top })
const getCanvasData = () => cropEdit.value?.getCanvasData()
const setCropBoxData = ({ left, top, width, height }) => cropEdit.value?.setCropBoxData({ left, top, width, height })
const setAspectRatio = (s) => cropEdit.value?.setAspectRatio(s)
const getCropBoxData = () => cropEdit.value?.getCropBoxData()
const getCroppedCanvas = () => cropEdit.value?.getCroppedCanvas()
const getContainerData = () => cropEdit.value?.getContainerData()
const addImage = () => cropInputRef.value?.click()
const getCropDataURL = (type = 'image/jpeg', quality = props.quality) => {
  try {
    const canvas = getCroppedCanvas()
    return canvas.toDataURL(type, quality)
  } catch (error) {
    throw new Error(`FAILED TO GET DATA URL: ${error.message}`)
  }
}
const getCropBlob = async (type = 'image/jpeg', quality = props.quality) => {
  return new Promise((resolve, reject) => {
    try {
      const canvas = getCroppedCanvas()
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error('FAILED TO CONVERT CANVAS TO BLOB'))
          }
        },
        type,
        quality
      )
    } catch (error) {
      reject(error)
    }
  })
}
const getCropFile = async (fileName = 'cropped-image.jpg', type = 'image/jpeg') => {
  try {
    const blob = await getCropBlob(type)
    return new File([blob], fileName, { type, lastModified: Date.now() })
  } catch (error) {
    throw new Error(`FAILED TO CREATE FILE: ${error.message}`)
  }
}
const shortcutKeys = (e) => {
  if (e.keyCode === 187 && e.ctrlKey) {
    e.preventDefault()
    zoom(0.1)
  }

  if (e.keyCode === 189 && e.ctrlKey) {
    e.preventDefault()
    zoom(-0.1)
  }

  if (e.keyCode === 38 && e.ctrlKey) {
    e.preventDefault()
    move(0, 1)
  }

  if (e.keyCode === 40 && e.ctrlKey) {
    e.preventDefault()
    move(0, -1)
  }

  if (e.keyCode === 37 && e.ctrlKey) {
    e.preventDefault()
    move(1, 0)
  }

  if (e.keyCode === 39 && e.ctrlKey) {
    e.preventDefault()
    move(-1, 0)
  }

  // if (e.keyCode === 27) {
  //   e.preventDefault()
  //   closeCrop()
  // }
}
const createCrop = () => {
  if (!cropImageRef.value) {
    console.warn('Cropper target element not found')
    return
  }
  try {
    cropLoading.value = true
    const Cropper = props.plugin
    if (cropEdit.value) {
      cropEdit.value.destroy()
      cropEdit.value = null
    }
    cropEdit.value = new Cropper(cropImageRef.value, {
      modal: props.modal,
      guides: props.guides,
      center: props.center,
      movable: props.movable,
      restore: props.restore,
      viewMode: props.viewMode,
      zoomable: props.zoomable,
      autoCrop: props.autoCrop,
      dragMode: props.dragMode,
      rotatable: props.rotatable,
      responsive: props.responsive,
      background: props.background,
      aspectRatio: props.aspectRatio,
      zoomOnWheel: props.zoomOnWheel,
      autoCropArea: props.autoCropArea,
      wheelZoomRatio: props.wheelZoomRatio,
      minCropBoxWidth: props.minCropBoxWidth,
      minCropBoxHeight: props.minCropBoxHeight,
      minContainerWidth: props.minContainerWidth,
      minContainerHeight: props.minContainerHeight,
      preview: cropPreviewRef.value,
      ready() {
        emits('ready')
        cropLoading.value = false
      },
      cropstart(e) {
        emits('cropStart', e)
      },
      cropmove(e) {
        emits('cropMove', e)
      },
      cropend(e) {
        emits('cropEnd', e)
      },
      crop(e) {
        emits('crop', e)
      }
    })
    useEventListener(document.body, 'keydown', shortcutKeys)
  } catch (error) {
    console.error('Failed to create Cropper instance:', error)
    cropLoading.value = false
  }
}

const submit = async() => {
  let cropData = null
  if (props.cropType.toLowerCase() === 'base64') {
    cropData = await getCropDataURL()

  } else if (props.cropType.toLowerCase() === 'blob') {
    cropData = await getCropBlob()
  }
  emits('cropData', cropData)
  // closeCrop()
}

const changeCrop = (e) => {
  const file = e.target.files[0]
  let unit = props.maxSize.match(/[a-zA-Z]+/gi)

  unit = unit && (unit[0].length > 1 ? unit[0] : unit[0] + 'B')

  const size = toFileSize(Number(props.maxSize.match(/[0-9]+/gi)[0]), 'B', unit || 'B')

  if (file === undefined || !file.type.includes('image/') || Number(file.size) > Number(size.split('B')[0])) {
    return
  }

  const reader = new FileReader()

  reader.onload = (event) => {
    cropSrc.value = event.target.result
    replace(event.target.result)
  }

  reader.readAsDataURL(file)
}
watch(() => props.aspectRatio, async (val) => {
  setAspectRatio(val)
}, { immediate: true })
watch(() => props.showPreview, async (val) => {
  await nextTick()
  createCrop()
})
watch(() => props.src, async (newValue) => {
  cropSrc.value = newValue
  if(!cropEdit.value) return
  await nextTick()
  replace(newValue)
}, { immediate: true })

onMounted(async() => {
  await nextTick()
  createCrop()
})
defineExpose({
  clear,
  destroy,
  disable,
  enable,
  zoom,
  rotate,
  reset,
  submit,
  getCanvasData,
  getContainerData,
  getCropBoxData,
  getCroppedCanvas,
  getData,
  getImageData,
  replace,
  setAspectRatio,
  getCropDataURL,
  getCropBlob,
  getCropFile,
  addImage
})
</script>

<style lang="scss" scoped>
.ec-cropper {
  position: relative;
  .ec-cropper__image {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: var(--el-fill-color);
    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: none;
    }
  }
  .ec-cropper__preview {
    position: absolute;
    top: 0;
    left: 100%;
    // margin-left: 16px;
    left: calc(100% + 16px);
    overflow: hidden;
  }
  .ec-cropper__input {
    display: none;
  }
  .ec-cropper__actions {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 12px 16px;
    background-color: var(--el-fill-color-blank);
    border: 1px solid var(--el-border-color);
    border-top: 0;
    .el-button+.el-button {
      margin-left: 0;
    }
  }
}
</style>

