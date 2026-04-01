<template>
  <figma-resource-page
    hide-tabs
    :title="t('ec.software.page.detailTitle')"
    :description="t('ec.software.page.detailDescription')"
    back-path="/software/informationSystems"
  >
    <template #actions>
      <el-button @click="router.push(`/software/informationSystems/${route.params.id}/relations`)">
        {{ t('ec.software.common.relations') }}
      </el-button>
      <el-button type="primary" @click="router.push(`/software/informationSystems/${route.params.id}/edit`)">
        {{ t('ec.software.common.edit') }}
      </el-button>
    </template>

    <div v-loading="pageLoading" class="software-detail-page">
      <section class="software-page-card">
        <div class="software-detail-header">
          <div>
            <div class="software-detail-title">{{ detailRecord.informationSystem?.name || '-' }}</div>
            <div class="software-detail-subtitle">{{ detailRecord.informationSystem?.code || '-' }}</div>
          </div>
          <el-tag :type="getStatusTagType(detailRecord.informationSystem?.status, informationSystemStatusMap)">
            {{ getStatusLabel(detailRecord.informationSystem?.status, informationSystemStatusMap) }}
          </el-tag>
        </div>

        <div class="software-detail-section">
          <div class="software-section-title">{{ t('ec.software.section.basic') }}</div>
          <div class="software-detail-grid">
            <div class="software-detail-item">
              <span>{{ t('ec.software.common.code') }}</span>
              <strong>{{ detailRecord.informationSystem?.code || '-' }}</strong>
            </div>
            <div class="software-detail-item">
              <span>{{ t('ec.software.common.name') }}</span>
              <strong>{{ detailRecord.informationSystem?.name || '-' }}</strong>
            </div>
            <div class="software-detail-item">
              <span>{{ t('ec.software.common.systemType') }}</span>
              <strong>{{ getSystemTypeLabel(detailRecord.informationSystem?.systemType) }}</strong>
            </div>
            <div class="software-detail-item">
              <span>{{ t('ec.software.common.versionNo') }}</span>
              <strong>{{ detailRecord.informationSystem?.versionNo || '-' }}</strong>
            </div>
            <div class="software-detail-item">
              <span>{{ t('ec.software.common.deploymentArchitecture') }}</span>
              <strong>{{ getDeploymentArchitectureLabel(detailRecord.informationSystem?.deploymentArchitecture) }}</strong>
            </div>
            <div class="software-detail-item">
              <span>{{ t('ec.software.common.owner') }}</span>
              <strong>{{ detailRecord.informationSystem?.ownerName || '-' }}</strong>
            </div>
            <div class="software-detail-item">
              <span>{{ t('ec.software.common.contactPhone') }}</span>
              <strong>{{ detailRecord.informationSystem?.contactPhone || '-' }}</strong>
            </div>
          </div>
        </div>
      </section>

      <section class="software-page-card">
        <div class="software-section-title">{{ t('ec.software.detail.persons') }}</div>
        <div v-if="detailRecord.persons.length > 0" class="software-resource-grid">
          <article v-for="item in detailRecord.persons" :key="item.id" class="software-resource-card">
            <div class="software-resource-card__title">{{ item.name || '-' }}</div>
            <div class="software-resource-card__meta-grid">
              <div class="software-resource-card__meta">
                <span>{{ t('ec.software.card.employeeNo') }}</span>
                <strong>{{ item.employeeNo || '-' }}</strong>
              </div>
              <div class="software-resource-card__meta">
                <span>{{ t('ec.software.card.mobile') }}</span>
                <strong>{{ item.mobile || '-' }}</strong>
              </div>
            </div>
          </article>
        </div>
        <el-empty v-else :description="t('ec.software.common.noRelation')" />
      </section>

      <section class="software-page-card">
        <div class="software-section-title">{{ t('ec.software.detail.serviceProviders') }}</div>
        <div v-if="detailRecord.serviceProviders.length > 0" class="software-resource-grid">
          <article v-for="item in detailRecord.serviceProviders" :key="item.id" class="software-resource-card">
            <div class="software-resource-card__title">{{ item.name || '-' }}</div>
            <div class="software-resource-card__meta-grid">
              <div class="software-resource-card__meta">
                <span>{{ t('ec.software.common.code') }}</span>
                <strong>{{ item.code || '-' }}</strong>
              </div>
              <div class="software-resource-card__meta">
                <span>{{ t('ec.software.card.creditCode') }}</span>
                <strong>{{ item.unifiedSocialCreditCode || '-' }}</strong>
              </div>
              <div class="software-resource-card__meta">
                <span>{{ t('ec.software.card.contact') }}</span>
                <strong>{{ item.businessContact || '-' }}</strong>
              </div>
              <div class="software-resource-card__meta">
                <span>{{ t('ec.software.card.phone') }}</span>
                <strong>{{ item.businessPhone || '-' }}</strong>
              </div>
            </div>
          </article>
        </div>
        <el-empty v-else :description="t('ec.software.common.noRelation')" />
      </section>

      <section class="software-page-card">
        <div class="software-section-title">{{ t('ec.software.detail.hardwareAssets') }}</div>
        <div v-if="detailRecord.hardwareAssets.length > 0" class="software-resource-grid">
          <article v-for="item in detailRecord.hardwareAssets" :key="item.id" class="software-resource-card">
            <div class="software-resource-card__title">{{ item.name || '-' }}</div>
            <div class="software-resource-card__meta-grid">
              <div class="software-resource-card__meta">
                <span>{{ t('ec.software.card.assetCode') }}</span>
                <strong>{{ item.code || '-' }}</strong>
              </div>
              <div class="software-resource-card__meta">
                <span>{{ t('ec.software.card.managementIp') }}</span>
                <strong>{{ item.managementIp || '-' }}</strong>
              </div>
              <div class="software-resource-card__meta">
                <span>{{ t('ec.software.card.cpuModel') }}</span>
                <strong>{{ item.cpuModel || '-' }}</strong>
              </div>
              <div class="software-resource-card__meta">
                <span>{{ t('ec.software.card.memoryGb') }}</span>
                <strong>{{ item.memoryGb ?? '-' }}</strong>
              </div>
            </div>
          </article>
        </div>
        <el-empty v-else :description="t('ec.software.common.noRelation')" />
      </section>

      <section class="software-page-card">
        <div class="software-section-title">{{ t('ec.software.detail.projects') }}</div>
        <div v-if="detailRecord.projects.length > 0" class="software-resource-grid">
          <article v-for="item in detailRecord.projects" :key="item.id" class="software-resource-card">
            <div class="software-resource-card__head">
              <div class="software-resource-card__title">{{ item.name || '-' }}</div>
              <span class="software-resource-card__tag">{{ getProjectTypeLabel(item.projectType) }}</span>
            </div>
            <div class="software-resource-card__meta-grid">
              <div class="software-resource-card__meta">
                <span>{{ t('ec.software.common.code') }}</span>
                <strong>{{ item.code || '-' }}</strong>
              </div>
              <div class="software-resource-card__meta">
                <span>{{ t('ec.software.card.projectType') }}</span>
                <strong>{{ getProjectTypeLabel(item.projectType) }}</strong>
              </div>
              <div class="software-resource-card__meta">
                <span>{{ t('ec.software.card.projectStatus') }}</span>
                <strong>{{ item.projectStatus || '-' }}</strong>
              </div>
              <div class="software-resource-card__meta">
                <span>{{ t('ec.software.card.ownerName') }}</span>
                <strong>{{ item.ownerName || '-' }}</strong>
              </div>
            </div>
          </article>
        </div>
        <el-empty v-else :description="t('ec.software.common.noRelation')" />
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
import { buildStatusOptionMap, getStatusLabel, getStatusTagType } from '@/utils/statusDictionary'
import { getInformationSystemDetail } from '@/services/modules/softwareService'
import FigmaResourcePage from '@/views/organization/components/FigmaResourcePage.vue'

defineOptions({ name: 'SoftwareDetailPage' })

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const pageLoading = ref(false)
const statusDictionaries = ref({})
const detailRecord = ref({
  informationSystem: null,
  serviceProviderIds: [],
  personIds: [],
  hardwareAssetIds: [],
  projectIds: [],
  serviceProviders: [],
  persons: [],
  hardwareAssets: [],
  projects: [],
})

const systemTypeMap = computed(() => ({
  EXTERNAL_SERVICE: t('ec.software.type.externalService'),
  INTERNAL_OFFICE: t('ec.software.type.internalOffice'),
  DATABASE_SOFTWARE: t('ec.software.type.databaseSoftware'),
  BASIC_SUPPORT: t('ec.software.type.basicSupport'),
  SECURITY_SOFTWARE: t('ec.software.type.securitySoftware'),
}))

const deploymentArchitectureMap = computed(() => ({
  SINGLE: t('ec.software.deployment.single'),
  CLUSTER: t('ec.software.deployment.cluster'),
  CONTAINERIZED: t('ec.software.deployment.containerized'),
}))

const projectTypeMap = computed(() => ({
  NEW_BUILD: t('ec.project.type.newBuild'),
  SOFTWARE_UPGRADE: t('ec.project.type.softwareUpgrade'),
  OPS_PROJECT: t('ec.project.type.opsProject'),
  SERVICE_PURCHASE: t('ec.project.type.servicePurchase'),
  HARDWARE_PURCHASE: t('ec.project.type.hardwarePurchase'),
  INTEGRATION_PROJECT: t('ec.project.type.integrationProject'),
}))

const informationSystemStatusMap = computed(() => {
  return buildStatusOptionMap(statusDictionaries.value.informationSystemStatus, locale.value)
})

const getSystemTypeLabel = (value) => systemTypeMap.value[value] || value || '-'
const getDeploymentArchitectureLabel = (value) => deploymentArchitectureMap.value[value] || value || '-'
const getProjectTypeLabel = (value) => projectTypeMap.value[value] || value || '-'

const loadDetail = async () => {
  const [statusOptions, detail] = await Promise.all([
    getStatusDictionaries(),
    getInformationSystemDetail(route.params.id),
  ])

  statusDictionaries.value = statusOptions
  detailRecord.value = detail
}

onMounted(async () => {
  pageLoading.value = true
  try {
    await loadDetail()
  } catch (error) {
    ElMessage.error(error.message || t('ec.software.message.detailFailed'))
  } finally {
    pageLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.software-detail-page {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.software-page-card {
  padding: 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #edf0f6;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(28, 53, 91, 0.05);
}

.software-detail-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 20px;
  border-bottom: 1px solid #edf0f6;
}

.software-detail-title {
  color: #151b26;
  font-size: 22px;
  font-weight: 700;
}

.software-detail-subtitle {
  margin-top: 6px;
  color: #858a99;
}

.software-detail-section + .software-detail-section {
  margin-top: 24px;
}

.software-section-title {
  color: #151b26;
  font-size: 16px;
  font-weight: 700;
}

.software-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 20px;
  margin-top: 20px;
}

.software-detail-item {
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

.software-resource-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.software-resource-card {
  padding: 18px;
  background: #f8f9fc;
  border: 1px solid #edf0f6;
  border-radius: 14px;
}

.software-resource-card__head {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
}

.software-resource-card__title {
  color: #151b26;
  font-size: 16px;
  font-weight: 700;
}

.software-resource-card__tag {
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

.software-resource-card__meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 16px;
  margin-top: 16px;
}

.software-resource-card__meta {
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
  .software-page-card {
    padding: 16px;
  }

  .software-detail-grid,
  .software-resource-grid,
  .software-resource-card__meta-grid {
    grid-template-columns: 1fr;
  }
}
</style>
