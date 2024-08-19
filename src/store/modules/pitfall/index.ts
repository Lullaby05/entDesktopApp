import { defineStore } from 'pinia';
import { ref } from 'vue';

const usePitfallStore = defineStore(
  'pitfall',
  () => {
    // 排查表回来继续填写
    const checkContent = ref<any>({
      checkItem: '',
      problemSpot: '',
      checkStandard: '',
      formItems: undefined,
    });

    const addCheckContent = (val: object) => {
      checkContent.value = val;
    };

    const clearCheckContent = () => {
      checkContent.value = {
        checkItem: '',
        problemSpot: '',
        checkStandard: '',
        formItems: undefined,
      };
    };

    const batchChooseKeys = ref<any[]>([]);

    const addChooseKeys = (keys: any[]) => {
      batchChooseKeys.value = keys;
    };

    const clearChooseKeys = () => {
      batchChooseKeys.value = [];
    };

    // 排查表内新增排查内容回来继续填写
    const contentList = ref<any>({
      checkName: '',
      checkContentIds: [],
      tableVisible: false,
      selectedKeys: [],
      contentTableData: [],
    });
    const addContentList = (val: object) => {
      contentList.value = val;
    };
    const clearContentList = () => {
      contentList.value = {
        checkName: '',
        checkContentIds: [],
        tableVisible: false,
        selectedKeys: [],
        contentTableData: [],
      };
    };

    // tab页切换后出来需要保持进去时候的tab
    const daliyCheckListTab = ref<string>('');

    const snapShotListTab = ref<string>('');

    const checkPlanListTab = ref<string>('');

    const planCheckListTab = ref<string>('');

    const pitfallListTab = ref<string>('');

    return {
      batchChooseKeys,
      addChooseKeys,
      clearChooseKeys,
      checkContent,
      addCheckContent,
      clearCheckContent,
      contentList,
      addContentList,
      clearContentList,
      daliyCheckListTab,
      snapShotListTab,
      checkPlanListTab,
      planCheckListTab,
      pitfallListTab,
    };
  },
  {
    persist: {
      enabled: true,
    },
  }
);

export default usePitfallStore;
