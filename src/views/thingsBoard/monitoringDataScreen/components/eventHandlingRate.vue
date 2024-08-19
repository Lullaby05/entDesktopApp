<!-- 隐患趋势图表 -->
<template>
  <div class="event-handle-rate-container">
    <div class="event-handle-rate-echarts" ref="echartsRef"></div>
    <div class="event-handle-rate-content">
      <div class="event-handle-rate-description">事件处置率</div>
      <div class="event-handle-rate-num">{{ Math.round(currentData) }}%</div>
    </div>
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
      default: () => ({
        all: 0,
        handled: 0,
      }),
    },
  });

  const data = toRef(props, 'data');

  const currentData = computed<any>(() => {
    const { all = 0, handled = 0 } = data.value;
    if (all === 0) {
      return 0;
    }
    return new Decimal(handled).div(new Decimal(all)).mul(100).toNumber();
  });
  const startColor = ref('#43cf7c');
  const endColor = ref('#43cf7c');

  const chartOption = (currentData: any) => {
    myChart.value.setOption({
      series: [
        {
          type: 'gauge', // 仪表盘类型
          name: '', // 用于tooltip的显示
          startAngle: 120, // 仪表盘开始角度（设置背景圆的角度）
          endAngle: 480, // 仪表盘结束角度
          center: ['50%', '50%'], // 中心点（圆心坐标）
          radius: '100%', // 圆大小（仪表盘半径）
          clockwise: false, // 仪表盘刻度是否是顺时针增长
          // 仪表盘轴线相关配置
          axisLine: {
            show: true,
            roundCap: false, // 两端显示成圆形（背景环）
            clip: false, // 是否裁剪超出部分
            // 设置背景圆环样式
            lineStyle: {
              width: 10, // 圆环宽度
              color: [[1, '#0e3569']], // 圆环背景色
            },
          },
          // 仪表盘指针
          pointer: {
            show: false,
          },
          // 进度设置
          progress: {
            show: true,
            overlap: false, // 多组数据时进度条是否重叠
            roundCap: true, // 是否在两端显示成圆形
            clip: false, // 是否裁掉超出部分
            // 进度条样式
            itemStyle: {
              borderWidth: 0,
              shadowColor: '',
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [
                  {
                    offset: 0,
                    color: startColor.value, // 0% 处的颜色  '#02C77E'
                  },
                  {
                    offset: 1,
                    color: endColor.value, // 100% 处的颜色  '#017770'
                  },
                ],
                global: false, // 缺省为 false
              },
            },
          },
          // 仪表盘分割线
          splitLine: {
            show: false,
          },
          // 刻度样式
          axisTick: {
            show: false,
          },
          // 刻度标签
          axisLabel: {
            show: false,
          },
          title: {
            show: false,
            fontSize: 24,
          },
          detail: {
            // width: 50,
            // height: 14,
            fontSize: 14,
            color: 'auto',
          },
          data: [
            {
              value: currentData,
              name: '345',
              title: {},
              detail: {
                show: false,
              },
            },
          ],
        },
      ],
    } as echarts.EChartsOption);
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
  .event-handle-rate-container {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    padding: 0.79rem 2.14rem 0.79rem 1.57rem;
    font-size: 1.14rem;
    color: #ffffff;
    background: linear-gradient(
      180deg,
      #043c95 0%,
      #042144 14.22%,
      #04173e 51.46%,
      #072d5e 87.86%,
      #043e97 100%
    );
    border: 0.5px solid #3061db;
    box-shadow: 0px 0px 3px;
    .event-handle-rate-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.7rem;
    }
    .event-handle-rate-num {
      font-family: 'Roboto';
      color: #00ddff;
      font-size: 2.14rem;
      font-weight: 700;
    }
  }
  .event-handle-rate-echarts {
    width: 50%;
    height: 100%;
  }
</style>
