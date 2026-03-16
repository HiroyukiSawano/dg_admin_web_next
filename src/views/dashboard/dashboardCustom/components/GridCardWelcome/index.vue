<template>
  <div class="el-card__wrapper">
    <el-card>
      <div class="el-welcome">
        <div class="el-welcome__avatar">
          <!-- <el-avatar :size="56" shape="square" :src="avatar">王</el-avatar> -->
          <el-avatar :size="56" shape="square">{{ $translate('ec.locale.b7ue3wg1', locales).at(0) }}</el-avatar>
        </div>
        <div class="el-welcome__content">
          <div class="el-welcome__title">{{ $translate('ec.locale.b7ue3wg1', locales) }}</div>
          <div class="el-welcome__descriotion">{{ $translate('ec.locale.d6ar691w', locales) }}</div>
        </div>
        <div class="el-welcome__action">
          <div class="el-media hidden-xs-only">
            <div class="el-media__icon">
              <el-image :src="welcomeWeather" />
              <!-- <ec-dynamic-icon ref="dynamicIconRefs" :size="64" :frame="48" :speed="48" :icon="welcomeWeather" /> -->
            </div>
            <div class="el-media__content">
              <div class="el-media__title">{{ $translate('ec.locale.ouysaf9s', locales) }}</div>
              <div class="el-media__description">{{ welcomeTime }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="el-statistic-group">
        <el-scrollbar>
          <el-row class="el-statistic-row">
            <el-col :xs="24" :sm="12" :md="6" :lg="6" v-for="item, index in props.record.options.data.source" :key="index" class="el-statistic-column">
              <div class="el-statistic">
                <div class="el-statistic__icon">
                  <i :class="item.icon"></i>
                </div>
                <div class="el-statistic__content">
                  <div class="el-statistic__title">{{ item.name }}</div>
                  <div class="el-statistic__number">
                    <em>{{ item.value }}</em>
                  </div>
                </div>
              </div>
            </el-col>
          </el-row>
        </el-scrollbar>
      </div>
    </el-card>
  </div>
</template>
<script setup>
import { ref } from 'vue'
import { useDateFormat, useNow } from '@vueuse/core'
import { v4 as uuidv4 } from 'uuid'
import { random } from 'lodash-es'
import Identicon from 'identicon.js'
import config from './config'
// import EcDynamicIcon from '@/components/EcDynamicIcon'
defineOptions({
  name: 'GridCardWelcome',
  config
})
const props = defineProps({
  record: {
    type: Object,
  },
})
const locales = {
  'en': {
    'ec.locale.b7ue3wg1': 'Gossi Wang',
    'ec.locale.d6ar691w': 'Nanning / Natural Resources Bureau / First-Class Clerk',
    'ec.locale.ouysaf9s': 'China•Nanning',
  },
  'zh-CN': {
    'ec.locale.b7ue3wg1': '王国熙',
    'ec.locale.d6ar691w': '南宁市/国土资源局/一级科员',
    'ec.locale.ouysaf9s': '中国•南宁',
  }
}
const avatar = 'data:image/svg+xml;base64,' + new Identicon(uuidv4(), {
  foreground: [255, 255, 255, 100],
  background: [random(100, 255), random(100, 255), random(100, 255), 255],
  margin: 0.2,
  size: 56,
  format: 'svg'
}).toString()

const welcomeWeather = new URL('@/assets/images/weather/weather-drizzle-rain.png', import.meta.url).href
const welcomeTime = useDateFormat(useNow(), 'YYYY-MM-DD HH:mm:ss dddd', { locales: 'zh-CN' })
// const dynamicIconRefs = ref(null)
// const handleCardMouseenter = () => {
//   dynamicIconRefs.value?.over()
// }

// const handleCardMouseleave = () => {
//   dynamicIconRefs.value?.leave()
// }
</script>
<style lang="scss" scoped>
:deep(.el-card) {

  background: transparent url('@/assets/images/dashboard/dashboard-card-welcome-background.png') left bottom / cover no-repeat;
  &::before {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(180deg, var(--el-fill-color-blank) 0%, var(--el-color-primary-light-8) 100%);
    z-index: -1;
  }
}
.el-statistic-group {
  margin-top: 16px;
  background: color-mix(in srgb, var(--el-fill-color-blank) 40%, transparent);
  backdrop-filter: blur(6px);
  border-radius: var(--el-border-radius-base);
  // border: 1px solid color-mix(in srgb, var(--el-fill-color-blank) 40%, transparent);
  height: 112px;
  .el-statistic-row {
    padding: 0 24px;
  }
  .el-statistic {
    display: flex;
    align-items: center;
    height: 112px;
    width: 100%;
    .el-statistic__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      margin-right: 16px;
      width: 48px;
      height: 48px;
      border-radius: var(--el-border-radius-base);
      background-color: var(--el-color-primary-light-8);
      color: var(--el-color-primary);
      border-radius: var(--el-border-radius-base);
      > i {
        font-size: 28px;
        -webkit-background-clip: text;
        background-clip: text;
        background-image: linear-gradient(180deg, var(--el-color-primary) 0%, var(--el-color-primary-light-5) 100%);
        color: transparent;
        text-shadow: 0px 4px 8px color-mix(in srgb, var(--el-color-primary) 25%, transparent);
      }
    }
    .el-statistic__content {
      min-width: 0;
      flex: 1;
      overflow: hidden;
    }
    .el-statistic__number {
      line-height: 1;
      > em {
        // color: var(--el-color-primary);
        font-style: normal;
        font-size: calc(var(--el-font-size-medium) * 1.5);
        font-weight: 600;
      }
    }
    .el-statistic__title {
      margin-bottom: 4px;
      font-size: var(--el-font-size-base);
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}
.el-welcome {
  display: flex;
  align-items: center;
  height: 80px;
  .el-welcome__avatar {
    display: flex;
    margin-right: 16px;
    .el-avatar {
      --el-avatar-text-size: var(--el-font-size-extra-large);
      background: linear-gradient(180deg, var(--el-color-primary-light-3), var(--el-color-primary));
    }
  }
  .el-welcome__title {
    font-size: var(--el-font-size-extra-large);
    font-weight: 600;
  }
  .el-welcome__descriotion {
    color: var(--el-text-color-secondary);
  }
  .el-welcome__content {
    flex: 1;
  }
  .el-welcome__action {
    flex-shrink: 0;
  }
}

.el-media {
  display: flex;
  align-items: center;
  .el-media__title {
    font-size: var(--el-font-size-extra-large);
    font-weight: 600;
  }
  .el-media__description {
    min-width: 180px;
    color: var(--el-text-color-secondary);
  }
  .el-media__icon {
    margin-right: 8px;
    width: 64px;
    height: 64px;
    flex-shrink: 0;
    .el-image {
      width: 64px;
      height: 64px;
      transform: scale(1.5);
    }
    // > div {
    //   transform: scale(1.25);
    // }
    // background: transparent url('@/assets/images/dashboard/dashboard-card-welcome-icon-day-moon.png') center center / 80px 80px no-repeat;
  }
}


</style>
