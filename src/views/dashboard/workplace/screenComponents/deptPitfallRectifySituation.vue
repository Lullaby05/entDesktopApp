<template>
  <div class="dept-pitfall-rectify-container">
    <div class="data-block-title">
      <div class="title">{{ props.title }}</div>
    </div>
    <div class="dept-pitfall-rectify-echarts" ref="echartsRef"></div>
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
      default: '各部门隐患整改情况',
    },
  });

  const data = toRef(props, 'data');
  const currentData = computed<any>(() => {
    return data.value.sort(
      (b: any, a: any) =>
        a.hidCorrectRate +
        a.onTimeCorrectRate +
        a.onceQualifiedRate -
        b.hidCorrectRate -
        b.onTimeCorrectRate -
        b.onceQualifiedRate
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
            return `${params[0].marker}${params[0].name}<br /> 整改完成率: ${params[0].value}%<br /> 按时整改率: ${params[1].value}%<br /> 一次验收合格率: ${params[2].value}%`;
          },
          extraCssText:
            'height: fit-content;width: fit-content;background: linear-gradient(180deg,rgba(4, 60, 149, 1) 0%,rgba(4, 33, 68, 0.74) 14.22%,rgba(4, 23, 62, 0.8) 51.46%,rgba(7, 45, 94, 0.77) 87.86%,rgba(4, 62, 151, 1) 100%);border: 0.5px solid rgba(48, 97, 219, 1);box-shadow: 0px 0px 3px rgba(3, 255, 246, 0.34);filter: backdrop(0px 0px 3px rgba(3, 255, 246, 0.34));color: #ffffff;margin: 0 !important;padding: 0.71rem !important;',
        },
        legend: {
          type: 'scroll',
          textStyle: {
            color: '#ffffff',
          },
          pageTextStyle: {
            color: '#ffffff',
          },
          top: '0%',
          left: '35%',
          align: 'left',
          icon: 'rect',
          itemHeight: findFontSize(10),
          itemWidth: findFontSize(10),
          pageIconSize: findFontSize(10),
          pageButtonGap: findFontSize(5),
          pageIconInactiveColor: '#999999',
          pageIconColor: '#ffffff',
        },
        grid: {
          top: '30%',
          bottom: '15%',
          // left: '5%',
          right: '3%',
        },
        xAxis: [
          {
            type: 'category',
            data: paginatedData.value.map(
              (item: any) => item.prefillRectifyDeptName
            ),
            splitLine: {
              lineStyle: {
                type: 'dotted',
                color: '#4346D3',
              },
            },
            axisLabel: {
              color: 'rgba(255, 255, 255, 0.5)',
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
            max: 100,
            minInterval: 1,
            axisLabel: {
              color: '#ffffff',
              formatter: '{value}%',
            },
          },
        ],
        series: [
          {
            name: '整改完成率',
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(234,238,47, 1)',
                },
                {
                  offset: 1,
                  color: 'rgba(234,238,47, 0.35)',
                },
              ]),
            },
            data: paginatedData.value.map((item: any) => item.hidCorrectRate),
            barWidth: 16,
          },
          {
            name: '按时整改率',
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(201,93,236, 1)',
                },
                {
                  offset: 1,
                  color: 'rgba(201,93,236, 0.35)',
                },
              ]),
            },
            data: paginatedData.value.map(
              (item: any) => item.onTimeCorrectRate
            ),
            barWidth: 16,
          },
          {
            name: '一次验收合格率',
            type: 'bar',
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                {
                  offset: 0,
                  color: 'rgba(22,245,244, 1)',
                },
                {
                  offset: 1,
                  color: 'rgba(22,245,244, 0.35)',
                },
              ]),
            },
            data: paginatedData.value.map(
              (item: any) => item.onceQualifiedRate
            ),
            barWidth: 16,
          },
        ],
      });
    }
  };

  // 分页
  const { pageSize, total, paginatedData, jumpPage } = useDataScreenPage({
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
  };

  const emits = defineEmits(['handleBackDataRundown']);
  const handleBackDataRundown = () => {
    emits('handleBackDataRundown');
  };
</script>
<style lang="less" scoped>
  .dept-pitfall-rectify-container {
    width: 100%;
    height: calc(12.31vh + 1.3vh + 2.15rem);
    position: relative;
    display: flex;
    flex-direction: column;
    .dept-pitfall-rectify-echarts {
      width: 100%;
      height: 100%;
    }

    .data-block-title {
      // border-bottom: 1px solid #144583;
      position: absolute;
      width: 100%;
      &::before {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 4.75rem;
        height: 2px;
        background: rgba(45, 153, 255, 1);
      }
      .title {
        // position: absolute;
        // top: 0;
        color: #ffffff;
        // margin-bottom: 0.36rem;
        font-family: '优设标题黑';
        font-size: 1.43rem;
        font-weight: 400;
        line-height: 1.79rem;
        letter-spacing: -0.02rem;
        color: #ffffff;
        text-align: left;
        vertical-align: top;
      }
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
