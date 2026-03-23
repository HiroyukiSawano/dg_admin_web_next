<template>
  <el-card class="project-page">
    <el-form :model="queryForm" inline @submit.prevent>
      <el-form-item :label="t('ec.project.common.search')">
        <el-input
          v-model="queryForm.keyword"
          clearable
          :placeholder="t('ec.project.common.searchPlaceholder')"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item :label="t('ec.project.common.projectType')">
        <el-select v-model="queryForm.projectType" clearable :placeholder="t('ec.project.form.projectTypePlaceholder')">
          <el-option v-for="item in projectTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('ec.project.common.projectStatus')">
        <el-select v-model="queryForm.projectStatus" clearable :placeholder="t('ec.project.form.projectStatusPlaceholder')">
          <el-option v-for="item in projectStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">{{ t('ec.global.button.text.search') }}</el-button>
        <el-button @click="handleReset">{{ t('ec.global.button.text.reset') }}</el-button>
      </el-form-item>
      <el-form-item class="margin-left-auto">
        <el-button type="primary" @click="openCreate">{{ t('ec.project.common.create') }}</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="tableLoading" :data="tableData" row-key="id">
      <el-table-column prop="code" :label="t('ec.project.common.code')" min-width="160" show-overflow-tooltip />
      <el-table-column prop="name" :label="t('ec.project.common.name')" min-width="200" show-overflow-tooltip />
      <el-table-column :label="t('ec.project.common.projectType')" min-width="140">
        <template #default="{ row }">
          {{ getProjectTypeLabel(row.projectType) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.project.common.projectStatus')" width="140">
        <template #default="{ row }">
          <el-tag :type="getProjectStatusTagType(row.projectStatus)">
            {{ getProjectStatusLabel(row.projectStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.project.common.startDate')" width="130">
        <template #default="{ row }">
          {{ formatDate(row.startDate) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.project.common.endDate')" width="130">
        <template #default="{ row }">
          {{ formatDate(row.endDate) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.project.common.updatedAt')" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.project.common.actions')" fixed="right" width="250">
        <template #default="{ row }">
          <el-button type="primary" link @click="openDetail(row)">{{ t('ec.project.common.detail') }}</el-button>
          <el-button type="primary" link @click="openEdit(row)">{{ t('ec.project.common.edit') }}</el-button>
          <el-button type="primary" link @click="openRelationDialog(row)">{{ t('ec.project.common.relations') }}</el-button>
          <el-button type="danger" link @click="handleDelete(row)">{{ t('ec.project.common.delete') }}</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="t('ec.project.common.empty')" />
      </template>
    </el-table>

    <el-pagination
      v-model:current-page="pagination.currentPage"
      v-model:page-size="pagination.pageSize"
      class="project-pagination"
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
    :title="formDialog.mode === 'create' ? t('ec.project.form.createTitle') : t('ec.project.form.editTitle')"
    :width="720"
    destroy-on-close
    append-to-body
    @closed="handleFormClosed"
  >
    <div v-loading="formDialog.loading">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="100px">
        <div class="project-form-grid">
          <el-form-item :label="t('ec.project.common.code')" prop="code">
            <el-input v-model="formData.code" clearable :placeholder="t('ec.project.form.codePlaceholder')" />
          </el-form-item>
          <el-form-item :label="t('ec.project.common.name')" prop="name">
            <el-input v-model="formData.name" clearable :placeholder="t('ec.project.form.namePlaceholder')" />
          </el-form-item>
          <el-form-item :label="t('ec.project.common.projectType')" prop="projectType">
            <el-select v-model="formData.projectType" clearable :placeholder="t('ec.project.form.projectTypePlaceholder')">
              <el-option v-for="item in projectTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('ec.project.common.projectStatus')" prop="projectStatus">
            <el-select v-model="formData.projectStatus" clearable :placeholder="t('ec.project.form.projectStatusPlaceholder')">
              <el-option v-for="item in projectStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item :label="t('ec.project.common.startDate')" prop="startDate">
            <el-date-picker
              v-model="formData.startDate"
              type="date"
              value-format="YYYY-MM-DD"
              :placeholder="t('ec.project.form.startDatePlaceholder')"
              style="width: 100%;"
            />
          </el-form-item>
          <el-form-item :label="t('ec.project.common.endDate')" prop="endDate">
            <el-date-picker
              v-model="formData.endDate"
              type="date"
              value-format="YYYY-MM-DD"
              :placeholder="t('ec.project.form.endDatePlaceholder')"
              style="width: 100%;"
            />
          </el-form-item>
          <el-form-item class="is-full" :label="t('ec.project.common.remark')" prop="remark">
            <el-input
              v-model="formData.remark"
              type="textarea"
              :rows="3"
              :placeholder="t('ec.project.form.remarkPlaceholder')"
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
    :title="t('ec.project.detail.title')"
    size="720px"
    append-to-body
  >
    <div v-loading="detailLoading" class="project-detail" v-if="detailRecord">
      <div class="project-section">
        <div class="project-section__title">{{ t('ec.project.detail.basic') }}</div>
        <div class="project-detail__grid">
          <div class="project-detail__item">
            <span>{{ t('ec.project.common.code') }}</span>
            <strong>{{ detailRecord.project?.code || '-' }}</strong>
          </div>
          <div class="project-detail__item">
            <span>{{ t('ec.project.common.name') }}</span>
            <strong>{{ detailRecord.project?.name || '-' }}</strong>
          </div>
          <div class="project-detail__item">
            <span>{{ t('ec.project.common.projectType') }}</span>
            <strong>{{ getProjectTypeLabel(detailRecord.project?.projectType) }}</strong>
          </div>
          <div class="project-detail__item">
            <span>{{ t('ec.project.common.projectStatus') }}</span>
            <strong>{{ getProjectStatusLabel(detailRecord.project?.projectStatus) }}</strong>
          </div>
          <div class="project-detail__item">
            <span>{{ t('ec.project.common.startDate') }}</span>
            <strong>{{ formatDate(detailRecord.project?.startDate) }}</strong>
          </div>
          <div class="project-detail__item">
            <span>{{ t('ec.project.common.endDate') }}</span>
            <strong>{{ formatDate(detailRecord.project?.endDate) }}</strong>
          </div>
          <div class="project-detail__item is-full">
            <span>{{ t('ec.project.common.remark') }}</span>
            <strong>{{ detailRecord.project?.remark || '-' }}</strong>
          </div>
          <div class="project-detail__item">
            <span>{{ t('ec.project.common.createdAt') }}</span>
            <strong>{{ formatDateTime(detailRecord.project?.createdAt) }}</strong>
          </div>
          <div class="project-detail__item">
            <span>{{ t('ec.project.common.updatedAt') }}</span>
            <strong>{{ formatDateTime(detailRecord.project?.updatedAt) }}</strong>
          </div>
        </div>
      </div>

      <div class="project-section">
        <div class="project-section__title">{{ t('ec.project.detail.informationSystems') }}</div>
        <div class="project-tag-panel">
          <el-tag v-for="(item, index) in systemRelationLabels" :key="`system-${index}`">{{ item }}</el-tag>
          <el-empty v-if="systemRelationLabels.length === 0" :description="t('ec.project.common.noData')" :image-size="56" />
        </div>
      </div>

      <div class="project-section">
        <div class="project-section__title">{{ t('ec.project.detail.serviceProviders') }}</div>
        <div class="project-tag-panel">
          <el-tag v-for="(item, index) in vendorRelationLabels" :key="`vendor-${index}`">{{ item }}</el-tag>
          <el-empty v-if="vendorRelationLabels.length === 0" :description="t('ec.project.common.noData')" :image-size="56" />
        </div>
      </div>

      <div class="project-section">
        <div class="project-section__title">{{ t('ec.project.detail.persons') }}</div>
        <div class="project-tag-panel">
          <el-tag v-for="(item, index) in personRelationLabels" :key="`person-${index}`">{{ item }}</el-tag>
          <el-empty v-if="personRelationLabels.length === 0" :description="t('ec.project.common.noData')" :image-size="56" />
        </div>
      </div>

      <div class="project-section">
        <div class="project-section__title">{{ t('ec.project.detail.hardwareAssets') }}</div>
        <div class="project-tag-panel">
          <el-tag v-for="(item, index) in hardwareRelationLabels" :key="`hardware-${index}`">{{ item }}</el-tag>
          <el-empty v-if="hardwareRelationLabels.length === 0" :description="t('ec.project.common.noData')" :image-size="56" />
        </div>
      </div>
    </div>
  </el-drawer>

  <el-dialog
    v-model="relationDialog.visible"
    :title="t('ec.project.relation.title')"
    :width="760"
    destroy-on-close
    append-to-body
    @closed="handleRelationClosed"
  >
    <div v-loading="relationDialog.loading">
      <el-form :model="relationDialog.form" label-width="112px">
        <el-form-item :label="t('ec.project.detail.informationSystems')">
          <el-select
            v-model="relationDialog.form.informationSystemIds"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :placeholder="t('ec.project.relation.informationSystemsPlaceholder')"
            style="width: 100%;"
          >
            <el-option v-for="item in informationSystemOptions" :key="item.id" :label="item.displayLabel" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('ec.project.detail.serviceProviders')">
          <el-select
            v-model="relationDialog.form.serviceProviderIds"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :placeholder="t('ec.project.relation.serviceProvidersPlaceholder')"
            style="width: 100%;"
          >
            <el-option v-for="item in serviceProviderOptions" :key="item.id" :label="item.displayLabel" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('ec.project.detail.persons')">
          <el-select
            v-model="relationDialog.form.personIds"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :placeholder="t('ec.project.relation.personsPlaceholder')"
            style="width: 100%;"
          >
            <el-option v-for="item in personOptions" :key="item.id" :label="item.displayLabel" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('ec.project.detail.hardwareAssets')">
          <el-select
            v-model="relationDialog.form.hardwareAssetIds"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :placeholder="t('ec.project.relation.hardwareAssetsPlaceholder')"
            style="width: 100%;"
          >
            <el-option v-for="item in hardwareOptions" :key="item.id" :label="item.displayLabel" :value="item.id" />
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
import {
  createProject,
  deleteProject,
  getProjectDetail,
  getProjectHardwareOptions,
  getProjectInformationSystemOptions,
  getProjectList,
  getProjectPersonOptions,
  getProjectServiceProviderOptions,
  syncProjectRelations,
  updateProject,
} from '@/services/modules/projectService'
import { buildListLabelMap, formatDate, formatDateTime, normalizeIdList } from './helpers'

defineOptions({ name: 'ProjectAssets' })

const { t } = useI18n()

const tableLoading = ref(false)
const detailLoading = ref(false)
const submitLoading = ref(false)
const relationSubmitLoading = ref(false)
const detailVisible = ref(false)
const detailRecord = ref(null)
const formRef = ref(null)

const tableData = ref([])
const informationSystemOptions = ref([])
const serviceProviderOptions = ref([])
const personOptions = ref([])
const hardwareOptions = ref([])

const queryForm = reactive({
  keyword: '',
  projectType: '',
  projectStatus: '',
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
  projectId: null,
  loading: false,
})

const relationDialog = reactive({
  visible: false,
  projectId: null,
  loading: false,
  form: {
    informationSystemIds: [],
    serviceProviderIds: [],
    personIds: [],
    hardwareAssetIds: [],
  },
})

const formData = reactive({
  code: '',
  name: '',
  projectType: '',
  projectStatus: '',
  startDate: '',
  endDate: '',
  remark: '',
})

const projectTypeOptions = computed(() => [
  { value: 'NEW_BUILD', label: t('ec.project.type.newBuild') },
  { value: 'OPERATION', label: t('ec.project.type.operation') },
  { value: 'UPGRADE', label: t('ec.project.type.upgrade') },
])

const projectStatusOptions = computed(() => [
  { value: 'PLANNING', label: t('ec.project.status.planning') },
  { value: 'BUILDING', label: t('ec.project.status.building') },
  { value: 'DELAYED', label: t('ec.project.status.delayed') },
  { value: 'OPERATING', label: t('ec.project.status.operating') },
  { value: 'TERMINATED', label: t('ec.project.status.terminated') },
  { value: 'FINISHED', label: t('ec.project.status.finished') },
])

const systemNameMap = computed(() => buildListLabelMap(informationSystemOptions.value, 'displayLabel'))
const vendorNameMap = computed(() => buildListLabelMap(serviceProviderOptions.value, 'displayLabel'))
const personNameMap = computed(() => buildListLabelMap(personOptions.value, 'displayLabel'))
const hardwareNameMap = computed(() => buildListLabelMap(hardwareOptions.value, 'displayLabel'))

const systemRelationLabels = computed(() => mapIdsToLabels(detailRecord.value?.informationSystemIds, systemNameMap.value))
const vendorRelationLabels = computed(() => mapIdsToLabels(detailRecord.value?.serviceProviderIds, vendorNameMap.value))
const personRelationLabels = computed(() => mapIdsToLabels(detailRecord.value?.personIds, personNameMap.value))
const hardwareRelationLabels = computed(() => mapIdsToLabels(detailRecord.value?.hardwareAssetIds, hardwareNameMap.value))

const formRules = computed(() => ({
  code: [{ required: true, message: t('ec.project.validation.codeRequired'), trigger: 'blur' }],
  name: [{ required: true, message: t('ec.project.validation.nameRequired'), trigger: 'blur' }],
  projectType: [{ required: true, message: t('ec.project.validation.projectTypeRequired'), trigger: 'change' }],
  projectStatus: [{ required: true, message: t('ec.project.validation.projectStatusRequired'), trigger: 'change' }],
}))

const buildDisplayLabel = (primary, secondary) => {
  return [primary, secondary].filter(Boolean).join(' / ') || '-'
}

const mapIdsToLabels = (ids, labelMap) => {
  return normalizeIdList(ids).map((item) => labelMap[item] || String(item))
}

const getProjectTypeLabel = (value) => {
  const matched = projectTypeOptions.value.find((item) => item.value === value)
  return matched?.label || value || '-'
}

const getProjectStatusLabel = (value) => {
  const matched = projectStatusOptions.value.find((item) => item.value === value)
  return matched?.label || value || '-'
}

const getProjectStatusTagType = (value) => {
  if (value === 'OPERATING') return 'success'
  if (value === 'DELAYED' || value === 'BUILDING') return 'warning'
  if (value === 'TERMINATED') return 'danger'
  return 'info'
}

const resetFormData = () => {
  formData.code = ''
  formData.name = ''
  formData.projectType = ''
  formData.projectStatus = ''
  formData.startDate = ''
  formData.endDate = ''
  formData.remark = ''
}

const resetRelationDialog = () => {
  relationDialog.projectId = null
  relationDialog.loading = false
  relationDialog.form.informationSystemIds = []
  relationDialog.form.serviceProviderIds = []
  relationDialog.form.personIds = []
  relationDialog.form.hardwareAssetIds = []
}

const fillFormData = (detail) => {
  const project = detail?.project || {}
  resetFormData()
  formData.code = project.code || ''
  formData.name = project.name || ''
  formData.projectType = project.projectType || ''
  formData.projectStatus = project.projectStatus || ''
  formData.startDate = project.startDate || ''
  formData.endDate = project.endDate || ''
  formData.remark = project.remark || ''
}

const buildSubmitPayload = () => ({
  code: formData.code,
  name: formData.name,
  projectType: formData.projectType,
  projectStatus: formData.projectStatus,
  startDate: formData.startDate || null,
  endDate: formData.endDate || null,
  remark: formData.remark,
})

const loadSupportOptions = async () => {
  const [informationSystems, serviceProviders, persons, hardwareAssets] = await Promise.all([
    getProjectInformationSystemOptions(),
    getProjectServiceProviderOptions(),
    getProjectPersonOptions(),
    getProjectHardwareOptions(),
  ])

  informationSystemOptions.value = informationSystems.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.code, item.name),
  }))
  serviceProviderOptions.value = serviceProviders.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.code, item.name),
  }))
  personOptions.value = persons.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.name, item.employeeNo),
  }))
  hardwareOptions.value = hardwareAssets.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.assetCode, item.assetName),
  }))
}

const loadData = async () => {
  tableLoading.value = true
  try {
    const pageData = await getProjectList({
      pageNo: pagination.currentPage,
      pageSize: pagination.pageSize,
      keyword: queryForm.keyword || undefined,
      projectType: queryForm.projectType || undefined,
      projectStatus: queryForm.projectStatus || undefined,
    })
    tableData.value = pageData.records
    pagination.total = pageData.total
  } catch (error) {
    ElMessage.error(error.message || t('ec.project.message.loadFailed'))
  } finally {
    tableLoading.value = false
  }
}

const fetchDetail = async (id) => getProjectDetail(id)

const handleSearch = () => {
  pagination.currentPage = 1
  loadData()
}

const handleReset = () => {
  queryForm.keyword = ''
  queryForm.projectType = ''
  queryForm.projectStatus = ''
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
    ElMessage.error(error.message || t('ec.project.message.supportLoadFailed'))
    return
  }
  formDialog.mode = 'create'
  formDialog.projectId = null
  formDialog.loading = false
  resetFormData()
  formDialog.visible = true
}

const openEdit = async (row) => {
  formDialog.mode = 'edit'
  formDialog.projectId = row.id
  formDialog.visible = true
  formDialog.loading = true
  try {
    await loadSupportOptions()
    const detail = await fetchDetail(row.id)
    fillFormData(detail)
  } catch (error) {
    ElMessage.error(error.message || t('ec.project.message.detailFailed'))
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
    ElMessage.error(error.message || t('ec.project.message.detailFailed'))
  } finally {
    detailLoading.value = false
  }
}

const openRelationDialog = async (row) => {
  relationDialog.visible = true
  relationDialog.projectId = row.id
  relationDialog.loading = true
  try {
    await loadSupportOptions()
    const detail = await fetchDetail(row.id)
    relationDialog.form.informationSystemIds = normalizeIdList(detail.informationSystemIds)
    relationDialog.form.serviceProviderIds = normalizeIdList(detail.serviceProviderIds)
    relationDialog.form.personIds = normalizeIdList(detail.personIds)
    relationDialog.form.hardwareAssetIds = normalizeIdList(detail.hardwareAssetIds)
  } catch (error) {
    ElMessage.error(error.message || t('ec.project.message.detailFailed'))
    relationDialog.visible = false
  } finally {
    relationDialog.loading = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('ec.project.common.deleteConfirm', { name: row.name || row.code }),
      t('ec.project.common.delete'),
      {
        type: 'warning',
        confirmButtonText: t('ec.project.common.delete'),
        cancelButtonText: t('ec.global.button.text.cancel'),
        confirmButtonClass: 'el-button--danger',
      },
    )

    await deleteProject(row.id)
    ElMessage.success(t('ec.project.common.deleteSuccess'))
    await loadData()
  } catch (error) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error.message || t('ec.project.common.deleteFailed'))
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
      await createProject(payload)
    } else {
      await updateProject(formDialog.projectId, payload)
    }
    ElMessage.success(t('ec.project.common.saveSuccess'))
    formDialog.visible = false
    await loadData()
  } catch (error) {
    ElMessage.error(error.message || t('ec.project.common.saveFailed'))
  } finally {
    submitLoading.value = false
  }
}

const handleRelationSubmit = async () => {
  relationSubmitLoading.value = true
  try {
    await syncProjectRelations(relationDialog.projectId, {
      informationSystemIds: relationDialog.form.informationSystemIds,
      serviceProviderIds: relationDialog.form.serviceProviderIds,
      personIds: relationDialog.form.personIds,
      hardwareAssetIds: relationDialog.form.hardwareAssetIds,
    })
    ElMessage.success(t('ec.project.relation.saveSuccess'))
    relationDialog.visible = false
    if (detailVisible.value && detailRecord.value?.project?.id === relationDialog.projectId) {
      detailRecord.value = await fetchDetail(relationDialog.projectId)
    }
  } catch (error) {
    ElMessage.error(error.message || t('ec.project.relation.saveFailed'))
  } finally {
    relationSubmitLoading.value = false
  }
}

const handleFormClosed = () => {
  formRef.value?.clearValidate()
  formDialog.projectId = null
  formDialog.loading = false
  resetFormData()
}

const handleRelationClosed = () => {
  resetRelationDialog()
}

onMounted(async () => {
  try {
    await loadSupportOptions()
  } catch (error) {
    ElMessage.error(error.message || t('ec.project.message.supportLoadFailed'))
  }
  loadData()
})
</script>

<style lang="scss" scoped>
.project-page {
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

.project-pagination {
  justify-content: flex-end;
  margin-top: 16px;
}

.project-form-grid,
.project-detail__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;
}

.project-form-grid {
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

.project-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 220px;
}

.project-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-section__title {
  color: var(--el-text-color-primary);
  font-size: 15px;
  font-weight: 600;
}

.project-detail__item {
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

.project-tag-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;
  min-height: 72px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-light);
}

@media only screen and (max-width: 991px) {
  .project-page {
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

  .project-pagination {
    justify-content: center;
  }

  .project-form-grid,
  .project-detail__grid {
    grid-template-columns: 1fr;
  }
}
</style>
