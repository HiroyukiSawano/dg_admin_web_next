<template>
  <div class="wf-node-wrap">
    <div class="wf-node-box">
      <div class="wf-node-block wf-node-block--approver" :class="nodeConfig.nodeKey" @click="showConfig">
        <div class="wf-node-block__header">
          <i :size="14" class="wf-node-block__icon ri ri-group-line"></i>
          <span class="wf-node-block__title">{{ nodeConfig.nodeName }}</span>
          <i :size="14" class="wf-node-block__close ri ri-close-line" @click.stop="delNode()"></i>
        </div>
        <div class="wf-node-block__body">
          <span v-if="toText(nodeConfig)">{{ toText(nodeConfig) }}</span>
          <span v-else class="placeholder">请选择</span>
        </div>
      </div>
      <add-node v-model="nodeConfig.childNode" />
    </div>

    <el-drawer title="审批设置" v-model="drawerVisible" destroy-on-close append-to-body :size="400">
      <el-form label-position="top">
        <el-form-item label="节点名称">
          <el-input ref="nodeTitle" v-model="formData.nodeName" clearable />
        </el-form-item>
        <el-form-item label="审批人员类型">
          <el-select v-model="formData.setType" @change="changeSetType">
            <el-option :value="1" label="指定成员"></el-option>
            <el-option :value="2" label="主管"></el-option>
            <el-option :value="3" label="角色"></el-option>
            <el-option :value="4" label="发起人自选"></el-option>
            <el-option :value="5" label="发起人自己"></el-option>
            <el-option :value="7" label="连续多级主管"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item v-if="formData.setType == 1" label="选择成员">
          <el-avatar-group>
            <el-avatar v-for="(userItem, userIndex) in formData.nodeAssigneeList" :key="userItem.id"
              :src="userItem.avatar" closable @close="delUser(userIndex)">
              {{ userItem.name.at(0) }}
              <i class="ri-close-circle-fill" @click="delUser(userIndex)"></i>
            </el-avatar>
            <el-button type="primary" circle icon="ri-add-line" @click="selectHandle(1, formData.nodeAssigneeList)" />
          </el-avatar-group>
        </el-form-item>
        <template v-if="formData.setType == 2">
          <el-form-item :label="`指定发起人的第${formData.examineLevel}级主管`">
            <el-input-number v-model="formData.examineLevel" :min="1" controls-position="right" class="width-100" />
          </el-form-item>
        </template>
        <el-form-item v-if="formData.setType == 3" label="选择角色">
          <div>
            <el-button type="primary" icon="ri-add-line"
              @click="selectHandle(2, formData.nodeAssigneeList)">选择角色</el-button>
            <div class="el-tag-group">
              <el-tag v-for="(role, index) in formData.nodeAssigneeList" :key="role.id" type="info" closable
                @close="delRole(index)">{{ role.name }}</el-tag>
            </div>
          </div>

        </el-form-item>

        <el-form-item v-if="formData.setType == 4" label="发起人自选">
          <el-radio-group v-model="formData.selectMode">
            <el-radio :value="1" label="自选一个人" />
            <el-radio :value="2" label="自选多个人" />
          </el-radio-group>
        </el-form-item>
        <template v-if="formData.setType == 7">
          <el-form-item label="连续主管审批终点">
            <el-radio-group v-model="formData.directorMode">
              <el-radio :value="0" label="直到最上层主管" />
              <el-radio :value="1" label="自定义审批终点" />
            </el-radio-group>
          </el-form-item>
          <el-form-item v-if="formData.directorMode == 1" :label="`直到发起人的第${formData.directorLevel}级主管`">
            <el-input-number v-model="formData.directorLevel" :min="1" controls-position="right" class="width-100" />
          </el-form-item>
        </template>
        <el-divider></el-divider>
        <el-form-item label="超时自动审批">
          <el-switch v-model="formData.termAuto" />
        </el-form-item>
        <template v-if="formData.termAuto">
          <el-form-item label="审批期限（为0小时则不生效）">
            <el-input-number v-model="formData.term" :min="0" controls-position="right" class="width-100" />
          </el-form-item>
          <el-form-item label="审批期限超时后执行">
            <el-radio-group v-model="formData.termMode">
              <el-radio :value="0" label="自动通过" />
              <el-radio :value="1" label="自动拒绝" />
            </el-radio-group>
          </el-form-item>
        </template>
        <el-divider></el-divider>
        <el-form-item label="多人审批时审批方式">
          <el-radio-group v-model="formData.examineMode">
            <el-radio :value="1" label="按顺序依次审批" />
            <el-radio :value="2" label="会签 (可同时审批，每个人必须审批通过)" />
            <el-radio :value="3" label="或签 (有一人审批通过即可)" />
          </el-radio-group>
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

const delNode = () => {
  modelValue.value = nodeConfig.value.childNode
}

const delUser = (index) => {
  formData.value.nodeAssigneeList.splice(index, 1)
}

const delRole = (index) => {
  formData.value.nodeAssigneeList.splice(index, 1)
}

const selectHandle = (type, data) => {
  handleSelect(type, data)
}

const changeSetType = () => {
  formData.value.nodeAssigneeList = []
}

const toText = (nodeConfig) => {
  if (nodeConfig.setType === 1) {
    if (nodeConfig.nodeAssigneeList && nodeConfig.nodeAssigneeList.length > 0) {
      const users = nodeConfig.nodeAssigneeList.map(item => item.name).join("、")
      return users
    } else {
      return false
    }
  } else if (nodeConfig.setType === 2) {
    return nodeConfig.examineLevel === 1 ? '直接主管' : `发起人的第${nodeConfig.examineLevel}级主管`
  } else if (nodeConfig.setType === 3) {
    if (nodeConfig.nodeAssigneeList && nodeConfig.nodeAssigneeList.length > 0) {
      const roles = nodeConfig.nodeAssigneeList.map(item => item.name).join("、")
      return '角色-' + roles
    } else {
      return false
    }
  } else if (nodeConfig.setType === 4) {
    return "发起人自选"
  } else if (nodeConfig.setType === 5) {
    return "发起人自己"
  } else if (nodeConfig.setType === 7) {
    return "连续多级主管"
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
