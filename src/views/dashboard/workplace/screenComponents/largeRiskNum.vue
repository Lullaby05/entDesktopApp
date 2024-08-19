<template>
  <div class="large-risk-container">
    <img src="/src/assets/images/large-danger.png" alt="" />
    <div class="large-risk-content">
      <div class="large-risk-description"> 重大危险源数 </div>
      <div class="large-risk-num"> {{ currentData || 0 }} </div>
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
      data.value['riskControl'] && data.value['riskControl'].greatDangerNum
    );
  });
</script>
<style lang="less" scoped>
  .large-risk-container {
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
    .large-risk-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.7rem;
    }
    .large-risk-num {
      font-family: 'Roboto';
      color: #ee3e3e;
      font-size: 2.14rem;
      font-weight: 700;
    }
  }
</style>
