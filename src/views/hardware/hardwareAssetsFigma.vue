<template>
  <figma-resource-shell
    hide-tabs
    frame-variant="platform"
    variant="hardware-list"
    :stats="hardwareStatCards"
    :stats-decoration="statsDecoration"
    :stats-decoration-image="statsDecorationImage"
    :stats-loading="statsLoading"
  >
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
          <el-option
            v-for="item in hardwareTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-select
          v-model="queryForm.hardwareStatus"
          clearable
          class="hardware-figma-field"
          :placeholder="t('ec.hardware.form.statusPlaceholder')"
        >
          <el-option
            v-for="item in hardwareStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-button class="hardware-figma-search" type="primary" @click="handleSearch">
          {{ t('ec.global.button.text.search') }}
        </el-button>
        <el-button class="hardware-figma-reset" @click="handleReset">
          {{ t('ec.global.button.text.reset') }}
        </el-button>
      </div>
    </template>

    <template #actions>
      <div class="hardware-figma-toolbar-actions">
        <el-button class="hardware-figma-primary" type="primary" @click="router.push('/hardware/hardwareAssets/create')">
          {{ isZhLocale ? '新增硬件' : t('ec.hardware.common.create') }}
        </el-button>
        <div class="hardware-figma-view-switch" aria-hidden="true">
          <button class="hardware-figma-view-switch__button is-active" type="button" tabindex="-1">
            <i class="ri-list-check-2"></i>
          </button>
          <button class="hardware-figma-view-switch__button" type="button" tabindex="-1">
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
      class="hardware-figma-table"
    >
      <el-table-column
        type="index"
        width="48"
        :label="t('ec.organization.figma.table.index')"
        :index="indexMethod"
      />
      <el-table-column
        prop="assetCode"
        :label="assetCodeColumnLabel"
        min-width="146"
        show-overflow-tooltip
      />
      <el-table-column
        prop="hardwareIp"
        :label="ipColumnLabel"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column
        prop="assetName"
        :label="assetNameColumnLabel"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column
        prop="hardwareBrand"
        :label="brandColumnLabel"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column
        :label="hardwareTypeColumnLabel"
        min-width="140"
      >
        <template #default="{ row }">
          <span class="hardware-figma-tag" :class="`is-${getHardwareTypeVisual(row.hardwareType).tone}`">
            {{ getHardwareTypeVisual(row.hardwareType).label }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="ownerName"
        :label="t('ec.hardware.common.owner')"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column
        :label="t('ec.hardware.common.actions')"
        fixed="right"
        width="116"
      >
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
      <div class="hardware-figma-pagination">
        <div class="hardware-figma-pagination__summary">{{ pageSummaryText }}</div>
        <el-pagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          background
          class="hardware-figma-pagination__controls"
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
  deleteHardwareAsset,
  getHardwareAssetList,
  getHardwareAssetStats,
} from '@/services/modules/hardwareService'
import statsDecoration from '@/assets/images/organization/hardware-stats-mask.svg'
import statsDecorationImage from '@/assets/images/organization/hardware-stats-image.png'
import totalIcon from '@/assets/images/organization/hardware-stat-total.svg'
import serverIcon from '@/assets/images/organization/hardware-stat-server.svg'
import networkDeviceIcon from '@/assets/images/organization/hardware-stat-network-device.svg'
import terminalDeviceIcon from '@/assets/images/organization/hardware-stat-terminal-device.svg'
import peripheralIcon from '@/assets/images/organization/hardware-stat-peripheral.svg'
import FigmaResourceShell from '@/views/organization/components/FigmaResourceShell.vue'

defineOptions({ name: 'HardwareAssetsFigma' })

const { locale, t } = useI18n()
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
  pageSize: 8,
  pageSizes: [8, 10, 20, 50, 100],
  total: 0,
})

const statValues = reactive({
  total: 0,
  server: 0,
  networkDevice: 0,
  terminalDevice: 0,
  peripheral: 0,
})

const isZhLocale = computed(() => String(locale.value || '').startsWith('zh'))

const assetCodeColumnLabel = computed(() => {
  return isZhLocale.value ? '硬件编码' : t('ec.hardware.common.assetCode')
})

const ipColumnLabel = computed(() => {
  return isZhLocale.value ? 'IP地址' : t('ec.hardware.common.hardwareIp')
})

const assetNameColumnLabel = computed(() => {
  return isZhLocale.value ? '硬件名称' : t('ec.hardware.common.assetName')
})

const brandColumnLabel = computed(() => {
  return isZhLocale.value ? '硬件品牌' : t('ec.hardware.common.hardwareBrand')
})

const hardwareTypeColumnLabel = computed(() => {
  return isZhLocale.value ? '硬件类型' : t('ec.hardware.common.hardwareType')
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

const hardwareStatCards = computed(() => ([
  {
    key: 'total',
    label: isZhLocale.value ? '硬件总数' : 'Total Hardware',
    value: statValues.total,
    iconUrl: totalIcon,
    tone: 'primary',
  },
  {
    key: 'server',
    label: isZhLocale.value ? '服务器' : t('ec.hardware.stats.server'),
    value: statValues.server,
    iconUrl: serverIcon,
    tone: 'primary',
  },
  {
    key: 'network-device',
    label: isZhLocale.value ? '网络设备' : t('ec.hardware.stats.networkDevice'),
    value: statValues.networkDevice,
    iconUrl: networkDeviceIcon,
    tone: 'primary',
  },
  {
    key: 'terminal-device',
    label: isZhLocale.value ? '终端设备' : t('ec.hardware.stats.terminalDevice'),
    value: statValues.terminalDevice,
    iconUrl: terminalDeviceIcon,
    tone: 'primary',
  },
  {
    key: 'peripheral',
    label: isZhLocale.value ? '外设' : t('ec.hardware.stats.peripheral'),
    value: statValues.peripheral,
    iconUrl: peripheralIcon,
    tone: 'primary',
  },
]))

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
    tableData.value = Array.isArray(pageData.records) ? pageData.records : []
    pagination.total = Number(pageData.total || 0)
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
  gap: 8px;
  width: 100%;
}

.hardware-figma-field {
  width: 200px;
}

.hardware-figma-field--keyword {
  width: 200px;
}

.hardware-figma-search {
  min-width: 52px;
  height: 32px;
  padding-inline: 12px;
  border: 0;
  border-radius: 4px;
  background: #2e5ef0;
  box-shadow: none;
  font-size: 14px;
}

.hardware-figma-reset {
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

.hardware-figma-toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.hardware-figma-primary {
  min-width: 96px;
  height: 32px;
  padding-inline: 12px;
  border: 0;
  border-radius: 4px;
  background: #2e5ef0;
  box-shadow: none;
  font-size: 14px;
}

.hardware-figma-view-switch {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  color: #7c8393;
}

.hardware-figma-view-switch__button {
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

.hardware-figma-table {
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

.hardware-figma-tag {
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
    color: #2e5ef0;
    background: #ebf0ff;
  }

  &.is-cyan {
    color: #1c96d6;
    background: #e4f5ff;
  }

  &.is-green {
    color: #36b23e;
    background: #d5f7d7;
  }

  &.is-orange {
    color: #ff8a00;
    background: #fff1df;
  }
}

.hardware-figma-actions {
  display: flex;
  align-items: center;
  gap: 24px;
}

.hardware-figma-icon-button {
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

.hardware-figma-pagination {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
  width: 100%;
}

.hardware-figma-pagination__summary {
  flex-shrink: 0;
  color: #444a57;
  font-size: 14px;
  line-height: 22px;
}

.hardware-figma-pagination__controls {
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

.hardware-figma-field {
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
  .hardware-figma-toolbar-actions {
    justify-content: space-between;
    width: 100%;
  }

  .hardware-figma-field,
  .hardware-figma-field--keyword,
  .hardware-figma-search,
  .hardware-figma-reset {
    width: 100%;
  }

  .hardware-figma-pagination {
    flex-wrap: wrap;
    gap: 12px;
  }

  .hardware-figma-pagination__controls {
    width: 100%;
  }

  .hardware-figma-pagination__controls :deep(.el-pagination__sizes) {
    margin-left: 0;
  }
}
</style>
