<template>
  <div class="el-logo">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="currentColor">
      <g class="nc-loop-squares-anim-2-icon-f">
        <path d="M14.6,16l-5.3,5.3L4,16l5.3-5.3L14.6,16z" opacity="0.33" />
        <path d="M16,14.6l-5.3-5.3L16,4l5.3,5.3L16,14.6z" />
        <path d="M17.4,16l5.3-5.3L28,16l-5.3,5.3L17.4,16z" opacity="0.33" />
        <path d="M16,17.4l5.3,5.3L16,28l-5.3-5.3L16,17.4z" />
      </g>
    </svg>
    <span>{{ $t('ec.app.name') }}</span>
  </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.el-logo {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: var(--el-font-weight-primary);
  cursor: pointer;
  > * {

  }
  > i,
  > img,
  > svg {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: var(--el-color-primary);
  }

  > span {
    white-space: nowrap;
  }

  > small {
    white-space: nowrap;
    opacity: 0.5;
  }

  > i + span,
  > svg + span,
  > img + span {
    margin-left: 8px;
  }
  &:hover {
    .nc-loop-squares-anim-2-icon-f > * {
      --animation-duration: 2s;
      animation: nc-loop-squares-anim-2 var(--animation-duration) infinite;
    }
    .nc-loop-squares-anim-2-icon-f > :nth-child(1) {
      opacity: 0;
      animation-delay: calc(-1 * var(--animation-duration) / 2);
    }
    .nc-loop-squares-anim-2-icon-f > :nth-child(2) {
      opacity: 0.5;
      animation-delay: calc(-1 * var(--animation-duration) / 4);
    }
    .nc-loop-squares-anim-2-icon-f > :nth-child(4) {
      animation-delay: calc(var(--animation-duration) / 4);
    }
    @keyframes nc-loop-squares-anim-2 {
      0%,
      100% {
        opacity: 1;
      }
      50% {
        opacity: 0;
      }
    }
  }
}
</style>
