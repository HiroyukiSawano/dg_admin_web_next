<template>
  <el-row :gutter="0">
    <el-col :lg="{ span: 12, offset: 6 }">
      <el-card>
        <template #header>
          <div class="el-card__title">重置密码</div>
          <div class="el-card__action">
            <el-link underline="never" type="info" icon="ri-close-large-line" @click="router.replace('/login')" />
          </div>
        </template>
        <el-form v-if="active === 0" ref="formsRef" :model="forms" :rules="rules" :label-width="120">
          <el-form-item label="登录账号" prop="user">
            <el-input v-model="forms.user" placeholder="请输入注册时填写的登录账号"></el-input>
          </el-form-item>
          <el-form-item label="手机号码" prop="phone">
            <el-input v-model="forms.phone" placeholder="请输入手机号码"></el-input>
          </el-form-item>
          <el-form-item label="短信验证码" prop="code">
            <el-input v-model="forms.code" placeholder="请输入6位短信验证码">
              <template #suffix>
                <el-button link type="info" :disabled="disabled" @click="getPhoneCode">
                  获取验证码<span v-if="disabled"> ({{ time }})</span>
                </el-button>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item label="新密码" prop="newpw">
            <el-input v-model="forms.newpw" show-password placeholder="请输入新密码"></el-input>
          </el-form-item>
          <el-form-item label="确认新密码" prop="newpw2">
            <el-input v-model="forms.newpw2" show-password placeholder="请再一次输入新密码"></el-input>
          </el-form-item>

          <el-form-item>
            <el-button type="primary" @click="handleFormSave">提交</el-button>
          </el-form-item>
        </el-form>
        <el-result v-if="active == 1" icon="success" title="密码重置成功" sub-title="请牢记自己的新密码,返回登录后使用新密码登录">
          <template #extra>
            <el-button type="primary" @click="router.replace('/login')">返回登录</el-button>
          </template>
        </el-result>
      </el-card>
    </el-col>
  </el-row>
</template>
<script setup>
import { ref, watch, getCurrentInstance } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
const router = useRouter()
const active = ref(0)
const forms = ref({
  user: '',
  phone: '',
  code: '',
  newpw: '',
  newpw2: '',
})
const rules = ref({
  user: [{ required: true, message: '请输入登录账号' }],
  phone: [{ required: true, message: '请输入手机号' }],
  code: [{ required: true, message: '请输入短信验证码' }],
  newpw: [{ required: true, message: '请输入新的密码' }],
  newpw2: [
    { required: true, message: '请再次输入新的密码' },
    {
      validator: (rule, value, callback) => {
        if (value !== forms.value.newpw) {
          callback(new Error('两次输入密码不一致'))
        } else {
          callback()
        }
      },
    },
  ],
})
const disabled = ref(false)
const time = ref(0)
const formsRef = ref(null)
const getPhoneCode = async () => {
  const validate = await formsRef.value.validateField('phone').catch(() => {})
  if (!validate) return false
  ElMessage.success('已发送短信至手机号码')
  disabled.value = true
  time.value = 60
  const t = setInterval(() => {
    time.value -= 1
    if (time.value < 1) {
      clearInterval(t)
      disabled.value = false
      time.value = 0
    }
  }, 1000)
}
const handleFormSave = async() => {
  const validate = await formsRef.value.validate().catch(() => {})
  if (!validate) return false
  active.value = 1
}
</script>

<style lang="scss" scoped>
.el-card {
  width: 100%;
}
.el-row {
  padding: 16px;
  height: 100%;
  .el-col {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
