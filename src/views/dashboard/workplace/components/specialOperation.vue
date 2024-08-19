<template>
  <div class="special-operation-container">
    <div class="title">
      <i class="iconfont icon-icon-teshuzuoye"></i>
      {{ $t('dashboard.specialOperation.title') }}
    </div>
    <div class="content">
      <div
        style="display: grid; grid-template-rows: repeat(4, 1fr); height: 100%"
      >
        <operationInProgress
          :track-color="theme === 'dark' ? '#4b515e' : '#e0e0e0'"
          :data="operationData"
        />
        <operationAcceptance
          :track-color="theme === 'dark' ? '#4b515e' : '#e0e0e0'"
          :data="operationData"
        />
        <operationClose
          :track-color="theme === 'dark' ? '#4b515e' : '#e0e0e0'"
          :data="operationData"
        />
        <operationOvertime
          :track-color="theme === 'dark' ? '#4b515e' : '#e0e0e0'"
          :data="operationData"
        />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import operationInProgress from '../workplaceComponents/operationInProgress.vue';
  import operationAcceptance from '../workplaceComponents/operationAcceptance.vue';
  import operationClose from '../workplaceComponents/operationClose.vue';
  import operationOvertime from '../workplaceComponents/operationOvertime.vue';
  import { ref } from 'vue';
  import { getOperationStatistics } from '@/api/dashboard';
  import { useAppStore } from '@/store';
  import { storeToRefs } from 'pinia';

  const operationData = ref<any[]>([]);

  const initData = async () => {
    const { data = {} } = await getOperationStatistics();
    if (!data) return;
    const keys = Object.keys(data);
    const dataArr = keys.map((ele: any) => {
      const obj: any = {
        proceedNum: 'operationTodo',
        resultNum: 'operationNormalClose',
        abnormalCloseNum: 'operationAbnormalClose',
        timeoutCloseNum: 'operationTimeout',
      };
      return {
        name: obj[ele] ?? 'all',
        count: data[ele],
        percent: Number((data[ele] / (data['specialWorkNum'] || 1)).toFixed(2)),
      };
    });
    operationData.value.push(...dataArr);
  };

  initData();

  const appStore = useAppStore();
  const { theme } = storeToRefs(appStore);
</script>
<style lang="less" scoped>
  .special-operation-container {
    border-radius: 4px;
    background-color: var(--bg2);
    display: flex;
    flex-direction: column;
    padding: 1.07rem;
    padding-bottom: 0.5rem;
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
        background-color: var(--color-blue);
        font-size: 1rem;
        padding: 3px;
        color: #ffffff;
      }
    }
    .content {
      flex: 1;
      :deep(.operation-inProgress-echarts) {
        width: 100%;
        gap: 0.2rem;
        .description-text {
          color: var(--color-text-grey);
        }
      }
    }
  }
</style>
