## 1. 基础设施：提取共享模块

- [ ] 1.1 显式安装 `googleapis` 为直接依赖（参考 `sheetsql` 使用的版本范围以确保兼容）
- [ ] 1.2 创建 `src/lib/sheets-client.ts`，封装 Google Sheets API v4 客户端初始化和认证逻辑（从现有 `route.ts` 的 `getCommonDbConfig` 提取并复用密钥文件路径判断）
- [ ] 1.3 在 `src/lib/sheets-client.ts` 中导出共享的 CORS 头常量和 `createResponse` 工具函数，供管理路由和现有 CRUD 路由共用
- [ ] 1.4 重构现有 CRUD 路由 `src/app/api/[doc_id]/[[...sheet_name]]/route.ts`，改为从 `sheets-client.ts` 导入共享逻辑

## 2. Sheet 管理 API

- [ ] 2.1 创建路由文件 `src/app/api/[doc_id]/_meta/sheets/route.ts`
- [ ] 2.2 实现 GET 处理器：调用 `spreadsheets.get` 获取文档元数据，返回所有工作表的 `sheetId` 和 `title` 列表
- [ ] 2.3 实现 POST 处理器：接收 `{ title, headers? }` 参数，调用 `spreadsheets.batchUpdate` 的 `addSheet` 请求创建工作表；若提供 `headers` 则追加 `spreadsheets.values.update` 写入第一行
- [ ] 2.4 实现 PUT 处理器：接收 `{ title, newTitle }` 参数，先查找对应 `sheetId`，再调用 `spreadsheets.batchUpdate` 的 `updateSheetProperties` 请求重命名
- [ ] 2.5 实现 DELETE 处理器：接收 `{ title }` 参数，先查找对应 `sheetId`，再调用 `spreadsheets.batchUpdate` 的 `deleteSheet` 请求删除
- [ ] 2.6 实现 OPTIONS 处理器和错误处理（名称冲突 409、不存在 404、参数缺失 400）

## 3. 表头管理 API

- [ ] 3.1 创建路由文件 `src/app/api/[doc_id]/_meta/[sheet_name]/headers/route.ts`
- [ ] 3.2 实现 GET 处理器：调用 `spreadsheets.values.get` 读取第一行，返回 `{ headers: [...] }`；空表返回空数组
- [ ] 3.3 实现 POST 处理器：接收 `{ headers: [...] }` 参数，调用 `spreadsheets.values.update` 写入第一行列名；区分新建（201）和覆盖（200）的状态码
- [ ] 3.4 实现 OPTIONS 处理器和参数校验（headers 缺失 400、非字符串元素 400、Sheet 不存在 404）

## 4. 前端文档更新

- [ ] 4.1 更新 `src/app/page.tsx` API 文档页面，添加 Sheet 管理和表头管理接口的使用说明和示例
