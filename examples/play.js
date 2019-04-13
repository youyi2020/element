import Vue from 'vue';
import Element from 'main/index.js'; // 引入element源码
import App from './play/index.vue';
import 'packages/theme-chalk/src/index.scss'; // 组件所有样式

Vue.use(Element);

new Vue({ // eslint-disable-line
  render: h => h(App)
}).$mount('#app');
