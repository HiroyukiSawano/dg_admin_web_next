<template>
  <el-card class="monitor-logs">
    <el-form :model="queryForm" inline @submit.prevent>
      <el-form-item :label="t('ec.monitor.logs.form.agentId')">
        <el-input
          v-model="queryForm.agentId"
          clearable
          :placeholder="t('ec.monitor.logs.form.agentId.placeholder')"
        />
      </el-form-item>
      <el-form-item :label="t('ec.monitor.logs.form.level')">
        <el-select
          v-model="queryForm.level"
          clearable
          :placeholder="t('ec.monitor.logs.form.level.placeholder')"
        >
          <el-option :label="t('ec.monitor.logs.level.all')" value="" />
          <el-option :label="t('ec.monitor.logs.level.critical')" value="CRITICAL" />
          <el-option :label="t('ec.monitor.logs.level.unknownError')" value="UNKNOWN_ERROR" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('ec.monitor.logs.form.keyword')">
        <el-input
          v-model="queryForm.keyword"
          clearable
          :placeholder="t('ec.monitor.logs.form.keyword.placeholder')"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">{{ t('ec.global.button.text.search') }}</el-button>
        <el-button @click="handleReset">{{ t('ec.global.button.text.reset') }}</el-button>
      </el-form-item>
      <el-form-item class="margin-left-auto">
        <el-button :loading="tableLoading" @click="loadData">
          {{ t('ec.monitor.logs.button.refresh') }}
        </el-button>
      </el-form-item>
    </el-form>

    <div class="monitor-logs__summary">
      <div class="monitor-logs__summary-card">
        <span class="monitor-logs__summary-label">{{ t('ec.monitor.logs.summary.critical') }}</span>
        <strong class="is-danger">{{ stats.CRITICAL || 0 }}</strong>
      </div>
      <div class="monitor-logs__summary-card">
        <span class="monitor-logs__summary-label">{{ t('ec.monitor.logs.summary.unknownError') }}</span>
        <strong class="is-warning">{{ stats.UNKNOWN_ERROR || 0 }}</strong>
      </div>
      <div class="monitor-logs__summary-card">
        <span class="monitor-logs__summary-label">{{ t('ec.monitor.logs.summary.total') }}</span>
        <strong>{{ filteredRecords.length }}</strong>
      </div>
    </div>

    <el-table :data="pagedRecords" row-key="id" v-loading="tableLoading" @row-click="openDetail">
      <el-table-column
        :label="t('ec.monitor.logs.table.time')"
        min-width="180"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <span class="monitor-logs__mono">{{ formatDateTime(row.logTime) }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="agentId"
        :label="t('ec.monitor.logs.table.agentId')"
        min-width="160"
        show-overflow-tooltip
      />
      <el-table-column
        prop="appName"
        :label="t('ec.monitor.logs.table.appName')"
        min-width="160"
        show-overflow-tooltip
      />
      <el-table-column :label="t('ec.monitor.logs.table.level')" width="140">
        <template #default="{ row }">
          <el-tag :type="getLevelTagType(row.level)">{{ getLevelLabel(row.level) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('ec.monitor.logs.table.rule')"
        min-width="220"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          <div class="monitor-logs__rule-cell">
            <span>{{ row.matchedRuleName || '-' }}</span>
            <span class="monitor-logs__keyword">{{ row.matchedKeyword || '-' }}</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="logContent"
        :label="t('ec.monitor.logs.table.content')"
        min-width="320"
        show-overflow-tooltip
      />
      <template #empty>
        <el-empty :description="t('ec.monitor.logs.empty')" />
      </template>
    </el-table>

    <el-pagination
      v-model:current-page="pagination.currentPage"
      background
      :layout="paginationLayout"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :page-sizes="pagination.pageSizes"
      @current-change="handlePageChange"
      @update:page-size="handlePageSizeChange"
    />
  </el-card>

  <el-drawer
    v-model="detailVisible"
    :title="t('ec.monitor.logs.detail.title')"
    size="560px"
    append-to-body
  >
    <div v-loading="detailLoading" class="monitor-logs__detail" v-if="activeRecord">
      <div class="monitor-logs__detail-header">
        <el-tag :type="getLevelTagType(activeRecord.level)">
          {{ getLevelLabel(activeRecord.level) }}
        </el-tag>
        <span class="monitor-logs__mono">{{ formatDateTime(activeRecord.logTime) }}</span>
      </div>

      <div class="monitor-logs__detail-grid">
        <div class="monitor-logs__detail-item">
          <span>{{ t('ec.monitor.logs.detail.agentId') }}</span>
          <strong>{{ activeRecord.agentId || '-' }}</strong>
        </div>
        <div class="monitor-logs__detail-item">
          <span>{{ t('ec.monitor.logs.detail.appName') }}</span>
          <strong>{{ activeRecord.appName || '-' }}</strong>
        </div>
        <div class="monitor-logs__detail-item is-full">
          <span>{{ t('ec.monitor.logs.detail.logPath') }}</span>
          <strong class="monitor-logs__mono">{{ activeRecord.logPath || '-' }}</strong>
        </div>
        <div class="monitor-logs__detail-item is-full">
          <span>{{ t('ec.monitor.logs.detail.rule') }}</span>
          <strong>{{ activeRecord.matchedRuleName || '-' }}</strong>
          <em class="monitor-logs__keyword">{{ activeRecord.matchedKeyword || '-' }}</em>
        </div>
      </div>

      <div class="monitor-logs__detail-content">
        <span>{{ t('ec.monitor.logs.detail.content') }}</span>
        <div class="monitor-logs__content-box">
          {{ activeRecord.logContent || '-' }}
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import dayjs from 'dayjs'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ElMessage } from 'element-plus'
import { useSystemStore } from '@/stores/modules/systemStore'
import { getMonitorLogDetail, getMonitorLogList, getMonitorLogStats } from '@/services/modules/monitorService'

defineOptions({ name: 'MonitorLogs' })

const { t } = useI18n()
const { device } = storeToRefs(useSystemStore())

const tableLoading = ref(false)
const detailLoading = ref(false)
const detailVisible = ref(false)
const activeRecord = ref(null)
const sourceRecords = ref([])
const stats = ref({})

const queryForm = reactive({
  agentId: '',
  level: '',
  keyword: '',
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  total: 0,
})

const paginationLayout = computed(() => {
  return device.value === 'mobile' ? 'total, prev, next' : 'total, prev, pager, next, sizes'
})

const filteredRecords = computed(() => {
  const keyword = queryForm.keyword.trim().toLowerCase()

  const filtered = sourceRecords.value.filter((item) => {
    const matchesKeyword =
      !keyword ||
      [item.agentId, item.appName, item.matchedRuleName, item.matchedKeyword, item.logContent]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(keyword))

    return matchesKeyword
  })

  return filtered.sort((a, b) => {
    return dayjs(b.logTime).valueOf() - dayjs(a.logTime).valueOf()
  })
})

const pagedRecords = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize
  const end = start + pagination.pageSize
  return filteredRecords.value.slice(start, end)
})

const syncPaginationTotal = () => {
  pagination.total = filteredRecords.value.length

  const maxPage = Math.max(1, Math.ceil(pagination.total / pagination.pageSize))
  if (pagination.currentPage > maxPage) {
    pagination.currentPage = maxPage
  }
}

const loadStats = async () => {
  stats.value = (await getMonitorLogStats()) || {}
}

const loadRecords = async () => {
  sourceRecords.value =
    (await getMonitorLogList({
      agentId: queryForm.agentId || undefined,
      level: queryForm.level || undefined,
      limit: 500,
    })) || []
  syncPaginationTotal()
}

const loadData = async () => {
  tableLoading.value = true
  try {
    await Promise.all([loadStats(), loadRecords()])
  } catch (error) {
    ElMessage.error(error.message || t('ec.monitor.logs.message.loadFailed'))
  } finally {
    tableLoading.value = false
  }
}

const handleSearch = () => {
  pagination.currentPage = 1
  loadData()
}

const handleReset = () => {
  queryForm.agentId = ''
  queryForm.level = ''
  queryForm.keyword = ''
  pagination.currentPage = 1
  loadData()
}

const handlePageChange = (page) => {
  pagination.currentPage = page
}

const handlePageSizeChange = (pageSize) => {
  pagination.pageSize = pageSize
  pagination.currentPage = 1
  syncPaginationTotal()
}

const openDetail = async (row) => {
  detailVisible.value = true
  detailLoading.value = true
  activeRecord.value = row

  try {
    const detail = await getMonitorLogDetail(row.id)
    activeRecord.value = detail || row
  } catch (error) {
    ElMessage.error(error.message || t('ec.monitor.logs.message.detailFailed'))
  } finally {
    detailLoading.value = false
  }
}

const formatDateTime = (value) => {
  return value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '-'
}

const getLevelLabel = (level) => {
  if (level === 'CRITICAL') return t('ec.monitor.logs.level.critical')
  if (level === 'UNKNOWN_ERROR') return t('ec.monitor.logs.level.unknownError')
  return level || '-'
}

const getLevelTagType = (level) => {
  if (level === 'CRITICAL') return 'danger'
  if (level === 'UNKNOWN_ERROR') return 'warning'
  return 'info'
}

onMounted(() => {
  loadData()
})

watch(
  () => filteredRecords.value.length,
  () => {
    syncPaginationTotal()
  },
)
</script>

<style lang="scss" scoped>
.monitor-logs {
  :deep(.el-form.el-form--inline) {
    margin: -8px -8px 8px;

    .el-form-item {
      margin: 0;
      padding: 8px;
    }

    .el-input,
    .el-select {
      width: 220px;
    }
  }

  :deep(.el-table .el-table__row) {
    cursor: pointer;
  }

  .el-pagination {
    justify-content: flex-end;
    margin-top: 16px;
  }
}

.monitor-logs__summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-bottom: 16px;
}

.monitor-logs__summary-card {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-blank);

  strong {
    font-size: 24px;
    line-height: 1;
    color: var(--el-text-color-primary);
  }

  .is-danger {
    color: var(--el-color-danger);
  }

  .is-warning {
    color: var(--el-color-warning);
  }
}

.monitor-logs__summary-label {
  color: var(--el-text-color-secondary);
  font-size: var(--el-font-size-small);
}

.monitor-logs__rule-cell {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.monitor-logs__keyword,
.monitor-logs__mono {
  color: var(--el-text-color-secondary);
  font-family: var(--el-font-family-monospace, 'Consolas', 'Courier New', monospace);
  font-size: var(--el-font-size-small);
}

.monitor-logs__detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 240px;
}

.monitor-logs__detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--el-border-color-light);
}

.monitor-logs__detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.monitor-logs__detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  > span {
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);
  }

  > strong,
  > em {
    color: var(--el-text-color-primary);
    font-style: normal;
    word-break: break-all;
  }

  &.is-full {
    grid-column: 1 / -1;
  }
}

.monitor-logs__detail-content {
  display: flex;
  flex-direction: column;
  gap: 8px;

  > span {
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);
  }
}

.monitor-logs__content-box {
  min-height: 180px;
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-light);
  color: var(--el-text-color-primary);
  font-family: var(--el-font-family-monospace, 'Consolas', 'Courier New', monospace);
  font-size: var(--el-font-size-small);
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-all;
}

@media only screen and (max-width: 991px) {
  .monitor-logs {
    :deep(.el-form.el-form--inline) {
      flex-direction: column;

      .el-form-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;

        .el-form-item__content {
          width: 100%;
        }
      }

      .el-input,
      .el-select {
        width: 100%;
      }
    }

    .el-pagination {
      justify-content: center;
    }
  }

  .monitor-logs__summary,
  .monitor-logs__detail-grid {
    grid-template-columns: 1fr;
  }

  .monitor-logs__detail-header {
    align-items: flex-start;
    flex-direction: column;
  }
}
</style>
