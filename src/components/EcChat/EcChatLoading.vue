<template>
  <div class="ec-chat__loading">
    <i class="ri-progress-8-fill ri-loop-ripple-animation text-primary"></i>
    <span>{{ text }}</span>
  </div>
</template>
<script setup>
import { ref } from 'vue'
defineOptions({
  name: 'EcChatLoading',
})
const props = defineProps({
  animation: {
    type: String,
    default: 'gradient',
    validator: function (val) {
      if (!val) return true;
      return ['moving', 'gradient'].includes(val)
    },
  },
  text: {
    type: String,
    default: '正在思考...',
  },
})
</script>

<style lang="scss" scoped>
.ec-chat__loading {
  display: flex;
  align-items: center;
  > i {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    height: 14px;
    width: 14px;
    font-size: 16px;
    margin-right: 4px;
  }
}
.ri-loop-ripple-animation {
  animation: RiLoopRippleAnimation 1.2s infinite cubic-bezier(.215, .61, .355, 1)
}


@keyframes RiLoopRippleAnimation {
  0% {
    opacity: 1;
    transform: scale(1)
  }

  50% {
    opacity: 0.25;
    transform: scale(1.1)
  }
  100% {
    opacity: 1;
    transform: scale(1)
  }
}
</style>
