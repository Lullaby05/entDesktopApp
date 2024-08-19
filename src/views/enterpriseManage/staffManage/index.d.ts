export interface StaffData {
  list: StaffItem[];
  total: number;
}

export interface StaffItem {
  createTime?: string;
  creator?: string;
  deleted?: boolean;
  deptId?: string;
  deptName?: string;
  educationBackground?: number;
  enterpriseId?: string;
  enterpriseName?: string;
  entryDate?: string;
  graduationSchool?: string;
  graduationTime?: string;
  id?: string;
  incumbencyStatus?: number;
  jobId?: string;
  jobName?: string;
  jobNumber?: string;
  major?: string;
  nativePlaceCode?: string;
  phone?: string;
  photos?: string;
  postName?: string;
  relevantId?: string;
  safeDeptId?: string;
  sex?: number;
  sexName?: string;
  tel?: string;
  updateTime?: string;
  userName?: string;
  userId?: string;
  workTypeId?: string;
  workTypeName?: string;
}
