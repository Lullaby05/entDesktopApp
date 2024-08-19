import { useUserStore } from '@/store';
import { TableColumnData, TableData } from '@arco-design/web-vue';
import { ref } from 'vue';

export const useDrawer = (tableData: any, type: string) => {
  const userStore = useUserStore();
  // ----------------------- 抽屉 -------------------------------
  const visible = ref(false);

  const drawerSelectForm = ref({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    groupPlanName: '',
    condition: '',
    pageNo: 1,
    pageSize: 10,
    userId: '1',
  });
  const drawerTempSearchForm = ref({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    groupPlanName: '',
    condition: '',
    pageNo: 1,
    pageSize: 10,
    userId: '1',
  });
  const allTableData = ref<TableData[]>([]);
  const drawerGroupData = ref<any>({ list: [], total: 0 });

  const columns: TableColumnData[] = [
    {
      title: '排班计划名称',
      dataIndex: 'groupPlanName',
      width: 140,
      cellStyle: { width: '11%' },
    },
    {
      title: '班组类型',
      dataIndex: 'groupTypeName',
      width: 140,
      cellStyle: { width: '11%' },
    },
    {
      title: '说明',
      dataIndex: 'groupDesc',
    },
  ];
  const selectKeys = ref<string[]>(
    (tableData.value || []).map((item: any) => item.id)
  );
  const fetchData = async (search: any) => {
    const allList = [
      {
        id: '1',
        groupPlanName: '常规巡逻计划',
        groupType: '1',
        groupTypeName: '安保组',
        groupDesc: '按照两班倒，24小时进行园区安全情况巡逻',
      },
      {
        id: '2',
        groupPlanName: '机加工工作计划',
        groupType: '2',
        groupTypeName: '机加工',
        groupDesc: '按照三班倒，按天进行机加工',
      },
      {
        id: '3',
        groupPlanName: '组装工作计划',
        groupType: '3',
        groupTypeName: '组装',
        groupDesc: '按照三班倒，按天进行组装工作',
      },
      {
        id: '4',
        groupPlanName: '总巡逻',
        groupType: '4',
        groupTypeName: '安全生产监控组',
        groupDesc: '按照排版，进行园区总体安全情况的把控',
      },
    ];
    const list = allList.filter((item) => {
      return item.groupPlanName.includes(search.groupPlanName);
    });
    return {
      code: 200,
      data: {
        list: list,
        total: list.length,
      },
    };
  };

  const getDrawerGroupData = async () => {
    const { data: res } = await fetchData(drawerSelectForm.value);
    drawerGroupData.value = res;
    allTableData.value = deduplicateByProperty(
      [...res.list, ...allTableData.value],
      'id'
    );
  };

  const deduplicateByProperty = (arr: any[], property: string) => {
    return arr.reduce((uniqueArr, item) => {
      if (
        !uniqueArr.some(
          (i: { [x: string]: any }) => i[property] === item[property]
        )
      ) {
        uniqueArr.push(item);
      }
      return uniqueArr;
    }, []);
  };

  const openDrawer = () => {
    getDrawerGroupData();
    visible.value = true;
    selectKeys.value = (tableData.value || []).map((item: any) => item.id);
  };

  const drawerOk = () => {
    const ids = [...new Set([...selectKeys.value])];
    const list: any[] = [];

    ids.forEach((item) => {
      const obj = allTableData.value.find((val) => val.id === item);
      if (obj) {
        list.push(obj);
      } else {
        const beforeObj = (tableData.value || []).find(
          (val: any) => val.id === item
        );
        list.push(beforeObj);
      }
      // obj ? list.push(obj) : '';
    });

    tableData.value = list;
    drawerCancel();
  };

  const drawerCancel = () => {
    drawerSelectForm.value = {
      enterpriseId: userStore.userInfo.enterpriseId as string,
      groupPlanName: '',
      condition: '',
      pageNo: 1,
      pageSize: 10,
      userId: '1',
    };
    drawerTempSearchForm.value = {
      enterpriseId: userStore.userInfo.enterpriseId as string,
      groupPlanName: '',
      condition: '',
      pageNo: 1,
      pageSize: 10,
      userId: '1',
    };
    selectKeys.value = [];
    visible.value = false;
  };

  const currentChange = (current: number) => {
    drawerSelectForm.value.pageNo = current;
    getDrawerGroupData();
  };

  const pageSizeChange = (pageSize: number) => {
    drawerSelectForm.value.pageSize = pageSize;
    getDrawerGroupData();
  };
  return {
    columns,
    visible,
    drawerSelectForm,
    drawerTempSearchForm,
    drawerGroupData,
    selectKeys,
    openDrawer,
    drawerOk,
    drawerCancel,
    getDrawerGroupData,
    currentChange,
    pageSizeChange,
  };
};
