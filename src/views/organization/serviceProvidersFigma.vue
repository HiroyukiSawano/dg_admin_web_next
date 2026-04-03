<template>
  <figma-resource-shell active-tab="serviceProviders" :stats="serviceProviderStatCards" :stats-loading="statsLoading">
    <template #filters>
      <div class="organization-figma-toolbar">
        <el-input
          v-model="queryForm.keyword"
          clearable
          class="organization-figma-field organization-figma-field--keyword"
          :placeholder="t('ec.organization.serviceProvider.form.keywordPlaceholder')"
          @keyup.enter="handleSearch"
        />
        <el-select
          v-model="queryForm.cooperationScope"
          clearable
          class="organization-figma-field"
          :placeholder="t('ec.organization.serviceProvider.form.cooperationScopePlaceholder')"
        >
          <el-option
            v-for="option in cooperationScopeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
        <el-select
          v-model="queryForm.vendorLevel"
          clearable
          class="organization-figma-field"
          :placeholder="t('ec.organization.serviceProvider.form.vendorLevelPlaceholder')"
        >
          <el-option
            v-for="item in vendorLevelOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button class="organization-figma-search" type="primary" @click="handleSearch">
          {{ t('ec.global.button.text.search') }}
        </el-button>
        <el-button class="organization-figma-reset" @click="handleReset">
          {{ t('ec.global.button.text.reset') }}
        </el-button>
      </div>
    </template>

    <template #actions>
      <el-button class="organization-figma-primary" type="primary" @click="router.push('/organization/service-providers/create')">
        {{ t('ec.organization.serviceProvider.figma.create') }}
      </el-button>
    </template>

    <el-table
      v-loading="tableLoading"
      :data="tableData"
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
        prop="code"
        :label="t('ec.organization.common.code')"
        min-width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="name"
        :label="t('ec.organization.common.name')"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="unifiedSocialCreditCode"
        :label="t('ec.organization.serviceProvider.table.unifiedSocialCreditCode')"
        min-width="220"
        show-overflow-tooltip
      />
      <el-table-column
        :label="t('ec.organization.serviceProvider.table.cooperationScopes')"
        min-width="220"
      >
        <template #default="{ row }">
          <div class="organization-figma-tags">
            <span
              v-for="scope in normalizeScopeValues(row.cooperationScopes)"
              :key="scope"
              class="organization-figma-tag"
              :class="`is-${getScopeVisual(scope).tone}`"
            >
              {{ getScopeVisual(scope).label }}
            </span>
            <span v-if="normalizeScopeValues(row.cooperationScopes).length === 0">-</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('ec.organization.serviceProvider.table.score')"
        min-width="150"
      >
        <template #default="{ row }">
          <figma-rating-stars :value="row.score" />
        </template>
      </el-table-column>
      <el-table-column
        :label="t('ec.organization.common.actions')"
        fixed="right"
        width="160"
      >
        <template #default="{ row }">
          <div class="organization-figma-actions">
            <button class="organization-figma-icon-button" type="button" @click="router.push(`/organization/service-providers/${row.id}/edit`)">
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
      <el-pagination
        v-model:current-page="pagination.currentPage"
        background
        class="organization-figma-pagination"
        :layout="paginationLayout"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizes"
        @current-change="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
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
import { deleteServiceProvider, getServiceProviderList, getServiceProviderStats } from '@/services/modules/organizationService'
import FigmaRatingStars from './components/FigmaRatingStars.vue'
import FigmaResourceShell from './components/FigmaResourceShell.vue'

defineOptions({ name: 'OrganizationServiceProvidersFigma' })

const { t } = useI18n()
const router = useRouter()
const { device } = storeToRefs(useSystemStore())

const tableLoading = ref(false)
const statsLoading = ref(false)
const tableData = ref([])

const statValues = reactive({
  total: 0,
  development: 0,
  ops: 0,
  hardware: 0,
  integration: 0,
})

const queryForm = reactive({
  keyword: '',
  cooperationScope: '',
  vendorLevel: '',
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  total: 0,
})

const cooperationScopeOptions = computed(() => ([
  { value: 'SOFTWARE_DEVELOPMENT', label: t('ec.organization.serviceProvider.scope.softwareDevelopment') },
  { value: 'OPERATIONS_SERVICE', label: t('ec.organization.serviceProvider.scope.operationsService') },
  { value: 'HARDWARE_PROCUREMENT', label: t('ec.organization.serviceProvider.scope.hardwareProcurement') },
  { value: 'INTEGRATION', label: t('ec.organization.serviceProvider.scope.integration') },
]))

const vendorLevelOptions = computed(() => ([
  { value: 'STRATEGIC_PARTNER', label: t('ec.organization.serviceProvider.vendorLevel.strategicPartner') },
  { value: 'CORE_SUPPLIER', label: t('ec.organization.serviceProvider.vendorLevel.coreSupplier') },
  { value: 'GENERAL_SUPPLIER', label: t('ec.organization.serviceProvider.vendorLevel.generalSupplier') },
]))

const cooperationScopeVisualMap = computed(() => ({
  SOFTWARE_DEVELOPMENT: {
    label: t('ec.organization.serviceProvider.scope.softwareDevelopment'),
    tone: 'blue',
  },
  OPERATIONS_SERVICE: {
    label: t('ec.organization.serviceProvider.scope.operationsService'),
    tone: 'green',
  },
  HARDWARE_PROCUREMENT: {
    label: t('ec.organization.serviceProvider.scope.hardwareProcurement'),
    tone: 'orange',
  },
  INTEGRATION: {
    label: t('ec.organization.serviceProvider.scope.integration'),
    tone: 'violet',
  },
}))

const paginationLayout = computed(() => {
  return device.value === 'mobile' ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'
})

const serviceProviderStatCards = computed(() => {
  return [
    {
      key: 'total',
      label: t('ec.organization.serviceProvider.figma.stats.total'),
      value: statValues.total,
        icon: 'ri-store-2-fill',
      tone: 'primary',
    },
    {
      key: 'development',
      label: t('ec.organization.serviceProvider.figma.stats.development'),
      value: statValues.development,
        icon: 'ri-bar-chart-box-fill',
        tone: 'primary',
    },
    {
      key: 'ops',
      label: t('ec.organization.serviceProvider.figma.stats.ops'),
      value: statValues.ops,
        icon: 'ri-message-3-fill',
        tone: 'primary',
    },
    {
      key: 'hardware',
      label: t('ec.organization.serviceProvider.figma.stats.hardware'),
      value: statValues.hardware,
        icon: 'ri-hard-drive-3-fill',
        tone: 'primary',
    },
    {
      key: 'integration',
      label: t('ec.organization.serviceProvider.figma.stats.integration'),
      value: statValues.integration,
        icon: 'ri-links-fill',
        tone: 'primary',
    },
  ]
})

const indexMethod = (index) => {
  return (pagination.currentPage - 1) * pagination.pageSize + index + 1
}

const getScopeVisual = (value) => {
  return cooperationScopeVisualMap.value[value] || {
    label: value || '-',
    tone: 'blue',
  }
}

const normalizeScopeValues = (value) => {
  return Array.isArray(value) ? value : []
}

const resetStats = () => {
  statValues.total = 0
  statValues.development = 0
  statValues.ops = 0
  statValues.hardware = 0
  statValues.integration = 0
}

const loadData = async () => {
  tableLoading.value = true
  try {
    const pageData = await getServiceProviderList({
      pageNo: pagination.currentPage,
      pageSize: pagination.pageSize,
      keyword: queryForm.keyword || undefined,
      cooperationScope: queryForm.cooperationScope || undefined,
      vendorLevel: queryForm.vendorLevel || undefined,
    })
    tableData.value = pageData.records
    pagination.total = pageData.total
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.serviceProvider.message.loadFailed'))
  } finally {
    tableLoading.value = false
  }
}

const loadStats = async () => {
  statsLoading.value = true
  try {
    const stats = await getServiceProviderStats()
    statValues.total = Number(stats.total || 0)
    statValues.development = Number(stats.development || 0)
    statValues.ops = Number(stats.ops || 0)
    statValues.hardware = Number(stats.hardware || 0)
    statValues.integration = Number(stats.integration || 0)
  } catch (error) {
    resetStats()
    ElMessage.error(error.message || t('ec.organization.serviceProvider.figma.statsLoadFailed'))
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
  queryForm.cooperationScope = ''
  queryForm.vendorLevel = ''
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
    router.push(`/organization/service-providers/${row.id}/detail`)
    return
  }
  if (command === 'relations') {
    router.push(`/organization/service-providers/${row.id}/relations`)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('ec.organization.common.deleteConfirm', { name: row.name || row.code }),
      t('ec.organization.common.delete'),
      {
        type: 'warning',
        confirmButtonText: t('ec.organization.common.delete'),
        cancelButtonText: t('ec.global.button.text.cancel'),
        confirmButtonClass: 'el-button--danger',
      },
    )

    await deleteServiceProvider(row.id)
    ElMessage.success(t('ec.organization.common.deleteSuccess'))
    await Promise.all([loadData(), loadStats()])
  } catch (error) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error.message || t('ec.organization.common.deleteFailed'))
  }
}

onMounted(async () => {
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
  width: 200px;
}

.organization-figma-field--keyword {
  width: 240px;
}

.organization-figma-search,
.organization-figma-reset,
.organization-figma-primary {
  min-width: 96px;
  height: 32px;
  padding-inline: 14px;
  border-radius: 8px;
}

.organization-figma-primary {
  min-width: 120px;
}

.organization-figma-table {
  :deep(.el-table__inner-wrapper::before) {
    display: none;
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

.organization-figma-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.organization-figma-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 20px;

  &.is-blue {
    background: #ebf0ff;
    color: #2e5ef0;
  }

  &.is-green {
    background: #dff6e2;
    color: #36b23e;
  }

  &.is-orange {
    background: #fff2e7;
    color: #ff8a24;
  }

  &.is-violet {
    background: #f2ebff;
    color: #8e54ff;
  }
}

.organization-figma-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.organization-figma-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #6d7485;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f6f9;
    color: #2e5ef0;
  }

  &.is-danger:hover {
    color: #f56c6c;
  }
}

.organization-figma-pagination {
  justify-content: space-between;
}

@media only screen and (max-width: 991px) {
  .organization-figma-field,
  .organization-figma-field--keyword {
    width: 100%;
  }

  .organization-figma-search,
  .organization-figma-reset,
  .organization-figma-primary {
    flex: 1;
  }

  .organization-figma-pagination {
    justify-content: center;
  }
}
</style>
