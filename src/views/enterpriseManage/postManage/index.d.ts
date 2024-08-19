export interface PostList {
  createTime?: string;
  creator?: string;
  deleted?: boolean;
  deptId?: number;
  deptName?: string;
  id?: number;
  enterpriseName?: string;
  enterpriseId?: string;
  remark?: string;
  jobDesc?: string;
  jobName?: string;
  status?: string;
  updateTime?: string;
  updater?: string;
}
export interface PostData {
  list?: PostList[];
  total?: number;
}
