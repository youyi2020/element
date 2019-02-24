// deploy:build(官网打包) dev(官网开发模式) dev:play(组件开发模式)使用了此配置
const path = require('path');
const webpack = require('webpack');
// webpack4替换了extract-text-webpack-plugin提取单独打包css文件
// 关于这个插件的知识点 1.异步加载 2.不重复编译，性能更好更容易使用3.只针对CSS
// 特别注意：这个插件应该只用在 production 配置中，并且在loaders链中不使用 style-loader, 特别是在开发中使用HMR，因为这个插件暂时不支持HMR
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin'); // 复制文件插件 不打包
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin'); // 编译进度条插件
const VueLoaderPlugin = require('vue-loader/lib/plugin'); // vue-loader的插件
// mini-css-extract-plugin提取css并没有压缩 需要使用optimize-css-assets-webpack-plugin机型压缩
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const md = require('markdown-it')(); // markdown解析
// 用法示例
// var transliteration = require('transliteration');
// transliteration.transliterate('你好，世界'); // Ni Hao ,Shi Jie
// transliteration.slugify('你好，世界'); // ni-hao-shi-jie
// transliteration.slugify('你好，世界', {lowercase: false, separator: '_'}); // Ni_Hao_Shi_Jie
const slugify = require('transliteration').slugify; // 音译(transliteration)模块，支持中文转拼音或生成 slug

const striptags = require('./strip-tags'); // https://github.com/jonschlinkert/strip-tags
const config = require('./config'); // webpack使用的常量的配置

const isProd = process.env.NODE_ENV === 'production'; // 生产打包模式
const isPlay = !!process.env.PLAY_ENV; // 组件开发模式

// 由于cheerio在转换汉字时会出现转为Unicode的情况,所以我们编写convert方法来保证最终转码正确
function convert(str) {
  str = str.replace(/(&#x)(\w{4});/gi, function($0) {
    return String.fromCharCode(parseInt(encodeURIComponent($0).replace(/(%26%23x)(\w{4})(%3B)/g, '$2'), 16));
  });
  return str;
}

// 由于v-pre会导致在加载时直接按内容生成页面.但是我们想要的是直接展示组件效果,通过正则进行替换
function wrap(render) {
  return function() {
    return render.apply(this, arguments)
      .replace('<code v-pre class="', '<code class="hljs ')
      .replace('<code>', '<code class="hljs">');
  };
}

const webpackConfig = {
  mode: process.env.NODE_ENV,
  entry: isProd ? { // 生产环境 docs就是官网业务 和 element-ui是源码组件集合 多入口打包 提高性能
    docs: './examples/entry.js',
    'element-ui': './src/index.js'
  } : (isPlay ? './examples/play.js' : './examples/entry.js'), // 组件开发和官方开发不同入口
  output: {
    path: path.resolve(process.cwd(), './examples/element-ui/'),
    publicPath: process.env.CI_ENV || '',
    filename: '[name].[hash:7].js', // 编译生成的js文件存放到根目录下面的js目录下面,如果js目录不存在则自动创建
    /*
    * chunkFilename用来打包require.ensure方法中引入的模块,如果该方法中没有引入任何模块则不会生成任何chunk块文件
    * 比如在main.js文件中,require.ensure([],function(require){alert(11);}),这样不会打包块文件
    * 只有这样才会打包生成块文件require.ensure([],function(require){alert(11);require('./greeter')})
    * 或者这样require.ensure(['./greeter'],function(require){alert(11);})
    * chunk的hash值只有在require.ensure中引入的模块发生变化,hash值才会改变
    * 注意:对于不是在ensure方法中引入的模块,此属性不会生效,只能用CommonsChunkPlugin插件来提取
    * */
    chunkFilename: isProd ? '[name].[hash:7].js' : '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: config.alias,
    modules: ['node_modules'] // 配置 Webpack 去哪些目录下寻找第三方模块，默认是只会去node_modules目录下寻找
  },
  devServer: {
    host: '0.0.0.0',
    port: 8085,
    publicPath: '/',
    noInfo: true
  },
  performance: { // 给定一个创建后超过 250kb 的资源：不展示警告或错误提示。
    hints: false
  },
  stats: { // 不添加children信息 mini-css-extract-plugin会在控制台输入巨量信息
    children: false
  },
  module: {
    rules: [ // 定义解析规则，通过配置，对文件进行编译处理。
      {
        enforce: 'pre', // 加载器的执行顺序，不设置为正常执行。可选值 'pre|post' 前|后
        test: /\.(vue|jsx?)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
      },
      {
        test: /\.(jsx?|babel|es6)$/,
        include: process.cwd(), // process.cwd() 当前Node.js进程执行时的工作目录 __dirname: 当前模块的目录名 C:\Users\youyi.sun\Desktop\element-note
        exclude: config.jsexclude,
        loader: 'babel-loader'
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            // 默认为 true。这意味着编译好的渲染函数会保留所有 HTML 标签之间的空格。
            // 如果设置为 false，则标签之间的空格会被忽略。这能够略微提升一点性能但是可能会影响到内联元素的布局
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.css$/,
        loaders: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'postcss-loader'
        ]
      },
      {
        test: /\.scss$/,
        loaders: [
          isProd ? MiniCssExtractPlugin.loader : 'style-loader',
          'css-loader',
          'sass-loader'
        ]
      },
      {
        test: /\.md$/,
        loaders: [
          {
            loader: 'vue-loader'
          },
          {
            loader: 'vue-markdown-loader/lib/markdown-compiler',
            options: {
              preventExtract: true,
              raw: true,
              preprocess: function(MarkdownIt, source) {
                MarkdownIt.renderer.rules.table_open = function() {
                  return '<table class="table">';
                };
                MarkdownIt.renderer.rules.fence = wrap(MarkdownIt.renderer.rules.fence);
                return source;
              },
              use: [
                [require('markdown-it-anchor'), {
                  level: 2, // 添加超链接锚点的最小标题级别, 如: #标题 不会添加锚点
                  slugify: slugify, // 自定义slugify, 我们使用的是将中文转为汉语拼音,最终生成为标题id属性
                  permalink: true, // 开启标题锚点功能
                  permalinkBefore: true // 在标题前创建锚点
                }],
                [require('markdown-it-container'), 'demo', { // 当我们写::: demo :::这样的语法时才会进入自定义渲染方法
                  validate: function(params) {
                    return params.trim().match(/^demo\s*(.*)$/);
                  },

                  render: function(tokens, idx) { // 自定义渲染方法,这里为核心代码
                    var m = tokens[idx].info.trim().match(/^demo\s*(.*)$/);
                    if (tokens[idx].nesting === 1) {// nesting === 1表示标签开始
                      var description = (m && m.length > 1) ? m[1] : ''; // 获取正则捕获组中的描述内容,即::: demo xxx中的xxx
                      var content = tokens[idx + 1].content; // 获得内容
                      var html = convert(striptags.strip(content, ['script', 'style'])).replace(/(<[^>]*)=""(?=.*>)/g, '$1'); // 解析过滤解码生成html字符串
                      var script = striptags.fetch(content, 'script'); // 获取script中的内容
                      var style = striptags.fetch(content, 'style'); // 获取style中的内容
                      var jsfiddle = { html: html, script: script, style: style }; // 组合成prop参数,准备传入组件
                      var descriptionHTML = description // 是否有描述需要渲染
                        ? md.render(description)
                        : '';

                      jsfiddle = md.utils.escapeHtml(JSON.stringify(jsfiddle)); // 将jsfiddle对象转换为字符串,并将特殊字符转为转义序列
                      // 起始标签,写入demo-block模板开头,并传入参数
                      return `<demo-block class="demo-box" :jsfiddle="${jsfiddle}">
                                <div class="source" slot="source">${html}</div>
                                ${descriptionHTML}
                                <div class="highlight" slot="highlight">`;
                    }
                    return '</div></demo-block>\n'; // 否则闭合标签
                  }
                }],
                [require('markdown-it-container'), 'tip'],
                [require('markdown-it-container'), 'warning']
              ]
            }
          }
        ]
      },
      {
        test: /\.(svg|otf|ttf|woff2?|eot|gif|png|jpe?g)(\?\S*)?$/,
        loader: 'url-loader',
        query: {
          limit: 10000,
          name: path.posix.join('static', '[name].[hash:7].[ext]')
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './examples/index.tpl',
      filename: './index.html',
      favicon: './examples/favicon.ico'
    }),
    new CopyWebpackPlugin([
      { from: 'examples/versions.json' }
    ]),
    new ProgressBarPlugin(),
    new VueLoaderPlugin(),
    new webpack.LoaderOptionsPlugin({
      vue: {
        compilerOptions: {
          preserveWhitespace: false
        }
      }
    })
  ],
  optimization: {
    minimizer: []
  }
};

// MiniCssExtractPlugin在production 配置中，loaders链中不使用style-loader
// 特别是在开发中使用HMR，因为这个插件暂时不支持HMR
if (isProd) {
  webpackConfig.plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash:7].css'
    })
  );
  webpackConfig.optimization.minimizer.push( // js和css压缩
    new UglifyJsPlugin({
      cache: true,
      parallel: true,
      sourceMap: false
    }),
    new OptimizeCSSAssetsPlugin({})
  );
}

module.exports = webpackConfig;
