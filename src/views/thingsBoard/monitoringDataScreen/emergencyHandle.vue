<template>
  <div class="emergency-handle-container">
    <div class="top">
      <div class="back" @click="goBack">
        <img src="@/assets/image/back-icon.png" alt="" />
      </div>
      <div class="tab-container">
        <div class="tabs">
          <template
            v-for="item in tabList.slice(0, 3)"
            :key="item.eventRecordId"
          >
            <div
              :class="['tab-item', { active: item.eventRecordId === id }]"
              :style="`--color: ${item.color}`"
              @click="changeTab(item.eventRecordId)"
            >
              <div class="title">{{ item.eventName }}</div>
              <a-tag class="level" v-if="item.eventLevel" :color="item.color">{{
                item.eventLevelName
              }}</a-tag>
            </div>
          </template>
        </div>
        <div v-if="tabList.length > 3">
          <a-popover position="bottom" content-class="tabs-content-class">
            <span class="rest-tabs-text">···</span>
            <template #content>
              <div class="tabs">
                <template
                  v-for="item in tabList.slice(3, tabList.length)"
                  :key="item.eventRecordId"
                >
                  <div
                    :class="['tab-item', { active: item.eventRecordId === id }]"
                    :style="`--color: ${item.color}`"
                    @click="changeTab(item.eventRecordId)"
                  >
                    <div class="title">{{ item.eventName }}</div>
                    <a-tag
                      class="level"
                      v-if="item.eventLevel"
                      :color="item.color"
                      >{{ item.eventLevelName }}</a-tag
                    >
                  </div>
                </template>
              </div>
            </template>
          </a-popover>
        </div>
      </div>
      <div class="rest-tabs"> </div>
      <div class="weather">
        <weather />
      </div>
      <div class="time-clock">
        <timeCard />
        <i
          class="iconfont"
          :class="isFullscreen ? 'icon-quxiaoquanping_o' : 'icon-quanping'"
          style="cursor: pointer; font-size: 1.3rem; color: #ffffff"
          @click="toggleFullScreen"
        ></i>
        <icon-minus
          style="cursor: pointer; font-size: 1.3rem; color: #ffffff"
          @click="min"
        />
        <i
          class="iconfont icon-dengchu_o"
          style="cursor: pointer; font-size: 1.3rem; color: #ffffff"
          @click="close"
        ></i>
      </div>
    </div>
    <div class="bottom">
      <div class="left">
        <dataBlock
          title="周边视频"
          width="71.88vw"
          height="55.09vh"
          padding="1.21rem 1.07rem 3.07rem 1.07rem"
        >
          <div class="live-video-content">
            <liveVideo deviceId="8" />
            <LiveVideoWRTC device-id="00041294044880401098" />
            <liveVideoTest
              device-id="33010111992227756953:33010642991327033738"
            />
            <LiveVideoWRTC device-id="00043204044980403009" />
          </div>
        </dataBlock>
        <div class="info-and-plan">
          <dataBlock
            title=""
            width="35.68vw"
            height="35.65vh"
            padding="1.07rem"
          >
            <eventInfo :key="id + record.length" v-if="info" :info="info" />
          </dataBlock>
          <dataBlock
            title="应急预案"
            width="calc(35.68vw + 0.21rem)"
            height="35.65vh"
            padding="1.07rem 1.43rem"
          >
            <emergencyPlan
              :key="id"
              :data="emergencyList"
              @search="getEmergencyPlan"
              @success="initData"
            />
          </dataBlock>
        </div>
      </div>
      <div class="right">
        <dataBlock title="处置进度" width="26.56vw" height="55.09vh">
          <div class="event-progress">
            <div class="btn-group">
              <a-button type="primary" @click="openLiveModal"
                >现场信息录入</a-button
              >
              <a-button type="primary" @click="openTaskModal"
                >新增处置任务</a-button
              >
              <a-button status="danger" @click="openCloseEventModal"
                >关闭事件</a-button
              >
            </div>
            <emergencyEventProgress
              :key="id + record.length"
              :record="record"
              :status="info?.eventStatus === 2"
              class="progress-content"
            />
          </div>
        </dataBlock>
        <dataBlock title="" width="26.56vw" height="35.65vh" padding="1.07rem">
          <planeGraph />
        </dataBlock>
      </div>
      <taskModal ref="taskModalRef" @ok="initData" />
      <liveSituationModal ref="liveModalRef" @ok="initData" />
      <closeEventModal
        ref="closeEventModalRef"
        @ok="
          () => {
            getTab(true);
            initData();
          }
        "
      />
    </div>
  </div>
</template>
<script lang="ts" setup>
  import dataBlock from '@/views/dashboard/workplace/screenComponents/dataBlock.vue';
  import timeCard from '@/views/dashboard/workplace/screenComponents/timeCard.vue';
  import weather from '@/views/dashboard/workplace/screenComponents/weather.vue';
  import emergencyPlan from './components/emergencyPlan.vue';
  import taskModal from './components/taskModal.vue';
  import liveSituationModal from './components/liveSituationModal.vue';
  import closeEventModal from './components/closeEventModal.vue';
  import planeGraph from './components/planeGraph.vue';
  import liveVideo from './components/liveVideo.vue';
  import liveVideoTest from './components/liveVideoTest.vue';
  import liveVideoM3u8 from './components/liveVideoM3u8.vue';
  import { useFullscreen } from '@vueuse/core';
  import { useRoute, useRouter } from 'vue-router';
  import { useThingsBoardStore, useUserStore } from '@/store';
  import { computed, onBeforeMount, onMounted, ref } from 'vue';
  import {
    getEventListScreen,
    getEventDetail,
    getEmergencyPlanListScreen,
    getEventRecordDetail,
    setMessageRead,
  } from '@/api/thingsBoard';
  import emergencyEventProgress from '../eventConfig/eventManagement/components/emergencyEventProgress.vue';
  import eventInfo from './components/eventInfo.vue';
  import { dictResponseType } from '@/api';
  import { nextTick } from 'vue';
import LiveVideoWRTC from './components/liveVideoWRTC.vue';

  const { setEventRecordId } = useThingsBoardStore();

  const { toggle: toggleFullScreen, isFullscreen } = useFullscreen();
  const close = () => {
    // @ts-ignore
    window.main.closeWindow('/thingsBoard/monitoringDataScreen');
  };
  const min = () => {
    window.main.minimumWindow('/thingsBoard/monitoringDataScreen');
  };
  const route = useRoute();
  const router = useRouter();
  const emits = defineEmits(['close']);
  const goBack = () => {
    // router.back();
    // close()
    emits('close');
  };
  const { id: eventRecordId } = route.query as { id: string };
  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
  });
  const id = ref(props.id as string);
  // const id = ref(eventRecordId);
  setEventRecordId(props.id);
  // show item
  const info = ref<any>(undefined);
  const record = ref<any>([]);
  const emergencyList = ref([]);
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

  const userStore = useUserStore();
  const userInfo = computed(() => userStore.userInfo);
  const getDetail = async () => {
    const { data } = await getEventDetail(id.value, 0);
    setMessageRead({
      eventId: id.value,
      userId: userInfo.value.userId,
    });
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
  };
  const getRecordList = async () => {
    const { data } = await getEventRecordDetail(id.value);
    record.value = data;
    nextTick(() => {
      const progressContent = document.querySelector('.progress-content');
      if (progressContent) {
        progressContent.scrollTop = progressContent.scrollHeight;
      }
    });
  };
  const getEmergencyPlan = async (name?: string, pageNo?: number) => {
    getEmergencyPlanListScreen(id.value, {
      emergencyPlanName: name,
      pageSize: 6,
      pageNo: pageNo || 1,
    }).then((res) => {
      const { data: emergencyPlanList } = res;
      emergencyList.value = emergencyPlanList;
    });
  };

  // tab
  const tabList = ref<any>([]);
  const getTab = async (needChange: boolean = false) => {
    const { data: listData } = await getEventListScreen({
      eventType: 1,
    });
    if (listData.length === 0) {
      router.back();
      return;
    }
    if (needChange) {
      changeTab(listData[0]?.eventRecordId);
    }
    tabList.value = listData
      .map((ele: any) => {
        const eventDict = eventTypeLevelDict.find(
          (item) => item.dictValue === ele.eventType
        );
        const levelDict = eventDict?.children?.find(
          (item) => item.dictValue === ele.eventLevel
        );
        return {
          ...ele,
          color: levelDict?.color,
          eventLevelName: levelDict?.dictKey,
        };
      })
      .sort(
        (a: any, b: any) =>
          a.eventLevel.split('-')[1] - b.eventLevel.split('-')[1]
      );
  };
  const initData = () => {
    getDetail();
    getRecordList();
    getEmergencyPlan();
  };
  initData();
  const changeTab = (eventRecordId: string) => {
    setEventRecordId(eventRecordId);
    if (id.value === eventRecordId) return;
    id.value = eventRecordId;
    initData();
  };
  getTab();

  const taskModalRef = ref<InstanceType<typeof taskModal> | null>(null);
  const openTaskModal = () => {
    taskModalRef.value!.open(id.value);
  };

  const liveModalRef = ref<InstanceType<typeof liveSituationModal> | null>(
    null
  );
  const openLiveModal = () => {
    liveModalRef.value!.open(id.value);
  };

  const closeEventModalRef = ref<InstanceType<typeof closeEventModal> | null>(
    null
  );
  const openCloseEventModal = () => {
    closeEventModalRef.value!.open(id.value);
  };
</script>
<style lang="less">
  .tabs-content-class {
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    .arco-popover-content {
      margin: 0;
    }
    .tabs {
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #ffffff;
      border-radius: 4px;
      background: rgba(4, 14, 61, 1);
      border: 0.5px solid rgba(48, 97, 219, 1);
      box-shadow: 0px 0px 3px rgba(3, 255, 246, 0.34);
      .tab-item {
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        padding: 0.71rem 1.43rem;
        box-shadow: 0px 0px 3px rgba(3, 255, 246, 0.34);
        .title {
          font-size: 1.29rem;
          font-weight: 700;
        }
        &.active {
          background: var(--color);
          :deep(.arco-tag) {
            background-color: var(--bg2) !important;
            color: var(--color);
          }
        }
      }
    }
  }
</style>
<style lang="less" scoped>
  .emergency-handle-container {
    background-image: url('@/assets/images/handleTop.png');
    background-position: top;
    background-size: contain;
    background-repeat: no-repeat;
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    padding: 0 0.8% 0.5% 0.8%;
    box-sizing: border-box;
    overflow: hidden;
    gap: 1.57rem;
    background-color: black;
    font-family: 'Alibaba';
    .top {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      position: relative;
      margin-right: 2rem;
      .back {
        cursor: pointer;
        img {
          width: 1.79rem;
          height: 1.79rem;
        }
      }
      .data-title-content {
        color: #ffffff;
        position: relative;
        margin-right: -29.17vw;
        .dateRange {
          position: absolute;
          margin-top: 0;
          margin-left: auto;
          margin-bottom: auto;
          top: 70%;
          right: -100%;
          z-index: 999;
          width: 500px;
          font-size: 14px;
          &.dateRangeVisible {
            display: none;
          }
        }
      }
      .weather,
      .time-clock {
        flex: 0 0 auto;
        display: flex;
        align-items: center;
        font-size: 40px;
        gap: 0.8rem;
        .time-range,
        .fullScreen,
        .exit {
          cursor: pointer;
        }
        .fullScreen,
        .exit {
          color: #ffffff;
        }
      }
      .weather {
        margin-right: 2.5vw;
        :deep(.weather-quality, .weather-wind) {
          width: 10vw;
        }
      }
      :deep(.time-card-container) {
        gap: 0.9rem;
        margin-right: 3rem;
        .date-part {
          flex-direction: column;
          gap: 0;
        }
      }
      .tab-container {
        display: flex;
        align-items: center;
        margin-right: auto;
        margin-left: 1.57rem;
        .tabs {
          display: flex;
          align-items: center;
          color: #ffffff;
          border-radius: 4px;
          background: rgba(4, 14, 61, 1);
          border: 0.5px solid rgba(48, 97, 219, 1);
          box-shadow: 0px 0px 3px rgba(3, 255, 246, 0.34);
          .tab-item {
            cursor: pointer;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.71rem 1.43rem;
            box-shadow: 0px 0px 3px rgba(3, 255, 246, 0.34);
            .title {
              font-size: 1.29rem;
              font-weight: 700;
              max-width: 12rem;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
            }
            &.active {
              background: var(--color);
              :deep(.arco-tag) {
                background-color: var(--bg2) !important;
                color: var(--color);
              }
            }
          }
        }
        .rest-tabs-text {
          color: #ffffff;
          cursor: pointer;
          font-size: 1.5rem;
          letter-spacing: -1rem;
        }
      }
    }
    .bottom {
      background-image: url('@/assets/images/data-screen-background.png');
      background-position: center bottom;
      background-size: 100% 80%;
      background-repeat: no-repeat;
      display: flex;
      gap: 0.5rem;
      .left {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        .info-and-plan {
          display: flex;
          gap: 0.5rem;
          .event-info-container {
            height: 100%;
            color: #ffffff;
            :deep(.event-desctiption .time) {
              color: #ffffff;
            }
          }
        }
        .live-video-content {
          padding-top: 3rem;
          height: 100%;
          width: 100%;
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
          overflow: hidden;
        }
      }
      .right {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        .event-progress {
          padding-top: 2px;
          padding-bottom: 1rem;
          height: 100%;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          .btn-group {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: flex-end;
            gap: 0.5rem;
            button {
              font-size: 1rem;
              --color-text-2: #ffffff;
              --primary-6: 42, 130, 228;
              --danger-6: 255, 255, 255;
              --color-danger-light-1: rgb(238, 62, 62);
              height: 1.57rem;
            }
          }
          .progress-content {
            flex: 1;
            overflow-y: auto;
            overflow-x: hidden;
            --color-text-1: #ffffff;
            :deep(.inner-steps) {
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
      }
    }
  }
</style>
