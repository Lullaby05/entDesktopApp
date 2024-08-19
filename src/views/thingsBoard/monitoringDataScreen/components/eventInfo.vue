<template>
  <div class="event-info-container">
    <div class="event-title">
      <div class="left">
        <div>{{ info.eventName }}</div>
        <a-tag :color="info.color">{{ info.eventLevelName }}</a-tag>
      </div>
    </div>
    <div class="event-desctiption">
      <span class="desc-text">{{ info.eventDesc }}</span>
      <div class="time-group">
        <div v-if="props.needTime">
          <span class="time-blue" v-if="dayDifference">{{
            dayDifference
          }}</span>
          <span>天</span>
          <span class="time-blue" v-if="hourDifference">{{
            hourDifference
          }}</span>
          <span>时</span>
          <span class="time-blue">{{ minuteDifference }}</span>
          <span>分</span>
          <span class="time-blue">{{ secondDifference }}</span>
          <span>秒</span>
        </div>
        <span class="time">{{ info.createTime }}</span>
      </div>
    </div>
    <div class="trigger-device">
      <div class="label">触发设备：</div>
      <div class="table">
        <a-table
          :columns="columns"
          :data="tableData"
          :bordered="false"
          :hoverable="false"
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
  import {
    ref,
    onMounted,
    toRefs,
    computed,
    toRef,
    onBeforeUnmount,
  } from 'vue';
  import { calculateTime } from '../../eventConfig/eventManagement/composition/calculateTime';

  const props = defineProps({
    info: {
      type: Object,
      default: () => ({}),
    },
    needTime: {
      type: Boolean,
      default: true,
    },
  });

  const info = toRef(props, 'info');
  const eventDate = computed(() => {
    return info.value.createTime;
  });

  const dayDifference = ref('0');
  const hourDifference = ref('0');
  const minuteDifference = ref('0');
  const secondDifference = ref('0');

  const status = info.value.eventStatus === 2;
  const timer = ref<any>(null);

  onMounted(() => {
    const updateDifference = () => {
      const { days, hours, minutes, seconds } = calculateTime({
        now: new Date(),
        time: eventDate.value,
        returnType: 'object',
        status,
      });
      dayDifference.value = days;
      hourDifference.value = hours;
      minuteDifference.value = minutes;
      secondDifference.value = seconds;
    };

    // 每秒更新一次时间差
    if (!status) timer.value = setInterval(updateDifference, 1000);
  });
  onBeforeUnmount(() => {
    clearInterval(timer.value);
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
  // const tableData = ref<TableData[]>(
  //   (info.value.deviceDataList || [])
  //     .filter((item: any) => !blackList.includes(item.key))
  //     .map((ele: any) => ({
  //       ...ele,
  //       reportValue: ele.key + '：' + ele.valueAsString,
  //       deviceName: info.value.deviceName,
  //       deviceLocation: info.value.deviceLocation,
  //     }))
  //     .reduce((acc: any, cur: any) => acc.concat(cur), [])
  // );
  const tableData = computed(() => {
    const data = (info.value.deviceDataList || [])
      .filter((item: any) => !blackList.includes(item.key))
      .map((ele: any) => ({
        ...ele,
        reportValue: ele.key + ':' + ele.valueAsString,
        deviceName: info.value.deviceName,
        deviceLocation: info.value.deviceLocation,
      }));
    return [
      {
        ...data[0],
        reportValue: data.reduce(
          (acc: any, cur: any) => acc + cur.reportValue + '；',
          ''
        ),
      },
    ];
  });
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
      align: 'center',
    },
    {
      dataIndex: 'deviceLocation',
      title: '设备位置',
      align: 'center',
    },
    {
      dataIndex: 'reportValue',
      title: '上报值',
      align: 'center',
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
    height: 100%;
    overflow: auto;
    font-size: 1rem;
    .label {
      color: #ffffff;
    }
    .flex-display(flex-start, flex-start, column);
    .event-title {
      width: 100%;
      margin-bottom: 1.29rem;
      .flex-display(space-between);
      .left {
        .flex-display(flex-start, flex-start, row,0.71rem);
        border-bottom: 1px solid #144583;
        position: relative;
        width: 100%;
        &::before {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 4.75rem;
          height: 2px;
          background: rgba(45, 153, 255, 1);
        }
        & > div:nth-of-type(1) {
          margin-bottom: 0.36rem;
          font-family: '优设标题黑';
          font-size: 1.43rem;
          font-weight: 400;
          line-height: 1.79rem;
          letter-spacing: -0.02rem;
          color: #ffffff;
          text-align: left;
          vertical-align: top;
        }
      }
    }
    .event-desctiption {
      font-size: 1rem;
      width: 100%;
      font-family: 'Roboto';
      margin-bottom: 0.5rem;
      .flex-display(space-between, flex-start, row);
      .desc-text {
        font-size: 1.1rem;
        color: rgba(42, 130, 228, 1);
        font-weight: 700;
      }
      .time-group {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 0.57rem;
        .time-blue {
          padding: 0.2rem;
          color: rgba(42, 130, 228, 1);
          font-weight: 700;
        }
      }
    }
    .trigger-device {
      width: 100%;
      .flex-display(flex-start, flex-start, column, 10px);
      .table {
        width: 100%;
        --gray-10: #ffffff;
        --color-neutral-2: #0a1454;
        --color-bg-2: #090e36;
        font-size: 1rem;
        :deep(.arco-table-td) {
          color: #ffffff;
          border: none;
          font-size: 0.85rem;
        }
        :deep(.arco-table-th) {
          color: #ffffff;
          font-size: 0.85rem;
        }
      }
    }
    .footer {
      width: 100%;
      margin-top: auto;
      margin-bottom: 1rem;
      padding-top: 1rem;
      .flex-display(space-between, center, row);
      .value {
        color: #2a82e4;
      }
    }
  }
</style>
