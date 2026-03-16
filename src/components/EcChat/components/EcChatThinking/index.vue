<template>
  <div class="ec-chat-thinking" :class="`is-${props.status}`">
    <el-collapse ref="collapseRef" v-model="activeNames" accordion>
      <el-collapse-item name="0" icon="ri-arrow-right-s-line" :disabled="props.disabled">
        <template #title>
          <div class="el-collapse-item__icon">
            <slot name="status-icon" :status="props.status">
              <el-icon v-if="status === 'thinking'" color="var(--el-color-primary)" class="ri-loader-2-fill is-loading" />
              <el-icon v-if="status === 'start'" color="var(--el-color-warning)" class="ri-flashlight-fill" />
              <el-icon v-if="status === 'end'" color="var(--el-color-success)" class="ri-checkbox-circle-fill" />
              <el-icon v-if="status === 'error'" color="var(--el-color-danger)" class="ri-close-circle-fill" />
              <el-icon v-if="status === 'cancel'" color="var(--el-color-info)" class="ri-close-circle-fill" />
            </slot>
          </div>
          <div class="el-collapse-item__label">
            <slot name="label" :status="props.status">
              {{ status === 'thinking' ? '深度思考中...' : status === 'error' ? '深度思考遇到问题' : status === 'end' ? '深度思考已完成' : status === 'cancel' ? '深度思考已中断' : '开始深度思考' }}
            </slot>
          </div>
        </template>
        <div v-if="displayedContent" :class="{ 'error-state': status === 'error' }">
          <slot v-if="status !== 'error'" name="content" :content="displayedContent" :status="props.status">
            <ec-chat-typewriter :content="displayedContent" :is-markdown="props.isMarkdown" :typing="props.typing" />
          </slot>

          <slot v-else name="error" :error-content="displayedContent" :status="props.status">
            <el-alert :title="displayedContent" type="error" :closable="false" />
          </slot>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script setup>
import { ref, watch, computed } from 'vue'
import EcChatTypewriter from '../EcChatTypewriter/index.vue'
defineOptions({ name: 'EcChatThinking' })
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  isMarkdown: {
    type: Boolean,
    default: false,
  },
  typing: {
    type: Boolean,
    default: false,
  },
  status: {
    type: String,
    default: 'start',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  autoCollapse: {
    type: Boolean,
    default: false,
  },
  buttonWidth: {
    type: String,
    default: '160px',
  },
  maxWidth: {
    type: String,
    default: '500px',
  },
})

// 显示内容（带错误状态处理）
const displayedContent = computed(() => {
  return props.status === 'error' ? '深度思考过程中出现错误' : props.content
})

const activeNames = ref('0')
watch(
  () => props.status,
  (newVal) => {
    if (newVal === 'end' && props.autoCollapse) {
      activeNames.value = ''
    }
  },
)
</script>

<style scoped lang="scss" src="./style.scss"></style>
