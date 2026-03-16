<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" :width="width" :height="height">
    <title>{{ title }}</title>
    <g :fill="fill">
      <g class="nc-loop-slideshow-anim-32-icon-f">
        <rect height="24" width="10" y="4" x="-11" :fill="fill"></rect>
        <rect height="24" width="10" y="4" :fill="fill"></rect>
        <rect height="24" width="10" y="4" x="11" :fill="fill"></rect>
        <rect height="24" width="10" y="4" x="22" :fill="fill"></rect>
      </g>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.nc-loop-slideshow-anim-32-icon-f,
.nc-loop-slideshow-anim-32-icon-f>* {
  --animation-duration: 0.8s
}

.nc-loop-slideshow-anim-32-icon-f {
  transform-origin: 50% 50%;
  animation: nc-loop-slideshow-anim-32 var(--animation-duration) infinite cubic-bezier(.215, .61, .355, 1)
}

.nc-loop-slideshow-anim-32-icon-f>:nth-child(1) {
  transform-origin: -6px 16px;
  transform: scale(.7)
}

.nc-loop-slideshow-anim-32-icon-f>:nth-child(2) {
  transform-origin: 5px 16px;
  animation: nc-loop-slideshow-anim-32-scale-up var(--animation-duration) infinite cubic-bezier(.215, .61, .355, 1)
}

.nc-loop-slideshow-anim-32-icon-f>:nth-child(3) {
  transform-origin: 50% 50%;
  transform: scale(.7);
  animation: nc-loop-slideshow-anim-32-scale-down var(--animation-duration) infinite cubic-bezier(.215, .61, .355, 1)
}

.nc-loop-slideshow-anim-32-icon-f>:nth-child(4) {
  transform-origin: 27px 16px;
  transform: scale(.7)
}

@keyframes nc-loop-slideshow-anim-32 {
  0% {
    transform: translateX(0)
  }

  100% {
    transform: translateX(11px)
  }
}

@keyframes nc-loop-slideshow-anim-32-scale-down {
  0% {
    transform: scale(1)
  }

  100% {
    transform: scale(.7)
  }
}

@keyframes nc-loop-slideshow-anim-32-scale-up {
  0% {
    transform: scale(.7)
  }

  100% {
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
      default: "slideshow anim"
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
