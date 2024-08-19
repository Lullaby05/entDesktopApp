<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">事件详情</span>
      </div>
      <div class="content">
        <div class="event-info">
          <div class="info-title">事件信息</div>
          <event-info v-if="info" :info="info" />
        </div>
        <div class="event-progress" v-if="info && info.eventType === '1'">
          <div class="info-title">事件进程</div>
          <event-progress v-if="record" :info="info" :record="record" />
        </div>
        <div class="btn-group" v-if="info && info.eventType === '2'">
          <a-button type="primary" @click="jumpToPitfall"
            >点击查看隐患处置详情</a-button
          >
        </div>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router';
  import eventInfo from './components/eventInfo.vue';
  import eventProgress from './components/eventProgress.vue';
  import { getEventDetail, setMessageRead } from '@/api/thingsBoard';
  import { computed, ref } from 'vue';
  import { dictResponseType } from '@/api';
  import { eventTypeLevelDict } from '../eventConfigManagement/type';
  import useRouterJump from '@/hooks/routerJump';
  import { useUserStore } from '@/store';

  const router = useRouter();
  const route = useRoute();

  const eventTypeList = computed<dictResponseType[]>(() => eventTypeLevelDict);
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

  const { id } = route.query;

  const info = ref<any>(undefined);
  const record = ref<any>(undefined);

  const userStore = useUserStore();
  const userInfo = computed(() => userStore.userInfo);
  const getDetail = async () => {
    const { data } = await getEventDetail(id as string);
    setMessageRead({
      eventId: id as string,
      userId: userInfo.value.userId,
    });
    const eventDict = eventTypeList.value.find(
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

  getDetail();

  const { jumpWithTab } = useRouterJump();
  const jumpToPitfall = () => {
    const { relevancyId: id } = info.value;
    const {
      hidRiskLevelCode,
      dangerStateCode,
      dangerLevelCode = 0,
      rectifyCount = 0,
    } = record.value;
    jumpWithTab({
      routerName: 'PitfallDetail',
      redirectName: 'PitfallManage',
      params: {
        id,
        dangerStateCode,
        dangerLevelCode: dangerLevelCode ? dangerLevelCode : hidRiskLevelCode,
        rectifyCount,
        source: 'pitfallDetail',
        type: 'toDetail',
        title: '隐患详情',
      },
    });
  };

  const goBack = () => {
    router.back();
  };
</script>
<style lang="less" scoped>
  @import '/src/assets/style/mixin.less';
  .arco-card.content-card {
    .header {
      font-size: 18px;
      margin-bottom: 20px;

      .title {
        margin-left: 8px;
      }
    }
    .content {
      min-height: calc(100vh - 265px);
      .flex-display(flex-start, flex-start, column, 50px);
      .info-title {
        font-size: 16px;
        font-family: 'Alibaba-Medium';
        margin-bottom: 20px;
      }
      .event-info,
      .event-progress {
        width: 96%;
        padding-left: 26px;
      }
    }

    .btn-group {
      padding-left: 26px;
    }
  }
</style>
