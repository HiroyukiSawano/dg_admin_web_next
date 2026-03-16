<template>
  <div class="el-list">
    <div v-for="item in data" :key="item.articleId" class="el-list-item">
      <div v-if="item.coverImage" class="el-list-item__image">
        <el-image :src="item.coverImage"></el-image>
      </div>
      <div class="el-list-item__content">
        <div class="el-list-item__title">
          {{ item.title }}
        </div>
        <div v-if="item.tagInfo.length > 0" class="el-list-item__tag">
          <el-tag v-for="tag in item.tagInfo" :key="tag.tagId">{{ tag.tagName }}</el-tag>
        </div>
        <div class="el-list-item__discription">{{ item.briefContent }}</div>
        <div class="el-list-item__meta">
          <el-avatar shape="square" :size="28" :src="item.userInfo.userAvatar">{{ item.userInfo.userName.substring(0, 1) }}</el-avatar>
          <el-text>{{ item.userInfo.userName }}</el-text>

          <el-divider direction="vertical"></el-divider>
          <el-text type="info">{{ item.createTime }}</el-text>
        </div>
        <div class="el-list-item__extra">
          <el-space :size="24">
            <el-link type="info" icon="ri-group-line">{{ item.countInfo.viewCount }}</el-link>
            <el-link type="info" icon="ri-share-line">{{ item.countInfo.commentCount }}</el-link>
            <el-link type="info" icon="ri-time-line">{{ item.countInfo.diggCount }}</el-link>
            <el-link type="info" icon="ri-star-line">{{ item.countInfo.collectCount }}</el-link>
          </el-space>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'

defineOptions({ name: 'EcListArticle' })
defineProps({
  data: {
    type: Array,
    default: () => [],
  },
})


</script>


<style lang="scss" scoped>
.el-list {
  margin-top: -16px;
  .el-list-item {
    display: flex;
    flex-direction: row-reverse;
    padding: 16px 0;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid var(--el-border-color-lighter);
  }

  .el-list-item__content {
    flex: 1;
  }

  .el-list-item__title {
    margin-bottom: 12px;
    font-size: 16px;
    font-weight: 500;

    &:hover {
      color: var(--el-color-primary);
    }
  }

  .el-list-item__tag {
    margin-bottom: 12px;

    :deep(.el-tag) {
      margin-right: 8px;
    }
  }

  .el-list-item__discription {
    margin-bottom: 16px;
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
    width: 224px;
    margin-left: 16px;
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
    > .el-avatar {
      margin-right: 8px;
      background: var(--el-color-primary);
    }
  }

  .el-list-item__extra {
    margin-top: 12px;
    :deep(.el-link) {
      align-items: center;
      font-weight: normal;
      .el-link__inner {
        margin-left: 4px;
      }
    }
  }
}

@media only screen and (max-width: 767px) {
  .el-list {
    .el-list-item {
      flex-direction: column;
      .el-list-item__image {
        margin-left: 0;
        margin-bottom: 16px;
        width: 100%;
        // height: 224px;
      }
    }
  }
}
</style>
