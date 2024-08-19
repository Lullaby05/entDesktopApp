<!-- 隐患趋势图表 -->
<template>
  <div class="pitfall-tendency-container">
    <div class="pitfall-tendency-echarts" ref="echartsRef"></div>
  </div>
</template>

<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { computed, markRaw, onMounted, toRef, watch } from 'vue';
  import { ref } from 'vue';
  import { findFontSize } from './composition/useDataScreen';
  import { formatDate } from '@/utils/utils';
  const echartsRef = ref();
  const myChart = ref();

  const props = defineProps({
    data: {
      type: Object,
      default: () => {},
    },
    timeRange: {
      type: String,
      required: true,
    },
  });

  const data = toRef(props, 'data');
  const timeRange = toRef(props, 'timeRange');

  const timeRangeToScopeObj: any = {
    yesterday: 'Hour',
    today: 'Hour',
    year: 'Month',
    lastQuarter: 'Month',
    quarter: 'Month',
  };

  const timeRangeScale = computed(() => {
    return (
      timeRangeToScopeObj[
        timeRange.value as unknown as keyof typeof timeRangeToScopeObj
      ] ?? 'Day'
    );
  });

  const currentData = computed<any>(() => {
    if (data.value['riskNumTrend'] && data.value['riskNumTrend'].length) {
      const normalPitfall: any = [];
      const seriousPitfall: any = [];
      const allPitfall: any = [];
      data.value['riskNumTrend'].forEach((item: any) => {
        normalPitfall.push([
          item.dateType.replaceAll('-', '/'),
          item.lowDangerNum,
        ]);
        seriousPitfall.push([
          item.dateType.replaceAll('-', '/'),
          item.highDangerNum,
        ]);
        allPitfall.push([item.dateType.replaceAll('-', '/'), item.hidSumNum]);
      });
      return {
        normalPitfall,
        seriousPitfall,
        allPitfall,
      };
    }
    return {
      normalPitfall: [],
      seriousPitfall: [],
      allPitfall: [],
    };
  });

  const chartOption = (currentData: any) => {
    if (currentData) {
      myChart.value.setOption({
        tooltip: {
          trigger: 'axis',
        },
        legend: {
          top: '0%',
          right: '0%',
          itemHeight: findFontSize(10),
          itemWidth: findFontSize(20),
          lineStyle: {
            width: 1,
          },
          textStyle: {
            color: '#ffffff',
            fontSize: findFontSize(10),
          },
          itemStyle: {
            decal: {
              symbol: 'rect',
              symbolSize: 0.5,
            },
          },
          data: ['重大隐患', '一般隐患', '全部隐患'],
        },
        grid: {
          top: '30%',
          left: '0%',
          right: '3%',
          bottom: '5%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            formatter: (params: any) => {
              if (timeRangeScale.value === 'Day') {
                return `${formatDate(params, 'DD')}日`;
              } else if (timeRangeScale.value === 'Month') {
                return `${params}月`;
              } else if (timeRangeScale.value === 'Hour') {
                return `${params.split(':')[0]}时`;
              }
              return `${params}`;
            },
            color: 'rgba(255, 255, 255, 0.5)',
          },
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false,
          },
        },
        yAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dotted',
              color: '#4346D3',
            },
          },
          interval: 5,
          axisLabel: {
            color: '#ffffff',
          },
        },
        series: [
          {
            name: '重大隐患',
            type: 'line',
            data: currentData.seriousPitfall,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              normal: {
                shadowBlur: 5,
                shadowColor: '#ffffff',
                color: 'rgba(255, 87, 51, 1)',
                lineStyle: {
                  color: 'rgba(255, 87, 51, 1)',
                },
              },
            },
          },
          {
            name: '一般隐患',
            type: 'line',
            data: currentData.normalPitfall,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              normal: {
                shadowBlur: 5,
                shadowColor: '#ffffff',
                color: 'rgba(24, 144, 255, 1)',
                lineStyle: {
                  color: 'rgba(24, 144, 255, 1)',
                },
              },
            },
          },
          {
            name: '全部隐患',
            type: 'line',
            data: currentData.allPitfall,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              normal: {
                shadowBlur: 5,
                shadowColor: '#ffffff',
                color: 'rgba(65, 228, 187, 1)',
                lineStyle: {
                  color: 'rgba(65, 228, 187, 1)',
                },
              },
            },
          },
        ],
      } as echarts.EChartsOption);
    }
  };

  onMounted(() => {
    initChart();
  });

  watch(
    () => currentData.value,
    () => {
      chartOption(currentData.value);
    }
  );

  const initChart = () => {
    myChart.value = markRaw(
      echarts.init(echartsRef.value as unknown as HTMLElement)
    );
    window.addEventListener('resize', function () {
      myChart.value && myChart.value.resize();
    });
    chartOption(currentData.value);
    myChart.value.on('click', (params: any) => {
      if (params.value[1] == 0) return;
      const typeObj = {
        0: 'all',
        1: 'normal',
        2: 'serious',
      };
      emits('handleClickEchart', {
        title: params.seriesName + '分布',
        type: typeObj[params.seriesIndex as keyof typeof typeObj],
      });
    });
  };

  const emits = defineEmits(['handleClickEchart']);
</script>
<style lang="less" scoped>
  .pitfall-tendency-container {
    width: 100%;
    height: 100%;
  }
  .pitfall-tendency-echarts {
    width: 100%;
    height: 100%;
  }
</style>
