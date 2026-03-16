<template>
  <div :class="`ec-chat ec-chat--${layout}`">
    <div class="ec-chat__body">
      <div class="ec-chat__wrapper" ref="chatWrapperRef" @scroll="handleScroll">
        <div class="ec-chat__list">
          <template v-if="data && data.length > 0">
            <EcChatItem
              v-for="(item, index) in data"
              :key="index"
              :avatar="item.avatar"
              :name="item.name"
              :role="item.role"
              :datetime="item.datetime"
              :content="item.content"
              :reason="item.reason"
              :index="index"
              :loading="isItemLoading(index)"
              :reason-loading="isReasonLoading(index)"
              :text-loading="isTextLoading(index)"
              :stream-loading="isStreamLoading(index)"
              :animation="animation"
              :operation-btn="['copy', 'replay']"
            >
              <template #actions="{ item, index }">
                <slot name="actions" :item="item" :index="index"></slot>
              </template>
              <template #name="{ item, index }">
                <slot name="name" :item="item" :index="index"></slot>
              </template>
              <template #avatar="{ item, index }">
                <slot name="avatar" :item="item" :index="index"></slot>
              </template>
              <template #datetime="{ item, index }">
                <slot name="datetime" :item="item" :index="index"></slot>
              </template>
              <template #content="{ item, index }">
                <slot name="content" :item="item" :index="index"></slot>
              </template>
            </EcChatItem>
          </template>
          <template v-else>
            <slot></slot>
          </template>
        </div>
      </div>
    </div>
    <div class="ec-chat__footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted, onBeforeUnmount, onUpdated } from 'vue'
import { throttle } from 'lodash-es'
import EcChatItem from './EcChatItem.vue'
defineOptions({
  name: 'EcChat',
})
const props = defineProps({
  animation: {
    type: String,
    default: 'skeleton',
  },
  clearHistory: {
    type: Boolean,
    default: true,
  },
  data: {
    type: Array,
    default: () => [],
  },
  layout: {
    type: String,
    default: 'both',
  },
  reason: {
    type: [String, Object, Function],
  },
  reverse: {
    type: Boolean,
    default: false,
  },
  itemLoading: {
    type: Boolean,
    default: false,
  },
  textLoading: {
    type: Boolean,
    default: false,
  },
  reasonLoading: {
    type: Boolean,
    default: false,
  },
  streamLoading: {
    type: Boolean,
    default: false,
  },
  resizeObserver: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['scroll', 'clear'])
const chatWrapperRef = ref(null)
const observer = ref(null)
const handleScrollToBottom = (target, behavior = 'auto' | 'smooth') => {
  const currentScrollHeight = target.scrollHeight
  const currentClientHeight = target.clientHeight

  const innerBehavior = behavior ?? 'auto'
  if (innerBehavior === 'auto') {
    target.scrollTop = currentScrollHeight - currentClientHeight
  } else {
    const startScrollTop = target.scrollTop
    const endScrollTop = currentScrollHeight - currentClientHeight
    const duration = 300
    const step = (endScrollTop - startScrollTop) / duration;
    let startTime
    const animateScroll = (currentTime) => {
      if (!startTime) {
        startTime = currentTime
      }
      const elapsed = currentTime - startTime
      const top = Math.min(endScrollTop, startScrollTop + elapsed * step)
      target.scrollTop = top;
      if (top < endScrollTop) {
        requestAnimationFrame(animateScroll)
      }
    }
    requestAnimationFrame(animateScroll)
  }
}

const scrollToBottom = (params) => {
  if (!chatWrapperRef.value) return
  handleScrollToBottom(chatWrapperRef.value, params?.behavior || 'auto')
}
const resizeObserverToBottom = () => {
  if (!chatWrapperRef.value) return
  handleResizeObserverConnect(chatWrapperRef.value)
}

const autoScroll = ref(true)
const lastScrollTop = ref(0)

const handleScroll = throttle((e) => {
  const { scrollTop, scrollHeight, clientHeight} = e.target

  const isScrollDown = scrollTop > lastScrollTop.value

  const isScrollBottom = scrollHeight - scrollTop - clientHeight <= 1

  if (!isScrollDown && !isScrollBottom) {
    autoScroll.value = false
  } else if (isScrollBottom) {
    autoScroll.value = true
  }
  lastScrollTop.value = scrollTop

  emit('scroll', { e })
}, 10)

const isTextLoading = (index) => {
  return (props.reverse ? index === 0 : index === props.data.length - 1) && props.textLoading
}
const isItemLoading = (index) => {
  return (props.reverse ? index === 0 : index === props.data.length - 1) && props.itemLoading
}

const isReasonLoading = (index) => {
  return (props.reverse ? index === 0 : index === props.data.length - 1) && props.reasonLoading
}
const isStreamLoading = (index) => {
  return (props.reverse ? index === 0 : index === props.data.length - 1) && props.streamLoading
}

const clearConfirm = (context) => {
  emit('clear', context)
}


const handleResizeObserverConnect = (target) => {
  observer.value = new ResizeObserver((entries) => {
    const wrapper = entries[0].target
    wrapper.scrollTop = wrapper.scrollHeight
    handleResizeObserverDisconnect()
  })
  observer.value.observe(target)
}

const handleResizeObserverDisconnect = () => {
  if (observer.value) {
    observer.value.disconnect()
    observer.value = null
  }
}

defineExpose({ scrollToBottom, resizeObserverToBottom })

onUpdated(() => {
  autoScroll.value && scrollToBottom()
})
onMounted(() => {
  autoScroll.value && scrollToBottom()
})

onBeforeUnmount(() => {
  handleResizeObserverDisconnect()
})
</script>

<style lang="scss" scoped>
.ec-chat {
  display: flex;
  flex-direction: column;
  position: relative;
  height: 100%;
  &.ec-chat--both {
    :deep(.ec-chat__item.ec-chat__item--user) {
      flex-direction: row-reverse;
    }
  }
  &.ec-chat--single {
    :deep(.ec-chat__item) {
      flex-direction: row;
    }
    :deep(.ec-chat__avatar + .ec-chat__content) {
      padding-left: 12px;
      padding-right: 0;
    }
  }
}
.ec-chat__body {
  flex: 1;
  min-width: 0;
  min-height: 0;
}
.ec-chat__footer {
  margin-top: 16px;
}
.ec-chat__wrapper {
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
  &::-webkit-scrollbar {
  width: 0;
  height: 0;
  }
}
.ec-chat__list {
  display: flex;
  flex-direction: column;
}
</style>
