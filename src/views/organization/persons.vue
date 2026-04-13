<template>
  <el-card class="organization-page">
    <el-form :model="queryForm" inline @submit.prevent>
      <el-form-item :label="t('ec.organization.person.form.keyword')">
        <el-input
          v-model="queryForm.keyword"
          clearable
          :placeholder="t('ec.organization.person.form.keywordPlaceholder')"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item :label="t('ec.organization.person.form.department')">
        <el-tree-select
          v-model="queryForm.departmentId"
          clearable
          check-strictly
          node-key="id"
          :data="departmentOptions"
          :props="{ label: 'name', children: 'children' }"
          :placeholder="t('ec.organization.person.form.departmentPlaceholder')"
          style="width: 220px;"
        />
      </el-form-item>
      <el-form-item :label="t('ec.organization.person.form.status')">
        <el-select v-model="queryForm.status" clearable :placeholder="t('ec.organization.person.form.statusPlaceholder')">
          <el-option v-for="item in personStatusOptions" :key="item.value" :label="item.displayLabel" :value="item.value" />
        </el-select>
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
      <el-table-column prop="name" :label="t('ec.organization.common.name')" min-width="160" show-overflow-tooltip />
      <el-table-column prop="employeeNo" :label="t('ec.organization.person.table.employeeNo')" min-width="140" show-overflow-tooltip />
      <el-table-column prop="mobile" :label="t('ec.organization.person.table.mobile')" min-width="160" show-overflow-tooltip />
      <el-table-column :label="t('ec.organization.person.table.departmentName')" min-width="180" show-overflow-tooltip>
        <template #default="{ row }">
          {{ departmentNameMap[row.departmentId] || '-' }}
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.organization.common.status')" width="140">
        <template #default="{ row }">
          <el-tag :type="getStatusTagType(row.status, personStatusMap)">{{ getStatusLabel(row.status, personStatusMap) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.organization.common.updatedAt')" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.organization.common.actions')" fixed="right" width="250">
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
    :title="dialogMode === 'create' ? t('ec.organization.person.dialog.createTitle') : t('ec.organization.person.dialog.editTitle')"
    :width="720"
    destroy-on-close
    append-to-body
    @closed="handleDialogClosed"
  >
    <el-form ref="formRef" :model="formData" :rules="formRules" label-width="110px">
      <el-form-item :label="t('ec.organization.common.name')" prop="name">
        <el-input v-model="formData.name" clearable :placeholder="t('ec.organization.person.form.namePlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.person.table.gender')" prop="gender">
        <el-input v-model="formData.gender" clearable :placeholder="t('ec.organization.person.form.genderPlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.person.table.idCardNo')" prop="idCardNo">
        <el-input v-model="formData.idCardNo" clearable :placeholder="t('ec.organization.person.form.idCardNoPlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.person.table.mobile')" prop="mobile">
        <el-input v-model="formData.mobile" clearable :placeholder="t('ec.organization.person.form.mobilePlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.person.table.employeeNo')" prop="employeeNo">
        <el-input v-model="formData.employeeNo" clearable :placeholder="t('ec.organization.person.form.employeeNoPlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.person.table.photoUrl')" prop="photoUrl">
        <el-input v-model="formData.photoUrl" clearable :placeholder="t('ec.organization.person.form.photoUrlPlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.person.table.account')" prop="account">
        <el-input v-model="formData.account" clearable :placeholder="t('ec.organization.person.form.accountPlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.organization.person.form.department')" prop="departmentId">
        <el-tree-select
          v-model="formData.departmentId"
          clearable
          check-strictly
          node-key="id"
          :data="departmentOptions"
          :props="{ label: 'name', children: 'children' }"
          :placeholder="t('ec.organization.person.form.departmentPlaceholder')"
          style="width: 100%;"
        />
      </el-form-item>
      <el-form-item :label="t('ec.organization.common.status')" prop="status">
        <el-select v-model="formData.status" clearable :placeholder="t('ec.organization.person.form.statusPlaceholder')" style="width: 100%;">
          <el-option v-for="item in personStatusOptions" :key="item.value" :label="item.displayLabel" :value="item.value" />
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
    :title="t('ec.organization.person.drawer.title')"
    size="620px"
    append-to-body
  >
    <div v-loading="detailLoading" class="organization-detail" v-if="detailRecord">
      <div class="organization-detail__grid">
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.common.name') }}</span>
          <strong>{{ detailRecord.person?.name || '-' }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.person.table.gender') }}</span>
          <strong>{{ detailRecord.person?.gender || '-' }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.person.table.mobile') }}</span>
          <strong>{{ detailRecord.person?.mobile || '-' }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.person.table.employeeNo') }}</span>
          <strong>{{ detailRecord.person?.employeeNo || '-' }}</strong>
        </div>
        <div class="organization-detail__item is-full">
          <span>{{ t('ec.organization.person.table.idCardNo') }}</span>
          <strong>{{ detailRecord.person?.idCardNo || '-' }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.person.table.account') }}</span>
          <strong>{{ detailRecord.person?.account || '-' }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.person.table.departmentName') }}</span>
          <strong>{{ departmentNameMap[detailRecord.person?.departmentId] || '-' }}</strong>
        </div>
        <div class="organization-detail__item is-full">
          <span>{{ t('ec.organization.person.table.photoUrl') }}</span>
          <strong>{{ detailRecord.person?.photoUrl || '-' }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.common.status') }}</span>
          <strong>{{ getStatusLabel(detailRecord.person?.status, personStatusMap) }}</strong>
        </div>
        <div class="organization-detail__item">
          <span>{{ t('ec.organization.common.updatedAt') }}</span>
          <strong>{{ formatDateTime(detailRecord.person?.updatedAt) }}</strong>
        </div>
      </div>

      <div class="organization-detail__relations">
        <div class="organization-detail__relation-block">
          <span>{{ t('ec.organization.person.relations.hardwareAssets') }}</span>
          <div class="organization-detail__tags">
            <el-tag v-for="item in hardwareRelationLabels" :key="`hardware-${item}`">{{ item }}</el-tag>
            <el-empty v-if="hardwareRelationLabels.length === 0" :image-size="56" :description="t('ec.organization.common.noRelation')" />
          </div>
        </div>
        <div class="organization-detail__relation-block">
          <span>{{ t('ec.organization.person.relations.informationSystems') }}</span>
          <div class="organization-detail__tags">
            <el-tag v-for="item in informationSystemRelationLabels" :key="`system-${item}`">{{ item }}</el-tag>
            <el-empty v-if="informationSystemRelationLabels.length === 0" :image-size="56" :description="t('ec.organization.common.noRelation')" />
          </div>
        </div>
        <div class="organization-detail__relation-block">
          <span>{{ t('ec.organization.person.relations.projects') }}</span>
          <div class="organization-detail__tags">
            <el-tag v-for="item in projectRelationLabels" :key="`project-${item}`">{{ item }}</el-tag>
            <el-empty v-if="projectRelationLabels.length === 0" :image-size="56" :description="t('ec.organization.common.noRelation')" />
          </div>
        </div>
      </div>
    </div>
  </el-drawer>

  <el-dialog
    v-model="relationDialog.visible"
    :title="t('ec.organization.person.dialog.relationsTitle')"
    :width="720"
    destroy-on-close
    append-to-body
    @closed="handleRelationClosed"
  >
    <div v-loading="relationDialog.loading">
      <el-form :model="relationDialog.form" label-width="110px">
        <el-form-item :label="t('ec.organization.person.relations.hardwareAssets')">
          <el-select
            v-model="relationDialog.form.hardwareAssetIds"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :placeholder="t('ec.organization.person.relation.hardwareAssetsPlaceholder')"
            style="width: 100%;"
          >
            <el-option v-for="item in hardwareOptions" :key="item.id" :label="item.displayLabel" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item :label="t('ec.organization.person.relations.informationSystems')">
          <el-select
            v-model="relationDialog.form.informationSystemIds"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :placeholder="t('ec.organization.person.relation.informationSystemsPlaceholder')"
            style="width: 100%;"
          >
            <el-option v-for="item in informationSystemOptions" :key="item.id" :label="item.displayLabel" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="relationDialog.visible = false">{{ t('ec.global.button.text.cancel') }}</el-button>
      <el-button type="primary" :loading="relationSubmitLoading" @click="handleRelationSubmit">{{ t('ec.global.button.text.submit') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useSystemStore } from '@/stores/modules/systemStore'
import { getStatusDictionaries } from '@/services/modules/dictionaryService'
import { buildStatusOptionMap } from '@/utils/statusDictionary'
import {
  createPerson,
  deletePerson,
  getOrganizationHardwareOptions,
  getOrganizationInformationSystemOptions,
  getOrganizationProjectOptions,
  getPersonDepartmentOptions,
  getPersonDetail,
  getPersonList,
  syncPersonRelations,
  updatePerson,
} from '@/services/modules/organizationService'
import { buildIdNameMap, buildListLabelMap, formatDateTime, getStatusLabel, getStatusTagType, mapIdsToLabels, normalizeRelationIds } from './helpers'

defineOptions({ name: 'OrganizationPersons' })

const { t, locale } = useI18n()
const { device } = storeToRefs(useSystemStore())

const tableLoading = ref(false)
const detailLoading = ref(false)
const submitLoading = ref(false)
const relationSubmitLoading = ref(false)
const dialogVisible = ref(false)
const detailVisible = ref(false)
const dialogMode = ref('create')
const formRef = ref(null)
const tableData = ref([])
const detailRecord = ref(null)
const departmentOptions = ref([])
const statusDictionaries = ref({})
const hardwareOptions = ref([])
const informationSystemOptions = ref([])
const projectOptions = ref([])

const relationDialog = reactive({
  visible: false,
  personId: null,
  loading: false,
  form: {
    hardwareAssetIds: [],
    informationSystemIds: [],
  },
})

const queryForm = reactive({
  keyword: '',
  departmentId: null,
  status: '',
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  total: 0,
})

const formData = reactive({
  id: null,
  name: '',
  gender: '',
  idCardNo: '',
  mobile: '',
  employeeNo: '',
  photoUrl: '',
  account: '',
  departmentId: null,
  status: '',
})

const formRules = {
  name: [{ required: true, message: t('ec.organization.person.validation.nameRequired'), trigger: 'blur' }],
  status: [{ required: true, message: t('ec.organization.person.validation.statusRequired'), trigger: 'change' }],
}

const paginationLayout = computed(() => {
  return device.value === 'mobile' ? 'total, prev, next' : 'total, prev, pager, next, sizes'
})

const departmentNameMap = computed(() => {
  return buildIdNameMap(departmentOptions.value)
})

const personStatusOptions = computed(() => {
  return Object.values(buildStatusOptionMap(statusDictionaries.value.personStatus, locale.value))
})

const personStatusMap = computed(() => {
  return buildStatusOptionMap(personStatusOptions.value, locale.value)
})

const hardwareNameMap = computed(() => buildListLabelMap(hardwareOptions.value, 'displayLabel'))
const informationSystemNameMap = computed(() => buildListLabelMap(informationSystemOptions.value, 'displayLabel'))
const projectNameMap = computed(() => buildListLabelMap(projectOptions.value, 'displayLabel'))
const hardwareRelationLabels = computed(() => mapIdsToLabels(detailRecord.value?.hardwareAssetIds, hardwareNameMap.value))
const informationSystemRelationLabels = computed(() => mapIdsToLabels(detailRecord.value?.informationSystemIds, informationSystemNameMap.value))
const projectRelationLabels = computed(() => mapIdsToLabels(detailRecord.value?.projectIds, projectNameMap.value))

const buildDisplayLabel = (primary, secondary) => {
  return [primary, secondary].filter(Boolean).join(' / ') || '-'
}

const resetFormData = () => {
  formData.id = null
  formData.name = ''
  formData.gender = ''
  formData.idCardNo = ''
  formData.mobile = ''
  formData.employeeNo = ''
  formData.photoUrl = ''
  formData.account = ''
  formData.departmentId = null
  formData.status = ''
}

const loadDepartments = async () => {
  departmentOptions.value = await getPersonDepartmentOptions()
}

const loadStatusOptions = async () => {
  statusDictionaries.value = await getStatusDictionaries()
}

const loadSupportOptions = async () => {
  const [hardwareAssets, informationSystems, projects] = await Promise.all([
    getOrganizationHardwareOptions(),
    getOrganizationInformationSystemOptions(),
    getOrganizationProjectOptions(),
  ])

  hardwareOptions.value = hardwareAssets.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.assetCode, item.assetName),
  }))
  informationSystemOptions.value = informationSystems.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.code, item.name),
  }))
  projectOptions.value = projects.map((item) => ({
    ...item,
    displayLabel: buildDisplayLabel(item.code, item.name),
  }))
}

const loadData = async () => {
  tableLoading.value = true
  try {
    const pageData = await getPersonList({
      pageNo: pagination.currentPage,
      pageSize: pagination.pageSize,
      keyword: queryForm.keyword || undefined,
      departmentId: queryForm.departmentId || undefined,
      status: queryForm.status || undefined,
    })
    tableData.value = pageData.records
    pagination.total = pageData.total
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.person.message.loadFailed'))
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
  queryForm.departmentId = null
  queryForm.status = ''
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
  formData.name = row.name || ''
  formData.gender = row.gender || ''
  formData.idCardNo = row.idCardNo || ''
  formData.mobile = row.mobile || ''
  formData.employeeNo = row.employeeNo || ''
  formData.photoUrl = row.photoUrl || ''
  formData.account = row.account || ''
  formData.departmentId = row.departmentId ?? null
  formData.status = row.status || ''
  dialogVisible.value = true
}

const openDetail = async (row) => {
  detailVisible.value = true
  detailLoading.value = true
  detailRecord.value = null
  try {
    await loadSupportOptions()
    detailRecord.value = await getPersonDetail(row.id)
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.person.message.detailFailed'))
  } finally {
    detailLoading.value = false
  }
}

const openRelationDialog = async (row) => {
  relationDialog.visible = true
  relationDialog.personId = row.id
  relationDialog.loading = true
  try {
    await loadSupportOptions()
    const detail = await getPersonDetail(row.id)
    relationDialog.form.hardwareAssetIds = normalizeRelationIds(detail.hardwareAssetIds)
    relationDialog.form.informationSystemIds = normalizeRelationIds(detail.informationSystemIds)
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.person.message.detailFailed'))
    relationDialog.visible = false
  } finally {
    relationDialog.loading = false
  }
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
      departmentId: formData.departmentId,
      status: formData.status,
    }

    if (dialogMode.value === 'create') {
      await createPerson(payload)
    } else {
      await updatePerson(formData.id, payload)
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
      t('ec.organization.common.deleteConfirm', { name: row.name || row.employeeNo }),
      t('ec.organization.common.delete'),
      {
        type: 'warning',
        confirmButtonText: t('ec.organization.common.delete'),
        cancelButtonText: t('ec.global.button.text.cancel'),
        confirmButtonClass: 'el-button--danger',
      },
    )

    await deletePerson(row.id)
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

const handleRelationSubmit = async () => {
  relationSubmitLoading.value = true
  try {
    await syncPersonRelations(relationDialog.personId, {
      hardwareAssetIds: relationDialog.form.hardwareAssetIds,
      informationSystemIds: relationDialog.form.informationSystemIds,
    })
    ElMessage.success(t('ec.organization.person.relation.saveSuccess'))
    relationDialog.visible = false
    if (detailVisible.value && detailRecord.value?.person?.id === relationDialog.personId) {
      detailRecord.value = await getPersonDetail(relationDialog.personId)
    }
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.person.relation.saveFailed'))
  } finally {
    relationSubmitLoading.value = false
  }
}

const handleRelationClosed = () => {
  relationDialog.personId = null
  relationDialog.loading = false
  relationDialog.form.hardwareAssetIds = []
  relationDialog.form.informationSystemIds = []
}

onMounted(async () => {
  try {
    await Promise.all([loadDepartments(), loadSupportOptions(), loadStatusOptions()])
  } catch (error) {
    ElMessage.error(error.message || t('ec.organization.person.message.departmentLoadFailed'))
  }
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

    .el-input,
    .el-select {
      width: 220px;
    }
  }

  .el-pagination {
    justify-content: flex-end;
    margin-top: 16px;
  }
}

.organization-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 240px;
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

.organization-detail__relations {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.organization-detail__relation-block {
  display: flex;
  flex-direction: column;
  gap: 8px;

  > span {
    color: var(--el-text-color-secondary);
    font-size: var(--el-font-size-small);
  }
}

.organization-detail__tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-light);
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

    .el-pagination {
      justify-content: center;
    }
  }

  .organization-detail__grid {
    grid-template-columns: 1fr;
  }
}
</style>
