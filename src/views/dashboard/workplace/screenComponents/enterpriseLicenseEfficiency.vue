<!-- 企业证照有效率 -->
<template>
  <div class="enterprise-license-rate-container">
    <img src="/src/assets/images/icon-企业证照有效率.png" alt="" />
    <div class="enterprise-license-rate-content">
      <div class="enterprise-license-rate-description">企业证照有效率</div>
      <div class="enterprise-license-rate-num"
        >{{ Math.round(currentData.total.percent * 100) }}%</div
      >
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref, toRef } from 'vue';
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
      total: getCurrentByName(data.value, 'EntLicenseValidCount'),
    };
  });
  // 计算差值，因为轨道颜色相反
  const formatDatePercent = computed(() => {
    return 1 - currentData.value.total.percent;
  });
</script>
<style lang="less" scoped>
  .enterprise-license-rate-container {
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
    .enterprise-license-rate-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.7rem;
    }
    .enterprise-license-rate-num {
      font-family: 'Roboto';
      color: #00ddff;
      font-size: 2.14rem;
      font-weight: 700;
    }
  }
</style>
