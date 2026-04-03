<template>
  <el-form ref="formsRef" class="login-form" :model="forms" :rules="rules" label-width="0" size="large"
    @keyup.enter="handleLogin">
    <el-form-item prop="username">
      <el-input v-model="forms.username" prefix-icon="ri-user-line"
        :placeholder="$t('ec.user.login.form.input.placeholder.username')" />
    </el-form-item>
    <el-form-item prop="password">
      <el-input v-model="forms.password" prefix-icon="ri-lock-line" show-password
        :placeholder="$t('ec.user.login.form.input.placeholder.password')" />
    </el-form-item>
    <el-form-item>
      <base-verify-slider ref="verifyRef" @verify="getVerifyCode" />
      <div v-if="verify.failed" class="el-form-item__error">{{ $t('ec.user.login.form.verify.text.error') }}</div>
    </el-form-item>
    <el-form-item>
      <el-row class="flex-fill" style="line-height: 24px">
        <el-col :span="12">
          <el-checkbox v-model="forms.remember" :label="$t('ec.user.login.help.text.remember')" />
        </el-col>
        <el-col :span="12" class="text-right">
          <el-link underline="never" @click="router.push('/password')">{{ $t('ec.user.login.help.text.forget') }}</el-link>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item>
      <el-button class="width-100" type="primary" :loading="logined" @click="handleLogin">{{
        $t('ec.user.login.form.button.text.login') }}</el-button>
    </el-form-item>
  </el-form>
</template>
<script setup>
import md5 from 'js-md5'
import { ref, getCurrentInstance } from 'vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { useAuthorizeStore } from '@/stores/modules/authorizeStore'
import { useRouter } from 'vue-router'
import BaseVerifySlider from '@/components/BaseVerifySlider'
import { apiUserLogin, apiUtilsSendSlideCode } from '@/services/modules/bspService'
const { proxy } = getCurrentInstance()

const router = useRouter()

const forms = ref({
  username: 'eam_figma_demo',
  password: '123456',
  remember: false,
})
const rules = ref({
  username: [{ required: true, message: proxy.$t('ec.user.login.form.input.rules.username'), trigger: 'blur' }],
  password: [{ required: true, message: proxy.$t('ec.user.login.form.input.rules.password'), trigger: 'blur' }],
})

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
const formsRef = ref(null)

const handleLogin = async () => {
  const validate = await formsRef.value.validate().catch(() => { })
  if (!validate) return false
  if (!verify.value.status) {
    verify.value.failed = true
    return false
  }

  try {
    logined.value = true
    const params = {
      username: forms.value.username,
      password: md5(forms.value.password),
      appCode: import.meta.env.VITE_APP_CODE,
      remember: forms.value.remember,
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
<style lang="scss" scoped>
.el-link {
  display: flex;
  justify-content: flex-end;
}
</style>
