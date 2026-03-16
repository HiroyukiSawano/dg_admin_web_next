
<template>
  <div class="ec-player" ref="playerRef"></div>
</template>

<script setup>
import { onMounted, ref, watch, onBeforeUnmount } from 'vue'
import Player from 'xgplayer'
import HlsPlugin from 'xgplayer-hls'
import 'xgplayer/dist/index.min.css'

defineOptions({ name: 'EcPlayer' })

const props = defineProps({
  src: { type: String, required: true },
  autoplay: { type: Boolean, default: false },
  autoplayMuted: { type: Boolean, default: true },
  controls: { type: Boolean, default: true },
  fluid: { type: Boolean, default: true },
  loop: { type: Boolean, default: false },
  live: { type: Boolean, default: false },
  language: { type: String, default: 'zh-cn' },
  width: { type: [Number, String], default: 600 },
  height: { type: [Number, String], default: 400 },
  options: { type: Object, default: () => ({}) }
})

const player = ref(null)
const playerRef = ref(null)

const init = () => {
  player.value = new Player({
    el: playerRef.value,
    url: props.src,
    autoplay: props.autoplay,
    autoplayMuted: props.autoplayMuted,
    loop: props.loop,
    controls: props.controls,
    fluid: props.fluid,
    isLive: props.live,
    width: props.width,
    height: props.height,
    language: props.language,
    plugins: props.live ? [HlsPlugin] : [],
    ...props.options
  })
}

watch(
  () => props.src,
  async (newSrc) => {
    if (!player.value || !newSrc) return

    try {
      await player.value.pause()
      player.value.changeSrc(newSrc)
      if (props.autoplay) {
        await player.value.play()
      }
    } catch (err) {
      console.warn('Failed to switch source or autoplay:', err)
    }
  }
)

onMounted(() => {
  init()
})

onBeforeUnmount(() => {
  if (player.value) {
    player.value.destroy()
    player.value = null
  }
})
</script>

<style lang="scss" scoped>
.ec-player {

}
.xgplayer {
  min-height: 100%;
  min-width: 100%;
  :deep() {
    .xgplayer-drag,
    .xgplayer-progress-played {
      background: var(--el-color-primary);
    }
    .xg-options-list li:hover,
    .xg-options-list li.selected {
      color: var(--el-color-primary);
    }
    .xgplayer-progress-btn {
      background: color-mix(in srgb, var(--el-color-primary) 50%, transparent);
      border: 1px solid color-mix(in srgb, var(--el-color-primary) 5%, transparent);
      box-shadow: 0 0 1px color-mix(in srgb, var(--el-color-primary) 5%, transparent);
      &.active {
        border: 4px solid color-mix(in srgb, var(--el-color-primary) 5%, transparent);
      }
    }
  }
}
</style>
