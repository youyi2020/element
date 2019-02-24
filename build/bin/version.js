var fs = require('fs');
var path = require('path');
var version = process.env.VERSION || require('../../package.json').version;
// 重要版本列表
var content = { '1.4.13': '1.4', '2.0.11': '2.0', '2.1.0': '2.1', '2.2.2': '2.2', '2.3.9': '2.3', '2.4.11': '2.4' };
if (!content[version]) content[version] = '2.5';
// 输出到examples/versions.json
fs.writeFileSync(path.resolve(__dirname, '../../examples/versions.json'), JSON.stringify(content));

// 官网中的示例中 在../examples/components/header.vue调用此文件 显示版本列表

