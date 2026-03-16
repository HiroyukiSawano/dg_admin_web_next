<template>
  <el-card>
    <el-result title="Success Tip" sub-title="Please follow the instructions">
      <template #icon>
        <el-icon class="ri-checkbox-circle-fill" size="80" color="var(--el-color-success)"></el-icon>
      </template>
      <template #extra>
        <el-button type="primary">Back</el-button>
      </template>
    </el-result>
  </el-card>
</template>
<script setup>
import { ref } from 'vue'
defineOptions({
  name: 'resultSuccess',
})
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 0;
  height: calc(100% - 32px);
  :deep(.el-card__body) {
    height: 100%;
  }
}
.el-result {
  height: 100%;
}
</style>
