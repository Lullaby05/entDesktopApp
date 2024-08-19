import { getStaffDataAPI } from '@/api/enterpriseManage';
import { getEmergencyPlanPerson } from '@/api/thingsBoard';
import { useThingsBoardStore, useUserStore } from '@/store';
import { StaffData } from '@/views/enterpriseManage/staffManage';
import { TableColumnData, TableData } from '@arco-design/web-vue';
import { ref } from 'vue';

export const useDrawer = (tableData: any, type: string) => {
  const userStore = useUserStore();

  // tab
  const tabList = [
    {
      code: 0,
      name: '全部',
    },
    {
      code: 1,
      name: '相关人员',
    },
    {
      code: 2,
      name: '值班人员',
    },
    {
      code: 3,
      name: '应急队伍成员',
    },
  ];
  const activeKey = ref(0);
  const changeTab = (key: any) => {
    activeKey.value = key;
    getDrawerStaffData();
  };
  // ----------------------- 抽屉 -------------------------------
  const visible = ref(false);

  const drawerSelectForm = ref({
    deptId: '',
    name: '',
    pageNo: 1,
    pageSize: 10,
  });
  const drawerTempSearchForm = ref({
    deptId: '',
    name: '',
    pageNo: 1,
    pageSize: 10,
  });
  const allTableData = ref<TableData[]>([]);
  const drawerStaffData = ref<StaffData>({ list: [], total: 0 });

  const columns: TableColumnData[] = [
    {
      title: '员工姓名',
      width: 100,
      dataIndex: 'userName',
      cellStyle: { width: '8%' },
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      width: 120,
      cellStyle: { width: '9%' },
    },
    {
      title: '联系方式',
      dataIndex: 'tel',
      width: 150,
      cellStyle: { width: '12%' },
    },
    {
      title: '备注',
      dataIndex: 'remark',
      slotName: 'remark',
    },
  ];
  const selectKeys = ref<string[]>(
    (tableData.value || []).map((item: any) => item.id)
  );
  const { getEventRecordId } = useThingsBoardStore();
  const getDrawerStaffData = async () => {
    const id = getEventRecordId();
    const { data: res } = await getEmergencyPlanPerson(id, {
      ...drawerSelectForm.value,
      type: activeKey.value,
    });
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
      name: '',
      pageNo: 1,
      pageSize: 10,
      userId: '1',
    };
    drawerTempSearchForm.value = {
      enterpriseId: userStore.userInfo.enterpriseId as string,
      deptId: '',
      name: '',
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
    tabList,
    activeKey,
    changeTab,
  };
};
