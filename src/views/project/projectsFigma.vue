<template>
  <figma-resource-shell hide-tabs :stats="projectStatCards" :stats-loading="statsLoading">
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
        <el-button type="primary" @click="handleSearch">
          {{ t('ec.global.button.text.search') }}
        </el-button>
        <el-button @click="handleReset">
          {{ t('ec.global.button.text.reset') }}
        </el-button>
      </div>
    </template>

    <template #actions>
      <el-button type="primary" @click="router.push('/project/projects/create')">
        {{ t('ec.project.common.create') }}
      </el-button>
    </template>

    <el-table v-loading="tableLoading" :data="tableData" row-key="id" class="project-figma-table">
      <el-table-column
        type="index"
        width="64"
        :label="t('ec.organization.figma.table.index')"
        :index="indexMethod"
      />
      <el-table-column prop="code" :label="t('ec.project.common.code')" min-width="150" show-overflow-tooltip />
      <el-table-column prop="name" :label="t('ec.project.common.name')" min-width="180" show-overflow-tooltip />
      <el-table-column prop="approvalBatchNo" :label="t('ec.project.common.approvalBatchNo')" min-width="160" show-overflow-tooltip />
      <el-table-column :label="t('ec.project.common.projectBudget')" min-width="140">
        <template #default="{ row }">
          {{ formatAmount(row.projectBudget) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.project.common.contractAmount')" min-width="160">
        <template #default="{ row }">
          {{ formatAmount(row.contractAmount) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.project.common.projectType')" min-width="140">
        <template #default="{ row }">
          <span class="project-figma-tag" :class="`is-${getProjectTypeVisual(row.projectType).tone}`">
            {{ getProjectTypeVisual(row.projectType).label }}
          </span>
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.project.common.projectStatus')" min-width="130">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.projectStatus, projectStatusMap)">
            {{ getStatusLabel(row.projectStatus, projectStatusMap) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.project.common.actions')" fixed="right" width="160">
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
                  <el-dropdown-item command="relations">{{ t('ec.project.common.relations') }}</el-dropdown-item>
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
      <el-pagination
        v-model:current-page="pagination.currentPage"
        background
        class="project-figma-pagination"
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
import { getStatusDictionaries } from '@/services/modules/dictionaryService'
import { buildStatusOptionMap } from '@/utils/statusDictionary'
import { deleteProject, getProjectList, getProjectStats } from '@/services/modules/projectService'
import { getStatusLabel, getStatusTagType } from './helpers'
import FigmaResourceShell from '@/views/organization/components/FigmaResourceShell.vue'

defineOptions({ name: 'ProjectAssetsFigma' })

const { t, locale } = useI18n()
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
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
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

const projectTypeOptions = computed(() => ([
  { value: 'NEW_BUILD', label: t('ec.project.type.newBuild') },
  { value: 'SOFTWARE_UPGRADE', label: t('ec.project.type.softwareUpgrade') },
  { value: 'OPS_PROJECT', label: t('ec.project.type.opsProject') },
  { value: 'SERVICE_PURCHASE', label: t('ec.project.type.servicePurchase') },
  { value: 'HARDWARE_PURCHASE', label: t('ec.project.type.hardwarePurchase') },
  { value: 'INTEGRATION_PROJECT', label: t('ec.project.type.integrationProject') },
]))

const projectTypeVisualMap = computed(() => ({
  NEW_BUILD: { label: t('ec.project.type.newBuild'), tone: 'blue' },
  SOFTWARE_UPGRADE: { label: t('ec.project.type.softwareUpgrade'), tone: 'violet' },
  OPS_PROJECT: { label: t('ec.project.type.opsProject'), tone: 'green' },
  SERVICE_PURCHASE: { label: t('ec.project.type.servicePurchase'), tone: 'orange' },
  HARDWARE_PURCHASE: { label: t('ec.project.type.hardwarePurchase'), tone: 'gold' },
  INTEGRATION_PROJECT: { label: t('ec.project.type.integrationProject'), tone: 'cyan' },
}))

const projectStatusMap = computed(() => {
  return buildStatusOptionMap(statusDictionaries.value.projectStatus, locale.value)
})

const paymentStatusOptions = computed(() => {
  return Object.values(buildStatusOptionMap(statusDictionaries.value.paymentStatus, locale.value))
})

const paginationLayout = computed(() => {
  return device.value === 'mobile' ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'
})

const projectStatCards = computed(() => ([
  { key: 'total', label: t('ec.project.stats.total'), value: statValues.total, icon: 'ri-folders-fill', tone: 'primary' },
  { key: 'newBuild', label: t('ec.project.stats.newBuild'), value: statValues.newBuild, icon: 'ri-add-box-fill', tone: 'primary' },
  { key: 'softwareUpgrade', label: t('ec.project.stats.softwareUpgrade'), value: statValues.softwareUpgrade, icon: 'ri-code-box-fill', tone: 'primary' },
  { key: 'opsProject', label: t('ec.project.stats.opsProject'), value: statValues.opsProject, icon: 'ri-settings-3-fill', tone: 'primary' },
  { key: 'servicePurchase', label: t('ec.project.stats.servicePurchase'), value: statValues.servicePurchase, icon: 'ri-service-fill', tone: 'primary' },
  { key: 'hardwarePurchase', label: t('ec.project.stats.hardwarePurchase'), value: statValues.hardwarePurchase, icon: 'ri-hard-drive-3-fill', tone: 'primary' },
  { key: 'integrationProject', label: t('ec.project.stats.integrationProject'), value: statValues.integrationProject, icon: 'ri-links-fill', tone: 'primary' },
]))

const indexMethod = (index) => {
  return (pagination.currentPage - 1) * pagination.pageSize + index + 1
}

const getProjectTypeVisual = (value) => {
  return projectTypeVisualMap.value[value] || { label: value || '-', tone: 'blue' }
}

const formatAmount = (value) => {
  if (value == null || value === '') return '-'
  const numeric = Number(value)
  return Number.isNaN(numeric) ? value : numeric.toFixed(2)
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
    tableData.value = pageData.records
    pagination.total = pageData.total
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

const handlePageSizeChange = (size) => {
  pagination.pageSize = size
  pagination.currentPage = 1
  loadData()
}

const handleRowCommand = (command, row) => {
  if (command === 'detail') {
    router.push(`/project/projects/${row.id}/detail`)
    return
  }
  if (command === 'relations') {
    router.push(`/project/projects/${row.id}/relations`)
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
  gap: 12px;
  width: 100%;
}

.project-figma-field {
  width: 220px;
}

.project-figma-field--keyword {
  width: 300px;
}

.project-figma-table {
  :deep(.el-table__cell) {
    height: 56px;
  }

  :deep(th.el-table__cell) {
    color: #151b26;
    font-weight: 700;
    background: #f6f8fd;
  }
}

.project-figma-tag {
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

  &.is-violet {
    color: #7a45ff;
    background: #f1eaff;
  }

  &.is-green {
    color: #1f9d55;
    background: #dff6e2;
  }

  &.is-orange {
    color: #ff8a00;
    background: #fff1df;
  }

  &.is-gold {
    color: #b7791f;
    background: #fff8df;
  }

  &.is-cyan {
    color: #1c96d6;
    background: #e4f5ff;
  }
}

.project-figma-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.project-figma-icon-button {
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

.project-figma-pagination {
  justify-content: flex-end;
}

@media only screen and (max-width: 991px) {
  .project-figma-field,
  .project-figma-field--keyword {
    width: 100%;
  }
}
</style>
