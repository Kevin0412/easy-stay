# 易宿酒店管理后台

基于 React + TypeScript + Ant Design 的后台管理系统。

## 功能特性

### 用户认证
- 登录/注册（支持商户和管理员角色）
- JWT Token 持久化
- 路由权限控制

### 酒店管理（商户）
- 查看酒店列表
- 创建/编辑酒店信息
- 管理房型（价格、库存）
- 提交审核

### 审核管理（管理员）
- 查看待审核酒店
- 审核通过/下线操作

## 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite 5
- **UI 库**: Ant Design 5
- **路由**: React Router 6
- **状态管理**: Zustand
- **HTTP 客户端**: Axios
- **日期处理**: Day.js
- **样式**: CSS Modules + SCSS

## 快速开始

### 前置要求

确保后端服务已启动：
```bash
cd ../server
npm start
# 后端运行在 http://localhost:3000
```

### 安装依赖

```bash
npm install
```

### 启动开发服务器

```bash
npm run dev
```

访问 http://localhost:5173

### 构建生产版本

```bash
npm run build
```

### 预览生产构建

```bash
npm run preview
```

## 测试账号

### 管理员
- 用户名: `admin`
- 密码: `admin123`

### 商户
- 用户名: `merchant1`
- 密码: `admin123`

## 使用流程

### 商户流程

1. 注册商户账号或使用测试账号登录
2. 点击"新建酒店"，填写酒店信息（中文名、地址、星级等）
3. 保存后，进入编辑页面，添加房型（房型名、价格、库存）
4. 返回酒店列表，点击"提交审核"
5. 等待管理员审核

### 管理员流程

1. 使用管理员账号登录
2. 左侧菜单点击"酒店审核"
3. 查看待审核酒店列表
4. 点击"审核通过"或"下线"

## 项目结构

```
src/
├── components/          # 公共组件
│   ├── auth-route/      # 路由守卫
│   ├── layout/          # 布局组件
│   └── hotel-status-tag/ # 状态标签
├── pages/              # 页面组件
│   ├── login/          # 登录/注册
│   ├── hotel-list/     # 酒店列表
│   ├── hotel-edit/     # 酒店编辑
│   └── audit/          # 审核页面
├── services/           # API 服务
│   ├── auth.ts         # 认证
│   ├── hotel.ts        # 酒店
│   └── room.ts         # 房型
├── store/              # 状态管理
│   └── user-store.ts   # 用户状态
├── utils/              # 工具函数
│   └── request.ts      # HTTP 请求封装
├── router/             # 路由配置
└── styles/             # 全局样式
```

## 命名规范

严格遵循 README.md 第十一章的命名规范：

- **文件名**: kebab-case (如 `hotel-list.tsx`)
- **组件名**: PascalCase (如 `HotelList`)
- **变量/函数**: camelCase (如 `fetchHotels`)
- **数据模型字段**: snake_case (如 `name_cn`, `created_at`)
- **CSS 类名**: kebab-case (如 `.hotel-list-container`)

## 环境变量

`.env.development`:
```
VITE_API_BASE_URL=http://localhost:3000/api
```

## API 代理

开发模式下，`/api` 请求会自动代理到 `http://localhost:3000`。

## 许可证

MIT
