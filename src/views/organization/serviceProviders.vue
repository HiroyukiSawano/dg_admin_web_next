<template>
  <el-card class="organization-page">
    <el-form :model="queryForm" inline @submit.prevent>
      <el-form-item :label="t('ec.organization.serviceProvider.form.keyword')">
        <el-input
          v-model="queryForm.keyword"
          clearable
          :placeholder="t('ec.organization.serviceProvider.form.keywordPlaceholder')"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item :label="t('ec.organization.serviceProvider.form.type')">
        <el-select v-model="queryForm.type" clearable :placeholder="t('ec.organization.serviceProvider.form.typePlaceholder')">
          <el-option
            v-for="option in serviceProviderTypeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('ec.organization.serviceProvider.form.status')">
        <el-input v-model="queryForm.status" clearable :placeholder="t('ec.organization.serviceProvider.form.statusPlaceholder')" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">{{ t('ec.global.button.text.search') }}</el-button>
        <el-button @click="handleReset">{{ t('ec.global.button.text.reset') }}</el-button>
      </el-form-item>
      <el-form-item class="margin-left-auto">
        <el-button type="primary" @click="openCreate">{{ t('ec.organization.common.create') }}</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="tableLoading" :data="tableData" row-key="id">
      <el-table-column prop="code" :label="t('ec.organization.common.code')" min-width="160" show-overflow-tooltip />
      <el-table-column prop="name" :label="t('ec.organization.common.name')" min-width="200" show-overflow-tooltip />
      <el-table-column :label="t('ec.organization.serviceProvider.table.type')" min-width="160">
        <template #default="{ row }">
          {{ getServiceProviderTypeLabel(row.type) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="unifiedSocialCreditCode"
        :label="t('ec.organization.serviceProvider.table.unifiedSocialCreditCode')"
        min-width="200"
        show-overflow-tooltip
      />
      <el-table-column prop="ratingLevel" :label="t('ec.organization.serviceProvider.table.ratingLevel')" width="120" show-overflow-tooltip />
      <el-table-column :label="t('ec.organization.common.status')" width="140">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status)">{{ row.status || '-' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.organization.common.updatedAt')" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.organization.common.actions')" fixed="right" width="180">
        <template #default="{ row }">
          <el-button type="primary" link @click="openDetail(row)">{{ t('ec.organization.common.detail') }}</el-button>
          <el-button type="primary" link @click="openEdit(row)">{{ t('ec.organization.common.edit') }}</el-button>
          <el-button type="danger" link @click="handleDelete(row)">{{ t('ec.organization.common.delete') }}</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="t('ec.organization.common.empty')" />
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

  <el-dialog
    v-model="dialogVisible"
    :title="dialogMode === 'create' ? t('ec.organization.serviceProvider.dialog.createTitle') : t('ec.organization.serviceProvider.dialog.editTitle')"
    :width="680"
    destroy-on-close
    append-to-body
    @closed="handleDialogClosed"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px">
      <el-form-item :label="t('ec.organization.common.code')" prop="code">
        <el-input v-model="formData.code" clearable :placeholder="t('ec.organization.serviceProvider.form.codePlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.common.name')" prop="name">
        <el-input v-model="formData.name" clearable :placeholder="t('ec.organization.serviceProvider.form.namePlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.serviceProvider.table.unifiedSocialCreditCode')" prop="unifiedSocialCreditCode">
        <el-input
          v-model="formData.unifiedSocialCreditCode"
          clearable
          :placeholder="t('ec.organization.serviceProvider.form.unifiedSocialCreditCodePlaceholder')"
        />
      </el-form-item>
      <el-form-item :label="t('ec.organization.serviceProvider.table.type')" prop="type">
        <el-select v-model="formData.type" :placeholder="t('ec.organization.serviceProvider.form.typePlaceholder')" style="width: 100%;">
          <el-option
            v-for="option in serviceProviderTypeOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('ec.organization.serviceProvider.table.ratingLevel')" prop="ratingLevel">
        <el-input
          v-model="formData.ratingLevel"
          clearable
          :placeholder="t('ec.organization.serviceProvider.form.ratingLevelPlaceholder')"
        />
      </el-form-item>
      <el-form-item :label="t('ec.organization.common.status')" prop="status">
        <el-input v-model="formData.status" clearable :placeholder="t('ec.organization.serviceProvider.form.statusPlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.serviceProvider.table.remark')" prop="remark">
        <el-input v-model="formData.remark" type="textarea" :rows="3" :placeholder="t('ec.organization.serviceProvider.form.remarkPlaceholder')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">{{ t('ec.global.button.text.cancel') }}</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">{{ t('ec.global.button.text.submit') }}</el-button>
    </template>
  </el-dialog>

  <el-drawer
    v-model="detailVisible"
    :title="t('ec.organization.serviceProvider.drawer.title')"
    size="620px"
    append-to-body
  >
    <div v-loading="detailLoading" class="organization-detail" v-if="detailRecord">
      <div class="organization-detail__grid">
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.common.code') }}</span>
          <strong>{{ detailRecord.serviceProvider?.code || '-' }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.common.name') }}</span>
          <strong>{{ detailRecord.serviceProvider?.name || '-' }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.serviceProvider.table.type') }}</span>
          <strong>{{ getServiceProviderTypeLabel(detailRecord.serviceProvider?.type) }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.common.status') }}</span>
          <strong>{{ detailRecord.serviceProvider?.status || '-' }}</strong>
        </div>
        <div class="organization-detail__item is-full">
          <span>{{ t('ec.organization.serviceProvider.table.unifiedSocialCreditCode') }}</span>
          <strong>{{ detailRecord.serviceProvider?.unifiedSocialCreditCode || '-' }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.serviceProvider.table.ratingLevel') }}</span>
          <strong>{{ detailRecord.serviceProvider?.ratingLevel || '-' }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.common.updatedAt') }}</span>
          <strong>{{ formatDateTime(detailRecord.serviceProvider?.updatedAt) }}</strong>
        </div>
        <div class="organization-detail__item is-full">
          <span>{{ t('ec.organization.serviceProvider.table.remark') }}</span>
          <strong>{{ detailRecord.serviceProvider?.remark || '-' }}</strong>
        </div>
      </div>

      <div class="organization-detail__relations">
        <div class="organization-detail__relation-block">
          <span>{{ t('ec.organization.serviceProvider.relations.hardwareAssets') }}</span>
          <div class="organization-detail__tags">
            <el-tag v-for="item in hardwareRelationLabels" :key="`hardware-${item}`">{{ item }}</el-tag>
            <el-empty v-if="hardwareRelationLabels.length === 0" :image-size="56" :description="t('ec.organization.common.noRelation')" />
          </div>
        </div>
        <div class="organization-detail__relation-block">
          <span>{{ t('ec.organization.serviceProvider.relations.informationSystems') }}</span>
          <div class="organization-detail__tags">
            <el-tag v-for="item in informationSystemRelationLabels" :key="`system-${item}`">{{ item }}</el-tag>
            <el-empty v-if="informationSystemRelationLabels.length === 0" :image-size="56" :description="t('ec.organization.common.noRelation')" />
          </div>
        </div>
        <div class="organization-detail__relation-block">
          <span>{{ t('ec.organization.serviceProvider.relations.projects') }}</span>
          <div class="organization-detail__tags">
            <el-tag v-for="item in projectRelationLabels" :key="`project-${item}`">{{ item }}</el-tag>
            <el-empty v-if="projectRelationLabels.length === 0" :image-size="56" :description="t('ec.organization.common.noRelation')" />
          </div>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useSystemStore } from '@/stores/modules/systemStore'
import {
  createServiceProvider,
  deleteServiceProvider,
  getOrganizationHardwareOptions,
  getOrganizationInformationSystemOptions,
  getOrganizationProjectOptions,
  getServiceProviderDetail,
  getServiceProviderList,
  updateServiceProvider,
} from '@/services/modules/organizationService'
import { buildListLabelMap, formatDateTime, getStatusTagType, mapIdsToLabels } from './helpers'

defineOptions({ name: 'OrganizationServiceProviders' })

const { t } = useI18n()
const { device } = storeToRefs(useSystemStore())

const serviceProviderTypeOptions = computed(() => {
  return [
    { label: t('ec.organization.serviceProvider.type.supplier'), value: 'SUPPLIER' },
    { label: t('ec.organization.serviceProvider.type.serviceProvider'), value: 'SERVICE_PROVIDER' },
    { label: t('ec.organization.serviceProvider.type.integrator'), value: 'INTEGRATOR' },
    { label: t('ec.organization.serviceProvider.type.maintenance'), value: 'MAINTENANCE' },
  ]
})

const tableLoading = ref(false)
const detailLoading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogMode = ref('create')
const formRef = ref(null)
const tableData = ref([])
const detailRecord = ref(null)
const hardwareOptions = ref([])
const informationSystemOptions = ref([])
const projectOptions = ref([])

const queryForm = reactive({
  keyword: '',
  type: '',
  status: '',
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  total: 0,
})

const formData = reactive({
  id: null,
  code: '',
  name: '',
  unifiedSocialCreditCode: '',
  type: '',
  ratingLevel: '',
  status: '',
  remark: '',
})

const formRules = {
  code: [{ required: true, message: t('ec.organization.serviceProvider.validation.codeRequired'), trigger: 'blur' }],
  name: [{ required: true, message: t('ec.organization.serviceProvider.validation.nameRequired'), trigger: 'blur' }],
  type: [{ required: true, message: t('ec.organization.serviceProvider.validation.typeRequired'), trigger: 'change' }],
  status: [{ required: true, message: t('ec.organization.serviceProvider.validation.statusRequired'), trigger: 'blur' }],
}

const paginationLayout = computed(() => {
  return device.value === 'mobile' ? 'total, prev, next' : 'total, prev, pager, next, sizes'
})

const hardwareNameMap = computed(() => buildListLabelMap(hardwareOptions.value, 'displayLabel'))
const informationSystemNameMap = computed(() => buildListLabelMap(informationSystemOptions.value, 'displayLabel'))
const projectNameMap = computed(() => buildListLabelMap(projectOptions.value, 'displayLabel'))
const hardwareRelationLabels = computed(() => mapIdsToLabels(detailRecord.value?.hardwareAssetIds, hardwareNameMap.value))
const informationSystemRelationLabels = computed(() => mapIdsToLabels(detailRecord.value?.informationSystemIds, informationSystemNameMap.value))
const projectRelationLabels = computed(() => mapIdsToLabels(detailRecord.value?.projectIds, projectNameMap.value))

const getServiceProviderTypeLabel = (value) => {
  return serviceProviderTypeOptions.value.find((item) => item.value === value)?.label || value || '-'
}

const buildDisplayLabel = (primary, secondary) => {
  return [primary, secondary].filter(Boolean).join(' / ') || '-'
}

const resetFormData = () => {
  formData.id = null
  formData.code = ''
  formData.name = ''
  formData.unifiedSocialCreditCode = ''
  formData.type = ''
  formData.ratingLevel = ''
  formData.status = ''
  formData.remark = ''
}

const loadData = async () => {
  tableLoading.value = true
  try {
    const pageData = await getServiceProviderList({
      pageNo: pagination.currentPage,
      pageSize: pagination.pageSize,
      keyword: queryForm.keyword || undefined,
      type: queryForm.type || undefined,
      status: queryForm.status || undefined,
    })
    tableData.value = pageData.records
    pagination.total = pageData.total
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.serviceProvider.message.loadFailed'))
  } finally {
    tableLoading.value = false
  }
}

const loadSupportOptions = async () => {
  const [hardwareAssets, informationSystems, projects] = await Promise.all([
    getOrganizationHardwareOptions(),
    getOrganizationInformationSystemOptions(),
    getOrganizationProjectOptions(),
  ])

  hardwareOptions.value = hardwareAssets.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.assetCode, item.assetName),
  }))
  informationSystemOptions.value = informationSystems.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.code, item.name),
  }))
  projectOptions.value = projects.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.code, item.name),
  }))
}

const handleSearch = () => {
  pagination.currentPage = 1
  loadData()
}

const handleReset = () => {
  queryForm.keyword = ''
  queryForm.type = ''
  queryForm.status = ''
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

const openCreate = () => {
  resetFormData()
  dialogMode.value = 'create'
  dialogVisible.value = true
}

const openEdit = (row) => {
  resetFormData()
  dialogMode.value = 'edit'
  formData.id = row.id
  formData.code = row.code || ''
  formData.name = row.name || ''
  formData.unifiedSocialCreditCode = row.unifiedSocialCreditCode || ''
  formData.type = row.type || ''
  formData.ratingLevel = row.ratingLevel || ''
  formData.status = row.status || ''
  formData.remark = row.remark || ''
  dialogVisible.value = true
}

const openDetail = async (row) => {
  detailVisible.value = true
  detailLoading.value = true
  detailRecord.value = null
  try {
    await loadSupportOptions()
    detailRecord.value = await getServiceProviderDetail(row.id)
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.serviceProvider.message.detailFailed'))
  } finally {
    detailLoading.value = false
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return

  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const payload = {
      code: formData.code,
      name: formData.name,
      unifiedSocialCreditCode: formData.unifiedSocialCreditCode,
      type: formData.type,
      ratingLevel: formData.ratingLevel,
      status: formData.status,
      remark: formData.remark,
    }

    if (dialogMode.value === 'create') {
      await createServiceProvider(payload)
    } else {
      await updateServiceProvider(formData.id, payload)
    }

    ElMessage.success(t('ec.organization.common.saveSuccess'))
    dialogVisible.value = false
    await loadData()
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.common.saveFailed'))
  } finally {
    submitLoading.value = false
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
    await loadData()
  } catch (error) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error.message || t('ec.organization.common.deleteFailed'))
  }
}

const handleDialogClosed = () => {
  formRef.value?.clearValidate()
  resetFormData()
}

onMounted(() => {
  loadSupportOptions().catch(() => {})
  loadData()
})
</script>

<style lang="scss" scoped>
.organization-page {
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

  .el-pagination {
    justify-content: flex-end;
    margin-top: 16px;
  }
}

.organization-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 240px;
}

.organization-detail__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.organization-detail__item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  > span {
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);
  }

  > strong {
    color: var(--el-text-color-primary);
    word-break: break-all;
  }

  &.is-full {
    grid-column: 1 / -1;
  }
}

.organization-detail__relations {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.organization-detail__relation-block {
  display: flex;
  flex-direction: column;
  gap: 8px;

  > span {
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);
  }
}

.organization-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-light);
}

@media only screen and (max-width: 991px) {
  .organization-page {
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

  .organization-detail__grid {
    grid-template-columns: 1fr;
  }
}
</style>
