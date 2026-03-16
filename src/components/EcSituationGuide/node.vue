<template>
  <div class="ec-situation-select-node" v-for="nodeItem, nodeIndex in props.data" :key="nodeItem.id">
    <div class="ec-situation-select-node__title" v-if="nodeItem.type === 'node'">
      <i class="ri-pushpin-fill"></i>
      <span>{{ props.index + (nodeIndex + 1) }} {{ nodeItem.name }}</span>
    </div>
    <template v-for="optionItem in nodeItem.children" :key="optionItem.id">
      <label class="ec-situation-select-node__radio">
        <input type="radio" :value="optionItem.id" :name="optionItem.pid" @change="handleRadioChange(nodeItem, optionItem)">
        <span>{{ optionItem.name }}</span>
      </label>
      <template v-if="optionItem._visible && optionItem.children && optionItem.children.length > 0">
        <node :data="optionItem.children" @option-change="handleOptionChange" :index="props.index + (nodeIndex + 1) + '.'" />
      </template>
    </template>
  </div>
</template>
<script setup>
defineOptions({
  name: 'node',
})
const props = defineProps({
  index: { type: [String, Number], default: '' },
  data: { type: Array, default: () => [] },
})
const emit = defineEmits(['option-change'])
const handleRadioChange = (node, option) =>{
  loopChildrenVisible(node, false)
  option._visible = true
  handleOptionChange()
}
const handleOptionChange = () => {
  emit('option-change')
}
const loopChildrenVisible = (node, visible) => {
  if (!node.children) return
  node.children.forEach(item => {
    item._visible = visible
    if (item.children?.length > 0) loopChildrenVisible(item, visible)
  })
}
</script>

<style lang="scss" scoped>

.ec-situation-select-node {
  display: flex;
  // flex-direction: column;
  flex-wrap: wrap;
  // padding: 8px;
  order: 1;
  // border: 1px solid #ebedf3;
  // margin: -1px;
  border-top: 1px solid var(--el-border-color-lighter);
  width: 100%;
  // margin-top: 12px;
  padding-top: 16px;
  // margin: 0 8px 8px 8px;
  .ec-situation-select-node__title {
    margin-bottom: 16px;
    width: 100%;
    line-height: 1;
    font-weight: 500;
    > i {
      margin-right: 4px;
      font-size: 16px;
      color: var(--el-color-primary);
    }
  }
  .ec-situation-select-node__radio {
    display: flex;
    align-items: center;
    margin-left: 16px;
    margin-bottom: 16px;
    // padding: 12px;
    cursor: pointer;
    > span {
      padding: 8px 16px;
      min-width: 96px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      background-color: var(--el-fill-color);
      border: 1px solid var(--el-fill-color);
      border-radius: var(--el-border-radius-base);
      line-height: 1;
      // &::before {
      //   font-family: "remixicon" !important;
      //   font-style: normal;
      //   -webkit-font-smoothing: antialiased;
      //   -moz-osx-font-smoothing: grayscale;
      //   content: "\eb7d";
      //   margin-right: 6px;
      //   font-size: 1.2em;
      //   color: #dcdfe6;
      // }
    }
    > input[type="radio"] {
      display: none;
    }
    > input[type="radio"]:checked + span {
      background: var(--el-color-primary);
      border: 1px solid var(--el-color-primary);
      color: var(--el-color-white);
      &::before {
        font-family: "remixicon" !important;
        font-style: normal;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        margin-right: 6px;
        margin-left: -2px;
        // font-size: 1.2em;
        content: "\eb7b";
        color: #fff;
      }
    }
  }
}
</style>
