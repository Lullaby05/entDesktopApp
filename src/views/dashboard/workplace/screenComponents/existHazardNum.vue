<!-- 现存隐患数 -->
<template>
  <div class="exist-hazard-num-container">
    <div class="description-text" @click="handleClick">
      <span class="rate-text">现存隐患数</span>
      <span
        ><span class="rate-num">{{ total || 0 }}</span></span
      >
    </div>
    <div class="exist-hazard-chart" ref="echartsRef"></div>
  </div>
</template>
<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { markRaw, onMounted, ref, toRef, watch } from 'vue';
  import { findFontSize } from './composition/useDataScreen';
  import { computed } from 'vue';

  const echartsRef = ref();
  const myChart = ref();

  const props = defineProps({
    data: {
      type: Object,
      default: () => {},
    },
  });

  const data = toRef(props, 'data');
  const currentData = computed<any>(() => {
    return (
      data.value['riskGovern'] && {
        largeHazardNum: data.value['riskGovern'].highDangerNum,
        normalHazardNum: data.value['riskGovern'].lowDangerNum,
      }
    );
  });
  const total = computed(() => {
    return data.value['riskGovern'] && data.value['riskGovern'].hidSumNum;
  });

  let pieColors = ['rgba(238, 62, 62, 1)', 'rgba(42, 157, 255, 1)'];
  let richColor: any = {};
  pieColors.forEach((item, idx) => {
    richColor[`color${idx}`] = {
      fontSize: findFontSize(25),
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
          show: false,
        },
        series: [
          {
            type: 'pie',
            radius: ['30%', '45%'],
            center: ['50%', '50%'],
            label: {
              width: findFontSize(10),
              alignTo: 'labelLine',
              overflow: 'none',
              formatter: (params: any) => {
                return `{name|${params.name}}\n\n{color${params.dataIndex}|${params.value}}`;
              },
              rich: {
                name: {
                  fontSize: findFontSize(12),
                  color: '#ffffff',
                },
                ...richColor,
              },
            },
            itemStyle: {
              normal: {
                color: function (params: any) {
                  //自定义饼图各板块颜色
                  var colorList = [
                    'rgba(238, 62, 62, 1)',
                    'rgba(42, 157, 255, 1)',
                  ];
                  return colorList[params.dataIndex];
                },
              },
            },
            labelLine: {
              show: true,
              normal: {
                length:
                  currentData.largeHazardNum === 0 &&
                  currentData.normalHazardNum === 0
                    ? findFontSize(3)
                    : findFontSize(5), // 指示线宽度
                // length2: findFontSize(5),
              },
            },
            // labelLayout(params: any) {
            //   return {
            //     x:
            //       params.dataIndex === 0
            //         ? params.rect.x + params.rect.width / 2
            //         : params.rect.x - params.rect.width / 2,
            //     y:
            //       params.dataIndex === 0
            //         ? params.rect.y + params.rect.height / 2
            //         : params.rect.y - params.rect.height / 2,
            //     verticalAlign: 'middle',
            //     align: 'center',
            //   };
            // },
            data: [
              {
                value: currentData.largeHazardNum,
                name: '重大隐患',
                label: {
                  show:
                    currentData.largeHazardNum > 0 ||
                    (currentData.largeHazardNum === 0 &&
                      currentData.normalHazardNum === 0),
                },
              },
              {
                value: currentData.normalHazardNum,
                name: '一般隐患',
                label: {
                  show:
                    currentData.normalHazardNum > 0 ||
                    (currentData.largeHazardNum === 0 &&
                      currentData.normalHazardNum === 0),
                },
              },
            ],
          },
        ],
      } as echarts.EChartsOption);
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
    myChart.value.on('click', (params: any) => {
      if (params.value == 0) return;
      // dataIndex1是一般隐患,2是重大隐患
      emits('handleClickEchart', {
        type: params.dataIndex === 1 ? 'normal' : 'large',
      });
    });
  };

  const handleClick = () => {
    if (total.value == 0) return;
    emits('handleClickEchart', { type: 'all' });
  };

  const emits = defineEmits(['handleClickEchart']);
</script>
<style lang="less" scoped>
  .exist-hazard-num-container {
    flex: 0 0 auto;
    width: 16.56vw;
    height: 12.31vh;
    display: flex;
    align-items: center;
    justify-content: center;
    // align-items: flex-end;
    color: #ffffff;
    font-size: 1.14rem;
    background-color: #0e0e4f;
    border-radius: 0.59rem;
    .description-text {
      cursor: pointer;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-size: 1.14rem;
      gap: 0.7rem;
      .rate-num {
        font-size: 2.14rem;
        font-family: 'Roboto';
        color: #00ddff;
        font-weight: 700;
      }
    }
    .exist-hazard-chart {
      width: 14.21rem;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
</style>
