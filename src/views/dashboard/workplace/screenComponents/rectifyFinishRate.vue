<!-- 整改完成率 -->
<template>
  <div class="rectify-finish-rate-container">
    <div class="rectify-finish-chart" ref="echartsRef"> </div>
    <div class="description-text">
      <span class="rate-text">整改完成率</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { markRaw, onMounted, ref, toRef, watch } from 'vue';
  import { findFontSize } from './composition/useDataScreen';
  import { computed } from 'vue';

  const echartsRef = ref();
  const myChart = ref();

  const props = defineProps({
    data: {
      type: Object,
      default: () => {},
    },
  });

  const data = toRef(props, 'data');

  const currentData = computed<any>(() => {
    return (
      data.value['riskGovern'] &&
      Math.round(data.value['riskGovern'].hidCorrectRate)
    );
  });

  const chartOption = (currentData: any) => {
    myChart.value.setOption({
      series: [
        {
          type: 'gauge',
          animation: true,
          radius: '120%',
          startAngle: 0,
          endAngle: 360,
          clockwise: false,
          min: 0,
          max: 100,
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitNumber: 20,
          splitLine: {
            show: true,
            length: findFontSize(17.3),
            lineStyle: {
              color: '#4237F3',
              width: findFontSize(5),
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              width: 0,
              opacity: 0,
            },
          },
          pointer: {
            show: false,
          },
          z: 1,
        },
        {
          type: 'gauge',
          animation: true,
          radius: '120%',
          startAngle: 0,
          endAngle: (360 * currentData) / 100,
          clockwise: false,
          min: 0,
          max: 100,
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: false,
          },
          splitNumber: currentData * 0.2,
          splitLine: {
            show: true,
            length: findFontSize(17.3),
            lineStyle: {
              color: '#EAEE2F',
              width: findFontSize(5),
            },
          },
          axisLine: {
            show: true,
            lineStyle: {
              width: 0,
              opacity: 0,
            },
          },
          pointer: {
            show: false,
          },
          detail: {
            color: '#EAEE2F',
            formatter: '{value}%',
            fontSize: findFontSize(20),
            fontWeight: 700,
            fontFamily: 'Oswald',
            offsetCenter: [0, 0],
          },
          title: {
            show: false,
            color: '#fff',
            fontSize: findFontSize(20),
          },
          z: 2,
          data: [{ value: currentData || 0 }],
        },
      ],
    });
  };

  watch(
    () => currentData.value,
    () => {
      chartOption(currentData.value);
    }
  );

  onMounted(() => {
    initChart();
  });

  const initChart = () => {
    myChart.value = markRaw(
      echarts.init(echartsRef.value as unknown as HTMLElement)
    );
    window.addEventListener('resize', function () {
      myChart.value && myChart.value.resize();
    });
    chartOption(currentData.value);
  };
</script>
<style lang="less" scoped>
  .rectify-finish-rate-container {
    width: 11rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.71rem;
    color: #ffffff;
    .rectify-finish-chart {
      width: 6.43rem;
      height: 6.43rem;
    }
    .description-text {
      height: fit-content;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      font-size: 0.71rem;
      line-height: 0.71rem;
      border-radius: 11.5px;
      background-color: rgba(102, 146, 255, 0.31);
      font-family: 'Alibaba';
      padding: 5px 7px 4px 6px;
    }
  }
</style>
