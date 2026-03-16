<template>
  <div class="custom-node">
    <!-- 左侧两个目标连接点（可被连接） -->
    <Handle
      id="target-top"
      type="target"
      :position="Position.Left"
      style="top: 30%"
    />
    <Handle
      id="target-bottom"
      type="target"
      :position="Position.Left"
      style="top: 70%"
    />

    <!-- 右侧两个源连接点（可连接出去） -->
    <Handle
      id="source-top"
      type="source"
      :position="Position.Right"
      style="top: 30%"
    />
    <Handle
      id="source-bottom"
      type="source"
      :position="Position.Right"
      style="top: 70%"
    />

    <div class="node-content">
      <div class="node-label">{{ data.label }}</div>
      <div v-if="data.description" class="node-description">{{ data.description }}</div>
    </div>
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.custom-node {
  padding: 12px 20px;
  border: 2px solid #409EFF;
  border-radius: 6px;
  background: white;
  min-width: 120px;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.custom-node.selected {
  border-color: #F56C6C;
  box-shadow: 0 0 0 2px rgba(245, 108, 108, 0.3);
}

.node-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.node-label {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

.node-description {
  font-size: 12px;
  color: #666;
}

/* 连接点样式 */
:deep(.vue-flow__handle) {
  width: 10px;
  height: 10px;
  background: #409EFF;
  border: 2px solid white;
}

:deep(.vue-flow__handle:hover) {
  background: #F56C6C;
}

:deep(.vue-flow__handle.source) {
  background: #67C23A;
}

:deep(.vue-flow__handle.target) {
  background: #409EFF;
}
</style>
