<template>
  <div class="equipment-classify-container">
    <div class="equipment-classify-echarts" ref="echartsRef"></div>
  </div>
</template>

<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { markRaw, onMounted, toRef, watch } from 'vue';
  import { ref } from 'vue';
  import { findFontSize } from '@/views/dashboard/workplace/screenComponents/composition/useDataScreen';
  import { computed } from 'vue';
  import Decimal from 'decimal.js';
  const echartsRef = ref();
  const myChart = ref();

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({
        typeGroup: [],
      }),
    },
  });

  const data = toRef(props, 'data');
  const deviceTotal = ref(0);
  const currentData = computed<any>(() => {
    const total = data.value.typeGroup.reduce((prev: number, cur: any) => {
      return prev + cur.count;
    }, 0);
    deviceTotal.value = total;
    return data.value.typeGroup
      .filter((item: any) => item.count)
      .map((item: any) => {
        return {
          value: item.count,
          name: item.type,
          percent:
            new Decimal(item.count)
              .div(new Decimal(total))
              .mul(100)
              .toFixed(0) + '%',
        };
      });
  });
  let pieColors = ['#41E4BB', '#357cf0', '#EE3E3E'];
  let richColor: any = {};
  pieColors.forEach((item, idx) => {
    richColor[`color${idx}`] = {
      fontSize: findFontSize(20),
      align: 'center',
      color: item,
    };
  });

  const chartOption = (currentData: any) => {
    if (currentData) {
      myChart.value.setOption({
        tooltip: {
          trigger: 'item',
        },
        legend: {
          color: '#ffffff',
          orient: 'vertical',
          right: findFontSize(10),
          top: 'middle',
          align: 'left',
          icon: 'circle',
          padding: [findFontSize(20), 0],
          type: 'scroll',
          itemHeight: findFontSize(10),
          pageIconSize: findFontSize(10),
          pageButtonGap: findFontSize(5),
          pageIconInactiveColor: '#999999',
          pageIconColor: '#ffffff',
          pageTextStyle: {
            color: '#ffffff',
          },
          textStyle: {
            color: '#ffffff',
            rich: {
              name: {
                width: findFontSize(100),
                align: 'left',
                fontSize: findFontSize(14),
              },
              value: {
                fontSize: findFontSize(14),
                width: findFontSize(50),
                align: 'left',
              },
              percent: {
                fontSize: findFontSize(14),
                width: 0,
                align: 'right',
              },
            },
          },
          formatter: function (name: string) {
            const format = currentData.find((item: any) => item.name === name);
            return `{name|${name.substring(0, 6)}} {value|${
              format.value
            }} {percent|${format.percent}}`;
          },
          itemStyle: {},
        },
        series: [
          {
            name: '',
            type: 'pie',
            radius: [`${findFontSize(55)}%`, `${findFontSize(80)}%`],
            center: ['25%', '50%'],
            avoidLabelOverlap: false,
            label: {
              show: false,
              position: 'center',
            },
            labelLine: {
              show: false,
            },
            data: currentData,
          },
        ],
        graphic: {
          type: 'text',
          left: `17%`,
          top: 'center',
          style: {
            text: `{value|${deviceTotal.value}}\n{total|设备总数}`,
            textAlign: 'center',
            fill: '#ffffff',
            rich: {
              value: {
                fontSize: findFontSize(30),
              },
              total: {
                fontSize: findFontSize(16),
              },
            },
          },
        },
      });
    }
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
  .equipment-classify-echarts {
    width: 100%;
    height: 100%;
  }
  .equipment-classify-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    border-radius: 0.82rem;
    background: #082252;
    // box-shadow: 0px 0.5rem 0.76rem #001f75;
    .equipment-classify-total-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 1.14rem;
      gap: 0.7rem;
      color: #e6f7ff;
      .equipment-classify-num {
        font-size: 2.14rem;
        font-family: 'Roboto';
        color: #00ddff;
        font-weight: 700;
      }
    }
  }
</style>
