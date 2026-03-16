<template>
  <div class="wf-node-wrap">
    <div class="wf-node-box">
      <div class="wf-node-block wf-node-block--promoter" :class="nodeConfig.nodeKey" @click="showConfig">
        <div class="wf-node-block__header">
          <i class="wf-node-block__icon ri ri-user-line"></i>
          <span class="wf-node-block__title">{{ nodeConfig.nodeName }}</span>
        </div>
        <div class="wf-node-block__body">
          <span>{{ toText(nodeConfig) }}</span>
        </div>
      </div>
      <add-node v-model="nodeConfig.childNode" />
    </div>

    <el-drawer title="设置" v-model="drawerVisible" destroy-on-close append-to-body :size="480">
      <el-form label-position="top">
        <el-form-item label="发起节点名称">
          <el-input ref="nodeTitle" v-model="formData.nodeName" clearable />
        </el-form-item>
        <el-form-item label="谁可以发起此审批">
          <el-button type="primary" icon="el-icon-plus"
            @click="selectHandle(2, formData.nodeAssigneeList)">选择角色</el-button>
          <div class="tags-list">
            <el-tag v-for="(role, index) in formData.nodeAssigneeList" :key="role.id" type="info" closable
              @close="delRole(index)">{{ role.name }}</el-tag>
          </div>
        </el-form-item>
        <el-alert v-if="formData.nodeAssigneeList.length == 0" title="不指定则默认所有人都可发起此审批" type="info" :closable="false" />
      </el-form>
      <template #footer>
        <el-button type="primary" @click="saveConfig">保存</el-button>
        <el-button @click="drawerVisible = false">取消</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, watch, inject } from 'vue'
import addNode from './addNode.vue'

const handleSelect = inject('select')

const modelValue = defineModel({
  type: Object,
  default: () => ({})
})

const nodeConfig = ref({})
const drawerVisible = ref(false)
const formData = ref({})

watch(modelValue, (newValue) => {
  nodeConfig.value = newValue
}, { deep: true, immediate: true })

const showConfig = () => {
  formData.value = {}
  formData.value = JSON.parse(JSON.stringify(nodeConfig.value))
  drawerVisible.value = true
}
const saveConfig = () => {
  modelValue.value = formData.value
  drawerVisible.value = false
}

const selectHandle = (type, data) => {
  handleSelect(type, data)
}

const delRole = (index) => {
  formData.value.nodeAssigneeList.splice(index, 1)
}

const toText = (nodeConfig) => {
  if (nodeConfig.nodeAssigneeList && nodeConfig.nodeAssigneeList.length > 0) {
    return nodeConfig.nodeAssigneeList.map(item => item.name).join("、")
  } else {
    return "所有人"
  }
}
</script>

<style lang="scss" scoped>
.wf-node-box {
  &::after {
    content: none !important;
  }
}
</style>
