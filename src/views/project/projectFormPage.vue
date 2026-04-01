<template>
  <figma-resource-page
    hide-tabs
    active-tab="projects"
    :title="pageTitle"
    :description="pageDescription"
    back-path="/project/projects"
  >
    <template #actions>
      <el-button @click="router.push('/project/projects')">
        {{ t('ec.global.button.text.cancel') }}
      </el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        {{ t('ec.global.button.text.submit') }}
      </el-button>
    </template>

    <div v-loading="pageLoading" class="project-page-card">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top">
        <section class="project-form-section">
          <div class="project-section-title">{{ t('ec.project.section.basic') }}</div>
          <div class="project-form-grid">
            <el-form-item :label="t('ec.project.common.code')" prop="code">
              <el-input v-model="formData.code" clearable :placeholder="t('ec.project.form.codePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.project.common.name')" prop="name">
              <el-input v-model="formData.name" clearable :placeholder="t('ec.project.form.namePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.project.common.projectType')" prop="projectType">
              <el-select v-model="formData.projectType" :placeholder="t('ec.project.form.projectTypePlaceholder')">
                <el-option v-for="item in projectTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('ec.project.common.approvalBatchNo')" prop="approvalBatchNo">
              <el-input v-model="formData.approvalBatchNo" clearable :placeholder="t('ec.project.form.approvalBatchNoPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.project.common.projectBudget')" prop="projectBudget">
              <el-input-number v-model="formData.projectBudget" :min="0" :precision="2" :controls="false" style="width: 100%;" />
            </el-form-item>
            <el-form-item :label="t('ec.project.common.contractAmount')" prop="contractAmount">
              <el-input-number v-model="formData.contractAmount" :min="0" :precision="2" :controls="false" style="width: 100%;" />
            </el-form-item>
          </div>
        </section>

        <section class="project-form-section">
          <div class="project-section-title">{{ t('ec.project.section.owner') }}</div>
          <div class="project-form-grid">
            <el-form-item :label="t('ec.project.common.ownerName')" prop="ownerName">
              <el-input v-model="formData.ownerName" clearable :placeholder="t('ec.project.form.ownerNamePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.project.common.ownerPhone')" prop="ownerPhone">
              <el-input v-model="formData.ownerPhone" clearable :placeholder="t('ec.project.form.ownerPhonePlaceholder')" />
            </el-form-item>
          </div>
        </section>

        <section class="project-form-section">
          <div class="project-section-title">{{ t('ec.project.section.period') }}</div>
          <div class="project-form-grid">
            <el-form-item :label="t('ec.project.common.approvalDate')" prop="approvalDate">
              <el-date-picker v-model="formData.approvalDate" type="date" value-format="YYYY-MM-DD" style="width: 100%;" />
            </el-form-item>
            <el-form-item :label="t('ec.project.common.startDate')" prop="startDate">
              <el-date-picker v-model="formData.startDate" type="date" value-format="YYYY-MM-DD" style="width: 100%;" />
            </el-form-item>
            <el-form-item :label="t('ec.project.common.initialDeliveryDate')" prop="initialDeliveryDate">
              <el-date-picker v-model="formData.initialDeliveryDate" type="date" value-format="YYYY-MM-DD" style="width: 100%;" />
            </el-form-item>
            <el-form-item :label="t('ec.project.common.warrantyEndDate')" prop="warrantyEndDate">
              <el-date-picker v-model="formData.warrantyEndDate" type="date" value-format="YYYY-MM-DD" style="width: 100%;" />
            </el-form-item>
            <el-form-item :label="t('ec.project.common.stage')" class="is-span-2" prop="stage">
              <el-input v-model="formData.stage" clearable :placeholder="t('ec.project.form.stagePlaceholder')" />
            </el-form-item>
          </div>
        </section>

        <section class="project-form-section">
          <div class="project-section-title">{{ t('ec.project.section.payment') }}</div>
          <div class="project-form-grid">
            <el-form-item :label="t('ec.project.common.paymentCycleName')" prop="paymentCycleName">
              <el-input v-model="formData.paymentCycleName" clearable :placeholder="t('ec.project.form.paymentCycleNamePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.project.common.paymentRatio')" prop="paymentRatio">
              <el-input-number v-model="formData.paymentRatio" :min="0" :max="100" :precision="2" :controls="false" style="width: 100%;" />
            </el-form-item>
            <el-form-item :label="t('ec.project.common.paymentAmount')" prop="paymentAmount">
              <el-input-number v-model="formData.paymentAmount" :min="0" :precision="2" :controls="false" style="width: 100%;" />
            </el-form-item>
            <el-form-item :label="t('ec.project.common.paymentStatus')" prop="paymentStatus">
              <el-select v-model="formData.paymentStatus" :placeholder="t('ec.project.form.paymentStatusPlaceholder')">
                <el-option v-for="item in paymentStatusOptions" :key="item.value" :label="item.displayLabel" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('ec.project.common.plannedPaymentDate')" prop="plannedPaymentDate">
              <el-date-picker v-model="formData.plannedPaymentDate" type="date" value-format="YYYY-MM-DD" style="width: 100%;" />
            </el-form-item>
            <el-form-item :label="t('ec.project.common.actualPaymentDate')" prop="actualPaymentDate">
              <el-date-picker v-model="formData.actualPaymentDate" type="date" value-format="YYYY-MM-DD" style="width: 100%;" />
            </el-form-item>
          </div>

          <div class="project-document-panel">
            <div class="project-document-panel__head">
              <div class="project-document-panel__title">{{ t('ec.project.section.documents') }}</div>
              <el-upload
                action="#"
                :show-file-list="false"
                :auto-upload="true"
                :before-upload="beforeDocumentUpload"
                :http-request="handleDocumentUpload"
              >
                <el-button type="primary" plain :loading="documentUploading">
                  {{ t('ec.project.document.upload') }}
                </el-button>
              </el-upload>
            </div>

            <el-table :data="formData.documents" class="project-document-table">
              <el-table-column prop="originalName" :label="t('ec.project.document.name')" min-width="220" show-overflow-tooltip />
              <el-table-column :label="t('ec.project.document.size')" width="120">
                <template #default="{ row }">
                  {{ formatFileSize(row.fileSize) }}
                </template>
              </el-table-column>
              <el-table-column :label="t('ec.project.document.uploadedAt')" width="180">
                <template #default="{ row }">
                  {{ formatDateTime(row.uploadedAt) }}
                </template>
              </el-table-column>
              <el-table-column :label="t('ec.project.common.actions')" width="140" fixed="right">
                <template #default="{ row, $index }">
                  <el-button type="primary" link @click="openDocument(row)">
                    {{ t('ec.project.document.view') }}
                  </el-button>
                  <el-button type="danger" link @click="removeDocument($index)">
                    {{ t('ec.global.button.text.delete') }}
                  </el-button>
                </template>
              </el-table-column>
              <template #empty>
                <el-empty :image-size="56" :description="t('ec.project.document.empty')" />
              </template>
            </el-table>
          </div>
        </section>

        <section class="project-form-section">
          <div class="project-section-title">{{ t('ec.project.section.relations') }}</div>
          <div class="project-form-grid">
            <el-form-item :label="t('ec.project.detail.persons')" class="is-span-2">
              <ec-object-multi-transfer
                v-model="formData.personIds"
                :placeholder="t('ec.project.relation.personsPlaceholder')"
                :title="`${t('ec.project.detail.persons')}${t('ec.organization.selector.titleSuffix')}`"
                :selected-title="t('ec.organization.selector.selected')"
                :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
                :options="personOptions"
                label-key="name"
                value-key="id"
                subtitle-key="employeeNo"
              />
            </el-form-item>
            <el-form-item :label="t('ec.project.detail.informationSystems')">
              <ec-object-multi-transfer
                v-model="formData.informationSystemIds"
                :placeholder="t('ec.project.relation.informationSystemsPlaceholder')"
                :title="`${t('ec.project.detail.informationSystems')}${t('ec.organization.selector.titleSuffix')}`"
                :selected-title="t('ec.organization.selector.selected')"
                :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
                :options="informationSystemOptions"
                label-key="name"
                value-key="id"
                subtitle-key="code"
              />
            </el-form-item>
            <el-form-item :label="t('ec.project.detail.hardwareAssets')">
              <ec-object-multi-transfer
                v-model="formData.hardwareAssetIds"
                :placeholder="t('ec.project.relation.hardwareAssetsPlaceholder')"
                :title="`${t('ec.project.detail.hardwareAssets')}${t('ec.organization.selector.titleSuffix')}`"
                :selected-title="t('ec.organization.selector.selected')"
                :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
                :options="hardwareOptions"
                label-key="assetName"
                value-key="id"
                subtitle-key="assetCode"
              />
            </el-form-item>
          </div>
        </section>
      </el-form>
    </div>
  </figma-resource-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getStatusDictionaries } from '@/services/modules/dictionaryService'
import {
  createProject,
  getProjectDetail,
  getProjectHardwareOptions,
  getProjectInformationSystemOptions,
  getProjectPersonOptions,
  updateProject,
  uploadProjectDocument,
} from '@/services/modules/projectService'
import { formatDateTime, formatFileSize, normalizeIdList } from './helpers'
import EcObjectMultiTransfer from '@/components/EcObjectMultiTransfer.vue'
import FigmaResourcePage from '@/views/organization/components/FigmaResourcePage.vue'

defineOptions({ name: 'ProjectFormPage' })

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const formRef = ref(null)
const pageLoading = ref(false)
const submitLoading = ref(false)
const documentUploading = ref(false)
const statusDictionaries = ref({})
const personOptions = ref([])
const informationSystemOptions = ref([])
const hardwareOptions = ref([])

const formData = reactive({
  code: '',
  name: '',
  projectType: '',
  projectStatus: 'PLANNING',
  approvalBatchNo: '',
  projectBudget: null,
  contractAmount: null,
  ownerName: '',
  ownerPhone: '',
  approvalDate: '',
  startDate: '',
  initialDeliveryDate: '',
  warrantyEndDate: '',
  stage: '',
  paymentCycleName: '',
  paymentRatio: null,
  paymentAmount: null,
  plannedPaymentDate: '',
  actualPaymentDate: '',
  paymentStatus: 'PENDING',
  documents: [],
  personIds: [],
  informationSystemIds: [],
  hardwareAssetIds: [],
  remark: '',
})

const isEdit = computed(() => Boolean(route.params.id))

const pageTitle = computed(() => (isEdit.value ? t('ec.project.page.editTitle') : t('ec.project.page.createTitle')))
const pageDescription = computed(() => (isEdit.value ? t('ec.project.page.editDescription') : t('ec.project.page.createDescription')))

const projectTypeOptions = computed(() => ([
  { value: 'NEW_BUILD', label: t('ec.project.type.newBuild') },
  { value: 'SOFTWARE_UPGRADE', label: t('ec.project.type.softwareUpgrade') },
  { value: 'OPS_PROJECT', label: t('ec.project.type.opsProject') },
  { value: 'SERVICE_PURCHASE', label: t('ec.project.type.servicePurchase') },
  { value: 'HARDWARE_PURCHASE', label: t('ec.project.type.hardwarePurchase') },
  { value: 'INTEGRATION_PROJECT', label: t('ec.project.type.integrationProject') },
]))

const paymentStatusOptions = computed(() => {
  const map = statusDictionaries.value.paymentStatus || []
  return map.map((item) => ({
    ...item,
    displayLabel: locale.value === 'en' ? (item.labelEn || item.label) : item.label,
  }))
})

const formRules = computed(() => ({
  code: [{ required: true, message: t('ec.project.validation.codeRequired'), trigger: 'blur' }],
  name: [{ required: true, message: t('ec.project.validation.nameRequired'), trigger: 'blur' }],
  projectType: [{ required: true, message: t('ec.project.validation.projectTypeRequired'), trigger: 'change' }],
  approvalBatchNo: [{ required: true, message: t('ec.project.validation.approvalBatchNoRequired'), trigger: 'blur' }],
  projectBudget: [{ required: true, message: t('ec.project.validation.projectBudgetRequired'), trigger: 'change' }],
  contractAmount: [{ required: true, message: t('ec.project.validation.contractAmountRequired'), trigger: 'change' }],
  ownerName: [{ required: true, message: t('ec.project.validation.ownerNameRequired'), trigger: 'blur' }],
  ownerPhone: [{ required: true, message: t('ec.project.validation.ownerPhoneRequired'), trigger: 'blur' }],
  approvalDate: [{ required: true, message: t('ec.project.validation.approvalDateRequired'), trigger: 'change' }],
  startDate: [{ required: true, message: t('ec.project.validation.startDateRequired'), trigger: 'change' }],
  initialDeliveryDate: [{ required: true, message: t('ec.project.validation.initialDeliveryDateRequired'), trigger: 'change' }],
  warrantyEndDate: [{ required: true, message: t('ec.project.validation.warrantyEndDateRequired'), trigger: 'change' }],
  stage: [{ required: true, message: t('ec.project.validation.stageRequired'), trigger: 'blur' }],
  paymentCycleName: [{ required: true, message: t('ec.project.validation.paymentCycleNameRequired'), trigger: 'blur' }],
  paymentRatio: [{ required: true, message: t('ec.project.validation.paymentRatioRequired'), trigger: 'change' }],
  paymentAmount: [{ required: true, message: t('ec.project.validation.paymentAmountRequired'), trigger: 'change' }],
  plannedPaymentDate: [{ required: true, message: t('ec.project.validation.plannedPaymentDateRequired'), trigger: 'change' }],
  actualPaymentDate: [{ required: true, message: t('ec.project.validation.actualPaymentDateRequired'), trigger: 'change' }],
  paymentStatus: [{ required: true, message: t('ec.project.validation.paymentStatusRequired'), trigger: 'change' }],
}))

const normalizeDocuments = (documents = []) => {
  return (Array.isArray(documents) ? documents : []).map((item) => ({
    id: item.id,
    fileName: item.fileName || '',
    originalName: item.originalName || '',
    fileSize: item.fileSize || 0,
    contentType: item.contentType || '',
    fileUrl: item.fileUrl || '',
    uploadedAt: item.uploadedAt || new Date().toISOString(),
  }))
}

const loadSupportData = async () => {
  const [statusOptions, persons, informationSystems, hardwareAssets] = await Promise.all([
    getStatusDictionaries(),
    getProjectPersonOptions(),
    getProjectInformationSystemOptions(),
    getProjectHardwareOptions(),
  ])

  statusDictionaries.value = statusOptions
  personOptions.value = Array.isArray(persons) ? persons : []
  informationSystemOptions.value = Array.isArray(informationSystems) ? informationSystems : []
  hardwareOptions.value = Array.isArray(hardwareAssets) ? hardwareAssets : []
}

const fillForm = (detail) => {
  const project = detail?.project || {}
  formData.code = project.code || ''
  formData.name = project.name || ''
  formData.projectType = project.projectType || ''
  formData.projectStatus = project.projectStatus || 'PLANNING'
  formData.approvalBatchNo = project.approvalBatchNo || ''
  formData.projectBudget = project.projectBudget
  formData.contractAmount = project.contractAmount
  formData.ownerName = project.ownerName || ''
  formData.ownerPhone = project.ownerPhone || ''
  formData.approvalDate = project.approvalDate || ''
  formData.startDate = project.startDate || ''
  formData.initialDeliveryDate = project.initialDeliveryDate || ''
  formData.warrantyEndDate = project.warrantyEndDate || project.endDate || ''
  formData.stage = project.stage || ''
  formData.paymentCycleName = project.paymentCycleName || ''
  formData.paymentRatio = project.paymentRatio
  formData.paymentAmount = project.paymentAmount
  formData.plannedPaymentDate = project.plannedPaymentDate || ''
  formData.actualPaymentDate = project.actualPaymentDate || ''
  formData.paymentStatus = project.paymentStatus || 'PENDING'
  formData.documents = normalizeDocuments(detail?.documents)
  formData.personIds = normalizeIdList(detail?.personIds)
  formData.informationSystemIds = normalizeIdList(detail?.informationSystemIds)
  formData.hardwareAssetIds = normalizeIdList(detail?.hardwareAssetIds)
  formData.remark = project.remark || ''
}

const beforeDocumentUpload = (file) => {
  const extension = String(file.name || '').split('.').pop()?.toLowerCase()
  const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx']
  if (!allowedExtensions.includes(extension)) {
    ElMessage.error(t('ec.project.document.invalidType'))
    return false
  }
  if (file.size / 1024 / 1024 > 100) {
    ElMessage.error(t('ec.project.document.sizeExceeded'))
    return false
  }
  return true
}

const handleDocumentUpload = async (options) => {
  documentUploading.value = true
  try {
    const result = await uploadProjectDocument(options.file)
    formData.documents.unshift({
      fileName: result.fileName || '',
      originalName: result.originalName || options.file.name,
      fileSize: result.size || options.file.size,
      contentType: result.contentType || options.file.type,
      fileUrl: result.url || '',
      uploadedAt: new Date().toISOString(),
    })
    options.onSuccess?.(result)
    ElMessage.success(t('ec.project.document.uploadSuccess'))
  } catch (error) {
    options.onError?.(error)
    ElMessage.error(error.message || t('ec.project.document.uploadFailed'))
  } finally {
    documentUploading.value = false
  }
}

const openDocument = (item) => {
  if (!item?.fileUrl) return
  window.open(item.fileUrl, '_blank', 'noopener')
}

const removeDocument = (index) => {
  formData.documents.splice(index, 1)
}

const buildPayload = () => {
  return {
    code: formData.code,
    name: formData.name,
    projectType: formData.projectType,
    projectStatus: formData.projectStatus || 'PLANNING',
    approvalBatchNo: formData.approvalBatchNo,
    projectBudget: formData.projectBudget,
    contractAmount: formData.contractAmount,
    ownerName: formData.ownerName,
    ownerPhone: formData.ownerPhone,
    approvalDate: formData.approvalDate,
    startDate: formData.startDate,
    initialDeliveryDate: formData.initialDeliveryDate,
    endDate: formData.warrantyEndDate,
    warrantyEndDate: formData.warrantyEndDate,
    stage: formData.stage,
    paymentCycleName: formData.paymentCycleName,
    paymentRatio: formData.paymentRatio,
    paymentAmount: formData.paymentAmount,
    plannedPaymentDate: formData.plannedPaymentDate,
    actualPaymentDate: formData.actualPaymentDate,
    paymentStatus: formData.paymentStatus,
    remark: formData.remark,
    documents: formData.documents.map((item) => ({
      fileName: item.fileName,
      originalName: item.originalName,
      fileSize: item.fileSize,
      contentType: item.contentType,
      fileUrl: item.fileUrl,
    })),
    personIds: formData.personIds,
    informationSystemIds: formData.informationSystemIds,
    hardwareAssetIds: formData.hardwareAssetIds,
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const payload = buildPayload()
    const result = isEdit.value
      ? await updateProject(route.params.id, payload)
      : await createProject(payload)
    ElMessage.success(t('ec.project.common.saveSuccess'))
    router.replace(`/project/projects/${result.id || route.params.id}/detail`)
  } catch (error) {
    ElMessage.error(error.message || t('ec.project.common.saveFailed'))
  } finally {
    submitLoading.value = false
  }
}

const loadDetail = async () => {
  if (!isEdit.value) return
  const detail = await getProjectDetail(route.params.id)
  fillForm(detail)
}

onMounted(async () => {
  pageLoading.value = true
  try {
    await loadSupportData()
    await loadDetail()
  } catch (error) {
    ElMessage.error(error.message || t('ec.project.message.supportLoadFailed'))
  } finally {
    pageLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.project-page-card {
  padding: 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #edf0f6;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(28, 53, 91, 0.05);
}

.project-form-section + .project-form-section {
  margin-top: 28px;
}

.project-section-title,
.project-document-panel__title {
  color: #151b26;
  font-size: 16px;
  font-weight: 700;
}

.project-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 20px;
  margin-top: 20px;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-form-item__content),
  :deep(.el-select) {
    width: 100%;
  }
}

.is-span-2 {
  grid-column: 1 / -1;
}

.project-document-panel {
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fc;
  border: 1px solid #edf0f6;
  border-radius: 16px;
}

.project-document-panel__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 16px;
}

.project-document-table {
  :deep(th.el-table__cell) {
    background: #f1f4fb;
  }
}

@media only screen and (max-width: 991px) {
  .project-page-card {
    padding: 16px;
  }

  .project-form-grid {
    grid-template-columns: 1fr;
  }

  .is-span-2 {
    grid-column: auto;
  }

  .project-document-panel__head {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
