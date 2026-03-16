<template>
  <el-card header="基本使用">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <ec-chat-attachments :http-request="handleHttpRequest" :items="files" :before-upload="handleBeforUpload" :hide-upload="false" @upload-drop="handleUploadDrop" @delete-card="handleDeleteCard" />
    </div>
  </el-card>
  <el-card header="滚动">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div>scrollX</div>
      <ec-chat-attachments
        :http-request="handleHttpRequest"
        :items="files"
        overflow="scrollX"
        :before-upload="handleBeforUpload"
        :hide-upload="false"
        @upload-drop="handleUploadDrop"
        @delete-card="handleDeleteCard"
      />
      <div>scrollY</div>
      <ec-chat-attachments
        :http-request="handleHttpRequest"
        :items="files"
        drag
        overflow="scrollY"
        :before-upload="handleBeforUpload"
        :hide-upload="false"
        @upload-drop="handleUploadDrop"
        @delete-card="handleDeleteCard"
        style="height: 100px"
      />
      <div>wrap</div>
      <ec-chat-attachments
        :http-request="handleHttpRequest"
        :items="files"
        drag
        overflow="wrap"
        :before-upload="handleBeforUpload"
        :hide-upload="false"
        @upload-drop="handleUploadDrop"
        @delete-card="handleDeleteCard"
      />
    </div>
  </el-card>
  <el-card header="拖拽上传">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <p>设置全屏拖拽上传：<el-switch v-model="isFull" /></p>
      <ec-chat-attachments
        :http-request="handleHttpRequest"
        :items="files"
        drag
        :drag-target="dragArea"
        :before-upload="handleBeforUpload"
        :hide-upload="false"
        @upload-drop="handleUploadDrop"
        @delete-card="handleDeleteCard"
      />

      <div id="drag-area" style="border: 1px dashed var(--el-border-color); height: 160px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center">
        <el-icon color="var(--el-color-primary)" :size="32" class="ri-upload-cloud-2-fill" />
        <el-text type="primary">在此处拖拽文件上传</el-text>
      </div>
    </div>
  </el-card>
</template>
<script setup>
import { ref, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { v4 as uuidv4 } from 'uuid'
import EcChatAttachments from '@/components/EcChat/components/EcChatAttachments/index.vue'
defineOptions({ name: 'chatAttachments' })

const files = ref([])
const handleHttpRequest = async (options) => {
  const formData = new FormData()
  formData.append('file', options.file)
  ElMessage.info('上传中...')
  let count = 1
  setTimeout(() => {
    const res = {
      message: '文件上传成功',
      fileName: options.file.name,
      uid: options.file.uid || Date.now() + count++,
      fileSize: options.file.size,
      imgFile: options.file,
    }
    console.log(res.uid, 'options.fileoptions.fileoptions.fileoptions.file')
    files.value.push({
      id: files.value.length,
      uid: res.uid,
      name: res.fileName,
      fileSize: res.fileSize,
      imgFile: res.imgFile,
      showDelIcon: true,
      imgVariant: 'square',
    })
    ElMessage.success('上传成功')
  }, 1000)
}
const handleBeforUpload = (file) => {
  console.log('before', file)
  if (file.size > 1024 * 1024 * 2) {
    ElMessage.error('文件大小不能超过 2MB!')
    return false
  }
}

const handleDeleteCard = (item) => {
  files.value = files.value.filter((items) => items.id !== item.id)
  console.log('delete', item)
  ElMessage.success('删除成功')
}
const typeList = ['word', 'excel', 'ppt', 'pdf', 'txt', 'mark', 'image', 'audio', 'video', 'three', 'code', 'database', 'link', 'zip', 'file', 'unknown']
console.log('typeList', typeList)
onMounted(() => {
  for (let index = 0; index < 12; index++) {
    files.value.push({
      id: uuidv4(),
      uid: uuidv4(),
      name: `展示测试文件${index}`,
      fileSize: 1024 * Math.floor(Math.random() * 1000),
      fileType: typeList[Math.floor(Math.random() * typeList.length)],
      // description: `描述 ${index}`,
      url: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
      thumbUrl: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg',
      imgFile: new File([], 'test.txt'),
      showDelIcon: true,
    })
  }
})

const isFull = ref(false)

const dragArea = ref()
watch(
  () => isFull.value,
  () => {
    console.log('isFull.value', isFull.value)

    if (isFull.value) {
      dragArea.value = document.body
    } else {
      dragArea.value = 'drag-area'
    }
  },
  { immediate: true, deep: true },
)
const handleUploadDrop = async (files, props) => {
  console.log('drop', files)
  console.log('props', props)

  if (files && files.length > 0) {
    if (files[0].type === '') {
      ElMessage.error('禁止上传文件夹！')
      return false
    }

    for (let index = 0; index < files.length; index++) {
      const file = files[index]
      await handleHttpRequest({ file })
    }
  }
}
</script>

<style lang="scss" scoped></style>
