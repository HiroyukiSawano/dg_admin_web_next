const chatRoutes = {
  path: '/chat',
  name: 'chat',
  meta: {
    title: '智能对话',
    locale: 'ec.menu.name.chat',
    icon: 'ri-sparkling-line',
    type: 'directory‌',
    order: 8
  },
  redirect: '/chat/chatTypewriter',
  children: [
    {
      path: '/chat/chatTypewriter',
      name: 'chatTypewriter',
      component: () => import('@/views/chat/chatTypewriter'),
      meta: {
        title: '打字器',
        locale: 'ec.menu.name.chatTypewriter',
        type: 'menu',
      },
    },
    {
      path: '/chat/chatMarkdown',
      name: 'chatMarkdown',
      component: () => import('@/views/chat/chatMarkdown'),
      meta: {
        title: '渲染器',
        locale: 'ec.menu.name.chatMarkdown',
        type: 'menu',
      },
    },
    {
      path: '/chat/chatBubble',
      name: 'chatBubble',
      component: () => import('@/views/chat/chatBubble'),
      meta: {
        title: '对话气泡',
        locale: 'ec.menu.name.chatBubble',
        type: 'menu',
      },
    },
    {
      path: '/chat/chatBubbleList',
      name: 'chatBubbleList',
      component: () => import('@/views/chat/chatBubbleList'),
      meta: {
        title: '对话列表',
        locale: 'ec.menu.name.chatBubbleList',
        type: 'menu',
      },
    },
    {
      path: '/chat/chatConversations',
      name: 'chatConversations',
      component: () => import('@/views/chat/chatConversations'),
      meta: {
        title: '会话',
        locale: 'ec.menu.name.chatConversations',
        type: 'menu',
      },
    },
    {
      path: '/chat/chatWelcome',
      name: 'chatWelcome',
      component: () => import('@/views/chat/chatWelcome'),
      meta: {
        title: '欢迎',
        locale: 'ec.menu.name.chatWelcome',
        type: 'menu',
      },
    },
    {
      path: '/chat/chatPrompts',
      name: 'chatPrompts',
      component: () => import('@/views/chat/chatPrompts'),
      meta: {
        title: '提示集',
        locale: 'ec.menu.name.chatPrompts',
        type: 'menu',
      },
    },
    {
      path: '/chat/chatFilesCard',
      name: 'chatFilesCard',
      component: () => import('@/views/chat/chatFilesCard'),
      meta: {
        title: '文件卡片',
        locale: 'ec.menu.name.chatFilesCard',
        type: 'menu',
      },
    },
    {
      path: '/chat/chatAttachments',
      name: 'chatAttachments',
      component: () => import('@/views/chat/chatAttachments'),
      meta: {
        title: '文件附件',
        locale: 'ec.menu.name.chatAttachments',
        type: 'menu',
      },
    },
    {
      path: '/chat/chatSender',
      name: 'chatSender',
      component: () => import('@/views/chat/chatSender'),
      meta: {
        title: '发送',
        locale: 'ec.menu.name.chatSender',
        type: 'menu',
      },
    },
    {
      path: '/chat/chatMentionSender',
      name: 'chatMentionSender',
      component: () => import('@/views/chat/chatMentionSender'),
      meta: {
        title: '提及发送',
        locale: 'ec.menu.name.chatMentionSender',
        type: 'menu',
      },
    },
    {
      path: '/chat/chatEditorSender',
      name: 'chatEditorSender',
      component: () => import('@/views/chat/chatEditorSender'),
      meta: {
        title: '编辑发送',
        locale: 'ec.menu.name.chatEditorSender',
        type: 'menu',
      },
    },
    {
      path: '/chat/chatThinking',
      name: 'chatThinking',
      component: () => import('@/views/chat/chatThinking'),
      meta: {
        title: '思考过程',
        locale: 'ec.menu.name.chatThinking',
        type: 'menu',
      },
    },
    {
      path: '/chat/chatThoughtChain',
      name: 'chatThoughtChain',
      component: () => import('@/views/chat/chatThoughtChain'),
      meta: {
        title: '思考链',
        locale: 'ec.menu.name.chatThoughtChain',
        type: 'menu',
      },
    },
    {
      path: '/chat/chatLoading',
      name: 'chatLoading',
      component: () => import('@/views/chat/chatLoading'),
      meta: {
        title: '加载中',
        locale: 'ec.menu.name.chatLoading',
        type: 'menu',
      },
    },
    {
      path: '/chat/chatTool',
      name: 'chatTool',
      component: () => import('@/views/chat/chatTool'),
      meta: {
        title: '工具',
        locale: 'ec.menu.name.chatTool',
        type: 'menu',
        hiddenBreadcrumb: true,
      },
    },
    {
      path: '/chat/chatDify',
      name: 'chatDify',
      component: () => import('@/views/chat/chatDify'),
      meta: {
        title: 'DIFFY',
        locale: 'ec.menu.name.chatDify',
        type: 'menu',
        hiddenBreadcrumb: true,
      },
    },
  ],
}
export default chatRoutes
