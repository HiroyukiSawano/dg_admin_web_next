# dg_admin_web_next AI 新业务页提示词模板

将下列模板中的占位符替换为实际内容后再使用。

```md
你现在要在 `dg_admin_web_next` 仓库内新增 `<TARGET_MODULE>` 模块下的 `<TARGET_PAGE_TYPE>` 页面，目标不是迁移旧页，而是在当前框架里新增一个符合规范的新业务页。

你必须把以下文件作为事实来源同时参考：

- `docs/frontend-framework-spec.md`
- `docs/frontend-visual-baseline.md`
- `docs/new-business-module-guide.md`
- `docs/frontend-service-contract.md`
- `docs/page-archetypes.md`
- `docs/component-reuse-catalog.md`
- `docs/golden-module-example.md`
- `src/views/table/tableBasic.vue`
- `src/views/list/listBasic.vue`
- `src/views/form/formBasic.vue`
- `src/layouts/classicLayout.vue`
- `<EXTRA_REFERENCES>`

硬性规则：

1. 先搜索现有实现，再开始改代码。
2. 这是新增业务页，不是旧页重构，不要沿用旧系统目录结构。
3. 所有接口都走 `src/services/modules/*.js` + `utils/http.js`，不要在页面里直接发裸请求。
4. 页面临时状态留在页面，跨页共享状态才进入 Pinia。
5. 新增业务路由必须进入 `src/router/modules`。
6. 用户可见文案必须补 `zh-CN` / `en`。
7. 页面样式优先写局部 `scoped lang="scss"`，优先使用 `var(--el-*)`。
8. 能复用 `Ec*` 组件和现有页面骨架时，不重复造轮子。
9. 不新增新的基础 UI 框架、状态框架、请求框架。
10. 输出中必须明确说明复用了哪些现有页面、组件和 service 模式。

请按下面场景执行：

- 新增模块：补 views、routes、services、i18n，必要时补 components，不默认建 store。
- 新增列表页：优先采用标准台账列表页范式。
- 新增详情页：先判断用 drawer / dialog / 独立页，不要默认上多级路由。
- 新增表单页：先判断是弹窗表单还是独立表单页。

输出要求：

1. 先列出你检索并参考了哪些现有实现。
2. 再说明页面采用了哪一种页型范式。
3. 再说明你新增了哪些 route / service / i18n / component / store。
4. 明确写出哪些状态没有进入全局 store。
5. 最后做一轮自检：
   - 路由是否完整
   - service 是否集中
   - i18n 是否补齐
   - 页面骨架是否贴近现有项目
   - 是否复用了现有组件

目标模块：`<TARGET_MODULE>`
目标页面类型：`<TARGET_PAGE_TYPE>`
目标页面：`<TARGET_PAGE>`
附加参考：`<EXTRA_REFERENCES>`
```

## 推荐用法

- 新增列表页时，把 `<TARGET_PAGE_TYPE>` 写成“标准台账列表页”
- 新增详情页时，把 `<TARGET_PAGE_TYPE>` 写成“主从详情页”或“Tab 化详情页”
- 新增表单页时，把 `<TARGET_PAGE_TYPE>` 写成“弹窗表单页”或“独立表单页”

不要把这个模板与 `docs/ai/refactor/prompt-template.md` 混用：

- `docs/ai/refactor/prompt-template.md` 用于迁移旧页
- `docs/ai/new-page/prompt-template.md` 用于新增业务页
