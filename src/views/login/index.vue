<template>
  <div class="login">
    <el-row class="flex-fill" type="flex" justify="center" align="middle">
      <el-col :lg="14" class="hidden-md-and-down">
        <div class="login-slogn"></div>
      </el-col>
      <el-col :xs="24" :sm="16" :md="12" :lg="10">
        <el-card class="login-card">
          <div class="el-logo">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32" fill="currentColor">
              <g class="nc-loop-squares-anim-2-icon-f">
                <path d="M14.6,16l-5.3,5.3L4,16l5.3-5.3L14.6,16z" opacity="0.33" />
                <path d="M16,14.6l-5.3-5.3L16,4l5.3,5.3L16,14.6z" />
                <path d="M17.4,16l5.3-5.3L28,16l-5.3,5.3L17.4,16z" opacity="0.33" />
                <path d="M16,17.4l5.3,5.3L16,28l-5.3-5.3L16,17.4z" />
              </g>
            </svg>
            <span>{{ systemName }}</span>
          </div>

          <el-tabs v-model="active" class="login-tabs">
            <el-tab-pane :label="$t('ec.user.login.form.tab.label.account')" name="account" />
            <el-tab-pane :label="$t('ec.user.login.form.tab.label.code')" name="mobile" />
          </el-tabs>
          <login-form-password v-if="active === 'account'" />
          <login-form-phone v-if="active === 'mobile'" />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useSystemStore } from '@/stores/modules/systemStore'
import LoginFormPassword from './components/LoginFormPassword'
import LoginFormPhone from './components/LoginFormPhone'

const active = ref('account')
const { name: systemName } = storeToRefs(useSystemStore())
</script>
<style lang="scss" scoped>

.login {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  height: 100vh;
  overflow: hidden;
  background: var(--el-bg-color-page) url('@/assets/images/login/login-background.png') left top / cover no-repeat;

  .login-slogn {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 480px;
    width: 100%;
    max-width: 960px;
    overflow: hidden;
    background: url('@/assets/images/login/login-image.png') center center no-repeat;
  }

  // .login-card {
  //   width: 100%;
  //   height: 480px;
  //   padding: 48px;
  //   background-color: var(--el-fill-color-blank);
  //   backdrop-filter: blur(12px);
  //   border-radius: var(--el-border-radius-base);
  //   box-shadow: 0 0 16px 0 rgba(0, 0, 0, 0.025);
  //   .login-card__title {
  //     margin-bottom: 16px;
  //   }
  // }
}

.el-card {
  --el-card-padding: 48px;
  width: 100%;
  min-height: 480px;
  margin-bottom: 0;
  backdrop-filter: blur(12px);
}

.el-logo {
  display: flex;
  align-items: center;
  font-size: 18px;
  font-weight: var(--el-font-weight-primary);
  cursor: pointer;
  margin-bottom: 16px;
  line-height: 1;
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
    transform: scale(1.25);
  }

  > span {
    white-space: nowrap;
    font-size: calc(var(--el-font-size-medium) * 1.5);
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
:deep(.el-tabs) {
  .el-tabs__header {
    margin-bottom: 24px;
  }

  .el-tabs__item {
    padding: 0 16px;
    font-size: var(--el-font-size-medium);
    color: var(--el-text-color-secondary);

    &.is-active {
      color: var(--el-color-primary);
    }
  }

  .el-tabs__nav-wrap:after {
    content: none;
  }
}

:deep(.el-form) {
  .el-form-item {
    margin-bottom: 18px;
  }

  .el-input {
    .el-input__wrapper {
      padding-left: 12px;
      padding-right: 12px;
    }

    .el-input__icon {
      font-size: var(--el-font-size-medium);
    }

    .el-input__validateIcon {
      display: none;
    }

    .el-input__password {
      display: none;
    }
  }

  .el-input-group {
    .el-input-group__append {
      background-color: transparent;
    }
  }

  .el-checkbox {
    display: flex;
    height: 24px;
  }
}

@media only screen and (min-width: 1200px) {
  .el-card {
    width: 456px;
  }

  .login {
    .login-card {
      width: 456px;
    }

    .login-slogn {
      width: 100%;
    }
  }
}

html.dark {
  .login {
    background: var(--el-bg-color-page) url('@/assets/images/login/login-background-dark.png') left top / cover no-repeat;

    .login-slogn {
      background: none;
    }
  }
}
</style>
