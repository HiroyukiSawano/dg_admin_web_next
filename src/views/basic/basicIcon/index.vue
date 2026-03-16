<template>
  <el-card>
    <template #header>
      <el-form inline>
        <el-form-item>
          <el-select v-model="forms.category" placeholder="">
            <el-option v-for="(item, index) in data" :key="index" :label="$t(item.category)" :value="item.code" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-select v-model="iconSuffix" placeholder="">
            <el-option :label="$t('ec.basic.icon.type.label.line')" value="line" />
            <el-option :label="$t('ec.basic.icon.type.label.fill')" value="fill" />
          </el-select>
        </el-form-item>
        <el-form-item style="flex: 1">
          <el-input v-model="keyword" :prefix-icon="value" placeholder="" clearable />
        </el-form-item>
      </el-form>
    </template>

    <el-empty v-if="icons.length === 0" :image-size="108" />
    <el-row>
      <el-col v-for="(icon, index) in icons" :key="index" :xs="12" :sm="8" :md="6" :lg="4">
        <div class="el-well" @click="handleIconSelect(forms.category, icon)">
          <el-icon v-if="forms.category === 'Editor'" :class="`${iconPrefix}-${icon.name}`" :size="16" />
          <el-icon v-else :class="`${iconPrefix}-${icon.name}-${iconSuffix}`" :size="16" />
          <el-text type="info" size="small" truncated>{{ icon.name }}</el-text>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { kebabCase } from 'lodash-es'
import remixicon from './remixicon.json'
export default {
  props: {
    modelValue: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
  },
  data() {
    return {
      forms: {
        category: 'Arrows',
      },

      value: 'ri-search-2-line',
      data: [],
      keyword: '',
      dialogVisible: false,
      iconPrefix: 'ri',
      iconSuffix: 'fill',
    }
  },
  watch: {
    modelValue(val) {
      const that = this
      that.value = val
    },
    value(val) {
      const that = this
      that.$emit('update:modelValue', val)
    },
    keyword(val) {
      const that = this
      that.handleIconSearch(val)
    },
  },
  mounted() {
    const that = this
    // that.value = that.modelValue
    that.data = that.useConvertDataStructure(remixicon)
  },
  computed: {
    icons() {
      return this.data.find((i) => i.code === this.forms.category)?.icons || []
    },
  },
  methods: {
    useConvertDataStructure(data) {
      return Object.entries(data).map(([category, icons]) => {
        return {
          category: `ec.basic.icon.category.${kebabCase(category)}`,
          code: category,
          icons: Object.entries(icons).map(([name, remark]) => ({ name, remark })),
        }
      })
    },
    handleDialogClose() {
      const that = this
      that.keyword = ''
      that.dialogVisible = false
    },
    handleIconOpen() {
      const that = this
      if (that.disabled) {
        return false
      }
      that.dialogVisible = true
    },
    handleIconSelect(category, icon) {
      const that = this
      if (category === 'Editor') {
        that.value = `${that.iconPrefix}-${icon.name}`
      } else {
        that.value = `${that.iconPrefix}-${icon.name}-${that.iconSuffix}`
      }
      that.dialogVisible = false
    },
    handleIconSearch(text) {
      const that = this
      if (text) {
        const filterData = that.useConvertDataStructure(remixicon)
        filterData.forEach((t) => {
          t.icons = t.icons.filter((n) => n.name.includes(text) || n.remark.includes(text))
        })
        that.data = filterData
      } else {
        that.data = that.useConvertDataStructure(remixicon)
      }
    },
    handleIconClear() {
      const that = this
      that.value = ''
      that.dialogVisible = false
    },
  },
}
</script>

<style lang="scss" scoped>
:deep(.el-form) {
  flex: 1;
  .el-select {
    --el-select-width: 160px;
  }
  .el-input {
  }
}
.el-well {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 24px 0;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s;
  color: var(--el-text-color-regular);
  .el-icon {
    margin-bottom: 8px;
  }
  &:hover {
    color: var(--el-color-primary);
    // border-bottom-color: var(--el-color-primary);
    background-color: var(--el-color-primary-light-9);
    // border-color: var(--el-color-primary);
    .el-text.el-text--info {
      --el-text-color: var(--el-color-primary);
    }
  }
}
</style>
