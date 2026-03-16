<template>
  <el-row :gutter="15">
    <el-col :lg="12">
      <el-card shadow="never" header="默认">
        <ec-cron v-model="v1" placeholder="请输入Cron定时规则" clearable />
      </el-card>
    </el-col>
    <el-col :lg="12">
      <el-card shadow="never" header="快捷扩展">
        <ec-cron v-model="v2" placeholder="请输入Cron定时规则" clearable :shortcuts="shortcuts" />
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup>
import { ref } from 'vue'
import EcCron from '@/components/EcCron'
defineOptions({
  name: 'vabCron',
})
const v1 = ref('')
const v2 = ref('')
const shortcuts = ref([
  { text: '每天8点和12点 (自定义追加)', value: '0 0 8,12 * * ?' },
])
</script>
