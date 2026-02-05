# GSheet-CRUD

基于 [sheetsql](https://github.com/joway/sheetsql) 的 Google Sheets RESTful API 服务，将 Google Sheets 作为数据库，支持完整的 CRUD 操作。

## 功能特性

- 使用 Google Sheets 作为轻量级数据库
- 标准 RESTful API（GET/POST/PUT/DELETE）
- 支持查询参数进行数据过滤

## 前置条件

### 1. 分享 Google Sheets 权限

**重要**：您必须将以下服务账户邮箱添加为 Google Sheets 的**编辑者**，否则将无法读写数据。该邮箱为公司 DevOps 固定账号，不可替换，分享给该邮箱不存在数据泄漏问题：

```
google-sheet-db@mythic-groove-485702-k4.iam.gserviceaccount.com
```

操作步骤：
1. 打开您的 Google Sheets 文档
2. 点击右上角的"共享"按钮
3. 在"添加用户"输入框中粘贴上述邮箱地址
4. 将权限设置为"编辑者"
5. 点击"完成"

### 2. 准备表格数据

- 表格的**第一行**必须是列名（字段名）
- 数据从第二行开始

示例表格结构：

| name | age | email |
|------|-----|-------|
| John | 25 | john@example.com |
| Jane | 30 | jane@example.com |

## API 使用

### Base URL

```
https://gsheet-sql.dev.iglooinsure.com/api
```

### 给大模型使用

为 AI 代理（Claude、Cursor 等）安装 GSheet-CRUD skill：

```bash
npx skills add git@gitlab.iglooinsure.com:axinan/fe/platform/gsheet-crud.git
```

安装后，AI 代理可以自动使用 API 对 Google Sheets 进行 CRUD 操作。

### 手动使用

#### URL 格式

```
{base_url}/{doc_id}/{sheet_name}
```

- `doc_id`：Google Sheets 文档 ID（可在 URL 中找到：`https://docs.google.com/spreadsheets/d/{doc_id}/edit`）
- `sheet_name`：工作表名称（可选，默认为 `Sheet1`）

#### 查询数据（GET）

获取所有数据：
```bash
GET {base_url}/{doc_id}/{sheet_name}
```

条件查询：
```bash
GET {base_url}/{doc_id}/{sheet_name}?name=John&age=25
```

#### 插入数据（POST）

插入单条记录：
```bash
POST {base_url}/{doc_id}/{sheet_name}
Content-Type: application/json

{
  "name": "Mike",
  "age": 28,
  "email": "mike@example.com"
}
```

批量插入：
```bash
POST {base_url}/{doc_id}/{sheet_name}
Content-Type: application/json

[
  {"name": "Mike", "age": 28, "email": "mike@example.com"},
  {"name": "Sarah", "age": 35, "email": "sarah@example.com"}
]
```

#### 更新数据（PUT）

通过查询参数匹配要更新的数据：
```bash
PUT {base_url}/{doc_id}/{sheet_name}?name=John
Content-Type: application/json

{
  "age": 26,
  "email": "new_email@example.com"
}
```

#### 删除数据（DELETE）

通过查询参数匹配要删除的数据：
```bash
DELETE {base_url}/{doc_id}/{sheet_name}?name=John
```

## 本地开发

### 安装依赖

```bash
npm install
# or
yarn install
```

### 配置服务账户

将 Google Cloud 服务账户 JSON 密钥文件保存为项目根目录下的 `secrets/gsheet-sql.json`。

### 启动开发服务器

```bash
npm run dev
# or
yarn dev
```

服务将在 [http://localhost:3000](http://localhost:3000) 启动。

## 部署

构建生产版本：
```bash
npm run build
```

启动生产服务器：
```bash
npm run start
```

## 技术栈

- [Next.js](https://nextjs.org/) - React 全栈框架
- [sheetsql](https://github.com/joway/sheetsql) - Google Sheets 数据库操作库
- [qs](https://www.npmjs.com/package/qs) - URL 查询字符串解析

## 相关链接

- [sheetsql GitHub](https://github.com/joway/sheetsql)
- [sheetsql NPM](https://www.npmjs.com/package/sheetsql)
- [Google Cloud 服务账户文档](https://cloud.google.com/docs/authentication/production)

## 许可证

MIT
