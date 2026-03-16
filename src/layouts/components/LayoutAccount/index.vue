<template>
  <el-drawer :title="$t('ec.user.dropdowm.item.text.account')" :size="320" append-to-body destroy-on-close @close="emits('update:modelValue', false)">
    <el-form ref="formsRef" :show-message="false" :model="forms" :rules="rules" label-width="auto" label-position="top">
      <el-form-item :label="$t('ec.user.account.password.form.label.current')" prop="currentPwd">
        <el-input v-model="forms.currentPwd" type="password" show-password :placeholder="$t('ec.user.account.password.form.placeholder.current')" />
      </el-form-item>
      <el-form-item :label="$t('ec.user.account.password.form.label.new')" prop="newPwd">
        <el-input v-model="forms.newPwd" type="password" show-password :placeholder="$t('ec.user.account.password.form.placeholder.new')" />
      </el-form-item>
      <el-form-item :label="$t('ec.user.account.password.form.label.confirm')" prop="repeatPwd">
        <el-input v-model="forms.repeatPwd" type="password" show-password :placeholder="$t('ec.user.account.password.form.placeholder.confirm')" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button class="flex-1" @click="emits('update:modelValue', false)">{{ $t('ec.global.button.text.cancel')}}</el-button>
      <el-button type="primary" class="flex-1" @click="handleSubmitForm">{{ $t('ec.global.button.text.submit')}}</el-button>
    </template>
  </el-drawer>
</template>
<script setup>
import { ref, getCurrentInstance } from 'vue'
import { ElMessageBox, ElNotification } from 'element-plus'
import { useRouter } from 'vue-router'
import md5 from 'js-md5'
import { apiUserModifyPwd } from '@/services/modules/bspService'
import { useAuthorizeStore } from '@/stores/modules/authorizeStore'
import { AUTH_ENABLED } from '@/configs'
const { proxy } = getCurrentInstance()
const emits = defineEmits(['update:modelValue'])
const router = useRouter()
const forms = ref({
  currentPwd: '',
  newPwd: '',
  repeatPwd: '',
})
const rules = ref({
  currentPwd: [{ required: true, message: proxy.$t('ec.user.account.password.form.placeholder.current') }],
  newPwd: [{ required: true, message: proxy.$t('ec.user.account.password.form.placeholder.new') }],
  repeatPwd: [
    { required: true, message: proxy.$t('ec.user.account.password.form.placeholder.confirm') },
    {
      validator: (rule, value, callback) => {
        if (value !== forms.value.newPwd) {
          callback(new Error('两次输入密码不一致！'))
        } else {
          callback()
        }
      },
    },
  ],
})
const formsRef = ref(null)
const handleSubmitForm = () => {
  formsRef.value.validate(async (valid) => {
    if (valid) {
      const _forms = { ...forms.value }
      try {
        const res = await apiUserModifyPwd(md5.hex(_forms.currentPwd), md5.hex(_forms.newPwd))
        console.log(res)
        if (res.flag) {
          // ElNotification.success(proxy.$t('ec.user.account.password.alert.success'))
          ElMessageBox.alert(proxy.$t('ec.user.account.password.alert.jumpping'), proxy.$t('ec.user.account.password.alert.success'), {
            type: 'success',
            center: true,
          }).then(async () => {
            const { Logout } = useAuthorizeStore()
            Logout()
            router.replace({ path: AUTH_ENABLED ? '/login' : '/' })
          })
            .catch(() => { })
        } else {
          ElNotification.error(res.msg)
        }
      } catch (e) {
        ElNotification.error(proxy.$t('ec.user.account.password.alert.failed'))
      }
    } else {
      return false
    }
  })
}
</script>

<style lang="scss" scoped>
</style>
