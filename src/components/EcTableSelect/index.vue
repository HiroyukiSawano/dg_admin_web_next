<template>
  <el-select
    ref="selectRef"
    v-model="model"
    :multiple="props.multiple"
    :clearable="props.clearable"
    :collapse-tags="props.collapseTags"
    :collapse-tags-tooltip="props.collapseTagsTooltip"
    :max-collapse-tags="props.maxCollapseTags"
    :filterable="props.filterable"
    :placeholder="props.placeholder"
    @remove-tag="selectTagRemove"
    @visible-change="selectVisibleChange"
    @clear="selectClear"
    :show-arrow="false"
    :value-key="props.props.value"
    :tag-type="props.tagType"
    :tag-effect="props.tagEffect"
    class="ec-select"
  >
    <template #empty>
      <div class="ec-select-table" v-loading="props.loading" :style="{ width: isNumber(props.width) ? props.width + 'px' : props.width, height: isNumber(props.height) ? props.height + 'px' : props.height }">
        <div class="ec-select-table__header">
          <slot name="header"></slot>
        </div>
        <div class="ec-select-table__body">
          <el-table
            ref="tableRef"
            :data="props.data"
            :highlight-current-row="!props.multiple"
            :row-key="row => row[props.props.value]"
            height="100%"
            width="100%"
            size="small"
            @row-click="tableRowClick"
            @select="tableSelect"
            @select-all="tableSelectAll"
          >
            <el-table-column v-if="props.multiple" type="selection" width="40" />
            <slot name="table"></slot>
          </el-table>
        </div>
        <div class="ec-select-table__footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </template>
  </el-select>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue'
import { isNumber } from 'lodash-es'
import config from './config'
defineOptions({
  name: 'EcTableSelect',
})
const props = defineProps({
  data: { type: Array, default: () => [] },
  placeholder: { type: String, default: '请选择' },
  clearable: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  filterable: { type: Boolean, default: false },
  collapseTags: { type: Boolean, default: false },
  collapseTagsTooltip: { type: Boolean, default: false },
  maxCollapseTags: { type: Number, default: 1 },
  disabled: { type: Boolean, default: false },
  width: { type: [String, Number], default: '100%' },
  height: { type: [String, Number], default: '100%' },
  loading: { type: Boolean, default: false },
  tagType: { type: String, default: 'info' },
  tagEffect: { type: String, default: 'light' },

  props: { type: Object, default: () => ({ label: config.props.label, value: config.props.value }) },
})

const emit = defineEmits(['change', 'visible'])

const value = defineModel()


watch(value, (n) => {
  emit('change', n)
}, { deep: true })

const model = computed({
  get() {
    return transformData(value.value, false)
  },
  set(n) {
    value.value = transformData(n, true)
  }
})

const selectRef = ref(null)
const tableRef = ref(null)


const transformData = (data, reverse = false) => {
  if (!data) return props.multiple ? [] : {}
  const t = reverse ? ({ value, label, ...r }) => ({ [props.props.value]: value, [props.props.label]: label, ...r }) : ({ [props.props.value]: value, [props.props.label]: label, ...r }) => ({ value, label, ...r })
  return Array.isArray(data) ? data.map(t) : t(data)
}
const selectVisibleChange = (visible) => {
  if (visible) {
    emit('visible')
  }
}
const tableReload = async () => {
  await nextTick()
  if (props.multiple) {
    value.value?.forEach(item => {
      const row = props.data.find(row => row[props.props.value] === item[props.props.value])
      if (row) tableRef.value.toggleRowSelection(row, true)
    })
  } else {
    const row = props.data.find(row => row[props.props.value] === value.value?.[props.props.value])
    if (row) tableRef.value.setCurrentRow(row)
  }
  tableRef.value?.setScrollTop(0)
}

watch(() => props.data, (n) => {
  tableReload()
}, { immediate: true, deep: true })



const tableSelect = (rows, row) => {
  const selected = rows.length && rows.indexOf(row) !== -1
  if (selected) {
    if (!value.value?.some(item => item[props.props.value] === row[props.props.value])) {
      value.value = props.multiple ? [...(value.value || []), row] : row
    }
  } else {
    value.value = props.multiple ? (value.value || []).filter(item => item[props.props.value] !== row[props.props.value]) : {}
  }
}

const tableSelectAll = (rows) => {
  value.value = rows
}

const tableRowClick = (row) => {
  if (props.multiple) return
  value.value = row
  selectRef.value?.blur()
}

const selectTagRemove = (tag) => {
  if (props.multiple) {
    value.value = value.value?.filter(item => item[props.props.value] !== tag.value) || []
    const row = props.data.find(item => item[props.props.value] === tag.value)
    try {
      tableRef.value?.toggleRowSelection(row, false)
    } catch(e) {
      console.log(e)
    }
  }
}

const selectClear = () => {
  value.value = props.multiple ? [] : {}
  tableRef.value?.clearSelection()
}
const selectBlur = () => selectRef.value?.blur()
const selectFocus = () => selectRef.value?.focus()

defineExpose({ blur: selectBlur, focus: selectFocus, reload: tableReload })
</script>

<style lang="scss" scoped>


.ec-select-table {
  display: flex;
  flex-direction: column;
  .ec-select-table__body {
    flex: 1;
    min-height: 0;
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
