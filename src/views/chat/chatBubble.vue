<template>
  <el-card header="基本使用">
    <ec-chat-bubble content="毁灭你，与你有何相干？" shape="corner" />
  </el-card>
  <el-card header="头像&位置">
    <div style="display: flex; flex-direction: column; gap: 16px" shape="corner">
      <!-- Avatar and Placement 左侧 -->
      <ec-chat-bubble content="死亡是唯一一座永远亮着的灯塔，不管你向哪里航行，最终都得转向它指引的方向。" placement="left" :avatar="avatarAI" :avatar-size="32" shape="corner" />

      <!-- avatar-size 设置头像占位空间 -->
      <ec-chat-bubble content="弱小和无知不是生存的障碍，傲慢才是。" placement="left" :avatar-size="32" shape="corner" avatar-placeholder />

      <!-- Avatar and Placement 右侧 -->
      <ec-chat-bubble content="不要回答！不要回答！！不要回答！！！" placement="right" shape="corner">
        <template #avatar>
          <el-avatar :size="32" :src="avatarAI" />
        </template>
      </ec-chat-bubble>

      <!-- avatar-gap 属性控制 气泡与头像的距离 -->
      <ec-chat-bubble content="给岁月以文明，而不是给文明以岁月。" placement="right" shape="corner" />
    </div>
  </el-card>
  <el-card header="头像&底部">
    <ec-chat-bubble content="嗨！你好，现在开始你的旅程，有什么问题，可以问我哦~" variant="shadow" shape="corner">
      <template #avatar>
        <el-avatar :src="avatarAI" />
      </template>
      <template #header>
        <span>Element Plus X</span>
      </template>
      <template #footer>
        <div class="footer-container">
          <el-button type="info" icon="ri-refresh-line" size="small" circle />
          <el-button type="success" icon="ri-search-2-line" size="small" circle />
          <el-button type="warning" icon="ri-star-line" size="small" circle />
          <el-button color="#626aef" icon="ri-file-copy-line" size="small" circle />
        </div>
      </template>
    </ec-chat-bubble>
  </el-card>
  <el-card header="加载">
    <div style="display: flex; flex-direction: column; gap: 16px">
      <ec-chat-bubble content="毁灭你，与你有何相干？" :loading="loading" shape="corner" />

      <ec-chat-bubble content="毁灭你，与你有何相干？" :loading="loading" loading-text="正在思考中..." loading-animation="bars" shape="corner" />

      <ec-chat-bubble content="毁灭你，与你有何相干？" :loading="loading" shape="corner">
        <template #loading>
          <div>非常感谢您的使用，请稍后...</div>
        </template>
      </ec-chat-bubble>

      <div style="display: flex; align-items: center">
        <span>状态：</span>
        <el-switch v-model="loading" />
      </div>
    </div>
  </el-card>
  <el-card header="打字器配置">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <el-button style="width: fit-content" @click="changeContent(1)"> 设置 text </el-button>

      <ec-chat-bubble :content="content" shape="corner" :typing="{ step: 1, interval: 100, suffix: '💩' }">
        <template #avatar>
          <el-avatar :src="avatarAI" />
        </template>
      </ec-chat-bubble>
    </div>
  </el-card>
  <el-card header="开启MD渲染">
    <div style="display: flex; flex-direction: column; gap: 16px">
      <el-button style="width: fit-content" @click="changeContent(2)"> 设置 markdown </el-button>
      <ec-chat-bubble :content="content" typing is-markdown shape="corner">
        <template #avatar>
          <el-avatar :size="32" :src="avatarAI" />
        </template>
      </ec-chat-bubble>
    </div>
  </el-card>

  <el-card header="雾化效果">
    <div style="display: flex; flex-direction: column; gap: 16px">
      <div>
        <el-button style="width: fit-content" @click="changeContent(1)"> 雾化 text </el-button>
        <el-button style="width: fit-content" @click="changeContent(2)"> 雾化 markdown </el-button>
      </div>
      <ec-chat-bubble :content="content" :typing="{ step: 3, interval: 80, suffix: '💩' }" is-markdown shape="corner" :is-fog="{ bgColor: 'var(--el-color-primary)' }">
        <template #avatar>
          <el-avatar :size="32" :src="avatarAI" />
        </template>
      </ec-chat-bubble>
    </div>
  </el-card>
  <el-card header="自定义内容">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <ec-chat-bubble content="欢迎使用 Element-Plus。" typing :avatar="avatarAI" variant="text">
        <template #content> 时间无情碾过一切情感、记忆与文明，是比任何武器更彻底的毁灭者。 </template>
      </ec-chat-bubble>

      <ec-chat-bubble typing variant="text" avatar-placeholder>
        <template #header> 推荐内容 自定义气泡 </template>
        <template #content> 前进！前进！不择手段地前进！ </template>
      </ec-chat-bubble>

      <ec-chat-bubble typing variant="text" avatar-placeholder>
        <template #content> 把字刻在石头上。 </template>
      </ec-chat-bubble>

      <ec-chat-bubble typing variant="text" avatar-placeholder>
        <template #content> 沉默是安全的，暴露即死亡。 </template>
      </ec-chat-bubble>
    </div>
  </el-card>
  <el-card header="变体和形状">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div style="display: flex; gap: 12px; align-items: center">
        <ec-chat-bubble content="filled" variant="filled" />
        <ec-chat-bubble content="filled + round" variant="filled" shape="round" />
        <ec-chat-bubble content="filled + corner" variant="filled" shape="corner" />
      </div>

      <div style="display: flex; gap: 12px; align-items: center">
        <ec-chat-bubble content="borderless" variant="borderless" />
        <ec-chat-bubble content="borderless + round" variant="borderless" shape="round" />
        <ec-chat-bubble content="borderless + corner" variant="borderless" shape="corner" />
      </div>

      <div style="display: flex; gap: 12px; align-items: center">
        <ec-chat-bubble content="outlined" variant="outlined" />
        <ec-chat-bubble content="outlined + round" variant="outlined" shape="round" />
        <ec-chat-bubble content="outlined + corner" variant="outlined" shape="corner" />
      </div>

      <div style="display: flex; gap: 12px; align-items: center">
        <ec-chat-bubble content="shadow" variant="shadow" />
        <ec-chat-bubble content="shadow + round" variant="shadow" shape="round" />
        <ec-chat-bubble content="shadow + corner" variant="shadow" shape="corner" />
      </div>

      <div style="display: flex; gap: 12px; align-items: center">
        <ec-chat-bubble content="round" shape="round" />
      </div>

      <div style="display: flex; gap: 12px; align-items: center">
        <ec-chat-bubble content="corner" shape="corner" />
        <ec-chat-bubble content="placement right" shape="corner" placement="right" />
      </div>
    </div>
  </el-card>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import EcChatBubble from '@/components/EcChat/components/EcChatBubble/index.vue'
defineOptions({ name: 'chatBubble' })
const avatarAI = ref('https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg')
import mdMock from './mock.md?raw'
const num = ref(1)
const loading = ref(true)
const text = ref('文明的价值在于其质量（自由、尊严、创造力），而非单纯存续时间的长短。宁可短暂而辉煌，也不苟活于恐惧与奴役。')
const markdown = ref(`## 🔥Element-Plus \n 🥰 感谢使用 Element-Plus! \n - 列表项 1 \n - 列表项 2 **粗体文本** 和 *斜体文本* \n \`\`\`javascript \n console.log('Hello, world!'); \n \`\`\` \n`)

const content = ref(text.value)
const changeContent = (type) => {
  num.value++
  if (num.value > 3) {
    num.value = 1
  }
  if (type === 1) {
    content.value = text.value.repeat(num.value)
  } else {
    content.value = markdown.value.repeat(num.value)
  }
}
</script>

<style lang="scss" scoped></style>
