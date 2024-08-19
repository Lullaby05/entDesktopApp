<template>
  <a-modal
    v-model:visible="visible"
    :footer="false"
    simple
    width="33.18vw"
    modal-class="emergency-modal"
  >
    <div class="emergency-modal-container">
      <div class="title">
        <span>应急预案</span>
      </div>
      <div class="content">
        <div class="emergency-info">
          <div class="emergency-title-type">
            <span class="plan-name">{{ emergencyData.emergencyPlanName }}</span>
            <a-tag color="#2A82E4" class="type">{{
              emergencyData.emergencyTypeName
            }}</a-tag>
          </div>
          <div class="emergency-filing">
            <div v-if="emergencyData.recorded">
              <div class="label">备案部门：</div>
              <div class="value">{{ emergencyData.recordedDept }}</div>
            </div>
            <div v-if="emergencyData.recorded">
              <div class="label">备案号：</div>
              <div class="value">{{ emergencyData.recordedNumber }}</div>
            </div>
            <div>
              <div class="label">事故类型：</div>
              <div class="value">{{ emergencyData.eventTypeName }}</div>
            </div>
          </div>
          <div class="emergency-content">
            <div class="tabs">
              <a-tabs
                v-model:active-key="activeKey"
                type="capsule"
                :hide-content="true"
              >
                <a-tab-pane v-for="item in tabsList" :key="item.code">
                  <template #title>
                    {{ item.name }}
                  </template>
                </a-tab-pane>
              </a-tabs>
            </div>
            <div class="tab-content">
              <div class="disposal-measure" v-if="activeKey === '1'">
                {{ emergencyData.measures }}
              </div>
              <emergencyGroup :data="emergencyData" v-if="activeKey === '2'" />
              <emergencyExpertTeam
                :data="emergencyData"
                v-if="activeKey === '3'"
              />
              <emergencyResource
                :data="emergencyData"
                v-if="activeKey === '4'"
              />
              <div class="attachment" v-if="activeKey === '5'">
                <div
                  class="attachment-item"
                  v-for="item in emergencyData.agreementList"
                  :key="item.fileUrl"
                >
                  <img src="@/assets/image/attachment.png" alt="" />
                  <a
                    class="attachment-text"
                    @click="downloadFile(item.fileUrl)"
                    >{{ item.fileName.split('//')[0] }}</a
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-group" v-if="!enabled">
        <a-button size="small" @click="handleCancel">取消</a-button>
        <a-button size="small" type="primary" @click="handleOk"
          >确认启动</a-button
        >
      </div>
      <div class="close-icon" @click="handleCancel">
        <icon-close size="16" />
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
  import { detailPlanBItemAPI } from '@/api/emergency';
  import emergencyGroup from './emergencyGroup.vue';
  import emergencyExpertTeam from './emergencyExpertTeam.vue';
  import emergencyResource from './emergencyResource.vue';
  import { ref } from 'vue';
  import { startEmergencyPlan } from '@/api/thingsBoard';
  import { Message } from '@arco-design/web-vue';
  import { useThingsBoardStore } from '@/store';
  import { downloadFile } from '@/utils/utils';

  const emergencyData = ref<any>({});
  const { getEventRecordId } = useThingsBoardStore();
  const emergencyId = ref('');
  const emits = defineEmits(['success']);

  const visible = ref(false);
  const enabled = ref(false);
  const handleOk = async () => {
    const eventRecordId = getEventRecordId();
    await startEmergencyPlan({
      taskContent: emergencyId.value,
      eventRecordId,
    });
    Message.success('启动成功');
    emits('success');
    visible.value = false;
  };
  const handleCancel = () => {
    activeKey.value = '1';
    visible.value = false;
  };
  const open = async (id: string, isEnabled: boolean) => {
    visible.value = true;
    enabled.value = isEnabled;
    emergencyId.value = id;
    const { data } = await detailPlanBItemAPI({ id, flag: 1 });
    emergencyData.value = {
      ...data,
      eventTypeName: data.eventTypeName.substring(
        0,
        data.eventTypeName.length - 1
      ),
    };
  };
  defineExpose({
    open,
  });

  const activeKey = ref('1');
  const tabsList = [
    { code: '1', name: '处置措施' },
    { code: '2', name: '应急小组' },
    { code: '3', name: '应急专家队伍' },
    { code: '4', name: '应急物资' },
    { code: '5', name: '附件' },
  ];
</script>
<style lang="less" scoped>
  .emergency-modal-container {
    position: relative;
    padding: 2.14rem;
    font-size: 1rem;
    color: #ffffff;
    .title {
      font-size: 1.29rem;
      font-weight: 700;
      letter-spacing: -0.29px;
      line-height: 1.29rem;
      margin-bottom: 2.14rem;
      color: rgba(255, 255, 255, 0.9);
    }

    .close-icon {
      position: absolute;
      right: 16px;
      top: 16px;
      cursor: pointer;
    }
    .content {
      .emergency-info {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        .emergency-title-type {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1.43rem;
          .plan-name {
            font-size: 1.71rem;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 1.71rem;
            color: rgba(255, 255, 255, 1);
          }
        }
        .emergency-filing {
          display: flex;
          align-items: center;
          gap: 2.14rem;
          margin-bottom: 1.42rem;
          & > div {
            display: flex;
            align-items: center;
            font-size: 0.86rem;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 0.86rem;
            color: rgba(255, 255, 255, 1);
          }
        }
      }
    }
    .emergency-content {
      :deep(.arco-tabs-nav-type-capsule) {
        .arco-tabs-nav-tab-list {
          padding: 0.86rem 0.36rem;
          font-family: 'Alibaba-Medium';
          background: linear-gradient(
            180deg,
            #043c95 0%,
            #042144 14.22%,
            #001540 51.46%,
            #072d5e 87.86%,
            #043e97 100%
          );
          border: 0.5px solid #3061db;
          font-weight: 700;
          letter-spacing: -0.29px;
          --color-text-2: rgba(230, 247, 255, 1);
          .arco-tabs-tab {
            font-size: 1.14rem;
            line-height: 1.14rem;
            padding: 0 1.07rem;
          }
          .arco-tabs-tab:hover {
            background-color: transparent;
            font-weight: 700;
          }
        }
        .arco-tabs-nav-tab:not(.arco-tabs-nav-tab-scroll) {
          justify-content: flex-start;
        }
        .arco-tabs-tab-active {
          background-color: transparent;
          color: #30c9c9;
          font-weight: 700;
          &::before {
            opacity: 1;
          }
        }
        .arco-tabs-tab-active + .arco-tabs-tab::before {
          opacity: 1;
        }
      }
      .tab-content {
        margin-top: 0.36rem;
        width: 100%;
        height: 34.54vh;
        padding: 1.43rem;
        overflow: auto;
        border-radius: 4px;
        background: #040e3d;
        border: 0.5px solid #3061db;
        box-shadow: 0px 0px 3px #03fff6;
        .disposal-measure {
          height: 100%;
          overflow-y: auto;
          white-space: pre-wrap;
          word-break: break-all;
        }
        .attachment {
          color: #ffffff;
          display: flex;
          flex-direction: column;
          gap: 0.36rem;
          .attachment-item {
            display: flex;
            align-items: center;
            gap: 1.57rem;
            background: #0a1454;
            padding: 0.64rem 1.57rem;
            img {
              width: 1rem;
              height: 1rem;
            }
            .attachment-text {
              cursor: pointer;
              font-size: 0.86rem;
            }
          }
        }
      }
    }
    .btn-group {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1rem;
      gap: 1rem;
      button {
        font-size: 1rem;
      }
    }
  }
</style>
<style lang="less">
  .emergency-modal {
    padding: 0;
    border-radius: 4px;
    background: rgba(4, 14, 61, 0.9);
    border: 0.5px solid rgba(48, 97, 219, 1);
    box-shadow: 0px 0px 3px rgba(3, 255, 246, 0.34);
    .arco-modal-header {
      margin: 0;
    }
  }
</style>
