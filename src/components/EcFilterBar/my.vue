<template>
  <el-empty v-if="myFilter.length <= 0" :image-size="96" description="常用过滤可以将多个条件保存为一个集合，方便下次进行相同的过滤" />
  <div v-else class="el-list">
    <div class="el-list-item" v-for="(item, index) in myFilter" :key="index" @click="selectMyfilter(item)">
      <span>{{ item.title }}</span>
      <el-popconfirm title="确认删除此常用过滤吗？" :width="224" cancel-button-type="info" @confirm="closeMyfilter(item, index)">
        <template #reference>
          <el-icon class="ri-close-circle-fill" :size="16" color="var(--el-text-color-disabled)" @click.stop="() => {}" />
        </template>
      </el-popconfirm>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import config from './config'

const props = defineProps({
  filterName: { type: String, default: '' },
  data: { type: Object, default: () => ({}) }
})

const emit = defineEmits(['selectMyfilter'])

const loading = ref(false)
const myFilter = ref([])

// 选择常用过滤
const selectMyfilter = (item) => {
  emit('selectMyfilter', item)
}

// 删除常用过滤
const closeMyfilter = async (item, index) => {
  try {
    const del = await config.delMy(props.filterName)
    if (!del) return false
    myFilter.value.splice(index, 1)
    ElMessage.success('删除常用成功')
  } catch (error) {
    return false
  }
}

// 远程获取我的常用
const getMyfilter = async () => {
  loading.value = true
  try {
    myFilter.value = await config.getMy(props.filterName)
  } catch (error) {
    return false
  } finally {
    loading.value = false
  }
}

watch(
  () => props.data,
  (newVal) => {
    myFilter.value = newVal
  },
  { deep: true }
)

onMounted(() => {
  myFilter.value = props.data
  getMyfilter()
})
</script>

<style lang="scss" scoped>
  .el-list {
    .el-list-item {
      display: flex;
      align-items: center;
      padding: 8px 0;
      cursor: pointer;
      &:hover {
        color: var(--el-color-primary);
      }
      > span {
        flex: 1;
        min-width: 0;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
  }
</style>
