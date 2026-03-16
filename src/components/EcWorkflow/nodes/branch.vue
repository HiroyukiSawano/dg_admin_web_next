<template>
  <div class="wf-node-wrap">
    <div class="wf-node-row">
      <div class="wf-node-col" v-for="(item, index) in nodeConfig.conditionNodes" :key="index">
        <div class="wf-node-box">
          <div class="wf-node-block wf-node-block--branch" :class="nodeConfig.nodeCode" @click="showConfig(index)">
            <div class="wf-node-block__arrow wf-node-block__arrow--left" v-if="index != 0"
              @click.stop="arrTransfer(index, -1)">
              <i class="ri ri-arrow-left-s-line"></i>
            </div>
            <div class="wf-node-block__header">
              <span class="wf-node-block__title">{{ item.nodeName }}</span>
              <span class="wf-node-block__extra">优先级{{ item.priorityLevel }}</span>
              <i class="wf-node-block__close ri ri-close-line" @click.stop="delTerm(index)"></i>
            </div>
            <div class="wf-node-block__body">
              <span v-if="toText(nodeConfig, index)">{{ toText(nodeConfig, index) }}</span>
              <span v-else class="placeholder">请设置条件</span>
            </div>
            <div class="wf-node-block__arrow wf-node-block__arrow--right"
              v-if="index != nodeConfig.conditionNodes.length - 1" @click.stop="arrTransfer(index)">
              <i class="ri ri-arrow-right-s-line"></i>
            </div>
          </div>
          <add-node v-model="item.childNode" />
        </div>

        <slot v-if="item.childNode" :node="item"></slot>
      </div>
    </div>
    <div class="wf-node-col-add">
      <el-button type="success" plain icon="ri-add-line" circle @click="addTerm" />
    </div>
    <add-node v-model="nodeConfig.childNode" />
    <el-drawer title="设置" v-model="drawerVisible" destroy-on-close append-to-body :size="640">
      <el-form label-position="top">
        <el-form-item label="节点名称">
          <el-input ref="nodeTitle" v-model="formData.nodeName" clearable />
        </el-form-item>
        <el-form-item label="满足以下条件时进入当前分支">
          <template v-for="(groupItem, groupIndex) in formData.conditionList" :key="groupIndex">
            <div class="el-title">{{ groupIndex == 0 ? '当满足' : '或满足' }}</div>
            <div class="el-block">
              <div class="el-block__header">
                <div class="el-block__title">条件组 {{ groupIndex + 1 }}</div>

                <el-button type="primary" link icon="ri-close-line" @click="deleteGroup(groupIndex)" />
              </div>
              <div class="el-block__body">
                <template v-for="(conditionItem, conditionIndex) in groupItem" :key="conditionIndex">
                  <el-row :gutter="8" style="margin-bottom: 12px;" align="middle">
                    <el-col :span="1"><span>{{ conditionIndex == 0 ? '当' : '且' }}</span></el-col>
                    <el-col :span="7">
                      <el-input v-model="conditionItem.label" placeholder="描述" />
                    </el-col>
                    <el-col :span="5">
                      <el-input v-model="conditionItem.field" placeholder="条件字段" />
                    </el-col>
                    <el-col :span="5">
                      <el-select v-model="conditionItem.operator" placeholder="Select">
                        <el-option label="等于" value="=="></el-option>
                        <el-option label="不等于" value="!="></el-option>
                        <el-option label="大于" value=">"></el-option>
                        <el-option label="大于等于" value=">="></el-option>
                        <el-option label="小于" value="<"></el-option>
                        <el-option label="小于等于" value="<="></el-option>
                        <el-option label="包含" value="include"></el-option>
                        <el-option label="不包含" value="notinclude"></el-option>
                      </el-select>
                    </el-col>
                    <el-col :span="5">
                      <el-input v-model="conditionItem.value" placeholder="值" />
                    </el-col>
                    <el-col :span="1">
                      <el-button type="primary" link icon="ri-close-line"
                        @click="deleteCondition(groupItem, conditionIndex)" />
                    </el-col>
                  </el-row>
                </template>
                <el-button type="primary" text bg icon="ri-add-line" class="width-100"
                  @click="addCondition(groupItem)" />
              </div>
            </div>
          </template>
          <el-button type="primary" icon="ri-add-line" class="width-100" @click="addGroup">添加条件组</el-button>
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
import { ref, watch } from 'vue'
import addNode from './addNode.vue'

const modelValue = defineModel({
  type: Object,
  default: () => ({})
})

const nodeConfig = ref({})
const drawerVisible = ref(false)
const nodeIndex = ref(0)
const formData = ref({})

watch(modelValue, (newValue) => {
  nodeConfig.value = newValue
}, { deep: true, immediate: true })

const showConfig = (idx) => {
  nodeIndex.value = idx
  formData.value = {}
  formData.value = JSON.parse(JSON.stringify(nodeConfig.value.conditionNodes[idx]))
  drawerVisible.value = true
}

const saveConfig = () => {
  nodeConfig.value.conditionNodes[nodeIndex.value] = formData.value
  modelValue.value = nodeConfig.value
  drawerVisible.value = false
}

const addTerm = () => {
  let len = nodeConfig.value.conditionNodes.length + 1
  nodeConfig.value.conditionNodes.push({
    nodeName: '条件' + len,
    type: 3,
    priorityLevel: len,
    conditionMode: 1,
    conditionList: []
  })
}

const delTerm = (idx) => {
  nodeConfig.value.conditionNodes.splice(idx, 1)
  if (nodeConfig.value.conditionNodes.length == 1) {
    if (nodeConfig.value.childNode) {
      if (nodeConfig.value.conditionNodes[0].childNode) {
        reData(nodeConfig.value.conditionNodes[0].childNode, nodeConfig.value.childNode)
      } else {
        nodeConfig.value.conditionNodes[0].childNode = nodeConfig.value.childNode
      }
    }
    modelValue.value = nodeConfig.value.conditionNodes[0].childNode
  }
}

const reData = (data, addData) => {
  if (!data.childNode) {
    data.childNode = addData
  } else {
    reData(data.childNode, addData)
  }
}

const arrTransfer = (idx, type = 1) => {
  nodeConfig.value.conditionNodes[idx] = nodeConfig.value.conditionNodes.splice(idx + type, 1, nodeConfig.value.conditionNodes[idx])[0]
  nodeConfig.value.conditionNodes.map((item, index) => {
    item.priorityLevel = index + 1
  })
  modelValue.value = nodeConfig.value
}

const addCondition = (conditionList) => {
  conditionList.push({
    label: '',
    field: '',
    operator: '==',
    value: ''
  })
}

const deleteCondition = (conditionList, idx) => {
  conditionList.splice(idx, 1)
}

const addGroup = () => {
  addCondition(formData.value.conditionList[formData.value.conditionList.push([]) - 1])
}

const deleteGroup = (idx) => {
  formData.value.conditionList.splice(idx, 1)
}

const toText = (nodeConfig, idx) => {
  var { conditionList } = nodeConfig.conditionNodes[idx]
  if (conditionList && conditionList.length == 1) {
    const text = conditionList.map((groupItem) => groupItem.map((item) => `${item.label}${item.operator}${item.value}`)).join(' 和 ')
    return text
  } else if (conditionList && conditionList.length > 1) {
    return conditionList.length + '个条件，或满足'
  } else {
    if (idx == nodeConfig.conditionNodes.length - 1) {
      return '其他条件进入此流程'
    } else {
      return false
    }
  }
}
</script>

<style scoped lang="scss">
.el-title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;

  i {
    opacity: .5;
  }
}

.el-block {
  width: 100%;
  margin-bottom: 12px;
  border: 1px solid var(--el-border-color);

  .el-block__header {
    display: flex;
    align-items: center;
    padding: 0 12px;
    background-color: var(--el-fill-color-light);
  }

  .el-block__title {
    margin-right: auto;
  }

  .el-block__body {
    padding: 12px;
  }
}
</style>
