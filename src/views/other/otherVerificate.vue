<template>
  <el-card header="内置校验">
    <el-form ref="form1Ref" :model="form1" :rules="rules" label-width="auto" label-position="right" status-icon>
      <el-form-item label="必填" prop="required">
        <el-input v-model="form1.required" placeholder="请填写必填项" />
      </el-form-item>
      <el-form-item label="长度" prop="length">
        <el-input v-model="form1.length" placeholder="长度需为3位" />
      </el-form-item>
      <el-form-item label="类型" prop="type">
        <el-input v-model="form1.type" placeholder="类型可为string number boolean array date url email等" />
      </el-form-item>
      <el-form-item label="范围" prop="range">
        <el-input v-model="form1.range" placeholder="请填写范围在3至5位" />
      </el-form-item>
      <el-form-item label="枚举" prop="enum">
        <el-input v-model="form1.enum" placeholder="请填写admin，user，guest其一" />
      </el-form-item>
      <el-form-item label="自定义" prop="custom">
        <el-input v-model="form1.custom" placeholder="请填写数字1" />
      </el-form-item>
      <el-form-item label="异步验证" prop="async">
        <el-input v-model="form1.async" placeholder="请输入最新版本号,form开启status-icon后 可以查看右侧状态" />
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="submitForm1">校验所有字段</el-button>
        <el-button @click="resetForm1">重置校验</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card header="自定义校验">
    <el-alert title="自定义验证可在 @/utils/verificate.js 中不断扩展业务需要的验证. 记得要 import 进来" type="success" style="margin-bottom: 16px" />
    <el-form ref="form2Ref" :model="form2" :rules="rules2" label-width="auto" label-position="right" status-icon>
      <el-form-item label="邮箱" prop="email">
        <el-input v-model="form2.email" clearable />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="form2.phone" clearable />
      </el-form-item>
      <el-form-item label="身份证号码" prop="idCard">
        <el-input v-model="form2.idCard" clearable />
      </el-form-item>
      <el-form-item label="数字" prop="number">
        <el-input v-model="form2.number" clearable />
      </el-form-item>
      <el-form-item label="英文字符" prop="english">
        <el-input v-model="form2.english" clearable />
      </el-form-item>
      <el-form-item label="中文字符" prop="chinese">
        <el-input v-model="form2.chinese" clearable />
      </el-form-item>
      <el-form-item label="URL地址" prop="url">
        <el-input v-model="form2.url" clearable />
      </el-form-item>
      <el-form-item label="车牌号码" prop="cars">
        <el-input v-model="form2.cars" clearable />
      </el-form-item>
      <el-form-item label=" ">
        <el-button type="primary" @click="submitForm2">校验所有字段</el-button>
        <el-button @click="resetForm2">重置校验</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { isChinese, isEmail, isEnglish, isIdCard, isNumber, isPhone, isUrl, isCars } from '@/utils/verificate'
import { ElMessage } from 'element-plus'
defineOptions({ name: 'otherVerificate' })
const { proxy } = getCurrentInstance()
const validateEmail = (rule, value, callback) => {
  if (isEmail(value)) {
    callback()
  } else {
    callback(new Error('请输入有效的邮箱地址'))
  }
}

const validatePhone = (rule, value, callback) => {
  if (isPhone(value)) {
    callback()
  } else {
    callback(new Error('请输入有效的手机号'))
  }
}

const validateIdCard = (rule, value, callback) => {
  if (isIdCard(value)) {
    callback()
  } else {
    callback(new Error('请输入有效的身份证号'))
  }
}

const validateNumber = (rule, value, callback) => {
  if (isNumber(value)) {
    callback()
  } else {
    callback(new Error('请输入有效的数字'))
  }
}

const validateEnglish = (rule, value, callback) => {
  if (isEnglish(value)) {
    callback()
  } else {
    callback(new Error('请输入有效的英文字符'))
  }
}

const validateChinese = (rule, value, callback) => {
  if (isChinese(value)) {
    callback()
  } else {
    callback(new Error('请输入有效的中文字符'))
  }
}

const validateUrl = (rule, value, callback) => {
  if (isUrl(value)) {
    callback()
  } else {
    callback(new Error('请输入有效的URL'))
  }
}
const validateCars = (rule, value, callback) => {
  if (isCars(value)) {
    callback()
  } else {
    callback(new Error('请输入有效的车牌号'))
  }
}
const form1Ref = ref(null)
const form1 = ref({
  required: '',
  length: '',
  type: '',
  range: '',
  enum: '',
  custom: '',
  async: '',
})
const rules = ref({
  required: [{ required: true, message: '请填写必填项' }],
  length: [{ required: true, len: 3, message: '长度需为3位' }],
  type: [{ required: true, type: 'email', message: '类型需为email' }],
  range: [{ required: true, min: 3, max: 5, message: '范围在3至5位' }],
  enum: [{ required: true, type: 'enum', enum: ['admin', 'user', 'guest'], message: '请填写admin，user，guest其一' }],
  custom: [
    {
      required: true,
      validator: (rule, value) => {
        return value === '1'
      },
      message: '请填写数字1',
      trigger: 'blur',
    },
  ],
  async: [
    {
      required: true,
      validator: (rule, value, callback) => {
        proxy.$api.demo.ver.get({ value: value }).then((res) => {
          if (res.data !== value) {
            return callback(new Error('请输入最新版本号：' + res.data))
          }
          callback()
        })
      },
      trigger: 'blur',
    },
  ],
})

const form2Ref = ref(null)
const form2 = ref({
  email: '',
  phone: '',
  idCard: '',
  number: '',
  english: '',
  chinese: '',
  url: '',
  cars: '',
})
const rules2 = ref({
  email: [
    { required: true, message: '请输入邮箱地址', trigger: 'blur' },
    { validator: validateEmail, trigger: 'blur' },
  ],
  phone: [
    { required: true, message: '请输入手机号码', trigger: 'blur' },
    { validator: validatePhone, trigger: 'blur' },
  ],
  idCard: [
    { required: true, message: '请输入身份证号码', trigger: 'blur' },
    { validator: validateIdCard, trigger: 'blur' },
  ],
  number: [
    { required: true, message: '请输入数字', trigger: 'blur' },
    { validator: validateNumber, trigger: 'blur' },
  ],
  english: [
    { required: true, message: '请输入英文字符', trigger: 'blur' },
    { validator: validateEnglish, trigger: 'blur' },
  ],
  chinese: [
    { required: true, message: '请输入中文字符', trigger: 'blur' },
    { validator: validateChinese, trigger: 'blur' },
  ],
  url: [
    { required: true, message: '请输入URL', trigger: 'blur' },
    { validator: validateUrl, trigger: 'blur' },
  ],
  cars: [
    { required: true, message: '请输入车牌号', trigger: 'blur' },
    { validator: validateCars, trigger: 'blur' },
  ],
})

const resetForm1 = () => {
  form1Ref.value?.resetFields()
}
const submitForm1 = () => {
  form1Ref.value?.validate((valid) => {
    if (valid) {
      ElMessage.success('全部验证通过')
    } else {
      return false
    }
  })
}

const resetForm2 = () => {
  form2Ref.value?.resetFields()
}
const submitForm2 = () => {
  form2Ref.value?.validate((valid) => {
    if (valid) {
      ElMessage.success('全部验证通过')
    } else {
      return false
    }
  })
}
</script>
