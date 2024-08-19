<!-- 风险等级数量图表 -->
<template>
  <div class="risk-level-num-container">
    <div class="risk-level-num-echarts" ref="echartsRef">
      <a-progress
        :show-text="false"
        :style="{
          '--riskTitle': `'${$t('dashboard.majorRisk')}''`,
          '--riskContent': `'${
            data.riskPoint ? data.riskPoint.majorRiskNum : 0
          }'`,
          '--textColor': `'${props.color}'`,
          '--valueColor': `'${props.numColor}'`,
        }"
        color="#d9001b"
        :track-color="props.trackColor"
        class="progress"
        size="large"
        type="circle"
        :stroke-width="strokeWidth"
        :percent="dataPercent.heavyRisk"
      />
      <a-progress
        :show-text="false"
        :style="{
          '--riskTitle': `'${$t('dashboard.largerRisk')}''`,
          '--riskContent': `'${
            data.riskPoint ? data.riskPoint.largerRiskNum : 0
          }'`,
          '--textColor': `'${props.color}'`,
          '--valueColor': `'${props.numColor}'`,
        }"
        color="#f59a23"
        :track-color="props.trackColor"
        class="progress"
        size="large"
        type="circle"
        :stroke-width="strokeWidth"
        :percent="dataPercent.largeRisk"
      />
      <a-progress
        :show-text="false"
        :style="{
          '--riskTitle': `'${$t('dashboard.ordinaryRisk')}''`,
          '--riskContent': `'${
            data.riskPoint ? data.riskPoint.ordinaryRiskNum : 0
          }'`,
          '--textColor': `'${props.color}'`,
          '--valueColor': `'${props.numColor}'`,
        }"
        color="#eff325"
        :track-color="props.trackColor"
        class="progress"
        size="large"
        type="circle"
        :stroke-width="strokeWidth"
        :percent="dataPercent.normalRisk"
      />
      <a-progress
        :show-text="false"
        :style="{
          '--riskTitle': `'${$t('dashboard.lowRisk')}''`,
          '--riskContent': `'${
            data.riskPoint ? data.riskPoint.lowRiskNum : 0
          }'`,
          '--textColor': `'${props.color}'`,
          '--valueColor': `'${props.numColor}'`,
        }"
        color="#357CF0"
        :track-color="props.trackColor"
        class="progress"
        size="large"
        type="circle"
        :stroke-width="strokeWidth"
        :percent="dataPercent.lowRisk"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, toRef } from 'vue';
  import {
    findFontSize,
    getRandomInt,
  } from '../screenComponents/composition/useDataScreen';
  const props = defineProps({
    trackColor: {
      type: String,
      default: 'rgb(242,242,242)',
    },
    color: {
      type: String,
      default: '#ffffff',
    },
    numColor: {
      type: String,
      default: '#ffffff',
    },
    data: {
      type: Object,
      default: () => {},
    },
  });
  const data = toRef(props, 'data');

  const strokeWidth = findFontSize(8);

  const dataPercent = computed(() => {
    if (!data.value['riskPoint']) return {};
    const total = data.value['riskPoint'].riskPointTotalNum;
    return {
      heavyRisk:
        Math.round((data.value['riskPoint'].majorRiskNum / total) * 100) / 100,
      largeRisk:
        Math.round((data.value['riskPoint'].largerRiskNum / total) * 100) / 100,
      normalRisk:
        Math.round((data.value['riskPoint'].ordinaryRiskNum / total) * 100) /
        100,
      lowRisk:
        Math.round((data.value['riskPoint'].lowRiskNum / total) * 100) / 100,
    };
  });
</script>
<style lang="less" scoped>
  .risk-level-num-container {
    width: 100%;
    height: 100%;
  }
  .risk-level-num-echarts {
    width: fit-content;
    height: fit-content;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    width: 100%;
    height: 100%;
    :deep(.arco-progress-circle-wrapper) {
      width: 4.2rem !important;
      height: 4.2rem !important;
      margin: 0 0.2vw;
    }
    .progress {
      position: relative;
      display: flex;
      --riskTitle: '';
      --riskContent: '';
      --textColor: #ffffff;
      --valueColor: #ffffff;
      &::before {
        content: var(--riskTitle);
        width: 4rem;
        font-size: 0.71rem;
        height: fit-content;
        position: absolute;
        text-align: center;
        top: 50%;
        left: 50%;
        color: var(--textColor);
        transform: translate(-50%, calc(-50% - 0.5rem));
      }
      &::after {
        content: var(--riskContent);
        width: 4rem;
        font-size: 1rem;
        text-align: center;
        height: fit-content;
        position: absolute;
        top: 50%;
        left: 50%;
        color: var(--valueColor);
        transform: translate(-50%, calc(-50% + 0.8rem));
      }
    }
  }
</style>
