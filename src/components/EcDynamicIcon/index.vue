<template>
  <div class="ec-dynamic-icon" :style="iconStyle"></div>
</template>

<script setup>
import { ref, computed, onUnmounted } from 'vue'
defineOptions({ name: 'EcDynamicIcon' })
const props = defineProps({
  size: {
    type: Number,
    default: 64
  },
  frame: {
    type: Number,
    default: 25
  },
  speed: {
    type: Number,
    default: 20
  },
  icon: {
    type: String,
    default: ''
  }
})

const y = ref(0)
const timer = ref(null)
const index = ref(-1)
const moving = ref(false)

const iconStyle = computed(() => {
  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
    'background-image': `url(${props.icon})`,
    'background-position-y': `${y.value}px`
  }
})

const over = () => {
  index.value = -1
  init()
}

const leave = () => {
  index.value = 1
  init()
}

const init = () => {
  if (moving.value) return
  stop()
  timer.value = setInterval(() => {
    const step = props.size * index.value
    const maxY = -(props.size * (props.frame - 1))

    if ((index.value === -1 && y.value <= maxY) || (index.value === 1 && y.value >= 0)) {
      stop()
      moving.value = false
    } else {
      moving.value = true
      y.value += step
    }
  }, props.speed)
}

const stop = () => {
  if (timer.value) {
    clearInterval(timer.value)
    timer.value = null
  }
}

onUnmounted(() => {
  stop()
})

defineExpose({ over, leave })
</script>

<style lang="scss" scoped>
.ec-dynamic-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: 100%;
}
</style>
