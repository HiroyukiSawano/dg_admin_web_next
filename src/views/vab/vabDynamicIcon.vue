<template>
  <div>
    <el-row :gutter="16" class="el-media-group">
      <el-col :lg="12" v-for="item, index in datas" :key="index" @mouseenter="handleMouseenter(item.id)" @mouseleave="handleMouseleave(item.id)">
        <div class="el-media">
          <div class="el-media__icon">
            <ec-dynamic-icon :ref="el => dynamicIconRefs[item.id] = el" :size="60" :frame="17" :speed="25" :icon="item.icon" />
          </div>
          <div class="el-media__content">
            <div class="el-media__title">{{ item.name }}</div>
            <div class="el-media__description">{{ item.remark }}</div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>
<script setup>
import { ref, getCurrentInstance } from 'vue'
import EcDynamicIcon from '@/components/EcDynamicIcon'
defineOptions({ name: 'vabDynamicIcon' })
const { proxy } = getCurrentInstance()
const datas = ref([
  {
    id: '1',
    name: proxy.$translate('ec.vab.dynamicIcon.well.title.gxnjspt', { 'en': { 'ec.vab.dynamicIcon.well.title.gxnjspt': 'Computing Platform' }, 'zh-CN': { 'ec.vab.dynamicIcon.well.title.gxnjspt': '高性能计算平台' } }),
    remark: proxy.$translate('ec.vab.dynamicIcon.well.remark.gxnjspt', { 'en': { 'ec.vab.dynamicIcon.well.remark.gxnjspt': 'A flexible, high-performance, and self-service computing resource management service that meets the demand for elastic use of high-performance computing resources on the cloud.' }, 'zh-CN': { 'ec.vab.dynamicIcon.well.remark.gxnjspt': '弹性灵活、性能卓越、自助化的计算资源管理服务，实现弹性使用云上高性能计算资源的需求。' } }),
    icon: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/f5d2c320b9117095c68f9853779d7193.png',

  },
  {
    id: '2',
    name: proxy.$translate('ec.vab.dynamicIcon.well.title.gxnjsjq', { 'en': { 'ec.vab.dynamicIcon.well.title.gxnjsjq': 'Computing Cluster' }, 'zh-CN': { 'ec.vab.dynamicIcon.well.title.gxnjsjq': '高性能计算集群' } }),
    remark: proxy.$translate('ec.vab.dynamicIcon.well.remark.gxnjsjq', { 'en': { 'ec.vab.dynamicIcon.well.remark.gxnjsjq': 'Using bare metal cloud servers as nodes and interconnected through RDMA, high bandwidth and extremely low latency network services are provided, significantly improving network performance.' }, 'zh-CN': { 'ec.vab.dynamicIcon.well.remark.gxnjsjq': '以裸金属云服务器为节点，通过 RDMA互联，提供高带宽和极低延迟的网络服务，大幅提升网络性能。' } }),
    icon: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/9bc9d025a86d93d0b05012b5e40d2486.png',
  },
  {
    id: '3',
    name: proxy.$translate('ec.vab.dynamicIcon.well.title.dzkpdmx', { 'en': { 'ec.vab.dynamicIcon.well.title.dzkpdmx': 'Earthquake Model' }, 'zh-CN': { 'ec.vab.dynamicIcon.well.title.dzkpdmx': '地震科普大模型' } }),
    remark: proxy.$translate('ec.vab.dynamicIcon.well.remark.dzkpdmx', { 'en': { 'ec.vab.dynamicIcon.well.remark.dzkpdmx': 'The Earthquake Science Popularization Model is an interactive application dedicated to earthquake science education, aimed at enhancing the publics understanding of earthquake science and emergency response capabilities' }, 'zh-CN': { 'ec.vab.dynamicIcon.well.remark.dzkpdmx': '地震科普大模型是一款专注于地震科学教育的互动式应用程序，旨在提升公众在地震科学认识和紧急应对能力方面的水平' } }),
    icon: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/4f6ef63f1591cb1b3e6de65996c81ee3.png',
  },
  {
    id: '4',
    name: proxy.$translate('ec.vab.dynamicIcon.well.title.pljs', { 'en': { 'ec.vab.dynamicIcon.well.title.pljs': 'Batch Calculation' }, 'zh-CN': { 'ec.vab.dynamicIcon.well.title.pljs': '批量计算' } }),
    remark: proxy.$translate('ec.vab.dynamicIcon.well.remark.pljs', { 'en': { 'ec.vab.dynamicIcon.well.remark.pljs': 'A low-cost distributed computing platform that intelligently mobilizes resources to handle tasks of any scale' }, 'zh-CN': { 'ec.vab.dynamicIcon.well.remark.pljs': '智能调动资源以处理任意规模作业的低成本分布式计算平台' } }),
    icon: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/2fe5dfa0cb4100db9d7bb3bb0820b903.png',
  },
  {
    id: '5',
    name: proxy.$translate('ec.vab.dynamicIcon.well.title.gxnyyfw', { 'en': { 'ec.vab.dynamicIcon.well.title.gxnyyfw': 'Application Services' }, 'zh-CN': { 'ec.vab.dynamicIcon.well.title.gxnyyfw': '高性能应用服务' } }),
    remark: proxy.$translate('ec.vab.dynamicIcon.well.remark.gxnyyfw', { 'en': { 'ec.vab.dynamicIcon.well.remark.gxnyyfw': 'A GPU application service product for AI and scientific computing, providing plug and play computing power and common environments to help small and medium-sized enterprises and developers quickly deploy LLM' }, 'zh-CN': { 'ec.vab.dynamicIcon.well.remark.gxnyyfw': '一款面向 AI 、科学计算 的GPU 应用服务产品，提供即插即用的澎湃算力与常见环境，助力中小企业及开发者快速部署LLM' } }),
    icon: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/a98b44a2cc33c061fc1c7fe483710cf4.png',
  },
  {
    id: '6',
    name: proxy.$translate('ec.vab.dynamicIcon.well.title.yysjjfw', { 'en': { 'ec.vab.dynamicIcon.well.title.yysjjfw': 'Audio Dataset Service' }, 'zh-CN': { 'ec.vab.dynamicIcon.well.title.yysjjfw': '语音数据集服务' } }),
    remark: proxy.$translate('ec.vab.dynamicIcon.well.remark.yysjjfw', { 'en': { 'ec.vab.dynamicIcon.well.remark.yysjjfw': 'With advanced AI voice interaction technology and high-precision data acquisition and processing technology in the industry, we innovatively create voice interaction solutions for multi scenario applications, including voice synthesis and recognition for general scenarios, as well as voice technology products such as TTS timbre customization, sound replication, emotion synthesis, and sound conversion' }, 'zh-CN': { 'ec.vab.dynamicIcon.well.remark.yysjjfw': '拥有业内先进的AI语音交互技术及高精度数据采标处理技术，创新打造多场景应用的语音交互方案，包括通用场景的语音合成和语音识别，以及TTS音色定制，声音复刻，情感合成和声音转换在内的语音技术产品' } }),
    icon: 'http://10.110.96.44/demo/dg-admin-web-vue3/picbed/6871efce99c5771324c42303c913dd20.png',
  },
])
const dynamicIconRefs = ref({})
const handleMouseenter = (id) => {
  const icon = dynamicIconRefs.value[id]
  icon?.over()
}

const handleMouseleave = (id) => {
  const icon = dynamicIconRefs.value[id]
  icon?.leave()
}
</script>
<style lang="scss" scoped>
.el-media-group {
  .el-media {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 240px;
    padding: 0 24px;
    margin-bottom: 16px;
    background-color: var(--el-fill-color-blank);;
    text-align: center;
    border-radius: var(--el-border-radius-base);
    box-shadow: var(--el-box-shadow-lighter);
    transition: .3s;
    overflow: hidden;

    cursor: pointer;
    &:hover {
      color: var(--el-color-primary);
      background-color: var(--el-color-primary-light-9);
    }
    .el-media__icon {
      margin-top: -8px;
    }
    .el-media__title {
      margin-bottom: 8px;
      font-size: 16px;
      font-weight: 500;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
      word-break: break-all;
    }
    .el-media__description {
      height: 40px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
      opacity: .5;
      // color: var(--el-text-color-secondary);
      // color: color-mix(in srgb, var(--el-text-color-primary) 50%, transparent);

    }
  }
}
</style>
