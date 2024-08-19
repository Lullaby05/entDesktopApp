<template>
  <div class="dept-risk-distribution-container">
    <!-- <div class="title">部门风险分布情况</div> -->
    <div class="dept-risk-distribution-echarts" ref="echartsRef"></div>
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
  import { extension, findFontSize } from './composition/useDataScreen';
  import { useDataScreenPage } from './composition/useDataScreenPage';
  const echartsRef = ref();
  const myChart = ref();

  const props = defineProps({
    data: {
      type: Array,
      default: () => [],
    },
  });

  const data = toRef(props, 'data');
  const currentData = computed<any>(() => {
    return data.value.sort(
      (a: any, b: any) =>
        b.majorRiskNum +
        b.largerRiskNum +
        b.ordinaryRiskNum +
        b.lowRiskNum -
        (a.majorRiskNum + a.largerRiskNum + a.ordinaryRiskNum + a.lowRiskNum)
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
            color: '#ffffff',
          },
          left: '30%',
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
          top: '10%',
          left: '0%',
          right: '3%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: {
          type: 'value',
          splitLine: {
            lineStyle: {
              type: 'dotted',
              color: '#4346D3',
            },
          },
          minInterval: 1,
          axisLabel: {
            color: 'rgba(255, 255, 255, 0.5)',
          },
        },
        yAxis: {
          type: 'category',
          data: paginatedData.value.map((ele: any) => ele.deptName).reverse(),
          splitLine: {
            lineStyle: {
              type: 'dotted',
              color: '#4346D3',
            },
          },
          triggerEvent: true,
          minInterval: 1,
          axisLabel: {
            color: '#ffffff',
            fontSize: findFontSize(14),
            formatter: function (value: any) {
              if (value.length > 3) {
                return `${value.slice(0, 3)}...`;
              }
              return value;
            },
          },
        },
        series: [
          {
            name: '重大风险',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              formatter: (params: any) => {
                return params.value ? params.value : '';
              },
            },
            emphasis: {
              focus: 'series',
            },
            // 修改颜色
            itemStyle: {
              color: 'rgba(238, 62, 62, 1)',
            },
            barWidth: 16,
            data: paginatedData.value
              .map((ele: any) => ele.majorRiskNum)
              .reverse(),
          },
          {
            name: '较大风险',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              formatter: (params: any) => {
                return params.value ? params.value : '';
              },
            },
            emphasis: {
              focus: 'series',
            },
            itemStyle: {
              color: 'rgba(255, 141, 26, 1)',
            },
            barWidth: 16,
            data: paginatedData.value
              .map((ele: any) => ele.largerRiskNum)
              .reverse(),
          },
          {
            name: '一般风险',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              formatter: (params: any) => {
                return params.value ? params.value : '';
              },
            },
            emphasis: {
              focus: 'series',
            },
            itemStyle: {
              color: 'rgba(255, 195, 0, 1)',
            },
            barWidth: 16,
            data: paginatedData.value
              .map((ele: any) => ele.ordinaryRiskNum)
              .reverse(),
          },
          {
            name: '低风险',
            type: 'bar',
            stack: 'total',
            label: {
              show: true,
              formatter: (params: any) => {
                return params.value ? params.value : '';
              },
            },
            emphasis: {
              focus: 'series',
            },
            itemStyle: {
              color: 'rgba(24, 144, 255, 1)',
            },
            barWidth: 16,
            data: paginatedData.value
              .map((ele: any) => ele.lowRiskNum)
              .reverse(),
          },
        ],
      });
    }
  };

  // 分页
  const { pageSize, total, paginatedData, jumpPage } = useDataScreenPage({
    defaultPageSize: 8,
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
    extension(myChart.value, 'yAxis');
    myChart.value.on('click', (params: any) => {
      const curData =
        currentData.value[currentData.value.length - params.dataIndex - 1];
      emits('handleClickChart', {
        deptId: curData.deptId,
        title: curData.deptName + '危险源分布情况',
      });
    });
  };

  const emits = defineEmits(['handleBackDataRundown', 'handleClickChart']);
  const handleBackDataRundown = () => {
    emits('handleBackDataRundown');
  };
</script>
<style lang="less" scoped>
  .dept-risk-distribution-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    padding-bottom: 0.4rem;
    .dept-risk-distribution-echarts {
      width: 100%;
      height: 100%;
    }
    .title {
      position: absolute;
      top: 2.5rem;
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
