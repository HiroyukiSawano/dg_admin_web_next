<template>
  <el-row :gutter="16">
    <el-col v-for="value, key, index in icons" :key="key" :xs="12" :sm="8" :md="6" :lg="4">
      <el-card>
        <el-icon :size="32" color="var(--el-color-primary)">
          <component :is="value" />
        </el-icon>
        <el-text truncated>{{ kebabCase(key) }}</el-text>
      </el-card>
    </el-col>
  </el-row>
</template>

<script setup>
import { kebabCase } from 'lodash-es'
const modules = import.meta.glob('./components/*.vue', { eager: true })
const icons = Object.entries(modules).reduce((acc, [path, module]) => {
  const name = path.split('/').pop().replace(/\.vue$/, '').replace(/(^\w|-\w)/g, c => c.replace('-', '').toUpperCase())
  acc[name] = module.default
  return acc
}, {})
</script>
<style lang="scss" scoped>
:deep(.el-card) {
  cursor: pointer;
  .el-card__body {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 32px 24px;
    .el-icon {
      margin-bottom: 16px;
    }
  }
  &:hover {
    border-color: var(--el-color-primary);
    background-color: var(--el-color-primary);
    color: var(--el-color-white);
    .el-icon,
    .el-text {
      color: inherit
    }
    .el-text {
      opacity: .65;
    }
  }
}
</style>
