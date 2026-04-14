<template>
  <figma-resource-page
    active-tab="informationSystems"
    :breadcrumbs="pageBreadcrumbs"
    back-text="返回"
    back-path="/software/informationSystems"
  >
    <div v-loading="pageLoading" class="software-page-card">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
        class="software-form"
      >
        <section class="software-form-section">
          <div class="software-section-title">{{ t('ec.software.section.basic') }}</div>
          <div class="software-form-grid">
            <el-form-item prop="code">
              <template #label>
                <span class="software-form-label">
                  {{ t('ec.software.common.code') }}
                  <span class="software-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.code" clearable :placeholder="t('ec.software.form.codePlaceholder')" />
            </el-form-item>
            
            <el-form-item prop="name">
              <template #label>
                <span class="software-form-label">
                  {{ t('ec.software.common.name') }}
                  <span class="software-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.name" clearable :placeholder="t('ec.software.form.namePlaceholder')" />
            </el-form-item>
            
            <el-form-item prop="systemType">
              <template #label>
                <span class="software-form-label">
                  {{ t('ec.software.common.systemType') }}
                  <span class="software-form-label__required">*</span>
                </span>
              </template>
              <el-select v-model="formData.systemType" clearable :placeholder="t('ec.software.form.systemTypePlaceholder')">
                <el-option v-for="item in systemTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            
            <el-form-item prop="versionNo">
              <template #label>
                <span class="software-form-label">
                  {{ t('ec.software.common.versionNo') }}
                  <span class="software-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.versionNo" clearable :placeholder="t('ec.software.form.versionNoPlaceholder')" />
            </el-form-item>
            
            <el-form-item prop="deploymentArchitecture">
              <template #label>
                <span class="software-form-label">
                  {{ t('ec.software.common.deploymentArchitecture') }}
                  <span class="software-form-label__required">*</span>
                </span>
              </template>
              <el-select
                v-model="formData.deploymentArchitecture"
                clearable
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
            
            <el-form-item prop="ownerName">
              <template #label>
                <span class="software-form-label">
                  {{ t('ec.software.common.owner') }}
                  <span class="software-form-label__required">*</span>
                </span>
              </template>
              <el-input
                v-model="formData.ownerName"
                clearable
                :placeholder="t('ec.software.form.ownerPlaceholder')"
              />
            </el-form-item>
            
            <el-form-item prop="contactPhone">
              <template #label>
                <span class="software-form-label">
                  {{ t('ec.software.common.contactPhone') }}
                  <span class="software-form-label__required">*</span>
                </span>
              </template>
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
          <div class="software-form-grid software-form-grid--relation">
            <el-form-item class="software-form-item--transfer">
              <template #label>
                <span class="software-form-label">
                  {{ t('ec.software.detail.persons') }}
                </span>
              </template>
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
            
            <el-form-item class="software-form-item--transfer">
              <template #label>
                <span class="software-form-label">
                  {{ t('ec.software.detail.serviceProviders') }}
                </span>
              </template>
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
            
            <el-form-item class="software-form-item--transfer">
              <template #label>
                <span class="software-form-label">
                  {{ t('ec.software.detail.hardwareAssets') }}
                </span>
              </template>
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
        
        <div class="software-form-actions">
          <el-button type="primary" :loading="submitLoading" class="software-form-actions__submit" @click="handleSubmit">
            {{ t('ec.global.button.text.confirm') }}
          </el-button>
          <el-button class="software-form-actions__cancel" @click="router.push('/software/informationSystems')">
            {{ t('ec.global.button.text.cancel') }}
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
  createInformationSystem,
  getInformationSystemDetail,
  getSoftwareHardwareOptions,
  getSoftwarePersonOptions,
  getSoftwareServiceProviderOptions,
  updateInformationSystem,
} from '@/services/modules/softwareService'
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
  ownerName: '',
  contactPhone: '',
  status: 'ACTIVE',
  remark: '',
  serviceProviderIds: [],
  personIds: [],
  hardwareAssetIds: [],
})

const isEdit = computed(() => Boolean(route.params.id))
const pageBreadcrumbs = computed(() => ([
  { label: 'ec.menu.name.software' },
  { label: isEdit.value ? 'ec.software.page.editTitle' : 'ec.software.page.createTitle' },
]))

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

const formRules = computed(() => ({
  code: [{ required: true, message: t('ec.software.validation.codeRequired'), trigger: 'blur' }],
  name: [{ required: true, message: t('ec.software.validation.nameRequired'), trigger: 'blur' }],
  systemType: [{ required: true, message: t('ec.software.validation.systemTypeRequired'), trigger: 'change' }],
  versionNo: [{ required: true, message: t('ec.software.validation.versionNoRequired'), trigger: 'blur' }],
  deploymentArchitecture: [{ required: true, message: t('ec.software.validation.deploymentArchitectureRequired'), trigger: 'change' }],
  ownerName: [{ required: true, message: t('ec.software.validation.ownerRequired'), trigger: 'blur' }],
  contactPhone: [{ required: true, message: t('ec.software.validation.contactPhoneRequired'), trigger: 'blur' }],
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
  formData.ownerName = informationSystem.ownerName || ''
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
  ownerName: formData.ownerName,
  contactPhone: formData.contactPhone,
  status: formData.status,
  remark: formData.remark,
  serviceProviderIds: formData.serviceProviderIds,
  personIds: formData.personIds,
  hardwareAssetIds: formData.hardwareAssetIds,
})

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
  padding: 0 4px 0 0;
  background: transparent;
}

.software-form {
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
  :deep(.el-input) {
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
  :deep(.el-form-item.is-error .ec-object-multi-transfer__trigger),
  :deep(.el-form-item.is-error .ec-object-single-select) {
    box-shadow: 0 0 0 1px #db4942 inset;
  }

  :deep(.el-form-item__error) {
    padding-top: 6px;
  }
}

.software-form-section + .software-form-section {
  margin-top: 44px;
}

.software-section-title {
  margin-bottom: 18px;
  color: #151b26;
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
}

.software-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 24px;
}

.software-form-grid--relation {
  gap: 24px 24px;
}

.software-form-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 32px;
}

.software-form-actions__submit,
.software-form-actions__cancel {
  min-width: 68px;
  height: 32px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 14px;
}

.software-form-actions__submit {
  border-color: #2e5ef0;
  background: #2e5ef0;
}

.software-form-actions__cancel {
  color: #555d6d;
  background: #f0f2f5;
  border-color: #f0f2f5;
}

.software-form-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.software-form-label__required {
  color: #db4942;
  line-height: 1;
}

.software-form-item--transfer {
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

:deep(.ec-object-single-select) {
  min-height: 40px;
  padding: 0 14px;
  background: #f5f6f9;
  border: 1px solid transparent;
  border-radius: 4px;
}

:deep(.ec-object-single-select:hover),
:deep(.ec-object-single-select.is-active) {
  background: #fff;
  border-color: transparent;
  box-shadow: 0 0 0 1px #2e5ef0 inset;
}

:deep(.ec-object-single-select__text),
:deep(.ec-object-single-select__suffix) {
  font-size: 14px;
}

:deep(.ec-object-single-select.is-empty .ec-object-single-select__text),
:deep(.ec-object-single-select__suffix) {
  color: #b4b9c3;
}

.is-span-2 {
  grid-column: 1 / -1;
}

@media only screen and (max-width: 991px) {
  .software-form-grid {
    grid-template-columns: 1fr;
  }

  .is-span-2 {
    grid-column: auto;
  }
}
</style>

