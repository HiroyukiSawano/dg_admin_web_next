<template>
  <el-row :gutter="16">
    <el-col :lg="12">
      <el-card :header="$t('ec.menu.name.vabPasswordGenerator')">
        <el-form :model="password.config" label-position="top" label-width="auto">
          <el-form-item label="包含数字">
            <el-switch v-model="password.config.numbers" />
          </el-form-item>
          <el-form-item label="包含大写字母">
            <el-switch v-model="password.config.uppercase" />
          </el-form-item>
          <el-form-item label="包含小写字母">
            <el-switch v-model="password.config.lowercase" />
          </el-form-item>
          <el-form-item label="包含符号">
            <el-switch v-model="password.config.symbols" />
          </el-form-item>
          <el-form-item label="密码长度">
            <el-input-number v-model="password.config.length" :max="32" :min="6" controls-position="right" style="width: 100%;" />
          </el-form-item>
          <el-form-item label="结果">
            <el-input v-model="password.text" readonly />
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="handleGeneratePassword">生成密码</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
    <el-col :lg="12">
      <el-card  :header="$t('ec.menu.name.vabIdGenerator')">
        <el-form :model="uuid.config" label-position="top" label-width="auto">
          <el-form-item label="包含数字">
            <el-switch v-model="uuid.config.numbers" />
          </el-form-item>
          <el-form-item label="包含字母">
            <el-switch v-model="uuid.config.letters" />
          </el-form-item>
          <el-form-item label="包含大写字母">
            <el-switch v-model="uuid.config.uppercase" :disabled="!uuid.config.letters" />
          </el-form-item>
          <el-form-item label="包含连字符">
            <el-switch v-model="uuid.config.hyphens" />
          </el-form-item>
          <el-form-item label="连字符样式">
            <el-input v-model="uuid.config.hyphensStyle" />
          </el-form-item>
          <el-form-item label="结果">
            <el-input v-model="uuid.text" readonly />
          </el-form-item>
          <el-form-item label="">
            <el-button type="primary" @click="handleGenerateId">生成ID</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>

</template>

<script setup>
import { ref } from 'vue'
defineOptions({
  name: 'vabPasswordGenerator',
})

const password = ref({
  text: '',
  config: {
    length: 16,
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: false,
  }
})
const uuid = ref({
  config: {
    numbers: true,
    letters: true,
    uppercase: false,
    hyphens: true,
    hyphensStyle: '-',
  },
  text: '',
})
const handleGeneratePassword = () => {
  let characters = ''
  let text = ''

  if (password.value.config.uppercase) characters += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
  if (password.value.config.lowercase) characters += 'abcdefghijklmnopqrstuvwxyz'
  if (password.value.config.numbers) characters += '0123456789'
  if (password.value.config.symbols) characters += '!@#$%^&*()_+~`|}{[]:;?><,./-='
  for (let i = 0; i < password.value.config.length; i++) {
    const idx = Math.floor(Math.random() * characters.length)
    text += characters.charAt(idx)
  }
  password.value.text = text
}
const handleGenerateId = () => {
  let characters = []
  if (uuid.value.config.numbers) characters.push(...'0123456789')
  if (uuid.value.config.letters) {
    const letters = uuid.value.config.uppercase ? 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' : 'abcdefghijklmnopqrstuvwxyz'
    characters.push(...letters)
  }

  if (characters.length === 0) return
  const segments = [8, 4, 4, 4, 12]
  const parts = segments.map(length => {
    return Array.from({ length }, () => {
    const idx = Math.floor(Math.random() * characters.length)
    return characters[idx]
  }).join('')
  })
  uuid.value.text = uuid.value.config.hyphens ? parts.join(uuid.value.config.hyphensStyle) : parts.join('')
}
</script>

<style lang="scss" scoped></style>
