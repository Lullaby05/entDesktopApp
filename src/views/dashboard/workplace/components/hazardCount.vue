<template>
  <div class="hazard-count-container">
    <div class="title">
      <i class="iconfont icon-icon-yinhuanpaicha"></i>
      {{ $t('dashboard.hazardInspection') }}
    </div>
    <div class="content">
      <pitfallFinishedRateChart
        :key="theme"
        :textColor="theme === 'dark' ? '#ffffff' : '#333333'"
        :data="data"
        barColor="#43d1a2"
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { toRef } from 'vue';
  import pitfallFinishedRateChart from '../workplaceComponents/pitfallFinishedRateChart.vue';
  import { useAppStore } from '@/store';
  import { storeToRefs } from 'pinia';

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  const data = toRef(props, 'data');

  const appStore = useAppStore();
  const { theme } = storeToRefs(appStore);
</script>
<style lang="less" scoped>
  .hazard-count-container {
    border-radius: 4px;
    background-color: var(--bg2);
    display: flex;
    flex-direction: column;
    padding: 1.07rem;
    width: 21.43%;
    height: 24.42vh;
    position: relative;
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
        background-color: var(--color-green);
        font-size: 1rem;
        padding: 3px;
        color: #ffffff;
      }
    }
    .content {
      flex: 1;
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
</style>
