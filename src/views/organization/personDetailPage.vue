<template>
  <figma-resource-page
    active-tab="persons"
    :title="t('ec.organization.person.page.detailTitle')"
    :description="t('ec.organization.person.page.detailDescription')"
    back-path="/organization/persons"
  >
    <template #actions>
      <el-button @click="router.push(`/organization/persons/${route.params.id}/relations`)">
        {{ t('ec.organization.common.relations') }}
      </el-button>
      <el-button type="primary" @click="router.push(`/organization/persons/${route.params.id}/edit`)">
        {{ t('ec.organization.common.edit') }}
      </el-button>
    </template>

    <div v-loading="pageLoading" class="organization-detail-page">
      <section class="organization-page-card">
        <div class="organization-detail-header">
          <div>
            <div class="organization-detail-title">{{ detailRecord.person?.name || '-' }}</div>
            <div class="organization-detail-subtitle">{{ detailRecord.person?.employeeNo || '-' }}</div>
          </div>
          <div class="organization-detail-head-actions">
            <el-tag :type="getStatusTagType(detailRecord.person?.status, personStatusMap)">
              {{ getStatusLabel(detailRecord.person?.status, personStatusMap) }}
            </el-tag>
            <span class="organization-detail-type">{{ getPersonTypeLabel(detailRecord.person?.personType) }}</span>
          </div>
        </div>

        <div class="organization-detail-grid">
          <div class="organization-detail-item">
            <span>{{ t('ec.organization.common.name') }}</span>
            <strong>{{ detailRecord.person?.name || '-' }}</strong>
          </div>
          <div class="organization-detail-item">
            <span>{{ t('ec.organization.person.table.employeeNo') }}</span>
            <strong>{{ detailRecord.person?.employeeNo || '-' }}</strong>
          </div>
          <div class="organization-detail-item">
            <span>{{ t('ec.organization.person.table.gender') }}</span>
            <strong>{{ detailRecord.person?.gender || '-' }}</strong>
          </div>
          <div class="organization-detail-item">
            <span>{{ t('ec.organization.person.table.mobile') }}</span>
            <strong>{{ detailRecord.person?.mobile || '-' }}</strong>
          </div>
          <div class="organization-detail-item">
            <span>{{ t('ec.organization.person.table.idCardNo') }}</span>
            <strong>{{ detailRecord.person?.idCardNo || '-' }}</strong>
          </div>
          <div class="organization-detail-item">
            <span>{{ t('ec.organization.person.table.account') }}</span>
            <strong>{{ detailRecord.person?.account || '-' }}</strong>
          </div>
          <div class="organization-detail-item">
            <span>{{ t('ec.organization.person.table.departmentName') }}</span>
            <strong>{{ detailRecord.person?.departmentName || '-' }}</strong>
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
            <span>{{ t('ec.organization.common.updatedAt') }}</span>
            <strong>{{ formatDateTime(detailRecord.person?.updatedAt) }}</strong>
          </div>
        </div>

        <div v-if="detailRecord.person?.photoUrl" class="organization-detail-photo">
          <div class="organization-detail-photo__label">{{ t('ec.organization.person.form.photoPreview') }}</div>
          <img :src="detailRecord.person.photoUrl" alt="person photo" />
        </div>
      </section>

      <section class="organization-page-card">
        <div class="organization-section-title">{{ t('ec.organization.common.relations') }}</div>
        <div class="organization-relations-grid">
          <div class="organization-relation-block">
            <span>{{ t('ec.organization.person.relations.hardwareAssets') }}</span>
            <div class="organization-detail-tags">
              <el-tag v-for="item in hardwareRelationLabels" :key="`hardware-${item}`">{{ item }}</el-tag>
              <el-empty v-if="hardwareRelationLabels.length === 0" :image-size="56" :description="t('ec.organization.common.noRelation')" />
            </div>
          </div>
          <div class="organization-relation-block">
            <span>{{ t('ec.organization.person.relations.informationSystems') }}</span>
            <div class="organization-detail-tags">
              <el-tag v-for="item in informationSystemRelationLabels" :key="`system-${item}`">{{ item }}</el-tag>
              <el-empty v-if="informationSystemRelationLabels.length === 0" :image-size="56" :description="t('ec.organization.common.noRelation')" />
            </div>
          </div>
          <div class="organization-relation-block is-span-2">
            <span>{{ t('ec.organization.person.relations.projects') }}</span>
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
  getOrganizationProjectOptions,
  getPersonDetail,
} from '@/services/modules/organizationService'
import { buildListLabelMap, formatDateTime, getStatusLabel, getStatusTagType, mapIdsToLabels } from './helpers'
import FigmaResourcePage from './components/FigmaResourcePage.vue'

defineOptions({ name: 'OrganizationPersonDetailPage' })

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const pageLoading = ref(false)
const detailRecord = ref({
  person: null,
  hardwareAssetIds: [],
  informationSystemIds: [],
  projectIds: [],
})
const statusDictionaries = ref({})
const hardwareOptions = ref([])
const informationSystemOptions = ref([])
const projectOptions = ref([])

const personStatusMap = computed(() => {
  return buildStatusOptionMap(statusDictionaries.value.personStatus, locale.value)
})

const personTypeMap = computed(() => ({
  DEV: t('ec.organization.person.figma.type.dev'),
  OPS: t('ec.organization.person.figma.type.ops'),
}))

const hardwareRelationLabels = computed(() => mapIdsToLabels(detailRecord.value.hardwareAssetIds, buildListLabelMap(hardwareOptions.value, 'displayLabel')))
const informationSystemRelationLabels = computed(() => mapIdsToLabels(detailRecord.value.informationSystemIds, buildListLabelMap(informationSystemOptions.value, 'displayLabel')))
const projectRelationLabels = computed(() => mapIdsToLabels(detailRecord.value.projectIds, buildListLabelMap(projectOptions.value, 'displayLabel')))

const getPersonTypeLabel = (value) => {
  return personTypeMap.value[value] || value || '-'
}

const buildDisplayLabel = (primary, secondary) => {
  return [primary, secondary].filter(Boolean).join(' / ') || '-'
}

const loadSupportOptions = async () => {
  const [hardwareAssets, informationSystems, projects] = await Promise.all([
    getOrganizationHardwareOptions(),
    getOrganizationInformationSystemOptions(),
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
  projectOptions.value = projects.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.code, item.name),
  }))
}

const loadDetail = async () => {
  pageLoading.value = true
  try {
    const [statusOptions] = await Promise.all([
      getStatusDictionaries(),
      loadSupportOptions(),
    ])
    statusDictionaries.value = statusOptions
    detailRecord.value = await getPersonDetail(route.params.id)
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

.organization-detail-type {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 32px;
  padding: 0 12px;
  background: #ebf0ff;
  color: #2e5ef0;
  border-radius: 999px;
  font-size: 13px;
  font-weight: 600;
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

.organization-detail-photo {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #edf0f6;

  img {
    display: block;
    max-width: 180px;
    max-height: 180px;
    margin-top: 12px;
    border: 1px solid #edf0f6;
    border-radius: 12px;
    object-fit: cover;
  }
}

.organization-detail-photo__label,
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

.organization-detail-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.is-span-2 {
  grid-column: 1 / -1;
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
