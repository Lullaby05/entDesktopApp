import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const ENTERPRISE: AppRouteRecordRaw = {
  path: '/operation',
  name: 'Operation',
  component: DEFAULT_LAYOUT,
  meta: {
    model: 'Operation',
    locale: 'menu.operation',
    requiresAuth: true,
    icon: 'icon-安全管理-灰',
    activeIcon: 'icon-安全管理-蓝',
    order: 4,
    redirect: 'dangerous',
    redirectUrl: '/operation/operationSafety',
    isModel: true,
  },
  children: [
    {
      path: 'operationSafety',
      name: 'OperationSafety',
      component: () => import('@/views/operation/safetyMeasure/index.vue'),
      meta: {
        model: 'Operation',
        locale: 'menu.operationSafety',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'operatonCertificateManage',
      name: 'OperatonCertificateManage',
      component: '',
      meta: {
        model: 'Operation',
        locale: 'menu.operatonCertificateManage',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        // 动火作业证管理
        {
          path: 'fireCertificateIndex',
          name: 'FireCertificateIndex',
          component: () =>
            import('@/views/operation/fireCertificate/index.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'fireCertificateHandling',
          name: 'FireCertificateHandling',
          component: () =>
            import('@/views/operation/fireCertificate/handling.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'fireCertificateAdd',
          name: 'FireCertificateAdd',
          component: () => import('@/views/operation/fireCertificate/add.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'fireCertificateDetail',
          name: 'FireCertificateDetail',
          component: () =>
            import('@/views/operation/fireCertificate/detail.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        // 受限空间作业证管理
        {
          path: 'confinedSpaceCertificateIndex',
          name: 'ConfinedSpaceCertificateIndex',
          component: () =>
            import('@/views/operation/confinedSpaceCertificate/index.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.confinedApaces',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'confinedSpaceCertificateHandling',
          name: 'ConfinedSpaceCertificateHandling',
          component: () =>
            import('@/views/operation/confinedSpaceCertificate/handling.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'confinedSpaceCertificateAdd',
          name: 'ConfinedSpaceCertificateAdd',
          component: () =>
            import('@/views/operation/confinedSpaceCertificate/add.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'confinedSpaceCertificateDetail',
          name: 'ConfinedSpaceCertificateDetail',
          component: () =>
            import('@/views/operation/confinedSpaceCertificate/detail.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        // 盲板抽堵作业证管理
        {
          path: 'blindPlateCertificateIndex',
          name: 'BlindPlateCertificateIndex',
          component: () =>
            import('@/views/operation/blindPlateCertificate/index.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.blindPlate',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'blindPlateCertificateHandling',
          name: 'BlindPlateCertificateHandling',
          component: () =>
            import('@/views/operation/blindPlateCertificate/handling.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'blindPlateCertificateAdd',
          name: 'BlindPlateCertificateAdd',
          component: () =>
            import('@/views/operation/blindPlateCertificate/add.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'blindPlateCertificateDetail',
          name: 'BlindPlateCertificateDetail',
          component: () =>
            import('@/views/operation/blindPlateCertificate/detail.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        // 高处作业证管理
        {
          path: 'highAltitudeCertificateIndex',
          name: 'HighAltitudeCertificateIndex',
          component: () =>
            import('@/views/operation/highAltitudeCertificate/index.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.aerialWork',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'highAltitudeCertificateHandling',
          name: 'HighAltitudeCertificateHandling',
          component: () =>
            import('@/views/operation/highAltitudeCertificate/handling.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'highAltitudeCertificateAdd',
          name: 'HighAltitudeCertificateAdd',
          component: () =>
            import('@/views/operation/highAltitudeCertificate/add.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'highAltitudeCertificateDetail',
          name: 'HighAltitudeCertificateDetail',
          component: () =>
            import('@/views/operation/highAltitudeCertificate/detail.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        // 吊装作业证管理
        {
          path: 'hoistCertificateIndex',
          name: 'HoistCertificateIndex',
          component: () =>
            import('@/views/operation/hoistCertificate/index.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hoistingSafety',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'hoistCertificateHandling',
          name: 'HoistCertificateHandling',
          component: () =>
            import('@/views/operation/hoistCertificate/handling.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'hoistCertificateAdd',
          name: 'HoistCertificateAdd',
          component: () => import('@/views/operation/hoistCertificate/add.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'hoistCertificateDetail',
          name: 'HoistCertificateDetail',
          component: () =>
            import('@/views/operation/hoistCertificate/detail.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        // 临时用电作业证管理
        {
          path: 'tempElectricityCertificateIndex',
          name: 'TempElectricityCertificateIndex',
          component: () =>
            import('@/views/operation/tempElectricityCertificate/index.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.temporaryElectricity',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'tempElectricityCertificateHandling',
          name: 'TempElectricityCertificateHandling',
          component: () =>
            import('@/views/operation/tempElectricityCertificate/handling.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'tempElectricityCertificateAdd',
          name: 'TempElectricityCertificateAdd',
          component: () =>
            import('@/views/operation/tempElectricityCertificate/add.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'tempElectricityCertificateDetail',
          name: 'TempElectricityCertificateDetail',
          component: () =>
            import('@/views/operation/tempElectricityCertificate/detail.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        // 动土作业证管理
        {
          path: 'groundCertificateIndex',
          name: 'GroundCertificateIndex',
          component: () =>
            import('@/views/operation/groundCertificate/index.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.excavation',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'groundCertificateHandling',
          name: 'GroundCertificateHandling',
          component: () =>
            import('@/views/operation/groundCertificate/handling.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'groundCertificateAdd',
          name: 'GroundCertificateAdd',
          component: () =>
            import('@/views/operation/groundCertificate/add.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'groundCertificateDetail',
          name: 'GroundCertificateDetail',
          component: () =>
            import('@/views/operation/groundCertificate/detail.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        // 断路作业证管理
        {
          path: 'brokenRoadCertificateIndex',
          name: 'BrokenRoadCertificateIndex',
          component: () =>
            import('@/views/operation/brokenRoadCertificate/index.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.shortCircuit',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'brokenRoadCertificateHandling',
          name: 'BrokenRoadCertificateHandling',
          component: () =>
            import('@/views/operation/brokenRoadCertificate/handling.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'brokenRoadCertificateAdd',
          name: 'BrokenRoadCertificateAdd',
          component: () =>
            import('@/views/operation/brokenRoadCertificate/add.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'brokenRoadCertificateDetail',
          name: 'BrokenRoadCertificateDetail',
          component: () =>
            import('@/views/operation/brokenRoadCertificate/detail.vue'),
          meta: {
            model: 'Operation',
            locale: 'menu.hotWork',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },
  ],
};

export default ENTERPRISE;
