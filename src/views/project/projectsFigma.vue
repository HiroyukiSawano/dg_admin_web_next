<template>
  <figma-resource-shell
    hide-tabs
    frame-variant="platform"
    variant="project-list"
    :stats="projectStatCards"
    :stats-decoration="statsDecoration"
    :stats-decoration-image="statsDecorationImage"
    :stats-loading="statsLoading"
  >
    <template #filters>
      <div class="project-figma-toolbar">
        <el-input
          v-model="queryForm.keyword"
          clearable
          class="project-figma-field project-figma-field--keyword"
          :placeholder="t('ec.project.form.keywordPlaceholder')"
          @keyup.enter="handleSearch"
        />
        <el-select
          v-model="queryForm.projectType"
          clearable
          class="project-figma-field"
          :placeholder="t('ec.project.form.projectTypePlaceholder')"
        >
          <el-option
            v-for="item in projectTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="queryForm.paymentStatus"
          clearable
          class="project-figma-field"
          :placeholder="t('ec.project.form.paymentStatusPlaceholder')"
        >
          <el-option
            v-for="item in paymentStatusOptions"
            :key="item.value"
            :label="item.displayLabel"
            :value="item.value"
          />
        </el-select>
        <el-button class="project-figma-search" type="primary" @click="handleSearch">
          {{ t('ec.global.button.text.search') }}
        </el-button>
        <el-button class="project-figma-reset" @click="handleReset">
          {{ t('ec.global.button.text.reset') }}
        </el-button>
      </div>
    </template>

    <template #actions>
      <div class="project-figma-toolbar-actions">
        <el-button class="project-figma-primary" type="primary" @click="router.push('/project/projects/create')">
          {{ isZhLocale ? '新增项目' : t('ec.project.common.create') }}
        </el-button>
        <div class="project-figma-view-switch" aria-hidden="true">
          <button class="project-figma-view-switch__button is-active" type="button" tabindex="-1">
            <i class="ri-list-check-2"></i>
          </button>
          <button class="project-figma-view-switch__button" type="button" tabindex="-1">
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
      class="project-figma-table"
    >
      <el-table-column
        type="index"
        width="48"
        :label="t('ec.organization.figma.table.index')"
        :index="indexMethod"
      />
      <el-table-column
        prop="code"
        :label="t('ec.project.common.code')"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="name"
        :label="t('ec.project.common.name')"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="approvalBatchNo"
        :label="t('ec.project.common.approvalBatchNo')"
        min-width="110"
        show-overflow-tooltip
      />
      <el-table-column :label="budgetColumnLabel" min-width="157">
        <template #default="{ row }">
          {{ formatAmount(row.projectBudget) }}
        </template>
      </el-table-column>
      <el-table-column :label="contractAmountColumnLabel" min-width="176">
        <template #default="{ row }">
          {{ formatAmount(row.contractAmount) }}
        </template>
      </el-table-column>
      <el-table-column :label="typeColumnLabel" min-width="92">
        <template #default="{ row }">
          <span class="project-figma-tag">
            {{ getProjectTypeVisual(row.projectType).label }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="statusColumnLabel" min-width="91">
        <template #default="{ row }">
          <span class="project-figma-status">{{ getProjectStatusText(row.projectStatus) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('ec.project.common.actions')"
        fixed="right"
        width="116"
      >
        <template #default="{ row }">
          <div class="project-figma-actions">
            <button class="project-figma-icon-button" type="button" @click="router.push(`/project/projects/${row.id}/edit`)">
              <i class="ri-edit-line"></i>
            </button>
            <button class="project-figma-icon-button is-danger" type="button" @click="handleDelete(row)">
              <i class="ri-delete-bin-line"></i>
            </button>
            <el-dropdown trigger="click" @command="(command) => handleRowCommand(command, row)">
              <button class="project-figma-icon-button" type="button">
                <i class="ri-more-line"></i>
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="detail">{{ t('ec.project.common.detail') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="t('ec.project.common.empty')" />
      </template>
    </el-table>

    <template #pagination>
      <div class="project-figma-pagination">
        <div class="project-figma-pagination__summary">{{ pageSummaryText }}</div>
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          background
          class="project-figma-pagination__controls"
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
import { getStatusDictionaries } from '@/services/modules/dictionaryService'
import { buildStatusOptionMap } from '@/utils/statusDictionary'
import { deleteProject, getProjectList, getProjectStats } from '@/services/modules/projectService'
import { formatAmount, getStatusLabel } from './helpers'
import statsDecoration from '@/assets/images/organization/project-stats-mask.svg'
import statsDecorationImage from '@/assets/images/organization/project-stats-image.png'
import totalIcon from '@/assets/images/organization/project-stat-total.svg'
import newBuildIcon from '@/assets/images/organization/project-stat-new-build.svg'
import softwareUpgradeIcon from '@/assets/images/organization/project-stat-software-upgrade.svg'
import opsProjectIcon from '@/assets/images/organization/project-stat-ops-project.svg'
import servicePurchaseIcon from '@/assets/images/organization/project-stat-service-purchase.svg'
import hardwarePurchaseIcon from '@/assets/images/organization/project-stat-hardware-purchase.svg'
import integrationProjectIcon from '@/assets/images/organization/project-stat-integration-project.svg'
import FigmaResourceShell from '@/views/organization/components/FigmaResourceShell.vue'

defineOptions({ name: 'ProjectAssetsFigma' })

const { locale, t } = useI18n()
const router = useRouter()
const { device } = storeToRefs(useSystemStore())

const tableLoading = ref(false)
const statsLoading = ref(false)
const tableData = ref([])
const statusDictionaries = ref({})

const queryForm = reactive({
  keyword: '',
  projectType: '',
  paymentStatus: '',
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 8,
  pageSizes: [8, 10, 20, 50, 100],
  total: 0,
})

const statValues = reactive({
  total: 0,
  newBuild: 0,
  softwareUpgrade: 0,
  opsProject: 0,
  servicePurchase: 0,
  hardwarePurchase: 0,
  integrationProject: 0,
})

const isZhLocale = computed(() => String(locale.value || '').startsWith('zh'))

const budgetColumnLabel = computed(() => {
  return isZhLocale.value ? '项目预算（万元）' : 'Project Budget (10k CNY)'
})

const contractAmountColumnLabel = computed(() => {
  return isZhLocale.value ? '项目合同金额（万元）' : 'Contract Amount (10k CNY)'
})

const typeColumnLabel = computed(() => {
  return isZhLocale.value ? '类型' : t('ec.project.common.projectType')
})

const statusColumnLabel = computed(() => {
  return isZhLocale.value ? '状态' : t('ec.project.common.projectStatus')
})

const projectTypeVisualMap = computed(() => ({
  NEW_BUILD: {
    label: isZhLocale.value ? '新建' : 'New Build',
  },
  SOFTWARE_UPGRADE: {
    label: isZhLocale.value ? '软件升级' : 'Software Upgrade',
  },
  OPS_PROJECT: {
    label: isZhLocale.value ? '运维' : 'Operations',
  },
  SERVICE_PURCHASE: {
    label: isZhLocale.value ? '购买服务' : 'Service Purchase',
  },
  HARDWARE_PURCHASE: {
    label: isZhLocale.value ? '硬件采购' : 'Hardware Purchase',
  },
  INTEGRATION_PROJECT: {
    label: isZhLocale.value ? '集成项目' : 'Integration Project',
  },
}))

const projectTypeOptions = computed(() => ([
  { value: 'NEW_BUILD', label: isZhLocale.value ? '新建' : 'New Build' },
  { value: 'SOFTWARE_UPGRADE', label: isZhLocale.value ? '软件升级' : 'Software Upgrade' },
  { value: 'OPS_PROJECT', label: isZhLocale.value ? '运维项目' : 'Operations Project' },
  { value: 'SERVICE_PURCHASE', label: isZhLocale.value ? '购买服务' : 'Service Purchase' },
  { value: 'HARDWARE_PURCHASE', label: isZhLocale.value ? '硬件采购' : 'Hardware Purchase' },
  { value: 'INTEGRATION_PROJECT', label: isZhLocale.value ? '集成项目' : 'Integration Project' },
]))

const projectStatusMap = computed(() => {
  return buildStatusOptionMap(statusDictionaries.value.projectStatus, locale.value)
})

const paymentStatusOptions = computed(() => {
  return Object.values(buildStatusOptionMap(statusDictionaries.value.paymentStatus, locale.value))
})

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

const projectStatCards = computed(() => ([
  {
    key: 'total',
    label: isZhLocale.value ? '项目总数' : 'Total Projects',
    value: statValues.total,
    iconUrl: totalIcon,
    tone: 'primary',
  },
  {
    key: 'new-build',
    label: isZhLocale.value ? '新建项目' : 'New Projects',
    value: statValues.newBuild,
    iconUrl: newBuildIcon,
    tone: 'primary',
  },
  {
    key: 'software-upgrade',
    label: isZhLocale.value ? '软件升级' : 'Software Upgrade',
    value: statValues.softwareUpgrade,
    iconUrl: softwareUpgradeIcon,
    tone: 'primary',
  },
  {
    key: 'ops-project',
    label: isZhLocale.value ? '运维项目' : 'Operations Projects',
    value: statValues.opsProject,
    iconUrl: opsProjectIcon,
    tone: 'primary',
  },
  {
    key: 'service-purchase',
    label: isZhLocale.value ? '购买服务' : 'Service Purchase',
    value: statValues.servicePurchase,
    iconUrl: servicePurchaseIcon,
    tone: 'primary',
  },
  {
    key: 'hardware-purchase',
    label: isZhLocale.value ? '硬件采购' : 'Hardware Purchase',
    value: statValues.hardwarePurchase,
    iconUrl: hardwarePurchaseIcon,
    tone: 'primary',
  },
  {
    key: 'integration-project',
    label: isZhLocale.value ? '集成项目' : 'Integration Project',
    value: statValues.integrationProject,
    iconUrl: integrationProjectIcon,
    tone: 'primary',
  },
]))

const indexMethod = (index) => {
  return (pagination.currentPage - 1) * pagination.pageSize + index + 1
}

const getProjectTypeVisual = (value) => {
  return projectTypeVisualMap.value[value] || {
    label: value || '-',
  }
}

const getProjectStatusText = (value) => {
  return getStatusLabel(value, projectStatusMap.value) || '-'
}

const resetStats = () => {
  statValues.total = 0
  statValues.newBuild = 0
  statValues.softwareUpgrade = 0
  statValues.opsProject = 0
  statValues.servicePurchase = 0
  statValues.hardwarePurchase = 0
  statValues.integrationProject = 0
}

const loadStatusOptions = async () => {
  statusDictionaries.value = await getStatusDictionaries()
}

const loadData = async () => {
  tableLoading.value = true
  try {
    const pageData = await getProjectList({
      pageNo: pagination.currentPage,
      pageSize: pagination.pageSize,
      keyword: queryForm.keyword || undefined,
      projectType: queryForm.projectType || undefined,
      paymentStatus: queryForm.paymentStatus || undefined,
    })
    tableData.value = Array.isArray(pageData.records) ? pageData.records : []
    pagination.total = Number(pageData.total || 0)
  } catch (error) {
    ElMessage.error(error.message || t('ec.project.message.loadFailed'))
  } finally {
    tableLoading.value = false
  }
}

const loadStats = async () => {
  statsLoading.value = true
  try {
    const stats = await getProjectStats()
    statValues.total = Number(stats.total || 0)
    statValues.newBuild = Number(stats.newBuild || 0)
    statValues.softwareUpgrade = Number(stats.softwareUpgrade || 0)
    statValues.opsProject = Number(stats.opsProject || 0)
    statValues.servicePurchase = Number(stats.servicePurchase || 0)
    statValues.hardwarePurchase = Number(stats.hardwarePurchase || 0)
    statValues.integrationProject = Number(stats.integrationProject || 0)
  } catch (error) {
    resetStats()
    ElMessage.error(error.message || t('ec.project.message.statsFailed'))
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
  queryForm.projectType = ''
  queryForm.paymentStatus = ''
  pagination.currentPage = 1
  loadData()
}

const handlePageChange = (page) => {
  pagination.currentPage = page
  loadData()
}

const handlePageSizeChange = (pageSize) => {
  pagination.pageSize = pageSize
  pagination.currentPage = 1
  loadData()
}

const handleRowCommand = (command, row) => {
  if (command === 'detail') {
    router.push(`/project/projects/${row.id}/detail`)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('ec.project.common.deleteConfirm', { name: row.name || row.code }),
      t('ec.global.common.tip'),
      { type: 'warning' },
    )
    await deleteProject(row.id)
    ElMessage.success(t('ec.project.common.deleteSuccess'))
    if (tableData.value.length === 1 && pagination.currentPage > 1) {
      pagination.currentPage -= 1
    }
    await Promise.all([loadData(), loadStats()])
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error(error.message || t('ec.project.common.deleteFailed'))
    }
  }
}

onMounted(async () => {
  await loadStatusOptions()
  await Promise.all([loadData(), loadStats()])
})
</script>

<style lang="scss" scoped>
.project-figma-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

.project-figma-field {
  width: 200px;
}

.project-figma-field--keyword {
  width: 200px;
}

.project-figma-search {
  min-width: 52px;
  height: 32px;
  padding-inline: 12px;
  border: 0;
  border-radius: 4px;
  background: #2e5ef0;
  box-shadow: none;
  font-size: 14px;
}

.project-figma-reset {
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

.project-figma-toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-figma-primary {
  min-width: 80px;
  height: 32px;
  padding-inline: 12px;
  border: 0;
  border-radius: 4px;
  background: #2e5ef0;
  box-shadow: none;
  font-size: 14px;
}

.project-figma-view-switch {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #7c8393;
}

.project-figma-view-switch__button {
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

.project-figma-table {
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

.project-figma-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 40px;
  padding: 2px 8px;
  border-radius: 2px;
  background: #ebf0ff;
  color: #2e5ef0;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
}

.project-figma-status {
  color: #444a57;
  font-size: 14px;
  line-height: 22px;
}

.project-figma-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.project-figma-icon-button {
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

.project-figma-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
}

.project-figma-pagination__summary {
  flex-shrink: 0;
  color: #444a57;
  font-size: 14px;
  line-height: 22px;
}

.project-figma-pagination__controls {
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

.project-figma-field {
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
  .project-figma-toolbar-actions {
    justify-content: space-between;
    width: 100%;
  }

  .project-figma-field,
  .project-figma-field--keyword,
  .project-figma-search,
  .project-figma-reset {
    width: 100%;
  }

  .project-figma-pagination {
    flex-wrap: wrap;
    gap: 12px;
  }

  .project-figma-pagination__controls {
    width: 100%;
  }

  .project-figma-pagination__controls :deep(.el-pagination__sizes) {
    margin-left: 0;
  }
}
</style>
