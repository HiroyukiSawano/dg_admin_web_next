<template>
  <div class="el-page">

  </div>
</template>
<script setup>

defineOptions({
  value: 'vabScrollText',
})

</script>

<style lang="scss" scoped>
.el-page {
  height: 100%;
}
:deep(.el-card) {
  height: 100%;
  .el-card__header {
    border: 0;
  }
  .el-card__header+.el-card__body {
    padding-top: 0;
  }
}
.el-card__wrapper {
  margin-bottom: 16px;
}
.el-anchor__container {
  position: relative;
  height: calc(100vh - 128px);
  height: 100%;
  overflow-y: auto;
  border-radius: var(--el-border-radius-base);
  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
}
:deep(.el-anchor) {
  --el-anchor-bg-color: transparent;
  --el-anchor-padding-indent: 0;
  --el-anchor-line-height: 1;
  --el-anchor-font-size: var(--el-font-size-base);
  --el-anchor-color: var(--el-text-color-placeholder);
  position: fixed;
  top: 50%;
  transform: translateY(-50%);
  right: 32px;
  .el-anchor__item {
    overflow: initial;
  }
  .el-anchor__link {
    margin: 6px 0;
    display: inline-flex !important;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: 32px;
    height: 32px;
    border-radius: 100%;
    background-color: var(--el-fill-color-blank);
    box-shadow: 0px 8px 16px 0 rgba(0, 0, 0, 0.1);
  }
}
</style>
