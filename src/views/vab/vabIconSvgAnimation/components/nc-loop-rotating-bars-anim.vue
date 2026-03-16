<template>
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" :width="width" :height="height">
    <title>{{ title }}</title>
    <g :fill="fill">
      <g class="nc-loop-bars-rotate-32-icon-f">
        <path d="M25 14h7v4h-7z" :fill="fill"></path>
        <path d="M22.839 21.339h4v7h-4z" opacity=".4" transform="rotate(-45 24.839 24.84)" :fill="fill"></path>
        <path d="M14 25h4v7h-4z" opacity=".4" :fill="fill"></path>
        <path d="M3.661 22.839h7v4h-7z" opacity=".4" transform="rotate(-45 7.161 24.839)" :fill="fill"></path>
        <path d="M0 14h7v4H0z" opacity=".4" :fill="fill"></path>
        <path d="M5.161 3.661h4v7h-4z" opacity=".4" transform="rotate(-45 7.161 7.16)" :fill="fill"></path>
        <path d="M14 0h4v7h-4z" opacity=".6" :fill="fill"></path>
        <path d="M21.339 5.161h7v4h-7z" opacity=".8" transform="rotate(-45 24.838 7.162)" :fill="fill"></path>
      </g>
    </g>
  </svg>
</template>

<style lang="scss" scoped>
.nc-loop-bars-rotate-32-icon-f {
  --animation-duration: 0.8s;
  transform-origin: 16px 16px;
  animation: nc-loop-bars-rotate-anim var(--animation-duration) infinite steps(8, start)
}

@keyframes nc-loop-bars-rotate-anim {
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
      default: "rotating bars anim"
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
