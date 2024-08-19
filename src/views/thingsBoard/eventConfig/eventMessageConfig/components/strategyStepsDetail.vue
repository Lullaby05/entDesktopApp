<template>
  <div class="strategy-steps-container">
    <a-form disabled :model="formData">
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
              每隔{{ formData.happened.interval
              }}{{ formData.happened.intervalUnitName }}告警1次，最多告警{{
                formData.happened.maxTimes
              }}次。告警将以以下方式通知
            </div>
            <notificationPerson
              type="detail"
              :notification-method-list="notificationMethodList"
              :dept-data="deptData"
              :formData="formData.happened"
            />
          </div>
          <div v-if="item.id === 'upgrade'">
            <div class="background upgrade">
              <div style="margin-bottom: 10px">
                超过{{ formData.upgrade[index - 1].upgradeInterval
                }}{{
                  formData.upgrade[index - 1].upgradeIntervalUnitName
                }}告警未被处置，告警将自动升级为如下环节
              </div>
              <div>
                每隔{{ formData.upgrade[index - 1].interval
                }}{{
                  formData.upgrade[index - 1].intervalUnitName
                }}告警1次，最多告警{{
                  formData.upgrade[index - 1].maxTimes
                }}次。告警将以以下方式通知
              </div>
              <notificationPerson
                type="detail"
                :notification-method-list="notificationMethodList"
                :dept-data="deptData"
                :formData="formData.upgrade[index - 1]"
              />
            </div>
          </div>
          <div class="background recover" v-if="item.id === 'recover'">
            <div> 告警恢复时，消息将以以下方式通知</div>
            <notificationPerson
              type="detail"
              :notification-method-list="notificationMethodList"
              :dept-data="deptData"
              :formData="formData.recover"
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
  import { useSearch } from '@/views/pitfall/snapshot/composition/useSearch';
  import { formatDate } from '@/utils/utils';
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

  const { deptData } = useSearch(['deptData']);
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

  const { getResParams } = useStrategy();
  const getDetail = async () => {
    const req = props.id ? getConfigById : getDefaultConfig;
    const params = {
      eventProfileId: props.id,
    };
    const { data } = await req(params);
    formData.value = getResParams(data);
  };
  getDetail();
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
