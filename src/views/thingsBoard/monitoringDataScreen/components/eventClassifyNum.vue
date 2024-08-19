<!-- 风险等级数量图表 -->
<template>
  <div class="event-classify-num-container">
    <div class="event-classify-num-echarts" ref="echartsRef"></div>
  </div>
</template>

<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { markRaw, onMounted, ref, toRef, watch } from 'vue';
  import { computed } from 'vue';
  import { findFontSize } from '@/views/dashboard/workplace/screenComponents/composition/useDataScreen';

  const echartsRef = ref();
  const myChart = ref();

  const props = defineProps({
    data: {
      type: Object,
      default: () => [],
    },
  });

  const data = toRef(props, 'data');
  const currentData = computed<any>(() => {
    return data.value.map((ele: any) => ({
      value: ele.num,
      name: ele.name,
    }));
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
    return data.value.reduce((prev: number, cur: any) => {
      return prev + cur.num;
    }, 1);
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
  ];

  const chartOption = (currentData: any) => {
    if (currentData) {
      const seriesArr: any[] = [];
      currentData.forEach(
        (item: { value: number; name: any }, index: number) => {
          seriesArr.push(
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
                center: [index * 34 + 18 + '%', '40%'],
                data: [
                  {
                    value: (item.value / total.value) * 100,
                    label: {
                      normal: {
                        show: true,
                        formatter: (params: any) => {
                          return ((params.value * total.value) / 100).toFixed(
                            0
                          );
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
                center: [index * 34 + 18 + '%', '40%'],
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
        series: seriesArr,
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
  .event-classify-num-container {
    // height: fit-content;
    width: 100%;
    height: 100%;
  }
  .event-classify-num-echarts {
    width: 100%;
    height: 100%;
  }
</style>
