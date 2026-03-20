# dg_admin_web_next 组件复用清单

## 1. 目的

本文档用于帮助 AI 和工程师在新增业务页时先找现有能力，再决定是否新写组件。

## 2. 查询区

优先级：

- `EcFilterBar`
- Element Plus `el-form` + `el-form-item` + `el-input/select/date-picker`

适用：

- 常规筛选区
- 折叠筛选区
- 操作按钮和查询区联排

禁止：

- 为每个列表页新写一套筛选栏基础组件

## 3. 列表与卡片

优先级：

- `EcListBasic`
- `EcListArticle`
- 参考 `src/views/list/listBasic.vue`
- 参考 `src/views/list/listCard.vue`

适用：

- 普通业务列表
- 卡片型摘要列表

禁止：

- 没有明确差异时新造一套列表外壳

## 4. 表格区

优先级：

- Element Plus `el-table`
- `EcTableSelect`
- `EcTableSort`
- 参考 `src/views/table/tableBasic.vue`
- 参考 `src/views/table/tableOperate/index.vue`

适用：

- 台账表格
- 批量选择
- 拖拽排序

禁止：

- 只为了统一表格样式新写一层基础表格组件

## 5. 表单区

优先级：

- Element Plus 表单组件
- `EcCron`
- `EcPasswordStrength`
- `EcCropper`
- `EcVirtualKeyboard`
- 参考 `src/views/form/formBasic.vue`
- 参考 `src/views/form/formGrid.vue`

适用：

- 标准录入表单
- 定时配置
- 密码类表单
- 图片裁剪

禁止：

- 为普通录入页自造表单引擎

## 6. 状态与展示

优先级：

- Element Plus `el-tag`
- Element Plus `el-badge`
- `EcCountUp`
- `EcDynamicIcon`

适用：

- 状态标识
- 数值摘要
- 图标类展示

禁止：

- 为状态颜色再造一套全局设计 token

## 7. 图表与统计

优先级：

- `EcChart`
- `EcChartBar`
- `EcChartLine`
- `EcChartPie`
- `EcChartRadar`
- `EcChartScatter`
- `EcChartWordcloud`

适用：

- 资产统计页
- 状态分布
- 趋势图

禁止：

- 无明确差异时绕过现有图表组件直接重复封装 ECharts

## 8. 交互与流程

优先级：

- `EcWorkflow`
- `EcContextmenu`
- `EcChat/*`

适用：

- 流程图
- 上下文菜单
- 对话型交互

禁止：

- 业务刚起步时就引入第二套流程或上下文菜单组件库

## 9. 页面级样例优先级

新增业务页时，先找最接近的现成页面：

- 表格列表：`src/views/table/tableBasic.vue`
- 列表页：`src/views/list/listBasic.vue`
- 卡片列表：`src/views/list/listCard.vue`
- 表单页：`src/views/form/formBasic.vue`
- 网格表单：`src/views/form/formGrid.vue`
- 列表 + 操作：`src/views/table/tableOperate/index.vue`
- 新模块样例：`src/views/monitor/monitorDashboard.vue`

## 10. 什么时候允许新建组件

只有下面情况才建议新增业务组件：

- 该块会在多个页面复用
- 现有 `Ec*` 组件和 Element Plus 组合都不适合
- 该组件有明确业务边界，不是“把当前页面拆碎”

默认先复用，再组合，最后才新建。
