<template>
  <div class="danger-risk-container">
    <div class="danger-risk-description">
      {{ $t('dashboard.dangerSourceTotalCount') }}
    </div>
    <div class="danger-risk-num"> {{ currentData || 0 }} </div>
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
    return (
      data.value['dangerCount'] && data.value['dangerCount'].dangerTotalNum
    );
  });
</script>
<style lang="less" scoped>
  .danger-risk-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
    gap: 0.64rem;
    font-size: 1rem;
    color: #ffffff;
    line-height: 1;
    .danger-risk-description {
      font-size: 0.85rem;
      font-family: 'Alibaba';
      font-weight: 400;
      color: var(--color-text-grey);
    }
    .danger-risk-num {
      font-size: 1.43rem;
      font-family: 'Roboto';
      color: var(--color-black-dark1);
      font-weight: 700;
    }
  }
</style>
