<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">编辑 </span>
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
            <a-form ref="formRef" :model="formData" :rules="formRules">
              <a-form-item field="eventType" label="事件类型：">
                <a-radio-group
                  v-model="formData.eventType"
                  :options="eventTypeList"
                  @change="() => (formData.eventLevel = '')"
                ></a-radio-group>
              </a-form-item>
              <a-form-item
                v-if="formData.eventLevel"
                field="eventLevel"
                label="事件等级："
              >
                <a-radio-group v-model="formData.eventLevel">
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
            </a-form>
          </div>
        </div>
        <div class="event-config">
          <div class="title">事件通知策略（必填发生）</div>
          <strategySteps ref="strategyFormRef" />
        </div>
      </div>
      <div class="btn">
        <a-button @click="goBack">取消</a-button>
        <a-button type="primary" @click="handleSubmit">保存</a-button>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { eventTypeLevelDict } from '../eventConfigManagement/type';
  import { RadioOption } from '@arco-design/web-vue/es/radio/interface';
  import strategySteps from './components/strategySteps.vue';
  import { Form, Message } from '@arco-design/web-vue';
  import {
    createDefaultConfig,
    getDefaultConfig,
    updateConfig,
  } from '@/api/messageCenter';
  import { useUserStore } from '@/store';
  import { useStrategy } from './composition/useStrategy';

  const route = useRoute();
  const router = useRouter();
  const { isDefault = true } = route.query;
  const goBack = () => {
    router.back();
  };

  const userStore = useUserStore();
  const userInfo = computed(() => {
    return userStore.userInfo;
  });

  const formRef = ref<InstanceType<typeof Form> | null>(null);
  const strategyFormRef = ref<InstanceType<typeof strategySteps> | null>(null);
  const { getReqParams } = useStrategy();
  const handleSubmit = async () => {
    const result = await formRef.value?.validate();
    if (result) return;
    const strategyResult = await strategyFormRef.value?.validate();
    if (strategyResult) return;
    const strategyFormData = strategyFormRef.value?.getFormData();
    const strategyForm = [
      strategyFormData.happened,
      ...strategyFormData.upgrade,
      strategyFormData.recover,
    ];
    const id = strategyFormRef.value?.getStrategyId();
    const params = getReqParams(strategyForm);
    const req = id ? updateConfig : createDefaultConfig;
    await req({
      ...params,
      id,
      isImprove: !!strategyFormData.upgrade.length,
      eventType: formData.value.eventType || undefined,
      eventLevel: formData.value.eventLevel || undefined,
    });
    Message.success(id ? '编辑成功' : '新增成功');
    goBack();
  };

  const formData = ref<any>({
    eventType: '',
    eventLevel: '',
  });
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
      background-color: var(--bg1);
      .info-icon {
        color: #faad14;
        margin-right: 10px;
        font-size: 16px;
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
