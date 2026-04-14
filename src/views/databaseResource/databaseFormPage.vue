<template>
  <figma-resource-page
    active-tab="databaseResources"
    :breadcrumbs="pageBreadcrumbs"
    back-text="返回"
    back-path="/database/databaseResources"
  >
    <div v-loading="pageLoading" class="database-page-card">
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-position="top"
        class="database-form"
      >
        <section class="database-form-section">
          <div class="database-section-title">{{ t('ec.database.section.basic') }}</div>
          <div class="database-form-grid">
            <el-form-item prop="databaseCode">
              <template #label>
                <span class="database-form-label">
                  {{ t('ec.database.common.code') }}
                  <span class="database-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.databaseCode" clearable :placeholder="t('ec.database.form.codePlaceholder')" />
            </el-form-item>

            <el-form-item prop="databaseName">
              <template #label>
                <span class="database-form-label">
                  {{ t('ec.database.common.name') }}
                  <span class="database-form-label__required">*</span>
                </span>
              </template>
              <el-input v-model="formData.databaseName" clearable :placeholder="t('ec.database.form.namePlaceholder')" />
            </el-form-item>

            <el-form-item prop="databaseType">
              <template #label>
                <span class="database-form-label">
                  {{ t('ec.database.common.type') }}
                  <span class="database-form-label__required">*</span>
                </span>
              </template>
              <el-select v-model="formData.databaseType" clearable :placeholder="t('ec.database.form.typePlaceholder')">
                <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item prop="version">
              <template #label>
                <span class="database-form-label">{{ t('ec.database.common.version') }}</span>
              </template>
              <el-input v-model="formData.version" clearable :placeholder="t('ec.database.form.versionPlaceholder')" />
            </el-form-item>

            <el-form-item prop="status">
              <template #label>
                <span class="database-form-label">
                  {{ t('ec.database.common.status') }}
                  <span class="database-form-label__required">*</span>
                </span>
              </template>
              <el-select v-model="formData.status" :placeholder="t('ec.database.form.statusPlaceholder')">
                <el-option v-for="item in currentStatusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>

            <el-form-item class="is-span-2" prop="remark">
              <template #label>
                <span class="database-form-label">{{ t('ec.database.common.remark') }}</span>
              </template>
              <el-input
                v-model="formData.remark"
                type="textarea"
                :rows="4"
                clearable
                :placeholder="t('ec.database.form.remarkPlaceholder')"
              />
            </el-form-item>
          </div>
        </section>

        <div class="database-form-actions">
          <el-button type="primary" :loading="submitLoading" class="database-form-actions__submit" @click="handleSubmit">
            {{ t('ec.global.button.text.confirm') }}
          </el-button>
          <el-button class="database-form-actions__cancel" @click="router.push('/database/databaseResources')">
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
import FigmaResourcePage from '@/views/organization/components/FigmaResourcePage.vue'
import {
  createDatabaseResource,
  getDatabaseResourceDetail,
  updateDatabaseResource,
} from '@/services/modules/databaseResourceService'
import { databaseTypeOptions, statusOptions } from './helpers'

defineOptions({ name: 'DatabaseFormPage' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const formRef = ref(null)
const pageLoading = ref(false)
const submitLoading = ref(false)
const formData = reactive({
  databaseCode: '',
  databaseName: '',
  databaseType: '',
  version: '',
  status: 'ACTIVE',
  remark: '',
})

const isEdit = computed(() => Boolean(route.params.id))
const pageBreadcrumbs = computed(() => ([
  { label: 'ec.menu.name.database' },
  { label: isEdit.value ? 'ec.database.page.editTitle' : 'ec.database.page.createTitle' },
]))
const typeOptions = computed(() => databaseTypeOptions(t))
const currentStatusOptions = computed(() => statusOptions(t))
const formRules = computed(() => ({
  databaseCode: [{ required: true, message: t('ec.database.validation.codeRequired'), trigger: 'blur' }],
  databaseName: [{ required: true, message: t('ec.database.validation.nameRequired'), trigger: 'blur' }],
  databaseType: [{ required: true, message: t('ec.database.validation.typeRequired'), trigger: 'change' }],
  status: [{ required: true, message: t('ec.database.validation.statusRequired'), trigger: 'change' }],
}))

const fillForm = (detail = {}) => {
  formData.databaseCode = detail.databaseCode || ''
  formData.databaseName = detail.databaseName || ''
  formData.databaseType = detail.databaseType || ''
  formData.version = detail.version || ''
  formData.status = detail.status || 'ACTIVE'
  formData.remark = detail.remark || ''
}

const loadDetail = async () => {
  if (!isEdit.value) return
  const detail = await getDatabaseResourceDetail(route.params.id)
  fillForm(detail)
}

const buildPayload = () => ({
  databaseCode: formData.databaseCode,
  databaseName: formData.databaseName,
  databaseType: formData.databaseType,
  version: formData.version,
  status: formData.status,
  remark: formData.remark,
})

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const result = isEdit.value
      ? await updateDatabaseResource(route.params.id, buildPayload())
      : await createDatabaseResource(buildPayload())
    ElMessage.success(t('ec.database.common.saveSuccess'))
    router.replace(`/database/databaseResources/${result?.id || route.params.id}/detail`)
  } catch (error) {
    ElMessage.error(error.message || t('ec.database.common.saveFailed'))
  } finally {
    submitLoading.value = false
  }
}

onMounted(async () => {
  pageLoading.value = true
  try {
    await loadDetail()
  } catch (error) {
    ElMessage.error(error.message || t('ec.database.message.detailFailed'))
  } finally {
    pageLoading.value = false
  }
})
</script>

<style lang="scss" scoped>
.database-page-card {
  padding: 0 4px 0 0;
  background: transparent;
}

.database-form {
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
  :deep(.el-textarea) {
    width: 100%;
  }

  :deep(.el-input__wrapper),
  :deep(.el-select__wrapper),
  :deep(.el-textarea__inner) {
    min-height: 40px;
    padding: 0 14px;
    background: #f5f6f9;
    box-shadow: none;
    border-radius: 4px;
  }

  :deep(.el-textarea__inner) {
    padding-top: 9px;
    padding-bottom: 9px;
  }

  :deep(.el-input__wrapper.is-focus),
  :deep(.el-select__wrapper.is-focused),
  :deep(.el-textarea__inner:focus) {
    background: #fff;
    box-shadow: 0 0 0 1px #2e5ef0 inset;
  }

  :deep(.el-input__inner),
  :deep(.el-select__placeholder),
  :deep(.el-select__selected-item),
  :deep(.el-textarea__inner) {
    color: #444a57;
    font-size: 14px;
    line-height: 22px;
  }

  :deep(.el-input__inner::placeholder),
  :deep(.el-textarea__inner::placeholder) {
    color: #b4b9c3;
  }

  :deep(.el-select__placeholder.is-transparent) {
    color: #b4b9c3;
  }

  :deep(.el-form-item.is-error .el-input__wrapper),
  :deep(.el-form-item.is-error .el-select__wrapper),
  :deep(.el-form-item.is-error .el-textarea__inner) {
    box-shadow: 0 0 0 1px #db4942 inset;
  }

  :deep(.el-form-item__error) {
    padding-top: 6px;
  }
}

.database-form-section + .database-form-section {
  margin-top: 44px;
}

.database-section-title {
  margin-bottom: 18px;
  color: #151b26;
  font-size: 18px;
  font-weight: 700;
  line-height: 26px;
}

.database-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px 24px;
}

.database-form-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-top: 32px;
}

.database-form-actions__submit,
.database-form-actions__cancel {
  min-width: 68px;
  height: 32px;
  padding: 0 16px;
  border-radius: 4px;
  font-size: 14px;
}

.database-form-actions__submit {
  border-color: #2e5ef0;
  background: #2e5ef0;
}

.database-form-actions__cancel {
  color: #555d6d;
  background: #f0f2f5;
  border-color: #f0f2f5;
}

.database-form-label {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}

.database-form-label__required {
  color: #db4942;
  line-height: 1;
}

.is-span-2 {
  grid-column: 1 / -1;
}

@media only screen and (max-width: 991px) {
  .database-form-grid {
    grid-template-columns: 1fr;
  }

  .is-span-2 {
    grid-column: auto;
  }
}
</style>
