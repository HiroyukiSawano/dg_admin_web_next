<template>
  <figma-resource-shell hide-tabs frame-variant="platform" :stats="softwareStatCards" :stats-loading="statsLoading">
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
          <el-option v-for="item in systemTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select
          v-model="queryForm.deploymentArchitecture"
          clearable
          class="software-figma-field"
          :placeholder="t('ec.software.form.deploymentArchitecturePlaceholder')"
        >
          <el-option v-for="item in deploymentArchitectureOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" @click="handleSearch">
          {{ t('ec.global.button.text.search') }}
        </el-button>
        <el-button @click="handleReset">
          {{ t('ec.global.button.text.reset') }}
        </el-button>
      </div>
    </template>

    <template #actions>
      <el-button type="primary" @click="router.push('/software/informationSystems/create')">
        {{ t('ec.software.common.create') }}
      </el-button>
    </template>

    <el-table v-loading="tableLoading" :data="tableData" row-key="id" class="software-figma-table">
      <el-table-column
        type="index"
        width="64"
        :label="t('ec.organization.figma.table.index')"
        :index="indexMethod"
      />
      <el-table-column prop="code" :label="t('ec.software.common.code')" min-width="150" show-overflow-tooltip />
      <el-table-column prop="name" :label="t('ec.software.common.name')" min-width="180" show-overflow-tooltip />
      <el-table-column prop="versionNo" :label="t('ec.software.common.versionNo')" min-width="140" show-overflow-tooltip />
      <el-table-column :label="t('ec.software.common.deploymentArchitecture')" min-width="140">
        <template #default="{ row }">
          {{ getDeploymentArchitectureLabel(row.deploymentArchitecture) }}
        </template>
      </el-table-column>
      <el-table-column prop="ownerName" :label="t('ec.software.common.owner')" min-width="130" show-overflow-tooltip />
      <el-table-column prop="contactPhone" :label="t('ec.software.common.contactPhone')" min-width="150" show-overflow-tooltip />
      <el-table-column :label="t('ec.software.common.systemType')" min-width="140">
        <template #default="{ row }">
          <span class="software-figma-tag" :class="`is-${getSystemTypeVisual(row.systemType).tone}`">
            {{ getSystemTypeVisual(row.systemType).label }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.software.common.actions')" fixed="right" width="160">
        <template #default="{ row }">
          <div class="software-figma-actions">
            <button class="software-figma-icon-button" type="button" @click="router.push(`/software/informationSystems/${row.id}/edit`)">
              <i class="ri-edit-line"></i>
            </button>
            <button class="software-figma-icon-button is-danger" type="button" @click="handleDelete(row)">
              <i class="ri-delete-bin-line"></i>
            </button>
            <el-dropdown trigger="click" @command="(command) => handleRowCommand(command, row)">
              <button class="software-figma-icon-button" type="button">
                <i class="ri-more-line"></i>
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="detail">{{ t('ec.software.common.detail') }}</el-dropdown-item>
                  <el-dropdown-item command="relations">{{ t('ec.software.common.relations') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="t('ec.software.common.empty')" />
      </template>
    </el-table>

    <template #pagination>
      <el-pagination
        v-model:current-page="pagination.currentPage"
        background
        class="software-figma-pagination"
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
  deleteInformationSystem,
  getInformationSystemList,
  getInformationSystemStats,
} from '@/services/modules/softwareService'
import FigmaResourceShell from '@/views/organization/components/FigmaResourceShell.vue'

defineOptions({ name: 'SoftwareAssetsFigma' })

const { t } = useI18n()
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
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
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

const systemTypeOptions = computed(() => ([
  { value: 'EXTERNAL_SERVICE', label: t('ec.software.type.externalService') },
  { value: 'INTERNAL_OFFICE', label: t('ec.software.type.internalOffice') },
  { value: 'DATABASE_SOFTWARE', label: t('ec.software.type.databaseSoftware') },
  { value: 'BASIC_SUPPORT', label: t('ec.software.type.basicSupport') },
  { value: 'SECURITY_SOFTWARE', label: t('ec.software.type.securitySoftware') },
]))

const systemTypeVisualMap = computed(() => ({
  EXTERNAL_SERVICE: { label: t('ec.software.type.externalService'), tone: 'blue' },
  INTERNAL_OFFICE: { label: t('ec.software.type.internalOffice'), tone: 'green' },
  DATABASE_SOFTWARE: { label: t('ec.software.type.databaseSoftware'), tone: 'violet' },
  BASIC_SUPPORT: { label: t('ec.software.type.basicSupport'), tone: 'cyan' },
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
  return device.value === 'mobile' ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'
})

const softwareStatCards = computed(() => ([
  { key: 'total', label: t('ec.software.stats.total'), value: statValues.total, icon: 'ri-apps-fill', tone: 'primary' },
  { key: 'externalService', label: t('ec.software.stats.externalService'), value: statValues.externalService, icon: 'ri-global-fill', tone: 'primary' },
  { key: 'internalOffice', label: t('ec.software.stats.internalOffice'), value: statValues.internalOffice, icon: 'ri-briefcase-4-fill', tone: 'primary' },
  { key: 'databaseSoftware', label: t('ec.software.stats.databaseSoftware'), value: statValues.databaseSoftware, icon: 'ri-database-2-fill', tone: 'primary' },
  { key: 'basicSupport', label: t('ec.software.stats.basicSupport'), value: statValues.basicSupport, icon: 'ri-tools-fill', tone: 'primary' },
  { key: 'securitySoftware', label: t('ec.software.stats.securitySoftware'), value: statValues.securitySoftware, icon: 'ri-shield-check-fill', tone: 'primary' },
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
    tableData.value = pageData.records
    pagination.total = pageData.total
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

const handleRowCommand = (command, row) => {
  if (command === 'detail') {
    router.push(`/software/informationSystems/${row.id}/detail`)
    return
  }
  if (command === 'relations') {
    router.push(`/software/informationSystems/${row.id}/relations`)
  }
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
  gap: 12px;
  width: 100%;
}

.software-figma-field {
  width: 220px;
}

.software-figma-field--keyword {
  width: 300px;
}

.software-figma-table {
  :deep(.el-table__cell) {
    height: 56px;
  }

  :deep(th.el-table__cell) {
    color: #151b26;
    font-weight: 700;
    background: #f6f8fd;
  }
}

.software-figma-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 70px;
  padding: 2px 10px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 20px;

  &.is-blue {
    color: #2e5ef0;
    background: #ebf0ff;
  }

  &.is-green {
    color: #1f9d55;
    background: #dff6e2;
  }

  &.is-violet {
    color: #7a45ff;
    background: #f1eaff;
  }

  &.is-cyan {
    color: #1c96d6;
    background: #e4f5ff;
  }

  &.is-orange {
    color: #ff8a00;
    background: #fff1df;
  }
}

.software-figma-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.software-figma-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 10px;
  background: #f5f7fb;
  color: #4f566b;
  cursor: pointer;
  transition: background 0.2s ease, color 0.2s ease;

  &:hover {
    color: var(--el-color-primary);
    background: #edf2ff;
  }

  &.is-danger:hover {
    color: #d14343;
    background: #fff1f1;
  }
}

.software-figma-pagination {
  justify-content: flex-end;
}

@media only screen and (max-width: 991px) {
  .software-figma-field,
  .software-figma-field--keyword {
    width: 100%;
  }
}
</style>
