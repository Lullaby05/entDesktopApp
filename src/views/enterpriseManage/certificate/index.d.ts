export interface EnterpriseCetificateData {
  list: EnterpriseCetificateList[];
  total: number;
}
export interface EnterpriseCetificateList {
  enterpriseId?: string;
  enterpriseName?: string;
  id?: string;
  cardNo?: string;
  cardName?: string;

  attachment?: string;
  attachmentList?: string[];
  cardAuthority?: string;
  createTime?: string;
  creator?: string;
  remark?: string;
  dutyEmployeeId?: string;
  effectiveEndDate?: string;
  effectiveStartDate?: string;
  employeeName?: string;
  tel?: string;
  nextReviewDate?: string;
  status?: number;
  type?: number;
}

export interface StaffCetificateData {
  list: StaffCetificateList[];
  total: number;
}
export interface StaffCetificateList {
  enterpriseId?: string;
  enterpriseName?: string;
  id?: string;
  cardNo?: string;
  cardName?: string;

  attachment?: string;
  attachmentList?: string[];
  cardAuthority?: string;
  createTime?: string;
  creator?: string;
  remark?: string;
  dutyEmployeeId?: string;
  effectiveEndDate?: string;
  effectiveStartDate?: string;
  employeeName?: string;
  employeeId?: string;
  tel?: string;
  nextReviewDate?: string;
  status?: number;
  cardTypeCode?: number;
}
