<!-- 正常关闭特殊作业图表 -->
<template>
  <div class="operation-inProgress-container">
    <img src="/src/assets/images/icon-normalClose.png" alt="" />
    <div class="operation-inProgress-echarts" ref="echartsRef">
      <div class="description-text">
        <span>正常关闭作业</span>
        <span>{{ progressData.count }}</span>
        <!-- <span>{{ (progressData.percent * 100).toFixed(0) + '%' }}</span> -->
      </div>
      <a-progress
        :show-text="false"
        :color="{
          '0%': '#6BC9C3',
          '100%': '#00BAAD',
        }"
        :track-color="props.trackColor"
        size="large"
        :stroke-width="5"
        :percent="progressData.percent"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { computed } from 'vue';
  import { toRef } from 'vue';
  const props = defineProps({
    trackColor: {
      type: String,
      default: 'rgba(107, 201, 195, 0.5)',
    },
    data: {
      type: Array,
      default: () => [],
    },
  });
  const data = toRef(props, 'data');
  const progressData = computed<any>(() => {
    return (
      data.value.find((item: any) => item.name === 'operationNormalClose') || {
        count: 0,
        percent: 0.0,
      }
    );
  });
</script>
<style lang="less" scoped>
  .operation-inProgress-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    img {
      width: 2.14rem;
      height: 2.14rem;
      object-fit: cover;
    }
  }
  .operation-inProgress-echarts {
    width: 100%;
    height: 100%;
    display: flex;
    gap: 0.36rem;
    align-items: center;
    justify-content: center;
    flex-direction: column;

    .description-text {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      color: #ffffff;
      font-size: 0.86rem;
      font-weight: 700;
      line-height: 0.86rem;
      span:nth-child(2) {
        margin-left: auto;
        // margin-right: 2rem;
      }
      span:nth-child(3) {
        flex: 0 0 2rem;
        text-align: right;
      }
    }
  }
</style>
