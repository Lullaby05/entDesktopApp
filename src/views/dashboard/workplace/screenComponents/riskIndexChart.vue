<!-- 风险指数图表 -->
<template>
  <div class="risk-index-container">
    <div class="risk-index-echarts" ref="echartsRef"></div>
  </div>
</template>
<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { onMounted } from 'vue';
  import { ref } from 'vue';
  import { findFontSize } from './composition/useDataScreen';
  const echartsRef = ref();
  const option = {
    series: [
      {
        type: 'gauge',
        startAngle: 180,
        endAngle: 0,
        center: ['45%', '60%'],
        radius: '70%',
        min: 0,
        max: 100,
        splitNumber: 4,
        axisLine: {
          lineStyle: {
            width: findFontSize(8),
            color: [
              [
                1,
                new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                  { offset: 0, color: '#2A82E4' },
                  { offset: 0.25, color: '#00BAAD' },
                  { offset: 0.35, color: '#43CF7C' },
                  { offset: 0.5, color: '#FFEB3B' },
                  { offset: 0.75, color: '#FFC300' },
                  { offset: 0.86, color: '#F95757' },
                  { offset: 1, color: '#F95757' },
                ]),
              ],
            ],
          },
        },
        pointer: {
          width: findFontSize(2), //指针的宽度
          length: '100%', //指针长度，按照半圆半径的百分比
          shadowColor: '#ccc', //默认透明
          shadowBlur: 5,
          itemStyle: {
            color: 'auto',
          },
        },
        axisTick: {
          show: false,
        },
        splitLine: {
          distance: findFontSize(-16),
          length: findFontSize(8),
          lineStyle: {
            width: 1,
            color: '#ffffff',
          },
        },
        axisLabel: {
          color: '#ffffff',
          fontSize: findFontSize(12),
          distance: findFontSize(-20),
          formatter: function (value: number) {
            if (value === 25) {
              return '25';
            } else if (value === 50) {
              return '50';
            } else if (value === 75) {
              return '75';
            } else if (value === 100) {
              return '100';
            }
            return '0';
          },
        },
        title: {
          offsetCenter: ['40%', '40%'],
          fontSize: findFontSize(12),
          color: '#ffffff',
          fontFamily: 'Alibaba',
        },
        detail: {
          fontSize: findFontSize(24),
          fontFamily: 'Roboto',
          offsetCenter: ['-40%', '40%'],
          valueAnimation: true,
          color: '#ffffff',
          formatter: function (value: number) {
            return Math.round(value) + '';
          },
        },
        data: [
          {
            value: 19,
            name: '低风险',
          },
        ],
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
  .risk-index-container {
    width: 100%;
    height: 100%;
  }
  .risk-index-echarts {
    width: 100%;
    height: 100%;
  }
</style>
