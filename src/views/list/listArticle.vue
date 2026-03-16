<template>
  <div class="el-page">
    <el-card :header="$t(route.meta.title)">
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
      <el-pagination background :layout="device === 'mobile' ? 'prev, next' : 'prev, pager, next'" :total="1000" />
    </el-card>
  </div>
</template>
<script setup>
import { ref, watch, getCurrentInstance, h } from 'vue'
import { ElDivider } from 'element-plus'
import { storeToRefs } from 'pinia'
import { useRoute } from 'vue-router'
import { random } from 'lodash-es'
import { useSystemStore } from '@/stores/modules/systemStore'
import { apiBookList, apiBookHot } from '@/services/modules/mockService'
defineOptions({ name: 'ListArticle' })
const { proxy } = getCurrentInstance()
const { device } = storeToRefs(useSystemStore())
const route = useRoute()
const articleLoading = ref(false)
const articleData = ref([])
const articleColumns = ref([])
const articleStatus = ref([])
const articleHot = ref([])
const { language } = storeToRefs(useSystemStore())
const shuffle = (arr) => {
  const array = [...arr]
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[array[i], array[j]] = [array[j], array[i]]
  }
  return array
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
</script>

<style lang="scss" scoped>
dl,dd,dt,p {
  margin: 0;
  padding: 0;
}
.el-pagination {
  justify-content: center;
  margin-top: 16px;
}

.el-list {
  margin-top: -16px;
  .el-list-item {
    display: flex;
    // flex-direction: row-reverse;
    padding: 16px 0;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--el-border-color-lighter);
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
    margin-bottom: 6px;
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
    margin-bottom: 8px;

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

  .el-list-item__image {
    flex-shrink: 0;
    width: 120px;
    margin-right: 16px;
    border-radius: var(--el-border-radius-base);
    overflow: hidden;
    .el-image {
      display: block;
      width: 100%;
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
