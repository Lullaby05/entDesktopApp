import { createApp } from 'vue';
import 'virtual:svg-icons-register';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
// import globalComponents from '@/components';
import svgIcon from '@/components/SvgIcon/index.vue';
import { global } from '@//utils/global';
import store from './store';
import i18n from './locale';
import directive from './directive';
import App from './electron-tabs/App.vue';
// Styles are imported via arco-plugin. See config/plugin/arcoStyleImport.ts in the directory for details
// 样式通过 arco-plugin 插件导入。详见目录文件 config/plugin/arcoStyleImport.ts
// https://arco.design/docs/designlab/use-theme-package
import '@/api/interceptor';
// 开发环境下引入mock
import '@/mock/index';
import './assets/font/font.css';
import '@/assets/iconfont/iconfont.css';
import '@/assets/style/global-tab.less';

const app = createApp(App);

app.use(ArcoVue, {});
app.use(ArcoVueIcon);

app.use(store);
app.use(i18n);
// app.use(globalComponents);
app.use(directive);
app.component('SvgIcon', svgIcon);

app.config.globalProperties.$G = global;

app.mount('#app');
