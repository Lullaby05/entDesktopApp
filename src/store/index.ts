import { createPinia } from 'pinia';
import useAppStore from './modules/app';
import useUserStore from './modules/user';
import useTabBarStore from './modules/tab-bar';
import useModelStore from './modules/model-tag';
import tabStore from './modules/tabs';
import useEnterpriseStore from './modules/enterprise';
import usePitfallStore from './modules/pitfall';
import useRiskStore from './modules/risk';
import useSafetyCertificationStore from './modules/safetyCertification';
import shareStorePlugin from './plugins/shareStorePlugin';
import useThingsBoardStore from './modules/thingsBoard';
import piniaPluginPersist from 'pinia-plugin-persist';

const pinia = createPinia();

pinia.use(piniaPluginPersist);

pinia.use(shareStorePlugin);

export {
  useAppStore,
  useUserStore,
  useTabBarStore,
  useModelStore,
  tabStore,
  useEnterpriseStore,
  usePitfallStore,
  useRiskStore,
  useSafetyCertificationStore,
  useThingsBoardStore,
};
export default pinia;
