<template>
  <div class="el-page">
    <el-card>
      <VueFlow
        :nodes="nodes"
        :edges="edges"
        :class="{ dark }"
        class="basic-flow"
        :default-viewport="{ zoom: 1 }"
        :min-zoom="0.2"
        :max-zoom="4"
        :node-types="nodeTypes"
        @pane-click="onPaneClick"
      >
        <Background pattern-color="#aaa" :gap="8" />
        <MiniMap />

        <Controls position="top-left">
          <ControlButton title="Reset Transform" @click="resetTransform">
            reset
          </ControlButton>
          <ControlButton title="Shuffle Node Positions" @click="updateNodePositions">
            shuffle
          </ControlButton>
          <ControlButton title="添加开始节点" @click="addStartNode">
            + Start
          </ControlButton>
          <ControlButton title="添加处理节点" @click="addProcessNode">
            + Process
          </ControlButton>
          <ControlButton title="添加条件节点" @click="addConditionNode">
            + Condition
          </ControlButton>
          <ControlButton title="添加结束节点" @click="addEndNode">
            + End
          </ControlButton>
          <ControlButton title="Toggle Dark Mode" @click="toggleDarkMode">
            <span v-if="dark">dark</span>
            <span v-else>light</span>
          </ControlButton>
        </Controls>

        <!-- 连接线编辑面板 -->
        <div v-if="showEdgePanel && selectedEdge" class="edge-panel">
          <h4>编辑连接线</h4>
          <div class="edge-info">
            <div class="info-item">
              <span class="label">源节点:</span>
              <span class="value">{{ getNodeName(selectedEdge.source) }}</span>
            </div>
            <div class="info-item">
              <span class="label">目标节点:</span>
              <span class="value">{{ getNodeName(selectedEdge.target) }}</span>
            </div>
            <div class="info-item">
              <span class="label">连接点:</span>
              <span class="value">{{ selectedEdge.sourceHandle }} → {{ selectedEdge.targetHandle }}</span>
            </div>
          </div>

          <div class="form-group">
            <label>连接线名称</label>
            <input
              v-model="edgeLabel"
              placeholder="输入连接线名称"
              @keyup.enter="saveEdgeLabel"
              ref="edgeLabelInput"
            />
          </div>

          <div class="form-group">
            <label>样式</label>
            <div class="style-options">
              <button
                v-for="style in edgeStyles"
                :key="style.value"
                class="style-btn"
                :class="{ active: selectedEdgeStyle === style.value }"
                @click="selectedEdgeStyle = style.value"
              >
                <div class="style-preview-container">
                  <div
                    class="style-preview-line"
                    :style="getPreviewStyle(style.value)"
                  ></div>
                </div>
                <span class="style-label">{{ style.label }}</span>
              </button>
            </div>
          </div>

          <div class="button-group">
            <button @click="saveEdgeSettings" class="save-btn">保存</button>
            <button @click="deleteEdge" class="delete-btn">删除连接</button>
            <button @click="closeEdgePanel" class="cancel-btn">取消</button>
          </div>
        </div>

        <!-- 条件节点管理面板 -->
        <div v-if="showConditionPanel && selectedNode" class="condition-panel">
          <h4>条件节点管理 - {{ selectedNode.data.label }}</h4>
          <div class="condition-list">
            <div v-for="(condition, index) in selectedNodeConditions"
                 :key="condition.id || index"
                 class="condition-item">
              <input v-model="condition.name" placeholder="条件名称" />
              <div class="condition-id">ID: source-{{ condition.id }}</div>
              <button @click="removeCondition(index)" class="remove-btn">×</button>
            </div>
          </div>
          <button @click="addNewCondition" class="add-btn">+ 添加条件</button>
          <button @click="saveConditions" class="save-btn">保存</button>
          <button @click="onPaneClick" class="cancel-btn">取消</button>
        </div>
      </VueFlow>
    </el-card>
  </div>
</template>

<script setup>
import { ref, markRaw, computed, nextTick, watch } from 'vue'
import { VueFlow, useVueFlow } from '@vue-flow/core'
import { Background } from '@vue-flow/background'
import { ControlButton, Controls } from '@vue-flow/controls'
import { MiniMap } from '@vue-flow/minimap'

// 导入自定义节点组件
import StartNode from './components/VfStartNode.vue'
import EndNode from './components/VfEndNode.vue'
import ProcessNode from './components/VfProcessNode.vue'
import ConditionNode from './components/VfConditionNode.vue'

defineOptions({
  value: 'vabVueFlow',
})

// 注册所有节点类型
const nodeTypes = {
  start: markRaw(StartNode),
  end: markRaw(EndNode),
  process: markRaw(ProcessNode),
  condition: markRaw(ConditionNode)
}

const {
  onInit,
  addEdges,
  setViewport,
  toObject,
  updateNode,
  updateEdge,
  removeEdges,
  fitView,
  findNode,
  edges,
  setEdges
} = useVueFlow()

// 节点数据
const nodes = ref([
  {
    id: '1',
    type: 'start',
    data: {
      label: '开始',
    },
    position: { x: 50, y: 200 },
    draggable: true,
    selectable: true,
  },
  {
    id: '2',
    type: 'process',
    data: {
      label: '处理步骤1',
      description: '初始处理'
    },
    position: { x: 250, y: 150 },
  },
  {
    id: '3',
    type: 'condition',
    data: {
      label: '条件判断',
      description: '分支条件',
      conditions: [
        { id: 1, name: '条件A' },
        { id: 2, name: '条件B' }
      ]
    },
    position: { x: 450, y: 150 },
  },
  {
    id: '4',
    type: 'process',
    data: {
      label: '处理步骤2',
      description: '条件A流程'
    },
    position: { x: 650, y: 100 },
  },
  {
    id: '5',
    type: 'process',
    data: {
      label: '处理步骤3',
      description: '条件B流程'
    },
    position: { x: 650, y: 250 },
  },
  {
    id: '6',
    type: 'end',
    data: {
      label: '结束',
    },
    position: { x: 850, y: 200 },
  },
])

// 连接线样式选项
const edgeStyles = ref([
  { label: '默认', value: 'default' },
  { label: '绿色', value: 'success' },
  { label: '橙色', value: 'warning' },
  { label: '红色', value: 'danger' },
  { label: '虚线', value: 'dashed' },
  { label: '点线', value: 'dotted' },
])

const dark = ref(false)
const selectedNode = ref(null)
const selectedEdge = ref(null)
const showConditionPanel = ref(false)
const showEdgePanel = ref(false)
const selectedNodeConditions = ref([])
const edgeLabel = ref('')
const selectedEdgeStyle = ref('default')
const edgeLabelInput = ref(null)

// 在 onInit 中设置事件监听器和初始边
onInit((vueFlowInstance) => {
  // 设置初始边数据
  vueFlowInstance.setEdges([
    {
      id: 'e1-2',
      source: '1',
      sourceHandle: 'source',
      target: '2',
      targetHandle: 'target',
      animated: true,
      label: '开始流程',
      style: { stroke: '#409EFF', strokeWidth: 2 },
    },
    {
      id: 'e2-3',
      source: '2',
      sourceHandle: 'source',
      target: '3',
      targetHandle: 'target',
      label: '进入判断',
      style: { stroke: '#409EFF', strokeWidth: 2 },
    },
    {
      id: 'e3-4',
      source: '3',
      sourceHandle: 'source-1',
      target: '4',
      targetHandle: 'target',
      label: '条件A',
      style: { stroke: '#67C23A', strokeWidth: 2 },
    },
    {
      id: 'e3-5',
      source: '3',
      sourceHandle: 'source-2',
      target: '5',
      targetHandle: 'target',
      label: '条件B',
      style: { stroke: '#E6A23C', strokeWidth: 2 },
    },
    {
      id: 'e4-6',
      source: '4',
      sourceHandle: 'source',
      target: '6',
      targetHandle: 'target',
      label: '完成流程A',
      animated: true,
      style: { stroke: '#409EFF', strokeWidth: 2 },
    },
    {
      id: 'e5-6',
      source: '5',
      sourceHandle: 'source',
      target: '6',
      targetHandle: 'target',
      label: '完成流程B',
      animated: true,
      style: { stroke: '#409EFF', strokeWidth: 2 },
    },
  ])

  // 添加节点点击监听
  vueFlowInstance.onNodeClick((event) => {
    const node = event?.node

    if (node && node.type === 'condition') {
      selectedNode.value = node
      selectedNodeConditions.value = node.data.conditions ? [...node.data.conditions] : []
      showConditionPanel.value = true
      showEdgePanel.value = false
    } else {
      showConditionPanel.value = false
    }
  })

  // 添加连接线点击监听
  vueFlowInstance.onEdgeClick((event) => {
    const edge = event?.edge
    if (edge) {
      selectedEdge.value = edge
      showEdgePanel.value = true
      showConditionPanel.value = false

      // 自动聚焦到输入框
      nextTick(() => {
        if (edgeLabelInput.value) {
          edgeLabelInput.value.focus()
          edgeLabelInput.value.select()
        }
      })
    }
  })

  // 添加连接创建监听
  vueFlowInstance.onConnect((params) => {
    console.log('Connection created:', params)

    const sourceNode = vueFlowInstance.findNode(params.source)
    const targetNode = vueFlowInstance.findNode(params.target)

    const newEdge = {
      id: `edge-${Date.now()}`,
      source: params.source,
      target: params.target,
      sourceHandle: params.sourceHandle || 'source',
      targetHandle: params.targetHandle || 'target',
      animated: false,
      label: '新连接',
      style: { stroke: '#409EFF', strokeWidth: 2 },
    }

    // 根据源节点类型设置默认样式
    if (sourceNode?.type === 'condition') {
      newEdge.style = { stroke: '#E6A23C', strokeWidth: 2 }
    }

    vueFlowInstance.addEdges([newEdge])

    // 自动打开编辑面板
    nextTick(() => {
      const newEdgeObj = vueFlowInstance.edges.value.find(e => e.id === newEdge.id)
      if (newEdgeObj) {
        selectedEdge.value = newEdgeObj
        showEdgePanel.value = true

        // 自动聚焦到输入框
        nextTick(() => {
          if (edgeLabelInput.value) {
            edgeLabelInput.value.focus()
            edgeLabelInput.value.select()
          }
        })
      }
    })
  })

  vueFlowInstance.fitView()
})

// 监听选中的连接线变化
watch(selectedEdge, (newEdge) => {
  if (newEdge) {
    edgeLabel.value = newEdge.label || ''

    // 根据当前样式确定选中的样式类型
    if (newEdge.style?.stroke === '#67C23A') {
      selectedEdgeStyle.value = 'success'
    } else if (newEdge.style?.stroke === '#E6A23C') {
      selectedEdgeStyle.value = 'warning'
    } else if (newEdge.style?.stroke === '#F56C6C') {
      selectedEdgeStyle.value = 'danger'
    } else if (newEdge.style?.strokeDasharray === '5,5') {
      selectedEdgeStyle.value = 'dashed'
    } else if (newEdge.style?.strokeDasharray === '2,2') {
      selectedEdgeStyle.value = 'dotted'
    } else {
      selectedEdgeStyle.value = 'default'
    }
  }
})

// 获取节点名称
function getNodeName(nodeId) {
  const node = findNode(nodeId)
  return node?.data?.label || nodeId
}

// 保存连接线设置
function saveEdgeSettings() {
  if (selectedEdge.value) {
    const styleUpdates = getEdgeStyle(selectedEdgeStyle.value)

    // 创建一个新的边对象
    const updatedEdge = {
      ...selectedEdge.value,
      label: edgeLabel.value || '未命名连接',
      ...styleUpdates
    }

    // 使用 setEdges 更新整个边数组
    const newEdges = edges.value.map(edge =>
      edge.id === selectedEdge.value.id ? updatedEdge : edge
    )

    setEdges(newEdges)

    // 同时使用 updateEdge 确保 Vue Flow 内部状态更新
    updateEdge(selectedEdge.value.id, () => updatedEdge)

    // 更新选中的边对象
    selectedEdge.value = updatedEdge

    closeEdgePanel()
  }
}

// 获取连接线样式
function getEdgeStyle(styleType) {
  switch (styleType) {
    case 'success':
      return {
        style: {
          stroke: '#67C23A',
          strokeWidth: 2
        },
        animated: false
      }
    case 'warning':
      return {
        style: {
          stroke: '#E6A23C',
          strokeWidth: 2
        },
        animated: false
      }
    case 'danger':
      return {
        style: {
          stroke: '#F56C6C',
          strokeWidth: 2
        },
        animated: false
      }
    case 'dashed':
      return {
        style: {
          stroke: '#409EFF',
          strokeWidth: 2,
          strokeDasharray: '5,5'
        },
        animated: false
      }
    case 'dotted':
      return {
        style: {
          stroke: '#409EFF',
          strokeWidth: 2,
          strokeDasharray: '2,2'
        },
        animated: false
      }
    default: // default
      return {
        style: {
          stroke: '#409EFF',
          strokeWidth: 2
        },
        animated: false
      }
  }
}

// 样式预览函数
function getPreviewStyle(styleType) {
  switch (styleType) {
    case 'success':
      return {
        background: '#67C23A',
        height: '3px'
      }
    case 'warning':
      return {
        background: '#E6A23C',
        height: '3px'
      }
    case 'danger':
      return {
        background: '#F56C6C',
        height: '3px'
      }
    case 'dashed':
      return {
        background: 'repeating-linear-gradient(90deg, #409EFF, #409EFF 3px, transparent 3px, transparent 6px)',
        height: '3px'
      }
    case 'dotted':
      return {
        background: 'radial-gradient(#409EFF 2px, transparent 3px)',
        backgroundSize: '6px 6px',
        height: '3px'
      }
    default:
      return {
        background: '#409EFF',
        height: '3px'
      }
  }
}

// 删除连接线
function deleteEdge() {
  if (selectedEdge.value && confirm('确定要删除这条连接线吗？')) {
    removeEdges([selectedEdge.value.id])
    closeEdgePanel()
  }
}

// 关闭连接线面板
function closeEdgePanel() {
  showEdgePanel.value = false
  selectedEdge.value = null
  edgeLabel.value = ''
  selectedEdgeStyle.value = 'default'
}

// 键盘快捷键保存
function saveEdgeLabel() {
  if (showEdgePanel.value) {
    saveEdgeSettings()
  }
}

// 条件节点相关函数
function addNewCondition() {
  if (!selectedNodeConditions.value) {
    selectedNodeConditions.value = []
  }

  const newId = Date.now()
  selectedNodeConditions.value.push({
    id: newId,
    name: `条件 ${selectedNodeConditions.value.length + 1}`
  })
}

function removeCondition(index) {
  if (selectedNodeConditions.value && selectedNodeConditions.value.length > index) {
    selectedNodeConditions.value.splice(index, 1)
  }
}

function saveConditions() {
  if (selectedNode.value) {
    const nodeId = selectedNode.value.id
    updateNode(nodeId, {
      data: {
        ...selectedNode.value.data,
        conditions: [...selectedNodeConditions.value]
      }
    })

    showConditionPanel.value = false
    selectedNode.value = null
  }
}

// 添加节点函数
function addStartNode() {
  const newNodeId = `node-${Date.now()}`
  const newNode = {
    id: newNodeId,
    type: 'start',
    data: {
      label: '开始节点',
    },
    position: {
      x: 50,
      y: Math.max(...nodes.value.map(n => n.position.y)) + 80
    },
    draggable: true,
    selectable: true,
  }
  nodes.value.push(newNode)
  nextTick(() => fitView())
}

function addProcessNode() {
  const newNodeId = `node-${Date.now()}`
  const newNode = {
    id: newNodeId,
    type: 'process',
    data: {
      label: '处理节点',
      description: '新的处理步骤'
    },
    position: {
      x: 250,
      y: Math.max(...nodes.value.map(n => n.position.y)) + 80
    },
  }
  nodes.value.push(newNode)
  nextTick(() => fitView())
}

function addConditionNode() {
  const newNodeId = `node-${Date.now()}`
  const newNode = {
    id: newNodeId,
    type: 'condition',
    data: {
      label: '条件节点',
      description: '分支判断',
      conditions: [
        { id: 1, name: '是' },
        { id: 2, name: '否' }
      ]
    },
    position: {
      x: 450,
      y: Math.max(...nodes.value.map(n => n.position.y)) + 80
    },
  }
  nodes.value.push(newNode)
  nextTick(() => fitView())
}

function addEndNode() {
  const newNodeId = `node-${Date.now()}`
  const newNode = {
    id: newNodeId,
    type: 'end',
    data: {
      label: '结束节点',
    },
    position: {
      x: 650,
      y: Math.max(...nodes.value.map(n => n.position.y)) + 80
    },
  }
  nodes.value.push(newNode)
  nextTick(() => fitView())
}

// 点击画布关闭所有面板
function onPaneClick() {
  showConditionPanel.value = false
  showEdgePanel.value = false
  selectedNode.value = null
  selectedEdge.value = null
}

function resetTransform() {
  setViewport({ x: 0, y: 0, zoom: 1 })
}

function toggleDarkMode() {
  dark.value = !dark.value
}

function updateNodePositions() {
  nodes.value = nodes.value.map((node) => ({
    ...node,
    position: {
      x: Math.random() * 800,
      y: Math.random() * 600,
    },
  }))
  nextTick(() => fitView())
}
</script>

<style lang="scss" scoped>
.el-page {
  height: 100%;
  position: relative;
}

.el-card {
  margin-bottom: 0;
  height: 100%;
}

/* 连接线编辑面板 */
.edge-panel {
  position: absolute;
  top: 20px;
  right: 20px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 10;
  min-width: 300px;
  max-width: 350px;

  h4 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 16px;
    border-bottom: 1px solid #eee;
    padding-bottom: 8px;
  }

  .edge-info {
    margin-bottom: 16px;
    padding: 12px;
    background: #f8f9fa;
    border-radius: 6px;
    border-left: 4px solid #409EFF;

    .info-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 6px;
      font-size: 12px;

      &:last-child {
        margin-bottom: 0;
      }

      .label {
        color: #666;
        font-weight: 500;
      }

      .value {
        color: #333;
        font-weight: 600;
      }
    }
  }

  .form-group {
    margin-bottom: 16px;

    label {
      display: block;
      margin-bottom: 6px;
      font-size: 13px;
      color: #333;
      font-weight: 500;
    }

    input {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      font-size: 13px;
      transition: border-color 0.3s;

      &:focus {
        outline: none;
        border-color: #409EFF;
        box-shadow: 0 0 0 2px rgba(64, 158, 255, 0.2);
      }
    }

    .style-options {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
      margin-top: 8px;

      .style-btn {
        padding: 8px 6px;
        border: 1px solid #dcdfe6;
        border-radius: 4px;
        background: white;
        cursor: pointer;
        font-size: 12px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 4px;
        transition: all 0.3s;

        &:hover {
          border-color: #409EFF;
          transform: translateY(-1px);
        }

        &.active {
          border-color: #409EFF;
          background: #f0f7ff;
          box-shadow: 0 0 0 1px #409EFF inset;
        }

        .style-preview-container {
          width: 100%;
          height: 20px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .style-preview-line {
          width: 100%;
          height: 3px;
          border-radius: 2px;
        }

        .style-label {
          font-size: 11px;
        }
      }
    }
  }

  .button-group {
    display: flex;
    gap: 8px;
    margin-top: 20px;

    button {
      flex: 1;
      padding: 10px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 13px;
      font-weight: 500;
      transition: all 0.3s;
    }

    .save-btn {
      background: #409EFF;
      color: white;

      &:hover {
        background: #66b1ff;
      }
    }

    .delete-btn {
      background: #f56c6c;
      color: white;

      &:hover {
        background: #f78989;
      }
    }

    .cancel-btn {
      background: #909399;
      color: white;

      &:hover {
        background: #a6a9ad;
      }
    }
  }
}

/* 条件节点管理面板 */
.condition-panel {
  position: absolute;
  top: 20px;
  right: 350px;
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  z-index: 9;
  min-width: 280px;
  max-width: 320px;

  h4 {
    margin: 0 0 16px 0;
    color: #333;
    font-size: 16px;
  }

  .condition-list {
    max-height: 200px;
    overflow-y: auto;
    margin-bottom: 16px;
  }

  .condition-item {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 8px;
    padding: 8px;
    background: #f5f5f5;
    border-radius: 4px;

    input {
      flex: 1;
      min-width: 0;
      padding: 6px 12px;
      border: 1px solid #dcdfe6;
      border-radius: 4px;
      font-size: 12px;

      &:focus {
        outline: none;
        border-color: #409EFF;
      }
    }

    .condition-id {
      font-size: 10px;
      color: #909399;
      background: #fff;
      padding: 2px 6px;
      border-radius: 2px;
      white-space: nowrap;
    }

    .remove-btn {
      width: 24px;
      height: 24px;
      border: none;
      background: #f56c6c;
      color: white;
      border-radius: 50%;
      cursor: pointer;
      font-size: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;

      &:hover {
        background: #f78989;
      }
    }
  }

  .add-btn,
  .save-btn,
  .cancel-btn {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 13px;
    font-weight: 500;
    margin-top: 8px;
  }

  .add-btn {
    background: #409EFF;
    color: white;

    &:hover {
      background: #66b1ff;
    }
  }

  .save-btn {
    background: #67C23A;
    color: white;

    &:hover {
      background: #85ce61;
    }
  }

  .cancel-btn {
    background: #909399;
    color: white;

    &:hover {
      background: #a6a9ad;
    }
  }
}
</style>

<style lang="scss">
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '@vue-flow/controls/dist/style.css';
@import '@vue-flow/minimap/dist/style.css';

/* 全局节点样式 */
.vue-flow__node {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  &.vue-flow__node-start {
    .vue-flow__handle.source {
      background: #67C23A;
    }
  }

  &.vue-flow__node-end {
    .vue-flow__handle.target {
      background: #F56C6C;
    }
  }

  &.vue-flow__node-process {
    .vue-flow__handle {
      background: #409EFF;
    }
  }

  &.vue-flow__node-condition {
    .vue-flow__handle {
      &.source {
        background: #E6A23C;
      }
      &.target {
        background: #409EFF;
      }
    }
  }
}

/* 条件节点全局样式 */
.custom-node.condition-node {
  padding: 12px 20px;
  border: 2px solid #E6A23C;
  border-radius: 8px;
  background: white;
  min-width: 150px;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

  .node-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .node-label {
    font-weight: 600;
    font-size: 14px;
    color: #E6A23C;
  }

  .node-description {
    font-size: 12px;
    color: #909399;
  }

  .conditions-list {
    margin-top: 8px;
    border-top: 1px solid #f0f0f0;
    padding-top: 8px;
  }

  .condition-item {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 0;
    font-size: 12px;
    color: #606266;
  }

  .condition-icon {
    color: #67C23A;
    font-size: 10px;
  }

  .no-conditions {
    font-size: 12px;
    color: #c0c4cc;
    padding: 8px 0;
  }

  &.selected {
    border-color: #F56C6C;
    box-shadow: 0 0 0 3px rgba(245, 108, 108, 0.2);
  }
}

/* 开始节点全局样式 */
.custom-node.start-node {
  padding: 16px 24px;
  border: 2px solid #67C23A;
  border-radius: 50px;
  background: white;
  min-width: 120px;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(103, 194, 58, 0.2);

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

  &.selected {
    border-color: #F56C6C;
    box-shadow: 0 0 0 3px rgba(245, 108, 108, 0.2);
  }
}

/* 结束节点全局样式 */
.custom-node.end-node {
  padding: 16px 24px;
  border: 2px solid #F56C6C;
  border-radius: 50px;
  background: white;
  min-width: 120px;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(245, 108, 108, 0.2);

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

  &.selected {
    border-color: #409EFF;
    box-shadow: 0 0 0 3px rgba(64, 158, 255, 0.2);
  }
}

/* 处理节点全局样式 */
.custom-node.process-node {
  padding: 12px 20px;
  border: 2px solid #409EFF;
  border-radius: 6px;
  background: white;
  min-width: 120px;
  text-align: center;
  position: relative;
  box-shadow: 0 2px 8px rgba(64, 158, 255, 0.2);

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

  &.selected {
    border-color: #F56C6C;
    box-shadow: 0 0 0 3px rgba(245, 108, 108, 0.2);
  }
}

/* 连接点样式 */
.vue-flow__handle {
  width: 10px;
  height: 10px;
  border: 2px solid white;
  box-shadow: 0 0 2px rgba(0, 0, 0, 0.3);

  &.vue-flow__handle-source {
    background: #67C23A;
  }

  &.vue-flow__handle-target {
    background: #409EFF;
  }

  // &:hover {
  //   transform: scale(1.2);
  // }
}

/* 连接线选中样式 */
.vue-flow__edge.selected {
  .vue-flow__edge-path {
    stroke-width: 3px !important;
  }

  .vue-flow__edge-text {
    font-weight: bold;
  }
}

/* 连接线标签样式 */
.vue-flow__edge-text {
  font-size: 12px;
  font-weight: 500;
  background: rgba(255, 255, 255, 0.9);
  padding: 2px 8px;
  border-radius: 4px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  user-select: none;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transition: all 0.3s;

  &:hover {
    background: #f0f7ff;
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.15);
    transform: translateY(-1px);
  }
}

.vue-flow__minimap {
  transform: scale(75%);
  transform-origin: bottom right;
}

/* 深色模式样式 */
.basic-flow.dark {
  background: #2d3748;
  color: #fffffb;

  .vue-flow__node {
    background: #4a5568;
    color: #fffffb;

    &.vue-flow__node-start {
      border-color: #85ce61;
    }

    &.vue-flow__node-end {
      border-color: #f78989;
    }

    &.vue-flow__node-process {
      border-color: #66b1ff;
    }

    &.vue-flow__node-condition {
      border-color: #e6a23c;
    }
  }

  /* 连接线标签在深色模式下 */
  .vue-flow__edge-text {
    background: rgba(74, 85, 104, 0.9);
    color: #fffffb;
    border: 1px solid rgba(255, 255, 255, 0.1);

    &:hover {
      background: #5a6578;
    }
  }

  /* 面板在深色模式下 */
  .edge-panel,
  .condition-panel {
    background: #4a5568;
    color: #fffffb;

    input {
      background: #2d3748;
      border-color: #718096;
      color: #fffffb;
    }

    .edge-info {
      background: #2d3748;
      border-left-color: #66b1ff;
    }

    .condition-item {
      background: #2d3748;
    }

    .style-btn {
      background: #2d3748;
      border-color: #718096;
      color: #fffffb;

      &:hover {
        border-color: #66b1ff;
      }

      &.active {
        border-color: #66b1ff;
        background: #3a4355;
      }
    }
  }

  .vue-flow__handle {
    border-color: #4a5568;
  }
}

.basic-flow .vue-flow__controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .vue-flow__controls-button {
    border: none;
    border-right: 1px solid #eee;
    width: auto;
    svg {
      height: 100%;
      width: 100%;
    }
  }
}

.basic-flow.dark {
  .vue-flow__controls {
    border: 1px solid #FFFFFB;

    .vue-flow__controls-button {
      background: #333;
      fill: #fffffb;
      border: none;

      &:hover {
        background: #4d4d4d;
      }
    }
  }
}
</style>
