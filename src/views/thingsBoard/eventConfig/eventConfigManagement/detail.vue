<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">事件配置 </span>
      </div>
      <div class="content-card-inner">
        <div class="event-info">
          <div class="title">事件信息</div>
          <div class="content">
            <div class="event-base-info">
              <span class="event-name">{{ eventFormData.eventName }}</span>
              <span class="event-type">{{ eventFormData.eventTypeName }}</span>
              <a-tag
                v-if="eventFormData.eventLevel"
                :color="eventFormData.color"
                >{{ eventFormData.eventLevelName }}</a-tag
              >
            </div>
            <div class="event-description"> {{ eventFormData.eventDesc }} </div>
          </div>
        </div>
        <div class="event-config">
          <div class="title">事件通知策略</div>
          <strategyStepsDetail :id="(id as string)" />
        </div>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router';
  import strategyStepsDetail from '../eventMessageConfig/components/strategyStepsDetail.vue';
  import { getEventConfigDetail } from '@/api/thingsBoard';
  import { ref } from 'vue';
  import { eventTypeLevelDict } from './type';
  import { dictResponseType } from '@/api';

  const route = useRoute();
  const router = useRouter();

  const { id } = route.query;

  const goBack = () => {
    router.back();
  };

  const eventTypeList = ref<dictResponseType[]>(eventTypeLevelDict);

  const eventFormData = ref<any>({});
  const getDetail = async () => {
    // 获取事件详情
    const { data } = await getEventConfigDetail(id as string);
    const eventDict = eventTypeList.value.find(
      (item) => item.dictValue === data.eventType
    );
    const levelDict = eventDict?.children?.find(
      (item) => item.dictValue === data.eventLevel
    );
    eventFormData.value = {
      ...data,
      eventTypeName: eventDict?.dictKey,
      eventLevelName: levelDict?.dictKey,
      color: levelDict?.color,
    };
  };
  getDetail();
</script>
<style lang="less" scoped>
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
    .title {
      margin: 30px 0 20px;
      font-family: 'Alibaba-Medium';
      font-size: 16px;
      font-weight: 500;
    }
    .event-info {
      line-height: 2;
      .content {
        margin-left: 28px;
        .event-base-info {
          display: flex;
          align-items: center;
          gap: 20px;
          .event-name {
            font-size: 18px;
            font-family: 'Alibaba-Medium';
            font-weight: 500;
          }
          .event-type {
            font-size: 16px;
            font-family: 'Alibaba-Medium';
            font-weight: 500;
          }
        }
        .event-description {
          font-size: 18px;
        }
      }
    }
  }
</style>
