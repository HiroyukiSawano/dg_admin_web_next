<template>
  <el-card header="基本使用">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <span>设置 name 属性, 且 name 没有后缀。name="测试文件"</span>
      <ec-chat-files-card ref="filesCardRef" name="测试文件" />
      <span>设置 name 属性，有文件后缀。name="测试文件.pdf"</span>
      <ec-chat-files-card name="测试文件.pdf" />
      <span>支持更据 name 后缀匹配内置图标 </span>
      <div style="display: flex; flex-wrap: wrap; gap: 8px">
        <ec-chat-files-card name="测试doc后缀.doc" description="PDF · 237KB " />
        <ec-chat-files-card name="测试xls后缀.xls" />
        <ec-chat-files-card name="测试ppt后缀.ppt" />
        <ec-chat-files-card name="测试txt后缀.txt" />
        <ec-chat-files-card name="测试pdf后缀.pdf" />
        <ec-chat-files-card name="测试png后缀.png" />
        <ec-chat-files-card name="测试jpg后缀.jpg" />
        <ec-chat-files-card name="测试gif后缀.gif" />
        <ec-chat-files-card name="测试mp4后缀.mp4" />
        <ec-chat-files-card name="测试mp3后缀.mp3" />
        <ec-chat-files-card name="测试zip后缀.zip" />
        <ec-chat-files-card name="测试rar后缀.rar" />
        <ec-chat-files-card name="测试7z后缀.7z" />
        <ec-chat-files-card name="测试lnk后缀.lnk" />
        <ec-chat-files-card name="测试obj后缀.obj" />
        <ec-chat-files-card name="测试fbx后缀.fbx" />
        <ec-chat-files-card name="测试glb后缀.glb" />
        <ec-chat-files-card name="测试sql后缀.sql" />
        <ec-chat-files-card name="测试db后缀.db" />
        <ec-chat-files-card name="测试md后缀.md" />
        <ec-chat-files-card name="测试js后缀.js" />
        <ec-chat-files-card name="测试py后缀.py" />
        <ec-chat-files-card name="测试java后缀.java" />
        <ec-chat-files-card name="测试php后缀.php" />
        <ec-chat-files-card name="测试json后缀.json" />
      </div>
      <span>如果有后缀，但是匹配不到常用的图标，则默认为 File 文件</span>
      <ec-chat-files-card name="https://dd.com多个特殊字符.后缀.self" />
    </div>
  </el-card>
  <el-card header="状态设置">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <span>设置 status 属性，控制文件加载状态 "uploading","done","error"</span>
      <div style="display: flex; flex-wrap: wrap; gap: 8px">
        <ec-chat-files-card name="uploading 测试文件.pdf" status="uploading" />
        <ec-chat-files-card name="done 测试文件.pdf" status="done" />
        <ec-chat-files-card name="error 测试文件.pdf" status="error" />
      </div>
      <span>"uploading"+"percent" 控制上传进度，"error"+"errorTip"控制自定义失败提示 </span>
      <div style="display: flex; flex-wrap: wrap; gap: 8px">
        <ec-chat-files-card name="uploading 测试文件.doc" status="uploading" :percent="50" />
        <ec-chat-files-card name="error 测试文件.doc" status="error" error-tip="自定义失败提示" />
      </div>
    </div>
  </el-card>
  <el-card header="图片文件展示">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div>图片文件可预览和不可预览</div>
      <div style="display: flex; flex-wrap: wrap; gap: 8px">
        <ec-chat-files-card name="可预览的图片.jpeg" show-del-icon url="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg" />
        <ec-chat-files-card name="无法预览的图片.jpeg" show-del-icon />
      </div>
      <div>图片文件正方形变体其他格式不受变体属性影响</div>
      <div style="display: flex; flex-wrap: wrap; gap: 8px">
        <ec-chat-files-card name="可预览的图片.jpeg" url="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg" img-variant="square" show-del-icon />
        <ec-chat-files-card name="无法预览的图片.jpeg" img-variant="square" show-del-icon />
        <ec-chat-files-card name="其他文件不受变体影响.txt" img-variant="square" show-del-icon :file-size="30000" />
      </div>
      <div>图片文件 默认长方形变体支持上传状态 、支持预览开启关闭 、支持预览遮罩蒙层开启关闭</div>
      <div style="display: flex; flex-wrap: wrap; gap: 8px">
        <ec-chat-files-card name="上传进度.jpeg" :percent="50" status="uploading" show-del-icon url="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg" />
        <ec-chat-files-card name="上传失败.jpeg" status="error" show-del-icon url="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg" />
        <ec-chat-files-card name="关闭预览悬停遮罩.jpeg" :img-preview-mask="false" show-del-icon url="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg" />
        <ec-chat-files-card name="关闭预览功能.jpeg" :img-preview="false" show-del-icon url="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg" />
      </div>

      <div>图片文件 正方形变体支持上传状态 、支持预览开启关闭 、支持预览遮罩蒙层开启关闭</div>
      <div style="display: flex; flex-wrap: wrap; gap: 8px">
        <ec-chat-files-card name="上传进度.jpeg" img-variant="square" :percent="50" status="uploading" show-del-icon url="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg" />
        <ec-chat-files-card name="上传失败.jpeg" img-variant="square" status="error" show-del-icon url="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg" />
        <ec-chat-files-card name="上传完成.jpeg" img-variant="square" show-del-icon url="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg" />
        <ec-chat-files-card name="关闭预览悬停遮罩.jpeg" img-variant="square" :img-preview-mask="false" show-del-icon url="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg" />
        <ec-chat-files-card name="关闭预览功能.jpeg" img-variant="square" :img-preview="false" show-del-icon url="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg" />
      </div>
    </div>
  </el-card>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import EcChatFilesCard from '@/components/EcChat/components/EcChatFilesCard/index.vue'
defineOptions({ name: 'chatFilesCard' })
const filesCardRef = ref()
const colorMap = ref({})

onMounted(() => {
  // 获取内置颜色
  colorMap.value = filesCardRef.value?.colorMap
  console.log(colorMap.value)
})
</script>

<style lang="scss" scoped></style>
