import { defineStore } from 'pinia';
import { ref } from 'vue';

const useThingsBoardStore = defineStore(
  'thingsBoard',
  () => {
    const eventRecordId = ref('');
    const setEventRecordId = (id: string) => {
      eventRecordId.value = id;
    };
    const getEventRecordId = () => {
      return eventRecordId.value;
    };

    const emergencyListTab = ref<number | undefined>(undefined);

    return {
      setEventRecordId,
      getEventRecordId,
      emergencyListTab,
    };
  },
  {
    persist: {
      enabled: true,
    },
  }
);

export default useThingsBoardStore;
