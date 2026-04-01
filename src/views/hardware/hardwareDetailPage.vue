<template>
  <figma-resource-page
    hide-tabs
    :title="t('ec.hardware.page.detailTitle')"
    :description="t('ec.hardware.page.detailDescription')"
    back-path="/hardware/hardwareAssets"
  >
    <template #actions>
      <el-button @click="router.push(`/hardware/hardwareAssets/${route.params.id}/relations`)">
        {{ t('ec.hardware.common.relations') }}
      </el-button>
      <el-button type="primary" @click="router.push(`/hardware/hardwareAssets/${route.params.id}/edit`)">
        {{ t('ec.hardware.common.edit') }}
      </el-button>
    </template>

    <div v-loading="pageLoading" class="hardware-detail-page">
      <section class="hardware-page-card">
        <div class="hardware-detail-header">
          <div>
            <div class="hardware-detail-title">{{ detailRecord.hardwareAsset?.assetName || '-' }}</div>
            <div class="hardware-detail-subtitle">{{ detailRecord.hardwareAsset?.assetCode || '-' }}</div>
          </div>
          <span class="hardware-status-tag" :class="`is-${hardwareStatusVisual(detailRecord.hardwareAsset?.hardwareStatus).tone}`">
            {{ hardwareStatusVisual(detailRecord.hardwareAsset?.hardwareStatus).label }}
          </span>
        </div>

        <div class="hardware-detail-section">
          <div class="hardware-section-title">{{ t('ec.hardware.section.basic') }}</div>
          <div class="hardware-detail-grid">
            <div class="hardware-detail-item">
              <span>{{ t('ec.hardware.common.assetCode') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.assetCode || '-' }}</strong>
            </div>
            <div class="hardware-detail-item">
              <span>{{ t('ec.hardware.common.hardwareIp') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.hardwareIp || '-' }}</strong>
            </div>
            <div class="hardware-detail-item">
              <span>{{ t('ec.hardware.common.assetName') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.assetName || '-' }}</strong>
            </div>
            <div class="hardware-detail-item">
              <span>{{ t('ec.hardware.common.hardwareModel') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.hardwareModel || '-' }}</strong>
            </div>
            <div class="hardware-detail-item">
              <span>{{ t('ec.hardware.common.hardwareBrand') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.hardwareBrand || '-' }}</strong>
            </div>
            <div class="hardware-detail-item">
              <span>{{ t('ec.hardware.common.hardwareType') }}</span>
              <strong>{{ getHardwareTypeLabel(detailRecord.hardwareAsset?.hardwareType) }}</strong>
            </div>
            <div class="hardware-detail-item">
              <span>{{ t('ec.hardware.common.physicalLocation') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.physicalLocation || '-' }}</strong>
            </div>
            <div class="hardware-detail-item">
              <span>{{ t('ec.hardware.common.networkEnvironment') }}</span>
              <strong>{{ getNetworkEnvironmentLabel(detailRecord.hardwareAsset?.networkEnvironment) }}</strong>
            </div>
            <div class="hardware-detail-item">
              <span>{{ t('ec.hardware.common.operatingSystem') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.operatingSystem || '-' }}</strong>
            </div>
            <div class="hardware-detail-item">
              <span>{{ t('ec.hardware.common.status') }}</span>
              <strong>{{ hardwareStatusVisual(detailRecord.hardwareAsset?.hardwareStatus).label }}</strong>
            </div>
            <div class="hardware-detail-item">
              <span>{{ t('ec.hardware.common.purchaseDate') }}</span>
              <strong>{{ formatDate(detailRecord.hardwareAsset?.purchaseDate) }}</strong>
            </div>
            <div class="hardware-detail-item">
              <span>{{ t('ec.hardware.common.owner') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.ownerName || '-' }}</strong>
            </div>
            <div class="hardware-detail-item is-span-2">
              <span>{{ t('ec.hardware.common.contactPhone') }}</span>
              <strong>{{ detailRecord.hardwareAsset?.contactPhone || '-' }}</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="hardware-page-card">
        <div class="hardware-section-title">{{ t('ec.hardware.detail.persons') }}</div>
        <div v-if="detailRecord.persons.length > 0" class="hardware-resource-grid">
          <article v-for="item in detailRecord.persons" :key="`${item.id}-${item.relationType}`" class="hardware-resource-card">
            <div class="hardware-resource-card__head">
              <div class="hardware-resource-card__title">{{ item.name || '-' }}</div>
              <span class="hardware-resource-card__tag">{{ item.relationLabel || '-' }}</span>
            </div>
            <div class="hardware-resource-card__meta-grid">
              <div class="hardware-resource-card__meta">
                <span>{{ t('ec.hardware.card.employeeNo') }}</span>
                <strong>{{ item.employeeNo || '-' }}</strong>
              </div>
              <div class="hardware-resource-card__meta">
                <span>{{ t('ec.hardware.card.mobile') }}</span>
                <strong>{{ item.mobile || '-' }}</strong>
              </div>
            </div>
          </article>
        </div>
        <el-empty v-else :description="t('ec.hardware.common.noRelation')" />
      </section>

      <section class="hardware-page-card">
        <div class="hardware-section-title">{{ t('ec.hardware.detail.softwareAssets') }}</div>
        <div v-if="detailRecord.softwareAssets.length > 0" class="hardware-resource-grid">
          <article v-for="item in detailRecord.softwareAssets" :key="item.id" class="hardware-resource-card">
            <div class="hardware-resource-card__head">
              <div class="hardware-resource-card__title">{{ item.name || '-' }}</div>
              <span class="hardware-resource-card__tag is-success">{{ getSoftwareTypeLabel(item.systemType) }}</span>
            </div>
            <div class="hardware-resource-card__meta-grid">
              <div class="hardware-resource-card__meta">
                <span>{{ t('ec.hardware.common.code') }}</span>
                <strong>{{ item.code || '-' }}</strong>
              </div>
              <div class="hardware-resource-card__meta">
                <span>{{ t('ec.hardware.card.softwareType') }}</span>
                <strong>{{ getSoftwareTypeLabel(item.systemType) }}</strong>
              </div>
              <div class="hardware-resource-card__meta">
                <span>{{ t('ec.hardware.card.serviceProviderName') }}</span>
                <strong>{{ item.serviceProviderName || '-' }}</strong>
              </div>
              <div class="hardware-resource-card__meta">
                <span>{{ t('ec.hardware.card.ownerName') }}</span>
                <strong>{{ item.ownerName || '-' }}</strong>
              </div>
            </div>
          </article>
        </div>
        <el-empty v-else :description="t('ec.hardware.common.noRelation')" />
      </section>

      <section class="hardware-page-card">
        <div class="hardware-section-title">{{ t('ec.hardware.detail.projects') }}</div>
        <div v-if="detailRecord.projects.length > 0" class="hardware-resource-grid">
          <article v-for="item in detailRecord.projects" :key="item.id" class="hardware-resource-card">
            <div class="hardware-resource-card__head">
              <div class="hardware-resource-card__title">{{ item.name || '-' }}</div>
              <span class="hardware-resource-card__tag">{{ getProjectTypeLabel(item.projectType) }}</span>
            </div>
            <div class="hardware-resource-card__meta-grid">
              <div class="hardware-resource-card__meta">
                <span>{{ t('ec.hardware.common.code') }}</span>
                <strong>{{ item.code || '-' }}</strong>
              </div>
              <div class="hardware-resource-card__meta">
                <span>{{ t('ec.hardware.card.projectType') }}</span>
                <strong>{{ getProjectTypeLabel(item.projectType) }}</strong>
              </div>
              <div class="hardware-resource-card__meta">
                <span>{{ t('ec.hardware.card.projectStatus') }}</span>
                <strong>{{ item.projectStatus || '-' }}</strong>
              </div>
              <div class="hardware-resource-card__meta">
                <span>{{ t('ec.hardware.card.ownerName') }}</span>
                <strong>{{ item.ownerName || '-' }}</strong>
              </div>
            </div>
          </article>
        </div>
        <el-empty v-else :description="t('ec.hardware.common.noRelation')" />
      </section>

      <section class="hardware-page-card">
        <div class="hardware-section-title">{{ t('ec.hardware.detail.serviceProviders') }}</div>
        <div v-if="detailRecord.serviceProviders.length > 0" class="hardware-resource-grid">
          <article v-for="item in detailRecord.serviceProviders" :key="item.id" class="hardware-resource-card">
            <div class="hardware-resource-card__title">{{ item.name || '-' }}</div>
            <div class="hardware-resource-card__meta-grid">
              <div class="hardware-resource-card__meta">
                <span>{{ t('ec.hardware.common.code') }}</span>
                <strong>{{ item.code || '-' }}</strong>
              </div>
              <div class="hardware-resource-card__meta">
                <span>{{ t('ec.hardware.card.creditCode') }}</span>
                <strong>{{ item.unifiedSocialCreditCode || '-' }}</strong>
              </div>
              <div class="hardware-resource-card__meta">
                <span>{{ t('ec.hardware.card.contact') }}</span>
                <strong>{{ item.businessContact || '-' }}</strong>
              </div>
              <div class="hardware-resource-card__meta">
                <span>{{ t('ec.hardware.card.phone') }}</span>
                <strong>{{ item.businessPhone || '-' }}</strong>
              </div>
            </div>
          </article>
        </div>
        <el-empty v-else :description="t('ec.hardware.common.noRelation')" />
      </section>
    </div>
  </figma-resource-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { getHardwareAssetDetail } from '@/services/modules/hardwareService'
import { formatDate } from './helpers'
import FigmaResourcePage from '@/views/organization/components/FigmaResourcePage.vue'

defineOptions({ name: 'HardwareDetailPage' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const pageLoading = ref(false)
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
}))

const projectTypeMap = computed(() => ({
  NEW_BUILD: t('ec.project.type.newBuild'),
  SOFTWARE_UPGRADE: t('ec.project.type.softwareUpgrade'),
  OPS_PROJECT: t('ec.project.type.opsProject'),
  SERVICE_PURCHASE: t('ec.project.type.servicePurchase'),
  HARDWARE_PURCHASE: t('ec.project.type.hardwarePurchase'),
  INTEGRATION_PROJECT: t('ec.project.type.integrationProject'),
}))

const getHardwareTypeLabel = (value) => hardwareTypeMap.value[value] || value || '-'
const getNetworkEnvironmentLabel = (value) => networkEnvironmentMap.value[value] || value || '-'
const getSoftwareTypeLabel = (value) => softwareTypeMap.value[value] || value || '-'
const getProjectTypeLabel = (value) => projectTypeMap.value[value] || value || '-'
const hardwareStatusVisual = (value) => hardwareStatusMap.value[value] || { label: value || '-', tone: 'info' }

const loadDetail = async () => {
  detailRecord.value = await getHardwareAssetDetail(route.params.id)
}

onMounted(async () => {
  pageLoading.value = true
  try {
    await loadDetail()
  } catch (error) {
    ElMessage.error(error.message || t('ec.hardware.detail.failed'))
  } finally {
    pageLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.hardware-detail-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hardware-page-card {
  padding: 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #edf0f6;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(28, 53, 91, 0.05);
}

.hardware-detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #edf0f6;
}

.hardware-detail-title {
  color: #151b26;
  font-size: 22px;
  font-weight: 700;
}

.hardware-detail-subtitle {
  margin-top: 6px;
  color: #858a99;
}

.hardware-status-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 88px;
  padding: 6px 12px;
  border-radius: 999px;
  font-size: 12px;
  line-height: 18px;

  &.is-success {
    color: #1f9d55;
    background: #dff6e2;
  }

  &.is-warning {
    color: #c9891d;
    background: #fff5db;
  }

  &.is-info {
    color: #1c96d6;
    background: #e4f5ff;
  }

  &.is-danger {
    color: #d14343;
    background: #fff1f1;
  }
}

.hardware-detail-section + .hardware-detail-section {
  margin-top: 24px;
}

.hardware-section-title {
  color: #151b26;
  font-size: 16px;
  font-weight: 700;
}

.hardware-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 20px;
  margin-top: 20px;
}

.hardware-detail-item {
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
    white-space: pre-wrap;
  }
}

.hardware-resource-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.hardware-resource-card {
  padding: 18px;
  background: #f8f9fc;
  border: 1px solid #edf0f6;
  border-radius: 14px;
}

.hardware-resource-card__head {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
}

.hardware-resource-card__title {
  color: #151b26;
  font-size: 16px;
  font-weight: 700;
}

.hardware-resource-card__tag {
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

  &.is-success {
    color: #1f9d55;
    background: #dff6e2;
  }
}

.hardware-resource-card__meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 16px;
  margin-top: 16px;
}

.hardware-resource-card__meta {
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

.is-span-2 {
  grid-column: 1 / -1;
}

@media only screen and (max-width: 991px) {
  .hardware-page-card {
    padding: 16px;
  }

  .hardware-detail-grid,
  .hardware-resource-grid,
  .hardware-resource-card__meta-grid {
    grid-template-columns: 1fr;
  }

  .is-span-2 {
    grid-column: auto;
  }
}
</style>
