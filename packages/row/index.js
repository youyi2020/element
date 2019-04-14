import Row from './src/row';

/* istanbul ignore next */
Row.install = function(Vue) {
  // 全局注册该组件(常用的组件最好全局注册)
  Vue.component(Row.name, Row);
};

export default Row;

