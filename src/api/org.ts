import request from '@/api/interceptorUaa';

// 查询组织架构树
export function getOrgTree(param) {
  return request({
    url: 'uaa/org/tree',
    method: 'get',
    params: param,
  });
}

export function getUserSign(userId) {
  return request({
    url: 'uaa/org/user/sign?userId=' + userId,
    method: 'get',
  });
}

// 查询系统角色
export function getRole() {
  return request({
    url: 'uaa/org/role',
    method: 'get',
  });
}

// 搜索人员
export function getUserByName(param) {
  return request({
    url: 'uaa/org/tree/user/search',
    method: 'get',
    params: param,
  });
}

// 搜索人员
export function getUserDepts(userId) {
  return request({
    url: `uaa/org/user/${userId}/dept`,
    method: 'get',
  });
}

// 获取审批代理人
export function getUserAgent() {
  return request({
    url: `uaa/org/user/agent`,
    method: 'get',
  });
}

// 获取审批代理人
export function setUserAgent(params) {
  return request({
    url: `uaa/org/user/agent`,
    method: 'put',
    data: params,
  });
}

// 获取审批代理人
export function cancelUserAgent() {
  return request({
    url: `uaa/org/user/agent`,
    method: 'delete',
  });
}

// 根据taskId获取节点是否需要签名
export function getNeedSignByTaskId(taskId: string) {
  return request({
    url: `wflow/process/task/settings/${taskId}`,
    method: 'get',
  });
}

export default {
  getUserSign,
  getOrgTree,
  getUserByName,
  getRole,
  getUserDepts,
  getUserAgent,
  setUserAgent,
  cancelUserAgent,
  getNeedSignByTaskId,
};
