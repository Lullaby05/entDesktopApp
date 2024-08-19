type currentDict<T> = { value: T; description: string };
type Dict<T> = currentDict<T>[];

export enum statusEnum {
  CONFIRMED = '1',
  MISSTATEMENT = '2',
  TOBERECTIFY = '3',
  OVERDUE = '4',
  TOBEACCEPTANCE = '5',
  REEXAMINE = '6',
  RECTIFIED = '7',
}

export const useDict = () => {
  // 隐患类型数据字典
  const statusDict: Dict<string> = [
    { value: statusEnum.CONFIRMED, description: '待确认' },
    { value: statusEnum.MISSTATEMENT, description: '误报' },
    { value: statusEnum.TOBERECTIFY, description: '待整改' },
    { value: statusEnum.OVERDUE, description: '逾期未整改' },
    { value: statusEnum.TOBEACCEPTANCE, description: '整改待验收' },
    { value: statusEnum.REEXAMINE, description: '验收待复审' },
    { value: statusEnum.RECTIFIED, description: '整改完成' },
  ];

  // 隐患等级数据字典
  const troubleLevelDict: Dict<number> = [
    { value: 1, description: '一般隐患' },
    { value: 2, description: '重大隐患' },
  ];

  const rectifyResultDict: Dict<number> = [
    { value: 1, description: '整改合格' },
    { value: 0, description: '整改不合格' },
  ];

  const reexamineResultDict: Dict<number> = [
    { value: 1, description: '复审通过' },
    { value: 0, description: '复审拒绝' },
  ];

  // 根据字典和字典值查询字典描述
  const findDictDesc = <T>(dict: Dict<T>, value: T): string => {
    const result = dict.find((ele) => ele.value === value);
    return !result ? '' : result.description;
  };

  return {
    statusDict,
    troubleLevelDict,
    rectifyResultDict,
    reexamineResultDict,
    findDictDesc,
  };
};
