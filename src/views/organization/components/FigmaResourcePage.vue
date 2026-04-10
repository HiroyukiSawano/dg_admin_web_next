<template>
  <figma-resource-shell
    :active-tab="activeTab"
    :sub-tabs="subTabs"
    :hide-tabs="hideTabs"
    frame-variant="platform"
    hide-stats
  >
    <template #panel-header>
      <div class="organization-page-header" :class="{ 'organization-page-header--breadcrumb': breadcrumbList.length > 0 }">
        <div class="organization-page-header__main">
          <button class="organization-page-header__back" type="button" @click="goBack">
            <i class="ri-arrow-left-s-line"></i>
            <span>{{ backText }}</span>
          </button>

          <template v-if="breadcrumbList.length > 0">
            <div class="organization-page-header__divider"></div>
            <nav class="organization-page-header__breadcrumbs" aria-label="Breadcrumb">
              <span
                v-for="(item, index) in breadcrumbList"
                :key="`${item.label}-${index}`"
                class="organization-page-header__breadcrumb"
                :class="{ 'is-current': index === breadcrumbList.length - 1 }"
              >
                {{ item.label }}
              </span>
            </nav>
          </template>

          <template v-else>
            <div class="organization-page-header__copy">
              <div class="organization-page-header__title">{{ title }}</div>
              <div v-if="description" class="organization-page-header__description">{{ description }}</div>
            </div>
          </template>
        </div>

        <div v-if="$slots.actions" class="organization-page-header__actions">
          <slot name="actions"></slot>
        </div>
      </div>
    </template>

    <div class="organization-page-body">
      <slot></slot>
    </div>
  </figma-resource-shell>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import FigmaResourceShell from './FigmaResourceShell.vue'

defineOptions({ name: 'FigmaResourcePage' })

const props = defineProps({
  activeTab: {
    type: String,
    default: 'serviceProviders',
  },
  subTabs: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: '',
  },
  description: {
    type: String,
    default: '',
  },
  backPath: {
    type: String,
    default: '',
  },
  backText: {
    type: String,
    default: '返回',
  },
  breadcrumbs: {
    type: Array,
    default: () => [],
  },
  hideTabs: {
    type: Boolean,
    default: true,
  },
})

const { t } = useI18n()
const router = useRouter()
const breadcrumbList = computed(() => {
  return props.breadcrumbs
    .filter(Boolean)
    .map((item) => {
      if (typeof item === 'string') {
        return {
          label: item.startsWith('ec.') ? t(item) : item,
        }
      }

      const rawLabel = item.label || ''
      return {
        ...item,
        label: String(rawLabel).startsWith('ec.') ? t(rawLabel) : rawLabel,
      }
    })
})

const goBack = () => {
  if (props.backPath) {
    router.push(props.backPath)
    return
  }
  router.back()
}
</script>

<style lang="scss" scoped>
.organization-page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  min-width: 0;
}

.organization-page-header__main {
  display: flex;
  align-items: center;
  gap: 12px;
  min-width: 0;
}

.organization-page-header__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  height: 32px;
  padding: 0 6px;
  border: 0;
  border-radius: 4px;
  background: transparent;
  color: #2e5ef0;
  cursor: pointer;
  font-size: 14px;
  font-weight: 500;
  line-height: 22px;

  i {
    font-size: 18px;
    line-height: 1;
  }
}

.organization-page-header__divider {
  width: 1px;
  height: 24px;
  background: #e6e8ed;
}

.organization-page-header__breadcrumbs {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.organization-page-header__breadcrumb {
  position: relative;
  color: #999faa;
  font-size: 14px;
  line-height: 22px;
  white-space: nowrap;

  &:not(:last-child)::after {
    content: '/';
    margin-left: 10px;
    color: #c5c9d3;
  }
}

.organization-page-header__breadcrumb.is-current {
  color: #444a57;
  font-weight: 500;
}

.organization-page-header__copy {
  min-width: 0;
}

.organization-page-header__title {
  color: #151b26;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.3;
}

.organization-page-header__description {
  margin-top: 4px;
  color: #858a99;
  font-size: 13px;
  line-height: 1.5;
}

.organization-page-body {
  padding-top: 24px;
}

.organization-page-header__actions {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
}

@media only screen and (max-width: 991px) {
  .organization-page-header {
    width: 100%;
    flex-direction: column;
    align-items: stretch;
  }

  .organization-page-header__main {
    width: 100%;
  }

  .organization-page-header__breadcrumbs {
    overflow-x: auto;
  }

  .organization-page-header__actions {
    justify-content: flex-end;
  }

  .organization-page-header__title {
    font-size: 16px;
  }
}
</style>
