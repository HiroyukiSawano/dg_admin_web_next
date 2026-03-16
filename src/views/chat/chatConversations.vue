<template>
  <el-card header="基本使用">
    <div style="display: flex; flex-direction: column; gap: 12px; height: 420px">
      <ec-chat-conversations
        v-model:active="activeKey1"
        :items="timeBasedItems"
        :label-max-width="200"
        :show-tooltip="true"
        row-key="id"
        @change="handleChange"
      />
    </div>
  </el-card>
  <el-card header="分组排序">
    <div style="display: flex; flex-direction: column; gap: 12px; height: 420px">
      <ec-chat-conversations
        v-model:active="activeKey1"
        :items="timeBasedItems"
        groupable
        :label-max-width="200"
        :show-tooltip="false"
        row-key="id"
      />
    </div>
  </el-card>
  <el-card header="下拉菜单">
    <div style="display: flex; flex-direction: column; gap: 12px; height: 420px">
      <ec-chat-conversations
        v-model:active="activeKey4"
        :items="menuTestItems4"
        :label-max-width="200"
        :show-tooltip="true"
        row-key="key"
        tooltip-placement="right"
        :tooltip-offset="35"
        show-to-top-btn
        show-built-in-menu
        @menu-command="handleMenuCommand"
      />
    </div>
  </el-card>
  <el-card header="自定义菜单">
    <div style="display: flex; flex-direction: column; gap: 12px; height: 420px">
      <ec-chat-conversations
        v-model:active="activeKey4"
        :items="menuTestItems4"
        row-key="key"
        :label-max-width="200"
        :show-tooltip="true"
        show-to-top-btn
        show-built-in-menu
      >
        <template #more-filled>
          <el-icon class="ri-more-2-fill" />
        </template>

        <template #menu="{ item }">
          <div class="menu-buttons">
            <el-button
              v-for="menuItem in conversationMenuItems"
              :key="menuItem.key"
              link
              size="small"
              @click.stop="handleMenuClick(menuItem.key, item)"
              icon="menuItem.icon"
            >
              <template v-if="menuItem.label">{{ menuItem.label }}</template>
            </el-button>
          </div>
        </template>
      </ec-chat-conversations>
    </div>
  </el-card>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import { ElMessage } from 'element-plus'
import EcChatConversations from '@/components/EcChat/components/EcChatConversations'
defineOptions({ name: 'chatConversations' })
const timeBasedItems = ref([
  {
    id: '1',
    label: '今天的会话111111111111111111111111111',
    group: 'today',
    disabled: true
  },
  {
    id: '2',
    group: 'today',
    label: '今天的会话2'
  },
  {
    id: '3',
    group: 'yesterday',
    label: '昨天的会话1'
  },
  {
    id: '4',
    label: '昨天的会话2'
  },
  {
    id: '5',
    label: '一周前的会话'
  },
  {
    id: '6',
    label: '一个月前的会话'
  },
  {
    id: '7',
    label: '很久以前的会话'
  }
]);
const activeKey4 = ref('m1');
const menuTestItems4 = ref([
  {
    key: 'm1',
    label: '菜单测试项目 1 - 长文本效果演示文本长度溢出效果测试'.repeat(2)
  },
  {
    key: 'm2',
    label: '菜单测试项目 2',
    disabled: true
  },
  {
    key: 'm3',
    label: '菜单测试项目 3'
  },
  {
    key: 'm4',
    label: '菜单测试项目 4'
  },
  {
    key: 'm5',
    label: '菜单测试项目 5'
  },
  {
    key: 'm6',
    label: '菜单测试项目 6'
  },
  {
    key: 'm7',
    label: '菜单测试项目 7'
  },
  {
    key: 'm8',
    label: '菜单测试项目 8'
  },
  {
    key: 'm9',
    label: '菜单测试项目 9'
  },
  {
    key: 'm10',
    label: '菜单测试项目 10'
  },
  {
    key: 'm11',
    label: '菜单测试项目 11'
  },
  {
    key: 'm12',
    label: '菜单测试项目 12'
  },
  {
    key: 'm13',
    label: '菜单测试项目 13'
  },
  {
    key: 'm14',
    label: '菜单测试项目 14'
  }
]);

const activeKey1 = ref();

const handleChange = (item) => {
  ElMessage.success(`选中了: ${item.label}`);
}
const handleMenuCommand = (command, item) => {
  console.log('内置菜单点击事件：', command, item);
  // 直接修改 item 是否生效
  if (command === 'delete') {
    const index = menuTestItems4.value.findIndex(
      itemSlef => itemSlef.key === item.key
    );

    if (index !== -1) {
      menuTestItems4.value.splice(index, 1);
      console.log('删除成功');
      ElMessage.success('删除成功');
    }
  }
  if (command === 'rename') {
    item.label = '已修改';
    console.log('重命名成功');
    ElMessage.success('重命名成功');
  }
}
const conversationMenuItems = [
  {
    key: 'edit',
    label: '编辑',
    icon: 'ri-edit-line',
    command: {
      self_id: '1',
      self_message: '编辑',
      self_type: 'primary'
    }
  },
  {
    key: 'delete',
    label: '删除',
    icon: 'ri-delete-bin-2-line',
    disabled: true,
    divided: true
  },
  {
    key: 'share',
    label: '分享',
    icon: 'ri-share-line',
    command: 'share'
  }
];
function handleMenuClick(menuKey, item) {
  console.log('菜单点击', menuKey, item);

  switch (menuKey) {
    case 'edit':
      console.log(`编辑: ${item.label}`);
      ElMessage.warning(`编辑: ${item.label}`);
      break;
    case 'delete':
      console.log(`删除: ${item.label}`);
      ElMessage.error(`删除: ${item.label}`);
      break;
    case 'share':
      console.log(`分享: ${item.label}`);
      ElMessage.success(`分享: ${item.label}`);
      break;
  }
}
</script>

<style lang="scss" scoped></style>
