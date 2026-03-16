<template>
  <el-card header="基本使用">
    <ec-chat-thought-chain :thinking-items="thinkingItems" row-key="id" />
  </el-card>
  <el-card header="插槽">
    <ec-chat-thought-chain :thinking-items="thinkingItems" row-key="id">
      <template #icon="{ item }">
        <el-button v-if="item.status === 'success'" type="success" icon="ri-share-line" circle />
        <el-button v-if="item.status === 'loading'" type="warning" loading circle>
          <template #loading>
            <el-icon class="ri-loader-4-line is-loading" />
          </template>
        </el-button>
        <el-button v-if="item.status === 'error'" type="danger" icon="ri-flashlight-line" circle />
        <el-button v-if="item.status === 'cancel'" icon="ri-pushpin-2-line" color="#5319c6" circle />
      </template>
    </ec-chat-thought-chain>
  </el-card>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import EcChatThoughtChain from '@/components/EcChat/components/EcChatThoughtChain/index.vue'
defineOptions({ name: 'chatThoughtChain' })
const thinkingItems = ref([
  {
    id: 'p6ropryo-7kb9-gtnt-tx76-sgskk4prtfmu',
    status: 'success',
    typing: true,
    isCanExpand: true,
    isDefaultExpand: true,
    title: '深度思考已完成',
    thinkTitle: '完整呈现黑暗森林法则的逻辑',
    thinkContent:
      '宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼：他必须小心，因为林中到处都有与他一样潜行的猎人，如果他发现了别的生命，不管是不是猎人，不管是天使还是魔鬼，不管是娇嫩的婴儿还是年迈的女神，都不会有任何犹豫，开枪消灭他。',
  },
  {
    id: 'h0zewflt-40z3-984y-talm-eko4rpdxoiri',
    title: '深度思考中...',
    status: 'loading',
    isCanExpand: true,
    isDefaultExpand: false,
    thinkTitle: '猜疑链是黑暗森林的基础',
    thinkContent: '站在红岸基地的高台上，望着远处的山峦，心中充满了绝望。她知道，自己正在打开一个潘多拉魔盒，但已经无法回头。但需要更长的。',
  },
  {
    id: 'frdhfwrm-oml2-gt3t-47vd-u6pw0obg4dwu',
    title: '深度思考遇到问题',
    status: 'error',
    isCanExpand: true,
    isDefaultExpand: false,
    thinkTitle: '因为正确的事不一定能带来好的结果，有时候，正确的事反而会带来最坏的结果。',
    thinkContent: '罗辑在思考宇宙社会学的公理时，突然意识到：技术爆炸的存在，使得任何文明都可能在短时间内超越其他文明，因此，一旦发现对方，必须立即消灭。这导致了猜疑链的形成',
  },
  {
    id: 'z0sgotdc-84ct-qtrz-eg3z-83foin93wjgk',
    title: '深度思考已中断！！！',
    status: 'cancel',
    isCanExpand: true,
    isDefaultExpand: true,
    thinkTitle: '宇宙文明不断增长和扩张宇宙中的物质总量保持不变。',
    thinkContent: '宇宙中的文明之间，必然存在猜疑链和技术爆炸，因此，文明之间的关系是黑暗森林。',
  },
])
</script>

<style lang="scss" scoped></style>
