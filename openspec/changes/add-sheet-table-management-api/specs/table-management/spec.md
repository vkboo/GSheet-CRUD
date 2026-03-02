## ADDED Requirements

### Requirement: 查询表头定义

系统 SHALL 提供 GET `/api/{doc_id}/_meta/{sheet_name}/headers` 端点，返回指定工作表的表头（第一行列名）。

#### Scenario: 成功获取表头

- **WHEN** 用户向 `/api/{doc_id}/_meta/{sheet_name}/headers` 发送 GET 请求
- **THEN** 系统返回 200 状态码和 JSON 对象，包含 `headers` 字段（字符串数组，为第一行的列名列表）

#### Scenario: 工作表为空（无表头）

- **WHEN** 用户查询一个完全空白的工作表的表头
- **THEN** 系统返回 200 状态码和空数组 `{ "headers": [] }`

#### Scenario: 工作表不存在

- **WHEN** 用户查询的 `sheet_name` 在文档中不存在
- **THEN** 系统返回 404 状态码和错误信息

### Requirement: 设置表头定义

系统 SHALL 提供 POST `/api/{doc_id}/_meta/{sheet_name}/headers` 端点，为指定工作表设置表头（写入第一行列名）。

#### Scenario: 为空表设置表头

- **WHEN** 用户向 `/api/{doc_id}/_meta/{sheet_name}/headers` 发送 POST 请求，请求体为 `{ "headers": ["name", "age", "email"] }`
- **THEN** 系统将列名写入第一行并返回 201 状态码，响应包含设置后的 `headers` 数组

#### Scenario: 覆盖已有表头

- **WHEN** 用户向已有表头的工作表发送 POST 请求设置新表头
- **THEN** 系统覆盖第一行的列名并返回 200 状态码和更新后的 `headers` 数组

#### Scenario: 缺少必要参数

- **WHEN** 用户发送 POST 请求但未提供 `headers` 字段或提供空数组
- **THEN** 系统返回 400 状态码和参数错误信息

#### Scenario: headers 包含非字符串元素

- **WHEN** 用户提供的 `headers` 数组中包含非字符串类型的值
- **THEN** 系统返回 400 状态码和参数类型错误信息

### Requirement: CORS 支持

表头管理 API 的所有端点 SHALL 返回与现有 CRUD API 一致的 CORS 响应头。

#### Scenario: 预检请求

- **WHEN** 客户端向表头管理端点发送 OPTIONS 请求
- **THEN** 系统返回 204 状态码和正确的 CORS 头
