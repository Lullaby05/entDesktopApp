import { onBeforeMount, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import { dictResponseType, getPitfallDicApi } from '@/api';
import { TableColumnData, TableData } from '@arco-design/web-vue';
import { getDailyCheckList, getDailyCheckListCount } from '@/api/pitfall';
import { handleOnKeyup } from '@/utils/event';

export const useList = (pitfallStore: any) => {
  const tabLists = ref<{ code: string; name: string; count: number }[]>([]);
  const route = useRoute();

  // 任务状态字典
  const taskState = ref<dictResponseType[]>([]);
  const stateColorObj = ref<any>({});
  // 排查周期字典
  // const checkRoutines = ref<dictResponseType[]>([]);
  const taskTypeList = ref<dictResponseType[]>([
    { dictKey: 1, dictValue: '风险管控' },
    { dictKey: 2, dictValue: '计划排查' },
  ]);

  // -------------------搜索--------------------------
  const searchForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
    taskStateCode: pitfallStore.daliyCheckListTab,
    checkPersonId: route.query.checkPersonId as string,
  });
  const tempSearchForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
    taskStateCode: pitfallStore.daliyCheckListTab,
    checkPersonId: route.query.checkPersonId as string,
  });
  // -----------------------表格-----------------------
  const columns: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
    },
    {
      title: '任务名称',
      dataIndex: 'taskName',
    },
    {
      title: '所属计划',
      dataIndex: 'planName',
    },
    {
      title: '任务来源',
      dataIndex: 'taskTypeName',
    },
    {
      title: '排查责任人',
      dataIndex: 'checkPerson',
    },
    {
      title: '任务状态',
      dataIndex: 'taskState',
      bodyCellStyle: (record: TableData) => {
        return { color: stateColorObj.value[record.taskStateCode] };
      },
    },
    // {
    //   title: '排查周期',
    //   dataIndex: 'checkCycle',
    // },
    // {
    //   title: '任务开始时间',
    //   dataIndex: 'taskStartTime',
    // },
    {
      title: '任务截止时间',
      dataIndex: 'taskEndTime',
    },
    // {
    //   title: '合格数',
    //   dataIndex: 'checkedItem',
    // },
    // {
    //   title: '不合格数',
    //   dataIndex: 'unCheckedItem',
    // },
    {
      title: '检查数量',
      dataIndex: 'checkItemNum',
    },
    {
      title: '隐患数量',
      dataIndex: 'hidNum',
    },
    {
      title: '操作',
      // width: 170,
      align: 'center',
      slotName: 'option',
      dataIndex: '',
      fixed: 'right',
      cellStyle: { width: '12%' },
    },
  ];

  const pageData = ref<{ total?: number; list?: TableData[] }>({
    total: 0,
    list: [],
  });

  const router = useRouter();

  const getTableList = () => {
    const params = {
      ...searchForm.value,
      // 开始时间范围
      startTime:
        searchForm.value.startTimeRange && searchForm.value.startTimeRange[0],
      startTwoTime:
        searchForm.value.startTimeRange && searchForm.value.startTimeRange[1],
      // 结束时间范围
      endTime:
        searchForm.value.endTimeRange && searchForm.value.endTimeRange[0],
      endTwoTime:
        searchForm.value.endTimeRange && searchForm.value.endTimeRange[1],
      pageNo: searchForm.value.pageNo,
      pageSize: searchForm.value.pageSize,
    };
    delete params.startTimeRange;
    delete params.endTimeRange;
    getDailyCheckList(params).then((res) => {
      pageData.value.total = res.data.total;
      pageData.value.list = res.data.list.map((ele: any) => ({
        ...ele,
        totalItems: ele.checkedItem + ele.unCheckNum + ele.unCheckedItem,
        taskTypeName: ele.taskType === 1 ? '风险管控' : '计划排查',
      }));
    });
  };

  const getTabsList = async () => {
    const tabsRes = await getDailyCheckListCount();
    const allTabsCounts = tabsRes.data.reduce((pre: number, cur: any) => {
      return pre + cur.count;
    }, 0);
    tabLists.value = tabsRes.data.filter((ele) => ele.code !== '3');
    tabLists.value.unshift({
      code: '',
      name: '全部',
      count: allTabsCounts,
    });
  };

  onBeforeMount(async () => {
    // 字典值获取
    const checkPlanStateRes = await getPitfallDicApi('check_task_state');
    taskState.value = checkPlanStateRes.data;
    // 将需要渲染的颜色值保存到stateColorObj中
    const colorObj: any = {
      gray: '#666',
      green: '#03bf16',
      blue: '#357cf0',
      red: '#F76560',
      orange: '#f59a23',
    };
    for (const i of taskState.value) {
      stateColorObj.value[i.dictKey] = colorObj[i.remark as string];
    }

    // const checkRoutinesRes = await getPitfallDicApi('check_cycle');
    // checkRoutines.value = checkRoutinesRes.data;

    getTabsList();

    getTableList();
  });

  onActivated(() => {
    getTabsList();

    getTableList();
  });

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      searchForm.value = tempSearchForm.value;
      getTableList();
    });
  });

  const toTaskPage = (row: any) => {
    router.push({
      name: 'ExecuteDailyTask',
      query: {
        taskId: row.id,
        taskName: row.taskName,
        checkTableIds: row.checkTableIds,
        type: 'dailyExecute',
        checkPerson: row.checkPerson,
        checkPersonId: row.checkPersonId,
        taskType: row.taskType,
      },
    });
  };

  //   跳转到详情页
  const toCheckPlanPage = (row?: any) => {
    router.push({
      name: 'CheckDailyTaskDetail',
      query: {
        id: row.id,
        checkPerson: row.checkPerson,
        taskStartTime: row.taskStartTime,
        taskEndTime: row.taskEndTime,
      },
    });
  };
  // 分页操作
  const pageChange = (currentPage: Number) => {
    searchForm.value.pageNo = currentPage;
    getTableList();
  };
  const pageSizeChange = (currentPageSize: Number) => {
    searchForm.value.pageSize = currentPageSize;
    getTableList();
  };
  // 重置操作
  const handleReset = () => {
    searchForm.value = {
      pageNo: searchForm.value.pageNo,
      pageSize: searchForm.value.pageSize,
      taskStateCode: pitfallStore.daliyCheckListTab,
      checkPersonId: route.query.checkPersonId as string,
    };
    tempSearchForm.value = {
      pageNo: searchForm.value.pageNo,
      pageSize: searchForm.value.pageSize,
      taskStateCode: pitfallStore.daliyCheckListTab,
      checkPersonId: route.query.checkPersonId as string,
    };
    getTableList();
  };

  return {
    tabLists,
    searchForm,
    tempSearchForm,
    columns,
    toTaskPage,
    toCheckPlanPage,
    pageData,
    taskTypeList,
    pageChange,
    pageSizeChange,
    handleReset,
    getTableList,
  };
};
