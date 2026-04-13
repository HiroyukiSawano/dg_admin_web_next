<template>
  <article class="service-provider-vendor-card">
    <div class="service-provider-vendor-card__head">
      <div class="service-provider-vendor-card__icon" :class="{ 'is-preset-icon': isPresetIcon }">
        <template v-if="isPresetIcon">
          <div class="service-provider-vendor-card__icon-stage">
            <img :src="resolvedIconSrc" :alt="title || 'icon'" class="service-provider-vendor-card__icon-image" :class="iconVariantClass" />
          </div>
        </template>
        <img v-else :src="resolvedIconSrc" :alt="title || 'icon'" class="service-provider-vendor-card__image" />
      </div>
      <div class="service-provider-vendor-card__summary">
        <div class="service-provider-vendor-card__title">{{ title || '-' }}</div>
        <div v-if="normalizedBadges.length > 0" class="service-provider-vendor-card__badges">
          <span v-for="badge in normalizedBadges" :key="badge" class="service-provider-vendor-card__badge">
            {{ badge }}
          </span>
        </div>
      </div>
    </div>

    <div class="service-provider-vendor-card__body">
      <div v-for="item in normalizedMetaItems" :key="item.label" class="service-provider-vendor-card__row">
        <span>{{ item.label }}</span>
        <div v-if="item.type === 'rating'" class="service-provider-vendor-card__rating-wrap">
          <figma-rating-stars
            :value="item.value"
            :size="16"
            :gap="2"
          />
        </div>
        <strong v-else>{{ item.value || '-' }}</strong>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import FigmaRatingStars from './FigmaRatingStars.vue'
import { getProviderIcon } from './relationVisuals'

defineOptions({ name: 'ServiceProviderVendorCard' })

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  iconSrc: {
    type: String,
    default: '',
  },
  iconVariant: {
    type: String,
    default: '',
  },
  badges: {
    type: Array,
    default: () => [],
  },
  metaItems: {
    type: Array,
    default: () => [],
  },
})

const normalizedBadges = computed(() => {
  return (Array.isArray(props.badges) ? props.badges : []).filter(Boolean)
})

const normalizedMetaItems = computed(() => {
  return Array.isArray(props.metaItems) ? props.metaItems : []
})

const iconVariantClass = computed(() => {
  return props.iconVariant ? `is-${props.iconVariant}` : ''
})

const isPresetIcon = computed(() => {
  return ['provider-building'].includes(props.iconVariant)
})

const resolvedIconSrc = computed(() => getProviderIcon(props.iconSrc))
</script>

<style lang="scss" scoped>
.service-provider-vendor-card {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 16px;
  background: linear-gradient(115deg, #ffffff 41.12%, #f9faff 97.72%);
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  backdrop-filter: blur(2px);
}

.service-provider-vendor-card__head {
  display: flex;
  gap: 8px;
  align-items: center;
  min-height: 44px;
}

.service-provider-vendor-card__icon {
  display: flex;
  flex: 0 0 44px;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  overflow: hidden;
  background: #f5f6f9;
  border-radius: 4px;
}

.service-provider-vendor-card__icon.is-preset-icon {
  overflow: hidden;
}

.service-provider-vendor-card__icon-stage {
  position: relative;
  width: 44px;
  height: 44px;
}

.service-provider-vendor-card__icon-image {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  max-width: none;
  max-height: none;
  object-fit: cover;
  transform: translate(-50%, -50%);
}

.service-provider-vendor-card__icon-image.is-provider-building {
  width: 78px;
  height: 52px;
}

.service-provider-vendor-card__image {
  display: block;
  max-width: 72px;
  max-height: 56px;
  object-fit: contain;
}

.service-provider-vendor-card__summary {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.service-provider-vendor-card__title {
  overflow: hidden;
  min-height: 24px;
  color: #151b26;
  font-size: 14px;
  line-height: 22px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.service-provider-vendor-card__badges {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 2px;
}

.service-provider-vendor-card__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  height: 20px;
  padding: 0 8px;
  color: #858a99;
  font-size: 12px;
  line-height: 20px;
  background: #f5f6f9;
  border-radius: 2px;
}

.service-provider-vendor-card__body {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 16px 8px 0 0;
  margin-top: 16px;
  border-top: 0.5px solid #e6e8ed;
}

.service-provider-vendor-card__row {
  display: flex;
  align-items: flex-start;
  color: #444a57;
  font-size: 14px;
  line-height: 22px;

  > span {
    flex: 0 0 auto;
    color: #858a99;
  }

  > strong {
    flex: 1;
    min-width: 0;
    padding-left: 16px;
    font-weight: 400;
    word-break: break-all;
  }
}

.service-provider-vendor-card__rating-wrap {
  flex: 1;
  min-width: 0;
  padding-top: 2px;
  padding-left: 16px;
}

@media only screen and (max-width: 991px) {
  .service-provider-vendor-card__title {
    white-space: normal;
  }
}
</style>
