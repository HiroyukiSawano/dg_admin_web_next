<template>
  <div class="el-page">
    <MdEditor v-model="text" :theme="dark ? 'dark' : 'light'" />
  </div>
  <!-- <MdPreview :editorId="id" :modelValue="text" :theme="dark ? 'dark' : 'light'" /> -->
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/modules/systemStore'
const { dark } = storeToRefs(useSystemStore())
import { MdEditor, MdPreview } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';

import mock from './mock.md?raw'
defineOptions({
  value: 'vabMarkdown',
})

const id = 'preview-only';
// const text = ref(mock);
const text = ref('');
</script>
<style lang="scss" scoped>
.el-page {
  height: calc(100% - var(--el-layout-breadcrumb-height));
}
:deep(.md-editor) {
  font-family: var(--el-font-family);
  border: 0;
  height: 100%;
  --md-border-color: var(--el-border-color);
  .md-editor-preview {
    --md-theme-code-block-radius: var(--el-radius-base);
  }
  .md-editor-preview .md-editor-code .md-editor-code-head {
    z-index: 800;
  }
  .md-editor-footer {
    height: 32px;
  }
  .md-editor-toolbar-wrapper {
    padding: 8px;
  }
  .md-editor-custom-scrollbar__thumb {
    border-radius: 0;
  }
}
</style>
