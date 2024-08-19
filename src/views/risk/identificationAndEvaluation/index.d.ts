export interface RiskUnitDataItem {
  id: string;
  name: string;
  parentId?: string;
  weight?: number;
  children?: RiskUnitDataItem[];
}

export interface RiskPointData {
  list: RiskPointItem[];
  total: number;
}

export interface RiskPointItem {
  id?: string;
  acctypeNum?: number;
  contact?: string;
  controlMeasureNum?: number;
  dangerNum?: number;
  dutyDeptId?: string;
  dutyDeptName?: string;
  personId?: string;
  personName?: string;
  riskLevel?: string;
  riskLevelCode?: string;
  riskPointAddr?: string;
  riskPointName?: string;
  riskUnitId?: string;
  riskUnitName?: string;
}

export interface DangerPointData {
  list: DangerPointItem[];
  total: number;
}

export interface DangerPointItem {
  accTypeCode?: string;
  id?: string;
  dangerId?: string;
  accTypeName?: string;
  controlMeasure?: string;
  controlMeasureCode?: string;
  dangerName?: string;
  emergMeasure?: string;
  factorDesc?: string;
  factorDescCode?: string;
  factorType?: string;
  factorTypeCode?: string;
  riskLevel?: string;
  riskLevelCode?: string;
  riskPointId?: string;
  riskPointName?: string;
}
