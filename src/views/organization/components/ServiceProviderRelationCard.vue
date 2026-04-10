<template>
  <article class="service-provider-relation-card" :class="{ 'is-avatar': avatar }">
    <div class="service-provider-relation-card__head">
      <div class="service-provider-relation-card__icon">
        <img :src="iconSrc" :alt="title || 'icon'" />
      </div>
      <div class="service-provider-relation-card__summary">
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
})

const normalizedMetaItems = computed(() => {
  return Array.isArray(props.metaItems) ? props.metaItems : []
})
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

  img {
    display: block;
    max-width: 72px;
    max-height: 56px;
    object-fit: contain;
  }
}

.is-avatar .service-provider-relation-card__icon {
  overflow: hidden;

  img {
    width: 44px;
    height: 44px;
    max-width: none;
    max-height: none;
    object-fit: cover;
  }
}

.service-provider-relation-card__summary {
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  min-width: 0;
}

.service-provider-relation-card__title {
  overflow: hidden;
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
  padding: 0 8px;
  margin-top: 2px;
  font-size: 12px;
  line-height: 20px;
  border-radius: 2px;

  &.is-blue {
    color: #2e5ef0;
    background: #ebf0ff;
  }

  &.is-green {
    color: #36b23e;
    background: #d5f7d7;
  }

  &.is-orange {
    color: #f98715;
    background: #feead5;
  }

  &.is-gray {
    color: #858a99;
    background: #f5f6f9;
  }
}

.service-provider-relation-card__body {
  display: flex;
  flex-direction: column;
  gap: 0;
  padding: 16px 8px 0 0;
  margin-top: 16px;
  border-top: 1px solid #e6e8ed;
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
