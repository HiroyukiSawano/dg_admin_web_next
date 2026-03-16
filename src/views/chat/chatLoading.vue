<template>
  <el-card header="基本使用">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <ec-chat-loading animation="circle" />
      <ec-chat-loading animation="bars" />
      <ec-chat-loading animation="dots" />
    </div>
  </el-card>
  <el-card header="带文案描述的加载组件 ">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <ec-chat-loading animation="circle" text="二维数据加载中..." />
      <ec-chat-loading animation="bars" text="二维数据加载中..." />
      <ec-chat-loading animation="dots" text="二维数据加载中..." />
    </div>
  </el-card>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import EcChatLoading from '@/components/EcChat/components/EcChatLoading'
defineOptions({ name: 'chatLoading' })
</script>

<style lang="scss" scoped></style>
