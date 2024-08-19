import Axios from '@/api/interceptor';

interface pageType {
  pageNo: number;
  pageSize: number;
}

// --隐患管理--
// 随手拍、隐患管理列表类型
interface snapshotType extends pageType {
  dangerLevelCode?: String;
  dangerStateCode?: String;
  hazardAddr?: String;
  hazardDesc?: String;
  inspectEndDate?: String;
  inspectStartDate?: String;
  inspectorName?: String;
}
// 随手拍列表
export const getSnapshotList = (data: snapshotType) => {
  return Axios({
    url: '/businessApi/business/snap/shot/page',
    method: 'post',
    data,
  });
};
// 随手拍详情
export const getSnapshotDetail = (id: string) => {
  return Axios({
    url: '/businessApi/business/snap/shot/detail?id=' + id,
    method: 'post',
  });
};

// --日常排查任务--
// 日常排查任务类型
interface dailyCheckType extends pageType {
  checkCycleCode?: string;
  checkPerson?: string;
  endTime?: string;
  endTwoTime?: string;
  planName?: string;
  startTime?: string;
  startTwoTime?: string;
  taskName?: string;
}
// 日常排查任务列表
export const getDailyCheckList = (data: dailyCheckType) => {
  return Axios({
    url: '/businessApi/business/check/task/page',
    method: 'post',
    data,
  });
};
/**
 * 日常排查任务顶部数量统计
 * @param id 这里的id在详情中使用的时候传详情id，否则传null
 * @returns
 */
export const getDailyCheckListCount = () => {
  return Axios({
    url: `/businessApi/business/check/task/count`,
    method: 'post',
  });
};
// 日常排查任务详情
export const getDailyCheckDetail = (id: string) => {
  return Axios({
    url: `/businessApi/business/check/task/detail?id=${id}`,
    method: 'post',
  });
};

// 获取员工签名
export const getUserSign = () => {
  return Axios({
    url: '/businessApi/business/employee/user/sign',
    method: 'post',
  });
};
// 更新员工签名
export const updateEmployeeSignature = (data: any) => {
  return Axios({
    url: '/businessApi/business/employee/update-user-sign',
    method: 'post',
    data,
  });
};

//   执行排查任务类型
interface dailyCheckExecuteType {
  checkContentId?: number;
  formItems?: string;
  isQualified?: boolean;
  taskId?: number;
  taskName?: string;
}
//   执行排查任务
export const dailyCheckExecute = (data: dailyCheckExecuteType) => {
  return Axios({
    url: '/businessApi/business/check/task/execute',
    method: 'post',
    data,
  });
};

// --排查内容管理--
// 排查内容列表字段类型
interface checkContentListType extends pageType {
  checkItem?: string;
  checkStandard?: string;
  problemSpot?: string;
}
interface checkContentType {
  id?: string;
  checkItem?: string;
  checkStandard?: string;
  formItems?: string;
  isDangerControl?: boolean;
  problemSpot?: string;
}
// 排查内容列表
export const getCheckContentList = (data: checkContentListType) => {
  return Axios({
    url: '/businessApi/business/check/content/page',
    method: 'post',
    data,
  });
};
// 排查内容新增
export const checkContentAdd = (data: checkContentType) => {
  return Axios({
    url: '/businessApi/business/check/content/create',
    method: 'post',
    data,
  });
};
// 排查内容导出
export const checkContentExport = (data?: checkContentListType) => {
  return Axios({
    url: '/businessApi/business/check/content/export',
    method: 'post',
    responseType: 'blob',
  });
};
// 排查内容导入校验
export const checkContentImportCheck = (data: any) => {
  return Axios({
    url: '/businessApi/business/check/content/upload-preview',
    method: 'post',
    data,
  });
};
// 排查内容批量导入
export const checkContentImport = (data: any) => {
  return Axios({
    url: '/businessApi/business/check/content/create/batch',
    method: 'post',
    data,
  });
};
// 排查内容删除
export const checkContentDel = (id: string) => {
  return Axios({
    url: '/businessApi/business/check/content/delete?id=' + id,
    method: 'post',
  });
};
// 排查内容编辑
export const checkContentEdit = (data: checkContentType) => {
  return Axios({
    url: '/businessApi/business/check/content/update',
    method: 'post',
    data,
  });
};
// 排查内容详情
export const getCheckContentDetail = (id: string) => {
  return Axios({
    url: '/businessApi/business/check/content/detail?id=' + id,
    method: 'post',
  });
};

// --排查表--
// 排查列表查询数据类型
interface checkListType extends pageType {
  checkName?: string;
  id?: string;
  status?: 0 | 1;
}
// 排查表列表
export const getCheckList = (data: checkListType) => {
  return Axios({
    url: '/businessApi/business/check/table/page',
    method: 'post',
    data,
  });
};
interface checkListDataType {
  checkContentIds?: string[];
  checkName?: string;
  id?: string;
  status?: 0 | 1;
}
// 排查表新增
export const checkListAdd = (data: checkListDataType) => {
  return Axios({
    url: '/businessApi/business/check/table/create',
    method: 'post',
    data,
  });
};
// 排查表删除
export const checkListDel = (id: string) => {
  return Axios({
    url: '/businessApi/business/check/table/delete?id=' + id,
    method: 'post',
  });
};
// 排查表编辑
export const checkListEdit = (data: checkListDataType) => {
  return Axios({
    url: '/businessApi/business/check/table/update',
    method: 'post',
    data,
  });
};
// 排查表详情
export const getCheckListDetail = (id: string) => {
  return Axios({
    url: '/businessApi/business/check/table/detail?id=' + id,
    method: 'post',
  });
};
// 排查表内容及表单
export const getCheckListContent = (checkContentIds: string[]) => {
  return Axios({
    url:
      '/businessApi/business/check/table/content?checkContentIds=' +
      checkContentIds,
    method: 'post',
  });
};

//  --排查计划管理--
interface checkPlanListType extends pageType {
  checkCycleCode?: string;
  checkPerson?: string;
  checkPlanStateCode?: string;
  checkTypeCode?: string;
  organizeLevelCode?: string;
  planName?: string;
}
// 排查计划管理列表
export const getCheckPlanList = (data: checkPlanListType) => {
  return Axios({
    url: '/businessApi/business/check/plan/page',
    method: 'post',
    data,
  });
};
// 排查计划管理tab
export const getCheckPlanTabList = () => {
  return Axios({
    url: '/businessApi/business/check/plan/count',
    method: 'post',
  });
};
// 排查计划是否可以编辑
export const checkPlanEditStatus = (id: string) => {
  return Axios({
    url: `/businessApi/business/check/plan/getExecuteStatus/${id}`,
    method: 'post',
  });
};
export interface checkPlanDataType {
  checkAddr?: string;
  checkCycleCode?: string;
  checkEndTime?: string;
  checkPerson?: string;
  checkPersonId?: string;
  checkPersonIds?: string[];
  checkTableDatas?: any[];
  checkStartTime?: string;
  checkTableIds?: string[];
  checkTypeCode?: string;
  customCycleCode?: string;
  customNum?: number;
  customTime?: number;
  organizeLevelCode?: string;
  planName?: string;
  deptId?: string;
  mode?: number;
  status?: 0 | 1;
  holidayType?: string[];
}
// 排查计划新增
export const checkPlanAdd = (data: checkPlanDataType) => {
  return Axios({
    url: '/businessApi/business/check/plan/create',
    method: 'post',
    data,
  });
};
// 排查计划编辑
export const checkPlanEdit = (id: string, data: checkPlanDataType) => {
  return Axios({
    url: `/businessApi/business/check/plan/update/${id}`,
    method: 'post',
    data,
  });
};
// 排查计划详情中的表单详情
export const checkPlanDetailForm = (taskType: string, ids: string[]) => {
  return Axios({
    url: `/businessApi/business/check/plan/info?taskType=${taskType}&ids=${ids}`,
    method: 'post',
  });
};
// 排查计划详情中的表单详情
export const checkPlanDetailForms = (id: string) => {
  return Axios({
    url: `/businessApi/business/check/plan/infos?id=${id}`,
    method: 'post',
  });
};
// 排查计划详情
export const getCheckPlanDetail = (id: string, code?: string) => {
  return Axios({
    url: `/businessApi/business/check/plan/detail?${id ? 'id=' + id : ''}${
      code ? '&code=' + code : ''
    }`,
    method: 'post',
  });
};
// 排查计划启用
export const checkPlanStart = (id: string) => {
  return Axios({
    url: `/businessApi/business/check/plan/plan_activation/${id}`,
    method: 'post',
  });
};
// 排查计划停用
export const checkPlanStop = (id: string) => {
  return Axios({
    url: `/businessApi/business/check/plan/plan_deactivation/${id}`,
    method: 'post',
  });
};
// 排查计划编辑详情
export const checkPlanEditDetail = (planId: string) => {
  return Axios({
    url: `/businessApi/business/check/content/getByPlanId?planId=${planId}`,
    method: 'post',
  });
};
// 获取排查计划人员
export const getCheckPlanPerson = (planId: string) => {
  return Axios({
    url: `/businessApi/business/employee/getEmployeeDescByPlanId?planId=${planId}`,
    method: 'post',
  });
};
// 查询计划下的排查表
export const getCheckTableByPlanId = (planId: string) => {
  return Axios({
    url: `/businessApi/business/check/table/getByPlanId?planId=${planId}`,
    method: 'post',
  });
};
// 查询计划下的每个人的任务执行情况
export const getCheckTaskByPlanId = (planId: string) => {
  return Axios({
    url: `/businessApi/business/check/plan/getCheckPlanCount/${planId}`,
    method: 'post',
  });
};

// --计划排查任务--
// 计划排查任务类型
interface planTaskListType extends pageType {
  checkCycleCode?: string;
  checkPerson?: string;
  endTime?: string;
  endTwoTime?: string;
  planName?: string;
  startTime?: string;
  startTwoTime?: string;
  taskName?: string;
}
// 计划排查任务列表
export const getPlanTaskList = (data: planTaskListType) => {
  return Axios({
    url: '/businessApi/business/check/task/page',
    method: 'post',
    data,
  });
};
// 计划排查任务详情
export const getPlanTaskDetail = (id: string) => {
  return Axios({
    url: `/businessApi/business/check/task/detail?id=${id}`,
    method: 'post',
  });
};
// 计划排查任务数据类型
interface planCheckDataType {
  checkContentId?: number;
  formItems?: string;
  isQualified?: boolean;
  taskId?: number;
  taskName?: string;
}
// 计划排查任务执行
export const planTaskExecute = (data: planCheckDataType) => {
  return Axios({
    url: '/businessApi/business/check/task/execute',
    method: 'post',
    data,
  });
};
// 计划排查任务顶部栏统计
export const getPlanTaskTabs = (id: string) => {
  return Axios({
    url: `/businessApi/business/check/task/count?id=${id}`,
    method: 'post',
  });
};

// --隐患管理--
// 隐患管理列表查询
export const getPitfallList = (data: snapshotType) => {
  return Axios({
    url: '/businessApi/business/process/record/page',
    method: 'post',
    data,
  });
};
// 隐患管理顶部栏
export const getPitfallTabs = (code?: string) => {
  const params = code ? `?code=${code}` : '';
  return Axios({
    url: '/businessApi/business/process/record/count' + params,
    method: 'post',
  });
};
interface pitfallAddType {
  checkAcceptId?: number;
  checkAcceptImages?: string[];
  checkAcceptName?: string;
  checkAcceptResult?: number;
  checkAcceptSignature?: string;
  checkAcceptTime?: string;
  dangerLevelCode?: string;
  dangerSourceCode?: string;
  dangerStateCode?: string;
  isForward?: number;
  isHiddenDanger?: true;
  rectifyDepartId?: number;
  rectifyDepartName?: string;
  rectifyId?: number;
  rectifyImages?: string[];
  rectifyMeasures?: string;
  rectifyName?: string;
  rectifySituation?: string;
  rectifyTime?: string;
  remark?: string;
  taskId?: number;
  acceptorId?: string;
  acceptorRemark?: string;
  acceptorName?: string;
  id?: string;
}
// 隐患管理新增
export const pitfallAdd = (data: pitfallAddType[]) => {
  return Axios({
    url: '/businessApi/business/process/record/create',
    method: 'post',
    data,
  });
};
// 隐患新增
export const pitfallAddOne = (data: any[]) => {
  return Axios({
    url: '/businessApi/business/process/record/create/v2',
    method: 'post',
    data,
  });
};
// 隐患管理详情
export const getPitfallDetail = (id: string) => {
  return Axios({
    url: `/businessApi/business/process/record/info?id=${id}`,
    method: 'post',
  });
};
// 隐患管理编辑
export const pitfallEdit = (data: pitfallAddType) => {
  return Axios({
    url: '/businessApi/business/process/record/edit',
    method: 'post',
    data,
  });
};
// 隐患管理执行
export const pitfallExecute = (data: pitfallAddType) => {
  return Axios({
    url: '/businessApi/business/process/record/execute',
    method: 'post',
    data,
  });
};
// 隐患整改信息上报
export const pitfallReport = (data: any) => {
  return Axios({
    url: '/businessApi/business/process/record/report',
    method: 'post',
    data,
  });
};
// 隐患详情进程信息获取
export const getPitfallProcess = (id: string) => {
  return Axios({
    url: `/businessApi/business/process/record/course?id=${id}`,
    method: 'post',
  });
};

// 隐患处理权限配置列表
export const getPitfallConfigList = () => {
  return Axios({
    url: `/businessApi/business/person/role/get-list`,
    method: 'post',
  });
};

// 隐患处理权限配置保存
export const pitfallConfigSave = (data: any) => {
  return Axios({
    url: `/businessApi/business/person/role/save`,
    method: 'post',
    data,
  });
};

// 获取登陆人隐患处理权限
export const getPitfallConfigByUser = () => {
  return Axios({
    url: `/businessApi/business/person/role/get-perm-by-user`,
    method: 'post',
  });
};

// 获取登陆人及ID隐患处理权限
export const getPitfallConfigById = (id: string) => {
  return Axios({
    url: `/businessApi/business/person/role/get-perm-by-user/${id}`,
    method: 'post',
  });
};
