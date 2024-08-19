import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const EMERGENCY: AppRouteRecordRaw = {
  path: '/emergency',
  name: 'emergency',
  component: DEFAULT_LAYOUT,
  meta: {
    model: 'emergency',
    locale: 'menu.emergency',
    requiresAuth: true,
    icon: 'icon-应急管理-灰',
    activeIcon: 'icon-应急管理-蓝',
    order: 7,
    redirect: 'EmergencyPlan',
    redirectUrl: '/emergency/EmergencyResource/Expert',
    isModel: true,
  },
  children: [
    {
      path: 'emergencyResource',
      name: 'EmergencyResource',
      component: '',
      meta: {
        model: 'emergency',
        locale: 'menu.emergencyResource',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: 'expert',
          name: 'Expert',
          component: () =>
            import('@/views/emergency/emergencyResource/expert/index.vue'),
          meta: {
            model: 'emergency',
            locale: 'menu.exerciseExpert',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'materials',
          name: 'Materials',
          component: () =>
            import('@/views/emergency/emergencyResource/materials/index.vue'),
          meta: {
            model: 'emergency',
            locale: 'menu.exerciseMaterials',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'troops',
          name: 'Troops',
          component: () =>
            import('@/views/emergency/emergencyResource/troops/index.vue'),
          meta: {
            model: 'emergency',
            locale: 'menu.exerciseTroops',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },

    {
      path: 'emergencyPlan',
      name: 'EmergencyPlan',
      component: () => import('@/views/emergency/emergencyPlan/index.vue'),
      meta: {
        model: 'emergency',
        locale: 'menu.emergencyPlan',
        requiresAuth: true,
        roles: ['*'],
      },
    },

    {
      path: 'emergencyExercisePlan',
      name: 'EmergencyExercisePlan',
      component: () =>
        import('@/views/emergency/emergencyExercise/exercisePlan/index.vue'),
      meta: {
        model: 'emergency',
        locale: 'menu.emergencyExercisePlan',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    // 非菜单页面
    {
      path: 'troopsEditPage',
      name: 'TroopsEditPage',
      component: () =>
        import('@/views/emergency/emergencyResource/troops/edit.vue'),
      meta: {
        model: 'emergency',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'emergencyPlanAdd',
      name: 'EmergencyPlanAdd',
      component: () => import('@/views/emergency/emergencyPlan/edit.vue'),
      meta: {
        model: 'emergency',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'checkRecordPage',
      name: 'CheckRecordPage',
      component: () =>
        import('@/views/emergency/emergencyResource/materials/checkRecord.vue'),
      meta: {
        model: 'emergency',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'exercisePlanAdd',
      name: 'ExercisePlanAdd',
      component: () =>
        import('@/views/emergency/emergencyExercise/exercisePlan/add.vue'),
      meta: {
        model: 'emergency',
        locale: '',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'exerciseRecordPage',
      name: 'ExerciseRecordPage',
      component: () =>
        import('@/views/emergency/emergencyExercise/exerciseRecords/add.vue'),
      meta: {
        model: 'emergency',
        locale: '',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
  ],
};

export default EMERGENCY;
