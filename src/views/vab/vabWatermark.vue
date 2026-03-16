<template>
  <div>
    <el-card header="自定义全局水印">
      <el-button type="primary" @click="setWatermark(copyright)">添加全局水印</el-button>
      <el-button type="primary" @click="setWatermarkCustom()">添加自定义全局水印</el-button>
      <el-button type="danger" @click="setWatermark('')">移除全局水印</el-button>
    </el-card>
    <el-card header="局部自定义配置水印">
      <el-row :gutter="32" style="margin-top: -16px; margin-bottom: -16px;">
        <el-col :lg="18">
          <el-watermark :content="config.content" :font="config.font" :gap="config.gap" :offset="config.offset" :rotate="config.rotate" :z-index="config.zIndex">
            <div style="height: 560px;"></div>
          </el-watermark>
        </el-col>
        <el-col :lg="6" style="border-left: 1px solid var(--el-border-color-light);">
          <el-form class="form" label-position="top" :model="config">
            <el-form-item label="Content">
              <el-input v-model="config.content" />
            </el-form-item>
            <el-form-item label="Color">
              <el-color-picker v-model="config.font.color" show-alpha />
            </el-form-item>
            <el-form-item label="FontSize">
              <el-slider v-model="config.font.fontSize" />
            </el-form-item>
            <el-form-item label="zIndex">
              <el-slider v-model="config.zIndex" />
            </el-form-item>
            <el-form-item label="Rotate">
              <el-slider v-model="config.rotate" :max="180" :min="-180" />
            </el-form-item>
            <el-form-item label="Gap">
              <el-row :gutter="8">
                <el-col :span="12"><el-input-number class="width-100" v-model="config.gap[0]" controls-position="right" /></el-col>
                <el-col :span="12"><el-input-number class="width-100" v-model="config.gap[1]" controls-position="right" /></el-col>
              </el-row>
            </el-form-item>
            <el-form-item label="Offset">
              <el-row :gutter="8">
                <el-col :span="12"><el-input-number class="width-100" v-model="config.offset[0]" controls-position="right" /></el-col>
                <el-col :span="12"><el-input-number class="width-100" v-model="config.offset[1]" controls-position="right" /></el-col>
              </el-row>
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
    </el-card>
    <el-card header="局部基础水印">
      <el-watermark :content="config.content">
        <div style="height: 240px;"></div>
      </el-watermark>
    </el-card>

    <el-card header="局部多行水印">
      <el-watermark :content="['Vite 6.x', copyright]">
        <div style="height: 240px;"></div>
      </el-watermark>
    </el-card>

    <el-card header="局部图片水印">
      <el-watermark :height="30" image="https://element-plus.org/images/element-plus-logo.svg" :width="130">
        <div style="height: 240px;"></div>
      </el-watermark>
    </el-card>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { ElMessageBox } from 'element-plus'
import { useSystemStore } from '@/stores/modules/systemStore'
import Watermark from '@/utils/watermark'
defineOptions({
  value: 'vabWatermark',
})

const { copyright } = storeToRefs(useSystemStore())

const setWatermark = (value) => {
  Watermark.set(value)
}
const setWatermarkCustom = () => {
  ElMessageBox.prompt('请输入自定义水印', '温馨提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    draggable: true,
  })
  .then(({ value }) => {
    if (value) setWatermark(value)
  })
  .catch(() => {})
}

const config = ref({
  content: copyright.value,
  font: {
    fontSize: 16,
    color: 'rgba(0, 0, 0, 0.15)',
  },
  zIndex: -1,
  rotate: -24,
  gap: [128, 128],
  offset: [64, 64],
})
</script>

<style lang="scss" scoped>

</style>
