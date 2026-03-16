<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" :width="width" :height="height">
    <title>{{ title }}</title>
    <g :fill="fill">
      <g class="nc-loop-bars-32-icon-f">
        <rect height="22" width="4" x="1" y="5" :fill="fill"></rect>
        <rect height="22" width="4" x="14" y="5" :fill="_secondaryfill"></rect>
        <rect height="22" width="4" x="27" y="5" :fill="fill"></rect>
      </g>
    </g>
  </svg>
</template>
<style lang="scss" scoped>
.nc-loop-bars-32-icon-f * {
  --animation-duration: 0.8s;
  transform-origin: 16px 16px;
  animation: nc-loop-bars-anim var(--animation-duration) infinite
}

.nc-loop-bars-32-icon-f :nth-child(2) {
  opacity: 1;
  transform: scaleY(1)
}

.nc-loop-bars-32-icon-f :nth-child(1),
.nc-loop-bars-32-icon-f :nth-child(3) {
  opacity: .3;
  transform: scaleY(.5);
  animation-delay: calc(var(--animation-duration)/-2)
}

@keyframes nc-loop-bars-anim {

  0%,
  100% {
    opacity: 1;
    transform: scaleY(1)
  }

  50% {
    opacity: .3;
    transform: scaleY(.5)
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
      default: "bars anim"
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
