<template>
  <figma-resource-page
    hide-tabs
    :title="pageTitle"
    :description="pageDescription"
    back-path="/software/informationSystems"
  >
    <template #actions>
      <el-button @click="router.push('/software/informationSystems')">
        {{ t('ec.global.button.text.cancel') }}
      </el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        {{ t('ec.global.button.text.submit') }}
      </el-button>
    </template>

    <div v-loading="pageLoading" class="software-page-card">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top">
        <section class="software-form-section">
          <div class="software-section-title">{{ t('ec.software.section.basic') }}</div>
          <div class="software-form-grid">
            <el-form-item :label="t('ec.software.common.code')" prop="code">
              <el-input v-model="formData.code" clearable :placeholder="t('ec.software.form.codePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.software.common.name')" prop="name">
              <el-input v-model="formData.name" clearable :placeholder="t('ec.software.form.namePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.software.common.systemType')" prop="systemType">
              <el-select v-model="formData.systemType" :placeholder="t('ec.software.form.systemTypePlaceholder')">
                <el-option v-for="item in systemTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('ec.software.common.versionNo')">
              <el-input v-model="formData.versionNo" clearable :placeholder="t('ec.software.form.versionNoPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.software.common.deploymentArchitecture')" prop="deploymentArchitecture">
              <el-select
                v-model="formData.deploymentArchitecture"
                :placeholder="t('ec.software.form.deploymentArchitecturePlaceholder')"
              >
                <el-option
                  v-for="item in deploymentArchitectureOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('ec.software.common.owner')">
              <ec-object-single-select
                v-model="formData.ownerPersonId"
                :placeholder="t('ec.software.form.ownerPlaceholder')"
                :title="t('ec.software.form.ownerSelectTitle')"
                :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
                :options="personOptions"
                label-key="name"
                value-key="id"
                subtitle-key="employeeNo"
                @change="handleOwnerChange"
              />
            </el-form-item>
            <el-form-item :label="t('ec.software.common.contactPhone')">
              <el-input
                v-model="formData.contactPhone"
                clearable
                :placeholder="t('ec.software.form.contactPhonePlaceholder')"
              />
            </el-form-item>
          </div>
        </section>

        <section class="software-form-section">
          <div class="software-section-title">{{ t('ec.software.section.relations') }}</div>
          <div class="software-form-grid">
            <el-form-item :label="t('ec.software.detail.persons')">
              <ec-object-multi-transfer
                v-model="formData.personIds"
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
                v-model="formData.serviceProviderIds"
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
                v-model="formData.hardwareAssetIds"
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
          </div>
        </section>
      </el-form>
    </div>
  </figma-resource-page>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import {
  createInformationSystem,
  getInformationSystemDetail,
  getSoftwareHardwareOptions,
  getSoftwarePersonOptions,
  getSoftwareServiceProviderOptions,
  updateInformationSystem,
} from '@/services/modules/softwareService'
import EcObjectSingleSelect from '@/components/EcObjectSingleSelect.vue'
import EcObjectMultiTransfer from '@/components/EcObjectMultiTransfer.vue'
import { normalizeIdList } from './helpers'
import FigmaResourcePage from '@/views/organization/components/FigmaResourcePage.vue'

defineOptions({ name: 'SoftwareFormPage' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const formRef = ref(null)
const pageLoading = ref(false)
const submitLoading = ref(false)
const serviceProviderOptions = ref([])
const personOptions = ref([])
const hardwareOptions = ref([])

const formData = reactive({
  code: '',
  name: '',
  systemType: '',
  versionNo: '',
  deploymentArchitecture: '',
  ownerPersonId: null,
  contactPhone: '',
  status: 'ACTIVE',
  remark: '',
  serviceProviderIds: [],
  personIds: [],
  hardwareAssetIds: [],
})

const isEdit = computed(() => Boolean(route.params.id))
const pageTitle = computed(() => (isEdit.value ? t('ec.software.page.editTitle') : t('ec.software.page.createTitle')))
const pageDescription = computed(() => (isEdit.value ? t('ec.software.page.editDescription') : t('ec.software.page.createDescription')))

const systemTypeOptions = computed(() => ([
  { value: 'EXTERNAL_SERVICE', label: t('ec.software.type.externalService') },
  { value: 'INTERNAL_OFFICE', label: t('ec.software.type.internalOffice') },
  { value: 'DATABASE_SOFTWARE', label: t('ec.software.type.databaseSoftware') },
  { value: 'BASIC_SUPPORT', label: t('ec.software.type.basicSupport') },
  { value: 'SECURITY_SOFTWARE', label: t('ec.software.type.securitySoftware') },
]))

const deploymentArchitectureOptions = computed(() => ([
  { value: 'SINGLE', label: t('ec.software.deployment.single') },
  { value: 'CLUSTER', label: t('ec.software.deployment.cluster') },
  { value: 'CONTAINERIZED', label: t('ec.software.deployment.containerized') },
]))

const personMap = computed(() => {
  return new Map((Array.isArray(personOptions.value) ? personOptions.value : []).map((item) => [item.id, item]))
})

const formRules = computed(() => ({
  code: [{ required: true, message: t('ec.software.validation.codeRequired'), trigger: 'blur' }],
  name: [{ required: true, message: t('ec.software.validation.nameRequired'), trigger: 'blur' }],
  systemType: [{ required: true, message: t('ec.software.validation.systemTypeRequired'), trigger: 'change' }],
  deploymentArchitecture: [{ required: true, message: t('ec.software.validation.deploymentArchitectureRequired'), trigger: 'change' }],
}))

const loadSupportData = async () => {
  const [serviceProviders, persons, hardwareAssets] = await Promise.all([
    getSoftwareServiceProviderOptions(),
    getSoftwarePersonOptions(),
    getSoftwareHardwareOptions(),
  ])

  serviceProviderOptions.value = Array.isArray(serviceProviders) ? serviceProviders : []
  personOptions.value = Array.isArray(persons) ? persons : []
  hardwareOptions.value = Array.isArray(hardwareAssets) ? hardwareAssets : []
}

const fillForm = (detail) => {
  const informationSystem = detail?.informationSystem || {}
  formData.code = informationSystem.code || ''
  formData.name = informationSystem.name || ''
  formData.systemType = informationSystem.systemType || ''
  formData.versionNo = informationSystem.versionNo || ''
  formData.deploymentArchitecture = informationSystem.deploymentArchitecture || ''
  formData.ownerPersonId = informationSystem.ownerPersonId ?? null
  formData.contactPhone = informationSystem.contactPhone || ''
  formData.status = informationSystem.status || 'ACTIVE'
  formData.remark = informationSystem.remark || ''
  formData.serviceProviderIds = normalizeIdList(detail?.serviceProviderIds)
  formData.personIds = normalizeIdList(detail?.personIds)
  formData.hardwareAssetIds = normalizeIdList(detail?.hardwareAssetIds)
}

const buildPayload = () => ({
  code: formData.code,
  name: formData.name,
  systemType: formData.systemType,
  versionNo: formData.versionNo,
  deploymentArchitecture: formData.deploymentArchitecture,
  ownerPersonId: formData.ownerPersonId,
  contactPhone: formData.contactPhone,
  status: formData.status,
  remark: formData.remark,
  serviceProviderIds: formData.serviceProviderIds,
  personIds: formData.personIds,
  hardwareAssetIds: formData.hardwareAssetIds,
})

const handleOwnerChange = (value) => {
  const owner = personMap.value.get(value)
  if (owner) {
    formData.contactPhone = owner.mobile || ''
    return
  }
  formData.contactPhone = ''
}

const loadDetail = async () => {
  if (!isEdit.value) return
  const detail = await getInformationSystemDetail(route.params.id)
  fillForm(detail)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const payload = buildPayload()
    const result = isEdit.value
      ? await updateInformationSystem(route.params.id, payload)
      : await createInformationSystem(payload)
    const targetId = result?.id || route.params.id

    ElMessage.success(t('ec.software.common.saveSuccess'))
    router.replace(`/software/informationSystems/${targetId}/detail`)
  } catch (error) {
    ElMessage.error(error.message || t('ec.software.common.saveFailed'))
  } finally {
    submitLoading.value = false
  }
}

onMounted(async () => {
  pageLoading.value = true
  try {
    await loadSupportData()
    await loadDetail()
  } catch (error) {
    ElMessage.error(error.message || t('ec.software.message.supportLoadFailed'))
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

.software-form-section + .software-form-section {
  margin-top: 28px;
}

.software-section-title {
  color: #151b26;
  font-size: 16px;
  font-weight: 700;
}

.software-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 20px;
  margin-top: 20px;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-form-item__content),
  :deep(.el-select),
  :deep(.el-input) {
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
