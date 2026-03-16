<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" :width="width" :height="height">
    <title>{{ title }}</title>
    <g :fill="fill">
      <g class="nc-loop-dots-5-32-icon-f">
        <circle cx="16" cy="6" r="5" :fill="fill"></circle>
        <circle cx="26" cy="16" r="5" :fill="_secondaryfill"></circle>
        <circle cx="16" cy="26" r="5" :fill="fill"></circle>
        <circle cx="6" cy="16" r="5" :fill="_secondaryfill"></circle>
      </g>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.nc-loop-dots-5-32-icon-f {
  --animation-duration: 1s
}

.nc-loop-dots-5-32-icon-f * {
  animation: nc-loop-dots-5-anim var(--animation-duration) infinite
}

.nc-loop-dots-5-32-icon-f :nth-child(1) {
  transform-origin: 16px 6px
}

.nc-loop-dots-5-32-icon-f :nth-child(2) {
  transform-origin: 26px 16px;
  animation-delay: .1s
}

.nc-loop-dots-5-32-icon-f :nth-child(3) {
  transform-origin: 16px 26px;
  animation-delay: .2s
}

.nc-loop-dots-5-32-icon-f :nth-child(4) {
  transform-origin: 6px 16px;
  animation-delay: .3s
}

@keyframes nc-loop-dots-5-anim {

  0%,
  100% {
    opacity: 1;
    transform: scale(1)
  }

  50% {
    opacity: .4;
    transform: scale(.7)
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
      default: "dots anim 5"
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
