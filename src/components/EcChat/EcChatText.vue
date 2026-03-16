
<template>
  <div :class="`ec-chat__text ec-chat__text--${role}`">
    <template v-if="role === 'user'">
      <pre v-html="content"></pre>
    </template>
    <template v-else>
     <!-- <MarkdownItVue
      :content="content"
      @render-complete="renderCmplete"
    /> -->
    <MdPreview :modelValue="content" :theme="dark ? 'dark' : 'light'" />
    </template>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { MdPreview } from 'md-editor-v3'
import 'md-editor-v3/lib/preview.css'
// import MarkdownItVue from './EcChatMarkdown/markdown-it-vue.vue'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/modules/systemStore'
const { dark } = storeToRefs(useSystemStore())
defineOptions({
  name: 'EcChatText',
})
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  role: {
    type: String,
    validator: function (val) {
      if (!val) return true
      return ['user', 'assistant', 'error', 'model', 'system', 'lx'].includes(val)
    },
  },
})

// const escape = (html, encode = false) => {
//   const escapeTest = /[&<>"']/;
//   const escapeReplace = new RegExp(escapeTest.source, 'g');
//   const escapeTestNoEncode = /<>"'|&(?!(#\d{1,7}|#[Xx][a-fA-F0-9]{1,6}|\w+);)/;
//   const escapeReplaceNoEncode = new RegExp(escapeTestNoEncode.source, 'g');

//   const escapeReplacements = {
//     '&': '&amp;',
//     '<': '&lt;',
//     '>': '&gt;',
//     '"': '&quot;',
//     "'": '&#39;',
//   };

//   function getEscapeReplacement(ch) {
//     return escapeReplacements[ch] || ch
//   }

//   if (encode && escapeTest.test(html)) {
//     return html.replace(escapeReplace, getEscapeReplacement)
//   } else if (escapeTestNoEncode.test(html)) {
//     return html.replace(escapeReplaceNoEncode, getEscapeReplacement)
//   }
//   return html
// }

// const marked = new Marked(
//   markedHighlight({
//     highlight(code) {
//       return hljs.highlightAuto(code).value
//     },
//   }),
//   {
//     renderer: {
//       code(code, lang, escaped) {
//         return `<pre class="hljs"><div class="t-chat__code-header">
//     <span class="t-chat__language-txt">${escape(lang) || ''}</span>
//     <div class="t-chat__copy-btn" data-clipboard-action="copy">复制</div>
//     </div><code class="hljs language-${escape(lang)}" >${escaped ? code : escape(code)}</code></pre>`;
//       },
//     },
//   },
// )
// const getHtmlByMarked = (markdown) => {
//   if (!markdown) {
//     return '<div class="waiting"></div>'
//   }
//   return marked.parse(markdown)
// }
// const textual = computed(() => {
//   if (props.role === 'model') {
//     return props.content || ''
//   }

//   if (props.role === 'user' && typeof props.content === 'string') {
//     return escape(props.content)
//   }
//   return getHtmlByMarked(props.content)
// })
const renderCmplete = () => {
}
onMounted(() => {

})
</script>

<style lang="scss" scoped>
pre {
  white-space: pre-wrap;
  font-family: var(--el-font-family);
}
</style>
