<template>
  <div class="operation-detail-situation-container">
    <div class="title">{{ props.title }}</div>
    <div class="table-content">
      <DetailTableComponent
        :tableColumns="tableColumns"
        :tableData="tableData"
      />
    </div>
    <icon-reply class="icon-reply" @click="handleBackDataRundown" />
  </div>
</template>
<script lang="ts" setup>
  import DetailTableComponent from '@/views/dashboard/workplace/screenComponents/detailTableComponent.vue';
  import Decimal from 'decimal.js';

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      default: () => [],
    },
  });

  const tableColumns: any = [
    {
      label: '事件级别',
      dataIndex: 'type',
      cellStyle: (record: any) => ({ color: record.color }),
    },
    {
      label: '平均响应时长',
      dataIndex: 'responseTime',
    },
    {
      label: '平均处理时长',
      dataIndex: 'handleTime',
    },
    {
      label: '处置率',
      dataIndex: 'handleRatio',
    },
  ];

  const colorObj = {
    '1-1': '#D43030',
    '1-2': '#f59a23',
    '1-3': '#ffdf25',
    '1-4': '#357cf0',
    '2-1': '#D43030',
    '2-2': '#357cf0',
    '3-1': '#D43030',
    '3-2': '#f59a23',
    '3-3': '#ffdf25',
  };

  const tableData = computed(() =>
    props.data.map((val: any) => {
      return {
        ...val,
        color: colorObj[val.eventLevel as keyof typeof colorObj],
        handleRatio: new Decimal(val.handleRatio).mul(100).toString() + '%',
      };
    })
  );

  const emits = defineEmits(['handleBackDataRundown']);
  const handleBackDataRundown = () => {
    emits('handleBackDataRundown');
  };
</script>
<style lang="less" scoped>
  .operation-detail-situation-container {
    width: 100%;
    height: 100%;
    position: relative;
    .title {
      position: absolute;
      top: 0.5rem;
      font-size: 1rem;
      color: #ffffff;
    }
    .table-content {
      padding-top: 2rem;
      height: 100%;
    }
    .icon-reply {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      font-size: 1.5rem;
      color: #ffffff;
      cursor: pointer;
    }
  }
</style>
