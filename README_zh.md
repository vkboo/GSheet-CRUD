# GSheet-CRUD

基于 [sheetsql](https://github.com/joway/sheetsql) 的 Google Sheets RESTful API 服务，将 Google 表格作为数据库使用，提供完整的 CRUD 操作接口。

## 功能特性

- 将 Google Sheets 作为轻量级数据库使用
- 提供标准的 RESTful API（GET/POST/PUT/DELETE）
- 支持查询参数过滤数据
- 基于 Next.js 构建，支持 Vercel 一键部署

## 前置条件

### 1. 共享 Google 表格权限

**重要**：你必须将以下服务账号邮箱添加为你的 Google 表格的**编辑者**，否则无法正常读写数据：

```
gsheett-younami@woven-fountain-458301-p7.iam.gserviceaccount.com
```

操作步骤：
1. 打开你的 Google Sheets 文档
2. 点击右上角的「共享」按钮
3. 在「添加用户」输入框中粘贴上述邮箱地址
4. 将权限设置为「编辑者」
5. 点击「完成」

### 2. 准备表格数据

- 表格的**第一行**必须是列名（字段名）
- 数据从第二行开始

示例表格结构：

| name | age | email |
|------|-----|-------|
| 张三 | 25 | zhangsan@example.com |
| 李四 | 30 | lisi@example.com |

## API 使用说明

### URL 格式

```
/{doc_id}/{sheet_name}
```

- `doc_id`：Google Sheets 文档 ID（可从 URL 中获取：`https://docs.google.com/spreadsheets/d/{doc_id}/edit`）
- `sheet_name`：工作表名称（可选，默认为 `Sheet1`）

### 查询数据 (GET)

获取所有数据：
```bash
GET /{doc_id}/{sheet_name}
```

条件查询：
```bash
GET /{doc_id}/{sheet_name}?name=张三&age=25
```

### 新增数据 (POST)

新增单条数据：
```bash
POST /{doc_id}/{sheet_name}
Content-Type: application/json

{
  "name": "王五",
  "age": 28,
  "email": "wangwu@example.com"
}
```

新增多条数据：
```bash
POST /{doc_id}/{sheet_name}
Content-Type: application/json

[
  {"name": "王五", "age": 28, "email": "wangwu@example.com"},
  {"name": "赵六", "age": 35, "email": "zhaoliu@example.com"}
]
```

### 更新数据 (PUT)

通过查询参数匹配要更新的数据：
```bash
PUT /{doc_id}/{sheet_name}?name=张三
Content-Type: application/json

{
  "age": 26,
  "email": "new_email@example.com"
}
```

### 删除数据 (DELETE)

通过查询参数匹配要删除的数据：
```bash
DELETE /{doc_id}/{sheet_name}?name=张三
```

## 本地开发

### 安装依赖

```bash
npm install
# 或
yarn install
```

### 配置服务账号

将 Google Cloud 服务账号的 JSON 密钥文件保存为项目根目录下的 `google-serviceaccount.json`。

### 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

服务将在 [http://localhost:3000](http://localhost:3000) 启动。

## 部署

### 部署到 Vercel（推荐）

1. 将项目推送到 GitHub
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 在项目设置的「Environment Variables」中添加环境变量：
   - 变量名：`GOOGLE_SERVICE_ACCOUNT_CREDENTIALS`
   - 变量值：将 `google-serviceaccount.json` 文件的完整内容粘贴进去
4. 点击部署

### 其他部署方式

构建生产版本：
```bash
npm run build
```

启动生产服务器：
```bash
npm run start
```

**注意**：在非 Vercel 环境部署时，确保以下任一方式配置服务账号凭据：
- 设置环境变量 `GOOGLE_SERVICE_ACCOUNT_CREDENTIALS`（值为 JSON 文件内容）
- 或将 `google-serviceaccount.json` 文件放置在项目根目录

## 技术栈

- [Next.js](https://nextjs.org/) - React 全栈框架
- [sheetsql](https://github.com/joway/sheetsql) - Google Sheets 数据库操作库
- [qs](https://www.npmjs.com/package/qs) - URL 查询参数解析

## 相关链接

- [sheetsql GitHub](https://github.com/joway/sheetsql)
- [sheetsql NPM](https://www.npmjs.com/package/sheetsql)
- [Google Cloud 服务账号文档](https://cloud.google.com/docs/authentication/production)

## 许可证

MIT
