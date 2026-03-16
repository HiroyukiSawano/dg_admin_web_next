<template><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" :width="width" :height="height">
    <title>{{ title }}</title>
    <g :fill="fill">
      <defs>
        <filter id="nc-loop-gooey-32-filter">
          <feGaussianBlur in="SourceGraphic" result="blur" stdDeviation="1"></feGaussianBlur>
          <feColorMatrix in="blur" mode="matrix" result="goo" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 19 -9">
          </feColorMatrix>
          <feComposite in="SourceGraphic" in2="goo" operator="atop"></feComposite>
        </filter>
      </defs>
      <g class="nc-loop-gooey-32-icon-f" filter="url(#nc-loop-gooey-32-filter)">
        <circle cx="5" cy="16" r="4" :fill="fill"></circle>
        <circle cx="5" cy="16" r="4" :fill="fill"></circle>
        <circle cx="16" cy="16" r="4" :fill="fill"></circle>
        <circle cx="27" cy="16" r="4" :fill="fill"></circle>
      </g>
    </g>
  </svg>
</template>
<style lang="scss" scoped>
.nc-loop-gooey-32-icon-f {
  --animation-duration: 1s
}

.nc-loop-gooey-32-icon-f :first-child {
  transform-origin: 5px 16px;
  animation: nc-loop-gooey-32-anim var(--animation-duration) infinite
}

@keyframes nc-loop-gooey-32-anim {
  from {
    transform: translateX(0)
  }

  to {
    transform: translateX(22px)
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
      default: "gooey anim"
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
