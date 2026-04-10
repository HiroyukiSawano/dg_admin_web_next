<template>
  <figma-resource-page
    active-tab="hardwareAssets"
    :breadcrumbs="pageBreadcrumbs"
    back-text="返回"
    back-path="/hardware/hardwareAssets"
  >
    <div v-loading="pageLoading" class="hardware-page-card">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
        class="hardware-form"
      >
        <section class="hardware-form-section">
          <div class="hardware-section-title">{{ t('ec.hardware.section.basic') }}</div>
          <div class="hardware-form-grid">
            <el-form-item prop="assetCode">
              <template #label>
                <span class="hardware-form-label">
                  {{ t('ec.hardware.common.assetCode') }}
                  <span class="hardware-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.assetCode" clearable :placeholder="t('ec.hardware.form.assetCodePlaceholder')" />
            </el-form-item>
            
            <el-form-item prop="hardwareIp">
              <template #label>
                <span class="hardware-form-label">
                  {{ t('ec.hardware.common.hardwareIp') }}
                  <span class="hardware-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.hardwareIp" clearable :placeholder="t('ec.hardware.form.hardwareIpPlaceholder')" />
            </el-form-item>
            
            <el-form-item prop="assetName">
              <template #label>
                <span class="hardware-form-label">
                  {{ t('ec.hardware.common.assetName') }}
                  <span class="hardware-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.assetName" clearable :placeholder="t('ec.hardware.form.assetNamePlaceholder')" />
            </el-form-item>
            
            <el-form-item prop="hardwareBrand">
              <template #label>
                <span class="hardware-form-label">
                  {{ t('ec.hardware.common.hardwareBrand') }}
                  <span class="hardware-form-label__required">*</span>
                </span>
              </template>
              <el-input
                v-model="formData.hardwareBrand"
                clearable
                :placeholder="t('ec.hardware.form.hardwareBrandPlaceholder')"
              />
            </el-form-item>
            
            <el-form-item prop="hardwareModel">
              <template #label>
                <span class="hardware-form-label">
                  {{ t('ec.hardware.common.hardwareModel') }}
                  <span class="hardware-form-label__required">*</span>
                </span>
              </template>
              <el-input
                v-model="formData.hardwareModel"
                clearable
                :placeholder="t('ec.hardware.form.hardwareModelPlaceholder')"
              />
            </el-form-item>
            
            <el-form-item prop="physicalLocation">
              <template #label>
                <span class="hardware-form-label">
                  {{ t('ec.hardware.common.physicalLocation') }}
                  <span class="hardware-form-label__required">*</span>
                </span>
              </template>
              <el-input
                v-model="formData.physicalLocation"
                clearable
                :placeholder="t('ec.hardware.form.physicalLocationPlaceholder')"
              />
            </el-form-item>

            <el-form-item prop="hardwareType">
              <template #label>
                <span class="hardware-form-label">
                  {{ t('ec.hardware.common.hardwareType') }}
                  <span class="hardware-form-label__required">*</span>
                </span>
              </template>
              <el-select v-model="formData.hardwareType" clearable :placeholder="t('ec.hardware.form.hardwareTypePlaceholder')">
                <el-option v-for="item in hardwareTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            
            <el-form-item prop="operatingSystem">
              <template #label>
                <span class="hardware-form-label">
                  {{ t('ec.hardware.common.operatingSystem') }}
                  <span class="hardware-form-label__required">*</span>
                </span>
              </template>
              <el-input
                v-model="formData.operatingSystem"
                clearable
                :placeholder="t('ec.hardware.form.operatingSystemPlaceholder')"
              />
            </el-form-item>
            
            <el-form-item prop="networkEnvironment">
              <template #label>
                <span class="hardware-form-label">
                  {{ t('ec.hardware.common.networkEnvironment') }}
                  <span class="hardware-form-label__required">*</span>
                </span>
              </template>
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
            
            <el-form-item prop="purchaseDate">
              <template #label>
                <span class="hardware-form-label">
                  {{ t('ec.hardware.common.purchaseDate') }}
                  <span class="hardware-form-label__required">*</span>
                </span>
              </template>
              <el-date-picker
                v-model="formData.purchaseDate"
                type="date"
                value-format="YYYY-MM-DD"
                class="hardware-date-picker"
                clearable
                :placeholder="t('ec.hardware.form.purchaseDatePlaceholder')"
              />
            </el-form-item>
            
            <el-form-item prop="hardwareStatus">
              <template #label>
                <span class="hardware-form-label">
                  {{ t('ec.hardware.common.status') }}
                  <span class="hardware-form-label__required">*</span>
                </span>
              </template>
              <el-select v-model="formData.hardwareStatus" clearable :placeholder="t('ec.hardware.form.statusPlaceholder')">
                <el-option v-for="item in hardwareStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            
            <el-form-item prop="contactPhone">
              <template #label>
                <span class="hardware-form-label">
                  {{ t('ec.hardware.common.contactPhone') }}
                  <span class="hardware-form-label__required">*</span>
                </span>
              </template>
              <el-input
                v-model="formData.contactPhone"
                clearable
                :placeholder="t('ec.hardware.form.contactPhonePlaceholder')"
              />
            </el-form-item>
            
            <el-form-item prop="ownerName">
              <template #label>
                <span class="hardware-form-label">
                  {{ t('ec.hardware.common.owner') }}
                  <span class="hardware-form-label__required">*</span>
                </span>
              </template>
              <el-input
                v-model="formData.ownerName"
                clearable
                :placeholder="t('ec.hardware.form.ownerPlaceholder')"
              />
            </el-form-item>
          </div>
        </section>

        <section class="hardware-form-section">
          <div class="hardware-section-title">{{ t('ec.hardware.section.relations') }}</div>
          <div class="hardware-form-grid hardware-form-grid--relation">
            <el-form-item class="hardware-form-item--transfer is-span-2">
              <template #label>
                <span class="hardware-form-label">
                  {{ t('ec.hardware.detail.persons') }}
                </span>
              </template>
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
            
            <el-form-item class="hardware-form-item--transfer">
              <template #label>
                <span class="hardware-form-label">
                  {{ t('ec.hardware.detail.serviceProviders') }}
                </span>
              </template>
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
            
            <el-form-item class="hardware-form-item--transfer">
              <template #label>
                <span class="hardware-form-label">
                  {{ t('ec.hardware.detail.softwareAssets') }}
                </span>
              </template>
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
          </div>
        </section>
        
        <div class="hardware-form-actions">
          <el-button type="primary" :loading="submitLoading" class="hardware-form-actions__submit" @click="handleSubmit">
            确认
          </el-button>
          <el-button class="hardware-form-actions__cancel" @click="router.push('/hardware/hardwareAssets')">
            取消
          </el-button>
        </div>
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
  ownerName: '',
  contactPhone: '',
  remark: '',
  personIds: [],
  serviceProviderIds: [],
  informationSystemIds: [],
  projectIds: [],
})

const isEdit = computed(() => Boolean(route.params.id))
const pageBreadcrumbs = computed(() => ([
  { label: 'ec.menu.name.hardwareAssets' },
  { label: isEdit.value ? 'ec.hardware.page.editTitle' : 'ec.hardware.page.createTitle' },
]))

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
  ownerName: [{ required: true, message: t('ec.hardware.validation.ownerRequired'), trigger: 'blur' }],
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
  formData.ownerName = hardwareAsset.ownerName || ''
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
  ownerName: formData.ownerName,
  contactPhone: formData.contactPhone,
  remark: formData.remark,
})

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
      projectIds: formData.projectIds, // Keeps projects when relations sync runs
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
  padding: 0 4px 0 0;
  background: transparent;
}

.hardware-form {
  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-form-item__label) {
    display: inline-flex;
    align-items: center;
    padding-bottom: 8px;
    color: #444a57;
    font-size: 14px;
    line-height: 22px;
  }

  :deep(.el-form-item__label-wrap) {
    margin: 0;
  }

  :deep(.el-form-item.is-required:not(.is-no-asterisk) > .el-form-item__label:before),
  :deep(.el-form-item.is-required:not(.is-no-asterisk) .el-form-item__label:before) {
    display: none;
  }

  :deep(.el-form-item__content),
  :deep(.el-select),
  :deep(.el-input),
  :deep(.hardware-date-picker) {
    width: 100%;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper) {
    min-height: 40px;
    padding: 0 14px;
    background: #f5f6f9;
    box-shadow: none;
    border-radius: 4px;
  }

  :deep(.el-input__wrapper.is-focus),
  :deep(.el-select__wrapper.is-focused) {
    background: #fff;
    box-shadow: 0 0 0 1px #2e5ef0 inset;
  }

  :deep(.el-input__inner),
  :deep(.el-select__placeholder),
  :deep(.el-select__selected-item) {
    color: #444a57;
    font-size: 14px;
    line-height: 22px;
  }

  :deep(.el-input__inner::placeholder) {
    color: #b4b9c3;
  }

  :deep(.el-select__placeholder.is-transparent) {
    color: #b4b9c3;
  }

  :deep(.el-form-item.is-error .el-input__wrapper),
  :deep(.el-form-item.is-error .el-select__wrapper),
  :deep(.el-form-item.is-error .ec-object-multi-transfer__trigger) {
    box-shadow: 0 0 0 1px #db4942 inset;
  }

  :deep(.el-form-item__error) {
    padding-top: 6px;
  }
}

.hardware-form-section + .hardware-form-section {
  margin-top: 44px;
}

.hardware-section-title {
  margin-bottom: 18px;
  color: #151b26;
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
}

.hardware-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 24px;
}

.hardware-form-grid--relation {
  gap: 24px 24px;
}

.hardware-form-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 32px;
}

.hardware-form-actions__submit,
.hardware-form-actions__cancel {
  min-width: 68px;
  height: 32px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 14px;
}

.hardware-form-actions__submit {
  border-color: #2e5ef0;
  background: #2e5ef0;
}

.hardware-form-actions__cancel {
  color: #555d6d;
  background: #f0f2f5;
  border-color: #f0f2f5;
}

.hardware-form-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.hardware-form-label__required {
  color: #db4942;
  line-height: 1;
}

.is-span-2 {
  grid-column: 1 / -1;
}

.hardware-form-item--transfer {
  :deep(.ec-object-multi-transfer__trigger) {
    min-height: 40px;
    padding: 6px 14px;
    background: #f5f6f9;
    border: 1px solid transparent;
    border-radius: 4px;
  }

  :deep(.ec-object-multi-transfer__tag) {
    height: 28px;
    padding: 0 10px;
    color: #555d6d;
    background: #fff;
    border: 1px solid #e6e8ed;
    border-radius: 4px;
    line-height: 26px;
  }

  :deep(.ec-object-multi-transfer__placeholder),
  :deep(.ec-object-multi-transfer__suffix) {
    color: #b4b9c3;
    font-size: 14px;
  }

  :deep(.ec-object-multi-transfer__trigger.is-active) {
    background: #fff;
  }
}

@media only screen and (max-width: 991px) {
  .hardware-form-grid {
    grid-template-columns: 1fr;
  }

  .is-span-2 {
    grid-column: auto;
  }
}
</style>
