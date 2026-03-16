<template>
  <div
    class="base-verify-slider"
    :class="{
      'status-undo': active === status.undo,
      'status-doing': active === status.doing,
      'status-verifying': active === status.verifying,
      'status-success': active === status.success,
      'status-failed': active === status.failed,
    }"
    @click="click"
  >
    <el-slider v-model="sliderValue" :data-status-undo-text="$t('ec.component.verify.slider.text.undo')" :data-status-verifying-text="$t('ec.component.verify.slider.text.verifying')" :data-status-success-text="$t('ec.component.verify.slider.text.success')" :data-status-failed-text="$t('ec.component.verify.slider.text.failed')" :show-tooltip="false" :disabled="active === 2 || active === 3 || active === 4" @input="start" @change="finish" />
  </div>
</template>
<script setup>
import { ref, toRefs } from 'vue'
defineOptions({
  name: 'BaseVerifySlider',
})
const props = defineProps({
  originValue: {
    type: Number,
    default: 0,
  },
  isCallback: {
    type: Boolean,
    default: true,
  },
})
const { originValue, isCallback } = toRefs(props)
const emits = defineEmits(['reset', 'verify', 'success', 'fail'])
const status = ref({
  undo: 0,
  doing: 1,
  verifying: 2,
  success: 3,
  failed: 4,
})

const sliderValue = ref(originValue.value)
const active = ref(0)
const start = (val) => {
  if (val === 0) {
    reset()
  } else if (val === 100) {
    if (isCallback.value) {
      verify()
    } else {
      success()
    }
  } else {
    doing()
  }
}
const finish = (val) => {
  if (val !== 100) {
    reset()
  }
}
const reset = () => {
  active.value = status.value.undo
  sliderValue.value = 0
  emits('reset')
}
const doing = () => {
  active.value = status.value.doing
}
const verify = () => {
  active.value = status.value.verifying
  emits('verify')
}
const success = () => {
  active.value = status.value.success
  emits('success')
}
const fail = () => {
  active.value = status.value.failed
  emits('fail')
}
const click = () => {
  if (active.value === status.value.failed) {
    reset()
  }
}
defineExpose({ success, fail })
</script>

<style lang="scss" scoped>
.base-verify-slider {
  $sliderSize: 40px;
  position: relative;
  padding: 0 $sliderSize * 0.5;
  width: 100%;
  background-color: var(--el-fill-color-dark);
  border-radius: var(--el-border-radius-base);
  :deep(.el-slider) {
    &:before,
    &:after {
      content: '';
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      height: $sliderSize;
      color: var(--el-color-white);
    }
    &::before {
      width: $sliderSize * 0.5;
      border-top-left-radius: var(--el-border-radius-base);
      border-bottom-left-radius: var(--el-border-radius-base);
    }

    .el-slider__runway {
      height: $sliderSize;
      margin: 0;
      background-color: transparent;
    }

    .el-slider__bar {
      height: $sliderSize;
      border-radius: 0;
      background-color: var(--el-color-success);
    }

    .el-slider__button-wrapper,
    .el-slider__button {
      width: $sliderSize;
      height: $sliderSize;
    }

    .el-slider__button-wrapper {
      top: 0;
      z-index: 3;
    }

    .el-slider__button {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-width: 1px;
      border-radius: var(--el-border-radius-base);
      color: var(--el-color-success);
      border-color: var(--el-color-success);
      background-color: var(--el-fill-color-blank);
      &::after {
        content: '\f2e5';
        font-size: 18px;
        font-family: 'remixicon' !important;
      }
    }
  }

  &.status-undo {
    :deep(.el-slider) {
      &::after {
        content: attr(data-status-undo-text);
        color: var(--el-text-color-primary);
      }
      &::before,
      .el-slider__bar {
        background-color: var(--el-fill-color-dark);
      }
    }
  }
  &.status-doing {
    :deep(.el-slider) {
      &::after {
        opacity: 0;
      }
      &::before,
      .el-slider__bar {
        background-color: var(--el-color-success);
      }
    }
  }
  &.status-verifying {
    :deep(.el-slider) {
      &::after {
        content: attr(data-status-verifying-text);
      }
      &::before,
      .el-slider__bar {
        background-color: var(--el-color-success);
      }
      .el-slider__button {
        &::after {
          content: '\eec2';
          animation: Rotating linear infinite 2s;
        }
      }
    }
  }

  &.status-success {
    :deep(.el-slider) {
      &::after {
        content: attr(data-status-success-text);
      }
      &::before,
      .el-slider__bar {
        background-color: var(--el-color-success);
      }
      .el-slider__button {
        &::after {
          content: '\eb7b';
        }
      }
    }
  }

  &.status-failed {
    cursor: pointer;

    :deep(.el-slider) {
      &::after {
        content: attr(data-status-failed-text);
      }
      &::before,
      .el-slider__bar {
        background-color: var(--el-color-danger);
      }

      .el-slider__button {
        border-color: var(--el-color-danger);
        color: var(--el-color-danger);

        &::after {
          content: '\eb99';
        }
      }
    }
  }
}

@keyframes Rotating {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}
</style>
