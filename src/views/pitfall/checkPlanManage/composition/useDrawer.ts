import { getCheckList } from '@/api/pitfall';
import {
  TableColumnData,
  TableData,
  TableRowSelection,
} from '@arco-design/web-vue/es/table/interface';
import { onBeforeMount, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';

export const useDrawer = (form: any) => {
  const router = useRouter();
  // 抽屉相关
  const drawerVisible = ref(false);
  const drawerFormData = ref({
    checkName: '',
    checkTableIds: [],
    pageNo: 1,
    pageSize: 10,
  });
  const tempDrawerFormData = ref({
    checkName: '',
    checkTableIds: [],
    pageNo: 1,
    pageSize: 10,
  });
  //   抽屉表格相关
  const drawerTableData = ref<{ total?: number; list?: TableData[] }>({
    total: 0,
    list: [],
  });
  const drawerTableColumns: TableColumnData[] = [
    { title: '排查表名称', dataIndex: 'checkName' },
    { title: '检查内容数', dataIndex: 'checkContent' },
  ];
  const rowSelection = reactive<TableRowSelection>({
    type: 'checkbox',
    showCheckedAll: true,
  });
  const allTableData = ref<TableData[]>([]);

  const selectedKeys = ref<string[]>([]);

  const handleDelTable = (
    id: string,
    callback: (keys: string[], tableData: TableData[], type: string) => void
  ) => {
    selectedKeys.value = selectedKeys.value.filter((key) => key !== id);
    callback && callback(selectedKeys.value, allTableData.value || [], 'del');
  };

  const handleOk = (
    callback: (keys: string[], tableData: TableData[]) => void
  ) => {
    callback && callback(selectedKeys.value, allTableData.value || []);
    drawerVisible.value = false;
  };
  const handleCancel = () => {
    drawerVisible.value = false;
    selectedKeys.value = [];
  };

  const getDrawerTableData = async () => {
    const params = {
      ...drawerFormData.value,
      status: 1,
    };
    const res = await getCheckList(params);
    drawerTableData.value = res.data;
    allTableData.value = deduplicateByProperty(
      [...res.data.list, ...allTableData.value],
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

  const selectionChange = (rowKeys: any[], rowKey: any) => {
    if (selectedKeys.value.includes(rowKey)) {
      const index = selectedKeys.value.findIndex(
        (item: string) => item === rowKey
      );
      selectedKeys.value.splice(index, 1);
    } else {
      selectedKeys.value.push(rowKey);
    }
  };

  const selectionAllChange = (checked: Boolean) => {
    const ids = drawerTableData.value.list!.map((item: any) => item.id);
    if (checked) {
      selectedKeys.value.push(...ids);
    } else {
      selectedKeys.value = selectedKeys.value.filter(
        (ele) => !ids.includes(ele)
      );
    }
  };

  onBeforeMount(() => {
    getDrawerTableData();
  });

  // 分页处理
  const pageChange = (currentPage: number) => {
    drawerFormData.value.pageNo = currentPage;
    getDrawerTableData();
  };
  const pageSizeChange = (currentPageSize: number) => {
    drawerFormData.value.pageSize = currentPageSize;
    getDrawerTableData();
  };
  const toFormDesign = () => {
    router.push({
      name: 'CheckContentAdd',
      query: {
        type: 'isAdd',
      },
    });
  };

  return {
    drawerVisible,
    drawerFormData,
    tempDrawerFormData,
    handleOk,
    handleCancel,
    drawerTableData,
    drawerTableColumns,
    rowSelection,
    selectedKeys,
    selectionAllChange,
    selectionChange,
    toFormDesign,
    pageChange,
    pageSizeChange,
    getDrawerTableData,
    handleDelTable,
  };
};
