<template>
  <div class="control-risk-container">
    <div class="title">
      <i class="iconfont icon-icon-fengxianbianshiyuguankong"></i>
      {{ $t('dashboard.riskIdentificationAndControl') }}
    </div>
    <div class="content">
      <div class="grid">
        <div class="risk-point-container">
          <riskPointNum :data="data" />
        </div>
        <div class="risk-level-num-container">
          <riskLevelNumTag :data="data" />
        </div>
      </div>
      <div class="grid">
        <div class="danger-risk-num-container">
          <dangerRiskNum :data="data" />
        </div>
        <div class="large-risk-container">
          <largeRiskNum :data="data" />
        </div>
        <div class="control-measure-container">
          <controlMeasureNum :data="data" />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import riskLevelNumChart from '../workplaceComponents/riskLevelNumChart.vue';
  import riskLevelNumTag from './riskLevelNumTag.vue';
  import riskPointNum from '../workplaceComponents/riskPointNum.vue';
  import dangerRiskNum from '../workplaceComponents/dangerRiskNum.vue';
  import largeRiskNum from '../workplaceComponents/largeRiskNum.vue';
  import controlMeasureNum from '../workplaceComponents/controlMeasureNum.vue';
  import division from '../screenComponents/division.vue';
  import { toRef } from 'vue';

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  const data = toRef(props, 'data');
</script>
<style lang="less" scoped>
  .control-risk-container {
    border-radius: 4px;
    background-color: var(--bg2);
    display: flex;
    flex-direction: column;
    padding: 1.07rem 0.71rem;
    width: 26.32%;
    height: 24.42vh;
    box-shadow: var(--color-box-shadow);
    .title {
      font-size: 1rem;
      font-family: 'Alibaba-Medium';
      color: var(--color-text-black);
      margin-bottom: 0.64rem;
      display: flex;
      align-items: center;
      gap: 0.71rem;
      line-height: 1;
      .iconfont {
        border-radius: 4px;
        background-color: var(--color-orange);
        font-size: 1rem;
        padding: 3px;
        color: #ffffff;
      }
    }
    .content {
      // padding: 0 0.5rem 0 0.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      height: 100%;
      gap: 5%;
      .grid {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        border-radius: 4px;
        border: 0.5px solid var(--color-border);
        padding: 0.64rem;
        background-color: var(--bg3);
      }
    }
  }
</style>
