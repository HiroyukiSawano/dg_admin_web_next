<template>
  <el-card header="渲染器">
    <div style="display: flex; gap: 16px; align-items: center; margin-bottom: 16px;">
      <el-switch v-model="isMarkdown" active-text="" inactive-text="MD渲染" />
      <el-switch v-model="isFog" active-text="" inactive-text="雾化效果" />
      <el-switch v-model="isTyping" active-text="" inactive-text="打字效果" />
    </div>
    <ec-chat-typewriter :content="markdownContentAll" :is-markdown="isMarkdown" :is-fog="isFog" :typing="isTyping" />

  </el-card>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import EcChatTypewriter from '@/components/EcChat/components/EcChatTypewriter/index.vue'
defineOptions({ name: 'chatMarkdown' })
import mdMock from './mock.md?raw'
const markdownContentAll = ref(mdMock)
const isMarkdown = ref(true)
const isFog = ref(true)
const isTyping = ref(true)
</script>

<style lang="scss" scoped></style>
