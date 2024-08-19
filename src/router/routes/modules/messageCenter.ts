import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const MESSAGECENTER: AppRouteRecordRaw = {
  path: '/messageCenter',
  name: 'messageCenter',
  component: DEFAULT_LAYOUT,
  meta: {
    model: 'messageCenter',
    locale: 'menu.messageCenter',
    requiresAuth: true,
    icon: 'icon-消息通知中心-灰',
    activeIcon: 'icon-消息通知中心-蓝',
    order: 13,
    redirect: 'MessageLog',
    redirectUrl: '/messageCenter/messageLog',
    isModel: true,
  },
  children: [
    {
      path: 'messageLog',
      name: 'MessageLog',
      component: () => import('@/views/messageCenter/messageLog/index.vue'),
      meta: {
        model: 'messageCenter',
        locale: 'menu.messageLog',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default MESSAGECENTER;
