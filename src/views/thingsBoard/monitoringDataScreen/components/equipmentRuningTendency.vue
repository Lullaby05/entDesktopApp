<!-- 隐患趋势图表 -->
<template>
  <div class="running-tendency-container">
    <div class="running-tendency-echarts" ref="echartsRef"></div>
  </div>
</template>

<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { computed, markRaw, onMounted, toRef, watch } from 'vue';
  import { ref } from 'vue';
  import { findFontSize } from '@/views/dashboard/workplace/screenComponents/composition/useDataScreen';
  import { formatDate } from '@/utils/utils';
  const echartsRef = ref();
  const myChart = ref();

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({
        deviceBreakdown: [],
        deviceAlarm: [],
        deviceOffline: [],
      }),
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
    const alarm: any = [];
    const breakDown: any = [];
    const offline: any = [];
    data.value.deviceBreakdown.forEach((item: any) => {
      breakDown.push([item.abscissa, item.ordinate]);
    });
    data.value.deviceAlarm.forEach((item: any) => {
      alarm.push([item.abscissa, item.ordinate]);
    });
    data.value.deviceOffline.forEach((item: any) => {
      offline.push([item.abscissa, item.ordinate]);
    });
    return {
      alarm,
      breakDown,
      offline,
    };
  });

  const chartOption = (currentData: any) => {
    if (currentData) {
      myChart.value.setOption({
        tooltip: {
          trigger: 'axis',
          formatter: function (params: any[]) {
            const valueList = params.filter((ele: any) => ele.value);
            let dataStr = `<div style="font-size: 1rem;
                            font-weight: 700;
                            line-height: 1rem;
                            color: rgba(255, 255, 255, 1);
                            text-align: left;
                            font-family: 'Roboto';
                            margin-bottom: 0.71rem;">
                            ${'设备数量'}</div>`;
            valueList.forEach((item, index) => {
              dataStr += `<div>
                  <div style="display: flex;
                              align-items: center;
                              color: #ffffff;
                              font-size: 0.86rem;
                              font-weight: 400;
                              width: 6.77vw;">
                    <div style="width: 0.71rem;height: 0.71rem;margin-right: 0.57rem;background:linear-gradient(270deg, ${item.color} 0%, ${item.color} 100%);"></div>
                    <div>${item.seriesName}</div>
                    <div style="margin-left:auto;">${item.data[1]}</div>
                  </div>
                </div>`;
            });
            return dataStr;
          },
          extraCssText:
            'height: fit-content;width: fit-content;background: linear-gradient(180deg,rgba(4, 60, 149, 1) 0%,rgba(4, 33, 68, 0.74) 14.22%,rgba(4, 23, 62, 0.8) 51.46%,rgba(7, 45, 94, 0.77) 87.86%,rgba(4, 62, 151, 1) 100%);border: 0.5px solid rgba(48, 97, 219, 1);box-shadow: 0px 0px 3px rgba(3, 255, 246, 0.34);filter: backdrop(0px 0px 3px rgba(3, 255, 246, 0.34));color: #ffffff;margin: 0 !important;padding: 0.71rem !important;',
        },
        legend: {
          top: '0%',
          left: '30%',
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
          data: ['离线设备', '故障设备', '告警设备'],
        },
        grid: {
          top: '15%',
          left: '0%',
          right: '3%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          axisLabel: {
            // formatter: (params: any) => {
            //   if (timeRangeScale.value === 'Day') {
            //     return `${formatDate(params, 'DD')}日`;
            //   } else if (timeRangeScale.value === 'Month') {
            //     return `${params}月`;
            //   } else if (timeRangeScale.value === 'Hour') {
            //     return `${params.split(':')[0]}时`;
            //   }
            //   return `${params}`;
            // },
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
          minInterval: 1,
          axisLabel: {
            color: '#ffffff',
          },
        },
        series: [
          {
            name: '离线设备',
            type: 'line',
            data: currentData.offline,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              normal: {
                shadowBlur: 5,
                shadowColor: '#ffffff',
                color: 'rgba(238, 62, 62, 1)',
                lineStyle: {
                  color: 'rgba(238, 62, 62, 1)',
                },
              },
            },
          },
          {
            name: '故障设备',
            type: 'line',
            data: currentData.breakDown,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              normal: {
                shadowBlur: 5,
                shadowColor: '#ffffff',
                color: 'rgba(255, 141, 26, 1)',
                lineStyle: {
                  color: 'rgba(255, 141, 26, 1)',
                },
              },
            },
          },
          {
            name: '告警设备',
            type: 'line',
            data: currentData.alarm,
            symbol: 'circle',
            symbolSize: 6,
            itemStyle: {
              normal: {
                shadowBlur: 5,
                shadowColor: '#ffffff',
                color: 'rgba(255, 195, 0, 1)',
                lineStyle: {
                  color: 'rgba(255, 195, 0, 1)',
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
      const typeObj = {
        0: 'deviceOffline',
        1: 'deviceBreakdown',
        2: 'deviceAlarm',
      };
      const type = typeObj[params.seriesIndex as keyof typeof typeObj];
      if (!data.value[type][params.dataIndex].relativeId) return;
      emits('handleClickEchart', {
        title: params.seriesName + '明细',
        type,
        ids: data.value[type][params.dataIndex].relativeId.split(','),
      });
    });
  };

  const emits = defineEmits(['handleClickEchart']);
</script>
<style lang="less" scoped>
  .running-tendency-container {
    width: 100%;
    height: 100%;
  }
  .running-tendency-echarts {
    width: 100%;
    height: 100%;
  }
</style>
