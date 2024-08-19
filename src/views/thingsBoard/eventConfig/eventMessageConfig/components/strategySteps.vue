<template>
  <div class="strategy-steps-container">
    <a-form ref="formRef" :model="formData" :rules="formRules">
      <a-steps direction="vertical">
        <a-step
          v-for="(item, index) in stepList"
          :key="item.code"
          status="process"
        >
          <template #icon>
            {{ item.name }}
          </template>
          <div class="background happened" v-if="item.id === 'happened'">
            <span>告警发生时，支持在以下时间段内发送告警通知：</span>
            <div class="time-part">
              <a-form-item field="happened.timeRange" hide-label>
                <a-checkbox
                  v-model="formData.happened.allTime"
                  @change="(ischeck) => changeTimeRange(ischeck, 'all')"
                  >全时段</a-checkbox
                >
                <a-checkbox
                  v-model="formData.happened.onDay"
                  @change="(ischeck) => changeTimeRange(ischeck, 'day')"
                  >按日</a-checkbox
                >
                <a-checkbox
                  v-model="formData.happened.onTimeRanger"
                  @change="(ischeck) => changeTimeRange(ischeck, 'time')"
                  >按时段</a-checkbox
                >
                <a-tooltip content="只在设置时间段内才会向人员发送告警通知">
                  <icon-info-circle size="16" />
                </a-tooltip>
              </a-form-item>
              <a-form-item
                v-if="formData.happened.onDay"
                field="happened.days"
                hide-label
              >
                <a-checkbox-group v-model="formData.happened.days">
                  <a-checkbox
                    v-for="item in week"
                    :key="item.value"
                    :value="item.value"
                    >{{ item.label }}</a-checkbox
                  >
                </a-checkbox-group>
              </a-form-item>
              <a-form-item
                v-if="formData.happened.onTimeRanger"
                field="happened.timeRanger"
                hide-label
              >
                <a-time-picker v-model="formData.happened.timeRanger[0]" />
                <span style="padding: 0 10px">-</span>
                <a-time-picker v-model="formData.happened.timeRanger[1]" />
              </a-form-item>
            </div>
            <div>
              每隔
              <a-form-item field="happened.interval" hide-label no-style>
                <a-input-number
                  placeholder="请输入"
                  style="width: 70px"
                  v-model="formData.happened.interval"
                  :step="1"
                  :precision="0"
                  :min="1"
              /></a-form-item>
              <a-form-item field="happened.intervalUnit" hide-label no-style>
                <a-select
                  style="margin-left: 5px; width: 120px"
                  v-model="formData.happened.intervalUnit"
                  placeholder="请选择"
                  allow-search
                >
                  <a-option
                    v-for="item in intervalUnitList"
                    :key="item.value"
                    :value="item.value"
                    :label="item.label"
                  />
                </a-select>
              </a-form-item>
              告警1次，最多告警
              <a-form-item field="happened.maxTimes" hide-label no-style>
                <a-input-number
                  placeholder="请输入"
                  style="width: 70px"
                  v-model="formData.happened.maxTimes"
                  :step="1"
                  :precision="0"
                  :min="1"
              /></a-form-item>
              <a-tooltip
                content="在告警被处置前，最多通知次数；告警被处置后，将不再发送通知"
              >
                <icon-info-circle size="16" /> </a-tooltip
              >次。告警将以以下方式通知
            </div>
            <notificationPerson
              ref="notificationRef"
              :notification-method-list="notificationMethodList"
              :dept-data="deptData"
              v-model:formData="formData.happened"
            />
          </div>
          <div v-if="item.id === 'upgrade'">
            <div class="background upgrade">
              <div style="margin-bottom: 10px">
                超过
                <a-form-item
                  :field="`upgrade[${index - 1}].upgradeInterval`"
                  :rules="[
                    {
                      required: true,
                      message: '请输入升级频率',
                    },
                  ]"
                  hide-label
                  no-style
                >
                  <a-input-number
                    placeholder="请输入"
                    style="width: 70px"
                    v-model="formData.upgrade[index - 1].upgradeInterval"
                    :step="1"
                    :precision="0"
                    :min="1"
                /></a-form-item>
                <a-form-item
                  :field="`upgrade[${index - 1}].upgradeIntervalUnit`"
                  :rules="[
                    {
                      required: true,
                      message: '请选择升级频率单位',
                    },
                  ]"
                  hide-label
                  no-style
                >
                  <a-select
                    style="margin-left: 5px; width: 120px"
                    v-model="formData.upgrade[index - 1].upgradeIntervalUnit"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="item in intervalUnitList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </a-select> </a-form-item
                >告警未被处置，告警将自动升级为如下环节
              </div>
              <div>
                每隔
                <a-form-item
                  :field="`upgrade[${index - 1}].interval`"
                  :rules="[
                    {
                      required: true,
                      message: '请输入告警频率',
                    },
                  ]"
                  hide-label
                  no-style
                >
                  <a-input-number
                    placeholder="请输入"
                    style="width: 70px"
                    v-model="formData.upgrade[index - 1].interval"
                    :step="1"
                    :precision="0"
                    :min="1"
                /></a-form-item>
                <a-form-item
                  :field="`upgrade[${index - 1}].intervalUnit`"
                  :rules="[
                    {
                      required: true,
                      message: '请选择告警频率单位',
                    },
                  ]"
                  hide-label
                  no-style
                >
                  <a-select
                    style="margin-left: 5px; width: 120px"
                    v-model="formData.upgrade[index - 1].intervalUnit"
                    placeholder="请选择"
                    allow-search
                  >
                    <a-option
                      v-for="item in intervalUnitList"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"
                    />
                  </a-select> </a-form-item
                >告警1次，最多告警
                <a-form-item
                  :field="`upgrade[${index - 1}].maxTimes`"
                  :rules="[
                    {
                      required: true,
                      message: '请输入最大告警次数',
                    },
                  ]"
                  hide-label
                  no-style
                >
                  <a-input-number
                    placeholder="请输入"
                    style="width: 70px"
                    v-model="formData.upgrade[index - 1].maxTimes"
                    :step="1"
                    :precision="0"
                    :min="1"
                /></a-form-item>
                <a-tooltip
                  content="在告警被处置前，最多通知次数；告警被处置后，将不再发送通知"
                >
                  <icon-info-circle size="16" /> </a-tooltip
                >次。告警将以以下方式通知
              </div>
              <notificationPerson
                ref="notificationRef"
                :notification-method-list="notificationMethodList"
                :dept-data="deptData"
                v-model:formData="formData.upgrade[index - 1]"
              />
              <div class="close-icon" @click="deleteUpgrade(index)"
                ><icon-close size="20"
              /></div>
            </div>
          </div>
          <a-button
            v-if="item.id === 'recover'"
            type="primary"
            style="width: 100%; margin-bottom: 15px"
            @click="addUpgrade"
            >升级通知</a-button
          >
          <div class="background recover" v-if="item.id === 'recover'">
            <div> 告警恢复时，消息将以以下方式通知</div>
            <notificationPerson
              :notification-method-list="notificationMethodList"
              :dept-data="deptData"
              v-model:formData="formData.recover"
            />
          </div>
        </a-step>
      </a-steps>
    </a-form>
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import notificationPerson from './notificationPerson.vue';
  import SnowflakeId from 'snowflake-id'; // 生成雪花id
  import {
    getConfigById,
    getDefaultConfig,
    getNoticeTypeDict,
  } from '@/api/messageCenter';
  import { formatDate } from '@/utils/utils';
  import { useSearch } from '@/views/pitfall/snapshot/composition/useSearch';
  import { useStrategy } from '../composition/useStrategy';
  const snowflake = new SnowflakeId({
    mid: 42,
    offset: (2019 - 1970) * 31536000 * 1000,
  });

  const props = defineProps({
    id: {
      type: String,
      default: '',
    },
  });

  const notificationMethodList = ref<
    { label: string; value: string; remark: string }[]
  >([]);
  const getNotifyMethodList = async () => {
    const { data } = await getNoticeTypeDict();
    notificationMethodList.value = data.map((item: any) => ({
      label: item.name,
      value: item.id,
      remark: item.noticeMode,
    }));
  };
  getNotifyMethodList();

  const { deptData } = useSearch(['deptData']);

  const formData = ref<any>({
    happened: {
      allTime: false,
      onDay: false,
      onTimeRanger: false,
      days: [],
      intervalUnit: '',
      timeRanger: [],
      customPerson: [],
      type: 'happened',
    },
    upgrade: [],
    recover: {
      customPerson: [],
      type: 'recover',
    },
  });
  const formRules = {
    'happened.timeRange': [
      { required: true, message: '请选择时间段', trigger: 'blur' },
    ],
    'happened.days': [
      { required: true, message: '请选择日期', trigger: 'blur' },
    ],
    'happened.timeRanger': [
      {
        required: true,
        validator: (value: any, cb: Function) => {
          return new Promise((resolve) => {
            if (!value || value.filter((ele: any) => ele).length !== 2) {
              cb('请选择时间段');
            }
            if (value[0] > value[1]) {
              cb('开始时间不能大于结束时间');
            }
            resolve(void 0);
          });
        },
      },
    ],
    'happened.interval': [
      { required: true, message: '请输入告警频率', trigger: 'blur' },
    ],
    'happened.intervalUnit': [
      { required: true, message: '请选择告警频率单位', trigger: 'blur' },
    ],
    'happened.maxTimes': [
      { required: true, message: '请输入最大告警次数', trigger: 'blur' },
    ],
    // 'upgrade.upgradeInterval': [
    //   { required: true, message: '请输入升级频率', trigger: 'blur' },
    // ],
    // 'upgrade.upgradeIntervalUnit': [
    //   { required: true, message: '请选择升级频率单位', trigger: 'blur' },
    // ],
    // 'upgrade.interval': [
    //   { required: true, message: '请输入告警频率', trigger: 'blur' },
    // ],
    // 'upgrade.intervalUnit': [
    //   { required: true, message: '请选择告警频率单位', trigger: 'blur' },
    // ],
    // 'upgrade.maxTimes': [
    //   { required: true, message: '请输入最大告警次数', trigger: 'blur' },
    // ],
  };

  const strategyId = ref('');
  const { getResParams } = useStrategy();
  const getDetail = async () => {
    const req = props.id ? getConfigById : getDefaultConfig;
    const params = {
      eventProfileId: props.id,
    };
    const { data } = await req(params);
    strategyId.value = data.id;
    formData.value = getResParams(data);
  };
  getDetail();

  const stepList = computed(() => {
    return [
      {
        code: snowflake.generate(),
        id: 'happened',
        name: '发生',
      },
      ...formData.value.upgrade.map(() => ({
        code: snowflake.generate(),
        id: 'upgrade',
        name: '升级',
      })),
      {
        code: snowflake.generate(),
        id: 'recover',
        name: '恢复',
      },
    ];
  });

  type checkType = (
    value: boolean | (string | number | boolean)[],
    field: string
  ) => any;
  const changeTimeRange: checkType = (ischeck, field) => {
    if (ischeck) {
      if (field === 'all') {
        formData.value.happened.onDay = false;
        formData.value.happened.onTimeRanger = false;
        formData.value.happened.timeRanger = [];
        formData.value.happened.days = [];
      } else if (field === 'day') {
        formData.value.happened.allTime = false;
      } else if (field === 'time') {
        formData.value.happened.allTime = false;
      }
      formData.value.happened.timeRange = 'all';
    } else {
      const obj: Record<typeof field, string> = {
        day: 'days',
        time: 'timeRanger',
      };
      obj[field] && (formData.value.happened[obj[field]] = []);
      if (
        formData.value.happened.allTime === false &&
        formData.value.happened.onDay === false &&
        formData.value.happened.onTimeRanger === false
      ) {
        formData.value.happened.timeRange = '';
      }
    }
  };
  const week = [
    {
      label: '周一',
      value: '1',
    },
    {
      label: '周二',
      value: '2',
    },
    {
      label: '周三',
      value: '3',
    },
    {
      label: '周四',
      value: '4',
    },
    {
      label: '周五',
      value: '5',
    },
    {
      label: '周六',
      value: '6',
    },
    {
      label: '周日',
      value: '7',
    },
  ];
  const intervalUnitList = [
    {
      label: '分钟',
      value: 'MINUTE',
    },
    {
      label: '小时',
      value: 'HOUR',
    },
    {
      label: '天',
      value: 'DAY',
    },
  ];
  const addUpgrade = () => {
    formData.value.upgrade.push({
      type: 'upgrade',
      customPerson: [],
    });
  };
  const deleteUpgrade = (index: number) => {
    formData.value.upgrade.splice(index - 1, 1);
  };

  const formRef = ref<any>(null);
  const notificationRef = ref<any>(null);
  const validate = () => {
    return new Promise((resolve) => {
      const notificationValid = notificationRef.value.map((f: any) =>
        f.validate()
      );
      Promise.all([formRef.value.validate(), ...notificationValid]).then(
        (res) => {
          resolve(res.filter((ele: any) => ele).length > 0);
        }
      );
    });
  };
  defineExpose({
    validate,
    getFormData: () => formData.value,
    getStrategyId: () => strategyId.value,
  });
</script>
<style lang="less" scoped>
  .strategy-steps-container {
    :deep(.arco-steps-icon) {
      width: 55px;
      height: 55px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    :deep(
        .arco-steps-vertical
          .arco-steps-item:not(:last-child)
          .arco-steps-item-tail
      ) {
      top: 21px;
      left: 25.5px;
    }
    .background {
      margin-bottom: 40px;
      width: 700px;
      background-color: var(--bg8);
      padding: 10px;
      border-radius: 5px;
    }
    .upgrade {
      position: relative;
      .close-icon {
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
      }
    }
  }
</style>
