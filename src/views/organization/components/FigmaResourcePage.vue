<template>
  <figma-resource-shell :active-tab="activeTab" :sub-tabs="subTabs" :hide-tabs="hideTabs" hide-stats>
    <template #filters>
      <div class="organization-page-header">
        <button class="organization-page-header__back" type="button" @click="goBack">
          <i class="ri-arrow-left-line"></i>
        </button>
        <div class="organization-page-header__copy">
          <div class="organization-page-header__title">{{ title }}</div>
          <div v-if="description" class="organization-page-header__description">{{ description }}</div>
        </div>
      </div>
    </template>

    <template #actions>
      <slot name="actions"></slot>
    </template>

    <div class="organization-page-body">
      <slot></slot>
    </div>
  </figma-resource-shell>
</template>

<script setup>
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
  hideTabs: {
    type: Boolean,
    default: false,
  },
})

const router = useRouter()

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
  gap: 14px;
  min-width: 0;
}

.organization-page-header__back {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 0;
  border-radius: 10px;
  background: #f5f7fb;
  color: #2e5ef0;
  cursor: pointer;
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
  padding-top: 4px;
}

@media only screen and (max-width: 991px) {
  .organization-page-header {
    width: 100%;
  }

  .organization-page-header__title {
    font-size: 16px;
  }
}
</style>
