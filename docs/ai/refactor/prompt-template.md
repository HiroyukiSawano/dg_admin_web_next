# dg_admin_web_next AI 重构提示词模板

将下列模板中的 `<TARGET_PAGE>`、`<TARGET_MODULE>`、`<EXTRA_REFERENCES>` 替换为实际内容后再使用。

```md
你现在要在 `dg_admin_web_next` 仓库内重构 `<TARGET_PAGE>`，目标是让该页面符合当前项目的真实标准，而不是自由发挥设计。

你必须把以下文件作为事实来源同时参考：

- `docs/frontend-framework-spec.md`
- `docs/frontend-visual-baseline.md`
- `docs/refactor-acceptance-checklist.md`
- `src/views/table/tableBasic.vue`
- `src/views/list/listBasic.vue`
- `src/layouts/classicLayout.vue`
- `<EXTRA_REFERENCES>`

硬性规则：

1. 先搜索现有实现，再开始改代码。
2. 不新增新的基础 UI 框架、状态框架、请求框架。
3. 不新增第二套主题系统；继续使用现有 `styleStore`、`data-theme`、`data-layout`、`var(--el-*)`。
4. 所有接口都走 `services` + `utils/http.js`，不要在页面里直接发裸请求。
5. 页面临时状态留在页面，跨页共享状态才进入 Pinia。
6. 新增业务路由必须进入 `src/router/modules`。
7. 新增页面样式只能优先写局部 `scoped lang="scss"`，并优先使用 `var(--el-*)`。
8. 不要把页面做成品牌官网、营销页或数据大屏风格。
9. 不要大面积硬编码颜色、渐变、阴影、圆角和字号。
10. 能复用 `Ec*` 组件时，不重复造轮子。

请分两轮完成：

第一轮只做结构对齐：

- 对齐目录、路由、service、store、i18n、权限、页面骨架
- 说明你复用了哪些现有页面模式、组件、路由模式

第二轮只做视觉对齐：

- 对照 `tableBasic.vue`、`listBasic.vue`、`classicLayout.vue`
- 修正间距、按钮区、表格区、卡片头部、分页和响应式
- 说明你复用了哪些 CSS 变量、Element Plus 组合和现有样式模式

本次验收标准：

- 结构验收：是否走路由模块、service 层、i18n、权限、布局体系
- 视觉验收：是否仍是 `el-card` 中后台骨架，是否使用现有色彩变量，是否保持当前项目的间距节奏
- 响应式验收：桌面和窄屏都不溢出
- 代码验收：没有新 axios、没有无必要全局 store、没有新主题体系、没有大面积内联样式

输出要求：

1. 先列出你检索并参考了哪些现有实现
2. 再说明第一轮结构改动
3. 再说明第二轮视觉改动
4. 最后逐条对照验收标准自检

目标模块：`<TARGET_MODULE>`
目标页面：`<TARGET_PAGE>`
```
