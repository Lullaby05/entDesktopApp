// 安全措施接口
import Axios from '@/api/interceptor';

interface pageType {
  pageNo: number;
  pageSize: number;
}

interface safetyMesureListType extends pageType {
  operationType?: string;
  securityMeasure?: string;
}
// 作业安全措施列表
export const getSafetyMeasureList = (data: safetyMesureListType) => {
  return Axios({
    url: '/businessApi/business/work-security-measure/get-page',
    method: 'post',
    data,
  });
};
export const getSafetyMeasurePublicList = (data: safetyMesureListType) => {
  return Axios({
    url: '/businessApi/business/work-security-measure/public-list',
    method: 'post',
    data,
  });
};
interface safetyMeasureType {
  id?: string;
  operationType?: string;
  securityMeasure?: string;
}
// 作业安全措施新增
export const safetyMeasureAdd = (data: safetyMeasureType) => {
  return Axios({
    url: '/businessApi/business/work-security-measure/creat',
    method: 'post',
    data,
  });
};
// 作业安全措施批量新增
export const safetyMeasureAddBatch = (data: safetyMeasureType[]) => {
  return Axios({
    url: '/businessApi/business/work-security-measure/batch-create',
    method: 'post',
    data,
  });
};
// 作业安全措施编辑
export const safetyMeasureEdit = (data: safetyMeasureType) => {
  return Axios({
    url: '/businessApi/business/work-security-measure/update',
    method: 'post',
    data,
  });
};
// 作业安全措施删除
export const safetyMeasureDel = (id: string) => {
  return Axios({
    url: '/businessApi/business/work-security-measure/delete/' + id,
    method: 'post',
  });
};

// 获取作业安全措施（简单），用于新增作业的时候显示安全措施
export const getSafetyMeasureSmiple = (operationType: string) => {
  return Axios({
    url:
      '/businessApi/business/work-security-measure/get-list-simple?operationType=' +
      operationType,
    method: 'post',
  });
};
