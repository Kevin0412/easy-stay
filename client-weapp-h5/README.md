# 客户端使用说明

## 安装依赖

```bash
npm install --legacy-peer-deps
```

> 注意：Taro 依赖存在兼容性问题，必须使用 `--legacy-peer-deps` 参数

## 编译运行

### 微信小程序
```bash
npm run dev:weapp
```
然后用微信开发者工具打开 `dist` 目录

### H5 网页
```bash
npm run dev:h5
```

## 后端地址配置

修改 `src/config/index.ts` 中的默认地址，或通过环境变量 `TARO_APP_API_URL` 覆盖：

```typescript
// src/config/index.ts
export function getApiBaseUrl(): string {
  return process.env.TARO_APP_API_URL || 'http://你的IP:3000'
}
```

也可以在项目根目录创建 `.env.development` 文件：

```bash
TARO_APP_API_URL=http://你的IP:3000
```

修改后重新编译即可生效。
