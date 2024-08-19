import { getCheckContentList } from '@/api/pitfall';
import {
  TableColumnData,
  TableData,
  TableRowSelection,
} from '@arco-design/web-vue/es/table/interface';
import { onBeforeMount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { usePitfallStore } from '@/store';

export const useDrawer = (form: any, contentTableData: any) => {
  const router = useRouter();
  const pitfallStore = usePitfallStore();
  // 抽屉相关
  const drawerVisible = ref(false);
  const drawerFormData = ref({
    checkItem: '',
    problemSpot: '',
    pageSize: 10,
    pageNo: 1,
  });
  const drawerTempSearchForm = ref({
    checkItem: '',
    problemSpot: '',
    pageSize: 10,
    pageNo: 1,
  });

  //   抽屉表格相关
  const drawerTableData = ref<{ total?: number; list?: TableData[] }>({
    total: 0,
    list: [],
  });
  const drawerTableColumns: TableColumnData[] = [
    {
      title: '排查项目',
      dataIndex: 'checkItem',
      slotName: 'checkItem',
      titleSlotName: 'checkItemTitle',
      width: 200,
    },
    {
      title: '问题点',
      dataIndex: 'problemSpot',
      slotName: 'problemSpot',
      titleSlotName: 'problemSpotTitle',
    },
    {
      title: '排查标准',
      dataIndex: 'checkStandard',
      slotName: 'checkStandard',
      titleSlotName: 'checkStandardTitle',
    },
  ];
  const rowSelection = reactive<TableRowSelection>({
    width: 60,
    type: 'checkbox',
    showCheckedAll: true,
  });
  const allTableData = ref<TableData[]>([]);

  const selectedKeys = ref<string[]>([]);

  const handleOk = (
    callback: (keys: string[], tableData: TableData[]) => void
  ) => {
    callback && callback(selectedKeys.value, allTableData.value || []);
    // selectedKeys.value = [];
    drawerVisible.value = false;
  };
  const handleCancel = () => {
    // selectedKeys.value = [];
    selectedKeys.value = form.value.checkContentIds;
    drawerVisible.value = false;
  };

  const getDrawerTableData = async () => {
    const params = {
      ...drawerFormData.value,
    };
    const res = await getCheckContentList(params);
    drawerTableData.value = res.data;
    allTableData.value = deduplicateByProperty(
      [...res.data.list, ...allTableData.value],
      'id'
    );
  };

  const deduplicateByProperty = (arr: any[], property: string) => {
    return arr.reduce((uniqueArr, item) => {
      if (!uniqueArr.some((i: any) => i[property] === item[property])) {
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

  // 删除行，前端删除，保存后提交
  const removeRow = (
    record: TableData,
    callback: (keys: string[], tableData: TableData[], type: string) => void,
    rowIndex?: number
  ) => {
    let tableData = contentTableData.value;
    // 说明是新增的数据需要删除
    if (!record.id) {
      tableData = tableData.filter(
        (item: TableData, index: number) => index !== rowIndex
      );
      callback && callback(selectedKeys.value, tableData || [], 'delAdd');
      return;
    }
    selectedKeys.value = selectedKeys.value.filter((key) => key !== record.id);
    callback &&
      callback(selectedKeys.value, contentTableData.value || [], 'del');
  };

  onBeforeMount(() => {
    drawerVisible.value = pitfallStore.contentList.tableVisible;
    getDrawerTableData();
    selectedKeys.value = pitfallStore.contentList.selectedKeys;
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
    pitfallStore.addContentList({
      ...form.value,
      contentTableData: contentTableData.value,
      tableVisible: drawerVisible.value,
      selectedKeys: selectedKeys.value,
    });
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
    drawerTempSearchForm,
    handleOk,
    handleCancel,
    drawerTableData,
    drawerTableColumns,
    rowSelection,
    selectedKeys,
    selectionChange,
    selectionAllChange,
    toFormDesign,
    getDrawerTableData,
    pageChange,
    pageSizeChange,
    removeRow,
  };
};
