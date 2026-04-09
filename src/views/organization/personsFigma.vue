<template>
  <figma-resource-shell active-tab="persons" frame-variant="platform" :stats="personStatCards" :stats-loading="statsLoading">
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
      <el-button class="organization-figma-primary" type="primary" @click="router.push('/organization/persons/create')">
        {{ t('ec.organization.common.create') }}
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
        prop="name"
        :label="t('ec.organization.common.name')"
        min-width="130"
        show-overflow-tooltip
      />
      <el-table-column
        prop="employeeNo"
        :label="t('ec.organization.person.table.employeeNo')"
        min-width="120"
        show-overflow-tooltip
      />
      <el-table-column
        prop="gender"
        :label="t('ec.organization.person.table.gender')"
        min-width="90"
        show-overflow-tooltip
      />
      <el-table-column
        prop="idCardNo"
        :label="t('ec.organization.person.table.idCardNo')"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column
        prop="mobile"
        :label="t('ec.organization.person.table.mobile')"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column
        prop="serviceProviderName"
        :label="t('ec.organization.person.table.serviceProviderName')"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column
        :label="t('ec.organization.person.figma.table.type')"
        width="110"
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
        width="160"
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
import {
  deletePerson,
  getPersonDepartmentOptions,
  getOrganizationServiceProviderOptions,
  getPersonList,
  getPersonStats,
} from '@/services/modules/organizationService'
import FigmaResourceShell from './components/FigmaResourceShell.vue'

defineOptions({ name: 'OrganizationPersonsFigma' })

const { t } = useI18n()
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
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  total: 0,
})

const personTypeVisualMap = computed(() => ({
  DEV: {
    label: t('ec.organization.person.figma.type.dev'),
    tone: 'blue',
  },
  OPS: {
    label: t('ec.organization.person.figma.type.ops'),
    tone: 'green',
  },
}))

const personTypeFilterOptions = computed(() => ([
  { value: 'DEV', label: t('ec.organization.person.figma.type.dev') },
  { value: 'OPS', label: t('ec.organization.person.figma.type.ops') },
]))

const paginationLayout = computed(() => {
  return device.value === 'mobile' ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'
})

const personStatCards = computed(() => {
  return [
    {
      key: 'total',
      label: t('ec.organization.person.figma.stats.total'),
      value: personStatValues.total,
        icon: 'ri-user-3-fill',
      tone: 'primary',
    },
    {
      key: 'development',
      label: t('ec.organization.person.figma.stats.development'),
      value: personStatValues.development,
        icon: 'ri-bar-chart-box-fill',
        tone: 'primary',
    },
    {
      key: 'ops',
      label: t('ec.organization.person.figma.stats.ops'),
      value: personStatValues.ops,
        icon: 'ri-message-3-fill',
        tone: 'primary',
    },
    {
      key: 'hardwareOwners',
      label: t('ec.organization.person.figma.stats.hardwareOwners'),
      value: personStatValues.hardwareOwners,
        icon: 'ri-hard-drive-3-fill',
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
    tableData.value = pageData.records
    pagination.total = pageData.total
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
  width: 200px;
}

.organization-figma-field--keyword {
  width: 240px;
}

.organization-figma-search,
.organization-figma-reset,
.organization-figma-primary {
  min-width: 84px;
  height: 32px;
  padding-inline: 14px;
  border-radius: 8px;
}

.organization-figma-primary {
  min-width: 96px;
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

.organization-figma-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
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
