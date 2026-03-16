<template>
  <div>
    <el-card header="Mock">
      <codemirror
      v-model="trasData"
      placeholder="Code goes here..."
      :style="{ height: '70vh', width: '100%' }"
      :autofocus="true"
      :indent-with-tab="true"
      :tab-size="2"
      :extensions="[basicSetup, javascript(), highlightActiveLine(), EditorView.lineWrapping]"
    />
    </el-card>
  </div>
</template>
<script setup>
import { ref, watch, nextTick } from 'vue'
import { storeToRefs } from 'pinia'
import { basicSetup } from "codemirror"
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { EditorView, highlightActiveLine } from '@codemirror/view'
import JSBeautify from 'js-beautify'
import { getBookList } from '@/services/modules/mockService'
import { useSystemStore } from '@/stores/modules/systemStore'

const { language } = storeToRefs(useSystemStore())

const bookSource = ref([])
const trasData = ref('')
watch(language, async(val) => {
  const { data: { data = [] } } = await getBookList({ locale: val })
  bookSource.value = data
  nextTick(() => {
    trasData.value = JSBeautify.js(JSON.stringify(bookSource.value ), { indent_size: 2 })
  })

}, { immediate: true })
</script>
<style lang="scss" scoped>

:deep(.v-codemirror) {
  .cm-gutters {
    background-color: transparent;
    border: 0;
  }
  .cm-activeLine,
  .cm-activeLineGutter {
    background-color: color-mix(in srgb, var(--el-color-primary) 10%, transparent);
  }
  .cm-editor {
    background-color: var(--el-fill-color);
    border: 1px solid var(--el-border-color);
    &:hover {
      border-color: var(--el-border-color-darker);
    }

    &.cm-focused {
      outline: 0 !important;
      border-color: var(--el-color-primary);
    }
  }
}
</style>
