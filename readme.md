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
- **数据库**（二选一）：
  - 开发阶段：mock_db（灵活）
  - **部署**：MySQL

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

| 字段名       | 类型                        | 说明                 |
| ------------ | --------------------------- | -------------------- |
| id           | int                         | 主键                 |
| username     | varchar                     | 用户名               |
| password     | varchar                     | 密码（加密存储）     |
| role         | enum('admin','merchant')    | 角色：管理员/商户    |
| created_at   | datetime                    | 创建时间             |

### 2️⃣ 酒店表（hotels）

| 字段名       | 类型                                            | 说明                         |
| ------------ | ----------------------------------------------- | ---------------------------- |
| id           | int                                             | 主键                         |
| name_cn      | varchar                                         | 中文名称                     |
| name_en      | varchar                                         | 英文名称                     |
| address      | varchar                                         | 地址                         |
| star         | int                                             | 星级                         |
| open_date    | date                                            | 开业日期                     |
| status       | enum('draft','pending','published','offline') | 状态：草稿/待审/已发布/已下线 |
| created_by   | int                                             | 创建人（user_id）            |

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
商户提交 → 状态 pending
管理员审核 → 状态 published
管理员下线 → 状态 offline
```

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
POST   /api/hotels/:id/offline
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

### 🚀 快速开始

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

#### 编译 React Native Bundle

```bash
npm run build:rn
```

生成的 bundle 文件位于 `dist/index.bundle`

#### Android APK 编译

由于 Taro 3.x 的 React Native 支持需要完整的原生项目结构，推荐以下方案：

**方案一：使用 Expo Go（快速测试）**

1. 在手机上安装 Expo Go 应用
2. 运行开发服务器：
   ```bash
   npm run dev:rn
   ```
3. 扫描二维码在 Expo Go 中打开

**方案二：编译独立 APK**

1. 确保已安装 Android SDK 和配置环境变量：
   ```bash
   export ANDROID_HOME=$HOME/Android/Sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

2. 使用 React Native CLI 编译：
   ```bash
   # 连接 Android 设备或启动模拟器
   adb devices

   # 编译并安装到设备
   npx react-native run-android
   ```

3. 生成 release APK：
   ```bash
   cd android
   ./gradlew assembleRelease
   ```

   APK 文件位于：`android/app/build/outputs/apk/release/app-release.apk`

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