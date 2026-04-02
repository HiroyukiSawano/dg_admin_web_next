<template>
  <figma-resource-page
    active-tab="persons"
    :title="pageTitle"
    :description="pageDescription"
    back-path="/organization/persons"
  >
    <template #actions>
      <el-button @click="router.push('/organization/persons')">
        {{ t('ec.global.button.text.cancel') }}
      </el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">
        {{ t('ec.global.button.text.submit') }}
      </el-button>
    </template>

    <div v-loading="pageLoading" class="organization-page-card">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top">
        <section class="organization-form-section">
          <div class="organization-section-title">{{ t('ec.organization.person.section.basicInfo') }}</div>
          <div class="organization-form-grid">
            <el-form-item :label="t('ec.organization.common.name')" prop="name">
              <el-input v-model="formData.name" clearable :placeholder="t('ec.organization.person.form.namePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.organization.person.table.employeeNo')">
              <el-input v-model="formData.employeeNo" clearable :placeholder="t('ec.organization.person.form.employeeNoPlaceholder')" />
            </el-form-item>

            <el-form-item :label="t('ec.organization.person.table.gender')" prop="gender">
              <el-select v-model="formData.gender" clearable :placeholder="t('ec.organization.person.form.genderPlaceholder')">
                <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('ec.organization.person.table.idCardNo')" prop="idCardNo">
              <el-input v-model="formData.idCardNo" clearable :placeholder="t('ec.organization.person.form.idCardNoPlaceholder')" />
            </el-form-item>

            <el-form-item :label="t('ec.organization.person.table.mobile')" prop="mobile">
              <el-input v-model="formData.mobile" clearable :placeholder="t('ec.organization.person.form.mobilePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.organization.person.form.serviceProvider')" prop="serviceProviderId">
              <ec-object-single-select
                v-model="formData.serviceProviderId"
                :placeholder="t('ec.organization.person.form.serviceProviderPlaceholder')"
                :title="`${t('ec.organization.person.form.serviceProvider')}${t('ec.organization.selector.titleSuffix')}`"
                :search-placeholder="t('ec.organization.selector.searchPlaceholder')"
                :options="serviceProviderOptions"
                label-key="name"
                value-key="id"
                subtitle-key="code"
              />
            </el-form-item>

            <el-form-item :label="t('ec.organization.person.form.personType')" prop="personType">
              <el-select v-model="formData.personType" clearable :placeholder="t('ec.organization.person.form.personTypePlaceholder')">
                <el-option v-for="item in personTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('ec.organization.person.form.hasOpsAccount')" prop="hasOpsAccount">
              <div class="organization-switch-field">
                <el-switch v-model="formData.hasOpsAccount" />
              </div>
            </el-form-item>
          </div>
        </section>

        <section class="organization-form-section">
          <div class="organization-section-title">{{ t('ec.organization.person.section.relationInfo') }}</div>
          <div class="organization-form-grid">
            <el-form-item :label="t('ec.organization.person.relations.informationSystems')">
              <ec-object-multi-transfer
                v-model="formData.informationSystemIds"
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
                v-model="formData.hardwareAssetIds"
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

const pageTitle = computed(() => {
  return isEdit.value ? t('ec.organization.person.page.editTitle') : t('ec.organization.person.page.createTitle')
})

const pageDescription = computed(() => {
  return isEdit.value ? t('ec.organization.person.page.editDescription') : t('ec.organization.person.page.createDescription')
})

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

  hardwareOptions.value = Array.isArray(hardwareAssets) ? hardwareAssets : []
  informationSystemOptions.value = Array.isArray(informationSystems) ? informationSystems : []
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

.organization-switch-field {
  display: inline-flex;
  align-items: center;
  min-height: 40px;
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
