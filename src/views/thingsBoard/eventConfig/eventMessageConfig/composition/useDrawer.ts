import { getPostDataAPI } from '@/api/enterpriseManage';
import { useUserStore } from '@/store';
import { TableColumnData, TableData } from '@arco-design/web-vue';
import { ref } from 'vue';

export const useDrawer = (tableData: any, type: string) => {
  const userStore = useUserStore();
  // ----------------------- 抽屉 -------------------------------
  const visible = ref(false);

  const drawerSelectForm = ref({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    deptId: '',
    condition: '',
    pageNo: 1,
    pageSize: 10,
    userId: '1',
  });
  const drawerTempSearchForm = ref({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    deptId: '',
    condition: '',
    pageNo: 1,
    pageSize: 10,
    userId: '1',
  });
  const allTableData = ref<TableData[]>([]);
  const drawerPostData = ref<any>({ list: [], total: 0 });

  const columns: TableColumnData[] = [
    {
      title: '岗位',
      dataIndex: 'jobName',
      width: 140,
      cellStyle: { width: '11%' },
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      width: 140,
      cellStyle: { width: '11%' },
    },
  ];
  const selectKeys = ref<string[]>(
    (tableData.value || []).map((item: any) => item.id)
  );

  const getDrawerPostData = async () => {
    const { data: res } = await getPostDataAPI(drawerSelectForm.value);
    drawerPostData.value = res;
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
    getDrawerPostData();
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
      deptId: '',
      condition: '',
      pageNo: 1,
      pageSize: 10,
      userId: '1',
    };
    drawerTempSearchForm.value = {
      enterpriseId: userStore.userInfo.enterpriseId as string,
      deptId: '',
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
    getDrawerPostData();
  };

  const pageSizeChange = (pageSize: number) => {
    drawerSelectForm.value.pageSize = pageSize;
    getDrawerPostData();
  };
  return {
    columns,
    visible,
    drawerSelectForm,
    drawerTempSearchForm,
    drawerPostData,
    selectKeys,
    openDrawer,
    drawerOk,
    drawerCancel,
    getDrawerPostData,
    currentChange,
    pageSizeChange,
  };
};
