<template>
  <div class="el-page">
    <el-card header="放大镜">
      <el-row :gutter="16">
        <el-col :lg="16" class="wheel-box">
          <ec-magnifier
            :width="form.width"
            :height="form.height"
            :out-zoomer="form.outZoomer"
            :scale="form.scale"
            :type="form.type"
            :url="form.landscape"
            :zoomer-style="{
              'background-color': form.taobao ? 'transparent' : 'rgba(0,0,0,0)',
            }"
          >
            <template v-if="form.taobao" #zoomer>
              <div class="ec-magnifier__zoomer-wrapper"></div>
            </template>
          </ec-magnifier>
        </el-col>
        <el-col :lg="8">
          <el-alert type="primary" title="使用鼠标滚轮可以快速调整放大倍数" style="margin-bottom: 16px;" />
          <el-form :model="form" label-position="top">
            <el-form-item label="当前放大倍数">
              <el-input v-model="form.scale" disabled />
            </el-form-item>
            <el-form-item label="当前放大镜宽度">
              <el-input v-model="form.width" disabled />
            </el-form-item>
            <el-form-item label="放大镜尺寸">
              <el-input-number v-model="form.width" controls-position="right" :min="16" :step="16" style="width:100%;" />
            </el-form-item>
            <el-form-item label="放大倍数">
              <el-input-number v-model="form.scale" controls-position="right" :min="0" :step="0.1" style="width:100%;" />
            </el-form-item>
            <el-form-item label="更换放大镜类型">
              <el-select v-model="form.type" placeholder="请选择放大镜类型" style="width:100%;">
                <el-option label="圆形" value="circle" />
                <el-option label="矩形" value="square" />
              </el-select>
            </el-form-item>
            <el-form-item label="更换放大方式">
              <el-select v-model="form.outZoomer" placeholder="请选择放大方式" style="width:100%;">
                <el-option label="内部放大显示" :value="false" />
                <el-option label="外部放大显示" :value="true" />
              </el-select>
            </el-form-item>
            <el-form-item label="淘宝风格放大镜">
              <el-switch v-model="form.taobao" />
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>

  </div>

</template>

<script setup>
import { ref, onBeforeMount, onUnmounted } from 'vue'
import EcMagnifier from '@/components/EcMagnifier'
defineOptions({
  name: 'vabMagnifier',
})
const form = ref({
  scale: 1.5,
  type: 'circle',
  outZoomer: false,
  width: 160,
  taobao: false,
  height: -1,
  landscape: 'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg'
})

const handleWheel = (event) => {
  const imageWrapper = document.querySelector('.wheel-box')
  if (imageWrapper && imageWrapper.contains(event.target)) {
    event.preventDefault()
    const _scale = form.value.scale + (event.deltaY > 0 ? -0.1 : 0.1)
    if (_scale >= 0.5 && _scale <= 5) {
      form.value.scale = Math.round(_scale * 100) / 100
    }
  }
}
onBeforeMount(() => {
  document.addEventListener('wheel', handleWheel, { passive: false })
})
onUnmounted(() => {
  document.removeEventListener('wheel', handleWheel)
})
</script>

<style lang="scss" scoped>
.ec-magnifier__zoomer-wrapper {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 1111;
  cursor: move;
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAACCAMAAABFaP0WAAAABGdBTUEAAK/INwWK6QAAABl0RVh0U29mdHdhcmUAQWRvYmUgSW1hZ2VSZWFkeXHJZTwAAAAGUExURT1uzv///62t27cAAAACdFJOU/8A5bcwSgAAABBJREFUeNpiYGBkYGQECDAAAA0ABMZIs2EAAAAASUVORK5CYII=)
    repeat scroll 0 0 transparent;
}
</style>
