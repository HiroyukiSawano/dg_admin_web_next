<template>
  <div class="ec-chat__action">
    <el-tooltip :content="actions[item].text" placement="top" v-for="item in operationBtn" :key="item">
      <el-button
        :disabled="props.disabled"
        :icon="actions[item].icon"
        circle
        @click="(e) => handleClick(e, item)"
      />
    </el-tooltip>
  </div>
</template>
<script setup>
import { ref, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus'
import { useSpeechSynthesis } from '@vueuse/core'
defineOptions({
  name: 'EcChatAction',
})
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  disabled: Boolean,
  isBad: Boolean,
  isGood: Boolean,
  operationBtn: {
    type: Array,
    default: () => ['copy', 'good', 'bad', 'replay', 'speech', 'share'],
  },
  onOperation: Function,
})

const actions = ref({
  good: { icon: 'ri-arrow-up-line', text: '点赞' },
  bad: { icon: 'ri-arrow-down-line', text: '点踩' },
  replay: { icon: 'ri-refresh-line', text: '重新生成' },
  copy: { icon: 'ri-file-copy-line', text: '复制' },
  speech: { icon: 'ri-volume-up-fill', text: '语音播报' },
  share: { icon: 'ri-share-line', text: '分享' },
})
const emit = defineEmits(['operation'])
const clipboard = ref(null)
const handleCopy = () => {
  if (!props.content) {
    ElMessage.warning('没有内容可复制！')
    return
  }

  navigator.clipboard.writeText(props.content)
  .then(() => {
    ElMessage.success('复制成功！')
  })
  .catch(error => {
    ElMessage.error('复制失败，请手动复制！')
  })
}
const speech = useSpeechSynthesis(props.content, { lang: 'zh-CN', pitch: 1, rate: 1, volume: 1 })
const speechPlay = () => {
  if (speech.status.value === 'pause') {
    window.speechSynthesis.resume()
  } else {
    speech.speak()
  }
}

const speechPause = () => {
  window.speechSynthesis.pause()
}

const speechStop = () => {
  speech.stop()
}

const handleSpeech = () => {
  if (!props.content) {
    ElMessage.warning('没有内容可语音播报！')
    return
  }
  if(speech.isPlaying.value) {
    speechPause()
  } else {
    speechPlay()
  }
}
const handleClick = (e, type) =>{
  if (type === 'copy') {
    handleCopy()
  }
  if (type === 'speech') {
    handleSpeech()
  }
  emit('operation', type, { e })
}
onBeforeUnmount(() => {
  if (clipboard.value) {
    clipboard.value.destroy()
    clipboard.value = null
  }
})
</script>

<style lang="scss" scoped>
.ec-chat__action {
  margin-top: 12px;
  flex: 1;
  width: 100%;
  padding-right: 44px;
  .el-button {
    --el-button-border-color: transparent;
    --el-button-hover-border-color: transparent;
    --el-button-text-color: var(--el-text-color-secondary);
    --el-button-bg-color: var(--el-fill-color-light);
  }
}
</style>
