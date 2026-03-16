<template>
  <el-card header="基本使用">
    <ec-chat-editor-sender placeholder="前进！前进！不择手段地前进！" auto-focus />
  </el-card>
  <el-card header="状态属性">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <ec-chat-editor-sender loading placeholder="加载中..." @submit="handleSubmit" />
      <ec-chat-editor-sender placeholder="禁用" disabled @submit="handleSubmit" />
      <ec-chat-editor-sender clearable @submit="handleSubmit" />
    </div>
  </el-card>
  <el-card header="垂直样式">
    <div style="display: flex; flex-direction: column; gap: 16px">
      <ec-chat-editor-sender variant="updown" clearable />

      <ec-chat-editor-sender variant="updown">
        <template #prefix>
          <el-button icon="ri-sparkling-fill">深度思考</el-button>
          <el-button icon="ri-flashlight-fill">联网思考</el-button>
        </template>

        <template #actions>
          <el-button type="primary" circle icon="ri-cursor-fill" />
        </template>
      </ec-chat-editor-sender>
    </div>
  </el-card>
  <el-card header="插槽">
    <ec-chat-editor-sender>
      <template #prefix>
        <el-button icon="ri-sparkling-fill" text bg circle />
        <el-button icon="ri-flashlight-fill" text bg circle />
      </template>

      <template #actions>
        <el-button type="primary" text bg circle icon="ri-mic-fill" />
        <el-button type="primary" circle icon="ri-arrow-up-line" />
      </template>
    </ec-chat-editor-sender>
  </el-card>
  <el-card header="自定义头部">
    <ec-chat-editor-sender ref="senderRef" :header-animation-timer="500">
      <template v-if="showHeaderFlog" #header>
        <div style="padding: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <el-text >黑暗森林</el-text>
            <el-button @click.stop="closeHeader">关闭头部</el-button>
          </div>
          <div>宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼：他必须小心，因为林中到处都有与他一样潜行的猎人，如果他发现了别的生命，不管是不是猎人，不管是天使还是魔鬼，不管是娇嫩的婴儿还是年迈的女神，都不会有任何犹豫，开枪消灭他。</div>
        </div>
      </template>
      <template #prefix>
        <el-button type="primary" circle @click="openCloseHeader" icon="ri-apps-2-add-fill" />
      </template>
    </ec-chat-editor-sender>
  </el-card>
  <el-card header="自定义底部">
    <div style="display: flex; flex-direction: column; gap: 16px">
      <ec-chat-editor-sender clearable>
        <template #prefix>
          <el-button icon="ri-sparkling-fill" text bg circle />
        </template>

        <template #actions>
          <el-button type="primary" circle icon="ri-arrow-up-line" />
        </template>

        <!-- 自定义 底部插槽 -->
        <template #footer>
          <div style="padding: 16px;">默认变体 自定义底部</div>
        </template>
      </ec-chat-editor-sender>

      <ec-chat-editor-sender variant="updown" clearable>
        <template #prefix>
          <el-button icon="ri-sparkling-fill" text bg circle />
        </template>

        <template #actions>
          <el-button type="primary" circle icon="ri-arrow-up-line" />
        </template>

        <template #footer>
          <div style="padding: 16px;">updown 变体 自定义底部</div>
        </template>
      </ec-chat-editor-sender>
    </div>
  </el-card>
  <el-card header="提交方式">
    <div style="display: flex; flex-direction: column; gap: 16px">
      <ec-chat-editor-sender
        placeholder="请使用 Shift + Enter 提交"
        submit-type="shiftEnter"
        :loading="loading"
        @submit="handleSubmit"
      />
    </div>
  </el-card>
  <el-card header="插入text内容">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div><el-button @click="senderRefText?.setText('前进！前进！不择手段地前进！')">插入text内容</el-button></div>
      <ec-chat-editor-sender ref="senderRefText" clearable />
    </div>
  </el-card>
  <el-card header="插入html内容">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div><el-button @click="setHtml">插入 html 内容</el-button></div>
      <ec-chat-editor-sender ref="senderRefHtml" clearable />
    </div>
  </el-card>
  <el-card header="插入选择标签">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div style="display: flex">
        <el-button @click="senderRefInTag?.setSelect('style', '1')">插入 风格选择标签</el-button>
        <el-button @click="senderRefInTag?.setSelect('font', '2')">插入 字体选择标签</el-button>
        <el-button id="dialogBtn" @click="openSelectDialog">外部调用选择标签弹窗</el-button>
      </div>
      <ec-chat-editor-sender ref="senderRefInTag" :select-config="selectTagsArr" clearable />
    </div>
  </el-card>
  <el-card header="插入输入标签">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div style="display: flex">
        <el-button @click="senderRefsstag?.setInput('job', '请输入你的职业')">插入 不带默认值的输入标签</el-button>
        <el-button @click="senderRefsstag?.setInput('jop', '请输入你的职业', '开发者')">插入 带默认值的输入标签</el-button>
      </div>
      <ec-chat-editor-sender ref="senderRefsstag" clearable />
    </div>
  </el-card>
  <el-card header="插入用户标签">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div style="display: flex">
        <el-button @click="senderRefusr?.setMention('2')">插入用户标签</el-button>
      </div>
      <ec-chat-editor-sender ref="senderRefusr" :mention-config="{ options: userTagsArr }" placeholder="@ 符号触发用户选择" clearable/>
    </div>
  </el-card>
  <el-card header="插入自定义标签">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div style="display: flex">
        <el-button @click="senderRefcom?.setTrigger('#', '2')">插入 自定义话题标签</el-button>
      </div>
      <ec-chat-editor-sender ref="senderRefcom" :trigger-config="customTagsArr" placeholder="# 符号触话题选择，/ 符号触发文件选择" clearable />
    </div>
  </el-card>
  <el-card header="前置提示标签">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div style="display: flex">
        <el-button @click="senderRefqz?.showTip({text: '图像生成',dialogText: '点击退出技能'})">
          打开前置提示标签
        </el-button>
        <el-button dark type="primary" plain @click="senderRefqz?.closeTip()">
          关闭前置提示标签
        </el-button>
      </div>

      <ec-chat-editor-sender ref="senderRefqz" clearable />
    </div>
  </el-card>
  <el-card header="混合标签覆盖写入">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div style="display: flex">
        <el-button @click="setMixTags">混合标签覆盖写入</el-button>
      </div>

      <ec-chat-editor-sender ref="senderRefmx" clearable :select-config="selectTagsArr2x" />
    </div>
  </el-card>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import EcChatEditorSender from '@/components/EcChat/components/EcChatEditorSender/index.vue'
defineOptions({ name: 'chatEditorSender' })
const senderRef = ref(null);
const senderRefText = ref(null);
const senderRefHtml = ref(null);
const showHeaderFlog = ref(true);
const loading = ref(false);
const openCloseHeader = () => {
  showHeaderFlog.value = !showHeaderFlog.value;
}

const closeHeader = () => {
  showHeaderFlog.value = false;
}
const handleSubmit = (value) => {
  ElMessage.info(`发送中`);
  loading.value = true;
  setTimeout(() => {
    // 可以在控制台 查看打印结果
    console.log('submit-> value：', value);
    loading.value = false;
    ElMessage.success(`发送成功`);
  }, 2000);
}
const setHtml = () => {
  senderRefHtml.value?.setHtml(
    `<img style="height: 32px;" src="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg" alt="">`
  );
}
const senderRefInTag = ref(null);
const selectTagsArr = ref([
  {
    dialogTitle: '风格选择',
    key: 'style',
    options: [
      {
        id: '1',
        name: '人像摄影',
        preview: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg'
      },
      {
        id: '2',
        name: '电影写真',
        preview: 'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg'
      },
      {
        id: '3',
        name: '中国风',
        preview: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
      }
    ]
  },
  {
    dialogTitle: '字体选择',
    key: 'font',
    options: [
      { id: '1', name: '宋体' },
      { id: '2', name: '微软雅黑' },
      { id: '3', name: '楷体' }
    ]
  }
]);

const openSelectDialog = () => {
  senderRefInTag.value?.showSelect('font', document.getElementById('dialogBtn'));
}
const senderRefsstag = ref(null);
const senderRefusr = ref(null);
const userTagsArr = ref([
  { id: '5', name: '张三丰', pinyin: 'zhang san feng' },
  { id: '1', name: '张三', pinyin: 'zhang san' },
  { id: '2', name: '李四', pinyin: 'li si' },
  { id: '3', name: '王五', pinyin: 'wang wu' },
  {
    id: '4',
    name: 'Hejiayue',
    pinyin: 'he jia yue',
    avatar: 'https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg'
  }
]);
const senderRefqz = ref(null);
const senderRefcom = ref(null);
const customTagsArr = ref([
  {
    dialogTitle: '话题标签',
    key: '#',
    options: [
      { id: '1', name: '话题1' },
      { id: '2', name: '话题2' },
      { id: '3', name: '话题3' }
    ]
  },
  {
    dialogTitle: '文件标签',
    key: '/',
    options: [
      { id: '1', name: '文件1' },
      { id: '2', name: '文件2' },
      { id: '3', name: '文件3' }
    ]
  }
]);
const senderRefmx = ref(null);
const selectTagsArr2x = ref([
  {
    dialogTitle: '风格选择',
    key: 'style',
    options: [
      {
        id: '1',
        name: '人像摄影',
        preview: 'https://element.eleme.cn/#/zh-CN/component/image'
      },
      {
        id: '2',
        name: '电影写真',
        preview: 'https://fuss10.elemecdn.com/9/bb/e27858e973f5d7d3904835f46abbdjpeg.jpeg'
      },
      {
        id: '3',
        name: '中国风',
        preview: 'https://fuss10.elemecdn.com/2/11/6535bcfb26e4c79b48ddde44f4b6fjpeg.jpeg'
      }
    ]
  },
  {
    dialogTitle: '比例选择',
    key: 'ratio',
    options: [
      {
        id: '1',
        name: '4:5',
      },
      {
        id: '2',
        name: '9:16',
      },
      {
        id: '3',
        name: '12:16',
      }
    ]
  }
]);

const setMixTags = () => {
  senderRefmx.value?.setChatNode([
    [
        {
            "type": "Write",
            "text": "用户"
        },
        {
            "type": "Mention",
            "id": "1",
            "name": "王国熙"
        },
        {
            "type": "Write",
            "text": "选择了"
        },
        {
            "type": "Trigger",
            "id": "draw",
            "name": "绘图",
            "key": "/"
        },
        {
            "type": "Write",
            "text": "指令"
        }
    ],
    [
        {
            "type": "Write",
            "text": "请根据以下文案内容绘制一张图片"
        },
        {
            "type": "Input",
            "placeholder": "文案内容",
            "text": "太阳由那扇大玻璃窗透入屋内，先是落在墙上，接着映照到桌上，最终，也照到了我那可爱的小床上来咯",
            "key": "content"
        },
        {
            "type": "Write",
            "text": "。风格是"
        },
        {
            "type": "Select",
            "id": "3",
            "name": "中国风",
            "key": "style"
        },
        {
            "type": "Write",
            "text": "，画面内是"
        },
        {
            "type": "Input",
            "placeholder": "画面内容",
            "text": "光从大落地窗照进房间内，照在墙面、地板、桌子、床上",
            "key": "content"
        },
        {
            "type": "Write",
            "text": "。画面主体要突出，画面的色彩搭配和整体氛围要贴合文案所围绕的主题，画面比例是"
        },
        {
            "type": "Select",
            "id": "2",
            "name": "9:16",
            "key": "ratio"
        },
        {
            "type": "Write",
            "text": "。"
        }
    ],
    [
        {
            "type": "Write",
            "text": "输出的图片尺寸大小"
        },
        {
            "type": "Input",
            "placeholder": "512x512",
            "text": "",
            "key": "size"
        },
        {
            "type": "Write",
            "text": ""
        }
    ],
    [
        {
            "type": "Write",
            "text": "输出的图片格式"
        },
        {
            "type": "Input",
            "placeholder": "png",
            "text": "",
            "key": "format"
        },
        {
            "type": "Write",
            "text": ""
        }
    ],
    [
        {
            "type": "Write",
            "text": "最后再顺便帮我解释一下这个"
        },
        {
            "type": "Custom",
            "html": "<img width=\"auto\" height=\"32px\" style=\"vertical-align: bottom;\" src=\"https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg\" alt=\"\">"
        },
        {
            "type": "Write",
            "text": "的表情所表达的意思。"
        }
    ]
]);
}
</script>

<style lang="scss" scoped>

</style>
