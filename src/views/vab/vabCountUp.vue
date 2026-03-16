<template>
  <div class="el-page">
    <el-card>
      <h1>
        <ec-count-up
          :decimals="form.decimals"
          :duration="form.duration"
          :end-value="form.endValue"
          :prefix="form.prefix"
          :separator="form.separator"
          :start-value="form.startValue"
          :suffix="form.suffix"
        />
      </h1>
      <el-form inline label-width="auto" :model="form">
        <el-form-item label="起始值">
          <el-input-number v-model="form.startValue" :min="0" style="width: 176px;" />
        </el-form-item>
        <el-form-item label="最终值">
          <el-input-number v-model="form.endValue" :min="0" style="width: 176px;" />
        </el-form-item>
        <el-form-item label="持续时间">
          <el-input-number v-model="form.duration" :min="0" style="width: 176px;" />
        </el-form-item>
        <el-form-item label="小数位数">
          <el-input-number v-model="form.decimals" :max="2" :min="0" style="width: 176px;" />
        </el-form-item>
        <el-form-item label="分隔符">
          <el-input v-model="form.separator" clearable style="width: 176px;" />
        </el-form-item>
        <el-form-item label="前缀">
          <el-input v-model="form.prefix" clearable style="width: 176px;" />
        </el-form-item>
        <el-form-item label="后缀">
          <el-input v-model="form.suffix" clearable style="width: 176px;" />
        </el-form-item>
        <el-form-item label="元素标签">
          <el-input v-model="form.wrapEle" clearable style="width: 176px;" />
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import EcCountUp from '@/components/EcCountUp'
defineOptions({
  name: 'vabCountUp',
})

const form = ref({
  startValue: 0,
  endValue: 2025,
  decimals: 2,
  prefix: '',
  suffix: '',
  separator: ',',
  duration: 5000,
  wrapEle: 'em',
})
</script>

<style lang="scss" scoped>

h1 {
  margin: 0;
  font-size: 64px;
  font-weight: bold;
  text-align: center;
  background: linear-gradient(180deg, var(--el-color-success), var(--el-color-primary));
  background-clip: text;
  -webkit-text-fill-color: transparent;
}
.el-form {
  margin: 8px 0;
}
</style>
