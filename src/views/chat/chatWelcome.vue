<template>
  <el-card header="基本使用">
    <div style="display: flex; flex-direction: column; gap: 16px">
      <ec-chat-welcome title="前进！前进！不择手段地前进！" />

      <ec-chat-welcome
        title="前进！前进！不择手段地前进！"
        description="宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼"
      />

      <ec-chat-welcome
        title="前进！前进！不择手段地前进！"
        description="宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼"
      >
        <template #image>
          <svg xmlns="http://www.w3.org/2000/svg" height="64" width="64" viewBox="0 0 48 48">
            <g>
              <path d="M45,38a1,1,0,0,0-.132-.5l-8-14A1,1,0,0,0,36,23H12a1,1,0,0,0-.868.5l-8,14A1,1,0,0,0,3,38H45Z" fill="#e6e6e6"></path>
              <path d="M3,38v5a3,3,0,0,0,3,3H42a3,3,0,0,0,3-3V38Z" fill="#b3b3b3"></path>
              <path d="M21,8V28a3,3,0,0,0,6,0V8Z" fill="#b3b3b3"></path>
              <path d="M21,15.411a7.935,7.935,0,0,0,6,0V8H21Z" fill="#898989"></path>
              <circle cx="24" cy="8" r="6" fill="#ed7064"></circle>
              <ellipse cx="11.5" cy="33.5" rx="2.5" ry="1.5" fill="#72c472"></ellipse>
            </g>
          </svg>
        </template>
      </ec-chat-welcome>

      <ec-chat-welcome
        icon="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg"
        title="前进！前进！不择手段地前进！"
        extra="副标题"
        description="宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼"
      />
    </div>
  </el-card>
  <el-card header="样式">
    <div style="display: flex; flex-direction: column; gap: 16px">
      <ec-chat-welcome variant="borderless" title="前进！前进！不择手段地前进！" />

      <ec-chat-welcome
        variant="borderless"
        title="前进！前进！不择手段地前进！"
        description="宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼"
      />

      <ec-chat-welcome
        icon="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg"
        variant="borderless"
        title="前进！前进！不择手段地前进！"
        description="宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼"
      />

      <ec-chat-welcome
        icon="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg"
        variant="borderless"
        title="前进！前进！不择手段地前进！"
        extra="副标题"
        description="宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼"
      />
    </div>
  </el-card>
  <el-card header="布局">
    <div style="display: flex; flex-direction: column; gap: 16px">
      <ec-chat-welcome direction="rtl" title="前进！前进！不择手段地前进！" />

      <ec-chat-welcome
        direction="rtl"
        title="前进！前进！不择手段地前进！"
        description="宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼"
      />

      <ec-chat-welcome
        direction="rtl"
        icon="http://10.110.96.44/demo/in-agent-vue2/img/robot.a8675bbe.png"
        title="前进！前进！不择手段地前进！"
        description="宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼"
      />

      <ec-chat-welcome
        direction="rtl"
        icon="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg"
        title="前进！前进！不择手段地前进！"
        extra="副标题"
        description="宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼"
      />

      <ec-chat-welcome direction="rtl" variant="borderless" title="前进！前进！不择手段地前进！" />

      <ec-chat-welcome
        direction="rtl"
        variant="borderless"
        title="前进！前进！不择手段地前进！"
        description="宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼"
      />

      <ec-chat-welcome
        direction="rtl"
        icon="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg"
        variant="borderless"
        title="前进！前进！不择手段地前进！"
        description="宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼"
      />

      <ec-chat-welcome
        direction="rtl"
        icon="https://fuss10.elemecdn.com/1/34/19aa98b1fcb2781c4fba33d850549jpeg.jpeg"
        variant="borderless"
        title="前进！前进！不择手段地前进！"
        extra="副标题"
        description="宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼"
      />
    </div>
  </el-card>
  <el-card header="插槽">
    <div style="display: flex; flex-direction: column; gap: 16px">
      <ec-chat-welcome
        variant="borderless"
        title="前进！前进！不择手段地前进！"
        description="宇宙就是一座黑暗森林，每个文明都是带枪的猎人，像幽灵般潜行于林间，轻轻拨开挡路的树枝，竭力不让脚步发出一点儿声音，连呼吸都必须小心翼翼"
      >
        <template #image>
          <svg xmlns="http://www.w3.org/2000/svg" height="64" width="64" viewBox="0 0 48 48">
            <g>
              <path d="M45,38a1,1,0,0,0-.132-.5l-8-14A1,1,0,0,0,36,23H12a1,1,0,0,0-.868.5l-8,14A1,1,0,0,0,3,38H45Z" fill="#e6e6e6"></path>
              <path d="M3,38v5a3,3,0,0,0,3,3H42a3,3,0,0,0,3-3V38Z" fill="#b3b3b3"></path>
              <path d="M21,8V28a3,3,0,0,0,6,0V8Z" fill="#b3b3b3"></path>
              <path d="M21,15.411a7.935,7.935,0,0,0,6,0V8H21Z" fill="#898989"></path>
              <circle cx="24" cy="8" r="6" fill="#ed7064"></circle>
              <ellipse cx="11.5" cy="33.5" rx="2.5" ry="1.5" fill="#72c472"></ellipse>
            </g>
          </svg>
        </template>
        <template #extra>
          <el-button type="primary" icon="ri-pushpin-fill">签到</el-button>
        </template>
      </ec-chat-welcome>
    </div>
  </el-card>
</template>
<script setup>
import { ref, onMounted, computed } from 'vue'
import EcChatWelcome from '@/components/EcChat/components/EcChatWelcome/index.vue'
defineOptions({ name: 'chatWelcome' })
</script>

<style lang="scss" scoped></style>
