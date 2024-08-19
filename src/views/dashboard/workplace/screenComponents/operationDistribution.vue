<template>
  <div class="operation-distribution-container">
    <div class="title">{{ props.title }}</div>
    <div class="operation-distribution-echarts" ref="echartsRef"></div>
    <icon-reply class="icon-reply" @click="handleBackDataRundown" />
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
    data: {
      type: Object,
      default: () => {},
    },
    title: {
      type: String,
      default: '进行中作业分布',
    },
  });

  const data = toRef(props, 'data');
  const currentData = computed<any>(() => {
    return data.value.sort((a: any, b: any) => b.value - a.value);
  });

  const colorObj = {
    进行中: ['#2A82E4', '#78ADEB'],
    正常关闭: ['#00BAAD', '#6BC9C3'],
    异常关闭: ['#E33C64', '#E890A4'],
    超时关闭: ['#FFC300', '#F7DC81'],
  };

  const chartOption = (currentData: any) => {
    if (currentData) {
      myChart.value.setOption({
        tooltip: {
          trigger: 'axis',
          textStyle: {
            color: '#ffffff',
          },
          extraCssText:
            'height: fit-content;width: fit-content;background: linear-gradient(180deg,rgba(4, 60, 149, 1) 0%,rgba(4, 33, 68, 0.74) 14.22%,rgba(4, 23, 62, 0.8) 51.46%,rgba(7, 45, 94, 0.77) 87.86%,rgba(4, 62, 151, 1) 100%);border: 0.5px solid rgba(48, 97, 219, 1);box-shadow: 0px 0px 3px rgba(3, 255, 246, 0.34);filter: backdrop(0px 0px 3px rgba(3, 255, 246, 0.34));color: #ffffff;margin: 0 !important;padding: 0.71rem !important;',
        },
        legend: {
          show: false,
        },
        grid: {
          top: '25%',
          bottom: '15%',
          left: '5%',
          right: '3%',
        },
        xAxis: [
          {
            type: 'category',
            // prettier-ignore
            data: currentData.map((item: any) => item.key),
            splitLine: {
              lineStyle: {
                type: 'dotted',
                color: '#4346D3',
              },
            },
            axisTick: {
              //坐标轴刻度与标签对齐
              alignWithLabel: true,
            },
            axisLabel: {
              interval: 0,
              overflow: 'break',
              width: 50,
              lineHeight: findFontSize(16),
              color: 'rgba(255, 255, 255, 0.5)',
            },
          },
        ],
        yAxis: [
          {
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
        ],
        series: [
          {
            type: 'bar',
            data: currentData.map((item: any) => item.value),
            barWidth: 16,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: fuzzyMatch(colorObj, props.title)[0] },
                { offset: 1, color: fuzzyMatch(colorObj, props.title)[1] },
              ]),
            },
          },
        ],
      });
    }
  };

  function fuzzyMatch(obj: any, key: string) {
    for (let k in obj) {
      if (key.includes(k)) {
        return obj[k];
      }
    }
    return ['#2A82E4', '#78ADEB'];
  }

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

    myChart.value.on('click', function (params: any) {
      emits('handleClickEchart', {
        key: params.name,
        ids: currentData.value[params.dataIndex].ids,
      });
    });
  };

  const emits = defineEmits(['handleBackDataRundown', 'handleClickEchart']);
  const handleBackDataRundown = () => {
    emits('handleBackDataRundown');
  };
</script>
<style lang="less" scoped>
  .operation-distribution-container {
    width: 100%;
    height: 100%;
    position: relative;
    .operation-distribution-echarts {
      width: 100%;
      height: 100%;
    }
    .title {
      position: absolute;
      top: 0.5rem;

      font-size: 1rem;
      color: #ffffff;
    }
    .icon-reply {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      font-size: 1.5rem;
      color: #ffffff;
      cursor: pointer;
    }
  }
</style>
