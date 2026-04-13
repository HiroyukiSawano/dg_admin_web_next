<template>
  <figma-resource-page
    hide-tabs
    active-tab="projects"
    :title="t('ec.project.page.detailTitle')"
    :description="t('ec.project.page.detailDescription')"
    back-path="/project/projects"
    :breadcrumbs="[
      '项目资源',
      '基本详情',
    ]"
  >
    <div v-loading="pageLoading" class="organization-detail-page">
      <section class="organization-detail-panel">
        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.project.section.basic') }}</div>
          <div class="organization-detail-grid">
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.code') }}</span>
              <strong>{{ detailRecord.project?.code || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.name') }}</span>
              <strong>{{ detailRecord.project?.name || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.projectType') }}</span>
              <strong>{{ getProjectTypeLabel(detailRecord.project?.projectType) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.approvalBatchNo') }}</span>
              <strong>{{ detailRecord.project?.approvalBatchNo || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.projectBudget') }}</span>
              <strong>{{ formatAmount(detailRecord.project?.projectBudget) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.contractAmount') }}</span>
              <strong>{{ formatAmount(detailRecord.project?.contractAmount) }}</strong>
            </div>
          </div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.project.section.owner') }}</div>
          <div class="organization-detail-grid">
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.ownerName') }}</span>
              <strong>{{ detailRecord.project?.ownerName || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.ownerPhone') }}</span>
              <strong>{{ detailRecord.project?.ownerPhone || '-' }}</strong>
            </div>
          </div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.project.section.period') }}</div>
          <div class="organization-detail-grid">
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.approvalDate') }}</span>
              <strong>{{ formatDate(detailRecord.project?.approvalDate) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.startDate') }}</span>
              <strong>{{ formatDate(detailRecord.project?.startDate) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.initialDeliveryDate') }}</span>
              <strong>{{ formatDate(detailRecord.project?.initialDeliveryDate) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.endDate') }}</span>
              <strong>{{ formatDate(detailRecord.project?.endDate) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.warrantyEndDate') }}</span>
              <strong>{{ formatDate(detailRecord.project?.warrantyEndDate) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.stage') }}</span>
              <strong>{{ detailRecord.project?.stage || '-' }}</strong>
            </div>
          </div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.project.section.payment') }}</div>
          <div class="organization-detail-grid">
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.paymentCycleName') }}</span>
              <strong>{{ detailRecord.project?.paymentCycleName || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.paymentRatio') }}</span>
              <strong>{{ detailRecord.project?.paymentRatio == null ? '-' : `${detailRecord.project.paymentRatio}%` }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.paymentAmount') }}</span>
              <strong>{{ formatAmount(detailRecord.project?.paymentAmount) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.plannedPaymentDate') }}</span>
              <strong>{{ formatDate(detailRecord.project?.plannedPaymentDate) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.actualPaymentDate') }}</span>
              <strong>{{ formatDate(detailRecord.project?.actualPaymentDate) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.paymentStatus') }}</span>
              <strong>{{ getStatusLabel(detailRecord.project?.paymentStatus, paymentStatusMap) }}</strong>
            </div>
          </div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.project.section.documents') }}</div>
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

        <section v-if="detailRecord.project?.remark" class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.project.common.remark') }}</div>
          <div class="project-detail-remark">{{ detailRecord.project?.remark || '-' }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.project.detail.persons') }}</div>
          <div v-if="personCards.length > 0" class="organization-resource-grid">
            <service-provider-relation-card
              v-for="item in personCards"
              :key="`person-${item.id}`"
              :title="item.title"
              :badge="item.badge"
              :badge-tone="item.badgeTone"
              :icon-src="item.iconSrc"
              :avatar-variant="item.avatarVariant"
              :meta-items="item.metaItems"
              avatar
            />
          </div>
          <div v-else class="organization-resource-empty">{{ t('ec.project.common.noRelation') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.project.detail.informationSystems') }}</div>
          <div v-if="softwareCards.length > 0" class="organization-resource-grid">
            <service-provider-relation-card
              v-for="item in softwareCards"
              :key="`software-${item.id}`"
              :title="item.title"
              :badge="item.badge"
              :badge-tone="item.badgeTone"
              :icon-src="item.iconSrc"
              :icon-variant="item.iconVariant"
              :meta-items="item.metaItems"
            />
          </div>
          <div v-else class="organization-resource-empty">{{ t('ec.project.common.noRelation') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.project.detail.hardwareAssets') }}</div>
          <div v-if="hardwareCards.length > 0" class="organization-resource-grid">
            <service-provider-relation-card
              v-for="item in hardwareCards"
              :key="`hardware-${item.id}`"
              :title="item.title"
              :icon-src="item.iconSrc"
              :icon-variant="item.iconVariant"
              :meta-items="item.metaItems"
            />
          </div>
          <div v-else class="organization-resource-empty">{{ t('ec.project.common.noRelation') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.project.detail.serviceProviders') }}</div>
          <div v-if="serviceProviderCards.length > 0" class="organization-resource-grid">
            <service-provider-vendor-card
              v-for="item in serviceProviderCards"
              :key="`provider-${item.id}`"
              :title="item.title"
              :icon-src="item.iconSrc"
              :icon-variant="item.iconVariant"
              :badges="item.badges"
              :meta-items="item.metaItems"
            />
          </div>
          <div v-else class="organization-resource-empty">{{ t('ec.project.common.noRelation') }}</div>
        </section>
      </section>
    </div>
  </figma-resource-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getStatusDictionaries } from '@/services/modules/dictionaryService'
import { buildStatusOptionMap } from '@/utils/statusDictionary'
import { getProjectDetail } from '@/services/modules/projectService'
import { formatAmount, formatDate, formatDateTime, formatFileSize, getStatusLabel } from './helpers'
import FigmaResourcePage from '@/views/organization/components/FigmaResourcePage.vue'
import ServiceProviderRelationCard from '@/views/organization/components/ServiceProviderRelationCard.vue'
import ServiceProviderVendorCard from '@/views/organization/components/ServiceProviderVendorCard.vue'
import {
  getHardwareIcon,
  getHardwareIconVariant,
  getProviderIcon,
  getProviderIconVariant,
  getSoftwareBadgeTone,
  getSoftwareIcon,
  getSoftwareIconVariant,
  resolvePersonAvatar,
  resolvePersonAvatarVariant,
} from '@/views/organization/components/relationVisuals'

defineOptions({ name: 'ProjectDetailPage' })

const { t, locale } = useI18n()
const route = useRoute()
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
  UPGRADE: t('ec.project.type.softwareUpgrade'),
  OPERATION: t('ec.project.type.opsProject'),
}))

const projectBadgeMap = computed(() => ({
  NEW_BUILD: t('ec.organization.serviceProvider.projectBadge.newBuild'),
  SOFTWARE_UPGRADE: t('ec.organization.serviceProvider.projectBadge.softwareUpgrade'),
  OPS_PROJECT: t('ec.organization.serviceProvider.projectBadge.opsProject'),
  SERVICE_PURCHASE: t('ec.organization.serviceProvider.projectBadge.servicePurchase'),
  HARDWARE_PURCHASE: t('ec.organization.serviceProvider.projectBadge.hardwarePurchase'),
  INTEGRATION_PROJECT: t('ec.organization.serviceProvider.projectBadge.integrationProject'),
  UPGRADE: t('ec.organization.serviceProvider.projectBadge.softwareUpgrade'),
  OPERATION: t('ec.organization.serviceProvider.projectBadge.opsProject'),
}))

const systemTypeMap = computed(() => ({
  EXTERNAL_SERVICE: t('ec.software.type.externalService'),
  INTERNAL_OFFICE: t('ec.software.type.internalOffice'),
  SUPPORT_SYSTEM: t('ec.software.type.supportSystem'),
  BASIC_SUPPORT: t('ec.software.type.basicSupport'),
  DATABASE_SOFTWARE: t('ec.software.type.databaseSoftware'),
  SECURITY_SOFTWARE: t('ec.software.type.securitySoftware'),
}))

const cooperationScopeMap = computed(() => ({
  SOFTWARE_DEVELOPMENT: t('ec.organization.serviceProvider.scope.softwareDevelopment'),
  OPERATIONS_SERVICE: t('ec.organization.serviceProvider.scope.operationsService'),
  HARDWARE_PROCUREMENT: t('ec.organization.serviceProvider.scope.hardwareProcurement'),
  INTEGRATION: t('ec.organization.serviceProvider.scope.integration'),
}))

const vendorLevelMap = computed(() => ({
  STRATEGIC_PARTNER: t('ec.organization.serviceProvider.vendorLevel.strategicPartner'),
  CORE_SUPPLIER: t('ec.organization.serviceProvider.vendorLevel.coreSupplier'),
  GENERAL_SUPPLIER: t('ec.organization.serviceProvider.vendorLevel.generalSupplier'),
}))

const providerCardLabels = computed(() => {
  if (locale.value.startsWith('zh')) {
    return {
      type: '类型',
      score: '评分等级',
      owner: '负责人',
      phone: '联系电话',
    }
  }

  return {
    type: 'Type',
    score: 'Rating',
    owner: 'Owner',
    phone: 'Phone',
  }
})

const projectStatusMap = computed(() => buildStatusOptionMap(statusDictionaries.value.projectStatus, locale.value))
const paymentStatusMap = computed(() => buildStatusOptionMap(statusDictionaries.value.paymentStatus, locale.value))

const getProjectTypeLabel = (value) => projectTypeMap.value[value] || value || '-'
const getSystemTypeLabel = (value) => systemTypeMap.value[value] || value || '-'

const getProjectBadgeLabel = (projectType) => {
  return projectBadgeMap.value[projectType] || getProjectTypeLabel(projectType)
}

const getProviderBadges = (scopes) => {
  return (Array.isArray(scopes) ? scopes : [])
    .map((item) => cooperationScopeMap.value[item] || item)
    .filter(Boolean)
    .slice(0, 2)
}

const getProviderTypeLabel = (item) => {
  if (item?.vendorLevel && vendorLevelMap.value[item.vendorLevel]) {
    return vendorLevelMap.value[item.vendorLevel]
  }

  const [primaryScope] = getProviderBadges(item?.cooperationScopes)
  return primaryScope || '-'
}

const formatMemory = (value) => {
  return value == null || value === '' ? '-' : `${value}GB`
}

const openDocument = (item) => {
  if (!item?.fileUrl) return
  window.open(item.fileUrl, '_blank', 'noopener')
}

const personCards = computed(() => {
  const persons = Array.isArray(detailRecord.value.persons) ? detailRecord.value.persons : []
  return persons.map((item, index) => {
    const isOwner = item.name && item.name === detailRecord.value.project?.ownerName
    return {
      id: item.id,
      title: item.name || '-',
      badge: isOwner ? '项目负责人' : '关联人员',
      badgeTone: isOwner ? 'blue' : 'gray',
      iconSrc: resolvePersonAvatar(item, index),
      avatarVariant: resolvePersonAvatarVariant(item, index),
      metaItems: [
        { label: t('ec.project.card.mobile'), value: item.mobile || '-' },
        { label: t('ec.project.card.employeeNo'), value: item.employeeNo || '-' },
      ],
    }
  })
})

const softwareCards = computed(() => {
  const systems = Array.isArray(detailRecord.value.informationSystems) ? detailRecord.value.informationSystems : []
  return systems.map((item) => ({
    id: item.id,
    title: item.name || '-',
    badge: getSystemTypeLabel(item.systemType),
    badgeTone: getSoftwareBadgeTone(item.systemType),
    iconSrc: getSoftwareIcon(item.systemType),
    iconVariant: getSoftwareIconVariant(item.systemType),
    metaItems: [
      { label: t('ec.project.card.code'), value: item.code || '-' },
      { label: t('ec.project.card.type'), value: getSystemTypeLabel(item.systemType) },
      { label: t('ec.project.card.vendor'), value: item.serviceProviderName || '-' },
      { label: t('ec.project.card.owner'), value: item.ownerName || '-' },
    ],
  }))
})

const hardwareCards = computed(() => {
  const hardwareAssets = Array.isArray(detailRecord.value.hardwareAssets) ? detailRecord.value.hardwareAssets : []
  return hardwareAssets.map((item) => ({
    id: item.id,
    title: item.name || '-',
    iconSrc: getHardwareIcon(item.hardwareCategory),
    iconVariant: getHardwareIconVariant(item.hardwareCategory),
    metaItems: [
      { label: t('ec.project.card.code'), value: item.code || '-' },
      { label: t('ec.project.card.ip'), value: item.managementIp || '-' },
      { label: t('ec.project.card.cpu'), value: item.cpuModel || '-' },
      { label: t('ec.project.card.memory'), value: formatMemory(item.memoryGb) },
      { label: t('ec.project.card.vendor'), value: item.serviceProviderName || '-' },
      { label: t('ec.project.card.owner'), value: item.ownerName || '-' },
    ],
  }))
})

const serviceProviderCards = computed(() => {
  const providers = Array.isArray(detailRecord.value.serviceProviders) ? detailRecord.value.serviceProviders : []
  return providers.map((item) => ({
    id: item.id,
    title: item.name || '-',
    iconSrc: getProviderIcon(item.logoUrl),
    iconVariant: getProviderIconVariant(item.logoUrl),
    badges: getProviderBadges(item.cooperationScopes),
    metaItems: [
      { label: t('ec.project.card.code'), value: item.code || '-' },
      { label: t('ec.project.card.creditCode'), value: item.unifiedSocialCreditCode || '-' },
      { label: providerCardLabels.value.type, value: getProviderTypeLabel(item) },
      { label: providerCardLabels.value.score, value: item.score, type: 'rating' },
      { label: providerCardLabels.value.owner, value: item.businessContact || '-' },
      { label: providerCardLabels.value.phone, value: item.businessPhone || '-' },
    ],
  }))
})

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
.organization-detail-page {
  width: 100%;
}

.organization-detail-panel {
  padding: 16px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #edf0f6;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(28, 53, 91, 0.05);
}

.organization-detail-section + .organization-detail-section {
  margin-top: 28px;
}

.organization-section-title {
  color: #151b26;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.organization-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 24px;
  margin-top: 8px;
}

.organization-detail-item {
  display: flex;
  align-items: center;
  min-height: 32px;
  color: #444a57;
  font-size: 14px;
  line-height: 22px;

  > span {
    flex: 0 0 120px;
    color: #858a99;
  }

  > strong {
    flex: 1;
    min-width: 0;
    font-weight: 400;
    word-break: break-all;
  }
}

.project-detail-hint {
  margin-top: 8px;
  color: #858a99;
  font-size: 12px;
  line-height: 20px;
}

.project-document-table {
  margin-top: 8px;

  :deep(th.el-table__cell) {
    background: #f1f4fb;
  }
}

.project-detail-remark {
  margin-top: 8px;
  color: #444a57;
  line-height: 24px;
  white-space: pre-wrap;
}

.organization-resource-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
  margin-top: 8px;
}

.organization-resource-empty {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 80px;
  margin-top: 8px;
  color: #999faa;
  font-size: 14px;
  line-height: 22px;
  background: linear-gradient(115deg, #ffffff 41.12%, #f9faff 97.72%);
  border: 1px solid #e5e7eb;
  border-radius: 4px;
}

@media only screen and (max-width: 1199px) {
  .organization-resource-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media only screen and (max-width: 991px) {
  .organization-detail-panel {
    padding: 16px 12px;
  }

  .organization-detail-grid,
  .organization-resource-grid {
    grid-template-columns: 1fr;
  }

  .organization-detail-item {
    align-items: flex-start;

    > span {
      flex-basis: 104px;
    }
  }
}
</style>
