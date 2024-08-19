import { defineStore } from 'pinia';
import { ref } from 'vue';
import _ from 'lodash';

const useRiskStore = defineStore('riskStore', () => {
  const riskFormMap = ref<any>(new Map());

  const setRiskForm = (
    id: string,
    { formItems, isEdit }: { formItems: any; isEdit: boolean }
  ) => {
    if (riskFormMap.value.has(id)) {
      const oldFormItem = JSON.parse(riskFormMap.value.get(id).formItems)
        ? JSON.parse(riskFormMap.value.get(id).formItems).design
        : {};
      const newFormItem = JSON.parse(formItems) && JSON.parse(formItems).design;
      if (!_.isEqual(oldFormItem, newFormItem)) {
        riskFormMap.value.set(id, {
          formItems: formItems || null,
          isEdit: true,
        });
      }
    } else {
      riskFormMap.value.set(id, { formItems: formItems || null, isEdit });
    }
  };

  const getRiskForm = (id: string) => {
    return riskFormMap.value.get(id);
  };

  const clearRiskForm = () => {
    riskFormMap.value.clear();
  };

  return {
    riskFormMap,
    setRiskForm,
    getRiskForm,
    clearRiskForm,
  };
});

export default useRiskStore;
