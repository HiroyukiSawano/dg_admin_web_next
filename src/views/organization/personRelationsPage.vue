<template>
  <figma-resource-page
    active-tab="persons"
    :title="t('ec.organization.person.page.relationsTitle')"
    :description="t('ec.organization.person.page.relationsDescription')"
    :back-path="`/organization/persons/${route.params.id}/detail`"
  >
    <template #actions>
      <el-button @click="router.push(`/organization/persons/${route.params.id}/detail`)">
        {{ t('ec.global.button.text.cancel') }}
      </el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        {{ t('ec.global.button.text.submit') }}
      </el-button>
    </template>

    <div v-loading="pageLoading" class="organization-page-card">
      <div class="organization-page-intro">
        <div class="organization-page-intro__title">{{ detailRecord.person?.name || '-' }}</div>
        <div class="organization-page-intro__meta">{{ detailRecord.person?.employeeNo || '-' }}</div>
      </div>

      <el-form label-position="top" class="organization-form-grid">
        <el-form-item :label="t('ec.organization.person.relations.informationSystems')">
          <ec-object-multi-transfer
            v-model="relationForm.informationSystemIds"
            :placeholder="t('ec.organization.person.relation.informationSystemsPlaceholder')"
            :title="`${t('ec.organization.person.relations.informationSystems')}${t('ec.organization.selector.titleSuffix')}`"
            :selected-title="t('ec.organization.selector.selected')"
            :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
            :options="informationSystemOptions"
            label-key="name"
            value-key="id"
            subtitle-key="code"
          />
        </el-form-item>

        <el-form-item :label="t('ec.organization.person.relations.hardwareAssets')">
          <ec-object-multi-transfer
            v-model="relationForm.hardwareAssetIds"
            :placeholder="t('ec.organization.person.relation.hardwareAssetsPlaceholder')"
            :title="`${t('ec.organization.person.relations.hardwareAssets')}${t('ec.organization.selector.titleSuffix')}`"
            :selected-title="t('ec.organization.selector.selected')"
            :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
            :options="hardwareOptions"
            label-key="assetName"
            value-key="id"
            subtitle-key="assetCode"
          />
        </el-form-item>

        <el-form-item :label="t('ec.organization.person.relations.projects')" class="is-span-2">
          <ec-object-multi-transfer
            v-model="relationForm.projectIds"
            :placeholder="t('ec.organization.person.relation.projectsPlaceholder')"
            :title="`${t('ec.organization.person.relations.projects')}${t('ec.organization.selector.titleSuffix')}`"
            :selected-title="t('ec.organization.selector.selected')"
            :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
            :options="projectOptions"
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
  getOrganizationHardwareOptions,
  getOrganizationInformationSystemOptions,
  getOrganizationProjectOptions,
  getPersonDetail,
  syncPersonRelations,
} from '@/services/modules/organizationService'
import EcObjectMultiTransfer from '@/components/EcObjectMultiTransfer.vue'
import FigmaResourcePage from './components/FigmaResourcePage.vue'

defineOptions({ name: 'OrganizationPersonRelationsPage' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const pageLoading = ref(false)
const submitLoading = ref(false)
const detailRecord = ref({ person: null })
const hardwareOptions = ref([])
const informationSystemOptions = ref([])
const projectOptions = ref([])

const relationForm = reactive({
  hardwareAssetIds: [],
  informationSystemIds: [],
  projectIds: [],
})

const normalizeIds = (value) => {
  return Array.isArray(value) ? value : []
}

const loadSupportOptions = async () => {
  const [hardwareAssets, informationSystems, projects] = await Promise.all([
    getOrganizationHardwareOptions(),
    getOrganizationInformationSystemOptions(),
    getOrganizationProjectOptions(),
  ])

  hardwareOptions.value = Array.isArray(hardwareAssets) ? hardwareAssets : []
  informationSystemOptions.value = Array.isArray(informationSystems) ? informationSystems : []
  projectOptions.value = Array.isArray(projects) ? projects : []
}

const loadDetail = async () => {
  pageLoading.value = true
  try {
    await loadSupportOptions()
    const detail = await getPersonDetail(route.params.id)
    detailRecord.value = detail
    relationForm.hardwareAssetIds = normalizeIds(detail.hardwareAssetIds)
    relationForm.informationSystemIds = normalizeIds(detail.informationSystemIds)
    relationForm.projectIds = normalizeIds(detail.projectIds)
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.person.message.detailFailed'))
  } finally {
    pageLoading.value = false
  }
}

const handleSubmit = async () => {
  submitLoading.value = true
  try {
    await syncPersonRelations(route.params.id, {
      hardwareAssetIds: relationForm.hardwareAssetIds,
      informationSystemIds: relationForm.informationSystemIds,
      projectIds: relationForm.projectIds,
    })
    ElMessage.success(t('ec.organization.person.relation.saveSuccess'))
    router.replace(`/organization/persons/${route.params.id}/detail`)
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.person.relation.saveFailed'))
  } finally {
    submitLoading.value = false
  }
}

onMounted(loadDetail)
</script>

<style lang="scss" scoped>
.organization-page-card {
  padding: 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #edf0f6;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(28, 53, 91, 0.05);
}

.organization-page-intro {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #edf0f6;
}

.organization-page-intro__title {
  color: #151b26;
  font-size: 22px;
  font-weight: 700;
}

.organization-page-intro__meta {
  margin-top: 6px;
  color: #858a99;
}

.organization-form-grid {
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

.is-span-2 {
  grid-column: 1 / -1;
}

@media only screen and (max-width: 991px) {
  .organization-page-card {
    padding: 16px;
  }

  .organization-form-grid {
    grid-template-columns: 1fr;
  }

  .is-span-2 {
    grid-column: auto;
  }
}
</style>
