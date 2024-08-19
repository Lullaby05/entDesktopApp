import { appRoutes, findModule } from '@/router/routes';
import { tabStore, useUserStore } from '@/store';
import { Message } from '@arco-design/web-vue';
import { cloneDeep } from 'lodash';
import { RouteRecordNormalized, useRouter } from 'vue-router';

export default function useRouterJump() {
  let router = useRouter();

  // 在树形结构中通过路由名称查找是否匹配
  function findHasModule(routeName: string, parent: any, children: any) {
    for (const child of children) {
      if (child.componentName.split(',').includes(routeName)) {
        return true;
      } else if (child.children) {
        const match = findHasModule(routeName, child, child.children);
        if (match) return true;
      }
    }
    return false;
  }

  function getTopLevelModuleName(
    routeName: string
  ): RouteRecordNormalized | null {
    for (const route of appRoutes) {
      const { name } = findModule(routeName, {}, route.children);
      if (name) return route;
    }
    // 如果没有找到匹配的路由，则返回null
    return null;
  }

  function getPathByName(name: any) {
    // 使用全局路由映射表（Options API）
    if (name in router.options.routes) {
      return router.options.routes[name].path;
    }
    if (router.hasRoute(name)) {
      return router.getRoutes().find((route) => route.name === name)?.path;
    }
    try {
      const resolvedRoute = router.resolve({ name });
      return resolvedRoute.href;
    } catch (error) {
      console.error('Failed to resolve route by name', error);
      return null;
    }
  }
  // 通过name进行跳转模块（不是简单的路由跳转，而是和electron-tab进行跳转）
  const jumpWithTab = (options: any) => {
    // routerName必传
    // routerName->需要跳转到的对应的路由名称 redirectName->需要重定向到的路由名称 params->对应重定向路由的传参
    const { routerName, redirectName = routerName, params } = options;
    const userStore = useUserStore();
    const userInfo = userStore.userInfo;
    const routerFlag = findHasModule(routerName, {}, userInfo.menu);
    const redirectFlag = findHasModule(redirectName, {}, userInfo.menu);
    // 如果没有找到路由权限，则直接返回
    if (!(redirectFlag && routerFlag)) {
      Message.warning('暂无查看权限，请联系管理员添加权限');
      return;
    }
    // 通过routerName获取路由路径
    const url = getPathByName(routerName);
    // 通过redirectName获取路由路径
    const redirectUrl = getPathByName(redirectName);
    // 通过routerName获取顶级路由所有信息
    const module = getTopLevelModuleName(routerName);
    if (!module || !url) return;

    const tabs = tabStore();
    const { model, locale, icon } = module.meta;
    const tabList = tabs.getTabsList;
    // if (!tabList.some((itemTab) => itemTab.modelName === model)) {
    //   const tab: any = {
    //     key: String(tabList.length + 1),
    //     name: locale,
    //     modelName: model,
    //     route: redirectUrl,
    //     routeUrl: url,
    //     routeParams: JSON.stringify(params),
    //     icon: icon,
    //   };
    //   tabs.update(tab);
    //   //@ts-ignore
    //   window.main.newTab(tab);
    // } else {
    //   const cutTab = tabList.find((itemTab) => itemTab.modelName === model);
    //   const curTab: any = cloneDeep(cutTab);
    //   curTab.route = redirectUrl;
    //   curTab.routeUrl = url;
    //   curTab.routeParams = JSON.stringify(params);
    //   curTab.icon = icon;
    //   //@ts-ignore
    //   window.main.tabJumpRouter(curTab);
    // }
    if (redirectName) {
      router.push({
        path: redirectUrl!,
      });
    }
    setTimeout(() => {
      router.push({
        path: url,
        query: params,
      });
    }, 100);
  };
  return {
    jumpWithTab,
    getPathByName,
  };
}
