<!-- 动态风险组成图表 -->
<template>
  <div class="dynamic-risk-composition-container">
    <div class="dynamic-risk-composition-echarts" ref="echartsRef"></div>
  </div>
</template>
<script lang="ts" setup>
  import echarts from '@/utils/echarts';
  import { onMounted } from 'vue';
  import { ref } from 'vue';
  import { findFontSize } from './composition/useDataScreen';
  const echartsRef = ref();
  const treeData = {
    name: '动态风险',
    children: [
      {
        name: '实时监测',
        value: 28,
        children: [
          {
            name: '探测器',
            value: 18,
            children: [
              {
                name: '高温',
                value: 14,
              },
              {
                name: '高压',
                value: 4,
              },
            ],
          },
          {
            name: 'AI识别',
            value: 10,
            children: [
              {
                name: '烟雾',
                value: 1,
              },
              {
                name: '抽烟',
                value: 6,
              },
              {
                name: '未带安全帽',
                value: 2,
              },
              {
                name: '非法闯入',
                value: 1,
              },
            ],
          },
        ],
      },
      {
        name: '安全管理',
        value: 30,
        children: [
          {
            name: '风险辨识',
            value: 2,
          },
          {
            name: '风险管控',
            value: 6,
          },
          {
            name: '隐患排查',
            value: 10,
          },
          {
            name: '隐患治理',
            value: 3,
          },
          {
            name: '教育培训',
            value: 3,
          },
          {
            name: '应急预案',
            value: 3,
          },
          {
            name: '应急演练',
            value: 3,
          },
        ],
      },
      {
        name: '固有风险',
        value: 25,
        children: [
          {
            name: '危化品',
            value: 10,
          },
          {
            name: '特种设备',
            value: 15,
          },
        ],
      },
    ],
  };
  let data: any[] = [];
  let links: any[] = [];
  // 将树形数据转化为桑基图所需的数据格式
  const createData = (node: { name: any; value?: any; children?: any }) => {
    data.push({ name: node.name });
    if (node.children) {
      node.children.forEach(
        (item: { name: any; value?: any; children?: any }) => {
          createData(item);
          links.push({
            source: node.name,
            target: item.name,
            value: item.value,
          });
        }
      );
    }
  };
  createData(treeData);
  const option = {
    title: {
      text: '',
    },
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove',
    },
    grid: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
    },
    series: [
      {
        type: 'sankey',
        data: data,
        links: links,
        emphasis: {
          focus: 'adjacency',
        },
        levels: [
          {
            depth: 0,
            itemStyle: {
              color: '#357cf0',
            },
            lineStyle: {
              color: 'source',
              opacity: 0.1,
            },
          },
          {
            depth: 1,
            itemStyle: {
              color: '#14C9C9',
            },
            lineStyle: {
              color: 'source',
              opacity: 0.1,
            },
          },
          {
            depth: 2,
            itemStyle: {
              color: '#F7BA1E',
            },
            lineStyle: {
              color: 'source',
              opacity: 0.1,
            },
          },
          {
            depth: 3,
            itemStyle: {
              color: '#722ED1',
            },
            lineStyle: {
              color: 'source',
              opacity: 0.1,
            },
          },
        ],
        label: {
          fontSize: findFontSize(12),
          color: 'rgba(255, 255, 255, 0.5)',
        },
        lineStyle: {
          curveness: 0.5,
        },
      },
    ],
  };

  onMounted(() => {
    initChart();
  });

  const initChart = () => {
    const myChart = echarts.init(echartsRef.value as unknown as HTMLElement);
    window.addEventListener('resize', function () {
      myChart && myChart.resize();
    });
    option && myChart.setOption(option);
  };
</script>
<style lang="less" scoped>
  .dynamic-risk-composition-container {
    width: 100%;
    height: 100%;
  }
  .dynamic-risk-composition-echarts {
    width: 100%;
    height: 100%;
  }
</style>
