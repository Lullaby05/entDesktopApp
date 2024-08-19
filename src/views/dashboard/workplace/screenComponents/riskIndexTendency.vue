<!-- 风险指数图表 -->
<template>
  <div class="risk-tendency-container">
    <div class="risk-tendency-echarts" ref="echartsRef"></div>
  </div>
</template>

<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { onMounted } from 'vue';
  import { ref } from 'vue';
  import { findFontSize } from './composition/useDataScreen';
  const echartsRef = ref();
  const option: echarts.EChartsOption = {
    tooltip: {
      trigger: 'axis',
      formatter: function (params: any) {
        params = params[0];
        var date = new Date(params.value[0]);
        return (
          date.getFullYear() +
          '/' +
          (date.getMonth() + 1) +
          '/' +
          date.getDate() +
          ' : ' +
          params.value[1]
        );
      },
      axisPointer: {
        animation: false,
      },
    },
    grid: {
      top: '30px',
      bottom: '19%',
      left: '0%',
      right: '10px',
      containLabel: true,
    },
    xAxis: {
      type: 'time',
      axisLabel: {
        formatter: `{d}日`,
        color: 'rgba(255, 255, 255, 0.5)',
        fontSize: findFontSize(12),
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        show: false,
      },
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#ffffff',
        fontSize: findFontSize(12),
      },
      splitLine: {
        lineStyle: {
          type: 'dotted',
          color: '#4346D3',
        },
      },
    },
    series: [
      {
        data: [
          ['2024/1/1', 25],
          ['2024/1/5', 20],
          ['2024/1/10', 15],
          ['2024/1/15', 30],
          ['2024/1/20', 25],
          ['2024/1/25', 25],
          ['2024/1/30', 40],
        ],
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: findFontSize(6),
        itemStyle: {
          normal: {
            shadowBlur: 5,
            shadowColor: '#ffffff',
            color: '#ffffff',
            lineStyle: {
              color: '#14C9C9',
            },
          },
        },
      },
    ],
  };

  onMounted(() => {
    initChart();
  });

  const initChart = () => {
    const myChart = echarts.init(echartsRef.value as unknown as HTMLElement);
    window.addEventListener('resize', function () {
      myChart && myChart.resize();
    });
    option && myChart.setOption(option);
  };
</script>
<style lang="less" scoped>
  .risk-tendency-container {
    width: 100%;
    height: 100%;
  }

  .risk-tendency-echarts {
    width: 100%;
    height: 100%;
  }
</style>
