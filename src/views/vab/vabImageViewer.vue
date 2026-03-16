<template>
  <div class="el-page">
    <el-card header="图片预览器">
      <el-image-viewer
        :url-list="srcList"
        :close-on-press-escape="false"
      >
        <template
          #toolbar="{ actions, prev, next, reset, activeIndex, setActiveItem }"
        >
          <!-- <el-icon class="ri-arrow-left-line" @click="prev" />
          <el-icon class="ri-arrow-right-line" @click="next" />
          <el-icon class="ri-contract-right-line" @click="setActiveItem(srcList.length - 1)" /> -->
          <el-icon class="ri-zoom-out-line" @click="actions('zoomOut')" />
          <el-icon class="ri-zoom-in-line" @click="actions('zoomIn')" />
          <el-divider direction="vertical" />
          <el-icon class="ri-corner-up-left-double-line" @click="actions('anticlockwise')" />
          <el-icon class="ri-corner-up-right-double-line" @click="actions('clockwise')" />
          <el-divider direction="vertical" />
          <!-- <el-icon class="ri-loop-right-line" @click="reset" /> -->
          <el-icon class="ri-arrow-down-line" @click="download(activeIndex)" />
        </template>
      </el-image-viewer>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const srcList = [
  'https://img2.doubanio.com/view/subject/s/public/s1134341.jpg',
  'https://img2.doubanio.com/view/subject/s/public/s1914861.jpg',
  'https://img9.doubanio.com/view/subject/s/public/s4504345.jpg',
  'https://img2.doubanio.com/view/subject/s/public/s28061231.jpg',
  'https://img9.doubanio.com/view/subject/s/public/s1020454.jpg',
  'https://img1.doubanio.com/view/subject/s/public/s28283769.jpg',
  'https://img3.doubanio.com/view/subject/s/public/s23579217.jpg',
]
defineOptions({
  name: 'vabImageViewer',
})

</script>

<style lang="scss" scoped>
.el-page {
  height: calc(100% - 32px);
}
.el-card {
  height: 100%;
}
:deep(.el-image-viewer__wrapper) {
  position: relative;
  height: 100%;
  .el-image-viewer__actions__inner {
    font-size: var(--el-font-size-large);
    .el-divider {
      height: 0.65em;
    }
  }
  .el-image-viewer__canvas {
    overflow: hidden;
  }
  .el-image-viewer__close {
    display: none;
  }
  .el-image-viewer__btn {
    border-radius: var(--el-border-radius-base);
  }
  .el-image-viewer__prev,
  .el-image-viewer__next {
    font-size: var(--el-font-size-large);
    .el-icon {
      font-family: 'remixicon' !important;
      font-style: normal;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      svg {
        display: none;
      }
    }
  }
  .el-image-viewer__prev {
    .el-icon {
      &::before {
        content: "\ea60";
      }
    }
  }
  .el-image-viewer__next {
    .el-icon {
      &::before {
        content: "\ea6c";
      }
    }
  }
}
</style>
