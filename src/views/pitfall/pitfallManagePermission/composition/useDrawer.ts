import { getStaffDataAPI } from '@/api/enterpriseManage';
import { useUserStore } from '@/store';
import { StaffData } from '@/views/enterpriseManage/staffManage';
import { TableColumnData, TableData } from '@arco-design/web-vue';
import { ref } from 'vue';

export const useDrawer = (tableData: any, isNeedUser: boolean) => {
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
  const drawerStaffData = ref<StaffData>({ list: [], total: 0 });

  const columns: TableColumnData[] = [
    {
      title: '员工姓名',
      width: 100,
      dataIndex: 'userName',
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      width: 140,
    },
    {
      title: '岗位',
      dataIndex: 'jobName',
      width: 140,
    },
    {
      title: '手机号码',
      dataIndex: 'tel',
      width: 150,
    },
  ];
  const selectKeys = ref<string[]>(
    (tableData.value || []).map((item: any) => item.id)
  );

  const getDrawerStaffData = async () => {
    const params = {
      ...drawerSelectForm.value,
      userId: isNeedUser ? '1' : undefined,
    };
    const { data: res } = await getStaffDataAPI(params);
    drawerStaffData.value = res;
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
    getDrawerStaffData();
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
    getDrawerStaffData();
  };

  const pageSizeChange = (pageSize: number) => {
    drawerSelectForm.value.pageSize = pageSize;
    getDrawerStaffData();
  };
  return {
    columns,
    visible,
    drawerSelectForm,
    drawerTempSearchForm,
    drawerStaffData,
    selectKeys,
    openDrawer,
    drawerOk,
    drawerCancel,
    getDrawerStaffData,
    currentChange,
    pageSizeChange,
  };
};
