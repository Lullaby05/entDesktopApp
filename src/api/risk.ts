import Axios from '@/api/interceptor';

// -------------------------------------  事故类型  ---------------------------------
// 获取事故类型列表
export interface GetAccidentTypeListBody {
  accTypeName?: string;
  accTypeCode?: string;
  pageNo?: number;
  pageSize?: number;
}

export function getAccidentTypeListAPI(data: GetAccidentTypeListBody) {
  return Axios({
    url: '/businessApi/business/accident/type/page',
    method: 'post',
    data,
  });
}

// 获取行业共有事故类型列表
export function getPublicAccidentTypeListAPI(data: GetAccidentTypeListBody) {
  return Axios({
    url: '/businessApi/business/accident/type/pub-page',
    method: 'post',
    data,
  });
}

// 获取行业共有事故类型列表(筛选已选择的)
export function getPublicAccidentTypeListFilterAPI(
  data: GetAccidentTypeListBody
) {
  return Axios({
    url: '/businessApi/business/accident/type/pub-page-v2',
    method: 'post',
    data,
  });
}

// 获取行业共有事故类型列表(筛选已选择的)
export function getPublicAccidentTypeListFilterAllAPI() {
  return Axios({
    url: '/businessApi/business/accident/type/pub-list',
    method: 'post',
  });
}

// 批量新增事故类型
export function batchCreateAccidentType(data: any[]) {
  return Axios({
    url: '/businessApi/business/accident/type/creates',
    method: 'post',
    data,
  });
}

// 获取事故类型详情
export function detailAccidentTypeAPI(params: { id: string }) {
  return Axios({
    url: '/businessApi/business/accident/type/detail',
    method: 'get',
    params,
  });
}

// 新增事故类型
export interface AccidentTypeBody {
  id?: string;
  tenantId: string;
  accTypeCode: string;
  accTypeName: string;
  disposalMeth: string;
}

export function addAccidentTypeAPI(data: AccidentTypeBody) {
  return Axios({
    url: '/businessApi/business/accident/type/create',
    method: 'post',
    data,
  });
}

//  编辑事故类型
export function updateAccidentTypeAPI(data: AccidentTypeBody) {
  return Axios({
    url: '/businessApi/business/accident/type/update',
    method: 'post',
    data,
  });
}

//  删除事故类型
export function deleteAccidentTypeAPI(id: string) {
  return Axios({
    url: '/businessApi/business/accident/type/delete/' + id,
    method: 'delete',
  });
}

// --------------------------------------- 安全标志 -----------------------------------------
// 获取安全标志列表
export interface GetSafetySignsListBody {
  signName?: string;
  signTypeCode?: string;
  pageNo?: number;
  pageSize?: number;
}

export function getSafetySignsListAPI(data: GetSafetySignsListBody) {
  return Axios({
    url: '/businessApi/business/safety/sign/page',
    method: 'post',
    data,
  });
}

// 获取安全标志详情
export function detailSafetySignsAPI(params: { id: string }) {
  return Axios({
    url: '/businessApi/business/safety/sign/detail',
    method: 'get',
    params,
  });
}

// 新增安全标志
export interface SafetySignsBody {
  id?: string;
  tenantId: string;
  pictureName?: string;
  pictureUrl?: [];
  remark?: string;
  signName: string;
  signType?: string;
  signTypeCode: string;
}

export function addSafetySignsAPI(data: SafetySignsBody) {
  return Axios({
    url: '/businessApi/business/safety/sign/create',
    method: 'post',
    data,
  });
}

//  编辑安全标志
export function updateSafetySignsAPI(data: SafetySignsBody) {
  return Axios({
    url: '/businessApi/business/safety/sign/update',
    method: 'post',
    data,
  });
}

//  删除安全标志
export function deleteSafetySignsAPI(id: string) {
  return Axios({
    url: '/businessApi/business/safety/sign/delete/' + id,
    method: 'delete',
  });
}

// -------------------------------------- 设置风险评估方法 -----------------------------
export function setRiskAssessmentMethodAPI(data: {
  id: string;
  riskAssessCode: string;
  riskAssessType: string;
  tenantNo: string;
  enterpriseId: string;
}) {
  return Axios({
    url: '/businessApi/business/basic/config/save-update',
    method: 'post',
    data,
  });
}

// id:企业id（enterpriseId）
export function getRiskAssessmentMethodAPI(params: { id: string }) {
  return Axios({
    url: '/businessApi/business/basic/config/detail',
    method: 'post',
    params,
  });
}

// ------------------------------------- 风险单元 ------------------------------------
// 获取风险单元树
export function getRiskUnitTeeBodyAPI() {
  return Axios({
    url: '/businessApi/business/risk/unit/tree',
    method: 'get',
  });
}

// 新增风险单元
export interface RiskUnitBody {
  deptId?: string;
  deptName?: string;
  tenantId: string;
  parentId: string;
  riskUnitName: string;
  riskUnitDesc: string;
}

export function addRiskUnitAPI(data: RiskUnitBody) {
  return Axios({
    url: '/businessApi/business/risk/unit/create',
    method: 'post',
    data,
  });
}

// 获取风险单元详情
export function detailRiskUnitAPI(params: { id: string }) {
  return Axios({
    url: '/businessApi/business/risk/unit/detail',
    method: 'get',
    params,
  });
}

// 编辑风险单元
export function updateRiskUnitAPI(data: RiskUnitBody) {
  return Axios({
    url: '/businessApi/business/risk/unit/update',
    method: 'post',
    data,
  });
}

// 删除风险单元
export function deleteRiskUnitAPI(id: string) {
  return Axios({
    url: '/businessApi/business/risk/unit/delete/' + id,
    method: 'delete',
  });
}

// ----------------------------------- 风险点 ----------------------------------
export interface GetRiskPointBody {
  riskUnitId?: string;
  riskPointName?: string;
  riskPointAddr?: string;
  riskLevelCode?: string;
  dutyDeptId?: string;
  personName?: string;
  pageNo?: number;
  pageSize?: number;
}

// 获取风险点列表
export function getRiskPointAPI(data: GetRiskPointBody) {
  return Axios({
    url: '/businessApi/business/risk/point/page',
    method: 'post',
    data,
  });
}

// 新增风险点
export interface RiskPointBody {
  tenantId: string;
  riskUnitId: string;
  riskUnitName?: string;
  riskPointName: string;
  riskPointAddr: string;
  dutyDeptId: string;
  dutyDeptName?: string;
  personId?: string;
  personName?: string;
  contact?: string;
  remark?: string;
}

export function addRiskPointAPI(data: RiskPointBody) {
  return Axios({
    url: '/businessApi/business/risk/point/create',
    method: 'post',
    data,
  });
}

// 获取风险点详情
export function detailRiskPointAPI(params: { id: string }) {
  return Axios({
    url: '/businessApi/business/risk/point/detail',
    method: 'get',
    params,
  });
}

// 编辑风险点
export function updateRiskPointAPI(data: RiskPointBody) {
  return Axios({
    url: '/businessApi/business/risk/point/update',
    method: 'post',
    data,
  });
}

// 删除风险点
export function deleteRiskPointAPI(id: string) {
  return Axios({
    url: '/businessApi/business/risk/point/delete/' + id,
    method: 'delete',
  });
}

// -------------------------------------- 风险辨识与评价(危险源)---------------------------------
// 获取危险源列表
export interface GetDangerPointParams {
  riskUnitId?: string;
  riskPointId?: string;
  riskPointName?: string;
  riskLevelCode?: string;
  accTypeCode?: string;
  dangerName?: string;
  pageNo?: number;
  pageSize?: number;
}

export function getDangerPointAPI(data: GetDangerPointParams) {
  return Axios({
    url: '/businessApi/business/danger/factor/page',
    method: 'post',
    data,
  });
}

// 新增危险源

export interface DangerPointBody {
  id?: string;
  tenantId: string;
  dangerId?: string; // 危险源id
  riskPointId: string; // 风险点
  riskUnitId: string;
  riskPointName: string;
  dangerName: string; //危险源名称
  emgcySures: string[]; //事故类型
  safetySigns: {
    ids?: string[];
    names?: string;
    picPathList?: any[];
  };

  decisionMethod: string; // 设置方法
  factorInfoList: FactorInfo[];
}

export interface FactorInfo {
  id?: string;
  accTypeId?: string; // 事故类型的id
  accTypeCode?: string; //事故类型的code
  accTypeName?: string;
  factorTypeCode?: string; // 不安全因素大类 字典表拼接id
  factorType?: string;
  factorDescCode?: string; // 具体不安全因素描述拼接id
  factorDesc?: string;
  lsl?: string;
  lss?: string;
  lecl?: string;
  lece?: string;
  lecc?: string;
  mesm?: string;
  mese?: string;
  mess?: string;
  riskLevel?: string;
  controlMeasureCode?: string; // 管控措施拼接id
  controlMeasure?: string;
  emergMeasure?: string; // 应急处置措施
  riskLevelCode?: number;
}

export function addDangerPointAPI(data: DangerPointBody) {
  return Axios({
    url: '/businessApi/business/risk/identify/create',
    method: 'post',
    data,
  });
}

// 获取危险源详情
export function detailDangerPointAPI(params: { id: string }) {
  return Axios({
    url: '/businessApi/business/risk/identify/detail',
    method: 'get',
    params,
  });
}

// 编辑危险源
export function updateDangerPointAPI(data: DangerPointBody) {
  return Axios({
    url: '/businessApi/business/risk/identify/update',
    method: 'post',
    data,
  });
}

// 删除危险源
export function deleteDangerPointAPI(id: string) {
  return Axios({
    url: '/businessApi/business/risk/identify/delete/' + id,
    method: 'delete',
  });
}

// ------------------------------ 风险分级管控 --------------------------------------
// 获取风险点--管控列表
export interface GetRiskPointContaolBody {
  riskUnitId?: string;
  riskPointName?: string;
  riskPointAddr?: string;
  riskLevelCode?: string;
  controlLevelCode?: string; // 管控层级 待定
  dutyDeptId?: string;
  personName?: string;
  pageNo?: number;
  pageSize?: number;
}

export function getRiskPointControlAPI(data: GetRiskPointContaolBody) {
  return Axios({
    url: '/businessApi/business/risk/level/control/page',
    method: 'post',
    data,
  });
}

// 获取风险点--管控详情
export function detailRiskPointControlAPI(params: { id: string }) {
  return Axios({
    url: '/businessApi/business/risk/level/control/detail',
    method: 'get',
    params,
  });
}

// 编辑风险点--分级管控
export interface RiskPointControl {
  tenantId: string;
  id?: string; // ？
  riskPointId: string; // 风险点
  riskPointName?: string;
  riskUnitId: string;
  dutyDeptId: string; // 责任部门
  riskLevelCode: string; // 风险等级

  controlItemList: ControlItem[];
}

export interface ControlItem {
  id?: string; // 后端说这是危险源的主键id
  riskPointId?: string;
  riskPointName?: string;
  dangerFactorId?: string;
  dangerName?: string;
  accTypeId?: string; // 事故类型的id
  accTypeCode?: string; //事故类型的code
  accTypeName?: string;
  factorTypeCode?: string; // 不安全因素大类 code-时间戳
  factorType?: string;
  factorDescCode?: string; // 具体不安全因素描述 code-时间戳
  factorDesc?: string;
  riskLevel?: string; // 不通信
  riskLevelCode?: number;
  controlMeasureCode?: string; // 管控措施拼接id
  controlMeasure?: string;
  controlLevelId?: string; // 管控层级id  确定数据项唯一
  controlLevelCode?: string;
  controlGradeCode?: string;
  controlLevel?: string; // 不通信
  controlDeptId?: string; // 责任部门id
  controlCycleCode?: string; // 管控周期
  controlPersonId?: string;
  formItems?: string;
  planName?: string;
  flag?: boolean;
}

export function createRiskPointControlAPI(data: ControlItem[]) {
  return Axios({
    url: '/businessApi/business/risk/level/control/insert',
    method: 'post',
    data,
  });
}
export function updateRiskPointControlAPI(data: ControlItem[]) {
  return Axios({
    url: '/businessApi/business/risk/level/control/update',
    method: 'post',
    data,
  });
}

export function deleteRiskPointControlAPI(ids: string[]) {
  return Axios({
    url: '/businessApi/business/risk/level/control/delete?ids=' + ids,
    method: 'post',
  });
}

// 风险告知卡
export function riskPointCardAPI(id: string) {
  return Axios({
    url: '/businessApi/business/risk/level/control/risk-perception-card/' + id,
    method: 'post',
    responseType: 'blob',
  });
}

// 风险编辑和删除的时候获取影响的数据
export function getRiskInfluceCount(data: any) {
  return Axios({
    url: '/businessApi/business/risk/level/control/count',
    method: 'post',
    data,
  });
}
