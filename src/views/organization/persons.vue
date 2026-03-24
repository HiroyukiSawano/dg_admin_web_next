<template>
  <figma-resource-shell active-tab="persons" :stats="personStatCards" :stats-loading="statsLoading">
    <template #filters>
      <div class="organization-figma-toolbar">
        <el-input
          v-model="queryForm.keyword"
          clearable
          class="organization-figma-field organization-figma-field--keyword"
          :placeholder="t('ec.organization.person.form.keywordPlaceholder')"
          @keyup.enter="handleSearch"
        />
        <el-tree-select
          v-model="queryForm.departmentId"
          clearable
          check-strictly
          node-key="id"
          class="organization-figma-field"
          :data="departmentOptions"
          :props="{ label: 'name', children: 'children' }"
          :placeholder="t('ec.organization.person.form.departmentPlaceholder')"
        />
        <el-select
          v-model="queryForm.status"
          clearable
          class="organization-figma-field"
          :placeholder="t('ec.organization.person.form.statusPlaceholder')"
        >
          <el-option
            v-for="item in personStatusOptions"
            :key="item.value"
            :label="item.displayLabel"
            :value="item.value"
          />
        </el-select>
        <el-button class="organization-figma-search" type="primary" @click="handleSearch">
          {{ t('ec.global.button.text.search') }}
        </el-button>
        <el-button class="organization-figma-reset" @click="handleReset">
          {{ t('ec.global.button.text.reset') }}
        </el-button>
      </div>
    </template>

    <template #actions>
      <el-button class="organization-figma-primary" type="primary" @click="openCreate">
        {{ t('ec.organization.common.create') }}
      </el-button>
    </template>

    <el-table
      v-loading="tableLoading"
      :data="tableData"
      row-key="id"
      class="organization-figma-table"
    >
      <el-table-column
        type="index"
        width="64"
        :label="t('ec.organization.figma.table.index')"
        :index="indexMethod"
      />
      <el-table-column
        prop="name"
        :label="t('ec.organization.common.name')"
        min-width="130"
        show-overflow-tooltip
      />
      <el-table-column
        prop="gender"
        :label="t('ec.organization.person.table.gender')"
        min-width="90"
        show-overflow-tooltip
      />
      <el-table-column
        prop="idCardNo"
        :label="t('ec.organization.person.table.idCardNo')"
        min-width="180"
        show-overflow-tooltip
      />
      <el-table-column
        :label="t('ec.organization.person.figma.table.company')"
        min-width="160"
        show-overflow-tooltip
      >
        <template #default="{ row }">
          {{ getDepartmentLabel(row) }}
        </template>
      </el-table-column>
      <el-table-column
        prop="mobile"
        :label="t('ec.organization.person.table.mobile')"
        min-width="140"
        show-overflow-tooltip
      />
      <el-table-column
        :label="t('ec.organization.person.figma.table.type')"
        width="110"
      >
        <template #default="{ row }">
          <span class="organization-figma-tag" :class="`is-${getPersonTypeVisual(row.id).tone}`">
            {{ getPersonTypeVisual(row.id).label }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        :label="t('ec.organization.common.actions')"
        fixed="right"
        width="150"
      >
        <template #default="{ row }">
          <div class="organization-figma-actions">
            <button class="organization-figma-icon-button" type="button" @click="openEdit(row)">
              <i class="ri-edit-line"></i>
            </button>
            <button class="organization-figma-icon-button is-danger" type="button" @click="handleDelete(row)">
              <i class="ri-delete-bin-line"></i>
            </button>
            <el-dropdown trigger="click" @command="(command) => handleRowCommand(command, row)">
              <button class="organization-figma-icon-button" type="button">
                <i class="ri-more-line"></i>
              </button>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="detail">{{ t('ec.organization.common.detail') }}</el-dropdown-item>
                  <el-dropdown-item command="relations">{{ t('ec.organization.common.relations') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="t('ec.organization.common.empty')" />
      </template>
    </el-table>

    <template #pagination>
      <el-pagination
        v-model:current-page="pagination.currentPage"
        background
        class="organization-figma-pagination"
        :layout="paginationLayout"
        :total="pagination.total"
        :page-size="pagination.pageSize"
        :page-sizes="pagination.pageSizes"
        @current-change="handlePageChange"
        @update:page-size="handlePageSizeChange"
      />
    </template>
  </figma-resource-shell>

  <el-dialog
    v-model="dialogVisible"
    :title="dialogMode === 'create' ? t('ec.organization.person.dialog.createTitle') : t('ec.organization.person.dialog.editTitle')"
    :width="720"
    :fullscreen="device === 'mobile'"
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
    :fullscreen="device === 'mobile'"
    append-to-body
  >
    <div v-if="detailRecord" v-loading="detailLoading" class="organization-detail">
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
          <span>{{ t('ec.organization.person.figma.table.company') }}</span>
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
          <span>{{ t('ec.organization.person.figma.table.type') }}</span>
          <strong>{{ getPersonTypeVisual(detailRecord.person?.id).label }}</strong>
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
    :fullscreen="device === 'mobile'"
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
  getOrganizationPersonOptions,
  getOrganizationProjectOptions,
  getPersonDepartmentOptions,
  getPersonDetail,
  getPersonList,
  syncPersonRelations,
  updatePerson,
} from '@/services/modules/organizationService'
import {
  buildIdNameMap,
  buildListLabelMap,
  getStatusLabel,
  mapIdsToLabels,
  normalizeRelationIds,
  runInBatches,
} from './helpers'
import FigmaResourceShell from './components/FigmaResourceShell.vue'

defineOptions({ name: 'OrganizationPersons' })

const { t, locale } = useI18n()
const { device } = storeToRefs(useSystemStore())

const tableLoading = ref(false)
const statsLoading = ref(false)
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
const personTypeMap = ref({})

const personStatValues = reactive({
  total: 0,
  development: 0,
  ops: 0,
  hardwareOwners: 0,
})

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
  return device.value === 'mobile' ? 'prev, pager, next' : 'total, sizes, prev, pager, next, jumper'
})

const departmentNameMap = computed(() => buildIdNameMap(departmentOptions.value))

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

const personTypeOptions = computed(() => ({
  DEV: {
    label: t('ec.organization.person.figma.type.dev'),
    tone: 'blue',
  },
  OPS: {
    label: t('ec.organization.person.figma.type.ops'),
    tone: 'green',
  },
}))

const personStatCards = computed(() => {
  return [
    {
      key: 'total',
      label: t('ec.organization.person.figma.stats.total'),
      value: personStatValues.total,
      icon: 'ri-user-3-line',
      tone: 'primary',
    },
    {
      key: 'development',
      label: t('ec.organization.person.figma.stats.development'),
      value: personStatValues.development,
      icon: 'ri-code-box-line',
      tone: 'cyan',
    },
    {
      key: 'ops',
      label: t('ec.organization.person.figma.stats.ops'),
      value: personStatValues.ops,
      icon: 'ri-settings-3-line',
      tone: 'green',
    },
    {
      key: 'hardwareOwners',
      label: t('ec.organization.person.figma.stats.hardwareOwners'),
      value: personStatValues.hardwareOwners,
      icon: 'ri-hard-drive-3-line',
      tone: 'violet',
    },
  ]
})

const buildDisplayLabel = (primary, secondary) => {
  return [primary, secondary].filter(Boolean).join(' / ') || '-'
}

const indexMethod = (index) => {
  return (pagination.currentPage - 1) * pagination.pageSize + index + 1
}

const getPersonTypeCode = (detail) => {
  return normalizeRelationIds(detail?.hardwareAssetIds).length > 0 ? 'OPS' : 'DEV'
}

const getPersonTypeVisual = (personId) => {
  const code = personTypeMap.value[personId] || 'DEV'
  return personTypeOptions.value[code] || personTypeOptions.value.DEV
}

const getDepartmentLabel = (row) => {
  return departmentNameMap.value[row.departmentId] || '-'
}

const resetPersonStats = () => {
  personStatValues.total = 0
  personStatValues.development = 0
  personStatValues.ops = 0
  personStatValues.hardwareOwners = 0
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

const loadPersonStats = async () => {
  statsLoading.value = true
  try {
    const personOptions = await getOrganizationPersonOptions()
    const personIds = personOptions.map((item) => item.id).filter(Boolean)
    const nextTypeMap = {}

    personIds.forEach((id) => {
      nextTypeMap[id] = 'DEV'
    })

    resetPersonStats()
    personStatValues.total = personIds.length

    const settled = await runInBatches(
      personIds,
      async (personId) => getPersonDetail(personId),
      8,
    )

    settled.forEach((result) => {
      if (result.status !== 'fulfilled') return
      const detail = result.value
      const personId = detail?.person?.id
      if (!personId) return

      const typeCode = getPersonTypeCode(detail)
      nextTypeMap[personId] = typeCode

      if (typeCode === 'OPS') {
        personStatValues.hardwareOwners += 1
      }
    })

    Object.values(nextTypeMap).forEach((typeCode) => {
      if (typeCode === 'OPS') {
        personStatValues.ops += 1
        return
      }
      personStatValues.development += 1
    })

    personTypeMap.value = nextTypeMap
  } catch (error) {
    resetPersonStats()
    personTypeMap.value = {}
    ElMessage.error(error.message || t('ec.organization.person.figma.statsLoadFailed'))
  } finally {
    statsLoading.value = false
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

const handleRowCommand = (command, row) => {
  if (command === 'detail') {
    openDetail(row)
    return
  }

  if (command === 'relations') {
    openRelationDialog(row)
  }
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
    await Promise.all([loadData(), loadPersonStats()])
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
    await Promise.all([loadData(), loadPersonStats()])
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
    await loadPersonStats()
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

  await loadData()
  loadPersonStats()
})
</script>

<style lang="scss" scoped>
.organization-figma-toolbar {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  width: 100%;
}

.organization-figma-field {
  width: 200px;
}

.organization-figma-field--keyword {
  width: 240px;
}

.organization-figma-search,
.organization-figma-reset,
.organization-figma-primary {
  min-width: 84px;
  height: 32px;
  padding-inline: 14px;
  border-radius: 8px;
}

.organization-figma-primary {
  min-width: 96px;
}

.organization-figma-table {
  :deep(.el-table__inner-wrapper::before) {
    display: none;
  }

  :deep(th.el-table__cell) {
    height: 46px;
    padding: 0;
    background: #f5f6f9;
    color: #151b26;
    font-weight: 600;
  }

  :deep(td.el-table__cell) {
    height: 46px;
    padding: 0;
    color: #444a57;
  }

  :deep(.cell) {
    line-height: 22px;
  }
}

.organization-figma-tag {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
  line-height: 20px;

  &.is-blue {
    background: #ebf0ff;
    color: #2e5ef0;
  }

  &.is-green {
    background: #dff6e2;
    color: #36b23e;
  }
}

.organization-figma-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.organization-figma-icon-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  padding: 0;
  border: 0;
  border-radius: 8px;
  background: transparent;
  color: #6d7485;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #f5f6f9;
    color: #2e5ef0;
  }

  &.is-danger:hover {
    color: #f56c6c;
  }
}

.organization-figma-pagination {
  justify-content: space-between;
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
  .organization-figma-field,
  .organization-figma-field--keyword {
    width: 100%;
  }

  .organization-figma-search,
  .organization-figma-reset,
  .organization-figma-primary {
    flex: 1;
  }

  .organization-figma-pagination {
    justify-content: center;
  }

  .organization-detail__grid {
    grid-template-columns: 1fr;
  }
}
</style>
