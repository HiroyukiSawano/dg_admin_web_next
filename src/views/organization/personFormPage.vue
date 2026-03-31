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
      <el-form ref="formRef" :model="formData" :rules="formRules" label-position="top" class="organization-form-grid">
        <el-form-item :label="t('ec.organization.common.name')" prop="name">
          <el-input v-model="formData.name" clearable :placeholder="t('ec.organization.person.form.namePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('ec.organization.person.table.employeeNo')">
          <el-input v-model="formData.employeeNo" clearable :placeholder="t('ec.organization.person.form.employeeNoPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('ec.organization.person.table.gender')">
          <el-input v-model="formData.gender" clearable :placeholder="t('ec.organization.person.form.genderPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('ec.organization.person.table.mobile')">
          <el-input v-model="formData.mobile" clearable :placeholder="t('ec.organization.person.form.mobilePlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('ec.organization.person.table.idCardNo')">
          <el-input v-model="formData.idCardNo" clearable :placeholder="t('ec.organization.person.form.idCardNoPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('ec.organization.person.table.account')">
          <el-input v-model="formData.account" clearable :placeholder="t('ec.organization.person.form.accountPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('ec.organization.person.table.photoUrl')">
          <el-input v-model="formData.photoUrl" clearable :placeholder="t('ec.organization.person.form.photoUrlPlaceholder')" />
        </el-form-item>
        <el-form-item :label="t('ec.organization.person.form.department')">
          <el-tree-select
            v-model="formData.departmentId"
            clearable
            check-strictly
            node-key="id"
            :data="departmentOptions"
            :props="{ label: 'name', children: 'children' }"
            :placeholder="t('ec.organization.person.form.departmentPlaceholder')"
          />
        </el-form-item>
        <el-form-item :label="t('ec.organization.person.form.serviceProvider')" prop="serviceProviderId">
          <el-select
            v-model="formData.serviceProviderId"
            clearable
            filterable
            :placeholder="t('ec.organization.person.form.serviceProviderPlaceholder')"
          >
            <el-option v-for="item in serviceProviderOptions" :key="item.id" :label="item.displayLabel" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('ec.organization.person.form.personType')" prop="personType">
          <el-select v-model="formData.personType" clearable :placeholder="t('ec.organization.person.form.personTypePlaceholder')">
            <el-option v-for="item in personTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('ec.organization.common.status')" prop="status">
          <el-select v-model="formData.status" clearable :placeholder="t('ec.organization.person.form.statusPlaceholder')">
            <el-option v-for="item in personStatusOptions" :key="item.value" :label="item.displayLabel" :value="item.value" />
          </el-select>
        </el-form-item>
      </el-form>

      <div v-if="formData.photoUrl" class="organization-page-preview">
        <div class="organization-page-preview__label">{{ t('ec.organization.person.form.photoPreview') }}</div>
        <img class="organization-page-preview__image" :src="formData.photoUrl" alt="photo preview" />
      </div>
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
  createPerson,
  getOrganizationServiceProviderOptions,
  getPersonDepartmentOptions,
  getPersonDetail,
  updatePerson,
} from '@/services/modules/organizationService'
import FigmaResourcePage from './components/FigmaResourcePage.vue'

defineOptions({ name: 'OrganizationPersonFormPage' })

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()

const formRef = ref(null)
const pageLoading = ref(false)
const submitLoading = ref(false)
const statusDictionaries = ref({})
const departmentOptions = ref([])
const serviceProviderOptions = ref([])

const formData = reactive({
  name: '',
  gender: '',
  idCardNo: '',
  mobile: '',
  employeeNo: '',
  photoUrl: '',
  account: '',
  departmentId: null,
  serviceProviderId: null,
  personType: '',
  status: '',
})

const isEdit = computed(() => Boolean(route.params.id))

const pageTitle = computed(() => {
  return isEdit.value ? t('ec.organization.person.page.editTitle') : t('ec.organization.person.page.createTitle')
})

const pageDescription = computed(() => {
  return isEdit.value ? t('ec.organization.person.page.editDescription') : t('ec.organization.person.page.createDescription')
})

const personTypeOptions = computed(() => ([
  { value: 'DEV', label: t('ec.organization.person.figma.type.dev') },
  { value: 'OPS', label: t('ec.organization.person.figma.type.ops') },
]))

const personStatusOptions = computed(() => {
  return Object.values(buildStatusOptionMap(statusDictionaries.value.personStatus, locale.value))
})

const formRules = computed(() => ({
  name: [{ required: true, message: t('ec.organization.person.validation.nameRequired'), trigger: 'blur' }],
  serviceProviderId: [{ required: true, message: t('ec.organization.person.validation.serviceProviderRequired'), trigger: 'change' }],
  personType: [{ required: true, message: t('ec.organization.person.validation.personTypeRequired'), trigger: 'change' }],
  status: [{ required: true, message: t('ec.organization.person.validation.statusRequired'), trigger: 'change' }],
}))

const fillForm = (data = {}) => {
  formData.name = data.name || ''
  formData.gender = data.gender || ''
  formData.idCardNo = data.idCardNo || ''
  formData.mobile = data.mobile || ''
  formData.employeeNo = data.employeeNo || ''
  formData.photoUrl = data.photoUrl || ''
  formData.account = data.account || ''
  formData.departmentId = data.departmentId ?? null
  formData.serviceProviderId = data.serviceProviderId ?? null
  formData.personType = data.personType || ''
  formData.status = data.status || ''
}

const loadOptions = async () => {
  const [statusOptions, departments, serviceProviders] = await Promise.all([
    getStatusDictionaries(),
    getPersonDepartmentOptions(),
    getOrganizationServiceProviderOptions(),
  ])
  statusDictionaries.value = statusOptions
  departmentOptions.value = departments
  serviceProviderOptions.value = serviceProviders.map((item) => ({
    ...item,
    displayLabel: [item.name, item.code].filter(Boolean).join(' / ') || '-',
  }))
}

const loadDetail = async () => {
  if (!isEdit.value) return
  const detail = await getPersonDetail(route.params.id)
  fillForm(detail.person)
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const payload = {
      name: formData.name,
      gender: formData.gender,
      idCardNo: formData.idCardNo,
      mobile: formData.mobile,
      employeeNo: formData.employeeNo,
      photoUrl: formData.photoUrl,
      account: formData.account,
      departmentId: formData.departmentId ?? undefined,
      serviceProviderId: formData.serviceProviderId,
      personType: formData.personType,
      status: formData.status,
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
    await loadOptions()
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

.organization-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 20px;

  :deep(.el-form-item) {
    margin-bottom: 0;
  }

  :deep(.el-form-item__content),
  :deep(.el-select),
  :deep(.el-tree-select) {
    width: 100%;
  }
}

.organization-page-preview {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid #edf0f6;
}

.organization-page-preview__label {
  margin-bottom: 12px;
  color: #858a99;
  font-size: 13px;
}

.organization-page-preview__image {
  display: block;
  max-width: 160px;
  max-height: 160px;
  border: 1px solid #edf0f6;
  border-radius: 12px;
  object-fit: cover;
}

@media only screen and (max-width: 991px) {
  .organization-page-card {
    padding: 16px;
  }

  .organization-form-grid {
    grid-template-columns: 1fr;
  }
}
</style>
