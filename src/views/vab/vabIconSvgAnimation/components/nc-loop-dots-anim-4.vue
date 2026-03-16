<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" :width="width" :height="height">
    <title>{{ title }}</title>
    <g :fill="fill">
      <g class="nc-loop-dots-4-32-icon-f">
        <circle cx="5" cy="16" r="5" :fill="fill"></circle>
        <circle cx="16" cy="16" r="5" :fill="_secondaryfill"></circle>
        <circle cx="27" cy="16" r="5" :fill="fill"></circle>
      </g>
    </g>
  </svg>
</template>
<style lang="scss" scoped>
.nc-loop-dots-4-32-icon-f {
  --animation-duration: 0.8s
}

.nc-loop-dots-4-32-icon-f * {
  opacity: .4;
  transform: scale(.75);
  animation: nc-loop-dots-4-anim var(--animation-duration) infinite
}

.nc-loop-dots-4-32-icon-f :nth-child(1) {
  transform-origin: 5px 16px;
  animation-delay: -.3s;
  animation-delay: calc(var(--animation-duration)/-2.666)
}

.nc-loop-dots-4-32-icon-f :nth-child(2) {
  transform-origin: 16px 16px;
  animation-delay: -.15s;
  animation-delay: calc(var(--animation-duration)/-5.333)
}

.nc-loop-dots-4-32-icon-f :nth-child(3) {
  transform-origin: 27px 16px
}

@keyframes nc-loop-dots-4-anim {

  0%,
  100% {
    opacity: .4;
    transform: scale(.75)
  }

  50% {
    opacity: 1;
    transform: scale(1)
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
      default: "dots anim 4"
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
