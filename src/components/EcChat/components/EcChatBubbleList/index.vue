<template>
  <div class="ec-chat-bubble-list__wrapper">
    <el-scrollbar ref="scrollbarRef" class="ec-chat-bubble-list__scrollbar" :always="props.alwaysShowScrollbar" :max-height="maxHeight" @scroll="handleScroll">
      <div class="ec-chat-bubble-list">
        <template v-if="$slots.top">
          <slot name="top"></slot>
        </template>
        <template v-if="list && list.length > 0">
          <ec-chat-bubble
            v-for="(item, index) in list"
            :key="index"
            :content="item.content"
            :placement="props.placement || item.placement"
            :loading="props.loading !== undefined ? props.loading : item.loading"
            :loading-text="props.loadingText !== undefined ? props.loadingText : item.loadingText"
            :loading-animation="props.loadingAnimation || item.loadingAnimation"
            :shape="props.shape || item.shape"
            :variant="props.variant || item.variant"
            :is-markdown="props.isMarkdown !== undefined ? props.isMarkdown : item.isMarkdown"
            :is-fog="props.placement === 'left' || item.placement === 'left' ? (props.isFog !== undefined ? props.isFog : item.isFog) : false"
            :typing="props.placement === 'left' || item.placement === 'left' ? (props.typing !== undefined ? props.typing : item.typing) : false"
            :max-width="props.maxWidth || item.maxWidth"
            :avatar="props.avatar || item.avatar"
            :avatar-size="props.avatarSize || item.avatarSize"
            :avatar-shape="props.avatarShape || item.avatarShape"
            :avatar-placeholder="props.avatarPlaceholder !== undefined ? props.avatarPlaceholder : item.avatarPlaceholder"
            @finish="(instance) => handleBubbleComplete(index, instance)"
          >
            <template v-if="$slots.avatar" #avatar>
              <slot name="avatar" :item="item" :index="index"></slot>
            </template>
            <template v-if="$slots.header" #header>
              <slot name="header" :item="item" :index="index"></slot>
            </template>
            <template v-if="$slots.content" #content>
              <slot name="content" :item="item" :index="index"></slot>
            </template>
            <template v-if="$slots.footer" #footer>
              <slot name="footer" :item="item" :index="index"></slot>
            </template>
            <template v-if="$slots.loading" #loading>
              <slot name="loading" :item="item" :index="index"></slot>
            </template>
            <slot></slot>
          </ec-chat-bubble>
        </template>
        <template v-else>
          <slot></slot>
        </template>
        <template v-if="$slots.bottom">
          <slot name="bottom"></slot>
        </template>
      </div>
    </el-scrollbar>
    <div v-if="showBackToBottom && hasVertical" class="ec-chat-bubble-list__back-button" @click="scrollToBottom">
      <slot name="backToBottom">
        <el-button :class="{ 'is-loading': backButtonLoading }" icon="ri-arrow-down-line" circle />
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick, onBeforeUnmount } from 'vue'
import EcChatBubble from '../EcChatBubble/index.vue'
defineOptions({
  name: 'EcChatBubbleList',
})
const props = defineProps({
  list: {
    type: Array,
    default: () => [],
  },
  autoScroll: {
    type: Boolean,
    default: true,
  },
  maxHeight: {
    type: String,
    default: '100%',
  },
  triggerIndices: {
    type: [String, Array],
    default: 'only-last',
  },
  alwaysShowScrollbar: {
    type: Boolean,
    default: false,
  },
  backButtonThreshold: {
    type: Number,
    default: 64,
  },
  showBackButton: {
    type: Boolean,
    default: true,
  },
  backButtonLoading: {
    type: Boolean,
    default: true,
  },
  placement: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: undefined,
  },
  loadingText: {
    type: [Boolean, String],
    default: undefined,
  },
  loadingAnimation: {
    type: String,
    default: 'circle',
  },
  isFog: {
    type: Boolean,
    default: false,
  },
  typing: {
    type: [Boolean, Object],
    default: undefined,
  },
  shape: {
    type: String,
    default: '',
  },
  variant: {
    type: String,
    default: '',
  },
  maxWidth: {
    type: String,
    default: '',
  },
  avatar: {
    type: String,
    default: '',
  },
  avatarSize: {
    type: Number,
    default: undefined,
  },
  avatarShape: {
    type: String,
    default: '',
  },
  avatarPlaceholder: {
    type: Boolean,
    default: false,
  },
  isMarkdown: {
    type: Boolean,
    default: true,
  },
})

const emits = defineEmits(['complete'])
const TOLERANCE = 30

const scrollbarRef = ref(null)

const getScrollElement = () => {
  return scrollbarRef.value?.wrapRef || scrollbarRef.value?.$refs.wrap
}

const hasVertical = ref(false)
const scrollObserver = ref(null)

onMounted(async () => {
  await nextTick()
  const checkScroll = () => {
    const el = getScrollElement()
    if (!el) return
    hasVertical.value = el.scrollHeight > el.clientHeight
  }

  checkScroll()
  scrollObserver.value = new ResizeObserver(checkScroll)
  const scrollEl = getScrollElement()
  scrollEl && scrollObserver.value.observe(scrollEl)
})

onBeforeUnmount(() => {
  scrollObserver.value?.disconnect()
})

const stopAutoScrollToBottom = ref(false)
const resizeObserver = ref(null)
const showBackToBottom = ref(false)

watch(
  () => props.list.length,
  async () => {
    if (!props.list || props.list.length === 0) return
    if (!props.autoScroll) return

    await nextTick()
    autoScrollToBottom()
  },
  { immediate: true },
)

const scrollToTop = async () => {
  try {
    stopAutoScrollToBottom.value = true
    await nextTick()
    const scrollEl = getScrollElement()
    if (!scrollEl) return

    scrollEl.scrollTo({ top: 0, behavior: 'smooth' })
  } catch (error) {
    console.warn('[BubbleList error]: ', error)
  }
}

const scrollToBottom = async () => {
  try {
    const scrollEl = getScrollElement()
    if (!scrollEl || !scrollEl.scrollHeight) return

    await nextTick()
    scrollEl.scrollTo({ top: scrollEl.scrollHeight, behavior: 'smooth' })
    stopAutoScrollToBottom.value = false
  } catch (error) {
    console.warn('[BubbleList error]: ', error)
  }
}

const scrollToBubble = (index) => {
  const scrollEl = getScrollElement()
  if (!scrollEl) return

  const bubbles = scrollEl.querySelectorAll('.ec-chat-bubble')
  if (index >= bubbles.length) return

  stopAutoScrollToBottom.value = true
  const targetBubble = bubbles[index]
  const containerRect = scrollEl.getBoundingClientRect()
  const bubbleRect = targetBubble.getBoundingClientRect()
  const scrollPosition = bubbleRect.top - containerRect.top + scrollEl.scrollTop

  scrollEl.scrollTo({ top: scrollPosition, behavior: 'smooth' })
}

const autoScrollToBottom = () => {
  const scrollEl = getScrollElement()
  if (!scrollEl) return

  const listBubbles = scrollEl.querySelectorAll('.ec-chat-bubble__content')
  const secondLastItem = listBubbles[listBubbles.length - 2]

  if (secondLastItem) {
    const { top, bottom } = secondLastItem.getBoundingClientRect()
    const { top: containerTop, bottom: containerBottom } = scrollEl.getBoundingClientRect()
    const isVisible = top < containerBottom && bottom > containerTop
    if (isVisible) scrollToBottom()
  }

  resizeObserver.value?.disconnect()

  const lastItem = listBubbles[listBubbles.length - 1]
  if (!lastItem) return

  resizeObserver.value = new ResizeObserver(() => {
    if (!stopAutoScrollToBottom.value) scrollToBottom()
  })
  resizeObserver.value.observe(lastItem)
}

const completeMap = ref({})
const typingList = computed(() => props.list.map((item, _index_) => ({ ...item, _index_ })).filter((item) => item.typing))

const handleBubbleComplete = (index, instance) => {
  switch (props.triggerIndices) {
    case 'only-last':
      if (index === typingList.value[typingList.value.length - 1]?._index_) {
        emits('complete', instance, index)
      }
      break
    case 'all':
      completeMap.value[index] = instance
      if (Object.keys(completeMap.value).length === typingList.value.length) {
        emits('complete', instance, index)
      }
      break
    default:
      if (props.triggerIndices.includes(index)) {
        emits('complete', instance, index)
      }
      break
  }
}

const handleScroll = () => {
  const scrollEl = getScrollElement()
  if (!scrollEl) return

  const { scrollTop, scrollHeight, clientHeight } = scrollEl
  const distanceToBottom = scrollHeight - (scrollTop + clientHeight)
  showBackToBottom.value = props.showBackButton && distanceToBottom > props.backButtonThreshold
  stopAutoScrollToBottom.value = distanceToBottom > TOLERANCE
}

defineExpose({ scrollToTop, scrollToBottom, scrollToBubble })
</script>
<style scoped lang="scss" src="./style.scss"></style>
