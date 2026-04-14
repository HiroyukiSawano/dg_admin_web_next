<template>
  <figma-resource-shell
    hide-tabs
    frame-variant="platform"
    variant="middleware-list"
    :stats="statCards"
    :stats-decoration="statsDecoration"
    :stats-decoration-image="statsDecorationImage"
    :stats-loading="statsLoading"
  >
    <template #filters>
      <div class="middleware-figma-toolbar">
        <el-input
          v-model="queryForm.keyword"
          clearable
          class="middleware-figma-field middleware-figma-field--keyword"
          :placeholder="t('ec.middleware.common.searchPlaceholder')"
          @keyup.enter="handleSearch"
        />
        <el-select
          v-model="queryForm.middlewareType"
          clearable
          class="middleware-figma-field"
          :placeholder="t('ec.middleware.form.typePlaceholder')"
        >
          <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select
          v-model="queryForm.status"
          clearable
          class="middleware-figma-field"
          :placeholder="t('ec.middleware.form.statusPlaceholder')"
        >
          <el-option v-for="item in currentStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button class="middleware-figma-search" type="primary" @click="handleSearch">
          {{ t('ec.global.button.text.search') }}
        </el-button>
        <el-button class="middleware-figma-reset" @click="handleReset">
          {{ t('ec.global.button.text.reset') }}
        </el-button>
      </div>
    </template>

    <template #actions>
      <div class="middleware-figma-toolbar-actions">
        <el-button class="middleware-figma-primary" type="primary" @click="router.push('/middleware/middlewareResources/create')">
          {{ t('ec.middleware.common.create') }}
        </el-button>
        <div class="middleware-figma-view-switch" aria-hidden="true">
          <button class="middleware-figma-view-switch__button is-active" type="button" tabindex="-1">
            <i class="ri-list-check-2"></i>
          </button>
          <button class="middleware-figma-view-switch__button" type="button" tabindex="-1">
            <i class="ri-layout-grid-line"></i>
          </button>
        </div>
      </div>
    </template>

    <el-table
      v-loading="tableLoading"
      :data="tableData"
      height="100%"
      row-key="id"
      class="middleware-figma-table"
      @row-click="handleDetail"
    >
      <el-table-column type="index" width="48" :label="t('ec.organization.figma.table.index')" :index="indexMethod" />
      <el-table-column prop="middlewareCode" :label="t('ec.middleware.common.code')" min-width="146" show-overflow-tooltip />
      <el-table-column prop="middlewareName" :label="t('ec.middleware.common.name')" min-width="140" show-overflow-tooltip />
      <el-table-column :label="t('ec.middleware.common.type')" min-width="140">
        <template #default="{ row }">
          <span class="middleware-figma-tag" :class="`is-${getTypeVisual(row.middlewareType).tone}`">
            {{ getTypeVisual(row.middlewareType).label }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="version" :label="t('ec.middleware.common.version')" min-width="120" show-overflow-tooltip />
      <el-table-column :label="t('ec.middleware.common.status')" min-width="100">
        <template #default="{ row }">
          <span class="middleware-figma-tag" :class="row.status === 'ACTIVE' ? 'is-green' : 'is-gray'">
            {{ statusLabelMap[row.status] || row.status || '-' }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.middleware.common.actions')" fixed="right" width="116">
        <template #default="{ row }">
          <div class="middleware-figma-actions">
            <button
              class="middleware-figma-icon-button"
              type="button"
              :title="t('ec.middleware.common.detail')"
              @click.stop="handleDetail(row)"
            >
              <i class="ri-eye-line"></i>
            </button>
            <button
              class="middleware-figma-icon-button"
              type="button"
              :title="t('ec.middleware.common.edit')"
              @click.stop="router.push(`/middleware/middlewareResources/${row.id}/edit`)"
            >
              <i class="ri-edit-line"></i>
            </button>
            <button
              class="middleware-figma-icon-button is-danger"
              type="button"
              :title="t('ec.middleware.common.delete')"
              @click.stop="handleDelete(row)"
            >
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="t('ec.middleware.common.empty')" />
      </template>
    </el-table>

    <template #pagination>
      <div class="middleware-figma-pagination">
        <div class="middleware-figma-pagination__summary">{{ pageSummaryText }}</div>
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          background
          class="middleware-figma-pagination__controls"
          :layout="paginationLayout"
          :total="pagination.total"
          :page-sizes="pagination.pageSizes"
          @current-change="handlePageChange"
          @size-change="handlePageSizeChange"
        />
      </div>
    </template>
  </figma-resource-shell>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useSystemStore } from '@/stores/modules/systemStore'
import FigmaResourceShell from '@/views/organization/components/FigmaResourceShell.vue'
import {
  deleteMiddlewareResource,
  getMiddlewareResourceList,
  getMiddlewareResourceStats,
} from '@/services/modules/middlewareService'
import statsDecoration from '@/assets/images/organization/software-stats-mask.svg'
import statsDecorationImage from '@/assets/images/organization/software-stats-image.png'
import totalIcon from '@/assets/images/organization/service-provider-stat-total.svg'
import activeIcon from '@/assets/images/organization/software-stat-basic-support.svg'
import inactiveIcon from '@/assets/images/organization/hardware-stat-peripheral.svg'
import { buildOptionLabelMap, middlewareTypeOptions, statusOptions } from './helpers'

defineOptions({ name: 'MiddlewareResources' })

const { locale, t } = useI18n()
const router = useRouter()
const { device } = storeToRefs(useSystemStore())

const tableLoading = ref(false)
const statsLoading = ref(false)
const tableData = ref([])
const queryForm = reactive({ keyword: '', middlewareType: '', status: '' })
const pagination = reactive({ currentPage: 1, pageSize: 8, pageSizes: [8, 10, 20, 50, 100], total: 0 })
const statValues = reactive({ total: 0, active: 0, inactive: 0 })

const typeOptions = computed(() => middlewareTypeOptions(t))
const currentStatusOptions = computed(() => statusOptions(t))
const typeLabelMap = computed(() => buildOptionLabelMap(typeOptions.value))
const statusLabelMap = computed(() => buildOptionLabelMap(currentStatusOptions.value))
const paginationLayout = computed(() => device.value === 'mobile' ? 'prev, pager, next' : 'sizes, prev, pager, next, jumper')
const pageCount = computed(() => Math.max(1, Math.ceil(Number(pagination.total || 0) / Number(pagination.pageSize || 8))))
const pageSummaryText = computed(() => String(locale.value || '').startsWith('zh') ? `共${pageCount.value}页` : `${pageCount.value} pages`)
const typeVisualMap = computed(() => ({
  TOMCAT: { label: typeLabelMap.value.TOMCAT, tone: 'blue' },
  NGINX: { label: typeLabelMap.value.NGINX, tone: 'cyan' },
  REDIS: { label: typeLabelMap.value.REDIS, tone: 'green' },
  KAFKA: { label: typeLabelMap.value.KAFKA, tone: 'orange' },
  ROCKETMQ: { label: typeLabelMap.value.ROCKETMQ, tone: 'orange' },
  ELASTICSEARCH: { label: typeLabelMap.value.ELASTICSEARCH, tone: 'violet' },
  NACOS: { label: typeLabelMap.value.NACOS, tone: 'blue' },
  OTHER: { label: typeLabelMap.value.OTHER, tone: 'gray' },
}))
const statCards = computed(() => [
  { key: 'middleware-total', label: t('ec.middleware.stats.total'), value: statValues.total, iconUrl: totalIcon, tone: 'primary' },
  { key: 'middleware-active', label: t('ec.middleware.stats.active'), value: statValues.active, iconUrl: activeIcon, tone: 'primary' },
  { key: 'middleware-inactive', label: t('ec.middleware.stats.inactive'), value: statValues.inactive, iconUrl: inactiveIcon, tone: 'primary' },
])

const indexMethod = (index) => (pagination.currentPage - 1) * pagination.pageSize + index + 1
const getTypeVisual = (value) => typeVisualMap.value[value] || { label: value || '-', tone: 'blue' }

const loadData = async () => {
  tableLoading.value = true
  try {
    const pageData = await getMiddlewareResourceList({
      pageNo: pagination.currentPage,
      pageSize: pagination.pageSize,
      keyword: queryForm.keyword || undefined,
      middlewareType: queryForm.middlewareType || undefined,
      status: queryForm.status || undefined,
    })
    tableData.value = Array.isArray(pageData.records) ? pageData.records : []
    pagination.total = Number(pageData.total || 0)
  } catch (error) {
    ElMessage.error(error.message || t('ec.middleware.message.loadFailed'))
  } finally {
    tableLoading.value = false
  }
}

const loadStats = async () => {
  statsLoading.value = true
  try {
    const stats = await getMiddlewareResourceStats()
    statValues.total = Number(stats.total || 0)
    statValues.active = Number(stats.active || 0)
    statValues.inactive = Number(stats.inactive || 0)
  } catch (error) {
    statValues.total = 0
    statValues.active = 0
    statValues.inactive = 0
    ElMessage.error(error.message || t('ec.middleware.message.statsFailed'))
  } finally {
    statsLoading.value = false
  }
}

const handleSearch = () => {
  pagination.currentPage = 1
  loadData()
}

const handleReset = () => {
  queryForm.keyword = ''
  queryForm.middlewareType = ''
  queryForm.status = ''
  pagination.currentPage = 1
  loadData()
}

const handlePageChange = (page) => {
  pagination.currentPage = page
  loadData()
}

const handlePageSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  loadData()
}

const handleDetail = (row) => {
  router.push(`/middleware/middlewareResources/${row.id}/detail`)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('ec.middleware.common.deleteConfirm', { name: row.middlewareName || row.middlewareCode }),
      t('ec.global.common.tip'),
      { type: 'warning' },
    )
    await deleteMiddlewareResource(row.id)
    ElMessage.success(t('ec.middleware.common.deleteSuccess'))
    if (tableData.value.length === 1 && pagination.currentPage > 1) pagination.currentPage -= 1
    await Promise.all([loadData(), loadStats()])
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error(error.message || t('ec.middleware.common.deleteFailed'))
    }
  }
}

onMounted(() => Promise.all([loadData(), loadStats()]))
</script>

<style lang="scss" scoped>
.middleware-figma-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

.middleware-figma-field,
.middleware-figma-field--keyword {
  width: 200px;
}

.middleware-figma-search {
  min-width: 52px;
  height: 32px;
  padding-inline: 12px;
  border: 0;
  border-radius: 4px;
  background: #2e5ef0;
  box-shadow: none;
  font-size: 14px;
}

.middleware-figma-reset {
  min-width: 68px;
  height: 32px;
  padding-inline: 12px;
  border: 0;
  border-radius: 4px;
  background: #f5f6f9;
  box-shadow: none;
  color: #444a57;
  font-size: 14px;
}

.middleware-figma-toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.middleware-figma-primary {
  min-width: 96px;
  height: 32px;
  padding-inline: 12px;
  border: 0;
  border-radius: 4px;
  background: #2e5ef0;
  box-shadow: none;
  font-size: 14px;
}

.middleware-figma-view-switch {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #7c8393;
}

.middleware-figma-view-switch__button {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  padding: 0;
  border: 0;
  background: transparent;
  color: inherit;

  &.is-active {
    color: #2e5ef0;
  }

  i {
    font-size: 18px;
    line-height: 1;
  }

  &:first-child::after {
    content: '';
    position: absolute;
    top: 3px;
    right: -6px;
    width: 1px;
    height: 12px;
    background: #e6e8ed;
  }
}

.middleware-figma-table {
  flex: 1;
  min-height: 0;

  :deep(.el-table) {
    --el-table-border-color: #edeef3;
    --el-table-header-bg-color: #f5f6f9;
    --el-table-row-hover-bg-color: #f8faff;
    height: 100%;
  }

  :deep(.el-table__inner-wrapper) {
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  :deep(.el-table__inner-wrapper::before) {
    display: none;
  }

  :deep(.el-table__body-wrapper) {
    flex: 1;
    min-height: 0;
  }

  :deep(.el-table__body tr) {
    cursor: pointer;
  }

  :deep(th.el-table__cell) {
    height: 46px;
    padding: 0;
    background: #f5f6f9;
    color: #151b26;
    font-weight: 600;
  }

  :deep(td.el-table__cell) {
    height: 46px;
    padding: 0;
    color: #444a57;
  }

  :deep(.cell) {
    line-height: 22px;
  }
}

.middleware-figma-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;

  &.is-blue {
    background: #ebf0ff;
    color: #2e5ef0;
  }

  &.is-cyan {
    background: #e4f5ff;
    color: #1c96d6;
  }

  &.is-green {
    background: #d5f7d7;
    color: #36b23e;
  }

  &.is-orange {
    background: #fff1df;
    color: #ff8a00;
  }

  &.is-violet {
    background: #f1eaff;
    color: #7a45ff;
  }

  &.is-gray {
    background: #f0f2f5;
    color: #858a99;
  }
}

.middleware-figma-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.middleware-figma-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  padding: 0;
  border: 0;
  background: transparent;
  color: #6d7485;
  cursor: pointer;
  transition: color 0.2s ease;

  &:hover {
    color: #2e5ef0;
  }

  &.is-danger:hover {
    color: #f56c6c;
  }

  i {
    font-size: 16px;
    line-height: 1;
  }
}

.middleware-figma-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
}

.middleware-figma-pagination__summary {
  flex-shrink: 0;
  color: #444a57;
  font-size: 14px;
  line-height: 22px;
}

.middleware-figma-pagination__controls {
  min-width: 0;

  :deep(.el-pagination) {
    justify-content: flex-end;
    flex-wrap: wrap;
    row-gap: 12px;
  }

  :deep(.btn-prev),
  :deep(.btn-next),
  :deep(.el-pager li),
  :deep(.el-pagination__sizes .el-select .el-input__wrapper),
  :deep(.el-pagination__jump .el-input__wrapper) {
    min-width: 28px;
    height: 28px;
    border-radius: 4px;
    box-shadow: none;
  }

  :deep(.btn-prev),
  :deep(.btn-next),
  :deep(.el-pager li) {
    background: #f5f6f9;
    color: #444a57;
  }

  :deep(.el-pager li.is-active) {
    background: #2e5ef0;
    color: #ffffff;
  }

  :deep(.el-pagination__sizes) {
    margin-left: auto;
  }
}

.middleware-figma-field {
  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    display: flex;
    align-items: center;
    height: 32px;
    min-height: 32px;
    padding: 5px 12px;
    background: #f5f6f9;
    border-radius: 4px;
    box-shadow: none;
  }

  :deep(.el-input__inner),
  :deep(.el-select__placeholder),
  :deep(.el-select__selected-item) {
    font-size: 14px;
    line-height: 22px;
  }

  :deep(.el-input__inner) {
    height: 22px;
  }

  :deep(.el-input__inner::placeholder) {
    color: #858a99;
  }
}

@media only screen and (max-width: 991px) {
  .middleware-figma-toolbar-actions {
    justify-content: space-between;
    width: 100%;
  }

  .middleware-figma-field,
  .middleware-figma-field--keyword,
  .middleware-figma-search,
  .middleware-figma-reset {
    width: 100%;
  }

  .middleware-figma-pagination {
    flex-wrap: wrap;
    gap: 12px;
  }

  .middleware-figma-pagination__controls {
    width: 100%;
  }

  .middleware-figma-pagination__controls :deep(.el-pagination__sizes) {
    margin-left: 0;
  }
}
</style>
