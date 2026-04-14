<template>
  <figma-resource-page
    hide-tabs
    :title="t('ec.middleware.page.detailTitle')"
    :description="t('ec.middleware.page.description')"
    back-path="/middleware/middlewareResources"
    :breadcrumbs="[
      t('ec.menu.name.middleware'),
      t('ec.middleware.page.detailTitle'),
    ]"
  >
    <template #actions>
      <el-button class="middleware-detail-edit" type="primary" @click="router.push(`/middleware/middlewareResources/${route.params.id}/edit`)">
        {{ t('ec.middleware.common.edit') }}
      </el-button>
    </template>

    <div v-loading="pageLoading" class="organization-detail-page">
      <section class="organization-detail-panel">
        <section class="organization-detail-section">
          <div class="organization-section-title">{{ t('ec.middleware.section.basic') }}</div>
          <div class="organization-detail-grid">
            <div class="organization-detail-item">
              <span>{{ t('ec.middleware.common.code') }}</span>
              <strong>{{ detailRecord.middlewareCode || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.middleware.common.name') }}</span>
              <strong>{{ detailRecord.middlewareName || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.middleware.common.type') }}</span>
              <strong>{{ typeLabelMap[detailRecord.middlewareType] || detailRecord.middlewareType || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.middleware.common.version') }}</span>
              <strong>{{ detailRecord.version || '-' }}</strong>
            </div>
            <div class="organization-detail-item">
              <span>{{ t('ec.middleware.common.status') }}</span>
              <strong>{{ statusLabelMap[detailRecord.status] || detailRecord.status || '-' }}</strong>
            </div>
            <div class="organization-detail-item is-span-full">
              <span>{{ t('ec.middleware.common.remark') }}</span>
              <strong>{{ detailRecord.remark || '-' }}</strong>
            </div>
          </div>
        </section>
      </section>
    </div>
  </figma-resource-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import FigmaResourcePage from '@/views/organization/components/FigmaResourcePage.vue'
import { getMiddlewareResourceDetail } from '@/services/modules/middlewareService'
import { buildOptionLabelMap, middlewareTypeOptions, statusOptions } from './helpers'

defineOptions({ name: 'MiddlewareDetailPage' })

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const pageLoading = ref(false)
const detailRecord = ref({})

const typeLabelMap = computed(() => buildOptionLabelMap(middlewareTypeOptions(t)))
const statusLabelMap = computed(() => buildOptionLabelMap(statusOptions(t)))

const loadDetail = async () => {
  pageLoading.value = true
  try {
    detailRecord.value = await getMiddlewareResourceDetail(route.params.id)
  } catch (error) {
    ElMessage.error(error.message || t('ec.middleware.message.detailFailed'))
  } finally {
    pageLoading.value = false
  }
}

onMounted(loadDetail)
</script>

<style lang="scss" scoped>
.middleware-detail-edit {
  min-width: 68px;
  height: 32px;
  padding: 0 16px;
  border: 0;
  border-radius: 4px;
  background: #2e5ef0;
  box-shadow: none;
  font-size: 14px;
}

.organization-detail-page {
  width: 100%;
}

.organization-detail-panel {
  padding: 16px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid #edf0f6;
  border-radius: 16px;
  box-shadow: 0 12px 40px rgba(28, 53, 91, 0.05);
}

.organization-detail-section + .organization-detail-section {
  margin-top: 28px;
}

.organization-section-title {
  color: #151b26;
  font-size: 16px;
  font-weight: 600;
  line-height: 24px;
}

.organization-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 8px 24px;
  margin-top: 8px;
}

.organization-detail-item {
  display: flex;
  align-items: center;
  min-height: 32px;
  color: #444a57;
  font-size: 14px;
  line-height: 22px;

  > span {
    flex: 0 0 120px;
    color: #858a99;
  }

  > strong {
    flex: 1;
    min-width: 0;
    font-weight: 400;
    word-break: break-all;
  }
}

.is-span-full {
  grid-column: 1 / -1;
}

@media only screen and (max-width: 991px) {
  .organization-detail-panel {
    padding: 16px 12px;
  }

  .organization-detail-grid {
    grid-template-columns: 1fr;
  }

  .organization-detail-item {
    align-items: flex-start;

    > span {
      flex-basis: 104px;
    }
  }

  .is-span-full {
    grid-column: auto;
  }
}
</style>
