<!-- 应急预案数图表 -->
<template>
  <div class="emergency-number-container">
    <div class="emergency-number-echarts" ref="echartsRef"></div>
    <div class="emergency-number-total-content">
      <div class="emergency-number-description"> 应急预案数 </div>
      <div class="emergency-number-num">
        {{ currentData.total.count }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { markRaw, onMounted, toRef, watch } from 'vue';
  import { ref } from 'vue';
  import {
    findFontSize,
    getArrByName,
    getCurrentByName,
  } from './composition/useDataScreen';
  import { computed } from 'vue';
  import { watchEffect } from 'vue';
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
    const curData = getArrByName(data.value, [
      'emanagementCount',
      'emanagementSpecialCount',
      'emanagementSceneCount',
      'emanagementSynthesisCount',
    ]);
    return {
      total: getCurrentByName(curData, 'emanagementCount'),
      specialProject: getCurrentByName(curData, 'emanagementSpecialCount'),
      synthesis: getCurrentByName(curData, 'emanagementSynthesisCount'),
      scene: getCurrentByName(curData, 'emanagementSceneCount'),
    };
  });

  let pieColors = ['#41E4BB', '#357cf0', '#EE3E3E'];
  let richColor: any = {};
  pieColors.forEach((item, idx) => {
    richColor[`color${idx}`] = {
      fontSize: findFontSize(20),
      align: 'center',
      color: item,
    };
  });

  const chartOption = (currentData: any) =>
    myChart.value.setOption({
      tooltip: {
        trigger: 'item',
      },
      legend: {
        show: false,
        orient: 'vertical',
        align: 'left',
        right: '0px',
        top: '25%',
        textStyle: {
          color: '#ffffff',
        },
        formatter: (name: string) => {
          const obj = {
            综合预案: currentData.synthesis.count,
            专项预案: currentData.specialProject.count,
            现场处置: currentData.scene.count,
          };
          const val = obj[name as keyof typeof obj];
          return `${name}\t\t${Math.round(
            (val / currentData.total.count) * 100
          )}%\t\t${val}`;
        },
      },
      series: [
        {
          type: 'pie',
          radius: ['30%', '60%'],
          center: ['40%', '45%'],
          label: {
            overflow: 'none',
            formatter: function (params: any) {
              return `{name|${params.name}}\n\n{color${
                params.dataIndex
              }|${Math.round(
                (params.value / currentData.total.count) * 100
              )}%}\t\t{color${params.dataIndex}|${params.value}}`;
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
                var colorList = ['#41E4BB', '#357cf0', '#EE3E3E'];
                return colorList[params.dataIndex];
              },
            },
          },
          labelLine: {
            show: true,
            normal: {
              length: findFontSize(10), // 指示线宽度
            },
          },
          data: [
            {
              value: currentData.synthesis.count,
              name: '综合预案',
              label: {
                show: currentData.synthesis.count !== 0,
              },
              labelLine: {
                show: currentData.synthesis.count !== 0,
              },
            },
            {
              value: currentData.specialProject.count,
              name: '专项预案',
              label: {
                show: currentData.specialProject.count !== 0,
              },
              labelLine: {
                show: currentData.specialProject.count !== 0,
              },
            },
            {
              value: currentData.scene.count,
              name: '现场处置',
              label: {
                show: currentData.scene.count !== 0,
              },
              labelLine: {
                show: currentData.scene.count !== 0,
              },
            },
          ],
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
  };
</script>
<style lang="less" scoped>
  .emergency-number-echarts {
    width: 70%;
    height: 100%;
  }
  .emergency-number-container {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    background: linear-gradient(
      180deg,
      #043c95 0%,
      #042144 14.22%,
      #04173e 51.46%,
      #072d5e 87.86%,
      #043e97 100%
    );
    border: 0.5px solid #3061db;
    box-shadow: 0px 0px 3px #03fff6;
    .emergency-number-total-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 1.14rem;
      gap: 0.7rem;
      color: #e6f7ff;
      .emergency-number-num {
        font-size: 2.14rem;
        font-family: 'Roboto';
        color: #00ddff;
        font-weight: 700;
      }
    }
  }
</style>
