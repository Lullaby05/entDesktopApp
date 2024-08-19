<template>
  <div class="enterprise-license-container">
    <img src="/src/assets/images/icon-企业证照数.png" alt="" />
    <div class="enterprise-license-content">
      <div class="enterprise-license-description"> 企业证照数 </div>
      <div class="enterprise-license-num"> {{ currentData.total.count }} </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, toRef } from 'vue';
  import { getArrByName, getCurrentByName } from './composition/useDataScreen';
  import { computed } from 'vue';

  const props = defineProps({
    data: {
      type: Array,
      default: () => [],
    },
  });

  const data = toRef(props, 'data');
  const currentData = computed<any>(() => {
    return {
      total: getCurrentByName(data.value, 'EntLicenseCount'),
    };
  });
</script>
<style lang="less" scoped>
  .enterprise-license-container {
    width: 15.71rem;
    height: 6.07rem;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1.07rem 1.93rem 1.07rem 0;
    border: 0.5px solid #3061db;
    box-sizing: border-box;
    font-size: 1.14rem;
    color: #ffffff;
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
    .enterprise-license-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.7rem;
    }
    .enterprise-license-num {
      font-family: 'Roboto';
      color: #00ddff;
      font-size: 2.14rem;
      font-weight: 700;
    }
  }
</style>
