<template>
  <el-card header="基础用法">
    <ec-chat-mention-sender placeholder="前进！前进！不择手段地前进！" />
  </el-card>
  <el-card header="双向绑定">
    <div>
      <el-button type="primary" style="width: fit-content" @click="senderRefder.clear()"> 使用组件实例清空 </el-button>
      <el-button type="primary" style="width: fit-content" :disabled="!senderRefder" @click="senderRefder.submit()"> 使用组件实例提交 </el-button>
      <el-button type="primary" style="width: fit-content" @click="senderRefder.cancel()"> 使用组件实例取消 </el-button>
    </div>
    <br />
    <ec-chat-mention-sender ref="senderRefder" v-model="senderValue" :submit-btn-disabled="submitBtnDisabled" :loading="senderLoading" clearable @submit="handleSubmit" @cancel="handleCancel" />
  </el-card>
  <el-card header="提交按钮禁用状态">
    <p>这是内置的禁用逻辑：</p>
    <ec-chat-mention-sender ref="senderRef" v-model="senderValue" :loading="senderLoading" clearable @submit="handleSubmit" @cancel="handleCancel" />

    <p>自定义禁用逻辑：</p>
    <ec-chat-mention-sender ref="senderRef" v-model="senderValue" :submit-btn-disabled="submitBtnDisabled" :loading="senderLoading" clearable @submit="handleSubmit" @cancel="handleCancel" />
  </el-card>
  <el-card header="自定义行数">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <ec-chat-mention-sender :auto-size="{ minRows: 2, maxRows: 5 }" />
      <ec-chat-mention-sender v-model="longerValue" />
    </div>
  </el-card>
  <el-card header="输入框状态">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <ec-chat-mention-sender loading placeholder="加载中..." @submit="handleSubmit" />
      <ec-chat-mention-sender v-model="senderReadOnlyValue" read-only @submit="handleSubmit" />
      <ec-chat-mention-sender value="禁用：前进！前进！不择手段地前进" disabled @submit="handleSubmit" />
      <ec-chat-mention-sender v-model="senderClearableValue" clearable @submit="handleSubmit" />
    </div>
  </el-card>
  <el-card header="提交方式">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <el-radio-group v-model="activeName">
        <el-radio-button value="enter">enter</el-radio-button>
        <el-radio-button value="shiftEnter">shiftEnter</el-radio-button>
        <el-radio-button value="cmdOrCtrlEnter">cmdOrCtrlEnter</el-radio-button>
        <el-radio-button value="altEnter">altEnter</el-radio-button>
      </el-radio-group>
      <ec-chat-mention-sender v-model="senderValue" :submit-type="activeName" :loading="senderLoading" @submit="handleSubmit" />
    </div>
  </el-card>
  <el-card header="语音识别">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <span>内置语音识别：</span>
      <ec-chat-mention-sender v-model="senderValue" allow-speech @submit="handleSubmit" />

      <span>自定义语音识别：</span>
      <div>
        <el-button type="primary" style="width: fit-content" @click="senderRefrecd.startRecognition()"> 使用组件实例 开始录音 </el-button>
        <el-button type="primary" style="width: fit-content" @click="senderRefrecd.stopRecognition()"> 使用组件实例 结束录音 </el-button>
      </div>
      <ec-chat-mention-sender ref="senderRefrecd" v-model="senderValue" allow-speech @recording-change="onRecordingChange" />
    </div>
  </el-card>
  <el-card header="变体">
    <div style="display: flex; flex-direction: column; gap: 20px">
      <ec-chat-mention-sender v-model="senderValue" variant="updown" />
      <ec-chat-mention-sender v-model="senderValue" variant="updown" clearable />
      <ec-chat-mention-sender v-model="senderValue" variant="updown" clearable allow-speech />

      <ec-chat-mention-sender v-model="senderValue" variant="updown" :auto-size="{ minRows: 2, maxRows: 5 }" clearable allow-speech placeholder="在这里你可以自定义变体后的 prefix 和 actions">
        <template #prefix>
          <div style="display: flex; align-items: center; flex-wrap: wrap">
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

            <span class="text-muted" style="margin-left: 12px">左边是自定义 prefix 前缀 右边是自定义 操作列表</span>
          </div>
        </template>

        <template #actions>
          <el-button circle color="#575cda" icon="ri-arrow-up-line" />
        </template>
      </ec-chat-mention-sender>
    </div>
  </el-card>
  <el-card header="自定义操作列表">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <ec-chat-mention-sender>
        <template #actions>
          <el-button type="danger" circle icon="ri-close-line" />
          <el-button type="primary" circle icon="ri-send-plane-fill" />
        </template>
      </ec-chat-mention-sender>

      <ec-chat-mention-sender>
        <template #actions>
          <el-button type="primary" plain circle color="#9b1e64" icon="ri-share-line" />
          <el-button type="primary" circle color="#9b1e64" icon="ri-arrow-right-line" />
        </template>
      </ec-chat-mention-sender>
      <ec-chat-mention-sender ref="senderRef" v-model="senderValue" :loading="senderLoading">
        <template #actions>
          <el-button v-if="senderLoading" type="primary" plain circle @click="handleCancel">
            <template #icon>
              <el-icon class="ri-loader-2-line is-loading" />
            </template>
          </el-button>
          <el-button v-else plain circle icon="ri-send-plane-fill" @click="handleSubmit" />
        </template>
      </ec-chat-mention-sender>
    </div>
  </el-card>
  <el-card header="自定义前缀">
    <div style="display: flex; flex-direction: column; gap: 12px; justify-content: flex-end">
      <ec-chat-mention-sender ref="senderRefPes" v-model="senderValue">
        <template #header>
          <div>
            自定义头部内容<br />
            文明像一场大火，燃烧自己，照亮黑暗，然后熄灭。
          </div>
        </template>

        <!-- 自定义前缀 -->
        <template #prefix>
          <el-button @click="senderRefPes.openHeader()">打开头部</el-button>
          <el-button @click="senderRefPes.closeHeader()">关闭头部</el-button>
        </template>
      </ec-chat-mention-sender>
    </div>
  </el-card>
  <el-card header="自定义头部">
    <div style="display: flex; flex-direction: column; gap: 12px; justify-content: space-between">
      <div>
        <el-button @click="senderRefcus.openHeader()">打开头部</el-button>
        <el-button @click="senderRefcus.closeHeader()">关闭头部</el-button>
      </div>
      <ec-chat-mention-sender ref="senderRefcus" v-model="senderValue">
        <template #header>
          <div class="header-self-wrap">
            <div class="header-self-title">
              <div class="header-left">前进！前进！不择手段地前进！</div>
            </div>
            <div class="header-self-content">文明生存的终极逻辑是恐惧驱动的暴力，而非道德。</div>
          </div>
        </template>
      </ec-chat-mention-sender>
    </div>
  </el-card>
  <el-card header="自定义底部">
    <div style="display: flex; flex-direction: column; gap: 20px">
      <ec-chat-mention-sender v-model="senderValue" :auto-size="{ minRows: 1, maxRows: 5 }" clearable allow-speech placeholder="左边是自定义 prefix 前缀 右边是自定义操作列表">
        <template #prefix>
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
        </template>

        <template #actions>
          <el-button circle color="#575cda" icon="ri-arrow-up-line" />
        </template>

        <!-- 自定义 底部插槽 -->
        <template #footer>
          <div style="display: flex; align-items: center; justify-content: center; padding: 12px">默认变体 自定义底部</div>
        </template>
      </ec-chat-mention-sender>

      <ec-chat-mention-sender v-model="senderValue" variant="updown" :auto-size="{ minRows: 2, maxRows: 5 }" clearable allow-speech placeholder="在这里你可以自定义变体后的 prefix 和 actions">
        <template #prefix>
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
        </template>

        <template #actions>
          <el-button circle color="#b73d81" icon="ri-flashlight-fill" />
        </template>
        <template #footer>
          <div style="padding: 12px 16px">updown 变体 自定义底部</div>
        </template>
      </ec-chat-mention-sender>

      <ec-chat-mention-sender
        v-model="senderValue"
        variant="updown"
        :auto-size="{ minRows: 2, maxRows: 5 }"
        clearable
        allow-speech
        placeholder="通过设置 showUpdown 为 false 隐藏 updown 变体的内置布局"
        :show-updown="false"
      >
        <template #prefix>
          <div style="display: flex; align-items: center; flex-wrap: wrap">
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

        <template #actions>
          <el-button circle color="#575cda" icon="ri-arrow-up-line" />
        </template>

        <!-- 自定义 底部插槽 -->
        <template #footer>
          <div style="padding: 12px 16px">showUpdown 属性 隐藏 updown 变体内置布局样式 + #footer底部插槽结合，完全让你来控制底部内容</div>
        </template>
      </ec-chat-mention-sender>
    </div>
  </el-card>
  <el-card header="输入框聚焦控制">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <div style="display: flex">
        <el-button dark type="success" plain @click="senderReffos.focus('start')"> 文本最前方 </el-button>
        <el-button dark type="success" plain @click="senderReffos.focus('end')"> 文本最后方 </el-button>
        <el-button dark type="success" plain @click="senderReffos.focus('all')"> 整个文本 </el-button>
        <el-button dark type="success" plain @click="senderReffos.blur()"> 失去焦点 </el-button>
      </div>
      <ec-chat-mention-sender ref="senderReffos" v-model="senderValue" />
    </div>
  </el-card>
  <el-card header="黏贴文件">
    <ec-chat-mention-sender ref="senderRef" v-model="senderValue" @paste-file="handlePasteFile">
      <template #header>
        <div style="padding: 16px">
          <ec-chat-attachments :items="files" :http-request="handleHttpRequest" @delete-card="handleDeleteCard" />
        </div>
      </template>
      <template #prefix>
        <el-button icon="ri-add-line" circle @click="handleOpenHeader" />
      </template>
    </ec-chat-mention-sender>
  </el-card>
  <el-card header="触发指令自定义数组">
    <ec-chat-mention-sender
      v-model="senderValue"
      placeholder="输入 / 触发指令弹框"
      clearable
      :options="options"
      :trigger-strings="['/']"
    />
  </el-card>
  <el-card header="自定义触发指令字符串">
    <ec-chat-mention-sender
      v-model="senderValue"
      placeholder="输入 @ 和 # 触发指令弹框"
      clearable
      :options="options2"
      :trigger-strings="['@', '#']"
      @search="handleSearch"
    />
  </el-card>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import EcChatMentionSender from '@/components/EcChat/components/EcChatMentionSender/index.vue'
import EcChatAttachments from '@/components/EcChat/components/EcChatAttachments/index.vue'
defineOptions({ name: 'chatSender' })
const senderRef = ref()
const senderRefder = ref()
const timeValue = ref(null)
const senderValue = ref('')
const senderLoading = ref(false)

const submitBtnDisabled = ref(true)
function handleSubmit(value) {
  ElMessage.info(`发送中`)
  senderLoading.value = true
  timeValue.value = setTimeout(() => {
    // 可以在控制台 查看打印结果
    console.log('submit-> value：', value)
    console.log('submit-> senderValue', senderValue.value)
    senderLoading.value = false
    ElMessage.success(`发送成功`)
  }, 3500)
}

function handleCancel() {
  senderLoading.value = false
  if (timeValue.value) clearTimeout(timeValue.value)
  timeValue.value = null
  ElMessage.info(`取消发送`)
}
const longerValue = ref('前进！前进！不择手段地前进！'.repeat(30))
const senderReadOnlyValue = ref(`只读：前进！前进！不择手段地前进！`)
const senderClearableValue = ref(`可删除：前进！前进！不择手段地前进！`)

const activeName = ref('enter')

const senderRefrecd = ref(null)
function onRecordingChange(recording) {
  if (recording) {
    ElMessage.success('开始录音')
  } else {
    ElMessage.success('结束录音')
  }
}

const onlineseek = ref(false)

const senderRefPes = ref(null)
const senderRefcus = ref(null)
const senderReffos = ref(null)

const showHeaderFlog = ref(false)
const files = ref([])

function handleOpenHeader() {
  if (!showHeaderFlog.value) {
    senderRef.value.openHeader()
  } else {
    senderRef.value.closeHeader()
  }
  showHeaderFlog.value = !showHeaderFlog.value
}

function closeHeader() {
  showHeaderFlog.value = false
  senderRef.value.closeHeader()
}

function handlePasteFile(firstFile, fileList) {
  showHeaderFlog.value = true
  senderRef.value.openHeader()
  const fileArray = Array.from(fileList)

  fileArray.forEach((file, index) => {
    files.value.push({
      id: Date.now(),
      uid: Date.now(),
      name: file.name,
      fileSize: file.size,
      imgFile: file,
      showDelIcon: true,
      imgVariant: 'square',
    })
  })
}

async function handleHttpRequest(options) {
  const formData = new FormData()
  formData.append('file', options.file)
  ElMessage.info('上传中...')

  setTimeout(() => {
    const res = {
      message: '文件上传成功',
      fileName: options.file.name,
      uid: options.file.uid,
      fileSize: options.file.size,
      imgFile: options.file,
    }
    files.value.push({
      id: res.uid,
      uid: res.uid,
      name: res.fileName,
      fileSize: res.fileSize,
      imgFile: res.imgFile,
      showDelIcon: true,
      imgVariant: 'square',
    })

    ElMessage.success('上传成功')
  }, 1000)
}

function handleDeleteCard(item) {
  files.value = files.value.filter((items) => items.id !== item.id)
  console.log('delete', item)
  ElMessage.success('删除成功')
}
const options = [
  {
    value: 'value1',
    label: '选项1'
  },
  {
    value: 'value2',
    label: '选项2',
    disabled: true
  },
  {
    value: 'value3',
    label: '选项3'
  }
];
const MOCK_DATA = {
  '@': [
    '史强',
    '智子',
    '章北海',
    '罗辑',
    '云天明'
  ],
  '#': ['1.0', '2.0', '3.0', '4.0', '5.0']
};

const options2 = ref([]);

function handleSearch(_, prefix) {
  console.log('handleSearch', _, prefix);

  options2.value = (MOCK_DATA[prefix] || []).map(value => ({
    value
  }));
}
</script>

<style lang="scss" scoped>
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
</style>
