<template>
  <div class="el-list">
    <el-row v-for="item in data" :key="item.articleId" class="el-list-item">
      <el-col :md="16" :lg="10" class="el-list-item__content">
        <div class="el-list-item__media">
          <div class="el-list-item__avatar">
            <el-avatar :size="32" :src="item.cover" shape="square" class="background-primary">{{ item.name.substring(0, 2) }}</el-avatar>
          </div>
          <div class="el-list-item__subject">
            <div class="el-list-item__title">{{ item.name }}</div>
            <div class="el-list-item__discription">{{ item.info }}</div>
          </div>
        </div>
      </el-col>
      <el-col :md="5" :lg="5" class="el-list-item__progress hidden-md-only">
        <el-progress :percentage="item.progress" />
      </el-col>
      <el-col :md="4" :lg="4" class="el-list-item__time hidden-md-only">
        <p>开始时间</p>
        {{ item.start }}
      </el-col>
      <el-col :md="4" :lg="2" class="el-list-item__status">
        <p>状态</p>
        <el-tag v-if="item.status ==='0'">进行中</el-tag>
        <el-tag v-if="item.status ==='1'" type="success">已完成</el-tag>
        <el-tag v-if="item.status ==='2'" type="danger">已删除</el-tag>
      </el-col>
      <el-col :md="4" :lg="3" class="el-list-item__action">
        <p>操作</p>
        <el-button type="primary" link>操作</el-button>
        <el-dropdown>
          <el-button type="primary" link>其他操作</el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>操作</el-dropdown-item>
              <el-dropdown-item>操作</el-dropdown-item>
              <el-dropdown-item disabled>操作</el-dropdown-item>
              <el-dropdown-item>操作</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-col>
    </el-row>
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
  // margin-top: -16px;
  .el-list-item {
    // display: flex;
    align-items: center;
    padding: 16px 0;
    // align-items: center;
    border-bottom: 1px solid var(--el-border-color-lighter);
    p {
      margin-bottom: 12px;
    }
    .el-col {
      padding: 8px 0;
    }
    .el-list-item__avatar {
      margin-right: 16px;
      .el-avatar {
        display: flex;
      }
    }
    .el-list-item__content {
      padding-right: 32px;
      .el-media {

      }
    }
    .el-list-item__media {
      display: flex;
      align-items: center;
    }
    .el-list-item__title {
      margin-bottom: 8px;
      font-weight: var(--el-font-weight-primary);
    }
    .el-list-item__discription {
      color: var(--el-text-color-secondary);
    }
    .el-list-item__action {
      .el-button {
        padding: 0;
      }
    }
    .el-list-item__time,
    .el-list-item__action,
    .el-list-item__status {
      text-align: center;
    }
  }
}

@media only screen and (max-width: 991px) {
  .el-list {
    .el-list-item {
      .el-list-item__time,
      .el-list-item__action,
      .el-list-item__status {
        text-align: left;
      }
    }
  }
}
</style>
