<template>
  <div class="wf-node-wrap">
    <div class="wf-node-box">
      <div class="wf-node-block wf-node-block--send" :class="nodeConfig.nodeKey" @click="showConfig">
        <div class="wf-node-block__header">
          <i class="wf-node-block__icon ri ri-user-received-line"></i>
          <span class="wf-node-block__title">{{ nodeConfig.nodeName }}</span>
          <i class="wf-node-block__close ri ri-close-line" @click.stop="delNode()"></i>
        </div>
        <div class="wf-node-block__body">
          <span v-if="toText(nodeConfig)">{{ toText(nodeConfig) }}</span>
          <span v-else class="placeholder">请选择</span>
        </div>
      </div>
      <add-node v-model="nodeConfig.childNode" />
    </div>
    <el-drawer title="设置" v-model="drawerVisible" destroy-on-close append-to-body :size="480">
      <el-form label-position="top">
        <el-form-item label="节点名称">
          <el-input ref="nodeTitle" v-model="formData.nodeName" clearable />
        </el-form-item>
        <el-form-item label="选择要抄送的人员">
          <el-avatar-group>
            <el-avatar v-for="(userItem, userIndex) in formData.nodeAssigneeList" :key="userItem.id"
              :src="userItem.avatar" closable @close="delUser(userIndex)">
              {{ userItem.name.at(0) }}
              <i class="ri-close-circle-fill" @click="delUser(userIndex)"></i>
            </el-avatar>
            <el-button type="primary" circle icon="ri-add-line" @click="selectHandle(1, formData.nodeAssigneeList)" />
          </el-avatar-group>
        </el-form-item>

        <el-form-item label="允许发起人自选抄送人">
          <el-switch v-model="formData.userSelectFlag" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="saveConfig">保存</el-button>
        <el-button @click="drawerVisible = false">取消</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, watch, inject, onMounted } from 'vue'
import addNode from './addNode.vue'
const handleSelect = inject('select')
const modelValue = defineModel({
  type: Object,
  default: () => { }
})

const drawerVisible = ref(false)
const formData = ref({})
const nodeConfig = ref({})

watch(modelValue, (newValue) => {
  nodeConfig.value = newValue
}, { deep: true })

onMounted(() => {
  nodeConfig.value = modelValue.value
})

const showConfig = () => {
  formData.value = {}
  formData.value = JSON.parse(JSON.stringify(nodeConfig.value))
  drawerVisible.value = true
}

const saveConfig = () => {
  modelValue.value = formData.value
  drawerVisible.value = false
}

const delNode = () => {
  modelValue.value = nodeConfig.value.childNode
}

const delUser = (index) => {
  formData.value.nodeAssigneeList.splice(index, 1)
}

const selectHandle = (type, data) => {
  handleSelect(type, data)
}

const toText = (nodeConfig) => {
  if (nodeConfig.nodeAssigneeList && nodeConfig.nodeAssigneeList.length > 0) {
    const users = nodeConfig.nodeAssigneeList.map(item => item.name).join("、")
    return users
  } else {
    if (nodeConfig.userSelectFlag) {
      return "发起人自选"
    } else {
      return false
    }
  }
}
</script>
<style lang="scss" scoped>
.el-avatar-group {
  .el-avatar {
    --el-avatar-text-size: var(--el-font-size-extra-small);
    position: relative;
    overflow: initial;
    z-index: 0;
    border-color: var(--el-fill-color-blank);
    cursor: pointer;

    &:hover {
      z-index: 1;

      i {
        display: inline-flex;
        z-index: 1;
      }
    }

    i {
      display: none;
      position: absolute;
      top: -4px;
      right: -4px;
      color: var(--el-color-danger);
      background-color: var(--el-color-white);
      border-radius: 100%;
    }
  }

  .el-avatar+.el-button {
    border-color: var(--el-fill-color-blank);
    margin-left: var(--el-avatar-group-item-gap);
    z-index: 0;
  }
}
</style>
