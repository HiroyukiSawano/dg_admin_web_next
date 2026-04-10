<template>
  <figma-resource-page
    active-tab="persons"
    :breadcrumbs="pageBreadcrumbs"
    back-text="返回"
    back-path="/organization/persons"
  >
    <div v-loading="pageLoading" class="organization-page-card">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
        class="organization-person-form"
      >
        <section class="organization-form-section">
          <div class="organization-section-title">{{ t('ec.organization.person.section.basicInfo') }}</div>

          <div class="organization-form-grid organization-form-grid--basic">
            <el-form-item prop="name">
              <template #label>
                <span class="organization-form-label">
                  {{ t('ec.organization.person.form.nameLabel') }}
                  <span class="organization-form-label__required">*</span>
                </span>
              </template>
              <el-input
                v-model="formData.name"
                clearable
                :placeholder="t('ec.organization.person.form.contentPlaceholder')"
              />
            </el-form-item>

            <el-form-item :label="t('ec.organization.person.table.employeeNo')">
              <el-input
                v-model="formData.employeeNo"
                clearable
                :placeholder="t('ec.organization.person.form.contentPlaceholder')"
              />
            </el-form-item>

            <el-form-item prop="gender">
              <template #label>
                <span class="organization-form-label">
                  {{ t('ec.organization.person.table.gender') }}
                  <span class="organization-form-label__required">*</span>
                </span>
              </template>
              <el-select
                v-model="formData.gender"
                clearable
                :placeholder="t('ec.organization.person.form.selectPlaceholder')"
              >
                <el-option
                  v-for="item in genderOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item prop="idCardNo">
              <template #label>
                <span class="organization-form-label">
                  {{ t('ec.organization.person.table.idCardNo') }}
                  <span class="organization-form-label__required">*</span>
                </span>
              </template>
              <el-input
                v-model="formData.idCardNo"
                clearable
                :placeholder="t('ec.organization.person.form.contentPlaceholder')"
              />
            </el-form-item>

            <el-form-item prop="mobile">
              <template #label>
                <span class="organization-form-label">
                  {{ t('ec.organization.person.table.mobile') }}
                  <span class="organization-form-label__required">*</span>
                </span>
              </template>
              <el-input
                v-model="formData.mobile"
                clearable
                :placeholder="t('ec.organization.person.form.contentPlaceholder')"
              />
            </el-form-item>

            <el-form-item prop="serviceProviderId">
              <template #label>
                <span class="organization-form-label">
                  {{ t('ec.organization.person.form.serviceProvider') }}
                  <span class="organization-form-label__required">*</span>
                </span>
              </template>
              <ec-object-single-select
                v-model="formData.serviceProviderId"
                :placeholder="t('ec.organization.person.form.contentPlaceholder')"
                :title="`${t('ec.organization.person.form.serviceProvider')}${t('ec.organization.selector.titleSuffix')}`"
                :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
                :options="serviceProviderOptions"
                label-key="name"
                value-key="id"
                subtitle-key="code"
              />
            </el-form-item>

            <el-form-item prop="personType">
              <template #label>
                <span class="organization-form-label">
                  {{ t('ec.organization.person.form.typeLabel') }}
                  <span class="organization-form-label__required">*</span>
                </span>
              </template>
              <el-select
                v-model="formData.personType"
                clearable
                :placeholder="t('ec.organization.person.form.selectPlaceholder')"
              >
                <el-option
                  v-for="item in personTypeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>

            <el-form-item>
              <template #label>
                <span class="organization-form-label">
                  {{ t('ec.organization.person.form.hasOpsAccount') }}
                  <span class="organization-form-label__required">*</span>
                </span>
              </template>
              <div class="organization-switch-field">
                <el-switch v-model="formData.hasOpsAccount" />
              </div>
            </el-form-item>
          </div>
        </section>

        <section class="organization-form-section">
          <div class="organization-section-title">{{ t('ec.organization.person.section.relationInfo') }}</div>

          <div class="organization-form-grid organization-form-grid--relation">
            <el-form-item
              :label="t('ec.organization.person.relations.informationSystems')"
              class="organization-form-item--transfer"
            >
              <ec-object-multi-transfer
                v-model="formData.informationSystemIds"
                :placeholder="t('ec.organization.person.form.selectPlaceholder')"
                :title="`${t('ec.organization.person.relations.informationSystems')}${t('ec.organization.selector.titleSuffix')}`"
                :selected-title="t('ec.organization.selector.selected')"
                :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
                :options="informationSystemOptions"
                label-key="summaryLabel"
                value-key="id"
                subtitle-key="subtitle"
              />
            </el-form-item>

            <el-form-item
              :label="t('ec.organization.person.relations.hardwareAssets')"
              class="organization-form-item--transfer"
            >
              <ec-object-multi-transfer
                v-model="formData.hardwareAssetIds"
                :placeholder="t('ec.organization.person.form.selectPlaceholder')"
                :title="`${t('ec.organization.person.relations.hardwareAssets')}${t('ec.organization.selector.titleSuffix')}`"
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
          <el-button
            type="primary"
            :loading="submitLoading"
            class="organization-form-actions__submit"
            @click="handleSubmit"
          >
            {{ t('ec.global.button.text.confirm') }}
          </el-button>
          <el-button class="organization-form-actions__cancel" @click="router.push('/organization/persons')">
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
  createPerson,
  getOrganizationHardwareOptions,
  getOrganizationInformationSystemOptions,
  getOrganizationServiceProviderOptions,
  getPersonDetail,
  updatePerson,
} from '@/services/modules/organizationService'
import EcObjectMultiTransfer from '@/components/EcObjectMultiTransfer.vue'
import EcObjectSingleSelect from '@/components/EcObjectSingleSelect.vue'
import FigmaResourcePage from './components/FigmaResourcePage.vue'

defineOptions({ name: 'OrganizationPersonFormPage' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()

const formRef = ref(null)
const pageLoading = ref(false)
const submitLoading = ref(false)
const hardwareOptions = ref([])
const informationSystemOptions = ref([])
const serviceProviderOptions = ref([])

const formData = reactive({
  name: '',
  employeeNo: '',
  gender: '',
  idCardNo: '',
  mobile: '',
  serviceProviderId: null,
  personType: '',
  hasOpsAccount: false,
  informationSystemIds: [],
  hardwareAssetIds: [],
})

const isEdit = computed(() => Boolean(route.params.id))

const pageBreadcrumbs = computed(() => ([
  { label: 'ec.organization.figma.tab.persons' },
  { label: isEdit.value ? 'ec.organization.person.page.editTitle' : 'ec.organization.person.page.createTitle' },
]))

const genderOptions = computed(() => ([
  { value: '男', label: t('ec.organization.person.form.genderMale') },
  { value: '女', label: t('ec.organization.person.form.genderFemale') },
]))

const personTypeOptions = computed(() => ([
  { value: 'DEV', label: t('ec.organization.person.figma.type.dev') },
  { value: 'OPS', label: t('ec.organization.person.figma.type.ops') },
]))

const formRules = computed(() => ({
  name: [{ required: true, message: t('ec.organization.person.validation.nameRequired'), trigger: 'blur' }],
  gender: [{ required: true, message: t('ec.organization.person.validation.genderRequired'), trigger: 'change' }],
  idCardNo: [{ required: true, message: t('ec.organization.person.validation.idCardNoRequired'), trigger: 'blur' }],
  mobile: [{ required: true, message: t('ec.organization.person.validation.mobileRequired'), trigger: 'blur' }],
  serviceProviderId: [{ required: true, message: t('ec.organization.person.validation.serviceProviderRequired'), trigger: 'change' }],
  personType: [{ required: true, message: t('ec.organization.person.validation.personTypeRequired'), trigger: 'change' }],
}))

const normalizeIds = (value) => {
  return Array.isArray(value) ? value : []
}

const fillForm = (person = {}, detail = {}) => {
  formData.name = person.name || ''
  formData.employeeNo = person.employeeNo || ''
  formData.gender = person.gender || ''
  formData.idCardNo = person.idCardNo || ''
  formData.mobile = person.mobile || ''
  formData.serviceProviderId = person.serviceProviderId ?? null
  formData.personType = person.personType || ''
  formData.hasOpsAccount = Boolean(person.hasOpsAccount)
  formData.informationSystemIds = normalizeIds(detail.informationSystemIds)
  formData.hardwareAssetIds = normalizeIds(detail.hardwareAssetIds)
}

const loadSupportOptions = async () => {
  const [hardwareAssets, informationSystems, serviceProviders] = await Promise.all([
    getOrganizationHardwareOptions(),
    getOrganizationInformationSystemOptions(),
    getOrganizationServiceProviderOptions(),
  ])

  hardwareOptions.value = Array.isArray(hardwareAssets)
    ? hardwareAssets.map((item) => ({
      ...item,
      summaryLabel: item.assetName || '-',
      subtitle: item.assetCode || '',
    }))
    : []
  informationSystemOptions.value = Array.isArray(informationSystems)
    ? informationSystems.map((item) => ({
      ...item,
      summaryLabel: item.name || '-',
      subtitle: item.code || '',
    }))
    : []
  serviceProviderOptions.value = Array.isArray(serviceProviders) ? serviceProviders : []
}

const loadDetail = async () => {
  if (!isEdit.value) return
  const detail = await getPersonDetail(route.params.id)
  fillForm(detail.person, detail)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const payload = {
      name: formData.name,
      employeeNo: formData.employeeNo || undefined,
      gender: formData.gender,
      idCardNo: formData.idCardNo,
      mobile: formData.mobile,
      serviceProviderId: formData.serviceProviderId,
      personType: formData.personType,
      hasOpsAccount: formData.hasOpsAccount,
      informationSystemIds: formData.informationSystemIds,
      hardwareAssetIds: formData.hardwareAssetIds,
    }

    const response = isEdit.value
      ? await updatePerson(route.params.id, payload)
      : await createPerson(payload)

    ElMessage.success(t('ec.organization.common.saveSuccess'))
    router.replace(`/organization/persons/${response.id}/detail`)
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
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.person.message.loadFailed'))
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

.organization-person-form {
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

.organization-form-grid--relation {
  gap: 24px 24px;
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

.organization-form-item--transfer {
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

.organization-switch-field {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
  padding-top: 2px;

  :deep(.el-switch) {
    --el-switch-on-color: #2e5ef0;
    --el-switch-off-color: #d8dce5;
    --el-switch-border-color: transparent;
    --el-switch-height: 24px;
    --el-switch-width: 48px;
  }

  :deep(.el-switch__core) {
    min-height: 24px;
    border: none;
  }

  :deep(.el-switch__action) {
    width: 20px;
    height: 20px;
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

@media only screen and (max-width: 991px) {
  .organization-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
