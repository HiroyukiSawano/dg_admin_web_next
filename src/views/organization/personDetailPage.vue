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
        <div class="organization-section-title">{{ t('ec.organization.person.section.basicInfo') }}</div>
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

      <section class="organization-page-card">
        <div class="organization-section-title">{{ t('ec.organization.person.relations.softwareAssets') }}</div>
        <div v-if="softwareCards.length > 0" class="organization-resource-grid">
          <article v-for="item in softwareCards" :key="item.id" class="organization-resource-card">
            <div class="organization-resource-card__head">
              <div class="organization-resource-card__title">{{ item.name || '-' }}</div>
              <span class="organization-resource-card__tag">
                {{ getSystemTypeLabel(item.systemType) }}
              </span>
            </div>
            <div class="organization-resource-card__meta-grid">
              <div class="organization-resource-card__meta">
                <span>{{ t('ec.organization.person.detail.card.code') }}</span>
                <strong>{{ item.code || '-' }}</strong>
              </div>
              <div class="organization-resource-card__meta">
                <span>{{ t('ec.organization.person.detail.card.type') }}</span>
                <strong>{{ getSystemTypeLabel(item.systemType) }}</strong>
              </div>
              <div class="organization-resource-card__meta">
                <span>{{ t('ec.organization.person.detail.card.vendor') }}</span>
                <strong>{{ item.serviceProviderName || '-' }}</strong>
              </div>
              <div class="organization-resource-card__meta">
                <span>{{ t('ec.organization.person.detail.card.owner') }}</span>
                <strong>{{ item.ownerName || '-' }}</strong>
              </div>
            </div>
          </article>
        </div>
        <el-empty v-else :description="t('ec.organization.common.noRelation')" />
      </section>

      <section class="organization-page-card">
        <div class="organization-section-title">{{ t('ec.organization.person.relations.hardwareAssets') }}</div>
        <div v-if="hardwareCards.length > 0" class="organization-resource-grid">
          <article v-for="item in hardwareCards" :key="item.id" class="organization-resource-card">
            <div class="organization-resource-card__head">
              <div class="organization-resource-card__title">{{ item.name || '-' }}</div>
              <span class="organization-resource-card__tag">
                {{ getHardwareCategoryLabel(item.hardwareCategory) }}
              </span>
            </div>
            <div class="organization-resource-card__meta-grid">
              <div class="organization-resource-card__meta">
                <span>{{ t('ec.organization.person.detail.card.code') }}</span>
                <strong>{{ item.code || '-' }}</strong>
              </div>
              <div class="organization-resource-card__meta">
                <span>{{ t('ec.organization.person.detail.card.ip') }}</span>
                <strong>{{ item.managementIp || '-' }}</strong>
              </div>
              <div class="organization-resource-card__meta">
                <span>{{ t('ec.organization.person.detail.card.cpu') }}</span>
                <strong>{{ item.cpuModel || '-' }}</strong>
              </div>
              <div class="organization-resource-card__meta">
                <span>{{ t('ec.organization.person.detail.card.memory') }}</span>
                <strong>{{ formatMemory(item.memoryGb) }}</strong>
              </div>
              <div class="organization-resource-card__meta">
                <span>{{ t('ec.organization.person.detail.card.vendor') }}</span>
                <strong>{{ item.serviceProviderName || '-' }}</strong>
              </div>
              <div class="organization-resource-card__meta">
                <span>{{ t('ec.organization.person.detail.card.owner') }}</span>
                <strong>{{ item.ownerName || '-' }}</strong>
              </div>
            </div>
          </article>
        </div>
        <el-empty v-else :description="t('ec.organization.common.noRelation')" />
      </section>

      <section class="organization-page-card">
        <div class="organization-section-title">{{ t('ec.organization.person.relations.projects') }}</div>
        <div v-if="projectCards.length > 0" class="organization-resource-grid">
          <article v-for="item in projectCards" :key="item.id" class="organization-resource-card">
            <div class="organization-resource-card__head">
              <div class="organization-resource-card__title">{{ item.name || '-' }}</div>
              <span class="organization-resource-card__tag">
                {{ getProjectTypeLabel(item.projectType) }}
              </span>
            </div>
            <div class="organization-resource-card__meta-grid">
              <div class="organization-resource-card__meta">
                <span>{{ t('ec.organization.person.detail.card.code') }}</span>
                <strong>{{ item.code || '-' }}</strong>
              </div>
              <div class="organization-resource-card__meta">
                <span>{{ t('ec.organization.person.detail.card.type') }}</span>
                <strong>{{ getProjectTypeLabel(item.projectType) }}</strong>
              </div>
              <div class="organization-resource-card__meta">
                <span>{{ t('ec.organization.person.detail.card.status') }}</span>
                <strong>{{ getProjectStatusLabel(item.projectStatus) }}</strong>
              </div>
              <div class="organization-resource-card__meta">
                <span>{{ t('ec.organization.person.detail.card.owner') }}</span>
                <strong>{{ item.ownerName || '-' }}</strong>
              </div>
            </div>
          </article>
        </div>
        <el-empty v-else :description="t('ec.organization.common.noRelation')" />
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
import { getPersonDetail } from '@/services/modules/organizationService'
import { getStatusLabel } from './helpers'
import FigmaResourcePage from './components/FigmaResourcePage.vue'

defineOptions({ name: 'OrganizationPersonDetailPage' })

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const pageLoading = ref(false)
const statusDictionaries = ref({})
const detailRecord = ref({
  person: null,
  informationSystems: [],
  hardwareAssets: [],
  projects: [],
})

const softwareCards = computed(() => (Array.isArray(detailRecord.value.informationSystems) ? detailRecord.value.informationSystems : []))
const hardwareCards = computed(() => (Array.isArray(detailRecord.value.hardwareAssets) ? detailRecord.value.hardwareAssets : []))
const projectCards = computed(() => (Array.isArray(detailRecord.value.projects) ? detailRecord.value.projects : []))

const projectStatusMap = computed(() => {
  return buildStatusOptionMap(statusDictionaries.value.projectStatus, locale.value)
})

const systemTypeOptions = computed(() => ([
  { value: 'EXTERNAL_SERVICE', label: t('ec.software.type.externalService') },
  { value: 'INTERNAL_OFFICE', label: t('ec.software.type.internalOffice') },
  { value: 'SUPPORT_SYSTEM', label: t('ec.software.type.supportSystem') },
]))

const hardwareCategoryOptions = computed(() => ([
  { value: 'SERVER', label: t('ec.hardware.category.server') },
  { value: 'QUERY_TERMINAL', label: t('ec.hardware.category.queryTerminal') },
  { value: 'TICKET_TERMINAL', label: t('ec.hardware.category.ticketTerminal') },
  { value: 'SELF_SERVICE_TERMINAL', label: t('ec.hardware.category.selfServiceTerminal') },
]))

const projectTypeOptions = computed(() => ([
  { value: 'NEW_BUILD', label: t('ec.project.type.newBuild') },
  { value: 'OPERATION', label: t('ec.project.type.operation') },
  { value: 'UPGRADE', label: t('ec.project.type.upgrade') },
]))

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

const getHardwareCategoryLabel = (value) => findLabel(hardwareCategoryOptions.value, value)

const getProjectTypeLabel = (value) => findLabel(projectTypeOptions.value, value)

const getProjectStatusLabel = (value) => getStatusLabel(value, projectStatusMap.value)

const formatMemory = (value) => {
  return value == null || value === '' ? '-' : `${value} GB`
}

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

.organization-section-title {
  color: #151b26;
  font-size: 16px;
  font-weight: 700;
}

.organization-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 20px;
  margin-top: 20px;
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

.organization-resource-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
  margin-top: 20px;
}

.organization-resource-card {
  padding: 18px;
  background: #f8f9fc;
  border: 1px solid #edf0f6;
  border-radius: 14px;
}

.organization-resource-card__head {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  justify-content: space-between;
}

.organization-resource-card__title {
  color: #151b26;
  font-size: 16px;
  font-weight: 700;
}

.organization-resource-card__tag {
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

.organization-resource-card__meta-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 16px;
  margin-top: 16px;
}

.organization-resource-card__meta {
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
  .organization-page-card {
    padding: 16px;
  }

  .organization-detail-grid,
  .organization-resource-grid,
  .organization-resource-card__meta-grid {
    grid-template-columns: 1fr;
  }

  .organization-resource-card__head {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
