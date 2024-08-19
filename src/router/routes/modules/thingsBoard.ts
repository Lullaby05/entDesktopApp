import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const THINGSBOARD: AppRouteRecordRaw = {
  path: '/thingsBoard',
  name: 'thingsBoard',
  component: DEFAULT_LAYOUT,
  meta: {
    model: 'thingsBoard',
    locale: 'menu.equipment',
    requiresAuth: true,
    icon: 'icon-监测预警管理-灰',
    activeIcon: 'icon-监测预警管理-蓝',
    order: 11,
    redirect: 'Home',
    redirectUrl: '/thingsBoard/home',
    isModel: true,
  },
  children: [
    {
      path: 'home',
      name: 'Home',
      component: () => import('@/views/thingsBoard/thingsBoard/angular.vue'),
      meta: {
        isIframe: true,
        model: 'thingsBoard',
        locale: 'menu.home',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'alarms',
      name: 'Alarms',
      component: () => import('@/views/thingsBoard/thingsBoard/angular.vue'),
      meta: {
        isIframe: true,
        model: 'thingsBoard',
        locale: 'menu.alarms',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'thingsBoardDashboards',
      name: 'Dashboards',
      component: () => import('@/views/thingsBoard/thingsBoard/angular.vue'),
      meta: {
        isIframe: true,
        model: 'thingsBoard',
        locale: 'menu.thingsBoardDashboard',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'thingsBoardDashboards/:id',
      name: 'DashboardsDetail',
      component: () => import('@/views/thingsBoard/thingsBoard/angular.vue'),
      meta: {
        isIframe: true,
        model: 'thingsBoard',
        locale: 'menu.devices',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'entities',
      name: 'Entities',
      component: '',
      meta: {
        model: 'thingsBoard',
        locale: 'menu.entities',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: 'devices',
          name: 'Devices',
          component: () =>
            import('@/views/thingsBoard/thingsBoard/angular.vue'),
          meta: {
            isIframe: true,
            model: 'thingsBoard',
            locale: 'menu.devices',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'devices/:id',
          name: 'DevicesDetail',
          component: () =>
            import('@/views/thingsBoard/thingsBoard/angular.vue'),
          meta: {
            isIframe: true,
            model: 'thingsBoard',
            locale: 'menu.devices',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'assets',
          name: 'Assets',
          component: () =>
            import('@/views/thingsBoard/thingsBoard/angular.vue'),
          meta: {
            isIframe: true,
            model: 'thingsBoard',
            locale: 'menu.assets',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'entityViews',
          name: 'EntityViews',
          component: () =>
            import('@/views/thingsBoard/thingsBoard/angular.vue'),
          meta: {
            isIframe: true,
            model: 'thingsBoard',
            locale: 'menu.entityViews',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },
    {
      path: 'edgeManagement/instances',
      name: 'Instances',
      component: () => import('@/views/thingsBoard/thingsBoard/angular.vue'),
      meta: {
        isIframe: true,
        model: 'thingsBoard',
        locale: 'menu.instances',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'notification/inbox',
      name: 'Notification',
      component: () => import('@/views/thingsBoard/thingsBoard/angular.vue'),
      meta: {
        isIframe: true,
        model: 'thingsBoard',
        locale: 'menu.notification',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'eventConfigManagement',
      name: 'EventConfigManagement',
      component: () =>
        import(
          '@/views/thingsBoard/eventConfig/eventConfigManagement/index.vue'
        ),
      meta: {
        model: 'thingsBoard',
        locale: 'menu.eventConfigManagement',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'eventConfigManagementDetail',
      name: 'EventConfigManagementDetail',
      component: () =>
        import(
          '@/views/thingsBoard/eventConfig/eventConfigManagement/detail.vue'
        ),
      meta: {
        model: 'thingsBoard',
        locale: 'menu.eventConfigManagement',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'eventConfigManagementEdit',
      name: 'EventConfigManagementEdit',
      component: () =>
        import(
          '@/views/thingsBoard/eventConfig/eventConfigManagement/edit.vue'
        ),
      meta: {
        model: 'thingsBoard',
        locale: 'menu.eventConfigManagement',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'eventManagement',
      name: 'EventManagement',
      component: () =>
        import('@/views/thingsBoard/eventConfig/eventManagement/index.vue'),
      meta: {
        model: 'thingsBoard',
        locale: 'menu.eventManagement',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'eventOverview',
      name: 'EventOverview',
      component: () =>
        import('@/views/thingsBoard/eventConfig/eventOverview/index.vue'),
      meta: {
        model: 'thingsBoard',
        locale: 'menu.eventOverview',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'eventManagementDetail',
      name: 'EventManagementDetail',
      component: () =>
        import('@/views/thingsBoard/eventConfig/eventManagement/detail.vue'),
      meta: {
        model: 'thingsBoard',
        locale: 'menu.eventManagement',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'eventManagementPersonConfirm',
      name: 'EventManagementPersonConfirm',
      component: () =>
        import(
          '@/views/thingsBoard/eventConfig/eventManagement/personConfirm.vue'
        ),
      meta: {
        model: 'thingsBoard',
        locale: 'menu.eventManagement',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'eventManagementReport',
      name: 'EventManagementReport',
      component: () =>
        import('@/views/thingsBoard/eventConfig/eventManagement/report.vue'),
      meta: {
        model: 'thingsBoard',
        locale: 'menu.eventManagement',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'eventMessageConfigIndex',
      name: 'EventMessageConfigIndex',
      component: () =>
        import('@/views/thingsBoard/eventConfig/eventMessageConfig/index.vue'),
      meta: {
        model: 'thingsBoard',
        locale: 'menu.eventConfig',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'eventMessageConfig',
      name: 'EventMessageConfig',
      component: () =>
        import('@/views/thingsBoard/eventConfig/eventMessageConfig/config.vue'),
      meta: {
        model: 'thingsBoard',
        locale: 'menu.eventConfig',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'eventMessageDetail',
      name: 'EventMessageDetail',
      component: () =>
        import('@/views/thingsBoard/eventConfig/eventMessageConfig/detail.vue'),
      meta: {
        model: 'thingsBoard',
        locale: 'menu.eventConfig',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'monitoringDataScreen',
      name: 'MonitoringDataScreen',
      component: () =>
        import('@/views/thingsBoard/monitoringDataScreen/index.vue'),
      meta: {
        layout: 'page',
        model: 'thingsBoard',
        locale: 'menu.monitoringDataScreen',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'emergencyHandle',
      name: 'EmergencyHandle',
      component: () =>
        import('@/views/thingsBoard/monitoringDataScreen/emergencyHandle.vue'),
      meta: {
        layout: 'page',
        model: 'thingsBoard',
        locale: 'menu.monitoringDataScreen',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default THINGSBOARD;
