<template>
  <div class="el-page">
    <div class="el-float-button-group">
      <el-button type="primary" circle size="large" icon="ri-add-fill" @click="gridWidgetDrawerVisible = true; gridLayoutCustomized = true" />
      <el-button v-if="gridLayoutCustomized" type="primary" circle size="large" icon="ri-check-fill" @click="gridLayoutCustomized = false" />
      <el-button v-else type="primary" circle size="large" icon="ri-magic-fill" @click="gridLayoutCustomized = true" />
    </div>
    <div class="vgl-layout__box">
      <div class="vgl-layout__wrapper" ref="gridLayoutWrapperRef">
        <GridLayout
          ref="gridLayoutRef"
          v-model:layout="gridLayoutData"
          responsive
          :margin="[16, 16]"
          :col-num="24"
          :row-height="112"
          :is-draggable="gridLayoutCustomized"
          :is-resizable="gridLayoutCustomized"
          :breakpoints="{ lg: 1200, md: 996, sm: 768, xs: 576, xxs: 0 }"
          :cols="{ lg: 24, md: 18, sm: 12, xs: 6, xxs: 2 }"
        >
          <template #item="{ item }">
            <component :is="gridComps[item.key]" :record="item" :key="item.i" />
            <div v-if="gridLayoutCustomized" class="vgl-item__action">
              <el-button size="small" type="primary" circle icon="ri-equalizer-3-fill" @click="widgetEdit(item)" />
              <el-button size="small" type="danger" circle icon="ri-close-line" @click="widgetRemove(item)" />
            </div>
          </template>
        </GridLayout>
      </div>
    </div>
    <el-drawer v-model="gridWidgetDrawerVisible" :title="$translate('ec.dashboard.custom.drawer.title', { 'en': { 'ec.dashboard.custom.drawer.title': 'Component Library' }, 'zh-CN': { 'ec.dashboard.custom.drawer.title': '部件库' } })" :size="352" :modal="false" :lock-scroll="false" modal-penetrable append-to-body destroy-on-close>
      <el-input v-model="keyword" :placeholder="$t('ec.global.form.search.placeholder')" prefix-icon="ri-search-2-line" />
      <div class="el-cell-group">
        <div class="el-cell" v-for="item, index in gridWidgetData" :key="index" @drag="widgetDrag(item)" @dragend="widgetDragEnd(item)" draggable="true" unselectable="on">
          <div class="el-cell__icon">
            <i :class="item.icon"></i>
          </div>

          <div class="el-cell__title">{{ item.title }}</div>
          <div class="el-cell__action">
            <el-button link icon="ri-add-line" @click="widgetAdd(item)" />
          </div>
        </div>
      </div>
      <template #footer>
        <el-button @click="gridWidgetDrawerVisible = false">{{ $t('ec.global.button.text.cancel') }}</el-button>
        <el-button type="primary" @click="gridWidgetDrawerVisible = false">{{ $t('ec.global.button.text.confirm') }}</el-button>
      </template>
    </el-drawer>
    <el-dialog title="设置" v-model="dialogVisible" :width="640" append-to-body destroy-on-close :close-on-click-modal="false" @closed="handleDialogClosed">
      <el-form :model="record" label-width="auto">
        <el-form-item label="图标">
          <el-input v-model="record.icon" />
        </el-form-item>
        <el-form-item label="部件名称">
          <el-input v-model="record.title" />
        </el-form-item>
        <el-form-item label="固定">
          <el-switch v-model="record.static" />
        </el-form-item>
        <!-- <el-form-item label="可见范围">
        </el-form-item> -->
        <el-form-item label="数据">
          <codemirror v-model="record.options.data" placeholder="Code goes here..."
            :style="{ height: '240px', width: '100%' }" :autofocus="true" :indent-with-tab="true" :tab-size="2"
            :extensions="[basicSetup, javascript(), highlightActiveLine(), EditorView.lineWrapping]" />
        </el-form-item>
      </el-form>

      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleDialogSubmit">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { storeToRefs } from 'pinia'
import { throttle, set, cloneDeep } from 'lodash-es'
import { GridLayout } from 'grid-layout-plus'
import { basicSetup } from "codemirror"
import { Codemirror } from 'vue-codemirror'
import { javascript } from '@codemirror/lang-javascript'
import { EditorView, highlightActiveLine } from '@codemirror/view'
import JSBeautify from 'js-beautify'
import gridComps from './components'
import { useSystemStore } from '@/stores/modules/systemStore'
import { demoA } from './demo'
defineOptions({
  name: 'dashboardCustom'
})
const demos = demoA
const keyword = ref('')

const gridWidgetData = computed(() => {
  return Object.values(gridComps)
    .filter(item => item?.config)
    .map(item => {
      const { grid, ...m } = item.config
      return { ...m, ...grid }
    })
})

const gridWidgetDrawerVisible = ref(false)

const gridLayoutCustomized = ref(false)
const gridLayoutData = ref([])
const gridLayoutWrapperRef = ref(null)
const gridLayoutRef = ref(null)
const { language } = storeToRefs(useSystemStore())
watch(language, async () => {
  gridLayoutData.value = demos.map(item => ({ ...item, ...item.grid }))
}, { immediate: true })
onMounted(() => {
  document.addEventListener('dragover', gridMousePositionSync)
})

onBeforeUnmount(() => {
  document.removeEventListener('dragover', gridMousePositionSync)
})
const record = ref({})

const mouseAt = { x: -1, y: -1 }

const gridMousePositionSync = (event) => {
  mouseAt.x = event.clientX
  mouseAt.y = event.clientY
}

// 计算网格坐标工具函数
const gridPositionCalc = (x, y, parentRect) => {
  const initialX = Math.floor((x - parentRect.left) / (parentRect.width / 24))
  const initialY = Math.floor((y - parentRect.top) / 112)
  return {
    x: Math.max(0, Math.min(24 - 2, initialX)), // 2 是默认宽度
    y: Math.max(0, initialY)
  }
}

// 判断鼠标是否在网格内
const gridMouseIn = (mouse, rect) => mouse.x > rect.left && mouse.x < rect.right && mouse.y > rect.top && mouse.y < rect.bottom

const widgetDrag = throttle((row) => {
  record.value = { ...row }
  if(!row) return
  const parentRect = gridLayoutWrapperRef.value?.getBoundingClientRect()
  if (!parentRect || !gridLayoutRef.value) return

  const mouseInGrid = gridMouseIn(mouseAt, parentRect)

  // 如果网格中不存在 drop 占位，则添加

  const index = gridLayoutData.value.findIndex(item => item.i === record.value.i)
  if (index === -1) {
    if (mouseInGrid) {
      const _grid = gridPositionCalc(mouseAt.x, mouseAt.y, parentRect)
      const ghost = {
        x: _grid.x,
        y: _grid.y,
        w: record.value.w || 2,
        h: record.value.h || 2,
        i: record.value.i
      }
      gridLayoutData.value.push(ghost)
    }
    return
  }

  const _item = gridLayoutRef.value.getItem(record.value.i)
  if (!_item) return
  // 隐藏占位元素
  _item.wrapper.style.display = 'none'

  // 更新占位元素位置
  Object.assign(_item.state, { top: mouseAt.y - parentRect.top, left: mouseAt.x - parentRect.left })

  const _position = _item.calcXY(mouseAt.y - parentRect.top, mouseAt.x - parentRect.left)

  if (mouseInGrid) {
    gridLayoutRef.value.dragEvent('dragstart', record.value.i, _position.x, _position.y, record.value.h, record.value.w)
    record.value.x =  _position.x
    record.value.y =  _position.y
  } else {
    gridLayoutRef.value.dragEvent('dragend', record.value.i, _position.x, _position.y, record.value.h, record.value.w)
    gridLayoutData.value = gridLayoutData.value.filter(item => item.i !== record.value.i)
  }
})

const widgetDragEnd = () => {
  const parentRect = gridLayoutWrapperRef.value?.getBoundingClientRect()
  if (!parentRect || !gridLayoutRef.value) return

  const mouseInGrid = gridMouseIn(mouseAt, parentRect)

  if (!mouseInGrid) return record.value = {}

  const { i, x, y, h, w } = record.value;
  if (!i) return

  gridLayoutRef.value.dragEvent('dragend', i, x, y, h, w)

  // 2. 移除旧 item
  gridLayoutData.value = gridLayoutData.value.filter(item => item.i !== i)


  const _i = uuidv4()

  record.value.i = _i
  gridLayoutData.value.push(record.value)

  gridLayoutRef.value.dragEvent('dragend', _i, x, y, h, w)

  // 5. 恢复占位元素显示
  const item = gridLayoutRef.value.getItem(_i)
  if (item?.wrapper) item.wrapper.style.display = ''

  // 6. 清空记录
  record.value = {}
}
const widgetAdd = (item) => {
  const _item = { ...item, x: 0, y: 0, i: uuidv4() }

  gridLayoutData.value.unshift(_item)
}
const widgetRemove = (row) => {
  const index = gridLayoutData.value.findIndex(item => item.i === row.i)
  if (index === -1) return
  gridLayoutData.value.splice(index, 1)
}
const dialogVisible = ref(false)

const widgetEdit = async (row) => {
  const _row = cloneDeep(row)
  record.value = _row
  set(record.value, 'options.data', JSBeautify.js(JSON.stringify(_row.options.data), { indent_size: 2 }))
  dialogVisible.value = true
}
const handleDialogSubmit = () => {
  // 找到要替换的对象的索引
  const index = gridLayoutData.value.findIndex((item) => item.i === record.value.i)
  if (index === -1) return

  // 创建新的对象，包括解析options.data
  const _row = cloneDeep(record.value)
  _row.options.data = JSON.parse(_row.options.data)

  gridLayoutData.value[index] = _row
  dialogVisible.value = false
}
const handleDialogClosed = () => {
  record.value = {}
}
</script>


<style lang="scss" scoped>
.el-float-button-group {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  position: fixed;
  right: 16px;
  bottom: 16px;
  z-index: 999;
  .el-button+.el-button {
    margin: 12px 0 0 0;
  }
  .el-button {
    box-shadow: var(--el-box-shadow-lighter);
  }
}

:deep(.el-card__wrapper) {
  height: 100%;
  width: 100%;
  // overflow: hidden;
}

:deep(.el-card) {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  margin: 0;
  overflow: hidden;
  // border: 1px solid #fff;
  .el-card__header+.el-card__body {
    padding-top: 0;
  }

  .el-card__header {
    border: 0;
  }

  .el-card__action {
    display: flex;
    align-items: center;
    .el-link {
      .ri-arrow-right-s-line {
        margin-right: -6px;
        font-size: var(--el-font-size-medium);
      }
    }
  }
  .el-card__title {
    display: flex;
    align-items: center;
    > i {
      margin-right: 8px;
      height: 22px;
      width: 22px;
      flex-shrink: 0;
      font-size: var(--el-font-size-base);
      background: linear-gradient(180deg, var(--el-color-primary-light-3) 0%, var(--el-color-primary) 100%);
      box-shadow: 0px 4px 4px color-mix(in srgb, var(--el-color-primary) 15%, transparent);
      color: var(--el-color-white);
      border-radius: var(--el-border-radius-base);
    }
  }

  .el-card__body {
    flex: 1;
    height: 100%;
    min-height: 0;
    // overflow-y: auto;
  }
}
.vgl-layout__box {
  overflow: hidden;
}
.vgl-layout__wrapper {
  margin: -16px;
}
:deep(.vgl-layout) {
  --vgl-placeholder-bg: var(--el-color-primary);
  overflow: hidden;
  min-height: calc(100vh - 80px);
  .vgl-item {
    z-index: 1;
    &.vgl-item--placeholder {
      border-radius: var(--el-border-radius-base);
    }
    .vgl-item__action {
      display: flex;
      justify-content: flex-end;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
      padding: 16px;
      background-color: color-mix(in srgb, var(--el-fill-color-blank) 90%, transparent);
      z-index: 3;
      border-radius: var(--el-border-radius-base);
      overflow: hidden;
      .el-button {
        // --el-button-size: 16px;
        // padding: 0;
        margin-left: 8px;
      }
    }
    .vgl-item__resizer {
      z-index: 3;
    }
  }

  .vgl-item:not(.vgl-item--placeholder) {
    // background-color: #fff;
    // box-shadow: var(--el-box-shadow-lighter);
    // border: 1px solid black;
  }

  .vgl-item--resizing {
    opacity: 90%;
  }

  .vgl-item--static {
    background-color: #cce;
  }

}

.el-cell-group {
  margin-top: 16px;
  .el-cell {
    display: flex;
    align-items: center;
    padding: 12px 8px;
    border-radius: var(--el-border-radius-base);
    cursor: pointer;
    &:hover {
      background-color: var(--el-color-primary-light-9);
    }
    .el-cell__icon {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      height: 24px;
      width: 24px;
      margin-right: 8px;
      background-color: var(--el-color-primary-light-8);
      color: var(--el-color-primary);
      border-radius: var(--el-border-radius-base);
    }
    .el-cell__title {
      flex: 1;
      min-width: 0;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .el-cell__action{
      display: flex;
      .el-button {
        padding: 0;
      }
    }
  }
}


:deep(.v-codemirror) {
  .cm-gutters {
    background-color: transparent;
    border: 0;
  }
  .cm-activeLine,
  .cm-activeLineGutter {
    background-color: color-mix(in srgb, var(--el-color-primary) 10%, transparent);
  }
  .cm-editor {
    background-color: var(--el-fill-color);
    border: 1px solid var(--el-border-color);
    &:hover {
      border-color: var(--el-border-color-darker);
    }

    &.cm-focused {
      outline: 0 !important;
      border-color: var(--el-color-primary);
    }
  }
}
</style>
