<!-- 管控措施落实率 -->
<template>
  <div class="control-implemention-rate-container">
    <img src="/src/assets/images/danger-total.png" alt="" />
    <div class="description-text">
      <div class="rate-text">管控措施落实率</div>
      <div class="rate-num">{{ Math.round(currentData) || 0 }}% </div>
    </div>
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
      data.value['riskControl'] && data.value['riskControl'].controlMeasureRate
    );
  });
</script>
<style lang="less" scoped>
  .control-implemention-rate-container {
    width: 15.71rem;
    height: 7.14rem;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 0.5px solid #3061db;
    font-size: 1.14rem;
    color: #ffffff;
    box-sizing: border-box;
    padding: 1.57rem 1.93rem 1.57rem 1.21rem;
    background: linear-gradient(
      180deg,
      #043c95 0%,
      #042144 14.22%,
      #04173e 51.46%,
      #072d5e 87.86%,
      #043e97 100%
    );
    box-shadow: 0px 0px 3px #03fff6;
    img {
      height: 100%;
      object-fit: cover;
    }
    .description-text {
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.7rem;
    }
    .rate-num {
      font-family: 'Roboto';
      color: #00ddff;
      font-size: 2.14rem;
      font-weight: 700;
    }
  }
</style>
