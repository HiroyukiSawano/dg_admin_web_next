<template>
  <el-card class="hardware-page">
    <el-form :model="queryForm" inline @submit.prevent>
      <el-form-item :label="t('ec.hardware.common.search')">
        <el-input
          v-model="queryForm.keyword"
          clearable
          :placeholder="t('ec.hardware.common.searchPlaceholder')"
          @keyup.enter="handleSearch"
        />
      </el-form-item>
      <el-form-item :label="t('ec.hardware.common.category')">
        <el-select v-model="queryForm.hardwareCategory" clearable :placeholder="t('ec.hardware.form.categoryPlaceholder')">
          <el-option
            v-for="item in hardwareCategoryOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('ec.hardware.common.status')">
        <el-select v-model="queryForm.hardwareStatus" clearable :placeholder="t('ec.hardware.form.statusPlaceholder')">
          <el-option
            v-for="item in hardwareStatusOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('ec.hardware.common.department')">
        <el-tree-select
          v-model="queryForm.departmentId"
          clearable
          check-strictly
          node-key="id"
          :data="departmentOptions"
          :props="{ label: 'name', children: 'children' }"
          :placeholder="t('ec.hardware.form.departmentPlaceholder')"
          style="width: 220px;"
        />
      </el-form-item>
      <el-form-item :label="t('ec.hardware.common.location')">
        <el-select v-model="queryForm.locationId" clearable filterable :placeholder="t('ec.hardware.form.locationPlaceholder')">
          <el-option v-for="item in locationOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleSearch">{{ t('ec.global.button.text.search') }}</el-button>
        <el-button @click="handleReset">{{ t('ec.global.button.text.reset') }}</el-button>
      </el-form-item>
      <el-form-item class="margin-left-auto">
        <el-button @click="openImportDialog">{{ t('ec.hardware.action.import') }}</el-button>
        <el-button @click="handleExport">{{ t('ec.hardware.action.export') }}</el-button>
        <el-button type="primary" @click="openCreate">{{ t('ec.hardware.common.create') }}</el-button>
      </el-form-item>
    </el-form>

    <el-table v-loading="tableLoading" :data="tableData" row-key="id">
      <el-table-column prop="assetCode" :label="t('ec.hardware.common.code')" min-width="160" show-overflow-tooltip />
      <el-table-column prop="assetName" :label="t('ec.hardware.common.name')" min-width="180" show-overflow-tooltip />
      <el-table-column :label="t('ec.hardware.common.category')" min-width="150">
        <template #default="{ row }">
          {{ getHardwareCategoryLabel(row.hardwareCategory) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.hardware.common.status')" width="140">
        <template #default="{ row }">
          <el-tag :type="getHardwareStatusTagType(row.hardwareStatus)">
            {{ getHardwareStatusLabel(row.hardwareStatus) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.hardware.common.department')" min-width="160" show-overflow-tooltip>
        <template #default="{ row }">
          {{ departmentNameMap[row.departmentId] || '-' }}
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.hardware.common.location')" min-width="160" show-overflow-tooltip>
        <template #default="{ row }">
          {{ locationNameMap[row.locationId] || '-' }}
        </template>
      </el-table-column>
      <el-table-column prop="managementIp" :label="t('ec.hardware.common.managementIp')" min-width="150" show-overflow-tooltip />
      <el-table-column :label="t('ec.hardware.common.updatedAt')" width="180">
        <template #default="{ row }">
          {{ formatDateTime(row.updatedAt) }}
        </template>
      </el-table-column>
      <el-table-column :label="t('ec.hardware.common.actions')" fixed="right" width="260">
        <template #default="{ row }">
          <el-button type="primary" link @click="openDetail(row)">{{ t('ec.hardware.common.detail') }}</el-button>
          <el-button type="primary" link @click="openEdit(row)">{{ t('ec.hardware.common.edit') }}</el-button>
          <el-button type="danger" link @click="handleDelete(row)">{{ t('ec.hardware.common.delete') }}</el-button>
          <el-dropdown>
            <el-button link type="primary">
              {{ t('ec.hardware.common.more') }}
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item @click="openRelationDialog('systems', row)">{{ t('ec.hardware.action.systems') }}</el-dropdown-item>
                <el-dropdown-item @click="openRelationDialog('owners', row)">{{ t('ec.hardware.action.owners') }}</el-dropdown-item>
                <el-dropdown-item @click="openRelationDialog('vendors', row)">{{ t('ec.hardware.action.vendors') }}</el-dropdown-item>
                <el-dropdown-item @click="openLifecycleDialog(row)">{{ t('ec.hardware.action.lifecycle') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </template>
      </el-table-column>
      <template #empty>
        <el-empty :description="t('ec.hardware.common.empty')" />
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
    v-model="formDialog.visible"
    :title="formDialog.mode === 'create' ? t('ec.hardware.form.createTitle') : t('ec.hardware.form.editTitle')"
    :fullscreen="isMobile"
    :width="860"
    destroy-on-close
    append-to-body
    @closed="handleFormClosed"
  >
    <div v-loading="formDialog.loading">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="112px">
        <div class="hardware-section">
          <div class="hardware-section__title">{{ t('ec.hardware.form.basic') }}</div>
          <div class="hardware-form-grid">
            <el-form-item :label="t('ec.hardware.common.code')" prop="assetCode">
              <el-input v-model="formData.assetCode" clearable :placeholder="t('ec.hardware.form.codePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.name')" prop="assetName">
              <el-input v-model="formData.assetName" clearable :placeholder="t('ec.hardware.form.namePlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.category')" prop="hardwareCategory">
              <el-select
                v-model="formData.hardwareCategory"
                clearable
                :placeholder="t('ec.hardware.form.categoryPlaceholder')"
                @change="handleCategoryChange"
              >
                <el-option
                  v-for="item in hardwareCategoryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.department')" prop="departmentId">
              <el-tree-select
                v-model="formData.departmentId"
                clearable
                check-strictly
                node-key="id"
                :data="departmentOptions"
                :props="{ label: 'name', children: 'children' }"
                :placeholder="t('ec.hardware.form.departmentPlaceholder')"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.location')" prop="locationId">
              <el-select v-model="formData.locationId" clearable filterable :placeholder="t('ec.hardware.form.locationPlaceholder')">
                <el-option v-for="item in locationOptions" :key="item.id" :label="item.name" :value="item.id" />
              </el-select>
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.managementIp')" prop="managementIp">
              <el-input v-model="formData.managementIp" clearable :placeholder="t('ec.hardware.form.managementIpPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.businessIp')" prop="businessIp">
              <el-input v-model="formData.businessIp" clearable :placeholder="t('ec.hardware.form.businessIpPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.cpuModel')" prop="cpuModel">
              <el-input v-model="formData.cpuModel" clearable :placeholder="t('ec.hardware.form.cpuModelPlaceholder')" />
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.cpuCores')" prop="cpuCores">
              <el-input-number v-model="formData.cpuCores" :min="0" :step="1" controls-position="right" />
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.memoryGb')" prop="memoryGb">
              <el-input-number v-model="formData.memoryGb" :min="0" :step="1" controls-position="right" />
            </el-form-item>
            <el-form-item :label="t('ec.hardware.common.enabledDate')" prop="enabledDate">
              <el-date-picker
                v-model="formData.enabledDate"
                type="date"
                value-format="YYYY-MM-DD"
                :placeholder="t('ec.hardware.form.enabledDatePlaceholder')"
                style="width: 100%;"
              />
            </el-form-item>
            <el-form-item class="is-full" :label="t('ec.hardware.common.remark')" prop="remark">
              <el-input
                v-model="formData.remark"
                type="textarea"
                :rows="3"
                :placeholder="t('ec.hardware.form.remarkPlaceholder')"
              />
            </el-form-item>
          </div>
        </div>

        <div class="hardware-section">
          <div class="hardware-section__title">{{ t('ec.hardware.form.subtype') }}</div>
          <div class="hardware-form-grid">
            <template v-if="formData.hardwareCategory === 'SERVER'">
              <el-form-item :label="t('ec.hardware.form.os')" prop="operatingSystem">
                <el-input v-model="formData.operatingSystem" clearable :placeholder="t('ec.hardware.form.osPlaceholder')" />
              </el-form-item>
              <el-form-item :label="t('ec.hardware.form.diskGb')" prop="diskGb">
                <el-input-number v-model="formData.diskGb" :min="0" :step="1" controls-position="right" />
              </el-form-item>
              <el-form-item :label="t('ec.hardware.form.virtualization')" prop="virtualization">
                <el-input v-model="formData.virtualization" clearable :placeholder="t('ec.hardware.form.virtualizationPlaceholder')" />
              </el-form-item>
            </template>

            <template v-else-if="formData.hardwareCategory === 'QUERY_TERMINAL'">
              <el-form-item :label="t('ec.hardware.form.screenSize')" prop="screenSize">
                <el-input v-model="formData.screenSize" clearable :placeholder="t('ec.hardware.form.screenSizePlaceholder')" />
              </el-form-item>
              <el-form-item :label="t('ec.hardware.form.touchEnabled')" prop="touchEnabled">
                <el-switch v-model="formData.touchEnabled" />
              </el-form-item>
              <el-form-item :label="t('ec.hardware.form.deviceModel')" prop="deviceModel">
                <el-input v-model="formData.deviceModel" clearable :placeholder="t('ec.hardware.form.deviceModelPlaceholder')" />
              </el-form-item>
            </template>

            <template v-else-if="formData.hardwareCategory === 'TICKET_TERMINAL'">
              <el-form-item :label="t('ec.hardware.form.printerModel')" prop="printerModel">
                <el-input v-model="formData.printerModel" clearable :placeholder="t('ec.hardware.form.printerModelPlaceholder')" />
              </el-form-item>
              <el-form-item :label="t('ec.hardware.form.supportQr')" prop="supportQr">
                <el-switch v-model="formData.supportQr" />
              </el-form-item>
              <el-form-item :label="t('ec.hardware.form.deviceModel')" prop="deviceModel">
                <el-input v-model="formData.deviceModel" clearable :placeholder="t('ec.hardware.form.deviceModelPlaceholder')" />
              </el-form-item>
            </template>

            <template v-else-if="formData.hardwareCategory === 'SELF_SERVICE_TERMINAL'">
              <el-form-item :label="t('ec.hardware.form.terminalType')" prop="terminalType">
                <el-input v-model="formData.terminalType" clearable :placeholder="t('ec.hardware.form.terminalTypePlaceholder')" />
              </el-form-item>
              <el-form-item :label="t('ec.hardware.form.screenSize')" prop="screenSize">
                <el-input v-model="formData.screenSize" clearable :placeholder="t('ec.hardware.form.screenSizePlaceholder')" />
              </el-form-item>
              <el-form-item :label="t('ec.hardware.form.deviceModel')" prop="deviceModel">
                <el-input v-model="formData.deviceModel" clearable :placeholder="t('ec.hardware.form.deviceModelPlaceholder')" />
              </el-form-item>
            </template>

            <div v-else class="hardware-empty">
              <el-empty :description="t('ec.hardware.detail.noneSubtype')" :image-size="64" />
            </div>
          </div>
        </div>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="formDialog.visible = false">{{ t('ec.global.button.text.cancel') }}</el-button>
      <el-button type="primary" :loading="submitLoading" @click="handleSubmit">{{ t('ec.global.button.text.submit') }}</el-button>
    </template>
  </el-dialog>

  <el-drawer
    v-model="detailVisible"
    :title="t('ec.hardware.detail.title')"
    :size="isMobile ? '100%' : '720px'"
    append-to-body
  >
    <div v-loading="detailLoading" class="hardware-detail" v-if="detailRecord">
      <div class="hardware-section">
        <div class="hardware-section__title">{{ t('ec.hardware.detail.basic') }}</div>
        <div class="hardware-detail__grid">
          <div class="hardware-detail__item">
            <span>{{ t('ec.hardware.common.code') }}</span>
            <strong>{{ detailRecord.hardwareAsset?.assetCode || '-' }}</strong>
          </div>
          <div class="hardware-detail__item">
            <span>{{ t('ec.hardware.common.name') }}</span>
            <strong>{{ detailRecord.hardwareAsset?.assetName || '-' }}</strong>
          </div>
          <div class="hardware-detail__item">
            <span>{{ t('ec.hardware.common.category') }}</span>
            <strong>{{ getHardwareCategoryLabel(detailRecord.hardwareAsset?.hardwareCategory) }}</strong>
          </div>
          <div class="hardware-detail__item">
            <span>{{ t('ec.hardware.common.status') }}</span>
            <strong>{{ getHardwareStatusLabel(detailRecord.hardwareAsset?.hardwareStatus) }}</strong>
          </div>
          <div class="hardware-detail__item">
            <span>{{ t('ec.hardware.common.department') }}</span>
            <strong>{{ departmentNameMap[detailRecord.hardwareAsset?.departmentId] || '-' }}</strong>
          </div>
          <div class="hardware-detail__item">
            <span>{{ t('ec.hardware.common.location') }}</span>
            <strong>{{ locationNameMap[detailRecord.hardwareAsset?.locationId] || '-' }}</strong>
          </div>
          <div class="hardware-detail__item">
            <span>{{ t('ec.hardware.common.managementIp') }}</span>
            <strong>{{ detailRecord.hardwareAsset?.managementIp || '-' }}</strong>
          </div>
          <div class="hardware-detail__item">
            <span>{{ t('ec.hardware.common.businessIp') }}</span>
            <strong>{{ detailRecord.hardwareAsset?.businessIp || '-' }}</strong>
          </div>
          <div class="hardware-detail__item">
            <span>{{ t('ec.hardware.common.cpuModel') }}</span>
            <strong>{{ detailRecord.hardwareAsset?.cpuModel || '-' }}</strong>
          </div>
          <div class="hardware-detail__item">
            <span>{{ t('ec.hardware.common.cpuCores') }}</span>
            <strong>{{ detailRecord.hardwareAsset?.cpuCores ?? '-' }}</strong>
          </div>
          <div class="hardware-detail__item">
            <span>{{ t('ec.hardware.common.memoryGb') }}</span>
            <strong>{{ detailRecord.hardwareAsset?.memoryGb ?? '-' }}</strong>
          </div>
          <div class="hardware-detail__item">
            <span>{{ t('ec.hardware.common.enabledDate') }}</span>
            <strong>{{ formatDate(detailRecord.hardwareAsset?.enabledDate) }}</strong>
          </div>
          <div class="hardware-detail__item is-full">
            <span>{{ t('ec.hardware.common.remark') }}</span>
            <strong>{{ detailRecord.hardwareAsset?.remark || '-' }}</strong>
          </div>
          <div class="hardware-detail__item">
            <span>{{ t('ec.hardware.common.createdAt') }}</span>
            <strong>{{ formatDateTime(detailRecord.hardwareAsset?.createdAt) }}</strong>
          </div>
          <div class="hardware-detail__item">
            <span>{{ t('ec.hardware.common.updatedAt') }}</span>
            <strong>{{ formatDateTime(detailRecord.hardwareAsset?.updatedAt) }}</strong>
          </div>
        </div>
      </div>

      <div class="hardware-section">
        <div class="hardware-section__title">{{ t('ec.hardware.detail.subtype') }}</div>
        <div v-if="subtypeEntries.length" class="hardware-detail__grid">
          <div v-for="item in subtypeEntries" :key="item.key" class="hardware-detail__item">
            <span>{{ item.label }}</span>
            <strong>{{ item.value }}</strong>
          </div>
        </div>
        <el-empty v-else :description="t('ec.hardware.detail.noneSubtype')" :image-size="64" />
      </div>

      <div class="hardware-section">
        <div class="hardware-section__title">{{ t('ec.hardware.detail.systems') }}</div>
        <div class="hardware-tag-panel">
          <el-tag v-for="(item, index) in systemRelationLabels" :key="`system-${index}`">{{ item }}</el-tag>
          <el-empty v-if="systemRelationLabels.length === 0" :description="t('ec.hardware.common.noData')" :image-size="56" />
        </div>
      </div>

      <div class="hardware-section">
        <div class="hardware-section__title">{{ t('ec.hardware.detail.owners') }}</div>
        <div class="hardware-tag-panel">
          <el-tag v-for="(item, index) in ownerRelationLabels" :key="`owner-${index}`">{{ item }}</el-tag>
          <el-empty v-if="ownerRelationLabels.length === 0" :description="t('ec.hardware.common.noData')" :image-size="56" />
        </div>
      </div>

      <div class="hardware-section">
        <div class="hardware-section__title">{{ t('ec.hardware.detail.vendors') }}</div>
        <div class="hardware-tag-panel">
          <el-tag v-for="(item, index) in vendorRelationLabels" :key="`vendor-${index}`">{{ item }}</el-tag>
          <el-empty v-if="vendorRelationLabels.length === 0" :description="t('ec.hardware.common.noData')" :image-size="56" />
        </div>
      </div>

      <div class="hardware-section">
        <div class="hardware-section__title">{{ t('ec.hardware.detail.lifecycle') }}</div>
        <el-timeline v-if="detailRecord.lifecycleRecords.length">
          <el-timeline-item
            v-for="item in detailRecord.lifecycleRecords"
            :key="item.id"
            :timestamp="formatDateTime(item.actionTime)"
            placement="top"
          >
            <div class="hardware-timeline__title">{{ getLifecycleActionLabel(item.actionType) }}</div>
            <div class="hardware-timeline__meta">{{ getHardwareStatusLabel(item.fromStatus) }} -> {{ getHardwareStatusLabel(item.toStatus) }}</div>
            <div class="hardware-timeline__meta">{{ t('ec.hardware.detail.operator') }}: {{ item.operator || '-' }}</div>
            <div class="hardware-timeline__meta">{{ t('ec.hardware.detail.reason') }}: {{ item.reason || '-' }}</div>
          </el-timeline-item>
        </el-timeline>
        <el-empty v-else :description="t('ec.hardware.common.noData')" :image-size="64" />
      </div>
    </div>
  </el-drawer>

  <el-dialog
    v-model="relationDialog.visible"
    :title="relationDialogTitle"
    :fullscreen="isMobile"
    :width="640"
    destroy-on-close
    append-to-body
    @closed="handleRelationClosed"
  >
    <div v-loading="relationDialog.loading">
      <el-form label-width="110px">
        <el-form-item v-if="relationDialog.type === 'systems'" :label="t('ec.hardware.detail.systems')">
          <el-select
            v-model="relationDialog.values"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :placeholder="t('ec.hardware.relation.systemsPlaceholder')"
            style="width: 100%;"
          >
            <el-option v-for="item in systemOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-else-if="relationDialog.type === 'owners'" :label="t('ec.hardware.detail.owners')">
          <el-select
            v-model="relationDialog.ownerId"
            clearable
            filterable
            :placeholder="t('ec.hardware.relation.ownersPlaceholder')"
            style="width: 100%;"
          >
            <el-option v-for="item in personOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item v-else :label="t('ec.hardware.detail.vendors')">
          <el-select
            v-model="relationDialog.values"
            multiple
            filterable
            collapse-tags
            collapse-tags-tooltip
            :placeholder="t('ec.hardware.relation.vendorsPlaceholder')"
            style="width: 100%;"
          >
            <el-option v-for="item in vendorOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <template #footer>
      <el-button @click="relationDialog.visible = false">{{ t('ec.global.button.text.cancel') }}</el-button>
      <el-button type="primary" :loading="relationSubmitLoading" @click="handleRelationSubmit">{{ t('ec.global.button.text.submit') }}</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="lifecycleDialog.visible"
    :title="t('ec.hardware.lifecycle.title')"
    :fullscreen="isMobile"
    :width="640"
    destroy-on-close
    append-to-body
    @closed="handleLifecycleClosed"
  >
    <el-form ref="lifecycleFormRef" :model="lifecycleDialog.form" :rules="lifecycleRules" label-width="110px">
      <el-form-item :label="t('ec.hardware.lifecycle.action')" prop="action">
        <el-select
          v-model="lifecycleDialog.form.action"
          :placeholder="t('ec.hardware.lifecycle.actionPlaceholder')"
          style="width: 100%;"
        >
          <el-option
            v-for="item in lifecycleActionOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item :label="t('ec.hardware.lifecycle.reason')" prop="reason">
        <el-input v-model="lifecycleDialog.form.reason" type="textarea" :rows="3" :placeholder="t('ec.hardware.lifecycle.reasonPlaceholder')" />
      </el-form-item>
      <el-form-item :label="t('ec.hardware.lifecycle.operator')" prop="operator">
        <el-input v-model="lifecycleDialog.form.operator" clearable :placeholder="t('ec.hardware.lifecycle.operatorPlaceholder')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="lifecycleDialog.visible = false">{{ t('ec.global.button.text.cancel') }}</el-button>
      <el-button type="primary" :loading="lifecycleSubmitLoading" @click="handleLifecycleSubmit">{{ t('ec.global.button.text.submit') }}</el-button>
    </template>
  </el-dialog>

  <el-dialog
    v-model="importDialog.visible"
    :title="t('ec.hardware.import.title')"
    :fullscreen="isMobile"
    :width="760"
    destroy-on-close
    append-to-body
  >
    <el-form label-width="96px">
      <el-form-item :label="t('ec.hardware.import.payload')">
        <el-input
          v-model="importDialog.payload"
          type="textarea"
          :rows="14"
          :placeholder="t('ec.hardware.import.payloadPlaceholder')"
        />
      </el-form-item>
      <div class="hardware-import__helper">{{ t('ec.hardware.import.helper') }}</div>
      <div class="hardware-import__example">{{ t('ec.hardware.import.example') }}</div>
      <pre class="hardware-import__code">{{ importExample }}</pre>
    </el-form>
    <template #footer>
      <el-button @click="importDialog.visible = false">{{ t('ec.global.button.text.cancel') }}</el-button>
      <el-button type="primary" :loading="importSubmitLoading" @click="handleImportSubmit">{{ t('ec.hardware.import.submit') }}</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useSystemStore } from '@/stores/modules/systemStore'
import {
  batchImportHardwareAssets,
  createHardwareAsset,
  deleteHardwareAsset,
  executeHardwareLifecycle,
  exportHardwareAssets,
  getHardwareAssetDetail,
  getHardwareAssetList,
  getHardwareDepartmentOptions,
  getHardwareLocationOptions,
  getHardwarePersonOptions,
  getHardwareSystemOptions,
  getHardwareVendorOptions,
  syncHardwareOwners,
  syncHardwareSystems,
  syncHardwareVendors,
  updateHardwareAsset,
} from '@/services/modules/hardwareService'
import {
  buildListLabelMap,
  buildTreeLabelMap,
  formatDate,
  formatDateTime,
  getFilenameFromDisposition,
  parseImportText,
} from './helpers'

defineOptions({ name: 'HardwareAssets' })

const { t } = useI18n()
const { device } = storeToRefs(useSystemStore())

const formRef = ref(null)
const lifecycleFormRef = ref(null)

const tableLoading = ref(false)
const detailLoading = ref(false)
const submitLoading = ref(false)
const relationSubmitLoading = ref(false)
const lifecycleSubmitLoading = ref(false)
const importSubmitLoading = ref(false)
const detailVisible = ref(false)
const detailRecord = ref(null)
const tableData = ref([])
const departmentOptions = ref([])
const locationOptions = ref([])
const personOptions = ref([])
const vendorOptions = ref([])
const systemOptions = ref([])

const queryForm = reactive({
  keyword: '',
  hardwareCategory: '',
  hardwareStatus: '',
  departmentId: null,
  locationId: null,
})

const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 50, 100],
  total: 0,
})

const formDialog = reactive({
  visible: false,
  mode: 'create',
  loading: false,
  assetId: null,
})

const relationDialog = reactive({
  visible: false,
  loading: false,
  type: 'systems',
  assetId: null,
  values: [],
  ownerId: null,
})

const lifecycleDialog = reactive({
  visible: false,
  assetId: null,
  currentStatus: '',
  form: {
    action: '',
    reason: '',
    operator: '',
  },
})

const importDialog = reactive({
  visible: false,
  payload: '',
})

const formData = reactive({
  assetCode: '',
  assetName: '',
  hardwareCategory: '',
  locationId: null,
  departmentId: null,
  managementIp: '',
  businessIp: '',
  cpuModel: '',
  cpuCores: null,
  memoryGb: null,
  enabledDate: '',
  remark: '',
  operatingSystem: '',
  diskGb: null,
  virtualization: '',
  screenSize: '',
  touchEnabled: false,
  deviceModel: '',
  printerModel: '',
  supportQr: false,
  terminalType: '',
})

const formRules = {
  assetCode: [{ required: true, message: t('ec.hardware.form.validation.codeRequired'), trigger: 'blur' }],
  assetName: [{ required: true, message: t('ec.hardware.form.validation.nameRequired'), trigger: 'blur' }],
  hardwareCategory: [{ required: true, message: t('ec.hardware.form.validation.categoryRequired'), trigger: 'change' }],
}

const lifecycleRules = {
  action: [{ required: true, message: t('ec.hardware.lifecycle.validation.actionRequired'), trigger: 'change' }],
}

const hardwareCategoryOptions = computed(() => {
  return [
    { value: 'SERVER', label: t('ec.hardware.category.server') },
    { value: 'QUERY_TERMINAL', label: t('ec.hardware.category.queryTerminal') },
    { value: 'TICKET_TERMINAL', label: t('ec.hardware.category.ticketTerminal') },
    { value: 'SELF_SERVICE_TERMINAL', label: t('ec.hardware.category.selfServiceTerminal') },
  ]
})

const hardwareStatusOptions = computed(() => {
  return [
    { value: 'REGISTERED', label: t('ec.hardware.status.registered') },
    { value: 'IN_STOCK', label: t('ec.hardware.status.inStock') },
    { value: 'ASSIGNED', label: t('ec.hardware.status.assigned') },
    { value: 'CHANGED', label: t('ec.hardware.status.changed') },
    { value: 'IDLE', label: t('ec.hardware.status.idle') },
    { value: 'MAINTAINING', label: t('ec.hardware.status.maintaining') },
    { value: 'OFFLINE', label: t('ec.hardware.status.offline') },
    { value: 'SCRAPPED', label: t('ec.hardware.status.scrapped') },
  ]
})

const paginationLayout = computed(() => {
  return device.value === 'mobile' ? 'total, prev, next' : 'total, prev, pager, next, sizes'
})

const isMobile = computed(() => device.value === 'mobile')

const departmentNameMap = computed(() => buildTreeLabelMap(departmentOptions.value))
const locationNameMap = computed(() => buildListLabelMap(locationOptions.value))
const personNameMap = computed(() => buildListLabelMap(personOptions.value))
const vendorNameMap = computed(() => buildListLabelMap(vendorOptions.value))
const systemNameMap = computed(() => buildListLabelMap(systemOptions.value))

const relationDialogTitle = computed(() => {
  if (relationDialog.type === 'systems') return t('ec.hardware.relation.systemsTitle')
  if (relationDialog.type === 'owners') return t('ec.hardware.relation.ownersTitle')
  return t('ec.hardware.relation.vendorsTitle')
})

const lifecycleActionOptions = computed(() => {
  const mapping = {
    REGISTERED: ['IN_STOCK'],
    IN_STOCK: ['ASSIGN'],
    ASSIGNED: ['CHANGE', 'IDLE', 'MAINTAIN'],
    CHANGED: ['IDLE', 'MAINTAIN', 'OFFLINE'],
    IDLE: ['ASSIGN', 'MAINTAIN', 'OFFLINE'],
    MAINTAINING: ['OFFLINE'],
    OFFLINE: ['SCRAP'],
  }

  return (mapping[lifecycleDialog.currentStatus] || []).map((value) => ({
    value,
    label: getLifecycleActionLabel(value),
  }))
})

const subtypeEntries = computed(() => {
  const detail = detailRecord.value?.subtypeDetail
  const category = detailRecord.value?.hardwareAsset?.hardwareCategory
  if (!detail || !category) return []

  if (category === 'SERVER') {
    return [
      { key: 'operatingSystem', label: t('ec.hardware.form.os'), value: detail.operatingSystem || '-' },
      { key: 'diskGb', label: t('ec.hardware.form.diskGb'), value: detail.diskGb ?? '-' },
      { key: 'virtualization', label: t('ec.hardware.form.virtualization'), value: detail.virtualization || '-' },
    ]
  }

  if (category === 'QUERY_TERMINAL') {
    return [
      { key: 'screenSize', label: t('ec.hardware.form.screenSize'), value: detail.screenSize || '-' },
      { key: 'touchEnabled', label: t('ec.hardware.form.touchEnabled'), value: normalizeBooleanText(detail.touchEnabled) },
      { key: 'deviceModel', label: t('ec.hardware.form.deviceModel'), value: detail.deviceModel || '-' },
    ]
  }

  if (category === 'TICKET_TERMINAL') {
    return [
      { key: 'printerModel', label: t('ec.hardware.form.printerModel'), value: detail.printerModel || '-' },
      { key: 'supportQr', label: t('ec.hardware.form.supportQr'), value: normalizeBooleanText(detail.supportQr) },
      { key: 'deviceModel', label: t('ec.hardware.form.deviceModel'), value: detail.deviceModel || '-' },
    ]
  }

  return [
    { key: 'terminalType', label: t('ec.hardware.form.terminalType'), value: detail.terminalType || '-' },
    { key: 'screenSize', label: t('ec.hardware.form.screenSize'), value: detail.screenSize || '-' },
    { key: 'deviceModel', label: t('ec.hardware.form.deviceModel'), value: detail.deviceModel || '-' },
  ]
})

const systemRelationLabels = computed(() => mapIdsToLabels(detailRecord.value?.informationSystemIds, systemNameMap.value))
const ownerRelationLabels = computed(() => mapIdsToLabels(detailRecord.value?.ownerIds, personNameMap.value))
const vendorRelationLabels = computed(() => mapIdsToLabels(detailRecord.value?.vendorIds, vendorNameMap.value))

const importExample = computed(() => {
  return JSON.stringify(
    [
      {
        assetCode: 'HW-202603-001',
        assetName: '核心数据库服务器',
        hardwareCategory: 'SERVER',
        departmentId: 1,
        locationId: 1,
        managementIp: '10.0.0.10',
        businessIp: '172.16.0.10',
        cpuModel: 'Xeon Gold',
        cpuCores: 16,
        memoryGb: 64,
        enabledDate: '2026-03-20',
        remark: '硬件前端联调样例',
        operatingSystem: 'CentOS 7',
        diskGb: 1024,
        virtualization: 'VMware',
      },
    ],
    null,
    2,
  )
})

const normalizeBooleanText = (value) => {
  if (value === true || value === 1) return t('ec.hardware.common.yes')
  if (value === false || value === 0) return t('ec.hardware.common.no')
  return '-'
}

const getHardwareCategoryLabel = (value) => {
  const matched = hardwareCategoryOptions.value.find((item) => item.value === value)
  return matched?.label || value || '-'
}

const getHardwareStatusLabel = (value) => {
  const matched = hardwareStatusOptions.value.find((item) => item.value === value)
  return matched?.label || value || '-'
}

const getHardwareStatusTagType = (value) => {
  if (value === 'ASSIGNED') return 'success'
  if (value === 'MAINTAINING') return 'warning'
  if (value === 'OFFLINE' || value === 'SCRAPPED') return 'danger'
  return 'info'
}

const getLifecycleActionLabel = (value) => {
  const mapping = {
    IN_STOCK: t('ec.hardware.lifecycle.action.inStock'),
    ASSIGN: t('ec.hardware.lifecycle.action.assign'),
    CHANGE: t('ec.hardware.lifecycle.action.change'),
    IDLE: t('ec.hardware.lifecycle.action.idle'),
    MAINTAIN: t('ec.hardware.lifecycle.action.maintain'),
    OFFLINE: t('ec.hardware.lifecycle.action.offline'),
    SCRAP: t('ec.hardware.lifecycle.action.scrap'),
    REGISTER: t('ec.hardware.lifecycle.action.register'),
  }

  return mapping[value] || value || '-'
}

const mapIdsToLabels = (ids, mapping) => {
  const source = Array.isArray(ids) ? ids : []
  return source.map((item) => mapping[item] || String(item))
}

const resetFormData = () => {
  formData.assetCode = ''
  formData.assetName = ''
  formData.hardwareCategory = ''
  formData.locationId = null
  formData.departmentId = null
  formData.managementIp = ''
  formData.businessIp = ''
  formData.cpuModel = ''
  formData.cpuCores = null
  formData.memoryGb = null
  formData.enabledDate = ''
  formData.remark = ''
  formData.operatingSystem = ''
  formData.diskGb = null
  formData.virtualization = ''
  formData.screenSize = ''
  formData.touchEnabled = false
  formData.deviceModel = ''
  formData.printerModel = ''
  formData.supportQr = false
  formData.terminalType = ''
}

const resetRelationDialog = () => {
  relationDialog.type = 'systems'
  relationDialog.assetId = null
  relationDialog.values = []
  relationDialog.ownerId = null
  relationDialog.loading = false
}

const resetLifecycleDialog = () => {
  lifecycleDialog.assetId = null
  lifecycleDialog.currentStatus = ''
  lifecycleDialog.form.action = ''
  lifecycleDialog.form.reason = ''
  lifecycleDialog.form.operator = ''
}

const handleCategoryChange = () => {
  formData.operatingSystem = ''
  formData.diskGb = null
  formData.virtualization = ''
  formData.screenSize = ''
  formData.touchEnabled = false
  formData.deviceModel = ''
  formData.printerModel = ''
  formData.supportQr = false
  formData.terminalType = ''
}

const fillFormData = (detail) => {
  const asset = detail?.hardwareAsset || {}
  const subtype = detail?.subtypeDetail || {}

  resetFormData()
  formData.assetCode = asset.assetCode || ''
  formData.assetName = asset.assetName || ''
  formData.hardwareCategory = asset.hardwareCategory || ''
  formData.locationId = asset.locationId ?? null
  formData.departmentId = asset.departmentId ?? null
  formData.managementIp = asset.managementIp || ''
  formData.businessIp = asset.businessIp || ''
  formData.cpuModel = asset.cpuModel || ''
  formData.cpuCores = asset.cpuCores ?? null
  formData.memoryGb = asset.memoryGb ?? null
  formData.enabledDate = asset.enabledDate || ''
  formData.remark = asset.remark || ''

  if (asset.hardwareCategory === 'SERVER') {
    formData.operatingSystem = subtype.operatingSystem || ''
    formData.diskGb = subtype.diskGb ?? null
    formData.virtualization = subtype.virtualization || ''
    return
  }

  if (asset.hardwareCategory === 'QUERY_TERMINAL') {
    formData.screenSize = subtype.screenSize || ''
    formData.touchEnabled = subtype.touchEnabled === 1 || subtype.touchEnabled === true
    formData.deviceModel = subtype.deviceModel || ''
    return
  }

  if (asset.hardwareCategory === 'TICKET_TERMINAL') {
    formData.printerModel = subtype.printerModel || ''
    formData.supportQr = subtype.supportQr === 1 || subtype.supportQr === true
    formData.deviceModel = subtype.deviceModel || ''
    return
  }

  if (asset.hardwareCategory === 'SELF_SERVICE_TERMINAL') {
    formData.terminalType = subtype.terminalType || ''
    formData.screenSize = subtype.screenSize || ''
    formData.deviceModel = subtype.deviceModel || ''
  }
}

const buildSubmitPayload = () => {
  const payload = {
    assetCode: formData.assetCode,
    assetName: formData.assetName,
    hardwareCategory: formData.hardwareCategory,
    locationId: formData.locationId,
    departmentId: formData.departmentId,
    managementIp: formData.managementIp,
    businessIp: formData.businessIp,
    cpuModel: formData.cpuModel,
    cpuCores: formData.cpuCores,
    memoryGb: formData.memoryGb,
    enabledDate: formData.enabledDate || null,
    remark: formData.remark,
  }

  if (formData.hardwareCategory === 'SERVER') {
    return { ...payload, operatingSystem: formData.operatingSystem, diskGb: formData.diskGb, virtualization: formData.virtualization }
  }

  if (formData.hardwareCategory === 'QUERY_TERMINAL') {
    return { ...payload, screenSize: formData.screenSize, touchEnabled: formData.touchEnabled, deviceModel: formData.deviceModel }
  }

  if (formData.hardwareCategory === 'TICKET_TERMINAL') {
    return { ...payload, printerModel: formData.printerModel, supportQr: formData.supportQr, deviceModel: formData.deviceModel }
  }

  if (formData.hardwareCategory === 'SELF_SERVICE_TERMINAL') {
    return { ...payload, terminalType: formData.terminalType, screenSize: formData.screenSize, deviceModel: formData.deviceModel }
  }

  return payload
}

const loadSupportOptions = async () => {
  const [departmentList, locationList, personList, vendorList, systemList] = await Promise.all([
    getHardwareDepartmentOptions(),
    getHardwareLocationOptions(),
    getHardwarePersonOptions(),
    getHardwareVendorOptions(),
    getHardwareSystemOptions(),
  ])

  departmentOptions.value = departmentList
  locationOptions.value = locationList
  personOptions.value = personList
  vendorOptions.value = vendorList
  systemOptions.value = systemList
}

const loadData = async () => {
  tableLoading.value = true
  try {
    const pageData = await getHardwareAssetList({
      pageNo: pagination.currentPage,
      pageSize: pagination.pageSize,
      keyword: queryForm.keyword || undefined,
      hardwareCategory: queryForm.hardwareCategory || undefined,
      hardwareStatus: queryForm.hardwareStatus || undefined,
      departmentId: queryForm.departmentId || undefined,
      locationId: queryForm.locationId || undefined,
    })
    tableData.value = pageData.records
    pagination.total = pageData.total
  } catch (error) {
    ElMessage.error(error.message || t('ec.hardware.load.failed'))
  } finally {
    tableLoading.value = false
  }
}

const fetchDetail = async (id) => getHardwareAssetDetail(id)

const handleSearch = () => {
  pagination.currentPage = 1
  loadData()
}

const handleReset = () => {
  queryForm.keyword = ''
  queryForm.hardwareCategory = ''
  queryForm.hardwareStatus = ''
  queryForm.departmentId = null
  queryForm.locationId = null
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
  formDialog.mode = 'create'
  formDialog.assetId = null
  formDialog.loading = false
  resetFormData()
  formDialog.visible = true
}

const openEdit = async (row) => {
  formDialog.mode = 'edit'
  formDialog.assetId = row.id
  formDialog.visible = true
  formDialog.loading = true
  try {
    const detail = await fetchDetail(row.id)
    fillFormData(detail)
  } catch (error) {
    ElMessage.error(error.message || t('ec.hardware.detail.failed'))
    formDialog.visible = false
  } finally {
    formDialog.loading = false
  }
}

const openDetail = async (row) => {
  detailVisible.value = true
  detailLoading.value = true
  detailRecord.value = null
  try {
    detailRecord.value = await fetchDetail(row.id)
  } catch (error) {
    ElMessage.error(error.message || t('ec.hardware.detail.failed'))
  } finally {
    detailLoading.value = false
  }
}

const handleDelete = async (row) => {
  try {
    await ElMessageBox.confirm(
      t('ec.hardware.common.deleteConfirm', { name: row.assetName || row.assetCode }),
      t('ec.hardware.common.delete'),
      {
        type: 'warning',
        confirmButtonText: t('ec.hardware.common.delete'),
        cancelButtonText: t('ec.global.button.text.cancel'),
        confirmButtonClass: 'el-button--danger',
      },
    )
    await deleteHardwareAsset(row.id)
    ElMessage.success(t('ec.hardware.common.deleteSuccess'))
    await loadData()
  } catch (error) {
    if (error === 'cancel' || error === 'close') return
    ElMessage.error(error.message || t('ec.hardware.common.deleteFailed'))
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitLoading.value = true
  try {
    const payload = buildSubmitPayload()
    if (formDialog.mode === 'create') {
      await createHardwareAsset(payload)
    } else {
      await updateHardwareAsset(formDialog.assetId, payload)
    }
    ElMessage.success(t('ec.hardware.common.saveSuccess'))
    formDialog.visible = false
    await loadData()
  } catch (error) {
    ElMessage.error(error.message || t('ec.hardware.common.saveFailed'))
  } finally {
    submitLoading.value = false
  }
}

const openRelationDialog = async (type, row) => {
  relationDialog.visible = true
  relationDialog.loading = true
  relationDialog.type = type
  relationDialog.assetId = row.id
  relationDialog.values = []
  relationDialog.ownerId = null

  try {
    const detail = await fetchDetail(row.id)
    if (type === 'systems') {
      relationDialog.values = Array.isArray(detail.informationSystemIds) ? detail.informationSystemIds : []
    } else if (type === 'owners') {
      const ownerIds = Array.isArray(detail.ownerIds) ? detail.ownerIds : []
      relationDialog.ownerId = ownerIds[0] ?? null
    } else {
      relationDialog.values = Array.isArray(detail.vendorIds) ? detail.vendorIds : []
    }
  } catch (error) {
    ElMessage.error(error.message || t('ec.hardware.detail.failed'))
    relationDialog.visible = false
  } finally {
    relationDialog.loading = false
  }
}

const handleRelationSubmit = async () => {
  relationSubmitLoading.value = true
  try {
    const assetId = relationDialog.assetId
    if (relationDialog.type === 'systems') {
      await syncHardwareSystems(assetId, relationDialog.values)
    } else if (relationDialog.type === 'owners') {
      await syncHardwareOwners(assetId, relationDialog.ownerId ? [relationDialog.ownerId] : [])
    } else {
      await syncHardwareVendors(assetId, relationDialog.values)
    }

    ElMessage.success(t('ec.hardware.relation.saveSuccess'))
    relationDialog.visible = false
    if (detailVisible.value && detailRecord.value?.hardwareAsset?.id === assetId) {
      detailRecord.value = await fetchDetail(assetId)
    }
  } catch (error) {
    ElMessage.error(error.message || t('ec.hardware.relation.saveFailed'))
  } finally {
    relationSubmitLoading.value = false
  }
}

const openLifecycleDialog = (row) => {
  resetLifecycleDialog()
  lifecycleDialog.assetId = row.id
  lifecycleDialog.currentStatus = row.hardwareStatus || ''
  lifecycleDialog.visible = true
}

const handleLifecycleSubmit = async () => {
  if (!lifecycleFormRef.value) return
  const valid = await lifecycleFormRef.value.validate().catch(() => false)
  if (!valid) return

  lifecycleSubmitLoading.value = true
  try {
    const assetId = lifecycleDialog.assetId
    await executeHardwareLifecycle(assetId, {
      action: lifecycleDialog.form.action,
      reason: lifecycleDialog.form.reason,
      operator: lifecycleDialog.form.operator,
    })
    ElMessage.success(t('ec.hardware.lifecycle.saveSuccess'))
    lifecycleDialog.visible = false
    await loadData()
    if (detailVisible.value && detailRecord.value?.hardwareAsset?.id === assetId) {
      detailRecord.value = await fetchDetail(assetId)
    }
  } catch (error) {
    ElMessage.error(error.message || t('ec.hardware.lifecycle.saveFailed'))
  } finally {
    lifecycleSubmitLoading.value = false
  }
}

const openImportDialog = () => {
  importDialog.payload = importExample.value
  importDialog.visible = true
}

const handleImportSubmit = async () => {
  importSubmitLoading.value = true
  try {
    const items = parseImportText(importDialog.payload)
    await batchImportHardwareAssets(items)
    ElMessage.success(t('ec.hardware.import.success'))
    importDialog.visible = false
    await loadData()
  } catch (error) {
    ElMessage.error(error.message || t('ec.hardware.import.failed'))
  } finally {
    importSubmitLoading.value = false
  }
}

const handleExport = async () => {
  try {
    const response = await exportHardwareAssets()
    const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' })
    const filename = getFilenameFromDisposition(response.headers?.['content-disposition'])
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
    ElMessage.success(t('ec.hardware.export.success'))
  } catch (error) {
    ElMessage.error(error.message || t('ec.hardware.export.failed'))
  }
}

const handleFormClosed = () => {
  formRef.value?.clearValidate()
  formDialog.assetId = null
  formDialog.loading = false
  resetFormData()
}

const handleRelationClosed = () => {
  resetRelationDialog()
}

const handleLifecycleClosed = () => {
  lifecycleFormRef.value?.clearValidate()
  resetLifecycleDialog()
}

onMounted(async () => {
  try {
    await loadSupportOptions()
  } catch (error) {
    ElMessage.error(error.message || t('ec.hardware.support.failed'))
  }
  loadData()
})
</script>

<style lang="scss" scoped>
.hardware-page {
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

.hardware-section {
  display: flex;
  flex-direction: column;
  gap: 16px;

  & + & {
    margin-top: 24px;
  }
}

.hardware-section__title {
  font-size: 15px;
  font-weight: 600;
  color: var(--el-text-color-primary);
}

.hardware-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0 16px;

  :deep(.el-form-item) {
    margin-bottom: 18px;
  }

  :deep(.el-input-number),
  :deep(.el-select) {
    width: 100%;
  }

  .is-full {
    grid-column: 1 / -1;
  }
}

.hardware-empty {
  grid-column: 1 / -1;
}

.hardware-detail {
  display: flex;
  flex-direction: column;
  gap: 24px;
  min-height: 240px;
}

.hardware-detail__grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.hardware-detail__item {
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
    font-weight: 600;
  }

  &.is-full {
    grid-column: 1 / -1;
  }
}

.hardware-tag-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  padding: 16px;
  min-height: 72px;
  border: 1px solid var(--el-border-color-light);
  background-color: var(--el-fill-color-light);
}

.hardware-timeline__title {
  color: var(--el-text-color-primary);
  font-weight: 600;
}

.hardware-timeline__meta {
  margin-top: 6px;
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.hardware-import__helper {
  color: var(--el-text-color-secondary);
  line-height: 1.6;
}

.hardware-import__example {
  margin-top: 12px;
  color: var(--el-text-color-primary);
  font-weight: 600;
}

.hardware-import__code {
  margin: 8px 0 0;
  padding: 16px;
  overflow: auto;
  border-radius: 8px;
  background-color: var(--el-fill-color-dark);
  color: var(--el-color-white);
  font-size: 12px;
  line-height: 1.6;
}

@media only screen and (max-width: 991px) {
  .hardware-page {
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

  .hardware-form-grid,
  .hardware-detail__grid {
    grid-template-columns: 1fr;
  }
}
</style>
