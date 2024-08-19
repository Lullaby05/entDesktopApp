<!-- 在线设备 -->
<template>
  <div class="equipment-breakdown-rate-container">
    <div class="equipment-breakdown-chart" ref="echartsRef"> </div>
    <div class="description-text">
      <span class="rate-text">设备故障</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { markRaw, onMounted, ref, toRef, watch } from 'vue';
  import { findFontSize } from '@/views/dashboard/workplace/screenComponents/composition/useDataScreen';
  import { computed } from 'vue';
  import Decimal from 'decimal.js';

  const echartsRef = ref();
  const myChart = ref();

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({
        all: 1,
        breakdown: 0,
        typeGroup: [],
      }),
    },
  });

  const data = toRef(props, 'data');

  const totalDeviceCount = ref(0);
  const currentData = computed<any>(() => {
    const total = data.value.all;
    totalDeviceCount.value = total;
    const result = new Decimal(data.value.breakdown)
      .div(total)
      .mul(100)
      .toNumber();
    return result;
  });

  const chartOption = (currentData: any) => {
    myChart.value.setOption({
      series: [
        {
          type: 'gauge',
          animation: true,
          radius: '130%',
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
          splitNumber: 30,
          splitLine: {
            show: true,
            length: findFontSize(10),
            lineStyle: {
              color: '#1b2452',
              width: findFontSize(2),
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
          radius: '130%',
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
          splitNumber: (currentData > 0 ? currentData : -1) * 0.3,
          splitLine: {
            show: true,
            length: findFontSize(10),
            lineStyle: {
              color: '#FFC300',
              width: findFontSize(2),
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
            color: '#ffffff',
            formatter: '{value}',
            fontSize: findFontSize(20),
            fontWeight: 700,
            fontFamily: 'Oswald',
            offsetCenter: [0, 2],
          },
          title: {
            show: false,
            color: '#fff',
            fontSize: findFontSize(20),
          },
          z: 2,
          data: [
            {
              value: currentData
                ? new Decimal(currentData)
                    .mul(totalDeviceCount.value)
                    .div(100)
                    .toNumber()
                    .toFixed(0)
                : 0,
            },
          ],
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
  .equipment-breakdown-rate-container {
    width: 11rem;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.36rem;
    color: #ffffff;
    .equipment-breakdown-chart {
      width: 4.29rem;
      height: 4.29rem;
    }
    .description-text {
      height: fit-content;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      font-size: 1rem;
      line-height: 1rem;
      font-family: 'Alibaba';
      font-weight: 500;
    }
  }
</style>
