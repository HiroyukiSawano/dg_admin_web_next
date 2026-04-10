<template>
  <figma-resource-page
    active-tab="projects"
    :breadcrumbs="pageBreadcrumbs"
    back-text="返回"
    back-path="/project/projects"
  >
    <div v-loading="pageLoading" class="project-page-card">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
        class="project-form"
      >
        <section class="project-form-section">
          <div class="project-section-title">{{ t('ec.project.section.basic') }}</div>

          <div class="project-form-grid">
            <el-form-item prop="code">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.common.code') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.code" clearable :placeholder="t('ec.project.form.contentPlaceholder')" />
            </el-form-item>

            <el-form-item prop="name">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.common.name') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.name" clearable :placeholder="t('ec.project.form.contentPlaceholder')" />
            </el-form-item>

            <el-form-item prop="projectType">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.common.projectType') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-select v-model="formData.projectType" clearable :placeholder="t('ec.project.form.selectPlaceholder')">
                <el-option v-for="item in projectTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item prop="approvalBatchNo">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.common.approvalBatchNo') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.approvalBatchNo" clearable :placeholder="t('ec.project.form.contentPlaceholder')" />
            </el-form-item>

            <el-form-item prop="projectBudget">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.form.projectBudgetLabel') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-input-number
                v-model="formData.projectBudget"
                :min="0"
                :precision="2"
                :controls="false"
                :placeholder="t('ec.project.form.contentPlaceholder')"
              />
            </el-form-item>

            <el-form-item prop="contractAmount">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.form.contractAmountLabel') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-input-number
                v-model="formData.contractAmount"
                :min="0"
                :precision="2"
                :controls="false"
                :placeholder="t('ec.project.form.contentPlaceholder')"
              />
            </el-form-item>
          </div>
        </section>

        <section class="project-form-section">
          <div class="project-section-title">{{ t('ec.project.section.owner') }}</div>

          <div class="project-form-grid">
            <el-form-item prop="ownerName">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.form.ownerNameLabel') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.ownerName" clearable :placeholder="t('ec.project.form.contentPlaceholder')" />
            </el-form-item>

            <el-form-item prop="ownerPhone">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.form.ownerPhoneLabel') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.ownerPhone" clearable :placeholder="t('ec.project.form.contentPlaceholder')" />
            </el-form-item>
          </div>
        </section>

        <section class="project-form-section">
          <div class="project-section-title">{{ t('ec.project.section.period') }}</div>

          <div class="project-form-grid">
            <el-form-item prop="approvalDate">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.common.approvalDate') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-date-picker v-model="formData.approvalDate" type="date" value-format="YYYY-MM-DD" :placeholder="t('ec.project.form.selectPlaceholder')" />
            </el-form-item>

            <el-form-item prop="startDate">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.common.startDate') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-date-picker v-model="formData.startDate" type="date" value-format="YYYY-MM-DD" :placeholder="t('ec.project.form.selectPlaceholder')" />
            </el-form-item>

            <el-form-item prop="initialDeliveryDate">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.common.initialDeliveryDate') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-date-picker v-model="formData.initialDeliveryDate" type="date" value-format="YYYY-MM-DD" :placeholder="t('ec.project.form.selectPlaceholder')" />
            </el-form-item>

            <el-form-item prop="endDate">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.common.endDate') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-date-picker v-model="formData.endDate" type="date" value-format="YYYY-MM-DD" :placeholder="t('ec.project.form.selectPlaceholder')" />
            </el-form-item>

            <el-form-item prop="warrantyEndDate">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.common.warrantyEndDate') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-date-picker v-model="formData.warrantyEndDate" type="date" value-format="YYYY-MM-DD" :placeholder="t('ec.project.form.selectPlaceholder')" />
            </el-form-item>

            <el-form-item prop="stage">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.common.stage') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.stage" clearable :placeholder="t('ec.project.form.contentPlaceholder')" />
            </el-form-item>
          </div>
        </section>

        <section class="project-form-section">
          <div class="project-section-title">{{ t('ec.project.section.payment') }}</div>

          <div class="project-form-grid">
            <el-form-item prop="paymentCycleName">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.form.paymentCycleNameLabel') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.paymentCycleName" clearable :placeholder="t('ec.project.form.contentPlaceholder')" />
            </el-form-item>

            <el-form-item prop="paymentRatio">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.form.paymentRatioLabel') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-input-number
                v-model="formData.paymentRatio"
                :min="0"
                :max="100"
                :precision="2"
                :controls="false"
                :placeholder="t('ec.project.form.contentPlaceholder')"
              />
            </el-form-item>

            <el-form-item prop="paymentAmount">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.form.paymentAmountLabel') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-input-number
                v-model="formData.paymentAmount"
                :min="0"
                :precision="2"
                :controls="false"
                :placeholder="t('ec.project.form.contentPlaceholder')"
              />
            </el-form-item>

            <el-form-item prop="plannedPaymentDate">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.common.plannedPaymentDate') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-date-picker v-model="formData.plannedPaymentDate" type="date" value-format="YYYY-MM-DD" :placeholder="t('ec.project.form.selectPlaceholder')" />
            </el-form-item>

            <el-form-item prop="actualPaymentDate">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.common.actualPaymentDate') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-date-picker v-model="formData.actualPaymentDate" type="date" value-format="YYYY-MM-DD" :placeholder="t('ec.project.form.selectPlaceholder')" />
            </el-form-item>

            <el-form-item prop="paymentStatus">
              <template #label>
                <span class="project-form-label">
                  {{ t('ec.project.form.paymentStatusLabel') }}
                  <span class="project-form-label__required">*</span>
                </span>
              </template>
              <el-select v-model="formData.paymentStatus" clearable :placeholder="t('ec.project.form.selectPlaceholder')">
                <el-option v-for="item in paymentStatusOptions" :key="item.value" :label="item.displayLabel" :value="item.value" />
              </el-select>
            </el-form-item>
          </div>
        </section>

        <section class="project-form-section">
          <div class="project-document-block">
            <div class="project-document-toolbar">
              <el-upload
                ref="uploadButtonRef"
                action="#"
                :auto-upload="false"
                :show-file-list="false"
                :multiple="true"
                :on-change="handleDocumentQueued"
              >
                <el-button class="project-document-toolbar__button" :disabled="documentUploading">
                  {{ t('ec.project.document.select') }}
                </el-button>
              </el-upload>
              <span v-if="showUploadResultSummary" class="project-document-toolbar__summary">
                <span>{{ t('ec.project.document.resultSummary.totalPrefix') }}</span>
                <span class="project-document-toolbar__summary-count is-total">{{ lastUploadSummary.total }}</span>
                <span>{{ t('ec.project.document.resultSummary.totalSuffix') }}</span>
                <span>{{ t('ec.project.document.resultSummary.successPrefix') }}</span>
                <span class="project-document-toolbar__summary-count is-success">{{ lastUploadSummary.success }}</span>
                <span>{{ t('ec.project.document.resultSummary.successSuffix') }}</span>
                <span>{{ t('ec.project.document.resultSummary.failedPrefix') }}</span>
                <span class="project-document-toolbar__summary-count is-failed">{{ lastUploadSummary.failed }}</span>
                <span>{{ t('ec.project.document.resultSummary.failedSuffix') }}</span>
              </span>
              <span v-else class="project-document-toolbar__hint">{{ t('ec.project.document.queueHint') }}</span>
            </div>

            <el-table :data="documentRows" class="project-document-table" :row-key="getDocumentRowKey">
              <el-table-column prop="originalName" :label="t('ec.project.document.name')" min-width="320" show-overflow-tooltip />
              <el-table-column :label="t('ec.project.document.size')" width="140">
                <template #default="{ row }">
                  {{ formatFileSize(row.fileSize) }}
                </template>
              </el-table-column>
              <el-table-column :label="t('ec.project.card.status')" min-width="180">
                <template #default="{ row }">
                  <div v-if="row.rowType === 'queue' && row.status === UPLOAD_STATUS.UPLOADING" class="project-upload-progress">
                    <span class="project-upload-progress__track">
                      <span class="project-upload-progress__bar" :style="{ width: `${row.progress}%` }"></span>
                    </span>
                    <span class="project-upload-progress__text">{{ row.progress }}%</span>
                  </div>
                  <div v-else class="project-upload-state" :class="`is-${getDocumentStatusType(row)}`">
                    <span class="project-upload-state__dot"></span>
                    <span>{{ getDocumentStatusLabel(row) }}</span>
                  </div>
                </template>
              </el-table-column>
              <el-table-column :label="t('ec.project.common.actions')" width="116" fixed="right">
                <template #default="{ row }">
                  <div class="project-document-actions-cell">
                    <el-button
                      type="primary"
                      link
                      :disabled="row.rowType === 'queue' && row.status === UPLOAD_STATUS.UPLOADING"
                      @click="handleRemoveDocumentRow(row)"
                    >
                      {{ t('ec.project.common.delete') }}
                    </el-button>
                  </div>
                </template>
              </el-table-column>

              <template #empty>
                <div class="project-upload-empty">
                  <el-upload
                    ref="uploadDropzoneRef"
                    action="#"
                    drag
                    :auto-upload="false"
                    :show-file-list="false"
                    :multiple="true"
                    :on-change="handleDocumentQueued"
                    class="project-upload-dropzone"
                  >
                    <div class="project-upload-dropzone__icon">
                      <i class="ri-upload-2-line"></i>
                    </div>
                    <div class="project-upload-dropzone__title">{{ t('ec.project.document.dropTitle') }}</div>
                    <div class="project-upload-dropzone__hint">{{ t('ec.project.document.dropHint') }}</div>
                  </el-upload>
                </div>
              </template>
            </el-table>

            <div class="project-document-footer">
              <el-button class="project-document-footer__cancel" :disabled="documentUploading || queuedDocuments.length === 0" @click="clearQueuedDocuments">
                {{ t('ec.project.document.cancelUpload') }}
              </el-button>
              <el-button
                type="primary"
                class="project-document-footer__confirm"
                :loading="documentUploading"
                :disabled="!canUploadQueuedDocuments"
                @click="handleQueuedUpload"
              >
                {{ t('ec.project.document.confirmUpload') }}
              </el-button>
            </div>
          </div>
        </section>

        <section class="project-form-section">
          <div class="project-section-title">{{ t('ec.project.section.relations') }}</div>

          <div class="project-form-grid project-form-grid--relation">
            <el-form-item :label="t('ec.project.detail.persons')" class="is-span-2 project-form-item--transfer">
              <ec-object-multi-transfer
                v-model="formData.personIds"
                :placeholder="t('ec.project.form.selectPlaceholder')"
                :title="`${t('ec.project.detail.persons')}${t('ec.organization.selector.titleSuffix')}`"
                :selected-title="t('ec.organization.selector.selected')"
                :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
                :options="personOptions"
                label-key="name"
                value-key="id"
                subtitle-key="employeeNo"
              />
            </el-form-item>

            <el-form-item :label="t('ec.project.detail.informationSystems')" class="project-form-item--transfer">
              <ec-object-multi-transfer
                v-model="formData.informationSystemIds"
                :placeholder="t('ec.project.form.selectPlaceholder')"
                :title="`${t('ec.project.detail.informationSystems')}${t('ec.organization.selector.titleSuffix')}`"
                :selected-title="t('ec.organization.selector.selected')"
                :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
                :options="informationSystemOptions"
                label-key="name"
                value-key="id"
                subtitle-key="code"
              />
            </el-form-item>

            <el-form-item :label="t('ec.project.detail.hardwareAssets')" class="project-form-item--transfer">
              <ec-object-multi-transfer
                v-model="formData.hardwareAssetIds"
                :placeholder="t('ec.project.form.selectPlaceholder')"
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

        <div class="project-form-actions">
          <el-button type="primary" :loading="submitLoading" class="project-form-actions__submit" @click="handleSubmit">
            {{ t('ec.global.button.text.confirm') }}
          </el-button>
          <el-button class="project-form-actions__cancel" @click="router.push('/project/projects')">
            {{ t('ec.global.button.text.cancel') }}
          </el-button>
        </div>
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
import { buildStatusOptionMap } from '@/utils/statusDictionary'
import {
  createProject,
  getProjectDetail,
  getProjectHardwareOptions,
  getProjectInformationSystemOptions,
  getProjectPersonOptions,
  updateProject,
  uploadProjectDocument,
} from '@/services/modules/projectService'
import { formatFileSize, normalizeIdList } from './helpers'
import EcObjectMultiTransfer from '@/components/EcObjectMultiTransfer.vue'
import FigmaResourcePage from '@/views/organization/components/FigmaResourcePage.vue'

defineOptions({ name: 'ProjectFormPage' })

const MAX_QUEUED_DOCUMENTS = 5
const UPLOAD_STATUS = Object.freeze({
  PENDING: 'PENDING',
  UPLOADING: 'UPLOADING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
})

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const formRef = ref(null)
const uploadButtonRef = ref(null)
const uploadDropzoneRef = ref(null)
const pageLoading = ref(false)
const submitLoading = ref(false)
const documentUploading = ref(false)
const statusDictionaries = ref({})
const personOptions = ref([])
const informationSystemOptions = ref([])
const hardwareOptions = ref([])
const queuedDocuments = ref([])
const lastUploadSummary = ref(null)

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
  endDate: '',
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
const pageBreadcrumbs = computed(() => ([
  { label: 'ec.menu.name.projectAssets' },
  { label: isEdit.value ? 'ec.project.page.editTitle' : 'ec.project.page.createTitle' },
]))

const projectTypeOptions = computed(() => ([
  { value: 'NEW_BUILD', label: t('ec.project.type.newBuild') },
  { value: 'SOFTWARE_UPGRADE', label: t('ec.project.type.softwareUpgrade') },
  { value: 'OPS_PROJECT', label: t('ec.project.type.opsProject') },
  { value: 'SERVICE_PURCHASE', label: t('ec.project.type.servicePurchase') },
  { value: 'HARDWARE_PURCHASE', label: t('ec.project.type.hardwarePurchase') },
  { value: 'INTEGRATION_PROJECT', label: t('ec.project.type.integrationProject') },
]))

const paymentStatusOptions = computed(() => {
  return Object.values(buildStatusOptionMap(statusDictionaries.value.paymentStatus, locale.value))
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
  endDate: [{ required: true, message: t('ec.project.validation.endDateRequired'), trigger: 'change' }],
  warrantyEndDate: [{ required: true, message: t('ec.project.validation.warrantyEndDateRequired'), trigger: 'change' }],
  stage: [{ required: true, message: t('ec.project.validation.stageRequired'), trigger: 'blur' }],
  paymentCycleName: [{ required: true, message: t('ec.project.validation.paymentCycleNameRequired'), trigger: 'blur' }],
  paymentRatio: [{ required: true, message: t('ec.project.validation.paymentRatioRequired'), trigger: 'change' }],
  paymentAmount: [{ required: true, message: t('ec.project.validation.paymentAmountRequired'), trigger: 'change' }],
  plannedPaymentDate: [{ required: true, message: t('ec.project.validation.plannedPaymentDateRequired'), trigger: 'change' }],
  actualPaymentDate: [{ required: true, message: t('ec.project.validation.actualPaymentDateRequired'), trigger: 'change' }],
  paymentStatus: [{ required: true, message: t('ec.project.validation.paymentStatusRequired'), trigger: 'change' }],
}))

const canUploadQueuedDocuments = computed(() => {
  return queuedDocuments.value.some((item) => item.status === UPLOAD_STATUS.PENDING || item.status === UPLOAD_STATUS.FAILED)
})

const showUploadResultSummary = computed(() => {
  return Boolean(lastUploadSummary.value) && !documentUploading.value
})

const documentRows = computed(() => ([
  ...queuedDocuments.value.map((item) => ({
    ...item,
    rowType: 'queue',
  })),
  ...formData.documents.map((item, index) => ({
    ...item,
    rowType: 'saved',
    documentIndex: index,
  })),
]))

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

const createQueuedDocument = (file) => ({
  uid: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
  rawFile: file,
  originalName: file.name || '',
  fileSize: file.size || 0,
  status: UPLOAD_STATUS.PENDING,
  progress: 0,
  errorMessage: '',
})

const getQueuedStatusLabel = (status) => {
  if (status === UPLOAD_STATUS.PENDING) return t('ec.project.document.pending')
  if (status === UPLOAD_STATUS.UPLOADING) return t('ec.project.document.uploading')
  if (status === UPLOAD_STATUS.SUCCESS) return t('ec.project.document.success')
  if (status === UPLOAD_STATUS.FAILED) return t('ec.project.document.failed')
  return status || '-'
}

const getDocumentRowKey = (row) => {
  if (row.rowType === 'queue') {
    return row.uid
  }
  return `saved-${row.id || row.fileUrl || row.fileName || row.originalName || row.documentIndex}`
}

const getDocumentStatusLabel = (row) => {
  if (row.rowType === 'saved') {
    return t('ec.project.document.success')
  }
  return getQueuedStatusLabel(row.status)
}

const getDocumentStatusType = (row) => {
  if (row.rowType === 'saved') {
    return 'success'
  }
  return String(row.status || '').toLowerCase()
}

const clearUploadSelection = () => {
  uploadButtonRef.value?.clearFiles?.()
  uploadDropzoneRef.value?.clearFiles?.()
}

const validateDocumentFile = (file) => {
  const extension = String(file?.name || '').split('.').pop()?.toLowerCase()
  const allowedExtensions = ['png', 'jpg', 'jpeg', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx']
  if (!allowedExtensions.includes(extension)) {
    ElMessage.error(t('ec.project.document.invalidType'))
    return false
  }
  if ((file?.size || 0) / 1024 / 1024 > 100) {
    ElMessage.error(t('ec.project.document.sizeExceeded'))
    return false
  }
  if (queuedDocuments.value.length >= MAX_QUEUED_DOCUMENTS) {
    ElMessage.error(t('ec.project.document.uploadLimitExceeded'))
    return false
  }
  return true
}

const appendUploadedDocument = (item, result) => {
  formData.documents.unshift({
    queueUid: item.uid,
    fileName: result.fileName || '',
    originalName: result.originalName || item.originalName,
    fileSize: result.size || item.fileSize,
    contentType: result.contentType || item.rawFile?.type || '',
    fileUrl: result.url || '',
    uploadedAt: new Date().toISOString(),
  })
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
  formData.endDate = project.endDate || ''
  formData.warrantyEndDate = project.warrantyEndDate || ''
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
  queuedDocuments.value = []
  lastUploadSummary.value = null
}

const handleDocumentQueued = (uploadFile) => {
  const rawFile = uploadFile?.raw || uploadFile
  clearUploadSelection()
  if (!rawFile || !validateDocumentFile(rawFile)) return
  lastUploadSummary.value = null
  queuedDocuments.value.push(createQueuedDocument(rawFile))
}

const handleQueuedUpload = async () => {
  const uploadableItems = queuedDocuments.value.filter((item) => item.status === UPLOAD_STATUS.PENDING || item.status === UPLOAD_STATUS.FAILED)
  if (uploadableItems.length === 0) {
    ElMessage.warning(t('ec.project.document.noPending'))
    return
  }

  documentUploading.value = true
  lastUploadSummary.value = null
  let successCount = 0
  let failedCount = 0

  try {
    for (const item of uploadableItems) {
      item.status = UPLOAD_STATUS.UPLOADING
      item.progress = 0
      item.errorMessage = ''
      try {
        const result = await uploadProjectDocument(item.rawFile, {
          onUploadProgress: (event) => {
            if (!event?.total) return
            item.progress = Math.min(99, Math.max(1, Math.round((event.loaded / event.total) * 100)))
          },
        })
        item.status = UPLOAD_STATUS.SUCCESS
        item.progress = 100
        appendUploadedDocument(item, result)
        successCount += 1
      } catch (error) {
        item.status = UPLOAD_STATUS.FAILED
        item.progress = 0
        item.errorMessage = error.message || t('ec.project.document.uploadFailed')
        failedCount += 1
      }
    }
  } finally {
    documentUploading.value = false
    lastUploadSummary.value = {
      total: uploadableItems.length,
      success: successCount,
      failed: failedCount,
    }
    queuedDocuments.value = queuedDocuments.value.filter((item) => item.status !== UPLOAD_STATUS.SUCCESS)
    clearUploadSelection()
  }

  if (successCount > 0 && failedCount === 0) {
    ElMessage.success(t('ec.project.document.uploadSuccess'))
    return
  }
  if (successCount > 0) {
    ElMessage.warning(t('ec.project.document.partialSuccess'))
    return
  }
  ElMessage.error(t('ec.project.document.allFailed'))
}

const clearQueuedDocuments = () => {
  queuedDocuments.value = []
  clearUploadSelection()
  ElMessage.success(t('ec.project.document.clearQueueSuccess'))
}

const removeQueuedDocument = (uid) => {
  queuedDocuments.value = queuedDocuments.value.filter((item) => item.uid !== uid)
}

const removeDocument = (index) => {
  formData.documents.splice(index, 1)
}

const handleRemoveDocumentRow = (row) => {
  if (row.rowType === 'queue') {
    removeQueuedDocument(row.uid)
    return
  }
  removeDocument(row.documentIndex)
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
    endDate: formData.endDate,
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
  if (!formRef.value || documentUploading.value) return
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
  padding: 0 4px 0 0;
  background: transparent;
}

.project-form {
  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-form-item__label) {
    display: inline-flex;
    align-items: center;
    padding-bottom: 4px;
    color: #444a57;
    font-size: 14px;
    line-height: 22px;
  }

  :deep(.el-form-item__label-wrap) {
    margin: 0;
  }

  :deep(.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before),
  :deep(.el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label:before) {
    display: none;
  }

  :deep(.el-form-item__content),
  :deep(.el-input),
  :deep(.el-select),
  :deep(.el-input-number),
  :deep(.el-date-editor) {
    width: 100%;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper),
  :deep(.el-input-number .el-input__wrapper) {
    min-height: 32px;
    padding: 0 12px;
    background: #f5f6f9;
    box-shadow: none;
    border-radius: 4px;
  }

  :deep(.el-input__wrapper.is-focus),
  :deep(.el-select__wrapper.is-focused),
  :deep(.el-input-number .el-input__wrapper.is-focus) {
    background: #fff;
    box-shadow: 0 0 0 1px #2e5ef0 inset;
  }

  :deep(.el-input__inner),
  :deep(.el-select__selected-item),
  :deep(.el-select__placeholder),
  :deep(.el-input-number .el-input__inner) {
    color: #444a57;
    font-size: 14px;
    line-height: 22px;
  }

  :deep(.el-input__inner::placeholder),
  :deep(.el-input-number .el-input__inner::placeholder) {
    color: #858a99;
  }

  :deep(.el-select__placeholder.is-transparent) {
    color: #858a99;
  }

  :deep(.el-date-editor .el-input__wrapper) {
    padding-right: 8px;
  }

  :deep(.el-range__icon),
  :deep(.el-input__icon),
  :deep(.el-select__caret) {
    color: #999faa;
  }

  :deep(.el-form-item.is-error .el-input__wrapper),
  :deep(.el-form-item.is-error .el-select__wrapper),
  :deep(.el-form-item.is-error .el-input-number .el-input__wrapper),
  :deep(.el-form-item.is-error .ec-object-multi-transfer__trigger) {
    box-shadow: 0 0 0 1px #db4942 inset;
  }

  :deep(.el-form-item__error) {
    padding-top: 4px;
  }
}

.project-form-section + .project-form-section {
  margin-top: 34px;
}

.project-section-title {
  margin-bottom: 16px;
  color: #151b26;
  font-size: 16px;
  font-weight: 700;
  line-height: 24px;
}

.project-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 24px;
}

.project-form-grid--relation {
  gap: 20px 24px;
}

.is-span-2 {
  grid-column: 1 / -1;
}

.project-form-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.project-form-label__required {
  color: #db4942;
  line-height: 1;
}

.project-document-block {
  padding-top: 2px;
}

.project-document-toolbar {
  display: flex;
  align-items: center;
  gap: 14px;
  margin-bottom: 14px;
}

.project-document-toolbar__button {
  min-width: 82px;
  height: 32px;
  padding: 0 16px;
  color: #555d6d;
  background: #f0f2f5;
  border-color: #f0f2f5;
  border-radius: 4px;
}

.project-document-toolbar__hint {
  color: #858a99;
  font-size: 12px;
  line-height: 20px;
}

.project-document-toolbar__summary {
  display: inline-flex;
  align-items: center;
  flex-wrap: wrap;
  color: #444a57;
  font-size: 12px;
  line-height: 20px;
}

.project-document-toolbar__summary-count {
  margin: 0 2px;
  font-weight: 600;

  &.is-total {
    color: #2e5ef0;
  }

  &.is-success {
    color: #36b23e;
  }

  &.is-failed {
    color: #db4942;
  }
}

.project-document-table {
  :deep(.el-table__header-wrapper th.el-table__cell) {
    height: 46px;
    color: #151b26;
    background: #f5f6f9;
    font-weight: 600;
  }

  :deep(.el-table__row td.el-table__cell) {
    height: 46px;
  }

  :deep(.el-table__empty-block) {
    padding: 0;
  }

  :deep(.el-table__empty-text) {
    width: 100%;
  }
}

.project-document-actions-cell {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.project-upload-empty {
  width: 100%;
}

.project-upload-dropzone {
  display: block;
  width: 100%;

  :deep(.el-upload),
  :deep(.el-upload-dragger) {
    width: 100%;
  }

  :deep(.el-upload-dragger) {
    padding: 60px 20px;
    background: #f5f6f9;
    border-color: #e6e8ed;
    border-radius: 0 0 4px 4px;
  }
}

.project-upload-dropzone__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  margin-bottom: 12px;
  color: #fff;
  font-size: 16px;
  background: #2e5ef0;
  border-radius: 4px;
}

.project-upload-dropzone__title {
  color: #555d6d;
  font-size: 14px;
  line-height: 22px;
}

.project-upload-dropzone__hint {
  margin-top: 6px;
  color: #858a99;
  font-size: 12px;
  line-height: 20px;
}

.project-upload-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.project-upload-progress__track {
  position: relative;
  flex: 0 0 60px;
  height: 4px;
  overflow: hidden;
  background: #e6e8ed;
  border-radius: 999px;
}

.project-upload-progress__bar {
  position: absolute;
  inset: 0 auto 0 0;
  background: #2e5ef0;
  border-radius: 999px;
}

.project-upload-progress__text {
  color: #444a57;
  font-size: 14px;
  line-height: 22px;
}

.project-upload-state {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: #444a57;
  font-size: 14px;
  line-height: 22px;

  &.is-pending .project-upload-state__dot {
    background: #c4c6cc;
  }

  &.is-success .project-upload-state__dot {
    background: #36b23e;
  }

  &.is-failed .project-upload-state__dot {
    background: #db4942;
  }
}

.project-upload-state__dot {
  width: 6px;
  height: 6px;
  border-radius: 999px;
}

.project-document-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 16px;
}

.project-document-footer__cancel,
.project-document-footer__confirm {
  min-width: 84px;
  height: 32px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 14px;
}

.project-document-footer__cancel {
  color: #555d6d;
  background: #f0f2f5;
  border-color: #f0f2f5;
}

.project-document-footer__cancel.is-disabled,
.project-document-footer__confirm.is-disabled {
  opacity: 1;
}

.project-document-footer__cancel.is-disabled {
  color: #8f96a3;
  background: #f0f2f5;
  border-color: #f0f2f5;
}

.project-document-footer__confirm.is-disabled {
  color: #fff;
  background: #b8c9ff;
  border-color: #b8c9ff;
}

.project-form-item--transfer {
  :deep(.ec-object-multi-transfer__trigger) {
    min-height: 32px;
    padding: 2px 12px;
    background: #f5f6f9;
    border: 1px solid transparent;
    border-radius: 4px;
  }

  :deep(.ec-object-multi-transfer__tag),
  :deep(.ec-object-multi-transfer__summary-text) {
    height: 28px;
    padding: 0 10px;
    color: #555d6d;
    background: #fff;
    border: 1px solid #e6e8ed;
    border-radius: 4px;
    line-height: 26px;
  }

  :deep(.ec-object-multi-transfer__placeholder),
  :deep(.ec-object-multi-transfer__suffix) {
    color: #858a99;
    font-size: 14px;
  }

  :deep(.ec-object-multi-transfer__trigger.is-active) {
    background: #fff;
  }
}

.project-form-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 32px;
}

.project-form-actions__submit,
.project-form-actions__cancel {
  min-width: 68px;
  height: 32px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 14px;
}

.project-form-actions__submit {
  border-color: #2e5ef0;
  background: #2e5ef0;
}

.project-form-actions__cancel {
  color: #555d6d;
  background: #f0f2f5;
  border-color: #f0f2f5;
}

@media only screen and (max-width: 991px) {
  .project-form-grid {
    grid-template-columns: 1fr;
  }

  .is-span-2 {
    grid-column: auto;
  }

  .project-document-toolbar,
  .project-document-footer,
  .project-form-actions {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
