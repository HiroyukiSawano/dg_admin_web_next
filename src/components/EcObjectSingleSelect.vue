<template>
  <div class="ec-object-single-select-wrapper">
    <el-popover
      v-model:visible="popoverVisible"
      trigger="click"
      placement="bottom-start"
      :width="currentPanelWidth"
      :disabled="disabled"
      :popper-style="popoverStyle"
    >
      <template #reference>
        <div
          class="ec-object-single-select"
          :class="{
            'is-disabled': disabled,
            'is-active': popoverVisible,
            'is-empty': !selectedLabel,
          }"
        >
          <div class="ec-object-single-select__content">
            <span class="ec-object-single-select__text">
              {{ selectedLabel || placeholder }}
            </span>
          </div>
          <div class="ec-object-single-select__suffix">
            <button
              v-if="clearable && hasValue && !disabled"
              type="button"
              class="ec-object-single-select__clear"
              @click.stop="handleClear"
            >
              <i class="ri-close-circle-fill"></i>
            </button>
            <i class="ri-arrow-down-s-line ec-object-single-select__arrow"></i>
          </div>
        </div>
      </template>

      <div class="ec-object-single-select__panel">
        <div v-if="title" class="ec-object-single-select__title">{{ title }}</div>
        <el-input
          v-model="keyword"
          clearable
          class="ec-object-single-select__search"
          :placeholder="searchPlaceholder || placeholder"
        >
          <template #prefix>
            <i class="ri-search-line"></i>
          </template>
        </el-input>

        <div v-loading="loading" class="ec-object-single-select__options">
          <button
            v-for="item in filteredOptions"
            :key="item[valueKey]"
            type="button"
            class="ec-object-single-select__option"
            :class="{ 'is-selected': isSelected(item) }"
            @click="handleSelect(item)"
          >
            <div class="ec-object-single-select__option-main">
              <div v-if="resolveAvatar(item)" class="ec-object-single-select__avatar">
                <img :src="resolveAvatar(item)" alt="option avatar" />
              </div>
              <div v-else class="ec-object-single-select__icon">
                <i :class="resolveIcon(item)"></i>
              </div>
              <div class="ec-object-single-select__labels">
                <div class="ec-object-single-select__label">{{ item[labelKey] || '-' }}</div>
                <div v-if="resolveSubtitle(item)" class="ec-object-single-select__subtitle">
                  {{ resolveSubtitle(item) }}
                </div>
              </div>
            </div>
            <i v-if="isSelected(item)" class="ri-check-line ec-object-single-select__check"></i>
          </button>

          <el-empty
            v-if="!loading && filteredOptions.length === 0"
            :image-size="56"
            :description="emptyText"
          />
        </div>
      </div>
    </el-popover>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'EcObjectSingleSelect' })

const props = defineProps({
  modelValue: {
    type: [String, Number, Boolean, Object],
    default: null,
  },
  options: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  placeholder: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  labelKey: {
    type: String,
    default: 'label',
  },
  valueKey: {
    type: String,
    default: 'value',
  },
  subtitleKey: {
    type: String,
    default: '',
  },
  avatarKey: {
    type: String,
    default: '',
  },
  iconKey: {
    type: String,
    default: '',
  },
  searchPlaceholder: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  clearable: {
    type: Boolean,
    default: true,
  },
  panelWidth: {
    type: Number,
    default: 360,
  },
  emptyText: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const { t } = useI18n()

const popoverVisible = ref(false)
const keyword = ref('')

const emptyText = computed(() => props.emptyText || t('ec.organization.common.empty'))
const normalizedOptions = computed(() => (Array.isArray(props.options) ? props.options : []))
const selectedOption = computed(() => {
  return normalizedOptions.value.find((item) => item?.[props.valueKey] === props.modelValue) || null
})
const selectedLabel = computed(() => selectedOption.value?.[props.labelKey] || '')
const hasValue = computed(() => props.modelValue !== null && props.modelValue !== undefined && props.modelValue !== '')

const filteredOptions = computed(() => {
  const search = keyword.value.trim().toLowerCase()
  if (!search) return normalizedOptions.value

  return normalizedOptions.value.filter((item) => {
    const parts = [
      item?.[props.labelKey],
      props.subtitleKey ? item?.[props.subtitleKey] : '',
    ]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase())

    return parts.some((value) => value.includes(search))
  })
})

const currentPanelWidth = computed(() => {
  if (typeof window !== 'undefined') {
    return Math.min(props.panelWidth, Math.max(window.innerWidth - 32, 260))
  }

  return props.panelWidth
})

const popoverStyle = computed(() => ({
  padding: '0',
}))

const resolveSubtitle = (item) => {
  return props.subtitleKey ? item?.[props.subtitleKey] || '' : ''
}

const resolveAvatar = (item) => {
  return props.avatarKey ? item?.[props.avatarKey] || '' : ''
}

const resolveIcon = (item) => {
  return props.iconKey ? item?.[props.iconKey] || 'ri-user-line' : 'ri-user-line'
}

const isSelected = (item) => {
  return item?.[props.valueKey] === props.modelValue
}

const handleSelect = (item) => {
  const value = item?.[props.valueKey]
  emit('update:modelValue', value)
  emit('change', value)
  popoverVisible.value = false
}

const handleClear = () => {
  emit('update:modelValue', null)
  emit('change', null)
  popoverVisible.value = false
}

watch(popoverVisible, (value) => {
  if (!value) {
    keyword.value = ''
  }
})
</script>

<style lang="scss" scoped>
.ec-object-single-select-wrapper {
  width: 100%;
}

.ec-object-single-select {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 40px;
  padding: 0 12px;
  overflow: hidden;
  cursor: pointer;
  background: #fff;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.ec-object-single-select:hover,
.ec-object-single-select.is-active {
  border-color: var(--el-color-primary);
}

.ec-object-single-select.is-disabled {
  cursor: not-allowed;
  background: var(--el-disabled-bg-color);
}

.ec-object-single-select__content {
  flex: 1;
  min-width: 0;
}

.ec-object-single-select__text {
  display: block;
  overflow: hidden;
  color: var(--el-text-color-primary);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ec-object-single-select.is-empty .ec-object-single-select__text {
  color: var(--el-text-color-placeholder);
}

.ec-object-single-select__suffix {
  display: inline-flex;
  flex-shrink: 0;
  gap: 6px;
  align-items: center;
  margin-left: 12px;
  color: var(--el-text-color-placeholder);
}

.ec-object-single-select__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: inherit;
  cursor: pointer;
  background: transparent;
  border: none;
}

.ec-object-single-select__arrow {
  font-size: 18px;
}

.ec-object-single-select__panel {
  padding: 16px;
}

.ec-object-single-select__title {
  margin-bottom: 12px;
  color: #151b26;
  font-size: 18px;
  font-weight: 700;
}

.ec-object-single-select__search {
  margin-bottom: 12px;
}

.ec-object-single-select__options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-height: 120px;
  max-height: 260px;
  overflow-y: auto;
}

.ec-object-single-select__option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  padding: 10px 12px;
  cursor: pointer;
  background: #fff;
  border: none;
  border-radius: 10px;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.ec-object-single-select__option:hover,
.ec-object-single-select__option.is-selected {
  background: color-mix(in srgb, var(--el-color-primary) 10%, #fff);
}

.ec-object-single-select__option-main {
  display: flex;
  flex: 1;
  gap: 10px;
  align-items: center;
  min-width: 0;
}

.ec-object-single-select__avatar,
.ec-object-single-select__icon {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  overflow: hidden;
  color: var(--el-color-primary);
  background: color-mix(in srgb, var(--el-color-primary) 12%, #fff);
  border-radius: 50%;
}

.ec-object-single-select__avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.ec-object-single-select__labels {
  flex: 1;
  min-width: 0;
  text-align: left;
}

.ec-object-single-select__label,
.ec-object-single-select__subtitle {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ec-object-single-select__label {
  color: #2a3140;
}

.ec-object-single-select__subtitle {
  margin-top: 2px;
  color: #8c93a6;
  font-size: 12px;
}

.ec-object-single-select__check {
  flex-shrink: 0;
  color: var(--el-color-primary);
  font-size: 18px;
}

@media only screen and (max-width: 767px) {
  .ec-object-single-select__panel {
    padding: 14px;
  }

  .ec-object-single-select__title {
    font-size: 16px;
  }
}
</style>
