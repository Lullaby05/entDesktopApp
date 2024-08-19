import type { Router, RouteRecordNormalized } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

import usePermission from '@/hooks/permission';
import { useUserStore, useAppStore } from '@/store';
import { appRoutes } from '../routes';
import { WHITE_LIST, NOT_FOUND, WORKPLACE_NOT_FOUND } from '../constants';
import { DEFAULT_LAYOUT, NOT_FOUND_ROUTE, REDIRECT_MAIN } from '../routes/base';
import { Message } from '@arco-design/web-vue';
import { nextTick } from 'vue';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    const appStore = useAppStore();
    const userStore = useUserStore();
    const Permission = usePermission();
    const permissionsAllow = Permission.accessRouter(to);
    if (appStore.menuFromServer) {
      // 针对来自服务端的菜单配置进行处理
      // Handle routing configuration from the server

      // 根据需要自行完善来源于服务端的菜单配置的permission逻辑
      // Refine the permission logic from the server's menu configuration as needed
      if (
        !appStore.appAsyncMenus.length &&
        !WHITE_LIST.find((el) => el.name === to.name)
      ) {
        await appStore.fetchServerMenuConfig();
      }
      const serverMenuConfig = [
        {
          path: '/',
          redirect: 'login',
          meta: {},
        },
        {
          path: '/login',
          name: 'login',
          component: () => import('@/views/login/index.vue'),
          meta: {
            requiresAuth: false,
          },
        },
        ...appStore.appAsyncMenus,
        ...WHITE_LIST,
        REDIRECT_MAIN,
        NOT_FOUND_ROUTE,
      ];

      let exist = false;
      let workplaceExist = false;
      while (serverMenuConfig.length && (!workplaceExist || !exist)) {
        const element = serverMenuConfig.shift();
        // 只有去安全工作台的时候才会判断NoPermission这个路径
        if (
          to.name === 'Workplace' &&
          element.meta &&
          element?.meta.redirect === 'NoPermission'
        )
          workplaceExist = true;
        if (element?.componentName === to.name) exist = true;
        if (element?.name === to.name) exist = true;

        if (element?.children) {
          serverMenuConfig.push(
            ...(element.children as unknown as RouteRecordNormalized[])
          );
        }
      }
      if (exist) {
        next();
      } else if (workplaceExist) {
        next(WORKPLACE_NOT_FOUND);
      } else {
        Message.warning('暂无查看权限，请联系管理员添加权限');
        next(false);
      }
    } else {
      // eslint-disable-next-line no-lonely-if
      if (permissionsAllow) {
        next();
      } else {
        const destination =
          Permission.findFirstPermissionRoute(appRoutes, userStore.role) ||
          NOT_FOUND;
        console.log(destination);
        next(destination);
      }
    }
    NProgress.done();
  });
}
