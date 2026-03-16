<template>
  <el-card header="基本使用">
    <div style="height: 240px">
      <ec-chat-bubble-list :list="list" />
    </div>
  </el-card>

  <el-card header="自定义列表">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div style="display: flex; gap: 12px">
        <span>动态设置内容 <el-switch v-model="switchValue" /></span>
        <span>自定义 loading <el-switch v-model="loading" @change="(value) => setLoading(value)" /></span>
      </div>
      <ec-chat-bubble-list :list="bubbleItems" max-height="320px">
        <template #top>顶部插槽</template>
        <!-- 自定义头像 -->
        <template #avatar="{ item }">
          <div class="avatar-wrapper">
            <el-avatar :src="item.role === 'ai' ? avartAi : avatar" :size="32" />
          </div>
        </template>

        <!-- 自定义头部 -->
        <template #header="{ item }">
          <div class="header-wrapper">
            <div class="header-name">
              {{ item.role === 'ai' ? 'C-3PO' : '王国熙' }}
            </div>
          </div>
        </template>

        <!-- 自定义气泡内容 -->
        <template #content="{ item }">
          <div class="content-wrapper">
            <div class="content-text">
              {{ item.role === 'ai' ? `${switchValue ? `#机器人-${item.key}：` : ''}弱小和无知不是生存的障碍，傲慢才是。` : `${switchValue ? `#用户-${item.key}：` : ''}前进！前进！不择手段地前进` }}
            </div>
          </div>
        </template>

        <!-- 自定义底部 -->
        <template #footer="{ item }">
          <template v-if="item.role === 'ai'">
            <el-button type="info" icon="ri-restart-line" size="small" circle />
            <el-button color="#626aef" icon="ri-file-copy-line" size="small" circle />
            <el-button type="success" icon="ri-share-line" size="small" circle />
            <el-button type="warning" icon="ri-add-line" size="small" circle />
          </template>
        </template>

        <!-- 自定义 loading -->
        <template #loading="{ item }">
          <div class="loading-container">
            <span>#{{ item.role }}-{{ item.key }}：</span>
            <span>我</span>
            <span>是</span>
            <span>自</span>
            <span>定</span>
            <span>义</span>
            <span>加</span>
            <span>载</span>
            <span>内</span>
            <span>容</span>
            <span>哦</span>
            <span>~</span>
          </div>
        </template>
        <template #bottom>底部插槽</template>
      </ec-chat-bubble-list>
    </div>
  </el-card>

  <el-card header="列表滚动">
    <el-form inline>
      <el-form-item>
        <el-button type="primary" plain @click="addMessage">添加对话</el-button>
        <el-button type="danger" plain @click="clearMessage">清空对话列表</el-button>
        <el-button type="primary" plain @click="scrollToTop">滚动到顶部</el-button>
        <el-button type="primary" plain @click="scrollBottom">滚动到底部</el-button>
      </el-form-item>
      <el-form-item>
        <el-input-number v-model="num" :min="0" :max="10" controls-position="right" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="scrollToBubble">滚动第{{ num }}个气泡框</el-button>
      </el-form-item>
    </el-form>
    <br />
    <div>
      <ec-chat-bubble-list
        ref="bubbleListRef"
        :list="bubbleItems3"
        :is-markdown="false"
        :typing="{ step: 3, interval: 80, suffix: '💩' }"
        avatar-shape="square"
        loading-animation="bars"
        loading-text="加载中..."
        max-height="320px"
        max-width="100%"
      />
    </div>
  </el-card>
  <el-card header="滚动完成事件">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div style="display: flex; align-items: center">
        <span style="margin-right: 12px">trigger-indices: </span>
        <el-button style="width: fit-content" @click="changeTriggerIndices('only-last')"> only-last </el-button>
        <el-button style="width: fit-content" type="primary" @click="changeTriggerIndices('all')"> all </el-button>
        <el-button style="width: fit-content" type="success" @click="changeTriggerIndices([1, 2, 3])"> [1, 2, 3] </el-button>
      </div>

      <ec-chat-bubble-list :list="list4" max-height="320px" :trigger-indices="triggerIndices" @complete="onComplete" />
    </div>
  </el-card>
</template>
<script setup>
import { ref, onMounted, nextTick } from 'vue'
import EcChatBubbleList from '@/components/EcChat/components/EcChatBubbleList/index.vue'
defineOptions({ name: 'chatBubbleList' })
// 示例调用
const list = ref(generateFakeItems(5))

function generateFakeItems(count) {
  const messages = []
  for (let i = 0; i < count; i++) {
    const role = i % 2 === 0 ? 'ai' : 'user'
    const placement = role === 'ai' ? 'left' : 'right'
    const key = i + 1
    const content = role === 'ai' ? '不要回答！不要回答！！不要回答！！！'.repeat(5) : `前进！前进！不择手段地前进！`
    const loading = false
    const shape = 'corner'
    const variant = role === 'ai' ? 'filled' : 'outlined'
    const isMarkdown = false
    const typing = role === 'ai' ? i === count - 1 : false
    const avatar = role === 'ai' ? 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg' : 'https://fuss10.elemecdn.com/3/28/bbf893f792f03a54408b3b7a7ebf0jpeg.jpeg'

    messages.push({
      key, // 唯一标识
      role, // user | ai 自行更据模型定义
      placement, // left | right 气泡位置
      content, // 消息内容 流式接受的时候，只需要改这个值即可
      loading, // 当前气泡的加载状态
      // shape, // 气泡的形状
      // variant, // 气泡的样式
      isMarkdown, // 是否渲染为 markdown
      typing, // 是否开启打字器效果 该属性不会和流式接受冲突
      isFog: role === 'ai', // 是否开启打字雾化效果，该效果 v1.1.6 新增，且在 typing 为 true 时生效，该效果会覆盖 typing 的 suffix 属性
      avatar,
      // avatarSize: 24, // 头像占位大小
    })
  }
  return messages
}
const bubbleItems = ref(generateFakeItems2(5))
const avatar = ref('https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg')
const avartAi = ref('https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg')
const switchValue = ref(false)
const loading = ref(false)

function generateFakeItems2(count) {
  const messages = []
  for (let i = 0; i < count; i++) {
    const role = i % 2 === 0 ? 'ai' : 'user'
    const placement = role === 'ai' ? 'left' : 'right'
    const key = i + 1
    messages.push({
      key,
      role,
      placement,
      noStyle: true, // 如果你不想用默认的气泡样式
    })
  }
  return messages
}

// 设置某个 item 的 loading
function setLoading(loading) {
  bubbleItems.value[bubbleItems.value.length - 1].loading = loading
  bubbleItems.value[bubbleItems.value.length - 2].loading = loading
}

// 示例调用
const bubbleItems3 = ref(generateFakeItems3(2))

function generateFakeItems3(count) {
  const messages = []
  for (let i = 0; i < count; i++) {
    const role = i % 2 === 0 ? 'ai' : 'user'
    const placement = role === 'ai' ? 'left' : 'right'
    const key = i + 1
    const content = role === 'ai' ? '时间无情碾过一切情感、记忆与文明，是比任何武器更彻底的毁灭者。' : `前进！前进！不择手段地前进`
    const loading = true
    const shape = 'corner'
    const variant = role === 'ai' ? 'filled' : 'outlined'
    const isMarkdown = false
    const typing = false
    const avatar = role === 'ai' ? 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg' : 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'

    messages.push({
      key,
      role,
      placement,
      content,
      loading,
      // shape,
      variant,
      isMarkdown,
      typing,
      avatar,
      // avatarSize: 32
    })
  }
  return messages
}

const bubbleListRef = ref()
const num = ref(0)

function addMessage() {
  const i = bubbleItems3.value.length
  const isUser = !!(i % 2)
  const content = isUser ? '前进！前进！不择手段地前进' : '时间无情碾过一切情感、记忆与文明，是比任何武器更彻底的毁灭者。'.repeat(5)
  const shape = 'corner'
  const variant = !isUser ? 'filled' : 'outlined'
  const placement = isUser ? 'right' : 'left'

  const typing = isUser ? false : { step: 5, suffix: '🍆', interval: 35 }
  const avatar = isUser ? 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg' : 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg'
  const obj = {
    key: i,
    role: isUser ? 'user' : 'ai',
    content,
    placement,
    typing,
    avatar,
    // shape,
    // variant,
    // avatarSize: 44,
    // isFog: !isUser
  }
  bubbleItems3.value.push(obj)

  // 每次添加 调用 滚动到底部 触发 自动滚动
  scrollBottom()
}

function clearMessage() {
  bubbleItems3.value = []
}

function scrollToTop() {
  bubbleListRef.value.scrollToTop()
}

function scrollBottom() {
  bubbleListRef.value.scrollToBottom()
}

function scrollToBubble() {
  bubbleListRef.value.scrollToBubble(num.value)
}

onMounted(() => {
  setTimeout(() => {
    bubbleItems3.value.map((item) => {
      item.loading = false
      return item
    })
  }, 3000)
})

const list4 = ref(generateFakeItems(0))

function generateFakeItems4(count) {
  const messages = []
  for (let i = 0; i < count; i++) {
    const role = i % 2 === 0 ? 'ai' : 'user'
    const placement = role === 'ai' ? 'left' : 'right'
    const key = i + 1
    const content = role === 'ai' ? '前进！前进！不择手段地前进！' : `当宇宙的基本法则都不可信，人类对理性的全部信念瞬间瓦解`
    const loading = false
    const shape = 'corner'
    const variant = role === 'ai' ? 'filled' : 'outlined'
    const isMarkdown = false
    const typing = role === 'ai'
    const avatar = role === 'ai' ? 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg' : 'https://fuss10.elemecdn.com/d/e6/c4d93a3805b3ce3f323f7974e6f78jpeg.jpeg'

    messages.push({
      key,
      role,
      placement,
      content,
      loading,
      shape,
      variant,
      isMarkdown,
      typing,
      avatar,
      avatarSize: 24,
    })
  }
  return messages
}

function onComplete(instance, index) {
  console.log('@complete', instance, index)
}

const triggerIndices = ref('only-last')

function changeTriggerIndices(type) {
  triggerIndices.value = type
  // 重新生成列表数据
  list4.value = []
  nextTick(() => {
    list4.value = generateFakeItems4(7)
  })
}
</script>

<style lang="scss" scoped></style>
