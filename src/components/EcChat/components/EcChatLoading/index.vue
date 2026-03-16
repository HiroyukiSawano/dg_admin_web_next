<template>
  <div class="ec-chat-loading">
    <svg v-if="animation === 'circle'" xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 16 16">
      <g fill="#427af4" class="ec-icon-wrapper">
        <g class="ec-loop-circle-16-icon-f">
          <path d="M8 16a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8zM8 2a6 6 0 1 0 6 6 6.006 6.006 0 0 0-6-6z" fill="#427af4"
            opacity=".4"></path>
          <path d="M8 0v2a6.006 6.006 0 0 1 6 6h2a8.009 8.009 0 0 0-8-8z" fill="#427af4" data-color="color-2"></path>
        </g>
      </g>
    </svg>
    <svg v-if="animation === 'bars'" xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 16 16">
      <g fill="#427af4" class="ec-icon-wrapper">
        <g class="ec-loop-bars-rotate-16-icon-f">
          <rect fill="#427af4" height="2" rx=".5" width="4" x="12" y="7"></rect>
          <rect fill="#427af4" height="4.001" rx=".5" width="1.999" opacity=".4" x="11.243" y="10.242"
            transform="rotate(-44.975 12.243 12.243)"></rect>
          <rect fill="#427af4" height="4" rx=".5" width="2" opacity=".4" x="7" y="12"></rect>
          <rect fill="#427af4" height="1.999" rx=".5" width="4.001" opacity=".4" x="1.757" y="11.243"
            transform="rotate(-45.03 3.757 12.242)"></rect>
          <rect fill="#427af4" height="2" rx=".5" width="4" opacity=".4" y="7"></rect>
          <rect fill="#427af4" height="4.001" rx=".5" width="1.999" opacity=".4" x="2.758" y="1.757"
            transform="rotate(-44.975 3.757 3.757)"></rect>
          <rect fill="#427af4" height="4" rx=".5" width="2" opacity=".6" x="7"></rect>
          <rect fill="#427af4" height="1.999" rx=".5" width="4.001" opacity=".8" x="10.242" y="2.758"
            transform="rotate(-45.03 12.242 3.757)"></rect>
        </g>
      </g>
    </svg>
    <svg v-if="animation === 'dots'" xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 16 16">
      <g fill="#427af4" class="ec-icon-wrapper">
        <g class="ec-loop-dots-3-16-icon-f">
          <circle cx="1.5" cy="8" fill="#427af4" r="1.5"></circle>
          <circle cx="8" cy="8" fill="#427af4" r="1.5" data-color="color-2"></circle>
          <circle cx="14.5" cy="8" fill="#427af4" r="1.5"></circle>
        </g>
      </g>
    </svg>
    <span v-if="text">{{ text }}</span>
  </div>
</template>
<script setup>
import { computed, onUnmounted, ref, watch } from 'vue';
defineOptions({
  name: 'EcChatLoading',
})
const props = defineProps({
  animation: { type: String, default: 'circle' },
  text: { type: [Boolean, String], default: undefined },
});
</script>
<style lang="scss" scoped>
.ec-chat-loading {
  display: flex;
  align-items: center;

  >svg {
    margin-top: 2px;
    margin-bottom: 2px;
  }

  >svg+span {
    margin-left: 6px;
  }
}

.ec-loop-circle-16-icon-f {
  --animation-duration: 0.5s;
  transform-origin: 8px 8px;
  animation: ec-loop-circle-anim var(--animation-duration) infinite linear
}

@keyframes ec-loop-circle-anim {
  0% {
    transform: rotate(0)
  }

  100% {
    transform: rotate(360deg)
  }
}
.ec-loop-bars-rotate-16-icon-f {
  --animation-duration: 0.8s;
  transform-origin: 8px 8px;
  animation: ec-loop-bars-rotate-anim var(--animation-duration) infinite steps(8, start)
}

@keyframes ec-loop-bars-rotate-anim {
  0% {
    transform: rotate(0)
  }

  100% {
    transform: rotate(360deg)
  }
}

.ec-loop-dots-3-16-icon-f>* {
  --animation-duration: 0.8s;
  transform-origin: 50% 50%;
  animation: ec-loop-dots-3-anim var(--animation-duration) infinite
}

.ec-loop-dots-3-16-icon-f>:nth-child(2) {
  animation-delay: .1s
}

.ec-loop-dots-3-16-icon-f>:nth-child(3) {
  animation-delay: .2s
}

@keyframes ec-loop-dots-3-anim {

  0%,
  100%,
  60% {
    transform: translateY(0)
  }

  30% {
    transform: translateY(20%)
  }
}
</style>
