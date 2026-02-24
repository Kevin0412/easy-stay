# 客户端使用说明

## 安装依赖

```bash
npm install
```

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

### Android App
```bash
npm run android:dev
```

## 后端地址配置

修改 `.env` 文件中的 `API_URL`：

```bash
API_URL=http://你的IP:3000
```

修改后重新编译即可生效。
