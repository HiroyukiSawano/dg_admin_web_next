<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" :width="width" :height="height">
    <title>{{ title }}</title>
    <g :fill="fill">
      <g class="nc-loop-dots-2-32-icon-f">
        <circle cx="16" cy="3" r="3" opacity="0.6" :fill="fill"></circle>
        <circle cx="25.192" cy="6.808" r="3" opacity="0.8" :fill="fill"></circle>
        <circle cx="29" cy="16" r="3" :fill="fill"></circle>
        <circle cx="25.192" cy="25.192" r="3" opacity="0.4" :fill="fill"></circle>
        <circle cx="16" cy="29" r="3" opacity="0.4" :fill="fill"></circle>
        <circle cx="6.808" cy="25.192" r="3" opacity="0.4" :fill="fill"></circle>
        <circle cx="3" cy="16" r="3" opacity="0.4" :fill="fill"></circle>
        <circle cx="6.808" cy="6.808" r="3" opacity="0.4" :fill="fill"></circle>
      </g>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.nc-loop-dots-2-32-icon-f {
  --animation-duration: 0.8s;
  transform-origin: 16px 16px;
  animation: nc-loop-dots-2-anim var(--animation-duration) infinite steps(8, start)
}

@keyframes nc-loop-dots-2-anim {
  0% {
    transform: rotate(0)
  }

  100% {
    transform: rotate(360deg)
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
      default: "dots anim 2"
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
