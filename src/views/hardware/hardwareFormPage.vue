<template>
  <figma-resource-page
    hide-tabs
    :title="pageTitle"
    :description="pageDescription"
    back-path="/hardware/hardwareAssets"
  >
    <template #actions>
      <el-button @click="router.push('/hardware/hardwareAssets')">
        {{ t('ec.global.button.text.cancel') }}
      </el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        {{ t('ec.global.button.text.submit') }}
      </el-button>
    </template>

    <div v-loading="pageLoading" class="hardware-page-card">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top">
        <section class="hardware-form-section">
          <div class="hardware-section-title">{{ t('ec.hardware.section.basic') }}</div>
          <div class="hardware-form-grid">
            <el-form-item :label="t('ec.hardware.common.assetCode')" prop="assetCode">
              <el-input v-model="formData.assetCode" clearable :placeholder="t('ec.hardware.form.assetCodePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.hardwareIp')" prop="hardwareIp">
              <el-input v-model="formData.hardwareIp" clearable :placeholder="t('ec.hardware.form.hardwareIpPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.assetName')" prop="assetName">
              <el-input v-model="formData.assetName" clearable :placeholder="t('ec.hardware.form.assetNamePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.hardwareModel')" prop="hardwareModel">
              <el-input
                v-model="formData.hardwareModel"
                clearable
                :placeholder="t('ec.hardware.form.hardwareModelPlaceholder')"
              />
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.hardwareBrand')" prop="hardwareBrand">
              <el-input
                v-model="formData.hardwareBrand"
                clearable
                :placeholder="t('ec.hardware.form.hardwareBrandPlaceholder')"
              />
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.hardwareType')" prop="hardwareType">
              <el-select v-model="formData.hardwareType" :placeholder="t('ec.hardware.form.hardwareTypePlaceholder')">
                <el-option v-for="item in hardwareTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.physicalLocation')" prop="physicalLocation">
              <el-input
                v-model="formData.physicalLocation"
                clearable
                :placeholder="t('ec.hardware.form.physicalLocationPlaceholder')"
              />
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.networkEnvironment')" prop="networkEnvironment">
              <el-select
                v-model="formData.networkEnvironment"
                clearable
                :placeholder="t('ec.hardware.form.networkEnvironmentPlaceholder')"
              >
                <el-option
                  v-for="item in networkEnvironmentOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.operatingSystem')" prop="operatingSystem">
              <el-input
                v-model="formData.operatingSystem"
                clearable
                :placeholder="t('ec.hardware.form.operatingSystemPlaceholder')"
              />
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.status')" prop="hardwareStatus">
              <el-select v-model="formData.hardwareStatus" :placeholder="t('ec.hardware.form.statusPlaceholder')">
                <el-option v-for="item in hardwareStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.purchaseDate')" prop="purchaseDate">
              <el-date-picker
                v-model="formData.purchaseDate"
                type="date"
                value-format="YYYY-MM-DD"
                class="hardware-date-picker"
                :placeholder="t('ec.hardware.form.purchaseDatePlaceholder')"
              />
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.owner')" prop="ownerPersonId">
              <ec-object-single-select
                v-model="formData.ownerPersonId"
                :placeholder="t('ec.hardware.form.ownerPlaceholder')"
                :title="t('ec.hardware.form.ownerSelectTitle')"
                :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
                :options="personOptions"
                label-key="name"
                value-key="id"
                subtitle-key="employeeNo"
                @change="handleOwnerChange"
              />
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.contactPhone')" prop="contactPhone" class="is-span-2">
              <el-input
                v-model="formData.contactPhone"
                clearable
                :placeholder="t('ec.hardware.form.contactPhonePlaceholder')"
              />
            </el-form-item>
          </div>
        </section>

        <section class="hardware-form-section">
          <div class="hardware-section-title">{{ t('ec.hardware.section.relations') }}</div>
          <div class="hardware-form-grid">
            <el-form-item :label="t('ec.hardware.detail.persons')" class="is-span-2">
              <ec-object-multi-transfer
                v-model="formData.personIds"
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
                v-model="formData.serviceProviderIds"
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
                v-model="formData.informationSystemIds"
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
                v-model="formData.projectIds"
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
  createHardwareAsset,
  getHardwareAssetDetail,
  getHardwarePersonOptions,
  getHardwareProjectOptions,
  getHardwareSystemOptions,
  getHardwareVendorOptions,
  syncHardwareRelations,
  updateHardwareAsset,
} from '@/services/modules/hardwareService'
import EcObjectSingleSelect from '@/components/EcObjectSingleSelect.vue'
import EcObjectMultiTransfer from '@/components/EcObjectMultiTransfer.vue'
import { normalizeIdList } from './helpers'
import FigmaResourcePage from '@/views/organization/components/FigmaResourcePage.vue'

defineOptions({ name: 'HardwareFormPage' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const formRef = ref(null)
const pageLoading = ref(false)
const submitLoading = ref(false)
const serviceProviderOptions = ref([])
const personOptions = ref([])
const softwareOptions = ref([])
const projectOptions = ref([])

const formData = reactive({
  assetCode: '',
  assetName: '',
  hardwareIp: '',
  hardwareModel: '',
  hardwareBrand: '',
  hardwareType: '',
  physicalLocation: '',
  networkEnvironment: '',
  operatingSystem: '',
  hardwareStatus: 'RUNNING',
  purchaseDate: '',
  ownerPersonId: null,
  contactPhone: '',
  remark: '',
  personIds: [],
  serviceProviderIds: [],
  informationSystemIds: [],
  projectIds: [],
})

const isEdit = computed(() => Boolean(route.params.id))
const pageTitle = computed(() => (isEdit.value ? t('ec.hardware.page.editTitle') : t('ec.hardware.page.createTitle')))
const pageDescription = computed(() => (isEdit.value ? t('ec.hardware.page.editDescription') : t('ec.hardware.page.createDescription')))

const hardwareTypeOptions = computed(() => ([
  { value: 'SERVER', label: t('ec.hardware.type.server') },
  { value: 'NETWORK_DEVICE', label: t('ec.hardware.type.networkDevice') },
  { value: 'TERMINAL_DEVICE', label: t('ec.hardware.type.terminalDevice') },
  { value: 'PERIPHERAL', label: t('ec.hardware.type.peripheral') },
]))

const hardwareStatusOptions = computed(() => ([
  { value: 'RUNNING', label: t('ec.hardware.status.running') },
  { value: 'MAINTENANCE', label: t('ec.hardware.status.maintenance') },
  { value: 'IDLE', label: t('ec.hardware.status.idle') },
  { value: 'SCRAPPED', label: t('ec.hardware.status.scrapped') },
]))

const networkEnvironmentOptions = computed(() => ([
  { value: 'EXTRANET', label: t('ec.hardware.networkEnvironment.extranet') },
  { value: 'INTRANET', label: t('ec.hardware.networkEnvironment.intranet') },
  { value: 'EXTRANET_INTRANET', label: t('ec.hardware.networkEnvironment.extranetIntranet') },
]))

const personMap = computed(() => {
  return new Map((Array.isArray(personOptions.value) ? personOptions.value : []).map((item) => [item.id, item]))
})

const formRules = computed(() => ({
  assetCode: [{ required: true, message: t('ec.hardware.validation.assetCodeRequired'), trigger: 'blur' }],
  hardwareIp: [{ required: true, message: t('ec.hardware.validation.hardwareIpRequired'), trigger: 'blur' }],
  assetName: [{ required: true, message: t('ec.hardware.validation.assetNameRequired'), trigger: 'blur' }],
  hardwareModel: [{ required: true, message: t('ec.hardware.validation.hardwareModelRequired'), trigger: 'blur' }],
  hardwareBrand: [{ required: true, message: t('ec.hardware.validation.hardwareBrandRequired'), trigger: 'blur' }],
  hardwareType: [{ required: true, message: t('ec.hardware.validation.hardwareTypeRequired'), trigger: 'change' }],
  physicalLocation: [{ required: true, message: t('ec.hardware.validation.physicalLocationRequired'), trigger: 'blur' }],
  networkEnvironment: [{ required: true, message: t('ec.hardware.validation.networkEnvironmentRequired'), trigger: 'change' }],
  operatingSystem: [{ required: true, message: t('ec.hardware.validation.operatingSystemRequired'), trigger: 'blur' }],
  hardwareStatus: [{ required: true, message: t('ec.hardware.validation.statusRequired'), trigger: 'change' }],
  purchaseDate: [{ required: true, message: t('ec.hardware.validation.purchaseDateRequired'), trigger: 'change' }],
  ownerPersonId: [{ required: true, message: t('ec.hardware.validation.ownerRequired'), trigger: 'change' }],
  contactPhone: [{ required: true, message: t('ec.hardware.validation.contactPhoneRequired'), trigger: 'blur' }],
}))

const loadSupportData = async () => {
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

const fillForm = (detail) => {
  const hardwareAsset = detail?.hardwareAsset || {}
  formData.assetCode = hardwareAsset.assetCode || ''
  formData.assetName = hardwareAsset.assetName || ''
  formData.hardwareIp = hardwareAsset.hardwareIp || ''
  formData.hardwareModel = hardwareAsset.hardwareModel || ''
  formData.hardwareBrand = hardwareAsset.hardwareBrand || ''
  formData.hardwareType = hardwareAsset.hardwareType || ''
  formData.physicalLocation = hardwareAsset.physicalLocation || ''
  formData.networkEnvironment = hardwareAsset.networkEnvironment || ''
  formData.operatingSystem = hardwareAsset.operatingSystem || ''
  formData.hardwareStatus = hardwareAsset.hardwareStatus || 'RUNNING'
  formData.purchaseDate = hardwareAsset.purchaseDate || ''
  formData.ownerPersonId = hardwareAsset.ownerPersonId ?? null
  formData.contactPhone = hardwareAsset.contactPhone || ''
  formData.remark = hardwareAsset.remark || ''
  formData.personIds = normalizeIdList(detail?.personIds)
  formData.serviceProviderIds = normalizeIdList(detail?.serviceProviderIds)
  formData.informationSystemIds = normalizeIdList(detail?.informationSystemIds)
  formData.projectIds = normalizeIdList(detail?.projectIds)
}

const buildPayload = () => ({
  assetCode: formData.assetCode,
  assetName: formData.assetName,
  hardwareIp: formData.hardwareIp,
  hardwareModel: formData.hardwareModel,
  hardwareBrand: formData.hardwareBrand,
  hardwareType: formData.hardwareType,
  physicalLocation: formData.physicalLocation,
  networkEnvironment: formData.networkEnvironment,
  operatingSystem: formData.operatingSystem,
  hardwareStatus: formData.hardwareStatus,
  purchaseDate: formData.purchaseDate,
  ownerPersonId: formData.ownerPersonId,
  contactPhone: formData.contactPhone,
  remark: formData.remark,
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
  const detail = await getHardwareAssetDetail(route.params.id)
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
      ? await updateHardwareAsset(route.params.id, payload)
      : await createHardwareAsset(payload)
    const targetId = result?.id || route.params.id

    await syncHardwareRelations(targetId, {
      personIds: formData.personIds,
      serviceProviderIds: formData.serviceProviderIds,
      informationSystemIds: formData.informationSystemIds,
      projectIds: formData.projectIds,
    })

    ElMessage.success(t('ec.hardware.common.saveSuccess'))
    router.replace(`/hardware/hardwareAssets/${targetId}/detail`)
  } catch (error) {
    ElMessage.error(error.message || t('ec.hardware.common.saveFailed'))
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
    ElMessage.error(error.message || t('ec.hardware.support.failed'))
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

.hardware-form-section + .hardware-form-section {
  margin-top: 28px;
}

.hardware-section-title {
  color: #151b26;
  font-size: 16px;
  font-weight: 700;
}

.hardware-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 20px;
  margin-top: 20px;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-form-item__content),
  :deep(.el-select),
  :deep(.el-input),
  :deep(.hardware-date-picker) {
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
