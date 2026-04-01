<template>
  <el-form ref="formsRef" class="login-form" :model="forms" :rules="rules" label-width="0" size="large" @keyup.enter="handleLogin">
    <el-form-item prop="phone">
      <el-input v-model="forms.phone" prefix-icon="ri-cellphone-line" :placeholder="$t('ec.user.login.form.input.placeholder.phone')" />
    </el-form-item>
    <el-form-item prop="code">
      <el-input v-model="forms.code" prefix-icon="ri-lock-line" :placeholder="$t('ec.user.login.form.input.placeholder.code')">
        <template #suffix>
          <el-button link type="info" :disabled="disabled" @click="getPhoneCode">
            {{ $t('ec.user.login.form.input.code.text.start') }}<span v-if="disabled"> ({{ time }})</span>
          </el-button>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item>
      <base-verify-slider ref="verifyRef" @verify="getVerifyCode" />
      <div v-if="verify.failed" class="el-form-item__error">{{ $t('ec.user.login.form.verify.text.error') }}</div>
    </el-form-item>
    <el-form-item>
      <el-button type="primary" style="width: 100%" :loading="logined" @click="handleLogin">{{ $t('ec.user.login.form.button.text.login') }}</el-button>
    </el-form-item>
    <!-- <div class="login-reg">
      {{ $t('ec.user.login.help.text.noAccount') }} <router-link to="/register">{{ $t('ec.user.login.help.text.createAccount') }}</router-link>
    </div> -->
  </el-form>
</template>
<script setup>
import { ref, watch, getCurrentInstance } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { isPhone } from '@/utils/verificate'
import BaseVerifySlider from '@/components/BaseVerifySlider'
import { useAuthorizeStore } from '@/stores/modules/authorizeStore'

import { apiUserLogin, apiUtilsSendSlideCode } from '@/services/modules/bspService'
import { useRouter } from 'vue-router'
const router = useRouter()
const { proxy } = getCurrentInstance()
const validatePhone = (rule, value, callback) => {
  if (isPhone(value)) {
    callback()
  } else {
    callback(new Error(proxy.$t('ec.user.login.form.input.rules.phone')))
  }
}
const forms = ref({
  phone: '18888888888',
  code: 'HGK8',
})
const rules = ref({
  phone: [
    { required: true, message: proxy.$t('ec.user.login.form.input.rules.phone') },
    { validator: validatePhone, trigger: 'blur', message: proxy.$t('ec.user.login.form.input.rules.phone') },
  ],
  code: [{ required: true, message: proxy.$t('ec.user.login.form.input.rules.code') }],
})
const disabled = ref(false)
const time = ref(0)
const logined = ref(false)
const verifyRef = ref(null)
const verify = ref({
  status: false,
  failed: false
})
const getVerifyCode = async () => {
  try {
    const { flag } = await apiUtilsSendSlideCode()
    if (!flag) return verifyRef.value.fail()
    verify.value.status = true
    verify.value.failed = false
    verifyRef.value.success()
  } catch (e) {
    verify.value.status = false
    verifyRef.value.fail()
  }
}

const resetVerifyCode = () => {
  verify.value.status = false
  verify.value.failed = false
  verifyRef.value?.reset()
}
const getPhoneCode = async () => {
  const validate = await formsRef.value.validateField('phone').catch(() => {})
  if (!validate) {
    return false
  }
  ElMessage.success(proxy.$t('ec.user.login.alert.title.success'))
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
const formsRef = ref(null)
const handleLogin = async () => {
  const validate = await formsRef.value.validate().catch(() => {})
  if (!validate) return false
  if (!verify.value.status) {
    verify.value.failed = true
    return false
  }
  try {
    logined.value = true
    const params = {
      username: 'eam_demo',
      password: 'e10adc3949ba59abbe56e057f20f883e',
      appCode: import.meta.env.VITE_APP_CODE,
      remember: true,
    }
    const res = await apiUserLogin(params)
    logined.value = false
    if (!res.flag) return ElMessageBox.alert(res.msg, '登录失败', { type: 'error', confirmButtonText: '确定', callback: () => resetVerifyCode() })
    const { Login } = useAuthorizeStore()
    await Login(res)
    router.replace({ path: '/' })
  } catch (e) {
    logined.value = false
    ElMessage.error(e.name + ':' + e.message)
    resetVerifyCode()
  }
}
</script>
