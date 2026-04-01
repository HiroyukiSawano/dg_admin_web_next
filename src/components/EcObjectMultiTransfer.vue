<template>
  <div class="ec-object-multi-transfer">
    <div
      class="ec-object-multi-transfer__trigger"
      :class="{
        'is-disabled': disabled,
        'is-empty': selectedOptions.length === 0,
      }"
      @click="handleOpen"
    >
      <div v-if="selectedOptions.length > 0" class="ec-object-multi-transfer__summary">
        <span
          v-for="item in summaryOptions"
          :key="item[valueKey]"
          class="ec-object-multi-transfer__tag"
        >
          {{ item[labelKey] || '-' }}
        </span>
        <span v-if="selectedOptions.length > summaryLimit" class="ec-object-multi-transfer__summary-text">
          +{{ selectedOptions.length - summaryLimit }}
        </span>
      </div>
      <span v-else class="ec-object-multi-transfer__placeholder">{{ placeholder }}</span>

      <div class="ec-object-multi-transfer__suffix">
        <button
          v-if="clearable && selectedOptions.length > 0 && !disabled"
          type="button"
          class="ec-object-multi-transfer__clear"
          @click.stop="handleClear"
        >
          <i class="ri-close-circle-fill"></i>
        </button>
        <i class="ri-arrow-down-s-line"></i>
      </div>
    </div>

    <el-dialog
      v-model="dialogVisible"
      destroy-on-close
      append-to-body
      class="ec-object-multi-transfer__dialog"
      :title="title"
      :width="dialogWidth"
      @closed="resetDraftState"
    >
      <div class="ec-object-multi-transfer__body">
        <section class="ec-object-multi-transfer__panel">
          <el-input
            v-model="keyword"
            clearable
            class="ec-object-multi-transfer__search"
            :placeholder="searchPlaceholder || placeholder"
          >
            <template #prefix>
              <i class="ri-search-line"></i>
            </template>
          </el-input>

          <div v-loading="loading" class="ec-object-multi-transfer__list">
            <label
              v-for="item in filteredAvailableOptions"
              :key="item[valueKey]"
              class="ec-object-multi-transfer__item"
            >
              <el-checkbox v-model="leftCheckedValues" :label="item[valueKey]">
                <div class="ec-object-multi-transfer__item-labels">
                  <span class="ec-object-multi-transfer__item-label">{{ item[labelKey] || '-' }}</span>
                  <span v-if="resolveSubtitle(item)" class="ec-object-multi-transfer__item-subtitle">
                    {{ resolveSubtitle(item) }}
                  </span>
                </div>
              </el-checkbox>
            </label>

            <el-empty
              v-if="!loading && filteredAvailableOptions.length === 0"
              :image-size="56"
              :description="emptyText"
            />
          </div>
        </section>

        <div class="ec-object-multi-transfer__actions">
          <el-button circle :disabled="leftCheckedValues.length === 0" @click="handleMoveRight">
            <i class="ri-arrow-right-s-line"></i>
          </el-button>
          <el-button circle :disabled="rightCheckedValues.length === 0" @click="handleMoveLeft">
            <i class="ri-arrow-left-s-line"></i>
          </el-button>
        </div>

        <section class="ec-object-multi-transfer__panel">
          <div class="ec-object-multi-transfer__selected-header">
            <span>{{ selectedTitle }}</span>
            <button
              type="button"
              class="ec-object-multi-transfer__trash"
              :disabled="draftSelectedValues.length === 0"
              @click="handleClearDraft"
            >
              <i class="ri-delete-bin-line"></i>
            </button>
          </div>

          <div class="ec-object-multi-transfer__list">
            <div
              v-for="item in draftSelectedOptions"
              :key="item[valueKey]"
              class="ec-object-multi-transfer__item is-selected"
            >
              <el-checkbox v-model="rightCheckedValues" :label="item[valueKey]">
                <div class="ec-object-multi-transfer__item-labels">
                  <span class="ec-object-multi-transfer__item-label">{{ item[labelKey] || '-' }}</span>
                  <span v-if="resolveSubtitle(item)" class="ec-object-multi-transfer__item-subtitle">
                    {{ resolveSubtitle(item) }}
                  </span>
                </div>
              </el-checkbox>
              <button
                type="button"
                class="ec-object-multi-transfer__item-remove"
                @click="handleRemoveSingle(item[valueKey])"
              >
                <i class="ri-close-line"></i>
              </button>
            </div>

            <el-empty
              v-if="draftSelectedOptions.length === 0"
              :image-size="56"
              :description="emptyText"
            />
          </div>
        </section>
      </div>

      <template #footer>
        <div class="ec-object-multi-transfer__footer">
          <el-button @click="dialogVisible = false">{{ t('ec.global.button.text.cancel') }}</el-button>
          <el-button type="primary" @click="handleConfirm">{{ t('ec.global.button.text.confirm') }}</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

defineOptions({ name: 'EcObjectMultiTransfer' })

const props = defineProps({
  modelValue: {
    type: Array,
    default: () => [],
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
  selectedTitle: {
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
  summaryLimit: {
    type: Number,
    default: 2,
  },
  emptyText: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:modelValue', 'change'])

const { t } = useI18n()

const dialogVisible = ref(false)
const keyword = ref('')
const draftSelectedValues = ref([])
const leftCheckedValues = ref([])
const rightCheckedValues = ref([])

const normalizedOptions = computed(() => (Array.isArray(props.options) ? props.options : []))
const optionMap = computed(() => {
  return new Map(normalizedOptions.value.map((item) => [item?.[props.valueKey], item]))
})
const emptyText = computed(() => props.emptyText || t('ec.organization.common.empty'))
const selectedTitle = computed(() => props.selectedTitle || t('ec.organization.selector.selected'))
const selectedOptions = computed(() => {
  return normalizeIds(props.modelValue)
    .map((value) => optionMap.value.get(value))
    .filter(Boolean)
})
const summaryOptions = computed(() => selectedOptions.value.slice(0, props.summaryLimit))
const availableOptions = computed(() => {
  const selectedSet = new Set(draftSelectedValues.value)
  return normalizedOptions.value.filter((item) => !selectedSet.has(item?.[props.valueKey]))
})
const filteredAvailableOptions = computed(() => {
  const search = keyword.value.trim().toLowerCase()
  if (!search) return availableOptions.value

  return availableOptions.value.filter((item) => {
    const parts = [
      item?.[props.labelKey],
      props.subtitleKey ? item?.[props.subtitleKey] : '',
    ]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase())

    return parts.some((value) => value.includes(search))
  })
})
const draftSelectedOptions = computed(() => {
  return draftSelectedValues.value
    .map((value) => optionMap.value.get(value))
    .filter(Boolean)
})
const dialogWidth = computed(() => {
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return '94vw'
  }

  return '760px'
})

const normalizeIds = (value) => {
  return Array.isArray(value) ? [...value] : []
}

const resolveSubtitle = (item) => {
  return props.subtitleKey ? item?.[props.subtitleKey] || '' : ''
}

const syncDraftFromModel = () => {
  draftSelectedValues.value = normalizeIds(props.modelValue)
  leftCheckedValues.value = []
  rightCheckedValues.value = []
  keyword.value = ''
}

const handleOpen = () => {
  if (props.disabled) return
  syncDraftFromModel()
  dialogVisible.value = true
}

const handleMoveRight = () => {
  if (leftCheckedValues.value.length === 0) return

  const appendValues = filteredAvailableOptions.value
    .map((item) => item?.[props.valueKey])
    .filter((value) => leftCheckedValues.value.includes(value))

  draftSelectedValues.value = [...draftSelectedValues.value, ...appendValues]
  leftCheckedValues.value = []
}

const handleMoveLeft = () => {
  if (rightCheckedValues.value.length === 0) return

  const removeSet = new Set(rightCheckedValues.value)
  draftSelectedValues.value = draftSelectedValues.value.filter((value) => !removeSet.has(value))
  rightCheckedValues.value = []
}

const handleRemoveSingle = (value) => {
  draftSelectedValues.value = draftSelectedValues.value.filter((item) => item !== value)
  rightCheckedValues.value = rightCheckedValues.value.filter((item) => item !== value)
}

const handleClearDraft = () => {
  draftSelectedValues.value = []
  rightCheckedValues.value = []
}

const handleConfirm = () => {
  const nextValue = [...draftSelectedValues.value]
  emit('update:modelValue', nextValue)
  emit('change', nextValue)
  dialogVisible.value = false
}

const handleClear = () => {
  emit('update:modelValue', [])
  emit('change', [])
}

const resetDraftState = () => {
  syncDraftFromModel()
}

watch(
  () => props.modelValue,
  () => {
    if (!dialogVisible.value) {
      syncDraftFromModel()
    }
  },
  { deep: true, immediate: true },
)
</script>

<style lang="scss" scoped>
.ec-object-multi-transfer {
  width: 100%;
}

.ec-object-multi-transfer__trigger {
  display: flex;
  align-items: center;
  width: 100%;
  min-height: 40px;
  padding: 6px 12px;
  overflow: hidden;
  cursor: pointer;
  background: #fff;
  border: 1px solid var(--el-border-color);
  border-radius: var(--el-border-radius-base);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}

.ec-object-multi-transfer__trigger:hover {
  border-color: var(--el-color-primary);
}

.ec-object-multi-transfer__trigger.is-disabled {
  cursor: not-allowed;
  background: var(--el-disabled-bg-color);
}

.ec-object-multi-transfer__trigger.is-empty {
  padding-top: 0;
  padding-bottom: 0;
}

.ec-object-multi-transfer__summary {
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: 6px;
  min-width: 0;
}

.ec-object-multi-transfer__tag,
.ec-object-multi-transfer__summary-text {
  display: inline-flex;
  align-items: center;
  max-width: 100%;
  padding: 4px 8px;
  overflow: hidden;
  color: #4a5365;
  white-space: nowrap;
  text-overflow: ellipsis;
  background: #f3f5fb;
  border-radius: 8px;
}

.ec-object-multi-transfer__placeholder {
  flex: 1;
  overflow: hidden;
  color: var(--el-text-color-placeholder);
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ec-object-multi-transfer__suffix {
  display: inline-flex;
  flex-shrink: 0;
  gap: 6px;
  align-items: center;
  margin-left: 12px;
  color: var(--el-text-color-placeholder);
}

.ec-object-multi-transfer__clear,
.ec-object-multi-transfer__trash {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: inherit;
  cursor: pointer;
  background: transparent;
  border: none;
}

.ec-object-multi-transfer__body {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  gap: 16px;
  align-items: center;
}

.ec-object-multi-transfer__panel {
  min-width: 0;
}

.ec-object-multi-transfer__search {
  margin-bottom: 12px;
}

.ec-object-multi-transfer__list {
  min-height: 320px;
  max-height: 320px;
  padding: 8px;
  overflow-y: auto;
  background: #fff;
  border: 1px solid #e7eaf3;
  border-radius: 12px;
}

.ec-object-multi-transfer__item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 10px;
  border-radius: 10px;
  transition: background-color 0.2s ease;
}

.ec-object-multi-transfer__item:hover,
.ec-object-multi-transfer__item.is-selected {
  background: #f6f8fc;
}

.ec-object-multi-transfer__item :deep(.el-checkbox) {
  flex: 1;
  width: 100%;
}

.ec-object-multi-transfer__item :deep(.el-checkbox__label) {
  display: block;
  width: calc(100% - 20px);
  padding-left: 10px;
}

.ec-object-multi-transfer__item-labels {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.ec-object-multi-transfer__item-label,
.ec-object-multi-transfer__item-subtitle {
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.ec-object-multi-transfer__item-subtitle {
  margin-top: 2px;
  color: #8c93a6;
  font-size: 12px;
}

.ec-object-multi-transfer__item-remove {
  display: inline-flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  margin-left: 8px;
  color: #8c93a6;
  cursor: pointer;
  background: transparent;
  border: none;
  border-radius: 50%;
}

.ec-object-multi-transfer__item-remove:hover {
  color: var(--el-color-primary);
  background: color-mix(in srgb, var(--el-color-primary) 10%, #fff);
}

.ec-object-multi-transfer__actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ec-object-multi-transfer__selected-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
  color: #151b26;
  font-weight: 600;
}

.ec-object-multi-transfer__footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

@media only screen and (max-width: 767px) {
  .ec-object-multi-transfer__body {
    grid-template-columns: 1fr;
  }

  .ec-object-multi-transfer__actions {
    flex-direction: row;
    justify-content: center;
  }

  .ec-object-multi-transfer__list {
    min-height: 240px;
    max-height: 240px;
  }
}
</style>
