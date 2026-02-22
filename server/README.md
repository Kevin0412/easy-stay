# 易宿酒店预订平台 - 后端服务

## 快速开始

### 1. 安装依赖

```bash
cd server
npm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env` 并修改配置：

```bash
cp .env.example .env
```

编辑 `.env` 文件：

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=easy_stay
DB_PORT=3306

JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d

PORT=3000
```

### 3. 初始化数据库

```bash
mysql -u root -p < database.sql
```

### 4. 启动服务

```bash
# 开发模式（自动重启）
npm run dev

# 生产模式
npm start
```

服务将运行在 `http://localhost:3000`

---

## 测试工具

### 方式 1：使用测试脚本（推荐）

```bash
./test_api.sh
```

该脚本会自动测试所有 API 接口，包括：
- 用户认证（注册/登录）
- 酒店管理（CRUD + 审核流程）
- 房型管理
- 价格策略管理
- 价格计算

### 方式 2：使用 Postman

导入 `postman_collection.json` 文件到 Postman，即可使用预配置的接口集合。

### 方式 3：查看详细 API 文档

查看 `API.md` 文件，包含所有接口的详细请求/响应示例。

---

## API 接口文档

### 认证接口

#### 注册
- **POST** `/api/auth/register`
- Body: `{ username, password, email, phone, role }`
- role 可选值: `admin`, `merchant`, `user`（默认为 `user`）
- 返回: `{ success, data: { user_id }, message }`

#### 登录（通用）
- **POST** `/api/auth/login`
- Body: `{ username, password }`
- 返回: `{ success, data: { token, user }, message }`

#### 登录（客户端专用）
- **POST** `/api/auth/login/user`
- Body: `{ username, password }`
- 仅允许 `user` 角色登录
- 返回: `{ success, data: { token, user }, message }`

#### 登录（管理端专用）
- **POST** `/api/auth/login/admin`
- Body: `{ username, password }`
- 仅允许 `admin` 和 `merchant` 角色登录
- 返回: `{ success, data: { token, user }, message }`

#### 获取当前用户信息
- **GET** `/api/auth/me`
- Header: `Authorization: Bearer <token>`
- 返回: `{ success, data: { id, username, email, phone, created_at } }`

---

### 酒店管理接口

所有接口需要在 Header 中携带 token：
```
Authorization: Bearer <token>
```

#### 创建酒店
- **POST** `/api/hotels`
- 权限: 商户
- Body: `{ name_cn, name_en, address, star, open_date }`

#### 获取酒店列表
- **GET** `/api/hotels?status=published&star=5`
- 权限: 登录用户
- 商户只能看到自己的酒店，管理员可以看到所有酒店

#### 获取酒店详情
- **GET** `/api/hotels/:id`
- 权限: 登录用户

#### 更新酒店信息
- **PUT** `/api/hotels/:id`
- 权限: 商户（仅自己的酒店）

#### 删除酒店
- **DELETE** `/api/hotels/:id`
- 权限: 商户（仅自己的酒店）或管理员

#### 提交审核
- **POST** `/api/hotels/:id/publish`
- 权限: 商户（仅自己的酒店）
- 将酒店状态从 draft 改为 pending

#### 审核通过
- **POST** `/api/hotels/:id/approve`
- 权限: 管理员
- 将酒店状态改为 published

#### 下线酒店
- **POST** `/api/hotels/:id/offline`
- 权限: 管理员
- 将酒店状态改为 offline

---

### 房型管理接口

#### 创建房型
- **POST** `/api/rooms`
- 权限: 商户
- Body: `{ hotel_id, room_type, price, stock }`

#### 获取酒店的所有房型
- **GET** `/api/rooms/hotel/:hotel_id`
- 权限: 公开

#### 更新房型
- **PUT** `/api/rooms/:id`
- 权限: 商户（仅自己酒店的房型）

#### 删除房型
- **DELETE** `/api/rooms/:id`
- 权限: 商户（仅自己酒店的房型）

---

### 价格策略接口

#### 创建价格策略
- **POST** `/api/prices`
- 权限: 商户
- Body: `{ hotel_id, room_id, strategy_name, discount, start_date, end_date }`

#### 获取酒店的价格策略
- **GET** `/api/prices/hotel/:hotel_id`
- 权限: 公开

#### 更新价格策略
- **PUT** `/api/prices/:id`
- 权限: 商户（仅自己酒店的策略）

#### 删除价格策略
- **DELETE** `/api/prices/:id`
- 权限: 商户（仅自己酒店的策略）

#### 计算价格
- **GET** `/api/prices/calculate?room_id=1&start_date=2026-02-20&end_date=2026-02-25`
- 权限: 公开
- 返回: `{ success, data: { total_price }, message }`

---

## 数据库表结构

### users（用户表）
- id, username, password, email, phone, role, created_at
- role: `admin`（管理员）, `merchant`（商户）, `user`（普通用户）

### hotels（酒店表）
- id, name_cn, name_en, address, star, open_date, status, created_by, created_at, updated_at

### rooms（房型表）
- id, hotel_id, room_type, price, stock, created_at, updated_at

### price_strategies（价格策略表）
- id, hotel_id, room_id, strategy_name, discount, start_date, end_date, created_at

---

## 项目结构

```
server/
├── src/
│   ├── controllers/      # 控制器层
│   ├── models/          # 数据模型层
│   ├── routes/          # 路由层
│   ├── middleware/      # 中间件（认证、权限）
│   ├── config/          # 配置文件（数据库连接）
│   └── app.js          # 应用入口
├── database.sql        # 数据库初始化脚本
├── package.json
└── .env.example
```

---

## 开发规范

- 变量命名：snake_case
- 异步操作：使用 async/await
- 错误处理：统一返回格式 `{ success, data, message }`
- 权限控制：通过中间件实现
