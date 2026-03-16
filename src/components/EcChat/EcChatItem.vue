<template>
  <div :class="['ec-chat__item', `ec-chat__item--${role}`, `ec-chat__item--${variant}`]">
    <div v-if="avatar" class="ec-chat__avatar">
      <slot name="avatar"><el-avatar :src="avatar" /></slot>
    </div>
    <div class="ec-chat__content">
      <div v-if="name || datetime" class="ec-chat__title">
        <span v-if="name" class="ec-chat__name">
          <slot name="name">{{ name }}</slot>
        </span>
        <time v-if="datetime" class="ec-chat__time">
          <slot name="datetime">{{ datetime }}</slot>
        </time>
      </div>
      <div class="ec-chat__detail">
        <div v-if="loading" class="ec-chat__bubble">
          <EcChatLoading :loading="loading" :animation="animation" />
        </div>
        <div v-else class="ec-chat__bubble">
          <slot name="content">
            <template v-if="reason && role === 'assistant'">
              <EcChatReason :role="role" :content="reason" :loading="reasonLoading" />
            </template>
            <template v-if="isString(content)">
              <EcChatText :is-normal-text="false" :content="content" :role="role" :loading="textLoading" />
            </template>
            <!-- <template v-else>{{ content }}</template> -->
            <component v-else :is="content" />
          </slot>
        </div>
      </div>
      <template v-if="role === 'assistant' && !streamLoading">
        <slot name="actions"></slot>
      </template>
    </div>

  </div>
</template>
<script setup>
import { isString } from 'lodash-es'
import EcChatText from './EcChatText'
import EcChatReason from './EcChatReason'
import EcChatLoading from './EcChatLoading'
defineOptions({
  name: 'EcChatItem',
})
const props = defineProps({
  actions: {
    type: [String, Function],
  },
  animation: {
    type: String,
    default: 'moving', // ['skeleton', 'moving', 'gradient']
  },
  avatar: {
    type: [String, Object, Function],
  },
  content: {
    type: [String, Function],
  },
  datetime: {
    type: [String, Function],
  },
  name: {
    type: [String, Function],
  },
  index: {
    type: [String, Number],
  },
  reason: {
    type: [String, Object, Boolean],
    default: false,
  },
  role: {
    type: String,
    validator: function (val) {
      if (!val) return true
      return ['user', 'assistant', 'error', 'model', 'system', 'lx'].includes(val)
    },
  },
  variant: {
    type: String,
    default: 'base', // ['base', 'outline', 'text']
  },
  loading: {
    type: Boolean,
    default: false,
  },
  streamLoading: {
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
})
</script>

<style lang="scss" scoped>
.ec-chat__item {
  display: flex;
  margin-bottom: 24px;
  &.ec-chat__item--user {
    flex-direction: row-reverse;
    .ec-chat__bubble {
      background-color: var(--el-color-primary);
      border-color: var(--el-color-primary);
      color: var(--el-color-white);
    }
    .ec-chat__content{
      align-items: flex-end;
    }
    .ec-chat__detail {
      flex-direction: row-reverse;
    }
    .ec-chat__avatar+.ec-chat__content {
      padding-left: 44px;
      padding-right: 12px;
    }
  }
  &.ec-chat__item--model {
    justify-content: center;
    .ec-chat__bubble {
      padding: 4px 8px;
      color: var(--el-text-color-placeholder);
    }
  }

}
.ec-chat__avatar {
  margin-top: 10px;
  .el-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
.ec-chat__avatar+.ec-chat__content {
  padding-left: 12px;
  padding-right: 44px;
}
.ec-chat__title {
  margin-bottom: 8px;
  color: var(--el-text-color-secondary);
}
.ec-chat__detail {
  max-width: 100%;
  // flex: 0 0 100%;
  // max-width: 100%;
  /* 控制子元素行为 */
  // flex-shrink: 1;    /* 允许收缩（默认值） */
  // min-width: 0;      /* 解决文本/内容不换行问题 */
  // overflow: hidden;  /* 隐藏溢出内容 */
}
.ec-chat__bubble {
  padding: 16px;
  min-height: 52px;
  background-color: var(--el-fill-color-light);
  border-radius: var(--el-border-radius-base);
}
.ec-chat__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  min-width: 0;
}
@media only screen and (max-width: 767px) {

  .ec-chat__avatar {
    display: none !important;
  }
  .ec-chat__avatar+.ec-chat__content {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
}
</style>
