<template>
  <figma-resource-page
    active-tab="persons"
    :title="t('ec.organization.person.page.detailTitle')"
    :description="t('ec.organization.person.page.detailDescription')"
    back-path="/organization/persons"
    :breadcrumbs="[
      'ec.organization.figma.tab.persons',
      '基本详情',
    ]"
  >
    <div v-loading="pageLoading" class="organization-detail-page">
      <section class="organization-detail-panel">
        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.organization.person.section.basicInfo') }}</div>
          <div class="organization-detail-grid">
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.common.name') }}</span>
              <strong>{{ detailRecord.person?.name || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.person.table.gender') }}</span>
              <strong>{{ detailRecord.person?.gender || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.person.table.employeeNo') }}</span>
              <strong>{{ detailRecord.person?.employeeNo || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.person.table.idCardNo') }}</span>
              <strong>{{ detailRecord.person?.idCardNo || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.person.table.mobile') }}</span>
              <strong>{{ detailRecord.person?.mobile || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.person.table.serviceProviderName') }}</span>
              <strong>{{ detailRecord.person?.serviceProviderName || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.person.form.personType') }}</span>
              <strong>{{ getPersonTypeLabel(detailRecord.person?.personType) }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.organization.person.form.hasOpsAccountDetail') }}</span>
              <strong>{{ getBooleanLabel(detailRecord.person?.hasOpsAccount) }}</strong>
            </div>
          </div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.organization.person.relations.softwareAssets') }}</div>
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
          <div v-else class="organization-resource-empty">{{ t('ec.organization.common.noRelation') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.organization.person.relations.hardwareAssets') }}</div>
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
          <div v-else class="organization-resource-empty">{{ t('ec.organization.common.noRelation') }}</div>
        </section>

        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.organization.person.relations.projects') }}</div>
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
import { buildStatusOptionMap } from '@/utils/statusDictionary'
import { getPersonDetail } from '@/services/modules/organizationService'
import { getStatusLabel } from './helpers'
import FigmaResourcePage from './components/FigmaResourcePage.vue'
import ServiceProviderRelationCard from './components/ServiceProviderRelationCard.vue'
import {
  getHardwareIcon,
  getHardwareIconVariant,
  getProjectIcon,
  getProjectIconVariant,
  getSoftwareBadgeTone,
  getSoftwareIcon,
  getSoftwareIconVariant,
} from './components/relationVisuals'

defineOptions({ name: 'OrganizationPersonDetailPage' })

const { t, locale } = useI18n()
const route = useRoute()
const pageLoading = ref(false)
const statusDictionaries = ref({})
const detailRecord = ref({
  person: null,
  informationSystems: [],
  hardwareAssets: [],
  projects: [],
})

const projectStatusMap = computed(() => {
  return buildStatusOptionMap(statusDictionaries.value.projectStatus, locale.value)
})

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

const personTypeMap = computed(() => ({
  DEV: t('ec.organization.person.figma.type.dev'),
  OPS: t('ec.organization.person.figma.type.ops'),
}))

const findLabel = (options, value) => {
  const matched = options.find((item) => item.value === value)
  return matched?.label || value || '-'
}

const getPersonTypeLabel = (value) => {
  return personTypeMap.value[value] || value || '-'
}

const getBooleanLabel = (value) => {
  return value ? t('ec.organization.person.boolean.yes') : t('ec.organization.person.boolean.no')
}

const getSystemTypeLabel = (value) => findLabel(systemTypeOptions.value, value)

const getProjectTypeLabel = (value) => findLabel(projectTypeOptions.value, value)

const getProjectStatusLabel = (value) => getStatusLabel(value, projectStatusMap.value)

const getProjectBadgeLabel = (projectType) => {
  return projectBadgeMap.value[projectType] || getProjectTypeLabel(projectType)
}

const formatMemory = (value) => {
  return value == null || value === '' ? '-' : `${value}GB`
}

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
      { label: t('ec.organization.person.detail.card.code'), value: item.code || '-' },
      { label: t('ec.organization.person.detail.card.type'), value: getSystemTypeLabel(item.systemType) },
      { label: t('ec.organization.person.detail.card.vendor'), value: item.serviceProviderName || '-' },
      { label: t('ec.organization.person.detail.card.owner'), value: item.ownerName || '-' },
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
      { label: t('ec.organization.person.detail.card.code'), value: item.code || '-' },
      { label: t('ec.organization.person.detail.card.ip'), value: item.managementIp || '-' },
      { label: t('ec.organization.person.detail.card.cpu'), value: item.cpuModel || '-' },
      { label: t('ec.organization.person.detail.card.memory'), value: formatMemory(item.memoryGb) },
      { label: t('ec.organization.person.detail.card.vendor'), value: item.serviceProviderName || '-' },
      { label: t('ec.organization.person.detail.card.owner'), value: item.ownerName || '-' },
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
      { label: t('ec.organization.person.detail.card.code'), value: item.code || '-' },
      { label: t('ec.organization.person.detail.card.type'), value: getProjectTypeLabel(item.projectType) },
      { label: t('ec.organization.person.detail.card.status'), value: getProjectStatusLabel(item.projectStatus) },
      { label: t('ec.organization.person.detail.card.owner'), value: item.ownerName || '-' },
    ],
  }))
})

const loadDetail = async () => {
  pageLoading.value = true
  try {
    const [statusOptions, detail] = await Promise.all([
      getStatusDictionaries(),
      getPersonDetail(route.params.id),
    ])
    statusDictionaries.value = statusOptions
    detailRecord.value = detail
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.person.message.detailFailed'))
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
