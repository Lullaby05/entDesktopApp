import { PaginationType } from '@/types/global';

export interface eventManageSearchType extends PaginationType {
  deviceName?: string;
  eventType?: string;
  typeNLevel?: string;
  deviceLocation?: string;
  createTime?: string[];
  deviceAlarmStatus?: string;
  eventLevel?: string;
  eventStatus?: number[];
}

export interface eventManageView {
  id: string;
  device: string;
  deviceLocation: string;
  name: string;
  eventType: string;
  typeCode: string;
  eventLevel: string;
  levelCode: string;
  createTime: string;
  deviceAlarmStatus: string;
  eventStatus: number;
}
