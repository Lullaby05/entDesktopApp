<template>
  <transition name="fade">
    <div class="screen-container" @click="handleClick">
      <div class="top">
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
          <data-block title="指数看板" width="26.56vw" height="22.69vh">
            <div class="data-block" style="padding-top: 3.15rem">
              <div style="width: 50%; height: 100%">
                <div class="title"> 风险指数 </div>
                <riskIndexChart />
              </div>
              <div style="width: 50%; height: 100%">
                <div class="title"> 风险指数趋势 </div>
                <riskIndexTendency />
              </div>
            </div>
          </data-block>
          <data-block title="动态风险构成" width="26.56vw" height="28.70vh">
            <div class="data-block" style="padding-top: 3.15rem">
              <dynamicRiskChart />
            </div>
          </data-block>
          <data-block
            v-if="riskRundownStep === 1"
            title="风险辨识与管控"
            width="26.56vw"
            height="38.43vh"
          >
            <div class="control-data-block">
              <a-alert v-if="showAlert" class="alert" :show-icon="false"
                >再次点击可取消关联</a-alert
              >
              <a-alert
                v-if="showCancelAlert"
                class="alert center-alert"
                :show-icon="false"
                >已取消关联</a-alert
              >
              <div
                style="
                  display: flex;
                  align-items: center;
                  width: 100%;
                  height: 8.83rem;
                "
              >
                <riskPointNum
                  style="cursor: pointer"
                  :data="pitfallData"
                  @click="riskDataSearch"
                />
                <riskLevelNum
                  style="flex: 1 1 auto"
                  :data="pitfallData"
                  @handle-click-chart="filterRiskNum"
                />
              </div>
              <div
                style="
                  display: flex;
                  align-items: center;
                  flex-wrap: wrap;
                  gap: 1.29rem 1.57rem;
                  justify-content: space-around;
                "
              >
                <dangerRiskNum :data="pitfallData" />
                <largeRiskNum :data="pitfallData" />
                <controlMeasureNum :data="pitfallData" />
                <controlImplementionRate :data="pitfallData" />
              </div>
            </div>
          </data-block>
          <data-block
            v-if="riskRundownStep === 2"
            title="部门风险分布"
            width="26.56vw"
            height="38.43vh"
          >
            <!-- 部门风险分布情况 -->
            <deptRiskDistribution
              :data="riskRundownData"
              @handle-click-chart="
                (params) => {
                  riskHandleSearch(params, () => {
                    riskRundownTitle = params.title;
                  });
                }
              "
              @handle-back-data-rundown="riskBack"
            />
          </data-block>
          <data-block
            v-if="riskRundownStep === 3"
            :title="riskRundownTitle"
            width="26.56vw"
            height="38.43vh"
          >
            <!-- 部门危险源分布情况 -->
            <deptDangerSourceDistribution
              v-if="riskRundownStep === 3"
              :title="riskRundownTitle"
              :data="riskRundownData"
              @handle-back-data-rundown="riskBack"
            />
          </data-block>
        </div>
        <div class="center">
          <div class="iotv-container">
            <div id="visual-container" class="visual-container"></div>
            <div
              id="object-info-bubble"
              :class="['object-info-bubble', { visible: key === 0 }]"
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
            </div>
          </div>
          <div style="margin-top: auto">
            <div class="chart-content">
              <data-block
                v-if="pitfallTaskRundownStep === 1"
                title="隐患排查"
                width="22.14vw"
                height="18.52vh"
              >
                <pitfallFinishedRate
                  :data="pitfallData"
                  @handle-click-echart="
                    (params) => {
                      pitfallTaskHandleSearch(params, () => {
                        pitfallTaskType = params.taskType;
                        pitfallTaskTitle = params.title;
                      });
                    }
                  "
                />
              </data-block>
              <data-block
                v-if="pitfallTaskRundownStep === 2"
                :title="pitfallTaskTitle"
                width="22.14vw"
                height="18.52vh"
              >
                <deptTaskSituation
                  :data="pitfallTaskRundownData"
                  :type="pitfallTaskType"
                  @handle-back-data-rundown="pitfallTaskBack"
                  @handle-click-echart="
                    (params) => {
                      pitfallTaskHandleSearch(params, () => {
                        pitfallTaskTitle = params.title;
                      });
                    }
                  "
                />
              </data-block>
              <data-block
                v-if="pitfallTaskRundownStep === 3"
                :title="pitfallTaskTitle"
                width="22.14vw"
                height="18.52vh"
              >
                <deptPlanTaskSituation
                  :data="pitfallTaskRundownData"
                  @handle-back-data-rundown="pitfallTaskBack"
                />
              </data-block>
              <data-block
                v-if="pitfallNumRundownStep === 1"
                title="隐患数量趋势"
                width="22.14vw"
                height="18.52vh"
              >
                <pitfallTendency
                  :timeRange="timeRange"
                  :data="pitfallData"
                  @handle-click-echart="
                    (params) => {
                      pitfallNumHandleSearch(params, () => {
                        pitfallNumTitle = params.title;
                        pitfallNumType = params.type;
                      });
                    }
                  "
                />
              </data-block>
              <data-block
                v-if="pitfallNumRundownStep === 2"
                :title="pitfallNumTitle"
                width="22.14vw"
                height="18.52vh"
              >
                <pitfallDistributionSituation
                  :data="pitfallNumRundownData"
                  :type="pitfallNumType"
                  :timeRange="timeRange"
                  @handle-back-data-rundown="pitfallNumBack"
                />
              </data-block>
            </div>
            <data-block
              :title="pitfallRundownStep === 1 ? '隐患治理' : '隐患分布情况'"
              style="margin-top: 1rem"
              width="44.79vw"
              height="18.52vh"
            >
              <div style="display: flex; gap: 1.43rem">
                <existHazardNum
                  v-if="pitfallRundownStep === 1"
                  style="margin-top: calc(1.3vh + 2.15rem)"
                  :data="pitfallData"
                  @handle-click-echart="
                    (params) => {
                      pitfallHandleSearch({}, () => {
                        pitfallType = params.type;
                      });
                    }
                  "
                />
                <pitfallLevelDistribution
                  v-if="pitfallRundownStep === 2"
                  :data="pitfallRundownData"
                  :type="pitfallType"
                  @handle-back-data-rundown="pitfallBack"
                />
                <div
                  style="flex: 1; margin-top: calc(1.3vh + 2.15rem)"
                  class="rectify-chart-group"
                  v-if="rectifyRundownStep === 1"
                >
                  <rectifyFinishRate
                    :data="pitfallData"
                    @click="rectifyDataSearch"
                  />
                  <pitfallOntimeRate
                    :data="pitfallData"
                    @click="rectifyDataSearch"
                  />
                  <firstAcceptanceRate
                    :data="pitfallData"
                    @click="rectifyDataSearch"
                  />
                </div>
                <deptPitfallRectifySituation
                  style="border-radius: 0.59rem"
                  v-if="rectifyRundownStep === 2"
                  :data="rectifyRundownData"
                  @handle-back-data-rundown="rectifyBack"
                />
              </div>
            </data-block>
          </div>
        </div>
        <div class="right">
          <data-block title="特殊作业" width="26.56vw" height="22.69vh">
            <div class="data-block">
              <div class="operation-content" v-if="operationRundownStep === 1">
                <operationInProgress
                  style="cursor: pointer"
                  :data="operationData"
                  @click="handleOperationRundown({ type: 'operationTodo' })"
                />
                <operationAcceptance
                  :data="operationData"
                  style="cursor: pointer"
                  @click="
                    handleOperationRundown({ type: 'operationNormalClose' })
                  "
                />
                <operationClose
                  :data="operationData"
                  style="cursor: pointer"
                  @click="
                    handleOperationRundown({ type: 'operationAbnormalClose' })
                  "
                />
                <operationOvertime
                  :data="operationData"
                  style="cursor: pointer"
                  @click="handleOperationRundown({ type: 'operationTimeout' })"
                />
              </div>
              <div class="operation-content" v-if="operationRundownStep === 2">
                <operationDistribution
                  :title="operationTitle"
                  :data="operationRundownData"
                  @handle-back-data-rundown="operationBack"
                  @handle-click-echart="handleOperationRundown"
                />
              </div>
              <div class="operation-content" v-if="operationRundownStep === 3">
                <operationDetailSituation
                  :type="operationType"
                  :data="operationRundownData"
                  :title="operationTitle1"
                  @handle-back-data-rundown="operationSecondBack"
                />
              </div>
            </div>
          </data-block>
          <data-block title="应急管理" width="26.56vw" height="28.70vh">
            <div
              class="data-block"
              style="height: fit-content; padding-top: 2.65rem"
            >
              <rehearsalNum :data="operationData" />
            </div>
            <div class="data-block" style="margin-top: 1.5rem; height: 50%">
              <emergencyPlanNumber :data="operationData" />
            </div>
          </data-block>
          <data-block
            v-if="licenseRundownStep === 1"
            title="证照"
            width="26.56vw"
            height="38.43vh"
          >
            <div class="data-block license">
              <div>
                <div
                  style="
                    display: flex;
                    flex-wrap: wrap;
                    gap: 1.29rem;
                    align-items: center;
                    padding-top: 2.15rem;
                  "
                >
                  <enterpriseLicenseNum
                    style="cursor: pointer"
                    :data="operationData"
                    @click="handleLicenseClick({ type: 'EntLicenseCount' })"
                  />
                  <enterpriseLicenseEfficiency
                    style="cursor: pointer"
                    :data="operationData"
                    @click="
                      handleLicenseClick({ type: 'EntLicenseValidCount' })
                    "
                  />
                  <employeeLicenseNum
                    style="cursor: pointer"
                    :data="operationData"
                    @click="handleLicenseClick({ type: 'licenseCount' })"
                  />
                  <employeeLicenseEfficiency
                    style="cursor: pointer"
                    :data="operationData"
                    @click="handleLicenseClick({ type: 'licenseValidCount' })"
                  />
                </div>
              </div>
              <div style="flex: 1">
                <div class="title">员工证照分布</div>
                <employeeLicenseDistribution
                  :data="operationData"
                  @handle-click-echart="handleLicenseClick"
                />
              </div>
            </div>
          </data-block>
          <data-block
            v-if="
              licenseRundownStep === 2 &&
              (licenseRundownType === 'EntLicenseCount' ||
                licenseRundownType === 'EntLicenseValidCount')
            "
            :title="licenseTitle"
            width="26.56vw"
            height="38.43vh"
          >
            <enterpriseLicenseDetail
              :data="licenseRundownData"
              @handle-back-data-rundown="licenseBack"
            />
          </data-block>
          <data-block
            v-if="
              licenseRundownStep === 2 &&
              (licenseRundownType === 'licenseCount' ||
                licenseRundownType === 'licenseValidCount')
            "
            :title="licenseTitle"
            width="26.56vw"
            height="38.43vh"
          >
            <staffLicenseDetail
              :data="licenseRundownData"
              @handle-back-data-rundown="licenseBack"
            />
          </data-block>
          <data-block
            v-if="
              licenseRundownStep === 2 && licenseRundownType === 'licenseSkill'
            "
            :title="licenseTitle"
            width="26.56vw"
            height="38.43vh"
          >
            <staffSkillLicenseDetail
              :data="licenseRundownData"
              @handle-back-data-rundown="licenseBack"
            />
          </data-block>
        </div>
      </div>
    </div>
  </transition>
</template>
<script lang="ts" setup>
  import riskIndexChart from './screenComponents/riskIndexChart.vue';
  import riskIndexTendency from './screenComponents/riskIndexTendency.vue';
  import dynamicRiskChart from './screenComponents/dynamicRiskCompositionChart.vue';
  import pitfallFinishedRate from './screenComponents/pitfallFinishedRateChart.vue';
  import pitfallTendency from './screenComponents/pitfallTendency.vue';
  import employeeLicenseDistribution from './screenComponents/employeeLicenseDistribution.vue';
  import emergencyPlanNumber from './screenComponents/emergencyPlanNumberChart.vue';
  import riskLevelNum from './screenComponents/riskLevelNumChart.vue';
  import operationInProgress from './screenComponents/operationInProgress.vue';
  import operationAcceptance from './screenComponents/operationAcceptance.vue';
  import operationClose from './screenComponents/operationClose.vue';
  import operationOvertime from './screenComponents/operationOvertime.vue';
  import timeCard from './screenComponents/timeCard.vue';
  import pitfallOntimeRate from './screenComponents/pitfallOntimeRateChart.vue';
  import firstAcceptanceRate from './screenComponents/firstAcceptanceRate.vue';
  import rectifyFinishRate from './screenComponents/rectifyFinishRate.vue';
  import enterpriseLicenseEfficiency from './screenComponents/enterpriseLicenseEfficiency.vue';
  import employeeLicenseEfficiency from './screenComponents/employeeLicenseEfficiency.vue';
  import controlImplementionRate from './screenComponents/controlImplementionRate.vue';
  import existHazardNum from './screenComponents/existHazardNum.vue';
  import weather from './screenComponents/weather.vue';
  import dangerRiskNum from './screenComponents/dangerRiskNum.vue';
  import largeRiskNum from './screenComponents/largeRiskNum.vue';
  import controlMeasureNum from './screenComponents/controlMeasureNum.vue';
  import riskPointNum from './screenComponents/riskPointNum.vue';
  import enterpriseLicenseNum from './screenComponents/enterpriseLicenseNum.vue';
  import employeeLicenseNum from './screenComponents/employeeLicenseNum.vue';
  import rehearsalNum from './screenComponents/rehearsalNum.vue';
  import deptRiskDistribution from './screenComponents/deptRiskDistribution.vue';
  import deptDangerSourceDistribution from './screenComponents/deptDangerSourceDistribution.vue';
  import deptTaskSituation from './screenComponents/deptTaskSituation.vue';
  import pitfallDistributionSituation from './screenComponents/pitfallDistributionSituation.vue';
  import pitfallLevelDistribution from './screenComponents/pitfallLevelDistribution.vue';
  import deptPitfallRectifySituation from './screenComponents/deptPitfallRectifySituation.vue';
  import operationDistribution from './screenComponents/operationDistribution.vue';
  import enterpriseLicenseDetail from './screenComponents/enterpriseLicenseDetail.vue';
  import staffLicenseDetail from './screenComponents/staffLicenseDetail.vue';
  import staffSkillLicenseDetail from './screenComponents/staffSkillLicenseDetail.vue';
  import operationDetailSituation from './screenComponents/operationDetailSituation.vue';
  import deptPlanTaskSituation from './screenComponents/deptPlanTaskSituation.vue';
  import dataBlock from './screenComponents/dataBlock.vue';
  import liveVideo from '@/views/thingsBoard/monitoringDataScreen/components/liveVideo.vue';
  import { onMounted, ref } from 'vue';
  import { onBeforeMount } from 'vue';
  import {
    getDataScreenByType,
    getDataScreenEntLicense,
    getDataScreenJobFirst,
    getDataScreenJobSecond,
    getDataScreenRiskCheck,
    getDataScreenRiskCheckFirst,
    getDataScreenRiskCheckSecond,
    getDataScreenRiskControl,
    getDataScreenRiskControlDetail,
    getDataScreenRiskControlDetailSecond,
    getDataScreenRiskGovern,
    getDataScreenRiskGovernDetail,
    getDataScreenRiskGovernDetailFirst,
    getDataScreenRiskNumTrend,
    getDataScreenRiskNumTrendDetail,
    getDataScreenStaffLicense,
  } from '@/api/dataScreen';
  import { useUserStore } from '@/store';
  import { useFullscreen } from '@vueuse/core';
  import { formatDate } from '@/utils/utils';
  import { useIotv } from '@/views/thingsBoard/monitoringDataScreen/compoisiton/useIotv';
  import { useDataRundown } from './screenComponents/composition/useDataRundown';

  onMounted(() => {});
  const { currentObject, currentObjectType, initIOTV } = useIotv(false);

  const websock = ref();
  const userStore = useUserStore();
  const { toggle: toggleFullScreen, isFullscreen } = useFullscreen();

  const beforeTimeRange = ref('month');
  const dateRangeRef = ref<any>();
  const timeRange = ref('month');
  const timeArr = ref<any[]>([]);
  const dateRangeVisible = ref(false);
  const operationData = ref<any>([]); //右边部分数据
  const pitfallData = ref<any>({}); //中间下面部分数据

  const timeRangeToScopeObj: any = {
    yesterday: 'Hour',
    today: 'Hour',
    year: 'Month',
    lastQuarter: 'Month',
    quarter: 'Month',
  };
  const operationArr: string[] = [
    'operation',
    'drillPlan',
    'drillRecord',
    'emanagement',
    'EntLicense',
    'license',
    'licenseType',
  ];
  const pitfallArr: any = {
    riskControl: getDataScreenRiskControl,
    riskCheck: getDataScreenRiskCheck,
    riskGovern: getDataScreenRiskGovern,
    riskNumTrend: getDataScreenRiskNumTrend,
  };
  const key = ref(0);
  onBeforeMount(async () => {
    await initPitfallData();
    await initOperationData();
    key.value++;
    initIOTV();
    setTimeout(() => {
      initWebSocket();
    }, 200);
  });

  const getTimeParams = () => {
    return {
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
  };

  // 初始化中间下面部分的数据
  const initPitfallData = async (needUpdate = false) => {
    if (needUpdate) {
      pitfallData.value = {};
    }
    const pitfallArrKeys: string[] = Object.keys(pitfallArr);
    const requests = pitfallArrKeys.map(async (key: string) => {
      const params = getTimeParams();
      try {
        const { data } = await pitfallArr[key](params);
        pitfallData.value[key] = data;
        beforeTimeRange.value = timeRange.value;
      } catch (e) {}
    });
    await Promise.all(requests);
  };

  // 初始化右边的数据
  const initOperationData = async (needUpdate = false) => {
    if (needUpdate) {
      operationData.value = [];
    }
    const requests = operationArr.map(async (item: string) => {
      const params = {
        type: item,
        timeScope: timeRange.value,
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
      const { data } = await getDataScreenByType(params);
      operationData.value.push(...data);
      beforeTimeRange.value = timeRange.value;
    });
    await Promise.all(requests);
  };

  // websocket更新数据
  const updateData = async (str: string) => {
    if (operationArr.includes(str)) {
      const params = {
        type: str,
        timeScope: timeRange.value,
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
      const { data } = await getDataScreenByType(params);
      operationData.value = updateArr(operationData.value, data);
    } else if (pitfallArr[str]) {
      const params = {
        timeScope: timeRange.value,
        scale:
          timeRangeToScopeObj[
            timeRange.value as keyof typeof timeRangeToScopeObj
          ] ?? 'Day',
        startTime:
          timeRange.value === 'other' || timeRange.value.includes('--')
            ? new Date(timeArr.value[0])
            : undefined,
        endTime:
          timeRange.value === 'other' || timeRange.value.includes('--')
            ? new Date(timeArr.value[1])
            : undefined,
      };
      const { data } = await pitfallArr[str](params);
      pitfallData.value[str] = data;
    }
  };

  // 比较两个数组中的值，更新其中的count和percent字段
  function updateArr(source: any[], updates: any[]) {
    for (let update of updates) {
      let foundItem = source.find((item) => item.name === update.name);
      if (foundItem) {
        foundItem.count = update.count;
        foundItem.percent && (foundItem.percent = update.percent);
      }
    }
    return source;
  }

  const initWebSocket = () => {
    if (typeof WebSocket === 'undefined') {
      console.log('您的浏览器不支持WebSocket');
    } else {
      const wsurl = `ws://119.91.134.51:32200/websocket/${userStore.userInfo.tenantId}`; //服务器
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
  function websocketonmessage(e: any) {
    updateData(e.data);
  }
  // 关闭
  function websocketclose(e: any) {
    console.log('WebSocket 断开连接', e);
    // 掉线重连
    console.log('尝试重新连接...');
    setTimeout(initWebSocket, 1000);
  }

  const changeSelectDate = (val: any) => {
    if (val === 'other') {
      dateRangeVisible.value = true;
    } else {
      initOperationData(true);
      initPitfallData(true);
    }
  };
  const changeDateRange = (val: any) => {
    timeRange.value = val.join('--');
    timeArr.value = val;
    dateRangeVisible.value = false;
    initPitfallData(true);
    initOperationData(true);
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
    window.main.closeWindow('/dashboard/dataScreen');
  };

  const min = () => {
    window.main.minimumWindow('/dashboard/dataScreen');
  };

  // 数据下钻
  // 风险辨识与管控
  const {
    rundownData: riskRundownData,
    rundownStep: riskRundownStep,
    handleSearch: riskHandleSearch,
    back: riskBack,
  } = useDataRundown({
    apis: [
      getDataScreenRiskControl,
      getDataScreenRiskControlDetail,
      getDataScreenRiskControlDetailSecond,
    ],
    timeParams: { timeRange, timeRangeToScopeObj, timeArr },
  });
  const riskRundownTitle = ref('');
  const showAlert = ref(false);
  const showCancelAlert = ref(false);
  const filterRiskNum = async (options: any) => {
    const { isFilter, filterIndex } = options;
    const timeParams = getTimeParams();
    const { data } = await getDataScreenRiskControl({
      ...timeParams,
      riskLevelCode: isFilter ? (filterIndex + 1).toString() : undefined,
    });
    if (isFilter) {
      showAlert.value = true;
      setTimeout(() => {
        showAlert.value = false;
      }, 1500);
    } else {
      showCancelAlert.value = true;
      setTimeout(() => {
        showCancelAlert.value = false;
      }, 1500);
    }
    // 只更新下面的几个数据
    // dangerSumNum/greatDangerNum/controlMeasureNum/controlMeasureRate
    pitfallData.value.riskControl.dangerSumNum = data.dangerSumNum;
    pitfallData.value.riskControl.greatDangerNum = data.greatDangerNum;
    pitfallData.value.riskControl.controlMeasureNum = data.controlMeasureNum;
    pitfallData.value.riskControl.controlMeasureRate = data.controlMeasureRate;
  };
  const riskDataSearch = () => {
    if (
      pitfallData.value['riskControl'] &&
      pitfallData.value['riskControl'].riskPointTotalNum == 0
    )
      return;
    riskHandleSearch({});
  };

  // 作业
  const operationTitle = ref('');
  const operationTitle1 = ref('');
  const operationType = ref('');
  const {
    rundownData: operationRundownData,
    rundownStep: operationRundownStep,
    handleSearch: operationHandleSearch,
    back: operationBack,
  } = useDataRundown({
    apis: [getDataScreenByType, getDataScreenJobFirst, getDataScreenJobSecond],
    timeParams: {
      timeRange,
      timeRangeToScopeObj,
      timeArr,
    },
    context: { type: 'operation' },
  });
  const latestOperationFn = ref();
  const handleOperationRundown = async (options: any) => {
    if (operationRundownStep.value === 1) {
      const { type } = options;
      const obj = {
        operationTodo: '进行中作业分布',
        operationNormalClose: '正常关闭作业分布',
        operationAbnormalClose: '异常关闭作业分布',
        operationTimeout: '超时关闭作业分布',
      };
      operationTitle.value = obj[type as keyof typeof obj];
      const ids = operationData.value.find(
        (item: any) => item.name === type
      )?.relativeId;
      if (!ids || ids.length === 0) return;
      latestOperationFn.value = await operationHandleSearch(ids);
    } else if (operationRundownStep.value === 2) {
      const { key, ids } = options;
      operationTitle1.value = key + '作业' + operationTitle.value;
      operationType.value = key;
      operationHandleSearch(ids);
    }
  };
  const operationSecondBack = async () => {
    await latestOperationFn.value.call();
    operationRundownStep.value--;
  };

  // 证照
  const licenseTitle = ref('');
  const licenseRundownType = ref('');
  const { rundownData: licenseRundownData, rundownStep: licenseRundownStep } =
    useDataRundown({
      apis: [getDataScreenByType],
      timeParams: {
        timeRange,
        timeRangeToScopeObj,
        timeArr,
      },
    });
  const handleLicenseClick = async (options: any) => {
    const { type, name } = options;
    licenseRundownType.value = type;
    const obj = {
      EntLicenseCount: '企业证照明细',
      EntLicenseValidCount: '企业证照明细',
      licenseCount: '员工证照明细',
      licenseValidCount: '员工证照明细',
      licenseSkill: '员工技能资格证书明细',
    };
    const apiObj = {
      EntLicenseCount: getDataScreenEntLicense,
      EntLicenseValidCount: getDataScreenEntLicense,
      licenseCount: getDataScreenStaffLicense,
      licenseValidCount: getDataScreenStaffLicense,
      licenseSkill: getDataScreenStaffLicense,
    };
    let ids = [];
    if (type === 'EntLicenseValidCount' || type === 'licenseValidCount') {
      // 取全部id
      const allIds =
        operationData.value.find(
          (item: any) => item.name === type.replaceAll('Valid', '')
        )?.relativeId || [];
      // 取有效id
      const validIds =
        operationData.value.find((item: any) => item.name === type)
          ?.relativeId || [];
      // 取差集就是无效id
      ids = allIds.filter((item: any) => !validIds.includes(item));
    } else {
      ids =
        operationData.value.find(
          (item: any) => item.name === (type !== 'licenseSkill' ? type : name)
        )?.relativeId || [];
    }

    if (!ids.length) return;
    licenseTitle.value = obj[type as keyof typeof obj];
    const { data } = await apiObj[type as keyof typeof apiObj](ids);
    licenseRundownData.value = data;
    licenseRundownStep.value++;
  };
  const licenseBack = () => {
    licenseRundownStep.value--;
  };

  // 隐患排查
  const pitfallTaskTitle = ref('');
  const pitfallTaskType = ref('');
  const {
    rundownData: pitfallTaskRundownData,
    rundownStep: pitfallTaskRundownStep,
    handleSearch: pitfallTaskHandleSearch,
    back: pitfallTaskBack,
  } = useDataRundown({
    apis: [
      getDataScreenRiskControl,
      getDataScreenRiskCheckFirst,
      getDataScreenRiskCheckSecond,
    ],
    timeParams: { timeRange, timeRangeToScopeObj, timeArr },
  });

  // 隐患治理
  const pitfallType = ref('all');
  const {
    rundownData: pitfallRundownData,
    rundownStep: pitfallRundownStep,
    handleSearch: pitfallHandleSearch,
    back: pitfallBack,
  } = useDataRundown({
    apis: [getDataScreenRiskControl, getDataScreenRiskGovernDetail],
    timeParams: { timeRange, timeRangeToScopeObj, timeArr },
  });

  // 隐患整改情况
  const {
    rundownData: rectifyRundownData,
    rundownStep: rectifyRundownStep,
    handleSearch: rectifyHandleSearch,
    back: rectifyBack,
  } = useDataRundown({
    apis: [getDataScreenRiskControl, getDataScreenRiskGovernDetailFirst],
    timeParams: { timeRange, timeRangeToScopeObj, timeArr },
  });
  const rectifyDataSearch = () => {
    if (pitfallData.value.riskGovern) {
      const { hidCorrectRate, onTimeCorrectRate, onceQualifiedRate } =
        pitfallData.value.riskGovern;
      if (
        hidCorrectRate == 0 &&
        onTimeCorrectRate == 0 &&
        onceQualifiedRate == 0
      ) {
        return;
      }
    }
    rectifyHandleSearch({});
  };

  // 隐患数量趋势
  const {
    rundownData: pitfallNumRundownData,
    rundownStep: pitfallNumRundownStep,
    handleSearch: pitfallNumHandleSearch,
    back: pitfallNumBack,
  } = useDataRundown({
    apis: [getDataScreenRiskControl, getDataScreenRiskNumTrendDetail],
    timeParams: { timeRange, timeRangeToScopeObj, timeArr },
  });
  const pitfallNumTitle = ref('');
  const pitfallNumType = ref('all');
</script>
<style lang="less">
  @media screen and (min-width: 1366px) {
    :root {
      font-size: 12px;
    }
  }
  @media screen and (min-width: 1600px) {
    :root {
      font-size: 14px;
    }
  }
  @media screen and (min-width: 1920px) {
    :root {
      font-size: 14px;
    }
  }
  @media screen and (min-width: 2560px) {
    :root {
      font-size: 16px;
    }
  }
  @media screen and (min-width: 4096px) {
    :root {
      font-size: 16px;
    }
  }
</style>
<style lang="less" scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter,
  .fade-leave-to {
    opacity: 0;
  }
  .iotv-container {
    width: 44.79vw;
    height: 52.08vh;
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
    background-image: url('@/assets/images/data-screen-top.png');
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
    // position: relative;

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
      }
    }
    .right {
      flex: 0 0 auto;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      gap: 0.5rem;
    }
    .data-block {
      width: 100%;
      height: 100%;
      display: flex;
      box-sizing: border-box;
      justify-content: center;
      overflow: hidden;
    }
    .operation-content {
      display: flex;
      flex-direction: column;
      height: 100%;
      width: 100%;
      padding-top: 2.15rem;
    }
    .control-data-block {
      width: 100%;
      height: 100%;
      display: grid;
      grid-template-rows: repeat(2, 1fr);
      padding: 2.15rem 0 2.5vh;
      box-sizing: border-box;
      overflow: hidden;
      .alert {
        position: absolute;
        top: 1.5rem;
        left: 50%;
        transform: translate(-50%, 0);
        width: fit-content;
        background: linear-gradient(
          180deg,
          rgba(4, 60, 149, 1) 0%,
          rgba(4, 33, 68, 0.74) 14.22%,
          rgba(4, 23, 62, 0.8) 51.46%,
          rgba(7, 45, 94, 0.77) 87.86%,
          rgba(4, 62, 151, 1) 100%
        );
        border: 0.5px solid rgba(48, 97, 219, 1);
        box-shadow: 0px 0px 3px rgba(3, 255, 246, 0.34);
        :deep(.arco-alert-content) {
          color: #ffffff;
        }
      }
      .center-alert {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    }
    .rectify-chart-group {
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 0.59rem;
      background: #0e0e4f;
      & > div {
        cursor: pointer;
      }
    }
    .license {
      padding-top: 1.5rem;
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      gap: 1.29rem;
    }
  }

  .warning.screen-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 20px solid transparent;
    border-radius: 0.5rem;
    animation: glowing 0.5s infinite;
  }
  :deep(.pagination) {
    margin-top: auto;
    padding-top: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    --color-primary-light-1: #2a82e4;
    --primary-6: 255, 255, 255;
    --border-radius-small: 50%;
    .arco-pagination {
      font-size: 0;
    }
    .arco-pagination-size-mini .arco-pagination-item {
      min-width: 0.4rem;
      height: 0.4rem;
      line-height: 0.4rem;
      font-size: 0;
      padding: 0;
      background-color: #ffffff;
    }
    .arco-pagination-size-mini .arco-pagination-item-active {
      background-color: #2a82e4;
    }
    .arco-pagination-item-previous {
      display: none !important;
    }
    .arco-pagination-item-next {
      display: none !important;
    }
  }
</style>
