<template>
  <el-card :header="$t(route.meta.title)">
    <el-empty description="Building..." />
  </el-card>
</template>
<script setup>
import { ref, watch, onMounted, nextTick, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
defineOptions({ name: 'log' })
const route = useRoute()
</script>

<style lang="scss" scoped></style>
