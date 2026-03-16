<template>
  <el-dialog v-model="visible" :title="title[mode]" :width="560" destroy-on-close append-to-body @close="close">
    <el-form ref="formsRef" :model="forms" :rules="rules" label-width="auto" :disabled="mode === 'detail'">
      <el-form-item label="图书名称" prop="name">
        <el-input v-model="forms.name" placeholder="请输入图书名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="图书作者" prop="author">
        <el-input v-model="forms.author" placeholder="请输入图书作者" clearable></el-input>
      </el-form-item>
      <el-form-item label="图书内容摘要" prop="remark">
        <el-input v-model="forms.remark" type="textarea" :rows="3" placeholder="请输入图书内容摘要" clearable></el-input>
      </el-form-item>
      <el-form-item label="图书星级" prop="rate">
        <el-rate v-model="forms.rate" :icons="['ri-star-s-fill', 'ri-star-s-fill', 'ri-star-s-fill']" disabled-void-icon="ri-star-s-fill" void-icon="ri-star-s-fill" />
      </el-form-item>
      <el-form-item label="图书状态" prop="status">
        <el-select v-model="forms.status" placeholder="请选择选图书当前状态">
          <el-option label="待发布" value="0" />
          <el-option label="已发布" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="图书日期" prop="date">
        <el-date-picker v-model="forms.date" placeholder="请选择日期" type="datetime" class="width-100" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close">取 消</el-button>
      <el-button type="primary" @click="submit">保 存</el-button>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref, nextTick } from 'vue'
const visible = defineModel({
  type: Boolean,
  default: false
})

const emits = defineEmits(['update'])
const formsRef = ref(null)
const forms = ref({
  id: null,
  name: '',
  author: '',
  remark: '',
  rate: 0,
  status: '',
  date: '',
})

const rules = ref()

const close = async () => {
  await nextTick()
  formsRef.value?.clearValidate()
  formsRef.value?.resetFields()
  forms.value.id = null
  visible.value = false
}

const submit = () => {
  formsRef.value?.validate(async (valid) => {
    if (!valid) return
    emits('update', { ...forms.value })
    await close()
  })
}
const title = ref({
  add: '新增',
  edit: '编辑',
  detail: '详情',
})
const mode = ref('add')
const open = async (type = 'add', row = null) => {
  visible.value = true
  mode.value = type
  await nextTick()
  if (!row) return
  Object.keys(forms.value).forEach(key => {
    forms.value[key] = row[key]
  })
}


defineExpose({
  open,
})
</script>
