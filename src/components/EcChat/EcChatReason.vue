<template>
  <div class="ec-chat__reason">
    <el-collapse model-value="0" @change="onExpandChange">
      <el-collapse-item name="0" icon="ri-arrow-right-s-line">
        <template #title>
          <slot name="title">
            <template v-if="loading">
              <i class="ri-progress-8-fill ri-loop-ripple-animation text-primary"></i>
              <span>正在深度思考...</span>
            </template>
            <template v-else>
              <i class="ri-checkbox-circle-fill text-success"></i>
              <span>已深度思考</span>
            </template>
          </slot>
        </template>
        <div class="el-collapse-item__text">
          <slot name="content">
            {{ content }}
          </slot>
        </div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>
<script setup>
defineOptions({
  name: 'EcChatReason',
})
const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  loading: {
    type: Boolean,
    default: false,
  },
  onExpandChange: {
    type: Function,
    default: () => { },
  },
})
</script>

<style lang="scss" scoped>
.ec-chat__reason {
  margin-bottom: 16px;
  :deep(.el-collapse) {
    --el-collapse-header-height: 40px;
    --el-collapse-header-font-size: var(--el-font-size-extra-small);
    --el-collapse-content-font-size: var(--el-font-size-extra-small);
    --el-collapse-content-text-color: var(--el-text-color-secondary);
    --el-collapse-header-bg-color: var(--el-fill-color-blank);
    --el-collapse-content-bg-color: var(--el-fill-color-blank);
    border: 0;
    .el-collapse-item {
      .el-collapse-item__content {
        padding: 0 12px 12px 12px;
        line-height: 1.5;
      }
      .el-collapse-item__text {
        margin: -2px 0;
      }
      .el-collapse-item__title {
        display: flex;
        align-items: center;

        >i {
          margin-left: -2px;
          margin-right: 2px;
          font-size: var(--el-font-size-medium);
        }
      }
      .el-collapse-item__arrow {
        margin-right: -4px;
        font-size: var(--el-font-size-medium);
        color: var(--el-text-color-disabled);
      }
      .el-collapse-item__wrap {
        border: 0;
      }
      .el-collapse-item__header {
        display: flex;
        align-items: center;
        padding: 0 12px;
        border: 0;
      }
    }

    // border: 0;
    // background-color: #e4e8ef;
    // border-radius: 2px;
    // ::v-deep .el-collapse-item {
    //   margin: 0;

    //   .el-collapse-item__wrap {
    //     border: 0;
    //     background-color: transparent;
    //   }

    //   .el-collapse-item__header {
    //     height: 36px;
    //     line-height: 36px;
    //     border: 0;
    //     font-size: 12px;
    //     padding-left: 12px;
    //     background-color: transparent;
    //   }

    //   .el-collapse-item__arrow {
    //     margin-right: 10px;
    //     color: #919398;
    //   }

    //   .el-collapse-item__content {
    //     padding: 0 12px 12px 12px;
    //     font-size: 12px;
    //     line-height: 1.5;
    //     color: #919398;
    //     background-color: transparent;
    //   }
    //   .el-collapse-item__text {
    //     position: relative;
    //     margin: -2px 0;
    //   }

    //   .el-collapse-item__title {
    //     display: flex;
    //     align-items: center;
    //     font-size: 12px;

    //     >svg {
    //       margin-right: 4px;
    //       width: 14px;
    //       height: 14px;
    //     }
    //   }
    // }
  }
}


.ri-loop-ripple-animation {
  animation: RiLoopRippleAnimation 1.2s infinite cubic-bezier(.215, .61, .355, 1)
}


@keyframes RiLoopRippleAnimation {
  0% {
    opacity: 1;
    transform: scale(1)
  }

  50% {
    opacity: 0.25;
    transform: scale(1.1)
  }
  100% {
    opacity: 1;
    transform: scale(1)
  }
}
@keyframes RiLoopCircleAnimation {
  0% {
    transform: rotate(0)
  }

  100% {
    transform: rotate(360deg)
  }
}
</style>
