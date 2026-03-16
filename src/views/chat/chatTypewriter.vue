<template>
  <el-card header="基本使用">
    <ec-chat-typewriter content="content 属性设置打字器内容" />
  </el-card>
  <el-card header="MD渲染">
    <ec-chat-typewriter :content="markdownText" is-markdown />
  </el-card>
  <el-card header="开启打字效果">
    <div style="display: flex; flex-direction: column; gap: 8px">
      <div>
        <el-button style="width: fit-content" @click="setContents('text')">
          重置文本
        </el-button>
        <el-button style="width: fit-content" type="primary" @click="setContents('markdown')">
          重置 markdown
        </el-button>
      </div>
      <div style="display: flex; gap: 8px; flex-direction: column">
        <ec-chat-typewriter :content="content" :typing="isTyping" />
        <hr>
        <ec-chat-typewriter :content="content1" :typing="{ step: 2, interval: 100, suffix: '💩' }" />
        <hr>
        <ec-chat-typewriter :content="markdownText" :typing="isTyping" is-markdown />
      </div>
    </div>
  </el-card>
  <el-card header="打字器雾化效果">
    <div style="display: flex; flex-direction: column; gap: 10px">
      <div style="display: flex; gap: 10px">
        <el-button @click="setContent(1); isMarkdown = true">
          雾化 Markdown
        </el-button>
        <el-button @click="setContent(2); isMarkdown = false">
          雾化 文本
        </el-button>
      </div>

      <ec-chat-typewriter :content="content" :is-markdown="isMarkdown"
        :is-fog="{ bgColor: 'var(--el-color-primary)', width: '160px' }" typing />
    </div>
  </el-card>
  <el-card header="控制打字器">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div style="display: flex">
        <el-button v-if="isTypingValue" type="warning" @click="onInterrupt">
          暂停
        </el-button>
        <el-button v-if="!isTypingValue && progressValue !== 0 && progressValue !== 100" type="success"
          @click="typerRef?.continue()">
          继续
        </el-button>
        <el-button v-if="
          !isTypingValue && (progressValue === 0 || progressValue === 100)
        " type="primary" @click="typerRef?.restart()">
          重播
        </el-button>
        <el-button type="danger" @click="onDestroy">
          销毁
        </el-button>
      </div>

      <el-progress v-if="progressValue > 0 && progressValue !== 100" :duration="0" :percentage="progressValue" />
      <el-progress v-if="progressValue === 100" :percentage="100" status="success" />

      <!-- 这里展示了如果是 markdown 的话，typing.suffix 会被忽略 -->
      <ec-chat-typewriter ref="typerRef" :content="markdownContent" :typing="{ suffix: '💩', interval: 40 }"
        :is-markdown="true" @start="onStart" @writing="onWriting" @finish="onFinish" />
    </div>
  </el-card>

</template>
<script setup>
import { ref, onMounted, unref } from 'vue'
import EcChatTypewriter from '@/components/EcChat/components/EcChatTypewriter/index.vue'
defineOptions({ name: 'chatTypewriter' })
const markdownText = ref('');
const isMarkdown = ref(true)
onMounted(() => {
  setContents('text');
  setContents('markdown');
});

const isTyping = ref(true);
const content = ref('');
const content1 = ref('');


function setContents(type) {
  if (type === 'text') {
    content.value = '';
    content1.value = '';
    setTimeout(() => {
      content.value = 'typing 属性开启打字效果';
      content1.value =
        'typing 属性也可以是对象，来控制打每次打字吐字、每次打字间隔、和打字器后缀';
    }, 800);
  }
  else if (type === 'markdown') {
    markdownText.value = '';
    setTimeout(() => {
      markdownText.value = `#### 标题 \n 这是一个 Markdown 示例。\n - 列表项 1 \n - 列表项 2 **粗体文本** 和 *斜体文本* \n \`\`\`javascript \n console.log('Hello, world!'); \n \`\`\``;
    }, 800);
  }
}

function setContent(type) {
  content.value = '';
  setTimeout(() => {
    content.value =
      type === 1
        ? `#### 标题 \n 这是一个 Markdown 示例。\n - 列表项 1 \n - 列表项 2 **粗体文本** 和 *斜体文本* \n \`\`\`javascript \n console.log('Hello, world!'); \n \`\`\``
        : '宇宙就是一座黑暗森林，每个文明都是带枪的猎人。'.repeat(5);
  }, 800);
}

const markdownContent = ref(`## 逃亡主义的终极实践 \n 前进！前进！不择手段地前进！ \n - 列表项 1 \n - 列表项 2 **粗体文本** 和 *斜体文本* \n \`\`\`javascript \n console.log('Hello, world!'); \n \`\`\` \n`);

const isTypingValue = ref(false);
const progressValue = ref(0);
const typerRef = ref();
// 开始打字的监听方法
function onStart(instance) {
  console.log('开始打字：组件 ref 实例', unref(instance));
  isTypingValue.value = true;
}
// 打字中，进度监听方法
function onWriting(instance) {
  const progress = instance.progress.value;
  // 避免打印打多次 onWriting 事件 😂
  if (progress > 90 && progress < 100) {
    // 可以直接获取打字进度，可以根据打字进度，设置更炫酷的样式
    // console.log('Writing', `${progress}%`)
    console.log(
      '打字中 isTyping:',
      instance.typing.value,
      'progress:',
      progress
    );
  }

  if (~~progress === 80) {
    console.log(
      '打字中 progress 为 80% 时候的内容',
      instance.renderedContent.value
    );
  }
  isTypingValue.value = true;
  progressValue.value = ~~progress; // 通过运算符~~取整 💩
}
// 监听打字结束事件
function onFinish(instance) {
  isTypingValue.value = false;
  console.log(
    '打字结束 isTyping',
    instance.typing.value,
    'progress:',
    instance.progress.value
  );
}
// 组件实例方法，控制 暂停打字
function onInterrupt() {
  typerRef.value.interrupt();
  isTypingValue.value = false;
}
function onDestroy() {
  typerRef.value.destroy();
  isTypingValue.value = false;
  progressValue.value = 0;
}

</script>

<style lang="scss" scoped></style>
