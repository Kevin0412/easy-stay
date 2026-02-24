# 易宿酒店预订平台









## 一、项目目标

构建一个前后端分离的智慧酒店预订系统，包含：

- **用户端**（多端支持：微信小程序、H5、React Native App）
- **商户端后台管理系统**（PC 端）

实现以下核心功能：

- 酒店查询
- 列表筛选
- 详情展示
- 商户信息录入
- 管理员审核发布流程

---

## 二、技术选型

### 前端（用户端）

- **框架**：Taro + React + TypeScript  
  **优势**：一套代码多端输出（微信小程序、H5、React Native），支持主题切换，组件化抽象，开发效率高。

### 后台管理系统（PC）

- **框架**：React + Ant Design（或 Ant Design Pro）  
  **要求**：功能实现为主，UI 美观为辅。

### 后端

- **运行环境**：Node.js + Express  
- **数据库**：MySQL

---

## 三、系统架构设计

```
用户端（小程序 / H5 / App）
        │
        ▼ REST API
   Node.js 服务端
        │
    ┌────┴────┐
    │         │
  MySQL   文件存储
（酒店数据）（图片资源）
```

---

## 四、数据库设计（核心表）

### 1️⃣ 用户表（users）

| 字段名       | 类型                               | 说明                          |
| ------------ | ---------------------------------- | ----------------------------- |
| id           | int                                | 主键                          |
| username     | varchar                            | 用户名                        |
| password     | varchar                            | 密码（加密存储）              |
| role         | enum('admin','merchant','user')    | 角色：管理员/商户/普通用户    |
| email        | varchar                            | 邮箱                          |
| phone        | varchar                            | 手机号                        |
| created_at   | datetime                           | 创建时间                      |

### 2️⃣ 酒店表（hotels）

| 字段名        | 类型                                                        | 说明                              |
| ------------- | ----------------------------------------------------------- | --------------------------------- |
| id            | int                                                         | 主键                              |
| name_cn       | varchar                                                     | 中文名称                          |
| name_en       | varchar                                                     | 英文名称                          |
| address       | varchar                                                     | 地址                              |
| star          | int                                                         | 星级                              |
| open_date     | date                                                        | 开业日期                          |
| status        | enum('draft','pending','published','rejected','offline')    | 状态：草稿/审核中/已通过/未通过/已下线 |
| reject_reason | varchar(500)                                                | 审核不通过原因                    |
| created_by    | int                                                         | 创建人（user_id）                 |

### 3️⃣ 房型表（rooms）

| 字段名     | 类型    | 说明             |
| ---------- | ------- | ---------------- |
| id         | int     | 主键             |
| hotel_id   | int     | 所属酒店         |
| room_type  | varchar | 房型名称         |
| price      | decimal | 基础价格         |
| stock      | int     | 库存             |

### 4️⃣ 价格策略表（price_strategies）

**创新点**：支持节假日折扣、套餐优惠等动态价格计算。

| 字段名       | 类型    | 说明                       |
| ------------ | ------- | -------------------------- |
| id           | int     | 主键                       |
| hotel_id     | int     | 所属酒店                   |
| room_id      | int     | 关联房型（可选）           |
| strategy_name| varchar | 策略名称（如“国庆折扣”）   |
| discount     | decimal | 折扣系数（0.8 表示八折）   |
| start_date   | date    | 生效开始日期               |
| end_date     | date    | 生效结束日期               |

---

## 五、两人分工方案

### 👨‍💻 A 负责（技术能力较强）

**1. 后端设计与开发**
- 数据库设计
- RESTful API 实现
- 权限控制
- 审核发布逻辑

**2. 用户端核心页面**
- 酒店查询页
- 酒店列表页（含虚拟列表优化）
- 酒店详情页（含日历组件、实时价格计算）
- 主题系统（深色模式、老年模式）

**3. 多端适配与性能优化**
- Taro 多端构建
- 长列表性能优化
- 联调与 bug 修复

### 👨‍💻 B 负责（协作开发）

**1. 后台管理系统**
- 登录 / 注册
- 酒店信息录入
- 酒店审核列表
- 发布 / 下线操作

**2. UI/UX 优化**
- Banner 设计
- 页面布局美化
- 筛选交互体验提升

**3. 联调辅助**
- 配合 API 联调
- 基础 bug 修复

---

## 六、用户端功能设计

### 1️⃣ 酒店查询页（首页）

**功能模块**：
- Banner 轮播
- 定位服务（Taro 定位 API）
- 关键字搜索
- 自定义日历组件（入住/离店日期选择）
- 筛选面板（价格、星级、区域）
- 快捷标签（热门推荐、附近）
- 查询按钮

**技术重点**：
- 状态管理（Zustand / Redux）
- 自定义组件抽象

---

### 2️⃣ 酒店列表页

**功能模块**：
- 条件展示头（当前筛选条件）
- 二级筛选（更多筛选条件展开）
- 无限滚动加载（IntersectionObserver / onReachBottom）

**技术重点**：
- **虚拟列表优化**（react-window 或手写虚拟滚动）
- 提升长列表渲染性能

---

### 3️⃣ 酒店详情页

**功能模块**：
- 图片轮播
- 酒店信息展示
- 日历选择（入住/离店）
- 房型列表（含库存、价格）
- **实时价格计算**（基础价 + 节假日加价 - 优惠）

**技术重点**：
- 动态价格策略引擎
- 房型库存实时校验

---

## 七、多端适配设计

### 🌗 1. 深色模式

- **检测**：`prefers-color-scheme`
- **切换**：手动开关
- **实现**：CSS 变量 + `[data-theme="dark"]`

```css
[data-theme="dark"] {
  background: #111;
  color: #eee;
}
```

### 👴 2. 老年模式（字体放大）

- **原理**：根节点 `font-size` 按比例放大，页面所有尺寸使用 `rem` 单位。
- **切换**：一键切换 `html[data-font="large"]`。

```css
html[data-font="large"] {
  font-size: 18px;
}
```

### 📱 3. 多端输出

Taro 构建命令示例：

```bash
taro build --type weapp
taro build --type h5
taro build --type rn
```

---

## 八、后台管理系统设计

**页面清单**：
- 登录/注册页（角色选择：商户 / 管理员）
- 酒店管理列表（商户）：状态筛选、星级筛选（含"全部"选项）、按 ID 排序
- 酒店信息录入/编辑（商户）：含封面图、图集、设施服务、附近景点、房型管理、价格策略管理
- 酒店审核页（管理员）：状态筛选（含"全部"选项）、查看详情、通过/不通过/下线/恢复

**审核流程**：
```
商户提交 → 状态 pending（审核中）
管理员查看详情 → 执行审核决定
管理员审核通过 → 状态 published（已通过）
管理员审核不通过 → 状态 rejected（未通过，含原因）
管理员下线 → 状态 offline（已下线，可恢复）
管理员恢复 → 状态 published（重新上线）
```

**酒店详情 Drawer**（管理员审核时可查看）：
- 基本信息：中英文名、地址、星级、开业日期、当前审核状态
- 封面图片预览
- 图集（支持点击大图预览）
- 设施服务标签
- 附近景点标签

**权限说明**：
- 管理员（admin）：仅可访问酒店审核页，执行查看详情/通过/不通过/下线/恢复操作
- 商户（merchant）：仅可访问酒店管理页，进行酒店信息录入与提交
- 普通用户（user）：无法登录后台管理系统

---

## 九、项目创新点（建议做，冲高分）

1. **价格实时计算**  
   根据入住天数、房型库存、节日折扣动态计算总价，前端实时反馈。

2. **虚拟列表优化**  
   酒店列表页采用虚拟列表，大幅提升大量数据渲染性能。

3. **用户偏好缓存**  
   localStorage 存储上次入住城市、最近筛选条件，提升用户体验。

4. **酒店热度排序算法**  
   热度 = 浏览量 × 0.3 + 评分 × 0.7，提供“智能排序”选项。

---

## 十、项目初始文件夹结构

```
easy-stay/
│
├── server/                       # Node 后端
│   ├── src/
│   │   ├── controllers/          # 控制器
│   │   ├── models/              # 数据模型
│   │   ├── routes/              # 路由
│   │   ├── middleware/          # 中间件（权限、日志等）
│   │   ├── utils/              # 工具函数
│   │   ├── config/             # 配置文件
│   │   └── app.js              # 应用入口
│   └── package.json
│
├── client-weapp-h5/              # 用户端（Taro：微信小程序 / H5）
│   ├── src/
│   │   ├── pages/
│   │   │   ├── home/           # 首页
│   │   │   ├── list/           # 列表页
│   │   │   ├── detail/         # 详情页
│   │   │   └── profile/        # 个人中心
│   │   ├── components/         # 公共组件
│   │   │   ├── Calendar/       # 日历组件
│   │   │   ├── HotelCard/      # 酒店卡片
│   │   │   ├── FilterPanel/    # 筛选面板
│   │   │   └── ThemeSwitcher/  # 主题切换
│   │   ├── store/             # 状态管理
│   │   ├── hooks/             # 自定义 Hooks
│   │   ├── services/          # API 服务
│   │   ├── theme/             # 主题配置
│   │   └── app.tsx            # 应用入口
│   └── package.json
│
├── client-admin/                 # 后台管理系统（React + AntD）
│   ├── src/
│   │   ├── pages/
│   │   │   ├── login/              # 登录/注册（角色选择）
│   │   │   ├── hotel-list/         # 酒店管理列表（商户）
│   │   │   ├── hotel-edit/         # 酒店录入/编辑
│   │   │   │   └── components/
│   │   │   │       ├── room-manager.tsx          # 房型管理
│   │   │   │       └── price-strategy-manager.tsx # 价格策略管理
│   │   │   └── audit/              # 酒店审核页（管理员）
│   │   ├── components/
│   │   │   ├── auth-route/         # 路由权限守卫
│   │   │   ├── hotel-status-tag/   # 审核状态标签
│   │   │   └── layout/             # 管理后台布局
│   │   ├── services/               # API 封装（hotel.ts 等）
│   │   ├── store/                  # 状态管理（Zustand）
│   │   ├── router/                 # 路由配置
│   │   ├── utils/                  # 工具函数
│   │   └── App.tsx                 # 应用入口
│   └── package.json
│
├── client-android/               # Android 客户端（Taro RN）✅ 稳定
│   └── ...
│
└── readme.md
```

---

## 十一、代码规范与命名规范

为保证项目可维护性与团队协作效率，制定以下统一规范。

---

### 一、变量命名规范

**风格**：
- **后端（Node.js）**：全小写 + 下划线分隔（snake_case）
- **前端（React/TypeScript）**：小驼峰（camelCase），与 React 社区惯例一致
- **数据库字段、接口参数、JSON 字段**：统一使用 snake_case

✅ 后端推荐：
```js
hotel_list
user_info
check_in_date
total_price
is_published
```

✅ 前端推荐：
```ts
fetchHotels
loadHotel
hotelList
checkInDate
totalPrice
```

❌ 避免：
```js
TotalPrice
data1
```

**布尔变量**：`is_xxx` / `has_xxx` / `can_xxx`

**常量**：全大写 + 下划线  
```js
MAX_ROOM_COUNT
HOTEL_STATUS_PENDING
```

---

### 二、数据库字段命名规范

统一使用 **snake_case**，例如：`created_at`、`hotel_id`、`open_date`。

---

### 三、接口命名规范（RESTful）

- 资源使用复数形式
- 特殊操作使用动词后缀

```
# 认证
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

# 酒店
GET    /api/hotels
GET    /api/hotels/carousel
GET    /api/hotels/:id
POST   /api/hotels
PUT    /api/hotels/:id
DELETE /api/hotels/:id
POST   /api/hotels/:id/publish
POST   /api/hotels/:id/approve
POST   /api/hotels/:id/reject
POST   /api/hotels/:id/offline
POST   /api/hotels/:id/restore

# 房型
GET    /api/rooms/hotel/:hotel_id
POST   /api/rooms
PUT    /api/rooms/:id
DELETE /api/rooms/:id

# 价格策略
GET    /api/prices/hotel/:hotel_id
GET    /api/prices/calculate
POST   /api/prices
PUT    /api/prices/:id
DELETE /api/prices/:id

# 收藏
GET    /api/favorites
GET    /api/favorites/check/:hotel_id
POST   /api/favorites
DELETE /api/favorites/:hotel_id

# 订单
GET    /api/orders
POST   /api/orders
```

---

### 四、文件命名规范

- **前端组件**：kebab-case（短横线分隔）  
  例：`hotel-card.tsx`、`filter-panel.tsx`

- **后端文件**：snake_case  
  例：`hotel_controller.js`、`user_model.js`

---

### 五、Git 提交规范

```
feat: 新增酒店查询接口
fix: 修复价格计算错误
refactor: 重构酒店审核逻辑
style: 优化列表样式
docs: 更新 README
```

---

### 六、代码风格规范

1. **缩进**：2 空格
2. **异步**：统一使用 `async/await`，避免回调
3. **错误处理**：统一响应格式

```js
return res.status(400).json({
  success: false,
  message: 'hotel_not_found'
})
```

---

### 七、状态枚举规范

```js
HOTEL_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PUBLISHED: 'published',
  REJECTED: 'rejected',
  OFFLINE: 'offline'
}
```

数据库存储小写字符串。

---

### 八、时间统一规范

- 后端存储：UTC 时间
- 前端传输：ISO 字符串（`2026-02-13T08:00:00Z`）

---

### 九、项目目录层级原则

- 功能模块独立目录
- Controller 不直接操作数据库 → 经过 Service 层
- 权限控制统一使用 Middleware

---

### 十、接口响应格式统一

**成功**：
```json
{
  "success": true,
  "data": {},
  "message": ""
}
```

**失败**：
```json
{
  "success": false,
  "message": "hotel_not_found"
}
```

---

### 十一、注释规范

函数必须包含 JSDoc 注释：

```js
/**
 * 计算实时价格
 * @param {number} base_price - 基础价格
 * @param {number} days - 入住天数
 * @param {number} discount - 折扣系数
 * @returns {number} 最终价格
 */
```

---

### 十二、环境变量规范

使用 `.env` 文件管理配置：

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=123456
JWT_SECRET=your_secret
PORT=3000
```

---

## 十三、多端编译与运行指南

### 📱 用户端多端支持

用户端基于 Taro 4.x 框架开发，支持以下平台：

- **H5 网页版**：浏览器访问
- **微信小程序**：微信开发者工具
- **React Native**：Android/iOS App

---

## 十四、后台管理系统运行指南

### 🚀 快速启动

需要同时启动后端服务和前端管理界面（各开一个终端）。

#### 后端服务

```bash
cd server
npm install       # 首次运行
npm run dev       # 开发模式（nodemon 自动重启）
```

默认监听 `http://localhost:3000`。

启动前确保 MySQL 已运行，并执行 `database.sql` 初始化表结构，`.env` 中填写正确的 MySQL 连接信息。

#### 前端管理界面

```bash
cd client-admin
npm install       # 首次运行
npm run dev
```

启动后访问终端显示的地址（通常为 `http://localhost:5173`）。

### 🔑 测试账号

| 账号       | 密码      | 角色     | 可访问页面   |
| ---------- | --------- | -------- | ------------ |
| admin      | admin123  | 管理员   | 酒店审核     |
| merchant1  | admin123  | 商户     | 酒店管理     |
| testuser   | user123   | 普通用户 | 无法登录后台 |

---

### 🌐 用户端多端支持

#### 1. 安装依赖

```bash
cd client-weapp-h5
npm install --legacy-peer-deps
```

> 注意：由于 Taro 依赖兼容性问题，可能需要使用 `--legacy-peer-deps` 参数

---

### 🌐 H5 网页版

#### 开发模式（推荐）

```bash
npm run dev:h5
```

启动后访问：`http://localhost:10086`

- 支持热更新
- 实时预览修改
- 局域网访问：`http://0.0.0.0:10086`（可在手机浏览器测试）

#### 生产构建

```bash
npm run build:h5
```

构建产物位于 `dist/` 目录，可直接部署到静态服务器。

---

### 📱 微信小程序

#### 开发模式

```bash
npm run dev:weapp
```

#### 生产构建

```bash
npm run build:weapp
```

构建完成后：
1. 打开微信开发者工具
2. 导入项目，选择 `dist/` 目录
3. 预览或上传代码

---

### 📲 Android App（Taro RN）

本项目使用 **Taro 4.x** 构建 React Native 输出，与用户端共享业务代码。

#### 环境要求

- Node.js v16+
- JDK 17（AGP 要求，JDK 11 或 21 均不兼容）
- Android SDK
- ADB 工具
- USB 连接的 Android 设备（需开启开发者选项和 USB 调试）

JDK 17 安装（Ubuntu）：

```bash
sudo apt-get install -y openjdk-17-jdk
```

#### 编译和运行步骤

**步骤 1：启动后端服务器**

```bash
cd server
npm start
# 后端运行在 http://localhost:3000
```

**步骤 2：确认设备连接**

```bash
adb devices
# 确保输出中有设备且状态为 device
```

**步骤 3：设置端口转发**

将电脑的 Metro bundler 和后端 API 端口转发到设备：

```bash
adb reverse tcp:8081 tcp:8081
adb reverse tcp:3000 tcp:3000
```

> USB 重新插拔或 ADB 重启后转发会丢失，需重新执行。可通过 `adb reverse --list` 查看当前转发状态。

**步骤 4：启动 Metro 开发服务器**

```bash
cd client-android
npm run android:dev
```

如果 8081 端口被占用：

```bash
lsof -ti:8081 | xargs kill -9
```

**步骤 5：构建并安装 APK**

首次运行或原生层代码变更时需要重新构建：

```bash
cd client-android

# 构建 RN bundle
npx taro build --type rn --platform android

# 构建 debug APK（需指定 JDK 17）
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 ./android/gradlew -p android assembleDebug

# 安装到设备
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

**步骤 6：启动应用**

```bash
adb shell monkey -p com.easystayuser -c android.intent.category.LAUNCHER 1
```

> 仅修改 JS/TS 代码时无需重新构建 APK，Metro 会自动热更新。在设备上摇一摇选择 Reload 或双击 R 可手动刷新。

#### 快速重新部署

如果修改了原生层代码（android/ 目录下的文件），需要重新编译：

```bash
cd client-android

npx taro build --type rn --platform android
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 ./android/gradlew -p android assembleDebug
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

如果只修改了 JS/TS 代码，Metro 会自动热更新，无需重新构建 APK。

#### 生成 Release APK

```bash
cd client-android

JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 ./android/gradlew -p android assembleRelease

# APK 位置：android/app/build/outputs/apk/release/app-release.apk
```

#### 常用 ADB 命令

```bash
# 查看连接的设备
adb devices

# 端口转发（USB 重插后需重新执行）
adb reverse tcp:8081 tcp:8081
adb reverse tcp:3000 tcp:3000

# 查看当前转发状态
adb reverse --list

# 安装 APK
adb install -r android/app/build/outputs/apk/debug/app-debug.apk

# 卸载应用
adb uninstall com.easystayuser

# 查看应用日志
adb logcat | grep EasyStayUser

# 重启 ADB 服务
adb kill-server
adb start-server
```

---

### 🔧 常见问题

#### 1. H5 编译报错 `Cannot find module 'ajv'`

```bash
npm install --legacy-peer-deps ajv
```

#### 2. AGP 要求 Java 17

```
Android Gradle plugin requires Java 17 to run.
```

安装 JDK 17 并通过 `JAVA_HOME` 指定：

```bash
sudo apt-get install -y openjdk-17-jdk
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 ./android/gradlew -p android assembleDebug
```

#### 3. 样式在 React Native 中不显示

React Native 不支持以下 CSS 特性：
- `linear-gradient`（使用纯色替代）
- `transition`（使用 Animated API）
- `box-shadow` 的 rgba 值（使用简化版本）
- 组合选择器（如 `.parent .child`）

#### 4. Gradle 下载超时

配置国内镜像或使用已下载的 Gradle：
```bash
# 在 android/gradle/wrapper/gradle-wrapper.properties 中修改
distributionUrl=https\://mirrors.cloud.tencent.com/gradle/gradle-8.3-all.zip
```

---

### 📊 多端兼容性说明

| 功能 | H5 | 微信小程序 | React Native |
|------|----|-----------|--------------|
| 酒店列表 | ✅ | ✅ | ✅ |
| 酒店详情 | ✅ | ✅ | ✅ |
| 价格计算 | ✅ | ✅ | ✅ |
| 日期选择 | ✅ | ✅ | ✅ |
| 星级筛选 | ✅ | ✅ | ✅ |
| 深色模式 | ✅ | ⚠️ 部分支持 | ✅ |
| 定位服务 | ⚠️ 需 HTTPS | ✅ | ✅ |

---

### 🎯 推荐开发流程

1. **H5 优先开发**：使用 H5 模式快速开发和调试
2. **小程序适配**：完成功能后在微信开发者工具中测试
3. **React Native 测试**：最后进行 App 端适配和测试

---

### 📝 版本信息

- **Taro**: 4.1.11
- **React**: 18.3.1
- **Node.js**: 建议 v16-v20
- **npm**: 建议 v8+

---

### 🔗 相关文档

- [Taro 官方文档](https://taro-docs.jd.com/)
- [React Native 官方文档](https://reactnative.dev/)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

---

## 十五、功能完成情况与待办事项

> 评分截止：2/26 20:00，答辩：3/2–3/5

### 用户端（60分功能分）

#### 首页（5分）
- [x] Banner 轮播图（按城市筛选，点击跳转详情）
- [x] 城市定位（Taro.getLocation，坐标匹配城市，失败可手动选择）
- [x] 关键字搜索
- [x] 日期选择（入住/离店，显示间夜数，自定义 Calendar 组件）
- [x] 星级筛选
- [x] 价格范围筛选（可展开/收起）
- [x] 快捷标签（携带当前城市参数）

#### 列表页（15分）
- [x] 筛选条件摘要展示（城市可移除标签）
- [x] 日期/间夜展示栏
- [x] 星级二次筛选（FilterPanel 组件）
- [x] 价格范围筛选（FilterPanel 组件）
- [x] 虚拟列表渲染（只渲染可视区域卡片，paddingTop/Bottom 撑高）
- [x] 无限滚动加载（小程序 onReachBottom + H5 scroll 监听）
- [x] 响应式布局

#### 详情页（15分）
- [x] 顶部导航头（显示酒店名称 + 返回列表页）
- [x] 图片横向轮播（大图 Banner，左右滚动）
- [x] 酒店基础信息（名称/星级/设施/地址/开业日期/附近景点）
- [x] 设施信息展示（facilities 字段，绿色标签）
- [x] 房型列表（价格从低到高排序，含库存，含房型图片）
- [x] 日历 + 间夜 Banner（自定义 Calendar 组件）
- [x] 实时价格计算（含折扣策略）
- [x] 立即预订跳转
- [x] 收藏/取消收藏

#### 后台管理（25分，B 负责）
- [x] 登录/注册（商户/管理员角色）
- [x] 酒店信息录入/编辑（含 facilities、nearby、房型图片字段）
- [x] 酒店管理列表（状态/星级筛选含"全部"选项，按 ID 排序）
- [x] 审核列表（pending/published/rejected/offline，含"全部"筛选，按 ID 排序）
- [x] 管理员查看酒店详情（Drawer 展示封面、图集、设施标签、附近景点）
- [x] 审核通过/拒绝（含原因）/下线/恢复

#### 预订流程（用户端额外功能）
- [x] 确认预订页
- [x] 库存校验（事务锁，售罄提示）
- [x] 我的订单（个人中心）
- [x] 收藏列表（个人中心）

---

### 技术复杂度（10分）

- [x] 实时价格更新机制（基础价 × 折扣 × 间夜数，2分）
- [x] 页面交互流畅（虚拟列表、骨架加载、Toast 反馈，5分）
- [x] 长列表渲染优化（可视区域切片 + paddingTop/Bottom 撑高，3分）

---

### 用户体验（10分）

- [x] 页面视觉设计美感、布局合理（6分）
- [x] 页面兼容性（H5 + 微信小程序 + React Native WebView，4分）
- [x] 深色模式（CSS 变量 + `[data-theme="dark"]`，ThemeSwitcher 组件）
- [x] 老年模式（`[data-font="elder"]` 根字体放大，一键切换）

---

### 代码质量（10分）

- [x] 项目结构清晰、表结构设计合理（controllers/models/routes/middleware 分层，4分）
- [x] 编码规范（snake_case）+ 良好的 README 说明（3分）
- [x] 代码复用（Calendar、FilterPanel、ThemeSwitcher、HotelCard 组件抽取，3分）

---

### 创新点（10分）

- [x] 新技术提升研发效率（Taro 多端、Zustand 状态管理、虚拟列表、JWT 鉴权，5分）
- [x] 自发设计有助于提升用户体验的功能点（5分）：
  - 价格折扣策略引擎（price_strategies 表，节假日动态折扣）
  - 坐标自动识别城市（定位 API）
  - 预订库存事务锁（防超卖）
  - 自定义 Calendar 日历组件（日期范围选择，首页+详情页）
  - 深色/老年模式切换（ThemeSwitcher）
  - 酒店热度排序算法（views × 0.3 + star × 0.7）
  - 用户偏好缓存（localStorage 存储上次搜索条件，首页自动恢复）

---

### 各子项目状态

| 子项目 | 说明 | 状态 |
| --- | --- | --- |
| server | Node.js 后端服务 | ✅ 稳定 |
| client-admin | 后台管理系统（React + AntD） | ✅ 稳定 |
| client-weapp-h5 | 用户端（微信小程序 / H5） | ✅ 稳定 |
| client-android | Android 客户端（Taro RN） | ✅ 稳定 |

---
