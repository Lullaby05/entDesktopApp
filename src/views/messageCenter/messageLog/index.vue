<!-- 消息发送日志 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form :model="tempSearchForm" layout="inline">
          <a-form-item field="eventId" label="事件编号">
            <a-input
              v-model="tempSearchForm.eventId"
              placeholder="请输入事件编号"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="notificationTime" label="通知时间">
            <a-range-picker
              v-model="tempSearchForm.notificationTime"
              show-time
              :time-picker-props="{
                defaultValue: ['00:00:00', '23:59:59'],
              }"
              format="YYYY-MM-DD HH:mm:ss"
              :placeholder="['开始时间', '结束时间']"
              allow-clear
            ></a-range-picker>
          </a-form-item>
          <a-form-item field="noticeMode" label="通知方式">
            <a-select
              v-model="tempSearchForm.noticeMode"
              placeholder="请选择通知方式"
              allow-search
              allow-clear
            >
              <a-option
                v-for="item in notificationMethodTypeList"
                :key="item.remark"
                :value="item.remark"
                >{{ item.dictKey }}</a-option
              >
            </a-select>
          </a-form-item>
          <a-form-item field="userId" label="消息通知人">
            <a-select
              v-model="tempSearchForm.userId"
              allow-clear
              allow-search
              placeholder="请选择消息通知人"
            >
              <a-option
                v-for="item in staffData"
                :key="item.id"
                :value="item.id"
                :label="item.userName"
              ></a-option>
            </a-select>
            <!-- <a-input
              v-model="tempSearchForm.userName"
              placeholder="请输入消息通知人"
              allow-clear
            ></a-input> -->
          </a-form-item>
          <a-form-item field="realContent" label="通知内容">
            <a-input
              v-model="tempSearchForm.realContent"
              placeholder="请输入通知内容"
              allow-clear
            ></a-input>
          </a-form-item>
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
          :data="messageLogList.list"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #realContent="{ record }">
            <div v-html="record.realContent"></div>
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
          :total="(messageLogList.total as number)"
          @change="pageChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>
  </div>
</template>
<script lang="ts" setup name="MessageLog">
  import { getMessageLogList, getNoticeTypeDict } from '@/api/messageCenter';
  import { TableColumnData } from '@arco-design/web-vue';
  import { onBeforeMount, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { formatDate } from '@/utils/utils';
  import { handleOnKeyup } from '@/utils/event';
  import { dictResponseType } from '@/api';
  import { useUserStore } from '@/store';
  import { eventTypeLevelDict } from '@/views/thingsBoard/eventConfig/eventConfigManagement/type';
  import { useSearch } from '@/views/pitfall/snapshot/composition/useSearch';

  const router = useRouter();
  const { staffData } = useSearch(['staffData']);

  const userStore = useUserStore();

  const tempSearchForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
  });
  const selectForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
  });

  const messageLogList = ref<any>({ list: [], total: 0 });

  // 数据字典
  const eventTypeList = ref<dictResponseType[]>(eventTypeLevelDict);
  const yesOrNoList = ref<dictResponseType[]>([
    { dictKey: '是', dictValue: 1 },
    { dictKey: '否', dictValue: 0 },
  ]);
  const strategyTypeList = ref<dictResponseType[]>([
    { dictKey: '默认', dictValue: 'DEFAULT' },
    { dictKey: '自定义', dictValue: 'CUSTOM' },
  ]);
  const notificationMethodTypeList = ref<dictResponseType[]>([]);
  const statusTypeList = [
    { dictKey: '成功', dictValue: 'SUCCESS' },
    { dictKey: '失败', dictValue: 'FAIL' },
  ];

  const getDictList = async () => {
    const { data } = await getNoticeTypeDict();
    notificationMethodTypeList.value = data.map((ele: any) => ({
      dictKey: ele.name,
      dictValue: ele.id,
      remark: ele.noticeMode,
    }));
  };

  const columns: TableColumnData[] = [
    { title: '序号', dataIndex: 'number', slotName: 'number', width: 60 },
    { title: '所属公司', dataIndex: 'companyName', width: 130 },
    { title: '事件编号', dataIndex: 'eventId', width: 130 },
    { title: '事件名称', dataIndex: 'eventName', width: 100 },
    { title: '通知时间', dataIndex: 'sendStartTime', width: 130 },
    { title: '通知方式', dataIndex: 'notificationMethod', width: 110 },
    { title: '消息通知人', dataIndex: 'userName', width: 120 },
    {
      title: '通知内容',
      dataIndex: 'realContent',
      slotName: 'realContent',
      // width: 350,
      cellStyle: { width: '27%' },
    },
    {
      title: '消息发送状态',
      dataIndex: 'sendStatusName',
      // width: 100,
      bodyCellStyle(record) {
        return {
          color: record.status === 'FAIL' ? '#FF4D4F' : '',
        };
      },
      cellStyle: { width: '9%' },
    },
    { title: '备注', dataIndex: 'message', width: 120 },
    { title: '消息是否被接收', dataIndex: 'isReceiveName', width: 90 },
    { title: '消息接收时间', dataIndex: 'sendEndTime', width: 130 },
  ];

  const getTableList = async () => {
    const params = {
      ...selectForm.value,
      eventType: selectForm.value.typeNLevel?.split('-')[0],
      eventLevel: selectForm.value.typeNLevel?.split('-')[1]
        ? selectForm.value.typeNLevel
        : undefined,
      sendEndTime: selectForm.value.notificationTime
        ? +new Date(selectForm.value.notificationTime[1])
        : undefined,
      sendStartTime: selectForm.value.notificationTime
        ? +new Date(selectForm.value.notificationTime[0])
        : undefined,
      tenantId: userStore.userInfo.tenantId,
    };
    Object.keys(params).forEach((key) => {
      if (params[key] === '') {
        params[key] = undefined;
      }
    });
    const { data } = await getMessageLogList(params);
    messageLogList.value.total = data.total;
    messageLogList.value.list = data.list.map((ele: any) => {
      const eventDict = eventTypeList.value.find(
        (item) => item.dictValue === ele.eventType
      );
      const levelDict = eventDict?.children?.find(
        (item) => item.dictValue === ele.eventLevel
      );
      const typeDict = strategyTypeList.value.find(
        (item) => item.dictValue === ele.type
      );
      const notificationMethod = notificationMethodTypeList.value.find(
        (item) => item.remark === ele.noticeMode
      )?.dictKey;
      const statusName = statusTypeList.find(
        (item) => item.dictValue === ele.status
      )?.dictKey;
      return {
        ...ele,
        sendStartTime: ele.sendTime ? formatDate(ele.sendTime) : '',
        sendEndTime: ele.receiveTime ? formatDate(ele.receiveTime) : '',
        eventTypeName: eventDict?.dictKey,
        eventLevelName: levelDict?.dictKey,
        color: levelDict?.color,
        notificationMethod,
        isReceiveName: ele.isReceive ? '是' : '否',
        realContent:
          ele.realContent && ele.realContent.replace(/\r\n/g, ' <br/> '),
        sendStatusName: statusName,
      };
    });
  };

  onBeforeMount(async () => {
    await getDictList();
    getTableList();
  });
  const handleReset = () => {
    selectForm.value = {
      pageNo: selectForm.value.pageNo,
      pageSize: selectForm.value.pageSize,
    };
    tempSearchForm.value = {
      pageNo: selectForm.value.pageNo,
      pageSize: selectForm.value.pageSize,
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

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getTableList();
    });
  });
</script>
<style lang="less" scoped>
  .header-btn {
    display: flex;
    justify-content: center;
    align-items: flex-start;
    flex-direction: column;
    gap: 12px;
  }
</style>
