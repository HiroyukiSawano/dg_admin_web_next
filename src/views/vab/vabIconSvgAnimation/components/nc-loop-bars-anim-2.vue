<template><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" :width="width" :height="height">
    <title>{{ title }}</title>
    <g :fill="fill">
      <g class="nc-loop-bars-2-32-icon-f">
        <g>
          <rect height="32" width="32" opacity="0"></rect>
          <rect height="6" width="4" x="2" y="21" :fill="fill"></rect>
        </g>
        <g>
          <rect height="32" width="32" opacity="0"></rect>
          <rect height="6" width="4" x="10" y="21" :fill="_secondaryfill"></rect>
        </g>
        <g>
          <rect height="32" width="32" opacity="0"></rect>
          <rect height="6" width="4" x="18" y="21" :fill="fill"></rect>
        </g>
        <g>
          <rect height="32" width="32" opacity="0"></rect>
          <rect height="6" width="4" x="26" y="21" :fill="_secondaryfill"></rect>
        </g>
      </g>
    </g>
  </svg>
</template>
<style lang="scss" scoped>
.nc-loop-bars-2-32-icon-f {
  --animation-duration: 1.4s
}

.nc-loop-bars-2-32-icon-f * {
  transform-origin: 50% 50%;
  will-change: transform
}

.nc-loop-bars-2-32-icon-f>* {
  animation: nc-loop-bars-2-32-anim-1 var(--animation-duration) infinite cubic-bezier(.19, 1, .22, 1)
}

.nc-loop-bars-2-32-icon-f>:nth-child(1),
.nc-loop-bars-2-32-icon-f>:nth-child(1) rect {
  animation-delay: calc(var(--animation-duration)/6.22)
}

.nc-loop-bars-2-32-icon-f>:nth-child(2),
.nc-loop-bars-2-32-icon-f>:nth-child(2) rect {
  animation-delay: calc(var(--animation-duration)/9.33)
}

.nc-loop-bars-2-32-icon-f>:nth-child(3),
.nc-loop-bars-2-32-icon-f>:nth-child(3) rect {
  animation-delay: calc(var(--animation-duration)/18.66)
}

.nc-loop-bars-2-32-icon-f>* rect {
  animation: nc-loop-bars-2-32-anim-2 var(--animation-duration) infinite cubic-bezier(.19, 1, .22, 1)
}

@keyframes nc-loop-bars-2-32-anim-1 {

  0%,
  100%,
  90% {
    transform: translateY(0)
  }

  40%,
  50% {
    transform: translateY(-16px)
  }
}

@keyframes nc-loop-bars-2-32-anim-2 {

  0%,
  40%,
  50% {
    transform-origin: 16px 21px;
    transform: scaleY(1)
  }

  100%,
  51%,
  90% {
    transform-origin: 16px 27px;
    transform: scaleY(1)
  }

  20%,
  70% {
    transform: scaleY(2.5)
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
      default: "bars anim 2"
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
