<template>
  <figma-resource-shell
    active-tab="persons"
    frame-variant="platform"
    variant="person-list"
    :stats="personStatCards"
    :stats-decoration="statsDecoration"
    :stats-decoration-image="statsDecorationImage"
    :stats-loading="statsLoading"
  >
    <template #filters>
      <div class="organization-figma-toolbar">
        <el-input
          v-model="queryForm.keyword"
          clearable
          class="organization-figma-field organization-figma-field--keyword"
          :placeholder="t('ec.organization.person.form.keywordPlaceholder')"
          @keyup.enter="handleSearch"
        />
        <el-select
          v-model="queryForm.serviceProviderId"
          clearable
          filterable
          class="organization-figma-field"
          :placeholder="t('ec.organization.person.form.serviceProviderPlaceholder')"
        >
          <el-option
            v-for="item in serviceProviderOptions"
            :key="item.id"
            :label="item.displayLabel"
            :value="item.id"
          />
        </el-select>
        <el-select
          v-model="queryForm.personType"
          clearable
          class="organization-figma-field"
          :placeholder="t('ec.organization.person.form.personTypePlaceholder')"
        >
          <el-option
            v-for="item in personTypeFilterOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-tree-select
          v-model="queryForm.departmentId"
          clearable
          check-strictly
          node-key="id"
          class="organization-figma-field"
          :data="departmentOptions"
          :props="{ label: 'name', children: 'children' }"
          :placeholder="t('ec.organization.person.form.departmentPlaceholder')"
        />
        <el-button class="organization-figma-search" type="primary" @click="handleSearch">
          {{ t('ec.global.button.text.search') }}
        </el-button>
        <el-button class="organization-figma-reset" @click="handleReset">
          {{ t('ec.global.button.text.reset') }}
        </el-button>
      </div>
    </template>

    <template #actions>
      <div class="organization-figma-toolbar-actions">
        <el-button class="organization-figma-primary" type="primary" @click="router.push('/organization/persons/create')">
          {{ t('ec.organization.common.create') }}
        </el-button>
        <div class="organization-figma-view-switch" aria-hidden="true">
          <button class="organization-figma-view-switch__button is-active" type="button" tabindex="-1">
            <i class="ri-list-check-2"></i>
          </button>
          <button class="organization-figma-view-switch__button" type="button" tabindex="-1">
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
      class="organization-figma-table"
    >
      <el-table-column
        type="index"
        width="64"
        :label="t('ec.organization.figma.table.index')"
        :index="indexMethod"
      />
      <el-table-column
        prop="name"
        :label="t('ec.organization.common.name')"
        min-width="146"
        show-overflow-tooltip
      />
      <el-table-column
        prop="employeeNo"
        :label="t('ec.organization.person.table.employeeNo')"
        min-width="148"
        show-overflow-tooltip
      />
      <el-table-column
        prop="gender"
        :label="t('ec.organization.person.table.gender')"
        width="74"
        show-overflow-tooltip
      />
      <el-table-column
        prop="idCardNo"
        :label="t('ec.organization.person.table.idCardNo')"
        min-width="198"
        show-overflow-tooltip
      />
      <el-table-column
        prop="mobile"
        :label="t('ec.organization.person.table.mobile')"
        min-width="154"
        show-overflow-tooltip
      />
      <el-table-column
        prop="serviceProviderName"
        :label="t('ec.organization.person.table.serviceProviderName')"
        min-width="210"
        show-overflow-tooltip
      />
      <el-table-column
        :label="personTypeColumnLabel"
        min-width="120"
      >
        <template #default="{ row }">
          <span class="organization-figma-tag" :class="`is-${getPersonTypeVisual(row.personType).tone}`">
            {{ getPersonTypeVisual(row.personType).label }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('ec.organization.common.actions')"
        fixed="right"
        width="116"
      >
        <template #default="{ row }">
          <div class="organization-figma-actions">
            <button class="organization-figma-icon-button" type="button" @click="router.push(`/organization/persons/${row.id}/edit`)">
              <i class="ri-edit-line"></i>
            </button>
            <button class="organization-figma-icon-button is-danger" type="button" @click="handleDelete(row)">
              <i class="ri-delete-bin-line"></i>
            </button>
            <el-dropdown trigger="click" @command="(command) => handleRowCommand(command, row)">
              <button class="organization-figma-icon-button" type="button">
                <i class="ri-more-line"></i>
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="detail">{{ t('ec.organization.common.detail') }}</el-dropdown-item>
                  <el-dropdown-item command="relations">{{ t('ec.organization.common.relations') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="t('ec.organization.common.empty')" />
      </template>
    </el-table>

    <template #pagination>
      <div class="organization-figma-pagination">
        <div class="organization-figma-pagination__summary">{{ pageSummaryText }}</div>
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          background
          class="organization-figma-pagination__controls"
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
  deletePerson,
  getOrganizationServiceProviderOptions,
  getPersonDepartmentOptions,
  getPersonList,
  getPersonStats,
} from '@/services/modules/organizationService'
import statsDecoration from '@/assets/images/organization/person-stats-mask.svg'
import statsDecorationImage from '@/assets/images/organization/person-stats-image.png'
import totalIcon from '@/assets/images/organization/person-stat-total.svg'
import developmentIcon from '@/assets/images/organization/person-stat-development.svg'
import opsIcon from '@/assets/images/organization/person-stat-ops.svg'
import hardwareOwnerIcon from '@/assets/images/organization/person-stat-hardware-owner.svg'
import FigmaResourceShell from './components/FigmaResourceShell.vue'

defineOptions({ name: 'OrganizationPersonsFigma' })

const { locale, t } = useI18n()
const router = useRouter()
const { device } = storeToRefs(useSystemStore())

const tableLoading = ref(false)
const statsLoading = ref(false)
const tableData = ref([])
const serviceProviderOptions = ref([])
const departmentOptions = ref([])

const personStatValues = reactive({
  total: 0,
  development: 0,
  ops: 0,
  hardwareOwners: 0,
})

const queryForm = reactive({
  keyword: '',
  serviceProviderId: null,
  departmentId: null,
  personType: '',
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 7,
  pageSizes: [7, 10, 20, 50, 100],
  total: 0,
})

const isZhLocale = computed(() => String(locale.value || '').startsWith('zh'))

const personTypeColumnLabel = computed(() => (isZhLocale.value ? '类型' : 'Type'))

const personTypeVisualMap = computed(() => ({
  DEV: {
    label: isZhLocale.value ? '软件开发' : 'Software Development',
    tone: 'blue',
  },
  SOFTWARE_DEVELOPMENT: {
    label: isZhLocale.value ? '软件开发' : 'Software Development',
    tone: 'blue',
  },
  OPS: {
    label: isZhLocale.value ? '运维服务' : 'Operations Service',
    tone: 'green',
  },
  OPERATIONS_SERVICE: {
    label: isZhLocale.value ? '运维服务' : 'Operations Service',
    tone: 'green',
  },
}))

const personTypeFilterOptions = computed(() => ([
  { value: 'DEV', label: personTypeVisualMap.value.DEV.label },
  { value: 'OPS', label: personTypeVisualMap.value.OPS.label },
]))

const paginationLayout = computed(() => {
  return device.value === 'mobile' ? 'prev, pager, next' : 'sizes, prev, pager, next, jumper'
})

const pageCount = computed(() => {
  const total = Number(pagination.total || 0)
  const pageSize = Number(pagination.pageSize || 10)
  return Math.max(1, Math.ceil(total / pageSize))
})

const pageSummaryText = computed(() => {
  return isZhLocale.value ? `共${pageCount.value}页` : `${pageCount.value} pages`
})

const personStatCards = computed(() => {
  return [
    {
      key: 'total',
      label: isZhLocale.value ? '人员总数' : 'Total Persons',
      value: personStatValues.total,
      iconUrl: totalIcon,
      tone: 'primary',
    },
    {
      key: 'development',
      label: isZhLocale.value ? '开发人员' : 'Development Personnel',
      value: personStatValues.development,
      iconUrl: developmentIcon,
      tone: 'primary',
    },
    {
      key: 'ops',
      label: isZhLocale.value ? '运维人员' : 'Operations Personnel',
      value: personStatValues.ops,
      iconUrl: opsIcon,
      tone: 'primary',
    },
    {
      key: 'hardware-owner',
      label: isZhLocale.value ? '硬件负责人' : 'Hardware Owner',
      value: personStatValues.hardwareOwners,
      iconUrl: hardwareOwnerIcon,
      tone: 'primary',
    },
  ]
})

const indexMethod = (index) => {
  return (pagination.currentPage - 1) * pagination.pageSize + index + 1
}

const getPersonTypeVisual = (value) => {
  return personTypeVisualMap.value[value] || {
    label: value || '-',
    tone: 'blue',
  }
}

const resetStats = () => {
  personStatValues.total = 0
  personStatValues.development = 0
  personStatValues.ops = 0
  personStatValues.hardwareOwners = 0
}

const loadServiceProviderOptions = async () => {
  const options = await getOrganizationServiceProviderOptions()
  serviceProviderOptions.value = options.map((item) => ({
    ...item,
    displayLabel: [item.name, item.code].filter(Boolean).join(' / ') || '-',
  }))
}

const loadDepartmentOptions = async () => {
  departmentOptions.value = await getPersonDepartmentOptions()
}

const loadData = async () => {
  tableLoading.value = true
  try {
    const pageData = await getPersonList({
      pageNo: pagination.currentPage,
      pageSize: pagination.pageSize,
      keyword: queryForm.keyword || undefined,
      serviceProviderId: queryForm.serviceProviderId || undefined,
      departmentId: queryForm.departmentId || undefined,
      personType: queryForm.personType || undefined,
    })
    tableData.value = Array.isArray(pageData.records) ? pageData.records : []
    pagination.total = Number(pageData.total || 0)
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.person.message.loadFailed'))
  } finally {
    tableLoading.value = false
  }
}

const loadStats = async () => {
  statsLoading.value = true
  try {
    const stats = await getPersonStats()
    personStatValues.total = Number(stats.total || 0)
    personStatValues.development = Number(stats.development || 0)
    personStatValues.ops = Number(stats.ops || 0)
    personStatValues.hardwareOwners = Number(stats.hardwareOwners || 0)
  } catch (error) {
    resetStats()
    ElMessage.error(error.message || t('ec.organization.person.figma.statsLoadFailed'))
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
  queryForm.serviceProviderId = null
  queryForm.departmentId = null
  queryForm.personType = ''
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
    router.push(`/organization/persons/${row.id}/detail`)
    return
  }
  if (command === 'relations') {
    router.push(`/organization/persons/${row.id}/relations`)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('ec.organization.common.deleteConfirm', { name: row.name || row.employeeNo }),
      t('ec.organization.common.delete'),
      {
        type: 'warning',
        confirmButtonText: t('ec.organization.common.delete'),
        cancelButtonText: t('ec.global.button.text.cancel'),
        confirmButtonClass: 'el-button--danger',
      },
    )

    await deletePerson(row.id)
    ElMessage.success(t('ec.organization.common.deleteSuccess'))
    await Promise.all([loadData(), loadStats()])
  } catch (error) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error.message || t('ec.organization.common.deleteFailed'))
  }
}

onMounted(async () => {
  try {
    await Promise.all([loadServiceProviderOptions(), loadDepartmentOptions()])
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.person.message.loadFailed'))
  }

  await loadData()
  loadStats()
})
</script>

<style lang="scss" scoped>
.organization-figma-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

.organization-figma-field {
  width: 160px;
}

.organization-figma-field--keyword {
  width: 200px;
}

.organization-figma-search {
  min-width: 52px;
  height: 32px;
  padding-inline: 12px;
  border: 0;
  border-radius: 4px;
  background: #2e5ef0;
  box-shadow: none;
  font-size: 14px;
}

.organization-figma-reset {
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

.organization-figma-toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.organization-figma-view-switch {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #7c8393;
}

.organization-figma-view-switch__button {
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

.organization-figma-primary {
  min-width: 84px;
  height: 32px;
  padding-inline: 12px;
  border: 0;
  border-radius: 4px;
  background: #2e5ef0;
  box-shadow: none;
  font-size: 14px;
}

.organization-figma-table {
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

.organization-figma-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  padding: 2px 8px;
  border-radius: 2px;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;

  &.is-blue {
    background: #ebf0ff;
    color: #2e5ef0;
  }

  &.is-green {
    background: #d5f7d7;
    color: #36b23e;
  }
}

.organization-figma-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.organization-figma-icon-button {
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

.organization-figma-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
}

.organization-figma-pagination__summary {
  flex-shrink: 0;
  color: #444a57;
  font-size: 14px;
  line-height: 22px;
}

.organization-figma-pagination__controls {
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

.organization-figma-field {
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
  .organization-figma-toolbar-actions {
    justify-content: space-between;
    width: 100%;
  }

  .organization-figma-field,
  .organization-figma-field--keyword {
    width: 100%;
  }

  .organization-figma-search {
    width: 100%;
  }

  .organization-figma-reset {
    width: 100%;
  }

  .organization-figma-pagination {
    flex-wrap: wrap;
    gap: 12px;

    &__controls {
      width: 100%;
    }

    :deep(.el-pagination__sizes) {
      margin-left: 0;
    }
  }
}
</style>
