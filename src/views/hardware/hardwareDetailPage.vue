<template>
  <figma-resource-page
    hide-tabs
    :title="t('ec.hardware.page.detailTitle')"
    :description="t('ec.hardware.page.detailDescription')"
    back-path="/hardware/hardwareAssets"
    :breadcrumbs="[
      '硬件资产',
      '基本详情',
    ]"
  >
    <div v-loading="pageLoading" class="organization-detail-page">
      <section class="organization-detail-panel">
        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.hardware.section.basic') }}</div>
          <div class="organization-detail-grid">
            <div class="organization-detail-item">
              <span>{{ t('ec.hardware.common.assetCode') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.assetCode || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.hardware.common.hardwareIp') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.hardwareIp || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.hardware.common.assetName') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.assetName || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.hardware.common.hardwareModel') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.hardwareModel || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.hardware.common.hardwareBrand') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.hardwareBrand || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.hardware.common.hardwareType') }}</span>
              <strong>{{ getHardwareTypeLabel(detailRecord.hardwareAsset?.hardwareType) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.hardware.common.physicalLocation') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.physicalLocation || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.hardware.common.networkEnvironment') }}</span>
              <strong>{{ getNetworkEnvironmentLabel(detailRecord.hardwareAsset?.networkEnvironment) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.hardware.common.operatingSystem') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.operatingSystem || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.hardware.common.status') }}</span>
              <strong>{{ hardwareStatusVisual(detailRecord.hardwareAsset?.hardwareStatus).label }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.hardware.common.purchaseDate') }}</span>
              <strong>{{ formatDate(detailRecord.hardwareAsset?.purchaseDate) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.hardware.common.owner') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.ownerName || '-' }}</strong>
            </div>
            <div class="organization-detail-item is-span-full">
              <span>{{ t('ec.hardware.common.contactPhone') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.contactPhone || '-' }}</strong>
            </div>
          </div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.hardware.detail.persons') }}</div>
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
          <div v-else class="organization-resource-empty">{{ t('ec.hardware.common.noRelation') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.hardware.detail.softwareAssets') }}</div>
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
          <div v-else class="organization-resource-empty">{{ t('ec.hardware.common.noRelation') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.hardware.detail.projects') }}</div>
          <div v-if="projectCards.length > 0" class="organization-resource-grid">
            <service-provider-relation-card
              v-for="item in projectCards"
              :key="`project-${item.id}`"
              :title="item.title"
              :badge="item.badge"
              :badge-tone="item.badgeTone"
              :icon-src="item.iconSrc"
              :icon-variant="item.iconVariant"
              :meta-items="item.metaItems"
            />
          </div>
          <div v-else class="organization-resource-empty">{{ t('ec.hardware.common.noRelation') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.hardware.detail.serviceProviders') }}</div>
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
          <div v-else class="organization-resource-empty">{{ t('ec.hardware.common.noRelation') }}</div>
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
import { buildStatusOptionMap, getStatusLabel } from '@/utils/statusDictionary'
import { getHardwareAssetDetail } from '@/services/modules/hardwareService'
import { formatDate } from './helpers'
import FigmaResourcePage from '@/views/organization/components/FigmaResourcePage.vue'
import ServiceProviderRelationCard from '@/views/organization/components/ServiceProviderRelationCard.vue'
import ServiceProviderVendorCard from '@/views/organization/components/ServiceProviderVendorCard.vue'
import {
  getProjectIcon,
  getProjectIconVariant,
  getProviderIcon,
  getProviderIconVariant,
  getSoftwareBadgeTone,
  getSoftwareIcon,
  getSoftwareIconVariant,
  resolvePersonAvatar,
  resolvePersonAvatarVariant,
} from '@/views/organization/components/relationVisuals'

defineOptions({ name: 'HardwareDetailPage' })

const { t, locale } = useI18n()
const route = useRoute()
const pageLoading = ref(false)
const statusDictionaries = ref({})
const detailRecord = ref({
  hardwareAsset: null,
  persons: [],
  softwareAssets: [],
  projects: [],
  serviceProviders: [],
})

const hardwareTypeMap = computed(() => ({
  SERVER: t('ec.hardware.type.server'),
  NETWORK_DEVICE: t('ec.hardware.type.networkDevice'),
  TERMINAL_DEVICE: t('ec.hardware.type.terminalDevice'),
  PERIPHERAL: t('ec.hardware.type.peripheral'),
}))

const hardwareStatusMap = computed(() => ({
  RUNNING: { label: t('ec.hardware.status.running'), tone: 'success' },
  MAINTENANCE: { label: t('ec.hardware.status.maintenance'), tone: 'warning' },
  IDLE: { label: t('ec.hardware.status.idle'), tone: 'info' },
  SCRAPPED: { label: t('ec.hardware.status.scrapped'), tone: 'danger' },
}))

const networkEnvironmentMap = computed(() => ({
  EXTRANET: t('ec.hardware.networkEnvironment.extranet'),
  INTRANET: t('ec.hardware.networkEnvironment.intranet'),
  EXTRANET_INTRANET: t('ec.hardware.networkEnvironment.extranetIntranet'),
}))

const softwareTypeMap = computed(() => ({
  EXTERNAL_SERVICE: t('ec.software.type.externalService'),
  INTERNAL_OFFICE: t('ec.software.type.internalOffice'),
  DATABASE_SOFTWARE: t('ec.software.type.databaseSoftware'),
  BASIC_SUPPORT: t('ec.software.type.basicSupport'),
  SECURITY_SOFTWARE: t('ec.software.type.securitySoftware'),
  SUPPORT_SYSTEM: t('ec.software.type.supportSystem'),
}))

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

const projectStatusMap = computed(() => buildStatusOptionMap(statusDictionaries.value.projectStatus, locale.value))

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

const getHardwareTypeLabel = (value) => hardwareTypeMap.value[value] || value || '-'
const getNetworkEnvironmentLabel = (value) => networkEnvironmentMap.value[value] || value || '-'
const getSoftwareTypeLabel = (value) => softwareTypeMap.value[value] || value || '-'
const getProjectTypeLabel = (value) => projectTypeMap.value[value] || value || '-'
const getProjectBadgeLabel = (projectType) => projectBadgeMap.value[projectType] || getProjectTypeLabel(projectType)
const hardwareStatusVisual = (value) => hardwareStatusMap.value[value] || { label: value || '-', tone: 'info' }

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

const personCards = computed(() => {
  const persons = Array.isArray(detailRecord.value.persons) ? detailRecord.value.persons : []
  return persons.map((item, index) => {
    const isOwner = item.name && item.name === detailRecord.value.hardwareAsset?.ownerName
    return {
      id: item.id,
      title: item.name || '-',
      badge: isOwner ? '硬件负责人' : item.relationLabel || '关联人员',
      badgeTone: isOwner ? 'blue' : 'gray',
      iconSrc: resolvePersonAvatar(item, index),
      avatarVariant: resolvePersonAvatarVariant(item, index),
      metaItems: [
        { label: t('ec.hardware.card.mobile'), value: item.mobile || '-' },
        { label: t('ec.hardware.card.employeeNo'), value: item.employeeNo || '-' },
      ],
    }
  })
})

const softwareCards = computed(() => {
  const systems = Array.isArray(detailRecord.value.softwareAssets) ? detailRecord.value.softwareAssets : []
  return systems.map((item) => ({
    id: item.id,
    title: item.name || '-',
    badge: getSoftwareTypeLabel(item.systemType),
    badgeTone: getSoftwareBadgeTone(item.systemType),
    iconSrc: getSoftwareIcon(item.systemType),
    iconVariant: getSoftwareIconVariant(item.systemType),
    metaItems: [
      { label: t('ec.hardware.common.code'), value: item.code || '-' },
      { label: t('ec.hardware.card.softwareType'), value: getSoftwareTypeLabel(item.systemType) },
      { label: t('ec.hardware.card.serviceProviderName'), value: item.serviceProviderName || '-' },
      { label: t('ec.hardware.card.ownerName'), value: item.ownerName || '-' },
    ],
  }))
})

const projectCards = computed(() => {
  const projects = Array.isArray(detailRecord.value.projects) ? detailRecord.value.projects : []
  return projects.map((item) => ({
    id: item.id,
    title: item.name || '-',
    badge: getProjectBadgeLabel(item.projectType),
    badgeTone: 'blue',
    iconSrc: getProjectIcon(),
    iconVariant: getProjectIconVariant(),
    metaItems: [
      { label: t('ec.hardware.common.code'), value: item.code || '-' },
      { label: t('ec.hardware.card.projectType'), value: getProjectTypeLabel(item.projectType) },
      { label: t('ec.hardware.card.projectStatus'), value: getStatusLabel(item.projectStatus, projectStatusMap.value) },
      { label: t('ec.hardware.card.ownerName'), value: item.ownerName || '-' },
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
      { label: t('ec.hardware.common.code'), value: item.code || '-' },
      { label: t('ec.hardware.card.creditCode'), value: item.unifiedSocialCreditCode || '-' },
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
      getHardwareAssetDetail(route.params.id),
    ])
    statusDictionaries.value = statusOptions
    detailRecord.value = detail
  } catch (error) {
    ElMessage.error(error.message || t('ec.hardware.detail.failed'))
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

.is-span-full {
  grid-column: 1 / -1;
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

  .is-span-full {
    grid-column: auto;
  }
}
</style>
