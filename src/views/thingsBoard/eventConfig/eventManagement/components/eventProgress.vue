<template>
  <div class="event-progress-container">
    <a-steps key="1" type="dot" direction="vertical">
      <a-step
        :status="item.status === 'pass' ? 'finish' : 'wait'"
        v-for="item in stepList"
        :key="item.id"
      >
        <div class="header">
          <span class="title">{{ item.title }}</span>
          <span class="time">{{ item.time }}</span>
        </div>
        <div class="content" v-if="item.status === 'pass'">
          <div
            class="inner-content event-report"
            v-if="item.id === 'eventReport'"
          >
            <div class="event-info">
              <div>{{ info.eventName }}</div>
              <div>
                <span>{{ info.eventTypeName }}</span>
                <a-tag :color="info.color">{{ info.eventLevelName }}</a-tag>
              </div>
            </div>
            <div class="event-description">
              <span>{{ info.eventDesc }}</span>
            </div>
          </div>
          <div
            class="inner-content person-confirm"
            v-if="item.id === 'personConfirm'"
          >
            <div class="result">
              {{ '属实' }}
            </div>
            <div class="confirm-person-name">
              <span>确认人：</span>
              <span>{{ '方迪' }}</span>
            </div>
            <div class="remark">{{
              '人工确认备注展示,人工确认备注展示,人工确认备注展示,人工确认备注展示,人工确认备注展示'
            }}</div>
            <div class="confirm-person-image">
              <a-upload
                ref="imageRef"
                :file-list="fileList"
                :show-remove-button="false"
                :show-upload-button="false"
                list-type="picture-card"
                action="/"
                @preview="handlePreview"
              />
            </div>
          </div>
          <div
            class="inner-content event-handle"
            v-if="item.id === 'eventHandle'"
          >
            <emergencyEventProgress
              :key="info.id + record.length"
              v-if="record"
              :record="record"
              :status="status"
            />
          </div>
          <div class="inner-content event-end" v-if="item.id === 'eventEnd'">
            <div>{{ info.summary }}</div>
            <div
              v-for="(content, i) in info.summaryAgreement"
              :key="i"
              class="attachment"
            >
              <icon-attachment />
              <a @click="handlePreview(content)">{{ content.fileName }}</a>
            </div>
            <div>
              <span class="label">关闭人：</span>
              <span>{{ info.summaryUserName }}</span>
            </div>
          </div>
        </div>
      </a-step>
    </a-steps>
  </div>
</template>
<script lang="ts" setup>
  import { computed, reactive, ref, toRef } from 'vue';
  import { calculateTime, timeUnitsType } from '../composition/calculateTime';
  import { FileItem } from '@arco-design/web-vue';
  import emergencyEventProgress from './emergencyEventProgress.vue';
  const now = ref(new Date());

  const props = defineProps({
    info: {
      type: Object,
      default: () => ({}),
    },
    record: {
      type: Array,
      default: () => [],
    },
  });

  const info = toRef(props, 'info');

  const status = info.value.eventStatus === 2;
  const record = computed(() => {
    return props.record;
  });

  const stepList = reactive([
    {
      id: 'eventReport',
      title: '事件上报',
      time: computed(() =>
        calculateTime({
          now: now.value,
          time: info.value.createTime,
          leastUnit: timeUnitsType.minutes,
          status,
        })
      ),
      status: info.value.eventStatus >= 0 ? 'pass' : 'wait',
    },
    // {
    //   id: 'personConfirm',
    //   title: '人工确认',
    //   time: computed(() =>
    //     calculateTime({
    //       now: now.value,
    //       time: '2024-05-15 11:26:06',
    //       leastUnit: timeUnitsType.minutes,
    //     })
    //   ),
    //   status: 'pass',
    // },
    {
      id: 'eventHandle',
      title: '事件处置',
      time: computed(() =>
        calculateTime({
          now: now.value,
          time: info.value.disposeTime,
          leastUnit: timeUnitsType.minutes,
          status,
        })
      ),
      status: info.value.eventStatus >= 1 ? 'pass' : 'wait',
    },
    {
      id: 'eventEnd',
      title: '关闭事件',
      time: computed(() =>
        calculateTime({
          now: now.value,
          time: info.value.finishTime,
          leastUnit: timeUnitsType.minutes,
          status,
        })
      ),
      status: info.value.eventStatus >= 2 ? 'pass' : 'wait',
    },
  ]);

  if (!status) {
    setInterval(() => {
      now.value = new Date();
    }, 60 * 1000);
  }

  const fileList = ref([
    {
      uid: Math.random().toString(),
      url: 'https://fastly.picsum.photos/id/172/200/300.jpg?hmac=Z5LhQNM9g-UdcCGfryluTaIrxwIaAD_pMo_izKB2nuA',
      sourceUrl:
        'https://fastly.picsum.photos/id/172/200/300.jpg?hmac=Z5LhQNM9g-UdcCGfryluTaIrxwIaAD_pMo_izKB2nuA',
    },
  ]);
  const handlePreview = (file: any) => {
    window.open(file.filePath);
  };
</script>
<style lang="less" scoped>
  @import '/src/assets/style/mixin.less';
  .color-green {
    :deep(.arco-radio-label) {
      color: #98d87d;
    }
    &.arco-radio-checked :deep(.arco-radio-icon) {
      background-color: #98d87d;
    }
    :deep(.arco-radio-icon) {
      border-color: #98d87d;
    }
    :deep(.arco-steps-item-node) {
      background-color: #98d87d;
      border-color: #98d87d;
    }
  }
  .color-red {
    :deep(.arco-radio-label) {
      color: #f27b71;
    }
    &.arco-radio-checked :deep(.arco-radio-icon) {
      background-color: #f27b71;
    }
    :deep(.arco-radio-icon) {
      border-color: #f27b71;
    }
    :deep(.arco-steps-item-node) {
      background-color: #f27b71;
      border-color: #f27b71;
    }
  }
  .label {
    color: var(--color-text-grey1);
  }
  .time {
    color: var(--color-text-grey1);
    font-size: 12px;
  }
  .event-progress-container {
    padding: 0 20px;
    .header {
      .flex-display(space-between, center, row);
      font-size: 14px;
    }
    .content {
      width: 30vw;
      overflow: hidden;
      .inner-content {
        font-size: 14px;
        white-space: break-spaces;
        margin-bottom: 40px;
      }
      .event-report {
        background-color: var(--bg4);
        padding: 8px 16px;
        border-radius: 5px;
        .event-info {
          .flex-display(flex-start, center, row, 20px);
          & > div:nth-of-type(1) {
            font-size: 16px;
            // font-family: 'Alibaba-Medium';
          }
          & > div:nth-of-type(2) {
            .flex-display(flex-start, center, row, 5px);
          }
        }
      }
      .person-confirm {
        background-color: var(--bg4);
        padding: 8px 16px;
        border-radius: 5px;
      }
      .event-end {
        background-color: var(--bg4);
        padding: 8px 16px;
        border-radius: 5px;
        white-space: pre-wrap;
        .attachment a {
          color: #2a82e4;
          cursor: pointer;
        }
      }
    }
  }
</style>
<style lang="less">
  .emergency-modal {
    background: var(--bg2);
    border: none;
    color: #333 !important;
    .title {
      color: #333 !important;
    }
    .content {
      .emergency-info {
        .emergency-title-type {
          .plan-name {
            color: #333 !important;
          }
        }
        .emergency-filing {
          & > div {
            color: #333 !important;
          }
        }
      }
    }
    .emergency-content {
      .arco-tabs-nav-type-capsule {
        .arco-tabs-nav-tab-list {
          --color-text-2: #333 !important;
          background: none !important;
          border: 1px solid #999999 !important;
        }
        .arco-tabs-tab-active {
          background-color: transparent;
          color: #357cf0 !important;
        }
      }
      .tab-content {
        background: var(--bg2) !important;
        border: 1px solid #999999 !important;
        box-shadow: none !important;
        .attachment {
          .attachment-item {
            background: #999999 !important;
          }
        }
      }
    }
    .supplies-content .grid {
      background-color: #999999 !important;
      .label {
        color: #333 !important;
      }
    }
    .emergency-group-flex,
    .emergency-expert-team-container {
      color: #333;
    }
    .close-icon {
      color: var(--color-text-grey1);
    }
  }
</style>
