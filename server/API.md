### 认证接口

#### 1. 用户注册
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "merchant1",
  "password": "password123",
  "role": "merchant"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "user_id": 3
  },
  "message": "user_registered_successfully"
}
```

#### 2. 用户登录
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "admin123"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": 1,
      "username": "admin",
      "role": "admin"
    }
  },
  "message": "login_successful"
}
```

---

### 酒店管理接口

#### 1. 创建酒店
```http
POST /api/hotels
Authorization: Bearer {token}
Content-Type: application/json

{
  "name_cn": "上海外滩酒店",
  "name_en": "Shanghai Bund Hotel",
  "address": "上海市黄浦区中山东一路",
  "star": 5,
  "open_date": "2025-01-01"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "hotel_id": 2
  },
  "message": "hotel_created_successfully"
}
```

#### 2. 获取酒店列表
```http
GET /api/hotels?status=published&star=5
Authorization: Bearer {token}
```

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name_cn": "北京希尔顿酒店",
      "name_en": "Beijing Hilton Hotel",
      "address": "北京市朝阳区建国路",
      "star": 5,
      "open_date": "2020-01-01",
      "status": "published",
      "created_by": 2,
      "created_at": "2026-02-13T17:53:30.031Z",
      "updated_at": "2026-02-13T17:53:30.031Z"
    }
  ],
  "message": ""
}
```

#### 3. 获取酒店详情
```http
GET /api/hotels/1
Authorization: Bearer {token}
```

#### 4. 更新酒店信息
```http
PUT /api/hotels/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "name_cn": "北京希尔顿大酒店",
  "name_en": "Beijing Hilton Grand Hotel",
  "address": "北京市朝阳区建国路100号",
  "star": 5,
  "open_date": "2020-01-01"
}
```

#### 5. 提交审核
```http
POST /api/hotels/1/publish
Authorization: Bearer {token}
```

**响应示例：**
```json
{
  "success": true,
  "data": {},
  "message": "hotel_submitted_for_review"
}
```

#### 6. 审核通过（管理员）
```http
POST /api/hotels/1/approve
Authorization: Bearer {token}
```

#### 7. 下线酒店（管理员）
```http
POST /api/hotels/1/offline
Authorization: Bearer {token}
```

#### 8. 删除酒店
```http
DELETE /api/hotels/1
Authorization: Bearer {token}
```

---

### 房型管理接口

#### 1. 创建房型
```http
POST /api/rooms
Authorization: Bearer {token}
Content-Type: application/json

{
  "hotel_id": 1,
  "room_type": "豪华大床房",
  "price": 888.00,
  "stock": 10
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "room_id": 2
  },
  "message": "room_created_successfully"
}
```

#### 2. 获取酒店的所有房型
```http
GET /api/rooms/hotel/1
```

**响应示例：**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "hotel_id": 1,
      "room_type": "豪华大床房",
      "price": 888,
      "stock": 10,
      "created_at": "2026-02-13T17:53:30.031Z",
      "updated_at": "2026-02-13T17:53:30.031Z"
    }
  ],
  "message": ""
}
```

#### 3. 更新房型
```http
PUT /api/rooms/1
Authorization: Bearer {token}
Content-Type: application/json

{
  "room_type": "豪华大床房",
  "price": 999.00,
  "stock": 15
}
```

#### 4. 删除房型
```http
DELETE /api/rooms/1
Authorization: Bearer {token}
```

---

### 价格策略接口

#### 1. 创建价格策略
```http
POST /api/prices
Authorization: Bearer {token}
Content-Type: application/json

{
  "hotel_id": 1,
  "room_id": 1,
  "strategy_name": "春节优惠",
  "discount": 0.8,
  "start_date": "2026-02-01",
  "end_date": "2026-02-28"
}
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "strategy_id": 2
  },
  "message": "price_strategy_created_successfully"
}
```

#### 2. 获取酒店的价格策略
```http
GET /api/prices/hotel/1
```

#### 3. 计算价格
```http
GET /api/prices/calculate?room_id=1&start_date=2026-02-20&end_date=2026-02-25
```

**响应示例：**
```json
{
  "success": true,
  "data": {
    "total_price": 3552
  },
  "message": ""
}
```

**计算说明：**
- 基础价格：888 元/晚
- 入住天数：5 天（2月20日-2月25日）
- 折扣：0.8（春节优惠）
- 总价：888 × 5 × 0.8 = 3552 元

---

### 错误响应格式

所有错误响应统一格式：

```json
{
  "success": false,
  "message": "error_code"
}
```

**常见错误码：**
- `username_and_password_required` - 用户名和密码必填
- `username_already_exists` - 用户名已存在
- `invalid_credentials` - 用户名或密码错误
- `authentication_required` - 需要登录
- `invalid_token` - Token 无效或过期
- `admin_access_required` - 需要管理员权限
- `merchant_access_required` - 需要商户权限
- `access_denied` - 访问被拒绝
- `hotel_not_found` - 酒店不存在
- `room_not_found` - 房型不存在
- `price_strategy_not_found` - 价格策略不存在
