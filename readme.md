# 项目名称

**易宿酒店预订平台**

---

# 一、项目目标

构建一个前后端分离的智慧酒店预订系统，包含：

* 📱 用户端（多端支持）
* 🖥 商户端后台管理系统（PC端）

实现：

* 酒店查询
* 列表筛选
* 详情展示
* 商户信息录入
* 管理员审核发布流程

---

# 二、技术选型

## 前端（用户端）

推荐：**Taro + React + TypeScript**

原因：

* 一套代码多端输出：

  * 微信小程序
  * H5网页
  * React Native App
* 方便做主题切换
* 易做组件化抽象
* 你本身会前端，完全能驾驭

---

## 后台管理系统（PC）

推荐：

* React + Ant Design
* 或者直接用 Ant Design Pro

要求不高，重点在功能实现。

---

## 后端

Node.js + Express

数据库：

* 开发阶段：MongoDB
* 或 MySQL（更贴合真实业务）

建议：

> 如果你想拿高分，用 MySQL 更加“企业化”

---

# 三、系统架构设计

```
             用户端（多端）
    ┌────────────────────┐
    │ 小程序 / H5 / App  │
    └──────────┬─────────┘
               │ REST API
               ▼
        Node.js 服务端
               │
     ┌─────────┴─────────┐
     │                   │
   MySQL            文件存储
 (酒店数据)        (图片资源)
```

---

# 四、数据库设计（核心表）

## 1️⃣ 用户表 users

| 字段         | 类型                    |
| ---------- | --------------------- |
| id         | int                   |
| username   | varchar               |
| password   | varchar               |
| role       | enum(admin, merchant) |
| created_at | datetime              |

---

## 2️⃣ 酒店表 hotels

| 字段         | 类型                                       |
| ---------- | ---------------------------------------- |
| id         | int                                      |
| name_cn    | varchar                                  |
| name_en    | varchar                                  |
| address    | varchar                                  |
| star       | int                                      |
| open_date  | date                                     |
| status     | enum(draft, pending, published, offline) |
| created_by | user_id                                  |

---

## 3️⃣ 房型表 rooms

| 字段        | 类型      |
| --------- | ------- |
| id        | int     |
| hotel_id  | int     |
| room_type | varchar |
| price     | decimal |
| stock     | int     |

---

## 4️⃣ 价格策略表（创新点）

支持节日折扣、套餐优惠。

---

# 五、两人分工方案

假设：

你 = 技术能力更强
队友 = 协作开发

---

## 👨‍💻 A 负责（建议你）

### 1. 后端设计

* 数据库设计
* RESTful API
* 权限控制
* 审核发布逻辑

### 2. 用户端核心页面

* 查询页
* 列表页
* 详情页
* 日历组件

### 3. 多端适配

* 主题系统
* 字体放大模式

---

## 👨‍💻 B 负责

### 1. 后台管理系统

* 登录注册
* 酒店信息录入
* 酒店审核列表
* 发布/下线

### 2. UI优化

* Banner设计
* 页面布局美化
* 筛选交互体验

---

## 最终整合

* 联调 API
* 修复Bug
* 性能优化

---

# 六、用户端功能设计

---

# 1️⃣ 酒店查询页（首页）

功能：

* Banner
* 定位功能
* 关键字搜索
* 日历组件
* 筛选
* 快捷标签
* 查询按钮

---

### 技术重点

* 使用Taro定位API
* 自定义日历组件
* 状态管理（Zustand 或 Redux）

---

# 2️⃣ 酒店列表页

功能：

* 条件展示头
* 二级筛选
* 无限滚动加载

---

### 技术重点

* 虚拟列表优化（长列表加分项）
* IntersectionObserver 或 onReachBottom

---

# 3️⃣ 酒店详情页

功能：

* 图片轮播
* 酒店信息
* 日历选择
* 房型列表
* 实时价格计算

---

### 实时价格机制（加分点）

```
基础价格
+ 节假日加价
- 优惠券
= 实时显示价格
```

---

# 七、多端适配设计（创新 + 加分）

你可以把这一块写进“项目创新性”。

---

## 🌗 1️⃣ 深色模式

实现方案：

```css
[data-theme="dark"] {
  background: #111;
  color: #eee;
}
```

使用：

* 读取系统 prefers-color-scheme
* 用户可手动切换

---

## 👴 2️⃣ 老年模式（字体放大）

实现：

```css
html[data-font="large"] {
  font-size: 18px;
}
```

页面中所有尺寸用 rem。

优点：

* 一键切换
* 全局生效

---

## 📱 3️⃣ 多端输出

Taro build：

```
taro build --type weapp
taro build --type h5
taro build --type rn
```

---

# 八、后台管理系统设计

简单实用即可。

---

## 页面：

1. 登录页
2. 注册页
3. 酒店列表
4. 酒店录入
5. 审核页面

---

## 审核流程

```
商户提交 → 状态 pending
管理员审核 → published
管理员下线 → offline
```

---

# 九、项目创新点（建议做）

你要冲高分的话建议：

---

### ⭐ 1. 价格实时计算

根据：

* 入住天数
* 房型库存
* 节日折扣

动态计算总价。

---

### ⭐ 2. 虚拟列表优化

使用：

* react-window
* 或手写虚拟滚动

---

### ⭐ 3. 用户偏好缓存

本地存储：

* 上次入住城市
* 最近筛选条件

---

### ⭐ 4. 酒店热度排序算法

简单实现：

```
热度 = 浏览量 * 0.3 + 评分 * 0.7
```

---

# 十、项目初始文件夹结构

## 整体结构

```
easy-stay/
│
├── server/                # Node 后端
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── utils/
│   │   └── app.js
│   └── package.json
│
├── client-user/           # 用户端（Taro）
│   ├── src/
│   │   ├── pages/
│   │   │   ├── home/
│   │   │   ├── list/
│   │   │   ├── detail/
│   │   │   └── profile/
│   │   ├── components/
│   │   │   ├── Calendar/
│   │   │   ├── HotelCard/
│   │   │   ├── FilterPanel/
│   │   │   └── ThemeSwitcher/
│   │   ├── store/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── theme/
│   │   └── app.tsx
│   └── package.json
│
├── client-admin/          # 后台管理系统
│   ├── src/
│   │   ├── pages/
│   │   │   ├── login/
│   │   │   ├── hotel-list/
│   │   │   ├── hotel-edit/
│   │   │   └── audit/
│   │   ├── components/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
│
└── README.md
```
