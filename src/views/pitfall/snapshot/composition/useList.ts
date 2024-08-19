import { onBeforeMount, onMounted, reactive, ref, toRefs } from 'vue';
import { useRouter } from 'vue-router';
import { dictResponseType, getPitfallDicApi } from '@/api';
import { TableColumnData, TableData } from '@arco-design/web-vue';
import { getPitfallTabs, getSnapshotList } from '@/api/pitfall';
import { handleOnKeyup } from '@/utils/event';

type btnType =
  | 'report'
  | 'urge'
  | 'edit'
  | 'confirm'
  | 'acceptance'
  | 'reexamine'
  | 'toDetail';

export const useList = (pitfallStore: any) => {
  const router = useRouter();

  // 隐患状态字典
  const dangerState = ref<dictResponseType[]>([]);
  // 隐患等级字典
  const dangerLevel = ref<dictResponseType[]>([]);
  const stateColorObj = ref<any>({});

  // 表格数据
  const snapshotData = ref<any>({});
  // ----------------搜索-----------------
  const selectForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
    dangerStateCode: pitfallStore.snapShotListTab,
  });
  const tempSearchForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
    dangerStateCode: pitfallStore.snapShotListTab,
  });
  const tabsList = ref<{ code: string; name: string; count: number }[]>([]);

  // -------------------------------表格------------------
  const columns: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
    },
    {
      title: '隐患描述',
      dataIndex: 'hazardDesc',
    },
    {
      title: '隐患位置',
      dataIndex: 'hazardAddr',
    },
    {
      title: '排查人',
      dataIndex: 'inspectorName',
    },
    {
      title: '排查时间',
      dataIndex: 'inspectTime',
    },
    {
      title: '隐患状态',
      dataIndex: 'dangerState',
      slotName: 'dangerState',
      bodyCellStyle: (record: TableData) => {
        return {
          color:
            stateColorObj.value[
              record.dangerStateCode === '3'
                ? record.rectifyStateCode
                : record.dangerStateCode
            ],
        };
      },
    },
    {
      title: '隐患等级',
      dataIndex: 'dangerLevel',
      bodyCellStyle: (record: TableData) => {
        const dangerLevelCode = record.dangerLevel
          ? record.dangerLevelCode
          : record.hidRiskLevelCode;
        return { color: dangerLevelCode === '1' ? '#F76560' : '#357cf0' };
      },
      slotName: 'dangerLevel',
    },
    {
      title: '操作',
      // width: 200,
      align: 'center',
      slotName: 'option',
      dataIndex: '',
      cellStyle: { width: '16%' },
    },
  ];

  // 催办弹窗相关
  const urgeModel = reactive({
    urgeModalVisible: false,
    handleCancel: () => {
      urgeModel.urgeForm.content = '';
      urgeModel.urgeModalVisible = false;
    },
    handleBeforeOk: () => {
      urgeModel.handleCancel();
    },
    urgeForm: {
      content: '',
    },
  });

  // 按钮点击事件
  const handleButtonClick = (btnType: btnType, record?: any): void => {
    const obj = {
      report: '整改上报',
      confirm: '隐患确认',
      acceptance: '隐患验收',
      edit: '隐患编辑',
      reexamine: '隐患复审',
      toDetail: '隐患详情',
    };
    switch (btnType) {
      case 'urge': {
        urgeModel.urgeModalVisible = true;
        break;
      }
      case 'report':
      case 'edit':
      case 'confirm':
      case 'acceptance':
      case 'reexamine':
      case 'toDetail': {
        router.push({
          name: 'SnapshotDetail',
          query: {
            type: record.rectifyFlag ? 'immediate' : btnType,
            title: obj[btnType],
            id: record.id,
            dangerStateCode: record.dangerStateCode,
            dangerLevelCode: record.dangerLevelCode
              ? record.dangerLevelCode
              : record.hidRiskLevelCode,
            rectifyCount: record.rectifyCount,
          },
        });
      }
    }
  };

  const getTableList = () => {
    const params = {
      ...selectForm.value,
      inspectStartTime:
        selectForm.value.inspectTime && selectForm.value.inspectTime[0],
      inspectEndTime:
        selectForm.value.inspectTime && selectForm.value.inspectTime[1],
      pageNo: selectForm.value.pageNo,
      pageSize: selectForm.value.pageSize,
    };
    delete params.inspectTime;
    getSnapshotList(params).then((res) => {
      snapshotData.value = res.data;
    });
  };

  const getTabList = async () => {
    const tabsListRes = await getPitfallTabs('1');
    const allTabsCounts = tabsListRes.data.reduce((pre: number, cur: any) => {
      return pre + cur.count;
    }, 0);
    tabsList.value = tabsListRes.data;
    tabsList.value.unshift({ code: '', name: '全部', count: allTabsCounts });
  };

  onBeforeMount(async () => {
    // 字典值获取
    const dangerStateRes = await getPitfallDicApi('hid_danger_state');
    dangerState.value = dangerStateRes.data;
    const dangerLevelRes = await getPitfallDicApi('hid_danger_level');
    dangerLevel.value = dangerLevelRes.data;

    // 将需要渲染的颜色值保存到stateColorObj中
    const colorObj: any = {
      gray: '#666',
      green: '#03bf16',
      blue: '#357cf0',
      red: '#F76560',
      orange: '#f59a23',
    };
    for (const i of dangerState.value) {
      stateColorObj.value[i.dictKey] = colorObj[i.remark as string];
    }

    // getTabList();
    getTableList();
  });

  onActivated(() => {
    // getTabList();
    getTableList();
  });

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getTableList();
    });
  });

  // 分页处理
  const pageChange = (currentPage: Number) => {
    selectForm.value.pageNo = currentPage;
    getTableList();
  };
  const pageSizeChange = (currentPageSize: Number) => {
    selectForm.value.pageSize = currentPageSize;
    getTableList();
  };
  // 重置操作
  const handleReset = () => {
    selectForm.value = {
      pageNo: selectForm.value.pageNo,
      pageSize: selectForm.value.pageSize,
    };
    tempSearchForm.value = {
      pageNo: selectForm.value.pageNo,
      pageSize: selectForm.value.pageSize,
    };
    getTableList();
  };

  return {
    selectForm,
    tempSearchForm,
    columns,
    snapshotData,
    handleButtonClick,
    pageChange,
    getTableList,
    handleReset,
    pageSizeChange,
    // dangerState,
    dangerLevel,
    tabsList,
    ...toRefs(urgeModel),
  };
};
