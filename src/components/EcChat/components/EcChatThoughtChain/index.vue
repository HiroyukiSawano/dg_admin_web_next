<template>
  <div class="ec-chat-thought-chain" :style="{ maxWidth: `${props.maxWidth}` }">
    <el-timeline>
      <transition-group name="ec-chat-thought-chain" tag="div">
        <el-timeline-item
          v-for="item in props.thinkingItems"
          :key="getId(item)"
          :type="getType(item)"
          :icon="props.dotIsIcon ? item.icon : 'ri-more-line'"
          :color="props.dotIsIcon ? item.iconColor : null"
          :timestamp="getTitle(item)"
          :hide-timestamp="item.hideTitle"
          :placement="item.placement ?? 'top'"
        >
          <div v-if="!item.isCanExpand">
            <ec-chat-typewriter :content="getThinkTitle(item)" :is-markdown="item.isMarkdown" :typing="item.typing" />
          </div>
          <el-collapse v-else-if="!item.isDefaultExpand" @change="handleExpand(item)">
            <el-collapse-item :title="getThinkTitle(item)" icon="ri-arrow-right-s-line">
              <ec-chat-typewriter :content="getThinkContent(item)" :is-markdown="item.isMarkdown" :typing="item.typing" />
            </el-collapse-item>
          </el-collapse>
          <el-collapse v-else-if="item.isDefaultExpand" v-model="defaultActiveNodes" @change="handleExpand(item)">
            <el-collapse-item :title="getThinkTitle(item)" :name="String(getId(item))" icon="ri-arrow-right-s-line">
              <ec-chat-typewriter :content="getThinkContent(item)" :is-markdown="item.isMarkdown" :typing="item.typing" />
            </el-collapse-item>
          </el-collapse>
          <template v-if="!dotIsIcon" #dot>
            <slot name="icon" :item="item">
              <el-button circle :loading="isLoading(item)" :size="props.dotSize" :type="getType(item)">
                <template #loading>
                  <el-icon class="ri-loader-2-line is-loading" />
                </template>
                <template #icon>
                  <template v-if="!isLoading(item)">
                    <el-icon v-if="isError(item)" class="ri-close-line" />
                    <el-icon v-else-if="isCancel(item)" class="ri-close-line" />
                    <el-icon v-else class="ri-check-line" />
                  </template>
                </template>
              </el-button>
            </slot>
          </template>
        </el-timeline-item>
      </transition-group>
    </el-timeline>
  </div>
</template>
<script setup>
import { get } from 'lodash-es'
import { computed, ref, watch } from 'vue'
import EcChatTypewriter from '../EcChatTypewriter/index.vue'
const props = defineProps({
  thinkingItems: {
    type: Array,
    default: () => [],
  },
  dotIsIcon: {
    type: Boolean,
    default: false,
  },
  dotSize: {
    type: String,
    default: 'small',
  },
  maxWidth: {
    type: String,
    default: '100%',
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  statusKey: {
    type: String,
    default: 'status',
  },
  statusEnum: {
    type: Object,
    default: () => ({
      loading: {
        value: 'loading',
        type: 'warning',
      },
      error: {
        value: 'error',
        type: 'danger',
      },
      cancel: {
        value: 'cancel',
        type: 'info',
      },
      success: {
        value: 'success',
        type: 'success',
      },
    }),
  },
  titleKey: {
    type: String,
    default: 'title',
  },
  thinkTitleKey: {
    type: String,
    default: 'thinkTitle',
  },
  thinkContentKey: {
    type: String,
    default: 'thinkContent',
  },
})

const emits = defineEmits(['handleExpand'])

const getId = (row) => {
  return get(row, props.rowKey)
}
const getStatus = (row) => {
  return get(row, props.statusKey)
}
const getTitle = (row) => {
  return get(row, props.titleKey) ?? ''
}
const getThinkTitle = (row) => {
  return get(row, props.thinkTitleKey) ?? ''
}
const getThinkContent = (row) => {
  return get(row, props.thinkContentKey) ?? ''
}
const getType = (row) => {
  const status = getStatus(row)
  const _status = Object.values(props.statusEnum).find((s) => s.value === status)
  return _status ? _status.type : 'success'
}

const isLoading = (row) => {
  const status = getStatus(row)
  return status === props.statusEnum.loading.value
}

const isError = (row) => {
  const status = getStatus(row)
  return status === props.statusEnum.error.value
}

const isCancel = (row) => {
  const status = getStatus(row)
  return status === props.statusEnum.cancel.value
}

const activeNamesComputed = computed(() => {
  return props.thinkingItems.filter((item) => item.isCanExpand && item.isDefaultExpand).map((item) => String(getId(item)))
})

const defaultActiveNodes = ref([...activeNamesComputed.value])

const handleExpand = (row) => {
  emits('handleExpand', row)
}

watch(
  () => activeNamesComputed.value,
  (v) => {
    defaultActiveNodes.value = [...v]
  },
)
</script>

<style lang="scss" scoped src="./style.scss"></style>
