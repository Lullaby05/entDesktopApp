export interface AccidentTypeData {
  list: WorkTypeList[];
  total: number;
}
interface AccidentTypeList {
  id?: string;
  accTypeCode?: string;
  accTypeName?: string;
  disposalMeth?: string;
  updateTime?: string;
  updater?: string;
  createTime?: string;
  creator?: string;
  deleted?: boolean;
}
