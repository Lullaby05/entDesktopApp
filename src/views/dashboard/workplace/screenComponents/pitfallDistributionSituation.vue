<template>
  <div class="pitfall-distribution-situation-container">
    <!-- <div class="title">{{ props.title }}</div> -->
    <div class="pitfall-distribution-situation-echarts" ref="echartsRef"></div>
    <icon-reply class="icon-reply" @click="handleBackDataRundown" />
  </div>
</template>
<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { computed, markRaw, onMounted, toRef, watch } from 'vue';
  import { ref } from 'vue';
  import { findFontSize } from './composition/useDataScreen';
  import { formatDate } from '@/utils/utils';
  const echartsRef = ref();
  const myChart = ref();

  const props = defineProps({
    data: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '全部隐患分布情况',
    },
    type: {
      type: String,
      default: 'all',
    },
    timeRange: {
      type: String,
      required: true,
    },
  });

  const data = toRef(props, 'data');
  const timeRange = toRef(props, 'timeRange');
  const typeObj = {
    all: 'hidSumNum',
    normal: 'lowDangerNum',
    serious: 'highDangerNum',
  };
  const currentData = computed<any>(() => {
    let deptList = new Map();
    let dateList: string[] = [];
    data.value.forEach((item: any) => {
      dateList.push(item.dateType);
      item.hiddenNums.forEach((hiddenItem: any) => {
        if (!deptList.has(hiddenItem.prefillRectifyDeptId)) {
          deptList.set(hiddenItem.prefillRectifyDeptId, {
            name: hiddenItem.prefillRectifyDeptName,
            data: [hiddenItem[typeObj[props.type as keyof typeof typeObj]]],
          });
        } else {
          // 如果有的话，就把数据push进去
          deptList
            .get(hiddenItem.prefillRectifyDeptId)
            .data.push(hiddenItem[typeObj[props.type as keyof typeof typeObj]]);
        }
      });
    });
    return {
      deptList,
      dateList,
    };
  });

  const timeRangeToScopeObj: any = {
    yesterday: 'Hour',
    today: 'Hour',
    year: 'Month',
    lastQuarter: 'Month',
    quarter: 'Month',
  };
  const timeRangeScale = computed(() => {
    return (
      timeRangeToScopeObj[
        timeRange.value as unknown as keyof typeof timeRangeToScopeObj
      ] ?? 'Day'
    );
  });

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
          type: 'scroll',
          textStyle: {
            color: '#ffffff',
            fontSize: findFontSize(10),
          },
          pageTextStyle: {
            fontSize: 1,
          },
          left: '30%',
          width: '60%',
          align: 'left',
          icon: 'rect',
          itemHeight: findFontSize(10),
          itemWidth: findFontSize(10),
          pageIconSize: findFontSize(10),
          pageButtonGap: findFontSize(5),
          pageIconInactiveColor: '#999999',
          pageIconColor: '#ffffff',
          data: currentData.deptList.size
            ? Array.from(currentData.deptList.values()).map(
                (item: any) => item.name
              )
            : [],
          pageFormatter: ' ',
        },
        grid: {
          top: '30%',
          left: '0%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: currentData.dateList,
          splitLine: {
            lineStyle: {
              type: 'dotted',
              color: '#4346D3',
            },
          },
          axisLabel: {
            formatter: (params: any) => {
              if (timeRangeScale.value === 'Day') {
                return `${formatDate(params, 'DD')}日`;
              } else if (timeRangeScale.value === 'Month') {
                return `${params}月`;
              } else if (timeRangeScale.value === 'Hour') {
                return `${params.split(':')[0]}时`;
              }
              return `${params}`;
            },
            color: 'rgba(255, 255, 255, 0.5)',
          },
        },
        yAxis: {
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
        series: Array.from(currentData.deptList.values()).map((item: any) => {
          return {
            name: item.name,
            type: 'line',
            stack: 'Total',
            data: item.data,
          };
        }),
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

  const emits = defineEmits(['handleBackDataRundown']);
  const handleBackDataRundown = () => {
    emits('handleBackDataRundown');
  };
</script>
<style lang="less" scoped>
  .pitfall-distribution-situation-container {
    position: relative;
    width: 100%;
    height: 100%;
    .title {
      position: absolute;
      top: 2.5rem;
      font-size: 1rem;
      color: #ffffff;
    }
    .pitfall-distribution-situation-echarts {
      width: 100%;
      height: 100%;
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
