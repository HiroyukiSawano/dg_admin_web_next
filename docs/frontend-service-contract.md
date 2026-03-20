# dg_admin_web_next Service 与接口契约指南

## 1. 目的

本文档用于统一新业务页的 service 层写法，避免 AI 在不同页面生成不同风格的接口封装。

唯一事实来源：

- `src/services/index.js`
- `src/services/modules/*.js`
- `src/utils/http.js`

## 2. 唯一入口约束

必须遵守：

- 页面、组件、store 只调用 `src/services/modules/*.js`
- `src/services/modules/*.js` 只通过 `Http` 或当前项目已有统一请求封装发请求
- 页面里不直接写 `fetch`
- 页面、组件、store 不直接 `axios.create`

## 3. Service 文件组织

推荐每个业务模块一个 service 文件：

```js
// src/services/modules/assetService.js
export const getAssetList = (params = {}) => {}
export const getAssetDetail = (id) => {}
export const createAsset = (payload) => {}
export const updateAsset = (id, payload) => {}
export const deleteAsset = (id) => {}
```

规则：

- 命名优先使用动词 + 业务对象。
- 列表、详情、创建、更新、删除、批量操作分别拆成独立函数。
- 不把多个页面的临时拼装逻辑塞进 service 名称里。

## 4. 成功 / 失败判定

默认原则：

- 成功和失败判定集中在 service 或 service 内部公共 helper。
- 页面层只消费“已归一化后的成功数据”或捕获异常。
- 页面层不要每个请求都手写一遍 `code === 200`。

如果某模块返回结构特殊：

- 在该模块 service 中做一次性兼容和 normalize。
- 不把后端协议差异扩散到多个页面。

## 5. 常见接口写法

### 5.1 列表查询

- 查询参数统一通过 `params`
- 分页、排序、筛选都放在一个参数对象中
- 列表返回值在 service 中尽量整理成页面直接可消费的数据结构

### 5.2 详情查询

- 使用明确的 `id`
- service 负责拼接 URL
- 页面层不手写路径拼装

### 5.3 保存 / 更新

- 表单提交统一通过 `payload`
- 创建和更新拆分函数，不在页面里用 if 混写不同接口

### 5.4 删除 / 批量操作

- 单个删除与批量删除拆分成独立函数
- 批量动作的参数结构由 service 统一收口

### 5.5 字典 / 枚举

- 独立成 service 方法
- 可复用的字典查询不要散落到每个页面

### 5.6 上传 / 下载

- 上传和下载走独立 service 方法
- 页面层只处理文件选择、进度和提示，不直接拼请求细节

## 6. 允许做的 normalize

service 层允许：

- 兼容不同成功码
- 从响应对象中提取 `data`
- 将分页结果整理为统一字段
- 将后端枚举值映射到前端稳定字段
- 将数组、对象、空值兜底成页面可直接消费的结构

service 层不应做：

- 页面级 UI 文案拼接
- 组件显示专用的复杂 HTML 结构
- 仅某个单页临时才需要的展示型排序

## 7. 页面层禁止做的事

- 不在页面里手写协议成功判定
- 不在页面里拼装多个后端字段名兜底
- 不在页面里散写上传、下载、批量操作的请求细节
- 不在页面里直接访问 `/api/...`

## 8. 错误处理约定

推荐做法：

- service 负责抛出统一异常
- 页面层负责 `ElMessage`、`ElNotification` 或结果态反馈
- 页面层只决定“如何提示”，不决定“什么算失败”

对于需要二次确认的场景：

- 页面层负责确认弹窗
- 确认后再调用 service

## 9. 资产管理系统默认接口分类

资产管理系统建议优先按下列分类拆 service：

- `assetService.js`：台账、详情、新增、编辑、删除、状态变更
- `assetCategoryService.js`：分类树、分类维护
- `assetDictionaryService.js`：品牌、型号、状态、归属、位置等字典
- `assetOperationService.js`：借用、归还、领用、调拨、维修、报废等动作

不要一开始把所有接口都写进一个超大的 `assetService.js`。
