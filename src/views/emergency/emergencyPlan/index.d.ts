export interface PlanBItem {
  id?: string;
  emergencyType?: string;
  emergencyPlanName?: string;
  eventTypeName?: string; // 名字？
  recorded?: string;
  recordedNumber?: string;
  agreement?: string;
  agreementList: any[];
}
