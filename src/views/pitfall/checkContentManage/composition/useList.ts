import { h, onBeforeMount, onMounted, ref } from 'vue';
import {
  TableColumnData,
  TableData,
} from '@arco-design/web-vue/es/table/interface';
import ConfirmModalBody from '@/components/confirm/index.vue';
import { useRouter } from 'vue-router';
import { Message, Modal } from '@arco-design/web-vue';
import {
  checkContentDel,
  checkContentExport,
  getCheckContentList,
} from '@/api/pitfall';
import { handleOnKeyup } from '@/utils/event';
import { usePitfallStore } from '@/store';
import { exportData } from '@/utils/utils';
import { defaultFormConfig } from '@/views/risk/gradedControl/composition/defaultFormConfig';

export const useList = () => {
  const router = useRouter();
  const pitfallStore = usePitfallStore();
  // 查询表单
  const searchForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
  });
  const tempSearchForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
  });

  // 表格配置
  const tableColumn: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
      align: 'center',
    },
    {
      title: '排查项目',
      dataIndex: 'checkItem',
      width: 150,
    },
    {
      title: '问题点',
      dataIndex: 'problemSpot',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '排查标准',
      dataIndex: 'checkStandard',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '创建人',
      dataIndex: 'dataSource',
      width: 150,
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      slotName: 'option',
      // width: 160,
      align: 'center',
    },
  ];
  // 表格数据
  const tableData = ref<{ total?: number; list?: TableData[] }>({
    total: 0,
    list: [],
  });

  // 获取数据
  const getTableList = () => {
    const params = {
      ...searchForm.value,
      pageNo: searchForm.value.pageNo,
      pageSize: searchForm.value.pageSize,
    };
    getCheckContentList(params).then((res) => {
      tableData.value = res.data;
    });
  };

  onBeforeMount(() => {
    getTableList();
  });

  onActivated(() => {
    getTableList();
  });

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      searchForm.value = tempSearchForm.value;
      getTableList();
    });
  });

  // 分页处理
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
    tempSearchForm.value = {
      pageNo: searchForm.value.pageNo,
      pageSize: searchForm.value.pageSize,
    };
    searchForm.value = {
      pageNo: searchForm.value.pageNo,
      pageSize: searchForm.value.pageSize,
    };
    getTableList();
  };

  const importModalVisible = ref(false);
  const modalTableColumns = [
    { title: '排查项目', dataIndex: 'checkItem' },
    { title: '问题点', dataIndex: 'problemSpot' },
    { title: '排查标准', dataIndex: 'checkStandard' },
  ];
  const checkContentImportCallback = (data: any) => {
    const defaultConfig = defaultFormConfig(true);
    return {
      createData: data.map((ele: any) => {
        return {
          ...ele,
        };
      }),
      formItems: JSON.stringify({
        design: defaultConfig,
      }),
    };
  };

  // 按钮事件
  const handleEvent = async (
    type: 'add' | 'edit' | 'delete' | 'batchImport' | 'export' | 'import',
    record?: any
  ) => {
    switch (type) {
      case 'add': {
        router.push({ name: 'CheckContentAdd', query: { type: 'isAdd' } });
        break;
      }
      case 'edit': {
        router.push({
          name: 'CheckContentEdit',
          query: { id: record.id, type: 'isEdit' },
        });
        break;
      }
      case 'delete': {
        Modal.open({
          title: '提示',
          content: () =>
            h(ConfirmModalBody, {
              text: record.checkItem,
            }),
          titleAlign: 'start',
          onOk: async () => {
            await checkContentDel(record.id);
            Message.success({
              content: '删除成功',
            });
            pitfallStore.clearCheckContent();
            let totalPage = Math.ceil(
              (tableData.value.total! - 1) / searchForm.value.pageSize
            );
            let currentPage =
              searchForm.value.pageNo > totalPage
                ? totalPage
                : searchForm.value.pageNo;
            searchForm.value.pageNo = currentPage < 1 ? 1 : currentPage;
            getTableList();
          },
        });
        break;
      }
      case 'batchImport': {
        router.push({ name: 'BatchChooseContent' });
        break;
      }
      case 'import': {
        importModalVisible.value = true;
        break;
      }
      case 'export': {
        try {
          const response = await checkContentExport();
          exportData(response, '', '');
          break;
        } catch (error) {
          console.error('文件导出失败', error);
          Message.warning('文件导出失败');
        }
      }
    }
  };

  return {
    tableColumn,
    searchForm,
    tableData,
    handleEvent,
    pageChange,
    pageSizeChange,
    tempSearchForm,
    handleReset,
    getTableList,
    importModalVisible,
    modalTableColumns,
    checkContentImportCallback,
  };
};
