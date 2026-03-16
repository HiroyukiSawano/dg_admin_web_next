<template>
  <div>
    <el-card header="虚拟键盘">
      <el-input v-model="keyword" clearable placeholder="请输入关键字查询" prefix-icon="ri-search-2-line" @focus="keyboard.open($event.target)" />
    </el-card>

  </div>
  <ec-virtual-keyboard @close="keyboard.close" @change="keyboard.change" v-model:visible="keyboard.visible" v-model:value="keyboard.text" />
</template>
<script setup>
import { ref } from 'vue'
import EcVirtualKeyboard from '@/components/EcVirtualKeyboard'
import { useVirtualKeyboardHook } from '@/hooks/virtualKeyboardHook'
defineOptions({
  name: 'vabVirtualKeyboard',
})
const keyword = ref('')
const keyboard = useVirtualKeyboardHook()
</script>

<style lang="scss" scoped>

</style>
