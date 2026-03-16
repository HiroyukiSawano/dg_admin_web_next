<template>
  <div class="wf-design">
    <div class="wf-scale">
      <node-wrap v-if="modelValue" v-model="modelValue" />
      <div class="wf-end-node">
        <div class="wf-end-node-circle"></div>
        <div class="wf-end-node-text">流程结束</div>
      </div>
    </div>
    <use-select v-if="selectVisible" ref="useSelectRef" @closed="selectVisible = false" />
  </div>
</template>

<script setup>
import { ref, provide, nextTick } from 'vue'
import nodeWrap from './nodeWrap.vue'
import useSelect from './select.vue'

const modelValue = defineModel({
  type: Object,
  default: () => { }
})

const useSelectRef = ref(null)
const selectVisible = ref(false)

const selectHandle = async (type, data) => {
  selectVisible.value = true
  await nextTick()
  useSelectRef.value?.open(type, data)
}

provide('select', selectHandle)
</script>

<style lang="scss" scoped>
.wf-design {
  width: 100%;
  font-size: var(--el-font-size-extra-small);
  .wf-scale {
    display: inline-block;
    position: relative;
    width: 100%;
    padding: 32px 0;
    align-items: flex-start;
    justify-content: center;
    flex-wrap: wrap;
    min-width: min-content;
  }
  :deep() {
    .wf-node-add {
      position: relative;
      padding: 32px 0 40px 0;
      text-align: center;
      .el-button {
        position: relative;
      }
      &::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        border-left: 1px solid var(--el-border-color-dark);
      }
    }
    .wf-node-box {
      position: relative;
      padding: 0 32px;
      &::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        border-left: 1px solid var(--el-border-color-dark);
      }
      &::after {
        content: "";
        position: absolute;
        top: -2px;
        left: 50%;
        transform: translate(-50%, -50%);
        border-style: solid;
        border-width: 8px 6px 4px;
        border-color: var(--el-border-color-dark) transparent transparent;
      }
    }

    .wf-node-col>.wf-node-box {
      margin-top: 32px;
    }
    .wf-node-block {
      position: relative;
      width: 224px;
      min-height: 80px;
      background-color: var(--el-fill-color-blank);
      box-shadow: var(--el-box-shadow-lighter);
      border-radius: var(--el-border-radius-base);
      overflow: hidden;
      cursor: pointer;

      &.wf-node-block--promoter {
        .wf-node-block__header {
          background-color: var(--el-color-primary);
        }
      }

      &.wf-node-block--approver {
        .wf-node-block__header {
          background-color: var(--el-color-warning);
        }
      }

      &.wf-node-block--send {
        .wf-node-block__header {
          background-color: var(--el-color-info);
        }
      }

      &.wf-node-block--branch {
        .wf-node-block__header {
        }
        .wf-node-block__title {
          color: var(--el-color-success);
        }

        .wf-node-block__extra {
          color: #919398;
        }

        &:hover {
          .wf-node-block__extra {
            display: none;
          }
        }
      }

      .wf-node-block__header {
        padding: 8px 12px;
        display: flex;
        align-items: center;
        color: var(--el-color-white);

        .el-text {
          color: inherit;
          font-size: inherit;
        }
      }

      .wf-node-block__icon {
        margin-right: 4px;
        line-height: 1;
      }

      .wf-node-block__close {
        margin-left: 4px;
        margin-right: -4px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        height: 14px;
        width: 14px;
        background-color: rgba(0, 0, 0, .1);
        border-radius: 100%;
        display: none;
      }

      .wf-node-block__title {
        margin-right: auto;
      }

      .wf-node-block__body {
        padding: 12px;
      }

      .wf-node-block__footer {
        padding: 8px 12px;
        background-color: #f5f7fa;
      }

      .wf-node-block__arrow {
        position: absolute;
        top: 0;
        bottom: 0;
        z-index: 1;
        display: none;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        &:hover {
          background-color: var(--el-fill-color-light);
        }

        &.wf-node-block__arrow--left {
          left: 0;
        }

        &.wf-node-block__arrow--right {
          right: 0;
        }
      }

      &:hover {
        box-shadow: var(--el-box-shadow-lighter);

        .wf-node-block__arrow {
          display: flex;
        }

        .wf-node-block__close {
          display: flex;
        }
      }
    }
    .wf-node-wrap {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      justify-content: flex-start;
      align-items: center;
      position: relative;
      z-index: 1;
    }
    .wf-node-col-add {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 1;
    }

    .wf-node-row {
      display: flex;
      height: auto;
      position: relative;
    }
    .wf-node-col {
      display: inline-flex;
      flex-direction: column;
      align-items: center;
      position: relative;
      border: 1px solid transparent;
      border-left: 0;
      border-right: 0;
      border-image: linear-gradient(90deg, var(--el-border-color-dark) 0%, var(--el-border-color-dark) 50%, var(--el-border-color-dark) 50%, var(--el-border-color-dark) 100%) 1;
      background-color: var(--el-fill-color-blank);
      &::before {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        transform: translate(-50%, 0);
        border-left: 1px solid var(--el-border-color-dark);
      }
      &:first-of-type {
        border-image: linear-gradient(90deg, transparent 0%, transparent 50%, var(--el-border-color-dark) 50%, var(--el-border-color-dark) 100%) 1;
      }
      &:last-of-type {
        border-image: linear-gradient(90deg, var(--el-border-color-dark) 0%, var(--el-border-color-dark) 50%, transparent 50%, transparent 100%) 1;
      }
    }

    .wf-end-node-circle {
      width: 10px;
      height: 10px;
      margin: auto;
      border-radius: 50%;
      background: var(--el-border-color-dark);
    }

    .wf-end-node-text {
      margin-top: 5px;
      text-align: center;
    }
  }
}
</style>
