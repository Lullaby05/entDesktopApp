export interface ExportItem {
  tenantId?: string;
  id?: string;

  name?: string;
  telphone?: string;
  expertise?: string;
  education?: string;
  major?: string;
  remark?: string;
}

export interface MetarialItem {
  tenantId?: string;
  id?: string;

  emergencySuppliesName?: string;
  suppliesCodeName?: string;
  number?: number;
  lnglat?: string;
  place?: string;
  mainUserName?: string;
  mainUserPhone?: string;
  viceUserName: ?string;
  viceUserPhone?: string;
  remarks?: string;
}

export interface RecordItem {
  id?: string;
  checkDesc?: string;
  checkTime?: string;
  checkUserName?: string;
}

export interface TroopsItem {
  id?: string;
  teamType?: string;
  teamName?: string;
  teamLeaderName?: string;
  teamLeaderTel?: string;
  divisionLeaderName?: string;
  divisionLeaderTel?: string;
  agreement?: string;
  agreementList: any[];
}
