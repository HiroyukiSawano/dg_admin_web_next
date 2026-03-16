<template>
  <el-card header="基本使用">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <ec-chat-prompts title="提示集组件标题" :items="items" @item-click="handleItemClick" />
    </div>
  </el-card>
  <el-card header="垂直布局">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <ec-chat-prompts title="提示集组件标题" :items="items" vertical @item-click="handleItemClick" />
    </div>
  </el-card>
  <el-card header="换行">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <ec-chat-prompts title="提示集组件标题" :items="items" wrap @item-click="handleItemClick" />
    </div>
  </el-card>
  <el-card header="嵌套">
    <div style="display: flex; flex-direction: column; gap: 12px">
      <ec-chat-prompts title="提示集组件标题" :items="items2" wrap @item-click="handleItemClick" />
    </div>
  </el-card>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import EcChatPrompts from '@/components/EcChat/components/EcChatPrompts/index.vue'
defineOptions({ name: 'chatPrompts' })
const items = ref([
  {
    key: '1',
    label: '提示集组件标题',
    icon: 'ri-shapes-fill',
    description: '描述信息'.repeat(3),
  },
  {
    key: '2',
    label: '提示集组件标题',
    icon: 'ri-shapes-fill',
    description: '描述信息'.repeat(3),
  },
  {
    key: '3',
    label: '提示集组件标题',
    icon: 'ri-shapes-fill',
    description: '描述信息'.repeat(3),
  },
  {
    key: '4',
    label: '提示集组件标题',
    icon: 'ri-shapes-fill',
    description: '描述信息'.repeat(3),
  },
  {
    key: '5',
    label: '提示集组件标题',
    icon: 'ri-shapes-fill',
    description: '描述信息'.repeat(3),
  },
  {
    key: '6',
    label: '提示集组件标题',
    icon: 'ri-shapes-fill',
    description: '描述信息'.repeat(3),
  },
  {
    key: '7',
    label: '提示集组件标题',
    icon: 'ri-shapes-fill',
    description: '描述信息'.repeat(3),
  },
])

function handleItemClick(item) {
  ElMessage.success(`点击了 ${item.key}`)
}
const items2 = ref([])
onMounted(() => {
  for (let index = 0; index < 3; index++) {
    items2.value.push({
      key: index,
      label: `主标题 ${index}`,
      description: `描述 ${index}`,
      icon: 'ri-shapes-fill',
      disabled: false,
      vertical: true,
      children: [
        {
          key: `${index}-1`,
          label: `子标题 ${index}-1`,
          description: `描述 ${index}`,
          disabled: false,
          vertical: true,
          children: [
            {
              key: `${index}-1-1`,
              label: `孙子标题 ${index}-1-1`,
              description: `描述 ${index}`,
              disabled: false,
            },
            {
              key: `${index}-1-2`,
              label: `孙子标题 ${index}-1-1`,
              description: `描述 ${index}`,
              disabled: false,
            },
            {
              key: `${index}-1-3`,
              label: `孙子标题 ${index}-1-1`,
              description: `描述 ${index}`,
              disabled: false,
            },
          ],
        },
        {
          key: `${index}-2`,
          label: `子标题 ${index}-2`,
          description: `描述 ${index}`,
          disabled: false,
        },
        {
          key: `${index}-3`,
          label: `子标题 ${index}-3`,
          description: `描述 ${index}`,
          disabled: false,
        },
      ],
    })
  }
})
</script>

<style lang="scss" scoped></style>
