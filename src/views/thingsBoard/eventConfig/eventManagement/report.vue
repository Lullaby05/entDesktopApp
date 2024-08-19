<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">总结报告</span>
      </div>
      <div class="content">
        <div class="event-summarize" v-if="info">
          <div class="info-title">事件总结：</div>
          <div class="summarize-content">
            <div class="content-item">
              <div class="label">事件总结：</div>
              <div class="value">{{ info.summary }}</div>
            </div>
            <div class="content-item">
              <div class="label">附件：</div>
              <div class="value">
                <div
                  v-for="(content, i) in info.summaryAgreement"
                  :key="i"
                  class="attachment"
                >
                  <icon-attachment />
                  <a @click="handlePreview(content)">{{ content.fileName }}</a>
                </div>
              </div>
            </div>
            <div class="content-item">
              <div class="label">总结人：</div>
              <div class="value"> {{ info.summaryUserName }} </div>
            </div>
            <div class="content-item">
              <div class="label">总结时间：</div>
              <div class="value"> {{ info.finishTime }} </div>
            </div>
          </div>
        </div>
        <div class="event-info">
          <div class="info-title">事件信息</div>
          <event-info v-if="info" :info="info" />
        </div>
        <div class="event-progress">
          <div class="info-title">事件进程</div>
          <event-progress v-if="record" :info="info" :record="record" />
        </div>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router';
  import eventInfo from './components/eventInfo.vue';
  import eventProgress from './components/eventProgress.vue';
  import { computed, ref } from 'vue';
  import { getEventDetail, setMessageRead } from '@/api/thingsBoard';
  import { dictResponseType } from '@/api';
  import { eventTypeLevelDict } from '../eventConfigManagement/type';
  import { useUserStore } from '@/store';

  const router = useRouter();
  const route = useRoute();

  const goBack = () => {
    router.back();
  };

  const { id } = route.query;

  const info = ref<any>(undefined);
  const record = ref<any>(undefined);

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

  const handlePreview = (file: any) => {
    window.open(file.filePath);
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
      .event-progress,
      .event-summarize {
        width: 96%;
        padding-left: 26px;
      }
      .summarize-content {
        line-height: 2;
        padding: 0 16px;
        white-space: pre-wrap;
        width: 100%;
        .flex-display(flex-start, flex-start, column, 10px);
        .content-item {
          width: 100%;
          .flex-display(flex-start, flex-start, row);
          .label {
            flex: 0 0 90px;
            color: var(--color-text-2);
            text-align: right;
          }
          .attachment {
            display: flex;
            align-items: center;
            a {
              color: #2a82e4;
              cursor: pointer;
            }
          }
        }
      }
    }

    .btnGroup {
      text-align: center;
    }
  }
</style>
