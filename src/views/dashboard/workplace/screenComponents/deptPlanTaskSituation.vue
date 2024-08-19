<template>
  <div class="dept-task-situation-container">
    <!-- <div class="title">{{ props.title }}</div> -->
    <div class="dept-task-situation-echarts" ref="echartsRef"></div>
    <icon-reply class="icon-reply" @click="handleBackDataRundown" />
    <div class="pagination">
      <a-pagination
        :page-size="pageSize"
        :total="totalPages * pageSize!"
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
  import { extension, findFontSize } from './composition/useDataScreen';
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
      default: '',
    },
    type: {
      type: String,
      default: '',
    },
  });

  const data = toRef(props, 'data');
  const currentData = computed<any>(() => {
    return data.value.sort(
      (a: any, b: any) => b.dayTaskFinishRate - a.dayTaskFinishRate
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
          formatter: (params: any) => {
            return `${params[0].marker}${params[0].name}<br /> 任务完成率: ${params[0].value}%`;
          },
          extraCssText:
            'height: fit-content;width: fit-content;background: linear-gradient(180deg,rgba(4, 60, 149, 1) 0%,rgba(4, 33, 68, 0.74) 14.22%,rgba(4, 23, 62, 0.8) 51.46%,rgba(7, 45, 94, 0.77) 87.86%,rgba(4, 62, 151, 1) 100%);border: 0.5px solid rgba(48, 97, 219, 1);box-shadow: 0px 0px 3px rgba(3, 255, 246, 0.34);filter: backdrop(0px 0px 3px rgba(3, 255, 246, 0.34));color: #ffffff;margin: 0 !important;padding: 0.71rem !important;',
        },
        legend: {},
        grid: {
          top: '30%',
          left: '3%',
          right: '4%',
          bottom: '0%',
          containLabel: true,
        },
        yAxis: {
          max: 'dataMax',
          splitNumber: pageSize.value! - 1,
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dotted',
              color: '#4346D3',
            },
          },
          axisLabel: {
            color: '#ffffff',
            formatter: '{value}%',
          },
        },
        xAxis: {
          type: 'category',
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
          triggerEvent: true,
          axisLabel: {
            interval: 0,
            width: 100,
            lineHeight: findFontSize(16),
            color: 'rgba(255, 255, 255, 0.5)',
            formatter: function (value: any) {
              if (value.length > 3) {
                return `${value.slice(0, 3)}...`;
              }
              return value;
            },
          },
          data: paginatedData.value.map((item: any) => item.checkTypeCodeName),
        },
        series: [
          {
            // 1-日常,2-计划
            data: paginatedData.value.map(
              (item: any) => item.dayTaskFinishRate || 0
            ),
            barWidth: 16,
            type: 'bar',
            label: {
              formatter: '{c}%',
            },
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
          },
        ],
      });
    }
  };

  // 分页
  const {
    currentPage,
    pageSize,
    totalPages,
    paginatedData,
    prevPage,
    nextPage,
    jumpPage,
  } = useDataScreenPage({
    defaultPageSize: 5,
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
    extension(myChart.value);
    myChart.value.on('click', (params: any) => {
      // 日常任务无法下钻
      if (props.type === '1') return;
      emits('handleClickEchart', params);
    });
  };

  const emits = defineEmits(['handleBackDataRundown', 'handleClickEchart']);
  const handleBackDataRundown = () => {
    emits('handleBackDataRundown');
  };
</script>
<style lang="less" scoped>
  .dept-task-situation-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 0.4rem;
    .title {
      position: absolute;
      top: 2.5rem;
      font-size: 1rem;
      color: #ffffff;
    }
    .dept-task-situation-echarts {
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
