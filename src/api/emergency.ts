import Axios from '@/api/interceptor';

// -------------------------------------  应急专家  ---------------------------------
// 获取专家列表
export interface GetExportListPageData {
  tenantId: string;
  name?: string;
  expertise?: string;
  education?: string;
  major?: string;
  pageNo?: number;
  pageSize?: number;
}

export function getExportListPageAPI(data: GetExportListPageData) {
  return Axios({
    url: '/businessApi/business/expert/get-page',
    method: 'post',
    data,
  });
}

// 新增专家
export interface AddExportItemData {
  tenantId: string;
  name: string;
  telphone: string;
  expertise: string;
  education?: string;
  major?: string;
  remark?: string;
}

export function addExportItemAPI(data: AddExportItemData) {
  return Axios({
    url: '/businessApi/business/expert/creat',
    method: 'post',
    data,
  });
}

// 获取专家详情
export function detailExportItemAPI(params: { id: string; tenantId: string }) {
  return Axios({
    url: '/businessApi/business/expert/detail',
    method: 'post',
    params,
  });
}

// 编辑专家
export function updateExportItemAPI(data: AddExportItemData) {
  return Axios({
    url: '/businessApi/business/expert/update',
    method: 'post',
    data,
  });
}

// 删除专家
export function deleteExportItemAPI(id: string) {
  return Axios({
    url: '/businessApi/business/expert/delete/' + id,
    method: 'post',
  });
}

// -------------------------------------  应急物资  ---------------------------------
// 获取物资列表
export interface GetMaterialListPageData {
  tenantId: string;
  suppliesCode?: string;
  emergencySuppliesName?: string;
  pageNo?: number;
  pageSize?: number;
}

export function getMaterialListPageAPI(data: GetMaterialListPageData) {
  return Axios({
    url: '/businessApi/business/supplies/get-page',
    method: 'post',
    data,
  });
}

// 新增物资
export interface AddMaterialItemData {
  tenantId: string;
  id?: string;
  emergencySuppliesName: string;
  suppliesCode: string;
  suppliesCodeName: string;
  number: number;
  lnglat?: string;
  place?: string;
  mainUser?: string;
  mainUserPhone?: string;
  viceUser?: string;
  viceUserPhone?: string;
  remarks?: string;
}

export function addMaterialItemAPI(data: AddMaterialItemData) {
  return Axios({
    url: '/businessApi/business/supplies/creat',
    method: 'post',
    data,
  });
}

// 获取物资详情
export function detailMaterialItemAPI(params: {
  id: string;
  tenantId: string;
}) {
  return Axios({
    url: '/businessApi/business/supplies/detail',
    method: 'post',
    params,
  });
}

// 编辑物资
export function updateMaterialItemAPI(data: AddMaterialItemData) {
  return Axios({
    url: '/businessApi/business/supplies/update',
    method: 'post',
    data,
  });
}

// 删除物资
export function deleteMaterialItemAPI(id: string) {
  return Axios({
    url: '/businessApi/business/supplies/delete/' + id,
    method: 'post',
  });
}

// ------------------------------ 应急物资：检查记录 --------------------------
// 新增物资检查记录？
export interface AddMaterialCheckData {
  tenantId: string;
  emergencySuppliesName: string;
  suppliesTypeName: string;
  number: number;
  lnglat?: string;
  place?: string;
  mainUser?: string;
  mainUserPhone?: string;
  viceUser?: string;
  viceUserPhone?: string;
  remarks?: string;
}

export function addMaterialCheckAPI(data: AddMaterialCheckData) {
  return Axios({
    url: '/businessApi/business/supplies/creat',
    method: 'post',
    data,
  });
}

// 物资检查记录列表
export function getMaterialCheckRecordAPI(id: string) {
  return Axios({
    url: '/businessApi/business/supplies/inspect-list/' + id,
    method: 'post',
  });
}

// ----------------------------- 应急队伍 ----------------------
// 获取队伍列表
export interface GetTroopsListPageData {
  tenantId: string;
  teamTypeName?: string;
  teamType?: string;
  teamName?: string;
  pageNo?: number;
  pageSize?: number;
}

export function getTroopsListPageAPI(data: GetTroopsListPageData) {
  return Axios({
    url: '/businessApi/business/team/get-page',
    method: 'post',
    data,
  });
}

// 新增队伍
export interface AddTroopsItemData {
  tenantId: string;
  teamType: string;
  teamName: string;
  id?: string;
  teamLeaderId: string;
  teamLeaderName?: string;
  teamLeaderTel: string;
  divisionLeaderId?: string;
  divisionLeaderName?: string;
  divisionLeaderTel?: string;
  agreement?: string;
  agreementList: any[];
  mainUserPhone?: string;
  viceUser?: string;
  viceUserPhone?: string;
  remarks?: string;
  teamEmployeeIds: string;
  teamEmployees: any[];
}

export function addTroopsItemAPI(data: AddTroopsItemData) {
  return Axios({
    url: '/businessApi/business/team/creat',
    method: 'post',
    data,
  });
}

// 获取队伍详情
export function detailTroopsItemAPI(params: { id: string; tenantId: string }) {
  return Axios({
    url: '/businessApi/business/team/detail',
    method: 'post',
    params,
  });
}

// 编辑队伍
export function updateTroopsItemAPI(data: AddTroopsItemData) {
  return Axios({
    url: '/businessApi/business/team/update',
    method: 'post',
    data,
  });
}

// 删除队伍
export function deleteTroopsItemAPI(id: string) {
  return Axios({
    url: '/businessApi/business/team/delete/' + id,
    method: 'post',
  });
}

// -------------------------- 应急预案 -----------------
// 获取应急预案列表
export interface GetPlanBListPageData {
  tenantId: string;
  emergencyType?: string;
  pageNo?: number;
  pageSize?: number;
}

export function getPlanBListPageAPI(data: GetPlanBListPageData) {
  return Axios({
    url: '/businessApi/business/emanagement/get-page',
    method: 'post',
    data,
  });
}

// 新增应急预案
export interface AddPlanBItemData {
  tenantId: string;
  emergencyPlanName: string;
  emergencyType: string;
  id?: string;
  recorded?: number;
  eventTypeId: any; // 页面使用数组  api使用string
  agreement?: string;
  agreementList: any[];
  commander: string;
  commanderTel: string;
  associateConductor: string;
  otherMembers: string;
  participateUnits?: string;
  measures?: string;
  suppliesIds: any; // 页面使用数组  api使用string
  teamIds: any; // 页面使用数组  api使用string
  expertIds: any; // 页面使用数组  api使用string
  recordedDept?: string;
  recordedNumber?: string;
}

export function addPlanBItemAPI(data: AddPlanBItemData) {
  return Axios({
    url: '/businessApi/business/emanagement/creat',
    method: 'post',
    data,
  });
}

// 获取应急预案详情
export function detailPlanBItemAPI(params: {
  id: string;
  tenantId?: string;
  flag?: number;
}) {
  return Axios({
    url: '/businessApi/business/emanagement/detail',
    method: 'post',
    params,
  });
}

// 编辑应急预案
export function updatePlanBItemAPI(data: AddPlanBItemData) {
  return Axios({
    url: '/businessApi/business/emanagement/update',
    method: 'post',
    data,
  });
}

// 删除应急预案
export function deletePlanBItemAPI(id: string) {
  return Axios({
    url: '/businessApi/business/emanagement/delete/' + id,
    method: 'post',
  });
}

// ---------------------- 应急演练：演练计划 ------------------
// 获取应急演练计划列表
export interface GetExercisePlanListPageData {
  tenantId: string;
  planType?: string;
  planTitle?: string;
  pageNo?: number;
  pageSize?: number;
}

export function getExercisePlanListPageAPI(data: GetExercisePlanListPageData) {
  return Axios({
    url: '/businessApi/business/drill-plan/get-page',
    method: 'post',
    data,
  });
}

// 新增应急演练计划
export interface AddExercisePlanItemData {
  tenantId: string;
  planTitle: string;
  planObject: string;
  id?: string;
  planTime: string;
  planType: string;
  planProject?: string;
  planMode?: string;
  agreement?: string;
  agreementList: any[];

  planPerson?: string;
  principalDeptId: string;
  principalUserId: string;
  remark?: string;
}

export function addExercisePlanItemAPI(data: AddExercisePlanItemData) {
  return Axios({
    url: '/businessApi/business/drill-plan/creat',
    method: 'post',
    data,
  });
}

// 获取应急演练计划详情
export function detailExercisePlanItemAPI(params: {
  id: string;
  tenantId: string;
}) {
  return Axios({
    url: '/businessApi/business/drill-plan/detail',
    method: 'post',
    params,
  });
}

// 编辑应急演练计划
export function updateExercisePlanItemAPI(data: AddExercisePlanItemData) {
  return Axios({
    url: '/businessApi/business/drill-plan/update',
    method: 'post',
    data,
  });
}

// 删除应急演练计划
export function deleteExercisePlanItemAPI(id: string) {
  return Axios({
    url: '/businessApi/business/drill-plan/delete/' + id,
    method: 'post',
  });
}

// -------------------------- 应急演练：演练记录 -------------------------------
// 获取演练记录
export function getExerciseRecordListAPI(data: { drillplanId: string }) {
  return Axios({
    url: '/businessApi/business/drill-record/get-page',
    method: 'post',
    data,
  });
}

// 新增演练记录
export interface AddExerciseRecordItemData {
  tenantId: string;
  planTitle?: string;
  drillplanId: string;
  id?: string;
  managementId?: string;
  participant: string;
  drillTime?: string;
  drillContent?: string;
  drillSite?: string;
  drillPic?: string;
  drillPicList: any[]; // 演练图片地址
  drillAssess?: string;
  drillAssessList: any[]; // 演练评估文件地址
  agreement?: string;
  agreementList: any[]; // 附件地址
}

export function addExerciseRecordItemAPI(data: AddExerciseRecordItemData) {
  return Axios({
    url: '/businessApi/business/drill-record/creat',
    method: 'post',
    data,
  });
}

// 获取演练记录详情
export function detailExerciseRecordItemAPI(data: { drillplanId: string }) {
  return Axios({
    url: '/businessApi/business/drill-record/detail',
    method: 'post',
    data,
  });
}

// 编辑演练记录
export function updateExerciseRecordItemAPI(data: AddExerciseRecordItemData) {
  return Axios({
    url: '/businessApi/business/drill-record/update',
    method: 'post',
    data,
  });
}
