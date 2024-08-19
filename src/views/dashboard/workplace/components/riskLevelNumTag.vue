<!-- 风险等级数量图表 -->
<template>
  <div class="risk-level-num-container">
    <div class="risk-level-num-item red">
      <span class="num">{{ dataPercent.heavyRisk || 0 }}</span>
      <span class="label">重大风险</span>
    </div>
    <div class="risk-level-num-item orange">
      <span class="num">{{ dataPercent.largeRisk || 0 }}</span>
      <span class="label">较大风险</span>
    </div>
    <div class="risk-level-num-item yellow">
      <span class="num">{{ dataPercent.normalRisk || 0 }}</span>
      <span class="label">一般风险</span>
    </div>
    <div class="risk-level-num-item blue">
      <span class="num">{{ dataPercent.lowRisk || 0 }}</span>
      <span class="label">低风险</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed, ref, toRef } from 'vue';
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

  const dataPercent = computed(() => {
    if (!data.value['riskPoint']) return {};
    return {
      heavyRisk: data.value['riskPoint'].majorRiskNum,
      largeRisk: data.value['riskPoint'].largerRiskNum,
      normalRisk: data.value['riskPoint'].ordinaryRiskNum,
      lowRisk: data.value['riskPoint'].lowRiskNum,
    };
  });
</script>
<style lang="less" scoped>
  .risk-level-num-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    gap: 2px;
    color: #ffffff;
    .risk-level-num-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      line-height: 1;
      gap: 0.57rem;
      padding: 0.57rem 0.43rem;
      border-radius: 4px;
      width: 4.29rem;
      height: 3.72rem;
      .num {
        font-family: 'Roboto';
        font-size: 1.14rem;
        font-weight: 700;
      }
      .label {
        font-size: 0.85rem;
        font-weight: 400;
      }
    }
    .red {
      background-color: var(--color-red);
    }
    .orange {
      background-color: var(--color-orange);
    }
    .yellow {
      background-color: var(--color-yellow);
    }
    .blue {
      background-color: var(--color-blue);
    }
  }
</style>
