import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const RISK: AppRouteRecordRaw = {
  path: '/risk',
  name: 'risk',
  component: DEFAULT_LAYOUT,
  meta: {
    model: 'risk',
    locale: 'menu.riskControl',
    requiresAuth: true,
    icon: 'icon-风险管控-灰',
    activeIcon: 'icon-风险管控-蓝',
    order: 5,
    redirect: 'RiskList',
    redirectUrl: '/risk/AccidentType',
    isModel: true,
  },
  children: [
    {
      path: 'riskList',
      name: 'RiskList',
      component: () => import('@/views/risk/riskList/index.vue'),
      meta: {
        model: 'risk',
        locale: 'menu.riskList',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },

    {
      path: 'accidentType',
      name: 'AccidentType',
      component: () => import('@/views/risk/accidentType/index.vue'),
      meta: {
        model: 'risk',
        locale: 'menu.accidentType',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'safetySigns',
      name: 'SafetySigns',
      component: () => import('@/views/risk/safetySigns/index.vue'),
      meta: {
        model: 'risk',
        locale: 'menu.safetySigns',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'riskAssessment',
      name: 'RiskAssessment',
      component: () => import('@/views/risk/riskAssessment/index.vue'),
      meta: {
        model: 'risk',
        locale: 'menu.riskAssessment',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'identificationAndEvaluation',
      name: 'IdentificationAndEvaluation',
      component: () =>
        import('@/views/risk/identificationAndEvaluation/index.vue'),
      meta: {
        model: 'risk',
        locale: 'menu.identificationAndEvaluation',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'addDangerPointPage',
      name: 'AddDangerPointPage',
      component: () =>
        import('@/views/risk/identificationAndEvaluation/addDangerPoint.vue'),
      meta: {
        model: 'risk',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'dangerPointManage',
      name: 'DangerPointManage',
      component: () => import('@/views/risk/dangerPointManage/index.vue'),
      meta: {
        model: 'risk',
        locale: 'menu.dangerPointManage',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'gradedControl',
      name: 'GradedControl',
      component: () => import('@/views/risk/gradedControl/index.vue'),
      meta: {
        model: 'risk',
        locale: 'menu.gradedControl',
        requiresAuth: true,
        roles: ['*'],
      },
    },

    {
      path: 'inspectionRecored',
      name: 'InspectionRecored',
      component: () => import('@/views/risk/inspectionRecored/index.vue'),
      meta: {
        model: 'risk',
        locale: 'menu.inspectionRecored',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    // 路由跳转的页面
    {
      path: 'gradedControlControl',
      name: 'GradedControlControl',
      component: () => import('@/views/risk/gradedControl/control.vue'),
      meta: {
        model: 'risk',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'controlForm',
      name: 'ControlForm',
      component: () => import('@/views/risk/gradedControl/controlForm.vue'),
      meta: {
        model: 'risk',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'controlFormDesign',
      name: 'ControlFormDesign',
      component: () =>
        import('@/views/risk/gradedControl/controlFormDesign.vue'),
      meta: {
        model: 'risk',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'evaluationPage',
      name: 'EvaluationPage',
      component: () =>
        import('@/views/risk/identificationAndEvaluation/evaluationPage.vue'),
      meta: {
        model: 'risk',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
  ],
};

export default RISK;
