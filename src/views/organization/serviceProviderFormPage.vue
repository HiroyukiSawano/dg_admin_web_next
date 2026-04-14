<template>
  <figma-resource-page
    active-tab="serviceProviders"
    :breadcrumbs="pageBreadcrumbs"
    back-text="返回"
    back-path="/organization/service-providers"
  >
    <div v-loading="pageLoading" class="organization-page-card">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
        class="organization-provider-form"
      >
        <section class="organization-form-section">
          <div class="organization-section-title">{{ t('ec.organization.serviceProvider.section.basicInfo') }}</div>

          <div class="organization-form-grid organization-form-grid--basic">
            <el-form-item prop="code">
              <template #label>
                <span class="organization-form-label">
                  {{ t('ec.organization.serviceProvider.form.codeLabel') }}
                  <span class="organization-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.code" clearable :placeholder="t('ec.organization.serviceProvider.form.codePlaceholder')" />
            </el-form-item>
            <el-form-item prop="name">
              <template #label>
                <span class="organization-form-label">
                  {{ t('ec.organization.serviceProvider.form.nameLabel') }}
                  <span class="organization-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.name" clearable :placeholder="t('ec.organization.serviceProvider.form.namePlaceholder')" />
            </el-form-item>

            <el-form-item prop="unifiedSocialCreditCode">
              <template #label>
                <span class="organization-form-label">
                  {{ t('ec.organization.serviceProvider.form.unifiedSocialCreditCode') }}
                  <span class="organization-form-label__required">*</span>
                </span>
              </template>
              <el-input
                v-model="formData.unifiedSocialCreditCode"
                clearable
                :placeholder="t('ec.organization.serviceProvider.form.unifiedSocialCreditCodePlaceholder')"
              />
            </el-form-item>
            <el-form-item prop="shortName">
              <template #label>
                <span class="organization-form-label">
                  {{ t('ec.organization.serviceProvider.form.shortName') }}
                  <span class="organization-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.shortName" clearable :placeholder="t('ec.organization.serviceProvider.form.shortNamePlaceholder')" />
            </el-form-item>

            <el-form-item prop="enterpriseNature">
              <template #label>
                <span class="organization-form-label">
                  {{ t('ec.organization.serviceProvider.form.enterpriseNature') }}
                  <span class="organization-form-label__required">*</span>
                </span>
              </template>
              <el-select v-model="formData.enterpriseNature" clearable :placeholder="t('ec.organization.serviceProvider.form.enterpriseNaturePlaceholder')">
                <el-option v-for="item in enterpriseNatureOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item prop="cooperationScopes" class="organization-form-item--transfer">
              <template #label>
                <span class="organization-form-label">
                  {{ t('ec.organization.serviceProvider.table.cooperationScopes') }}
                  <span class="organization-form-label__required">*</span>
                </span>
              </template>
              <ec-object-multi-transfer
                v-model="formData.cooperationScopes"
                :placeholder="t('ec.organization.serviceProvider.form.cooperationScopePlaceholder')"
                :title="`${t('ec.organization.serviceProvider.table.cooperationScopes')}${t('ec.organization.selector.titleSuffix')}`"
                :selected-title="t('ec.organization.selector.selected')"
                :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
                :options="cooperationScopeOptions"
                label-key="label"
                value-key="value"
              />
            </el-form-item>

            <el-form-item prop="vendorLevel">
              <template #label>
                <span class="organization-form-label">
                  {{ t('ec.organization.serviceProvider.form.vendorLevel') }}
                  <span class="organization-form-label__required">*</span>
                </span>
              </template>
              <el-select v-model="formData.vendorLevel" clearable :placeholder="t('ec.organization.serviceProvider.form.vendorLevelPlaceholder')">
                <el-option v-for="item in vendorLevelOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item prop="businessContact">
              <template #label>
                <span class="organization-form-label">
                  {{ t('ec.organization.serviceProvider.form.businessContact') }}
                  <span class="organization-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.businessContact" clearable :placeholder="t('ec.organization.serviceProvider.form.businessContactPlaceholder')" />
            </el-form-item>

            <el-form-item prop="businessPhone">
              <template #label>
                <span class="organization-form-label">
                  {{ t('ec.organization.serviceProvider.form.businessPhone') }}
                  <span class="organization-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.businessPhone" clearable :placeholder="t('ec.organization.serviceProvider.form.businessPhonePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.organization.serviceProvider.form.score')">
              <div class="organization-score-field" role="radiogroup" :aria-label="t('ec.organization.serviceProvider.form.score')">
                <button
                  v-for="index in 5"
                  :key="index"
                  type="button"
                  class="organization-score-field__star"
                  :class="{ 'is-active': index <= formData.score }"
                  :aria-checked="index === formData.score"
                  @click="setScore(index)"
                >
                  <i :class="index <= formData.score ? 'ri-star-fill' : 'ri-star-line'"></i>
                </button>
              </div>
            </el-form-item>
          </div>

          <div class="organization-form-grid organization-form-grid--support">
            <el-form-item :label="t('ec.organization.serviceProvider.form.logoUrl')" class="organization-form-item--logo">
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
                  <div class="organization-logo-upload" :class="{ 'is-loading': logoUploading }">
                    <div class="organization-logo-upload__preview" :class="{ 'is-empty': !formData.logoUrl }">
                      <img
                        v-if="formData.logoUrl"
                        class="organization-logo-upload__image"
                        :src="formData.logoUrl"
                        alt="logo preview"
                      />
                      <template v-else>
                        <i class="ri-image-add-line"></i>
                        <span>{{ t('ec.organization.serviceProvider.form.logoUpload') }}</span>
                      </template>
                    </div>
                    <div v-if="formData.logoUrl" class="organization-logo-upload__button">
                      <i :class="logoUploading ? 'ri-loader-4-line' : 'ri-upload-line'"></i>
                      <span>{{ t('ec.organization.serviceProvider.form.logoReplace') }}</span>
                    </div>
                  </div>
                </el-upload>
              </div>
            </el-form-item>
            <div class="organization-form-placeholder" aria-hidden="true"></div>
          </div>
        </section>

        <section class="organization-form-section">
          <div class="organization-section-title">{{ t('ec.organization.serviceProvider.section.relationInfo') }}</div>
          <div class="organization-form-grid organization-form-grid--relation">
            <el-form-item :label="t('ec.organization.serviceProvider.relations.persons')" class="is-span-2 organization-form-item--transfer">
              <ec-object-multi-transfer
                v-model="formData.personIds"
                :placeholder="t('ec.organization.serviceProvider.relation.personsPlaceholder')"
                :title="`${t('ec.organization.serviceProvider.relations.persons')}${t('ec.organization.selector.titleSuffix')}`"
                :selected-title="t('ec.organization.selector.selected')"
                :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
                :options="personOptions"
                label-key="summaryLabel"
                value-key="id"
                subtitle-key="subtitle"
              />
            </el-form-item>

            <el-form-item :label="t('ec.organization.serviceProvider.relations.softwareAssets')" class="organization-form-item--transfer">
              <ec-object-multi-transfer
                v-model="formData.informationSystemIds"
                :placeholder="t('ec.organization.serviceProvider.relation.informationSystemsPlaceholder')"
                :title="`${t('ec.organization.serviceProvider.relations.softwareAssets')}${t('ec.organization.selector.titleSuffix')}`"
                :selected-title="t('ec.organization.selector.selected')"
                :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
                :options="informationSystemOptions"
                label-key="summaryLabel"
                value-key="id"
                subtitle-key="subtitle"
              />
            </el-form-item>

            <el-form-item :label="t('ec.organization.serviceProvider.relations.hardwareAssets')" class="organization-form-item--transfer">
              <ec-object-multi-transfer
                v-model="formData.hardwareAssetIds"
                :placeholder="t('ec.organization.serviceProvider.relation.hardwareAssetsPlaceholder')"
                :title="`${t('ec.organization.serviceProvider.relations.hardwareAssets')}${t('ec.organization.selector.titleSuffix')}`"
                :selected-title="t('ec.organization.selector.selected')"
                :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
                :options="hardwareOptions"
                label-key="summaryLabel"
                value-key="id"
                subtitle-key="subtitle"
              />
            </el-form-item>
          </div>
        </section>

        <div class="organization-form-actions">
          <el-button type="primary" :loading="submitLoading" class="organization-form-actions__submit" @click="handleSubmit">
            {{ t('ec.global.button.text.confirm') }}
          </el-button>
          <el-button class="organization-form-actions__cancel" @click="router.push('/organization/service-providers')">
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
const rawPersonOptions = ref([])

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
  score: 3,
  businessContact: '',
  businessPhone: '',
  status: '',
  remark: '',
  personIds: [],
  informationSystemIds: [],
  hardwareAssetIds: [],
})

const isEdit = computed(() => Boolean(route.params.id))
const currentServiceProviderId = computed(() => route.params.id ?? null)
const pageBreadcrumbs = computed(() => ([
  { label: 'ec.organization.figma.tab.serviceProviders' },
  { label: isEdit.value ? 'ec.organization.serviceProvider.page.editTitle' : 'ec.organization.serviceProvider.page.createTitle' },
]))

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
  unifiedSocialCreditCode: [{ required: true, message: t('ec.organization.serviceProvider.validation.unifiedSocialCreditCodeRequired'), trigger: 'blur' }],
  shortName: [{ required: true, message: t('ec.organization.serviceProvider.validation.shortNameRequired'), trigger: 'blur' }],
  enterpriseNature: [{ required: true, message: t('ec.organization.serviceProvider.validation.enterpriseNatureRequired'), trigger: 'change' }],
  cooperationScopes: [{ required: true, message: t('ec.organization.serviceProvider.validation.cooperationScopesRequired'), trigger: 'change' }],
  vendorLevel: [{ required: true, message: t('ec.organization.serviceProvider.validation.vendorLevelRequired'), trigger: 'change' }],
  businessContact: [{ required: true, message: t('ec.organization.serviceProvider.validation.businessContactRequired'), trigger: 'blur' }],
  businessPhone: [{ required: true, message: t('ec.organization.serviceProvider.validation.businessPhoneRequired'), trigger: 'blur' }],
}))

const normalizeIds = (value) => {
  return Array.isArray(value) ? value : []
}

const isSameId = (left, right) => {
  if (left == null || right == null) {
    return false
  }
  return String(left) === String(right)
}

const personOptions = computed(() => {
  const selectedIds = new Set(normalizeIds(formData.personIds).map((item) => String(item)))
  return rawPersonOptions.value.filter((item) => {
    if (item?.serviceProviderId == null) {
      return true
    }
    if (isSameId(item.serviceProviderId, currentServiceProviderId.value)) {
      return true
    }
    return selectedIds.has(String(item?.id))
  })
})

const fillForm = (data = {}, detail = {}) => {
  formData.code = data.code || ''
  formData.name = data.name || ''
  formData.shortName = data.shortName || ''
  formData.logoUrl = data.logoUrl || ''
  formData.unifiedSocialCreditCode = data.unifiedSocialCreditCode || ''
  formData.enterpriseNature = data.enterpriseNature || ''
  formData.cooperationScopes = Array.isArray(data.cooperationScopes) ? data.cooperationScopes : []
  formData.vendorLevel = data.vendorLevel || ''
  formData.score = Number.isFinite(Number(data.score)) ? Number(data.score) : 3
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
    summaryLabel: item.assetName || '-',
    subtitle: item.assetCode || '',
  }))
  informationSystemOptions.value = informationSystems.map((item) => ({
    ...item,
    summaryLabel: item.name || '-',
    subtitle: item.code || '',
  }))
  rawPersonOptions.value = persons.map((item) => ({
    ...item,
    summaryLabel: item.name || '-',
    subtitle: item.employeeNo || '',
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

const setScore = (value) => {
  formData.score = value
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
  padding: 0 4px 0 0;
  background: transparent;
}

.organization-provider-form {
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
  :deep(.el-select) {
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

  :deep(.el-select__tags) {
    gap: 8px;
  }

  :deep(.el-select__tags .el-tag) {
    height: 28px;
    margin: 0;
    padding: 0 8px;
    color: #555d6d;
    background: #ffffff;
    border: 1px solid #e6e8ed;
    border-radius: 4px;
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

.organization-form-section + .organization-form-section {
  margin-top: 44px;
}

.organization-section-title {
  margin-bottom: 18px;
  color: #151b26;
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
}

.organization-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px 24px;
}

.organization-form-grid--basic {
  gap: 18px 24px;
}

.organization-form-grid--support {
  margin-top: 18px;
  align-items: start;
}

.organization-form-grid--relation {
  gap: 24px 24px;
}

.organization-form-placeholder {
  min-height: 1px;
}

.is-span-2 {
  grid-column: 1 / -1;
}

.organization-logo-field {
  display: flex;
  align-items: flex-start;
}

.organization-logo-upload__control {
  :deep(.el-upload) {
    display: block;
    text-align: left;
  }
}

.organization-logo-upload {
  display: flex;
  align-items: flex-end;
  gap: 16px;
  color: #444a57;
  cursor: pointer;

  &.is-loading {
    pointer-events: none;
    opacity: 0.7;
  }
}

.organization-logo-upload__preview {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 80px;
  height: 80px;
  overflow: hidden;
  color: #6d7485;
  background: #f5f6f9;
  border: 1px solid #e5e9f2;
  border-radius: 4px;
  transition: all 0.2s ease;

  > i {
    font-size: 22px;
    color: #444a57;
  }

  > span {
    font-size: 12px;
    line-height: 20px;
  }

  &.is-empty {
    border-style: dashed;
  }
}

.organization-logo-upload:hover .organization-logo-upload__preview {
  &.is-empty {
    border-color: #4b6dff;
  }
}

.organization-logo-upload__button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  min-width: 98px;
  height: 32px;
  padding: 5px 12px;
  font-size: 14px;
  line-height: 22px;
  color: #444a57;
  background: #e6e8ed;
  border-radius: 4px;
  transition: background-color 0.2s ease, color 0.2s ease;

  > i {
    font-size: 14px;
    line-height: 1;
  }

  &:hover {
    color: #335cff;
    background: #edf1ff;
  }
}

.organization-logo-upload__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  background: #fff;
}

.organization-score-field {
  display: inline-flex;
  align-items: center;
  min-height: 32px;
  gap: 6px;
  padding-top: 2px;
}

.organization-score-field__star {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  border: 0;
  background: transparent;
  color: #c4c6cc;
  cursor: pointer;

  i {
    font-size: 20px;
    line-height: 1;
  }

  &.is-active {
    color: #f98715;
  }
}

.organization-form-item--transfer {
  :deep(.ec-object-multi-transfer__trigger) {
    min-height: 40px;
    padding: 6px 14px;
    background: #f5f6f9;
    border: 1px solid transparent;
    border-radius: 4px;
  }

  :deep(.ec-object-multi-transfer__tag),
  :deep(.ec-object-multi-transfer__summary-text) {
    height: 28px;
    padding: 0 10px;
    color: #555d6d;
    background: #ffffff;
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

.organization-form-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 32px;
}

.organization-form-actions__submit,
.organization-form-actions__cancel {
  min-width: 68px;
  height: 32px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 14px;
}

.organization-form-actions__submit {
  border-color: #2e5ef0;
  background: #2e5ef0;
}

.organization-form-actions__cancel {
  color: #555d6d;
  background: #f0f2f5;
  border-color: #f0f2f5;
}

.organization-form-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.organization-form-label__required {
  color: #db4942;
  line-height: 1;
}

@media only screen and (max-width: 991px) {
  .organization-form-grid {
    grid-template-columns: 1fr;
  }

  .is-span-2 {
    grid-column: auto;
  }

  .organization-form-placeholder {
    display: none;
  }
}
</style>
