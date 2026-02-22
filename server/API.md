# API 接口文档

所有接口基础路径：`http://localhost:3000`

需要鉴权的接口请在 Header 中携带：
```
Authorization: Bearer {token}
```

---

## 认证接口 `/api/auth`

### 注册
```http
POST /api/auth/register
```
Body:
```json
{ "username": "testuser", "password": "user123", "email": "test@example.com", "phone": "13800138000", "role": "user" }
```
`role` 可选值：`admin` / `merchant` / `user`（默认 `user`）

响应：
```json
{ "success": true, "data": { "user_id": 4 }, "message": "user_registered_successfully" }
```

### 登录（通用）
```http
POST /api/auth/login
```
Body: `{ "username": "admin", "password": "admin123" }`

响应：
```json
{
  "success": true,
  "data": {
    "token": "eyJ...",
    "user": { "id": 1, "username": "admin", "email": "admin@example.com", "phone": "13900000000", "role": "admin" }
  },
  "message": "login_successful"
}
```

### 客户端登录（仅 user 角色）
```http
POST /api/auth/login/user
```
Body: `{ "username": "testuser", "password": "user123" }`

响应同上，`user` 对象包含 `id / username / email / phone / role`

### 管理端登录（仅 admin / merchant 角色）
```http
POST /api/auth/login/admin
```
Body: `{ "username": "admin", "password": "admin123" }`

响应 `user` 对象包含 `id / username / role`

### 获取当前用户信息
```http
GET /api/auth/me
Authorization: Bearer {token}
```
响应：
```json
{ "success": true, "data": { "id": 3, "username": "testuser", "email": "test@example.com", "phone": "13800138000", "created_at": "2026-02-21T18:00:00.000Z" } }
```

---

## 酒店接口 `/api/hotels`

### 获取轮播图酒店（公开）
```http
GET /api/hotels/carousel?city=北京
```
`city` 可选，不传返回全部高星级酒店（最多5条）

### 获取酒店列表（公开）
```http
GET /api/hotels?status=published&star=5&keyword=希尔顿&city=北京&minPrice=500&maxPrice=2000
```
所有参数可选。商户登录后只返回自己的酒店。

### 获取酒店详情（公开）
```http
GET /api/hotels/:id
```

### 创建酒店（商户）
```http
POST /api/hotels
Authorization: Bearer {token}
```
Body:
```json
{ "name_cn": "上海外滩酒店", "name_en": "Shanghai Bund Hotel", "address": "上海市黄浦区中山东一路", "star": 5, "open_date": "2025-01-01" }
```
响应：`{ "success": true, "data": { "hotel_id": 2 }, "message": "hotel_created_successfully" }`

### 更新酒店（商户，仅自己的酒店）
```http
PUT /api/hotels/:id
Authorization: Bearer {token}
```

### 删除酒店（商户/管理员）
```http
DELETE /api/hotels/:id
Authorization: Bearer {token}
```

### 提交审核（商户）
```http
POST /api/hotels/:id/publish
Authorization: Bearer {token}
```
状态变更：`draft` → `pending`

### 审核通过（管理员）
```http
POST /api/hotels/:id/approve
Authorization: Bearer {token}
```
状态变更：`pending` → `published`

### 审核拒绝（管理员）
```http
POST /api/hotels/:id/reject
Authorization: Bearer {token}
```
Body: `{ "reason": "信息不完整" }`

状态变更：`pending` → `rejected`，原因存入 `reject_reason` 字段

### 下线酒店（管理员）
```http
POST /api/hotels/:id/offline
Authorization: Bearer {token}
```
状态变更：`published` → `offline`

### 恢复上线（管理员）
```http
POST /api/hotels/:id/restore
Authorization: Bearer {token}
```
状态变更：`offline` → `published`

---

## 房型接口 `/api/rooms`

### 获取酒店房型（公开）
```http
GET /api/rooms/hotel/:hotel_id
```
响应：
```json
{
  "success": true,
  "data": [{ "id": 1, "hotel_id": 1, "room_type": "豪华大床房", "price": 888, "stock": 10, "created_at": "...", "updated_at": "..." }]
}
```

### 创建房型（商户）
```http
POST /api/rooms
Authorization: Bearer {token}
```
Body: `{ "hotel_id": 1, "room_type": "豪华大床房", "price": 888.00, "stock": 10 }`

响应：`{ "success": true, "data": { "room_id": 2 }, "message": "room_created_successfully" }`

### 更新房型（商户）
```http
PUT /api/rooms/:id
Authorization: Bearer {token}
```
Body: `{ "room_type": "豪华大床房", "price": 999.00, "stock": 15 }`

### 删除房型（商户）
```http
DELETE /api/rooms/:id
Authorization: Bearer {token}
```

---

## 价格策略接口 `/api/prices`

### 获取酒店价格策略（公开）
```http
GET /api/prices/hotel/:hotel_id
```

### 计算价格（公开）
```http
GET /api/prices/calculate?room_id=1&start_date=2026-02-20&end_date=2026-02-25
```
响应：
```json
{ "success": true, "data": { "total_price": 3552.00 }, "message": "" }
```
计算逻辑：基础价 × 折扣系数（若有策略覆盖该日期段）× 间夜数

### 创建价格策略（商户）
```http
POST /api/prices
Authorization: Bearer {token}
```
Body:
```json
{ "hotel_id": 1, "room_id": 1, "strategy_name": "春节优惠", "discount": 0.8, "start_date": "2026-02-01", "end_date": "2026-02-28" }
```
响应：`{ "success": true, "data": { "strategy_id": 2 }, "message": "price_strategy_created_successfully" }`

### 更新价格策略（商户）
```http
PUT /api/prices/:id
Authorization: Bearer {token}
```

### 删除价格策略（商户）
```http
DELETE /api/prices/:id
Authorization: Bearer {token}
```

---

## 订单接口 `/api/orders`

### 创建订单（登录用户）
```http
POST /api/orders
Authorization: Bearer {token}
```
Body:
```json
{ "hotel_id": 1, "room_id": 1, "check_in": "2026-03-01", "check_out": "2026-03-03", "nights": 2, "total_price": 1776.00 }
```
响应：
```json
{ "success": true, "data": { "order_id": 1 }, "message": "order_created" }
```
说明：创建时会检查房间库存（事务锁），库存不足返回 `room_out_of_stock`

### 获取我的订单（登录用户）
```http
GET /api/orders
Authorization: Bearer {token}
```
响应：
```json
{
  "success": true,
  "data": [{
    "id": 1, "hotel_id": 1, "room_id": 1,
    "check_in": "2026-03-01T00:00:00.000Z", "check_out": "2026-03-03T00:00:00.000Z",
    "nights": 2, "total_price": 1776, "status": "confirmed",
    "hotel_name": "北京希尔顿酒店", "room_type": "豪华大床房",
    "created_at": "2026-02-22T10:00:00.000Z"
  }]
}
```

---

## 收藏接口 `/api/favorites`

### 获取我的收藏（登录用户）
```http
GET /api/favorites
Authorization: Bearer {token}
```
响应：`{ "success": true, "data": [{ "id": 1, "name_cn": "...", "address": "...", "star": 5 }] }`

### 添加收藏（登录用户）
```http
POST /api/favorites
Authorization: Bearer {token}
```
Body: `{ "hotel_id": 1 }`

### 检查是否已收藏（登录用户）
```http
GET /api/favorites/check/:hotel_id
Authorization: Bearer {token}
```
响应：`{ "success": true, "data": true }`

### 取消收藏（登录用户）
```http
DELETE /api/favorites/:hotel_id
Authorization: Bearer {token}
```

---

## 错误响应格式

```json
{ "success": false, "message": "error_code" }
```

常见错误码：

| 错误码 | 说明 |
|--------|------|
| `username_and_password_required` | 用户名和密码必填 |
| `username_already_exists` | 用户名已存在 |
| `invalid_credentials` | 用户名或密码错误 |
| `no_permission` | 角色无权访问（如普通用户登录管理端）|
| `authentication_required` | 需要登录 |
| `invalid_token` | Token 无效或过期 |
| `admin_access_required` | 需要管理员权限 |
| `merchant_access_required` | 需要商户权限 |
| `access_denied` | 访问被拒绝（如操作他人资源）|
| `hotel_not_found` | 酒店不存在 |
| `room_not_found` | 房型不存在 |
| `price_strategy_not_found` | 价格策略不存在 |
| `room_out_of_stock` | 房间库存不足 |
| `missing_required_fields` | 缺少必填字段 |
