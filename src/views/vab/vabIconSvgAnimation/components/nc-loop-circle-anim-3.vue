<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" :width="width" :height="height">
    <title>{{ title }}</title>
    <g :fill="fill">
      <g class="nc-loop-circle-3-32-icon-f">
        <path
          d="M16 32a16 16 0 1 1 16-16 1.5 1.5 0 0 1-3 0 12.991 12.991 0 1 0-1.6 6.262 1.5 1.5 0 0 1 2.628 1.447A16.015 16.015 0 0 1 16 32z"
          :fill="fill"></path>
      </g>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.nc-loop-circle-3-32-icon-f {
  --animation-duration: 0.7s;
  transform-origin: 16px 16px;
  animation: nc-loop-circle-3-anim var(--animation-duration) infinite linear
}

@keyframes nc-loop-circle-3-anim {
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
      default: "circle anim 3"
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
