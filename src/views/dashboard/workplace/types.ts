import hoist from '@/assets/images/icon/吊装.png';
import fire from '@/assets/images/icon/动火.png';
import ground from '@/assets/images/icon/动土.png';
import brokenRoad from '@/assets/images/icon/断路.png';
import highAltitude from '@/assets/images/icon/高处.png';
import tempElectricity from '@/assets/images/icon/临时用电.png';
import blindPlate from '@/assets/images/icon/盲板抽堵.png';
import checkTask from '@/assets/images/icon/排查任务.png';
import checkReportProblem from '@/assets/images/icon/排查上报问题.png';
import confinedSpace from '@/assets/images/icon/受限空间.png';
import snapshot from '@/assets/images/icon/随手拍.png';
import pitfall from '@/assets/images/icon/隐患处理.png';
import { statusEnum } from '@/views/pitfall/snapshot/composition/useDict';

export enum todoTypeEnum {
  BLINDPLATE = 'NOTICE_B_T_B',
  CONFINEDSPACE = 'NOTICE_C_S',
  GROUND = 'NOTICE_E',
  HIGHALTITUDE = 'NOTICE_H',
  FIRE = 'NOTICE_HOT',
  HOIST = 'NOTICE_L',
  BROKENROAD = 'NOTICE_R_B',
  TEMPELECTRICITY = 'NOTICE_T_E',
  CHECKTASK = 'NOTICE_CHECK',
  PITFALL = 'NOTICE_HAZARD',
}

export enum taskStateEnum {
  '未开始' = '1',
  '待完成' = '2',
  '进行中' = '3',
  '按时完成' = '4',
  '逾期未完成' = '5',
  '逾期完成' = '6',
}

export enum dangerStateEnum {
  '待确认隐患' = '1',
  '误报' = '2',
  '待整改隐患' = '3',
  '逾期未整改' = '4',
  '整改待验收' = '5',
  '验收待复审' = '6',
  '已整改' = '7',
  '整改中' = '8',
  '整改已下发' = '9',
}

export const messageTypeEnum = {
  NOTICE_CHECK: {
    title: '排查任务',
    icon: checkTask,
    jump: function (this: any) {
      const {
        id,
        taskName,
        checkTableIds,
        checkPerson,
        checkPersonId,
        taskType,
        isCompleted,
        hideBtn,
      } = this;
      if (!isCompleted && !hideBtn) {
        return {
          routerName: 'ExecuteDailyTask',
          redirectName: 'DailyCheckTasks',
          params: {
            id,
            taskId: id,
            taskName,
            checkTableIds,
            checkPerson,
            checkPersonId,
            taskType,
            type: taskType == '1' ? 'dailyExecute' : 'planExecute',
          },
        };
      } else {
        return {
          routerName: 'CheckDailyTaskDetail',
          redirectName: 'DailyCheckTasks',
          params: {
            id,
            checkPerson,
          },
        };
      }
    },
  },
  NOTICE_HAZARD: {
    title: '隐患处理',
    icon: pitfall,
    jump: function (this: any) {
      const { id, dangerStateCode, dangerLevelCode, rectifyCount } = this;
      const typeObj = {
        [statusEnum.CONFIRMED]: 'confirm',
        [statusEnum.TOBERECTIFY]: 'report',
        [statusEnum.TOBEACCEPTANCE]: 'acceptance',
        [statusEnum.REEXAMINE]: 'reexamine',
        [statusEnum.RECTIFIED]: 'toDetail',
        [statusEnum.OVERDUE]: 'report',
      };
      const type = typeObj[dangerStateCode as keyof typeof typeObj];
      const obj: any = {
        report: '整改上报',
        confirm: '隐患确认',
        acceptance: '隐患验收',
        edit: '隐患编辑',
        reexamine: '隐患复审',
        toDetail: '隐患详情',
      };
      return {
        routerName: 'PitfallDetail',
        redirectName: 'PitfallManage',
        params: {
          id,
          dangerStateCode,
          dangerLevelCode,
          rectifyCount,
          source: 'pitfallDetail',
          type,
          title: obj[type],
        },
      };
    },
  },
  NOTICE_SNAPSHOT: {
    title: '随手拍',
    icon: snapshot,
    jump: function (this: any) {
      const { id, dangerStateCode, dangerLevelCode } = this;
      return {
        routerName: 'SnapshotDetail',
        redirectName: 'Snapshot',
        params: {
          id,
          dangerStateCode,
          dangerLevelCode,
          type: 'toDetail',
          title: '隐患详情',
        },
      };
    },
  },
  NOTICE_HAZARD_REPORT: {
    title: '排查上报问题',
    icon: checkReportProblem,
    jump: function (this: any) {
      const { id, dangerStateCode, dangerLevelCode } = this;
      return {
        routerName: 'PitfallDetail',
        redirectName: 'PitfallManage',
        params: {
          id,
          dangerStateCode,
          dangerLevelCode,
          type: 'toDetail',
          title: '隐患详情',
        },
      };
    },
  },
  NOTICE_HOT: {
    title: '动火作业',
    icon: fire,
    jump: function (this: any) {
      const { relativeId: id } = this;
      return {
        routerName: 'FireCertificateHandling',
        redirectName: 'FireCertificateIndex',
        params: { id },
      };
    },
  },
  NOTICE_C_S: {
    title: '受限空间作业',
    icon: confinedSpace,
    jump: function (this: any) {
      const { relativeId: id } = this;
      return {
        routerName: 'ConfinedSpaceCertificateHandling',
        redirectName: 'ConfinedSpaceCertificateIndex',
        params: { id },
      };
    },
  },
  NOTICE_B_T_B: {
    title: '盲板抽堵作业',
    icon: blindPlate,
    jump: function (this: any) {
      const { relativeId: id } = this;
      return {
        routerName: 'BlindPlateCertificateHandling',
        redirectName: 'BlindPlateCertificateIndex',
        params: { id },
      };
    },
  },
  NOTICE_H: {
    title: '高处安全作业',
    icon: highAltitude,
    jump: function (this: any) {
      const { relativeId: id } = this;
      return {
        routerName: 'HighAltitudeCertificateHandling',
        redirectName: 'HighAltitudeCertificateIndex',
        params: { id },
      };
    },
  },
  NOTICE_L: {
    title: '吊装安全作业',
    icon: hoist,
    jump: function (this: any) {
      const { relativeId: id } = this;
      return {
        routerName: 'HoistCertificateHandling',
        redirectName: 'HoistCertificateIndex',
        params: { id },
      };
    },
  },
  NOTICE_T_E: {
    title: '临时用电作业',
    icon: tempElectricity,
    jump: function (this: any) {
      const { relativeId: id } = this;
      return {
        routerName: 'TempElectricityCertificateHandling',
        redirectName: 'TempElectricityCertificateIndex',
        params: { id },
      };
    },
  },
  NOTICE_E: {
    title: '动土作业',
    icon: ground,
    jump: function (this: any) {
      const { relativeId: id } = this;
      return {
        routerName: 'GroundCertificateHandling',
        redirectName: 'GroundCertificateIndex',
        params: { id },
      };
    },
  },
  NOTICE_R_B: {
    title: '断路作业',
    icon: brokenRoad,
    jump: function (this: any) {
      const { relativeId: id } = this;
      return {
        routerName: 'BrokenRoadCertificateHandling',
        redirectName: 'BrokenRoadCertificateIndex',
        params: { id },
      };
    },
  },
};

type todoConfigTypes = {
  label: string;
  valueKey: string;
  row?: boolean;
  timeStartKey?: string;
  timeEndKey?: string;
  className?: string;
  labelStyle?: string;
  valueStyle?: string;
};

export const typeToFields = {
  [todoTypeEnum.CHECKTASK]: {
    title: messageTypeEnum[todoTypeEnum.CHECKTASK].title,
    icon: messageTypeEnum[todoTypeEnum.CHECKTASK].icon,
    jump: function (this: any) {
      const {
        id,
        taskName,
        checkTableIds,
        checkPerson,
        checkPersonId,
        taskStateCode,
        taskType,
      } = this;
      if (!this.needEdit) {
        return {
          routerName: 'CheckDailyTaskDetail',
          redirectName: 'DailyCheckTasks',
          params: {
            id,
            checkPerson,
            taskStateCode,
          },
        };
      }
      return {
        routerName: 'ExecuteDailyTask',
        redirectName: 'DailyCheckTasks',
        params: {
          id,
          taskId: id,
          taskName,
          checkTableIds,
          checkPerson,
          checkPersonId,
          taskType,
          type: taskType == '1' ? 'dailyExecute' : 'planExecute',
        },
      };
    },
    configs: <todoConfigTypes[]>[
      { label: '', valueKey: 'taskTypeName', row: true },
      {
        label: '任务时间',
        valueKey: 'timeRange',
        timeStartKey: 'taskStartTime',
        timeEndKey: 'taskEndTime',
        row: true,
      },
    ],
  },
  [todoTypeEnum.PITFALL]: {
    title: messageTypeEnum[todoTypeEnum.PITFALL].title,
    icon: messageTypeEnum[todoTypeEnum.PITFALL].icon,
    jump: function (this: any) {
      const {
        id,
        dangerStateCode,
        dangerLevelCode,
        rectifyCount,
        dangerSourceCode,
        needEdit,
      } = this;
      const typeObj = {
        [statusEnum.CONFIRMED]: 'confirm',
        [statusEnum.TOBERECTIFY]: 'report',
        [statusEnum.TOBEACCEPTANCE]: 'acceptance',
        [statusEnum.REEXAMINE]: 'reexamine',
        [statusEnum.RECTIFIED]: 'toDetail',
        [statusEnum.OVERDUE]: 'report',
      };
      const type = typeObj[dangerStateCode as keyof typeof typeObj];
      const obj: any = {
        report: '整改上报',
        confirm: '隐患确认',
        acceptance: '隐患验收',
        edit: '隐患编辑',
        reexamine: '隐患复审',
        toDetail: '隐患详情',
      };
      // 随手拍
      if (dangerSourceCode === '1') {
        return {
          routerName: 'SnapshotDetail',
          redirectName: 'Snapshot',
          params: {
            id,
            dangerStateCode,
            dangerLevelCode,
            rectifyCount,
            type: needEdit ? type : 'toDetail',
            title: obj[type],
          },
        };
      } else {
        return {
          routerName: 'SnapshotDetail',
          redirectName: 'PitfallManage',
          params: {
            id,
            dangerStateCode,
            dangerLevelCode,
            rectifyCount,
            source: 'pitfallDetail',
            type: needEdit ? type : 'toDetail',
            title: obj[type],
          },
        };
      }
    },
    configs: <todoConfigTypes[]>[
      {
        label: '隐患级别',
        valueKey: 'dangerLevel',
        row: true,
        valueStyle: 'color: #4090ff',
      },
      { label: '上报时间', valueKey: 'reportTime', row: true },
    ],
  },
  [todoTypeEnum.FIRE]: {
    title: messageTypeEnum[todoTypeEnum.FIRE].title,
    icon: messageTypeEnum[todoTypeEnum.FIRE].icon,
    jump: function (this: any) {
      const { certBaseId: id } = this;
      return {
        routerName: 'FireCertificateHandling',
        redirectName: 'FireCertificateIndex',
        params: { id },
      };
    },
    configs: <todoConfigTypes[]>[
      {
        label: '作业申请单位',
        valueKey: 'applyDeptName',
      },
      { label: '作业申请人', valueKey: 'applyUserName' },
      {
        label: '动火时间',
        valueKey: 'timeRange',
        timeStartKey: 'operationBeginTime',
        timeEndKey: 'operationEndTime',
        row: true,
      },
    ],
  },
  [todoTypeEnum.BLINDPLATE]: {
    title: messageTypeEnum[todoTypeEnum.BLINDPLATE].title,
    icon: messageTypeEnum[todoTypeEnum.BLINDPLATE].icon,
    jump: function (this: any) {
      const { certBaseId: id } = this;
      return {
        routerName: 'BlindPlateCertificateHandling',
        redirectName: 'BlindPlateCertificateIndex',
        params: { id },
      };
    },
    configs: <todoConfigTypes[]>[
      {
        label: '作业申请单位',
        valueKey: 'applyDeptName',
      },
      { label: '作业申请人', valueKey: 'applyUserName' },
      {
        label: '作业时间',
        valueKey: 'timeRange',
        timeStartKey: 'operationBeginTime',
        timeEndKey: 'operationEndTime',
        row: true,
      },
    ],
  },
  [todoTypeEnum.CONFINEDSPACE]: {
    title: messageTypeEnum[todoTypeEnum.CONFINEDSPACE].title,
    icon: messageTypeEnum[todoTypeEnum.CONFINEDSPACE].icon,
    jump: function (this: any) {
      const { certBaseId: id } = this;
      return {
        routerName: 'ConfinedSpaceCertificateHandling',
        redirectName: 'ConfinedSpaceCertificateIndex',
        params: { id },
      };
    },
    configs: <todoConfigTypes[]>[
      {
        label: '作业申请单位',
        valueKey: 'applyDeptName',
      },
      { label: '作业申请人', valueKey: 'applyUserName' },
      {
        label: '作业时间',
        valueKey: 'timeRange',
        timeStartKey: 'operationBeginTime',
        timeEndKey: 'operationEndTime',
        row: true,
      },
    ],
  },
  [todoTypeEnum.BROKENROAD]: {
    title: messageTypeEnum[todoTypeEnum.BROKENROAD].title,
    icon: messageTypeEnum[todoTypeEnum.BROKENROAD].icon,
    jump: function (this: any) {
      const { certBaseId: id } = this;
      return {
        routerName: 'BrokenRoadCertificateHandling',
        redirectName: 'BrokenRoadCertificateIndex',
        params: { id },
      };
    },
    configs: <todoConfigTypes[]>[
      {
        label: '作业申请单位',
        valueKey: 'applyDeptName',
      },
      { label: '作业申请人', valueKey: 'applyUserName' },
      {
        label: '作业时间',
        valueKey: 'timeRange',
        timeStartKey: 'operationBeginTime',
        timeEndKey: 'operationEndTime',
        row: true,
      },
    ],
  },
  [todoTypeEnum.GROUND]: {
    title: messageTypeEnum[todoTypeEnum.GROUND].title,
    icon: messageTypeEnum[todoTypeEnum.GROUND].icon,
    jump: function (this: any) {
      const { certBaseId: id } = this;
      return {
        routerName: 'GroundCertificateHandling',
        redirectName: 'GroundCertificateIndex',
        params: { id },
      };
    },
    configs: <todoConfigTypes[]>[
      {
        label: '作业申请单位',
        valueKey: 'applyDeptName',
      },
      { label: '作业申请人', valueKey: 'applyUserName' },
      {
        label: '作业时间',
        valueKey: 'timeRange',
        timeStartKey: 'operationBeginTime',
        timeEndKey: 'operationEndTime',
        row: true,
      },
    ],
  },
  [todoTypeEnum.HIGHALTITUDE]: {
    title: messageTypeEnum[todoTypeEnum.HIGHALTITUDE].title,
    icon: messageTypeEnum[todoTypeEnum.HIGHALTITUDE].icon,
    jump: function (this: any) {
      const { certBaseId: id } = this;
      return {
        routerName: 'HighAltitudeCertificateHandling',
        redirectName: 'HighAltitudeCertificateIndex',
        params: { id },
      };
    },
    configs: <todoConfigTypes[]>[
      {
        label: '作业申请单位',
        valueKey: 'applyDeptName',
      },
      { label: '作业申请人', valueKey: 'applyUserName' },
      {
        label: '作业时间',
        valueKey: 'timeRange',
        timeStartKey: 'operationBeginTime',
        timeEndKey: 'operationEndTime',
        row: true,
      },
    ],
  },
  [todoTypeEnum.HOIST]: {
    title: messageTypeEnum[todoTypeEnum.HOIST].title,
    icon: messageTypeEnum[todoTypeEnum.HOIST].icon,
    jump: function (this: any) {
      const { certBaseId: id } = this;
      return {
        routerName: 'HoistCertificateHandling',
        redirectName: 'HoistCertificateIndex',
        params: { id },
      };
    },
    configs: <todoConfigTypes[]>[
      {
        label: '作业申请单位',
        valueKey: 'applyDeptName',
      },
      { label: '作业申请人', valueKey: 'applyUserName' },
      {
        label: '作业时间',
        valueKey: 'timeRange',
        timeStartKey: 'operationBeginTime',
        timeEndKey: 'operationEndTime',
        row: true,
      },
    ],
  },
  [todoTypeEnum.TEMPELECTRICITY]: {
    title: messageTypeEnum[todoTypeEnum.TEMPELECTRICITY].title,
    icon: messageTypeEnum[todoTypeEnum.TEMPELECTRICITY].icon,
    jump: function (this: any) {
      const { certBaseId: id } = this;
      return {
        routerName: 'TempElectricityCertificateHandling',
        redirectName: 'TempElectricityCertificateIndex',
        params: { id },
      };
    },
    configs: <todoConfigTypes[]>[
      {
        label: '作业申请单位',
        valueKey: 'applyDeptName',
      },
      { label: '作业申请人', valueKey: 'applyUserName' },
      {
        label: '作业时间',
        valueKey: 'timeRange',
        timeStartKey: 'operationBeginTime',
        timeEndKey: 'operationEndTime',
        row: true,
      },
    ],
  },
};
