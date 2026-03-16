<template>
  <el-card header="打开">
    <el-button type="primary" plain @click="router.push('/setting/settingAccount')">打开个人信息</el-button>
    <el-button type="primary" plain @click="openNext">打开后执行</el-button>
    <el-alert title="打开后执行: 路由push时,在当前路由对象中插入一个特殊标识, 在目标路由对象中获取判断是否需要执行特殊方法，请查看控制台打印结果。" />
  </el-card>
  <el-card header="刷新">
    <el-button type="primary" plain @click="Tabs.refresh()">刷新当前</el-button>
  </el-card>
  <el-card header="关闭">
    <el-button type="primary" plain @click="Tabs.close()">关闭当前</el-button>
    <el-button type="primary" plain @click="Tabs.closeOther()">关闭其他</el-button>
    <el-button type="primary" plain @click="closeNext">关闭后执行</el-button>
    <el-alert title="关闭后执行：回调返回所有标签的数组，请查看控制台打印结果。" />
  </el-card>
  <el-card header="设置">
    <el-form :inline="true">
      <el-form-item>
        <el-input v-model="input" placeholder="请输入内容"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" plain @click="Tabs.setTitle(input)">设置标题</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card header="整页路由">
    <el-button type="primary" plain @click="router.push('/other/otherFullpage')">fullpage</el-button>
    <el-alert title="变更路由的层级关系,向上推至顶级达到在layout视图中显示. 只需要在路由中设置 meta.fullpage 即可" />
  </el-card>
</template>
<script setup>
import { ref, onMounted, getCurrentInstance } from 'vue'
import Tabs from '@/utils/tabs'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
const input = ref('')
const openNext = () => {
  route.is = true
  console.log(route)
}
const closeNext = () => {
  Tabs.closeNext((tags) => {
    //回调返回所有标签的数组
    console.log(tags)
    router.push('/')
    route.is = true
  })
}
</script>
<style lang="scss" scoped>
.el-alert {
  margin-top: 16px;
}
</style>
