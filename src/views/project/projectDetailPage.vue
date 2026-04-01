<template>
  <figma-resource-page
    hide-tabs
    active-tab="projects"
    :title="t('ec.project.page.detailTitle')"
    :description="t('ec.project.page.detailDescription')"
    back-path="/project/projects"
  >
    <template #actions>
      <el-button @click="router.push(`/project/projects/${route.params.id}/relations`)">
        {{ t('ec.project.common.relations') }}
      </el-button>
      <el-button type="primary" @click="router.push(`/project/projects/${route.params.id}/edit`)">
        {{ t('ec.project.common.edit') }}
      </el-button>
    </template>

    <div v-loading="pageLoading" class="project-detail-page">
      <section class="project-page-card">
        <div class="project-detail-header">
          <div>
            <div class="project-detail-title">{{ detailRecord.project?.name || '-' }}</div>
            <div class="project-detail-subtitle">{{ detailRecord.project?.code || '-' }}</div>
          </div>
          <el-tag :type="getStatusTagType(detailRecord.project?.projectStatus, projectStatusMap)">
            {{ getStatusLabel(detailRecord.project?.projectStatus, projectStatusMap) }}
          </el-tag>
        </div>

        <div class="project-detail-section">
          <div class="project-section-title">{{ t('ec.project.section.basic') }}</div>
          <div class="project-detail-grid">
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.code') }}</span>
              <strong>{{ detailRecord.project?.code || '-' }}</strong>
            </div>
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.name') }}</span>
              <strong>{{ detailRecord.project?.name || '-' }}</strong>
            </div>
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.projectType') }}</span>
              <strong>{{ getProjectTypeLabel(detailRecord.project?.projectType) }}</strong>
            </div>
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.approvalBatchNo') }}</span>
              <strong>{{ detailRecord.project?.approvalBatchNo || '-' }}</strong>
            </div>
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.projectBudget') }}</span>
              <strong>{{ formatAmount(detailRecord.project?.projectBudget) }}</strong>
            </div>
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.contractAmount') }}</span>
              <strong>{{ formatAmount(detailRecord.project?.contractAmount) }}</strong>
            </div>
          </div>
        </div>

        <div class="project-detail-section">
          <div class="project-section-title">{{ t('ec.project.section.period') }}</div>
          <div class="project-detail-grid">
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.approvalDate') }}</span>
              <strong>{{ formatDate(detailRecord.project?.approvalDate) }}</strong>
            </div>
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.startDate') }}</span>
              <strong>{{ formatDate(detailRecord.project?.startDate) }}</strong>
            </div>
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.initialDeliveryDate') }}</span>
              <strong>{{ formatDate(detailRecord.project?.initialDeliveryDate) }}</strong>
            </div>
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.endDate') }}</span>
              <strong>{{ formatDate(detailRecord.project?.endDate) }}</strong>
            </div>
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.warrantyEndDate') }}</span>
              <strong>{{ formatDate(detailRecord.project?.warrantyEndDate) }}</strong>
            </div>
            <div class="project-detail-item is-span-2">
              <span>{{ t('ec.project.common.stage') }}</span>
              <strong>{{ detailRecord.project?.stage || '-' }}</strong>
            </div>
          </div>
        </div>

        <div class="project-detail-section">
          <div class="project-section-title">{{ t('ec.project.section.payment') }}</div>
          <div class="project-detail-grid">
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.paymentCycleName') }}</span>
              <strong>{{ detailRecord.project?.paymentCycleName || '-' }}</strong>
            </div>
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.paymentRatio') }}</span>
              <strong>{{ detailRecord.project?.paymentRatio == null ? '-' : `${detailRecord.project.paymentRatio}%` }}</strong>
            </div>
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.paymentAmount') }}</span>
              <strong>{{ formatAmount(detailRecord.project?.paymentAmount) }}</strong>
            </div>
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.plannedPaymentDate') }}</span>
              <strong>{{ formatDate(detailRecord.project?.plannedPaymentDate) }}</strong>
            </div>
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.actualPaymentDate') }}</span>
              <strong>{{ formatDate(detailRecord.project?.actualPaymentDate) }}</strong>
            </div>
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.paymentStatus') }}</span>
              <strong>{{ getStatusLabel(detailRecord.project?.paymentStatus, paymentStatusMap) }}</strong>
            </div>
          </div>
        </div>

        <div class="project-detail-section">
          <div class="project-section-title">{{ t('ec.project.section.owner') }}</div>
          <div class="project-detail-grid">
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.ownerName') }}</span>
              <strong>{{ detailRecord.project?.ownerName || '-' }}</strong>
            </div>
            <div class="project-detail-item">
              <span>{{ t('ec.project.common.ownerPhone') }}</span>
              <strong>{{ detailRecord.project?.ownerPhone || '-' }}</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="project-page-card">
        <div class="project-section-title">{{ t('ec.project.section.documents') }}</div>
        <div class="project-detail-hint">{{ t('ec.project.document.detailHint') }}</div>
        <el-table :data="detailRecord.documents" class="project-document-table">
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
          <el-table-column :label="t('ec.project.common.actions')" width="120">
            <template #default="{ row }">
              <el-button type="primary" link @click="openDocument(row)">
                {{ t('ec.project.document.view') }}
              </el-button>
            </template>
          </el-table-column>
          <template #empty>
            <el-empty :image-size="56" :description="t('ec.project.document.empty')" />
          </template>
        </el-table>
      </section>

      <section v-if="detailRecord.project?.remark" class="project-page-card">
        <div class="project-section-title">{{ t('ec.project.common.remark') }}</div>
        <div class="project-detail-remark">{{ detailRecord.project?.remark || '-' }}</div>
      </section>

      <section class="project-page-card">
        <div class="project-section-title">{{ t('ec.project.detail.persons') }}</div>
        <div v-if="personCards.length > 0" class="project-resource-grid">
          <article v-for="item in personCards" :key="item.id" class="project-resource-card">
            <div class="project-resource-card__head">
              <div class="project-resource-card__title">{{ item.name || '-' }}</div>
            </div>
            <div class="project-resource-card__meta-grid">
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.employeeNo') }}</span>
                <strong>{{ item.employeeNo || '-' }}</strong>
              </div>
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.mobile') }}</span>
                <strong>{{ item.mobile || '-' }}</strong>
              </div>
            </div>
          </article>
        </div>
        <el-empty v-else :description="t('ec.project.common.noRelation')" />
      </section>

      <section class="project-page-card">
        <div class="project-section-title">{{ t('ec.project.detail.informationSystems') }}</div>
        <div v-if="softwareCards.length > 0" class="project-resource-grid">
          <article v-for="item in softwareCards" :key="item.id" class="project-resource-card">
            <div class="project-resource-card__head">
              <div class="project-resource-card__title">{{ item.name || '-' }}</div>
              <span class="project-resource-card__tag">{{ getSystemTypeLabel(item.systemType) }}</span>
            </div>
            <div class="project-resource-card__meta-grid">
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.code') }}</span>
                <strong>{{ item.code || '-' }}</strong>
              </div>
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.type') }}</span>
                <strong>{{ getSystemTypeLabel(item.systemType) }}</strong>
              </div>
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.vendor') }}</span>
                <strong>{{ item.serviceProviderName || '-' }}</strong>
              </div>
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.owner') }}</span>
                <strong>{{ item.ownerName || '-' }}</strong>
              </div>
            </div>
          </article>
        </div>
        <el-empty v-else :description="t('ec.project.common.noRelation')" />
      </section>

      <section class="project-page-card">
        <div class="project-section-title">{{ t('ec.project.detail.hardwareAssets') }}</div>
        <div v-if="hardwareCards.length > 0" class="project-resource-grid">
          <article v-for="item in hardwareCards" :key="item.id" class="project-resource-card">
            <div class="project-resource-card__head">
              <div class="project-resource-card__title">{{ item.name || '-' }}</div>
            </div>
            <div class="project-resource-card__meta-grid">
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.code') }}</span>
                <strong>{{ item.code || '-' }}</strong>
              </div>
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.ip') }}</span>
                <strong>{{ item.managementIp || '-' }}</strong>
              </div>
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.cpu') }}</span>
                <strong>{{ item.cpuModel || '-' }}</strong>
              </div>
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.memory') }}</span>
                <strong>{{ item.memoryGb == null ? '-' : `${item.memoryGb} GB` }}</strong>
              </div>
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.vendor') }}</span>
                <strong>{{ item.serviceProviderName || '-' }}</strong>
              </div>
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.owner') }}</span>
                <strong>{{ item.ownerName || '-' }}</strong>
              </div>
            </div>
          </article>
        </div>
        <el-empty v-else :description="t('ec.project.common.noRelation')" />
      </section>

      <section class="project-page-card">
        <div class="project-section-title">{{ t('ec.project.detail.serviceProviders') }}</div>
        <div v-if="serviceProviderCards.length > 0" class="project-resource-grid">
          <article v-for="item in serviceProviderCards" :key="item.id" class="project-resource-card">
            <div class="project-resource-card__head">
              <div class="project-resource-card__title">{{ item.name || '-' }}</div>
            </div>
            <div class="project-resource-card__meta-grid">
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.code') }}</span>
                <strong>{{ item.code || '-' }}</strong>
              </div>
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.creditCode') }}</span>
                <strong>{{ item.unifiedSocialCreditCode || '-' }}</strong>
              </div>
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.scope') }}</span>
                <strong>{{ formatScopes(item.cooperationScopes) }}</strong>
              </div>
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.score') }}</span>
                <strong>{{ item.score || '-' }}</strong>
              </div>
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.contact') }}</span>
                <strong>{{ item.businessContact || '-' }}</strong>
              </div>
              <div class="project-resource-card__meta">
                <span>{{ t('ec.project.card.phone') }}</span>
                <strong>{{ item.businessPhone || '-' }}</strong>
              </div>
            </div>
          </article>
        </div>
        <el-empty v-else :description="t('ec.project.common.noRelation')" />
      </section>
    </div>
  </figma-resource-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getStatusDictionaries } from '@/services/modules/dictionaryService'
import { buildStatusOptionMap } from '@/utils/statusDictionary'
import { getProjectDetail } from '@/services/modules/projectService'
import { formatAmount, formatDate, formatDateTime, formatFileSize, getStatusLabel, getStatusTagType } from './helpers'
import FigmaResourcePage from '@/views/organization/components/FigmaResourcePage.vue'

defineOptions({ name: 'ProjectDetailPage' })

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const pageLoading = ref(false)
const statusDictionaries = ref({})
const detailRecord = ref({
  project: null,
  documents: [],
  persons: [],
  informationSystems: [],
  hardwareAssets: [],
  serviceProviders: [],
})

const projectTypeMap = computed(() => ({
  NEW_BUILD: t('ec.project.type.newBuild'),
  SOFTWARE_UPGRADE: t('ec.project.type.softwareUpgrade'),
  OPS_PROJECT: t('ec.project.type.opsProject'),
  SERVICE_PURCHASE: t('ec.project.type.servicePurchase'),
  HARDWARE_PURCHASE: t('ec.project.type.hardwarePurchase'),
  INTEGRATION_PROJECT: t('ec.project.type.integrationProject'),
}))

const systemTypeMap = computed(() => ({
  EXTERNAL_SERVICE: t('ec.software.type.externalService'),
  INTERNAL_OFFICE: t('ec.software.type.internalOffice'),
  SUPPORT_SYSTEM: t('ec.software.type.supportSystem'),
}))

const cooperationScopeMap = computed(() => ({
  SOFTWARE_DEVELOPMENT: t('ec.organization.serviceProvider.scope.softwareDevelopment'),
  OPERATIONS_SERVICE: t('ec.organization.serviceProvider.scope.operationsService'),
  HARDWARE_PROCUREMENT: t('ec.organization.serviceProvider.scope.hardwareProcurement'),
  INTEGRATION: t('ec.organization.serviceProvider.scope.integration'),
}))

const projectStatusMap = computed(() => buildStatusOptionMap(statusDictionaries.value.projectStatus, locale.value))
const paymentStatusMap = computed(() => buildStatusOptionMap(statusDictionaries.value.paymentStatus, locale.value))

const personCards = computed(() => detailRecord.value.persons || [])
const softwareCards = computed(() => detailRecord.value.informationSystems || [])
const hardwareCards = computed(() => detailRecord.value.hardwareAssets || [])
const serviceProviderCards = computed(() => detailRecord.value.serviceProviders || [])

const getProjectTypeLabel = (value) => projectTypeMap.value[value] || value || '-'
const getSystemTypeLabel = (value) => systemTypeMap.value[value] || value || '-'

const formatScopes = (value) => {
  if (!Array.isArray(value) || value.length === 0) return '-'
  return value.map((item) => cooperationScopeMap.value[item] || item).join(' / ')
}

const openDocument = (item) => {
  if (!item?.fileUrl) return
  window.open(item.fileUrl, '_blank', 'noopener')
}

const loadDetail = async () => {
  pageLoading.value = true
  try {
    const [statusOptions, detail] = await Promise.all([
      getStatusDictionaries(),
      getProjectDetail(route.params.id),
    ])
    statusDictionaries.value = statusOptions
    detailRecord.value = detail
  } catch (error) {
    ElMessage.error(error.message || t('ec.project.message.detailFailed'))
  } finally {
    pageLoading.value = false
  }
}

onMounted(loadDetail)
</script>

<style lang="scss" scoped>
.project-detail-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.project-page-card {
  padding: 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #edf0f6;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(28, 53, 91, 0.05);
}

.project-detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #edf0f6;
}

.project-detail-title {
  color: #151b26;
  font-size: 22px;
  font-weight: 700;
}

.project-detail-subtitle {
  margin-top: 6px;
  color: #858a99;
}

.project-detail-section + .project-detail-section {
  margin-top: 24px;
}

.project-section-title {
  color: #151b26;
  font-size: 16px;
  font-weight: 700;
}

.project-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 20px;
  margin-top: 20px;
}

.project-detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  > span {
    color: #858a99;
    font-size: 13px;
  }

  > strong {
    color: #151b26;
    word-break: break-all;
  }
}

.is-span-2 {
  grid-column: 1 / -1;
}

.project-document-table {
  margin-top: 20px;

  :deep(th.el-table__cell) {
    background: #f1f4fb;
  }
}

.project-detail-hint {
  margin-top: 8px;
  color: #858a99;
  font-size: 12px;
  line-height: 20px;
}

.project-detail-remark {
  margin-top: 16px;
  color: #444a57;
  line-height: 24px;
  white-space: pre-wrap;
}

.project-resource-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.project-resource-card {
  padding: 18px;
  background: #f8f9fc;
  border: 1px solid #edf0f6;
  border-radius: 14px;
}

.project-resource-card__head {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
}

.project-resource-card__title {
  color: #151b26;
  font-size: 16px;
  font-weight: 700;
}

.project-resource-card__tag {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  padding: 2px 8px;
  color: #2e5ef0;
  font-size: 12px;
  line-height: 20px;
  background: #ebf0ff;
  border-radius: 999px;
}

.project-resource-card__meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 16px;
  margin-top: 16px;
}

.project-resource-card__meta {
  display: flex;
  flex-direction: column;
  gap: 6px;

  > span {
    color: #858a99;
    font-size: 12px;
  }

  > strong {
    color: #151b26;
    word-break: break-all;
  }
}

@media only screen and (max-width: 991px) {
  .project-page-card {
    padding: 16px;
  }

  .project-detail-grid,
  .project-resource-grid,
  .project-resource-card__meta-grid {
    grid-template-columns: 1fr;
  }

  .is-span-2 {
    grid-column: auto;
  }
}
</style>
