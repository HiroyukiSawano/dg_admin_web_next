<template>
  <div class="page-padding">
    <el-row :gutter="16" class="height-100">
      <el-col :lg="16">
        <el-card header="裁剪" style="z-index: 8;">
          <ec-cropper
          ref="cropperRef"
          :src="cropperImage"
          :aspectRatio="cropperAspectRatio"
          :showPreview="cropperShowPreview"
          :showActions="cropperShowActions"
        />
        </el-card>
      </el-col>
      <el-col :lg="8">
        <el-card header="参数和方法">
          <el-alert title="打开控制台查看输出数据" type="success" style="margin-bottom: 16px;" />
          <el-form label-position="top">
            <el-form-item label="比例">
              <el-select v-model="cropperAspectRatio" placeholder="请选择比例" style="width:100%;">
                <el-option label="自由" :value="0"></el-option>
                <el-option label="1:1" :value="1/1"></el-option>
                <el-option label="4:3" :value="4/3"></el-option>
                <el-option label="16:9" :value="16/9"></el-option>
              </el-select>
              <el-text type="info">固定选区或者不固定</el-text>
            </el-form-item>
            <el-form-item label="压缩率">
              <el-select v-model="cropperQuality" placeholder="请选择压缩率" style="width:100%;">
                <el-option label="0.1" :value="0.1"></el-option>
                <el-option label="0.5" :value="0.5"></el-option>
                <el-option label="1" :value="1"></el-option>
              </el-select>
              <el-text type="info">图像压缩率，值为：0.1-1</el-text>
            </el-form-item>
            <el-form-item label="显示预览">
              <el-switch v-model="cropperShowPreview" />
            </el-form-item>
            <el-form-item label="显示工具条">
              <el-switch v-model="cropperShowActions" />
            </el-form-item>
            <el-form-item label="">
              <el-button type="primary" plain @click="getCropDataURL">Base64</el-button>
              <el-button type="primary" plain @click="getCropBlob">Blob</el-button>
              <el-button type="primary" plain @click="getCropFile">File</el-button>
              <el-button type="primary" @click="dialogVisible = true">弹出裁剪</el-button>
            </el-form-item>
          </el-form>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="dialogVisible" title="裁剪弹窗" :width="960" draggable append-to-body destroy-on-close align-center>
      <ec-cropper ref="cropperRef" :src="cropperImage" />
      <template #footer>
        <el-button @click="cropperRef.addImage()">选择图片</el-button>
        <el-button @click="cropperRef.zoom(-0.1)">缩小</el-button>
        <el-button @click="cropperRef.zoom(0.1)">放大</el-button>
        <el-button @click="cropperRef.rotate(-45)">左旋</el-button>
        <el-button @click="cropperRef.rotate(45)">右旋</el-button>
        <el-button @click="cropperRef.reset()">重置裁剪</el-button>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确认</el-button>
      </template>
    </el-dialog>
  </div>

</template>
<script setup>
import { ref } from 'vue'
import EcCropper from '@/components/EcCropper'
defineOptions({
  name: 'vabCropper',
})
const dialogVisible = ref(false)
const cropperRef = ref(null)
const cropperImage = ref('https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg')
const cropperQuality = ref(0.5)
const cropperAspectRatio = ref(0)
const cropperShowPreview = ref(false)
const cropperShowActions = ref(false)


const testUrl = ref('')


const getCropDataURL = async () => {
 const data = await cropperRef.value.getCropDataURL()
 console.log(data)
}
const getCropBlob = async () => {
 const data = await cropperRef.value.getCropBlob()
 console.log(data)
}
const getCropFile = async () => {
 const data = await cropperRef.value.getCropFile()
 console.log(data)
}
</script>

<style lang="scss" scoped>
::v-deep .el-card {
  height: 100%;
  margin-bottom: 0;
  overflow: initial;
  .el-card__body {
    overflow: initial;
  }
}
</style>
