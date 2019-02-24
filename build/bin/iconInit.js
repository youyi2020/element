'use strict';
// 解析packages/theme-chalk/src/icon.scss，将所有小图标的name存入examples/icon.json",
var postcss = require('postcss');
var fs = require('fs');
var path = require('path');
var fontFile = fs.readFileSync(path.resolve(__dirname, '../../packages/theme-chalk/src/icon.scss'), 'utf8');
// postcss处理css的方式，主要区分三部分：
// 1.parser过程：将css字符串解析成可供我们操作的JavaScript对象
// 2.processor过程：我们应用postcss插件、或是自定义插件，都是在这个过程中,根据postcss提供的API，对parser生成的js对象做相应调整；
// 3.stringfier过程：将我们处理后的js对象，再转换回为css字符串
var nodes = postcss.parse(fontFile).nodes;
var classList = [];

nodes.forEach((node) => {
  var selector = node.selector || '';
  var reg = new RegExp(/\.el-icon-([^:]+):before/); // [^:] 除了:以外的任意字符
  var arr = selector.match(reg);
  // 示例
  // [ '.el-icon-success:before',
  //     'success',
  //     index: 0,
  //     input: '.el-icon-success:before',
  //     groups: undefined
  // ]
  if (arr && arr[1]) {
    classList.push(arr[1]);
  }
});

// 匹配出的icon-name 写入examples/icon.json
fs.writeFile(path.resolve(__dirname, '../../examples/icon.json'), JSON.stringify(classList), () => {});
