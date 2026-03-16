<template>
  <div class="el-tools">
    <el-button text bg circle class="el-button--assistant hidden-xs-only"  />
    <el-button text bg circle icon="ri-search-2-line" @click="layoutSearchVisible = true" />
    <el-dropdown class="hidden-xs-only" :show-arrow="false" trigger="click" size="large">
      <div class="el-dropdown__link">
        <el-badge is-dot><el-button text bg circle icon="ri-flashlight-line" /></el-badge>
      </div>
      <template #dropdown>
        <layout-tasks />
      </template>
    </el-dropdown>
    <el-button class="hidden-xs-only" text bg circle :icon="isFullscreen ? 'ri-fullscreen-line' : 'ri-fullscreen-exit-line'" @click="toggleFullscreen" />
    <el-divider direction="vertical" />
    <el-dropdown :show-arrow="false" trigger="hover" @command="handleUser">
      <div class="el-dropdown__link">
        <el-avatar :size="32" shape="square" :src="user.avatar">{{ $t(user.name)?.at(0) }}</el-avatar>
        <label class="el-label hidden-xs-only">{{ $t(user.name) }}</label>
      </div>
      <template #dropdown>
        <div class="el-media" style="min-width: 224px;">
          <div class="el-media__avatar">
            <el-avatar :size="40" shape="square" :src="user.avatar">{{ $t(user.name)?.at(0) }}</el-avatar>
          </div>
          <div class="el-media__content">
            <div class="el-media__title">{{ $t(user.name) }}</div>
            <div class="el-media__text">
              <el-text size="small" type="info" truncated>{{ $t(user.organName) }}</el-text>
            </div>
          </div>
        </div>
        <el-dropdown-menu>
          <el-dropdown-item command="account">{{ $t('ec.user.dropdowm.item.text.account') }}</el-dropdown-item>
          <el-dropdown-item command="log">{{ $t('ec.user.dropdowm.item.text.log') }}</el-dropdown-item>
          <el-dropdown-item command="setting">{{ $t('ec.user.dropdowm.item.text.setting') }}</el-dropdown-item>
          <el-dropdown-item command="cache">{{ $t('ec.user.dropdowm.item.text.cache') }}</el-dropdown-item>
          <el-dropdown-item divided command="logout">{{ $t('ec.user.dropdowm.item.text.logout') }}</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <layout-search v-model="layoutSearchVisible" @success="layoutSearchVisible = false" />
    <layout-account v-model="layoutAccountVisible" />
  </div>
</template>
<script setup>

import { ref, getCurrentInstance } from 'vue'
import { ElMessageBox } from 'element-plus'
import { useFullscreen } from '@vueuse/core'
import { useRouter } from 'vue-router'
import { useAuthorizeStore } from '@/stores/modules/authorizeStore'
import { AUTH_ENABLED } from '@/configs'
import { $pub } from '@/plugins/mitt'
import LayoutSearch from '../LayoutSearch'
import LayoutTasks from '../LayoutTasks'
import LayoutAccount from '../LayoutAccount'

defineOptions({ name: 'LayoutTools' })

const { isFullscreen, toggle: toggleFullscreen } = useFullscreen()

const { proxy } = getCurrentInstance()
const router = useRouter()
const authExitPath = AUTH_ENABLED ? '/login' : '/'
const layoutSearchVisible = ref(false)
const layoutAccountVisible = ref(false)
const { user, ClearCache, Logout } = useAuthorizeStore()

const handleUser = (command) => {
  if (command === 'account') layoutAccountVisible.value = true
  if (command === 'log') router.push('/log')
  if (command === 'setting') {
    $pub('layoutSetting:visible')
  }
  if (command === 'cache') {
    ElMessageBox.confirm(proxy.$t('ec.user.cache.confirm.content.text'), proxy.$t('ec.user.cache.confirm.title.text'), {
      type: 'warning',
      confirmButtonText: proxy.$t('ec.user.cache.confirm.button.confirm.text'),
      cancelButtonText: proxy.$t('ec.user.cache.confirm.button.cancel.text'),
    }).then(async () => {
      await ClearCache()
      router.replace({ path: authExitPath })
    }).catch(() => { })
  }
  if (command === 'logout') {
    ElMessageBox.confirm(proxy.$t('ec.user.logout.confirm.content.text'), proxy.$t('ec.user.logout.confirm.title.text'), {
      type: 'warning',
      confirmButtonText: proxy.$t('ec.user.logout.confirm.button.confirm.text'),
      cancelButtonText: proxy.$t('ec.user.logout.confirm.button.cancel.text'),
    }).then(async () => {
      await Logout()
      router.replace({ path: authExitPath })
    }).catch(() => { })
  }
}
</script>

<style lang="scss" scoped>
.el-tools {
  display: flex;
  align-items: center;
  margin-left: 16px;

  .el-dropdown+.el-button,
  .el-button+.el-dropdown,
  .el-badge+.el-button,
  .el-button+.el-badge,
  .el-button+.el-button {
    margin-left: 16px;
  }

  .el-button {
    flex-shrink: 0;

  }

  .el-button.is-text.is-circle.is-has-bg {
    border-radius: var(--el-border-radius-base);
    &.el-button--assistant {
      background-image: url("@/assets/images/common/assistant.apng");
      background-size: 75% 75%;
      background-position: center center;
      background-repeat: no-repeat;
    }
  }

  .el-badge {
    :deep(.el-badge__content) {
      right: 6px;
      top: 2px;
      border: 0;
    }
  }

  .el-divider {
    margin: 0 16px;
  }

  :deep(.el-dropdown) {
    .el-dropdown__link {
      display: flex;
      align-items: center;
      flex-shrink: 0;
      outline: 0 !important;
      box-shadow: none !important;
      cursor: pointer;

      .el-avatar {
        display: flex;
        background-color: var(--el-color-primary-light-1);
      }

      label {
        margin-left: 8px;
      }
    }
  }
}
.el-media {
  display: flex;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid var(--el-border-color-lighter);

  .el-media__avatar {
    margin-right: 8px;

    .el-avatar {
      display: flex;
      background-color: var(--el-color-primary-light-1);
      font-size: var(--el-font-size-medium);
    }
  }

  .el-media__content {
    flex: 1;
    min-width: 0;
  }

  .el-media__title {

    margin-bottom: 8px;
    font-size: var(--el-font-size-base);
    color: var(--el-text-color-primary);
    line-height: 1;
  }

  .el-media__text {
    display: flex;
    overflow: hidden;
    line-height: 1;
  }
}
</style>
