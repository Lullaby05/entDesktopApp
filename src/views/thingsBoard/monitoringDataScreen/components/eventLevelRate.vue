<!-- 隐患趋势图表 -->
<template>
  <div class="event-level-distribution-container">
    <div class="event-level-distribution-echarts" ref="echartsRef"></div>
  </div>
</template>

<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { computed, markRaw, onMounted, toRef, watch } from 'vue';
  import { ref } from 'vue';
  import { findFontSize } from '@/views/dashboard/workplace/screenComponents/composition/useDataScreen';
  import { formatDate } from '@/utils/utils';
  import Decimal from 'decimal.js';
  const echartsRef = ref();
  const myChart = ref();

  const props = defineProps({
    data: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: 'event',
    },
  });

  const data = toRef(props, 'data');

  const currentData = computed<any>(() => {
    let result: any = {};
    if (data.value.eventLevelDistribution) {
      data.value.eventLevelDistribution.forEach((item: any) => {
        result[item.key] = new Decimal(item.value).mul(100).toNumber();
        if (item.key === '2-2') {
          result['2-4'] = new Decimal(item.value).mul(100).toNumber();
          result['2-2'] = -1;
        }
      });
      // result = {
      //   ...data.value.eventLevelDistribution,
      //   ...{
      //     '2-4': data.value.eventLevelDistribution
      //       ? data.value.eventLevelDistribution['2-2']
      //       : 0,
      //     '2-2': -1,
      //   },
      // };
    }
    let resultArr = new Array(4).fill(null).map(() => new Array(3).fill(-1));
    for (let key in result) {
      const arrKey = key.split('-');
      resultArr[Number(arrKey[1]) - 1][Number(arrKey[0]) - 1] = result[key];
    }
    return {
      first: resultArr[0].reverse(),
      second: resultArr[1].reverse(),
      third: resultArr[2].reverse(),
      fourth: resultArr[3].reverse(),
    };
  });
  const colorList = [
    'rgba(255, 87, 51, 1)',
    'rgba(255, 141, 26, 1)',
    'rgba(255, 195, 0, 1)',
    'rgba(42, 130, 228, 1)',
  ];
  const colorListEnd = [
    'rgba(212, 48, 48, 0.35)',
    'rgba(255, 141, 26, 0.35)',
    'rgba(255, 195, 0, 0.35)',
    'rgba(42, 130, 228, 0.35)',
  ];
  let i = 0;
  const yAxis = ['应急事件', '隐患', '设备故障'].reverse();
  function dealBar(arr: any[], name: string[], colorIndex: number) {
    const bar: any[] = [];
    arr.forEach((item, index) => {
      const data: any[] = [];
      for (let i = 0; i < index; i++) {
        data.push('');
      }
      if (item >= 0) {
        data.push(item);
        bar.push(
          ...[
            {
              name: name[index],
              type: 'bar',
              tooltip: {
                show: item > 0,
                axisPointer: {
                  type: 'line',
                  lineStyle: {
                    color: 'rgba(227, 242, 252, 0.39)',
                    width: 40,
                    type: 'solid',
                  },
                  z: 0, //注意要设置层级，不然会在覆盖在柱子前面，设置为0就在柱子后面显示了。
                },
              },
              yAxisIndex: index,
              barWidth: findFontSize(10),
              stack: name[index] + i,
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 1,
                y2: 0,
                colorStops: [
                  {
                    offset: 0,
                    color: colorList[colorIndex], // 0% 处的颜色
                  },
                  {
                    offset: 1,
                    color: colorListEnd[colorIndex], // 100% 处的颜色
                  },
                ],
                label: {
                  formatter: '{b}: {c}',
                },
                global: false,
              },
              label: {
                show: item > 0,
                position: [5, 0],
                // position: 'right',
                color: 'rgba(255, 255, 255, 0.9)',
                fontSize: findFontSize(10),
                formatter: (params: { value: any; seriesName: string }) => {
                  return `${params.seriesName}`;
                },
              },
              data,
            },
            // //添加透明的柱子，用于显示具体数值
            // {
            //   name: '', //名称设置为空,防止legend显示
            //   type: 'bar',
            //   tooltip: {
            //     show: false, //提示框也不显示
            //   },
            //   stack: name[index] + i, //系列要和前面两个堆叠柱状图相同
            //   data, //值根据数组长度随意填充
            //   itemStyle: {
            //     color: 'transparent', //颜色透明
            //   },
            //   yAxisIndex: index,
            //   barWidth: findFontSize(15),
            //   label: {
            //     show: item > 0,
            //     position: [5, 2],
            //     color: 'rgba(255, 255, 255, 0.9)',
            //     formatter: (params: { value: any; seriesName: string }) => {
            //       return `${params.value}`;
            //     },
            //   },
            // },
          ]
        );
      }
      i++;
    });
    return bar;
  }
  const chartOption = (currentData: any) => {
    if (currentData) {
      myChart.value.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow',
            shadowStyle: {
              width: 'auto',
            },
          },
          formatter: function (params: any[]) {
            const valueList = params.filter((ele: any) => ele.value);
            const total = valueList.reduce((pre: any, cur: any) => {
              return pre + cur.value;
            }, 0);
            if (!total) return '';
            const info = valueList[0];
            let dataStr = `<div style="font-size: 1rem;
                            font-weight: 700;
                            line-height: 1rem;
                            color: rgba(255, 255, 255, 1);
                            text-align: left;
                            font-family: 'Roboto';
                            margin-bottom: 0.71rem;">
                            ${info.name}</div>`;
            valueList.forEach((item, index) => {
              dataStr += `<div>
                  <div style="display: flex;
                              align-items: center;
                              color: #ffffff;
                              font-size: 0.86rem;
                              font-weight: 400;
                              width: 6.77vw;">
                    <div style="width: 0.71rem;height: 0.71rem;margin-right: 0.57rem;background:linear-gradient(270deg, ${item.color.colorStops[1].color} 0%, ${item.color.colorStops[0].color} 100%);"></div>
                    <div>${item.seriesName}</div>
                    <div style="margin-left:auto;">${item.data}%</div>
                  </div>
                </div>`;
            });
            return dataStr;
          },
          extraCssText:
            'height: fit-content;width: fit-content;background: linear-gradient(180deg,rgba(4, 60, 149, 1) 0%,rgba(4, 33, 68, 0.74) 14.22%,rgba(4, 23, 62, 0.8) 51.46%,rgba(7, 45, 94, 0.77) 87.86%,rgba(4, 62, 151, 1) 100%);border: 0.5px solid rgba(48, 97, 219, 1);box-shadow: 0px 0px 3px rgba(3, 255, 246, 0.34);filter: backdrop(0px 0px 3px rgba(3, 255, 246, 0.34));color: #ffffff;margin: 0 !important;padding: 0.71rem !important;',
        },
        legend: {
          show: false,
        },
        grid: {
          top: '15%',
          left: '3%',
          right: '4%',
          bottom: '0%',
          containLabel: true,
        },
        xAxis: {
          max: 100,
          type: 'value',
          boundaryGap: [0, 0.01],
          minInterval: 1,
          splitLine: {
            lineStyle: {
              type: 'dotted',
              color: '#4346D3',
            },
          },
          axisLabel: {
            formatter: '{value}%',
          },
        },
        yAxis: yAxis.map((item, index) => {
          return {
            type: 'category',
            position: 'bottom',
            data: yAxis,
            axisLabel: {
              interval: 0,
              overflow: 'break',
              width: 50,
              lineHeight: findFontSize(16),
              color: 'rgba(255, 255, 255, 1)',
              formatter: (params: any) => {
                return index === 0 ? params : '';
              },
            },
            axisTick: {
              show: index === 0,
              //坐标轴刻度与标签对齐
              alignWithLabel: true,
            },
            axisLine: {
              show: index === 0,
              lineStyle: {
                color: '#4346D3',
              },
            },
          };
        }),
        series: [
          ...dealBar(
            currentData.first,
            ['一级', '重大隐患', '故障'].reverse(),
            0
          ),
          ...dealBar(currentData.second, ['二级', '', '告警'].reverse(), 1),
          ...dealBar(currentData.third, ['三级', '', '预警'].reverse(), 2),
          ...dealBar(currentData.fourth, ['四级', '一般隐患', ''].reverse(), 3),
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
  };
</script>
<style lang="less" scoped>
  .event-level-distribution-container {
    width: 100%;
    height: 100%;
  }
  .event-level-distribution-echarts {
    width: 100%;
    height: 100%;
  }
</style>
