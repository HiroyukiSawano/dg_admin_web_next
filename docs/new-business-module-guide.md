# dg_admin_web_next 新业务模块开发指南

## 1. 目的

本文档用于约束“在当前框架中新增业务模块”的实现方式，适用于资产管理系统这类新页面开发场景，不适用于旧前端逐页迁移。

配套阅读：

- `docs/frontend-framework-spec.md`
- `docs/frontend-visual-baseline.md`
- `docs/frontend-service-contract.md`
- `docs/page-archetypes.md`
- `docs/component-reuse-catalog.md`
- `docs/golden-module-example.md`

## 2. 最小目录模板

新增一个普通业务模块时，优先按下面结构落位：

```text
src/
  views/<module>/
    <pageA>.vue
    <pageB>.vue
    zh-CN/index.js
    en/index.js
  router/modules/<module>Routes.js
  services/modules/<module>Service.js
  components/<module>/        # 只有存在跨页复用块时才新增
  stores/modules/<module>Store.js  # 只有跨页共享状态时才新增
```

默认规则：

- 页面放 `src/views/<module>`。
- 路由放 `src/router/modules/<module>Routes.js`。
- 接口放 `src/services/modules/<module>Service.js`。
- 只在出现跨页面复用时新增 `src/components/<module>`。
- 只在出现跨页面共享状态时新增 `src/stores/modules/<module>Store.js`。

## 3. 页面拆分建议

### 3.1 列表页

最小组成：

- 顶部筛选区
- 工具按钮区
- 主内容区
- 分页区

推荐：

- 页面主文件承担查询、分页、表格数据加载。
- 行内复杂展示或表格外卡片抽到局部组件。
- 批量操作、导出、更多操作优先用 Element Plus dropdown 或 dialog，不把所有逻辑挤在表格单元格内。

### 3.2 详情页

优先选择：

- 信息较轻时，用弹窗或 drawer。
- 信息较多、分区明显时，用独立详情页。
- 明确需要多组信息时，再使用 tab 化详情。

不要默认：

- 一上来就做多级嵌套路由详情。
- 列表页里塞进全部详情逻辑。

### 3.3 表单页

优先选择：

- 轻量新增/编辑：dialog 或 drawer。
- 流程长、字段多、需要附件或关联关系：独立页面。

必须拆分：

- 表单 schema / 默认值整理逻辑
- 提交前转换逻辑
- 字典/枚举数据加载逻辑

### 3.4 弹窗页

适合场景：

- 新增、编辑、分配、批量设置、状态流转、导入结果反馈。

不适合场景：

- 大段详情浏览
- 多 tab 复杂编辑
- 需要长期停留和频繁跳转的任务

## 4. Store 使用边界

只有下列状态进入 Pinia：

- 多个页面共享
- 从页面跳转回来仍需要保留
- 与实时状态、系统状态、跨弹窗联动强相关

默认不进 Store 的内容：

- 单页筛选条件
- 单个弹窗开关
- 单页表单草稿
- 单次请求 loading、分页、排序

对于资产管理系统，默认先把查询、分页、弹窗状态放页面内；只有类似“跨页面选中资产”“共享树节点”“全局实时状态”这类需求才进入 store。

## 5. 新模块接入顺序

推荐固定顺序：

1. 明确页型，先选 `docs/page-archetypes.md` 中最接近的骨架
2. 在 `src/views/<module>` 落页面
3. 在 `src/router/modules/<module>Routes.js` 补路由
4. 在 `src/services/modules/<module>Service.js` 补 service
5. 补 `zh-CN` / `en` 文案
6. 只在确有必要时新增 `components/<module>` 或 `stores/modules/<module>Store.js`
7. 最后做视觉对齐、响应式和权限检查

## 6. 最小完成标准

一个“合格的新业务页”至少满足：

- 路由进入 `src/router/modules`
- `meta.title`、`meta.locale`、`meta.type` 完整
- 所有接口进入 `src/services/modules`
- 页面中没有裸请求
- 可见文案补齐中英文 i18n
- 页面骨架符合现有中后台结构
- 局部状态没有误进全局 store
- 桌面端与中小屏可用

## 7. 资产管理系统默认建议

如果你准备从零开始写资产管理系统，建议先从下面顺序启动：

1. 资产台账列表页
2. 资产分类树 + 台账联动页
3. 资产新增/编辑弹窗或表单页
4. 资产详情页
5. 资产状态流转、分配、借还、导入导出等周边能力

先把“列表 / 详情 / 表单 / 关联关系”四个基础页型做稳定，再扩功能，不要一开始就铺开整套复杂模块。
