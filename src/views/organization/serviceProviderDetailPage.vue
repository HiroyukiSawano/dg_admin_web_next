<template>
  <figma-resource-page
    active-tab="serviceProviders"
    :title="t('ec.organization.serviceProvider.page.detailTitle')"
    :description="t('ec.organization.serviceProvider.page.detailDescription')"
    back-path="/organization/service-providers"
  >
    <template #actions>
      <el-button @click="router.push(`/organization/service-providers/${route.params.id}/relations`)">
        {{ t('ec.organization.common.relations') }}
      </el-button>
      <el-button type="primary" @click="router.push(`/organization/service-providers/${route.params.id}/edit`)">
        {{ t('ec.organization.common.edit') }}
      </el-button>
    </template>

    <div v-loading="pageLoading" class="organization-detail-page">
      <section class="organization-page-card">
        <div class="organization-detail-header">
          <div>
            <div class="organization-detail-title">{{ detailRecord.serviceProvider?.name || '-' }}</div>
            <div class="organization-detail-subtitle">{{ detailRecord.serviceProvider?.code || '-' }}</div>
          </div>
          <div class="organization-detail-head-actions">
            <el-tag :type="getStatusTagType(detailRecord.serviceProvider?.status, serviceProviderStatusMap)">
              {{ getStatusLabel(detailRecord.serviceProvider?.status, serviceProviderStatusMap) }}
            </el-tag>
            <figma-rating-stars :value="detailRecord.serviceProvider?.score" />
          </div>
        </div>

        <div class="organization-detail-grid">
          <div class="organization-detail-item">
            <span>{{ t('ec.organization.common.name') }}</span>
            <strong>{{ detailRecord.serviceProvider?.name || '-' }}</strong>
          </div>
          <div class="organization-detail-item">
            <span>{{ t('ec.organization.serviceProvider.form.shortName') }}</span>
            <strong>{{ detailRecord.serviceProvider?.shortName || '-' }}</strong>
          </div>
          <div class="organization-detail-item">
            <span>{{ t('ec.organization.serviceProvider.table.unifiedSocialCreditCode') }}</span>
            <strong>{{ detailRecord.serviceProvider?.unifiedSocialCreditCode || '-' }}</strong>
          </div>
          <div class="organization-detail-item">
            <span>{{ t('ec.organization.serviceProvider.form.enterpriseNature') }}</span>
            <strong>{{ getEnterpriseNatureLabel(detailRecord.serviceProvider?.enterpriseNature) }}</strong>
          </div>
          <div class="organization-detail-item is-span-2">
            <span>{{ t('ec.organization.serviceProvider.table.cooperationScopes') }}</span>
            <div class="organization-detail-tags">
              <span
                v-for="scope in normalizeScopeValues(detailRecord.serviceProvider?.cooperationScopes)"
                :key="scope"
                class="organization-detail-tag"
                :class="`is-${getScopeVisual(scope).tone}`"
              >
                {{ getScopeVisual(scope).label }}
              </span>
              <strong v-if="normalizeScopeValues(detailRecord.serviceProvider?.cooperationScopes).length === 0">-</strong>
            </div>
          </div>
          <div class="organization-detail-item">
            <span>{{ t('ec.organization.serviceProvider.form.vendorLevel') }}</span>
            <strong>{{ getVendorLevelLabel(detailRecord.serviceProvider?.vendorLevel) }}</strong>
          </div>
          <div class="organization-detail-item">
            <span>{{ t('ec.organization.serviceProvider.table.score') }}</span>
            <strong>{{ detailRecord.serviceProvider?.score || '-' }}</strong>
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
            <span>{{ t('ec.organization.common.createdAt') }}</span>
            <strong>{{ formatDateTime(detailRecord.serviceProvider?.createdAt) }}</strong>
          </div>
          <div class="organization-detail-item">
            <span>{{ t('ec.organization.common.updatedAt') }}</span>
            <strong>{{ formatDateTime(detailRecord.serviceProvider?.updatedAt) }}</strong>
          </div>
          <div class="organization-detail-item is-span-2">
            <span>{{ t('ec.organization.serviceProvider.table.remark') }}</span>
            <strong>{{ detailRecord.serviceProvider?.remark || '-' }}</strong>
          </div>
        </div>

        <div v-if="detailRecord.serviceProvider?.logoUrl" class="organization-detail-logo">
          <div class="organization-detail-logo__label">{{ t('ec.organization.serviceProvider.form.logoPreview') }}</div>
          <img :src="detailRecord.serviceProvider.logoUrl" alt="logo" />
        </div>
      </section>

      <section class="organization-page-card">
        <div class="organization-section-title">{{ t('ec.organization.common.relations') }}</div>
        <div class="organization-relations-grid">
          <div class="organization-relation-block">
            <span>{{ t('ec.organization.serviceProvider.relations.hardwareAssets') }}</span>
            <div class="organization-detail-tags">
              <el-tag v-for="item in hardwareRelationLabels" :key="`hardware-${item}`">{{ item }}</el-tag>
              <el-empty v-if="hardwareRelationLabels.length === 0" :image-size="56" :description="t('ec.organization.common.noRelation')" />
            </div>
          </div>
          <div class="organization-relation-block">
            <span>{{ t('ec.organization.serviceProvider.relations.informationSystems') }}</span>
            <div class="organization-detail-tags">
              <el-tag v-for="item in informationSystemRelationLabels" :key="`system-${item}`">{{ item }}</el-tag>
              <el-empty v-if="informationSystemRelationLabels.length === 0" :image-size="56" :description="t('ec.organization.common.noRelation')" />
            </div>
          </div>
          <div class="organization-relation-block">
            <span>{{ t('ec.organization.serviceProvider.relations.persons') }}</span>
            <div class="organization-detail-tags">
              <el-tag v-for="item in personRelationLabels" :key="`person-${item}`">{{ item }}</el-tag>
              <el-empty v-if="personRelationLabels.length === 0" :image-size="56" :description="t('ec.organization.common.noRelation')" />
            </div>
          </div>
          <div class="organization-relation-block">
            <span>{{ t('ec.organization.serviceProvider.relations.projects') }}</span>
            <div class="organization-detail-tags">
              <el-tag v-for="item in projectRelationLabels" :key="`project-${item}`">{{ item }}</el-tag>
              <el-empty v-if="projectRelationLabels.length === 0" :image-size="56" :description="t('ec.organization.common.noRelation')" />
            </div>
          </div>
        </div>
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
import {
  getOrganizationHardwareOptions,
  getOrganizationInformationSystemOptions,
  getOrganizationPersonOptions,
  getOrganizationProjectOptions,
  getServiceProviderDetail,
} from '@/services/modules/organizationService'
import { buildListLabelMap, formatDateTime, getStatusLabel, getStatusTagType, mapIdsToLabels } from './helpers'
import FigmaRatingStars from './components/FigmaRatingStars.vue'
import FigmaResourcePage from './components/FigmaResourcePage.vue'

defineOptions({ name: 'OrganizationServiceProviderDetailPage' })

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const pageLoading = ref(false)
const detailRecord = ref({
  serviceProvider: null,
  hardwareAssetIds: [],
  informationSystemIds: [],
  personIds: [],
  projectIds: [],
})
const statusDictionaries = ref({})
const hardwareOptions = ref([])
const informationSystemOptions = ref([])
const personOptions = ref([])
const projectOptions = ref([])

const serviceProviderStatusMap = computed(() => {
  return buildStatusOptionMap(statusDictionaries.value.serviceProviderStatus, locale.value)
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

const cooperationScopeVisualMap = computed(() => ({
  SOFTWARE_DEVELOPMENT: { label: t('ec.organization.serviceProvider.scope.softwareDevelopment'), tone: 'blue' },
  OPERATIONS_SERVICE: { label: t('ec.organization.serviceProvider.scope.operationsService'), tone: 'green' },
  HARDWARE_PROCUREMENT: { label: t('ec.organization.serviceProvider.scope.hardwareProcurement'), tone: 'orange' },
  INTEGRATION: { label: t('ec.organization.serviceProvider.scope.integration'), tone: 'violet' },
}))

const hardwareRelationLabels = computed(() => mapIdsToLabels(detailRecord.value.hardwareAssetIds, buildListLabelMap(hardwareOptions.value, 'displayLabel')))
const informationSystemRelationLabels = computed(() => mapIdsToLabels(detailRecord.value.informationSystemIds, buildListLabelMap(informationSystemOptions.value, 'displayLabel')))
const personRelationLabels = computed(() => mapIdsToLabels(detailRecord.value.personIds, buildListLabelMap(personOptions.value, 'displayLabel')))
const projectRelationLabels = computed(() => mapIdsToLabels(detailRecord.value.projectIds, buildListLabelMap(projectOptions.value, 'displayLabel')))

const normalizeScopeValues = (value) => {
  return Array.isArray(value) ? value : []
}

const getScopeVisual = (value) => {
  return cooperationScopeVisualMap.value[value] || { label: value || '-', tone: 'blue' }
}

const getEnterpriseNatureLabel = (value) => {
  return enterpriseNatureMap.value[value] || value || '-'
}

const getVendorLevelLabel = (value) => {
  return vendorLevelMap.value[value] || value || '-'
}

const buildDisplayLabel = (primary, secondary) => {
  return [primary, secondary].filter(Boolean).join(' / ') || '-'
}

const loadSupportOptions = async () => {
  const [hardwareAssets, informationSystems, persons, projects] = await Promise.all([
    getOrganizationHardwareOptions(),
    getOrganizationInformationSystemOptions(),
    getOrganizationPersonOptions(),
    getOrganizationProjectOptions(),
  ])

  hardwareOptions.value = hardwareAssets.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.assetCode, item.assetName),
  }))
  informationSystemOptions.value = informationSystems.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.code, item.name),
  }))
  personOptions.value = persons.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.name, item.employeeNo),
  }))
  projectOptions.value = projects.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.code, item.name),
  }))
}

const loadDetail = async () => {
  pageLoading.value = true
  try {
    const [statusOptions, detail] = await Promise.all([
      getStatusDictionaries(),
      getServiceProviderDetail(route.params.id),
      loadSupportOptions(),
    ])
    statusDictionaries.value = statusOptions
    detailRecord.value = detail
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
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.organization-page-card {
  padding: 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #edf0f6;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(28, 53, 91, 0.05);
}

.organization-detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #edf0f6;
}

.organization-detail-title {
  color: #151b26;
  font-size: 22px;
  font-weight: 700;
}

.organization-detail-subtitle {
  margin-top: 6px;
  color: #858a99;
}

.organization-detail-head-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.organization-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 20px;
  margin-top: 24px;
}

.organization-detail-item {
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

.organization-detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}

.organization-detail-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 52px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 20px;

  &.is-blue {
    background: #ebf0ff;
    color: #2e5ef0;
  }

  &.is-green {
    background: #dff6e2;
    color: #36b23e;
  }

  &.is-orange {
    background: #fff2e7;
    color: #ff8a24;
  }

  &.is-violet {
    background: #f2ebff;
    color: #8e54ff;
  }
}

.organization-detail-logo {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #edf0f6;

  img {
    display: block;
    max-width: 180px;
    max-height: 96px;
    padding: 12px;
    margin-top: 12px;
    background: #fff;
    border: 1px solid #edf0f6;
    border-radius: 12px;
    object-fit: contain;
  }
}

.organization-detail-logo__label,
.organization-section-title {
  color: #151b26;
  font-size: 16px;
  font-weight: 600;
}

.organization-relations-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 16px;
}

.organization-relation-block {
  display: flex;
  flex-direction: column;
  gap: 12px;
  min-height: 180px;
  padding: 18px;
  background: #f8f9fc;
  border: 1px solid #edf0f6;
  border-radius: 14px;

  > span {
    color: #151b26;
    font-size: 14px;
    font-weight: 600;
  }
}

@media only screen and (max-width: 991px) {
  .organization-page-card {
    padding: 16px;
  }

  .organization-detail-header,
  .organization-detail-head-actions {
    flex-direction: column;
    align-items: flex-start;
  }

  .organization-detail-grid,
  .organization-relations-grid {
    grid-template-columns: 1fr;
  }

  .is-span-2 {
    grid-column: auto;
  }
}
</style>
