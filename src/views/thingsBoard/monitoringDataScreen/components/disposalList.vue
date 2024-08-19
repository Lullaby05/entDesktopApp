<template>
  <div class="disposal-list-container">
    <div class="list-tabs">
      <div
        :class="['tab-item', { active: item.code === activeKey }]"
        v-for="(item, index) in tabsList"
        :key="index"
        @click="changeTab(item)"
      >
        <span class="name">{{ item.name }}</span>
        <span class="count">{{ item.num > 99 ? '99+' : item.num }}</span>
      </div>
    </div>
    <div class="list-content" v-if="data.length">
      <a-popover
        v-for="item in data"
        :key="item.eventRecordId"
        title=""
        position="lb"
        content-class="content-class"
        @popup-visible-change="(visible:boolean) => showItem(item, visible)"
      >
        <div
          class="list-item"
          :style="{ borderColor: item.color }"
          @click.self="jumpToHandle(item)"
        >
          <div class="left">
            <div class="title-and-level">
              <div class="title">{{ item.eventName }}</div>
              <a-tag class="level" v-if="item.eventLevel" :color="item.color">{{
                item.eventLevelName
              }}</a-tag>
            </div>
            <div class="location">{{ item.deviceLocation }}</div>
          </div>
          <div class="right">
            <div class="report-time">{{ item.reportTime }}</div>
            <div class="status">{{ item.eventStatusName }}</div>
            <div class="btn" v-if="item.eventType === '1'">
              <a-button @click="closeEvent(item.eventRecordId)"
                >关闭事件</a-button
              >
            </div>
          </div>
        </div>
        <template #content>
          <div class="detail-container">
            <eventInfo
              :need-time="false"
              :key="item.eventRecordId"
              v-if="info"
              :info="info"
            />
            <emergencyEventProgress
              :key="item.eventRecordId + record.length"
              v-if="info && info.eventType == '1' && record"
              :record="record"
              :status="info?.eventStatus === 2"
            />
          </div>
        </template>
      </a-popover>
    </div>
    <div class="no-data" v-if="!data.length && tabsList.length">
      <noEventList />
      <!-- {{ '无' + tabsList.find((item) => item.code === activeKey)!.name }} -->
    </div>
    <closeEventModal ref="closeEventModalRef" @ok="initData" />
  </div>
</template>
<script lang="ts" setup>
  import { dictResponseType } from '@/api';
  import { formatDate } from '@/utils/utils';
  import { computed, ref } from 'vue';
  import {
    calculateTime,
    timeUnitsType,
  } from '@/views/thingsBoard/eventConfig/eventManagement/composition/calculateTime';
  import eventInfo from './eventInfo.vue';
  import closeEventModal from './closeEventModal.vue';
  import emergencyEventProgress from '@/views/thingsBoard/eventConfig/eventManagement/components/emergencyEventProgress.vue';
  import noEventList from './noEventList.vue';
  import {
    getEventDetail,
    getEventListScreen,
    getEventTabsList,
  } from '@/api/thingsBoard';
  import { PropType } from 'vue';

  const props = defineProps({
    data: {
      type: Array as PropType<{ code?: number; name: string; num: number }[]>,
      default: () => [],
    },
  });
  // tab
  // const tabsList = ref<{ code?: number; name: string; num: number }[]>([]);
  const tabsList = computed(() => {
    return props.data;
  });
  const activeKey = ref(1);
  const changeTab = (item: any) => {
    activeKey.value = item.code;
    getList();
  };
  // const getTabList = async () => {
  //   const tabsListRes = await getEventTabsList();
  //   tabsList.value = tabsListRes.data;
  // };
  // getTabList();

  // list
  const eventTypeLevelDict = [
    {
      dictKey: '应急事件',
      dictValue: '1',
      children: [
        { dictKey: '一级', dictValue: '1-1', color: '#D43030' },
        { dictKey: '二级', dictValue: '1-2', color: '#f59a23' },
        { dictKey: '三级', dictValue: '1-3', color: '#ffdf25' },
        { dictKey: '四级', dictValue: '1-4', color: '#357cf0' },
      ],
    },
    {
      dictKey: '隐患',
      dictValue: '2',
      children: [
        { dictKey: '重大', dictValue: '2-1', color: '#D43030' },
        { dictKey: '一般', dictValue: '2-2', color: '#357cf0' },
      ],
    },
    {
      dictKey: '设备故障',
      dictValue: '3',
      children: [
        { dictKey: '故障', dictValue: '3-1', color: '#D43030' },
        { dictKey: '告警', dictValue: '3-2', color: '#f59a23' },
        { dictKey: '预警', dictValue: '3-3', color: '#ffdf25' },
      ],
    },
  ];
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
  const now = ref(new Date());
  const data = ref<any>([]);
  const getList = async () => {
    const { data: listData } = await getEventListScreen({
      eventType: activeKey.value,
    });
    data.value = listData
      .map((ele: any) => {
        const eventDict = eventTypeLevelDict.find(
          (item) => item.dictValue === ele.eventType
        );
        const levelDict = eventDict?.children?.find(
          (item) => item.dictValue === ele.eventLevel
        );
        const handleStatusDict = handleStatusList.value.find(
          (item) => item.dictValue === ele.eventStatus
        );
        return {
          ...ele,
          color: levelDict?.color,
          reportTime: computed(() =>
            calculateTime({
              now: now.value,
              time: ele.createTime,
              leastUnit: timeUnitsType.seconds,
              status: false,
            })
          ),
          eventTypeName: eventDict?.dictKey,
          eventLevelName: levelDict?.dictKey,
          eventStatusName: handleStatusDict?.dictKey,
        };
      })
      .sort(
        (a: any, b: any) =>
          a.eventLevel.split('-')[1] - b.eventLevel.split('-')[1] ||
          new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
      );
  };
  getList();
  setInterval(() => {
    now.value = new Date();
  }, 1000);

  // close event
  const closeEventModalRef = ref<InstanceType<typeof closeEventModal> | null>(
    null
  );
  const closeEvent = (id: string) => {
    closeEventModalRef.value!.open(id);
  };

  // jump to handle
  const emit = defineEmits(['jumpToHandle', 'initData']);
  const jumpToHandle = (item: any) => {
    emit('jumpToHandle', item);
  };

  // show item
  const info = ref<any>(undefined);
  const record = ref<any>(undefined);

  const getDetail = async (id: string) => {
    const { data } = await getEventDetail(id, 1, 1);
    const eventDict = eventTypeLevelDict.find(
      (item) => item.dictValue === data.info.eventType
    );
    const levelDict = eventDict?.children?.find(
      (item) => item.dictValue === data.info.eventLevel
    );
    const handleStatusDict = handleStatusList.value.find(
      (item) => item.dictValue === data.info.eventStatus
    );
    const statusDict = statusList.value.find(
      (item) => item.dictValue === data.info.deviceAlarmStatus
    );
    const obj = {
      2: '进入隐患处理流程',
      3: '进入设备维保流程',
    };
    info.value = {
      ...data.info,
      color: levelDict?.color,
      eventTypeName: eventDict?.dictKey,
      eventLevelName: levelDict?.dictKey,
      handleStatusName:
        data.info.eventStatus === 1
          ? obj[data.info.eventType as keyof typeof obj] ??
            handleStatusDict?.dictKey
          : handleStatusDict?.dictKey,
      statusName: statusDict?.dictKey,
    };
    record.value = data.record;
  };
  const showItem = (item: any, visible: boolean) => {
    if (visible) {
      record.value = [];
      getDetail(item.eventRecordId);
    }
  };

  const initData = () => {
    // getTabList();
    // getList();
    emit('initData');
  };
</script>
<style lang="less" scoped>
  .disposal-list-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    .list-tabs {
      flex: 0 0 auto;
      display: flex;
      .tab-item {
        display: flex;
        align-items: center;
        padding: 0 1rem 1rem;
        color: #306fff;
        cursor: pointer;
        font-size: 1.29rem;
        font-family: 'Alibaba';
        &.active {
          font-family: 'Alibaba-Medium';
          color: #ffffff;
          font-weight: 700;
        }
        .count {
          display: flex;
          align-items: center;
          justify-self: center;
          color: #ffffff;
          font-family: 'Alibaba';
          font-weight: 400;
          padding: 0.2rem 0.4rem;
          line-height: 1;
          font-size: 0.72rem;
          margin-left: 0.5rem;
          border-radius: 2.54rem;
          background: #d43030;
          border: 0.5px solid #ff5733;
        }
      }
    }
    .list-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 0.36rem;
      overflow: auto;
      .list-item {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding: 0.71rem 1.07rem;
        color: #ffffff;
        font-family: 'Alibaba';
        font-size: 0.86rem;
        border-radius: 2px;
        background: linear-gradient(
          180deg,
          #043c95 0%,
          #042144 14.22%,
          #04173e 51.46%,
          #072d5e 87.86%,
          #043e97 100%
        );
        border: 0.5px solid #ff5733;
        cursor: pointer;
        .report-time,
        .status,
        .location,
        .level,
        .title {
          cursor: text;
        }
        .left {
          display: flex;
          flex-direction: column;
          gap: 0.57rem;
          .title-and-level {
            display: flex;
            align-items: center;
            gap: 0.71rem;
            .title {
              font-size: 1.14rem;
            }
          }
        }
        .right {
          display: flex;
          flex-direction: column;
          gap: 0.57rem;
          align-items: flex-end;
          .btn button {
            border-radius: 36px;
            background: #001540;
            border: 0.5px solid #ffffff;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: #ffffff;
            height: 18px;
            font-size: 0.86rem;
          }
        }
      }
    }
    .no-data {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100%;
      border-radius: 4px;
      background: linear-gradient(
        180deg,
        rgba(4, 60, 149, 1) 0%,
        rgba(4, 33, 68, 0.74) 14.22%,
        rgba(0, 21, 64, 0.9) 51.46%,
        rgba(7, 45, 94, 0.77) 87.86%,
        rgba(4, 62, 151, 1) 100%
      );
      border: 1px solid rgba(48, 97, 219, 1);
      box-shadow: 0px 0px 6px rgba(3, 255, 246, 0.34);
      font-size: 32px;
      font-weight: 400;
      letter-spacing: 0px;
      line-height: 32px;
      color: rgba(255, 255, 255, 1);
      svg {
        width: 13rem;
        height: 13rem;
      }
    }
  }
</style>
<style lang="less">
  .content-class {
    height: 60vh;
    width: 25vw;
    overflow: auto;
    background: linear-gradient(
      180deg,
      rgba(4, 60, 149, 1) 0%,
      rgba(4, 33, 68, 0.74) 14.22%,
      rgba(4, 23, 62, 0.8) 51.46%,
      rgba(7, 45, 94, 0.77) 87.86%,
      rgba(4, 62, 151, 1) 100%
    ) !important;
    border: 0.5px solid rgba(48, 97, 219, 1);
    box-shadow: 0px 0px 3px rgba(3, 255, 246, 0.34);
    color: #ffffff;
    background-color: transparent !important;
    .event-info-container {
      color: #ffffff;
      .event-desctiption .time {
        color: #ffffff;
      }
    }
    .emergency-event-progress {
      --color-text-1: #ffffff;
      .inner-steps {
        .content-items,
        .finish-items {
          border-radius: 2px;
          background: linear-gradient(
            180deg,
            #043c95 0%,
            #042144 14.22%,
            #04173e 51.46%,
            #072d5e 87.86%,
            #043e97 100%
          );
          border: 0.5px solid #2a82e4;
          .label {
            color: #ffffff;
          }
          .attachment a {
            color: #2a82e4;
            cursor: pointer;
          }
        }
        .content-item + .content-item {
          // margin-top: 0.5rem;
        }
        .header {
          .title {
            color: #ffffff;
          }
          .person-name {
            font-size: 1rem;
          }
          .dept {
            --color-border-2: #2a82e4;
            --color-fill-2: transparent;
            --color-text-1: #2a82e4;
          }
          .time {
            color: #ffffff;
          }
        }
      }
    }
  }
</style>
