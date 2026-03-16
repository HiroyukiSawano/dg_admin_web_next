<template>
  <el-card header="基本使用">
    <ec-chat-thinking
      status="thinking"
      content="宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼：他必须小心，因为林中到处都有与他一样潜行的猎人，如果他发现了别的生命，不管是不是猎人，不管是天使还是魔鬼，不管是娇嫩的婴儿还是年迈的女神，都不会有任何犹豫，开枪消灭他。"
    />
  </el-card>

  <el-card header="状态">
    <div style="display: flex; gap: 10px; flex-direction: column; align-items: flex-start; justify-content: flex-start">
      <ec-chat-thinking v-model="senderValue" content="前进！前进！不择手段地前进！" status="start" />

      <ec-chat-thinking v-model="senderValue" content="前进！前进！不择手段地前进！" status="thinking" />

      <ec-chat-thinking v-model="senderValue" content="前进！前进！不择手段地前进！" status="end" />

      <ec-chat-thinking v-model="senderValue" content="前进！前进！不择手段地前进！" status="error" />

      <ec-chat-thinking v-model="senderValue" content="前进！前进！不择手段地前进！" status="cancel" />

      <ec-chat-thinking v-model="senderValue" disabled content="前进！前进！不择手段地前进！" status="thinking" />
    </div>
  </el-card>
  <el-card header="自动收起">
    <el-radio-group v-model="statusValue" style="margin-bottom: 12px">
      <el-radio-button value="start"> start </el-radio-button>
      <el-radio-button value="thinking"> thinking </el-radio-button>
      <el-radio-button value="end"> end </el-radio-button>
      <el-radio-button value="error"> error </el-radio-button>
    </el-radio-group>
    <ec-chat-thinking
      :status="statusValue"
      auto-collapse
      content="宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼：他必须小心，因为林中到处都有与他一样潜行的猎人，如果他发现了别的生命，不管是不是猎人，不管是天使还是魔鬼，不管是娇嫩的婴儿还是年迈的女神，都不会有任何犹豫，开枪消灭他。"
      button-width="250px"
      max-width="100%"
    />
  </el-card>
  <el-card header="插槽">
    <el-radio-group v-model="statusValue" style="margin-bottom: 12px">
      <el-radio-button value="start"> start </el-radio-button>
      <el-radio-button value="thinking"> thinking </el-radio-button>
      <el-radio-button value="end"> end </el-radio-button>
      <el-radio-button value="error"> error </el-radio-button>
    </el-radio-group>

    <ec-chat-thinking :status="statusValue" auto-collapse content="技术爆炸的可能性，使得任何文明都可能是潜在的威胁。" button-width="250px" max-width="100%">
      <template #status-icon="{ status }">
        <span v-if="status === 'start'">😄</span>
        <span v-else-if="status === 'error'">😭</span>
        <span v-else-if="status === 'thinking'">🤔</span>
        <span v-else-if="status === 'end'">😊</span>
      </template>

      <template #label="{ status }">
        <span v-if="status === 'start'">降维打击与宇宙美学</span>
        <span v-else-if="status === 'thinking'">慢慢卷起，收进二维的永恒</span>
        <span v-else-if="status === 'end'">墓碑不是为死者立的，是为生者立的</span>
        <span v-else-if="status === 'error'">可为什么结果总是错的？</span>
      </template>

      <template #arrow>
        <span>👇</span>
      </template>

      <template #content="{ content, status }">
        <span>{{ status }}: {{ content }}</span>
      </template>

      <template #error>
        <span>抱歉，无法解决您的问题</span>
      </template>
    </ec-chat-thinking>
  </el-card>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import EcChatThinking from '@/components/EcChat/components/EcChatThinking/index.vue'
defineOptions({ name: 'chatThinking' })
const senderValue = ref(false)
const statusValue = ref('thinking')
</script>

<style lang="scss" scoped></style>
