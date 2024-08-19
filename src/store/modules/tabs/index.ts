import { defineStore } from 'pinia';
import { TabProps, TabsState } from './type';
import { it } from 'element-plus/es/locale';

const DEFAULT_TAG: TabProps = {
  key: '1',
  name: 'menu.dashboard',
  modelName: 'dashboard',
  route: '/dashboard/workplace',
  icon: 'icon-gongzuotai',
};

const tabStore = defineStore('tabList', {
  state: (): TabsState => ({
    tabList: [DEFAULT_TAG],
  }),

  getters: {
    getTabsList(): TabProps[] {
      return this.tabList;
    },
  },

  actions: {
    // Update app settings
    update(tab: any) {
      this.tabList.push(tab);
    },
    deleteTabs(closeIndex: number) {
      this.tabList.splice(closeIndex, 1);
      // 对标签进行重新排序
      this.tabList.forEach((item, index) => {
        const num = index + 1;
        item.key = num + '';
      });
    },
    resetTabs() {
      this.tabList = [DEFAULT_TAG];
    },
  },
  persist: {
    enabled: true,
  },
});

export default tabStore;
