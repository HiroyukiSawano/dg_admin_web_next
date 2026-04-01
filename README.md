# 信息化资产管理中心前端

## 项目定位

这是“信息化资产管理中心”的前端项目，当前不是从零开发，而是在现有业务基础上继续按新版 Figma 做正式交付收口。

- 当前范围：组织资源、项目资源、软件资源、硬件资源
- 明确不做：数据资源模块
- 当前重点：继续收口新版页面、打通联调、稳定演示

## 当前结构

- `src/router/modules`：模块路由
- `src/services/modules`：接口封装
- `src/views`：页面实现
- `src/views/**/zh-CN`、`src/views/**/en`：模块级文案
- `src/stores/modules`：登录态、权限、主题、系统配置

默认继续沿用这套结构，不做大规模架构重构。

## 当前真实完成度

### 组织资源

组织资源新版 Figma 已进入正式入口：

- 服务商：列表 / 新增 / 编辑 / 详情 / 关联维护
- 人员：列表 / 新增 / 编辑 / 详情 / 关联维护

主要文件：

- `src/views/organization/serviceProvidersFigma.vue`
- `src/views/organization/serviceProviderFormPage.vue`
- `src/views/organization/serviceProviderDetailPage.vue`
- `src/views/organization/serviceProviderRelationsPage.vue`
- `src/views/organization/personsFigma.vue`
- `src/views/organization/personFormPage.vue`
- `src/views/organization/personDetailPage.vue`
- `src/views/organization/personRelationsPage.vue`

### 项目资源

项目资源新版 Figma 已进入正式入口：

- 列表页
- 新增页
- 编辑页
- 详情页
- 关联维护页

主要文件：

- `src/views/project/projectsFigma.vue`
- `src/views/project/projectFormPage.vue`
- `src/views/project/projectDetailPage.vue`
- `src/views/project/projectRelationsPage.vue`
- `src/router/modules/projectRoutes.js`
- `src/services/modules/projectService.js`

### 软件资源 / 硬件资源

- 已有旧版接入和基础联调能力
- 仍作为后续继续收口对象

## 新版页面约束

后续继续做新版页面时，默认遵守以下规则：

- 新增 / 编辑 / 详情使用独立路由，不回退到弹窗 / 抽屉
- 上传走真实后端接口，不做纯前端假数据
- 旧版页面只作参考，不再作为正式入口
- 页面主题色统一跟全局主色走

对象选择规范已统一：

- 单选对象：搜索下拉面板
- 多选对象：穿梭弹窗

对应通用组件：

- `src/components/EcObjectSingleSelect.vue`
- `src/components/EcObjectMultiTransfer.vue`

## 登录与演示模式

当前登录支持两种模式：

- `AUTH_LOGIN_MODE = 'local'`
  - 使用本地演示账号
- `AUTH_LOGIN_MODE = 'backend'`
  - 走后台 `/bspplus/user/login`

当前本地演示账号：

- `eam_demo / 123456`
  - 显示资产管理系统菜单
- `eam_figma_demo / 123456`
  - 系统名称显示“组织资源新版演示”
  - 默认进入 `/organization/service-providers`
  - 当前可访问新版组织资源与新版项目资源
- `ops_demo / 123456`
  - 仅显示监控中心
- `platformadmin / admin`
  - 全量菜单调试账号

菜单与系统名称由前端本地映射控制，关键文件：

- `src/configs/systemProfile.js`
- `src/services/modules/bspService.js`

## 近期已完成的收口

- 组织资源新版服务商、人员主线页面已完成首轮交付
- 项目资源新版列表 / 新增 / 编辑 / 详情 / 关联维护已完成首轮交付
- 项目资源接入项目统计和项目文档真实上传
- 主题色改回跟全局主题走，默认主色为蓝色 `#2e5ef0`
- 组织资源新版壳层可直接打开主题设置抽屉

## 当前重点

推荐后续优先级：

1. 继续优化项目资源新版细节
2. 开始软件资源新版 Figma 收口
3. 再处理旧版页面清理和全模块联调细节

## 常用命令

- 本地开发：`npm run dev`
- 生产构建：`npm run build`

## 下个会话建议优先阅读

- `src/router/modules/projectRoutes.js`
- `src/services/modules/projectService.js`
- `src/views/project/projectsFigma.vue`
- `src/views/project/projectFormPage.vue`
- `src/views/project/projectDetailPage.vue`
- `src/views/project/projectRelationsPage.vue`
- `src/views/organization/components/FigmaResourceShell.vue`
- `src/configs/systemProfile.js`
- `src/stores/modules/styleStore.js`

## 额外说明

- 如果 README 与代码不一致，以代码为准，并及时回补文档
- 下次如果继续推进项目资源，请先检查 Figma、接口、上传链路和详情回显，不要重复重做已完成的组织资源页面
