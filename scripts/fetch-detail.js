const https = require('https');
const fs = require('fs');
const path = require('path');

const API_BASE = 'https://market.ziling.xin/api/v1';
const CYCLE_DAYS = 90; // 90天一个周期

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

// 计算今天是周期中的第几天
function getDayOfCycle() {
    // 用一个固定的起始日期（2026-01-01）
    const startDate = new Date('2026-01-01T00:00:00Z');
    const today = new Date();
    const diffTime = today - startDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays % CYCLE_DAYS;
}

// 获取今天要更新的应用索引范围
function getTodayAppRange(totalApps) {
    const dayOfCycle = getDayOfCycle();
    const appsPerDay = Math.ceil(totalApps / CYCLE_DAYS);
    const startIndex = dayOfCycle * appsPerDay;
    const endIndex = Math.min(startIndex + appsPerDay, totalApps);
    return { startIndex, endIndex, dayOfCycle, appsPerDay };
}

// 延迟函数，避免请求太快
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// 主函数
async function main() {
    try {
        const dataDir = path.join(__dirname, '..', 'data');
        const appsPath = path.join(dataDir, 'apps.json');
        const detailPath = path.join(dataDir, 'apps-detail.json');

        // 读取应用列表
        if (!fs.existsSync(appsPath)) {
            console.error('❌ 请先运行 fetch-apps.js 获取应用列表');
            process.exit(1);
        }
        const apps = JSON.parse(fs.readFileSync(appsPath, 'utf-8'));
        console.log(`应用总数: ${apps.length}`);

        // 读取现有详情数据
        let detailData = {};
        if (fs.existsSync(detailPath)) {
            const existing = JSON.parse(fs.readFileSync(detailPath, 'utf-8'));
            detailData = existing.apps || {};
            console.log(`已有详情数据: ${Object.keys(detailData).length} 个应用`);
        }

        // 计算今天要更新的应用
        const { startIndex, endIndex, dayOfCycle, appsPerDay } = getTodayAppRange(apps.length);
        const appsToUpdate = apps.slice(startIndex, endIndex);
        console.log(`周期第 ${dayOfCycle + 1}/${CYCLE_DAYS} 天，今天更新第 ${startIndex + 1} - ${endIndex} 个应用（共 ${appsToUpdate.length} 个）`);

        // 抓取应用详情
        let successCount = 0;
        for (let i = 0; i < appsToUpdate.length; i++) {
            const app = appsToUpdate[i];
            try {
                console.log(`[${i + 1}/${appsToUpdate.length}] 正在获取: ${app.name}...`);
                const detail = await fetch(`${API_BASE}/apps/${app._id}`);
                
                // 修复图标URL
                detail.iconUrl = fixIconUrl(detail.iconUrl);
                detail.logoUrl = fixIconUrl(detail.logoUrl);
                if (detail.uploader) {
                    detail.uploader.avatarUrl = fixIconUrl(detail.uploader.avatarUrl);
                }
                
                detailData[app._id] = detail;
                successCount++;
                
                // 延迟一下，避免请求太快
                await sleep(200);
            } catch (err) {
                console.warn(`  ⚠️ 获取失败: ${app.name} - ${err.message}`);
            }
        }

        // 保存详情数据
        const output = {
            updatedAt: new Date().toISOString(),
            totalApps: apps.length,
            detailCount: Object.keys(detailData).length,
            cycleDay: dayOfCycle,
            apps: detailData
        };
        fs.writeFileSync(detailPath, JSON.stringify(output, null, 2), 'utf-8');
        
        console.log(`\n✅ 详情更新完成！`);
        console.log(`   成功: ${successCount}/${appsToUpdate.length} 个`);
        console.log(`   详情总数: ${Object.keys(detailData).length} 个`);
        console.log(`   已保存到: data/apps-detail.json`);

    } catch (err) {
        console.error('❌ 详情更新失败:', err.message);
        process.exit(1);
    }
}

main();
