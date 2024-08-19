<template>
  <div class="emergency-event-progress">
    <div class="filter">
      <span class="label">筛选展示节点</span>
      <a-radio-group v-model="filterData">
        <a-radio value="all">全部</a-radio>
        <a-radio :value="2" class="color-red">现场情况</a-radio>
        <a-radio :value="1" class="color-green">处置任务</a-radio>
      </a-radio-group>
    </div>
    <div class="inner-steps">
      <a-steps type="dot" direction="vertical">
        <a-step
          status="finish"
          v-for="ele in innerTabList"
          :key="ele.id"
          :class="[1, 3].includes(ele.taskType) ? 'color-green' : 'color-red'"
        >
          <div class="header">
            <div class="person-info">
              <span class="person-name">{{ ele.creator }}</span>
              <a-tag class="dept" bordered>{{ ele.DeptName }}</a-tag>
            </div>
            <a-tag
              :color="[1, 3].includes(ele.taskType) ? '#43CF7C' : '#f27b71'"
              class="title"
              >{{ ele.taskTypeName }}</a-tag
            >
            <span class="time">{{ ele.time }}</span>
          </div>
          <div class="content-items">
            <div
              class="content-item"
              v-for="(content, i) in ele.content"
              :key="i"
            >
              <div class="label" v-if="content.label">{{
                content.label + '：'
              }}</div>
              <div class="value">
                <div v-if="content.type === 'image'" class="image">
                  <a-upload
                    ref="imageRef"
                    :file-list="content.value"
                    :show-remove-button="false"
                    :show-upload-button="false"
                    list-type="picture-card"
                    action="/"
                    @preview="handlePreview"
                  />
                </div>
                <div
                  class="emergency-plan"
                  v-else-if="content.type === 'emergencyPlan'"
                >
                  <span @click="openEmergencyModal(content.id)">{{
                    content.value
                  }}</span>
                </div>
                <div
                  v-else-if="content.type === 'attachment'"
                  class="attachment"
                >
                  <div
                    style="display: flex; gap: 0.5rem"
                    v-for="attach in content.value"
                  >
                    <icon-attachment />
                    <a @click="handlePreview(attach)">{{ attach.fileName }}</a>
                  </div>
                </div>
                <div v-else>{{ content.value }}</div>
              </div>
            </div>
            <div
              class="finish-items"
              v-for="task in ele.taskOperationHistory"
              :key="task.id"
            >
              <div class="content-item">
                <div class="label">完成人：</div>
                <div class="value">{{ task.operationName }}</div>
              </div>
              <div class="content-item">
                <div class="label">完成情况：</div>
                <div class="value">{{ task.operationContent }}</div>
              </div>
              <div class="content-item">
                <div class="value image">
                  <a-upload
                    :file-list="task.operationAgreement.map((ele: any) => ({...ele, url: ele.fileType === 'video' ? ele.coverUrl : ele.filePath}))"
                    :show-remove-button="false"
                    :show-upload-button="false"
                    list-type="picture-card"
                    action="/"
                    @preview="handlePreview"
                  />
                </div>
              </div>
              <div class="content-item">
                <div class="label">完成时间：</div>
                <div class="value">{{ task.operationTime }}</div>
              </div>
            </div>
          </div>
        </a-step>
      </a-steps>
    </div>
    <emergencyModal ref="emergencyModalRef" />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { useEventHandleTabs } from '../composition/useEventHanleTabs';
  import emergencyModal from '@/views/thingsBoard/monitoringDataScreen/components/emergencyModal.vue';
  const props = defineProps({
    record: {
      type: Array,
      require: true,
    },
    status: {
      type: Boolean,
      default: false,
    },
  });
  const tableList = ref(props.record);
  const { tabList: innerTabList, filterData } = useEventHandleTabs(
    tableList,
    props.status
  );
  const handlePreview = (file: any) => {
    window.open(file.filePath);
  };

  const emergencyModalRef = ref<InstanceType<typeof emergencyModal> | null>(
    null
  );
  const openEmergencyModal = (id: string) => {
    emergencyModalRef.value?.open(id, true);
  };
</script>
<style lang="less" scoped>
  @import '/src/assets/style/mixin.less';
  :deep(.arco-radio) {
    font-size: 1rem;
  }
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
    font-size: 1rem;
  }
  .time {
    color: var(--color-text-grey1);
    font-size: 0.8rem;
  }
  .attachment a {
    color: #2a82e4;
    cursor: pointer;
    line-height: 1.5;
    font-size: 1rem;
  }
  .image {
    :deep(.arco-upload-list.arco-upload-list-type-picture-card) {
      gap: 0.5rem;
    }
  }
  .emergency-event-progress {
    line-height: 1;
    font-size: 1rem;
    .filter {
      .flex-display(flex-start, center, row, 0.6rem);
      margin-bottom: 10px;
      line-height: 2;
    }
    .inner-steps {
      padding-left: 2px;
      width: 100%;
      :deep(.arco-steps-item .arco-steps-item-content) {
        width: 100%;
        .arco-steps-item-title {
          width: 100%;
        }
      }
      :deep(.arco-steps-item):nth-last-child(1) .arco-steps-item-tail {
        display: none;
      }
      :deep(.arco-steps-mode-dot .arco-steps-item:last-child) {
        margin-right: 16px;
      }
      :deep(.arco-steps-item-tail) {
        --primary-6: 42, 130, 228;
      }
      .header {
        width: 100%;
        margin-bottom: 6px;
        .flex-display(space-between, center, row);
        .person-info {
          display: flex;
          align-items: center;
        }
        .title {
          font-family: 'Alibaba-Medium';
          color: var(--color-text-black);
        }
        .dept {
          margin-left: 10px;
        }
      }
      .content-items,
      .finish-items {
        width: 100%;
        background-color: var(--bg4);
        padding: 8px 16px;
        border-radius: 5px;
        font-size: 1rem;
        margin-bottom: 10px;
        .content-item {
          .flex-display(flex-start, flex-start, row, 0);
          overflow: hidden;
          white-space: break-spaces;
          :deep(.arco-upload-list-picture) {
            margin: 0;
          }
          .label {
            flex: 0 0 auto;
          }
          .value {
            width: 100%;
            overflow-wrap: break-word;
            white-space: break-spaces;
            word-wrap: break-word;
          }
          .emergency-plan {
            cursor: pointer;
            color: rgb(42, 130, 228);
          }
        }
      }
      .content-item + .finish-items {
        margin-top: 10px;
      }
    }
  }
</style>
