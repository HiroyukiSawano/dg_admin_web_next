<template>
  <el-card class="software-page">
    <el-form :model="queryForm" inline @submit.prevent>
      <el-form-item :label="t('ec.software.common.search')">
        <el-input
          v-model="queryForm.keyword"
          clearable
          :placeholder="t('ec.software.common.searchPlaceholder')"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item :label="t('ec.software.common.systemType')">
        <el-select v-model="queryForm.systemType" clearable :placeholder="t('ec.software.form.systemTypePlaceholder')">
          <el-option v-for="item in systemTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('ec.software.common.status')">
        <el-select v-model="queryForm.status" clearable :placeholder="t('ec.software.form.statusPlaceholder')">
          <el-option v-for="item in informationSystemStatusOptions" :key="item.value" :label="item.displayLabel" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">{{ t('ec.global.button.text.search') }}</el-button>
        <el-button @click="handleReset">{{ t('ec.global.button.text.reset') }}</el-button>
      </el-form-item>
      <el-form-item class="margin-left-auto">
        <el-button type="primary" @click="openCreate">{{ t('ec.software.common.create') }}</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="tableLoading" :data="tableData" row-key="id">
      <el-table-column prop="code" :label="t('ec.software.common.code')" min-width="160" show-overflow-tooltip />
      <el-table-column prop="name" :label="t('ec.software.common.name')" min-width="200" show-overflow-tooltip />
      <el-table-column :label="t('ec.software.common.systemType')" min-width="180">
        <template #default="{ row }">
          {{ getSystemTypeLabel(row.systemType) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.software.common.status')" width="140" show-overflow-tooltip>
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status, informationSystemStatusMap)">{{ getStatusLabel(row.status, informationSystemStatusMap) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.software.common.updatedAt')" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.software.common.actions')" fixed="right" width="250">
        <template #default="{ row }">
          <el-button type="primary" link @click="openDetail(row)">{{ t('ec.software.common.detail') }}</el-button>
          <el-button type="primary" link @click="openEdit(row)">{{ t('ec.software.common.edit') }}</el-button>
          <el-button type="primary" link @click="openRelationDialog(row)">{{ t('ec.software.common.relations') }}</el-button>
          <el-button type="danger" link @click="handleDelete(row)">{{ t('ec.software.common.delete') }}</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="t('ec.software.common.empty')" />
      </template>
    </el-table>

    <el-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      class="software-pagination"
      background
      layout="total, sizes, prev, pager, next, jumper"
      :total="pagination.total"
      :page-sizes="pagination.pageSizes"
      @current-change="handlePageChange"
      @size-change="handlePageSizeChange"
    />
  </el-card>

  <el-dialog
    v-model="formDialog.visible"
    :title="formDialog.mode === 'create' ? t('ec.software.form.createTitle') : t('ec.software.form.editTitle')"
    :width="680"
    destroy-on-close
    append-to-body
    @closed="handleFormClosed"
  >
    <div v-loading="formDialog.loading">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <div class="software-form-grid">
          <el-form-item :label="t('ec.software.common.code')" prop="code">
            <el-input v-model="formData.code" clearable :placeholder="t('ec.software.form.codePlaceholder')" />
          </el-form-item>
          <el-form-item :label="t('ec.software.common.name')" prop="name">
            <el-input v-model="formData.name" clearable :placeholder="t('ec.software.form.namePlaceholder')" />
          </el-form-item>
          <el-form-item :label="t('ec.software.common.systemType')" prop="systemType">
            <el-select v-model="formData.systemType" clearable :placeholder="t('ec.software.form.systemTypePlaceholder')">
              <el-option v-for="item in systemTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('ec.software.common.status')" prop="status">
            <el-select v-model="formData.status" clearable :placeholder="t('ec.software.form.statusPlaceholder')">
              <el-option v-for="item in informationSystemStatusOptions" :key="item.value" :label="item.displayLabel" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item class="is-full" :label="t('ec.software.common.remark')" prop="remark">
            <el-input
              v-model="formData.remark"
              type="textarea"
              :rows="3"
              :placeholder="t('ec.software.form.remarkPlaceholder')"
            />
          </el-form-item>
        </div>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="formDialog.visible = false">{{ t('ec.global.button.text.cancel') }}</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">{{ t('ec.global.button.text.submit') }}</el-button>
    </template>
  </el-dialog>

  <el-drawer
    v-model="detailVisible"
    :title="t('ec.software.detail.title')"
    size="720px"
    append-to-body
  >
    <div v-loading="detailLoading" class="software-detail" v-if="detailRecord">
      <div class="software-section">
        <div class="software-section__title">{{ t('ec.software.detail.basic') }}</div>
        <div class="software-detail__grid">
          <div class="software-detail__item">
            <span>{{ t('ec.software.common.code') }}</span>
            <strong>{{ detailRecord.informationSystem?.code || '-' }}</strong>
          </div>
          <div class="software-detail__item">
            <span>{{ t('ec.software.common.name') }}</span>
            <strong>{{ detailRecord.informationSystem?.name || '-' }}</strong>
          </div>
          <div class="software-detail__item">
            <span>{{ t('ec.software.common.systemType') }}</span>
            <strong>{{ getSystemTypeLabel(detailRecord.informationSystem?.systemType) }}</strong>
          </div>
          <div class="software-detail__item">
            <span>{{ t('ec.software.common.status') }}</span>
            <strong>{{ getStatusLabel(detailRecord.informationSystem?.status, informationSystemStatusMap) }}</strong>
          </div>
          <div class="software-detail__item is-full">
            <span>{{ t('ec.software.common.remark') }}</span>
            <strong>{{ detailRecord.informationSystem?.remark || '-' }}</strong>
          </div>
          <div class="software-detail__item">
            <span>{{ t('ec.software.common.createdAt') }}</span>
            <strong>{{ formatDateTime(detailRecord.informationSystem?.createdAt) }}</strong>
          </div>
          <div class="software-detail__item">
            <span>{{ t('ec.software.common.updatedAt') }}</span>
            <strong>{{ formatDateTime(detailRecord.informationSystem?.updatedAt) }}</strong>
          </div>
        </div>
      </div>

      <div class="software-section">
        <div class="software-section__title">{{ t('ec.software.detail.serviceProviders') }}</div>
        <div class="software-tag-panel">
          <el-tag v-for="(item, index) in vendorRelationLabels" :key="`vendor-${index}`">{{ item }}</el-tag>
          <el-empty v-if="vendorRelationLabels.length === 0" :description="t('ec.software.common.noData')" :image-size="56" />
        </div>
      </div>

      <div class="software-section">
        <div class="software-section__title">{{ t('ec.software.detail.persons') }}</div>
        <div class="software-tag-panel">
          <el-tag v-for="(item, index) in personRelationLabels" :key="`person-${index}`">{{ item }}</el-tag>
          <el-empty v-if="personRelationLabels.length === 0" :description="t('ec.software.common.noData')" :image-size="56" />
        </div>
      </div>

      <div class="software-section">
        <div class="software-section__title">{{ t('ec.software.detail.projects') }}</div>
        <div class="software-tag-panel">
          <el-tag v-for="(item, index) in projectRelationLabels" :key="`project-${index}`">{{ item }}</el-tag>
          <el-empty v-if="projectRelationLabels.length === 0" :description="t('ec.software.common.noData')" :image-size="56" />
        </div>
      </div>
    </div>
  </el-drawer>

  <el-dialog
    v-model="relationDialog.visible"
    :title="t('ec.software.relation.title')"
    :width="720"
    destroy-on-close
    append-to-body
    @closed="handleRelationClosed"
  >
    <div v-loading="relationDialog.loading">
      <el-form :model="relationDialog.form" label-width="112px">
        <el-form-item :label="t('ec.software.detail.serviceProviders')">
          <el-select
            v-model="relationDialog.form.serviceProviderIds"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :placeholder="t('ec.software.relation.serviceProvidersPlaceholder')"
            style="width: 100%;"
          >
            <el-option v-for="item in serviceProviderOptions" :key="item.id" :label="item.displayLabel" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('ec.software.detail.persons')">
          <el-select
            v-model="relationDialog.form.personIds"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :placeholder="t('ec.software.relation.personsPlaceholder')"
            style="width: 100%;"
          >
            <el-option v-for="item in personOptions" :key="item.id" :label="item.displayLabel" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('ec.software.detail.projects')">
          <el-select
            v-model="relationDialog.form.projectIds"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :placeholder="t('ec.software.relation.projectsPlaceholder')"
            style="width: 100%;"
          >
            <el-option v-for="item in projectOptions" :key="item.id" :label="item.displayLabel" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="relationDialog.visible = false">{{ t('ec.global.button.text.cancel') }}</el-button>
      <el-button type="primary" :loading="relationSubmitLoading" @click="handleRelationSubmit">{{ t('ec.global.button.text.submit') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStatusDictionaries } from '@/services/modules/dictionaryService'
import { buildStatusOptionMap, getStatusLabel, getStatusTagType } from '@/utils/statusDictionary'
import {
  createInformationSystem,
  deleteInformationSystem,
  getInformationSystemDetail,
  getInformationSystemList,
  getSoftwarePersonOptions,
  getSoftwareProjectOptions,
  getSoftwareServiceProviderOptions,
  syncInformationSystemRelations,
  updateInformationSystem,
} from '@/services/modules/softwareService'
import { buildListLabelMap, formatDateTime, normalizeIdList } from './helpers'

defineOptions({ name: 'SoftwareAssets' })

const { t, locale } = useI18n()

const tableLoading = ref(false)
const detailLoading = ref(false)
const submitLoading = ref(false)
const relationSubmitLoading = ref(false)
const detailVisible = ref(false)
const detailRecord = ref(null)
const formRef = ref(null)

const tableData = ref([])
const statusDictionaries = ref({})
const serviceProviderOptions = ref([])
const personOptions = ref([])
const projectOptions = ref([])

const queryForm = reactive({
  keyword: '',
  systemType: '',
  status: '',
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  total: 0,
  pageSizes: [10, 20, 50, 100],
})

const formDialog = reactive({
  visible: false,
  mode: 'create',
  systemId: null,
  loading: false,
})

const relationDialog = reactive({
  visible: false,
  systemId: null,
  loading: false,
  form: {
    serviceProviderIds: [],
    personIds: [],
    projectIds: [],
  },
})

const formData = reactive({
  code: '',
  name: '',
  systemType: '',
  status: '',
  remark: '',
})

const systemTypeOptions = computed(() => [
  { value: 'EXTERNAL_SERVICE', label: t('ec.software.type.externalService') },
  { value: 'INTERNAL_OFFICE', label: t('ec.software.type.internalOffice') },
  { value: 'SUPPORT_SYSTEM', label: t('ec.software.type.supportSystem') },
])

const informationSystemStatusOptions = computed(() => {
  return Object.values(buildStatusOptionMap(statusDictionaries.value.informationSystemStatus, locale.value))
})

const informationSystemStatusMap = computed(() => {
  return buildStatusOptionMap(informationSystemStatusOptions.value, locale.value)
})

const vendorNameMap = computed(() => buildListLabelMap(serviceProviderOptions.value, 'displayLabel'))
const personNameMap = computed(() => buildListLabelMap(personOptions.value, 'displayLabel'))
const projectNameMap = computed(() => buildListLabelMap(projectOptions.value, 'displayLabel'))

const vendorRelationLabels = computed(() => mapIdsToLabels(detailRecord.value?.serviceProviderIds, vendorNameMap.value))
const personRelationLabels = computed(() => mapIdsToLabels(detailRecord.value?.personIds, personNameMap.value))
const projectRelationLabels = computed(() => mapIdsToLabels(detailRecord.value?.projectIds, projectNameMap.value))

const formRules = computed(() => ({
  code: [{ required: true, message: t('ec.software.validation.codeRequired'), trigger: 'blur' }],
  name: [{ required: true, message: t('ec.software.validation.nameRequired'), trigger: 'blur' }],
  systemType: [{ required: true, message: t('ec.software.validation.systemTypeRequired'), trigger: 'change' }],
  status: [{ required: true, message: t('ec.software.validation.statusRequired'), trigger: 'change' }],
}))

const buildDisplayLabel = (primary, secondary) => {
  return [primary, secondary].filter(Boolean).join(' / ') || '-'
}

const mapIdsToLabels = (ids, labelMap) => {
  return normalizeIdList(ids).map((item) => labelMap[item] || String(item))
}

const getSystemTypeLabel = (value) => {
  const matched = systemTypeOptions.value.find((item) => item.value === value)
  return matched?.label || value || '-'
}

const resetFormData = () => {
  formData.code = ''
  formData.name = ''
  formData.systemType = ''
  formData.status = ''
  formData.remark = ''
}

const resetRelationDialog = () => {
  relationDialog.systemId = null
  relationDialog.loading = false
  relationDialog.form.serviceProviderIds = []
  relationDialog.form.personIds = []
  relationDialog.form.projectIds = []
}

const fillFormData = (detail) => {
  const informationSystem = detail?.informationSystem || {}
  resetFormData()
  formData.code = informationSystem.code || ''
  formData.name = informationSystem.name || ''
  formData.systemType = informationSystem.systemType || ''
  formData.status = informationSystem.status || ''
  formData.remark = informationSystem.remark || ''
}

const buildSubmitPayload = () => ({
  code: formData.code,
  name: formData.name,
  systemType: formData.systemType,
  status: formData.status,
  remark: formData.remark,
})

const loadSupportOptions = async () => {
  const [serviceProviders, persons, projects] = await Promise.all([
    getSoftwareServiceProviderOptions(),
    getSoftwarePersonOptions(),
    getSoftwareProjectOptions(),
  ])

  serviceProviderOptions.value = serviceProviders.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.code, item.name),
  }))
  personOptions.value = persons.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.name, item.employeeNo),
  }))
  projectOptions.value = projects.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.code, item.name),
  }))
}

const loadStatusOptions = async () => {
  statusDictionaries.value = await getStatusDictionaries()
}

const loadData = async () => {
  tableLoading.value = true
  try {
    const pageData = await getInformationSystemList({
      pageNo: pagination.currentPage,
      pageSize: pagination.pageSize,
      keyword: queryForm.keyword || undefined,
      systemType: queryForm.systemType || undefined,
      status: queryForm.status || undefined,
    })
    tableData.value = pageData.records
    pagination.total = pageData.total
  } catch (error) {
    ElMessage.error(error.message || t('ec.software.message.loadFailed'))
  } finally {
    tableLoading.value = false
  }
}

const fetchDetail = async (id) => getInformationSystemDetail(id)

const handleSearch = () => {
  pagination.currentPage = 1
  loadData()
}

const handleReset = () => {
  queryForm.keyword = ''
  queryForm.systemType = ''
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

const openCreate = async () => {
  try {
    await loadSupportOptions()
  } catch (error) {
    ElMessage.error(error.message || t('ec.software.message.supportLoadFailed'))
    return
  }
  formDialog.mode = 'create'
  formDialog.systemId = null
  formDialog.loading = false
  resetFormData()
  formDialog.visible = true
}

const openEdit = async (row) => {
  formDialog.mode = 'edit'
  formDialog.systemId = row.id
  formDialog.visible = true
  formDialog.loading = true
  try {
    await loadSupportOptions()
    const detail = await fetchDetail(row.id)
    fillFormData(detail)
  } catch (error) {
    ElMessage.error(error.message || t('ec.software.message.detailFailed'))
    formDialog.visible = false
  } finally {
    formDialog.loading = false
  }
}

const openDetail = async (row) => {
  detailVisible.value = true
  detailLoading.value = true
  detailRecord.value = null
  try {
    await loadSupportOptions()
    detailRecord.value = await fetchDetail(row.id)
  } catch (error) {
    ElMessage.error(error.message || t('ec.software.message.detailFailed'))
  } finally {
    detailLoading.value = false
  }
}

const openRelationDialog = async (row) => {
  relationDialog.visible = true
  relationDialog.systemId = row.id
  relationDialog.loading = true
  try {
    await loadSupportOptions()
    const detail = await fetchDetail(row.id)
    relationDialog.form.serviceProviderIds = normalizeIdList(detail.serviceProviderIds)
    relationDialog.form.personIds = normalizeIdList(detail.personIds)
    relationDialog.form.projectIds = normalizeIdList(detail.projectIds)
  } catch (error) {
    ElMessage.error(error.message || t('ec.software.message.detailFailed'))
    relationDialog.visible = false
  } finally {
    relationDialog.loading = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('ec.software.common.deleteConfirm', { name: row.name || row.code }),
      t('ec.software.common.delete'),
      {
        type: 'warning',
        confirmButtonText: t('ec.software.common.delete'),
        cancelButtonText: t('ec.global.button.text.cancel'),
        confirmButtonClass: 'el-button--danger',
      },
    )

    await deleteInformationSystem(row.id)
    ElMessage.success(t('ec.software.common.deleteSuccess'))
    await loadData()
  } catch (error) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error.message || t('ec.software.common.deleteFailed'))
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const payload = buildSubmitPayload()
    if (formDialog.mode === 'create') {
      await createInformationSystem(payload)
    } else {
      await updateInformationSystem(formDialog.systemId, payload)
    }
    ElMessage.success(t('ec.software.common.saveSuccess'))
    formDialog.visible = false
    await loadData()
  } catch (error) {
    ElMessage.error(error.message || t('ec.software.common.saveFailed'))
  } finally {
    submitLoading.value = false
  }
}

const handleRelationSubmit = async () => {
  relationSubmitLoading.value = true
  try {
    await syncInformationSystemRelations(relationDialog.systemId, {
      serviceProviderIds: relationDialog.form.serviceProviderIds,
      personIds: relationDialog.form.personIds,
      projectIds: relationDialog.form.projectIds,
    })
    ElMessage.success(t('ec.software.relation.saveSuccess'))
    relationDialog.visible = false
    if (detailVisible.value && detailRecord.value?.informationSystem?.id === relationDialog.systemId) {
      detailRecord.value = await fetchDetail(relationDialog.systemId)
    }
  } catch (error) {
    ElMessage.error(error.message || t('ec.software.relation.saveFailed'))
  } finally {
    relationSubmitLoading.value = false
  }
}

const handleFormClosed = () => {
  formRef.value?.clearValidate()
  formDialog.systemId = null
  formDialog.loading = false
  resetFormData()
}

const handleRelationClosed = () => {
  resetRelationDialog()
}

onMounted(async () => {
  try {
    await Promise.all([loadSupportOptions(), loadStatusOptions()])
  } catch (error) {
    ElMessage.error(error.message || t('ec.software.message.supportLoadFailed'))
  }
  loadData()
})
</script>

<style lang="scss" scoped>
.software-page {
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
}

.software-pagination {
  justify-content: flex-end;
  margin-top: 16px;
}

.software-form-grid,
.software-detail__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;
}

.software-form-grid {
  :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  :deep(.el-select) {
    width: 100%;
  }

  .is-full {
    grid-column: 1 / -1;
  }
}

.software-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 220px;
}

.software-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.software-section__title {
  color: var(--el-text-color-primary);
  font-size: 15px;
  font-weight: 600;
}

.software-detail__item {
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

.software-tag-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;
  min-height: 72px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-light);
}

@media only screen and (max-width: 991px) {
  .software-page {
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
  }

  .software-pagination {
    justify-content: center;
  }

  .software-form-grid,
  .software-detail__grid {
    grid-template-columns: 1fr;
  }
}
</style>
