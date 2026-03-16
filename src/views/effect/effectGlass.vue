<template>
  <div class="el-page">
    <el-card :class="`el-card--${effect}`">
      <template #header>
        <div class="el-card__title">{{ $t(route.meta.title) }}</div>
        <div class="el-card__action">
          <el-switch v-model="effect" active-value="glass" inactive-value="none" />
        </div>
      </template>
      <el-scrollbar @end-reached="handleEndReached">
        <div class="el-list">
          <div v-for="item, index in articleData" :key="index" class="el-list-item">
            <div v-if="item.cover" class="el-list-item__image">
              <el-image
                :src="item.cover"
                :zoom-rate="1.2"
                :max-scale="6"
                :min-scale="0.2"
                :preview-src-list="articleData.map((c) => c.cover)"
                :initial-index="index"
                fit="cover"
              />
            </div>
            <div class="el-list-item__content">
              <div class="el-list-item__title">
                <el-text>{{ item.name }}</el-text>
              </div>
              <div class="el-list-item__star">
                <el-rate v-model="item.star" :icons="['ri-star-s-fill', 'ri-star-s-fill', 'ri-star-s-fill']" disabled-void-icon="ri-star-s-fill" void-icon="ri-star-s-fill" />
              </div>

              <div class="el-list-item__discription">{{ item.remark }}</div>
              <div class="el-list-item__meta">
                <el-space :size="8" :spacer="h(ElDivider, { direction: 'vertical' })">
                  <dl><dt>{{ articleColumns[2].label }}：</dt><dd>{{ item.author }}</dd></dl>
                  <dl>
                    <dt>{{ articleColumns[3].label }}：</dt>
                    <dd>{{ item.publisher }}</dd>
                  </dl>
                  <dl><dt>{{ articleColumns[5].label }}：</dt><dd>{{ item.date }}</dd></dl>
                </el-space>
              </div>
              <div class="el-list-item__tag">
                <el-tag v-for="hitem, hindex in articleHot.slice(0, random(1, 5))" :key="hindex">
                  {{ hitem.name }}
                </el-tag>
              </div>
            </div>
          </div>
        </div>
      </el-scrollbar>
    </el-card>
    <el-segmented
      v-model="active"
      :options="[
        { label: $t('ec.global.button.text.action'), value: '1' },
        { label: $t('ec.global.button.text.action'), value: '2' },
        { label: $t('ec.global.button.text.action'), value: '3' },
        { label: $t('ec.global.button.text.action'), value: '4' },
        { label: $t('ec.global.button.text.action'), value: '5' },
      ]"
      :class="`el-segmented--${effect}`"
    />
  </div>
</template>
<script setup>
import { ref, watch, h } from 'vue'
import { ElDivider } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { random } from 'lodash-es'
import { useSystemStore } from '@/stores/modules/systemStore'
import { useStyleStore } from '@/stores/modules/styleStore'
import { apiBookList, apiBookHot } from '@/services/modules/mockService'
defineOptions({ name: 'effectGlass' })

const route = useRoute()
const articleLoading = ref(false)
const articleData = ref([])
const articleColumns = ref([])
const articleStatus = ref([])
const articleHot = ref([])
const { language } = storeToRefs(useSystemStore())
const { effect } = storeToRefs(useStyleStore())
const active = ref('1')

const shuffle = (arr) => {
  const array = [...arr]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
}
const randomColor = () => {
  const r = random(100, 255);
  const g = random(100, 255);
  const b = random(100, 255);
  return `rgb(${r}, ${g}, ${b})`;
}
const fetchArticleData = async () => {
  articleLoading.value = true
  const { data: { data = [] }} = await apiBookHot({ locale: language.value }) || {}
  const { data: { source = [], columns = [], status = [] }} = await apiBookList({ locale: language.value }) || {}
  articleData.value = source
  articleColumns.value = columns
  articleStatus.value = status
  articleHot.value = data
  await new Promise(resolve => setTimeout(resolve, 1000))
  articleLoading.value = false
}

watch(language, async () => {
  fetchArticleData()
}, { immediate: true })

const handleEndReached = (direction) => {
  // if (direction === 'bottom') {
  //   fetchArticleData()
  // }
}
</script>

<style lang="scss" scoped>

.el-page {
  height: calc(100% - var(--el-layout-breadcrumb-height));
}

:deep(.el-card) {
  margin-bottom: 0;
  height: 100%;
  .el-card__header {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: 2;
    background-color: var(--el-fill-color-blank);
  }
  .el-card__body {
    overflow: hidden;
  }
  &.el-card--glass {
    .el-card__header {
      background-color: color-mix(in srgb, var(--el-fill-color-blank) 75%, transparent);
      backdrop-filter: saturate(180%) blur(16px);
    }
  }
}
:deep(.el-segmented) {
  --el-segmented-padding: 8px;
  --el-segmented-bg-color: color-mix(in srgb, var(--el-bg-color-page) 95%, transparent);
  --el-segmented-item-active-bg-color: color-mix(in srgb, var(--el-fill-color-blank) 50%, transparent);
  --el-segmented-item-hover-bg-color: color-mix(in srgb, var(--el-fill-color-blank) 50%, transparent);
  height: 48px;
  position: fixed;
  bottom: 32px;
  left: calc((100% + var(--el-layout-aside-width) + var(--el-layout-splite-width)) * 0.5);
  z-index: var(--el-index-top);
  transform: translateX(-50%);
  box-shadow: 0px 2px 16px rgba(0, 0, 0, 0.1);
  border: 1px solid color-mix(in srgb, var(--el-fill-color-blank) 50%, transparent);
  overflow: hidden;
  border-radius: calc(var(--el-border-radius-base) * 1.5);
  transition: var(--el-transition-all);
  .el-segmented__item {
    // padding: 0 20px;
  }
  &.el-segmented--glass {
    --el-segmented-bg-color: color-mix(in srgb, var(--el-bg-color-page) 75%, transparent);
    backdrop-filter: saturate(180%) blur(16px);
  }

}
.el-list {
  padding-top: 40px;
  .el-list-item+.el-list-item {
    border-top: 1px solid var(--el-border-color-lighter);
  }
  .el-list-item {
    display: flex;
    flex-direction: column;
    // flex-direction: row-reverse;
    padding: 32px 0;
    justify-content: space-between;
    align-items: center;

    text-align: center;
    cursor: pointer;
    &:hover {
      .el-list-item__title {
        .el-text {
          --el-text-color: var(--el-color-primary);
        }
      }
    }
  }

  .el-list-item__content {
    flex: 1;
  }

  .el-list-item__title {
    display: flex;
    align-items: center;
    .el-text {
      flex: 1;
      min-width: 0;
      font-size: var(--el-font-size-large);
      font-weight: var(--el-font-weight-primary);
    }
    .el-rate {
      --el-rate-icon-size: var(--el-font-size-large);
    }
  }

  .el-list-item__tag {
    :deep(.el-tag) {
      margin-right: 8px;
      margin-top: 8px;
    }
  }

  .el-list-item__discription {
    margin-bottom: 12px;
    max-height: 40px;
    font-size: 14px;
    line-height: 1.5;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    color: var(--el-text-color-secondary);
  }
  .el-list-item__star {
    margin-bottom: 8px;
  }
  .el-list-item__image {
    flex-shrink: 0;
    width: 160px;
    height: 240px;
    margin-bottom: 16px;
    border-radius: var(--el-border-radius-base);
    overflow: hidden;
    .el-image {
      display: block;
      width: 100%;
      height: 100%;
    }
  }

  .el-list-item__meta {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    > .el-avatar {
      margin-right: 8px;
      background: var(--el-color-primary);
    }
    :deep(.el-space) {
      flex-wrap: wrap;
      font-size: var(--el-font-size-extra-small);
      .el-space__item {
        margin: 4px 0;
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
  }
}

@media only screen and (max-width: 767px) {
  .el-list {
    .el-list-item {
      flex-direction: column;
      .el-list-item__image {
        margin-right: 0;
        margin-bottom: 16px;
        width: 100%;
        // height: 224px;
      }
    }
  }
}
</style>
