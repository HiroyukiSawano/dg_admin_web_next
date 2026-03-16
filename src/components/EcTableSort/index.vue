<template>
  <div ref="tableBoxRef" class="sc-form-table" style="width: 100%;">
    <el-table ref="tableRef" :data="data" v-bind="$attrs">
      <el-table-column type="index" width="60" fixed="left" align="center">
        <template #header>
          <el-button v-if="!hideAdd" type="primary" icon="ri-add-line" size="small" circle @click="rowAdd" />
        </template>
        <template #default="scope">
          <div :class="['sc-form-table-handle', { 'sc-form-table-handle-delete': !hideDelete }]">
            <span>{{ scope.$index + 1 }}</span>
            <el-button v-if="!hideDelete" type="danger" icon="ri-close-line" circle size="small" @click="rowRemove(scope.$index)" />
          </div>
        </template>
      </el-table-column>
      <el-table-column v-if="dragSort" width="60" align="center">
        <template #default>
          <el-button text class="move" circle icon="ri-expand-up-down-fill" style="cursor: move" />
        </template>
      </el-table-column>
      <slot></slot>
      <template #empty>{{ placeholder }}</template>
      <!-- 透传所有默认插槽 -->
      <!-- <template v-for="(_, name) in $slots" #[name]="slotData" :key="name">
        <slot :name="name" v-bind="slotData || {}"></slot>
      </template> -->
    </el-table>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { cloneDeep } from 'lodash-es'
import Sortable from 'sortablejs'
defineOptions({
  name: 'EcTableSort',
  inheritAttrs: false
})


// ========== 其他 Props ==========
const props = defineProps({
  addTemplate: { type: Object, default: () => ({}) },
  placeholder: { type: String, default: '暂无数据' },
  dragSort: { type: Boolean, default: false },
  hideAdd: { type: Boolean, default: false },
  hideDelete: { type: Boolean, default: false },
})


const data = defineModel()
const tableBoxRef = ref(null)
const tableRef = ref(null)

onMounted(() => {
  if (props.dragSort) {
    rowDrop()
  }
})


const rowDrop = () => {
  const tbody = tableRef.value?.$el?.querySelector?.('.el-table__body-wrapper tbody')
  if (!tbody) return

  Sortable.create(tbody, {
    handle: '.move',
    animation: 300,
    ghostClass: 'ghost',
    onEnd({ newIndex, oldIndex }) {
      data.value.splice(newIndex, 0, data.value.splice(oldIndex, 1)[0])

      const _data = [...data.value]

      if (tableBoxRef.value?.offsetHeight) {
        tableBoxRef.value.style.setProperty('height', `${tableBoxRef.value.offsetHeight}px`)
      }
      data.value = []
      requestAnimationFrame(() => {
        data.value = _data
        requestAnimationFrame(() => {
          tableBoxRef.value?.style?.removeProperty?.('height')
        })
      })
    },
  })
}

const rowAdd = () => {
  const template = cloneDeep(props.addTemplate)
  data.value.push(template)
}

const rowRemove = (row, index) => {
  data.value.splice(index, 1)
}

const pushRow = (row) => {
  const template = row || cloneDeep(props.addTemplate)
  data.value.push(template)
}

const deleteRow = (index) => {
  data.value.splice(index, 1)
}

defineExpose({
  pushRow,
  deleteRow,
})
</script>

<style scoped>


.sc-form-table .sc-form-table-handle span {
  display: inline-block;
}

.sc-form-table .sc-form-table-handle button {
  display: none;
}

.sc-form-table .hover-row .sc-form-table-handle-delete span {
  display: none;
}

.sc-form-table .hover-row .sc-form-table-handle-delete button {
  display: inline-block;
}

</style>
