'use strict';
// 根据examples/i18n/page.json和模板，生成不同语言的demo
var fs = require('fs');
var path = require('path');
var langConfig = require('../../examples/i18n/page.json'); // 官网页面的配置 不包括组件配置

langConfig.forEach(lang => {
  try { // statSync 如果路径不在村会报no such file or directory, 走catch方法 创建对应语言的目录
    fs.statSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  } catch (e) {
    fs.mkdirSync(path.resolve(__dirname, `../../examples/pages/${ lang.lang }`));
  }

  Object.keys(lang.pages).forEach(page => { // 将各种语言的page生成一份对应的vue文件放到对应语言的目录中
    var templatePath = path.resolve(__dirname, `../../examples/pages/template/${ page }.tpl`); // 已写好的模板
    var outputPath = path.resolve(__dirname, `../../examples/pages/${ lang.lang }/${ page }.vue`); // 输出目录
    var content = fs.readFileSync(templatePath, 'utf8'); // 读取模板路径内容 utf8 -> 二进制转字符串
    var pairs = lang.pages[page]; // page中对象的值

    Object.keys(pairs).forEach(key => { // page中对象的值 也是一个对象
      content = content.replace(new RegExp(`<%=\\s*${ key }\\s*>`, 'g'), pairs[key]); // 模板替换
    });

    fs.writeFileSync(outputPath, content); // 输出到对应语言下的目录
  });
});
// 根据选择不同 要切换不通的语言 将固定不变的部分写成tpl模板 将要切换的语言编程json对象动态插入到tpl中
