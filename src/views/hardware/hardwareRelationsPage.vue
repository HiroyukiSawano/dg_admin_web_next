<template>
  <figma-resource-page
    hide-tabs
    :title="t('ec.hardware.page.relationsTitle')"
    :description="t('ec.hardware.page.relationsDescription')"
    :back-path="`/hardware/hardwareAssets/${route.params.id}/detail`"
  >
    <template #actions>
      <el-button @click="router.push(`/hardware/hardwareAssets/${route.params.id}/detail`)">
        {{ t('ec.global.button.text.cancel') }}
      </el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        {{ t('ec.global.button.text.submit') }}
      </el-button>
    </template>

    <div v-loading="pageLoading" class="hardware-page-card">
      <div class="hardware-page-intro">
        <div class="hardware-page-intro__title">{{ detailRecord.hardwareAsset?.assetName || '-' }}</div>
        <div class="hardware-page-intro__meta">{{ detailRecord.hardwareAsset?.assetCode || '-' }}</div>
      </div>

      <el-form label-position="top" class="hardware-form-grid">
        <el-form-item :label="t('ec.hardware.detail.persons')" class="is-span-2">
          <ec-object-multi-transfer
            v-model="relationForm.personIds"
            :placeholder="t('ec.hardware.relation.personsPlaceholder')"
            :title="`${t('ec.hardware.detail.persons')}${t('ec.organization.selector.titleSuffix')}`"
            :selected-title="t('ec.organization.selector.selected')"
            :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
            :options="personOptions"
            label-key="name"
            value-key="id"
            subtitle-key="employeeNo"
          />
        </el-form-item>

        <el-form-item :label="t('ec.hardware.detail.serviceProviders')">
          <ec-object-multi-transfer
            v-model="relationForm.serviceProviderIds"
            :placeholder="t('ec.hardware.relation.serviceProvidersPlaceholder')"
            :title="`${t('ec.hardware.detail.serviceProviders')}${t('ec.organization.selector.titleSuffix')}`"
            :selected-title="t('ec.organization.selector.selected')"
            :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
            :options="serviceProviderOptions"
            label-key="name"
            value-key="id"
            subtitle-key="code"
          />
        </el-form-item>

        <el-form-item :label="t('ec.hardware.detail.softwareAssets')">
          <ec-object-multi-transfer
            v-model="relationForm.informationSystemIds"
            :placeholder="t('ec.hardware.relation.softwareAssetsPlaceholder')"
            :title="`${t('ec.hardware.detail.softwareAssets')}${t('ec.organization.selector.titleSuffix')}`"
            :selected-title="t('ec.organization.selector.selected')"
            :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
            :options="softwareOptions"
            label-key="name"
            value-key="id"
            subtitle-key="code"
          />
        </el-form-item>

        <el-form-item :label="t('ec.hardware.detail.projects')" class="is-span-2">
          <ec-object-multi-transfer
            v-model="relationForm.projectIds"
            :placeholder="t('ec.hardware.relation.projectsPlaceholder')"
            :title="`${t('ec.hardware.detail.projects')}${t('ec.organization.selector.titleSuffix')}`"
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
  getHardwareAssetDetail,
  getHardwarePersonOptions,
  getHardwareProjectOptions,
  getHardwareSystemOptions,
  getHardwareVendorOptions,
  syncHardwareRelations,
} from '@/services/modules/hardwareService'
import EcObjectMultiTransfer from '@/components/EcObjectMultiTransfer.vue'
import { normalizeIdList } from './helpers'
import FigmaResourcePage from '@/views/organization/components/FigmaResourcePage.vue'

defineOptions({ name: 'HardwareRelationsPage' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const pageLoading = ref(false)
const submitLoading = ref(false)
const detailRecord = ref({ hardwareAsset: null })
const personOptions = ref([])
const serviceProviderOptions = ref([])
const softwareOptions = ref([])
const projectOptions = ref([])

const relationForm = reactive({
  personIds: [],
  serviceProviderIds: [],
  informationSystemIds: [],
  projectIds: [],
})

const loadSupportOptions = async () => {
  const [persons, serviceProviders, softwareAssets, projects] = await Promise.all([
    getHardwarePersonOptions(),
    getHardwareVendorOptions(),
    getHardwareSystemOptions(),
    getHardwareProjectOptions(),
  ])

  personOptions.value = Array.isArray(persons) ? persons : []
  serviceProviderOptions.value = Array.isArray(serviceProviders) ? serviceProviders : []
  softwareOptions.value = Array.isArray(softwareAssets) ? softwareAssets : []
  projectOptions.value = Array.isArray(projects) ? projects : []
}

const loadDetail = async () => {
  const detail = await getHardwareAssetDetail(route.params.id)
  detailRecord.value = detail
  relationForm.personIds = normalizeIdList(detail.personIds)
  relationForm.serviceProviderIds = normalizeIdList(detail.serviceProviderIds)
  relationForm.informationSystemIds = normalizeIdList(detail.informationSystemIds)
  relationForm.projectIds = normalizeIdList(detail.projectIds)
}

const handleSubmit = async () => {
  submitLoading.value = true
  try {
    await syncHardwareRelations(route.params.id, {
      personIds: relationForm.personIds,
      serviceProviderIds: relationForm.serviceProviderIds,
      informationSystemIds: relationForm.informationSystemIds,
      projectIds: relationForm.projectIds,
    })
    ElMessage.success(t('ec.hardware.relation.saveSuccess'))
    router.replace(`/hardware/hardwareAssets/${route.params.id}/detail`)
  } catch (error) {
    ElMessage.error(error.message || t('ec.hardware.relation.saveFailed'))
  } finally {
    submitLoading.value = false
  }
}

onMounted(async () => {
  pageLoading.value = true
  try {
    await Promise.all([loadSupportOptions(), loadDetail()])
  } catch (error) {
    ElMessage.error(error.message || t('ec.hardware.detail.failed'))
  } finally {
    pageLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.hardware-page-card {
  padding: 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #edf0f6;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(28, 53, 91, 0.05);
}

.hardware-page-intro {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #edf0f6;
}

.hardware-page-intro__title {
  color: #151b26;
  font-size: 22px;
  font-weight: 700;
}

.hardware-page-intro__meta {
  margin-top: 6px;
  color: #858a99;
}

.hardware-form-grid {
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
  .hardware-page-card {
    padding: 16px;
  }

  .hardware-form-grid {
    grid-template-columns: 1fr;
  }

  .is-span-2 {
    grid-column: auto;
  }
}
</style>
