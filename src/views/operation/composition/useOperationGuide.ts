import { useSafetyCertificationStore } from '@/store';
import { operationTypeEnum } from './useCertificateDict';

export const useOperationGuide = (certType: operationTypeEnum) => {
  const guideVisible = ref(false);
  const store = useSafetyCertificationStore();
  const needAnalysisArr = [
    {
      title: '作业申请',
      description: '按照作业申请要求填写作业申请表单',
    },
    {
      title: '气体分析',
      description:
        '对作业现场进行气体分析，记录气体分析结果，判断气体分析是否合格，并签名存档',
    },
    {
      title: '书面审查',
      description:
        '对上报的作业申请资料及气体分析结果进行书面审查，审查完成后签名存档',
    },
    {
      title: '现场核查',
      description:
        '对作业现场情况进行核查，判断现场情况是否适合作业，核查完成后签名存档',
    },
    {
      title: '安全交底',
      description: '由作业交底人对现场作业人员进行安全相关知识交底，并签名存档',
    },
    {
      title: '作业实施',
      description:
        '前面步骤均通过审查且达到作业开始时间后即可开始作业，作业中可根据实际情况暂停或关闭作业',
    },
    {
      title: '作业验收',
      description:
        '作业完成后，可由作业验收人进行作业验收，验收通过后，则该特殊作业作业完成',
    },
  ];
  const noNeedAnalysisArr = [
    {
      title: '作业申请',
      description: '按照作业申请要求填写作业申请表单',
    },
    {
      title: '书面审查',
      description:
        '对上报的作业申请资料及气体分析结果进行书面审查，审查完成后签名存档',
    },
    {
      title: '现场核查',
      description:
        '对作业现场情况进行核查，判断现场情况是否适合作业，核查完成后签名存档',
    },
    {
      title: '安全交底',
      description: '由作业交底人对现场作业人员进行安全相关知识交底，并签名存档',
    },
    {
      title: '作业实施',
      description:
        '前面步骤均通过审查且达到作业开始时间后即可开始作业，作业中可根据实际情况暂停或关闭作业',
    },
    {
      title: '作业验收',
      description:
        '作业完成后，可由作业验收人进行作业验收，验收通过后，则该特殊作业作业完成',
    },
  ];
  const needAnalysis = computed(() =>
    [
      operationTypeEnum.CONFINEDSPACE,
      operationTypeEnum.FIRE,
      operationTypeEnum.TEMPELECTRICITY,
    ].includes(certType)
  );

  const guideItems = needAnalysis.value ? needAnalysisArr : noNeedAnalysisArr;
  const handleOperationGuide = () => {
    guideVisible.value = true;
  };
  return { guideVisible, guideItems, handleOperationGuide };
};
