<template>

    <el-card>
      <el-form inline style="padding-bottom: 16px;">
        <el-form-item>
          <el-button type="primary" @click="pushRow">外部插入行</el-button>
          <el-button @click="deleteRow">外部删除行</el-button>
        </el-form-item>
      </el-form>
      <ec-table-sort ref="tableSortRef" v-model="list" :add-template="addTemplate" drag-sort>
        <el-table-column prop="time" label="时间" width="180">
          <template #default="scope">
            <el-time-select v-model="scope.row.time"></el-time-select>
          </template>
        </el-table-column>
        <el-table-column prop="type" label="类型" width="180">
          <template #default="scope">
            <el-select v-model="scope.row.type" placeholder="请选择">
              <el-option label="选项一" value="1" />
              <el-option label="选项二" value="2" />
              <el-option label="选项三" value="3" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="val" label="数量" min-width="180">
          <template #default="scope">
            <el-input v-model="scope.row.val" placeholder="请输入内容"></el-input>
          </template>
        </el-table-column>
        <el-table-column prop="open" label="单选" width="85" align="center">
          <template #default="scope">
            <el-checkbox v-model="scope.row.checked"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column prop="open" label="开关" width="80" align="center">
          <template #default="scope">
            <el-switch v-model="scope.row.open"></el-switch>
          </template>
        </el-table-column>
      </ec-table-sort>
    </el-card>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import EcTableSort from '@/components/EcTableSort'
const addTemplate = ref({
  time: '',
  type: '',
  val: '',
  open: true,
  checked: false,
})
const list = ref([
  {
    time: '09:00',
    type: '1',
    val: '100',
    open: true,
    checked: true,
  },
  {
    time: '10:00',
    type: '0',
    val: '50',
    open: false,
    checked: true,
  },
])
const tableSortRef = ref(null)
const pushRow = () => {
  const data = {
    time: '18:00',
    type: '1',
    val: '0',
    open: true,
    checked: true,
  }
  tableSortRef.value.pushRow(data)
}
const deleteRow = () => {
  tableSortRef.value.deleteRow(0)
}
</script>
