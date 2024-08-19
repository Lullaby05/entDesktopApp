<template>
  <div class="operation-detail-situation-container">
    <!-- <div class="title">{{ props.title }}</div> -->
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
  import { eventTypeLevelDict } from '../../eventConfig/eventConfigManagement/type';
  import { dictResponseType } from '@/api';

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
      label: '事件名称',
      dataIndex: 'eventName',
    },
    {
      label: '级别',
      dataIndex: 'eventLevelName',
      cellStyle(record: any) {
        return {
          color: record.color,
        };
      },
    },
    {
      label: '设备位置',
      dataIndex: 'deviceLocation',
    },
    {
      label: '设备上报时间',
      dataIndex: 'createTime',
    },
    {
      label: '设备告警状态',
      dataIndex: 'deviceStatusName',
      cellStyle(record: any) {
        return {
          color: record.deviceAlarmStatus === 0 ? '#d9001b' : '#357cf0',
        };
      },
    },
    {
      label: '事件处置状态',
      dataIndex: 'eventStatusName',
      cellStyle(record: any) {
        const colorObj = {
          orange: 'rgb(245, 154, 35)',
          green: '#03bf16',
          red: 'rgb(212, 48, 48)',
        };
        const eventColor = {
          0: colorObj.red,
          1: colorObj.orange,
          2: colorObj.green,
        };
        if (record.eventType === '2' || record.eventType === '3') {
          return {
            color: colorObj.orange,
          };
        } else {
          return {
            color: eventColor[record.eventStatus as keyof typeof eventColor],
          };
        }
      },
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

  const handleStatusList = ref<dictResponseType[]>([
    {
      dictKey: '待处置',
      dictValue: 0,
    },
    {
      dictKey: '处置中',
      dictValue: 1,
    },
    {
      dictKey: '已处置',
      dictValue: 2,
    },
  ]);
  const statusList = ref<dictResponseType[]>([
    {
      dictKey: '已创建',
      dictValue: 0,
    },
    {
      dictKey: '已清除',
      dictValue: 1,
    },
  ]);
  const tableData = computed(() => {
    return props.data.map((data: any) => {
      const eventDict = eventTypeLevelDict.find(
        (item) => item.dictValue === data.eventType
      );
      const levelDict = eventDict?.children?.find(
        (item) => item.dictValue === data.eventLevel
      );
      const handleStatusDict = handleStatusList.value.find(
        (item) => item.dictValue === data.eventStatus
      );
      const statusDict = statusList.value.find(
        (item) => item.dictValue === data.deviceAlarmStatus
      );
      return {
        ...data,
        color: colorObj[data.eventLevel as keyof typeof colorObj],
        eventTypeName: eventDict?.dictKey,
        eventLevelName: levelDict?.dictKey,
        eventStatusName: handleStatusDict?.dictKey,
        deviceStatusName: statusDict?.dictKey,
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
