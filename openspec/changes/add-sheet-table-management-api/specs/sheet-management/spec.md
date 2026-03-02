## ADDED Requirements

### Requirement: 列出所有工作表

系统 SHALL 提供 GET `/api/{doc_id}/_meta/sheets` 端点，返回指定文档中所有工作表的列表信息，包含每个 Sheet 的名称和 ID。

#### Scenario: 成功获取工作表列表

- **WHEN** 用户向 `/api/{doc_id}/_meta/sheets` 发送 GET 请求
- **THEN** 系统返回 200 状态码和 JSON 数组，每个元素包含 `sheetId`（数字）和 `title`（字符串）

#### Scenario: 文档 ID 无效或无权限

- **WHEN** 用户使用无效的 `doc_id` 或服务账户无权限的文档发送 GET 请求
- **THEN** 系统返回适当的错误状态码和错误信息

### Requirement: 创建新工作表

系统 SHALL 提供 POST `/api/{doc_id}/_meta/sheets` 端点，在指定文档中创建新的工作表。

#### Scenario: 成功创建工作表

- **WHEN** 用户向 `/api/{doc_id}/_meta/sheets` 发送 POST 请求，请求体包含 `{ "title": "新表名" }`
- **THEN** 系统创建新工作表并返回 201 状态码，响应包含新创建的 Sheet 的 `sheetId` 和 `title`

#### Scenario: 同时创建工作表并设置表头

- **WHEN** 用户向 `/api/{doc_id}/_meta/sheets` 发送 POST 请求，请求体包含 `{ "title": "新表名", "headers": ["name", "age", "email"] }`
- **THEN** 系统创建新工作表并将 `headers` 写入第一行作为列名，返回 201 状态码

#### Scenario: Sheet 名称已存在

- **WHEN** 用户请求创建的工作表名称已在文档中存在
- **THEN** 系统返回 409 状态码和冲突错误信息

#### Scenario: 缺少必要参数

- **WHEN** 用户发送 POST 请求但未提供 `title` 字段
- **THEN** 系统返回 400 状态码和参数错误信息

### Requirement: 重命名工作表

系统 SHALL 提供 PUT `/api/{doc_id}/_meta/sheets` 端点，对指定文档中的工作表进行重命名。

#### Scenario: 成功重命名工作表

- **WHEN** 用户向 `/api/{doc_id}/_meta/sheets` 发送 PUT 请求，请求体包含 `{ "title": "原表名", "newTitle": "新表名" }`
- **THEN** 系统将工作表重命名并返回 200 状态码，响应包含更新后的 `sheetId` 和 `title`

#### Scenario: 原工作表不存在

- **WHEN** 用户请求重命名的工作表名称在文档中不存在
- **THEN** 系统返回 404 状态码和错误信息

#### Scenario: 新名称已被占用

- **WHEN** 用户提供的 `newTitle` 已在文档中被其他工作表使用
- **THEN** 系统返回 409 状态码和冲突错误信息

#### Scenario: 缺少必要参数

- **WHEN** 用户发送 PUT 请求但未提供 `title` 或 `newTitle` 字段
- **THEN** 系统返回 400 状态码和参数错误信息

### Requirement: 删除工作表

系统 SHALL 提供 DELETE `/api/{doc_id}/_meta/sheets` 端点，删除指定文档中的工作表。

#### Scenario: 通过名称删除工作表

- **WHEN** 用户向 `/api/{doc_id}/_meta/sheets` 发送 DELETE 请求，请求体包含 `{ "title": "要删除的表名" }`
- **THEN** 系统删除该工作表并返回 200 状态码

#### Scenario: 要删除的工作表不存在

- **WHEN** 用户请求删除的工作表名称在文档中不存在
- **THEN** 系统返回 404 状态码和错误信息

### Requirement: CORS 支持

管理 API 的所有端点 SHALL 返回与现有 CRUD API 一致的 CORS 响应头。

#### Scenario: 预检请求

- **WHEN** 客户端向管理端点发送 OPTIONS 请求
- **THEN** 系统返回 204 状态码和正确的 CORS 头
