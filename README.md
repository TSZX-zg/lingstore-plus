# 灵应用商店数据排行 - 第三方拓展版

![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Deployed-brightgreen?style=flat-square)
![License](https://img.shields.io/badge/License-MIT-blue?style=flat-square)
![Version](https://img.shields.io/badge/Version-1.19.2-orange?style=flat-square)
![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen?style=flat-square)

> ⚠️ **非官方 · 第三方拓展版** · 数据来源：[ziling.xin](https://ziling.xin) · 仅供技术学习与交流

基于 [TSZX-zg/lingstore](https://github.com/TSZX-zg/lingstore) 开源项目拓展开发的第三方灵应用商店数据排行网站。

**在线演示：** https://tszx-zg.github.io/lingstore-plus/

---

## ✨ 功能特点

### 基础功能
- 📊 **全量数据**：展示全部 740+ 个应用，不只是前 100 个
- 🔍 **智能搜索**：支持应用名称、包名、开发者搜索
- 📁 **分类筛选**：22 个分类，精准查找
- 📈 **多种排序**：下载量、名称、大小、上架时间（升序/降序）
- 🏆 **排行榜**：下载量排行、评分排行、大小排行
- 💝 **捐赠榜单**：展示项目捐赠者
- 🔧 **API 演示页**：完整的 API 接口展示（公开接口 + 需登录接口）
- 📜 **法律声明**：完整的合规声明
- 🎨 **深色主题**：护眼的深色界面设计
- 📱 **移动端适配**：支持手机端浏览
- 👁️ **水印保护**：页面背景水印 + 代码水印

### 拓展功能（Plus 版新增）
- 🔐 **登录功能**：支持灵应用商店账号登录，Token 本地存储
- ⭐ **应用评分**：登录后可对应用进行 5 星评分
- 💬 **评论功能**：登录后可发表评论、查看评论列表
- 📥 **APK 下载**：登录后可下载应用 APK（通过代理服务）
- 📋 **版本历史**：登录后可查看应用的历史版本列表
- 🔄 **双视图切换**：网格视图 / 列表视图
- 🔍 **零下载筛选**：可筛选出 0 下载的应用
- ⚡ **缓存降级机制**：优先加载缓存，失败自动降级为实时 API

---

## 🚀 缓存机制

### 应用列表更新
- **频率**：每天 5 次
- **时间**：北京时间 00:00 / 06:00 / 12:00 / 18:00 / 22:00
- **最大时延**：约 6 小时

### 应用详情更新
- **频率**：每天 1 次
- **周期**：90 天滚动更新
- **每天更新**：约 8-9 个应用详情
- **最大时延**：约 90 天

### 降级机制
- 优先加载静态缓存数据
- 如果缓存不可用，自动降级为实时 API 调用
- 确保基础功能始终可用

> 💡 **关于缓存频率**：每日 5 次的缓存频率已与灵应用商店官方沟通确认合理，不会给源站造成过大压力。

---

## 🔧 代理服务

本项目使用 Cloudflare Worker 作为反向代理，主要用于：
1. 解决浏览器跨域问题
2. 下载 Token 转换（URL 参数 → Authorization 请求头）
3. 自动修复下载重定向地址（去掉错误的端口号）

> 代理服务仅做请求转发与响应透传，不修改、不存储、不记录任何用户数据。需自行部署 Worker 并配置代理地址。

---

## 📦 部署方法

### 1. 上传到 GitHub 仓库
将所有文件上传到你的 GitHub 仓库。

### 2. 开启 GitHub Pages
1. 进入仓库 Settings → Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 main / root
4. 点击 Save

### 3. 配置 GitHub Actions 权限（重要！）
1. 进入仓库 Settings → Actions → General
2. 找到 "Workflow permissions"
3. 选择 "Read and write permissions"
4. 点击 Save

这样 GitHub Actions 才能自动提交数据文件到仓库。

### 4. 手动触发第一次更新
1. 进入仓库 Actions
2. 选择 "Update Apps Data"
3. 点击 "Run workflow"
4. 等待执行完成

### 5. 配置代理服务（可选）
如果需要使用下载功能，需要自行部署 Cloudflare Worker 作为反向代理。

---

## 📁 文件结构

```
lingstore-plus/
├── index.html              # 主页面（单文件，包含 CSS 和 JS）
├── README.md               # 说明文档
├── data/                   # 数据目录（由脚本生成）
│   ├── apps.json           # 应用列表数据
│   ├── categories.json     # 分类数据
│   ├── meta.json           # 元数据（更新时间等）
│   └── apps-detail.json    # 应用详情数据
├── scripts/                # 脚本目录
│   ├── fetch-apps.js       # 应用列表抓取脚本
│   └── fetch-detail.js     # 应用详情抓取脚本
└── .github/
    └── workflows/          # GitHub Actions 配置
        ├── update-apps.yml     # 应用列表更新定时任务
        └── update-detail.yml   # 应用详情更新定时任务
```

---

## 💻 本地运行

### 本地抓取数据
```bash
# 抓取应用列表
node scripts/fetch-apps.js

# 抓取应用详情（需要先有应用列表）
node scripts/fetch-detail.js
```

### 本地预览网站
由于浏览器的 CORS 策略，建议用本地服务器打开：

```bash
# Python 3
python3 -m http.server 8000

# 然后访问 http://localhost:8000
```

或者直接用浏览器打开 index.html 也可以（部分功能可能受限）。

---

## 🛠️ 技术栈

- **前端**：纯 HTML/CSS/JavaScript，无框架依赖
- **后端**：无后端，纯静态站点
- **数据**：灵应用商店公开 API
- **部署**：GitHub Pages
- **自动化**：GitHub Actions
- **代理**：Cloudflare Worker（可选，用于下载功能）

---

## 📜 法律声明与合规

### 非官方声明
本项目系由个人开发者独立维护的开源技术演示项目，为灵应用商店的**第三方拓展版**，与灵应用商店官方团队（ziling.xin）无任何隶属、合作或关联关系。本项目不冒充官方身份，不构成任何"官方分支"。

### 数据来源
所有应用元数据均来自灵应用商店官方公开 API（ziling.xin）。本项目**仅缓存公开元数据用于展示，所有下载链接及实时数据最终指向 ziling.xin 官方域名**。

### 缓存频率
应用列表数据每日更新 5 次，此频率已与官方沟通确认合理。前端不进行无脑轮询，缓存有效期设置在 1 小时以上，避免给源站造成不必要的压力。

### 隐私保护
- 登录凭据（Token）及用户基本信息仅存储于浏览器本地（localStorage）
- 不上传至本站服务器，也不分享给任何第三方
- 代理服务仅做请求转发，不存储用户数据

---



## ⚠️ 免责声明

本项目仅供技术交流与学习研究之用，与灵应用商店官方团队无任何隶属、合作或关联关系。

所有应用的知识产权归其 respective 所有者所有。本站仅作展示之用，所有下载功能均跳转至官方服务器。

使用本站即表示您已阅读并同意法律声明中的全部条款。

---

## 📄 开源协议

基于 MIT License 开源。

---

## 🙏 致谢

- 感谢 [TSZX-zg/lingstore](https://github.com/TSZX-zg/lingstore) 提供的基础项目
- 感谢 [灵应用商店 ziling.xin](https://ziling.xin) 提供的公开 API 和公益服务
- 感谢所有捐赠者的支持
