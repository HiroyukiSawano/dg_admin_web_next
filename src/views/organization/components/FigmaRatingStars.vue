<template>
  <div v-if="hasNumeric" class="figma-rating" :aria-label="`${normalizedValue}`" :style="ratingStyle">
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
  size: {
    type: Number,
    default: 16,
  },
  gap: {
    type: Number,
    default: 2,
  },
  activeColor: {
    type: String,
    default: '#ff9b28',
  },
  inactiveColor: {
    type: String,
    default: '#d6d9e2',
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

const ratingStyle = computed(() => ({
  '--figma-rating-size': `${props.size}px`,
  '--figma-rating-gap': `${props.gap}px`,
  '--figma-rating-active': props.activeColor,
  '--figma-rating-inactive': props.inactiveColor,
}))
</script>

<style lang="scss" scoped>
.figma-rating {
  position: relative;
  display: inline-flex;
  color: var(--figma-rating-inactive);
  font-size: var(--figma-rating-size);
  line-height: 1;
}

.figma-rating__base,
.figma-rating__fill {
  display: inline-flex;
  gap: var(--figma-rating-gap);
}

.figma-rating__fill {
  position: absolute;
  top: 0;
  left: 0;
  overflow: hidden;
  color: var(--figma-rating-active);
}

.figma-rating__text {
  color: #444a57;
  font-size: 14px;
}
</style>
