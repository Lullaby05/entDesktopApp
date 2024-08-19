<!-- 监测预警管理-事件总览列表 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form :model="tempSearchForm" layout="inline">
          <a-form-item field="deviceName" label="触发设备">
            <a-input
              v-model="tempSearchForm.deviceName"
              placeholder="请输入触发设备"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="typeNLevel" label="事件类型等级">
            <a-cascader
              :options="eventTypeList"
              v-model="tempSearchForm.typeNLevel"
              :field-names="{ label: 'dictKey', value: 'dictValue' }"
              placeholder="请选择事件类型等级"
              check-strictly
              allow-clear
              allow-search
            />
          </a-form-item>
          <a-form-item field="deviceLocation" label="设备位置">
            <a-input
              v-model="tempSearchForm.deviceLocation"
              placeholder="请输入设备位置"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="createTime" label="事件上报时间">
            <a-range-picker
              v-model="tempSearchForm.createTime"
              show-time
              :time-picker-props="{
                defaultValue: ['00:00:00', '23:59:59'],
              }"
              format="YYYY-MM-DD HH:mm:ss"
              :placeholder="['开始时间', '结束时间']"
              allow-clear
            ></a-range-picker>
          </a-form-item>
          <a-form-item field="deviceAlarmStatus" label="设备告警状态">
            <a-select
              v-model="tempSearchForm.deviceAlarmStatus"
              placeholder="请选择设备告警状态"
              allow-search
              allow-clear
            >
              <a-option
                v-for="item in statusList"
                :key="item.dictValue"
                :value="item.dictValue"
                >{{ item.dictKey }}</a-option
              >
            </a-select>
          </a-form-item>
          <!-- <a-form-item field="eventStatus" label="事件处理状态">
            <a-select
              v-model="tempSearchForm.eventStatus"
              placeholder="请选择事件处理状态"
              allow-search
              allow-clear
            >
              <a-option
                v-for="item in handleStatusList"
                :key="item.dictValue"
                :value="item.dictValue"
                >{{ item.dictKey }}</a-option
              >
            </a-select>
          </a-form-item> -->
        </a-form>
      </template>
      <template #headerBtn>
        <div class="header-btn">
          <a-button
            type="primary"
            @click="
              () => {
                selectForm = tempSearchForm;
                getTableList();
              }
            "
          >
            <icon-search class="icon" />
            查询
          </a-button>
          <a-button @click="handleReset">
            <icon-refresh class="icon" />
            重置
          </a-button>
        </div>
      </template>
      <template #minorBtn>
        <a-space>
          <icon-refresh class="minor-icon" size="20" />
        </a-space>
      </template>
      <template #table>
        <a-table
          :data="eventConfigList.list"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #typeNLevel="{ record }">
            <div class="type-and-level">
              <span>{{ record.eventTypeName }}</span>
              <a-tag v-if="record.eventLevel" :color="record.color">{{
                record.eventLevelName
              }}</a-tag>
            </div>
          </template>
          <template #status>
            <span style="margin-right: 2px">设备告警状态</span>
            <a-tooltip content="监测预警设备上报数据是否恢复正常">
              <icon-exclamation-circle color="#86909C" />
            </a-tooltip>
          </template>
          <template #option="{ record }">
            <div>
              <a-button type="text" size="mini" @click="toDetailPage(record)">
                详情
              </a-button>
              <!-- <a-button
                v-permission="'EventManagementPersonConfirm'"
                type="text"
                size="mini"
                @click="toPersonConfirm(record)"
              >
                人工确认
              </a-button> -->
              <a-button
                v-if="record.eventType === '1' && record.eventStatus === 2"
                v-permission="'EventManagementReport'"
                type="text"
                size="mini"
                @click="toEventReport(record)"
              >
                事件报告
              </a-button>
            </div>
          </template>
        </a-table>
      </template>
      <template #pagination>
        <a-pagination
          :current="selectForm.pageNo"
          :page-size="selectForm.pageSize"
          show-total
          show-page-size
          :page-size-options="[10, 20, 50, 100]"
          :base-size="3"
          :buffer-size="1"
          :total="(eventConfigList.total as number)"
          @change="pageChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>
  </div>
</template>
<script lang="ts" setup name="EventManagement">
  import { computed, onBeforeMount, ref, onMounted } from 'vue';
  import { eventManageSearchType } from './type';
  import { TableColumnData, TableData } from '@arco-design/web-vue';
  import { getEventList, getEventTabsList } from '@/api/thingsBoard';
  import { dictResponseType } from '@/api';
  import { useRouter } from 'vue-router';
  import { eventTypeLevelDict } from '../eventConfigManagement/type';
  import { formatDate } from '@/utils/utils';
  import { handleOnKeyup } from '@/utils/event';
  import { useThingsBoardStore } from '@/store';

  const thingsBoardStore = useThingsBoardStore();

  const selectForm = ref<eventManageSearchType>({
    pageNo: 1,
    pageSize: 10,
    // eventType: thingsBoardStore.emergencyListTab,
  });
  const tempSearchForm = ref<eventManageSearchType>({
    pageNo: 1,
    pageSize: 10,
    // eventType: thingsBoardStore.emergencyListTab,
  });

  const eventTypeList = computed<dictResponseType[]>(() => {
    return eventTypeLevelDict.map((ele) => {
      return {
        ...ele,
        disabled:
          selectForm.value.eventType &&
          selectForm.value.eventType != ele.dictValue,
      };
    });
  });
  const levelList = ref<dictResponseType[]>([]);
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

  const eventConfigList = ref<{ list: TableData[]; total: number }>({
    list: [],
    total: 0,
  });
  const columns: TableColumnData[] = [
    {
      dataIndex: 'number',
      title: '序号',
      slotName: 'number',
      width: 60,
    },
    {
      dataIndex: 'eventName',
      title: '事件名称',
    },
    {
      dataIndex: 'typeNLevel',
      title: '事件类型等级',
      slotName: 'typeNLevel',
      width: 150,
      cellStyle: { width: '12%' },
    },
    {
      dataIndex: 'deviceName',
      title: '触发设备',
    },
    {
      dataIndex: 'deviceLocation',
      title: '设备位置',
    },
    {
      dataIndex: 'createTime',
      title: '事件上报时间',
    },
    {
      dataIndex: 'statusName',
      title: '设备告警状态',
      titleSlotName: 'status',
      bodyCellStyle(record) {
        return {
          color: record.deviceAlarmStatus === 0 ? '#d9001b' : '#357cf0',
        };
      },
    },
    {
      dataIndex: 'handleStatusName',
      title: '事件处理状态',
      bodyCellStyle(record) {
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
        if (record.type === 2 || record.type === 3) {
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
    // {
    //   dataIndex: 'personConfirmResult',
    //   title: '人工确认结果',
    // },
    {
      dataIndex: 'option',
      title: '操作',
      slotName: 'option',
      align: 'center',
    },
  ];

  const tabsList = ref<{ code?: string; name: string; num: number }[]>([]);

  const getTableList = async () => {
    const params = {
      ...selectForm.value,
      eventType: selectForm.value.typeNLevel
        ? selectForm.value.typeNLevel?.split('-')[0]
        : selectForm.value.eventType,
      eventLevel: selectForm.value.typeNLevel?.split('-')[1]
        ? selectForm.value.typeNLevel
        : undefined,
      eventStatusList: [2],
    };
    const { data } = await getEventList(params);
    eventConfigList.value.total = data.total;
    eventConfigList.value.list = data.list.map((ele: any) => {
      const eventDict = eventTypeList.value.find(
        (item) => item.dictValue === ele.eventType
      );
      const levelDict = eventDict?.children?.find(
        (item) => item.dictValue === ele.eventLevel
      );
      const handleStatusDict = handleStatusList.value.find(
        (item) => item.dictValue === ele.eventStatus
      );
      const statusDict = statusList.value.find(
        (item) => item.dictValue === ele.deviceAlarmStatus
      );
      const obj = {
        2: '进入隐患处理流程',
        3: '进入设备维保流程',
      };
      return {
        ...ele,
        color: levelDict?.color,
        createTime: ele.createTime ? formatDate(ele.createTime) : '',
        eventTypeName: eventDict?.dictKey,
        eventLevelName: levelDict?.dictKey,
        handleStatusName:
          ele.eventStatus === 1
            ? obj[ele.eventType as keyof typeof obj] ??
              handleStatusDict?.dictKey
            : handleStatusDict?.dictKey,
        statusName: statusDict?.dictKey,
      };
    });
  };
  const handleReset = () => {
    tempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
      // eventType: selectForm.value.eventType,
    };
    selectForm.value = {
      pageNo: 1,
      pageSize: 10,
      // eventType: selectForm.value.eventType,
    };
    getTableList();
  };
  const pageChange = (page: number) => {
    selectForm.value.pageNo = page;
    getTableList();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getTableList();
  };

  const getTabList = async () => {
    const tabsListRes = await getEventTabsList();
    const allTabsCounts = tabsListRes.data.reduce((pre: number, cur: any) => {
      return pre + cur.num;
    }, 0);
    tabsList.value = tabsListRes.data;
    tabsList.value.unshift({
      code: undefined,
      name: '全部',
      num: allTabsCounts,
    });
  };

  onBeforeMount(() => {
    // getTabList();
    getTableList();
  });

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getTableList();
    });
  });

  const router = useRouter();
  const toPersonConfirm = (record: TableData) => {
    router.push({
      name: 'EventManagementPersonConfirm',
      query: {
        id: record.eventRecordId,
      },
    });
  };
  const toDetailPage = (record: TableData) => {
    router.push({
      name: 'EventManagementDetail',
      query: {
        id: record.eventRecordId,
      },
    });
  };
  const toEventReport = (record: TableData) => {
    router.push({
      name: 'EventManagementReport',
      query: {
        id: record.eventRecordId,
      },
    });
  };
</script>
<style lang="less" scoped>
  .container :deep(.arco-tabs-nav-type-card-gutter) {
    &::before {
      display: none;
    }
    margin-bottom: 0px;
    .arco-tabs-tab {
      border-radius: 5px;
      background-color: var(--bg2);
      border-bottom: 1px solid var(--color-neutral-3);
    }
    .arco-tabs-tab-active {
      background-color: #357cf0;
      color: #ffffff;
    }
    .count {
      display: flex;
      align-items: center;
      justify-self: center;
      color: #ffffff;
      font-family: 'Alibaba';
      font-weight: 400;
      padding: 0.1rem 0.4rem;
      // line-height: 1;
      font-size: 0.72rem;
      margin-left: 0.5rem;
      border-radius: 2.54rem;
      background: #d43030;
      border: 0.5px solid #ff5733;
    }
  }
  .header-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .arco-btn + .arco-btn {
      margin-top: 12px;
    }
  }
  .type-and-level {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
