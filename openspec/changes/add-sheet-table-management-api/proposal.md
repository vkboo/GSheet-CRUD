## Why

当前 GSheet-CRUD 仅支持对已存在的 Sheet 进行数据 CRUD 操作，但 Sheet（工作表）和 Table（表头/列定义）必须由用户手动在 Google Sheets 界面中创建和配置。这导致使用流程不完整——用户（特别是 AI 代理）无法通过 API 完成从建表到数据操作的全流程，降低了自动化程度和使用体验。

## What Changes

- 新增 Sheet 管理 API：支持查询文档中的所有工作表、创建新工作表、重命名工作表、删除工作表
- 新增 Table（表头）管理 API：支持查询指定 Sheet 的表头定义、创建/设置表头（写入第一行列名）
- 显式安装并使用 `googleapis` 的 Google Sheets API v4，补充 `sheetsql` 未覆盖的管理能力
- 更新前端 API 文档页面，展示新增的管理接口

## Capabilities

### New Capabilities

- `sheet-management`：工作表（Sheet）的列表查询、创建、重命名和删除功能
- `table-management`：表头（Table Header）的查询和设置功能

### Modified Capabilities

（无）

## Impact

- **代码**：新增独立的管理 API 路由，不影响现有 CRUD 路由
- **API**：新增管理端点，现有端点保持不变，无破坏性变更
- **依赖**：显式安装 `googleapis` 作为直接依赖（此前仅作为 `sheetsql` 的传递依赖存在）
- **前端**：API 文档页面需要更新以包含新接口说明
