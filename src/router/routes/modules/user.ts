import { DEFAULT_LAYOUT } from '../base';
import { AppRouteRecordRaw } from '../types';

const USER: AppRouteRecordRaw = {
  path: '/user',
  name: 'user',
  component: DEFAULT_LAYOUT,
  meta: {
    model: 'user',
    locale: 'menu.userManage',
    requiresAuth: true,
    icon: 'icon-用户管理-灰',
    activeIcon: 'icon-用户管理-蓝',
    order: 13,
    redirect: 'RoleList',
    redirectUrl: '/user/roleList',
    isModel: true,
  },
  children: [
    {
      path: 'roleList',
      name: 'RoleList',
      component: () => import('@/views/user/roleList/index.vue'),
      meta: {
        model: 'user',
        locale: 'menu.role',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'roleListLicensing',
      name: 'RoleListLicensing',
      component: () => import('@/views/user/roleList/Licensing.vue'),
      meta: {
        model: 'user',
        locale: 'menu.role',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'userList',
      name: 'UserList',
      component: () => import('@/views/user/userList/index.vue'),
      meta: {
        model: 'user',
        locale: 'menu.userList',
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'userListAdd',
      name: 'UserListAdd',
      component: () => import('@/views/user/userList/add.vue'),
      meta: {
        model: 'user',
        locale: 'menu.userList',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'userListEdit',
      name: 'UserListEdit',
      component: () => import('@/views/user/userList/edit.vue'),
      meta: {
        model: 'user',
        locale: 'menu.userList',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
    // {
    //   path: 'userPermissionEdit',
    //   name: 'UserPermissionEdit',
    //   component: () => import('@/views/user/userList/editPermission.vue'),
    //   meta: {
    //     model: 'user',
    //     locale: 'menu.userList',
    //     hideInMenu: true,
    //     requiresAuth: true,
    //     roles: ['*'],
    //   },
    // },
    {
      path: 'userListSendAccount',
      name: 'UserListSendAccount',
      component: () => import('@/views/user/userList/sendAccount.vue'),
      meta: {
        model: 'user',
        locale: 'menu.userList',
        hideInMenu: true,
        requiresAuth: true,
        roles: ['*'],
      },
    },
    {
      path: 'batchLicensing',
      name: 'BatchLicensing',
      component: () => import('@/views/user/batchLicensing/index.vue'),
      meta: {
        model: 'user',
        locale: 'menu.batchLicensing',
        requiresAuth: true,
        roles: ['*'],
      },
    },
  ],
};

export default USER;
