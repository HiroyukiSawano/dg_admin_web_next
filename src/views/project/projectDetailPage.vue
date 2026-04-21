<template>
  <figma-resource-page
    hide-tabs
    active-tab="projects"
    :title="t('ec.project.page.detailTitle')"
    :description="t('ec.project.page.detailDescription')"
    back-path="/project/projects"
    :breadcrumbs="[
      '项目资产',
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
              <span>{{ detailText.projectType }}</span>
              <strong>{{ getProjectTypeLabel(detailRecord.project?.projectType) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.project.common.approvalBatchNo') }}</span>
              <strong>{{ detailRecord.project?.approvalBatchNo || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ detailText.projectBudget }}</span>
              <strong>{{ formatDetailAmount(detailRecord.project?.projectBudget) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ detailText.contractAmount }}</span>
              <strong>{{ formatDetailAmount(detailRecord.project?.contractAmount) }}</strong>
            </div>
          </div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.project.section.owner') }}</div>
          <div class="organization-detail-grid">
            <div class="organization-detail-item">
              <span>{{ detailText.ownerName }}</span>
              <strong>{{ detailRecord.project?.ownerName || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ detailText.ownerPhone }}</span>
              <strong>{{ detailRecord.project?.ownerPhone || '-' }}</strong>
            </div>
          </div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.project.section.period') }}</div>
          <div v-if="projectPeriods.length > 0" class="project-timeline">
            <div v-for="item in projectPeriods" :key="item.key" class="project-timeline-item">
              <div class="project-timeline-item__dot"></div>
              <div class="project-timeline-item__content">
                <div class="project-timeline-item__title">{{ item.stageName || '-' }}</div>
                <div class="project-timeline-item__meta">
                  <span>{{ t('ec.project.timeline.plannedTime') }}：<strong>{{ formatTimelineDate(item.plannedDate) }}</strong></span>
                  <span>{{ t('ec.project.timeline.actualTime') }}：<strong>{{ formatTimelineDate(item.actualDate) }}</strong></span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="organization-resource-empty">{{ t('ec.project.common.noData') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ detailText.paymentSection }}</div>
          <div v-if="paymentCycles.length > 0" class="project-timeline project-timeline--payment">
            <div
              v-for="item in paymentCycles"
              :key="item.key"
              class="project-timeline-item"
              :class="{ 'is-future': !item.actualPaymentDate }"
            >
              <div class="project-timeline-item__dot"></div>
              <div class="project-timeline-item__content">
                <div class="project-payment-title">
                  <span class="project-payment-status" :class="{ 'is-future': !item.actualPaymentDate }">
                    {{ getPaymentCycleStatusLabel(item) }}
                  </span>
                  <span class="project-timeline-item__title">{{ item.stageName || '-' }}</span>
                </div>
                <div class="project-payment-meta">
                  <span>{{ t('ec.project.form.stageNameLabel') }}：<strong>{{ item.stageName || '-' }}</strong></span>
                  <span>{{ detailText.paymentRatio }}：<strong>{{ formatPaymentRatio(item.paymentRatio) }}</strong></span>
                  <span>{{ detailText.paymentAmount }}：<strong>{{ formatPaymentAmount(item.paymentAmount) }}</strong></span>
                  <span>{{ t('ec.project.common.plannedPaymentDate') }}：<strong>{{ formatTimelineDate(item.plannedPaymentDate) }}</strong></span>
                  <span>{{ t('ec.project.common.actualPaymentDate') }}：<strong>{{ formatTimelineDate(item.actualPaymentDate) }}</strong></span>
                </div>
              </div>
            </div>
          </div>
          <div v-else class="organization-resource-empty">{{ t('ec.project.common.noData') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.project.section.documents') }}</div>
          <el-table :data="detailRecord.documents" class="project-document-table">
            <el-table-column prop="originalName" :label="t('ec.project.document.name')" min-width="299" show-overflow-tooltip />
            <el-table-column :label="t('ec.project.document.size')" width="299">
              <template #default="{ row }">
                {{ formatProjectFileSize(row.fileSize) }}
              </template>
            </el-table-column>
            <el-table-column :label="t('ec.project.document.uploadedAt')" width="299">
              <template #default="{ row }">
                {{ formatDate(row.uploadedAt) }}
              </template>
            </el-table-column>
            <el-table-column :label="t('ec.project.common.actions')" width="116">
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
import { getProjectDetail } from '@/services/modules/projectService'
import { formatDate } from './helpers'
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
const detailRecord = ref({
  project: null,
  projectPeriods: [],
  paymentCycles: [],
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

const getProjectTypeLabel = (value) => projectTypeMap.value[value] || value || '-'
const getSystemTypeLabel = (value) => systemTypeMap.value[value] || value || '-'

const isZhLocale = computed(() => locale.value.startsWith('zh'))

const detailText = computed(() => {
  if (isZhLocale.value) {
    return {
      projectType: '类型',
      projectBudget: '项目预算',
      contractAmount: '项目合同金额',
      ownerName: '姓名',
      ownerPhone: '联系电话',
      paymentSection: '项目支付周期',
      paymentCycleName: '周期名称',
      paymentRatio: '付款比例',
      paymentAmount: '付款金额',
      paymentStatus: '状态',
      personPhone: '电话',
      hardwareIp: 'IP',
      softwareVendor: '开发商',
    }
  }

  return {
    projectType: t('ec.project.common.projectType'),
    projectBudget: t('ec.project.common.projectBudget'),
    contractAmount: t('ec.project.common.contractAmount'),
    ownerName: t('ec.project.common.ownerName'),
    ownerPhone: t('ec.project.common.ownerPhone'),
    paymentSection: t('ec.project.section.payment'),
    paymentCycleName: t('ec.project.common.paymentCycleName'),
    paymentRatio: t('ec.project.common.paymentRatio'),
    paymentAmount: t('ec.project.common.paymentAmount'),
    paymentStatus: t('ec.project.common.paymentStatus'),
    personPhone: t('ec.project.card.mobile'),
    hardwareIp: t('ec.project.card.ip'),
    softwareVendor: t('ec.project.card.vendor'),
  }
})

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

const formatDetailAmount = (value) => {
  if (value == null || value === '') return '-'
  const raw = String(value)
  if (raw.includes('万')) return raw
  const numeric = Number(value)
  if (Number.isNaN(numeric)) return raw
  const formatted = Number.isInteger(numeric) ? String(numeric) : String(Number(numeric.toFixed(2)))
  return isZhLocale.value ? `${formatted}万元` : formatted
}

const formatTimelineDate = (value) => {
  return value ? formatDate(value) : '-'
}

const formatPaymentRatio = (value) => {
  return value == null || value === '' ? '-' : `${value}%`
}

const formatPaymentAmount = (value) => {
  return value == null || value === '' ? '-' : String(value)
}

const projectPeriods = computed(() => {
  const periods = Array.isArray(detailRecord.value.projectPeriods) ? detailRecord.value.projectPeriods : []
  return periods.map((item, index) => ({
    ...item,
    key: item.id || `period-${index}`,
  }))
})

const paymentCycles = computed(() => {
  const cycles = Array.isArray(detailRecord.value.paymentCycles) ? detailRecord.value.paymentCycles : []
  return cycles.map((item, index) => ({
    ...item,
    key: item.id || `payment-${index}`,
  }))
})

const getPaymentCycleStatusLabel = (item) => {
  return item?.actualPaymentDate
    ? t('ec.project.timeline.completed')
    : t('ec.project.timeline.inProgress')
}

const formatProjectFileSize = (value) => {
  const size = Number(value || 0)
  if (!size) return '-'
  if (size >= 1024 * 1024) return `${Number((size / 1024 / 1024).toFixed(2))}mb`
  if (size >= 1024) return `${Number((size / 1024).toFixed(2))}kb`
  return `${size}b`
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
        { label: detailText.value.personPhone, value: item.mobile || '-' },
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
      { label: detailText.value.softwareVendor, value: item.serviceProviderName || '-' },
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
      { label: detailText.value.hardwareIp, value: item.managementIp || '-' },
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
    const detail = await getProjectDetail(route.params.id)
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
  background: transparent;
}

.organization-detail-section + .organization-detail-section {
  margin-top: 32px;
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
  gap: 16px;
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

.project-timeline {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-top: 8px;
  padding-left: 4px;
}

.project-timeline-item {
  position: relative;
  min-height: 24px;
  padding-left: 34px;

  &::before {
    position: absolute;
    top: 10px;
    bottom: -34px;
    left: 8px;
    width: 2px;
    background: #f3f4f6;
    border-radius: 999px;
    content: '';
  }

  &:last-child::before {
    display: none;
  }

  &.is-future {
    .project-timeline-item__dot {
      background: #c4c6cc;
    }
  }
}

.project-timeline-item__dot {
  position: absolute;
  top: 6px;
  left: 4px;
  width: 10px;
  height: 10px;
  background: #2e5ef0;
  border-radius: 999px;
}

.project-timeline-item__content {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.project-timeline-item__title {
  color: #151b26;
  font-size: 14px;
  font-weight: 600;
  line-height: 22px;
}

.project-timeline-item__meta,
.project-payment-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 24px;
  color: #858a99;
  font-size: 14px;
  line-height: 22px;

  strong {
    color: #444a57;
    font-weight: 400;
  }
}

.project-payment-title {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.project-payment-status {
  display: inline-flex;
  align-items: center;
  height: 20px;
  padding: 0 6px;
  color: #155dfc;
  font-size: 12px;
  line-height: 20px;
  background: #eff6ff;
  border-radius: 4px;

  &.is-future {
    color: #858a99;
    background: #edeef3;
  }
}

.project-document-table {
  margin-top: 8px;

  :deep(.el-table) {
    --el-table-border-color: #edeef3;
    --el-table-header-bg-color: #f5f6f9;
    --el-table-row-hover-bg-color: #f8faff;
  }

  :deep(.el-table__inner-wrapper::before) {
    display: none;
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

.project-detail-remark {
  margin-top: 8px;
  color: #444a57;
  line-height: 24px;
  white-space: pre-wrap;
}

.organization-resource-grid {
  display: grid;
  grid-template-columns: repeat(3, 326px);
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
