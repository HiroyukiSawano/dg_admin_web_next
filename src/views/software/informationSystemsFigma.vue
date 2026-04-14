<template>
  <figma-resource-shell
    hide-tabs
    frame-variant="platform"
    variant="software-list"
    :stats="softwareStatCards"
    :stats-decoration="statsDecoration"
    :stats-decoration-image="statsDecorationImage"
    :stats-loading="statsLoading"
  >
    <template #filters>
      <div class="software-figma-toolbar">
        <el-input
          v-model="queryForm.keyword"
          clearable
          class="software-figma-field software-figma-field--keyword"
          :placeholder="t('ec.software.common.searchPlaceholder')"
          @keyup.enter="handleSearch"
        />
        <el-select
          v-model="queryForm.systemType"
          clearable
          class="software-figma-field"
          :placeholder="t('ec.software.form.systemTypePlaceholder')"
        >
          <el-option
            v-for="item in systemTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="queryForm.deploymentArchitecture"
          clearable
          class="software-figma-field"
          :placeholder="t('ec.software.form.deploymentArchitecturePlaceholder')"
        >
          <el-option
            v-for="item in deploymentArchitectureOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button class="software-figma-search" type="primary" @click="handleSearch">
          {{ t('ec.global.button.text.search') }}
        </el-button>
        <el-button class="software-figma-reset" @click="handleReset">
          {{ t('ec.global.button.text.reset') }}
        </el-button>
      </div>
    </template>

    <template #actions>
      <div class="software-figma-toolbar-actions">
        <el-button class="software-figma-primary" type="primary" @click="router.push('/software/informationSystems/create')">
          {{ isZhLocale ? '新增软件' : t('ec.software.common.create') }}
        </el-button>
        <div class="software-figma-view-switch" aria-hidden="true">
          <button class="software-figma-view-switch__button is-active" type="button" tabindex="-1">
            <i class="ri-list-check-2"></i>
          </button>
          <button class="software-figma-view-switch__button" type="button" tabindex="-1">
            <i class="ri-layout-grid-line"></i>
          </button>
        </div>
      </div>
    </template>

    <el-table
      v-loading="tableLoading"
      :data="tableData"
      height="100%"
      @row-click="handleRowClick"
      row-key="id"
      class="software-figma-table"
    >
      <el-table-column
        type="index"
        width="48"
        :label="t('ec.organization.figma.table.index')"
        :index="indexMethod"
      />
      <el-table-column
        prop="code"
        :label="t('ec.software.common.code')"
        min-width="146"
        show-overflow-tooltip
      />
      <el-table-column
        prop="name"
        :label="t('ec.software.common.name')"
        min-width="109"
        show-overflow-tooltip
      />
      <el-table-column
        prop="versionNo"
        :label="t('ec.software.common.versionNo')"
        min-width="109"
        show-overflow-tooltip
      />
      <el-table-column
        :label="deploymentArchitectureColumnLabel"
        min-width="109"
      >
        <template #default="{ row }">
          {{ getDeploymentArchitectureLabel(row.deploymentArchitecture) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="ownerName"
        :label="t('ec.software.common.owner')"
        min-width="109"
        show-overflow-tooltip
      />
      <el-table-column
        prop="contactPhone"
        :label="t('ec.software.common.contactPhone')"
        min-width="129"
        show-overflow-tooltip
      />
      <el-table-column
        :label="systemTypeColumnLabel"
        min-width="138"
      >
        <template #default="{ row }">
          <span class="software-figma-tag" :class="`is-${getSystemTypeVisual(row.systemType).tone}`">
            {{ getSystemTypeVisual(row.systemType).label }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('ec.software.common.actions')"
        fixed="right"
        width="116"
      >
        <template #default="{ row }">
          <div class="software-figma-actions">
            <button
              class="software-figma-icon-button"
              type="button"
              :title="t('ec.software.common.detail')"
              @click.stop="handleDetailClick(row)"
            >
              <i class="ri-eye-line"></i>
            </button>
            <button class="software-figma-icon-button" type="button" @click.stop="router.push(`/software/informationSystems/${row.id}/edit`)">
              <i class="ri-edit-line"></i>
            </button>
            <button class="software-figma-icon-button is-danger" type="button" @click.stop="handleDelete(row)">
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="t('ec.software.common.empty')" />
      </template>
    </el-table>

    <template #pagination>
      <div class="software-figma-pagination">
        <div class="software-figma-pagination__summary">{{ pageSummaryText }}</div>
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          background
          class="software-figma-pagination__controls"
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
import {
  deleteInformationSystem,
  getInformationSystemList,
  getInformationSystemStats,
} from '@/services/modules/softwareService'
import statsDecoration from '@/assets/images/organization/software-stats-mask.svg'
import statsDecorationImage from '@/assets/images/organization/software-stats-image.png'
import totalIcon from '@/assets/images/organization/software-stat-total.svg'
import externalServiceIcon from '@/assets/images/organization/software-stat-external-service.svg'
import internalOfficeIcon from '@/assets/images/organization/software-stat-internal-office.svg'
import databaseSoftwareIcon from '@/assets/images/organization/software-stat-database-software.svg'
import basicSupportIcon from '@/assets/images/organization/software-stat-basic-support.svg'
import securitySoftwareIcon from '@/assets/images/organization/software-stat-security-software.svg'
import FigmaResourceShell from '@/views/organization/components/FigmaResourceShell.vue'

defineOptions({ name: 'SoftwareAssetsFigma' })

const { locale, t } = useI18n()
const router = useRouter()
const { device } = storeToRefs(useSystemStore())

const tableLoading = ref(false)
const statsLoading = ref(false)
const tableData = ref([])

const queryForm = reactive({
  keyword: '',
  systemType: '',
  deploymentArchitecture: '',
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 8,
  pageSizes: [8, 10, 20, 50, 100],
  total: 0,
})

const statValues = reactive({
  total: 0,
  externalService: 0,
  internalOffice: 0,
  databaseSoftware: 0,
  basicSupport: 0,
  securitySoftware: 0,
})

const isZhLocale = computed(() => String(locale.value || '').startsWith('zh'))

const systemTypeColumnLabel = computed(() => {
  return isZhLocale.value ? '软件类型' : t('ec.software.common.systemType')
})

const deploymentArchitectureColumnLabel = computed(() => {
  return isZhLocale.value ? '部署架构' : t('ec.software.common.deploymentArchitecture')
})

const systemTypeOptions = computed(() => ([
  { value: 'EXTERNAL_SERVICE', label: t('ec.software.type.externalService') },
  { value: 'INTERNAL_OFFICE', label: t('ec.software.type.internalOffice') },
  { value: 'DATABASE_SOFTWARE', label: t('ec.software.type.databaseSoftware') },
  { value: 'BASIC_SUPPORT', label: t('ec.software.type.basicSupport') },
  { value: 'SECURITY_SOFTWARE', label: t('ec.software.type.securitySoftware') },
]))

const systemTypeVisualMap = computed(() => ({
  EXTERNAL_SERVICE: { label: t('ec.software.type.externalService'), tone: 'blue' },
  INTERNAL_OFFICE: { label: t('ec.software.type.internalOffice'), tone: 'orange' },
  DATABASE_SOFTWARE: { label: t('ec.software.type.databaseSoftware'), tone: 'violet' },
  BASIC_SUPPORT: { label: isZhLocale.value ? '支撑系统' : t('ec.software.type.basicSupport'), tone: 'green' },
  SECURITY_SOFTWARE: { label: t('ec.software.type.securitySoftware'), tone: 'orange' },
}))

const deploymentArchitectureMap = computed(() => ({
  SINGLE: t('ec.software.deployment.single'),
  CLUSTER: t('ec.software.deployment.cluster'),
  CONTAINERIZED: t('ec.software.deployment.containerized'),
}))

const deploymentArchitectureOptions = computed(() => ([
  { value: 'SINGLE', label: t('ec.software.deployment.single') },
  { value: 'CLUSTER', label: t('ec.software.deployment.cluster') },
  { value: 'CONTAINERIZED', label: t('ec.software.deployment.containerized') },
]))

const paginationLayout = computed(() => {
  return device.value === 'mobile' ? 'prev, pager, next' : 'sizes, prev, pager, next, jumper'
})

const pageCount = computed(() => {
  const total = Number(pagination.total || 0)
  const pageSize = Number(pagination.pageSize || 8)
  return Math.max(1, Math.ceil(total / pageSize))
})

const pageSummaryText = computed(() => {
  return isZhLocale.value ? `共${pageCount.value}页` : `${pageCount.value} pages`
})

const softwareStatCards = computed(() => ([
  {
    key: 'total',
    label: isZhLocale.value ? '软件总数' : 'Total Software',
    value: statValues.total,
    iconUrl: totalIcon,
    tone: 'primary',
  },
  {
    key: 'external-service',
    label: isZhLocale.value ? '对外服务' : 'External Service',
    value: statValues.externalService,
    iconUrl: externalServiceIcon,
    tone: 'primary',
  },
  {
    key: 'internal-office',
    label: isZhLocale.value ? '内部办公' : 'Internal Office',
    value: statValues.internalOffice,
    iconUrl: internalOfficeIcon,
    tone: 'primary',
  },
  {
    key: 'database-software',
    label: isZhLocale.value ? '数据库软件' : 'Database Software',
    value: statValues.databaseSoftware,
    iconUrl: databaseSoftwareIcon,
    tone: 'primary',
  },
  {
    key: 'basic-support',
    label: isZhLocale.value ? '基础支撑' : 'Basic Support',
    value: statValues.basicSupport,
    iconUrl: basicSupportIcon,
    tone: 'primary',
  },
  {
    key: 'security-software',
    label: isZhLocale.value ? '安全软件' : 'Security Software',
    value: statValues.securitySoftware,
    iconUrl: securitySoftwareIcon,
    tone: 'primary',
  },
]))

const indexMethod = (index) => {
  return (pagination.currentPage - 1) * pagination.pageSize + index + 1
}

const getSystemTypeVisual = (value) => {
  return systemTypeVisualMap.value[value] || { label: value || '-', tone: 'blue' }
}

const getDeploymentArchitectureLabel = (value) => {
  return deploymentArchitectureMap.value[value] || value || '-'
}

const resetStats = () => {
  statValues.total = 0
  statValues.externalService = 0
  statValues.internalOffice = 0
  statValues.databaseSoftware = 0
  statValues.basicSupport = 0
  statValues.securitySoftware = 0
}

const loadData = async () => {
  tableLoading.value = true
  try {
    const pageData = await getInformationSystemList({
      pageNo: pagination.currentPage,
      pageSize: pagination.pageSize,
      keyword: queryForm.keyword || undefined,
      systemType: queryForm.systemType || undefined,
      deploymentArchitecture: queryForm.deploymentArchitecture || undefined,
    })
    tableData.value = Array.isArray(pageData.records) ? pageData.records : []
    pagination.total = Number(pageData.total || 0)
  } catch (error) {
    ElMessage.error(error.message || t('ec.software.message.loadFailed'))
  } finally {
    tableLoading.value = false
  }
}

const loadStats = async () => {
  statsLoading.value = true
  try {
    const stats = await getInformationSystemStats()
    statValues.total = Number(stats.total || 0)
    statValues.externalService = Number(stats.externalService || 0)
    statValues.internalOffice = Number(stats.internalOffice || 0)
    statValues.databaseSoftware = Number(stats.databaseSoftware || 0)
    statValues.basicSupport = Number(stats.basicSupport || 0)
    statValues.securitySoftware = Number(stats.securitySoftware || 0)
  } catch (error) {
    resetStats()
    ElMessage.error(error.message || t('ec.software.message.statsFailed'))
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
  queryForm.systemType = ''
  queryForm.deploymentArchitecture = ''
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

const handleDetailClick = (row) => {
  router.push(`/software/informationSystems/${row.id}/detail`)
}

const handleRowClick = (row) => {
  handleDetailClick(row)
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('ec.software.common.deleteConfirm', { name: row.name || row.code }),
      t('ec.global.common.tip'),
      { type: 'warning' },
    )
    await deleteInformationSystem(row.id)
    ElMessage.success(t('ec.software.common.deleteSuccess'))
    if (tableData.value.length === 1 && pagination.currentPage > 1) {
      pagination.currentPage -= 1
    }
    await Promise.all([loadData(), loadStats()])
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error(error.message || t('ec.software.common.deleteFailed'))
    }
  }
}

onMounted(async () => {
  await Promise.all([loadData(), loadStats()])
})
</script>

<style lang="scss" scoped>
.software-figma-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

.software-figma-field {
  width: 200px;
}

.software-figma-field--keyword {
  width: 200px;
}

.software-figma-search {
  min-width: 52px;
  height: 32px;
  padding-inline: 12px;
  border: 0;
  border-radius: 4px;
  background: #2e5ef0;
  box-shadow: none;
  font-size: 14px;
}

.software-figma-reset {
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

.software-figma-toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.software-figma-primary {
  min-width: 96px;
  height: 32px;
  padding-inline: 12px;
  border: 0;
  border-radius: 4px;
  background: #2e5ef0;
  box-shadow: none;
  font-size: 14px;
}

.software-figma-view-switch {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #7c8393;
}

.software-figma-view-switch__button {
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

.software-figma-table {
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

.software-figma-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 68px;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;

  &.is-blue {
    background: #ebf0ff;
    color: #2e5ef0;
  }

  &.is-orange {
    background: #fff1df;
    color: #ff8a00;
  }

  &.is-violet {
    background: #f1eaff;
    color: #7a45ff;
  }

  &.is-green {
    background: #d5f7d7;
    color: #36b23e;
  }
}

.software-figma-actions {
  display: flex;
  align-items: center;
  gap: 18px;
}

.software-figma-icon-button {
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

.software-figma-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
}

.software-figma-pagination__summary {
  flex-shrink: 0;
  color: #444a57;
  font-size: 14px;
  line-height: 22px;
}

.software-figma-pagination__controls {
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

.software-figma-field {
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
  .software-figma-toolbar-actions {
    justify-content: space-between;
    width: 100%;
  }

  .software-figma-field,
  .software-figma-field--keyword,
  .software-figma-search,
  .software-figma-reset {
    width: 100%;
  }

  .software-figma-pagination {
    flex-wrap: wrap;
    gap: 12px;
  }

  .software-figma-pagination__controls {
    width: 100%;
  }

  .software-figma-pagination__controls :deep(.el-pagination__sizes) {
    margin-left: 0;
  }
}
</style>
