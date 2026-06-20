# 灵应用商店数据排行 - 第三方拓展版

基于 [TSZX-zg/lingstore](https://github.com/TSZX-zg/lingstore) 开源项目拓展开发的第三方灵应用商店数据排行网站。

## 功能特点

- 📊 **全量数据**：展示全部740+个应用，不只是前100个
- 🔍 **智能搜索**：支持应用名称、包名、开发者搜索
- 📁 **分类筛选**：22个分类，精准查找
- 📈 **多种排序**：下载量、名称、大小、上架时间
- 🏆 **排行榜**：下载量排行、评分排行、大小排行
- 💝 **捐赠榜单**：展示项目捐赠者
- 🔧 **API演示**：完整的API接口展示
- 📜 **法律声明**：完整的合规声明
- 🎨 **深色主题**：护眼的深色界面设计
- ⚡ **缓存机制**：GitHub Actions定时更新，访问速度快

## 缓存机制

### 应用列表更新
- **频率**：每天5次
- **时间**：北京时间 00:00 / 06:00 / 12:00 / 18:00 / 22:00
- **最大时延**：约6小时

### 应用详情更新
- **频率**：每天1次
- **周期**：90天滚动更新
- **每天更新**：约8-9个应用详情
- **最大时延**：约90天

### 降级机制
- 优先加载静态缓存数据
- 如果缓存不可用，自动降级为实时API调用
- 确保基础功能始终可用

## 部署方法

### 1. 上传到GitHub仓库
将所有文件上传到你的GitHub仓库。

### 2. 开启GitHub Pages
1. 进入仓库 Settings → Pages
2. Source 选择 "Deploy from a branch"
3. Branch 选择 main / root
4. 点击 Save

### 3. 配置GitHub Actions权限（重要！）
1. 进入仓库 Settings → Actions → General
2. 找到 "Workflow permissions"
3. 选择 "Read and write permissions"
4. 点击 Save

这样GitHub Actions才能自动提交数据文件到仓库。

### 4. 手动触发第一次更新
1. 进入仓库 Actions
2. 选择 "Update Apps Data"
3. 点击 "Run workflow"
4. 等待执行完成

## 文件结构

```
lingstore-plus/
├── index.html              # 主页面（单文件，包含CSS和JS）
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
    └── workflows/          # GitHub Actions配置
        ├── update-apps.yml     # 应用列表更新定时任务
        └── update-detail.yml   # 应用详情更新定时任务
```

## 本地运行

### 本地抓取数据
```bash
# 抓取应用列表
node scripts/fetch-apps.js

# 抓取应用详情（需要先有应用列表）
node scripts/fetch-detail.js
```

### 本地预览网站
由于浏览器的CORS策略，建议用本地服务器打开：

```bash
# Python 3
python3 -m http.server 8000

# 然后访问 http://localhost:8000
```

或者直接用浏览器打开 index.html 也可以（部分功能可能受限）。

## 技术栈

- **前端**：纯 HTML/CSS/JavaScript，无框架依赖
- **后端**：无后端，纯静态站点
- **数据**：灵应用商店公开API
- **部署**：GitHub Pages
- **自动化**：GitHub Actions

## 免责声明

本项目仅供技术交流与学习研究之用，与灵应用商店官方团队无任何隶属、合作或关联关系。

所有应用的知识产权归其 respective 所有者所有。本站仅作展示之用，不提供任何APK文件的下载服务。

使用本站即表示您已阅读并同意法律声明中的全部条款。

## 开源协议

基于 MIT License 开源。
