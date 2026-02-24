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

修改 `src/config/index.ts` 中的默认地址，或通过环境变量 `TARO_APP_API_URL` 指定：

```bash
TARO_APP_API_URL=http://你的IP:3000 npm run android:dev
```

修改后重新编译即可生效。

## Android 真机/平板调试

### 环境要求

- Node.js
- JDK 17（AGP 要求，JDK 11 或 21 均不兼容）
- Android SDK
- ADB 工具
- USB 连接的 Android 设备（需开启开发者选项和 USB 调试）

### JDK 17 安装（Ubuntu）

```bash
sudo apt-get install -y openjdk-17-jdk
```

构建时指定 JDK 17：

```bash
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 ./android/gradlew -p android assembleDebug
```

### 调试步骤

#### 1. 确认设备连接

```bash
adb devices
```

确保输出中有设备且状态为 `device`。

#### 2. 设置端口转发

将电脑的 Metro bundler（8081）和后端 API（3000）端口转发到设备：

```bash
adb reverse tcp:8081 tcp:8081
adb reverse tcp:3000 tcp:3000
```

> 注意：USB 重新插拔、ADB 重启后转发会丢失，需要重新执行。
> 可通过 `adb reverse --list` 查看当前转发状态。

#### 3. 确保后端 API 地址为 localhost

`src/config/index.ts` 中的 API 地址需要配置为 `http://localhost:3000`，这样 adb reverse 才能将请求正确转发到电脑。

#### 4. 启动 Metro 开发服务器

```bash
npm run android:dev
```

如果 8081 端口被占用：

```bash
lsof -ti:8081 | xargs kill -9
```

然后重新启动。

#### 5. 构建并安装 APK

首次运行或代码有原生层变更时需要重新构建 APK：

```bash
# 构建 RN bundle
npx taro build --type rn --platform android

# 构建 debug APK
JAVA_HOME=/usr/lib/jvm/java-17-openjdk-amd64 ./android/gradlew -p android assembleDebug

# 安装到设备
adb install -r android/app/build/outputs/apk/debug/app-debug.apk
```

#### 6. 启动应用

```bash
adb shell monkey -p com.easystayuser -c android.intent.category.LAUNCHER 1
```

### 常见问题

| 问题 | 解决方案 |
|------|----------|
| `Another process is running on port 8081` | `lsof -ti:8081 \| xargs kill -9` |
| Metro 连不上设备 | 重新执行 `adb reverse tcp:8081 tcp:8081` |
| API 请求失败 | 检查 `adb reverse tcp:3000 tcp:3000` 是否生效，确认后端已启动 |
| AGP 要求 Java 17 | 安装 JDK 17 并通过 `JAVA_HOME` 指定 |
| 热更新无效 | 平板上摇一摇选择 Reload，或双击 R |
| adb reverse 全部丢失 | USB 重插后需重新执行所有 `adb reverse` 命令 |
