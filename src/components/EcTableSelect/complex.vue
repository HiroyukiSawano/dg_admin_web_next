<template>
  <el-select
    ref="selectRef"
    v-model="defaultValue"
    :multiple="multiple"
    :clearable="clearable"
    :collapse-tags="collapseTags"
    :collapse-tags-tooltip="collapseTagsTooltip"
    :max-collapse-tags="maxCollapseTags"
    :filterable="filterable"
    :placeholder="placeholder"
    :filter-method="selectFilterMethod"
    @remove-tag="selectRemoveTag"
    @visible-change="selectVisibleChange"
    @clear="selectClear"
    :show-arrow="false"
    class="ec-select"
  >
    <template #empty>
      <div class="ec-select-table" v-loading="loading" :style="{ width: isNumber(tableWidth) ? tableWidth + 'px' : tableWidth, height: isNumber(tableHeight) ? tableHeight + 'px' : tableHeight }">
        <div class="ec-select-table__header">
          <slot name="header" :form="formData" :submit="formSubmit"></slot>
        </div>
        <div class="ec-select-table__body">
          <el-table
            ref="tableRef"
            :data="tableData"
            height="100%"
            :size="size"
            :highlight-current-row="!multiple"
            @row-click="tableRowClick"
            @select="tableSelect"
            @select-all="tableSelectAll"
          >
            <el-table-column v-if="multiple" type="selection" width="45"></el-table-column>
            <el-table-column v-else type="index" width="45">
              <template #default="scope">
                <span>{{ scope.$index + (currentPage - 1) * pageSize + 1 }}</span>
              </template>
            </el-table-column>
            <slot name="table"></slot>
          </el-table>
        </div>
        <div class="ec-select-table__footer">
          <el-pagination
            v-model:currentPage="currentPage"
            background
            layout="prev, pager, next"
            :total="total"
            :size="size"
            :page-size="pageSize"
            @current-change="tableReload"
          />
        </div>
      </div>
    </template>
  </el-select>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue'
import { isNumber } from 'lodash-es'
import config from './config'

const props = defineProps({
  request: { type: Object, default: () => ({}) },
  params: { type: Object, default: () => ({}) },
  placeholder: { type: String, default: '请选择' },
  size: { type: String, default: 'small' },
  clearable: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  filterable: { type: Boolean, default: false },
  collapseTags: { type: Boolean, default: false },
  collapseTagsTooltip: { type: Boolean, default: false },
  maxCollapseTags: { type: Number, default: 1 },
  disabled: { type: Boolean, default: false },
  tableWidth: { type: [String, Number], default: '100%' },
  tableHeight: { type: [String, Number], default: '100%' },

  props: { type: Object, default: () => ({ label: config.props.label, value: config.props.value }) },
})

const emit = defineEmits(['change'])

const modelValue = defineModel()

watch(modelValue, (newVal) => {
  emit('change', newVal)
}, { deep: true })

const loading = ref(false)
const keyword = ref(null)
const tableData = ref([])
const pageSize = ref(config.pageSize)
const total = ref(0)
const currentPage = ref(1)
const formData = ref({})

const selectRef = ref(null)
const tableRef = ref(null)

const defaultValue = computed({
  get() {
    return transformData(modelValue.value, false)
  },
  set(n) {
    modelValue.value = transformData(n, true)
  }
})

const transformData = (data, reverse = false) => {
  if (!data) return props.multiple ? [] : {}
  const t = reverse ? ({ value, label, ...r }) => ({ [props.props.value]: value, [props.props.label]: label, ...r }) : ({ [props.props.value]: value, [props.props.label]: label, ...r }) => ({ value, label, ...r })
  return Array.isArray(data) ? data.map(t) : t(data)
}



const selectVisibleChange = (vis) => {
  if (vis) {
    currentPage.value = 1
    keyword.value = null
    formData.value = {}
    getTableData()
  }
}

const getTableData = async () => {
  loading.value = true
  const params = {
    [config.request.page]: currentPage.value,
    [config.request.pageSize]: pageSize.value,
    [config.request.keyword]: keyword.value
  }

  Object.assign(params, props.params, formData.value)

  try {
    const res = await props.request.get(params)
    const data = config.parseData(res)
    tableData.value = data.rows
    total.value = data.total

    await nextTick()

    if (props.multiple) {
      modelValue.value?.forEach(item => {
        const row = tableData.value.find(row => row[props.props.value] === item[props.props.value])
        if (row) tableRef.value.toggleRowSelection(row, true)
      })
    } else {
      const row = tableData.value.find(row => row[props.props.value] === modelValue.value?.[props.props.value])
      if (row) tableRef.value.setCurrentRow(row)
    }

    tableRef.value?.setScrollTop(0)
  } finally {
    loading.value = false
  }
}

const formSubmit = () => {
  currentPage.value = 1
  keyword.value = null
  getTableData()
}

const tableReload = () => {
  getTableData()
}

const tableSelect = (rows, row) => {
  const selected = rows.length && rows.indexOf(row) !== -1
  if (selected) {
    if (!modelValue.value?.some(item => item[props.props.value] === row[props.props.value])) {
      modelValue.value = props.multiple ? [...(modelValue.value || []), row] : row
    }
  } else {
    modelValue.value = props.multiple ? (modelValue.value || []).filter(item => item[props.props.value] !== row[props.props.value]) : {}
  }
}

const tableSelectAll = (rows) => {
  modelValue.value = rows
}

const tableRowClick = (row) => {
  if (props.multiple) return
  modelValue.value = row
  selectRef.value?.blur()
}

const selectRemoveTag = (tag) => {
  if (props.multiple) {
    modelValue.value = modelValue.value?.filter(item => item[props.props.value] !== tag.value) || []
    const row = tableData.value.find(item => item[props.props.value] === tag.value)
    try {
      tableRef.value?.toggleRowSelection(row, false)
    } catch(e) {
      console.log(e)
    }
  }
}

const selectClear = () => {
  modelValue.value = props.multiple ? [] : {}
}

const selectFilterMethod = (keywordInput) => {
  keyword.value = keywordInput || null
  getTableData()
}

const blur = () => selectRef.value?.blur()
const focus = () => selectRef.value?.focus()

defineExpose({ blur, focus })
</script>

<style lang="scss" scoped>


.ec-select-table {
  display: flex;
  flex-direction: column;
  .ec-select-table__body {
    flex: 1;
    min-height: 0;
  }
  .ec-select-table__header {
    margin-bottom: 16px;
  }
  .ec-select-table__footer {
    margin-top: 16px;
  }
}
</style>
<style lang="scss">
.el-select-dropdown {
  .el-select-dropdown__empty {
    padding: 16px;
  }
}
</style>
