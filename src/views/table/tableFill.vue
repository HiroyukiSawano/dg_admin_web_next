<template>
  <el-card>
    <template #header>
      <div class="el-card__title">
        <el-tabs v-model="tabsActive">
          <el-tab-pane v-for="item in tableCategories" :key="item.value" :label="item.label" :name="item.value">
            <template #label>
              <el-badge :value="item.count" :show-zero="false" is-dot>{{ item.label }}</el-badge>
            </template>
          </el-tab-pane>
        </el-tabs>
      </div>

      <div class="el-card__action">
        <el-button type="primary">{{ $t('ec.global.button.text.action') }}</el-button>
        <el-button>{{ $t('ec.global.button.text.action') }}</el-button>
      </div>
    </template>
    <template v-if="tabsActive === 1">
      <!-- <el-form ref="tableFormRef" inline :model="tableForm" style="padding-bottom: 16px;">
        <el-form-item label="" prop="keyword">
          <el-input v-model="tableForm.keyword" :placeholder="$t('ec.global.form.search.placeholder')" style="width:176px;" />
        </el-form-item>
        <el-form-item label="" prop="type">
          <el-select v-model="tableForm.type" :placeholder="$t('ec.global.form.select.placeholder')" style="width:176px;">
            <el-option v-for="item in tableStatus" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">{{ $t('ec.global.button.text.search') }}</el-button>
          <el-button>{{ $t('ec.global.button.text.reset') }}</el-button>
        </el-form-item>
      </el-form> -->
      <el-table :data="tableData" row-key="id" height="100%" v-loading="tableLoading">
        <el-table-column type="selection" width="56" align="center" />
        <el-table-column v-for="column in tableColumns" :key="column.prop" :prop="column.prop" :label="column.label" :width="column.width" :min-width="column.minWidth" :show-overflow-tooltip="column.showOverflowTooltip" :align="column.align">
          <template #default="{ row }">
            <template v-if="column.type === 'link'">
              <el-text type="primary" truncated>{{ row[column.prop] }}</el-text>
            </template>
            <span v-if="column.type === 'rate'">
              <el-rate v-model="row.star" class="display-flex" :icons="['ri-star-s-fill', 'ri-star-s-fill', 'ri-star-s-fill']" disabled-void-icon="ri-star-s-fill" void-icon="ri-star-s-fill" disabled />
            </span>
            <span v-if="column.type === 'tag'">
              <el-tag :type="tableStatus.find(t => t.value === row[column.prop])?.type">{{ tableStatus.find(s => s.value === row[column.prop])?.label }}</el-tag>
            </span>
            <span v-if="column.type === 'text'">{{ row[column.prop] }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" :label="$t('ec.global.button.text.action')" width="128">
          <template #default>
            <el-button type="primary" link>{{ $t('ec.global.button.text.action') }}</el-button>
            <el-dropdown>
              <el-button type="primary" link>{{ $t('ec.global.button.text.other') }}</el-button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                  <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                  <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        v-model:currentPage="tablePagination.currentPage"
        background
        :layout="tablePagination.layout"
        :total="tablePagination.total"
        :page-size="tablePagination.pageSize"
        :page-sizes="tablePagination.pageSizes"
        @current-change="paginationCurrentChange"
        @update:page-size="paginationPageSizeChange"
      />
    </template>
    <template v-else>
      <el-empty />
    </template>
  </el-card>
</template>
<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/modules/systemStore'
import { apiBookList } from '@/services/modules/mockService'
defineOptions({ name: 'tableTabs' })
const tabsActive = ref(1)
const tableForm = ref({
  keyword: '',
  type: '',
})

const tableLoading = ref(false)
const tablePagination = ref({
  layout: 'total, prev, pager, next, sizes',
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 30, 40, 50],
  total: 1000,
})
const tableData = ref([])
const tableColumns = ref([])
const tableStatus = ref([])
const tableCategories = ref([])
const { language } = storeToRefs(useSystemStore())
const fetchTableData = async () => {
  tableLoading.value = true
  const { data: { source = [], columns = [], categories = [], status = [] }} = await apiBookList({ locale: language.value }) || {}
  tableData.value = source
  tableColumns.value = columns
  tableStatus.value = status
  tableCategories.value = categories
  await new Promise(resolve => setTimeout(resolve, 1000))
  tableLoading.value = false
}
watch(language, async () => {
  fetchTableData()
}, { immediate: true })

const paginationCurrentChange = (page) => {
  tablePagination.value.currentPage = page
  fetchTableData()
}
const paginationPageSizeChange = (size) => {
  tablePagination.value.pageSize = size
  fetchTableData()
}
</script>

<style lang="scss" scoped>
:deep(.el-card) {}
:deep(.el-badge) {
  .el-badge__content.is-fixed.is-dot {
    right: -4px;
    top: 2px;
  }
}
</style>
