<template>
  <figma-resource-page
    hide-tabs
    :title="t('ec.software.page.detailTitle')"
    :description="t('ec.software.page.detailDescription')"
    back-path="/software/informationSystems"
    :breadcrumbs="[
      '软件资产',
      '基本详情',
    ]"
  >
    <div v-loading="pageLoading" class="organization-detail-page">
      <section class="organization-detail-panel">
        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.software.section.basic') }}</div>
          <div class="organization-detail-grid">
            <div class="organization-detail-item">
              <span>{{ t('ec.software.common.code') }}</span>
              <strong>{{ detailRecord.informationSystem?.code || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.software.common.name') }}</span>
              <strong>{{ detailRecord.informationSystem?.name || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.software.common.systemType') }}</span>
              <strong>{{ getSystemTypeLabel(detailRecord.informationSystem?.systemType) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.software.common.versionNo') }}</span>
              <strong>{{ detailRecord.informationSystem?.versionNo || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.software.common.deploymentArchitecture') }}</span>
              <strong>{{ getDeploymentArchitectureLabel(detailRecord.informationSystem?.deploymentArchitecture) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.software.common.owner') }}</span>
              <strong>{{ detailRecord.informationSystem?.ownerName || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.software.common.contactPhone') }}</span>
              <strong>{{ detailRecord.informationSystem?.contactPhone || '-' }}</strong>
            </div>
          </div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.software.detail.persons') }}</div>
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
          <div v-else class="organization-resource-empty">{{ t('ec.software.common.noRelation') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.software.detail.serviceProviders') }}</div>
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
          <div v-else class="organization-resource-empty">{{ t('ec.software.common.noRelation') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.software.detail.hardwareAssets') }}</div>
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
          <div v-else class="organization-resource-empty">{{ t('ec.software.common.noRelation') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.software.detail.middlewares') }}</div>
          <div v-if="middlewareCards.length > 0" class="organization-resource-grid">
            <service-provider-relation-card
              v-for="item in middlewareCards"
              :key="`middleware-${item.id}`"
              :title="item.title"
              :badge="item.badge"
              badge-tone="blue"
              :icon-src="item.iconSrc"
              :icon-variant="item.iconVariant"
              :meta-items="item.metaItems"
            />
          </div>
          <div v-else class="organization-resource-empty">{{ t('ec.software.common.noRelation') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.software.detail.databases') }}</div>
          <div v-if="databaseCards.length > 0" class="organization-resource-grid">
            <service-provider-relation-card
              v-for="item in databaseCards"
              :key="`database-${item.id}`"
              :title="item.title"
              :badge="item.badge"
              badge-tone="blue"
              :icon-src="item.iconSrc"
              :icon-variant="item.iconVariant"
              :meta-items="item.metaItems"
            />
          </div>
          <div v-else class="organization-resource-empty">{{ t('ec.software.common.noRelation') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.software.detail.projects') }}</div>
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
          <div v-else class="organization-resource-empty">{{ t('ec.software.common.noRelation') }}</div>
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
import { getInformationSystemDetail } from '@/services/modules/softwareService'
import FigmaResourcePage from '@/views/organization/components/FigmaResourcePage.vue'
import ServiceProviderRelationCard from '@/views/organization/components/ServiceProviderRelationCard.vue'
import ServiceProviderVendorCard from '@/views/organization/components/ServiceProviderVendorCard.vue'
import {
  getHardwareIcon,
  getHardwareIconVariant,
  getProjectIcon,
  getProjectIconVariant,
  getProviderIcon,
  getProviderIconVariant,
  getSoftwareIcon,
  getSoftwareIconVariant,
  resolvePersonAvatar,
  resolvePersonAvatarVariant,
} from '@/views/organization/components/relationVisuals'

defineOptions({ name: 'SoftwareDetailPage' })

const { t, locale } = useI18n()
const route = useRoute()
const pageLoading = ref(false)
const statusDictionaries = ref({})
const detailRecord = ref({
  informationSystem: null,
  serviceProviderIds: [],
  personIds: [],
  hardwareAssetIds: [],
  projectIds: [],
  middlewareIds: [],
  databaseIds: [],
  serviceProviders: [],
  persons: [],
  hardwareAssets: [],
  projects: [],
  middlewares: [],
  databases: [],
})

const systemTypeMap = computed(() => ({
  EXTERNAL_SERVICE: t('ec.software.type.externalService'),
  INTERNAL_OFFICE: t('ec.software.type.internalOffice'),
  DATABASE_SOFTWARE: t('ec.software.type.databaseSoftware'),
  BASIC_SUPPORT: t('ec.software.type.basicSupport'),
  SECURITY_SOFTWARE: t('ec.software.type.securitySoftware'),
  SUPPORT_SYSTEM: t('ec.software.type.supportSystem'),
}))

const deploymentArchitectureMap = computed(() => ({
  SINGLE: t('ec.software.deployment.single'),
  CLUSTER: t('ec.software.deployment.cluster'),
  CONTAINERIZED: t('ec.software.deployment.containerized'),
}))

const middlewareTypeMap = computed(() => ({
  TOMCAT: t('ec.middleware.type.tomcat'),
  NGINX: t('ec.middleware.type.nginx'),
  REDIS: t('ec.middleware.type.redis'),
  KAFKA: t('ec.middleware.type.kafka'),
  ROCKETMQ: t('ec.middleware.type.rocketmq'),
  ELASTICSEARCH: t('ec.middleware.type.elasticsearch'),
  NACOS: t('ec.middleware.type.nacos'),
  OTHER: t('ec.middleware.type.other'),
}))

const databaseTypeMap = computed(() => ({
  MYSQL: t('ec.database.type.mysql'),
  ORACLE: t('ec.database.type.oracle'),
  POSTGRESQL: t('ec.database.type.postgresql'),
  SQLSERVER: t('ec.database.type.sqlserver'),
  GAUSSDB: t('ec.database.type.gaussdb'),
  DAMENG: t('ec.database.type.dameng'),
  OTHER: t('ec.database.type.other'),
}))

const commonStatusMap = computed(() => ({
  ACTIVE: t('ec.middleware.status.active'),
  INACTIVE: t('ec.middleware.status.inactive'),
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

const getSystemTypeLabel = (value) => systemTypeMap.value[value] || value || '-'
const getDeploymentArchitectureLabel = (value) => deploymentArchitectureMap.value[value] || value || '-'
const getProjectTypeLabel = (value) => projectTypeMap.value[value] || value || '-'
const getMiddlewareTypeLabel = (value) => middlewareTypeMap.value[value] || value || '-'
const getDatabaseTypeLabel = (value) => databaseTypeMap.value[value] || value || '-'
const getCommonStatusLabel = (value) => commonStatusMap.value[value] || value || '-'

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

const personCards = computed(() => {
  const persons = Array.isArray(detailRecord.value.persons) ? detailRecord.value.persons : []
  return persons.map((item, index) => {
    const isOwner = item.name && item.name === detailRecord.value.informationSystem?.ownerName
    return {
      id: item.id,
      title: item.name || '-',
      badge: isOwner ? '软件负责人' : '关联人员',
      badgeTone: isOwner ? 'blue' : 'gray',
      iconSrc: resolvePersonAvatar(item, index),
      avatarVariant: resolvePersonAvatarVariant(item, index),
      metaItems: [
        { label: t('ec.software.card.mobile'), value: item.mobile || '-' },
        { label: t('ec.software.card.employeeNo'), value: item.employeeNo || '-' },
      ],
    }
  })
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
      { label: t('ec.software.common.code'), value: item.code || '-' },
      { label: t('ec.software.card.creditCode'), value: item.unifiedSocialCreditCode || '-' },
      { label: providerCardLabels.value.type, value: getProviderTypeLabel(item) },
      { label: providerCardLabels.value.score, value: item.score, type: 'rating' },
      { label: providerCardLabels.value.owner, value: item.businessContact || '-' },
      { label: providerCardLabels.value.phone, value: item.businessPhone || '-' },
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
      { label: t('ec.software.card.assetCode'), value: item.code || '-' },
      { label: t('ec.software.card.managementIp'), value: item.managementIp || '-' },
      { label: t('ec.software.card.cpuModel'), value: item.cpuModel || '-' },
      { label: t('ec.software.card.memoryGb'), value: formatMemory(item.memoryGb) },
    ],
  }))
})

const middlewareCards = computed(() => {
  const middlewares = Array.isArray(detailRecord.value.middlewares) ? detailRecord.value.middlewares : []
  return middlewares.map((item) => ({
    id: item.id,
    title: item.middlewareName || '-',
    badge: getMiddlewareTypeLabel(item.middlewareType),
    iconSrc: getSoftwareIcon('BASIC_SUPPORT'),
    iconVariant: getSoftwareIconVariant('BASIC_SUPPORT'),
    metaItems: [
      { label: t('ec.middleware.common.code'), value: item.middlewareCode || '-' },
      { label: t('ec.middleware.common.version'), value: item.version || '-' },
      { label: t('ec.middleware.common.status'), value: getCommonStatusLabel(item.status) },
    ],
  }))
})

const databaseCards = computed(() => {
  const databases = Array.isArray(detailRecord.value.databases) ? detailRecord.value.databases : []
  return databases.map((item) => ({
    id: item.id,
    title: item.databaseName || '-',
    badge: getDatabaseTypeLabel(item.databaseType),
    iconSrc: getSoftwareIcon('DATABASE_SOFTWARE'),
    iconVariant: getSoftwareIconVariant('DATABASE_SOFTWARE'),
    metaItems: [
      { label: t('ec.database.common.code'), value: item.databaseCode || '-' },
      { label: t('ec.database.common.version'), value: item.version || '-' },
      { label: t('ec.database.common.status'), value: getCommonStatusLabel(item.status) },
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
      { label: t('ec.software.common.code'), value: item.code || '-' },
      { label: t('ec.software.card.projectType'), value: getProjectTypeLabel(item.projectType) },
      { label: t('ec.software.card.projectStatus'), value: getStatusLabel(item.projectStatus, projectStatusMap.value) },
      { label: t('ec.software.card.ownerName'), value: item.ownerName || '-' },
    ],
  }))
})

const loadDetail = async () => {
  pageLoading.value = true
  try {
    const [statusOptions, detail] = await Promise.all([
      getStatusDictionaries(),
      getInformationSystemDetail(route.params.id),
    ])
    statusDictionaries.value = statusOptions
    detailRecord.value = detail
  } catch (error) {
    ElMessage.error(error.message || t('ec.software.message.detailFailed'))
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
