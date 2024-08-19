import { AxiosResponse } from 'axios';
import requestOpeartion from '@/api/interceptor';

/**
 *  多级联动查询
 * @param {string} url 当前查询的url
 * @param {string | number} param 多级联动查询参数，第一个选择框不需要传参
 * @returns
 */
function getMultilevelLink(url: string, param?: string | number) {
  return requestOpeartion({
    url: '/businessApi' + url + param,
    method: 'post',
  });
}

/**
 * 获取动态下拉列表
 * @param url 当前下拉框的url
 * @param param 查询参数，可不传
 * @returns
 */
function getRemoteOptions(
  url: string,
  param = ''
): (url: string, param?: string | number) => Promise<AxiosResponse<any, any>> {
  return requestOpeartion({
    url: '/businessApi' + url + param,
    method: 'get',
  });
}

// 获取所有多级联动的下拉
function getAllLevelLinkOptions() {
  return requestOpeartion({
    url: '/businessApi/business/operation/multiple-configuration',
    method: 'post',
  });
}

// 获取所有根据接口获取下拉列表的下拉
function getAllDropDownOptions() {
  return requestOpeartion({
    url: '/businessApi/business/operation/select-configuration',
    method: 'post',
  });
}

export default {
  getMultilevelLink,
  getRemoteOptions,
  getAllLevelLinkOptions,
  getAllDropDownOptions,
};
