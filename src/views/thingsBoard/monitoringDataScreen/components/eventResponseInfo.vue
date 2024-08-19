<template>
  <div class="event-response-info-container">
    <div class="header">
      <div class="item">事件类型</div>
      <div class="item">平均响应时长</div>
      <div class="item">平均处理时长</div>
      <div class="item">处理率</div>
    </div>
    <div
      class="table-item"
      v-for="(item, index) in data"
      :key="index"
      @click="handleClick(item)"
    >
      <div class="item">{{ item.title }}</div>
      <div class="item">{{ item.averageResponseTime }}</div>
      <div class="item">{{ item.averageHandleTime }}</div>
      <div class="item">{{ item.handleRate }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, toRef } from 'vue';
  import Decimal from 'decimal.js';

  const props = defineProps({
    data: {
      data: Array,
      default: () => ({ avg: [] }),
    },
  });
  const data = computed(() => {
    const { avg } = props.data;
    const result = avg.map((item: any) => {
      return {
        title: item.type,
        averageResponseTime: item.responseTime,
        averageHandleTime: item.handleTime,
        handleRate:
          new Decimal(item.handleRatio).mul(100).toNumber().toFixed(0) + '%',
        ...item,
      };
    });
    return result;
  });

  const emits = defineEmits(['handleClickTableRow']);
  const handleClick = (item: any) => {
    emits('handleClickTableRow', {
      title: item.title + '处置详情',
      ids: item.ids,
      key: item.key,
    });
  };
</script>
<style lang="less" scoped>
  .event-response-info-container {
    width: 100%;
    height: 100%;
    color: #ffffff;
    font-size: 0.86rem;
    line-height: 0.86rem;
    font-family: 'Roboto';
    .header {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      text-align: center;
      margin-bottom: 1.07rem;
    }
    .table-item {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      text-align: center;
      padding: 1.36rem 0;
      background: #0a1454;
      cursor: pointer;
    }
    .table-item + .table-item {
      margin-top: 0.71rem;
    }
  }
</style>
