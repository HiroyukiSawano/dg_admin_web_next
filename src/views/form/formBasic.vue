<template>
  <el-card>
    <template #header>
      <div class="el-card__title">{{ $t(route.meta.title) }}</div>
      <div class="el-card__action">
        <el-radio-group v-model="forms.position">
          <el-radio-button value="left">{{ $t('ec.f.b.c.a.text.left') }}</el-radio-button>
          <el-radio-button value="right">{{ $t('ec.f.b.c.a.text.right') }}</el-radio-button>
          <el-radio-button value="top">{{ $t('ec.f.b.c.a.text.top') }}</el-radio-button>
        </el-radio-group>
      </div>
    </template>
    <el-row>
      <el-col :lg="{ span: 12, offset: 6 }" :md="{ span: 20, offset: 2 }" :sm="{ span: 20, offset: 2 }"
        :xl="{ span: 12, offset: 6 }" :xs="24">
        <el-form ref="formsRef" class="demo-form"
          :label-position="useSystemStore().device === 'mobile' ? 'top' : forms.position" label-width="auto"
          :model="forms" :rules="rules">
          <el-form-item :label="$t('ec.f.b.f.label.name')" prop="name">
            <el-input v-model="forms.name" clearable :placeholder="$t('ec.f.b.f.placeholder.name')" />
          </el-form-item>
          <el-form-item :label="$t('ec.f.b.f.label.region')" prop="region">
            <el-select v-model="forms.region" :placeholder="$t('ec.f.b.f.placeholder.region')" class="width-100">
              <el-option :label="$t('ec.f.b.f.content.region.1')" value="1" />
              <el-option :label="$t('ec.f.b.f.content.region.2')" value="2" />
            </el-select>
          </el-form-item>
          <el-form-item :label="$t('ec.f.b.f.label.date')" prop="date">
            <el-date-picker v-model="forms.date" :placeholder="$t('ec.f.b.f.placeholder.date')" type="datetime"
              class="width-100" />
          </el-form-item>
          <el-form-item :label="$t('ec.f.b.f.label.type')" prop="type">
            <el-checkbox-group v-model="forms.type">
              <el-checkbox :label="$t('ec.f.b.f.content.type.1')" name="type" value="1" />
              <el-checkbox :label="$t('ec.f.b.f.content.type.2')" name="type" value="2" />
              <el-checkbox :label="$t('ec.f.b.f.content.type.3')" name="type" value="3" />
              <el-checkbox :label="$t('ec.f.b.f.content.type.4')" name="type" value="4" />
            </el-checkbox-group>
          </el-form-item>
          <el-form-item :label="$t('ec.f.b.f.label.resource')" prop="resource">
            <el-radio-group v-model="forms.resource">
              <el-radio :label="$t('ec.f.b.f.content.resource.1')" value="1" />
              <el-radio :label="$t('ec.f.b.f.content.resource.2')" value="2" />
            </el-radio-group>
          </el-form-item>
          <el-form-item :label="$t('ec.f.b.f.label.description')" prop="description">
            <el-input v-model="forms.description" clearable :rows="3" type="textarea"
              :placeholder="$t('ec.f.b.f.placeholder.description')" />
          </el-form-item>
          <el-form-item :label="$t('ec.f.b.f.label.delivery')" prop="delivery">
            <el-switch v-model="forms.delivery" />
          </el-form-item>
          <el-form-item :label="$t('ec.f.b.f.label.rate')" prop="rate">
            <el-rate v-model="forms.rate" void-icon="ri-star-line"
              :icons="['ri-star-fill', 'ri-star-fill', 'ri-star-fill']" show-text
              :texts="[$t('ec.f.b.f.content.rate.1'), $t('ec.f.b.f.content.rate.2'), $t('ec.f.b.f.content.rate.3'), $t('ec.f.b.f.content.rate.4'), $t('ec.f.b.f.content.rate.5')]" />
          </el-form-item>
          <el-form-item :label="$t('ec.f.b.f.label.area')" prop="area">
            <el-cascader v-model="forms.area" :placeholder="$t('ec.f.b.f.placeholder.area')" clearable filterable
              :options="areas" class="width-100" />
          </el-form-item>
          <el-form-item label=" ">
            <el-button type="primary" @click="handleFormSubmit">{{ $t('ec.f.b.f.button.submit') }}</el-button>
            <el-button @click="handleFormReset">{{ $t('ec.f.b.f.button.reset') }}</el-button>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>
  </el-card>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { useRoute } from 'vue-router'
import { useSystemStore } from '@/stores/modules/systemStore'
import { regionData } from 'element-china-area-data'
defineOptions({ name: 'FormBasic' })
const { proxy } = getCurrentInstance()
const route = useRoute()

const formsRef = ref(null)
const forms = ref({
  position: 'right',
  name: '',
  region: '',
  date: '',
  delivery: false,
  type: [],
  resource: '',
  description: '',
  rate: 0,
  area: [],
  transfer: [],
})
const areas = ref(regionData)
const rules = ref({
  name: [{ required: true, message: proxy.$t('ec.f.b.f.placeholder.name'), trigger: 'blur' }],
  region: [{ required: true, message: proxy.$t('ec.f.b.f.placeholder.region'), trigger: 'change' }],
  date: [{ type: 'date', required: true, message: proxy.$t('ec.f.b.f.placeholder.date'), trigger: 'change' }],
  type: [{ type: 'array', required: true, message: proxy.$t('ec.f.b.f.placeholder.type'), trigger: 'change' }],
  resource: [{ required: true, message: proxy.$t('ec.f.b.f.placeholder.resource'), trigger: 'change' }],
  description: [{ required: true, message: proxy.$t('ec.f.b.f.placeholder.description'), trigger: 'blur' }],
})

const handleFormSubmit = () => {
  formsRef.value?.validate((valid) => {
    if (valid) {
      console.log('success')
    } else {
      console.log('error')
    }
  })
}

const handleFormReset = () => {
  formsRef.value?.resetFields()
}
</script>

<style lang="scss" scoped>
.el-card {
  .el-card__title {
    font-weight: var(--el-font-weight-primary);
  }
}

:deep(.el-radio-group) {
  --el-button-bg-color: var(--el-fill-color-light);

  .el-radio-button {
    .el-radio-button__inner {
      border-color: var(--el-border-color-lighter);
    }
  }
}
</style>
