<template>
  <div class="wf-node-add">
    <el-popover placement="right-start" :width="320" trigger="click" :hide-after="0" :show-after="0">
      <template #reference>
        <el-button type="primary" icon="ri-add-line" circle />
      </template>
      <el-row class="el-action-group">
        <el-col :span="8" @click="addType(1)">
          <div class="el-action">
            <el-button type="warning" circle plain icon="ri-group-line" />
            <el-text tag="div">审批节点</el-text>
          </div>
        </el-col>
        <el-col :span="8" @click="addType(2)">
          <div class="el-action">
            <el-button type="info" circle plain icon="ri-user-received-line" />
            <el-text tag="div">抄送节点</el-text>
          </div>
        </el-col>
        <el-col :span="8" @click="addType(4)">
          <div class="el-action">
            <el-button type="success" circle plain icon="ri-share-line" />
            <el-text tag="div">条件分支</el-text>
          </div>
        </el-col>
      </el-row>
    </el-popover>
  </div>
</template>

<script setup>
	import { defineModel } from 'vue'

	const modelValue = defineModel({
		type: Object,
		default: () => ({})
	})

	const getNodeKey = (type) => {
		return `node_${type}_${Date.now()}`
	}

	const addType = (type) => {
		let node = {}
		if (type === 1) {
			node = {
				nodeName: "审核人",
				nodeKey: getNodeKey(type),
				type: 1,
				setType: 1,
				nodeAssigneeList: [],
				examineLevel: 1,
				directorLevel: 1,
				selectMode: 1,
				termAuto: false,
				term: 0,
				termMode: 1,
				examineMode: 1,
				directorMode: 0,
				childNode: modelValue.value
			}
		} else if (type === 2) {
			node = {
				nodeName: "抄送人",
				nodeKey: getNodeKey(type),
				type: 2,
				userSelectFlag: true,
				nodeAssigneeList: [],
				childNode: modelValue.value
			}
		} else if (type === 4) {
			node = {
				nodeName: '条件路由',
				nodeKey: getNodeKey(type),
				type: 4,
				conditionNodes: [
					{
						nodeName: '条件1',
						nodeKey: getNodeKey(type),
						type: 3,
						priorityLevel: 1,
						conditionMode: 1,
						conditionList: []
					},
					{
						nodeName: '条件2',
						nodeKey: getNodeKey(type),
						type: 3,
						priorityLevel: 2,
						conditionMode: 1,
						conditionList: []
					}
				],
				childNode: modelValue.value
			}
		}
		modelValue.value = node
	}
</script>

<style lang="scss" scoped>
.el-action-group {
  text-align: center;
  .el-action {
    // padding: 12px 0;
    .el-button {
      border-color: transparent;
    }
    .el-text {
      margin-top: 8px;
      font-size: var(--el-font-size-extra-small);
    }
  }
}
</style>
