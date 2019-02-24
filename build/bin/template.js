// 当examples/pages/template文件发生改变时候 会重新执行npm run i18h生产新的page页面
// 注意:开发模式下(dev和dev:play) 不执行此文件
const path = require('path');
const templates = path.resolve(process.cwd(), './examples/pages/template');

const chokidar = require('chokidar'); // 基于node.JS的监听文件夹改变模块
let watcher = chokidar.watch([templates]);

watcher.on('ready', function() {
  watcher
    .on('change', function() {
      exec('npm run i18n');
    });
});

function exec(cmd) {
  return require('child_process').execSync(cmd).toString().trim();
}
