// 安全措施接口
import Axios from '@/api/interceptor';

interface pageType {
  pageNo: number;
  pageSize: number;
}

interface safetyMesureListType extends pageType {
  certificateId?: string;
  applyCompany?: string;
  workManager?: string;
  wordCompany?: string;
  certificateStatusCode?: string;
}

// 安全作业证列表
export const getCertificateList = (
  operationType: string,
  data: safetyMesureListType
) => {
  return Axios({
    url: `/businessApi/business/operation/get-page/${operationType}`,
    method: 'post',
    data,
  });
};

// 动火安全作业证列表
export const getfireCertificateList = (data: safetyMesureListType) => {
  return Axios({
    url: '/businessApi/business/fireWorkCertificate/table/page',
    method: 'post',
    data,
  });
};

// 获取作业证状态枚举
export const getOperationTypeEnum = (certType: string) => {
  return Axios({
    url: '/businessApi/business/operation/get-status-enum?certType=' + certType,
    method: 'post',
  });
};

// 获取作业证必须有的流程节点
export const getProcessKeyEnum = (certType: string) => {
  return Axios({
    url:
      '/businessApi/business/operation/get-process-enum?certType=' + certType,
    method: 'post',
  });
};

// 作业证新增
export const addCertificate = (certType: string, defId: string, data: any) => {
  return Axios({
    url: `/businessApi/business/operation/create/${certType}/${defId}`,
    method: 'post',
    data,
  });
};

// 获取最新的作业证编号
export const getNewCertificateCode = (certType: string) => {
  return Axios({
    url: `/businessApi/business/operation/gain-cert-num?certType=${certType}`,
    method: 'post',
  });
};

// 获取表单模型
export const getFormModel = (certType: string) => {
  return Axios({
    url: `/businessApi/business/operation/get-form-model/${certType}`,
    method: 'post',
  });
};

// 获取作业单位下拉列表
export const getWorkUnitList = (certType: string) => {
  return Axios({
    url: `/businessApi/business/operation/get-operationDept-list/${certType}`,
    method: 'post',
  });
};

// 获取所有部门的下拉
export function getDeptsList() {
  return Axios({
    url: '/businessApi/business/workflow/dept-list',
    method: 'post',
  });
}

/**
 *
 * @param id 作业证id
 * @param userId 用户id
 * @param data operationType = revocation-撤回 | cancel-取消 | close-关闭 | pause-暂停 | recover-恢复
 * @returns
 */
export const experimentalOperation = (data: any) => {
  return Axios({
    url: `/businessApi/business/operation/operation-special`,
    method: 'post',
    data,
  });
};

// 正常流转，审核通过或审核不通过
export const normalOperation = (id: string, data: any) => {
  return Axios({
    url: `/businessApi/business/operation/operation/${id}`,
    method: 'post',
    data,
  });
};

// 获取作业详情
export const getCertificateDetail = (id: string) => {
  return Axios({
    url: `/businessApi/business/operation/detail/${id}`,
    method: 'post',
  });
};

// 动火级别下拉
export const getFireWorkLevelEnum = () => {
  return Axios({
    url: '/businessApi/business/fireWorkCertificate/get-fire-work-level-enum',
    method: 'post',
  });
};

// 获取作业证打印
export const getCertificatePrint = (id: string) => {
  return Axios({
    url: `/businessApi/business/operation/customPrint/${id}`,
    method: 'post',
  });
};
