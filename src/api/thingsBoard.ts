import Axios from '@/api/interceptor';
import { searchType } from '@/views/thingsBoard/eventConfig/eventConfigManagement/type';
import { eventManageSearchType } from '@/views/thingsBoard/eventConfig/eventManagement/type';

// 获取事件配置列表
export const getEventConfigList = (data: searchType) => {
  return Axios({
    url: '/businessApi/business/event/page',
    method: 'post',
    data,
  });
};

// 获取事件配置详情
export const getEventConfigDetail = (id: string) => {
  return Axios({
    url: `/businessApi/business/event/detail/${id}`,
    method: 'post',
  });
};

//修改事件配置
export const updateEventConfig = (data: any) => {
  return Axios({
    url: `/businessApi/business/event/update`,
    method: 'post',
    data,
  });
};

// 获取事件列表
export const getEventList = (data: eventManageSearchType) => {
  return Axios({
    url: '/businessApi/business/event/record/page',
    method: 'post',
    data,
  });
};

// 获取事件tab列表
export const getEventTabsList = () => {
  return Axios({
    url: '/businessApi/business/event/record/tab-num',
    method: 'post',
  });
};

// 获取事件详情
export const getEventDetail = (
  id: string,
  isRecord: 0 | 1 = 1,
  isUpdate: 0 | 1 = 0
) => {
  return Axios({
    url: `/businessApi/business/event/record/detail/${id}?isRecord=${isRecord}&isUpdate=${isUpdate}`,
    method: 'post',
  });
};

// 获取事件列表（大屏）
export const getEventListScreen = (data: any) => {
  return Axios({
    url: '/businessApi/business/event/record/data/screen/list',
    method: 'post',
    data,
  });
};

// 获取应急预案（大屏）
export const getEmergencyPlanListScreen = (id: any, data: any) => {
  return Axios({
    url: `/businessApi/business/event/task/get-emanagement-list-simple/${id}`,
    method: 'post',
    data,
  });
};

// 录入现场信息
export const addEventRecord = (data: any) => {
  return Axios({
    url: '/businessApi/business/event/task/inputInfo',
    method: 'post',
    data,
  });
};

// 新增处置任务
export const addTask = (data: any) => {
  return Axios({
    url: '/businessApi/business/event/task/create',
    method: 'post',
    data,
  });
};
// 关闭事件
export const closeEvent = (id: string, data: any) => {
  return Axios({
    url: `/businessApi/business/event/record/close/${id}`,
    method: 'post',
    data,
  });
};

// 获取应急事件流程
export const getEventRecordDetail = (id: string) => {
  return Axios({
    url: `/businessApi/business/event/task/get/list/${id}`,
    method: 'post',
  });
};

// 获取应急预案相关人员
export const getEmergencyPlanPerson = (id: string, data: any) => {
  return Axios({
    url: `/businessApi/business/event/task/get-user-page/${id}`,
    method: 'post',
    data,
  });
};

// 启动应急预案
export const startEmergencyPlan = (data: any) => {
  return Axios({
    url: '/businessApi/business/event/task/start/plan',
    method: 'post',
    data,
  });
};

// 事件级别分布（大屏）
export const getEventLevelDistribution = (data: any) => {
  return Axios({
    url: '/businessApi/business/event/record/event-level-distribute/V2',
    method: 'post',
    data,
  });
};

// 异常情况处理（大屏）
export const getExceptionHandling = (data: any) => {
  return Axios({
    url: '/businessApi/business/event/record/exception-handling',
    method: 'post',
    data,
  });
};

// 时间分段数量（大屏）
export const getTimeSegmentNumber = (data: any) => {
  return Axios({
    url: '/businessApi/business/event/record/get-groud-nums',
    method: 'post',
    data,
  });
};

// 获取客户id
export const getCustomerId = () => {
  return Axios({
    url: '/businessApi/business/event/record/get-customerId',
    method: 'post',
  });
};

// 监测预警设备现状(大屏)
export const getDeviceStatus = (data: any) => {
  return Axios({
    url: '/businessApi/business/event/record/device-state',
    method: 'post',
    data,
  });
};

// 监测预警设备现状（大屏）带查询
export const getDeviceStatusWithSearch = (data: any, type: string = 'all') => {
  return Axios({
    url: `/businessApi/business/event/record/device-state/${type}`,
    method: 'post',
    data,
  });
};

// 系统运行趋势（大屏）
export const getSystemOperationTrend = (data: any) => {
  return Axios({
    url: '/businessApi/business/statistics/system-operating-trend',
    method: 'post',
    data,
  });
};

// 事件数量趋势（大屏）
export const getEventNumberTrend = (data: any) => {
  return Axios({
    url: '/businessApi/business/statistics/event-number-trend',
    method: 'post',
    data,
  });
};

// 设置消息通知已读
export const setMessageRead = (data: any) => {
  return Axios({
    url: `/messageCenter/messageApi/message/alarm/officialAccountCallBack`,
    method: 'POST',
    data,
  }).then((res: any) => res.data);
};

// 获取萤石云视频链接
export const getVideoUrl = (data: any) => {
  return Axios({
    url: '/businessApi/business/event/record/get-video-url',
    method: 'post',
    data,
  });
};

// 获取萤石云token
export const fetchVideoToken = () => {
  return Axios({
    url: `/businessApi/business/event/ezopen/token`,
    method: 'POST',
  });
};

// 根据设备id获取设备信息
export const getDeviceInfo = (data: any) => {
  return Axios({
    url: `/businessApi/business/event/record/get/device/info?deviceId=${data.deviceId}`,
    method: 'post',
  });
};

// 异常情况处理数据下钻
export const getExceptionHandlingDetail = (data: string[], type: 1 | 2 | 3) => {
  return Axios({
    url: `/businessApi/business/event/record/exception-handling/${type}`,
    method: 'post',
    data,
  });
};

// 异常情况响应率数据下钻
export const getExceptionHandlingResponseRateDetail = (
  data: string[],
  key?: any
) => {
  return Axios({
    url: `/businessApi/business/event/record/exception-handling/type`,
    method: 'post',
    data,
  });
};

// 根据事件类型下钻
export const getEventTypeDetail = (data: string[]) => {
  return Axios({
    url: `/businessApi/business/event/record/getListByIds`,
    method: 'post',
    data,
  });
};

// 设备列表数据下钻
export const getDeviceListDetail = (data: string[]) => {
  return Axios({
    url: `/businessApi/business/event/record/getDeviceList`,
    method: 'post',
    data,
  });
};
