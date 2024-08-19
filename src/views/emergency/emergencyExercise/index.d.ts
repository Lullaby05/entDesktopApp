export interface ExercisePlanItem {
  id?: string;

  planTitle?: string;
  planObject?: string;
  planTime?: string;
  planType?: string;
  planProject?: string;
  planMode?: string;
  planPerson?: string;
  principalUserName?: string;
  principalDeptName?: string;
  status?: string | number;
  agreement?: string;
  agreementList?: any[];
}
