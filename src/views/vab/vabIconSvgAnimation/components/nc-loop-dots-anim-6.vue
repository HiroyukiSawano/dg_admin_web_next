<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" :width="width" :height="height">
    <title>{{ title }}</title>
    <g :fill="fill">
      <g class="nc-loop-dots-anim-6-32-icon-f">
        <circle cx="4" cy="16" r="3" :fill="fill"></circle>
        <circle cx="16" cy="16" r="3" :fill="fill"></circle>
        <circle cx="28" cy="16" r="3" :fill="fill"></circle>
      </g>
    </g>
  </svg>
</template>
<style lang="scss" scoped>
.nc-loop-dots-anim-6-32-icon-f,
.nc-loop-dots-anim-6-32-icon-f>* {
  --animation-duration: 1.2s
}

.nc-loop-dots-anim-6-32-icon-f {
  transform-origin: 50% 50%;
  animation: nc-loop-dots-anim-6 var(--animation-duration) infinite
}

.nc-loop-dots-anim-6-32-icon-f>:nth-child(2),
.nc-loop-dots-anim-6-32-icon-f>:nth-child(3) {
  transform-origin: 22px 50%;
  animation: nc-loop-dots-anim-6-inner var(--animation-duration) infinite
}

@keyframes nc-loop-dots-anim-6 {

  0%,
  50% {
    transform: rotate(0)
  }

  100% {
    animation-timing-function: cubic-bezier(1, 0, 0, 1);
    transform: rotate(180deg)
  }
}

@keyframes nc-loop-dots-anim-6-inner {
  0% {
    transform: rotate(0)
  }

  100%,
  50% {
    animation-timing-function: cubic-bezier(1, 0, 0, 1);
    transform: rotate(180deg)
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
      default: "dots anim 6"
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
