export interface WorkTypeData {
  list: WorkTypeList[];
  total: number;
}
export interface WorkTypeList {
  enterpriseId?: string;
  id?: string;
  name?: string;
  harmfulFactor?: string;
  harmfulFactorText?: string;
  odDiseasesType?: string;
  odDiseasesTypeText?: string;
  remark?: string;
  updateTime?: string;
  updater?: string;
  createTime?: string;
  creator?: string;
  deleted?: boolean;
}
