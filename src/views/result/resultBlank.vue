<template>
  <el-card>
    <el-empty :image-size="160" :description="description" />
  </el-card>
</template>
<script setup>
import { ref } from 'vue'
defineOptions({
  name: 'resultBlank',
})
const description = ref('BLANK PAGE :)')
</script>

<style lang="scss" scoped>
.el-card {
  margin-bottom: 0;
  height: calc(100% - 32px);
  :deep(.el-card__body) {
    height: 100%;
  }
}
.el-empty {
  height: 100%;
}
</style>
