<template>
  <div class="ec-situation-select" id="ecSituation">
    <node :data="situations" @option-change="handleOptionChange" :index="0" />
  </div>
</template>
<script setup>
import { ref, watch, nextTick } from 'vue'
import node from './node'
defineOptions({
  name: 'EcSituationGuide',
})
const emit = defineEmits(['option-change'])
const props = defineProps({
  data: { type: Array, default: () => [] },
})
const situations = ref([])
watch(() => props.data, (n) => {
  situations.value = n
}, { immediate: true, deep: true })

const handleOptionChange = async () => {
  await nextTick()
  emit('option-change', handleOptionGet())
}

const handleOptionGet = () => {
  const situation = document.getElementById('ecSituation')
  const radios = situation.querySelectorAll('input[type="radio"]:checked')
  const options = Array.from(radios).map(radio => radio.value)
  return options
}
</script>
<style lang="scss" scoped>
.ec-situation-select {
  display: flex;
  flex-direction: column;
}
</style>
