import { PaginationType } from '@/types/global';

export interface searchType extends PaginationType {
  eventName?: string;
  typeNLevel?: string;
  personConfirm?: string;
  eventType?: string;
  evnetLevel?: string;
}

export interface eventConfigView {
  id: string;
  eventName: string;
  typeCode: string;
  eventType: string;
  levelCode: string;
  eventLevel: string;
  methodsCode: string[];
  methods: string;
  personConfirm: string;
  eventDesc: string;
  createBy: string;
  createTime: string;
  updateBy: string;
  updateTime: string;
}

export interface editEventConfigOptions {
  id: string;
  eventName: string;
  eventType: string;
  eventLevel: string;
  methods: string[];
  personConfirm: string;
  eventDesc: string;
  createBy?: string;
  createTime?: string;
  updateBy?: string;
  updateTime?: string;
}

export const eventTypeLevelDict = [
  {
    dictKey: '应急事件',
    dictValue: '1',
    children: [
      { dictKey: '一级', dictValue: '1-1', color: '#D43030' },
      { dictKey: '二级', dictValue: '1-2', color: '#f59a23' },
      { dictKey: '三级', dictValue: '1-3', color: '#ffdf25' },
      { dictKey: '四级', dictValue: '1-4', color: '#357cf0' },
    ],
  },
  {
    dictKey: '隐患',
    dictValue: '2',
    children: [
      { dictKey: '重大', dictValue: '2-1', color: '#D43030' },
      { dictKey: '一般', dictValue: '2-2', color: '#357cf0' },
    ],
  },
  {
    dictKey: '设备故障',
    dictValue: '3',
    children: [
      { dictKey: '故障', dictValue: '3-1', color: '#D43030' },
      { dictKey: '告警', dictValue: '3-2', color: '#f59a23' },
      { dictKey: '预警', dictValue: '3-3', color: '#ffdf25' },
    ],
  },
];
