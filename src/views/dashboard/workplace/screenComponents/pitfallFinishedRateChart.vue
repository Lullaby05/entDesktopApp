<!-- 隐患完成率图表 -->
<template>
  <div class="pitfall-finished-rate-container">
    <div class="pitfall-finished-rate-echarts" ref="echartsRef"></div>
  </div>
</template>

<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { computed, markRaw, onMounted, toRef, watch } from 'vue';
  import { ref } from 'vue';
  import { findFontSize } from './composition/useDataScreen';
  const echartsRef = ref();
  const myChart = ref();

  const props = defineProps({
    textColor: {
      type: String,
      default: '#ffffff',
    },
    data: {
      type: Object,
      default: () => {},
    },
  });

  const data = toRef(props, 'data');
  const currentData = computed<any>(() => {
    return data.value['riskCheck'];
  });

  const chartOption = (currentData: any) => {
    if (currentData) {
      myChart.value.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
          },
          formatter: function (params: any) {
            var relVal = `${params[0].name}`;
            relVal +=
              '<br/>' +
              params[0].marker +
              params[0].seriesName +
              ' : ' +
              params[0].value +
              '%';
            if (params[1]) {
              relVal +=
                '<br/>' +
                params[1].marker +
                params[1].seriesName +
                ' : ' +
                params[1].value +
                '%';
            }
            return relVal;
          },
        },
        legend: {
          orient: 'horizontal',
          align: 'left',
          right: '0%',
          top: '0%',
          itemHeight: findFontSize(10),
          itemWidth: findFontSize(10),
          textStyle: {
            color: props.textColor,
            fontSize: findFontSize(10),
          },
          data: [
            {
              name: '完成率',
              icon: 'rect',
            },
            // {
            //   name: '按时完成率',
            //   icon: 'rect',
            // },
          ],
        },
        grid: {
          top: '20%',
          left: '0%',
          right: '6%',
          bottom: '5%',
          containLabel: true,
        },
        xAxis: {
          max: 100,
          type: 'value',
          boundaryGap: [0, 0.01],
          splitLine: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.5)',
            formatter: '{value} %',
          },
        },
        yAxis: {
          type: 'category',
          data: ['计划排查', '日常排查'],
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            color: '#FFFFFF',
            fontSize: findFontSize(12),
          },
        },
        series: [
          {
            name: '完成率',
            type: 'bar',
            data: [
              currentData.planTaskFinishRate || 0,
              currentData.dayTaskFinishRate || 0,
            ],
            barWidth: 16,
            barGap: '5%',
            label: {
              show: true,
              position: [15, 3],
              color: 'rgba(255, 255, 255, 0.9)',
              formatter: (params: { value: any }) => {
                return `${params.value}%`;
              },
            },
            itemStyle: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                {
                  offset: 0,
                  color: 'rgba(24, 144, 255, 1)',
                },
                {
                  offset: 1,
                  color: 'rgba(24, 144, 255, 0.35)',
                },
              ]),
            },
          },
          // {
          //   name: '按时完成率',
          //   type: 'bar',
          //   data: [
          //     currentData.planTaskOnTimeRate || 0,
          //     currentData.dayTaskOnTimeRate || 0,
          //   ],
          //   barWidth: 16,
          //   label: {
          //     show: true,
          //     position: [15, 3],
          //     color: 'rgba(255, 255, 255, 0.9)',
          //     formatter: (params: { value: any }) => {
          //       return `${params.value}%`;
          //     },
          //   },
          //   itemStyle: {
          //     color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
          //       {
          //         offset: 0,
          //         color: 'rgba(30, 231, 231, 1)',
          //       },
          //       {
          //         offset: 1,
          //         color: 'rgba(30, 231, 231, 0.35)',
          //       },
          //     ]),
          //   },
          // },
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
      if (params.value == 0) return;
      // dataIndex为0是计划,1是日常
      emits('handleClickEchart', {
        taskType: params.dataIndex === 0 ? '2' : '1',
        title:
          params.dataIndex === 0
            ? '各部门计划任务执行情况'
            : '各部门日常任务执行情况',
      });
    });
  };

  const emits = defineEmits(['handleClickEchart']);
</script>
<style lang="less" scoped>
  .pitfall-finished-rate-container {
    width: 100%;
    height: 100%;
  }
  .pitfall-finished-rate-echarts {
    width: 100%;
    height: 100%;
  }
</style>
