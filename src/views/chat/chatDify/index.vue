<template>
  <el-card header="模拟对话">
    <div style="position: relative; display: flex; flex-direction: column; height: 100%;"  >
      <ec-chat-bubble-list ref="chatListRef" :list="chatList" style="flex: 1; overflow-y: hidden;">
        <template #header="{ item }">
          <ec-chat-thinking v-if="item.reasoning_content" v-model="item.thinlCollapse" :content="item.reasoning_content" :status="item.thinkingStatus" />
        </template>

        <template #content="{ item, index }">
          <template v-if="item.packits">

          </template>
          <template v-else>
            <template v-if="item.content && item.role === 'assistant'">
              <ec-chat-typewriter :content="item.content" :typing="item.typing" is-markdown />
            </template>
            <template v-if="item.content && item.role === 'user'">
              <pre class="margin-0">{{ item.content }}</pre>
            </template>

          </template>
        </template>
        <template #footer="{ item, index }">
          <template v-if="item.files?.length > 0">
            <ec-chat-files-card v-for="file in item.files" :key="file.id" :name="file.filename" :url="file.url" style="margin-top: 12px;" />
          </template>
          <template v-if="item.content && !item.loading && !item.typing">
            <template v-if="item.placement === 'left'">
              <div class="ec-chat-bubble__actions" style="margin-top: 12px;">
                <el-button size="small" type="info" text bg icon="ri-file-copy-fill" @click="actionCopy(item)" />
                <el-button size="small" type="info" text bg icon="ri-volume-up-fill" @click="actionSpeech(item)" />
                <el-button size="small" type="info" text bg icon="ri-refresh-line" @click="actionRetry(item)" />

                <el-button size="small" type="info" text bg icon="ri-share-line" />


              </div>
            </template>
          </template>
        </template>
      </ec-chat-bubble-list>
      <div class="ec-chat-tags">
        <el-tag>图表</el-tag>
        <el-tag>表格</el-tag>
        <el-tag>插槽</el-tag>
        <el-tag>其他</el-tag>
      </div>
      <ec-chat-mention-sender
        ref="chatSenderRef"
        v-model="inputValue"
        variant="updown"
        clearable allow-speech
        :loading="chatLoading"
        @paste-file="filePaste"
        @submit="messageStart"
        @cancel="messageCancel">
        <template #header>
          <ec-chat-attachments :items="uploadedFiles" :hide-upload="true" @delete-card="handleDeleteCard" />
        </template>
        <template #prefix>
          <div style="display: flex; align-items: center; flex-wrap: wrap">
            <el-upload action="#" :show-file-list="false" :auto-upload="false" :on-change="fileUpload">
              <el-button icon="ri-attachment-2" style="padding: 8px; margin-right: 12px;"></el-button>
            </el-upload>
            <el-dropdown>
              <el-button icon="ri-sparkling-fill">深度思考</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>海若思考</el-dropdown-item>
                  <el-dropdown-item>混元思考</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
            <el-checkbox v-model="onlineseek" border class="el-checkbox--no-original">
              <i class="ri-flashlight-fill"></i>
              <span>联网思考</span>
            </el-checkbox>

          </div>
        </template>
      </ec-chat-mention-sender>
    </div>
  </el-card>
</template>
<script setup>
import { ref, onMounted, computed, watch, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { useSpeechSynthesis } from '@vueuse/core'
import hookFetch from 'hook-fetch'
import { useHookFetch } from 'hook-fetch/vue'
import { sseTextDecoderPlugin } from 'hook-fetch/plugins/sse'
import { v4 as uuidv4 } from 'uuid'
import EcChatBubbleList from '@/components/EcChat/components/EcChatBubbleList'
import EcChatMentionSender from '@/components/EcChat/components/EcChatMentionSender'
import EcChatAttachments from '@/components/EcChat/components/EcChatAttachments'
import EcChatTypewriter from '@/components/EcChat/components/EcChatTypewriter'
import EcChatThinking from '@/components/EcChat/components/EcChatThinking'
import EcChatFilesCard from '@/components/EcChat/components/EcChatFilesCard'
defineOptions({ name: 'chatAI' })

const chatList = ref([
  {
    id: 'w9r9pb7f-7ylf-04e7-5ne2-psjcspkrn6ex',
    content: '各地各部门积极出台相关政策举措，积极稳妥化解重点领域风险，推动高质量发展和高水平安全良性互动。',
    placement: 'left',
    avatar: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
    role: 'assistant',
    // // 自执行 IIFE 启动定时器，简单模拟打字完成typing字段变成false
    // ...(() => {
    //   const state = { typing: true }
    //   setTimeout(() => state.typing = false, 2000)
    //   return { typing_state: state }
    // })(),
    // get typing() {
    //   return this.typing_state.typing
    // }
  },
  {
    id: 'zbb5av92-qn77-lvtf-10ls-7fl04d72fl25',
    content: '印章识别',
    placement: 'right',
    avatar: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
    role: 'user',
  },
  {
    id: 'jn83yu6t-dcqv-rjgs-ffn8-eqdhagk8r3cu',
    content: '加载状态示例～～',
    placement: 'left',
    avatar: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
    role: 'assistant',
    loading: true,
    loadingText: '加载状态示例正在解读...',
  },
  {
    id: '0s6hqo9h-49ra-oztu-vd7h-7enahifs3hic',
    content: "已为您生成受理通知书，点击下方预览：",
    placement: 'left',
    avatar: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
    role: 'assistant',
    files: [
      {
        id: "file_1768357346686",
        filename: "受理通知书.xlsx",
        url: "blob:http://localhost:8080/6d9fcfe3-120c-4028-b923-ebf10d93c1b3",
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        size: 11356,
        mime_type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        transfer_method: "local_file",
        upload_file_id: "file_1768357346686"
      }
    ]
  },
  {
    id: '8ijrg2hq-kwuf-wxus-vl2b-wrm4e7mdkn9i',
    content: '哥特过热过热过热过热',
    placement: 'right',
    avatar: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    role: 'user',
  },
])
const onlineseek = ref(false)
const inputValue = ref('')
const uploadedFiles = ref([])
// 处理删除上传的文件
const handleDeleteCard = (item, index) => {
  uploadedFiles.value = uploadedFiles.value.filter(file => file.id !== item.id)
}
const chatListRef = ref()
const chatApi = hookFetch.create({
  baseURL: 'https://iai.lxiai.com:8443/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Authorization': 'Bearer app-5twmR1S5UE7uPguFpk6dVSoX',
  },
  plugins: [
    sseTextDecoderPlugin({
      json: true,
      prefix: 'data: ',
      doneSymbol: '[DONE]'
    })
  ]
})
const { stream: chatStream, loading: chatLoading, cancel: chatCancel } = useHookFetch({
  request: (params) => chatApi.post('/chat-messages', params),
  onError: (error) => {
    console.error('Fetch Error', error)
  },
})

const chatActive = ref({
  message_id: null,
  task_id: null,
  content: '',
})

const messageSend = (data = {}) => {
  const message = {
    id: uuidv4(),
    avatar: data.role === 'assistant' ? 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg' : 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    role: data.role,
    placement: data.role === 'assistant' ? 'left' : 'right',
    content: '',
    loading: data.role === 'assistant',
    ...data
  }

  if (data.role === 'user') {
    if (uploadedFiles.value?.length > 0) {
      message.files = [...uploadedFiles.value]
    }
  }
  if (data.role === 'assistant') {
    chatActive.value.message_id = message.id;
    chatActive.value.content = message.content;
  }
  chatList.value.push(message)
}

const messageStart = async (content) => {
  try {
    inputValue.value = ''
    messageSend({ role: 'user', content })
    messageSend({ role: 'assistant', content: '' })
    chatListRef.value?.scrollToBottom()
    const params = {
      query: content,
      response_mode: 'streaming',
      conversation_id: '',
      user: 'gq3aby93-cn62-cxng-x833-jbr1yj8kvs4q',
      files: [...uploadedFiles.value],
      inputs: {},
    }
    uploadedFiles.value = []
    for await (const chunk of chatStream(params)) {
      try {
        messageChunk(chunk.result)
      } catch (error) {
        console.error('Stream Error', error)
      }
    }
  }
  catch (error) {
    console.error('SSE Error', error);
  }
  finally {
    console.log('SSE End');
  }
}

const messageChunk = (data) => {
  if (!data || !chatActive.value.message_id) return

  const message_index = chatList.value.findIndex(m => m.id === chatActive.value.message_id)

  if (message_index === -1) return
  const message_item = chatList.value[message_index]

  if (data.task_id && !chatActive.value.task_id) chatActive.value.task_id = data.task_id

  switch (data.event) {

    case 'workflow_started': break
    case 'workflow_finished': break
    case 'node_started': break
    case 'node_finished': break

    case 'message':

      if (message_item.loading && message_item.content) message_item.loading = false

      if (data.message_id) {
        const n_id = data.message_id
        const o_id = message_item.id
        message_item.id = n_id
        if (chatActive.value.message_id === o_id) chatActive.value.message_id = n_id
      }

      if (data.answer) {
        message_item.content += data.answer || ''
        chatActive.value.content = message_item.content
      }
      break;

    case 'message_end':
      message_item.typing = false
      message_item.loading = false
      if (message_item.reasoning_content) message_item.thinkingStatus = 'end'
      break;
    case 'error':
      message_item.content = data.message || '出错了'
      message_item.loading = false
      break;
  }
}

const messageCancel = () => {
  try {
    if (chatActive.value.task_id) {
      console.log('停止消息:', chatActive.value.task_id)
      // 调用 Dify API 停止消息
    }
    chatCancel()
  } catch (error) {
    console.error('停止消息失败:', error)
  } finally {
    chatActive.value.task_id = null
  }
}
const fileUpload = async (file, files) => {
  if (!file) return
  try {
    const data = {
      id: uuidv4(),
      name: file.raw.name,
      url: file.raw.url || URL.createObjectURL(file.raw),
      type: file.raw.type,
      size: file.raw.size,
      // 用于 UI 显示的额外属性
      uid: uuidv4(),
      fileSize: file.raw.size,
      imgFile: file.raw,
    };
    uploadedFiles.value.push(data)

  } catch (error) {
    console.error('File Upload Error', error)
  }
}
const chatSenderRef = ref(null)
watch(() => uploadedFiles.value.length, async (n, o) => {
  await nextTick()
  n > 0 ? chatSenderRef.value?.openHeader() : chatSenderRef.value?.closeHeader()
})
const filePaste = (file, files) => {
  chatSenderRef.value?.openHeader()

  Array.from(files).forEach((file, index) => {
    const data = {
      id: uuidv4(),
      name: file.name,
      url: file.url || URL.createObjectURL(file),
      type: file.type,
      size: file.size,
      uid: uuidv4(),
      fileSize: file.size,
      imgFile: file,
    }
    uploadedFiles.value.push(data)
  })
}
const actionRetry = (item) => {
  if (item.placement !== 'left') return
  try {
    const message_index = chatList.value.findIndex(m => m.id === item.id)
    if (message_index === -1) return

    let chat_message = null
    for (let i = message_index - 1; i >= 0; i--) {
      if (chatList.value[i].placement === 'right') {
        chat_message = chatList.value[i]
        break
      }
    }

    if (!chat_message) {
      console.error('Message not found')
      return
    }
    messageStart(chat_message.content)
  } catch (error) {
    console.error('Retry error', error)
  }
}
const actionCopy = (item) => {
  if (!item.content) {
    ElMessage.warning('没有内容可复制！')
    return
  }

  navigator.clipboard.writeText(item.content)
  .then(() => {
    ElMessage.success('复制成功！')
  })
  .catch(error => {
    ElMessage.error('复制失败，请手动复制！')
  })
}
let speech = null
const actionSpeech = (item) => {
  speech = useSpeechSynthesis(item.content, { lang: 'zh-CN', pitch: 1, rate: 1, volume: 1 })
  if (!item.content) {
    ElMessage.warning('没有内容可语音播报！')
    return
  }
  if(speech.isPlaying.value) {
    speechPause()
  } else {
    speechPlay()
  }
}
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

</script>

<style lang="scss" scoped>
  .el-card {
    margin-bottom: 0;
    height: 100%;
  }
:deep(.el-checkbox.el-checkbox--no-original) {
  vertical-align: middle;
  .el-checkbox__input {
    display: none;
  }

  .el-checkbox__label {
    display: inline-flex;
    align-items: center;

    i + span {
      margin-left: 6px;
    }
  }
}
:deep(.ec-chat-mention-sender) {
  .ec-chat-mention-sender__header {
    padding: 16px;
    border: 0;
  }
  .ec-chat-mention-sender__header+.ec-chat-mention-sender__content {
    padding-top: 0;
  }
}
:deep(.ec-chat-tags) {
  margin: 12px 0;
  .el-tag + .el-tag {
    margin-left: 8px;
  }
}
</style>
