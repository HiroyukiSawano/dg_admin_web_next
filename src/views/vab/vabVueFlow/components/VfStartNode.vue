<template>
  <div class="start-node">
    <!-- 开始节点只有右侧一个源连接点 -->
    <Handle
      id="source"
      type="source"
      :position="Position.Right"
    />

    <div class="node-content">
      <div class="node-icon">▶</div>
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
.start-node {
  padding: 16px 24px;
  border: 2px solid #67C23A;
  border-radius: 50px;
  background: white;
  min-width: 120px;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.2);
}

.start-node.selected {
  border-color: #F56C6C;
  box-shadow: 0 0 0 3px rgba(245, 108, 108, 0.2);
}

.node-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.node-icon {
  font-size: 16px;
  color: #67C23A;
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
  background: #67C23A;
  border: 2px solid white;
}
</style>
