import { App } from 'vue';
import permission from './permission';
import reClick from './reClick';

export default {
  install(Vue: App) {
    Vue.directive('permission', permission);
    Vue.directive('preventReClick', reClick.preventReClick);
  },
};
