<template>
  <el-page-header icon="ri-arrow-left-line" content="Fullpage Demo" @back="router.go(-1)">
    <template #extra>
      <el-button>Print</el-button>
      <el-button type="primary" @click="router.go(-1)">Submit</el-button>
    </template>
  </el-page-header>
  <el-empty description="Fullpage Demo" />
</template>
<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
defineOptions({
  name: 'otherFullpage',
})
const router = useRouter()
</script>

<style lang="scss" scoped>
.el-page-header {
  padding: 12px 16px;
  background-color: var(--el-fill-color-blank);
}
.el-empty {
  height: calc(100vh - 64px);
}
</style>
