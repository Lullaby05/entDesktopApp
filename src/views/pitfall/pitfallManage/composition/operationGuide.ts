export const useOperationGuide = () => {
  const guideVisible = ref(false);
  const guideItems = [
    {
      title: '隐患处理权限配置',
      description:
        '为有隐患处理权限员工配置包括隐患确认、隐患验收及隐患复审权限',
    },
    {
      title: '隐患上报',
      description: '通过随手拍、设备智能监测或排查任务上报隐患',
    },
    {
      title: '隐患确认',
      description:
        '随手拍或设备监测上报的隐患需要由配置好的人员进行隐患是否属实确认，若确认为隐患，可一并指派人员进行整改',
    },
    {
      title: '隐患整改',
      description: '由指派的整改人进行隐患整改并在整改完成后上报整改情况',
    },
    {
      title: '隐患验收',
      description:
        '对上报的隐患整改情况进行验收，若为一般隐患，验收通过后，该隐患整改完成',
    },
    {
      title: '隐患复审',
      description:
        '若上报隐患为重大隐患，则在验收通过后需要进行复审，复审通过后，该隐患整改完成',
    },
  ];
  const handleOperationGuide = () => {
    guideVisible.value = true;
  };
  return { guideVisible, guideItems, handleOperationGuide };
};
