import {
  getSafetyMeasureList,
  getSafetyMeasurePublicList,
  safetyMeasureAddBatch,
} from '@/api/operation/safetyMeasure';
import { Message, TableColumnData, TableData } from '@arco-design/web-vue';
import { ref } from 'vue';

export const useSafetyDrawer = (getTableList: Function) => {
  // ------------------- 抽屉 -------------------------

  const drawerVisibale = ref(false);
  const drawerSelectForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
  });
  const drawerTempSearchForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
  });
  const publicSafetyMeasureData = ref<any>({ list: [], total: 0 });
  const allTableData = ref<TableData[]>([]);
  const drawerColumns: TableColumnData[] = [
    {
      title: '作业类型',
      dataIndex: 'operationTypeName',
      width: 200,
    },
    {
      title: '安全措施',
      dataIndex: 'securityMeasure',
    },
  ];
  const selectKeys = ref<string[]>([]);

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

  const getPublicSafetyMeasureData = async () => {
    const { data } = await getSafetyMeasurePublicList(drawerSelectForm.value);
    publicSafetyMeasureData.value = data;
    allTableData.value = deduplicateByProperty(
      [...data.list, ...allTableData.value],
      'id'
    );
  };

  const openDrawer = async () => {
    drawerVisibale.value = true;
    getPublicSafetyMeasureData();
  };

  const drawerOk = async () => {
    const result = allTableData.value
      .filter((item: TableData) => selectKeys.value.includes(item.id))
      .map((ele) => ({
        operationType: ele.operationType,
        securityMeasure: ele.securityMeasure,
      }));
    const { data, msg } = await safetyMeasureAddBatch(result);
    if (data) {
      Message.success(msg);
    } else {
      Message.warning(msg);
    }
    getTableList();
    drawerCancel();
  };

  const drawerCancel = () => {
    drawerSelectForm.value = drawerTempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
    };
    selectKeys.value = [];
    drawerVisibale.value = false;
  };

  const drawerCurrentChange = (current: number) => {
    drawerSelectForm.value.pageNo = current;
    getPublicSafetyMeasureData();
  };

  const drawerPageSizeChange = (pageSize: number) => {
    drawerSelectForm.value.pageSize = pageSize;
    getPublicSafetyMeasureData();
  };
  return {
    drawerVisibale,
    drawerOk,
    drawerCancel,
    drawerTempSearchForm,
    drawerSelectForm,
    getPublicSafetyMeasureData,
    publicSafetyMeasureData,
    selectKeys,
    drawerColumns,
    drawerCurrentChange,
    drawerPageSizeChange,
    openDrawer,
  };
};
