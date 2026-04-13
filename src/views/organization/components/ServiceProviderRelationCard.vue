<template>
  <article class="service-provider-relation-card" :class="{ 'is-avatar': avatar }">
    <div class="service-provider-relation-card__head">
      <div class="service-provider-relation-card__icon" :class="iconClass">
        <template v-if="isPresetAvatar">
          <div class="service-provider-relation-card__avatar-shell">
            <div class="service-provider-relation-card__avatar-stage" :class="avatarVariantClass">
              <img :src="iconSrc" :alt="title || 'icon'" class="service-provider-relation-card__avatar-image" :class="avatarVariantClass" />
            </div>
          </div>
        </template>
        <template v-else-if="isPresetIcon">
          <div class="service-provider-relation-card__icon-stage">
            <img :src="iconSrc" :alt="title || 'icon'" class="service-provider-relation-card__icon-image" :class="iconVariantClass" />
          </div>
        </template>
        <img
          v-else
          :src="iconSrc"
          :alt="title || 'icon'"
          class="service-provider-relation-card__image"
          :class="{ 'is-avatar-image': avatar }"
        />
      </div>
      <div class="service-provider-relation-card__summary" :class="{ 'has-badge': Boolean(badge) }">
        <div class="service-provider-relation-card__title">{{ title || '-' }}</div>
        <span v-if="badge" class="service-provider-relation-card__badge" :class="`is-${badgeTone}`">
          {{ badge }}
        </span>
      </div>
    </div>

    <div class="service-provider-relation-card__body">
      <div v-for="item in normalizedMetaItems" :key="item.label" class="service-provider-relation-card__row">
        <span>{{ item.label }}</span>
        <strong>{{ item.value || '-' }}</strong>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'

defineOptions({ name: 'ServiceProviderRelationCard' })

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  badge: {
    type: String,
    default: '',
  },
  badgeTone: {
    type: String,
    default: 'blue',
  },
  iconSrc: {
    type: String,
    required: true,
  },
  metaItems: {
    type: Array,
    default: () => [],
  },
  avatar: {
    type: Boolean,
    default: false,
  },
  avatarVariant: {
    type: String,
    default: '',
  },
  iconVariant: {
    type: String,
    default: '',
  },
})

const normalizedMetaItems = computed(() => {
  return Array.isArray(props.metaItems) ? props.metaItems : []
})

const avatarVariantClass = computed(() => {
  return props.avatarVariant ? `is-${props.avatarVariant}` : ''
})

const isPresetAvatar = computed(() => {
  return props.avatar && ['male', 'female'].includes(props.avatarVariant)
})

const iconVariantClass = computed(() => {
  return props.iconVariant ? `is-${props.iconVariant}` : ''
})

const isPresetIcon = computed(() => {
  return !props.avatar && [
    'software-support',
    'software-office',
    'software-external',
    'hardware-server',
    'hardware-terminal',
    'project-folder',
  ].includes(props.iconVariant)
})

const iconClass = computed(() => ({
  'is-avatar': props.avatar,
  'is-preset-icon': isPresetIcon.value,
  [avatarVariantClass.value]: Boolean(avatarVariantClass.value),
}))
</script>

<style lang="scss" scoped>
.service-provider-relation-card {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 16px;
  background: linear-gradient(115deg, #ffffff 41.12%, #f9faff 97.72%);
  border: 1px solid #e5e7eb;
  border-radius: 4px;
  backdrop-filter: blur(2px);
}

.service-provider-relation-card__head {
  display: flex;
  gap: 8px;
  align-items: center;
  min-height: 44px;
}

.service-provider-relation-card__icon {
  display: flex;
  flex: 0 0 44px;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  overflow: visible;
  background: #f5f6f9;
  border-radius: 4px;
}

.service-provider-relation-card__image {
  display: block;
  max-width: 72px;
  max-height: 56px;
  object-fit: contain;
}

.service-provider-relation-card__image.is-avatar-image {
  width: 44px;
  height: 44px;
  max-width: none;
  max-height: none;
  object-fit: cover;
}

.service-provider-relation-card__icon.is-avatar {
  overflow: hidden;
}

.service-provider-relation-card__icon.is-preset-icon {
  overflow: hidden;
}

.service-provider-relation-card__icon-stage {
  position: relative;
  width: 44px;
  height: 44px;
}

.service-provider-relation-card__icon-image {
  position: absolute;
  top: 50%;
  left: 50%;
  display: block;
  max-width: none;
  max-height: none;
  object-fit: cover;
  transform: translate(-50%, -50%);
}

.service-provider-relation-card__icon-image.is-software-support {
  width: 48px;
  height: 48px;
}

.service-provider-relation-card__icon-image.is-software-office {
  width: 72px;
  height: 48px;
}

.service-provider-relation-card__icon-image.is-software-external {
  width: 78px;
  height: 52px;
}

.service-provider-relation-card__icon-image.is-hardware-server {
  width: 66px;
  height: 44px;
}

.service-provider-relation-card__icon-image.is-hardware-terminal {
  width: 52px;
  height: 52px;
}

.service-provider-relation-card__icon-image.is-project-folder {
  width: 85px;
  height: 56px;
}

.service-provider-relation-card__avatar-shell {
  position: relative;
  width: 44px;
  height: 44px;
  overflow: hidden;
  border-radius: 4px;
}

.service-provider-relation-card__avatar-stage {
  position: absolute;
  top: 50%;
  left: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  background: linear-gradient(180deg, #f5f6f9 0%, #ebf0ff 100%);
}

.service-provider-relation-card__avatar-stage.is-male {
  width: 54px;
  height: 54px;
  transform: translate(-50%, -50%);
}

.service-provider-relation-card__avatar-stage.is-female {
  top: calc(50% + 3.5px);
  width: 50px;
  height: 50px;
  transform: translate(-50%, -50%);
}

.service-provider-relation-card__avatar-image {
  display: block;
  object-fit: cover;
}

.service-provider-relation-card__avatar-image.is-male {
  width: 44px;
  height: 44px;
}

.service-provider-relation-card__avatar-image.is-female {
  width: 50px;
  height: 50px;
}

.service-provider-relation-card__summary {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.service-provider-relation-card__summary.has-badge {
  justify-content: flex-start;
}

.service-provider-relation-card__title {
  overflow: hidden;
  min-height: 24px;
  color: #151b26;
  font-size: 14px;
  line-height: 22px;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.service-provider-relation-card__badge {
  display: inline-flex;
  align-items: center;
  align-self: flex-start;
  justify-content: center;
  font-size: 12px;
  line-height: 20px;

  &.is-blue {
    color: #2e5ef0;
    background: #ebf0ff;
    height: 20px;
    padding: 0 8px;
    border-top-left-radius: 2px;
    border-top-right-radius: 2px;
    border-bottom-left-radius: 2px;
  }

  &.is-green {
    color: #36b23e;
    background: #d5f7d7;
    height: 20px;
    padding: 0 8px;
    border-radius: 2px;
  }

  &.is-orange {
    color: #f98715;
    background: #feead5;
    height: 20px;
    padding: 0 8px;
    border-radius: 2px;
  }

  &.is-gray {
    color: #858a99;
    background: #f5f6f9;
    height: 24px;
    padding: 2px 8px;
    border-radius: 0;
  }
}

.service-provider-relation-card__body {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 16px 8px 0 0;
  margin-top: 16px;
  border-top: 0.5px solid #e6e8ed;
}

.service-provider-relation-card__row {
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

@media only screen and (max-width: 991px) {
  .service-provider-relation-card__title {
    white-space: normal;
  }
}
</style>
