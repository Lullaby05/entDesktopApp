import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const PITFAll: AppRouteRecordRaw = {
  path: '/pitfall',
  name: 'pitfall',
  component: DEFAULT_LAYOUT,
  meta: {
    model: 'pitfall',
    locale: 'menu.pitfall',
    requiresAuth: true,
    icon: 'icon-隐患管理-灰',
    activeIcon: 'icon-隐患管理-蓝',
    order: 6,
    redirect: 'Snapshot',
    redirectUrl: '/pitfall/snapshot',
    isModel: true,
  },
  children: [
    // 随手拍
    {
      path: 'snapshot',
      name: 'Snapshot',
      component: () => import('@/views/pitfall/snapshot/index.vue'),
      meta: {
        model: 'pitfall',
        locale: 'menu.snapshot',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'snapshotDetail',
      name: 'SnapshotDetail',
      component: () => import('@/views/pitfall/snapshot/snapshotDetail.vue'),
      meta: {
        model: 'pitfall',
        locale: 'menu.snapshotDetail',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'executeDailyTask',
      name: 'ExecuteDailyTask',
      component: () =>
        import('@/views/pitfall/dailyCheckTasks/executeDailyTask.vue'),
      meta: {
        model: 'pitfall',
        locale: 'menu.dailyCheckTasks',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },

    // 排查计划管理
    {
      path: 'checkPlanManage',
      name: 'CheckPlanManage',
      component: '',
      meta: {
        model: 'pitfall',
        locale: 'menu.checkPlanManage',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        // 排查内容管理
        {
          path: 'checkContentManage',
          name: 'CheckContentManage',
          component: () =>
            import('@/views/pitfall/checkContentManage/index.vue'),
          meta: {
            model: 'pitfall',
            locale: 'menu.checkContentManage',
            requiresAuth: true,
            roles: ['*'],
          },
          children: [],
        },
        {
          path: 'checkContentAdd',
          name: 'CheckContentAdd',
          component: () =>
            import('@/views/pitfall/checkContentManage/checkContentDetail.vue'),
          meta: {
            model: 'pitfall',
            locale: 'menu.checkContentManage',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'checkContentEdit',
          name: 'CheckContentEdit',
          component: () =>
            import('@/views/pitfall/checkContentManage/checkContentDetail.vue'),
          meta: {
            model: 'pitfall',
            locale: 'menu.checkContentManage',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'checkContentFormDesign',
          name: 'CheckContentFormDesign',
          component: () =>
            import('@/views/risk/gradedControl/controlFormDesign.vue'),
          meta: {
            model: 'pitfall',
            locale: 'menu.checkContentManage',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'batchChooseContent',
          name: 'BatchChooseContent',
          component: () =>
            import('@/views/pitfall/checkContentManage/batchChoose.vue'),
          meta: {
            model: 'pitfall',
            locale: 'menu.checkContentManage',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        // 排查表管理
        {
          path: 'checkListManage',
          name: 'CheckListManage',
          component: () => import('@/views/pitfall/checkListManage/index.vue'),
          meta: {
            model: 'pitfall',
            locale: 'menu.checkListManage',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'formulateChecklistDetail',
          name: 'FormulateChecklistDetail',
          component: () => import('@/views/pitfall/checkListManage/detail.vue'),
          meta: {
            model: 'pitfall',
            locale: 'menu.checkListManage',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'formulateChecklistForm',
          name: 'FormulateChecklistForm',
          component: () =>
            import('@/views/pitfall/checkListManage/formDetail.vue'),
          meta: {
            model: 'pitfall',
            locale: 'menu.checkListManage',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        // 排查计划管理
        {
          path: 'checkPlanManageList',
          name: 'CheckPlanManageList',
          component: () => import('@/views/pitfall/checkPlanManage/index.vue'),
          meta: {
            model: 'pitfall',
            locale: 'menu.checkPlanManage',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'checkPlanManageAdd',
          name: 'CheckPlanManageAdd',
          component: () => import('@/views/pitfall/checkPlanManage/add.vue'),
          meta: {
            model: 'pitfall',
            locale: 'menu.checkPlanManage',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'checkPlanManageEdit',
          name: 'CheckPlanManageEdit',
          component: () => import('@/views/pitfall/checkPlanManage/edit.vue'),
          meta: {
            model: 'pitfall',
            locale: 'menu.checkPlanManage',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'planExecuteSituation',
          name: 'PlanExecuteSituation',
          component: () => import('@/views/pitfall/checkPlanManage/detail.vue'),
          meta: {
            model: 'pitfall',
            locale: 'menu.checkPlanManage',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        // 表单设计器
        {
          path: 'formDesignTest',
          name: 'formDesignTest',
          component: () => import('@/views/pitfall/formDesignTest.vue'),
          meta: {
            model: 'pitfall',
            locale: 'menu.formDesignTest',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },
    // // 计划排查任务
    // {
    //   path: 'planToCheckTask',
    //   name: 'PlanToCheckTask',
    //   component: () => import('@/views/pitfall/planToCheckTask/index.vue'),
    //   meta: {
    //     model: 'pitfall',
    //     locale: 'menu.planToCheckTask',
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
    // 排查任务
    {
      path: 'dailyCheckTasks',
      name: 'DailyCheckTasks',
      component: () => import('@/views/pitfall/dailyCheckTasks/index.vue'),
      meta: {
        model: 'pitfall',
        locale: 'menu.dailyCheckTasks',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'checkDailyTaskDetail',
      name: 'CheckDailyTaskDetail',
      component: () =>
        import('@/views/pitfall/dailyCheckTasks/checkDailyTaskDetail.vue'),
      meta: {
        model: 'pitfall',
        locale: 'menu.dailyCheckTasks',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'pitfallControl',
      name: 'PitfallControl',
      component: '',
      meta: {
        model: 'pitfall',
        locale: 'menu.pitfallControl',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        // 隐患处理
        {
          path: 'pitfallManage',
          name: 'PitfallManage',
          component: () => import('@/views/pitfall/pitfallManage/index.vue'),
          meta: {
            model: 'pitfall',
            locale: 'menu.pitfallManage',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        // 隐患详情
        {
          path: 'pitfallDetail',
          name: 'PitfallDetail',
          component: () =>
            import('@/views/pitfall/snapshot/snapshotDetail.vue'),
          meta: {
            model: 'pitfall',
            locale: 'menu.pitfallDetail',
            hideInMenu: true,
            requiresAuth: true,
            roles: ['*'],
          },
        },
        // 隐患总览
        {
          path: 'pitfallOverview',
          name: 'PitfallOverview',
          component: () => import('@/views/pitfall/pitfallOverview/index.vue'),
          meta: {
            model: 'pitfall',
            locale: 'menu.pitfallOverview',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        // 隐患处理配置
        {
          path: 'pitfallManagePermission',
          name: 'PitfallManagePermission',
          component: () =>
            import('@/views/pitfall/pitfallManagePermission/index.vue'),
          meta: {
            model: 'pitfall',
            locale: 'menu.pitfallManagePermission',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },
  ],
};

export default PITFAll;
