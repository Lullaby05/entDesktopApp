import { useUserStore } from '@/store';
import { formatDate } from '@/utils/utils';
import { computed } from 'vue';

export const useStrategy = () => {
  const userStore = useUserStore();
  const userInfo = computed(() => {
    return userStore.userInfo;
  });
  const getReqParams = (
    formData: any,
    isDefault: boolean = true,
    name: string = '',
    eventProfileId: string = ''
  ) => {
    return {
      enterpriseInfoId: userInfo.value.enterpriseId,
      name: isDefault ? '默认消息策略' : name,
      tenantId: userInfo.value.tenantId,
      type: isDefault ? 'DEFAULT' : 'CUSTOM',
      eventProfileId: eventProfileId || undefined,
      noticeRuleModuleCreateReqVOList: formData
        .filter((ele: any) => ele.notifyMethod && ele.notifyMethod.length)
        .map((item: any, index: number) => {
          const executeCycleObj: Record<string, boolean> = {
            1: item.allTime,
            2: item.onDay,
            3: item.onTimeRanger,
          };
          // 循环executeCycleObj如果有一个为true则push到executeCycle
          const executeCycle: number[] = Object.keys(executeCycleObj).reduce(
            (prev: any[], cur: string) => {
              if (executeCycleObj[cur]) {
                prev.push(Number(cur));
              }
              return prev;
            },
            []
          );
          // 如果executeCycle为空，并且是升级或恢复的话，默认为1
          if (item.type === 'upgrade' || item.type === 'recover') {
            executeCycle.push(1);
          }
          const obj = {
            happened: 'RULE',
            upgrade: 'RULE_IMPROVE',
            recover: 'RULE_RECOVERY',
          };
          return {
            ruleLevel: obj[item.type as keyof typeof obj],
            sort: index,
            executeCycle,
            frequency: item.maxTimes || 1,
            intervalNum: item.interval || 1,
            unit: item.intervalUnit || 'MINUTE',
            ruleImproveNum: item.type === 'upgrade' ? item.upgradeInterval : '',
            ruleImproveUnit:
              item.type === 'upgrade' ? item.upgradeIntervalUnit : '',
            periodStart:
              item.type === 'happened' && item.timeRanger[0]
                ? +new Date(`1970-01-01 ${item.timeRanger[0]}`)
                : null,
            periodEnd:
              item.type === 'happened' && item.timeRanger[1]
                ? +new Date(`1970-01-01 ${item.timeRanger[1]}`)
                : null,
            weekDays: item.days,
            noticeTemplateList:
              item.notifyMethod &&
              item.notifyMethod.map((ele: string) => ({
                id: ele,
              })),
            outUserPOList:
              item.customPerson &&
              item.customPerson.map((ele: any, index: number) => {
                return {
                  outUserSort: index,
                  outPhone: ele.phone,
                  outUserName: ele.name,
                  isOutUser: 'True',
                  userType: 'OUT_USER',
                };
              }), //外部人员
            userPOList:
              item.person &&
              item.person.map((ele: any, index: number) => ({
                sort: index,
                userId: ele.userId,
                deptId: ele.deptId,
                userType: 'USER',
              })), //用户
            postUserPOList:
              item.post &&
              item.post.map((ele: any, index: number) => ({
                postSort: index,
                postId: ele.id,
                deptId: ele.deptId,
                userType: 'POST',
              })), //岗位
            teamUserPOList:
              item.group &&
              item.group.map((ele: any, index: number) => {
                return {
                  teamSort: index,
                  teamId: ele.id,
                  teamName: ele.groupPlanName,
                  userType: 'TEAM',
                };
              }), // 班组
          };
        }),
    };
  };
  const getResParams = (data: any) => {
    if (!data)
      return {
        happened: {
          allTime: false,
          onDay: false,
          onTimeRanger: false,
          days: [],
          intervalUnit: '',
          timeRanger: [],
          customPerson: [],
          type: 'happened',
        },
        upgrade: [],
        recover: {
          customPerson: [],
          type: 'recover',
        },
      };
    const handlePeronsObj = (personData: any) => {
      return {
        group: personData.teamUserPOList
          ? personData.teamUserPOList
              .sort((a: any, b: any) => a.teamSort - b.teamSort)
              .map((ele: any) => ({
                primaryId: ele.id,
                id: ele.teamId,
                groupPlanName: ele.teamName,
              }))
          : [],
        post: personData.postUserPOList
          ? personData.postUserPOList
              .sort((a: any, b: any) => a.postSort - b.postSort)
              .map((ele: any) => ({
                primaryId: ele.id,
                id: ele.postId,
                deptId: ele.deptId,
                jobName: ele.postName,
                deptName: ele.deptName,
              }))
          : [],
        person: personData.userPOList
          ? personData.userPOList
              .sort((a: any, b: any) => a.sort - b.sort)
              .map((ele: any) => ({
                primaryId: ele.id,
                userId: ele.userId,
                deptId: ele.deptId,
                userName: ele.userName,
                deptName: ele.deptName,
              }))
          : [],
        customPerson: personData.outUserPOList
          ? personData.outUserPOList
              .sort((a: any, b: any) => a.outUserSort - b.outUserSort)
              .map((ele: any) => ({
                primaryId: ele.id,
                name: ele.outUserName,
                phone: ele.outPhone,
              }))
          : [],
      };
    };
    const intervalUnitList = [
      {
        label: '分钟',
        value: 'MINUTE',
      },
      {
        label: '小时',
        value: 'HOUR',
      },
      {
        label: '天',
        value: 'DAY',
      },
    ];
    const happened = data.noticeRuleModuleCreateReqVOList.find(
      (ele: any) => ele.ruleLevel === 'RULE'
    );
    const upgrade = data.noticeRuleModuleCreateReqVOList
      .filter((ele: any) => ele.ruleLevel === 'RULE_IMPROVE')
      .sort((a: any, b: any) => a.sort - b.sort)
      .map((item: any) => ({
        type: 'upgrade',
        interval: item.intervalNum,
        maxTimes: item.frequency,
        intervalUnit: item.unit,
        intervalUnitName: intervalUnitList.find(
          (ele) => ele.value === item.unit
        )?.label,
        upgradeInterval: item.ruleImproveNum,
        upgradeIntervalUnit: item.ruleImproveUnit,
        upgradeIntervalUnitName: intervalUnitList.find(
          (ele) => ele.value === item.ruleImproveUnit
        )?.label,
        notifyMethod:
          item.noticeTemplateList &&
          item.noticeTemplateList.map((ele: any) => ele.id),
        ...handlePeronsObj(item),
      }));
    const recover = data.noticeRuleModuleCreateReqVOList.find(
      (ele: any) => ele.ruleLevel === 'RULE_RECOVERY'
    ) || {
      customPerson: [],
      type: 'recover',
    };
    return {
      happened: {
        allTime: happened.executeCycle.includes('1'),
        onDay: happened.executeCycle.includes('2'),
        onTimeRanger: happened.executeCycle.includes('3'),
        days: happened.weekDays,
        intervalUnit: happened.unit,
        intervalUnitName: intervalUnitList.find(
          (ele) => ele.value === happened.unit
        )?.label,
        timeRange: 'all',
        timeRanger:
          happened.periodStart && happened.periodEnd
            ? [
                formatDate(happened.periodStart, 'HH:mm:ss'),
                formatDate(happened.periodEnd, 'HH:mm:ss'),
              ]
            : [],
        interval: happened.intervalNum,
        maxTimes: happened.frequency,
        notifyMethod:
          happened.noticeTemplateList &&
          happened.noticeTemplateList.map((ele: any) => ele.id),
        ...handlePeronsObj(happened),
        type: 'happened',
      },
      upgrade: upgrade,
      recover: {
        type: 'recover',
        notifyMethod:
          recover.noticeTemplateList &&
          recover.noticeTemplateList.map((ele: any) => ele.id),
        ...handlePeronsObj(recover),
      },
    };
  };
  return {
    getReqParams,
    getResParams,
  };
};
