<template>
  <div
    :class="['screen-container', { warning: soundOpen && isWarning }]"
    :style="`--warning-color: 217, 0, 27`"
    @click="handleClick"
  >
    <div class="top">
      <div class="title">智能监测处置中心 </div>
      <div class="weather">
        <weather />
      </div>
      <div class="data-title-content">
        <div class="time-range">
          <a-select
            v-model="timeRange"
            :style="{
              width: '6.77vw',
              height: '2.96vh',
              lineHeight: '2.96vh',
              alignItems: 'center',
              color: '#ffffff',
              borderRadius: '4px',
              background: 'rgba(0, 63, 135, 0.18)',
              border: '0.5px solid rgba(64, 169, 255, 1)',
            }"
            defaultValue="month"
            @change="changeSelectDate"
          >
            <a-option value="month">本月</a-option>
            <a-option value="today">今日</a-option>
            <a-option value="week">本周</a-option>
            <a-option value="quarter">本季度</a-option>
            <a-option value="year">今年</a-option>
            <a-option value="yesterday">昨天</a-option>
            <a-option value="lastWeek">上周</a-option>
            <a-option value="lastMonth">上月</a-option>
            <a-option value="lastQuarter">上季度</a-option>
            <a-option value="7Days">近7天</a-option>
            <a-option value="30Days">近30天</a-option>
            <a-option value="other">选择日期范围</a-option>
          </a-select>
          <div
            ref="dateRangeRef"
            class="dateRange"
            :class="{ dateRangeVisible: !dateRangeVisible }"
          >
            <a-range-picker
              show-confirm-btn
              hide-trigger
              style="margin-top: 20px"
              @change="changeDateRange"
            />
          </div>
        </div>
      </div>
      <div class="time-clock">
        <timeCard />
        <icon-mute
          v-if="!soundOpen"
          style="cursor: pointer; font-size: 1.6rem; color: #ffffff"
          @click="openSound"
        />
        <icon-sound
          v-if="soundOpen"
          style="cursor: pointer; font-size: 1.6rem; color: #ffffff"
          @click="mute"
        />
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
        <data-block title="" width="26.56vw" height="14.07vh">
          <div
            style="
              display: flex;
              align-items: center;
              width: 100%;
              height: 8.83rem;
            "
          >
            <eventNum :data="allData.eventTabCount" />
            <eventClassifyNum
              style="flex: 1 1 auto"
              :data="allData.eventTabCount"
            />
          </div>
        </data-block>
        <data-block
          title=""
          width="26.56vw"
          height="40vh"
          padding="0.79rem 0.9rem 1.1rem 0.9rem"
        >
          <div class="event-tendency-content">
            <div class="tendency-statistic">
              <yearly-event-num
                style="cursor: pointer"
                :data="allData"
                @click="handleEventTendencyClick('year')"
              />
              <season-event-num
                style="cursor: pointer"
                :data="allData"
                @click="handleEventTendencyClick('quarter')"
              />
              <monthly-event-num
                style="cursor: pointer"
                :data="allData"
                @click="handleEventTendencyClick('month')"
              />
              <daily-event-num
                style="cursor: pointer"
                :data="allData"
                @click="handleEventTendencyClick('today')"
              />
            </div>
            <div class="tendency-chart">
              <div class="tendency-block-title">
                <div class="title">事件数量趋势</div>
              </div>
              <div class="tendency-content">
                <eventNumTendency
                  :data="allData.eventNumberTrend"
                  :timeRange="timeRange"
                />
              </div>
            </div>
          </div>
        </data-block>
        <data-block
          v-if="eventRundownStep === 1"
          title="事件级别分布"
          width="26.56vw"
          height="35.65vh"
        >
          <eventLevelDistribution
            :data="allData"
            @handle-click-echart="handleClickEventLevel"
          />
        </data-block>
        <data-block
          v-if="eventRundownStep === 2"
          :title="eventTitle"
          width="26.56vw"
          height="35.65vh"
        >
          <eventDetailTable
            :data="eventRundownData"
            @handle-back-data-rundown="eventBack"
          />
        </data-block>
      </div>
      <div class="center">
        <div class="iotv-container">
          <div id="visual-container" class="visual-container"></div>
          <div
            v-if="key !== 0"
            id="object-info-bubble"
            class="object-info-bubble"
          >
            <div v-if="currentObjectType === 0" class="device-bubble">
              <div class="title">设备信息</div>
              <div class="device-name"
                ><span>设备名称：</span>{{ currentObject.deviceName }}</div
              >
              <div class="device-location"
                ><span>设备地点：13巷12栋8号5楼401旁</span></div
              >
              <div class="device-status"
                ><span>设备状态：</span
                ><span
                  :style="{
                    color: currentObject.deviceStatus ? '#98d87d' : '#d9001b',
                  }"
                  >{{ currentObject.deviceStatusName }}</span
                ></div
              >
              <div
                class="live-video"
                v-if="currentObject.deviceType === 'camera'"
              >
                <span>实时视频</span>
                <liveVideo deviceId="8" />
              </div>
              <div
                class="real-time-data"
                v-if="currentObject.deviceType === 'other'"
              >
                <span>实时数据</span>
                <div class="data-content">
                  <div
                    class="data-content-item"
                    v-for="item in currentObject.telemetryData"
                    :key="item.id"
                  >
                    <span>{{ item.value }}</span>
                    <span>{{ item.key }}</span>
                  </div>
                </div>
              </div>
              <!-- <div class="btn">
                <el-button
                  size="small"
                  type="primary"
                  @click="jumpToDevice(currentObject)"
                  >点击查看详情</el-button
                >
              </div> -->
            </div>
            <div v-if="currentObjectType === 2" class="event-bubble">
              <div class="event-name">
                <span>{{ currentObject.eventName }}</span>
                <span>{{ currentObject.reportTime }}</span>
              </div>
              <div class="event-level">
                <span>{{ currentObject.eventTypeName }}</span>
                <a-tag :color="currentObject.color">{{
                  currentObject.eventLevelName
                }}</a-tag>
              </div>
              <div class="location">{{ currentObject.deviceLocation }}</div>
              <div class="event-desc">{{ currentObject.eventDesc }}</div>
              <div class="btn">
                <el-button
                  size="small"
                  type="primary"
                  v-if="currentObject.eventType === '1'"
                  @click="jumpToHandle(currentObject)"
                  >处置详情</el-button
                >
              </div>
            </div>
          </div>
        </div>
        <div style="margin-top: auto">
          <div class="chart-content">
            <data-block
              title="监测预警设备现状"
              width="22.14vw"
              height="35.65vh"
            >
              <div class="equipment-state">
                <div class="equipment-state-content">
                  <equipmentTotalNum
                    :data="allData.deviceStatus"
                    @click="filterEquipment('all')"
                  />
                  <equipmentStateOnlineNum
                    :data="allData.deviceStatus"
                    @click="filterEquipment('online')"
                  />
                  <equipmentStateOfflineNum
                    :data="allData.deviceStatus"
                    @click="filterEquipment('offline')"
                  />
                  <equipmentStateBreakdownNum
                    :data="allData.deviceStatus"
                    @click="filterEquipment('breakdown')"
                  />
                  <equipmentStateWarningNum
                    :data="allData.deviceStatus"
                    @click="filterEquipment('alarms')"
                  />
                </div>
                <div class="equipment-classify-distribution">
                  <equipmentClassifyDistribution :data="allData.deviceStatus" />
                </div>
              </div>
            </data-block>
            <data-block
              v-if="deviceRunningRundownStep === 1"
              title="系统运行趋势"
              width="22.14vw"
              height="35.65vh"
            >
              <equipmentRuningTendency
                :data="allData.operationTrend"
                :timeRange="timeRange"
                @handle-click-echart="
                  (params) =>
                    deviceRunningHandleSearch(params.ids, () => {
                      deviceRunningTitle = params.title;
                    })
                "
              />
            </data-block>
            <data-block
              v-if="deviceRunningRundownStep === 2"
              :title="deviceRunningTitle"
              width="22.14vw"
              height="35.65vh"
            >
              <equipmentRunningDetailTable
                :data="deviceRunningRundownData"
                @handle-back-data-rundown="deviceRunningBack"
              />
            </data-block>
          </div>
        </div>
      </div>
      <div class="right">
        <data-block title="" width="26.54vw" height="27.18vh" padding="0.79rem">
          <disposalList
            :data="allData.eventTabCount"
            :key="key"
            @jumpToHandle="jumpToHandle"
            @initData="initAllData"
          />
        </data-block>
        <data-block
          title="实时监控数据"
          width="26.54vw"
          height="26.99vh"
          padding="1.14rem 1.07rem 1.14rem 1.07rem"
        >
          <realTimeData style="padding-top: 2rem" />
        </data-block>
        <data-block title="异常情况处理" width="26.54vw" height="35.65vh">
          <div class="exception-handling-situation">
            <div class="rate">
              <eventResponseRate
                :data="allData.exceptionHandling"
                class="event-response-rate"
                @click="
                  handleClickExceptionRate({
                    title: '各类各级事件响应率明细',
                    allIds: allData.exceptionHandling.allIds,
                    ids: allData.exceptionHandling.waitIds,
                    type: 'echart',
                    key: 'responseRate',
                  })
                "
              />
              <eventHandlingRate
                :data="allData.exceptionHandling"
                class="event-handling-rate"
                @click="
                  handleClickExceptionRate({
                    title: '各类各级事件处置率明细',
                    allIds: allData.exceptionHandling.allIds,
                    ids: allData.exceptionHandling.handledIds,
                    type: 'echart',
                    key: 'handleRate',
                  })
                "
              />
            </div>
            <eventResponseInfo
              v-if="exceptionRundownStep === 1"
              :data="allData.exceptionHandling"
              @handle-click-table-row="handleExceptionClick"
            />
            <exceptionDetailTable
              v-if="exceptionRundownStep === 2 && exceptionType === 'table'"
              :title="exceptionTitle"
              :data="exceptionRundownData"
              @handle-back-data-rundown="exceptionBack"
            />
            <exceptionDetailChart
              v-if="exceptionRundownStep === 2 && exceptionType === 'echart'"
              :title="exceptionTitle"
              :data="exceptionRundownData"
              @handle-back-data-rundown="exceptionBack"
            />
          </div>
        </data-block>
      </div>
    </div>
    <a-modal
      class="event-modal-class"
      simple
      :footer="false"
      hide-title
      v-if="visible && eventModalId"
      v-model:visible="visible"
      fullscreen
    >
      <EmergencyHandle :id="eventModalId" @close="closeModal" />
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import {
    computed,
    onBeforeMount,
    onMounted,
    onUnmounted,
    ref,
    watch,
  } from 'vue';
  import dataBlock from '@/views/dashboard/workplace/screenComponents/dataBlock.vue';
  import timeCard from '@/views/dashboard/workplace/screenComponents/timeCard.vue';
  import weather from '@/views/dashboard/workplace/screenComponents/weather.vue';
  import eventNum from './components/eventNum.vue';
  import eventClassifyNum from './components/eventClassifyNum.vue';
  import yearlyEventNum from './components/yearlyEventNum.vue';
  import seasonEventNum from './components/seasonEventNum.vue';
  import monthlyEventNum from './components/monthlyEventNum.vue';
  import dailyEventNum from './components/dailyEventNum.vue';
  import eventNumTendency from './components/eventNumTendency.vue';
  import eventLevelDistribution from './components/eventLevelDistribution.vue';
  import equipmentTotalNum from './components/equipmentTotalNum.vue';
  import equipmentStateOnlineNum from './components/equipmentStateOnlineNum.vue';
  import equipmentStateOfflineNum from './components/equipmentStateOfflineNum.vue';
  import equipmentStateBreakdownNum from './components/equipmentStateBreakdownNum.vue';
  import equipmentStateWarningNum from './components/equipmentStateWarningNum.vue';
  import equipmentClassifyDistribution from './components/equipmentClassifyDistribution.vue';
  import equipmentRuningTendency from './components/equipmentRuningTendency.vue';
  import eventResponseRate from './components/eventResponseRate.vue';
  import eventHandlingRate from './components/eventHandlingRate.vue';
  import eventResponseInfo from './components/eventResponseInfo.vue';
  import realTimeData from './components/realTimeData.vue';
  import disposalList from './components/disposalList.vue';
  import liveVideo from './components/liveVideo.vue';
  import exceptionDetailTable from './components/exceptionDetailTable.vue';
  import exceptionDetailChart from './components/exceptionDetailChart.vue';
  import eventDetailTable from './components/eventDetailTable.vue';
  import equipmentRunningDetailTable from './components/equipmentRunningDetailTable.vue';
  import { useUserStore } from '@/store';
  import { useFullscreen } from '@vueuse/core';
  import { formatDate } from '@/utils/utils';
  import { useIotv } from './compoisiton/useIotv';
  import {
    getCustomerId,
    getDeviceListDetail,
    getDeviceStatus,
    getDeviceStatusWithSearch,
    getEventLevelDistribution,
    getEventNumberTrend,
    getEventTabsList,
    getEventTypeDetail,
    getExceptionHandling,
    getExceptionHandlingDetail,
    getExceptionHandlingResponseRateDetail,
    getSystemOperationTrend,
    getTimeSegmentNumber,
  } from '@/api/thingsBoard';
  import {
    calculateTime,
    timeUnitsType,
  } from '../eventConfig/eventManagement/composition/calculateTime';
  import { eventTypeLevelDict } from '../eventConfig/eventConfigManagement/type';
  import { dictResponseType } from '@/api';
  import useRouterJump from '@/hooks/routerJump';
  import EmergencyHandle from './emergencyHandle.vue';
  import { useDataRundown } from '@/views/dashboard/workplace/screenComponents/composition/useDataRundown';

  const { addEvent, removeEvent, currentObject, currentObjectType, initIOTV } =
    useIotv();

  const userStore = useUserStore();
  const { toggle: toggleFullScreen, isFullscreen } = useFullscreen();

  const reqArr: any = {
    exceptionHandling: getExceptionHandling, // 异常情况处理
    eventLevelDistribution: getEventLevelDistribution, // 事件级别分布
    timeSegmentNumber: getTimeSegmentNumber, // 按时间段的事件数量
    deviceStatus: getDeviceStatusWithSearch, // 设备现状
    eventTabCount: getEventTabsList, // 现存事件数量
    operationTrend: getSystemOperationTrend, // 系统运行趋势
    eventNumberTrend: getEventNumberTrend, // 事件数量趋势
  };
  const allData = ref<any>({}); //中间下面部分数据
  onBeforeMount(async () => {
    await initAllData();
    initIOTV();
    setTimeout(() => {
      initWebSocket();
    }, 200);
  });
  // 初始化中间下面部分的数据
  const initAllData = async (needUpdate = false) => {
    if (needUpdate) {
      allData.value = {};
    }
    const reqArrKeys: string[] = Object.keys(reqArr);
    const requests = reqArrKeys.map(async (key: string) => {
      const params = {
        timeScope: timeRange.value.includes('--') ? 'other' : timeRange.value,
        scale:
          timeRangeToScopeObj[
            timeRange.value as keyof typeof timeRangeToScopeObj
          ] ?? 'Day',
        startTime:
          timeRange.value === 'other' || timeRange.value.includes('--')
            ? formatDate(new Date(timeArr.value[0]).setHours(0, 0, 0, 0))
            : undefined,
        endTime:
          timeRange.value === 'other' || timeRange.value.includes('--')
            ? formatDate(new Date(timeArr.value[1]).setHours(23, 59, 59, 0))
            : undefined,
      };
      try {
        const { data } = await reqArr[key](params);
        allData.value[key] = data;
        beforeTimeRange.value = timeRange.value;
      } catch (err) {}
    });
    await Promise.all(requests);
    key.value++;
  };
  const key = ref(0);

  // 时间控件相关
  const beforeTimeRange = ref('month');
  const dateRangeRef = ref<any>();
  const timeRange = ref('month');
  const timeArr = ref<any[]>([]);
  const dateRangeVisible = ref(false);
  const timeRangeToScopeObj: any = {
    yesterday: 'Hour',
    today: 'Hour',
    year: 'Month',
    lastQuarter: 'Month',
    quarter: 'Month',
  };
  const changeSelectDate = (val: any) => {
    if (val === 'other') {
      dateRangeVisible.value = true;
    } else {
      initAllData();
    }
  };
  const changeDateRange = (val: any) => {
    timeRange.value = val.join('--');
    timeArr.value = val;
    dateRangeVisible.value = false;
    initAllData(true);
  };
  // 点击其他区域就关闭弹窗
  const handleClick = (event: any) => {
    if (!dateRangeRef.value?.contains(event.target) && dateRangeVisible.value) {
      dateRangeVisible.value = false;
      timeRange.value = beforeTimeRange.value;
    }
  };

  const close = () => {
    // @ts-ignore
    window.main.closeWindow('/thingsBoard/monitoringDataScreen');
  };
  const min = () => {
    window.main.minimumWindow('/thingsBoard/monitoringDataScreen');
  };
  const visible = ref(false);
  const eventModalId = ref('');
  const jumpToHandle = (item: any) => {
    if (item.eventType != '1') return;
    visible.value = true;
    eventModalId.value = item.eventRecordId;
    // router.push({
    //   name: 'EmergencyHandle',
    //   query: {
    //     id: item.eventRecordId,
    //   },
    // });
  };
  const closeModal = () => {
    visible.value = false;
    eventModalId.value = '';
  };

  // 声音相关
  const soundOpen = ref(true);
  // onMounted(async () => {
  //   soundOpen.value = !(await window.main.getSound());
  // });
  const mute = () => {
    soundOpen.value = false;
    checkIsWarning();
  };
  const openSound = () => {
    // window.main.openSound();
    soundOpen.value = true;
    checkIsWarning();
    window.speechSynthesis.resume();
  };

  // 报警相关
  const isWarning = computed(() => warningMap.value.size > 0);
  const warningMap = ref(new Map());
  const readText = (text: string) => {
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
    utterance.onend = () => {
      checkIsWarning();
    };
  };
  const checkIsWarning = () => {
    if (isWarning.value && soundOpen.value) {
      // 判断warningMap中哪个报警级别最高
      let maxLevel = -1;
      let curValue: any = {};
      warningMap.value.forEach((value) => {
        if (value.eventLevel > maxLevel) {
          maxLevel = value.eventLevel;
          // text = value.text;
          curValue = value;
        }
      });
      const gap = calculateTime({
        time: formatDate(curValue.createTime),
        leastUnit: timeUnitsType.seconds,
        padZero: false,
      });
      const text = `发生${curValue.eventName}, ${curValue.eventLevelName}应急事件，发生位置：${curValue.deviceLocation}，发生时间：${gap}`;
      readText(text);
    } else {
      window.speechSynthesis.cancel();
    }
  };

  // websocket
  const websock = ref();
  const initWebSocket = async () => {
    if (typeof WebSocket === 'undefined') {
      console.log('您的浏览器不支持WebSocket');
    } else {
      const wsurl =
        import.meta.env.MODE !== 'development'
          ? `${import.meta.env.VITE_API_WS_URL}/business/ws/websocket/event/${
              userStore.userInfo.tenantId
            }`
          : `ws://localhost:3000/business/ws/websocket/event/${userStore.userInfo.tenantId}`; //服务器
      // 实例化 WebSocket
      websock.value = new WebSocket(wsurl);
      // 监听 WebSocket 连接
      websock.value.onopen = websocketonopen;
      // 监听 WebSocket 错误信息
      websock.value.onerror = websocketonerror;
      // 监听 WebSocket 消息
      websock.value.onmessage = websocketonmessage;
      // 监听 WebSocket 关闭消息
      websock.value.onclose = websocketclose;
    }
  };
  // 连接建立之后执行send方法发送数据
  function websocketonopen() {
    console.log('socket连接成功');
  }
  // 连接建立失败重连
  function websocketonerror() {
    console.log('连接错误');
  }
  // 数据接收
  const dict = {
    1: '一级',
    2: '二级',
    3: '三级',
    4: '四级',
  };
  const timerId = ref<any>(null);
  const eventTypeList = ref<dictResponseType[]>(eventTypeLevelDict);
  function websocketonmessage(e: any) {
    try {
      const objData = JSON.parse(e.data);
      if (objData.type === 'update') {
        // 先匹配reqArr中的key,看objData.data数组中的项目是否在reqArr中,如果在则重新请求数据
        const reqArrKeys: string[] = Object.keys(reqArr);
        // 取reqArrKeys和objData.data的交集
        const intersection = reqArrKeys.filter((key) =>
          objData.data.includes(key)
        );
        intersection.forEach(async (key: string) => {
          const params = {
            timeScope: timeRange.value.includes('--')
              ? 'other'
              : timeRange.value,
            scale:
              timeRangeToScopeObj[
                timeRange.value as keyof typeof timeRangeToScopeObj
              ] ?? 'Day',
            startTime:
              timeRange.value === 'other' || timeRange.value.includes('--')
                ? formatDate(new Date(timeArr.value[0]).setHours(0, 0, 0, 0))
                : undefined,
            endTime:
              timeRange.value === 'other' || timeRange.value.includes('--')
                ? formatDate(new Date(timeArr.value[1]).setHours(23, 59, 59, 0))
                : undefined,
          };
          const { data } = await reqArr[key](params);
          allData.value[key] = data;
          beforeTimeRange.value = timeRange.value;
        });
      } else if (objData.type === 'event') {
        const {
          eventLevel,
          eventName,
          deviceLocation,
          eventDesc,
          eventRecordId,
          eventType,
          deviceId,
        } = objData.data;
        initAllData();
        const eventDict = eventTypeList.value.find(
          (item) => item.dictValue === eventType
        );
        const levelDict = eventDict?.children?.find(
          (item) => item.dictValue === eventLevel
        );
        const date = +new Date();
        if (eventType === '1') {
          const eventLevelName =
            dict[eventLevel.split('-')[1] as keyof typeof dict];
          warningMap.value.set(objData.data.eventRecordId, {
            // text: `发生${eventName}, ${eventLevelName}应急事件，发生位置：${deviceLocation}，发生时间：${gap}`,
            eventLevel: Number(eventLevel.split('-')[1]),
            eventLevelName,
            eventRecordId,
            eventName,
            eventDesc,
            deviceLocation,
            createTime: date,
          });
          checkIsWarning();
        }
        const now = ref(new Date());
        // 触发事件
        currentObject.value = {
          eventLevel,
          eventName,
          deviceLocation,
          eventDesc,
          eventRecordId,
          eventType,
          color: levelDict?.color,
          reportTime: computed(() => {
            return calculateTime({
              now: now.value,
              time: formatDate(date),
              leastUnit: timeUnitsType.seconds,
              status: false,
            });
          }),
          eventTypeName: eventDict?.dictKey,
          eventLevelName: levelDict?.dictKey,
        };
        addEvent(deviceId);
        timerId.value = setInterval(() => {
          now.value = new Date();
        }, 1000);
      } else if (objData.type === 'clearEvent') {
        const { eventRecordId, eventType, deviceId } = objData.data;
        initAllData();
        warningMap.value.delete(eventRecordId);
        checkIsWarning();
        // 清除事件
        // currentObject.value = {};
        removeEvent(deviceId);
      }
    } catch (e) {}
  }
  // 关闭
  function websocketclose(e: any) {
    console.log('WebSocket 断开连接', e);
    // 掉线重连
    console.log('尝试重新连接...');
    setTimeout(initWebSocket, 1000);
  }
  onUnmounted(() => {
    if (timerId) {
      clearInterval(timerId);
    }
  });

  const { jumpWithTab } = useRouterJump();
  const jumpToDevice = (item: any) => {
    jumpWithTab({
      routerName: `Devices`,
    });
  };

  // 数据下钻
  // 事件数量趋势
  const handleEventTendencyClick = async (type: string) => {
    const params = {
      timeScope: type,
      scale:
        timeRangeToScopeObj[type as keyof typeof timeRangeToScopeObj] ?? 'Day',
    };
    const { data } = await reqArr['eventNumberTrend'](params);
    allData.value['eventNumberTrend'] = data;
  };
  // 异常情况处理
  const {
    rundownData: exceptionRundownData,
    rundownStep: exceptionRundownStep,
  } = useDataRundown({
    apis: [],
    timeParams: { timeRange, timeRangeToScopeObj, timeArr },
  });
  const exceptionTitle = ref('');
  const exceptionType = ref('');
  const handleClickExceptionRate = (options: any) => {
    const { title, type, key } = options;
    // let ids: string[] = [];
    // if (key === 'responseRate') {
    //   // 取allIds和paramIds的差集
    //   ids = allIds.filter((id: string) => !paramIds.includes(id));
    // } else {
    //   ids = paramIds;
    // }
    handleExceptionClick({
      title,
      type,
      key,
    });
  };
  const handleExceptionClick = async (options: any) => {
    const { title, ids, type, key } = options;
    const keyObj = {
      responseRate: 'waitRatioResult',
      handleRate: 'handledRatioResult',
    };
    let data;
    if (key in keyObj) {
      data =
        allData.value.exceptionHandling[keyObj[key as keyof typeof keyObj]];
      if (data.every((item: any) => item.value === 0)) return;
    } else {
      if (!ids.length) return;
      const { data: res } = await getExceptionHandlingDetail(ids, key);
      data = res;
    }
    exceptionRundownData.value = data;
    exceptionTitle.value = title;
    exceptionType.value = type ? 'echart' : 'table';
    if (exceptionRundownStep.value === 1) {
      exceptionRundownStep.value++;
    }
  };
  const exceptionBack = () => {
    exceptionRundownStep.value--;
  };
  // 事件级别分布
  const {
    rundownData: eventRundownData,
    rundownStep: eventRundownStep,
    handleSearch: eventHandleSearch,
    back: eventBack,
  } = useDataRundown({
    apis: [getEventLevelDistribution, getEventTypeDetail],
    timeParams: { timeRange, timeRangeToScopeObj, timeArr },
  });
  const eventTitle = ref('');
  const handleClickEventLevel = (params: any) => {
    const { title, ids } = params;
    eventTitle.value = title;
    eventHandleSearch(ids);
  };

  // 设备现状数据联动
  const filterEquipment = async (str: string) => {
    const { data } = await getDeviceStatusWithSearch(
      {
        timeScope: timeRange.value.includes('--') ? 'other' : timeRange.value,
        scale:
          timeRangeToScopeObj[
            timeRange.value as keyof typeof timeRangeToScopeObj
          ] ?? 'Day',
        startTime:
          timeRange.value === 'other' || timeRange.value.includes('--')
            ? formatDate(new Date(timeArr.value[0]).setHours(0, 0, 0, 0))
            : undefined,
        endTime:
          timeRange.value === 'other' || timeRange.value.includes('--')
            ? formatDate(new Date(timeArr.value[1]).setHours(23, 59, 59, 0))
            : undefined,
      },
      str
    );
    if (allData.value.deviceStatus) {
      allData.value.deviceStatus.typeGroup = data.typeGroup;
    }
  };

  // 系统运行趋势
  const {
    rundownData: deviceRunningRundownData,
    rundownStep: deviceRunningRundownStep,
    handleSearch: deviceRunningHandleSearch,
    back: deviceRunningBack,
  } = useDataRundown({
    apis: [getSystemOperationTrend, getDeviceListDetail],
    timeParams: { timeRange, timeRangeToScopeObj, timeArr },
  });
  const deviceRunningTitle = ref('');
</script>

<style lang="less">
  .event-modal-class {
    .arco-modal {
      padding: 0;
      margin: 0;
    }
  }
  .arco-select-dropdown {
    --color-bg-popup: #040e3d;
    --color-fill-3: #3061db;
    --color-text-1: #ffffff;
    box-shadow: 0px 0px 3px #03fff6;
    .arco-select-option {
      &:hover {
        --color-text-1: #040e3d;
      }
    }
    .arco-select-option-active {
      --color-text-1: #040e3d;
    }
  }
</style>
<style lang="less" scoped>
  @import '/src/assets/style/mixin.less';
  .iotv-container {
    width: 44.79vw;
    height: 54.8vh;
    position: relative;
    overflow: hidden;
    .visual-container {
      position: absolute !important;
      inset: 0;
      width: 100%;
      height: 100%;
    }
  }
  .visible {
    // opacity: 0;
    display: none;
  }
  .object-info-bubble {
    width: 13.54vw;
    height: fit-content;
    border: 1px solid red;
    background-color: #041263;
    padding: 1rem;
    border-radius: 5px;
    color: #ffffff;
    .device-bubble {
      color: #ffffff;
      font-size: 1rem;
      line-height: 2;
      .title {
        font-size: 1.2rem;
        font-weight: 600;
        font-family: 'Alibaba-Medium';
        margin-bottom: 0.71rem;
      }
      .live-video {
        width: 14rem;
        height: 9rem;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        :deep(.live-video-container) {
          background-color: transparent;
        }
      }
      .real-time-data .data-content {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5rem;
        .data-content-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1.5;
          padding: 0.5rem;
          overflow: hidden;
          background-color: #081d55;
          span:nth-of-type(1) {
            font-size: 1.2rem;
          }
          span:nth-of-type(2) {
            font-size: 0.8rem;
            max-width: 5rem;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
        }
      }
    }
    .event-bubble {
      line-height: 2;
      padding-top: 1.2rem;
      .event-name {
        font-weight: 600;
        font-size: 1.2rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        span:nth-of-type(2) {
          color: #d9001b;
          font-weight: 600;
          font-size: 0.8rem;
        }
      }
      .event-level {
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }
      .btn {
        margin-top: 0.5rem;
        text-align: center;
      }
    }
  }
  .screen-container {
    background-image: url('@/assets/images/top.png');
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
      justify-content: space-between;
      align-items: center;
      position: relative;
      margin-right: 2rem;
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
      .title {
        color: #ffffff;
        font-family: '优设标题黑';
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-45%, -30%);
        font-size: 3.43rem;
        line-height: 1;
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
      :deep(.time-card-container) {
        gap: 0.9rem;
        margin-right: 1rem;
        .date-part {
          flex-direction: column;
          gap: 0;
        }
      }
    }
    .bottom {
      display: flex;
      gap: 0.5rem;
      background-image: url('@/assets/images/data-screen-background.png');
      background-position: center bottom;
      background-size: 100% 80%;
      background-repeat: no-repeat;
    }
    .title {
      color: rgba(230, 247, 255, 1);
      font-weight: 500;
      font-size: 1.14rem;
      letter-spacing: -0.03rem;
      line-height: 1.14rem;
      text-align: left;
      vertical-align: top;
    }
    .left {
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .center {
      flex: 1;
      // align-self: baseline;
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      // margin-top: auto;
      gap: 0.5rem;
      .chart-content {
        width: 100%;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        margin-top: auto;
        .equipment-state {
          width: 100%;
          height: calc(100% - 1.3vh - 1.5rem);
          margin-top: 1.3vh;
          padding-top: 2.15rem;
          display: flex;
          flex-direction: column;
          gap: 1.43rem;
          // .flex-display (flex-start, flex-start, column);
          .equipment-state-content {
            cursor: pointer;
            .flex-display(center, center, row, 0.71rem);
          }
          .equipment-classify-distribution {
            flex: 1;
          }
        }
      }
    }
    .right {
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 0.5rem;
      .exception-handling-situation {
        width: 100%;
        height: calc(100% - 1.3vh - 1.5rem);
        margin-top: 1.3vh;
        padding-top: 2.15rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        .rate {
          display: flex;
          align-items: center;
          gap: 1.43rem;
          margin-bottom: 1.1rem;
          .event-response-rate,
          .event-handling-rate {
            cursor: pointer;
            height: 7.87vh;
            width: 11.43vw;
          }
        }
      }
    }
    .data-block {
      width: 100%;
      height: 100%;
      display: flex;
      box-sizing: border-box;
      justify-content: center;
      overflow: hidden;
    }
    .event-tendency-content {
      width: 100%;
      height: 100%;
      .flex-display(flex-start, center, column, 1.67vh);
      .tendency-statistic {
        width: 100%;
        height: fit-content;
        display: grid;
        grid-template-columns: repeat(4, 1fr);
      }
      .tendency-chart {
        width: 100%;
        height: 100%;
        flex: 1;
        background: rgba(14, 22, 95, 0.4);
        border: 0.5px solid rgba(14, 101, 187, 0.66);
        padding: 0.79rem 1.29rem 0 1.43rem;
        position: relative;
        .tendency-block-title {
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
          .title {
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
        .tendency-content {
          position: absolute;
          width: 100%;
          height: 100%;
          inset: 0;
          padding: 0.79rem 1.29rem 0 1.43rem;
        }
      }
    }
  }
  .tendency-legend {
    transform: translate(-30%, -30%);
  }
  .warning.screen-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 10px solid transparent;
    border-radius: 0.5rem;
    animation: glowing 0.5s infinite;
  }

  @keyframes glowing {
    0% {
      border-color: rgba(var(--warning-color), 0.2);
      box-shadow: 0 0 10px rgba(var(--warning-color), 0.2);
    }
    50% {
      border-color: rgba(var(--warning-color), 0.7);
      box-shadow: 0 0 20px rgba(var(--warning-color), 0.7);
    }
    100% {
      border-color: rgba(var(--warning-color), 0.2);
      box-shadow: 0 0 10px rgba(var(--warning-color), 0.2);
    }
  }
</style>
