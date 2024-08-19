export interface SafeDeptData {
  list: safeDeptDataList[];
  total: number;
}
interface SafeDeptDataList {
  enterpriseId?: string;
  id?: string;
  leaderId?: string;
  leaderName?: string;
  leaderTel?: string;
  leaderSecondId?: string;
  leaderSecondName?: string;
  leaderSecondTel?: string;

  name?: string;
  count?: number;
  safeDesc?: string;
  updateTime?: string;
  updater?: string;
  createTime?: string;
  creator?: string;
  deleted?: string;
}
