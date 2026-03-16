<template>
  <div class="ec-password-strength">
    <div class="ec-password-strength-bar" :class="`ec-password-strength-level-${level}`"></div>
  </div>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue'
const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
})
const level = ref(0)
const strength = (v) => {
  let _level = 0
  if (v.length <= 0) {
    _level = 0
    level.value = _level
    return false
  }
  // 检查长度
  if (v.length < 6) {
    _level = 1
    level.value = _level
    return false
  }
  // 检查包含数字
  if (/\d/.test(v)) _level += 1

  // 检查包含小写英文
  if (/[a-z]/.test(v)) _level += 1

  // 检查包含大写英文
  if (/[A-Z]/.test(v)) _level += 1

  // 检查没有连续的字符3位
  if (!/(\w)\1{2}/.test(v)) _level += 1

  // 检查包含特殊字符
  if (/[`~!@#$%^&*()_+<>?:"{},./;'[\]]/.test(v)) _level += 1

  level.value = _level
}
watch(() => props.modelValue, (n) => {
  strength(n)
})

onMounted(() => {
  strength(props.modelValue)
})
</script>


<style scoped>
.ec-password-strength {
  height: 5px;
  width: 100%;
  background: var(--el-color-info-light-5);
  border-radius: var(--el-border-radius-base);
  position: relative;
  margin: 12px 0;
}

.ec-password-strength:before {
  left: 20%;
}

.ec-password-strength:after {
  right: 20%;
}

.ec-password-strength:before,
.ec-password-strength:after {
  position: absolute;
  content: '';
  display: block;
  width: 20%;
  height: inherit;
  border: 5px solid var(--el-bg-color-overlay);
  border-top: 0;
  border-bottom: 0;
  z-index: 1;
  background-color: transparent;
  box-sizing: border-box;
}

.ec-password-strength-bar {
  position: absolute;
  height: inherit;
  width: 0%;
  border-radius: inherit;
  transition:
    width 0.5s ease-in-out,
    background 0.25s;
  background: transparent;
}

.ec-password-strength-level-1 {
  width: 20%;
  background-color: var(--el-color-error);
}

.ec-password-strength-level-2 {
  width: 40%;
  background-color: var(--el-color-error);
}

.ec-password-strength-level-3 {
  width: 60%;
  background-color: var(--el-color-warning);
}

.ec-password-strength-level-4 {
  width: 80%;
  background-color: var(--el-color-success);
}

.ec-password-strength-level-5 {
  width: 100%;
  background-color: var(--el-color-success);
}
</style>
