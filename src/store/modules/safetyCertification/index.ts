import { operationTypeEnum } from '@/views/operation/composition/useCertificateDict';
import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

const useRiskStore = defineStore(
  'safetyCertificationStore',
  () => {
    const currentOperationType = ref<string>('');
    const setCurrentOperationType = (type: string) => {
      currentOperationType.value = type;
    };

    const currentOperationTypeName = computed(() => {
      const cerTypeEnum = {
        [operationTypeEnum.BLINDPLATE]: 'BlindPlateCertificateHandling',
        [operationTypeEnum.CONFINEDSPACE]: 'ConfinedSpaceCertificateHandling',
        [operationTypeEnum.GROUND]: 'GroundCertificateHandling',
        [operationTypeEnum.HIGHALTITUDE]: 'HighAltitudeCertificateHandling',
        [operationTypeEnum.FIRE]: 'FireCertificateHandling',
        [operationTypeEnum.HOIST]: 'HoistCertificateHandling',
        [operationTypeEnum.BROKENROAD]: 'BrokenRoadCertificateHandling',
        [operationTypeEnum.TEMPELECTRICITY]:
          'TempElectricityCertificateHandling',
      };
      return cerTypeEnum[currentOperationType.value as operationTypeEnum] ?? '';
    });

    const currentOperationTypeNameSimple = computed(() => {
      const cerTypeEnum = {
        [operationTypeEnum.BLINDPLATE]: 'BlindPlateCertificate',
        [operationTypeEnum.CONFINEDSPACE]: 'ConfinedSpaceCertificate',
        [operationTypeEnum.GROUND]: 'GroundCertificate',
        [operationTypeEnum.HIGHALTITUDE]: 'HighAltitudeCertificate',
        [operationTypeEnum.FIRE]: 'FireCertificate',
        [operationTypeEnum.HOIST]: 'HoistCertificate',
        [operationTypeEnum.BROKENROAD]: 'BrokenRoadCertificate',
        [operationTypeEnum.TEMPELECTRICITY]: 'TempElectricityCertificate',
      };
      return cerTypeEnum[currentOperationType.value as operationTypeEnum] ?? '';
    });

    const needAnalysis = computed(() => {
      // 需要分析的作业字典值
      return [
        operationTypeEnum.CONFINEDSPACE,
        operationTypeEnum.FIRE,
        operationTypeEnum.TEMPELECTRICITY,
      ].includes(currentOperationType.value as operationTypeEnum);
    });

    return {
      currentOperationType,
      setCurrentOperationType,
      needAnalysis,
      currentOperationTypeName,
      currentOperationTypeNameSimple,
    };
  },
  {
    persist: {
      enabled: true,
    },
  }
);

export default useRiskStore;
