<template>
	<el-dialog v-model="dialogVisible" align-center :title="['人员选择', '角色选择'][selectedType - 1]" :width="selectedType === 1?640:480" destroy-on-close append-to-body draggable @closed="emit('closed')">
		<template v-if="selectedType === 1">
      <el-input v-model="keyword" placeholder="搜索成员" style="margin-bottom: 16px;">
        <template #suffix>
          <el-icon class="el-input__icon ri-search-2-line" @click="search" />
        </template>
      </el-input>
			<el-row type="flex">
				<el-col :span="8">
          <el-scrollbar>
            <el-tree class="menu" ref="groupTreeRef" :data="groupData" :node-key="groupProps.key" :props="groupProps" default-expand-all highlight-current :expand-on-click-node="false" :current-node-key="groupId" @node-click="groupClick"/>
          </el-scrollbar>
				</el-col>
        <el-col :span="8">
          <el-scrollbar>
            <el-tree class="menu" ref="userTreeRef" :data="userData" :node-key="userProps.key" :props="userProps" :default-checked-keys="selectedIds" show-checkbox check-on-click-node @check-change="userClick"></el-tree>
          </el-scrollbar>
        </el-col>
				<el-col :span="8">
          <el-scrollbar v-if="selectedData.length>0">
            <div class="el-list">
              <div class="el-list-item" v-for="(item, index) in selectedData" :key="item.id">
                <div class="el-list-item__action">
                  <el-button type="danger" icon="ri-subtract-line" size="small" @click="deleteSelected(index)" />
                </div>
                <div class="el-list-item__avatar">
                  <el-avatar shape="square" :src="item.avatar">
                    {{item.name.substring(0,1)}}
                  </el-avatar>
                </div>
                <div class="el-list-item__content">
                  {{item.name}}
                </div>
              </div>
            </div>
          </el-scrollbar>
          <el-empty v-else :image-size="96" />
				</el-col>
			</el-row>
		</template>

		<template v-if="selectedType === 2">
			<el-row type="flex">
				<el-col :span="12">
          <el-scrollbar>
            <el-tree class="menu" ref="groupTreeRef" :data="roleData" :node-key="roleProps.key" :props="roleProps" show-checkbox check-strictly check-on-click-node :expand-on-click-node="false" :default-checked-keys="selectedIds" @check-change="roleClick"/>
          </el-scrollbar>
				</el-col>
				<el-col :span="12">
          <el-scrollbar>
            <div class="el-list">
              <div class="el-list-item" v-for="(item, index) in selectedData" :key="item.id">
                <div class="el-list-item__action">
                  <el-button type="danger" icon="ri-subtract-line" size="small" @click="deleteSelected(index)" />
                </div>
                <div class="el-list-item__content">
                  {{item.name}}
                </div>
              </div>
            </div>
          </el-scrollbar>
				</el-col>
			</el-row>
		</template>
		<template #footer>
			<el-button @click="dialogVisible = false">取 消</el-button>
			<el-button type="primary" @click="save">确 认</el-button>
		</template>
	</el-dialog>
</template>

<script setup>
	import { ref, computed } from 'vue'
	import config from './config.js'
	const emit = defineEmits(['closed'])

	const dialogVisible = defineModel({ type: Boolean, default: false })

	// 引用
	const groupTreeRef = ref(null)
	const userTreeRef = ref(null)

	// 数据
	const groupProps = ref(config.group.props)
	const userProps = ref(config.user.props)
	const roleProps = ref(config.role.props)

	const keyword = ref('')

	const pageSize = ref(config.user.pageSize)
	const total = ref(0)
	const currentPage = ref(1)
  const groupId = ref('')
	const groupData = ref([])
	const userData= ref([])
	const roleData= ref([])
	const selectedType = ref(1)

	const value = ref([])

	const selectedData = ref([])
	const selectedIds = computed(() => selectedData.value.map(t => t.id))

	// 打开赋值
	const open = (typeVal, data) => {
		selectedType.value = typeVal
		value.value = data || []
		selectedData.value = JSON.parse(JSON.stringify(data || []))
		dialogVisible.value = true

		if (selectedType.value == 1) {
			getGroup()
			getUser()
		} else if (selectedType.value == 2) {
			getRole()
		}
	}

	// 获取组织
	const getGroup = async () => {
		const res = await config.group.apiObj.get()
		res.data.unshift({ [config.group.props.key]: '', [config.group.props.label]: '所有' })
		groupData.value = config.group.parseData(res).rows
	}

	// 获取用户
	const getUser = async () => {
		const params = {
			[config.user.request.keyword]: keyword.value || null,
			[config.user.request.groupId]: groupId.value || null,
			[config.user.request.page]: currentPage.value,
			[config.user.request.pageSize]: pageSize.value
		}
		const res = await config.user.apiObj.get(params)
		userData.value = config.user.parseData(res).rows
		total.value = config.user.parseData(res).total || 0
	}

	// 获取角色
	const getRole = async () => {
		const res = await config.role.apiObj.get()
		roleData.value = config.role.parseData(res).rows
	}

	// 组织点击
	const groupClick = (data) => {
		keyword.value = ''
		currentPage.value = 1
		groupId.value = data[config.group.props.key]
		getUser()
	}

	// 用户点击
	const userClick = (data, checked) => {
		if (checked) {
			selectedData.value.push({
				id: data[config.user.props.key],
				name: data[config.user.props.label]
			})
		} else {
			selectedData.value = selectedData.value.filter(item => item.id != data[config.user.props.key])
		}
	}

	// 用户搜索
	const search = () => {
		groupId.value = ''
		groupTreeRef.value.setCurrentKey(groupId.value)
		currentPage.value = 1
		getUser()
	}

	// 删除已选
	const deleteSelected = (index) => {
		selectedData.value.splice(index, 1)
		if (selectedType.value == 1) {
			userTreeRef.value.setCheckedKeys(selectedIds.value)
		} else if (selectedType.value == 2) {
			groupTreeRef.value.setCheckedKeys(selectedIds.value)
		}
	}

	// 角色点击
	const roleClick = (data, checked) => {
		if (checked) {
			selectedData.value.push({
				id: data[config.role.props.key],
				name: data[config.role.props.label]
			})
		} else {
			selectedData.value = selectedData.value.filter(item => item.id != data[config.role.props.key])
		}
	}

	// 提交保存
	const save = () => {
		value.value.splice(0, value.value.length)
		selectedData.value.map(item => { value.value.push(item) })
		dialogVisible.value = false
	}

	// 暴露方法
	defineExpose({
		open
	})
</script>

<style lang="scss" scoped>
.el-row {
  height: 40vh;
  .el-col {
    height: 100%;
    padding: 16px;
    border: 1px solid var(--el-border-color);
    &:not(:last-child) {
      border-right: 0;
    }
  }
}
.el-tree {
  --el-tree-node-content-height: 32px;
}
.el-empty {
  height: 100%;
  --el-empty-padding: 0;
}
.el-list {
  .el-list-item {
    display: flex;
    align-items: center;
    padding: 4px 0 4px 12px;
    .el-list-item__avatar {
      margin-right: 8px;
      .el-avatar {
        --el-avatar-size: 24px;
        --el-avatar-text-size: 12px;
      }
    }
    .el-list-item__content {
      flex: 1;
    }
    .el-list-item__action {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
      .el-button {
        --el-button-size: 14px;
        padding: 0;
      }
    }
  }
}
</style>
