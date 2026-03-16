<template>
  <div class="el-page" v-loading="tableLoading">
    <el-row :gutter="16" class="el-block-group">
      <el-col :lg="8" class="el-block-column" v-for="item, index in tableData" :key="index">
        <div class="el-block">
          <div class="el-block__header">
            <div class="el-block__image">
              <el-image :src="item.cover" fit="fill" :preview-src-list="tableData.map((c) => c.cover)" />
            </div>
            <div class="el-block__title">
              <el-text truncated>{{ item.name }}</el-text>
              <el-space :size="24">
                <dl><dt>{{ tableColumns[2].label }}：</dt><dd>{{ item.author }}</dd></dl>
                <dl>
                  <dt>{{ tableColumns[3].label }}：</dt>
                  <dd><el-rate v-model="item.star" :icons="['ri-star-s-fill', 'ri-star-s-fill', 'ri-star-s-fill']" disabled-void-icon="ri-star-s-fill" void-icon="ri-star-s-fill" disabled /></dd>
                </dl>
                <dl><dt>{{ tableColumns[5].label }}：</dt><dd>{{ item.date }}</dd></dl>
              </el-space>
            </div>
          </div>
          <div class="el-block__body">
            <p>{{ item.remark }}</p>
          </div>
          <div class="el-block__footer">
            <el-link underline="never">{{ $t('ec.global.button.text.action') }}</el-link>
            <el-divider direction="vertical" />
            <el-link underline="never">{{ $t('ec.global.button.text.action') }}</el-link>
            <el-divider direction="vertical" />
            <el-dropdown :show-arrow="false">
              <el-link underline="never">{{ $t('ec.global.button.text.other') }}</el-link>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                  <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                  <el-dropdown-item disabled>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                  <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-col>
    </el-row>
    <el-pagination v-model:currentPage="tablePagination.currentPage" background :layout="tablePagination.layout" :total="tablePagination.total" :page-size="tablePagination.pageSize" :page-sizes="tablePagination.pageSizes" @current-change="paginationCurrentChange" @update:page-size="paginationPageSizeChange" />
  </div>
</template>
<script setup>
import { h, ref, watch, getCurrentInstance } from 'vue'
import { ElDivider } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/modules/systemStore'
import { apiBookList } from '@/services/modules/mockService'
defineOptions({ name: 'ListBasic' })

const tableLoading = ref(false)
const tablePagination = ref({
  layout: 'total, prev, pager, next, sizes',
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 30, 40, 50],
  total: 1000,
})
const tableData = ref([])
const tableColumns = ref([])
const paginationCurrentChange = (page) => {
  tablePagination.value.currentPage = page
  fetchTableData()
}
const paginationPageSizeChange = (size) => {
  tablePagination.value.pageSize = size
  fetchTableData()
}
const { language } = storeToRefs(useSystemStore())
const fetchTableData = async () => {
  tableLoading.value = true
  const { data: { source = [], columns = [] }} = await apiBookList({ locale: language.value }) || {}
  tableData.value = source
  tableColumns.value = columns
  await new Promise(resolve => setTimeout(resolve, 1000))
  tableLoading.value = false
}
watch(language, async () => {
  fetchTableData()
}, { immediate: true })
</script>

<style lang="scss" scoped>
:deep(.el-block-group) {
  .el-block {
    position: relative;
    margin-bottom: 16px;
    overflow: hidden;
    background-color: var(--el-fill-color-blank);
    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
    border-radius: calc(var(--el-border-radius-base)*2);
    border: 1px solid var(--el-fill-color-blank);
    transition: var(--el-transition-all);
    cursor: pointer;
    .el-block__header {
      display: flex;
      align-items: center;
      padding: 24px;
    }
    .el-block__header+.el-block__body {
      padding-top: 0;
    }
    .el-block__body {
      padding: 24px;
      color: var(--el-text-color-secondary);
      p {
        margin: 0;
        padding: 0;
        height: calc(var(--el-font-size-base) * 3);
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .el-block__title {
      flex: 1;
      min-width: 0;
      .el-text {
        display: block;
        margin-bottom: 8px;
        --el-text-font-size: var(--el-font-size-medium);
      }
      .el-space {
        flex-wrap: wrap;
        font-size: var(--el-font-size-extra-small);
        .el-space__item {
          dl,dd,dt {
            margin: 0;
            padding: 0;
          }
          dl {
            display: flex;
            align-items: center;
            dt {
              white-space: nowrap;
              color: var(--el-text-color-secondary);
            }
            dd {
              white-space: nowrap;
            }
          }
        }
      }
      .el-rate {
        display: flex;
        height: initial;
        margin-top: -1px;
        --el-rate-icon-margin: 0;
      }
      .el-divider {
        display: flex;
      }
    }
    .el-block__image {
      margin-right: 16px;
      .el-image {
        display: block;
        border-radius: var(--el-border-radius-base);
        width: calc(var(--el-font-size-base) * 4);
        height: calc(var(--el-font-size-base) * 6);
      }
      .el-avatar {
        --el-avatar-text-size: var(--el-font-size-extra-large);
        --el-avatar-icon-size: 24px;
        --el-avatar-border-radius: calc(var(--el-border-radius-base)*1.5);
        --el-avatar-bg-color: var(--el-color-primary-light-9);
        --el-avatar-text-color: var(--el-color-primary);
        transition: var(--el-transition-all);
      }
    }

    .el-block__footer {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 56px;
      padding: 0 24px;
      &::before {
        content: "";
        position: absolute;
        left: 24px;
        right: 24px;
        top: 0px;
        border-top: 1px solid var(--el-border-color-extra-light);
      }
      .el-dropdown,
      .el-link {
        flex: 1;
      }
    }
    &:hover {
      background: linear-gradient(-135deg, var(--el-color-primary-light-9) 0%, var(--el-fill-color-blank) 100%);
      border: 1px solid var(--el-color-primary);
      .el-block__title {
        .el-label {
          color: var(--el-color-primary);
        }
      }
    }
  }
}
</style>
