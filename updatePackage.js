const fs = require('fs');
const path = require('path');

// 获取命令行参数
const args = process.argv.slice(2); // 去掉前两个默认参数（node 路径和脚本路径）
const dev = args.includes('--dev');

// 定义要修改的值
const newProductName = dev ? '祥惠(测试版)' : '祥惠';
const newAppId = dev ? 'xianghuitest' : 'xianghuiprd';

// 读取package.json
const packagePath = path.join(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// 修改值
packageJson.name = newAppId;
packageJson.productName = newProductName;
packageJson.description = newAppId;
packageJson.build.appId = `com.xkrsecure.${newAppId}`;
packageJson.build.mac.artifactName = `${newProductName}.dmg`;
packageJson.build.win.artifactName = `${newProductName}.exe`;

// 写回package.json
fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2), 'utf8');

console.log('package.json已更新');
