export type RoleType = '' | '*' | 'admin' | 'user';
export interface UserState {
  id: number;
  name?: string;
  avatar?: string;
  job?: string;
  organization?: string;
  location?: string;
  email?: string;
  introduction?: string;
  personalWebsite?: string;
  jobName?: string;
  organizationName?: string;
  locationName?: string;
  phone?: string;
  registrationDate?: string;
  accountId?: string;
  enterpriseId?: string;
  tenantId?: string;
  certification?: number;
  role: RoleType;
  userId: number;
  deptId: string;
}