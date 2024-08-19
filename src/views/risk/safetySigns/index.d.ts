export interface SafetySignsData {
  list: SafetySignsList[];
  total: number;
}
interface SafetySignsList {
  id?: string;
  pictureUrl?: string;
  pictureName?: string;
  remark?: string;
  signName?: string;
  signType?: string;
  signTypeCode?: string;
}
