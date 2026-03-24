<template>
  <el-card class="organization-page">
    <el-form :model="queryForm" inline @submit.prevent>
      <el-form-item :label="t('ec.organization.department.form.keyword')">
        <el-input
          v-model="queryForm.keyword"
          clearable
          :placeholder="t('ec.organization.department.form.keywordPlaceholder')"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">{{ t('ec.global.button.text.search') }}</el-button>
        <el-button @click="handleReset">{{ t('ec.global.button.text.reset') }}</el-button>
      </el-form-item>
      <el-form-item class="margin-left-auto">
        <el-button type="primary" @click="openCreate()">{{ t('ec.organization.common.create') }}</el-button>
      </el-form-item>
    </el-form>

    <el-table
      v-loading="tableLoading"
      :data="filteredDepartments"
      row-key="id"
      default-expand-all
      :tree-props="{ children: 'children' }"
    >
      <el-table-column prop="code" :label="t('ec.organization.common.code')" min-width="180" show-overflow-tooltip />
      <el-table-column prop="name" :label="t('ec.organization.common.name')" min-width="220" show-overflow-tooltip />
      <el-table-column :label="t('ec.organization.department.table.parentName')" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">
          {{ departmentNameMap[row.parentId] || t('ec.organization.common.root') }}
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.organization.common.status')" width="140">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status, departmentStatusMap)">{{ getStatusLabel(row.status, departmentStatusMap) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.organization.common.updatedAt')" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.organization.common.actions')" fixed="right" width="260">
        <template #default="{ row }">
          <el-button type="primary" link @click="openDetail(row)">{{ t('ec.organization.common.detail') }}</el-button>
          <el-button type="primary" link @click="openEdit(row)">{{ t('ec.organization.common.edit') }}</el-button>
          <el-button type="primary" link @click="openCreate(row.id)">{{ t('ec.organization.common.addChild') }}</el-button>
          <el-button type="danger" link @click="handleDelete(row)">{{ t('ec.organization.common.delete') }}</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="t('ec.organization.common.empty')" />
      </template>
    </el-table>
  </el-card>

  <el-dialog
    v-model="dialogVisible"
    :title="dialogMode === 'create' ? t('ec.organization.department.dialog.createTitle') : t('ec.organization.department.dialog.editTitle')"
    :width="560"
    destroy-on-close
    append-to-body
    @closed="handleDialogClosed"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px">
      <el-form-item :label="t('ec.organization.common.code')" prop="code">
        <el-input v-model="formData.code" clearable :placeholder="t('ec.organization.department.form.codePlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.common.name')" prop="name">
        <el-input v-model="formData.name" clearable :placeholder="t('ec.organization.department.form.namePlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.department.form.parentDepartment')" prop="parentId">
        <el-tree-select
          v-model="formData.parentId"
          clearable
          check-strictly
          node-key="id"
          :data="parentDepartmentOptions"
          :props="{ label: 'name', children: 'children', disabled: 'disabled' }"
          :placeholder="t('ec.organization.department.form.parentDepartmentPlaceholder')"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item :label="t('ec.organization.common.status')" prop="status">
        <el-select v-model="formData.status" clearable :placeholder="t('ec.organization.department.form.statusPlaceholder')" style="width: 100%;">
          <el-option v-for="item in departmentStatusOptions" :key="item.value" :label="item.displayLabel" :value="item.value" />
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">{{ t('ec.global.button.text.cancel') }}</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">{{ t('ec.global.button.text.submit') }}</el-button>
    </template>
  </el-dialog>

  <el-drawer
    v-model="detailVisible"
    :title="t('ec.organization.department.drawer.title')"
    size="520px"
    append-to-body
  >
    <div v-loading="detailLoading" class="organization-detail" v-if="detailRecord">
      <div class="organization-detail__grid">
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.common.code') }}</span>
          <strong>{{ detailRecord.code || '-' }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.common.name') }}</span>
          <strong>{{ detailRecord.name || '-' }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.department.table.parentName') }}</span>
          <strong>{{ departmentNameMap[detailRecord.parentId] || t('ec.organization.common.root') }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.common.status') }}</span>
          <strong>{{ getStatusLabel(detailRecord.status, departmentStatusMap) }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.common.createdAt') }}</span>
          <strong>{{ formatDateTime(detailRecord.createdAt) }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.common.updatedAt') }}</span>
          <strong>{{ formatDateTime(detailRecord.updatedAt) }}</strong>
        </div>
      </div>
    </div>
  </el-drawer>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStatusDictionaries } from '@/services/modules/dictionaryService'
import { buildStatusOptionMap } from '@/utils/statusDictionary'
import {
  createDepartment,
  deleteDepartment,
  getDepartmentDetail,
  getDepartmentOptions,
  updateDepartment,
} from '@/services/modules/organizationService'
import {
  buildIdNameMap,
  cloneTreeWithDisabled,
  collectDescendantIds,
  filterTreeByKeyword,
  formatDateTime,
  getStatusLabel,
  getStatusTagType,
} from './helpers'

defineOptions({ name: 'OrganizationDepartments' })

const { t, locale } = useI18n()

const tableLoading = ref(false)
const detailLoading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogMode = ref('create')
const formRef = ref(null)
const sourceDepartments = ref([])
const statusDictionaries = ref({})
const detailRecord = ref(null)
const editingDepartmentId = ref(null)
const searchKeyword = ref('')

const queryForm = reactive({
  keyword: '',
})

const formData = reactive({
  id: null,
  code: '',
  name: '',
  parentId: null,
  status: '',
})

const formRules = {
  code: [{ required: true, message: t('ec.organization.department.validation.codeRequired'), trigger: 'blur' }],
  name: [{ required: true, message: t('ec.organization.department.validation.nameRequired'), trigger: 'blur' }],
  status: [{ required: true, message: t('ec.organization.department.validation.statusRequired'), trigger: 'change' }],
}

const departmentNameMap = computed(() => {
  return buildIdNameMap(sourceDepartments.value)
})

const departmentStatusOptions = computed(() => {
  return Object.values(buildStatusOptionMap(statusDictionaries.value.departmentStatus, locale.value))
})

const departmentStatusMap = computed(() => {
  return buildStatusOptionMap(departmentStatusOptions.value, locale.value)
})

const filteredDepartments = computed(() => {
  return filterTreeByKeyword(sourceDepartments.value, searchKeyword.value, ['code', 'name'])
})

const parentDepartmentOptions = computed(() => {
  if (!editingDepartmentId.value) {
    return sourceDepartments.value
  }

  const disabledIds = collectDescendantIds(sourceDepartments.value, editingDepartmentId.value)
  disabledIds.add(editingDepartmentId.value)
  return cloneTreeWithDisabled(sourceDepartments.value, disabledIds)
})

const resetFormData = () => {
  formData.id = null
  formData.code = ''
  formData.name = ''
  formData.parentId = null
  formData.status = ''
  editingDepartmentId.value = null
}

const loadDepartments = async () => {
  tableLoading.value = true
  try {
    sourceDepartments.value = await getDepartmentOptions()
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.department.message.loadFailed'))
  } finally {
    tableLoading.value = false
  }
}

const loadStatusOptions = async () => {
  statusDictionaries.value = await getStatusDictionaries()
}

const handleSearch = () => {
  searchKeyword.value = queryForm.keyword.trim()
}

const handleReset = () => {
  queryForm.keyword = ''
  searchKeyword.value = ''
}

const openCreate = (parentId = null) => {
  resetFormData()
  dialogMode.value = 'create'
  formData.parentId = parentId
  dialogVisible.value = true
}

const openEdit = (row) => {
  resetFormData()
  dialogMode.value = 'edit'
  editingDepartmentId.value = row.id
  formData.id = row.id
  formData.code = row.code || ''
  formData.name = row.name || ''
  formData.parentId = row.parentId ?? null
  formData.status = row.status || ''
  dialogVisible.value = true
}

const openDetail = async (row) => {
  detailVisible.value = true
  detailLoading.value = true
  detailRecord.value = null
  try {
    detailRecord.value = await getDepartmentDetail(row.id)
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.department.message.detailFailed'))
  } finally {
    detailLoading.value = false
  }
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
      parentId: formData.parentId,
      status: formData.status,
    }

    if (dialogMode.value === 'create') {
      await createDepartment(payload)
    } else {
      await updateDepartment(formData.id, payload)
    }

    ElMessage.success(t('ec.organization.common.saveSuccess'))
    dialogVisible.value = false
    await loadDepartments()
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.common.saveFailed'))
  } finally {
    submitLoading.value = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('ec.organization.common.deleteConfirm', { name: row.name || row.code }),
      t('ec.organization.common.delete'),
      {
        type: 'warning',
        confirmButtonText: t('ec.organization.common.delete'),
        cancelButtonText: t('ec.global.button.text.cancel'),
        confirmButtonClass: 'el-button--danger',
      },
    )

    await deleteDepartment(row.id)
    ElMessage.success(t('ec.organization.common.deleteSuccess'))
    await loadDepartments()
  } catch (error) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error.message || t('ec.organization.common.deleteFailed'))
  }
}

const handleDialogClosed = () => {
  formRef.value?.clearValidate()
  resetFormData()
}

onMounted(() => {
  Promise.all([loadDepartments(), loadStatusOptions()]).catch((error) => {
    ElMessage.error(error.message || t('ec.organization.department.message.loadFailed'))
  })
})
</script>

<style lang="scss" scoped>
.organization-page {
  :deep(.el-form.el-form--inline) {
    margin: -8px -8px 8px;

    .el-form-item {
      margin: 0;
      padding: 8px;
    }

    .el-input,
    .el-select {
      width: 240px;
    }
  }
}

.organization-detail {
  min-height: 200px;
}

.organization-detail__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.organization-detail__item {
  display: flex;
  flex-direction: column;
  gap: 8px;

  > span {
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);
  }

  > strong {
    color: var(--el-text-color-primary);
    word-break: break-all;
  }
}

@media only screen and (max-width: 991px) {
  .organization-page {
    :deep(.el-form.el-form--inline) {
      flex-direction: column;

      .el-form-item {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;

        .el-form-item__content {
          width: 100%;
        }
      }

      .el-input,
      .el-select {
        width: 100%;
      }
    }
  }

  .organization-detail__grid {
    grid-template-columns: 1fr;
  }
}
</style>
