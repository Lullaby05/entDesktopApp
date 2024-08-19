import { createApp } from 'vue';
// import 'virtual:svg-icons-register';
// import print from 'vue3-print-nb';
import ArcoVue, { ModalConfig } from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import { Icon as ArcoIcon } from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';
import './assets/font/font.css';
import 'element-plus/theme-chalk/dark/css-vars.css';
// import globalComponents from '@/components';
import svgIcon from '@/components/SvgIcon/index.vue';
import TableListCard from '@/components/table-list-card/index.vue';
import { global } from '@/utils/global';
import router from './router';
import store from './store';
import storeDesign from '@/store_design';
import i18n from './locale';
import directive from './directive';
import { Mitt } from '@/utils/viewMitt';
// import './mock';
import App from './App.vue';
// Styles are imported via arco-plugin. See config/plugin/arcoStyleImport.ts in the directory for details
// 样式通过 arco-plugin 插件导入。详见目录文件 config/plugin/arcoStyleImport.ts
// https://arco.design/docs/designlab/use-theme-package
import '@/api/interceptor';
//-------------------------------表单引擎配置-----start------------------------------------------------------
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
import 'element-plus/dist/index.css';
import * as ElIcons from '@element-plus/icons-vue';

import 'vant/lib/index.css';

import Ellipsis from './components/common/Ellipsis.vue';
import WDialog from './components/common/WDialog.vue';
import Tip from './components/common/Tip.vue';
import Avatar from './components/common/Avatar.vue';
import Icon from './components/common/Icon.vue';
// import VueAMap, { initAMapApiLoader } from '@vuemap/vue-amap';
import '@vuemap/vue-amap/dist/style.css';
import '@/assets/global.css';
import '@/assets/iconfont/iconfont.css';
import '@/assets/iconfont2/iconfont.css';
import '@/assets/style/global.less';

/*高德地图组件初始化*/
// initAMapApiLoader({
//   key: 'ebb9f6fb9beaec43fddcb22ab7406386',
//   plugin: [
//     'AMap.Autocomplete',
//     /*  'AMap.ElasticMarker',
//       'AMap.PlaceSearch',
//       "AMap.MapType",*/
//     'AMap.Geocoder',
//     'AMap.Geolocation',
//   ],
// });
//-------------------------------表单引擎配置----end-------------------------------------------------------
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'
// const IconFont = ArcoIcon.addFromIconFontCn({ src: 'https://at.alicdn.com/t/c/font_4421375_8s5h3wtayh5.js' });
const app = createApp(App);

app.use(ArcoVue, {});
(app._context.components.AModal as any).props.maskClosable.default = false;
app.use(ArcoVueIcon);
app.use(router);
app.use(store);
app.use(i18n);
// app.use(globalComponents);
app.use(directive);
// app.use(print);
//-------------------------------表单引擎配置--start---------------------------------------------------------
// app.use(VueAMap);
app.use(ElementPlus, {
  locale: zhCn,
});
app.use(storeDesign);
// app.component('IconFont', IconFont);
app.component('Ellipsis', Ellipsis);
app.component('WDialog', WDialog);
app.component('Tip', Tip);
app.component('Avatar', Avatar);
app.component('Icon', Icon);
window.$vueApp = app;
window.$vCtx = app.config.globalProperties;
import('./utils/Injection');

//全局注册图标
for (const [key, component] of Object.entries(ElIcons)) {
  app.component(`el-icon-${key.toLowerCase()}`, component);
}
//-------------------------------表单引擎配置----end-------------------------------------------------------
app.component('SvgIcon', svgIcon).component('TableListCard', TableListCard);

app.config.globalProperties.$G = global;
app.config.globalProperties.$mitt = Mitt;
app.config.compilerOptions.isCustomElement = (tag) => /gc-\w*/.test(tag);

app.mount('#app');
