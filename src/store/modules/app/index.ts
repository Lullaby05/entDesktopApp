import { defineStore } from 'pinia';
import type { RouteRecordNormalized } from 'vue-router';
import defaultSettings from '@/config/settings.json';
import { AppState } from './types';
import { appRoutes, findModule } from '@/router/routes';
import { cloneDeep } from 'lodash';
import { DEFAULT_LAYOUT } from '@/router/routes/base';
import useUserStore from '../user';

const workplaceRoute = {
  path: '/dashboard',
  name: 'dashboard',
  component: DEFAULT_LAYOUT,
  meta: {
    model: 'dashboard',
    locale: 'menu.dashboard',
    requiresAuth: true,
    icon: 'icon-gongzuotai',
    order: 0,
    redirect: 'NoPermission',
    redirectUrl: '/dashboard/noPermission',
    isModel: true,
  },
  children: [
    {
      path: 'noPermission',
      name: 'NoPermission',
      component: () => import('@/views/dashboard/workplace/noPermission.vue'),
      meta: {
        model: 'dashboard',
        locale: 'menu.dashboard.workplace',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

// 匹配路由，添加对应线上传回来的参数
export function mapMenusToRoutes(menuList: any, Routes = appRoutes) {
  const routes: any[] = [];
  function handleSubRoutes(tree: any, allRouterList: any[]) {
    const result: any[] = [];
    const treeList = cloneDeep(tree);
    if (!treeList.children?.length) return null;
    treeList.children.forEach((ele: any) => {
      let sort = 0;
      const subTree = allRouterList.find((menu: any) => {
        const index = menu.componentName
          .split(',')
          .findIndex((item: any) => item == ele.name);
        sort = index < 0 ? 0 : index;
        return (
          menu.componentName.split(',').includes(ele.name) ||
          menu.menuTag == ele.name
        );
      });
      if (subTree) {
        if (ele.children && ele.children.length) {
          subTree.children = handleSubRoutes(ele, allRouterList);
        }
        result.push({ ...ele, children: subTree.children, sort });
      }
    });
    result.sort((a, b) => a.sort - b.sort);
    return result;
  }
  function findFirstLeafNode(node: any, redirectUrl = '') {
    redirectUrl += node.path + '/';
    if (node.children && node.children.length) {
      return findFirstLeafNode(node.children[0], redirectUrl);
    }
    return {
      redirect: node.name,
      redirectUrl: redirectUrl.substring(0, redirectUrl.length - 1),
    };
  }
  for (let item of Routes) {
    // 先比较最外层的menuTag相同，最外层是一级菜单
    const firstMenu = menuList.find((menu: any) => item.name == menu.menuTag);
    // 如果有一级菜单才往下继续比较
    if (firstMenu) {
      let allRouterList = treeToArray(firstMenu.children, []);
      allRouterList = allRouterList.map((ele: any, index: number) => ({
        ...ele,
        sort: index,
      }));
      let children: any[] | null = null;
      // if (firstMenu.menuTag === 'thingsBoard') {
      //   children = item.children;
      // } else {
      //   children = handleSubRoutes(item, allRouterList);
      // }
      children = handleSubRoutes(item, allRouterList);
      if (children && children.length) {
        item.children = children;
        const { redirect, redirectUrl } = findFirstLeafNode(item);
        item.meta = {
          ...item.meta,
          redirect, // 重定向到第一个有权限的children页面
          redirectUrl,
        };
      }
      routes.push(item);
    }
    if (!item.meta.requiresAuth) {
      routes.push(item);
    }
  }
  const workplace = findModule('Workplace', {}, routes);
  // 如果没有工作台页面则默认添加一个进去
  if (!workplace.name) {
    routes.unshift(workplaceRoute);
  }
  return routes;
}

function treeToArray(menuList: any, routes: any[]) {
  for (let item of menuList) {
    if (item.children?.length) {
      item.children = treeToArray(item.children, routes);
    }
    item.children = null;
    routes.push(item);
  }
  return routes;
}

const useAppStore = defineStore('app', {
  state: (): AppState => ({ ...defaultSettings }),

  getters: {
    appCurrentSetting(state: AppState): AppState {
      return { ...state };
    },
    appDevice(state: AppState) {
      return state.device;
    },
    appAsyncMenus(state: AppState): RouteRecordNormalized[] {
      return state.serverMenu as unknown as RouteRecordNormalized[];
    },
    appPermissionList(state: AppState): string[] {
      return state.btnPermission;
    },
  },

  actions: {
    // Update app settings
    updateSettings(partial: Partial<AppState>) {
      // @ts-ignore-next-line
      this.$patch(partial);
    },

    // Change theme color
    toggleTheme(dark: boolean) {
      if (dark) {
        // this.theme = 'light';
        // document.body.removeAttribute('arco-theme');
        this.theme = 'dark';
        document.body.setAttribute('arco-theme', 'dark');
        document.documentElement.classList.add('dark');
      } else {
        this.theme = 'light';
        document.body.removeAttribute('arco-theme');
        document.documentElement.classList.remove('dark');
      }
    },
    toggleDevice(device: string) {
      this.device = device;
    },
    toggleMenu(value: boolean) {
      this.hideMenu = value;
    },
    async fetchServerMenuConfig() {
      try {
        const userStore = useUserStore();
        let info: any = {};
        if (navigator.userAgent.includes('Electron')) {
          const { info: info1 } = await window.main.getUserInfo();
          info = info1;
        } else {
          info = userStore.userInfo;
        }
        // this.serverMenu = appRoutes
        this.serverMenu = mapMenusToRoutes(info.menu);
        console.log('menu', this.serverMenu);
        this.btnPermission = info.btn;
      } catch (error) {}
    },
    clearServerMenu() {
      this.serverMenu = [];
    },
  },
  persist: {
    enabled: true,
  },
});

export default useAppStore;
