# 信息化资产管理中心前端

## 请先读这里

这是“信息化资产管理中心”的前端项目，基于现有后台接口做联调、演示和收口。

- 项目名称：信息化资产管理中心前端
- 当前范围：组织资源、项目资源、软件资源、硬件资源
- 明确不做：数据资源模块
- 当前阶段：不是从零开发，而是全模块打通闭环、查漏补缺、稳定演示

## 当前结构

当前前端主要按下面方式组织：

- `src/router/modules`：模块路由
- `src/services/modules`：接口封装
- `src/views`：业务页面
- `src/views/**/zh-CN`、`src/views/**/en`：模块级国际化文案
- `src/stores/modules`：登录态、菜单、系统配置等状态管理

默认继续沿用这套接入方式，不做大规模前端架构重构。

## 已接入模块

当前业务模块都已接入前端：

- 组织资源
  - 部门
  - 位置
  - 服务商
  - 人员
- 项目资源
  - 项目台账
  - 详情抽屉
  - 新增 / 编辑
  - 关系维护
- 软件资源
  - 信息系统台账
  - 详情抽屉
  - 新增 / 编辑
  - 关系维护
- 硬件资源
  - 列表页
  - 详情抽屉
  - 新增 / 编辑
  - 关联系统 / 负责人 / 服务商
  - 生命周期操作
  - JSON 批量导入
  - CSV 导出

## 已完成的联调收口

近期已完成的前端收口包括：

- 项目资源、软件资源页面和服务封装已补齐
- 组织详情页已补齐跨模块名称回显，不再只显示 ID
- 前端支撑下拉统一优先走 `/options` 接口
- 项目 / 软件 / 硬件页面在关键入口会刷新支撑数据，减少跨模块新增后的旧缓存问题
- 本地演示模式下已规避 `/bspplus/utils/uuid` 误请求，避免首页卡在 loading

## 登录与演示模式

当前登录支持两种模式：

- `AUTH_LOGIN_MODE = 'local'`
  - 使用本地演示账号
- `AUTH_LOGIN_MODE = 'backend'`
  - 走后台 `/bspplus/user/login` 和验证码接口

当前本地演示账号：

- `eam_demo / 123456`
  - 系统名称显示“资产管理系统”
  - 仅显示“组织 / 项目 / 软件 / 硬件”
- `ops_demo / 123456`
  - 系统名称显示“运营管理系统”
  - 仅显示“监控中心”
- `platformadmin / admin`
  - 全量管理员视图，用于调试所有菜单

当前“两套系统”是按前端本地映射拆分的：

- 资产管理系统
  - 组织资源
  - 项目资源
  - 软件资源
  - 硬件资源
- 运营管理系统
  - 监控中心

系统名称、左上角 Logo 标题、登录页名称、浏览器标题都会跟随当前账号切换。

## 当前重点

后续前端工作默认优先级如下：

1. 先做全模块联调查漏补缺
2. 重点验证组织 / 项目 / 软件 / 硬件之间的支撑数据与关系回显
3. 再验证两套演示系统的菜单、首页和登录体验
4. 最后再考虑按钮级权限、错误提示细化、后台真实菜单接通

不要再把重点放回“继续铺更多新页面”。

## 开发约束

后续会话默认遵守以下约束：

- 不做数据资源模块
- 保持当前 `views + router/modules + services/modules + i18n + store` 结构
- 优先复用现有组织 / 硬件页面模式
- 页面注释、交接说明保持中文
- 如果文档和代码冲突，以代码为准，并及时更新文档

## 常用文件

下个会话建议优先看这些文件：

- `src/router/modules/organizationRoutes.js`
- `src/router/modules/hardwareRoutes.js`
- `src/router/modules/projectRoutes.js`
- `src/router/modules/softwareRoutes.js`
- `src/services/modules/organizationService.js`
- `src/services/modules/hardwareService.js`
- `src/services/modules/projectService.js`
- `src/services/modules/softwareService.js`
- `src/stores/modules/authorizeStore.js`
- `src/stores/modules/permissionStore.js`
- `src/configs/systemProfile.js`
- `src/services/modules/bspService.js`

## 常用命令

- 本地开发：`npm run dev`
- 生产构建：`npm run build`

## 额外说明

- 这个 README 已经替换掉原来的模板内容，后续请继续按真实项目状态维护
- 如果下一次状态变化较大，优先同步更新根目录 `README.MD` 和本文件
