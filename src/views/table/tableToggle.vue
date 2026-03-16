<template>
  <div class="el-page">
    <el-card>
      <el-form :model="tableForm" inline>
        <el-form-item>
          <el-input v-model="tableForm.keyword" :placeholder="$t('ec.global.form.search.placeholder')" prefix-icon="el-icon-search" style="width: 176px;" />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="tableForm.range" type="daterange" range-separator="-" :start-placeholder="$t('ec.global.form.daterange.start.placeholder')" :end-placeholder="$t('ec.global.form.daterange.end.placeholder')" style="width: 352px;" />
        </el-form-item>
        <el-form-item class="margin-right-auto">
          <el-button type="primary" @click="fetchTableData">{{ $t('ec.global.button.text.search') }}</el-button>
          <el-button>{{ $t('ec.global.button.text.reset') }}</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="primary">{{ $t('ec.global.button.text.primary') }}{{ $t('ec.global.button.text.action') }}</el-button>
          <el-button>{{ $t('ec.global.button.text.action') }}</el-button>
          <el-dropdown>
            <el-button>{{ $t('ec.global.button.text.other') }}</el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="tableLayout">
            <el-radio value="table"><el-icon :size="16" class="ri-menu-2-fill" /></el-radio>
            <el-divider direction="vertical" />
            <el-radio value="block"><el-icon :size="16" class="ri-function-fill" /></el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template v-if="tableLayout === 'table'">
        <el-table :data="tableData" row-key="id" v-loading="tableLoading">
          <el-table-column type="selection" width="56" align="center" />
          <el-table-column :label="$translate('ec.mock.im4o3co2', locales)" width="160" show-overflow-tooltip>
            <template #default="{ row }">
              <el-text type="primary" truncated>{{ row.name }}</el-text>
            </template>
          </el-table-column>
          <el-table-column :label="$translate('ec.mock.nx5mgkhs', locales)" prop="remark" min-width="480" show-overflow-tooltip />
          <el-table-column :label="$translate('ec.mock.uh5iiqal', locales)" prop="author" width="160" />
          <el-table-column :label="$translate('ec.mock.msblp9jw', locales)" width="160">
            <template #default="{ row }">
              <el-rate
                v-model="row.star"
                :icons="['ri-star-s-fill', 'ri-star-s-fill', 'ri-star-s-fill']"
                disabled-void-icon="ri-star-s-fill"
                void-icon="ri-star-s-fill"
                disabled
              />
            </template>
          </el-table-column>
          <el-table-column :label="$translate('ec.mock.2w3tgxvm', locales)" prop="status" width="160">
            <template #default="{ row}">
              <el-tag :type="tableStatus.find(t => t.value === row.status)?.type">
                <i class="ri-circle-fill"></i>
                <span>{{ tableStatus.find(t => t.value === row.status)?.label }}</span>
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column :label="$translate('ec.mock.t5z17gmq', locales)" prop="date" width="240" />
          <el-table-column fixed="right" :label="$t('ec.global.button.text.action')" width="144">
            <template #default="scope">
              <el-button type="primary" link>{{ $t('ec.global.button.text.action') }}</el-button>
              <el-dropdown>
                <el-button type="primary" link>{{ $t('ec.global.button.text.other') }}</el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                    <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                    <el-dropdown-item disabled>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                    <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <template v-if="tableLayout === 'block'">
        <el-row :gutter="16" class="el-block-group" v-loading="tableLoading">
          <el-col :lg="8" class="el-block-column" v-for="item, index in tableData" :key="index">
            <div class="el-block">
              <div class="el-block__header">
                <div class="el-block__avatar">
                  <el-avatar shape="square" :size="48">{{ item.name.at(0) }}</el-avatar>
                </div>
                <div class="el-block__title">
                  <el-text truncated>{{ item.name }}</el-text>
                  <el-tag :type="tableStatus.find(t => t.value === item.status)?.type">
                    <i class="ri-circle-fill"></i>
                    <span>{{ tableStatus.find(t => t.value === item.status)?.label }}</span>
                  </el-tag>
                </div>
                <div class="el-block__rate">
                  <el-rate
                    v-model="item.star"
                    :icons="['ri-star-s-fill', 'ri-star-s-fill', 'ri-star-s-fill']"
                    disabled-void-icon="ri-star-s-fill"
                    void-icon="ri-star-s-fill"
                    disabled
                  />
                </div>
              </div>
              <div class="el-block__body">
                <div class="el-block__meta">
                  <dl><dt>{{ $translate('ec.mock.uh5iiqal', locales)}}：</dt><dd>{{ item.author }}</dd></dl>
                  <dl><dt>{{ $translate('ec.mock.t5z17gmq', locales)}}：</dt><dd>{{ item.date }}</dd></dl>
                </div>
              </div>
              <div class="el-block__footer">
                <div class="el-block__action">
                  <el-link underline="never">{{ $t('ec.global.button.text.action') }}</el-link>
                  <el-divider direction="vertical" />
                  <el-link underline="never">{{ $t('ec.global.button.text.action') }}</el-link>
                  <el-divider direction="vertical" />
                  <el-dropdown>
                    <el-link underline="never">{{ $t('ec.global.button.text.other') }}</el-link>
                    <template #dropdown>
                      <el-dropdown-menu>
                        <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                        <el-dropdown-item>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                        <el-dropdown-item divided>{{ $t('ec.global.button.text.action') }}</el-dropdown-item>
                      </el-dropdown-menu>
                    </template>
                  </el-dropdown>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </template>
      <el-pagination
        v-model:currentPage="tablePagination.currentPage"
        background
        :layout="tablePagination.layout"
        :total="tablePagination.total"
        :page-size="tablePagination.pageSize"
        :page-sizes="tablePagination.pageSizes"
        @current-change="paginationCurrentChange"
        @update:page-size="paginationPageSizeChange"
      />
    </el-card>
  </div>
</template>
<script setup>
import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/modules/systemStore'
import { apiBookList } from '@/services/modules/mockService'

defineOptions({ name: 'tableToggle' })
const locales = {
  'en': {
    'ec.mock.im4o3co2': 'Book',
    'ec.mock.nx5mgkhs': 'Book Summary',
    'ec.mock.uh5iiqal': 'Book Author',
    'ec.mock.msblp9jw': 'Book Level',
    'ec.mock.2w3tgxvm': 'Book Status',
    'ec.mock.t5z17gmq': 'Book Publish Date',
  },
  'zh-CN': {
    'ec.mock.im4o3co2': '图书',
    'ec.mock.nx5mgkhs': '图书摘要',
    'ec.mock.uh5iiqal': '图书作者',
    'ec.mock.msblp9jw': '图书等级',
    'ec.mock.2w3tgxvm': '图书状态',
    'ec.mock.t5z17gmq': '图书出版日期',
  },
}
const tableLoading = ref(false)
const tablePagination = ref({
  layout: 'total, prev, pager, next, sizes',
  currentPage: 1,
  pageSize: 10,
  pageSizes: [10, 20, 30, 40, 50],
  total: 1000,
})
const tableForm = ref({
  keyword: '',
  range: '',
  from: '',
})
const tableLayout = ref('block')
const tableData = ref([])
const tableStatus = ref([])
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
  const { data: { source = [], status = [] }} = await apiBookList({ locale: language.value }) || {}
  tableData.value = source
  tableStatus.value = status
  await new Promise(resolve => setTimeout(resolve, 1000))
  tableLoading.value = false
}
watch(language, async () => {
  fetchTableData()
}, { immediate: true })
</script>

<style lang="scss" scoped>
.el-card {
}
dl,dd,dt {
  margin: 0;
  padding: 0;
}
:deep(.el-form.el-form--inline) {
  padding-bottom: 16px;
  .el-radio-group {
    .el-divider {
      height: 12px;
    }
    .el-radio {
      --el-radio-text-color: var(--el-text-color-secondary);
      margin: 0;
      padding: 0;
      .el-radio__input {
        display: none;
      }
      .el-radio__label {
        display: flex;
        padding: 0;
      }
    }
  }
}
:deep(.el-table) {
  .el-rate {
    margin: 0 -2px;
  }
  .el-tag {
    --el-tag-bg-color: transparent;
    --el-tag-border-color: transparent;
    --el-tag-font-size: var(--el-font-size-base);
    padding: 0;
    margin-top: 4px;
    .el-tag__content {
      > span {
        color: var(--el-text-color-regular);
      }
      > i {
        transform: scale(0.5) translateX(-4px);
      }
    }
  }
}
:deep(.el-block-group) {
  .el-block {
    position: relative;
    margin-bottom: 16px;
    overflow: hidden;
    background: linear-gradient(135deg, var(--el-color-primary-light-9) 0%, var(--el-fill-color-blank) 50%);
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
    }
    .el-block__title {
      min-width: 0;
      flex: 1;
      .el-text {
        display: block;
        --el-text-font-size: var(--el-font-size-medium);
      }
      .el-tag {
        --el-tag-bg-color: transparent;
        --el-tag-border-color: transparent;
        --el-tag-font-size: var(--el-font-size-base);
        padding: 0;
        margin-top: 4px;
        .el-tag__content {
          > span {
            color: var(--el-text-color-regular);
          }
          > i {
            transform: scale(0.5) translateX(-4px);
          }
        }
      }
    }
    .el-block__rate {
      display: flex;
      margin-left: auto;
      margin-right: -4px;
    }
    .el-block__avatar {
      margin-right: 16px;
      .el-avatar {
        --el-avatar-text-size: var(--el-font-size-extra-large);
        --el-avatar-border-radius: calc(var(--el-border-radius-base)*1.5);
        background: linear-gradient(135deg, var(--el-color-primary-light-2) 0%, var(--el-color-primary) 100%);
        box-shadow: 2px 4px 8px color-mix(in srgb, var(--el-color-primary) 15%, transparent);
      }
    }
    .el-block__meta {
      line-height: 1;
      dl+dl {
        margin-top: 12px;
      }
      dl {
        display: flex;
        // align-items: center;
        dt {
          white-space: nowrap;
          color: var(--el-text-color-secondary);
        }
      }
    }
    .el-block__footer {
      position: absolute;
      inset: 0;
      // height: 64px;
      // padding: 0 24px;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      transform: translateY(100%);
      transition: var(--el-transition-all);
      background: linear-gradient(0deg, var(--el-fill-color-blank) 30%, transparent 100%);
      .el-dropdown,
      .el-link {
        flex: 1;
      }
    }
    .el-block__action {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 64px;
      padding: 0 24px;
    }
    &:hover {
      background: linear-gradient(225deg, var(--el-color-primary-light-9) 0%, var(--el-fill-color-blank) 100%);
      border: 1px solid var(--el-color-primary);
      .el-block__footer {
        transform: translateY(0%);
      }
    }
  }
}
</style>
