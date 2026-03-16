
<template>
  <div>
    <!-- 对话界面 -->
    <div v-for="msg in chatList" :key="msg.id">
      {{ msg.role }}: {{ msg.content }}
    </div>

    <!-- 状态显示 -->
    <div>状态: {{ status }}</div>
    <div v-if="error">错误: {{ error }}</div>
    <div>事件: {{ event }}</div>
    <el-input v-model="inputText" placeholder="输入消息" clearable></el-input>

    <button @click="sendMessage">发送</button>
    <button @click="close">停止</button>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useFetchEventSourceHook } from '@/hooks/fetchEventSourceHook'
import { v4 as uuidv4 } from 'uuid'
// 存储对话消息
const chatList = ref([])
const inputText = ref('日照')

// 配置 Dify API
const API_KEY = 'app-5twmR1S5UE7uPguFpk6dVSoX'
const chatActive = ref({
  message_id: null,
  task_id: null,
  content: '',
})
const addMessageRobot = (data) => {
  const message = {
    id: uuidv4(),
    avatar: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg',
    role: 'assistant',
    placement: 'left',
    content: '',
    loading: true,
    ...data
  }
  chatList.value.push(message)
  chatActive.value.message_id = message.id
  chatActive.value.content = message.content
}
const addMessageUser = (data) => {
  const message = {
    id: uuidv4(),
    avatar: 'https://fuss10.elemecdn.com/0/6f/e35ff375812e6b0020b6b4e8f9583jpeg.jpeg',
    role: 'user',
    placement: 'right',
    loading: false,
    content: '',
    ...data
  }
  chatList.value.push(message);
}
// 1. 创建 EventSource 连接
const { data, error, status, event, open, close } = useFetchEventSourceHook('https://iai.lxiai.com:8443/v1/chat-messages',
  [],
  {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${API_KEY}` },
    body: computed(() => ({
      inputs: {},
      files: [],
      query: inputText.value,
      response_mode: 'streaming',
      conversation_id: '',
      user: 'gq3aby93-cn62-cxng-x833-jbr1yj8kvs4q',
    })),

    serializer: { read: (data) => {
      try {
        return JSON.parse(data)
      } catch (e) {
        return data
      }
    } },
  }
)

watch(data, (n) => {
  if (!n) return
  handleSSEMessage(n)
})
const handleSSEMessage = (data) => {
  if (!data || !chatActive.value.message_id) return

  const message_index = chatList.value.findIndex(m => m.id === chatActive.value.message_id)

  if (message_index === -1) return

  switch (data.event) {

    case 'workflow_started': break
    case 'workflow_finished': break
    case 'node_started': break
    case 'node_finished': break
    case 'message':
      if (chatList.value[message_index].loading && chatList.value[message_index].content) {
        // chatList.value[message_index].content = ''
        chatList.value[message_index].loading = false
      }
      if (data.message_id) {
        const n_id = data.message_id
        const o_id = chatList.value[message_index].id
        chatList.value[message_index].id = n_id
        if (chatActive.value.message_id === o_id) chatActive.value.message_id = n_id
      }
      if (data.answer) {
        chatList.value[message_index].content += data.answer || ''
        chatActive.value.content = chatList.value[message_index].content
      }
      break;

    case 'message_end':
      chatList.value[message_index].typing = false
      chatList.value[message_index].loading = false
      if (chatList.value[message_index].reasoning_content) chatList.value[message_index].thinkingStatus = 'end'
      break;
    case 'error':
      chatList.value[message_index].content = data.message || '出错了'
      chatList.value[message_index].loading = false
      break;
  }
}
// 2. 发送消息函数
const sendMessage = async () => {
  if (!inputText.value.trim()) return
  addMessageUser({ content: inputText.value })
  addMessageRobot({ content: '连接已建立...' })
  open()
  inputText.value = ''
}

</script>


<style lang="scss" scoped></style>
