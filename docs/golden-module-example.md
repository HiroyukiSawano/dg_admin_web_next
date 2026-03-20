# dg_admin_web_next 黄金样例模块说明

## 1. 目的

本文档用当前 monitor 模块说明“一套合格新模块”应该长什么样，供 AI 和工程师在新增资产管理系统模块时直接参考。

核心样例：

- `src/router/modules/monitorRoutes.js`
- `src/services/modules/monitorService.js`
- `src/views/monitor/monitorDashboard.vue`

补充样例：

- `src/stores/modules/monitorStore.js`
- `src/components/monitor/*`
- `src/views/monitor/zh-CN/index.js`
- `src/views/monitor/en/index.js`

## 2. 为什么它适合作为样例

monitor 模块已经覆盖了新模块最关键的几类决策：

- 独立路由模块
- 独立 service 文件
- 页面级视图目录
- 模块级中英文文案
- 共享 store 与局部状态的边界
- 跨页面复用组件目录
- 弹窗、drawer、列表、卡片、详情的拆分方式

## 3. 结构层面的参考点

### 3.1 路由

`src/router/modules/monitorRoutes.js` 展示了标准业务模块路由写法：

- 顶层目录型路由
- 子路由挂页面
- `meta.title`、`meta.locale`、`meta.type` 完整
- 使用动态导入加载页面

### 3.2 Service

`src/services/modules/monitorService.js` 展示了标准 service 收口方式：

- 同模块接口集中在一个文件
- 页面与 store 都通过 service 调用
- 接口成功/失败判定集中处理
- 特殊协议兼容与 agent 指令封装留在 service 层

### 3.3 页面

`src/views/monitor/monitorDashboard.vue` 展示了页面主文件应承担的职责：

- 页面筛选与局部弹窗状态
- 从 store 读取共享状态
- 组合多个复用组件
- 不直接写请求细节

## 4. Store 与局部状态边界

`src/stores/modules/monitorStore.js` 说明了什么时候该建 store：

- 多页面共享的实时状态
- 需要跨卡片、banner、drawer、弹窗联动的状态
- 周期性刷新和 socket 管理

而下面这些仍留在页面或组件里：

- 单个弹窗开关
- 页面筛选关键字
- 单次请求 loading
- 局部表单草稿

新增资产管理模块时，默认不要照搬 monitor 的 store 复杂度；只有出现跨页共享实时状态或强联动时，才建立模块 store。

## 5. 组件拆分参考

`src/components/monitor` 的拆分方式值得复用：

- 卡片：`MonitorAgentCard.vue`
- 横幅：`MonitorAlertBanner.vue`
- 详情抽屉：`MonitorDetailDrawer.vue`
- 弹窗：`MonitorAgentAlertsModal.vue`、`MonitorLogTimelineModal.vue`、`MonitorRuleConfigModal.vue`
- 编辑器子块：`MonitorRuleConditionEditor.vue`、`MonitorRuleConditionItemRow.vue`

这说明新增模块时应优先按“页面主文件 + 复用展示块 + 复用弹窗块 + 子编辑块”拆，而不是把全部逻辑塞进单个页面组件。

## 6. i18n 参考

monitor 模块使用：

- `src/views/monitor/zh-CN/index.js`
- `src/views/monitor/en/index.js`

这种做法适合新模块：

- 文案按模块聚合
- 中英文一一对应
- 路由菜单和页面内部文案都纳入同一命名空间

## 7. 给资产管理系统的借鉴

如果你准备新增资产管理模块，优先借鉴 monitor 的是：

- 模块目录结构
- route / service / locale 的收口方式
- 复用组件拆分方式
- 页面状态与共享状态的边界

不要直接照搬的部分：

- monitor 的实时刷新与 WebSocket 复杂度
- 过于监控特化的数据结构
- 所有弹窗都进入共享状态的做法

## 8. 使用方式

让 AI coding 新增资产管理页时，建议把 monitor 作为“真实样例模块”一起提供，而不是只给抽象规范。

对 AI 来说，真实样例的约束力通常高于抽象规则。
