<template>
  <figma-resource-shell hide-tabs frame-variant="platform" :stats="hardwareStatCards" :stats-loading="statsLoading">
    <template #filters>
      <div class="hardware-figma-toolbar">
        <el-input
          v-model="queryForm.keyword"
          clearable
          class="hardware-figma-field hardware-figma-field--keyword"
          :placeholder="t('ec.hardware.common.searchPlaceholder')"
          @keyup.enter="handleSearch"
        />
        <el-select
          v-model="queryForm.hardwareType"
          clearable
          class="hardware-figma-field"
          :placeholder="t('ec.hardware.form.hardwareTypePlaceholder')"
        >
          <el-option v-for="item in hardwareTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-select
          v-model="queryForm.hardwareStatus"
          clearable
          class="hardware-figma-field"
          :placeholder="t('ec.hardware.form.statusPlaceholder')"
        >
          <el-option v-for="item in hardwareStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
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
      <el-button type="primary" @click="router.push('/hardware/hardwareAssets/create')">
        {{ t('ec.hardware.common.create') }}
      </el-button>
    </template>

    <el-table v-loading="tableLoading" :data="tableData" row-key="id" class="hardware-figma-table">
      <el-table-column
        type="index"
        width="64"
        :label="t('ec.organization.figma.table.index')"
        :index="indexMethod"
      />
      <el-table-column prop="assetCode" :label="t('ec.hardware.common.assetCode')" min-width="160" show-overflow-tooltip />
      <el-table-column prop="hardwareIp" :label="t('ec.hardware.common.hardwareIp')" min-width="150" show-overflow-tooltip />
      <el-table-column prop="assetName" :label="t('ec.hardware.common.assetName')" min-width="170" show-overflow-tooltip />
      <el-table-column prop="hardwareBrand" :label="t('ec.hardware.common.hardwareBrand')" min-width="150" show-overflow-tooltip />
      <el-table-column :label="t('ec.hardware.common.hardwareType')" min-width="140">
        <template #default="{ row }">
          <span class="hardware-figma-tag" :class="`is-${getHardwareTypeVisual(row.hardwareType).tone}`">
            {{ getHardwareTypeVisual(row.hardwareType).label }}
          </span>
        </template>
      </el-table-column>
      <el-table-column prop="ownerName" :label="t('ec.hardware.common.owner')" min-width="130" show-overflow-tooltip />
      <el-table-column :label="t('ec.hardware.common.actions')" fixed="right" width="160">
        <template #default="{ row }">
          <div class="hardware-figma-actions">
            <button class="hardware-figma-icon-button" type="button" @click="router.push(`/hardware/hardwareAssets/${row.id}/edit`)">
              <i class="ri-edit-line"></i>
            </button>
            <button class="hardware-figma-icon-button is-danger" type="button" @click="handleDelete(row)">
              <i class="ri-delete-bin-line"></i>
            </button>
            <el-dropdown trigger="click" @command="(command) => handleRowCommand(command, row)">
              <button class="hardware-figma-icon-button" type="button">
                <i class="ri-more-line"></i>
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="detail">{{ t('ec.hardware.common.detail') }}</el-dropdown-item>
                  <el-dropdown-item command="relations">{{ t('ec.hardware.common.relations') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="t('ec.hardware.common.empty')" />
      </template>
    </el-table>

    <template #pagination>
      <el-pagination
        v-model:current-page="pagination.currentPage"
        background
        class="hardware-figma-pagination"
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
  deleteHardwareAsset,
  getHardwareAssetList,
  getHardwareAssetStats,
} from '@/services/modules/hardwareService'
import FigmaResourceShell from '@/views/organization/components/FigmaResourceShell.vue'

defineOptions({ name: 'HardwareAssetsFigma' })

const { t } = useI18n()
const router = useRouter()
const { device } = storeToRefs(useSystemStore())

const tableLoading = ref(false)
const statsLoading = ref(false)
const tableData = ref([])

const queryForm = reactive({
  keyword: '',
  hardwareType: '',
  hardwareStatus: '',
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  total: 0,
})

const statValues = reactive({
  total: 0,
  server: 0,
  networkDevice: 0,
  terminalDevice: 0,
  peripheral: 0,
})

const hardwareTypeVisualMap = computed(() => ({
  SERVER: { label: t('ec.hardware.type.server'), tone: 'blue' },
  NETWORK_DEVICE: { label: t('ec.hardware.type.networkDevice'), tone: 'cyan' },
  TERMINAL_DEVICE: { label: t('ec.hardware.type.terminalDevice'), tone: 'green' },
  PERIPHERAL: { label: t('ec.hardware.type.peripheral'), tone: 'orange' },
}))

const hardwareStatusOptions = computed(() => ([
  { value: 'RUNNING', label: t('ec.hardware.status.running') },
  { value: 'MAINTENANCE', label: t('ec.hardware.status.maintenance') },
  { value: 'IDLE', label: t('ec.hardware.status.idle') },
  { value: 'SCRAPPED', label: t('ec.hardware.status.scrapped') },
]))

const hardwareTypeOptions = computed(() => ([
  { value: 'SERVER', label: t('ec.hardware.type.server') },
  { value: 'NETWORK_DEVICE', label: t('ec.hardware.type.networkDevice') },
  { value: 'TERMINAL_DEVICE', label: t('ec.hardware.type.terminalDevice') },
  { value: 'PERIPHERAL', label: t('ec.hardware.type.peripheral') },
]))

const hardwareStatCards = computed(() => ([
  { key: 'total', label: t('ec.hardware.stats.total'), value: statValues.total, icon: 'ri-hard-drive-3-fill', tone: 'primary' },
  { key: 'server', label: t('ec.hardware.stats.server'), value: statValues.server, icon: 'ri-server-fill', tone: 'primary' },
  { key: 'networkDevice', label: t('ec.hardware.stats.networkDevice'), value: statValues.networkDevice, icon: 'ri-router-fill', tone: 'primary' },
  { key: 'terminalDevice', label: t('ec.hardware.stats.terminalDevice'), value: statValues.terminalDevice, icon: 'ri-computer-fill', tone: 'primary' },
  { key: 'peripheral', label: t('ec.hardware.stats.peripheral'), value: statValues.peripheral, icon: 'ri-printer-fill', tone: 'primary' },
]))

const paginationLayout = computed(() => {
  return device.value === 'mobile' ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'
})

const indexMethod = (index) => {
  return (pagination.currentPage - 1) * pagination.pageSize + index + 1
}

const getHardwareTypeVisual = (value) => {
  return hardwareTypeVisualMap.value[value] || { label: value || '-', tone: 'blue' }
}

const resetStats = () => {
  statValues.total = 0
  statValues.server = 0
  statValues.networkDevice = 0
  statValues.terminalDevice = 0
  statValues.peripheral = 0
}

const loadData = async () => {
  tableLoading.value = true
  try {
    const pageData = await getHardwareAssetList({
      pageNo: pagination.currentPage,
      pageSize: pagination.pageSize,
      keyword: queryForm.keyword || undefined,
      hardwareType: queryForm.hardwareType || undefined,
      hardwareStatus: queryForm.hardwareStatus || undefined,
    })
    tableData.value = pageData.records
    pagination.total = pageData.total
  } catch (error) {
    ElMessage.error(error.message || t('ec.hardware.load.failed'))
  } finally {
    tableLoading.value = false
  }
}

const loadStats = async () => {
  statsLoading.value = true
  try {
    const stats = await getHardwareAssetStats()
    statValues.total = Number(stats.total || 0)
    statValues.server = Number(stats.server || 0)
    statValues.networkDevice = Number(stats.networkDevice || 0)
    statValues.terminalDevice = Number(stats.terminalDevice || 0)
    statValues.peripheral = Number(stats.peripheral || 0)
  } catch (error) {
    resetStats()
    ElMessage.error(error.message || t('ec.hardware.message.statsFailed'))
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
  queryForm.hardwareType = ''
  queryForm.hardwareStatus = ''
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
    router.push(`/hardware/hardwareAssets/${row.id}/detail`)
    return
  }
  if (command === 'relations') {
    router.push(`/hardware/hardwareAssets/${row.id}/relations`)
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('ec.hardware.common.deleteConfirm', { name: row.assetName || row.assetCode }),
      t('ec.global.common.tip'),
      { type: 'warning' },
    )
    await deleteHardwareAsset(row.id)
    ElMessage.success(t('ec.hardware.common.deleteSuccess'))
    if (tableData.value.length === 1 && pagination.currentPage > 1) {
      pagination.currentPage -= 1
    }
    await Promise.all([loadData(), loadStats()])
  } catch (error) {
    if (error !== 'cancel' && error !== 'close') {
      ElMessage.error(error.message || t('ec.hardware.common.deleteFailed'))
    }
  }
}

onMounted(async () => {
  await Promise.all([loadData(), loadStats()])
})
</script>

<style lang="scss" scoped>
.hardware-figma-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  width: 100%;
}

.hardware-figma-field {
  width: 220px;
}

.hardware-figma-field--keyword {
  width: 300px;
}

.hardware-figma-table {
  :deep(.el-table__cell) {
    height: 56px;
  }

  :deep(th.el-table__cell) {
    color: #151b26;
    font-weight: 700;
    background: #f6f8fd;
  }
}

.hardware-figma-tag {
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

  &.is-cyan {
    color: #1c96d6;
    background: #e4f5ff;
  }

  &.is-green {
    color: #1f9d55;
    background: #dff6e2;
  }

  &.is-orange {
    color: #ff8a00;
    background: #fff1df;
  }
}

.hardware-figma-actions {
  display: flex;
  align-items: center;
  gap: 6px;
}

.hardware-figma-icon-button {
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

.hardware-figma-pagination {
  justify-content: flex-end;
}

@media only screen and (max-width: 991px) {
  .hardware-figma-field,
  .hardware-figma-field--keyword {
    width: 100%;
  }
}
</style>
