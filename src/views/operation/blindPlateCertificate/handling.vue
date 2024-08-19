<template>
  <div class="container">
    <div class="header">
      <certificateHeader
        title="盲板抽堵安全作业证"
        :status="(statusName as string)"
        :id="(id as string)"
        print-url="BlindPlateCertificateDetail"
      />
    </div>
    <div class="process">
      <div class="process-content">
        <processCertificate
          v-if="processList.length"
          :key="initComopnent"
          :processList="processList"
          :dataProcess="dataProcess"
          :certificateStatus="(status as string)"
        />
      </div>
    </div>
    <div class="content">
      <div class="tabs">
        <a-tabs
          v-model:active-key="activeKey"
          type="card-gutter"
          :hide-content="true"
        >
          <a-tab-pane
            v-for="item in tabLists"
            :key="item.code"
            :title="item.name"
          >
          </a-tab-pane>
        </a-tabs>
      </div>
      <div class="tabs-content">
        <basicInfo
          v-if="activeKey === 'apply'"
          :form-process-data="formProcessData"
          :key="initComopnent"
          :active-key="activeKey"
          :currentStep="currentStep"
          :certificateStatus="(status as string)"
          :applyUserId="(applyUserId as string)"
          :id="(id as string)"
        />
        <writtenExaminationInfo
          v-if="activeKey === 'review'"
          :original-progress="processList"
          :form-process-data="formProcessData"
          :key="initComopnent"
          :active-key="activeKey"
          :id="(id as string)"
          :certificateStatus="(status as string)"
          @initData="initData"
        />
        <siteVerificationInfo
          v-if="activeKey === 'siteCheck'"
          :original-progress="processList"
          :form-process-data="formProcessData"
          :key="initComopnent"
          :active-key="activeKey"
          :id="(id as string)"
          :certificateStatus="(status as string)"
          @initData="initData"
        />
        <securityDisclosureInfo
          v-if="activeKey === 'safeDisclosure'"
          :original-progress="processList"
          :form-process-data="formProcessData"
          :key="initComopnent"
          :active-key="activeKey"
          :id="(id as string)"
          :certificateStatus="(status as string)"
          @initData="initData"
        />
        <closeInfo
          v-if="['acceptance','operationClose'].includes(activeKey as string)"
          :close-desc="closeDesc"
          :original-progress="processList"
          :form-process-data="formProcessData"
          :key="initComopnent"
          :active-key="(activeKey as string)"
          :certificateStatus="(status as string)"
          :id="(id as string)"
          @initData="initData"
        />
        <previewCertificate
          v-if="activeKey === 'operationPreview'"
          :form-process-data="formProcessData"
          :key="initComopnent"
          status="preview"
          :certificateStatus="(status as string)"
          :id="(id as string)"
          :guardianUserId="(guardianUserId as string)"
          :current-step="currentStep"
          @initData="initData"
        />
        <progress-content
          v-if="activeKey === 'operationProgress'"
          :form-process-data="dataProcess"
          :current-step="currentStep"
          :certificateStatus="(status as string)"
        />
        <pauseInfo
          v-if="activeKey === 'operationPause'"
          :form-process-data="formProcessData"
          :key="initComopnent"
          :id="(id as string)"
          :current-step="currentStep"
          :certificateStatus="(status as string)"
          :guardianUserId="(guardianUserId as string)"
          @initData="initData"
        />
        <div
          v-for="item in processList.filter((ele: any) => ele.props.processKey && ele.props.processKey.includes('extraNode'))"
          :key="item.props.processKey"
        >
          <extraNodeInfo
            v-if="activeKey === item.props.processKey"
            :original-progress="processList"
            :form-process-data="formProcessData"
            :key="initComopnent"
            :active-key="(activeKey as string)"
            :id="(id as string)"
            :certificateStatus="(status as string)"
            @initData="initData"
          />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router';
  import basicInfo from '../components/basicInfo.vue';
  import writtenExaminationInfo from '../components/writtenExaminationInfo.vue';
  import siteVerificationInfo from '../components/siteVerificationInfo.vue';
  import securityDisclosureInfo from '../components/securityDisclosure.vue';
  import extraNodeInfo from '../components/extraNodeInfo.vue';
  import pauseInfo from '../components/pauseInfo.vue';
  import closeInfo from '../components/closeInfo.vue';
  import processCertificate from '../components/processCertificate.vue';
  import certificateHeader from '../components/certificateHeader.vue';
  import progressContent from '../components/progressContent.vue';
  import previewCertificate from '../components/previewCertificate.vue';
  import { ref } from 'vue';
  import { onBeforeMount } from 'vue';
  import {
    getCertificateDetail,
    getProcessKeyEnum,
  } from '@/api/operation/operationApi';
  import { useUserStore } from '@/store';
  import {
    blindPlateStatusEnum,
    operationTypeEnum,
  } from '../composition/useCertificateDict';
  import { formatDate } from '@/utils/utils';
  import { cloneDeep } from 'lodash';

  const router = useRouter();
  const route = useRoute();
  const userStore = useUserStore();

  // guardianUserId 作业监护人Id
  const { id, guardianUserId, applyUserId } = route.query;

  const activeKey = ref<string>();

  const processKey = ref<object>({});
  const processList = ref<any[]>([]);
  const formProcessData = ref<any>({});
  let statusName = ref<string>('');
  let status = ref<string>('');
  let currentStep = ref<number>(0);
  const initComopnent = ref<number>(1);
  let dataProcess = ref<any>({});
  const closeDesc = ref<string>('');

  const tabLists = ref<any>([]);

  // 根据状态判断当前应该显示哪个activeKey
  const statusToKey: any = {
    [blindPlateStatusEnum.已撤回]: 'apply',
    [blindPlateStatusEnum.书面审核中]: 'review',
    [blindPlateStatusEnum.书面审核不通过]: 'apply',
    [blindPlateStatusEnum.现场核查中]: 'siteCheck',
    [blindPlateStatusEnum.现场核查不通过]: 'siteCheck',
    [blindPlateStatusEnum.安全交底中]: 'safeDisclosure',
    [blindPlateStatusEnum.已安全交底]: 'safeDisclosure',
    [blindPlateStatusEnum.作业中]: 'operationPreview',
    [blindPlateStatusEnum.作业暂停]: 'operationPause',
    [blindPlateStatusEnum.已关闭]: 'acceptance',
  };

  onBeforeMount(async () => {
    initData();
  });

  // 是否有关闭信息
  const closeVisible = ref<boolean>(false);

  const initData = async () => {
    const { data } = await getCertificateDetail(id as string);
    processList.value = data.originalProgress.map((ele: any) => {
      return {
        ...ele,
        props: {
          ...ele.props,
          processKey: ele.props.processKey || 'extraNode_' + ele.id,
        },
      };
    });
    formProcessData.value = {
      ...data.processProgress,
      isTimeout: data.timeStatus,
    };
    const tempProgress = data.processProgress.progress.map((ele: any) => {
      const processKey = ele.processKey
        ? ele.processKey
        : ele.operationType
        ? undefined
        : 'extraNode_' + ele.nodeId;
      return {
        ...ele,
        finishTime: ele.finishTime && formatDate(ele.finishTime),
        startTime: ele.startTime && formatDate(ele.startTime),
        processKey,
      };
    });
    dataProcess.value = cloneDeep({
      ...data.processProgress,
      progress: tempProgress,
    });
    formProcessData.value.progress = tempProgress;
    status.value = data.status;
    statusName.value = data.statusName;
    closeDesc.value = data.closeDesc;
    // 获取数据
    processKey.value = (
      await getProcessKeyEnum(operationTypeEnum.BLINDPLATE)
    ).data;
    let lastProgress: any = {};
    // 如果最后一个节点没有processKey，则获取为倒数第二个节点
    const tempLast = tempProgress[tempProgress.length - 1];
    if (tempLast.processKey === undefined) {
      const lastIndex = tempProgress.findLastIndex(
        (ele: any) => ele.processKey
      );
      lastProgress = tempProgress[lastIndex];
    } else if (tempLast.processKey === 'apply') {
      const lastIndex = tempProgress.findLastIndex((ele: any) => ele.result);
      lastProgress = tempProgress[lastIndex];
    } else {
      lastProgress = tempLast;
    }
    closeVisible.value = formProcessData.value.progress.some((ele: any) => {
      return ele.operationType === 'close' || ele.operationType === 'cancel';
    });
    // 如果processKey为空字符串则为额外节点
    if (lastProgress.processKey === 'apply') {
      activeKey.value = 'apply';
    } else if (closeVisible.value) {
      activeKey.value = 'operationClose';
    } else {
      activeKey.value = !lastProgress.processKey.includes('extraNode')
        ? statusToKey[status.value as string]
        : 'extraNode_' + lastProgress.nodeId;
    }
    currentStep.value =
      data.originalProgress.findIndex(
        (ele: any) => ele.id === lastProgress.nodeId
      ) + 1;
    handleTabList();
    initComopnent.value++;
  };

  // 要根据当前的状态、登陆人判断应该显示哪些tab，以及首先显示哪个tab
  const handleTabList = () => {
    // 是否有暂停信息
    const pauseVisible: boolean = formProcessData.value.progress.some(
      (ele: any) => {
        return ele.operationType === 'pause';
      }
    );
    const tempTab: any[] = [
      {
        code: 'operationPreview',
        name: '作业预览信息',
        visible: (status.value as string) >= blindPlateStatusEnum.已安全交底,
      }, // 盲板抽堵的预览信息包括了开始作业，所以需要在已安全交底的时候就展示
      {
        code: 'operationPause',
        name: '作业暂停信息',
        visible:
          (status.value as string) > blindPlateStatusEnum.已安全交底 &&
          pauseVisible,
      }, // 暂停信息在作业暂停或作业中都会有
      {
        code: 'operationClose',
        name: '作业关闭信息',
        visible: closeVisible.value,
      }, // 作业异常关闭情况
    ].filter((ele: any) => ele.visible);
    const tempTabList: any[] = processList.value
      .slice(0, currentStep.value) //只截取从一开始到当前节点的tab页，其他不展示
      .filter((item: any) => item.props.processKey !== 'operationStart'); //特殊处理，盲板抽堵的作业实施tab不需要显示;
    if (status.value === blindPlateStatusEnum.作业暂停) {
      tempTabList.splice(tempTabList.length - 1, 1);
    }
    tabLists.value = tempTabList
      .map((ele: any) => {
        return {
          code: ele.props.processKey || 'extraNode_' + ele.id, // 必要流程必须有processKey，如果没有则为额外节点，额外节点的key默认为nodeId
          name: ele.name + '信息',
        };
      })
      .concat(tempTab)
      .concat([
        { code: 'operationProgress', name: '作业进程信息' }, // 进程信息默认都会有
      ]);
  };
</script>
<style lang="less" scoped>
  .container {
    width: 100%;

    .process {
      width: 100%;
      margin-top: 20px;
      border-radius: 10px;
      height: 150px;
      background-color: var(--bg2);
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-start;
      overflow-x: auto;
    }

    .content {
      margin-top: 20px;

      .tabs {
        :deep(.arco-tabs-tab.arco-tabs-tab-active) {
          color: #ffffff;
          background-color: #409eff;
          border: 1px solid #409eff;
          border-bottom: none;
        }

        :deep(.arco-tabs-nav::before) {
          height: 0px !important; // 去掉底部border
        }
        :deep(.arco-tabs-tab) {
          margin: 0;
          background-color: var(--bg2);
          border: 1px solid var(--color-border);
          // border-bottom: none;
        }
      }

      .tabs-content {
        padding: 20px 10px;
        width: 100%;
        min-height: 1000px;
        background-color: var(--bg2);
        position: relative;
        // border: 1px solid var(--color-text-grey);
        .form-render-container {
          :deep(.el-form-item__label) {
            color: #808080bf;
          }
        }
      }
    }
  }
</style>
