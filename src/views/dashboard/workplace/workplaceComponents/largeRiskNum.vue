<template>
  <div class="large-risk-container">
    <div class="large-risk-description">
      {{ $t('dashboard.largeDangerSourceCount') }}
    </div>
    <div class="large-risk-num"> {{ currentData || 0 }} </div>
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
      data.value['dangerCount'] && data.value['dangerCount'].highRiskDangerNum
    );
  });
</script>
<style lang="less" scoped>
  .large-risk-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    color: #ffffff;
    gap: 0.64rem;
    line-height: 1;
    .large-risk-description {
      font-size: 0.85rem;
      font-family: 'Alibaba';
      font-weight: 400;
      color: var(--color-text-grey);
    }
    .large-risk-num {
      font-size: 1.43rem;
      font-family: 'Roboto';
      color: var(--color-red);
      font-weight: 700;
    }
  }
</style>
