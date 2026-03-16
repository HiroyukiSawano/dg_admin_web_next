<template>
  <div class="el-page">
    <div class="droppable-element" draggable="true" unselectable="on" @drag="drag" @dragend="dragEnd"
        style="position: fixed; top: 200px; right: 0;z-index: 9999;">
        Droppable Element (Drag me!)
      </div>
    <div class="vgl-layout__box">
      <div class="vgl-layout__wrapper" ref="gridLayoutWrapperRef">
        <GridLayout
          v-model:layout="gridLayoutData"
          ref="gridLayoutRef"
          responsive
          :margin="[16, 16]"
          :col-num="24"
          :row-height="112"
          :breakpoints="{ lg: 1200, md: 996, sm: 768, xs: 576, xxs: 0 }"
          :cols="{ lg: 24, md: 18, sm: 12, xs: 6, xxs: 2 }"
        >
          <template #item="{ item }">
            <el-card>
              <template #header>
                <div class="el-card__title">{{ item.i }}</div>
                <div class="el-card__action">
                  <el-button type="text" link icon="ri-close-line" @click="removeItem(item.i)"></el-button>
                </div>
              </template>
            </el-card>
          </template>
        </GridLayout>
      </div>
    </div>

  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, ref } from 'vue'

import { throttle } from 'lodash-es'

import { GridLayout } from 'grid-layout-plus'

const gridLayoutData = ref([
  { x: 0, y: 0, w: 4, h: 1, i: '0', static: false },
  { x: 4, y: 0, w: 4, h: 2, i: '1', static: false },
  { x: 8, y: 0, w: 4, h: 2, i: '2', static: false },
  { x: 12, y: 0, w: 4, h: 3, i: '3', static: false },
  { x: 16, y: 0, w: 4, h: 2, i: '4', static: false },
  { x: 20, y: 0, w: 4, h: 3, i: '5', static: false },
  { x: 0, y: 10, w: 4, h: 4, i: '6', static: false },
  { x: 4, y: 10, w: 4, h: 2, i: '7', static: false },
  { x: 8, y: 10, w: 4, h: 3, i: '8', static: false },
  { x: 12, y: 6, w: 4, h: 2, i: '9', static: false },
  { x: 16, y: 8, w: 4, h: 3, i: '10', static: false },
  { x: 20, y: 8, w: 4, h: 2, i: '11', static: false },
  { x: 0, y: 20, w: 4, h: 3, i: '12', static: false },
  { x: 4, y: 20, w: 4, h: 3, i: '13', static: false },
  { x: 8, y: 16, w: 4, h: 3, i: '14', static: false },
  { x: 12, y: 16, w: 4, h: 2, i: '15', static: false },
])

const gridLayoutWrapperRef = ref(null)
const gridLayoutRef = ref(null)

const mouseAt = { x: -1, y: -1 }

const syncMousePosition = (event) => {
  mouseAt.x = event.clientX
  mouseAt.y = event.clientY
}

const dropId = 'drop'
const dragItem = { x: -1, y: -1, w: 4, h: 2, i: '' }

const drag = throttle(() => {
  const parentRect = gridLayoutWrapperRef.value?.getBoundingClientRect()

  if (!parentRect || !gridLayoutRef.value) return

  const mouseInGrid =
    mouseAt.x > parentRect.left &&
    mouseAt.x < parentRect.right &&
    mouseAt.y > parentRect.top &&
    mouseAt.y < parentRect.bottom

  if (mouseInGrid && !gridLayoutData.value.find(item => item.i === dropId)) {
    gridLayoutData.value.push({
      x: (gridLayoutData.value.length * 2) % 12,
      y: gridLayoutData.value.length + 12, // puts it at the bottom
      w: 2,
      h: 2,
      i: dropId,
    })
  }

  const index = gridLayoutData.value.findIndex(item => item.i === dropId)

  if (index !== -1) {
    const item = gridLayoutRef.value.getItem(dropId)

    if (!item) return

    try {
      item.wrapper.style.display = 'none'
    } catch (e) { }

    Object.assign(item.state, {
      top: mouseAt.y - parentRect.top,
      left: mouseAt.x - parentRect.left,
    })
    const newPos = item.calcXY(mouseAt.y - parentRect.top, mouseAt.x - parentRect.left)

    if (mouseInGrid) {
      gridLayoutRef.value.dragEvent('dragstart', dropId, newPos.x, newPos.y, dragItem.h, dragItem.w)
      dragItem.i = String(index)
      dragItem.x = gridLayoutData.value[index].x
      dragItem.y = gridLayoutData.value[index].y
    } else {
      gridLayoutRef.value.dragEvent('dragend', dropId, newPos.x, newPos.y, dragItem.h, dragItem.w)
      gridLayoutData.value = gridLayoutData.value.filter(item => item.i !== dropId)
    }
  }
})

const dragEnd = () => {
  const parentRect = gridLayoutWrapperRef.value?.getBoundingClientRect()

  if (!parentRect || !gridLayoutRef.value) return

  const mouseInGrid =
    mouseAt.x > parentRect.left &&
    mouseAt.x < parentRect.right &&
    mouseAt.y > parentRect.top &&
    mouseAt.y < parentRect.bottom

  if (mouseInGrid) {
    // alert(`Dropped element props:\n${JSON.stringify(dragItem, ['x', 'y', 'w', 'h'], 2)}`)
    gridLayoutRef.value.dragEvent('dragend', dropId, dragItem.x, dragItem.y, dragItem.h, dragItem.w)
    gridLayoutData.value = gridLayoutData.value.filter(item => item.i !== dropId)
  } else {
    return
  }

  gridLayoutData.value.push({
    x: dragItem.x,
    y: dragItem.y,
    w: dragItem.w,
    h: dragItem.h,
    i: dragItem.i,
  })
  gridLayoutRef.value.dragEvent('dragend', dragItem.i, dragItem.x, dragItem.y, dragItem.h, dragItem.w)

  const item = gridLayoutRef.value.getItem(dropId)

  if (!item) return

  try {
    item.wrapper.style.display = ''
  } catch (e) { }
}
const removeItem = (id) => {
  const index = gridLayoutData.value.findIndex(item => item.i === id)
  if (index > -1) {
    gridLayoutData.value.splice(index, 1)
  }
}

onMounted(() => {
  document.addEventListener('dragover', syncMousePosition)
})

onBeforeUnmount(() => {
  document.removeEventListener('dragover', syncMousePosition)
})

</script>


<style lang="scss" scoped>
:deep(.el-card) {
  height: 100%;
  margin: 0;
}
.vgl-layout__box {
  overflow: hidden;
}
.vgl-layout__wrapper {
  margin: -16px;
}
:deep(.vgl-layout) {
  --vgl-placeholder-bg: var(--el-color-primary);

  // &::before {
  //   position: absolute;
  //   width: calc(100% - 8px);
  //   height: calc(100% - 8px);
  //   margin: 8px;
  //   content: '';
  //   background-image: linear-gradient(to right, var(--el-border-color-light) 1px, transparent 1px), linear-gradient(to bottom, var(--el-border-color-light) 1px, transparent 1px);
  //   background-repeat: repeat;
  //   background-position: 0 0;
  //   background-size: calc(calc(100% - 8px) / 24) 64px;
  // }
  // &::after {
  //   content: "";
  //   position: absolute;
  //   top: 8px;
  //   bottom: 8px;
  //   right: 8px;
  //   left: 8px;
  //   border: 1px solid var(--el-border-color-light);
  //   z-index: 0;
  // }
  .vgl-item {
    z-index: 1;
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

.remove {
  position: absolute;
  top: 0;
  right: 2px;
  cursor: pointer;
}

.text {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  margin: auto;
  font-size: 24px;
  text-align: center;
}

.layout-json {
  padding: 10px;
  margin-top: 10px;
  background-color: #ddd;
  border: 1px solid black;
}

.columns {
  columns: 120px;
}

.droppable-element {
  width: 150px;
  padding: 10px;
  margin: 10px 0;
  text-align: center;
  background-color: #fdd;
  border: 1px solid black;
}
</style>
