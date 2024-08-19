<template>
  <div class="staff-skill-license-container">
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
  import DetailTableComponent from './detailTableComponent.vue';

  const props = defineProps({
    data: {
      type: Array,
      default: () => [],
    },
    title: {
      type: String,
      default: '',
    },
  });

  const tableColumns = [
    {
      label: '员工姓名',
      dataIndex: 'employeeName',
    },
    {
      label: '证照名称',
      dataIndex: 'cardName',
    },
    {
      label: '证照状态',
      dataIndex: 'statusName',
      cellStyle: (record: any) => {
        return {
          color: !record.status ? 'red' : '',
        };
      },
    },
    {
      label: '有效截止日期',
      dataIndex: 'effectiveEndDate',
    },
  ];

  const tableData = computed(() => props.data);

  const emits = defineEmits(['handleBackDataRundown']);
  const handleBackDataRundown = () => {
    emits('handleBackDataRundown');
  };
</script>
<style lang="less" scoped>
  .staff-skill-license-container {
    width: 100%;
    height: 100%;
    position: relative;
    .title {
      position: absolute;
      top: 1.5rem;
      font-size: 1rem;
      color: #ffffff;
    }
    .table-content {
      padding-top: 2.5rem;
      height: 100%;
    }
    .icon-reply {
      position: absolute;
      top: 0rem;
      right: 0.5rem;
      font-size: 1.5rem;
      color: #ffffff;
      cursor: pointer;
    }
  }
</style>
