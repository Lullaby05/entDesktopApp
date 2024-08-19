import { onBeforeMount, reactive, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { useSign } from './useSign';
import { getPitfallDetail } from '@/api/pitfall';

type infoItemsType = {
  title: string;
  items: {
    id: number;
    field: string;
    value: any;
    type?: string;
  }[];
};

export const useDetail = (signRef: any, id: string, toBeRectified: boolean) => {
  const router = useRouter();
  const totalData = ref<any>({});

  const troubleInfoItems = ref<infoItemsType>();
  const checkInfoItems = ref<infoItemsType>();
  const rectifyDeliveryInfoItems = ref<infoItemsType>();
  const rectifyReportInfoItems = ref<infoItemsType>();
  const acceptanceInfoItems = ref<infoItemsType>();
  const reexamineInfoItems = ref<infoItemsType>();

  // 整改下发表单部分
  const troubleInfoForm = reactive({
    troubleInfoFormData: {
      createTime: '',
      rectifyDepartId: '',
      rectifyDepartName: '',
      rectifyName: '',
      rectifyId: '',
      rectifyTime: '',
      rectifyMeasures: '',
      rectifyStateName: '',
    },
    troubleInfoFormRules: {
      rectifyDepartId: [
        { required: true, message: '请选择责任部门', trigger: 'change' },
      ],
      rectifyId: [
        { required: true, message: '请选择整改责任人', trigger: 'change' },
      ],
      rectifyTime: [
        { required: true, message: '请选择限期整改时间', trigger: 'change' },
        {
          validator: (value: any, cb: Function) => {
            if (value) {
              const time = new Date(value);
              const now = new Date();
              if (time.getTime() < now.getTime()) {
                cb('限期整改时间不能小于当前时间');
              }
            }
            cb();
          },
        },
      ],
      rectifyMeasures: [
        { required: true, message: '请输入整改措施', trigger: 'change' },
      ],
    },
  });

  //   隐患确认表单部分
  const troubleForm = reactive({
    troubleFormData: {
      isHiddenDanger: undefined,
      remark: '',
      dangerLevelCode: '',
      rectifyDepartId: '',
      rectifyId: '',
      rectifyTime: '',
      rectifyMeasures: '',
    },
    troubleFormRules: {
      isHiddenDanger: [
        { required: true, message: '请选择隐患确认', trigger: 'change' },
      ],
      dangerLevelCode: [
        { required: true, message: '请选择隐患级别', trigger: 'change' },
      ],
      rectifyDepartId: [
        { required: true, message: '请选择责任部门', trigger: 'change' },
      ],
      rectifyId: [
        { required: true, message: '请选择整改责任人', trigger: 'change' },
      ],
      rectifyTime: [
        { required: true, message: '请选择限期整改时间', trigger: 'change' },
        {
          validator: (value: any, cb: Function) => {
            if (value) {
              const time = new Date(value);
              const now = new Date();
              if (time.getTime() < now.getTime()) {
                cb('限期整改时间不能小于当前时间');
              }
            }
            cb();
          },
        },
      ],
      rectifyMeasures: [
        { required: true, message: '请输入整改措施', trigger: 'change' },
      ],
    },
  });

  //   整改验收表单信息
  const rectifyAcceptanceForm = reactive({
    rectifyAcceptanceFormData: {
      checkAcceptResult: '',
      checkAcceptSignature: '',
      checkAcceptImages: [],
      checkRemark: '',
    },
    rectifyAcceptanceFormRules: {
      checkAcceptResult: [
        { required: true, message: '请选择验收结果', trigger: 'blur' },
      ],
      checkAcceptSignature: [
        { required: true, message: '请完成验收签名', trigger: 'blur' },
      ],
    },
  });

  // 整改复审表单信息
  const rectifyReexamineForm = reactive({
    rectifyReexamineFormData: {
      isRecheck: '',
      recheckSignature: '',
      recheckImages: [],
      recheckRemark: '',
    },
    rectifyReexamineFormRules: {
      isRecheck: [
        { required: true, message: '请选择复审结果', trigger: 'blur' },
      ],
      recheckSignature: [
        { required: true, message: '请完成复审签名', trigger: 'blur' },
      ],
    },
  });

  const initAllData = () => {
    // 隐患信息数据和显示字段
    troubleInfoItems.value = totalData.value.danger && {
      title: '排查信息',
      items: [
        {
          id: 1,
          field: '排查项目',
          value: totalData.value.danger.checkItem,
        },
        {
          id: 2,
          field: '问题点',
          value: totalData.value.danger.problemSpot,
        },
        {
          id: 3,
          field: '排查标准',
          value: totalData.value.danger.checkStandard,
        },
      ],
    };

    // 排查信息数据和显示字段
    checkInfoItems.value = totalData.value.danger && {
      title: '隐患信息',
      items: [
        {
          id: 1,
          field: '隐患描述',
          value: totalData.value.danger.hazardDesc,
        },
        {
          id: 2,
          field: '隐患级别',
          value: totalData.value.danger.hidRiskLevel,
          textColor:
            totalData.value.danger.hidRiskLevelCode === '1'
              ? '#d9001b'
              : '#357cf0',
        },
        {
          id: 3,
          field: '隐患位置',
          value: totalData.value.danger.hazardAddr,
        },
        {
          id: 4,
          field: '整改建议',
          value: totalData.value.danger.rectifyAdvise,
        },
        {
          id: 5,
          field: '排查人',
          value: totalData.value.danger.inspectorName,
        },
        {
          id: 6,
          field: '排查时间',
          value: totalData.value.danger.inspectTime,
        },
        {
          id: 7,
          field: '隐患数据来源',
          value: totalData.value.danger.dangerSourceName,
        },
        {
          id: 8,
          field: '现场图片',
          value: totalData.value.danger.sceneImages,
          type: 'image',
        },
      ],
    };

    //   整改下发信息数据和显示字段
    rectifyDeliveryInfoItems.value = totalData.value.rectifyInfo && {
      title: '整改下发信息',
      items: [
        {
          id: 1,
          field: '隐患级别',
          value: totalData.value.rectifyInfo.dangerLevel,
          textColor:
            totalData.value.rectifyInfo.dangerLevelCode === '1'
              ? '#d9001b'
              : '#357cf0',
        },
        {
          id: 2,
          field: '整改责任部门',
          value: totalData.value.rectifyInfo.rectifyDepartName,
        },
        {
          id: 3,
          field: '整改责任人',
          value: totalData.value.rectifyInfo.rectifyName,
        },
        {
          id: 4,
          field: '限期整改时间',
          value: totalData.value.rectifyInfo.rectifyTime,
        },
        {
          id: 5,
          field: '整改措施',
          value: totalData.value.rectifyInfo.rectifyMeasures,
        },
        {
          id: 6,
          field: '隐患确认人',
          value: totalData.value.rectifyInfo.confirmName,
        },
        {
          id: 7,
          field: '整改下发时间',
          value: totalData.value.rectifyInfo.createTime,
        },
        {
          id: 8,
          field: '整改状态',
          value: totalData.value.rectifyInfo.rectifyStateName,
        },
      ],
    };
    if (totalData.value.rectifyInfo && !toBeRectified) {
      rectifyDeliveryInfoItems.value!.items.splice(
        rectifyDeliveryInfoItems.value!.items.length - 1,
        1
      );
    }

    troubleInfoForm.troubleInfoFormData = totalData.value.rectifyInfo;

    //   整改上报信息数据和显示字段
    rectifyReportInfoItems.value = totalData.value.reportInfo && {
      title: '整改上报信息',
      items: [
        {
          id: 1,
          field: '整改责任部门',
          value: totalData.value.reportInfo.rectifyDepartName,
        },
        {
          id: 2,
          field: '整改责任人',
          value: totalData.value.reportInfo.rectifyName,
        },
        {
          id: 3,
          field: '整改情况',
          value: totalData.value.reportInfo.rectifySituation,
        },
        {
          id: 4,
          field: '整改图片',
          value: totalData.value.reportInfo.rectifyImages,
          type: 'image',
        },
        {
          id: 5,
          field: '整改上报时间',
          value: totalData.value.reportInfo.rectifyTime,
        },
      ],
    };

    //  验收信息数据和显示字段
    acceptanceInfoItems.value = totalData.value.acceptInfo && {
      title: '验收信息',
      items: [
        {
          id: 1,
          field: '验收人',
          value: totalData.value.acceptInfo.checkAcceptName,
        },
        {
          id: 2,
          field: '验收结果',
          value: totalData.value.acceptInfo.checkAcceptResult
            ? '验收合格'
            : '验收不合格',
        },
        {
          id: 3,
          field: '验收人签名',
          value: totalData.value.acceptInfo.checkAcceptSignature,
          type: 'sign',
        },
        {
          id: 4,
          field: '验收图片',
          value: totalData.value.acceptInfo.checkAcceptImages,
          type: 'image',
        },
        {
          id: 5,
          field: '备注',
          value: totalData.value.acceptInfo.checkRemark || '无',
        },
        {
          id: 6,
          field: '验收时间',
          value: totalData.value.acceptInfo.checkAcceptTime,
        },
      ],
    };

    //   复审信息数据和显示字段
    reexamineInfoItems.value = totalData.value.recheckInfo && {
      title: '复审信息',
      items: [
        {
          id: 1,
          field: '复审人',
          value: totalData.value.recheckInfo.verifierName,
        },
        {
          id: 2,
          field: '复审结果',
          value: totalData.value.recheckInfo.isRecheckName,
        },
        {
          id: 3,
          field: '复审人签名',
          value: totalData.value.recheckInfo.recheckSignature,
          type: 'sign',
        },
        {
          id: 4,
          field: '复审图片',
          value: totalData.value.recheckInfo.recheckImages,
          type: 'image',
        },
        {
          id: 5,
          field: '备注',
          value: totalData.value.recheckInfo.recheckRemark || '无',
        },
        {
          id: 6,
          field: '复审时间',
          value: totalData.value.recheckInfo.createTime,
        },
      ],
    };
  };

  //   签名相关
  const {
    signModalVisible,
    openSignModal,
    closeSignModal,
    clearSign,
    confirmSign,
  } = useSign(signRef);

  const handleClearSign = () => {
    clearSign();
  };
  const handleConfirm = (formName: string, formRef: any) => {
    if (formName === 'reexamineSignature') {
      rectifyReexamineForm.rectifyReexamineFormData.recheckSignature =
        confirmSign();
    } else {
      rectifyAcceptanceForm.rectifyAcceptanceFormData.checkAcceptSignature =
        confirmSign();
    }
    formRef.clearValidate();
  };

  onBeforeMount(async () => {
    const res = await getPitfallDetail(id);
    totalData.value = res.data;
    initAllData();
  });

  const goBack = () => {
    router.back();
  };

  return {
    goBack,
    troubleInfoItems,
    checkInfoItems,
    rectifyDeliveryInfoItems,
    rectifyReportInfoItems,
    acceptanceInfoItems,
    reexamineInfoItems,
    signModalVisible,
    totalData,
    openSignModal,
    closeSignModal,
    handleClearSign,
    handleConfirm,
    ...toRefs(troubleInfoForm),
    ...toRefs(troubleForm),
    ...toRefs(rectifyAcceptanceForm),
    ...toRefs(rectifyReexamineForm),
  };
};
