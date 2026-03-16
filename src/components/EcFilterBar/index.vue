<template>
  <div>
    <slot :filter-length="count" :open-filter="openFilter">
      <el-badge :value="count" type="danger" :show-zero="false">
        <el-button icon="el-icon-filter" @click="openFilter"></el-button>
      </el-badge>
    </slot>

    <el-drawer v-model="drawer" title="过滤器" :size="480" append-to-body :show-close="false">
      <template #header>
        <el-tabs v-model="active">
          <el-tab-pane label="过滤项"></el-tab-pane>
          <el-tab-pane label="常用"></el-tab-pane>
        </el-tabs>
        <el-button type="primary" link icon="ri-function-add-fill" @click="addFilter">增加过滤项</el-button>
      </template>
      <div v-show="active === '0'" style="margin: -8px; height: 100%">
        <!-- <div v-if="filter.length <= 0" class="nodata">
          没有默认过滤条件，请点击增加过滤项
        </div> -->
        <el-empty v-if="filter.length <= 0" :image-size="96" title="没有过滤" description="没有默认过滤条件，请点击增加过滤项" />
        <el-table v-else :data="filter" :show-header="false">
          <el-table-column label="字段" width="">
            <template #default="scope">
              <el-select v-model="scope.row.field" filterable @change="fieldChange(scope.row)">
                <el-option v-for="field in fields" :key="field.value" :label="field.label" :value="field" :disabled="isDisabled(field.value)" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="运算符" width="" v-if="showOperator">
            <template #default="scope">
              <el-select v-model="scope.row.operator" placeholder="运算符">
                <el-option v-for="ope in scope.row.field.operators || operator" :key="ope.value" :label="ope.label" :value="ope.value" />
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="值" width="">
            <template #default="scope">
              <el-input v-if="!scope.row.field.type" v-model="scope.row.value" placeholder="请选择过滤字段" disabled />
              <el-input v-if="scope.row.field.type=='text'" v-model="scope.row.value" :placeholder="scope.row.field.placeholder||'请输入'" />
              <el-select v-if="scope.row.field.type=='select'" v-model="scope.row.value" :placeholder="scope.row.field.placeholder||'请选择'" filterable :multiple="scope.row.field.extend.multiple" :loading="scope.row.selectLoading" @visible-change="visibleChange($event, scope.row)" :remote="scope.row.field.extend.remote" :remote-method="(query)=>{ remoteMethod(query, scope.row) }">
                <el-option v-for="field in scope.row.field.extend.data" :key="field.value" :label="field.label" :value="field.value" />
              </el-select>
              <el-date-picker v-if="scope.row.field.type=='date'" v-model="scope.row.value" type="date" value-format="YYYY-MM-DD" :placeholder="scope.row.field.placeholder||'请选择日期'" />
              <el-date-picker v-if="scope.row.field.type=='daterange'" v-model="scope.row.value" type="daterange" value-format="YYYY-MM-DD"  start-placeholder="开始日期" end-placeholder="结束日期" />
              <el-date-picker v-if="scope.row.field.type=='datetime'" v-model="scope.row.value" type="datetime" value-format="YYYY-MM-DD HH:mm:ss" :placeholder="scope.row.field.placeholder||'请选择日期'" />
              <el-date-picker v-if="scope.row.field.type=='datetimerange'" v-model="scope.row.value" type="datetimerange" value-format="YYYY-MM-DD HH:mm:ss" start-placeholder="开始日期" end-placeholder="结束日期" />
              <el-date-picker v-if="scope.row.field.type=='customDate'" v-model="scope.row.value" :type="scope.row.field.extend.dateType||'date'" :value-format="scope.row.field.extend.valueFormat" :placeholder="scope.row.field.placeholder||'请选择'" start-placeholder="开始日期" end-placeholder="结束日期" />
              <el-switch v-if="scope.row.field.type=='switch'" v-model="scope.row.value" active-value="1" inactive-value="0" />
              <el-select v-if="scope.row.field.type=='tags'" v-model="scope.row.value" multiple filterable allow-create default-first-option no-data-text="输入关键词后按回车确认" :placeholder="scope.row.field.placeholder||'请输入'" />
            </template>
          </el-table-column>
          <el-table-column label="" width="32" align="right">
            <template #default="scope">
              <el-icon class="ri-close-circle-fill" :size="16" color="var(--el-text-color-disabled)" @click="delFilter(scope.$index)" />
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div v-show="active === '1'" style="height: 100%">
        <my :data="myFilter" :filterName="filterName" @selectMyfilter="selectMyfilter"></my>
      </div>
      <template #footer>
        <el-button type="primary" :disabled="filter.length <= 0" @click="ok">立即过滤</el-button>
        <el-button type="primary" plain :disabled="filter.length <= 0" @click="saveMy">另存为常用</el-button>
        <!-- <el-button @click="clear">清空</el-button> -->
        <el-button>关闭</el-button>
      </template>
    </el-drawer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import config from './config'
import my from './my'

// 组件注册
// 在 setup 中，直接导入的组件会自动注册

// 定义 props
const props = defineProps({
  filterName: { type: String, default: '' },
  showOperator: { type: Boolean, default: true },
  options: { type: Object, default: () => {} },
})

// 定义事件
const emits = defineEmits(['filter-change'])

// 响应式数据
const drawer = ref(false)
const operator = config.operator
const fields = ref(props.options)
const filter = ref([])
const myFilter = ref([])
const count = ref(0)
const loading = ref(false)
const active = ref('0')

// 计算属性
const filterObj = computed(() => {
  const obj = {}
  filter.value.forEach((item) => {
    obj[item.field.value] = props.showOperator ? `${item.value}${config.separator}${item.operator}` : `${item.value}`
  })
  return obj
})

// 生命周期钩子
onMounted(() => {
  // 默认显示的过滤项
  fields.value.forEach((item) => {
    if (item.selected) {
      filter.value.push({
        field: item,
        operator: item.operator || 'include',
        value: '',
      })
    }
  })
})


const openFilter = () => {
  drawer.value = true
}

const addFilter = () => {
  const _fields = fields.value.filter((f) => !filter.value.some((s) => f.value === s.field.value && !s.field.repeat))
  if (fields.value.length <= 0 || _fields.length <= 0) {
    ElMessage.warning('无过滤项')
    return false
  }
  filter.value.push({
    field: _fields[0],
    operator: _fields[0].operator ?? 'include',
    value: '',
  })
}

// 删除过滤项
const delFilter = (index) => {
  filter.value.splice(index, 1)
}

// 过滤项字段变更事件
const fieldChange = (row) => {
  const _type = row.field.type
  row.field.type = ''
  nextTick(() => row.field.type = _type)
  row.operator = row.field.operator ?? 'include'
  row.value = ''
}

// 下拉框显示事件处理异步
const visibleChange = async (isopen, item) => {
  if (isopen && item.field.extend.request && !item.field.extend.remote) {
    item.selectLoading = true
    try {
      const data = await item.field.extend.request()
      item.field.extend.data = data
    } catch (error) {
      console.log(error)
    } finally {
      item.selectLoading = false
    }
  }
}

// 下拉框显示事件处理异步搜索
const remoteMethod = async (query, item) => {
  if (!item.field.extend.request) {
    return false
  }
  if (query !== '') {
    item.selectLoading = true
    try {
      const data = await item.field.extend.request(query)
      item.field.extend.data = data
    } catch (error) {
      console.log(error)
    } finally {
      item.selectLoading = false
    }
  } else {
    item.field.extend.data = []
  }
}

// 选择常用过滤
const selectMyfilter = (item) => {
  // 常用过滤回显当前过滤项
  filter.value = []
  fields.value.forEach((field) => {
    const filterValue = item.filterObj[field.value]
    if (filterValue) {
      const operator = filterValue.split('|')[1]
      const value = filterValue.split('|')[0]
      let finalValue = value
      if (field.type === 'select' && field.extend.multiple) {
        finalValue = value.split(',')
      } else if (field.type === 'daterange') {
        finalValue = value.split(',')
      }
      filter.value.push({
        field: field,
        operator: operator,
        value: finalValue,
      })
    }
  })
  count.value = Object.keys(item.filterObj).length
  emits('filter-change', item.filterObj)
  drawer.value = false
}

// 立即过滤
const ok = () => {
  count.value = filter.value.length
  emits('filter-change', filterObj.value)
  drawer.value = false
}

// 保存常用
const saveMy = () => {
  ElMessageBox.prompt('常用过滤名称', '另存为常用', {
    inputPlaceholder: '请输入识别度较高的常用过滤名称',
    inputPattern: /\S/,
    inputErrorMessage: '名称不能为空',
  })
    .then(async ({ value }) => {
      loading.value = true
      const saveObj = {
        title: value,
        filterObj: filterObj.value,
      }
      try {
        const save = await config.saveMy(props.filterName, saveObj)
        if (!save) {
          return false
        }

        myFilter.value.push(saveObj)
        ElMessage.success(`常用过滤保存成功`)
      } catch (error) {
        console.log(error)
        return false
      } finally {
        loading.value = false
      }
    })
    .catch(() => {
      // 取消操作
    })
}

// 清空过滤
const clear = () => {
  filter.value = []
  count.value = 0
  emits('filter-change', filterObj.value)
}

// 判断字段是否禁用
const isDisabled = (key) => {
  return !!filter.value.find(item => item.field.value === key && !item.field.repeat)
}

</script>

<style lang="scss" scoped>
  :deep(.el-table) {
    th,td {
      border: 0;
    }
    .cell {
      padding: 0 8px;
    }
    .el-table__inner-wrapper {
      &::before {
        content: none;
      }
    }
  }
  .el-tabs {
    --el-tabs-header-height: 56px;
    margin: -12px 0;
    :deep() {
      .el-tabs__header,
      .el-tabs__nav-wrap {
        margin: 0;
        &::after {
          content: none;
        }
      }

      .el-tabs__item {
        font-size: var(--el-font-size-medium);
      }
    }

  }
  .el-empty {
    height: 100%;
  }
  :deep(.el-badge) {
    .el-badge__content {
      height: 18px;
      width: 18px;
      border: 0;
    }
  }
</style>
