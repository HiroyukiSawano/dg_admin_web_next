<template>
  <figma-resource-page
    active-tab="serviceProviders"
    :title="t('ec.organization.serviceProvider.page.detailTitle')"
    :description="t('ec.organization.serviceProvider.page.detailDescription')"
    back-path="/organization/service-providers"
    :breadcrumbs="[
      'ec.organization.figma.tab.serviceProviders',
      'ec.organization.serviceProvider.page.basicDetail',
    ]"
  >
    <div v-loading="pageLoading" class="organization-detail-page">
      <section class="organization-detail-panel">
        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.organization.serviceProvider.section.basicInfo') }}</div>
          <div class="organization-detail-grid">
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.serviceProvider.form.codeLabel') }}</span>
              <strong>{{ detailRecord.serviceProvider?.code || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.serviceProvider.form.nameLabel') }}</span>
              <strong>{{ detailRecord.serviceProvider?.name || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.serviceProvider.form.unifiedSocialCreditCode') }}</span>
              <strong>{{ detailRecord.serviceProvider?.unifiedSocialCreditCode || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.serviceProvider.form.shortName') }}</span>
              <strong>{{ detailRecord.serviceProvider?.shortName || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.serviceProvider.form.enterpriseNature') }}</span>
              <strong>{{ getEnterpriseNatureLabel(detailRecord.serviceProvider?.enterpriseNature) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.serviceProvider.table.cooperationScopes') }}</span>
              <strong>{{ cooperationScopeText }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.serviceProvider.form.vendorLevel') }}</span>
              <strong>{{ getVendorLevelLabel(detailRecord.serviceProvider?.vendorLevel) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.serviceProvider.form.businessContact') }}</span>
              <strong>{{ detailRecord.serviceProvider?.businessContact || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.serviceProvider.form.businessPhone') }}</span>
              <strong>{{ detailRecord.serviceProvider?.businessPhone || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.serviceProvider.form.score') }}</span>
              <div v-if="hasScore" class="organization-detail-rating" :aria-label="`${normalizedScore}`">
                <div class="organization-detail-rating__base">
                  <img v-for="index in 5" :key="`base-${index}`" :src="starOutline" alt="" />
                </div>
                <div class="organization-detail-rating__fill" :style="{ width: `${scoreWidth}%` }">
                  <img v-for="index in 5" :key="`fill-${index}`" :src="starFilled" alt="" />
                </div>
              </div>
              <strong v-else>-</strong>
            </div>
            <div class="organization-detail-item is-span-full">
              <span>{{ t('ec.organization.serviceProvider.detail.logo') }}</span>
              <div class="organization-detail-logo">
                <img :src="logoPreviewUrl" alt="logo" />
              </div>
            </div>
          </div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.organization.serviceProvider.relations.persons') }}</div>
          <div v-if="personCards.length > 0" class="organization-resource-grid">
            <service-provider-relation-card
              v-for="item in personCards"
              :key="`person-${item.id}`"
              :title="item.title"
              :badge="item.badge"
              :badge-tone="item.badgeTone"
              :icon-src="item.iconSrc"
              :meta-items="item.metaItems"
              avatar
            />
          </div>
          <div v-else class="organization-resource-empty">{{ t('ec.organization.common.noRelation') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.organization.serviceProvider.relations.softwareAssets') }}</div>
          <div v-if="softwareCards.length > 0" class="organization-resource-grid">
            <service-provider-relation-card
              v-for="item in softwareCards"
              :key="`software-${item.id}`"
              :title="item.title"
              :badge="item.badge"
              :badge-tone="item.badgeTone"
              :icon-src="item.iconSrc"
              :meta-items="item.metaItems"
            />
          </div>
          <div v-else class="organization-resource-empty">{{ t('ec.organization.common.noRelation') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.organization.serviceProvider.relations.hardwareAssets') }}</div>
          <div v-if="hardwareCards.length > 0" class="organization-resource-grid">
            <service-provider-relation-card
              v-for="item in hardwareCards"
              :key="`hardware-${item.id}`"
              :title="item.title"
              :icon-src="item.iconSrc"
              :meta-items="item.metaItems"
            />
          </div>
          <div v-else class="organization-resource-empty">{{ t('ec.organization.common.noRelation') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.organization.serviceProvider.relations.projects') }}</div>
          <div v-if="projectCards.length > 0" class="organization-resource-grid">
            <service-provider-relation-card
              v-for="item in projectCards"
              :key="`project-${item.id}`"
              :title="item.title"
              :badge="item.badge"
              :badge-tone="item.badgeTone"
              :icon-src="item.iconSrc"
              :meta-items="item.metaItems"
            />
          </div>
          <div v-else class="organization-resource-empty">{{ t('ec.organization.common.noRelation') }}</div>
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
import { getServiceProviderDetail } from '@/services/modules/organizationService'
import { buildStatusOptionMap } from '@/utils/statusDictionary'
import { getStatusLabel } from './helpers'
import FigmaResourcePage from './components/FigmaResourcePage.vue'
import ServiceProviderRelationCard from './components/ServiceProviderRelationCard.vue'
import logoPlaceholder from '@/assets/images/organization/service-provider-detail/logo-placeholder.png'
import starOutline from '@/assets/images/organization/service-provider-detail/star-outline.svg'
import starFilled from '@/assets/images/organization/service-provider-detail/star-filled.svg'
import personAvatarMale from '@/assets/images/organization/service-provider-detail/person-avatar-male.png'
import personAvatarFemale from '@/assets/images/organization/service-provider-detail/person-avatar-female.png'
import softwareSupport from '@/assets/images/organization/service-provider-detail/software-support.png'
import softwareOffice from '@/assets/images/organization/service-provider-detail/software-office.png'
import softwareExternal from '@/assets/images/organization/service-provider-detail/software-external.png'
import hardwareServer from '@/assets/images/organization/service-provider-detail/hardware-server.png'
import hardwareTerminal from '@/assets/images/organization/service-provider-detail/hardware-terminal.png'
import projectFolder from '@/assets/images/organization/service-provider-detail/project-folder.png'

defineOptions({ name: 'OrganizationServiceProviderDetailPage' })

const { t, locale } = useI18n()
const route = useRoute()

const pageLoading = ref(false)
const statusDictionaries = ref({})
const detailRecord = ref({
  serviceProvider: null,
  hardwareAssetIds: [],
  informationSystemIds: [],
  personIds: [],
  projectIds: [],
  persons: [],
  informationSystems: [],
  hardwareAssets: [],
  projects: [],
})

const projectStatusMap = computed(() => {
  return buildStatusOptionMap(statusDictionaries.value.projectStatus, locale.value)
})

const enterpriseNatureMap = computed(() => ({
  CENTRAL_STATE_OWNED: t('ec.organization.serviceProvider.enterpriseNature.centralStateOwned'),
  STATE_OWNED: t('ec.organization.serviceProvider.enterpriseNature.stateOwned'),
  PRIVATE: t('ec.organization.serviceProvider.enterpriseNature.private'),
  PUBLIC_INSTITUTION: t('ec.organization.serviceProvider.enterpriseNature.publicInstitution'),
}))

const vendorLevelMap = computed(() => ({
  STRATEGIC_PARTNER: t('ec.organization.serviceProvider.vendorLevel.strategicPartner'),
  CORE_SUPPLIER: t('ec.organization.serviceProvider.vendorLevel.coreSupplier'),
  GENERAL_SUPPLIER: t('ec.organization.serviceProvider.vendorLevel.generalSupplier'),
}))

const cooperationScopeLabelMap = computed(() => ({
  SOFTWARE_DEVELOPMENT: t('ec.organization.serviceProvider.scope.softwareDevelopment'),
  OPERATIONS_SERVICE: t('ec.organization.serviceProvider.scope.operationsService'),
  HARDWARE_PROCUREMENT: t('ec.organization.serviceProvider.scope.hardwareProcurement'),
  INTEGRATION: t('ec.organization.serviceProvider.scope.integration'),
}))

const systemTypeOptions = computed(() => [
  { value: 'EXTERNAL_SERVICE', label: t('ec.software.type.externalService') },
  { value: 'INTERNAL_OFFICE', label: t('ec.software.type.internalOffice') },
  { value: 'SUPPORT_SYSTEM', label: t('ec.software.type.supportSystem') },
  { value: 'BASIC_SUPPORT', label: t('ec.software.type.basicSupport') },
  { value: 'DATABASE_SOFTWARE', label: t('ec.software.type.databaseSoftware') },
  { value: 'SECURITY_SOFTWARE', label: t('ec.software.type.securitySoftware') },
])

const projectTypeOptions = computed(() => [
  { value: 'NEW_BUILD', label: t('ec.project.type.newBuild') },
  { value: 'SOFTWARE_UPGRADE', label: t('ec.project.type.softwareUpgrade') },
  { value: 'OPS_PROJECT', label: t('ec.project.type.opsProject') },
  { value: 'SERVICE_PURCHASE', label: t('ec.project.type.servicePurchase') },
  { value: 'HARDWARE_PURCHASE', label: t('ec.project.type.hardwarePurchase') },
  { value: 'INTEGRATION_PROJECT', label: t('ec.project.type.integrationProject') },
  { value: 'UPGRADE', label: t('ec.project.type.softwareUpgrade') },
  { value: 'OPERATION', label: t('ec.project.type.opsProject') },
])

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

const cooperationScopeText = computed(() => {
  const scopes = Array.isArray(detailRecord.value.serviceProvider?.cooperationScopes)
    ? detailRecord.value.serviceProvider.cooperationScopes
    : []
  if (scopes.length === 0) {
    return '-'
  }
  return scopes.map((item) => cooperationScopeLabelMap.value[item] || item).join('、')
})

const logoPreviewUrl = computed(() => {
  return detailRecord.value.serviceProvider?.logoUrl || logoPlaceholder
})

const parsedScore = computed(() => Number.parseFloat(detailRecord.value.serviceProvider?.score))

const hasScore = computed(() => Number.isFinite(parsedScore.value))

const normalizedScore = computed(() => {
  return Math.max(0, Math.min(5, parsedScore.value || 0))
})

const scoreWidth = computed(() => {
  return (normalizedScore.value / 5) * 100
})

const personCards = computed(() => {
  const persons = Array.isArray(detailRecord.value.persons) ? detailRecord.value.persons : []
  return persons.map((item, index) => ({
    id: item.id,
    title: item.name || '-',
    badge: item.relationLabel || '',
    badgeTone: getPersonBadgeTone(item.relationLabel),
    iconSrc: item.photoUrl || (index % 2 === 1 ? personAvatarFemale : personAvatarMale),
    metaItems: [
      { label: t('ec.organization.serviceProvider.detail.card.mobile'), value: item.mobile || '-' },
      { label: t('ec.organization.serviceProvider.detail.card.employeeNo'), value: item.employeeNo || '-' },
    ],
  }))
})

const softwareCards = computed(() => {
  const systems = Array.isArray(detailRecord.value.informationSystems) ? detailRecord.value.informationSystems : []
  return systems.map((item) => ({
    id: item.id,
    title: item.name || '-',
    badge: getSystemTypeLabel(item.systemType),
    badgeTone: getSoftwareBadgeTone(item.systemType),
    iconSrc: getSoftwareIcon(item.systemType),
    metaItems: [
      { label: t('ec.organization.serviceProvider.detail.card.code'), value: item.code || '-' },
      { label: t('ec.organization.serviceProvider.detail.card.type'), value: getSystemTypeLabel(item.systemType) },
      { label: t('ec.organization.serviceProvider.detail.card.vendor'), value: item.serviceProviderName || '-' },
      { label: t('ec.organization.serviceProvider.detail.card.owner'), value: item.ownerName || '-' },
    ],
  }))
})

const hardwareCards = computed(() => {
  const hardwareAssets = Array.isArray(detailRecord.value.hardwareAssets) ? detailRecord.value.hardwareAssets : []
  return hardwareAssets.map((item) => ({
    id: item.id,
    title: item.name || '-',
    iconSrc: getHardwareIcon(item.hardwareCategory),
    metaItems: [
      { label: t('ec.organization.serviceProvider.detail.card.code'), value: item.code || '-' },
      { label: t('ec.organization.serviceProvider.detail.card.ip'), value: item.managementIp || '-' },
      { label: t('ec.organization.serviceProvider.detail.card.cpu'), value: item.cpuModel || '-' },
      { label: t('ec.organization.serviceProvider.detail.card.memory'), value: formatMemory(item.memoryGb) },
      { label: t('ec.organization.serviceProvider.detail.card.serviceProvider'), value: item.serviceProviderName || '-' },
      { label: t('ec.organization.serviceProvider.detail.card.owner'), value: item.ownerName || '-' },
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
    iconSrc: projectFolder,
    metaItems: [
      { label: t('ec.organization.serviceProvider.detail.card.code'), value: item.code || '-' },
      { label: t('ec.organization.serviceProvider.detail.card.type'), value: getProjectTypeLabel(item.projectType) },
      { label: t('ec.organization.serviceProvider.detail.card.status'), value: getProjectStatusLabel(item.projectStatus) },
      { label: t('ec.organization.serviceProvider.detail.card.owner'), value: item.ownerName || '-' },
    ],
  }))
})

const findLabel = (options, value) => {
  const matched = options.find((item) => item.value === value)
  return matched?.label || value || '-'
}

const getEnterpriseNatureLabel = (value) => {
  return enterpriseNatureMap.value[value] || value || '-'
}

const getVendorLevelLabel = (value) => {
  return vendorLevelMap.value[value] || value || '-'
}

const getSystemTypeLabel = (value) => findLabel(systemTypeOptions.value, value)

const getProjectTypeLabel = (value) => findLabel(projectTypeOptions.value, value)

const getProjectStatusLabel = (value) => getStatusLabel(value, projectStatusMap.value)

const formatMemory = (value) => {
  return value == null || value === '' ? '-' : `${value}GB`
}

const getPersonBadgeTone = (label) => {
  return label && label.includes('负责人') ? 'blue' : 'gray'
}

const getSoftwareBadgeTone = (systemType) => {
  if (systemType === 'SUPPORT_SYSTEM' || systemType === 'BASIC_SUPPORT') {
    return 'green'
  }
  if (systemType === 'INTERNAL_OFFICE' || systemType === 'DATABASE_SOFTWARE') {
    return 'orange'
  }
  return 'blue'
}

const getSoftwareIcon = (systemType) => {
  if (systemType === 'INTERNAL_OFFICE' || systemType === 'DATABASE_SOFTWARE') {
    return softwareOffice
  }
  if (systemType === 'EXTERNAL_SERVICE') {
    return softwareExternal
  }
  return softwareSupport
}

const getHardwareIcon = (hardwareCategory) => {
  return hardwareCategory === 'SERVER' ? hardwareServer : hardwareTerminal
}

const getProjectBadgeLabel = (projectType) => {
  return projectBadgeMap.value[projectType] || getProjectTypeLabel(projectType)
}

const loadDetail = async () => {
  pageLoading.value = true
  try {
    const [statusOptions, detail] = await Promise.all([
      getStatusDictionaries(),
      getServiceProviderDetail(route.params.id),
    ])
    statusDictionaries.value = statusOptions
    detailRecord.value = {
      hardwareAssetIds: [],
      informationSystemIds: [],
      personIds: [],
      projectIds: [],
      persons: [],
      informationSystems: [],
      hardwareAssets: [],
      projects: [],
      ...detail,
    }
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.serviceProvider.message.detailFailed'))
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

.organization-detail-logo {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  overflow: hidden;
  border-radius: 4px;

  img {
    display: block;
    width: 32px;
    height: 32px;
    object-fit: contain;
  }
}

.organization-detail-rating {
  position: relative;
  display: inline-flex;
  align-items: center;
  line-height: 1;
}

.organization-detail-rating__base,
.organization-detail-rating__fill {
  display: inline-flex;
  gap: 4px;

  img {
    display: block;
    width: 16px;
    height: 16px;
  }
}

.organization-detail-rating__fill {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
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
