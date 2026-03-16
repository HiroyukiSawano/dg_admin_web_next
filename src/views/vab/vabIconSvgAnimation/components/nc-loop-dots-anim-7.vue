<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" :width="width" :height="height">
    <title>{{ title }}</title>
    <g :fill="fill">
      <g class="nc-loop-dots-anim-7-icon-f">
        <circle cx="7" cy="7" r="6" :fill="_secondaryfill"></circle>
        <circle cx="25" cy="7" r="6" :fill="fill"></circle>
        <circle cx="25" cy="25" r="6" :fill="_secondaryfill"></circle>
        <circle cx="7" cy="25" r="6" :fill="fill"></circle>
      </g>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.nc-loop-dots-anim-7-icon-f {
  --animation-duration: 1s;
  transform-origin: 50% 50%;
  animation: nc-loop-dots-anim-7 var(--animation-duration) infinite cubic-bezier(.645, .045, .355, 1)
}

@keyframes nc-loop-dots-anim-7 {
  0% {
    transform: scale(1)
  }

  50% {
    transform: scale(.7) rotate(90deg)
  }

  100% {
    transform: scale(1) rotate(180deg)
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
      default: "dots anim 7"
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
