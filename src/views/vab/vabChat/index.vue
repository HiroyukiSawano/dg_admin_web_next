<template>
  <div class="el-page">
    <el-card :header="$t('ec.menu.name.vabChat')">
      <template #header>
        <div class="el-card__title">{{ $t('ec.menu.name.vabChat') }}</div>
        <div class="el-card__form">
          <el-form inline>
            <el-form-item label="布局形式"><el-switch v-model="settings.layout" active-value="both" inactive-value="single" /></el-form-item>
            <el-form-item label="显示头像" class="hidden-xs-only"><el-switch v-model="settings.avatar" /></el-form-item>
          </el-form>
        </div>
      </template>
      <EcChat :layout="settings.layout">
        <EcChatItem
          v-for="item, index in chats"
          :id="item.id"
          :key="index"
          :avatar="settings.avatar ? item.avatar : null"
          :role="item.role"
          :reason="item.reason"
          :content="item.content"
          :index="index"
          :loading="isItemLoading(index)"
          :reason-loading="isReasonLoading(index)"
          :stream-loading="isStreamLoading(index)"
        >
          <template #content>
            <EcChatReason v-if="item.reason" :loading="isReasonLoading(index)" :role="item.role" :content="item.reason" />
            <EcChatText :content="item.content" :role="item.role" :loading="isStreamLoading(index)" />
            <template v-if="item.role === 'user'">
            </template>
            <template v-if="item.role === 'assistant'">
              <el-divider v-if="item.packages.key" />
              <template v-if="item.packages.key === 'Cascader'">
                <el-cascader v-model="item.packages.option.defaultValue" :placeholder="item.packages.option.placeholder" clearable filterable :options="item.packages.option.dataset.source" class="width-100" />
              </template>
              <template v-if="item.packages.key === 'Button'">
                <div class="el-button-list" style="margin: -6px;">
                  <el-button style="margin: 6px;" :type="button_item.type" :plain="button_item.plain" v-for="button_item, button_index in item.packages.option.dataset.source" :key="button_index">
                    {{ button_item.name }}
                  </el-button>
                </div>
              </template>
            </template>
          </template>
          <template #actions>
            <EcChatAction v-if="!isStreamLoading(index) && index > 0" :content="item.content" @operation="(operation) => chatOperation(operation, item)" />
          </template>
        </EcChatItem>
        <template #footer>
          <div class="ec-chat__tags">
            <el-tag v-for="tag_item, tag_index in tags" :key="tag_index" @click="handleTagClick(tag_item)">{{ tag_item.name }}</el-tag>
          </div>
          <EcChatSender v-model="textual" :stop-disabled="streaming" @send="chatSend" @stop="chatStop" placeholder="嗨，我是智能问数，可以回答经济、教育、交通、民生等多个行业的数据问题～～">
            <template #prefix>
              <el-dropdown>
                <el-button icon="ri-gemini-fill">深度思考</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>海若思考</el-dropdown-item>
                    <el-dropdown-item>混元思考</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-checkbox v-model="onlineseek" border class="hidden-sm-and-down">
                <i class="ri-flashlight-fill"></i>
                <span>联网思考</span>
              </el-checkbox>
            </template>
            <template #suffix>
              <el-button v-if="listening" class="is-rippling" icon="ri-stop-fill" circle @click="chatRecordStop" />
              <el-button v-if="!listening" icon="ri-mic-fill" circle @click="chatRecordStart" />
              <el-button icon="ri-attachment-2" circle @click="$refs.btnUploadRef && $refs.btnUploadRef.click()" />
              <el-upload style="display: none;" ref="materialUploadRef" action="#" :on-change="handleUploadChange" :show-file-list="false" list-type="picture" :auto-upload="false">
                <template #default><i class="ri-add-line" ref="btnUploadRef"></i></template>
              </el-upload>
            </template>
          </EcChatSender>
        </template>
      </EcChat>
    </el-card>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { set, find, random, findIndex, merge } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/modules/systemStore'
import { v4 as uuidv4 } from 'uuid'
import { regionData } from 'element-china-area-data'
import { useSpeechRecognition } from '@vueuse/core'
import EcChat from '@/components/EcChat/EcChat'

import EcChatItem from '@/components/EcChat/EcChatItem'
import EcChatReason from '@/components/EcChat/EcChatReason'
import EcChatText from '@/components/EcChat/EcChatText'
// import EcChatInput from '@/components/EcChat/EcChatInput'
import EcChatAction from '@/components/EcChat/EcChatAction'
import EcChatSender from '@/components/EcChat/EcChatSender'
import { MockSSEResponse } from '@/components/EcChat/mock/sseRequestAll'
const { dark } = storeToRefs(useSystemStore())
import mdMock from './mock.md?raw'
const settings = ref({
  avatar: true,
  layout: 'both'
})
const mocksse = ref(null)
const tags = ref([
  { name: '级联选择器', key: 'Cascader' },
  { name: '图表', key: 'Chart' },
  { name: '表格', key: 'Table' },
  { name: '按钮群', key: 'Button' },
  { name: '列表', key: 'List' },
  { name: '卡片群', key: 'Card' },
  { name: '标记语言', key: 'Markdown' },
])
const answers = ref([
  {
    reason: `用户可能需要历史数据来观察趋势，比如过去10年或20年的GDP变化。这时候，我可以整理一个时间序列的数据表，列出每年的GDP数值，单位是人民币或美元，需要统一单位，并注明来源和年份。同时，可能需要调整通货膨胀因素，但一般GDP统计是名义GDP或实际GDP增长，需要说明清楚。用户可能需要历史数据来观察趋势，比如过去10年或20年的GDP变化。这时候，我可以整理一个时间序列的数据表，列出每年的GDP数值，单位是人民币或美元，需要统一单位，并注明来源和年份。同时，可能需要调整通货膨胀因素，但一般GDP统计是名义GDP或实际GDP增长，需要说明清楚。`,
    content: mdMock,
    packages: {
    },
  },
  {
    reason: `一线城市凭借强大的产业基础、科技创新能力和高端人才聚集，持续推动经济增长。具体数字需参考官方最新发布数据，以确保准确性。如需更深入分析或最新数据，建议访问相关统计局官网或查阅权威经济报告。一线城市凭借强大的产业基础、科技创新能力和高端人才聚集，持续推动经济增长。具体数字需参考官方最新发布数据，以确保准确性。如需更深入分析或最新数据，建议访问相关统计局官网或查阅权威经济报告。一线城市凭借强大的产业基础、科技创新能力和高端人才聚集，持续推动经济增长。具体数字需参考官方最新发布数据，以确保准确性。如需更深入分析或最新数据，建议访问相关统计局官网或查阅权威经济报告。一线城市凭借强大的产业基础、科技创新能力和高端人才聚集，持续推动经济增长。具体数字需参考官方最新发布数据，以确保准确性。如需更深入分析或最新数据，建议访问相关统计局官网或查阅权威经济报告。`,
    content: `广东处在南海航运枢纽地图位置上，是中国外贸外资大省 [272]、民营经济大省 [272]、全国制造业大省 [271]和农产品进出口大省，区域创新能力居全国之首 [152] [270]，但区域发展不平衡也是广东存在的问题 [282-283]。广东也是中国生育第一大省 [267]，外来人口数量居全国之首 [268]。广东形成了独具特色的岭南文化，开放包容，敢为人先的人文特质。 [76]2024年，广东省实现地区生产总值141633.81亿元，比上年增长3.5%。`,
    packages: {
      key: 'Chart',
      option: {
        placeholder: '请选择处理方式',
        defaultValue: [],
        dataset: {
          dimensions: ['国家', '2025', '2024'],
          source: [
            ['美国', random(8, 88), random(8, 88)],
            ['中国', random(8, 88), random(8, 88)],
            ['德国', random(8, 88), random(8, 88)],
            ['日本', random(8, 88), random(8, 88)],
            ['印度', random(8, 88), random(8, 88)],
            ['英国', random(8, 88), random(8, 88)],
            ['法国', random(8, 88), random(8, 88)],
            ['意大利', random(8, 88), random(8, 88)],
            ['巴西', random(8, 88), random(8, 88)],
          ]
        }
      }
    },
  },
  {
    reason: `为了便于汇总各国的统计资料，进行对比，联合国经济和社会事务统计局曾制定了一个《全部经济活动国际标准行业分类》（International Standard Industrial Classification of All Economic Activities），简称《国际标准行业分类》，建议各国采用。它把国民经济划分为10个门类，对每个门类再划分大类、中类、小类。`,
    content: `全面的、精确的、统一的经济活动统计对经济理论的探讨和整个国民经济问题的研究，统计概览对政府制定经济政策和进行国民经济的宏观管理都是十分必要的。国民经济管理的经济统计的基础就是产业分类的标准化，即进行标准产业分类。`,
    packages: {
      key: 'Cascader',
      option: {
        placeholder: '请选择当前区划',
        defaultValue: [],
        dataset: {
          dimensions: null,
          source: regionData
        }
      }
    },
  },
  {
    reason: `为了便于汇总各国的统计资料，进行对比，联合国经济和社会事务统计局曾制定了一个《全部经济活动国际标准行业分类》（International Standard Industrial Classification of All Economic Activities），简称《国际标准行业分类》，建议各国采用。它把国民经济划分为10个门类，对每个门类再划分大类、中类、小类。`,
    content: `全面的、精确的、统一的经济活动统计对经济理论的探讨和整个国民经济问题的研究，统计概览对政府制定经济政策和进行国民经济的宏观管理都是十分必要的。国民经济管理的经济统计的基础就是产业分类的标准化，即进行标准产业分类。`,
    packages: {
      key: 'Button',
      option: {
        placeholder: '',
        defaultValue: null,
        dataset: {
          dimensions: null,
          source: [
            { name: 'Default', type: 'default', plain: false },
            { name: 'Primary', type: 'primary', plain: false },
            { name: 'Success', type: 'success', plain: false },
            { name: 'Info', type: 'info', plain: false },
            { name: 'Warning', type: 'warning', plain: false },
            { name: 'Danger', type: 'danger', plain: false },
            { name: 'Default', type: 'default', plain: true },
            { name: 'Primary', type: 'primary', plain: true },
            { name: 'Success', type: 'success', plain: true },
            { name: 'Info', type: 'info', plain: true },
            { name: 'Warning', type: 'warning', plain: true },
            { name: 'Danger', type: 'danger', plain: true },
          ]
        }
      }
    },
  },
])
const chats = ref([])
onMounted(() => {
  messageSendRobot(
    {
      id: `id_assistant_${uuidv4()}`,
      role: 'assistant',
      reason: ``,
      avatar: new URL(`@/assets/images/ai.gif`, import.meta.url).href,
      content: `你好，我是智能机器人，是你工作的智能助手～～`
    }
  )
})

const files = ref([])
const streaming = ref(false)
const loading = ref(false)
const texting = ref(false)
const reasoning = ref(false)
const model = ref('default')
const deepseek = ref(true)
const onlineseek = ref(true)
const textual = ref('')
const isTextLoading = (index) => {
  return index === chats.value.length - 1 && texting.value
}
const isItemLoading = (index) => {
  return index === chats.value.length - 1 && loading.value
}

const isStreamLoading = (index) => {
  return index === chats.value.length - 1 && streaming.value
}
const isReasonLoading = (index) => {
  return index === chats.value.length - 1 && reasoning.value
}
const messageSend = async (data) => {
  const id = `id_${data.role}_${uuidv4()}`
  const chat = merge({ id, ...data })
  chats.value.push(chat)
}
const messageSendUser = (message) => {
  const data = { role: 'user', ...message, avatar: new URL('@/assets/images/common/avatar.png', import.meta.url).href, packages: {} }
  if (files.value && files.value.length > 0) {
    set(data, 'packages.component', 'attachment')
    set(data, 'packages.dataset.source', [...files.value])
    files.value = []
  }
  messageSend(data)
}
const messageSendRobot = async (message, refresh = false, index) => {
  loading.value = true
  reasoning.value = true
  streaming.value = true

  const id = `id_assistant_${uuidv4()}`
  const thinking = { id, role: 'assistant', reason: '', content: '思考中...', avatar: new URL(`@/assets/images/common/assistant.apng`, import.meta.url).href, packages: {} }

  if (refresh && index) {
    chats.value.splice(index, 1, thinking)
  } else {
    messageSend(thinking)
  }

  await new Promise(resolve => setTimeout(resolve, 1000))
  const chating = find(chats.value, ['id', id])
  chating.reason = ''
  chating.content = ''
  loading.value = false
  return new Promise((resolve, reject) => {
    mocksse.value = new MockSSEResponse({ reason: '', ...message }, 20)
    MockSSEFetchData(() => mocksse.value.getResponse(), {
      async success(res) {
        chating.reason += res.delta.reason
        chating.content += res.delta.content
        if(res.status === 1) {
          reasoning.value = false
        }
      },
      complete(ok, msg, data) {
        if (!ok) merge(chating, { role: 'error', reason: ``, content: msg })
        const { packages } = data
        chating.avatar = new URL('@/assets/images/assistant.png', import.meta.url).href
        merge(chating, { packages })
        loading.value = false
        streaming.value = false
        reasoning.value = false

        resolve({ ok, msg, data })
      }
    })
  })
}
const MockSSEFetchData = async (fetchFn, options) => {
  const { response, payload } = await fetchFn()
  const { success, fail, complete } = options
  if (!response.ok) {
    if (complete) complete(false, response.statusText)
    if (fail) fail()
    return
  }
  const reader = response?.body?.getReader()
  const decoder = new TextDecoder()
  if (!reader) return
  reader.read().then(function processText({ done, value }) {
    if (done) {
      if (complete) complete(true, 'success', payload)
      return
    }
    const chunk = decoder.decode(value, { stream: true })
    const buffers = chunk.toString().split(/\r?\n/)
    const data = JSON.parse(buffers)
    success(data)
    reader.read().then(processText)
  })
}

const chatStop = () => {
  if (mocksse.value) {
    mocksse.value.controller.close()
    loading.value = false
    streaming.value = false
  }
}
const chatSend = async (content) => {
  await messageSendUser({ content })
  // 测试数据
  const answer = answers.value[0]
  await messageSendRobot(answer)
}
 const chatOperation = async (type, row) => {
  if (type === 'replay') {
    const index = findIndex(chats.value, ['id', row.id])
    await messageSendRobot({ content: row.content }, true, index)
  }
}
const chatClear = () => {
  chats.value = []
}

// const speecher = useSpeechRecognition({
//   lang: 'zh-CN',
//   interimResults: true,
//   continuous: true,
// })
// const { isSupported, isListening } = speecher
const listening = ref(false)
const chatRecordStart = async () => {
  listening.value = true
}
const chatRecordStop = async () => {
  listening.value = false
}
const handleTagClick = async ({ name, key}) => {
  await messageSendUser({ content: name })
  const answer = answers.value.find(item => item.packages.key === key)
  if(!answer) return
  await messageSendRobot(answer)
}
const handleUploadChange = (file, files) => {

}
const handleUploadRemove = (file) => {

}
const handleUploadDownload = (file) => {
}
const handleUploadPreview = (file) => {
  if (file.type === 'image') {}
  if (file.type === 'file') {}
}
defineExpose({ chatSend, chatClear })
</script>

<style lang="scss" scoped>
.el-page {
  height: 100%;
}
:deep(.el-card) {
  height: 100%;
}
:deep(.ec-chat) {
  .ec-chat__avatar {

  }
  .ec-chat__tags {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin: -6px;
    padding-bottom: 12px;
    .el-tag {
      margin: 6px;
      cursor: pointer;
    }
  }
  .ec-chat__item.ec-chat__item--user .ec-chat__bubble {
    background: linear-gradient(135deg, var(--el-color-primary-light-3), var(--el-color-primary));
  }
  .ec-chat__item.ec-chat__item--assistant {
    .el-avatar {
      --el-avatar-bg-color: var(--el-color-primary-dark-9);
    }
  }

  .ec-chat__sender {
    .ec-chat__sender__mode {
      .el-checkbox {
        padding: 0 16px;
        .el-checkbox__input {
          display: none;
        }
        .el-checkbox__label {
          padding: 0;
          i+span {
            margin-left: 6px;
          }
        }
      }
    }
    .ec-chat__sender__toolbar {
      .el-button.el-button--default {
        &.is-rippling {
          position: relative;
          --el-button-text-color: var(--el-color-primary);
          // --el-button-border-color: var(--el-color-primary);
          &::after {
            content: "";
            position: absolute;
            width: 100%;
            height: 100%;
            border-radius: 100%;
            background-color: var(--el-color-primary);
            animation: Rippling 1.5s infinite
          }
        }
      }
    }
  }
}
@keyframes Rippling {
  0%{
    opacity: 0;
    transform: scale(1);
  }
  50%{
    opacity: 0.15;
    transform: scale(1.25)
  }
  100%{
    opacity: 0;
    transform: scale(1);
  }
}
</style>
