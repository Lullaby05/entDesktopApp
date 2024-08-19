import Axios from '@/api/interceptor';

// 最近三条消息中心的数据
export const messageLeastList = (params: any) => {
  return Axios({
    url: `/businessApi/business/wx/index/message-list`,
    method: 'POST',
    params,
  });
};

// 消息中心字典
export const messageCenterEnum = () => {
  return Axios({
    url: `/businessApi/business/message-notif/center/dict`,
    method: 'POST',
  });
};

// 获取消息中心列表
export const messageCenterListApi = () => {
  return Axios({
    url: `/businessApi/business/message-notif/center/get-statistics`,
    method: 'POST',
  });
};

// 获取消息中心每个不同类型的列表
export const messageCenterTypeList = (noticeType: string) => {
  return Axios({
    url: `/businessApi/business/message-notif/center/get-list/${noticeType}`,
    method: 'POST',
  });
};

export const getMessageLogList = (data: any) => {
  return Axios({
    url: '/messageCenter/messageApi/message/notice-logs/page',
    method: 'post',
    data,
  });
};

// 创建默认配置
export const createDefaultConfig = (data: any) => {
  return Axios({
    url: `/messageCenter/messageApi/message/notice-rule/createNoticeRuleAndDesc`,
    method: 'POST',
    data,
  });
};

// 获取默认配置
export const getDefaultConfig = () => {
  return Axios({
    url: `/messageCenter/messageApi/message/notice-rule/getDefaultNoticeRuleDesc`,
    method: 'POST',
  });
};

// 根据id获取配置
export const getConfigById = (data: any) => {
  return Axios({
    url: `/messageCenter/messageApi/message/notice-rule/getNoticeRuleDesc`,
    method: 'POST',
    data,
  });
};

// 获取通知方式字典
export const getNoticeTypeDict = () => {
  return Axios({
    url: `/messageCenter/messageApi/message/notice-template/list`,
    method: 'POST',
  });
};

// 更新消息策略
export const updateConfig = (data: any) => {
  return Axios({
    url: `/messageCenter/messageApi/message/notice-rule/updateNoticeRuleAndDesc`,
    method: 'POST',
    data,
  });
};
