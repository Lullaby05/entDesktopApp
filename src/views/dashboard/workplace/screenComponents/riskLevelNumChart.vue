<!-- 风险等级数量图表 -->
<template>
  <div class="risk-level-num-container">
    <div class="risk-level-num-echarts" ref="echartsRef"></div>
  </div>
</template>

<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { markRaw, onMounted, ref, toRef, watch } from 'vue';
  import { findFontSize } from './composition/useDataScreen';
  import { computed } from 'vue';
  import { Modal } from '@arco-design/web-vue';

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
      data.value['riskControl'] && [
        {
          name: '重大风险',
          value: data.value['riskControl'].majorRiskNum,
        },
        {
          name: '较大风险',
          value: data.value['riskControl'].largerRiskNum,
        },
        {
          name: '一般风险',
          value: data.value['riskControl'].ordinaryRiskNum,
        },
        {
          name: '低风险',
          value: data.value['riskControl'].lowRiskNum,
        },
      ]
    );
  });

  let pieColors = ['rgba(238, 62, 62, 1)', 'rgba(42, 157, 255, 1)'];
  let richColor: any = {};
  pieColors.forEach((item, idx) => {
    richColor[`color${idx}`] = {
      fontSize: findFontSize(30),
      align: 'center',
      color: item,
    };
  });

  const total = computed(() => {
    return (
      (data.value['riskControl'] &&
        data.value['riskControl'].riskPointTotalNum) ||
      1
    );
  });

  const colors = [
    [
      'rgba(238, 62, 62, 1)',
      'rgba(238, 62, 62, 0.3)',
      'rgba(238, 62, 62, 0.6)',
    ],
    [
      'rgba(255, 141, 26, 1)',
      'rgba(255, 141, 26, 0.3)',
      'rgba(255, 141, 26, 0.6)',
    ],
    [
      'rgba(255, 195, 0, 1)',
      'rgba(255, 195, 0, 0.3)',
      'rgba(255, 195, 0, 0.6)',
    ],
    [
      'rgba(24, 144, 255, 1)',
      'rgba(24, 144, 255, 0.3)',
      'rgba(24, 144, 255, 0.6)',
    ],
  ];

  const seriesArr = ref<any[]>([]);
  const isToggle = ref(false); // 是否被筛选
  const filterIndex = ref(-1); // 筛选的真实索引
  const chartOption = (currentData: any) => {
    if (currentData) {
      seriesArr.value = [];
      // const seriesArr: any[] = [];
      currentData.forEach(
        (item: { value: number; name: any }, index: number) => {
          seriesArr.value.push(
            ...[
              {
                type: 'pie',
                clockWise: false,
                startAngle: 345,
                avoidLabelOverlap: true,
                radius: ['45%', '50%'],
                tooltip: {
                  trigger: 'none',
                },
                itemStyle: {
                  normal: {
                    color: colors[index][0],
                    shadowColor: colors[index][0],
                    shadowBlur: 0,
                    labelLine: {
                      show: false,
                    },
                  },
                },
                label: {
                  normal: {
                    show: false,
                    position: 'center',
                  },
                },
                center: [index * 25 + 12 + '%', '50%'],
                data: [
                  {
                    value: (item.value / total.value) * 100,
                    label: {
                      normal: {
                        show: true,
                        formatter: (params: any) => {
                          return item.value.toFixed(0);
                        },
                        textStyle: {
                          color: '#ffffff',
                          fontSize: findFontSize(24),
                          fontWeight: 700,
                          fontFamily: 'Roboto',
                        },
                      },
                    },
                  },
                  {
                    value: 100 - (item.value / total.value) * 100,
                    itemStyle: {
                      normal: {
                        color: colors[index][1],
                      },
                      emphasis: {
                        color: colors[index][1],
                      },
                    },
                  },
                ],
              },
              {
                tooltip: {
                  trigger: 'none',
                },
                itemStyle: {
                  normal: {
                    color: {
                      type: 'radial',
                      x: 0.5,
                      y: 0.5,
                      r: 0.5,
                      colorStops: [
                        {
                          offset: 0,
                          color: 'transparent', // 0% 处的颜色
                        },
                        {
                          offset: 1,
                          color: colors[index][2], // 100% 处的颜色
                        },
                      ],
                      global: false,
                    },
                  },
                },
                type: 'pie',
                radius: '40%',
                center: [index * 25 + 12 + '%', '50%'],
                labelLine: {
                  show: false,
                },
                labelLayout(params: any) {
                  return {
                    x: params.rect.x + findFontSize(23),
                    y: params.rect.y + findFontSize(77),
                    verticalAlign: 'bottom',
                    align: 'center',
                  };
                },
                data: [
                  {
                    value: 100,
                    name: '',
                    label: {
                      show: true,
                      position: 'ouside',
                      formatter: () => {
                        return item.name;
                      },
                      overflow: 'none',
                      textStyle: {
                        fontSize: findFontSize(14),
                        color: '#ffffff',
                        align: 'right',
                        fontFamily: 'Roboto',
                      },
                    },
                  }, //只设置一个值占整圆
                ],
                emphasis: {
                  label: {
                    show: true,
                  },
                  scale: false, //鼠标悬停到内圆时，取消放大效果
                },
                label: {
                  show: false, //关闭牵引线
                },
              },
            ]
          );
        }
      );
      myChart.value.setOption({
        tooltip: {
          trigger: 'item',
        },
        legend: {
          show: false,
        },
        series: seriesArr.value,
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

    myChart.value.on('click', (params: any) => {
      if (params.value === 0) return;
      const newIndex =
        params.componentIndex % 2 === 1
          ? params.componentIndex - 1
          : params.componentIndex;
      // 如果没有做筛选则直接把内容筛选掉
      if (!isToggle.value) {
        seriesArr.value = seriesArr.value.map((ele: any, index: number) => {
          // params.componentIndex如果是奇数的话则-1,否则不变
          if (index === newIndex) {
            return {
              ...ele,
              data: ele.data.map((item: any, i: number) => {
                return {
                  ...item,
                  value: i === 0 ? 100 : 0,
                };
              }),
            };
          }
          return ele;
        });
        filterIndex.value = newIndex / 2;
        isToggle.value = true;
      } else {
        // 如果已经被筛选了并且再次点击的是同一个则取消筛选
        if (filterIndex.value * 2 === newIndex) {
          seriesArr.value = seriesArr.value.map((ele: any, index: number) => {
            // params.componentIndex如果是奇数的话则-1,否则不变
            if (index === newIndex) {
              return {
                ...ele,
                data: ele.data.map((item: any, i: number) => {
                  return {
                    ...item,
                    value:
                      i === 0
                        ? (currentData.value[newIndex / 2].value /
                            total.value) *
                          100
                        : 100 -
                          (currentData.value[newIndex / 2].value /
                            total.value) *
                            100,
                  };
                }),
              };
            }
            return ele;
          });
          filterIndex.value = -1;
          isToggle.value = false;
        } else {
          // 如果已经被筛选了但是点击了另一个筛选,还原第一个的筛选并且筛选第二个
          seriesArr.value = seriesArr.value.map((ele: any, index: number) => {
            // params.componentIndex如果是奇数的话则-1,否则不变
            if (index === filterIndex.value * 2) {
              return {
                ...ele,
                data: ele.data.map((item: any, i: number) => {
                  return {
                    ...item,
                    value:
                      i === 0
                        ? (currentData.value[filterIndex.value].value /
                            total.value) *
                          100
                        : 100 -
                          (currentData.value[filterIndex.value].value /
                            total.value) *
                            100,
                  };
                }),
              };
            }
            if (index === newIndex) {
              return {
                ...ele,
                data: ele.data.map((item: any, i: number) => {
                  return {
                    ...item,
                    value: i === 0 ? 100 : 0,
                  };
                }),
              };
            }
            return ele;
          });
          filterIndex.value = newIndex / 2;
          isToggle.value = true;
        }
      }
      myChart.value.setOption({
        tooltip: {
          trigger: 'item',
        },
        legend: {
          show: false,
        },
        series: seriesArr.value,
      });
      emits('handleClickChart', {
        isFilter: isToggle.value,
        filterIndex: filterIndex.value,
      });
    });
  };

  const emits = defineEmits(['handleClickChart']);
</script>
<style lang="less" scoped>
  .risk-level-num-container {
    // height: fit-content;
    width: 100%;
    height: 100%;
  }
  .risk-level-num-echarts {
    width: 100%;
    height: 100%;
  }
</style>
