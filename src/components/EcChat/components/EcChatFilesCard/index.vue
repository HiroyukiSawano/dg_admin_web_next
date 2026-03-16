<template>
  <div :style="{ 'max-width': `${props.maxWidth}`}" class="ec-chat-files-card" :class="{
    'ec-chat-files-card--square': isSquareVariant && isImageFile,
    'is-hovered': isHovered,
    'is-error': props.status === 'error',
    'is-done': props.status === 'done',
    'is-uploading': props.status === 'uploading'
  }" @mouseenter="isHovered = true" @mouseleave="isHovered = false">
    <div v-if="props.status === 'uploading' && !(isSquareVariant && isImageFile)" class="ec-chat-files-card__progress" :style="{ width: `${props.percent || 0}%` }"></div>

    <slot v-if="$slots.icon || _fileType" name="icon" v-bind="{ item: props }">
      <div v-if="!isImageFile" class="ec-chat-files-card__icon">
        <i :class="`ri-file-${_fileType}-fill`" :style="`background: radial-gradient(circle, #ffffff 0%, ${iconColor || colorMap[_fileType]} 50%); color: ${iconColor || colorMap[_fileType]}`"></i>
      </div>

      <!-- 图片文件处理区域（新增遮罩层逻辑） -->
      <template v-if="isImageFile">
        <div class="ec-chat-files-card__image-preview" :class="{ 'ec-chat-files-card__image-preview--square': isSquareVariant && isImageFile }" @mouseenter="imageHovered = true" @mouseleave="imageHovered = false">
          <el-image v-if="_previewImgUrl" class="ec-chat-files-card__image" ref="imgRef" :src="_previewImgUrl" :preview-src-list="props.imgPreview ? [_previewImgUrl] : []" fit="cover" :show-progress="false" hide-on-click-modal @show="handlePreviewAction('self')" />
          <div v-else class="ec-chat-files-card__image">
            <i :class="`ri-file-${_fileType}-fill`" :style="`background: radial-gradient(circle, #ffffff 0%, ${iconColor || colorMap[_fileType]} 50%); color: ${iconColor || colorMap[_fileType]}`"></i>
          </div>

          <!-- 遮罩层 -->
          <!-- 悬停时才展示 -->
          <transition name="fade">
            <slot v-if="imageHovered && _previewImgUrl && props.imgPreviewMask && props.imgPreview" name="image-preview-actions" v-bind="{ item: { ...props, prefix: namePrefix, suffix: nameSuffix } }">
              <div class="ec-chat-files-card__image__mask " @click="handlePreviewAction('mask')">
                <el-icon class="ri-search-eye-line"></el-icon>
              </div>
            </slot>
          </transition>

          <!-- 如果有状态，不悬停，也展示 -->
          <!-- 状态判断显示区域 -->
          <div v-if="props.status === 'uploading' && isSquareVariant" class="ec-chat-files-card__image__loading">
            <el-progress color="var(--el-color-primary)" type="circle" :percentage="props.percent" :width="44" :stroke-width="4" class="circle-progress" />
          </div>
          <div v-else-if="props.status === 'error' && isSquareVariant" class="ec-chat-files-card__image__error">
            <span>{{ props.errorTip || 'FAILED' }}</span>
          </div>
        </div>
      </template>
    </slot>

    <slot v-if="($slots.content || props.name || description) && !(isSquareVariant && isImageFile)" name="content" v-bind="{ item: props }">
      <div class="ec-chat-files-card__content">
        <div v-if="props.name" class="ec-chat-files-card__name">
          <slot name="name-prefix" v-bind="{ item: { ...props, prefix: namePrefix, suffix: nameSuffix } }">
            <div class="ec-chat-files-card__name__prefix">{{ namePrefix }}</div>
          </slot>
          <slot  v-if="$slots.nameSuffix || props.showFileExtension" name="name-suffix" v-bind="{ item: { ...props, prefix: namePrefix, suffix: nameSuffix } }">
            <div class="ec-chat-files-card__name__suffix">{{ nameSuffix }}</div>
          </slot>
        </div>

        <slot name="description" v-bind="{ item: { ...props, prefix: namePrefix, suffix: nameSuffix } }">
          <div class="ec-chat-files-card__description" :class="{ 'is-error': props.status === 'error', 'is-done': props.status === 'done', 'is-uploading': props.status === 'uploading' }">
            {{ _description }}
          </div>
        </slot>
      </div>
    </slot>

    <div v-if="props.showDelIcon && isHovered" class="ec-chat-files-card__delete" @click="handleDelete">
      <slot name="del-icon" v-bind="{ item: props }">
        <el-icon class="ri-close-circle-fill"></el-icon>
      </slot>
    </div>
  </div>
</template>
<script setup>
import { ref, computed, watch, toRefs } from 'vue';
import { getFileType, getSize, previewImage } from '../../utils/index.js';
import useFileNameParser from '../../utils/useFileNameParser.js';
import { colorMap } from './options.js';

const props = defineProps({
  uid: {
    type: [String, Number],
    default: undefined
  },
  name: {
    type: String,
    default: undefined
  },
  fileSize: {
    type: [String, Number],
    default: undefined
  },
  fileType: {
    type: String,
    default: undefined
  },
  fileExtension: {
    type: String,
    default: undefined
  },
  showFileExtension: {
    type: Boolean,
    default: false
  },

  description: {
    type: String,
    default: undefined
  },
  url: {
    type: String,
    default: undefined
  },
  thumbUrl: {
    type: String,
    default: undefined
  },
  imgFile: {
    type: Object,
    default: undefined
  },
  iconSize: {
    type: String,
    default: '42px'
  },
  iconColor: {
    type: String,
    default: undefined
  },
  showDelIcon: {
    type: Boolean,
    default: true
  },
  maxWidth: {
    type: String,
    default: '100%'
  },
  // style: {
  //   type: Object,
  //   default: undefined
  // },
  // hoverStyle: {
  //   type: Object,
  //   default: undefined
  // },
  imgVariant: {
    type: String,
    default: 'rectangle'
  },
  imgPreview: {
    type: Boolean,
    default: true
  },
  imgPreviewMask: {
    type: Boolean,
    default: true
  },
  status: {
    type: String,
    default: undefined
  },
  percent: {
    type: [String, Number],
    default: undefined
  },
  errorTip: {
    type: String,
    default: undefined
  }
});

const emits = defineEmits(['delete', 'imagePreview']);
const { name, fileType, description, url, thumbUrl, fileSize, imgVariant } =
  toRefs(props);

const { namePrefix, nameSuffix } = useFileNameParser(name);
const isHovered = ref(false);
const imageHovered = ref(false);

/* 图片类型文件预览 开始 */
const _previewImg = ref(undefined);
/* 图片类型文件预览 结束 */

const _fileType = computed(() => {
  if (fileType.value)
    return fileType.value;
  if (!name.value)
    return undefined;
  if (!nameSuffix.value) {
    return 'unknown';
  }
  return getFileType(nameSuffix.value).lowerCase;
});

const _fileTypeUpperCase = computed(() => {
  if (fileType.value)
    return fileType.value.replace(/^\w/, match => match.toUpperCase());
  if (!name.value)
    return '';
  if (!nameSuffix.value) {
    return 'Unknown';
  }
  return getFileType(nameSuffix.value).upperCase;
});

const _description = computed(() => {
  if (description.value) {
    return description.value;
  }
  const typeStr = _fileTypeUpperCase.value;
  const sizeStr = fileSize.value ? `・${getSize(fileSize.value)}` : '';
  if (props.status === 'uploading') {
    return `上传中...${`・${props.percent || 0}`}%${sizeStr}`;
  }
  if (props.status === 'error') {
    return props.errorTip || '上传失败';
  }
  return `${typeStr}${sizeStr}`;
});

const isImageFile = computed(() => _fileType.value === 'image');
const isSquareVariant = computed(() => imgVariant.value === 'square');
const _previewImgUrl = computed(() => {
  if (!isImageFile.value)
    return undefined;
  if (thumbUrl.value)
    return thumbUrl.value;
  if (url.value)
    return url.value;
  return _previewImg.value;
});

const _iconSize = computed(() => {
  if (
    (isSquareVariant.value && isImageFile.value && !props.iconSize) ||
    (isSquareVariant.value && isImageFile.value && props.iconSize === '42px')
  ) {
    return '64px';
  }
  return props.iconSize;
});

watch(
  () => props.imgFile,
  async newFile => {
    if (newFile) {
      try {
        const url = await previewImage(newFile);
        _previewImg.value = url;
      }
      catch (error) {
        console.error('Preview failed:', error);
      }
    }
    else {
      _previewImg.value = undefined;
    }
  },
  { deep: true, immediate: true }
);

function handleDelete() {
  emits('delete', { ...props });
}

// 遮罩展开时触发预览
const imgRef = ref();
function handlePreviewAction(type) {
  if (props.imgPreview && imgRef.value && _previewImgUrl && type === 'mask') {
    imgRef.value.showPreview();
  }
  if (type === 'self') {
    emits('imagePreview', { ...props });
  }
}

defineExpose({
  namePrefix,
  nameSuffix,
  colorMap
});
</script>


<style scoped lang="scss" src="./style.scss"></style>
