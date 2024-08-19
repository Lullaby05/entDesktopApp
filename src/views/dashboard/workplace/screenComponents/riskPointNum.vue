<template>
  <div class="risk-point-container">
    <div class="risk-point-description"> 风险点总数 </div>
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
    return (
      data.value['riskControl'] && data.value['riskControl'].riskPointTotalNum
    );
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
    border-radius: 0.3rem;
    // border: 0.1rem solid #000000;
    padding: 0.4rem 1.1rem;
    gap: 0.4rem;
    font-size: 1.14rem;
    margin-top: 1.1rem;
    color: #ffffff;
    .risk-point-num {
      font-size: 2.14rem;
      font-weight: 700;
      color: #00ddff;
      font-family: 'Roboto';
    }
  }
</style>
