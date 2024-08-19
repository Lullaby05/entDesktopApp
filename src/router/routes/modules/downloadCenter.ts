import { DEFAULT_LAYOUT, PAGE_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const DOWNLOAD: AppRouteRecordRaw = {
  path: '/download',
  name: 'download',
  component: DEFAULT_LAYOUT,
  meta: {
    model: 'download',
    locale: 'menu.downloadCenter',
    requiresAuth: false,
    icon: 'icon-gongzuotai',
    order: 11,
    redirect: 'DownloadCenter',
    redirectUrl: '/download/downloadCenter',
    isModel: true,
  },
  children: [
    {
      path: 'downloadCenter',
      name: 'DownloadCenter',
      component: () =>
        import('@/views/downloadCenter/downloadCenter/index.vue'),
      meta: {
        model: 'download',
        locale: 'menu.downloadCenter',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

// export default DOWNLOAD;
