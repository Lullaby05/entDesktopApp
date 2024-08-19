<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">详情 </span>
      </div>
      <div class="content-card-inner">
        <div class="warning">
          <icon-info-circle class="info-icon" />
          <span
            >当发生的事件未进行消息通知策略配置时，默认启动如下配置的通知策略</span
          >
        </div>
        <div class="event-info" v-if="!isDefault">
          <div class="title">事件信息</div>
          <div>
            <div>{{ info.eventName }}</div>
            <div>
              <span>{{ info.eventTypeName }}</span>
              <a-tag :color="info.color">{{ info.eventLevelName }}</a-tag>
            </div>
          </div>
          <div class="event-desctiption">
            <span>{{ info.eventDesc }}</span>
          </div>
        </div>
        <div class="event-config">
          <div class="title">事件通知策略</div>
          <strategyStepsDetail />
        </div>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { eventTypeLevelDict } from '../eventConfigManagement/type';
  import { RadioOption } from '@arco-design/web-vue/es/radio/interface';
  import strategyStepsDetail from './components/strategyStepsDetail.vue';

  const route = useRoute();
  const router = useRouter();
  const { isDefault = true, type = 'detail' } = route.query;
  const goBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    goBack();
  };

  const formData = ref<any>({});
  const formRules = {
    eventType: [
      { required: true, message: '请选择事件类型', trigger: 'change' },
    ],
    eventLevel: [
      { required: true, message: '请选择事件等级', trigger: 'change' },
    ],
  };
  const eventTypeList = ref<RadioOption[]>(
    eventTypeLevelDict.map((ele) => ({
      ...ele,
      label: ele.dictKey,
      value: ele.dictValue,
    }))
  );
  const levelList = computed(() => {
    return (
      eventTypeLevelDict.find(
        (ele) => ele.dictValue === formData.value.eventType
      )?.children || []
    ).map((ele) => ({
      ...ele,
      label: ele.dictKey,
      value: ele.dictValue,
    }));
  });
</script>
<style lang="less" scoped>
  @import '/src/assets/style/mixin.less';
  .arco-card.content-card {
    .header {
      font-size: 18px;

      .title {
        margin-left: 8px;
      }
    }
  }
  .content-card-inner {
    min-height: calc(100vh - 265px);
    margin: 0 25px 20px 25px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    overflow: hidden;
    .event-info {
      width: 65%;
    }
    .title {
      margin: 30px 0 20px;
      font-family: 'Alibaba-Medium';
      font-size: 16px;
      font-weight: 500;
    }
    .warning {
      margin-top: 12px;
      display: flex;
      padding: 10px 20px;
      background-color: #fff7e8;
      .info-icon {
        color: #faad14;
        margin-right: 10px;
        font-size: 16px;
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
  .btn {
    padding-top: 20px;
    text-align: center;

    button + button {
      margin-left: 12px;
    }
  }
</style>
