<template>
  <el-card class="organization-page">
    <el-form :model="queryForm" inline @submit.prevent>
      <el-form-item :label="t('ec.organization.location.form.keyword')">
        <el-input
          v-model="queryForm.keyword"
          clearable
          :placeholder="t('ec.organization.location.form.keywordPlaceholder')"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">{{ t('ec.global.button.text.search') }}</el-button>
        <el-button @click="handleReset">{{ t('ec.global.button.text.reset') }}</el-button>
      </el-form-item>
      <el-form-item class="margin-left-auto">
        <el-button type="primary" @click="openCreate">{{ t('ec.organization.common.create') }}</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="tableLoading" :data="tableData" row-key="id">
      <el-table-column prop="code" :label="t('ec.organization.common.code')" min-width="160" show-overflow-tooltip />
      <el-table-column prop="name" :label="t('ec.organization.common.name')" min-width="180" show-overflow-tooltip />
      <el-table-column prop="site" :label="t('ec.organization.location.table.site')" min-width="160" show-overflow-tooltip />
      <el-table-column prop="building" :label="t('ec.organization.location.table.building')" min-width="140" show-overflow-tooltip />
      <el-table-column prop="floor" :label="t('ec.organization.location.table.floor')" width="120" show-overflow-tooltip />
      <el-table-column prop="area" :label="t('ec.organization.location.table.area')" min-width="140" show-overflow-tooltip />
      <el-table-column :label="t('ec.organization.common.updatedAt')" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.organization.common.actions')" fixed="right" width="180">
        <template #default="{ row }">
          <el-button type="primary" link @click="openDetail(row)">{{ t('ec.organization.common.detail') }}</el-button>
          <el-button type="primary" link @click="openEdit(row)">{{ t('ec.organization.common.edit') }}</el-button>
          <el-button type="danger" link @click="handleDelete(row)">{{ t('ec.organization.common.delete') }}</el-button>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="t('ec.organization.common.empty')" />
      </template>
    </el-table>

    <el-pagination
      v-model:current-page="pagination.currentPage"
      background
      :layout="paginationLayout"
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :page-sizes="pagination.pageSizes"
      @current-change="handlePageChange"
      @update:page-size="handlePageSizeChange"
    />
  </el-card>

  <el-dialog
    v-model="dialogVisible"
    :title="dialogMode === 'create' ? t('ec.organization.location.dialog.createTitle') : t('ec.organization.location.dialog.editTitle')"
    :width="640"
    destroy-on-close
    append-to-body
    @closed="handleDialogClosed"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px">
      <el-form-item :label="t('ec.organization.common.code')" prop="code">
        <el-input v-model="formData.code" clearable :placeholder="t('ec.organization.location.form.codePlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.common.name')" prop="name">
        <el-input v-model="formData.name" clearable :placeholder="t('ec.organization.location.form.namePlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.location.table.site')" prop="site">
        <el-input v-model="formData.site" clearable :placeholder="t('ec.organization.location.form.sitePlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.location.table.building')" prop="building">
        <el-input v-model="formData.building" clearable :placeholder="t('ec.organization.location.form.buildingPlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.location.table.floor')" prop="floor">
        <el-input v-model="formData.floor" clearable :placeholder="t('ec.organization.location.form.floorPlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.location.table.area')" prop="area">
        <el-input v-model="formData.area" clearable :placeholder="t('ec.organization.location.form.areaPlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.location.table.addressDetail')" prop="addressDetail">
        <el-input
          v-model="formData.addressDetail"
          type="textarea"
          :rows="3"
          :placeholder="t('ec.organization.location.form.addressDetailPlaceholder')"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="dialogVisible = false">{{ t('ec.global.button.text.cancel') }}</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">{{ t('ec.global.button.text.submit') }}</el-button>
    </template>
  </el-dialog>

  <el-drawer
    v-model="detailVisible"
    :title="t('ec.organization.location.drawer.title')"
    size="560px"
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
          <span>{{ t('ec.organization.location.table.site') }}</span>
          <strong>{{ detailRecord.site || '-' }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.location.table.building') }}</span>
          <strong>{{ detailRecord.building || '-' }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.location.table.floor') }}</span>
          <strong>{{ detailRecord.floor || '-' }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.location.table.area') }}</span>
          <strong>{{ detailRecord.area || '-' }}</strong>
        </div>
        <div class="organization-detail__item is-full">
          <span>{{ t('ec.organization.location.table.addressDetail') }}</span>
          <strong>{{ detailRecord.addressDetail || '-' }}</strong>
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
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useSystemStore } from '@/stores/modules/systemStore'
import {
  createLocation,
  deleteLocation,
  getLocationDetail,
  getLocationList,
  updateLocation,
} from '@/services/modules/organizationService'
import { formatDateTime } from './helpers'

defineOptions({ name: 'OrganizationLocations' })

const { t } = useI18n()
const { device } = storeToRefs(useSystemStore())

const tableLoading = ref(false)
const detailLoading = ref(false)
const submitLoading = ref(false)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogMode = ref('create')
const formRef = ref(null)
const tableData = ref([])
const detailRecord = ref(null)

const queryForm = reactive({
  keyword: '',
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  total: 0,
})

const formData = reactive({
  id: null,
  code: '',
  name: '',
  site: '',
  building: '',
  floor: '',
  area: '',
  addressDetail: '',
})

const formRules = {
  code: [{ required: true, message: t('ec.organization.location.validation.codeRequired'), trigger: 'blur' }],
  name: [{ required: true, message: t('ec.organization.location.validation.nameRequired'), trigger: 'blur' }],
}

const paginationLayout = computed(() => {
  return device.value === 'mobile' ? 'total, prev, next' : 'total, prev, pager, next, sizes'
})

const resetFormData = () => {
  formData.id = null
  formData.code = ''
  formData.name = ''
  formData.site = ''
  formData.building = ''
  formData.floor = ''
  formData.area = ''
  formData.addressDetail = ''
}

const loadData = async () => {
  tableLoading.value = true
  try {
    const pageData = await getLocationList({
      pageNo: pagination.currentPage,
      pageSize: pagination.pageSize,
      keyword: queryForm.keyword || undefined,
    })
    tableData.value = pageData.records
    pagination.total = pageData.total
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.location.message.loadFailed'))
  } finally {
    tableLoading.value = false
  }
}

const handleSearch = () => {
  pagination.currentPage = 1
  loadData()
}

const handleReset = () => {
  queryForm.keyword = ''
  pagination.currentPage = 1
  loadData()
}

const handlePageChange = (page) => {
  pagination.currentPage = page
  loadData()
}

const handlePageSizeChange = (pageSize) => {
  pagination.pageSize = pageSize
  pagination.currentPage = 1
  loadData()
}

const openCreate = () => {
  resetFormData()
  dialogMode.value = 'create'
  dialogVisible.value = true
}

const openEdit = (row) => {
  resetFormData()
  dialogMode.value = 'edit'
  formData.id = row.id
  formData.code = row.code || ''
  formData.name = row.name || ''
  formData.site = row.site || ''
  formData.building = row.building || ''
  formData.floor = row.floor || ''
  formData.area = row.area || ''
  formData.addressDetail = row.addressDetail || ''
  dialogVisible.value = true
}

const openDetail = async (row) => {
  detailVisible.value = true
  detailLoading.value = true
  detailRecord.value = null
  try {
    detailRecord.value = await getLocationDetail(row.id)
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.location.message.detailFailed'))
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
      site: formData.site,
      building: formData.building,
      floor: formData.floor,
      area: formData.area,
      addressDetail: formData.addressDetail,
    }

    if (dialogMode.value === 'create') {
      await createLocation(payload)
    } else {
      await updateLocation(formData.id, payload)
    }

    ElMessage.success(t('ec.organization.common.saveSuccess'))
    dialogVisible.value = false
    await loadData()
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

    await deleteLocation(row.id)
    ElMessage.success(t('ec.organization.common.deleteSuccess'))
    await loadData()
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
  loadData()
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

    .el-input {
      width: 240px;
    }
  }

  .el-pagination {
    justify-content: flex-end;
    margin-top: 16px;
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

  &.is-full {
    grid-column: 1 / -1;
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

      .el-input {
        width: 100%;
      }
    }

    .el-pagination {
      justify-content: center;
    }
  }

  .organization-detail__grid {
    grid-template-columns: 1fr;
  }
}
</style>
