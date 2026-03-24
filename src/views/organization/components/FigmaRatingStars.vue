<template>
  <div v-if="hasNumeric" class="figma-rating" :aria-label="`${normalizedValue}`">
    <div class="figma-rating__base">
      <i v-for="index in max" :key="`base-${index}`" class="ri-star-line"></i>
    </div>
    <div class="figma-rating__fill" :style="{ width: `${(normalizedValue / max) * 100}%` }">
      <i v-for="index in max" :key="`fill-${index}`" class="ri-star-fill"></i>
    </div>
  </div>
  <span v-else class="figma-rating__text">{{ fallbackText }}</span>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'FigmaRatingStars' })

const props = defineProps({
  value: {
    type: [Number, String],
    default: '',
  },
  max: {
    type: Number,
    default: 5,
  },
})

const parsedValue = computed(() => Number.parseFloat(props.value))

const hasNumeric = computed(() => Number.isFinite(parsedValue.value))

const normalizedValue = computed(() => {
  return Math.max(0, Math.min(props.max, parsedValue.value || 0))
})

const fallbackText = computed(() => {
  return props.value || '-'
})
</script>

<style lang="scss" scoped>
.figma-rating {
  position: relative;
  display: inline-flex;
  color: #d6d9e2;
  font-size: 16px;
  line-height: 1;
}

.figma-rating__base,
.figma-rating__fill {
  display: inline-flex;
  gap: 2px;
}

.figma-rating__fill {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  color: #ff9b28;
}

.figma-rating__text {
  color: #444a57;
  font-size: 14px;
}
</style>
