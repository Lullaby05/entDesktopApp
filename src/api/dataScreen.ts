import Axios from '@/api/interceptor';

type dataScreenType = {
  scale: 'Hour' | 'Month' | 'Day';
  type?: string;
  timeScope: string;
  startTime?: string;
  endTime?: string;
};

// 获取大屏统计数据作业+应急+员工
export function getDataScreenByType(data: dataScreenType) {
  return Axios({
    url: '/businessApi/business/statistics/get-statistics-data',
    method: 'post',
    data,
  });
}

// 获取大屏统计数据风险辨识与管控
export function getDataScreenRiskControl(
  data: dataScreenType & { riskLevelCode: string }
) {
  return Axios({
    url: '/businessApi/business/statistics/risk-control',
    method: 'post',
    data,
  });
}
// 获取大屏统计数据隐患排查
export function getDataScreenRiskCheck(data: dataScreenType) {
  return Axios({
    url: '/businessApi/business/statistics/risk-check',
    method: 'post',
    data,
  });
}
// 获取大屏统计数据隐患治理
export function getDataScreenRiskGovern(data: dataScreenType) {
  return Axios({
    url: '/businessApi/business/statistics/risk-govern',
    method: 'post',
    data,
  });
}
// 获取大屏统计数据隐患数量趋势
export function getDataScreenRiskNumTrend(data: dataScreenType) {
  return Axios({
    url: '/businessApi/business/statistics/risk-num-trend',
    method: 'post',
    data,
  });
}

// 大屏作业第一层数据下钻
export function getDataScreenJobFirst(data: string[]) {
  return Axios({
    url: '/businessApi/business/operation/statisticByType',
    method: 'post',
    data,
  });
}

// 大屏作业第二层数据下钻
export function getDataScreenJobSecond(data: string[]) {
  return Axios({
    url: '/businessApi/business/operation/getListByIds',
    method: 'post',
    data,
  });
}

// 大屏企业证照数据下钻
export function getDataScreenEntLicense(data: string[]) {
  return Axios({
    url: '/businessApi/business/enterprise/license/getListByIds',
    method: 'post',
    data,
  });
}

// 大屏员工证照数据下钻
export function getDataScreenStaffLicense(data: string[]) {
  return Axios({
    url: '/businessApi/business/license/getListByIds',
    method: 'post',
    data,
  });
}

// 大屏隐患排查第一层数据下钻
export function getDataScreenRiskCheckFirst(data: any) {
  return Axios({
    url: '/businessApi/business/statistics/risk-check-dept',
    method: 'post',
    data,
  });
}

// 大屏隐患排查第二层数据下钻
export function getDataScreenRiskCheckSecond(data: any) {
  return Axios({
    url: '/businessApi/business/statistics/getCheckDataByDept',
    method: 'post',
    data,
  });
}

// 大屏风险管控数据下钻
export function getDataScreenRiskControlDetail(data: string[]) {
  return Axios({
    url: '/businessApi/business/statistics/risk-control-dept',
    method: 'post',
    data,
  });
}

// 大屏风险管控数据下钻第二层
export function getDataScreenRiskControlDetailSecond(params: any) {
  return Axios({
    url: `/businessApi/business/statistics/getRiskPointDangerDTO`,
    method: 'post',
    params,
  });
}

// 大屏隐患治理数据下钻
export function getDataScreenRiskGovernDetailFirst(data: string[]) {
  return Axios({
    url: '/businessApi/business/statistics/risk-govern-rate-dept',
    method: 'post',
    data,
  });
}

// 大屏隐患治理隐患分布情况数据下钻
export function getDataScreenRiskGovernDetail(data: string[]) {
  return Axios({
    url: '/businessApi/business/statistics/risk-govern-dept',
    method: 'post',
    data,
  });
}

// 大屏隐患数量趋势数据下钻
export function getDataScreenRiskNumTrendDetail(data: any) {
  return Axios({
    url: '/businessApi/business/statistics/risk-num-trend-dept',
    method: 'post',
    data,
  });
}
