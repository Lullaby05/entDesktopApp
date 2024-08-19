<template>
  <div class="event-info-container">
    <div class="event-title">
      <div class="left">
        <div>{{ info.eventName }}</div>
        <div>
          <span>{{ info.eventTypeName }}</span>
          <a-tag :color="info.color">{{ info.eventLevelName }}</a-tag>
        </div>
      </div>
      <div class="right" v-if="!status">
        <span>距离事件上报已过去：</span>
        <div class="time">
          <span v-if="dayDifference"
            ><span>{{ dayDifference }}</span
            >天</span
          >
          <span v-if="hourDifference"
            ><span>{{ hourDifference }}</span
            >时</span
          >
          <span>
            <span>{{ minuteDifference }}</span
            >分
          </span>
          <span
            ><span>{{ secondDifference }}</span
            >秒</span
          >
        </div>
      </div>
    </div>
    <div class="event-desctiption">
      <span>{{ info.eventDesc }}</span>
      <span
        >事件发生时间：<span class="time">{{ info.createTime }}</span></span
      >
    </div>
    <div class="trigger-device">
      <div class="label">触发设备：</div>
      <div class="table">
        <a-table
          :columns="columns"
          :data="tableData"
          :bordered="{ cell: true }"
          :pagination="false"
          :span-method="spanMethod"
        >
          <template #number="{ rowIndex }">
            {{ rowIndex + 1 }}
          </template>
        </a-table>
      </div>
    </div>
    <div class="footer">
      <div>
        <span class="label">设备告警状态：</span>
        <span class="value">{{ info.statusName }}</span>
      </div>
      <div>
        <span class="label">事件处理状态：</span>
        <span class="value">{{ info.handleStatusName }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { TableColumnData, TableData } from '@arco-design/web-vue';
  import { ref, onMounted, toRefs, computed, toRef } from 'vue';
  import { calculateTime } from '../composition/calculateTime';
  import { dictResponseType } from '@/api';
  import { eventTypeLevelDict } from '../../eventConfigManagement/type';

  const props = defineProps({
    info: {
      type: Object,
      default: () => ({}),
    },
  });

  const info = toRef(props, 'info');

  const eventDate = info.value.createTime;

  const dayDifference = ref('0');
  const hourDifference = ref('0');
  const minuteDifference = ref('0');
  const secondDifference = ref('0');

  const status = info.value.eventStatus === 2;

  onMounted(() => {
    const updateDifference = () => {
      const { days, hours, minutes, seconds } = calculateTime({
        now: new Date(),
        time: eventDate,
        returnType: 'object',
        status,
      });
      dayDifference.value = days;
      hourDifference.value = hours;
      minuteDifference.value = minutes;
      secondDifference.value = seconds;
    };

    // 每秒更新一次时间差
    if (!status) setInterval(updateDifference, 1000);
  });
  const blackList = [
    'id',
    'lastActivityTime',
    'lastConnectTime',
    'lastDisconnectTime',
    'lastInactivityAlarmTime',
    'inactivityTimeout',
    'online',
    'heartbeat_cmd',
  ];
  const tableData = ref<TableData[]>(
    (info.value.deviceDataList || [])
      .filter((item: any) => !blackList.includes(item.key))
      .map((ele: any) => ({
        ...ele,
        reportValue: ele.key + '：' + ele.valueAsString,
        deviceName: info.value.deviceName,
        deviceLocation: info.value.deviceLocation,
      }))
  );
  const columns: TableColumnData[] = [
    {
      dataIndex: 'number',
      title: '序号',
      width: 70,
      align: 'center',
      slotName: 'number',
    },
    {
      dataIndex: 'deviceName',
      title: '设备名称',
    },
    {
      dataIndex: 'deviceLocation',
      title: '设备位置',
    },
    {
      dataIndex: 'reportValue',
      title: '上报值',
    },
    // {
    //   dataIndex: 'warningCondition',
    //   title: '告警条件',
    // },
  ];
  const spanMethod = (data: {
    record: TableData;
    column: any;
    rowIndex: number;
    columnIndex: number;
  }): { rowspan?: number; colspan?: number } | void => {
    const { record, column, rowIndex } = data;
    const deviceName = rowIndex
      ? record.deviceId !== tableData.value[rowIndex - 1].deviceId
      : true;
    if (
      (column.dataIndex === 'number' ||
        column.dataIndex === 'deviceName' ||
        column.dataIndex === 'deviceLocation') &&
      deviceName
    ) {
      const arr = tableData.value.filter(
        (item) => item.deviceId === record.deviceId
      );
      return {
        rowspan: arr.length,
      };
    }
  };
</script>
<style lang="less" scoped>
  @import '/src/assets/style/mixin.less';
  .event-info-container {
    padding: 0 20px;
    .label {
      color: var(--color-text-2);
    }
    .flex-display(flex-start, flex-start, column, 20px);
    .event-title {
      width: 100%;
      .flex-display(space-between);
      .left {
        .flex-display(flex-start, center, row, 20px);
        & > div:nth-of-type(1) {
          font-size: 20px;
          // font-family: 'Alibaba-Medium';
        }
        & > div:nth-of-type(2) {
          .flex-display(flex-start, center, row, 5px);
        }
      }
      .right {
        .flex-display(flex-start, flex-end, row);
        span:nth-of-type(1) {
          color: var(--color-text-2);
        }
        .time span span {
          padding: 0 0.2em;
          color: #d9001b;
          font-size: 20px;
        }
      }
    }
    .event-desctiption {
      font-size: 18px;
      width: 100%;
      .flex-display(space-between);
      span:nth-of-type(2) {
        font-size: 14px;
        color: var(--color-text-2);
      }
      .time {
        font-size: 20px;
        color: var(--color-text-black);
      }
    }
    .trigger-device {
      width: 100%;
      .flex-display(flex-start, flex-start, column, 10px);
      .table {
        width: 100%;
      }
    }
    .footer {
      .flex-display(flex-start, center, row, 50px);
    }
  }
</style>
