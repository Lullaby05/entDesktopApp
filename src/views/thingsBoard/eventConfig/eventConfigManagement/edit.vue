<!-- 事件配置管理-编辑 -->
<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">事件配置 </span>
      </div>
      <div class="content-card-inner">
        <a-form ref="formRef" :model="eventFormData" :rules="formRules">
          <div class="event-info">
            <div class="title">事件信息</div>
            <div class="event-info-description">
              <div class="info">
                <div>事件名称：</div>
                <div>{{ eventFormData.eventName }}</div>
              </div>
              <div class="info">
                <div>事件说明：</div>
                <div>{{ eventFormData.eventDesc }}</div>
              </div>
            </div>
          </div>
          <div class="event-info">
            <div class="title">事件分类分级</div>
            <div class="event-info-form" style="width: 50%">
              <a-form-item field="eventType" label="事件类型：">
                <a-radio-group
                  v-model="eventFormData.eventType"
                  :options="eventTypeList"
                  @change="() => (eventFormData.eventLevel = '')"
                ></a-radio-group>
              </a-form-item>
              <a-form-item
                v-if="eventFormData.eventType"
                field="eventLevel"
                label="事件等级："
              >
                <a-radio-group v-model="eventFormData.eventLevel">
                  <a-radio
                    v-for="item in levelList"
                    :key="item.value"
                    :value="item.value"
                    ><span :style="{ color: item.color }">{{
                      item.label
                    }}</span>
                  </a-radio>
                </a-radio-group>
              </a-form-item>
            </div>
          </div>
          <!-- <div class="event-info">
            <div class="title"
              ><span>人工确认设置</span
              ><a-tooltip
                content="事件触发后是否需要进行“事件属实确认与否”配置"
              >
                <icon-info-circle /> </a-tooltip
            ></div>
            <div class="event-info-form">
              <a-form-item field="personConfirm" label="人工确认：">
                <a-radio-group
                  v-model="eventFormData.personConfirm"
                  :options="personConfigList"
                ></a-radio-group>
              </a-form-item>
            </div>
          </div> -->
          <div class="event-config">
            <div class="title">事件通知策略（必填发生） </div>
            <strategySteps ref="strategyFormRef" :id="(id as string)" />
          </div>
        </a-form>
      </div>
      <div class="btn">
        <a-button @click="goBack">取消</a-button>
        <a-button type="primary" @click="handleSubmit">保存</a-button>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router';
  import { editEventConfigOptions, eventTypeLevelDict } from './type';
  import { computed, ref } from 'vue';
  import { dictResponseType } from '@/api';
  import { RadioOption } from '@arco-design/web-vue/es/radio/interface';
  import { getEventConfigDetail, updateEventConfig } from '@/api/thingsBoard';
  import strategySteps from '../eventMessageConfig/components/strategySteps.vue';
  import { Form, Message } from '@arco-design/web-vue';
  import { useStrategy } from '../eventMessageConfig/composition/useStrategy';
  import { createDefaultConfig, updateConfig } from '@/api/messageCenter';

  const route = useRoute();
  const router = useRouter();

  const { id } = route.query;

  const goBack = () => {
    router.back();
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
        (ele) => ele.dictValue === eventFormData.value.eventType
      )?.children || []
    ).map((ele) => ({
      ...ele,
      label: ele.dictKey,
      value: ele.dictValue,
    }));
  });
  const methodList = ref<dictResponseType[]>([]);
  const personConfigList = ref<RadioOption[]>([
    { label: '需要', value: '1' },
    { label: '不需要', value: '0' },
  ]);

  const eventFormData = ref<editEventConfigOptions>({
    id: id as string,
    eventName: '',
    eventDesc: '',
    eventType: '',
    eventLevel: '',
    methods: [],
    personConfirm: '',
  });
  const formRules = {
    eventType: [
      { required: true, message: '请选择事件类型', trigger: 'change' },
    ],
    eventLevel: [
      { required: true, message: '请选择事件等级', trigger: 'change' },
    ],
    method: [{ required: true, message: '请选择通知方式', trigger: 'change' }],
    personConfirm: [
      { required: true, message: '请选择人工确认', trigger: 'change' },
    ],
  };

  const formRef = ref<InstanceType<typeof Form> | null>(null);
  const handleSubmit = async () => {
    formRef.value?.validate(async (valid) => {
      if (!valid) {
        // 提交表单
        await handleSubmitMessageStrategy();
        await updateEventConfig(eventFormData.value);
        Message.success('保存成功');
        goBack();
      }
    });
  };

  const strategyFormRef = ref<InstanceType<typeof strategySteps> | null>(null);
  const { getReqParams } = useStrategy();
  const handleSubmitMessageStrategy = async () => {
    return new Promise(async (resolve, reject) => {
      const strategyResult = await strategyFormRef.value?.validate();
      if (strategyResult) return reject(strategyResult);
      const strategyFormData = strategyFormRef.value?.getFormData();
      const formData = [
        strategyFormData.happened,
        ...strategyFormData.upgrade,
        strategyFormData.recover,
      ];
      const params = getReqParams(
        formData,
        false,
        eventFormData.value.eventName,
        id as string
      );
      const strategyId = strategyFormRef.value?.getStrategyId();
      const req = strategyId ? updateConfig : createDefaultConfig;
      await req({
        ...params,
        id: strategyId,
        eventType: eventFormData.value.eventType,
        eventLevel: eventFormData.value.eventLevel,
        isImprove: !!strategyFormData.upgrade.length,
      });
      resolve(void 0);
    });
  };

  const getDetail = async () => {
    // 获取事件详情
    const { data } = await getEventConfigDetail(id as string);
    eventFormData.value = data;
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
    :deep(.arco-form) {
      // width: 50%;
    }
    .event-info-description {
      display: flex;
      flex-direction: column;
      padding-left: 40px;
      .info {
        display: flex;
        // align-items: center;
      }
      .info div {
        line-height: 2;
        &:nth-of-type(1) {
          flex: 0 0 auto;
        }
        &:nth-of-type(2) {
          text-indent: 1em;
        }
      }
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
