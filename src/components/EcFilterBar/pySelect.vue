<template>
  <el-select v-bind="$attrs" :filter-method="filterMethod" @visible-change="visibleChange">
    <el-option v-for="field in optionsList" :key="field.value" :label="field.label" :value="field" :disabled="isDisabled(field.value)"></el-option>
  </el-select>
</template>

<script setup>
import { ref, watch } from 'vue'
import pinyin from 'pinyin-match'

const props = defineProps({
  options: { type: Array, default: () => [] },
  filter: { type: Array, default: () => [] },
})

const optionsList = ref([])
const _optionsList = ref([])

watch(() => props.options, (val) => {
  optionsList.value = val
  _optionsList.value = [...val]
}, { immediate: true })

const filterMethod = (keyword) => {
  if (keyword) {
    optionsList.value = _optionsList.value.filter((item) => pinyin.match(item.label, keyword))
  } else {
    optionsList.value = [..._optionsList.value]
  }
}

const visibleChange = (isopen) => {
  if (isopen) {
    optionsList.value = [..._optionsList.value]
  }
}

const isDisabled = (key) => {
  return !!props.filter.find((item) => item.field.value === key && !item.field.repeat)
}
</script>
