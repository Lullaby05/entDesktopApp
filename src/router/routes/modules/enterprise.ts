import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const ENTERPRISE: AppRouteRecordRaw = {
  path: '/enterpriseManage',
  name: 'enterpriseManage',
  component: DEFAULT_LAYOUT,
  meta: {
    model: 'enterpriseManage',
    locale: 'menu.enterpriseManage',
    requiresAuth: true,
    icon: 'icon-企业管理-灰',
    activeIcon: 'icon-企业管理-蓝',
    order: 3,
    redirect: 'baseInfo',
    redirectUrl: '/enterpriseManage/baseInfo',
    isModel: true,
  },
  children: [
    {
      path: 'baseInfo',
      name: 'BaseInfo',
      component: () => import('@/views/enterpriseManage/baseInfo/index.vue'),
      meta: {
        model: 'enterpriseManage',
        locale: 'menu.baseInfo',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'enterpriseBaseInfoEdit',
      name: 'EnterpriseBaseInfoEdit',
      component: () => import('@/views/enterpriseManage/baseInfo/edit.vue'),
      meta: {
        model: 'enterpriseManage',
        locale: '',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'organization',
      name: 'Organization',
      component: () =>
        import('@/views/enterpriseManage/organization/index.vue'),
      meta: {
        model: 'enterpriseManage',
        locale: 'menu.organization',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'securityDepartment',
      name: 'SecurityDepartment',
      component: () =>
        import('@/views/enterpriseManage/securityDepartment/index.vue'),
      meta: {
        model: 'enterpriseManage',
        locale: 'menu.securityDepartmentManage',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'securityDepartmentEdit',
      name: 'SecurityDepartmentEdit',
      component: () =>
        import('@/views/enterpriseManage/securityDepartment/edit.vue'),
      meta: {
        model: 'enterpriseManage',
        locale: '',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },

    {
      path: 'postManage',
      name: 'PostManage',
      component: () => import('@/views/enterpriseManage/postManage/index.vue'),
      meta: {
        model: 'enterpriseManage',
        locale: 'menu.postManage',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'staffManage',
      name: 'StaffManage',
      component: () => import('@/views/enterpriseManage/staffManage/index.vue'),
      meta: {
        model: 'enterpriseManage',
        locale: 'menu.staffManage',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'staffManageEdit',
      name: 'StaffManageEdit',
      component: () => import('@/views/enterpriseManage/staffManage/edit.vue'),
      meta: {
        model: 'enterpriseManage',
        locale: '',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'staffListSendAccount',
      name: 'StaffListSendAccount',
      component: () => import('@/views/user/userList/sendAccount.vue'),
      meta: {
        model: 'enterpriseManage',
        locale: '',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'staffListCreateAccount',
      name: 'StaffListCreateAccount',
      component: () =>
        import('@/views/enterpriseManage/staffManage/batchCreateAccount.vue'),
      meta: {
        model: 'enterpriseManage',
        locale: '',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'staffUserListEdit',
      name: 'StaffUserListEdit',
      component: () => import('@/views/user/userList/edit.vue'),
      meta: {
        model: 'enterpriseManage',
        locale: '',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'certificate',
      name: 'Certificate',
      component: '',
      meta: {
        model: 'enterpriseManage',
        locale: 'menu.certificate',
        requiresAuth: true,
        roles: ['*'],
      },
      children: [
        {
          path: 'enterpriseCollect',
          name: 'EnterpriseCollect',
          component: () =>
            import(
              '@/views/enterpriseManage/certificate/enterpriseCertificate/enterpriseCollect.vue'
            ),
          meta: {
            model: 'enterpriseManage',
            locale: 'menu.enterpriseCollect',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'enterpriseCollectEdit',
          name: 'EnterpriseCollectEdit',
          component: () =>
            import(
              '@/views/enterpriseManage/certificate/enterpriseCertificate/collectEdit.vue'
            ),
          meta: {
            model: 'enterpriseManage',
            locale: '',
            requiresAuth: true,
            hideInMenu: true,
            roles: ['*'],
          },
        },
        {
          path: 'enterpriseCollectView',
          name: 'EnterpriseCollectView',
          component: () =>
            import(
              '@/views/enterpriseManage/certificate/enterpriseCertificate/collectView.vue'
            ),
          meta: {
            model: 'enterpriseManage',
            locale: '',
            requiresAuth: true,
            hideInMenu: true,
            roles: ['*'],
          },
        },
        {
          path: 'enterpriseExamine',
          name: 'EnterpriseExamine',
          component: () =>
            import(
              '@/views/enterpriseManage/certificate/enterpriseCertificate/enterpriseExamine.vue'
            ),
          meta: {
            model: 'enterpriseManage',
            locale: 'menu.enterpriseExamine',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'staffCollect',
          name: 'StaffCollect',
          component: () =>
            import(
              '@/views/enterpriseManage/certificate/staffCertificate/staffCollect.vue'
            ),
          meta: {
            model: 'enterpriseManage',
            locale: 'menu.staffCollect',
            requiresAuth: true,
            roles: ['*'],
          },
        },
        {
          path: 'staffCollectAdd',
          name: 'StaffCollectAdd',
          component: () =>
            import(
              '@/views/enterpriseManage/certificate/staffCertificate/collectAdd.vue'
            ),
          meta: {
            model: 'enterpriseManage',
            locale: '',
            requiresAuth: true,
            hideInMenu: true,
            roles: ['*'],
          },
        },
        {
          path: 'staffCollectView',
          name: 'StaffCollectView',
          component: () =>
            import(
              '@/views/enterpriseManage/certificate/staffCertificate/collectView.vue'
            ),
          meta: {
            model: 'enterpriseManage',
            locale: '',
            requiresAuth: true,
            hideInMenu: true,
            roles: ['*'],
          },
        },
        {
          path: 'staffExamine',
          name: 'staffExamine',
          component: () =>
            import(
              '@/views/enterpriseManage/certificate/staffCertificate/staffExamine.vue'
            ),
          meta: {
            model: 'enterpriseManage',
            locale: 'menu.staffExamine',
            requiresAuth: true,
            roles: ['*'],
          },
        },
      ],
    },

    {
      path: 'workType',
      name: 'WorkType',
      component: () => import('@/views/enterpriseManage/workType/index.vue'),
      meta: {
        model: 'enterpriseManage',
        locale: 'menu.workType',
        requiresAuth: true,
        roles: ['*'],
      },
    },

    {
      path: 'workTypeEdit',
      name: 'WorkTypeEdit',
      component: () => import('@/views/enterpriseManage/workType/edit.vue'),
      meta: {
        model: 'enterpriseManage',
        locale: '',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },

    // 01 版本 去掉的菜单
    {
      path: 'agency',
      name: 'Agency',
      component: () => import('@/views/enterpriseManage/agency/index.vue'),
      meta: {
        model: 'enterpriseManage',
        locale: 'menu.agency',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
    {
      path: 'personnelManage',
      name: 'PersonnelManage',
      component: () =>
        import('@/views/enterpriseManage/agency/personnelManage.vue'),
      meta: {
        model: 'enterpriseManage',
        requiresAuth: true,
        hideInMenu: true,
        roles: ['*'],
      },
    },
  ],
};

export default ENTERPRISE;
