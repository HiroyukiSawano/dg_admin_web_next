<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" :width="width" :height="height">
    <title>{{ title }}</title>
    <g :fill="fill">
      <g class="nc-loop-dots-3-32-icon-f">
        <circle cx="4" cy="16" r="3" :fill="fill"></circle>
        <circle cx="16" cy="16" r="3" :fill="_secondaryfill"></circle>
        <circle cx="28" cy="16" r="3" :fill="fill"></circle>
      </g>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.nc-loop-dots-3-32-icon-f>* {
  --animation-duration: 0.8s;
  transform-origin: 50% 50%;
  animation: nc-loop-dots-3-anim var(--animation-duration) infinite
}

.nc-loop-dots-3-32-icon-f>:nth-child(2) {
  animation-delay: .1s
}

.nc-loop-dots-3-32-icon-f>:nth-child(3) {
  animation-delay: .2s
}

@keyframes nc-loop-dots-3-anim {

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

<script>
export default {
  props: {
    width: {
      type: [Number, String],
      default: "1em"
    },
    height: {
      type: [Number, String],
      default: "1em"
    },
    strokewidth: {
      type: [Number, String],
      default: 1
    },
    title: {
      type: String,
      default: "dots anim 3"
    },
    fill: {
      type: String,
      default: "currentColor"
    },
    secondaryfill: {
      type: String
    }
  },
  computed: {
    _secondaryfill: function () {
      return this.secondaryfill || this.fill
    }
  }
}
</script>
