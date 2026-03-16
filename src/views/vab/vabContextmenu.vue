<template>
  <el-card :header="$t('ec.menu.name.vabContextmenu')">
    <div @contextmenu.prevent="openMenu" style="height:480px;background: #f1f3f7;display: flex;flex-direction: column;align-items: center;justify-content: center;color: #999;">
      试试看在上下左右四个角落右键，看看边缘位置修正效果
    </div>
  </el-card>
  <ec-contextmenu ref="contextmenuRef" @command="handleCommand" @visible-change="visibleChange">
    <ec-contextmenu-item command="a" title="返回(B)" suffix="Alt+←" icon="ri ri-arrow-left-line" />
    <ec-contextmenu-item command="b" title="重新加载(R)" suffix="Ctrl+R" />
    <ec-contextmenu-item title="测试层级菜单" divided icon="ri ri-pushpin-fill">
      <ec-contextmenu-item command="c1" title="二级菜单" icon="ri ri-pushpin-fill" />
      <ec-contextmenu-item title="二级菜单菜单" icon="ri ri-pushpin-fill">
        <ec-contextmenu-item command="c2-1" title="三级菜单" />
        <ec-contextmenu-item command="c2-2" title="三级菜单菜单" />
        <ec-contextmenu-item command="c2-3" title="三级菜单" />
      </ec-contextmenu-item>
      <ec-contextmenu-item command="c3" title="二级菜单" icon="ri ri-pushpin-fill" />
    </ec-contextmenu-item>
    <ec-contextmenu-item  command="d" title="更改墙纸" suffix="高清壁纸" divided />
    <ec-contextmenu-item  command="e" title="设置state=1" />
  </ec-contextmenu>
</template>

<script setup>
import { ref } from 'vue'
import EcContextmenu from '@/components/EcContextmenu'
import EcContextmenuItem from '@/components/EcContextmenu/item'
defineOptions({
  name: 'vabContextmenu',
})
const contextmenuRef = ref(null)
const openMenu = (e) => {
  contextmenuRef.value.open(e)
}
const handleCommand = (command) => {
  alert(command)
}
const visibleChange = (visible) => {
  console.log(visible)
}
</script>

<style lang="scss" scoped></style>
