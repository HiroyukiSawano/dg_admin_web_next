<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" :width="width" :height="height">
    <title>{{ title }}</title>
    <g :fill="fill">
      <g class="nc-loop-bars-anim-3-icon-f">
        <path d="M30,18H2a2,2,0,0,1,0-4H30a2,2,0,0,1,0,4Z" :fill="fill"></path>
        <path d="M30,18H2a2,2,0,0,1,0-4H30a2,2,0,0,1,0,4Z" opacity="0.7" :fill="_secondaryfill"></path>
        <path d="M30,18H2a2,2,0,0,1,0-4H30a2,2,0,0,1,0,4Z" opacity="0.4" :fill="fill"></path>
      </g>
    </g>
  </svg>
</template>
<style lang="scss" scoped>
.nc-loop-bars-anim-3-icon-f,
.nc-loop-bars-anim-3-icon-f>* {
  --animation-duration: 1.5s;
  transform-origin: 50% 50%
}

.nc-loop-bars-anim-3-icon-f {
  animation: nc-loop-bars-anim-3 var(--animation-duration) infinite cubic-bezier(.65, .05, .36, 1)
}

.nc-loop-bars-anim-3-icon-f>:nth-child(1) {
  animation: nc-loop-bars-anim-3-sub-1 var(--animation-duration) infinite linear
}

.nc-loop-bars-anim-3-icon-f>:nth-child(2) {
  animation: nc-loop-bars-anim-3-sub-2 var(--animation-duration) infinite linear
}

.nc-loop-bars-anim-3-icon-f>:nth-child(3) {
  animation: nc-loop-bars-anim-3-sub-3 var(--animation-duration) infinite linear
}

@keyframes nc-loop-bars-anim-3 {
  0% {
    transform: rotate(0)
  }

  100% {
    transform: rotate(420deg)
  }
}

@keyframes nc-loop-bars-anim-3-sub-1 {

  0%,
  10% {
    transform: rotate(0)
  }

  100%,
  30% {
    transform: rotate(120deg)
  }
}

@keyframes nc-loop-bars-anim-3-sub-2 {

  0%,
  10% {
    transform: rotate(0)
  }

  30%,
  70% {
    transform: rotate(60deg)
  }

  100% {
    transform: rotate(120deg)
  }
}

@keyframes nc-loop-bars-anim-3-sub-3 {

  0%,
  70% {
    transform: rotate(0)
  }

  100% {
    transform: rotate(120deg)
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
      default: "bars anim 3"
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
