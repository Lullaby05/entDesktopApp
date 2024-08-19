<template>
  <div class="dept-dangerSource-distribution-container">
    <!-- <div class="title">{{ props.title }}</div> -->
    <div class="dept-dangerSource-distribution-echarts" ref="echartsRef"></div>
    <icon-reply class="icon-reply" @click="handleBackDataRundown" />
  </div>
</template>
<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { computed, markRaw, onMounted, toRef, watch } from 'vue';
  import { ref } from 'vue';
  import { extension, findFontSize } from './composition/useDataScreen';
  const echartsRef = ref();
  const myChart = ref();

  const props = defineProps({
    data: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
  });

  const data = toRef(props, 'data');
  const currentData = computed<any>(() => {
    return data.value;
  });

  const chartOption = (currentData: any) => {
    if (currentData) {
      myChart.value.setOption({
        tooltip: {
          show: false,
        },
        legend: {
          type: 'scroll',
          textStyle: {
            color: '#ffffff',
          },
          pageTextStyle: {
            color: '#ffffff',
          },
          left: '45%',
          align: 'left',
          icon: 'rect',
          itemHeight: findFontSize(10),
          itemWidth: findFontSize(10),
          pageIconSize: findFontSize(10),
          pageButtonGap: findFontSize(5),
          pageIconInactiveColor: '#999999',
          pageIconColor: '#ffffff',
          pageFormatter: ' ',
        },
        grid: {
          top: '10%',
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        yAxis: {
          type: 'category',
          data: currentData.map((item: any) => item.riskPointName),
          splitLine: {
            lineStyle: {
              type: 'dotted',
              color: '#4346D3',
            },
          },
          triggerEvent: true,
          minInterval: 1,
          axisLabel: {
            color: '#ffffff',
            formatter: function (value: any) {
              if (value.length > 3) {
                return `${value.slice(0, 3)}...`;
              }
              return value;
            },
          },
        },
        xAxis: {
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
            name: '危险源数',
            data: currentData.map((item: any) => item.dangerNum),
            barWidth: 16,
            type: 'bar',
          },
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
    extension(myChart.value, 'yAxis');
  };

  const emits = defineEmits(['handleBackDataRundown']);
  const handleBackDataRundown = () => {
    emits('handleBackDataRundown');
  };
</script>
<style lang="less" scoped>
  .dept-dangerSource-distribution-container {
    position: relative;
    width: 100%;
    height: 100%;
    .dept-dangerSource-distribution-echarts {
      width: 100%;
      height: 100%;
    }
    .title {
      position: absolute;
      top: 2.5rem;
      font-size: 1rem;
      color: #ffffff;
    }
    .icon-reply {
      position: absolute;
      top: 0;
      right: 0.5rem;
      font-size: 1.5rem;
      color: #ffffff;
      cursor: pointer;
    }
  }
</style>
