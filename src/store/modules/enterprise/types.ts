export interface ComponyTreeData {
  businessLicense?: string;
  businessScope?: string;
  childCompanyMaxCount?: number;
  companyArea?: string;
  companyClassCode?: string;
  companyCode?: string;
  companyName?: string;
  contactName?: string;
  contactPhone?: string;
  corporateName?: string;
  corporatePhone?: string;
  corporatePostId?: string;
  createTime?: string;
  creator?: string;
  emergency?: string;
  employeesNum?: number;
  enterpriseAddress?: string;
  id?: number;
  lastYearIncome?: string;
  latitude?: string;
  longitude?: string;
  logo?: string;
  mainProducts?: string;
  nature?: string;
  parentId?: number;
  postalAddress?: string;
  profit?: string;
  projectCode?: string;
  registeredAddress?: string;
  registeredCapital?: string;
  socialcreditCode?: string;
  superiorDept?: string;
  updateTime?: string;
  updater?: string;
  userMaxCount?: number;
  establishmentDate?: string;

  children?: ComponyTreeData[];
}

export interface EnterpriseInfoData {
  accessoryInfo?: {
    businessLicense?: string;
    emergency?: string;
  };
  baseInfo?: {
    businessScope?: string;
    companyArea?: string;
    companyName?: string;
    companyType?: string;
    employeesNum?: string;
    enterpriseAddress?: string;
    establishmentDate?: string;
    industryInvolved?: string;
    industryInvolvedName?: string;
    smallMajorInvolved?: string;
    smallMajorInvolvedName?: string;
    logo?: string;
    majorInvolved?: string;
    majorInvolvedName?: string;
    parentName?: string;
    registeredAddress?: string;
    socialcreditCode?: string;
    status?: string;
  };
  contactInfo?: {
    contacts?: string;
    contactsPosition?: string;
    contactsTel?: string;
    fax?: string;
    officialUrl?: string;
    position?: string;
    safeMainPerson?: string;
    safeMainPersonTel?: string;
  };
  safeInfo?: {
    communityInspector?: string;
    communityInspectorTel?: string;
    planFlag?: number;
    safeRegulatorPerson?: string;
    safeRegulatorTel?: string;
    safetyProductionFlag?: number;
    threeSimultaneousFlag?: number;
    safeRegulator?: string;
  };
  createTime?: string;
  creator?: string;
  id: string;
  latitude?: string;
  longitude?: string;
  parentId?: string;
  updateTime?: string;
  updater?: string;

  children?: EnterpriseInfoData[];
}

export interface OrganizationTreeData {
  createTime?: string;
  creator?: string;
  deleted?: boolean;
  deptDesc?: string;
  employeeCount?: string; // 部门人数
  enterpriseFlag?: boolean; // 是否为 顶层  即企业
  enterpriseId?: string;
  fullPathNames?: string;

  id?: string;
  leaderId?: string;
  leaderName?: string;
  leaderTel?: string;
  name?: string;
  parentId?: string;
  type?: string;
  updateTime?: string;
  updater?: string;

  children?: OrganizationTreeData[];
}
