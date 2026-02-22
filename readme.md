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
- 登录页
- 注册页
- 酒店列表（管理）
- 酒店信息录入
- 酒店审核页

**审核流程**：
```
商户提交 → 状态 pending（审核中）
管理员审核通过 → 状态 published（已通过）
管理员审核不通过 → 状态 rejected（未通过，含原因）
管理员下线 → 状态 offline（已下线，可恢复）
管理员恢复 → 状态 published（重新上线）
```

**权限说明**：
- 管理员（admin）：仅可访问酒店审核页，执行通过/不通过/下线/恢复操作
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
├── client-user/                  # 用户端（Taro）
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
│   │   │   ├── login/         # 登录
│   │   │   ├── hotel-list/    # 酒店管理列表
│   │   │   ├── hotel-edit/    # 酒店录入/编辑
│   │   │   └── audit/         # 审核页
│   │   ├── components/        # 公共组件
│   │   ├── services/          # API 服务
│   │   └── App.tsx            # 应用入口
│   └── package.json
│
└── README.md
```

---

## 十一、代码规范与命名规范

为保证项目可维护性与团队协作效率，制定以下统一规范。

---

### 一、变量命名规范

**风格**：全小写 + 下划线分隔（snake_case）

**适用范围**：变量名、数据库字段、接口参数、JSON 字段、常量（大写）

✅ 推荐：
```js
hotel_list
user_info
check_in_date
total_price
is_published
```

❌ 避免：
```js
hotelList
checkInDate
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
GET    /api/hotels
GET    /api/hotels/:id
POST   /api/hotels
PUT    /api/hotels/:id
DELETE /api/hotels/:id

POST   /api/hotels/:id/publish
POST   /api/hotels/:id/approve
POST   /api/hotels/:id/reject
POST   /api/hotels/:id/offline
POST   /api/hotels/:id/restore
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

用户端基于 Taro 3.6.23 框架开发，支持以下平台：

- **H5 网页版**：浏览器访问
- **微信小程序**：微信开发者工具
- **React Native**：Android/iOS App

---

## 十三、后台管理系统运行指南

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
cd client-user
npm install --legacy-peer-deps
```

> 注意：由于 Taro 3.x 的依赖兼容性问题，需要使用 `--legacy-peer-deps` 参数

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

### 📲 React Native (Android/iOS App)

本项目使用 **WebView + Taro H5** 方案实现原生 APP，具有以下优势：
- ✅ 开发效率高，一套代码多端运行
- ✅ 支持热更新，无需重新编译 APK
- ✅ 体验接近原生 APP

#### 前置准备

1. **安装 Android SDK**（如果还没有）
   ```bash
   # 检查 Android SDK 是否已安装
   ls ~/Android/Sdk
   ```

2. **配置环境变量**
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. **连接 Android 设备**
   ```bash
   # 启用 USB 调试，连接手机后检查
   adb devices
   ```

#### 编译和运行步骤

**步骤 1：启动后端服务器**

```bash
cd server
npm start
# 后端运行在 http://localhost:3000
```

**步骤 2：启动 Taro H5 开发服务器**

```bash
cd client-user
npm run dev:h5
# H5 运行在 http://localhost:10086
```

**步骤 3：配置本机 IP 地址**

编辑 `client-user/src/config/index.ts`，修改 `DEV_HOST` 为你的局域网 IP：

```typescript
// 查看本机 IP：ip addr 或 ifconfig
export const DEV_HOST = '192.168.x.x'  // 修改为你的 IP
```

**步骤 4：编译并安装 APP**

```bash
cd ../EasyStayNative

# 首次运行需要安装依赖
npm install

# 编译并安装到设备
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
npx react-native run-android --deviceId <你的设备ID>

# 或者不指定设备ID（如果只连接了一个设备）
npx react-native run-android
```

**步骤 5：在手机上打开 APP**

- APP 名称：**EasyStayNative**
- APP 会自动加载 Taro H5 页面
- 支持热更新：修改代码后 H5 自动刷新

#### 快速重新部署

如果修改了 APP 代码（EasyStayNative/App.tsx），需要重新编译：

```bash
cd EasyStayNative

# 卸载旧版本（可选）
adb uninstall com.easystaynative

# 重新编译安装
npx react-native run-android
```

如果只修改了 Taro 项目代码（client-user/src），**无需重新编译 APP**，H5 会自动热更新。

#### 生成 Release APK

```bash
cd EasyStayNative/android

# 生成签名的 release APK
./gradlew assembleRelease

# APK 位置
# android/app/build/outputs/apk/release/app-release.apk
```

#### 常用 ADB 命令

```bash
# 查看连接的设备
adb devices

# 安装 APK
adb install app-release.apk

# 卸载应用
adb uninstall com.easystaynative

# 查看应用日志
adb logcat | grep EasyStay

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

#### 2. React Native 编译报错

确保已安装以下依赖：
```bash
npm install --legacy-peer-deps @tarojs/rn-runner@3.6.23 @tarojs/rn-supporter@3.6.23
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

- **Taro**: 3.6.23
- **React**: 18.3.1
- **Node.js**: 建议 v16-v20
- **npm**: 建议 v8+

---

### 🔗 相关文档

- [Taro 官方文档](https://taro-docs.jd.com/)
- [React Native 官方文档](https://reactnative.dev/)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

---

## 十四、功能完成情况与待办事项

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
- [x] 图片横向轮播
- [x] 酒店基础信息（名称/星级/地址/开业日期/附近景点）
- [x] 设施信息展示（facilities 字段，绿色标签）
- [x] 房型列表（价格从低到高排序，含库存）
- [x] 日期选择 + 间夜数展示（自定义 Calendar 组件）
- [x] 实时价格计算（含折扣策略）
- [x] 立即预订跳转
- [x] 收藏/取消收藏
- [ ] **房型图片**（rooms 表无图片字段）

#### 后台管理（25分，B 负责）
- [x] 登录/注册（商户/管理员角色）
- [x] 酒店信息录入/编辑
- [x] 审核列表（pending/approved/rejected/offline）
- [x] 审核通过/拒绝（含原因）/下线/恢复

#### 预订流程（用户端额外功能）
- [x] 确认预订页
- [x] 库存校验（事务锁，售罄提示）
- [x] 我的订单（个人中心）
- [x] 收藏列表（个人中心）

---

### 技术复杂度（10分）

- [x] 实时价格更新机制（基础价 × 折扣 × 间夜数）
- [x] 虚拟列表渲染优化（可视区域切片 + padding 撑高，列表页）
- [x] 数据库事务（预订时库存锁）
- [x] JWT 鉴权 + 角色权限中间件

---

### 用户体验（10分）

- [x] 响应式布局（H5/小程序）
- [x] 多端兼容（H5 + 微信小程序 + React Native WebView）
- [x] 深色模式（CSS 变量 + `[data-theme="dark"]`，ThemeSwitcher 组件）
- [x] 老年模式（`[data-font="elder"]` 根字体放大，一键切换）

---

### 代码质量（10分）

- [x] 清晰的项目结构（controllers/models/routes/middleware 分层）
- [x] 统一响应格式 `{ success, data, message }`
- [x] snake_case 命名规范
- [x] README 文档
- [x] 组件复用（Calendar、FilterPanel、ThemeSwitcher、HotelCard）

---

### 创新点（10分）

- [x] 价格折扣策略引擎（price_strategies 表）
- [x] 坐标自动识别城市（定位 API）
- [x] 预订库存事务锁（防超卖）
- [x] 自定义 Calendar 日历组件（日期范围选择，首页+详情页）
- [x] 深色/老年模式切换（ThemeSwitcher）
- [x] 酒店热度排序算法（views × 0.3 + star × 0.7，列表页"热度排序"切换）
- [x] 用户偏好缓存（localStorage 存储上次搜索条件，首页自动恢复）

---

### 剩余待办

全部功能已完成。

---
