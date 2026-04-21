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
          <div class="project-repeatable-header">
            <div class="project-section-title">{{ t('ec.project.section.period') }}</div>
            <el-button type="primary" class="project-repeatable-add" @click="addProjectPeriod">
              <i class="ri-add-line"></i>
              {{ t('ec.project.form.addCycle') }}
            </el-button>
          </div>

          <div class="project-cycle-list">
            <div
              v-for="(period, index) in formData.projectPeriods"
              :key="period.uid"
              class="project-cycle-row project-cycle-row--period"
            >
              <div class="project-cycle-fields">
                <el-form-item
                  :prop="`projectPeriods.${index}.stageName`"
                  :rules="requiredRule(t('ec.project.form.stageNameLabel'), 'blur')"
                >
                  <template #label>
                    <span class="project-form-label">
                      {{ t('ec.project.form.stageNameLabel') }}
                      <span class="project-form-label__required">*</span>
                    </span>
                  </template>
                  <el-input v-model="period.stageName" clearable :placeholder="t('ec.project.form.contentPlaceholder')" />
                </el-form-item>

                <el-form-item
                  :prop="`projectPeriods.${index}.plannedDate`"
                  :rules="requiredRule(t('ec.project.form.plannedTimeLabel'), 'change')"
                >
                  <template #label>
                    <span class="project-form-label">
                      {{ t('ec.project.form.plannedTimeLabel') }}
                      <span class="project-form-label__required">*</span>
                    </span>
                  </template>
                  <el-date-picker v-model="period.plannedDate" type="date" value-format="YYYY-MM-DD" :placeholder="t('ec.project.form.selectPlaceholder')" />
                </el-form-item>

                <el-form-item :prop="`projectPeriods.${index}.actualDate`">
                  <template #label>
                    <span class="project-form-label">
                      {{ t('ec.project.form.actualTimeLabel') }}
                      <span class="project-form-label__required">*</span>
                    </span>
                  </template>
                  <el-date-picker v-model="period.actualDate" type="date" value-format="YYYY-MM-DD" :placeholder="t('ec.project.form.selectPlaceholder')" />
                </el-form-item>
              </div>

              <el-button type="primary" link class="project-cycle-remove" @click="removeProjectPeriod(index)">
                {{ t('ec.project.common.delete') }}
              </el-button>
            </div>
          </div>
        </section>

        <section class="project-form-section">
          <div class="project-repeatable-header">
            <div class="project-section-title">{{ t('ec.project.section.payment') }}</div>
            <el-button type="primary" class="project-repeatable-add" @click="addPaymentCycle">
              <i class="ri-add-line"></i>
              {{ t('ec.project.form.addCycle') }}
            </el-button>
          </div>

          <div class="project-cycle-list">
            <div
              v-for="(paymentCycle, index) in formData.paymentCycles"
              :key="paymentCycle.uid"
              class="project-cycle-row project-cycle-row--payment"
            >
              <div class="project-cycle-fields">
                <el-form-item
                  :prop="`paymentCycles.${index}.stageName`"
                  :rules="requiredRule(t('ec.project.form.stageNameLabel'), 'blur')"
                >
                  <template #label>
                    <span class="project-form-label">
                      {{ t('ec.project.form.stageNameLabel') }}
                      <span class="project-form-label__required">*</span>
                    </span>
                  </template>
                  <el-input v-model="paymentCycle.stageName" clearable :placeholder="t('ec.project.form.contentPlaceholder')" />
                </el-form-item>

                <el-form-item
                  :prop="`paymentCycles.${index}.paymentRatio`"
                  :rules="requiredRule(t('ec.project.form.paymentRatioLabel'), 'change')"
                >
                  <template #label>
                    <span class="project-form-label">
                      {{ t('ec.project.form.paymentRatioLabel') }}
                      <span class="project-form-label__required">*</span>
                    </span>
                  </template>
                  <el-input-number
                    v-model="paymentCycle.paymentRatio"
                    :min="0"
                    :max="100"
                    :precision="2"
                    :controls="false"
                    :placeholder="t('ec.project.form.contentPlaceholder')"
                  />
                </el-form-item>

                <el-form-item
                  :prop="`paymentCycles.${index}.paymentAmount`"
                  :rules="requiredRule(t('ec.project.form.paymentAmountLabel'), 'change')"
                >
                  <template #label>
                    <span class="project-form-label">
                      {{ t('ec.project.form.paymentAmountLabel') }}
                      <span class="project-form-label__required">*</span>
                    </span>
                  </template>
                  <el-input-number
                    v-model="paymentCycle.paymentAmount"
                    :min="0"
                    :precision="2"
                    :controls="false"
                    :placeholder="t('ec.project.form.contentPlaceholder')"
                  />
                </el-form-item>

                <el-form-item
                  :prop="`paymentCycles.${index}.plannedPaymentDate`"
                  :rules="requiredRule(t('ec.project.common.plannedPaymentDate'), 'change')"
                >
                  <template #label>
                    <span class="project-form-label">
                      {{ t('ec.project.common.plannedPaymentDate') }}
                      <span class="project-form-label__required">*</span>
                    </span>
                  </template>
                  <el-date-picker v-model="paymentCycle.plannedPaymentDate" type="date" value-format="YYYY-MM-DD" :placeholder="t('ec.project.form.selectPlaceholder')" />
                </el-form-item>

                <el-form-item :prop="`paymentCycles.${index}.actualPaymentDate`">
                  <template #label>
                    <span class="project-form-label">
                      {{ t('ec.project.common.actualPaymentDate') }}
                      <span class="project-form-label__required">*</span>
                    </span>
                  </template>
                  <el-date-picker v-model="paymentCycle.actualPaymentDate" type="date" value-format="YYYY-MM-DD" :placeholder="t('ec.project.form.selectPlaceholder')" />
                </el-form-item>
              </div>

              <el-button type="primary" link class="project-cycle-remove" @click="removePaymentCycle(index)">
                {{ t('ec.project.common.delete') }}
              </el-button>
            </div>
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
let cycleUidSeed = 0

const UPLOAD_STATUS = Object.freeze({
  PENDING: 'PENDING',
  UPLOADING: 'UPLOADING',
  SUCCESS: 'SUCCESS',
  FAILED: 'FAILED',
})

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const formRef = ref(null)
const uploadButtonRef = ref(null)
const uploadDropzoneRef = ref(null)
const pageLoading = ref(false)
const submitLoading = ref(false)
const documentUploading = ref(false)
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
  projectPeriods: [],
  paymentCycles: [],
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

const createProjectPeriodRow = (overrides = {}) => ({
  uid: `period-${Date.now()}-${cycleUidSeed++}`,
  stageName: '',
  plannedDate: '',
  actualDate: '',
  ...overrides,
})

const createPaymentCycleRow = (overrides = {}) => ({
  uid: `payment-${Date.now()}-${cycleUidSeed++}`,
  stageName: '',
  paymentRatio: null,
  paymentAmount: null,
  plannedPaymentDate: '',
  actualPaymentDate: '',
  ...overrides,
})

const resetDefaultCycles = () => {
  formData.projectPeriods = [
    createProjectPeriodRow(),
    createProjectPeriodRow(),
  ]
  formData.paymentCycles = [
    createPaymentCycleRow(),
  ]
}

resetDefaultCycles()

const requiredRule = (label, trigger = 'blur') => ([{
  required: true,
  message: t('ec.project.validation.dynamicRequired', { label }),
  trigger,
}])

const formRules = computed(() => ({
  code: [{ required: true, message: t('ec.project.validation.codeRequired'), trigger: 'blur' }],
  name: [{ required: true, message: t('ec.project.validation.nameRequired'), trigger: 'blur' }],
  projectType: [{ required: true, message: t('ec.project.validation.projectTypeRequired'), trigger: 'change' }],
  approvalBatchNo: [{ required: true, message: t('ec.project.validation.approvalBatchNoRequired'), trigger: 'blur' }],
  projectBudget: [{ required: true, message: t('ec.project.validation.projectBudgetRequired'), trigger: 'change' }],
  contractAmount: [{ required: true, message: t('ec.project.validation.contractAmountRequired'), trigger: 'change' }],
  ownerName: [{ required: true, message: t('ec.project.validation.ownerNameRequired'), trigger: 'blur' }],
  ownerPhone: [{ required: true, message: t('ec.project.validation.ownerPhoneRequired'), trigger: 'blur' }],
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
  const [persons, informationSystems, hardwareAssets] = await Promise.all([
    getProjectPersonOptions(),
    getProjectInformationSystemOptions(),
    getProjectHardwareOptions(),
  ])

  personOptions.value = Array.isArray(persons) ? persons : []
  informationSystemOptions.value = Array.isArray(informationSystems) ? informationSystems : []
  hardwareOptions.value = Array.isArray(hardwareAssets) ? hardwareAssets : []
}

const normalizeProjectPeriods = (periods = [], project = {}) => {
  const source = Array.isArray(periods) && periods.length > 0
    ? periods
    : [
        { stageName: t('ec.project.common.approvalDate'), plannedDate: project.approvalDate },
        { stageName: t('ec.project.common.startDate'), plannedDate: project.startDate },
        { stageName: t('ec.project.common.initialDeliveryDate'), plannedDate: project.initialDeliveryDate },
        { stageName: t('ec.project.common.endDate'), plannedDate: project.endDate },
        { stageName: t('ec.project.common.warrantyEndDate'), plannedDate: project.warrantyEndDate },
      ].filter((item) => item.plannedDate)

  return source.map((item) => createProjectPeriodRow({
    stageName: item.stageName || '',
    plannedDate: item.plannedDate || '',
    actualDate: item.actualDate || '',
  }))
}

const normalizePaymentCycles = (paymentCycles = [], project = {}) => {
  const hasLegacyPayment = project.paymentCycleName
    || project.paymentRatio != null
    || project.paymentAmount != null
    || project.plannedPaymentDate
    || project.actualPaymentDate
  const source = Array.isArray(paymentCycles) && paymentCycles.length > 0
    ? paymentCycles
    : hasLegacyPayment
      ? [{
          stageName: project.paymentCycleName || '',
          paymentRatio: project.paymentRatio,
          paymentAmount: project.paymentAmount,
          plannedPaymentDate: project.plannedPaymentDate,
          actualPaymentDate: project.actualPaymentDate,
        }]
      : []

  return source.map((item) => createPaymentCycleRow({
    stageName: item.stageName || '',
    paymentRatio: item.paymentRatio ?? null,
    paymentAmount: item.paymentAmount ?? null,
    plannedPaymentDate: item.plannedPaymentDate || '',
    actualPaymentDate: item.actualPaymentDate || '',
  }))
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
  formData.projectPeriods = normalizeProjectPeriods(detail?.projectPeriods, project)
  if (formData.projectPeriods.length === 0) {
    formData.projectPeriods = [createProjectPeriodRow()]
  }
  formData.paymentCycles = normalizePaymentCycles(detail?.paymentCycles, project)
  if (formData.paymentCycles.length === 0) {
    formData.paymentCycles = [createPaymentCycleRow()]
  }
  formData.documents = normalizeDocuments(detail?.documents)
  formData.personIds = normalizeIdList(detail?.personIds)
  formData.informationSystemIds = normalizeIdList(detail?.informationSystemIds)
  formData.hardwareAssetIds = normalizeIdList(detail?.hardwareAssetIds)
  formData.remark = project.remark || ''
  queuedDocuments.value = []
  lastUploadSummary.value = null
}

const addProjectPeriod = () => {
  formData.projectPeriods.push(createProjectPeriodRow())
}

const removeProjectPeriod = (index) => {
  formData.projectPeriods.splice(index, 1)
}

const addPaymentCycle = () => {
  formData.paymentCycles.push(createPaymentCycleRow())
}

const removePaymentCycle = (index) => {
  formData.paymentCycles.splice(index, 1)
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
    projectPeriods: formData.projectPeriods.map((item) => ({
      stageName: String(item.stageName || '').trim(),
      plannedDate: item.plannedDate || null,
      actualDate: item.actualDate || null,
    })),
    paymentCycles: formData.paymentCycles.map((item) => ({
      stageName: String(item.stageName || '').trim(),
      paymentRatio: item.paymentRatio,
      paymentAmount: item.paymentAmount,
      plannedPaymentDate: item.plannedPaymentDate || null,
      actualPaymentDate: item.actualPaymentDate || null,
    })),
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
  if (formData.projectPeriods.length === 0) {
    ElMessage.error(t('ec.project.validation.projectPeriodRequired'))
    return
  }
  if (formData.paymentCycles.length === 0) {
    ElMessage.error(t('ec.project.validation.paymentCycleRequired'))
    return
  }
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
  max-width: 1012px;
  font-family: 'PingFang SC', sans-serif;

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

  :deep(.el-input-number .el-input__inner) {
    text-align: left;
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
  font-weight: 600;
  line-height: 24px;
}

.project-repeatable-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 16px;
  margin-bottom: 16px;

  .project-section-title {
    margin-bottom: 0;
  }
}

.project-repeatable-add {
  width: 99px;
  height: 32px;
  padding: 5px 12px;
  border-radius: 4px;
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;

  i {
    width: 14px;
    height: 14px;
    margin-right: 5px;
    font-size: 14px;
    line-height: 14px;
  }
}

.project-cycle-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-cycle-row {
  position: relative;
  min-height: 100px;
  padding: 16px;
  background: #f5f6f9;
  border: 1px dashed #e6e8ed;
  border-radius: 4px;

  :deep(.el-form-item) {
    height: 68px;
  }

  :deep(.el-form-item__label) {
    height: 32px;
    margin-bottom: 4px;
    padding: 5px 0;
    color: #444a57;
    font-size: 14px;
    font-weight: 400;
    line-height: 22px;
  }

  :deep(.el-form-item__content) {
    height: 32px;
    line-height: 32px;
  }

  :deep(.el-input),
  :deep(.el-input-number),
  :deep(.el-date-editor) {
    height: 32px;
  }

  :deep(.el-input__wrapper),
  :deep(.el-input-number .el-input__wrapper),
  :deep(.el-date-editor .el-input__wrapper) {
    height: 32px;
    min-height: 32px;
    padding: 5px 12px;
    background: #fff;
    border-radius: 4px;
  }

  :deep(.el-input__inner),
  :deep(.el-input-number .el-input__inner) {
    height: 22px;
    color: #444a57;
    font-size: 14px;
    line-height: 22px;
  }

  :deep(.el-input__inner::placeholder) {
    color: #858a99;
  }

  :deep(.el-input__prefix),
  :deep(.el-input__suffix) {
    color: #858a99;
  }

  &:hover,
  &:focus-within {
    .project-cycle-remove {
      opacity: 1;
      pointer-events: auto;
    }
  }
}

.project-cycle-fields {
  display: grid;
  height: 68px;
  gap: 24px;
  align-items: start;
}

.project-cycle-row--period .project-cycle-fields {
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

.project-cycle-row--payment .project-cycle-fields {
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.project-cycle-remove {
  position: absolute;
  top: 10px;
  right: 16px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s ease;
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
  .project-form-grid,
  .project-cycle-row--period .project-cycle-fields,
  .project-cycle-row--payment .project-cycle-fields {
    grid-template-columns: 1fr;
  }

  .is-span-2 {
    grid-column: auto;
  }

  .project-cycle-remove {
    position: static;
    margin-top: 10px;
    opacity: 1;
    pointer-events: auto;
  }

  .project-cycle-row {
    padding: 16px;
  }

  .project-document-toolbar,
  .project-document-footer,
  .project-form-actions {
    align-items: stretch;
    flex-direction: column;
  }
}
</style>
