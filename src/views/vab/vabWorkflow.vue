<template>
<div>
  <el-card shadow="never" header="默认">
    <template #header>
      <div class="el-card__title">{{ $t('ec.menu.name.vabWorkflow') }}</div>
      <div class="el-card__action">
        <el-button type="primary" circle size="small" icon="ri-subtract-line" @click="zoom -= 1" />
        <el-slider v-model="zoom" :marks="marks" :min="1" :max="50" :step="1" />
        <el-button type="primary" circle size="small" icon="ri-add-line" @click="zoom += 1" />
      </div>
    </template>
    <ec-workflow ref="workflowRef" id="content-to-capture" v-model="data.nodeConfig" :style="`transform: scale(${zoom/10})`" style="transform-origin: 0 0" />
  </el-card>
</div>

</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import html2canvas from 'html2canvas'
import EcWorkflow from '@/components/EcWorkflow'

const zoom = ref(10)
const marks = reactive({
  1: 'min',
  10: '1',
  20: '2',
  30: '3',
  40: '4',
  50: 'max'
})


const data = ref({
  id: 1,
  name: '请假审批',
  nodeConfig: {
    nodeName: '发起者',
    nodeKey: 'node_0_0001',
    type: 0,
    nodeAssigneeList: [],
    childNode: {
      nodeName: '条件路由',
      nodeKey: 'node_4_00101',
      type: 4,
      conditionNodes: [
        {
          nodeName: '长期',
          nodeKey: 'node_3_1001',
          type: 3,
          priorityLevel: 1,
          conditionMode: 1,
          conditionList: [
            [
              {
                label: '请假天数',
                field: 'day',
                operator: '>',
                value: '7'
              }
            ]
          ],
          childNode: {
            nodeName: '指定领导审批',
            nodeKey: 'node_1_0002',
            type: 1,
            setType: 1,
            nodeAssigneeList: [
              {
                id: '360000197302144442',
                name: '王国维'
              }
            ],
            examineLevel: 1,
            directorLevel: 1,
            selectMode: 1,
            termAuto: false,
            term: 0,
            termMode: 1,
            examineMode: 1,
            directorMode: 0
          }
        },
        {
          nodeName: '短期',
          nodeKey: 'node_3_2001',
          type: 3,
          priorityLevel: 2,
          conditionMode: 1,
          conditionList: [],
          childNode: {
            nodeName: '直接主管审批',
            nodeKey: 'node_1_0003',
            type: 1,
            setType: 2,
            nodeAssigneeList: [],
            examineLevel: 1,
            directorLevel: 1,
            selectMode: 1,
            termAuto: false,
            term: 0,
            termMode: 1,
            examineMode: 1,
            directorMode: 0
          }
        }
      ],
      childNode: {
        nodeName: '抄送人',
        nodeKey: 'node_2_3001',
        type: 2,
        userSelectFlag: true,
        nodeAssigneeList: [
          {
            id: '220000200908305857',
            name: '璀玉隆'
          }
        ]
      }
    }
  }
})

// const { toClipboard } = useClipboard()

const copyParseJson = async () => {
  // await toClipboard(JSON.stringify(data.value, null, '  '))
}

const copyJson = async () => {
  // await toClipboard(JSON.stringify(data.value))
}

const handleWeel = (e) => {
  e.preventDefault()
  if (e.wheelDelta < 0) {
    zoom.value -= 0.1
  } else {
    zoom.value += 0.1
  }

  if (zoom.value <= 0.1) {
    zoom.value = 0.1
  } else if (zoom.value >= 5) {
    zoom.value = 5
  }
}

const saveAsPng = async () => {
  const element = document.getElementById('content-to-capture')
  element.parentElement.style.transform = 'scale(1)'
  const canvas = await html2canvas(element, {
    backgroundColor: '#efefef'
  })
  const image = canvas.toDataURL('image/png').replace('image/png', 'image/octet-stream')
  let link = document.createElement('a')
  link.download = `flowlong-${Date.now()}.png`
  link.href = image
  link.click()
}

onMounted(() => {
  // document.getElementById('app').onwheel = (e) => handleWeel(e)
})
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  .el-card__body {
    overflow: auto;
  }
  .el-card__action {
    display: flex;
    align-items: center;
    .el-slider {
      width: 160px;
      margin: 0 8px;
      .el-slider__marks {
        opacity: 0;
      }
    }
  }
}

</style>
