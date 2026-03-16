<template>
  <el-dialog v-model="visible" :width="device === 'mobile' ? 324 : 720" :title="$t('ec.retrieval.dialog.title')" align-center destroy-on-close append-to-body draggable @close="handleDialogClose">
    <div class="el-dialog__main">
      <el-input
      ref="inputRef"
      v-model="input"
      clearable
      size="large"
      prefix-icon="ri-search-2-line"
      clear-icon="ri-close-circle-line"
      :placeholder="$t('ec.retrieval.dialog.form.input.placeholder')"
      :trigger-on-focus="false"
      @input="inputChange"
      />
      <div v-if="input === '' && histories.length > 0">
        搜索历史 ({{ histories.length }})
        <!-- <div class="el-tag-group">
          <el-tag v-for="(item, index) in histories" :key="item" closable @click="historyClick(item)"
            @close="historyClose(item)">{{ item }}</el-tag>
        </div> -->
        <div class="el-definition">
          <div class="el-definition-item" v-for="(item, index) in histories" :key="item" closable @click="historyClick(item)">
            <div class="el-definition-item__icon"><i class="ri-search-2-line"></i></div>
            <div class="el-definition-item__title">{{ item }}</div>
            <div class="el-definition-item__action" @click.stop="historyClose(item)"><i class="ri-close-line"></i></div>
          </div>
        </div>
      </div>
      <el-scrollbar v-else max-height="288px">
        <div class="el-list">
          <template v-for="item in results" :key="item.path">
            <div v-if="item.component" class="el-list-item" @click="menuTo(item)">
              <div class="el-list-item__icon">
                <i :class="item.meta?.icon || 'ri-function-line'"></i>
              </div>
              <div class="el-list-item__content">
                <div class="el-list-item__title">
                  {{ item.meta?.title || item.name }}
                </div>
                <div class="el-list-item__description">
                  {{ item.path }}
                </div>
              </div>
              <div class="el-list-item__action"> <b class="ri ri-arrow-right-line"></b></div>
              <!-- <a v-if="item.meta?.type == 'link'" :href="item.meta?.url" target="_blank" @click.stop="() => { }"></a> -->
              <!-- <label>{{ item.breadcrumb }}</label> -->

            </div>
          </template>
        </div>
      </el-scrollbar>
    </div>
    <template #footer>
      <el-space :size="16">
        <el-text type="info" size="small"><i class="ri-command-line"></i> Enter: 确认搜索</el-text>
        <el-text type="info" size="small"><i class="ri-command-line"></i> Esc: 关闭弹框</el-text>
        <el-text type="info" size="small"><i class="ri-arrow-up-line"></i><i class="ri-arrow-down-line"></i>: 选择项目</el-text>
      </el-space>
      <el-button @click="visible = false" style="margin-left: auto;">{{ $t('ec.global.button.text.cancel') }}</el-button>
      <el-button type="primary" @click="visible = false">{{ $t('ec.global.button.text.confirm') }}</el-button>
    </template>

  </el-dialog>
</template>
<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { usePermissionStore } from '@/stores/modules/permissionStore'
import { useSystemStore } from '@/stores/modules/systemStore'
import { useSearchStore } from '@/stores/modules/searchStore'
defineOptions({ name: 'LayoutSearch' })
const emits = defineEmits(['success'])
const { proxy } = getCurrentInstance()
const visible = defineModel({
  type: Boolean,
  default: false
})

const router = useRouter()
const input = ref('')
const menus = ref([])
const results = ref([])
const { histories } = storeToRefs(useSearchStore())
const { AddSearchHistories, DeleteSearchHistories } = useSearchStore()
const { device } = storeToRefs(useSystemStore())

const inputChange = (val) => {
  results.value = val ? menuQuery(val) : []
}
const menuQuery = (val) => {
  const text = val.toLowerCase()
  const matches = (item, text) => [item.meta?.title, item.name, item.path].some((t) => t.toLowerCase().includes(text))
  const routes = menus.value.filter((item) => matches(item, text))
  return routes.map((item) => {
    item.breadcrumb = item.meta?.breadcrumb.map((v) => proxy.$t(v.meta?.title)).join(' - ')
    return item
  })
}
const menuTo = (item) => {
  // AddSearchHistories(input.value)
  AddSearchHistories(item.meta?.title || item.name)
  router.push({ path: item.path })
  emits('success', true)
}
const historyClick = (text) => {
  input.value = text
  inputChange(text)
}
const historyClose = (item) => {
  DeleteSearchHistories(item)
}
const fattenMenus = (data, breadcrumb = []) => {
  return data.flatMap((item) => {
    const { children, meta, ...r } = item
    const _breadcrumb = [...breadcrumb, item]
    const _meta = { ...meta, breadcrumb: _breadcrumb, title: proxy.$t(meta.title) }
    const _item = { ...r, meta: _meta }
    const _children = children?.length > 0 ? fattenMenus(children, _breadcrumb) : []
    return [_item, ..._children]
  })
}
const handleDialogClose = () => {
}
onMounted(() => {
  const routesStore = usePermissionStore()
  menus.value = fattenMenus(routesStore.menus)
})
</script>

<style lang="scss" scoped>
.el-dialog {
  .el-dialog__main {
    padding: 16px 32px;
  }
}
.el-input {
  margin-bottom: 16px;
  --el-input-border-color: transparent;
  --el-input-hover-border-color: transparent;
  --el-input-bg-color: var(--el-fill-color-blank);
  --el-input-height: 48px;
  --el-input-icon-color: var(--el-color-primary);
  --el-input-border-radius: calc(var(--el-border-radius-base)*1.5);
  box-shadow: 0px 8px 32px var(--el-color-primary-light-7);
  border-radius: var( --el-input-border-radius);
  :deep() {
    // .el-input__wrapper {
    //   padding: 1px 16px;
    // }
    .el-input__icon {
      font-size: var(--el-font-size-medium);
    }
  }

}
.el-definition {
  margin-top: 16px;
  .el-definition-item {
    display: flex;
    align-items: center;
    padding: 8px 12px;
    border-radius: var(--el-border-radius-base);
    cursor: pointer;
    &:hover {
      background-color: var(--el-fill-color-light);
      color: var(--el-color-primary);
    }
    .el-definition-item__icon {
      margin-right: 8px;
    }
    .el-definition-item__title {
      flex: 1;
      min-width: 0;
    }
    .el-definition-item__action {
      color: var(--el-text-color-disabled);
    }
  }
}
.el-empty {
  margin-bottom: 32px;
}

.el-tag-group {
  display: flex;
  flex-wrap: wrap;
  margin: -4px;
  margin-bottom: 16px;

  .el-tag {
    margin: 4px;
    border-color: transparent;
    cursor: pointer;
  }
}

.el-list {
  .el-list-item {
    position: relative;
    display: flex;
    align-items: center;
    padding: 16px;
    border-radius: var(--el-border-radius-base);
    cursor: pointer;

    &:hover {
      background-color: var(--el-color-primary-light-9);
    }
    .el-list-item__icon {
      width: 40px;
      height: 40px;
      margin-right: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: var(--el-color-primary);
      color: var(--el-color-white);
      border-radius: var(--el-border-radius-base);
      font-size: var(--el-font-size-large);
    }
    .el-list-item__content {
      flex: 1;
      min-width: 0;
    }
    .el-list-item__description {
      font-size: var(--el-font-size-extra-small);
      color: var(--el-text-color-secondary);
    }
    .el-list-item__action {
      color: var(--el-text-color-disabled);
    }

    >a {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }

    >b {
      margin-left: auto;
      font-weight: normal;
      opacity: 0.5;
    }
  }
}
.el-text {
  --el-text-color: var(--el-text-color-disabled);
}
</style>
