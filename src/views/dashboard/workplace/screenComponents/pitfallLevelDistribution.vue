<template>
  <div class="pitfall-level-distribution-container">
    <!-- <div class="title">{{ props.title }}</div> -->
    <div class="pitfall-level-distribution-echarts" ref="echartsRef"></div>
    <icon-reply class="icon-reply" @click="handleBackDataRundown" />
    <div class="pagination">
      <a-pagination
        :page-size="pageSize"
        :total="total"
        size="mini"
        @change="jumpPage"
      >
        <template #page-item="{ page }">{{ page }}</template>
      </a-pagination>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { computed, markRaw, onMounted, toRef, watch } from 'vue';
  import { ref } from 'vue';
  import { findFontSize } from './composition/useDataScreen';
  import { useDataScreenPage } from './composition/useDataScreenPage';
  const echartsRef = ref();
  const myChart = ref();

  const props = defineProps({
    data: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '隐患分布情况',
    },
    type: {
      type: String,
      default: 'all',
    },
  });

  const data = toRef(props, 'data');
  const currentData = computed<any>(() => {
    return data.value.sort((a: any, b: any) => {
      return b.hidSumNum - a.hidSumNum;
    });
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
          top: '1%',
          left: '40%',
          align: 'left',
          icon: 'rect',
          itemHeight: findFontSize(10),
          itemWidth: findFontSize(10),
          pageIconSize: findFontSize(10),
          pageButtonGap: findFontSize(5),
          pageIconInactiveColor: '#999999',
          pageIconColor: '#ffffff',
          pageFormatter: ' ',
          selected: {
            一般隐患: props.type === 'all' || props.type === 'normal',
            重大隐患: props.type === 'all' || props.type === 'large',
          },
        },
        grid: {
          top: '30%',
          bottom: '15%',
          right: '3%',
        },
        xAxis: [
          {
            type: 'category',
            data: paginatedData.value.map(
              (ele: any) => ele.prefillRectifyDeptName
            ),
            triggerEvent: true,
            splitLine: {
              lineStyle: {
                type: 'dotted',
                color: '#4346D3',
              },
            },
            axisLabel: {
              color: 'rgba(255, 255, 255, 0.5)',
              formatter: function (value: any) {
                if (value.length > 3) {
                  return `${value.slice(0, 3)}...`;
                }
                return value;
              },
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
            name: '一般隐患',
            type: 'bar',
            data: paginatedData.value.map((ele: any) => ele.lowDangerNum),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(24, 144, 255, 1)',
                },
                {
                  offset: 1,
                  color: 'rgba(24, 144, 255, 0.35)',
                },
              ]),
            },
            barWidth: 16,
          },
          {
            name: '重大隐患',
            type: 'bar',
            data: paginatedData.value.map((ele: any) => ele.highDangerNum),
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(238, 62, 62, 1)',
                },
                {
                  offset: 1,
                  color: 'rgba(238, 62, 62, 0.35)',
                },
              ]),
            },
            barWidth: 16,
          },
        ],
      });
    }
  };

  // 分页
  const { pageSize, total, paginatedData, jumpPage } = useDataScreenPage({
    defaultPageSize: 4,
    currentData,
    chartOption,
  });

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
  .pitfall-level-distribution-container {
    // padding-top: calc(1.3vh + 2.15rem);
    width: 16.56vw;
    height: calc(12.31vh + 1.3vh + 2.15rem);
    flex: 0 0 auto;
    position: relative;
    border-radius: 0.59rem;
    display: flex;
    flex-direction: column;
    box-sizing: content-box;
    .pitfall-level-distribution-echarts {
      width: 100%;
      height: 100%;
      // background-color: #0e0e4f;
    }
    .title {
      position: absolute;
      top: 0;
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
