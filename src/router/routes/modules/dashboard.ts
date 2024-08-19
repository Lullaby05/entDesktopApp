import { DEFAULT_LAYOUT, PAGE_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DASHBOARD: AppRouteRecordRaw = {
  path: '/dashboard',
  name: 'dashboard',
  component: DEFAULT_LAYOUT,
  meta: {
    model: 'dashboard',
    locale: 'menu.dashboard',
    requiresAuth: true,
    icon: 'icon-工作台-灰',
    activeIcon: 'icon-工作台-蓝',
    order: 0,
    redirect: 'Workplace',
    redirectUrl: '/dashboard/workplace',
    hideChildrenInMenu: true,
    isModel: true,
  },
  children: [
    {
      path: 'workplace',
      name: 'Workplace',
      component: () => import('@/views/dashboard/workplace/index.vue'),
      meta: {
        model: 'dashboard',
        locale: 'menu.dashboard.workplace',
        requiresAuth: true,
        roles: ['*'],
      },
    },
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
    {
      path: 'helpCenter',
      name: 'HelpCenter',
      component: () => import('@/views/helpCenter/index.vue'),
      meta: {
        model: 'dashboard',
        locale: 'menu.dashboard.workplace',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'dataScreen',
      name: 'DataScreen',
      component: () => import('@/views/dashboard/workplace/dataScreen.vue'),
      meta: {
        layout: 'page',
        model: 'dashboard',
        locale: 'dashboard.securityData',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'messageCenter',
      name: 'MessageCenter',
      component: () => import('@/views/dashboard/workplace/messageCenter.vue'),
      meta: {
        model: 'dashboard',
        locale: '消息中心',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'todoCenter',
      name: 'TodoCenter',
      component: () => import('@/views/dashboard/workplace/todoCenter.vue'),
      meta: {
        model: 'dashboard',
        locale: '待办',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default DASHBOARD;
