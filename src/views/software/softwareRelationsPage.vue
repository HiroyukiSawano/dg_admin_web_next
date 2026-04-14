<template>
  <figma-resource-page
    hide-tabs
    :title="t('ec.software.page.relationsTitle')"
    :description="t('ec.software.page.relationsDescription')"
    :back-path="`/software/informationSystems/${route.params.id}/detail`"
  >
    <template #actions>
      <el-button @click="router.push(`/software/informationSystems/${route.params.id}/detail`)">
        {{ t('ec.global.button.text.cancel') }}
      </el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        {{ t('ec.global.button.text.submit') }}
      </el-button>
    </template>

    <div v-loading="pageLoading" class="software-page-card">
      <div class="software-page-intro">
        <div class="software-page-intro__title">{{ detailRecord.informationSystem?.name || '-' }}</div>
        <div class="software-page-intro__meta">{{ detailRecord.informationSystem?.code || '-' }}</div>
      </div>

      <el-form label-position="top" class="software-form-grid">
        <el-form-item :label="t('ec.software.detail.persons')">
          <ec-object-multi-transfer
            v-model="relationForm.personIds"
            :placeholder="t('ec.software.relation.personsPlaceholder')"
            :title="`${t('ec.software.detail.persons')}${t('ec.organization.selector.titleSuffix')}`"
            :selected-title="t('ec.organization.selector.selected')"
            :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
            :options="personOptions"
            label-key="name"
            value-key="id"
            subtitle-key="employeeNo"
          />
        </el-form-item>

        <el-form-item :label="t('ec.software.detail.serviceProviders')">
          <ec-object-multi-transfer
            v-model="relationForm.serviceProviderIds"
            :placeholder="t('ec.software.relation.serviceProvidersPlaceholder')"
            :title="`${t('ec.software.detail.serviceProviders')}${t('ec.organization.selector.titleSuffix')}`"
            :selected-title="t('ec.organization.selector.selected')"
            :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
            :options="serviceProviderOptions"
            label-key="name"
            value-key="id"
            subtitle-key="code"
          />
        </el-form-item>

        <el-form-item :label="t('ec.software.detail.hardwareAssets')" class="is-span-2">
          <ec-object-multi-transfer
            v-model="relationForm.hardwareAssetIds"
            :placeholder="t('ec.software.relation.hardwareAssetsPlaceholder')"
            :title="`${t('ec.software.detail.hardwareAssets')}${t('ec.organization.selector.titleSuffix')}`"
            :selected-title="t('ec.organization.selector.selected')"
            :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
            :options="hardwareOptions"
            label-key="assetName"
            value-key="id"
            subtitle-key="assetCode"
          />
        </el-form-item>

        <el-form-item :label="t('ec.software.detail.middlewares')">
          <ec-object-multi-transfer
            v-model="relationForm.middlewareIds"
            :placeholder="t('ec.software.relation.middlewaresPlaceholder')"
            :title="`${t('ec.software.detail.middlewares')}${t('ec.organization.selector.titleSuffix')}`"
            :selected-title="t('ec.organization.selector.selected')"
            :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
            :options="middlewareOptions"
            label-key="middlewareName"
            value-key="id"
            subtitle-key="middlewareCode"
          />
        </el-form-item>

        <el-form-item :label="t('ec.software.detail.databases')">
          <ec-object-multi-transfer
            v-model="relationForm.databaseIds"
            :placeholder="t('ec.software.relation.databasesPlaceholder')"
            :title="`${t('ec.software.detail.databases')}${t('ec.organization.selector.titleSuffix')}`"
            :selected-title="t('ec.organization.selector.selected')"
            :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
            :options="databaseOptions"
            label-key="databaseName"
            value-key="id"
            subtitle-key="databaseCode"
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
  getSoftwareDatabaseOptions,
  getInformationSystemDetail,
  getSoftwareHardwareOptions,
  getSoftwareMiddlewareOptions,
  getSoftwarePersonOptions,
  getSoftwareServiceProviderOptions,
  syncInformationSystemRelations,
} from '@/services/modules/softwareService'
import EcObjectMultiTransfer from '@/components/EcObjectMultiTransfer.vue'
import { normalizeIdList } from './helpers'
import FigmaResourcePage from '@/views/organization/components/FigmaResourcePage.vue'

defineOptions({ name: 'SoftwareRelationsPage' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const pageLoading = ref(false)
const submitLoading = ref(false)
const detailRecord = ref({ informationSystem: null })
const serviceProviderOptions = ref([])
const personOptions = ref([])
const hardwareOptions = ref([])
const middlewareOptions = ref([])
const databaseOptions = ref([])

const relationForm = reactive({
  serviceProviderIds: [],
  personIds: [],
  hardwareAssetIds: [],
  middlewareIds: [],
  databaseIds: [],
})

const loadSupportOptions = async () => {
  const [serviceProviders, persons, hardwareAssets, middlewares, databases] = await Promise.all([
    getSoftwareServiceProviderOptions(),
    getSoftwarePersonOptions(),
    getSoftwareHardwareOptions(),
    getSoftwareMiddlewareOptions(),
    getSoftwareDatabaseOptions(),
  ])

  serviceProviderOptions.value = Array.isArray(serviceProviders) ? serviceProviders : []
  personOptions.value = Array.isArray(persons) ? persons : []
  hardwareOptions.value = Array.isArray(hardwareAssets) ? hardwareAssets : []
  middlewareOptions.value = Array.isArray(middlewares) ? middlewares : []
  databaseOptions.value = Array.isArray(databases) ? databases : []
}

const loadDetail = async () => {
  const detail = await getInformationSystemDetail(route.params.id)
  detailRecord.value = detail
  relationForm.serviceProviderIds = normalizeIdList(detail.serviceProviderIds)
  relationForm.personIds = normalizeIdList(detail.personIds)
  relationForm.hardwareAssetIds = normalizeIdList(detail.hardwareAssetIds)
  relationForm.middlewareIds = normalizeIdList(detail.middlewareIds)
  relationForm.databaseIds = normalizeIdList(detail.databaseIds)
}

const handleSubmit = async () => {
  submitLoading.value = true
  try {
    await syncInformationSystemRelations(route.params.id, {
      serviceProviderIds: relationForm.serviceProviderIds,
      personIds: relationForm.personIds,
      hardwareAssetIds: relationForm.hardwareAssetIds,
      middlewareIds: relationForm.middlewareIds,
      databaseIds: relationForm.databaseIds,
    })
    ElMessage.success(t('ec.software.relation.saveSuccess'))
    router.replace(`/software/informationSystems/${route.params.id}/detail`)
  } catch (error) {
    ElMessage.error(error.message || t('ec.software.relation.saveFailed'))
  } finally {
    submitLoading.value = false
  }
}

onMounted(async () => {
  pageLoading.value = true
  try {
    await Promise.all([loadSupportOptions(), loadDetail()])
  } catch (error) {
    ElMessage.error(error.message || t('ec.software.message.detailFailed'))
  } finally {
    pageLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.software-page-card {
  padding: 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #edf0f6;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(28, 53, 91, 0.05);
}

.software-page-intro {
  padding-bottom: 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid #edf0f6;
}

.software-page-intro__title {
  color: #151b26;
  font-size: 22px;
  font-weight: 700;
}

.software-page-intro__meta {
  margin-top: 6px;
  color: #858a99;
}

.software-form-grid {
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
  .software-page-card {
    padding: 16px;
  }

  .software-form-grid {
    grid-template-columns: 1fr;
  }

  .is-span-2 {
    grid-column: auto;
  }
}
</style>
