<template>
  <figma-resource-page
    hide-tabs
    active-tab="projects"
    :title="t('ec.project.page.relationsTitle')"
    :description="t('ec.project.page.relationsDescription')"
    :back-path="`/project/projects/${route.params.id}/detail`"
  >
    <template #actions>
      <el-button @click="router.push(`/project/projects/${route.params.id}/detail`)">
        {{ t('ec.global.button.text.cancel') }}
      </el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        {{ t('ec.global.button.text.submit') }}
      </el-button>
    </template>

    <div v-loading="pageLoading" class="project-page-card">
      <div class="project-page-intro">
        <div class="project-page-intro__title">{{ detailRecord.project?.name || '-' }}</div>
        <div class="project-page-intro__meta">{{ detailRecord.project?.code || '-' }}</div>
      </div>

      <el-form label-position="top" class="project-form-grid">
        <el-form-item :label="t('ec.project.detail.persons')">
          <ec-object-multi-transfer
            v-model="relationForm.personIds"
            :placeholder="t('ec.project.relation.personsPlaceholder')"
            :title="`${t('ec.project.detail.persons')}${t('ec.organization.selector.titleSuffix')}`"
            :selected-title="t('ec.organization.selector.selected')"
            :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
            :options="personOptions"
            label-key="name"
            value-key="id"
            subtitle-key="employeeNo"
          />
        </el-form-item>

        <el-form-item :label="t('ec.project.detail.informationSystems')">
          <ec-object-multi-transfer
            v-model="relationForm.informationSystemIds"
            :placeholder="t('ec.project.relation.informationSystemsPlaceholder')"
            :title="`${t('ec.project.detail.informationSystems')}${t('ec.organization.selector.titleSuffix')}`"
            :selected-title="t('ec.organization.selector.selected')"
            :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
            :options="informationSystemOptions"
            label-key="name"
            value-key="id"
            subtitle-key="code"
          />
        </el-form-item>

        <el-form-item :label="t('ec.project.detail.hardwareAssets')">
          <ec-object-multi-transfer
            v-model="relationForm.hardwareAssetIds"
            :placeholder="t('ec.project.relation.hardwareAssetsPlaceholder')"
            :title="`${t('ec.project.detail.hardwareAssets')}${t('ec.organization.selector.titleSuffix')}`"
            :selected-title="t('ec.organization.selector.selected')"
            :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
            :options="hardwareOptions"
            label-key="assetName"
            value-key="id"
            subtitle-key="assetCode"
          />
        </el-form-item>

        <el-form-item :label="t('ec.project.detail.serviceProviders')">
          <ec-object-multi-transfer
            v-model="relationForm.serviceProviderIds"
            :placeholder="t('ec.project.relation.serviceProvidersPlaceholder')"
            :title="`${t('ec.project.detail.serviceProviders')}${t('ec.organization.selector.titleSuffix')}`"
            :selected-title="t('ec.organization.selector.selected')"
            :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
            :options="serviceProviderOptions"
            label-key="name"
            value-key="id"
            subtitle-key="code"
          />
        </el-form-item>
      </el-form>
    </div>
  </figma-resource-page>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  getProjectDetail,
  getProjectHardwareOptions,
  getProjectInformationSystemOptions,
  getProjectPersonOptions,
  getProjectServiceProviderOptions,
  syncProjectRelations,
} from '@/services/modules/projectService'
import EcObjectMultiTransfer from '@/components/EcObjectMultiTransfer.vue'
import FigmaResourcePage from '@/views/organization/components/FigmaResourcePage.vue'

defineOptions({ name: 'ProjectRelationsPage' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const pageLoading = ref(false)
const submitLoading = ref(false)
const detailRecord = ref({ project: null })
const personOptions = ref([])
const informationSystemOptions = ref([])
const hardwareOptions = ref([])
const serviceProviderOptions = ref([])

const relationForm = reactive({
  personIds: [],
  informationSystemIds: [],
  hardwareAssetIds: [],
  serviceProviderIds: [],
})

const normalizeIds = (value) => (Array.isArray(value) ? value : [])

const loadSupportOptions = async () => {
  const [persons, informationSystems, hardwareAssets, serviceProviders] = await Promise.all([
    getProjectPersonOptions(),
    getProjectInformationSystemOptions(),
    getProjectHardwareOptions(),
    getProjectServiceProviderOptions(),
  ])

  personOptions.value = Array.isArray(persons) ? persons : []
  informationSystemOptions.value = Array.isArray(informationSystems) ? informationSystems : []
  hardwareOptions.value = Array.isArray(hardwareAssets) ? hardwareAssets : []
  serviceProviderOptions.value = Array.isArray(serviceProviders) ? serviceProviders : []
}

const loadDetail = async () => {
  const detail = await getProjectDetail(route.params.id)
  detailRecord.value = detail
  relationForm.personIds = normalizeIds(detail.personIds)
  relationForm.informationSystemIds = normalizeIds(detail.informationSystemIds)
  relationForm.hardwareAssetIds = normalizeIds(detail.hardwareAssetIds)
  relationForm.serviceProviderIds = normalizeIds(detail.serviceProviderIds)
}

const handleSubmit = async () => {
  submitLoading.value = true
  try {
    await syncProjectRelations(route.params.id, {
      personIds: relationForm.personIds,
      informationSystemIds: relationForm.informationSystemIds,
      hardwareAssetIds: relationForm.hardwareAssetIds,
      serviceProviderIds: relationForm.serviceProviderIds,
    })
    ElMessage.success(t('ec.project.relation.saveSuccess'))
    router.replace(`/project/projects/${route.params.id}/detail`)
  } catch (error) {
    ElMessage.error(error.message || t('ec.project.relation.saveFailed'))
  } finally {
    submitLoading.value = false
  }
}

onMounted(async () => {
  pageLoading.value = true
  try {
    await loadSupportOptions()
    await loadDetail()
  } catch (error) {
    ElMessage.error(error.message || t('ec.project.message.detailFailed'))
  } finally {
    pageLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.project-page-card {
  padding: 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #edf0f6;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(28, 53, 91, 0.05);
}

.project-page-intro {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #edf0f6;
}

.project-page-intro__title {
  color: #151b26;
  font-size: 22px;
  font-weight: 700;
}

.project-page-intro__meta {
  margin-top: 6px;
  color: #858a99;
}

.project-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 20px;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-form-item__content),
  :deep(.el-select) {
    width: 100%;
  }
}

@media only screen and (max-width: 991px) {
  .project-page-card {
    padding: 16px;
  }

  .project-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
