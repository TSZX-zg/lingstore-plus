const https = require('https');
const fs = require('fs');
const path = require('path');

const API_BASE = 'https://market.ziling.xin/api/v1';

// 封装 fetch 函数
function fetch(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(e);
                }
            });
        }).on('error', reject);
    });
}

// 修复图标URL
function fixIconUrl(url) {
    if (!url) return '';
    return url.replace('http://market.ziling.xin:443', 'https://market.ziling.xin');
}

// 全量获取应用列表
async function fetchAllApps() {
    let page = 1;
    let apps = [];
    while (true) {
        console.log(`正在获取第 ${page} 页...`);
        const data = await fetch(`${API_BASE}/apps?page=${page}&limit=100`);
        apps = apps.concat(data.apps);
        if (page >= data.pagination.pages) break;
        page++;
    }
    // 修复所有应用的图标URL
    apps = apps.map(app => ({
        ...app,
        iconUrl: fixIconUrl(app.iconUrl),
        logoUrl: fixIconUrl(app.logoUrl)
    }));
    console.log(`共获取 ${apps.length} 个应用`);
    return apps;
}

// 获取分类列表
async function fetchCategories() {
    console.log('正在获取分类列表...');
    const categories = await fetch(`${API_BASE}/categories`);
    console.log(`共获取 ${categories.length} 个分类`);
    return categories;
}

// 主函数
async function main() {
    try {
        const dataDir = path.join(__dirname, '..', 'data');
        
        // 获取应用列表
        const apps = await fetchAllApps();
        fs.writeFileSync(
            path.join(dataDir, 'apps.json'),
            JSON.stringify(apps, null, 2),
            'utf-8'
        );
        console.log('应用列表已保存到 data/apps.json');

        // 获取分类列表
        const categories = await fetchCategories();
        fs.writeFileSync(
            path.join(dataDir, 'categories.json'),
            JSON.stringify(categories, null, 2),
            'utf-8'
        );
        console.log('分类列表已保存到 data/categories.json');

        // 保存更新时间
        const meta = {
            updatedAt: new Date().toISOString(),
            totalApps: apps.length,
            totalCategories: categories.length
        };
        fs.writeFileSync(
            path.join(dataDir, 'meta.json'),
            JSON.stringify(meta, null, 2),
            'utf-8'
        );
        console.log('元数据已保存到 data/meta.json');

        console.log('✅ 数据抓取完成！');
    } catch (err) {
        console.error('❌ 抓取失败:', err.message);
        process.exit(1);
    }
}

main();
