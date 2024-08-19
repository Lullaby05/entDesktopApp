import Axios from '@/api/interceptor';

//  -------------------------------------------------------  基本信息 -----------------------------------------------------------

// 基本信息---获取企业树--废弃
export interface FindbusinessTree {
  companyName: string;
  id: number;
}

export function businessTreeAPI(params?: FindbusinessTree) {
  return Axios({
    url: '/businessApi/business/enterprise-info/tree',
    method: 'post',
    params,
  });
}

// 基本信息---获取企业详情  参数： userID : 用户id ，  parentId  上级企业id
export function companyDetailByUserIdAPI() {
  return Axios({
    url: '/businessApi/business/enterprise-info/detail-by-user',
    method: 'post',
  });
}

// 基本信息---获取企业详情  参数: id : 企业id, parentId : 上级企业id
export function companyDetailByIdAPI(id: string, parentId?: string) {
  return Axios({
    url: '/businessApi/business/enterprise-info/detail',
    method: 'post',
    params: {
      id,
      parentId,
    },
  });
}

// 基本信息 --- 修改企业基本信息
export interface UpdateCompanyDetailData {
  id: string;

  // 手机号码
  safeMainPerson?: string;
  contacts?: string;

  businessLicense?: string;
  emergency?: string;
  businessLicenseList: any[];
  emergencyList: any[];
  qualificationInfo?: string;
  qualificationInfoList?: any[];
  logo?: string;
  logoList: any[];
  contactsPosition?: string;
  contactsTel?: string;
  position?: string;
  safeMainPersonTel?: string;
  fax?: string;
  officialUrl?: string;

  planFlag?: number; // boolean
  threeSimultaneousFlag?: number; // boolean
  safetyProductionFlag?: number; // boolean
  safeRegulator?: string;
  safeRegulatorPerson?: string;
  safeRegulatorTel?: string;
  communityInspector?: string;
  communityInspectorTel?: string;

  latitude?: string;
  longitude?: string;
  parentId?: string;
}

export function updatCompanyDetailAPI(data: UpdateCompanyDetailData) {
  return Axios({
    url: '/businessApi/business/enterprise-info/update',
    method: 'post',
    data,
  });
}

// ------------------------------------------------------ 组织架构 ----------------------------------------------

// 组织架构 --- 获取组织架构树
export interface GetOrganizationTreeData {
  id?: string;
  enterpriseId: string;
  name?: string;
  type?: string;
}
export function getOrganizationTreeListAPI(params: GetOrganizationTreeData) {
  return Axios({
    url: '/businessApi/business/dept/tree-list',
    method: 'post',
    params,
  });
}

export function getOrganizationTreeAPI(params: GetOrganizationTreeData) {
  return Axios({
    url: '/businessApi/business/dept/tree',
    method: 'post',
    params,
  });
}

// 组织架构 --- 获取组织架构详情
export function getOrganizationDetailAPI(id: string) {
  return Axios({
    url: '/businessApi/business/dept/detail/' + id,
    method: 'post',
  });
}

// 组织架构 --- 新增组织架构（部门）
export interface AddOrganizationData {
  enterpriseId: string;
  id?: string;
  name: string;
  parentId: string;
  leaderId?: string;
  leaderTel?: string;
  parentType?: number;
  childrenType?: number;
  type: number;
  deptDesc?: string;
  deptNumber?: string;
}

export function addOrganizationAPI(data: AddOrganizationData) {
  return Axios({
    url: '/businessApi/business/dept/create',
    method: 'post',
    data,
  });
}

// 获取部门编码
export function getDeptNumberAPI(deptType: string) {
  return Axios({
    url: `/businessApi/business/dept/getDeptNumberByType/${deptType}`,
    method: 'post',
  });
}

// 组织架构 --- 更新组织架构

export function updateOrganizationAPI(data: AddOrganizationData) {
  return Axios({
    url: '/businessApi/business/dept/update',
    method: 'post',
    data,
  });
}

// 组织架构 --- 删除组织架构
export function deleteOrganizationAPI(id: string) {
  return Axios({
    url: '/businessApi/business/dept/delete/' + id,
    method: 'post',
  });
}

// ----------------------------------------------------- 安全部门 -------------------------------------------------
// 获取安全部门列表
export interface GetSafeDeptData {
  enterpriseId: string;
  name?: string;
  pageNo?: number;
  pageSize?: number;
  odDiseasesTypeText?: string;
}

export function getSafeDeptAPI(data: GetSafeDeptData) {
  return Axios({
    url: '/businessApi/business/safe-dept/get-page',
    method: 'post',
    data,
  });
}

// 新增安全部门
export interface AddSafeDeptData {
  enterpriseId: string;
  name: string;
  leaderId: string;
  tel?: string;
  leaderSecondId?: string;
  leaderSecondTel?: string;
  employeeIds: string[];
  employeeList: any[];
  safeDesc?: string;
}

export function addSafeDeptAPI(data: AddSafeDeptData) {
  return Axios({
    url: '/businessApi/business/safe-dept/creat',
    method: 'post',
    data,
  });
}

// 删除安全部门
export function deleteSafeDeptAPI(id: string) {
  return Axios({
    url: '/businessApi/business/safe-dept/delete/' + id,
    method: 'post',
  });
}

// 获取安全部门详情
export interface DetailSafeDeptData {
  enterpriseId: string;
  id: string;
}

export function detailSafeDeptAPI(data: DetailSafeDeptData) {
  return Axios({
    url: '/businessApi/business/safe-dept/detail',
    method: 'post',
    params: data,
  });
}

// 编辑安全部门
export function updateSafeDeptAPI(data: AddSafeDeptData) {
  return Axios({
    url: '/businessApi/business/safe-dept/update',
    method: 'post',
    data,
  });
}

// ----------------------------------------------------- 员工管理 --------------------------------------------------
// 获取员工列表 分页
export interface GetStaffData {
  enterpriseId: string;
  deptId?: string;
  safeDeptId?: string;
  entryDate?: string[];
  jobId?: string;
  jobNumber?: string;
  tel?: string;
  userName?: string;
  pageNo?: number;
  pageSize?: number;
}

export function getStaffDataAPI(data: GetStaffData) {
  return Axios({
    url: '/businessApi/business/employee/get-page',
    method: 'post',
    data,
  });
}

// 不分页
export function getStaffDataAllAPI(data: GetStaffData) {
  return Axios({
    url: '/businessApi/business/employee/get-list',
    method: 'post',
    data,
  });
}

export function getStaffDataMapAll(data: GetStaffData) {
  return Axios({
    url:
      '/businessApi/business/employee/get-list-all?enterpriseId=' +
      data.enterpriseId,
    method: 'post',
  });
}

// 新增
export interface AddStaffData {
  enterpriseId: string;
  userName: string;
  deptId: string;
  jobId: string;
  workTypeId?: string;
  jobNumber: string;
  incumbencyStatus: number; // 0 离职 1 在职
  tel: string;
  entryDate?: string;
  sex?: number;
  nativePlaceCode?: string;
  educationBackground?: number;
  major?: string;
  graduationSchool?: string;
  graduationTime?: string;
  remark?: string;
  userId?: string;
}

export function addStaffDataAPI(data: AddStaffData) {
  return Axios({
    url: '/businessApi/business/employee/creat',
    method: 'post',
    data,
  });
}

// 员工导入模板
export function staffImportTemplateAPI() {
  return Axios({
    url: '/businessApi/business/employee/down-model-excel',
    method: 'post',
    responseType: 'blob',
  });
}

// 员工导入数据预览
export function staffImportPreviewAPI(data: any) {
  return Axios({
    url: '/businessApi/business/employee/upload-preview',
    method: 'post',
    data,
  });
}

// 员工导入
export function staffImportAPI(data: any[]) {
  return Axios({
    url: '/businessApi/business/employee/import-excel',
    method: 'post',
    data,
  });
}

// 删除
export function deleteStaffDataAPI(id: string) {
  return Axios({
    url: '/businessApi/business/employee/delete/' + id,
    method: 'post',
  });
}

// 员工详情
export function detailStaffDataAPI(id: string, enterpriseId: string) {
  return Axios({
    url: '/businessApi/business/employee/detail',
    method: 'post',
    params: {
      id,
      enterpriseId,
    },
  });
}

// 编辑
export function uploadStaffDataAPI(data: AddStaffData) {
  return Axios({
    url: '/businessApi/business/employee/update',
    method: 'post',
    data,
  });
}

// 批量创建用户账号
export function batchCreateUserAPI(data: any[]) {
  return Axios({
    url: '/businessApi/business/ent/user/create-batch',
    method: 'post',
    data,
  });
}

// 根据id批量获取员工和用户信息
export function getAccountByIds(data: any) {
  return Axios({
    url: '/businessApi/business/ent/user/get-validate-result',
    method: 'post',
    data,
  });
}

// ----------------------------------------------------- 岗位管理--------------------------------------------------
// 岗位管理---获取岗位列表
export interface GetPostList {
  enterpriseId: string;
  id?: string;
  deptId?: string;
  jobName?: string;
  pageNo?: number;
  pageSize?: number;
}

export function getPostDataAPI(data: GetPostList) {
  return Axios({
    url: '/businessApi/business/job/get-page',
    method: 'post',
    data,
  });
}

export function getPostDataAllAPI(params: GetPostList) {
  return Axios({
    url: '/businessApi/business/job/get-list',
    method: 'post',
    params,
  });
}

// 校验员工姓名是否存在
export function validateUserNameAPI(name: string) {
  return Axios({
    url: `/businessApi/business/employee/verify-name?name=${name}`,
    method: 'post',
  });
}

// 新增岗位
export interface AddPostData {
  enterpriseId: string;
  deptId: string;
  id?: string;
  jobName: string;
  jobDesc?: string;
}

export function addPostDataAPI(data: AddPostData) {
  return Axios({
    url: '/businessApi/business/job/creat',
    method: 'post',
    data,
  });
}

// 获取岗位详情
export function detailPostDataAPI(params: {
  id: string;
  enterpriseId: string;
}) {
  return Axios({
    url: '/businessApi/business/job/detail',
    method: 'post',
    params,
  });
}

// 编辑岗位信息
export function updatePostDataAPI(data: AddPostData) {
  return Axios({
    url: '/businessApi/business/job/update',
    method: 'post',
    data,
  });
}

// 删除岗位
export function deletePostDataAPI(id: string) {
  return Axios({
    url: '/businessApi/business/job/delete/' + id,
    method: 'post',
  });
}

// ------------------------------------------------------ 工种管理 ------------------------------------------------
// 获取工种列表
export interface GetWorkTypeList {
  enterpriseId: string;
  id?: string;
  name?: string;
  pageNo?: number;
  pageSize?: number;
}

export function getWorkTypeDataAPI(data: GetWorkTypeList) {
  return Axios({
    url: '/businessApi/business/work-type/get-page',
    method: 'post',
    data,
  });
}

export function getWorkTypeDataAllAPI(params: GetWorkTypeList) {
  return Axios({
    url: '/businessApi/business/work-type/get-list',
    method: 'post',
    params,
  });
}
// 新增工种
export interface WorkTypeBody {
  enterpriseId: string;
  name: string;
  id?: string;
  harmfulFactor?: string;
  harmfulFactorList: any[];
  odDiseasesType?: string;
  odDiseasesTypeList: any[];
  remark?: string;
}

export function addWorkTypeAPI(data: WorkTypeBody) {
  return Axios({
    url: '/businessApi/business/work-type/creat',
    method: 'post',
    data,
  });
}

// 获取工种详情
export function detailWorkTypeAPI(params: {
  id: string;
  enterpriseId: string;
}) {
  return Axios({
    url: '/businessApi/business/work-type/detail',
    method: 'post',
    params,
  });
}

// 编辑工种信息
export function updateWorkTypeAPI(data: WorkTypeBody) {
  return Axios({
    url: '/businessApi/business/work-type/update',
    method: 'post',
    data,
  });
}

// 删除工种
export function deleteWorkTypeAPI(id: string) {
  return Axios({
    url: '/businessApi/business/work-type/delete/' + id,
    method: 'post',
  });
}

// 相关职业病列表---接口未完成
export interface GetWorkTypeDrawerList {
  enterpriseId: string;
  id?: string;
  name?: string;
  pageNo?: number;
  pageSize?: number;
}

export function getDiseasesTypeListAPI(params: GetWorkTypeDrawerList) {
  return Axios({
    url: '/businessApi/business/work-type/get-diseases-type-list',
    method: 'post',
    params,
  });
}

// 接触危害因素列表 --- 接口未完成
export function getHarmfulListAPI(params: GetWorkTypeDrawerList) {
  return Axios({
    url: '/businessApi/business/work-type/get-harmful-list',
    method: 'post',
    params,
  });
}

// --------------------------------------------- 证照管理 ：企业证照管理  ----------------------------
// 数量
export function getEnterpriseCountAPI() {
  return Axios({
    url: '/businessApi/business/enterprise/license/count',
    method: 'post',
  });
}

// 企业证照列表
export interface GetEnterpriseCertificateList {
  enterpriseId: string;
  cardName?: string;
  cardNo?: string;
  type?: number;
  status?: number;
  queryCondition?: number;
  pageNo?: number;
  pageSize?: number;
}

export function getEnterpriseCertificateListAPI(
  data: GetEnterpriseCertificateList
) {
  return Axios({
    url: '/businessApi/business/enterprise/license/get-page',
    method: 'post',
    data,
  });
}

// 新增企业证照
export interface EnterpriseCertificateBody {
  enterpriseId: string;
  type: number;
  cardName: string;
  cardNo: string;
  dutyEmployeeId: string;
  employeeName?: string;
  tel?: string;
  cardAuthority?: string;
  nextReviewDate?: string;
  effectiveEndDate: string;
  effectiveStartDate: string;
  effectiveTime: string[];
  attachment?: string;
  attachmentList: any[];
  remark?: string;
}

export function addEnterpriseCertificateAPI(data: EnterpriseCertificateBody) {
  return Axios({
    url: '/businessApi/business/enterprise/license/creat',
    method: 'post',
    data,
  });
}

// 获取企业证照详情
export function detailEnterpriseCertificateAPI(params: {
  id: string;
  enterpriseId: string;
}) {
  return Axios({
    url: '/businessApi/business/enterprise/license/detail',
    method: 'post',
    params,
  });
}

// 编辑企业证照信息
export function updateEnterpriseCertificateAPI(
  data: EnterpriseCertificateBody
) {
  return Axios({
    url: '/businessApi/business/enterprise/license/update',
    method: 'post',
    data,
  });
}

// 删除企业证照
export function deleteEnterpriseCertificateAPI(id: string) {
  return Axios({
    url: '/businessApi/business/enterprise/license/delete/' + id,
    method: 'post',
  });
}

// --------------------------------------------- 证照管理 ：企业证照复核 --------------------------------
// 查看待复核证书详情
export function detailEnterpriseExamineAPI(params: {
  id: string;
  enterpriseId: string;
}) {
  return Axios({
    url: '/businessApi/business/enterprise/license/review/detail',
    method: 'post',
    params,
  });
}

// 获取证书的复审记录列表
export function getEnterpriseExamineListAPI(params: {
  licenseId: string;
  enterpriseId: string;
}) {
  return Axios({
    url: '/businessApi/business/enterprise/license/review/get-list',
    method: 'post',
    params,
  });
}

// 复核提交
export interface AddEnterpriseExamineBody {
  enterpriseId: string;
  licenseId: string;
  reviewResult?: number;
  nextReviewDate: string;
  reviewDate: string;
  effectiveEndDate: string;
  effectiveStartDate: string;
  effectiveTime: any[];
  attachment?: string;
  attachmentList: any[];
  remark?: string;
}

export function submitEnterpriseExamineAPI(data: AddEnterpriseExamineBody) {
  return Axios({
    url: '/businessApi/business/enterprise/license/review/creat',
    method: 'post',
    data,
  });
}

// --------------------------------------------- 证照管理 ：员工证照管理---------------------------------
// 数量
export function getStaffCountAPI() {
  return Axios({
    url: '/businessApi/business/license/count',
    method: 'post',
  });
}

// 员工证照列表
export interface GetStaffCertificateList {
  enterpriseId: string;
  employeeName?: string;
  cardName?: string;
  cardNo?: string;
  cardTypeCode?: number;
  status?: number;
  queryCondition?: number;
  pageNo?: number;
  pageSize?: number;
}

export function getStaffCertificateListAPI(data: GetStaffCertificateList) {
  return Axios({
    url: '/businessApi/business/license/get-page',
    method: 'post',
    data,
  });
}

// 新增员工证照
export interface StaffCertificateBody {
  enterpriseId: string;
  employeeId: string;
  employeeName?: string;
  tel?: string;
  deptName?: string;
  jobName?: string;
  cardTypeCode: string;
  cardName: string;
  cardNo: string;
  cardAuthority?: string;
  effectiveStartDate: string;
  effectiveEndDate: string;
  effectiveTime: string[];
  nextReviewDate: string;
  attachment?: string;
  attachmentList: any[];
  remarks?: string;
  id?: string;
}

export function addStaffCertificateAPI(data: StaffCertificateBody) {
  return Axios({
    url: '/businessApi/business/license/creat',
    method: 'post',
    data,
  });
}

// 获取员工证照详情
export function detailStaffCertificateAPI(params: {
  id: string;
  enterpriseId: string;
}) {
  return Axios({
    url: '/businessApi/business/license/detail',
    method: 'post',
    params,
  });
}

// 编辑员工证照信息
export function updateStaffCertificateAPI(data: StaffCertificateBody) {
  return Axios({
    url: '/businessApi/business/license/update',
    method: 'post',
    data,
  });
}

// 删除员工证照
export function deleteStaffCertificateAPI(id: string) {
  return Axios({
    url: '/businessApi/business/license/delete/' + id,
    method: 'post',
  });
}

// ------------------------------------------ 证照管理 ： 员工证照复审 ---------------------------------------------
// 获取证书的复审记录列表
export function getStaffExamineListAPI(params: {
  licenseId: string;
  enterpriseId: string;
}) {
  return Axios({
    url: '/businessApi/business/license/review/get-list',
    method: 'post',
    params,
  });
}

// 复核提交
export interface AddStaffExamineBody {
  enterpriseId: string;
  licenseId: string;
  reviewResult?: number;
  nextReviewDate: string;
  reviewDate: string;
  effectiveEndDate: string;
  effectiveStartDate: string;
  effectiveTime: any[];
  attachment?: string;
  attachmentList: any[];
  remark?: string;
}

export function submitStaffExamineAPI(data: AddStaffExamineBody) {
  return Axios({
    url: '/businessApi/business/license/review/creat',
    method: 'post',
    data,
  });
}
