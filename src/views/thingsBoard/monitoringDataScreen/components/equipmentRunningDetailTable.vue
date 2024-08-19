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
      label: '设备名称',
      dataIndex: 'name',
    },
    {
      label: '设备配置',
      dataIndex: 'deviceProfileName',
    },
    {
      label: '设备状态',
      dataIndex: 'activeName',
      cellStyle(record: any) {
        return {
          color: record.active ? '#43d1a2' : '#f53f3f',
        };
      },
    },
    {
      label: '设备告警状态',
      dataIndex: 'deviceAlarmStatus',
      cellStyle(record: any) {
        return {
          color: !record.deviceAlarmCode ? '#43d1a2' : '#f53f3f',
        };
      },
    },
    {
      label: '设备位置',
      dataIndex: 'deviceLocation',
    },
  ];

  const tableData = computed(() => {
    return props.data.map((data: any) => {
      return {
        ...data,
        activeName: data.active ? '在线' : '离线',
      };
    });
  });

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
    overflow: hidden;
    .title {
      position: absolute;
      top: 2.5rem;
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
