<!-- 员工证照分布图 -->
<template>
  <div class="employee-license-container">
    <div class="employee-license-echarts" ref="echartsRef"></div>
  </div>
</template>

<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { computed, markRaw, onMounted, toRef, watch } from 'vue';
  import { ref } from 'vue';
  import { findFontSize, getArrByNameFuzzy } from './composition/useDataScreen';
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
    const curData = getArrByNameFuzzy(data.value, 'licenseType');
    const licenseNameArr: any[] = [];
    const licenseCountArr: any[] = [];
    curData.forEach((item: any) => {
      licenseNameArr.push(item.type);
      licenseCountArr.push(item.count);
    });
    return {
      licenseNameArr,
      licenseCountArr,
    };
  });

  const chartOption = (currentData: any) =>
    myChart.value.setOption({
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow',
        },
        formatter: function (params: any) {
          return `${params[0].name}\t${params[0].value}`;
        },
      },
      grid: {
        top: '20%',
        bottom: '20%',
        left: '0%',
        right: '0%',
        containLabel: true,
      },
      xAxis: {
        // max: 8,
        type: 'category',
        data: currentData.licenseNameArr,
        axisLabel: {
          interval: 0,
          overflow: 'break',
          width: 50,
          lineHeight: findFontSize(16),
          color: 'rgba(255, 255, 255, 0.5)',
        },
        axisTick: {
          //坐标轴刻度与标签对齐
          alignWithLabel: true,
        },
        axisLine: {
          lineStyle: {
            color: '#4346D3',
          },
        },
      },
      yAxis: {
        show: false,
        type: 'value',
      },
      series: [
        {
          type: 'bar',
          barWidth: findFontSize(30),
          itemStyle: {
            normal: {
              //柱状图渐变
              color: 'transparent',
              //刻度显示在顶部
              label: {
                show: true,
                fontSize: findFontSize(12),
                color: 'rgba(255, 255, 255, 0.9)',
                align: 'right',
                position: 'top',
              },
            },
          },
          z: 1,
          data: currentData.licenseCountArr,
          animationEasing: 'elasticOut',
        },
        {
          type: 'pictorialBar',
          symbolRepeat: 'fixed',
          symbolMargin: findFontSize(3), // 小格子的宽
          symbol: 'rect',
          symbolClip: true,
          symbolSize: [findFontSize(30), findFontSize(4)],
          symbolPosition: 'start',
          itemStyle: {
            normal: {
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                { offset: 0, color: '#357cf0' },
                { offset: 1, color: '#1EE7E7' },
              ]),
            },
          },
          tooltip: {
            show: true,
          },
          z: 2,
          data: currentData.licenseCountArr,
          animationEasing: 'elasticOut',
        },
        {
          type: 'bar',
          barGap: '-120%', // 设置外框粗细
          data: currentData.licenseCountArr,
          barWidth: findFontSize(30),
          itemStyle: {
            normal: {
              color: 'transparent', // 填充色
              barBorderWidth: findFontSize(1), // 边框宽度
              label: {
                // 标签显示位置
                show: false,
                position: 'top', // insideTop 或者横向的 insideLeft
              },
            },
          },
          z: 0,
        },
      ],
    });

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

    myChart.value.on('click', function (params: any) {
      const curData = getArrByNameFuzzy(data.value, 'licenseType')[
        params.dataIndex
      ];
      emits('handleClickEchart', { name: curData.name, type: 'licenseSkill' });
    });
  };

  const emits = defineEmits(['handleClickEchart']);
</script>
<style lang="less" scoped>
  .employee-license-container {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .employee-license-echarts {
    width: 100%;
    height: 100%;
  }
  .title {
    position: absolute;
    top: 0.5rem;

    font-size: 1rem;
    color: #ffffff;
  }
  .icon-reply {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    font-size: 1.5rem;
    color: #ffffff;
    cursor: pointer;
  }
</style>
