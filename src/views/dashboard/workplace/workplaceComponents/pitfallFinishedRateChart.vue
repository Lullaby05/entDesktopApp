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
  import { findFontSize } from '../screenComponents/composition/useDataScreen';
  import i18n from '@/locale';
  import { useAppStore } from '@/store';
  import { storeToRefs } from 'pinia';
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
    barColor: {
      type: String,
      default: '#357CF0',
    },
  });

  const data = toRef(props, 'data');
  const currentData = computed<any>(() => {
    return data.value['taskCount'];
  });

  const appStore = useAppStore();
  const { theme } = storeToRefs(appStore);

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
          right: '10%',
          top: '10%',
          itemHeight: findFontSize(10),
          itemWidth: findFontSize(10),
          textStyle: {
            fontSize: findFontSize(10),
            color: props.textColor,
          },
          data: [
            {
              name: i18n.global.t('dashboard.finishRate'),
              icon: 'rect',
            },
            // {
            //   name: i18n.global.t('dashboard.onTimeFinishRate'),
            //   icon: 'rect',
            // },
          ],
        },
        grid: {
          top: '20%',
          left: '0%',
          right: '20%',
          bottom: '20%',
          containLabel: true,
        },
        xAxis: {
          max: 100,
          type: 'value',
          boundaryGap: [0, 0.01],
          axisLabel: {
            show: true,
            formatter: '{value}%',
            color: '#A6A6A6',
            fontSize: findFontSize(12),
          },
          splitLine: {
            //分割线配置
            lineStyle: {
              color: theme.value === 'light' ? '#e5e5e5' : '#333A47',
              type: 'dashed',
            },
          },
        },
        yAxis: {
          type: 'category',
          data: [
            i18n.global.t('dashboard.planCheck'),
            i18n.global.t('dashboard.dailyCheck'),
          ],
          axisTick: {
            show: false,
          },
          axisLine: {
            show: false,
          },
          axisLabel: {
            show: true,
            color: props.textColor,
            fontSize: findFontSize(12),
            fontWeight: '400',
            fontFace: 'Alibaba',
          },
        },
        series: [
          {
            name: i18n.global.t('dashboard.finishRate'),
            type: 'bar',
            data: [
              currentData.planTaskFinishRate || 0,
              currentData.dayTaskFinishRate || 0,
            ],
            barWidth: findFontSize(12),
            barGap: '50%',
            itemStyle: {
              color: props.barColor,
            },
            label: {
              show: true,
              position: 'right',
              color: props.textColor,
              fontSize: findFontSize(12),
              fontFamily: 'Alibaba',
              formatter: (params: any) => {
                return `${params.value}%`;
              },
            },
          },
          // {
          //   name: i18n.global.t('dashboard.onTimeFinishRate'),
          //   type: 'bar',
          //   data: [
          //     currentData.planTaskOnTimeRate || 0,
          //     currentData.dayTaskOnTimeRate || 0,
          //   ],
          //   barWidth: findFontSize(9),
          //   itemStyle: {
          //     color: '#98D87D',
          //   },
          //   label: {
          //     show: true,
          //     position: 'right',
          //     color: 'var(--color-text-black)',
          //     fontSize: findFontSize(11),
          //     formatter: (params: any) => {
          //       return `${params.value}%`;
          //     },
          //   },
          // },
        ],
      });
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
  };
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
