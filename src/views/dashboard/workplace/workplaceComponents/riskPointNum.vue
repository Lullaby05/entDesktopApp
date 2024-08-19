<template>
  <div class="risk-point-container">
    <div class="risk-point-description">
      {{ $t('dashboard.riskPointTotalNum') }}
    </div>
    <div class="risk-point-num"> {{ currentData || 0 }} </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, toRef } from 'vue';

  const props = defineProps({
    data: {
      type: Object,
      default: () => {},
    },
  });

  const data = toRef(props, 'data');
  const currentData = computed<any>(() => {
    return data.value['riskPoint'] && data.value['riskPoint'].riskPointTotalNum;
  });
</script>
<style lang="less" scoped>
  .risk-point-container {
    flex: 0 0 auto;
    width: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 0.64rem;
    font-size: 1rem;
    color: #ffffff;
    line-height: 1;
    .risk-point-description {
      font-size: 0.85rem;
      font-family: 'Alibaba';
      font-weight: 400;
      color: var(--color-text-grey);
    }
    .risk-point-num {
      font-size: 1.43rem;
      font-family: 'Roboto';
      color: var(--color-black-dark1);
      font-weight: 700;
    }
  }
</style>
