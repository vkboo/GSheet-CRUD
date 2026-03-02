## Context

当前 GSheet-CRUD 项目通过 `sheetsql` 库提供数据 CRUD 操作，但 `sheetsql` 仅封装了数据读写功能，不支持工作表和表头的管理。底层的 `googleapis` 包（`sheetsql` 的依赖）提供了完整的 Google Sheets API v4 能力，包括工作表创建/删除和值读写。

现有路由结构为 `/api/[doc_id]/[[...sheet_name]]/route.ts`，使用可选 catch-all 参数匹配 Sheet 名称。

## Goals / Non-Goals

**Goals:**

- 提供 Sheet（工作表）的列表查询、创建、删除 API
- 提供 Table Header（表头）的查询和设置 API
- 复用已有的 `googleapis` 依赖和认证配置，不引入新依赖
- 与现有 CRUD 路由共存，互不影响

**Non-Goals:**

- 不提供 Google Spreadsheet 文档本身的创建/删除功能
- 不修改 `sheetsql` 库的源码
- 不提供列类型定义或数据验证规则的管理
- 不提供 Sheet 重命名功能（可后续迭代）

## Decisions

### 1. 路由设计：使用 `_meta` 前缀隔离管理路由

**选择**：在 `/api/[doc_id]/` 下新增 `_meta` 静态路径段，管理 API 挂载于此。

- Sheet 管理：`/api/[doc_id]/_meta/sheets`
- 表头管理：`/api/[doc_id]/_meta/[sheet_name]/headers`

**理由**：Next.js App Router 中静态路径段优先于 catch-all 动态段匹配，`_meta` 作为静态段不会被 `[[...sheet_name]]` 捕获。下划线前缀作为管理端点的命名惯例，语义清晰且不太可能与用户的实际 Sheet 名称冲突。

**备选方案**：
- 使用独立路径如 `/api/manage/[doc_id]/...` — 但与现有 URL 风格不一致
- 在现有路由内通过 query 参数区分 — 但违反 RESTful 设计原则

### 2. 底层实现：直接使用 `googleapis` 而非扩展 `sheetsql`

**选择**：新建 `src/lib/sheets-client.ts` 工具模块，直接调用 Google Sheets API v4。

**理由**：`sheetsql` 是第三方库且最近未维护（v0.1.7），修改其源码不现实。`googleapis` 已作为传递依赖存在于项目中，直接使用不增加包体积。

**涉及的 API 调用**：
- `spreadsheets.get` — 获取文档元数据（Sheet 列表）
- `spreadsheets.batchUpdate` + `addSheet` — 创建 Sheet
- `spreadsheets.batchUpdate` + `deleteSheet` — 删除 Sheet
- `spreadsheets.values.get` — 读取表头（第一行）
- `spreadsheets.values.update` — 写入表头（第一行）

### 3. 认证复用：提取共享认证逻辑

**选择**：将现有 `route.ts` 中的 `getCommonDbConfig()` 认证逻辑提取到 `src/lib/sheets-client.ts`，由 CRUD 路由和管理路由共用。

**理由**：避免代码重复，统一 Docker/本地环境的密钥文件路径判断逻辑。

### 4. API 方法设计

| 端点 | 方法 | 功能 |
|------|------|------|
| `/api/{doc_id}/_meta/sheets` | GET | 列出所有工作表 |
| `/api/{doc_id}/_meta/sheets` | POST | 创建新工作表 |
| `/api/{doc_id}/_meta/sheets` | DELETE | 删除工作表 |
| `/api/{doc_id}/_meta/{sheet_name}/headers` | GET | 查询表头 |
| `/api/{doc_id}/_meta/{sheet_name}/headers` | POST | 设置/创建表头 |

## Risks / Trade-offs

- **[风险] `googleapis` 版本兼容性** → `sheetsql` 依赖的 `googleapis` 版本可能与直接导入时存在冲突。缓解：使用 `sheetsql` 已安装的同一版本，避免单独安装。
- **[风险] 并发操作冲突** → 管理 API 操作（如删除 Sheet）与 CRUD 操作可能并发执行。缓解：管理操作属于低频操作，文档中说明不应在数据操作进行时执行管理操作。
- **[权衡] 未使用 PATCH 方法更新表头** → 使用 POST 设置表头（全量覆盖），不支持部分更新。理由：表头定义通常整体变更，部分更新增加复杂度但收益有限。
