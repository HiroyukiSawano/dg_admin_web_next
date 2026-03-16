<template>
  <div class="end-node">
    <!-- 结束节点只有左侧一个目标连接点 -->
    <Handle
      id="target"
      type="target"
      :position="Position.Left"
    />

    <div class="node-content">
      <div class="node-icon">◼</div>
      <div class="node-label">{{ data.label }}</div>
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
.end-node {
  padding: 16px 24px;
  border: 2px solid #F56C6C;
  border-radius: 50px;
  background: white;
  min-width: 120px;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.2);
}

.end-node.selected {
  border-color: #409EFF;
  box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
}

.node-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.node-icon {
  font-size: 16px;
  color: #F56C6C;
}

.node-label {
  font-weight: 600;
  font-size: 14px;
  color: #333;
}

/* 连接点样式 */
:deep(.vue-flow__handle) {
  width: 10px;
  height: 10px;
  background: #F56C6C;
  border: 2px solid white;
}
</style>
