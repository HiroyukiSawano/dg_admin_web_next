<template>
  <div class="process-node">
    <!-- 左侧一个目标连接点 -->
    <Handle
      id="target"
      type="target"
      :position="Position.Left"
    />

    <!-- 右侧一个源连接点 -->
    <Handle
      id="source"
      type="source"
      :position="Position.Right"
    />

    <div class="node-content">
      <div class="node-label">{{ data.label }}</div>
      <div v-if="data.description" class="node-description">{{ data.description }}</div>
    </div>
  </div>
</template>

<script setup>
import { Handle, Position } from '@vue-flow/core'

defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
.process-node {
  padding: 12px 20px;
  border: 2px solid #409EFF;
  border-radius: 6px;
  background: white;
  min-width: 120px;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);
}

.process-node.selected {
  border-color: #F56C6C;
  box-shadow: 0 0 0 3px rgba(245, 108, 108, 0.2);
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

:deep(.vue-flow__handle.source) {
  background: #409EFF;
}

:deep(.vue-flow__handle.target) {
  background: #409EFF;
}
</style>
