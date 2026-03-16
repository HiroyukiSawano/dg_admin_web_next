<template>
  <div>
    <el-row :gutter="16">
      <el-col :lg="12">
        <el-card header="情形问答">
          <el-input v-model="input" placeholder="试一试选择下面的情形" style="margin-bottom: 16px;" />
          <ec-situation-guide :data="data" @option-change="handleOptionChange" />
        </el-card>
      </el-col>
      <el-col :lg="12">
        <el-card header="数据结构">
          <pre>{{ data }}</pre>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import EcSituationGuide from '@/components/EcSituationGuide'
import situation from './data.json'
defineOptions({
  name: 'vabSituationGuide',
})
const input = ref('')
const data = ref(situation)
const handleOptionChange = (options) => {
  input.value = options.join('🎉')
}
</script>

<style lang="scss" scoped>

</style>
