// import axios from 'axios';
import axios from 'axios';
import Axios from '@/api/interceptor';
import type { RouteRecordNormalized } from 'vue-router';
// import minimist from 'minimist';
import { UserState } from '@/store/modules/user/types';

export interface LoginData {
  username: string;
  password: string;
  phone: string;
  verifyCode: string;
}

export interface LoginRes {
  token: string;
}

export function logout() {
  return axios.post<LoginRes>('/api/user/logout');
}

export function getMenuList() {
  return axios.post<RouteRecordNormalized[]>('/api/user/menu');
}

type loginType = {
  condition: string;
  password: string;
};

// 登录，获取token
export const login = (data: loginType) => {
  return Axios({
    url: `/businessApi/business/login?condition=${data.condition}&password=${data.password}`,
    method: 'POST',
  });
};
// 获取用户信息
export const getUserInfo = () => {
  return Axios({
    url: '/businessApi/business/login/user-info',
    method: 'POST',
  });
};

// 登录，获取企业列表
export const loginV2 = (data: loginType) => {
  return Axios({
    url: `/businessApi/business/login/login-v2?condition=${data.condition}&password=${data.password}`,
    method: 'POST',
  });
};
// 登录，根据手机验证码获取企业列表
export const loginByPhoneV2 = (data: any) => {
  return Axios({
    url: `/businessApi/business/login/mobile-login-v2?mobile=${data.mobile}&code=${data.code}`,
    method: 'POST',
  });
};
// 获取登陆人的企业列表
export const getTenantList = () => {
  return Axios({
    url: `/businessApi/business/login/get-enterprise-list`,
    method: 'POST',
  });
};
// 根据企业列表信息获取token
export const getTokenByTenant = (data: any) => {
  return Axios({
    url: `/businessApi/business/login/get-token`,
    method: 'POST',
    data,
  });
};

// 获取用户菜单
export const getMenu = () => {
  return Axios({
    url: '/businessApi/business/tenant/user/menu/get-menu-by-user/2',
    method: 'POST',
  });
};

// 获取用户按钮权限
export const getBtnPermission = () => {
  return Axios({
    url: '/businessApi/business/tenant/user/menu/get-menu-btn-by-user/2',
    method: 'POST',
  });
};

// 刷新token
export const refreshToken = (refreshToken: string) => {
  return Axios({
    url: `/businessApi/business/login/refresh?refreshToken=${refreshToken}`,
    method: 'POST',
  });
};

// 获取验证码
export const getVerifyCode = (mobile: string) => {
  return Axios({
    url: `/businessApi/business/login/get-code?mobile=${mobile}`,
    method: 'POST',
  });
};

// 手机号登录
export const loginByPhone = (data: any) => {
  return Axios({
    url: `/businessApi/business/login/mobile-login?mobile=${data.mobile}&code=${data.code}`,
    method: 'POST',
  });
};

// 获取角色列表
export const getRoleList = (data: any) => {
  return Axios({
    url: `/businessApi/business/ent/role/get-page`,
    method: 'POST',
    data,
  });
};

// 获取角色列表（不分页）
export const getRoleListApi = (data: any) => {
  return Axios({
    url: `/businessApi/business/ent/role/get-list`,
    method: 'POST',
    data,
  });
};

// 新增角色
export const addRoleApi = (data: any) => {
  return Axios({
    url: `/businessApi/business/ent/role/create`,
    method: 'POST',
    data,
  });
};

// 编辑角色
export const updateRole = (data: any) => {
  return Axios({
    url: `/businessApi/business/ent/role/update`,
    method: 'POST',
    data,
  });
};

// 删除角色
export const deleteRole = (id: string) => {
  return Axios({
    url: `/businessApi/business/ent/role/delete-role-menu/${id}`,
    method: 'POST',
    // data
  });
};

// 修改角色对应的菜单权限
export const updateRolePerission = (data: any) => {
  return Axios({
    url: `/businessApi/business/ent/role/update-role-menu`,
    method: 'POST',
    data,
  });
};

// 获取用户列表
export const getUserList = (data: any) => {
  return Axios({
    url: `/businessApi/business/ent/user/get-page`,
    method: 'POST',
    data,
  });
};

// 根据id获取用户对应的手机号
export const getUserPhone = (data: any) => {
  return Axios({
    url: `/businessApi/business/ent/user/get-user-account-page`,
    method: 'POST',
    data,
  });
};

//新增用户
export const addUserApi = (data: any) => {
  return Axios({
    url: `/businessApi/business/ent/user/create`,
    method: 'POST',
    data,
  });
};

//编辑用户
export const updateUserApi = (data: any) => {
  return Axios({
    url: `/businessApi/business/ent/user/update`,
    method: 'POST',
    data,
  });
};

//获取用户详情
export const getUserDetailApi = (id: any) => {
  return Axios({
    url: `/businessApi/business/ent/user/get-detail/${id}`,
    method: 'POST',
  });
};

// 用户绑定员工
export const userBindEmployee = (params: {
  employeeId: string;
  userId: string;
}) => {
  return Axios({
    url: `/businessApi/business/ent/user/bound-employee`,
    method: 'POST',
    params,
  });
};
// 用户解绑员工
export const userUnbindEmployee = (params: {
  employeeId: string;
  userId: string;
}) => {
  return Axios({
    url: `/businessApi/business/ent/user/not-bound-employee`,
    method: 'POST',
    params,
  });
};

// 员工解绑用户
export const employeeUnbindUser = (params: {
  employeeId: string;
  userId: string;
}) => {
  return Axios({
    url: `/businessApi/business/ent/user/not-bound-user`,
    method: 'POST',
    params,
  });
};

// 删除用户
export const deleteUser = (id: any) => {
  return Axios({
    url: `/businessApi/business/ent/user/delete/${id}`,
    method: 'POST',
    // data
  });
};

// 发送用户账号
export const sendUserAccount = (data: any) => {
  return Axios({
    url: `/businessApi/business/ent/user/send-user-account`,
    method: 'POST',
    data,
  });
};

// 修改用户密码
export function changePasswordApi(params: any) {
  return Axios({
    url: `/businessApi/business/tenant/ent/administration-update-user-possword`,
    method: 'post',
    params,
  });
}

// 获取未关联的员工
export const getNotRelatedEmployee = (data: any) => {
  return Axios({
    url: `/businessApi/business/ent/user/get-employee-not-bound-list`,
    method: 'POST',
    data,
  });
};

// 根据部门和用户名获取未关联的员工
export const getNotRelatedEmployeeByName = (data: any) => {
  return Axios({
    url: `/businessApi/business/ent/user/get-employee-list`,
    method: 'POST',
    data,
  });
};

// 根据部门和用户名获取未关联的用户
export const getNotRelatedUserByName = (data: any) => {
  return Axios({
    url: `/businessApi/business/ent/user/get-page-not-bound`,
    method: 'POST',
    data,
  });
};

// 获取权限树
export const getPermissionList = (data: any) => {
  return Axios({
    url: `/businessApi/business/user/user/getPermissionList`,
    method: 'POST',
    // data
  });
};

// 获取当前企业所有的菜单
export const getMenuListEnum = (platform: any) => {
  return Axios({
    url: `/businessApi/business/tenant/user/menu/get-menu-by-tenant/${platform}`,
    method: 'POST',
  });
};

// 获取当前角色拥有的菜单
export const getMenuListByRole = (platform: number, roleId: string) => {
  return Axios({
    url: `/businessApi/business/tenant/user/menu/get-menu-by-role/${platform}?roleId=${roleId}`,
    method: 'POST',
  });
};

// 给角色批量添加权限
export const batchAuthPermission = (
  paltform: number,
  data: { menuIdSet: string; roleIdSet: string }
) => {
  return Axios({
    url: `/businessApi/business/ent/role/update-batch-role-menu/${paltform}`,
    method: 'POST',
    data,
  });
};

// 根据菜单id获取有权限的角色
export const getRoleListByMenuId = (platform: number, menuId: string) => {
  return Axios({
    url: `/businessApi/business/ent/role/get-role-by-menu-id/${platform}?menuId=${menuId}`,
    method: 'POST',
  });
};

// 判断选择的员工是否绑定了用户
export const judgeBindingUser = (id: string) => {
  return Axios({
    url: `/businessApi/business/employee/validate-employee-bind-user?id=${id}`,
    method: 'POST',
  });
};

// 判断选择的员工是否有对应模块或功能的权限
export const judgeUserHasPermission = (data: any) => {
  return Axios({
    url: `/businessApi/business/tenant/user/menu/validate-menu`,
    method: 'POST',
    data,
  });
};
