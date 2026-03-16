<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" :width="width" :height="height">
    <title>{{ title }}</title>
    <g :fill="fill">
      <g class="nc-loop-circle-32-icon-f">
        <path d="M16 32a16 16 0 1 1 16-16 16.019 16.019 0 0 1-16 16zm0-29a13 13 0 1 0 13 13A13.015 13.015 0 0 0 16 3z"
          opacity=".4" :fill="fill"></path>
        <path d="M32 16h-3A13.015 13.015 0 0 0 16 3V0a16.019 16.019 0 0 1 16 16z" :fill="_secondaryfill"></path>
      </g>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.nc-loop-circle-32-icon-f {
  --animation-duration: 0.5s;
  transform-origin: 16px 16px;
  animation: nc-loop-circle-anim var(--animation-duration) infinite linear
}

@keyframes nc-loop-circle-anim {
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
      default: "circle anim"
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
