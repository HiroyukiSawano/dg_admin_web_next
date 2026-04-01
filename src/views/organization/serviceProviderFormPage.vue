<template>
  <figma-resource-page
    active-tab="serviceProviders"
    :title="pageTitle"
    :description="pageDescription"
    back-path="/organization/service-providers"
  >
    <template #actions>
      <el-button @click="router.push('/organization/service-providers')">
        {{ t('ec.global.button.text.cancel') }}
      </el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        {{ t('ec.global.button.text.submit') }}
      </el-button>
    </template>

    <div v-loading="pageLoading" class="organization-page-card">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top">
        <section class="organization-form-section">
          <div class="organization-section-title">{{ t('ec.organization.serviceProvider.section.basicInfo') }}</div>
          <div class="organization-form-grid">
            <el-form-item :label="t('ec.organization.common.code')" prop="code">
              <el-input v-model="formData.code" clearable :placeholder="t('ec.organization.serviceProvider.form.codePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.organization.common.name')" prop="name">
              <el-input v-model="formData.name" clearable :placeholder="t('ec.organization.serviceProvider.form.namePlaceholder')" />
            </el-form-item>

            <el-form-item :label="t('ec.organization.serviceProvider.table.unifiedSocialCreditCode')">
              <el-input
                v-model="formData.unifiedSocialCreditCode"
                clearable
                :placeholder="t('ec.organization.serviceProvider.form.unifiedSocialCreditCodePlaceholder')"
              />
            </el-form-item>
            <el-form-item :label="t('ec.organization.serviceProvider.form.shortName')">
              <el-input v-model="formData.shortName" clearable :placeholder="t('ec.organization.serviceProvider.form.shortNamePlaceholder')" />
            </el-form-item>

            <el-form-item :label="t('ec.organization.serviceProvider.form.enterpriseNature')">
              <el-select v-model="formData.enterpriseNature" clearable :placeholder="t('ec.organization.serviceProvider.form.enterpriseNaturePlaceholder')">
                <el-option v-for="item in enterpriseNatureOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('ec.organization.serviceProvider.table.cooperationScopes')" prop="cooperationScopes">
              <el-select
                v-model="formData.cooperationScopes"
                multiple
                filterable
                collapse-tags
                collapse-tags-tooltip
                :placeholder="t('ec.organization.serviceProvider.form.cooperationScopePlaceholder')"
              >
                <el-option v-for="item in cooperationScopeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item :label="t('ec.organization.serviceProvider.form.vendorLevel')">
              <el-select v-model="formData.vendorLevel" clearable :placeholder="t('ec.organization.serviceProvider.form.vendorLevelPlaceholder')">
                <el-option v-for="item in vendorLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('ec.organization.serviceProvider.form.businessContact')">
              <el-input v-model="formData.businessContact" clearable :placeholder="t('ec.organization.serviceProvider.form.businessContactPlaceholder')" />
            </el-form-item>

            <el-form-item :label="t('ec.organization.serviceProvider.form.businessPhone')" class="is-span-2">
              <el-input v-model="formData.businessPhone" clearable :placeholder="t('ec.organization.serviceProvider.form.businessPhonePlaceholder')" />
            </el-form-item>

            <el-form-item :label="t('ec.organization.serviceProvider.form.logoUrl')" class="is-span-2">
              <div class="organization-logo-field">
                <el-upload
                  class="organization-logo-upload__control"
                  action="#"
                  :accept="imageAccept"
                  :auto-upload="true"
                  :before-upload="beforeLogoUpload"
                  :http-request="handleLogoUpload"
                  :show-file-list="false"
                >
                  <div class="organization-logo-upload" :class="{ 'is-filled': Boolean(formData.logoUrl), 'is-loading': logoUploading }">
                    <template v-if="formData.logoUrl">
                      <img class="organization-logo-upload__image" :src="formData.logoUrl" alt="logo preview" />
                      <div class="organization-logo-upload__mask">
                        <i class="ri-image-edit-line"></i>
                        <span>{{ t('ec.organization.serviceProvider.form.logoReplace') }}</span>
                      </div>
                    </template>
                    <template v-else>
                      <i class="ri-add-line"></i>
                      <span>{{ t('ec.organization.serviceProvider.form.logoUpload') }}</span>
                    </template>
                  </div>
                </el-upload>
                <el-button v-if="formData.logoUrl" link type="danger" class="organization-logo-remove" @click="handleLogoRemove">
                  {{ t('ec.organization.serviceProvider.form.logoRemove') }}
                </el-button>
              </div>
            </el-form-item>

            <el-form-item :label="t('ec.organization.serviceProvider.table.score')" class="is-span-2">
              <div class="organization-score-field">
                <el-rate v-model="formData.score" :max="5" />
                <span class="organization-score-field__value">{{ formData.score || 0 }}</span>
              </div>
            </el-form-item>
          </div>
        </section>

        <section class="organization-form-section">
          <div class="organization-section-title">{{ t('ec.organization.serviceProvider.section.relationInfo') }}</div>
          <div class="organization-form-grid">
            <el-form-item :label="t('ec.organization.serviceProvider.relations.persons')" class="is-span-2">
              <ec-object-multi-transfer
                v-model="formData.personIds"
                :placeholder="t('ec.organization.serviceProvider.relation.personsPlaceholder')"
                :title="`${t('ec.organization.serviceProvider.relations.persons')}${t('ec.organization.selector.titleSuffix')}`"
                :selected-title="t('ec.organization.selector.selected')"
                :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
                :options="personOptions"
                label-key="displayLabel"
                value-key="id"
              />
            </el-form-item>

            <el-form-item :label="t('ec.organization.serviceProvider.relations.softwareAssets')">
              <ec-object-multi-transfer
                v-model="formData.informationSystemIds"
                :placeholder="t('ec.organization.serviceProvider.relation.informationSystemsPlaceholder')"
                :title="`${t('ec.organization.serviceProvider.relations.softwareAssets')}${t('ec.organization.selector.titleSuffix')}`"
                :selected-title="t('ec.organization.selector.selected')"
                :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
                :options="informationSystemOptions"
                label-key="displayLabel"
                value-key="id"
              />
            </el-form-item>

            <el-form-item :label="t('ec.organization.serviceProvider.relations.hardwareAssets')">
              <ec-object-multi-transfer
                v-model="formData.hardwareAssetIds"
                :placeholder="t('ec.organization.serviceProvider.relation.hardwareAssetsPlaceholder')"
                :title="`${t('ec.organization.serviceProvider.relations.hardwareAssets')}${t('ec.organization.selector.titleSuffix')}`"
                :selected-title="t('ec.organization.selector.selected')"
                :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
                :options="hardwareOptions"
                label-key="displayLabel"
                value-key="id"
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
import { getStatusDictionaries } from '@/services/modules/dictionaryService'
import { buildStatusOptionMap } from '@/utils/statusDictionary'
import {
  createServiceProvider,
  getOrganizationHardwareOptions,
  getOrganizationInformationSystemOptions,
  getOrganizationPersonOptions,
  getServiceProviderDetail,
  updateServiceProvider,
  uploadOrganizationImage,
} from '@/services/modules/organizationService'
import EcObjectMultiTransfer from '@/components/EcObjectMultiTransfer.vue'
import FigmaResourcePage from './components/FigmaResourcePage.vue'

defineOptions({ name: 'OrganizationServiceProviderFormPage' })

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const formRef = ref(null)
const pageLoading = ref(false)
const submitLoading = ref(false)
const logoUploading = ref(false)
const statusDictionaries = ref({})
const hardwareOptions = ref([])
const informationSystemOptions = ref([])
const personOptions = ref([])

const imageAccept = '.png,.jpg,.jpeg,.webp,.svg'

const formData = reactive({
  code: '',
  name: '',
  shortName: '',
  logoUrl: '',
  unifiedSocialCreditCode: '',
  enterpriseNature: '',
  cooperationScopes: [],
  vendorLevel: '',
  score: 0,
  businessContact: '',
  businessPhone: '',
  status: '',
  remark: '',
  personIds: [],
  informationSystemIds: [],
  hardwareAssetIds: [],
})

const isEdit = computed(() => Boolean(route.params.id))

const pageTitle = computed(() => {
  return isEdit.value ? t('ec.organization.serviceProvider.page.editTitle') : t('ec.organization.serviceProvider.page.createTitle')
})

const pageDescription = computed(() => {
  return isEdit.value ? t('ec.organization.serviceProvider.page.editDescription') : t('ec.organization.serviceProvider.page.createDescription')
})

const enterpriseNatureOptions = computed(() => ([
  { value: 'CENTRAL_STATE_OWNED', label: t('ec.organization.serviceProvider.enterpriseNature.centralStateOwned') },
  { value: 'STATE_OWNED', label: t('ec.organization.serviceProvider.enterpriseNature.stateOwned') },
  { value: 'PRIVATE', label: t('ec.organization.serviceProvider.enterpriseNature.private') },
  { value: 'PUBLIC_INSTITUTION', label: t('ec.organization.serviceProvider.enterpriseNature.publicInstitution') },
]))

const cooperationScopeOptions = computed(() => ([
  { value: 'SOFTWARE_DEVELOPMENT', label: t('ec.organization.serviceProvider.scope.softwareDevelopment') },
  { value: 'OPERATIONS_SERVICE', label: t('ec.organization.serviceProvider.scope.operationsService') },
  { value: 'HARDWARE_PROCUREMENT', label: t('ec.organization.serviceProvider.scope.hardwareProcurement') },
  { value: 'INTEGRATION', label: t('ec.organization.serviceProvider.scope.integration') },
]))

const vendorLevelOptions = computed(() => ([
  { value: 'STRATEGIC_PARTNER', label: t('ec.organization.serviceProvider.vendorLevel.strategicPartner') },
  { value: 'CORE_SUPPLIER', label: t('ec.organization.serviceProvider.vendorLevel.coreSupplier') },
  { value: 'GENERAL_SUPPLIER', label: t('ec.organization.serviceProvider.vendorLevel.generalSupplier') },
]))

const serviceProviderStatusOptions = computed(() => {
  return Object.values(buildStatusOptionMap(statusDictionaries.value.serviceProviderStatus, locale.value))
})

const formRules = computed(() => ({
  code: [{ required: true, message: t('ec.organization.serviceProvider.validation.codeRequired'), trigger: 'blur' }],
  name: [{ required: true, message: t('ec.organization.serviceProvider.validation.nameRequired'), trigger: 'blur' }],
  cooperationScopes: [{ required: true, message: t('ec.organization.serviceProvider.validation.cooperationScopesRequired'), trigger: 'change' }],
}))

const buildDisplayLabel = (primary, secondary) => {
  return [primary, secondary].filter(Boolean).join(' / ') || '-'
}

const normalizeIds = (value) => {
  return Array.isArray(value) ? value : []
}

const fillForm = (data = {}, detail = {}) => {
  formData.code = data.code || ''
  formData.name = data.name || ''
  formData.shortName = data.shortName || ''
  formData.logoUrl = data.logoUrl || ''
  formData.unifiedSocialCreditCode = data.unifiedSocialCreditCode || ''
  formData.enterpriseNature = data.enterpriseNature || ''
  formData.cooperationScopes = Array.isArray(data.cooperationScopes) ? data.cooperationScopes : []
  formData.vendorLevel = data.vendorLevel || ''
  formData.score = Number(data.score || 0)
  formData.businessContact = data.businessContact || ''
  formData.businessPhone = data.businessPhone || ''
  formData.status = data.status || formData.status
  formData.remark = data.remark || ''
  formData.personIds = normalizeIds(detail.personIds)
  formData.informationSystemIds = normalizeIds(detail.informationSystemIds)
  formData.hardwareAssetIds = normalizeIds(detail.hardwareAssetIds)
}

const ensureDefaultStatus = () => {
  if (formData.status) {
    return
  }
  const activeStatus = serviceProviderStatusOptions.value.find((item) => item.value === 'ACTIVE')
  formData.status = activeStatus?.value || serviceProviderStatusOptions.value[0]?.value || 'ACTIVE'
}

const loadSupportOptions = async () => {
  const [statusOptions, hardwareAssets, informationSystems, persons] = await Promise.all([
    getStatusDictionaries(),
    getOrganizationHardwareOptions(),
    getOrganizationInformationSystemOptions(),
    getOrganizationPersonOptions(),
  ])

  statusDictionaries.value = statusOptions
  hardwareOptions.value = hardwareAssets.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.assetCode, item.assetName),
  }))
  informationSystemOptions.value = informationSystems.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.code, item.name),
  }))
  personOptions.value = persons.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.name, item.employeeNo),
  }))
  ensureDefaultStatus()
}

const loadDetail = async () => {
  if (!isEdit.value) return
  const detail = await getServiceProviderDetail(route.params.id)
  fillForm(detail.serviceProvider, detail)
}

const beforeLogoUpload = (file) => {
  const extension = String(file.name || '').split('.').pop()?.toLowerCase()
  const isValidType = ['image/png', 'image/jpeg', 'image/webp', 'image/svg+xml'].includes(file.type)
    || ['png', 'jpg', 'jpeg', 'webp', 'svg'].includes(extension)
  if (!isValidType) {
    ElMessage.error(t('ec.organization.serviceProvider.upload.invalidType'))
    return false
  }
  const isWithinLimit = file.size / 1024 / 1024 <= 2
  if (!isWithinLimit) {
    ElMessage.error(t('ec.organization.serviceProvider.upload.sizeExceeded'))
    return false
  }
  return true
}

const handleLogoUpload = async (options) => {
  logoUploading.value = true
  try {
    const result = await uploadOrganizationImage(options.file)
    formData.logoUrl = result.url || ''
    options.onSuccess?.(result)
    ElMessage.success(t('ec.organization.serviceProvider.upload.success'))
  } catch (error) {
    options.onError?.(error)
    ElMessage.error(error.message || t('ec.organization.common.saveFailed'))
  } finally {
    logoUploading.value = false
  }
}

const handleLogoRemove = () => {
  formData.logoUrl = ''
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const payload = {
      code: formData.code,
      name: formData.name,
      shortName: formData.shortName,
      logoUrl: formData.logoUrl || undefined,
      unifiedSocialCreditCode: formData.unifiedSocialCreditCode,
      enterpriseNature: formData.enterpriseNature || undefined,
      cooperationScopes: formData.cooperationScopes,
      vendorLevel: formData.vendorLevel || undefined,
      score: formData.score || undefined,
      businessContact: formData.businessContact,
      businessPhone: formData.businessPhone,
      status: formData.status || 'ACTIVE',
      remark: formData.remark,
      personIds: formData.personIds,
      informationSystemIds: formData.informationSystemIds,
      hardwareAssetIds: formData.hardwareAssetIds,
    }

    const response = isEdit.value
      ? await updateServiceProvider(route.params.id, payload)
      : await createServiceProvider(payload)

    ElMessage.success(t('ec.organization.common.saveSuccess'))
    router.replace(`/organization/service-providers/${response.id}/detail`)
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.common.saveFailed'))
  } finally {
    submitLoading.value = false
  }
}

onMounted(async () => {
  pageLoading.value = true
  try {
    await loadSupportOptions()
    await loadDetail()
    ensureDefaultStatus()
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.serviceProvider.message.supportLoadFailed'))
  } finally {
    pageLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.organization-page-card {
  padding: 24px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #edf0f6;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(28, 53, 91, 0.05);
}

.organization-form-section + .organization-form-section {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid #edf0f6;
}

.organization-section-title {
  margin-bottom: 16px;
  color: #151b26;
  font-size: 16px;
  font-weight: 700;
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

.organization-logo-field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 10px;
}

.organization-logo-upload__control {
  :deep(.el-upload) {
    display: block;
  }
}

.organization-logo-upload {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 88px;
  height: 88px;
  overflow: hidden;
  color: #6d7485;
  background: #f7f9fd;
  border: 1px dashed #d7deed;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s ease;

  > i {
    font-size: 20px;
    color: #4b6dff;
  }

  > span {
    font-size: 12px;
    line-height: 1.3;
  }

  &:hover {
    border-color: #4b6dff;
    box-shadow: 0 8px 18px rgba(75, 109, 255, 0.12);
  }

  &.is-filled {
    padding: 0;
    border-style: solid;
    background: #fff;
  }

  &.is-loading {
    pointer-events: none;
    opacity: 0.7;
  }
}

.organization-logo-upload__image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  background: #fff;
}

.organization-logo-upload__mask {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  color: #fff;
  background: rgba(21, 27, 38, 0.56);
  opacity: 0;
  transition: opacity 0.2s ease;

  > i {
    font-size: 18px;
  }

  > span {
    font-size: 12px;
  }
}

.organization-logo-upload:hover .organization-logo-upload__mask {
  opacity: 1;
}

.organization-logo-remove {
  padding: 0;
}

.organization-score-field {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 32px;
}

.organization-score-field__value {
  color: #6d7485;
  font-size: 13px;
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
