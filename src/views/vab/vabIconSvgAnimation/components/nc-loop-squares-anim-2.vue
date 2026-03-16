<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" :width="width" :height="height">
    <title>{{ title }}</title>
    <g :fill="fill">
      <g class="nc-loop-squares-anim-2-icon-f">
        <rect height="14" rx="1" width="14" x="17" y="1" :fill="_secondaryfill"></rect>
        <rect height="14" rx="1" width="14" x="17" y="17" :fill="fill"></rect>
        <rect height="14" rx="1" width="14" x="1" y="17" :fill="_secondaryfill"></rect>
        <rect height="14" rx="1" width="14" x="1" y="1" :fill="fill"></rect>
      </g>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.nc-loop-squares-anim-2-icon-f>* {
  --animation-duration: 2s;
  animation: nc-loop-squares-anim-2 var(--animation-duration) infinite
}

.nc-loop-squares-anim-2-icon-f>:nth-child(1) {
  opacity: 0;
  animation-delay: calc(-1 * var(--animation-duration)/ 2)
}

.nc-loop-squares-anim-2-icon-f>:nth-child(2) {
  opacity: .5;
  animation-delay: calc(-1 * var(--animation-duration)/ 4)
}

.nc-loop-squares-anim-2-icon-f>:nth-child(4) {
  animation-delay: calc(var(--animation-duration)/4)
}

@keyframes nc-loop-squares-anim-2 {

  0%,
  100% {
    opacity: 1
  }

  50% {
    opacity: 0
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
      default: "squares anim 2"
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
