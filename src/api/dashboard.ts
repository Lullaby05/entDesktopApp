import axios from 'axios';
import Axios from '@/api/interceptor';
import type { TableData } from '@arco-design/web-vue/es/table/interface';

export interface ContentDataRecord {
  x: string;
  y: number;
}

export function queryContentData() {
  return axios.get<ContentDataRecord[]>('/api/content-data');
}

export interface PopularRecord {
  key: number;
  clickNumber: string;
  title: string;
  increases: number;
}

export function queryPopularList(params: { type: string }) {
  return axios.get<TableData[]>('/api/popular/list', { params });
}

export function getFinishRate() {
  return Axios({
    url: `/businessApi/business/statistics/workbench/success-rate`,
    method: "POST",
  });
}

// 获取最近访问
export function getRencentPage() {
  return Axios({
    url: `/businessApi/business/recently-visited/getRecentlyVisited`,
    method: "POST",
  });
}

// 设置最近访问
export function setRencentPage(menuName: string) {
  return Axios({
    url: `/businessApi/business/recently-visited/visited?menuName=${menuName}`,
    method: "POST",
  });
}

// 获取作业统计数据
export function getOperationStatistics() {
  return Axios({
    url: `/businessApi/business/operation/workStatistic`,
    method: "POST",
  });
}

// 获取隐患统计数据
export function getPitfallStatistics() {
  return Axios({
    url: `/businessApi/business/statistics/workbench/safe-state-count`,
    method: "POST",
  });
}