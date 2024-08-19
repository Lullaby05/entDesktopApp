<template>
  <div class="form-render-container">
    <div>
      <formRenderContent
        ref="formRender"
        v-if="
          formDesign &&
          ((formContentVisible && status === 'detail') ||
            (currentProcess && status === 'edit'))
        "
        class="operation-apply-form"
        :design="formDesign"
        :status="status"
      />
      <div
        class="no-form-data"
        v-if="formDesign && !formContentVisible && status === 'detail'"
      >
        {{ personInfo.name }}进行中，暂无相关信息
      </div>
    </div>
    <div class="audit-form">
      <auditForm
        v-if="currentProcess"
        :taskId="currentProcess.taskId"
        :needCheckSign="true"
        ref="audtiForm"
        v-model:auditFormData="auditFormData"
        status="edit"
        :text="props.text"
      />
      <div v-else class="audit-content">
        <div
          class="table-item"
          v-for="(item, index) in tempData[0].tableData"
          :key="index"
        >
          <div class="info-header">
            <div class="info-num">{{ index + 1 }}</div>
            <div class="flex">
              <div class="audit-person">
                <span> {{ item.round }}</span>
                <span> {{ item.deptName }}</span>
              </div>
            </div>
          </div>
          <div class="detail-content">
            <div class="no-data"> 待签署 </div>
          </div>
        </div>
      </div>
    </div>
    <div class="audit-form-container">
      <div
        class="audit-form-container-item"
        v-if="formProcessData.length"
        v-for="(item, index) in formProcessData"
        :key="index"
      >
        <div class="audit-item-title">
          <!-- <a-divider direction="vertical" :size="6" /> -->
          <span class="audit-item-title-text">{{
            '第' + (formProcessData.length - index) + '次核查结果'
          }}</span>
        </div>
        <div class="audit-content">
          <auditForm
            v-model:auditFormData="item.auditFormData"
            status="detail"
            :text="props.text"
            :needTable="true"
          />
        </div>
      </div>
    </div>
    <div class="operation-apply-form-btn">
      <a-button
        v-for="item in buttonList"
        v-permission="item.permission"
        :key="item.key"
        :type="item.type || 'primary'"
        :status="item.status || ''"
        @click="handleButtonClick(item.key)"
      >
        {{ item.text }}
      </a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { useSafetyCertificationStore, useUserStore } from '@/store';
  import { normalOperation } from '@/api/operation/operationApi';
  import auditForm from '../components/auditForm.vue';
  import {
    blindPlateStatusEnum,
    fireStatusEnum,
    operationTypeEnum,
  } from '../composition/useCertificateDict';
  import formRenderContent from './formRenderContent.vue';
  import { Message } from '@arco-design/web-vue';
  import { useCertificate } from '../composition/useCertificate';

  const props = defineProps({
    originalProgress: {
      type: Array,
      retuqired: true,
    },
    formProcessData: {
      type: Object,
      required: true,
    },
    activeKey: {
      type: String,
      required: true,
    },
    certificateStatus: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '核查',
    },
    id: {
      type: String,
      required: true,
    },
  });
  const router = useRouter();
  const userStore = useUserStore();
  const formRender = ref<any>(null);
  const audtiForm = ref<any>(null);

  const emits = defineEmits(['initData']);

  const allCurrentProcess: any[] = [];
  for (let i = props.formProcessData.progress.length - 1; i >= 0; i--) {
    const ele = props.formProcessData.progress[i];
    // 只获取同一个流程节点的审批信息，startTime和nodeId相同的即为同一个流程节点
    if (ele.processKey === 'siteCheck') {
      if (!allCurrentProcess.length) {
        // 里面没数据的时候直接放进去
        allCurrentProcess.push(ele);
      } else {
        // 里面有数据的话就要判断当前遍历数据的startTime和nodeId是否与已有的数据相同，不同则说明是上一次审批的结果，直接break
        if (
          ele.startTime === allCurrentProcess[0].startTime &&
          ele.nodeId === allCurrentProcess[0].nodeId
        ) {
          allCurrentProcess.push(ele);
        } else {
          break;
        }
      }
    }
  }

  //@ts-ignore
  const personInfoIndex = (props.originalProgress as any[]).findLastIndex(
    (item: any) => item.props.processKey === 'siteCheck'
  );
  const personInfo: any = (props.originalProgress as any[])[personInfoIndex];

  const personFieldObj = {
    ASSIGN_USER: 'assignedUser',
    FORM_USER: 'formUser',
    ASSIGN_DEPT: 'assignedDept',
    FORM_DEPT: 'formDept',
  };

  const personField =
    personFieldObj[
      personInfo.props.assignedType as keyof typeof personFieldObj
    ];
  let tempArr: any[] = [];
  // 如果是form则需要去formData取数据，否则直接从对应字段取
  const formPersonReg = /form/;
  if (formPersonReg.test(personField)) {
    // 表单字段
    personInfo.props[personField].forEach((ele: any) => {
      tempArr = Array.from(
        new Set([...tempArr, ...props.formProcessData.formData[ele]])
      );
    });
  } else {
    tempArr = personInfo.props[personField];
  }
  const personArr = ref<any[]>(tempArr);

  // 获取processKey为安全交底的，并且处理人为登陆人，并且未评审的，如果为空则说明登陆人不是操作人，显示detail页面
  const currentProcess = computed<any>(() => {
    // 只找最近的一个processKey为siteCheck的
    if (!allCurrentProcess.length) return false;
    const approvalMode = allCurrentProcess[0].approvalMode;
    if (approvalMode === 'OR') {
      if (allCurrentProcess.some((ele) => ele.result === 'agree')) return false;
    }
    if (allCurrentProcess.some((ele) => ele.result === 'refuse')) return false; // 有任何一个拒绝了则不能编辑
    for (let i = allCurrentProcess.length - 1; i >= 0; i--) {
      const item = allCurrentProcess[i];
      if (item.processKey === 'siteCheck') {
        if (item.user.id == userStore.enterPriseUserId && !item.result) {
          return item;
        }
        if (
          allCurrentProcess[i - 1] &&
          allCurrentProcess[i - 1].processKey !== 'siteCheck'
        ) {
          return false;
        }
      }
    }
    return false;
  });

  const { searchFormItem } = useCertificate();
  const formDesign: any = computed(() => {
    return searchFormItem(props.formProcessData, props.activeKey);
  });
  const formItemIds: string[] = formDesign.value
    ? formDesign.value.formItems.map((item: any) => item.id)
    : [];
  const formContentVisible = computed(() => {
    return formItemIds.some(
      // 有数据或者当前需要处理才显示
      (ele: any) => formDesign.value.formData[ele] || currentProcess.value
    );
  });

  // 审核相关表单
  const auditFormData = ref<any>({
    result: '',
    signature: '',
    imageFile: [],
    uploadFile: [],
    remark: '',
  });

  const formProcessData = ref<any[]>([]);

  // 找到所有的一条现场核查节点的数据
  const tempProgress = props.formProcessData.progress;
  const processData: any[] = [];
  for (let i = 0; i < tempProgress.length; i++) {
    if (tempProgress[i].processKey === 'siteCheck' && tempProgress[i].result) {
      processData.push(tempProgress[i]);
    }
  }

  const store = useSafetyCertificationStore();

  // 只有待安全交底中并且需要他签名的情况才可以编辑
  const status = computed<string>(() => {
    let condition: boolean = false;
    if (store.needAnalysis) {
      condition = props.certificateStatus === fireStatusEnum.现场核查中;
    } else {
      condition = props.certificateStatus === blindPlateStatusEnum.现场核查中;
    }
    if (condition && currentProcess.value) {
      return 'edit';
    }
    return 'detail';
  });

  const delIndex: number[] = [];
  formProcessData.value = processData.map((item: any, index: number) => {
    // 正常情况
    const auditFormData: any[] = [
      {
        result: item.result === 'agree' ? '同意' : '不同意',
        signature: item.signature,
        remark: item.comment.length ? item.comment[0].text : '',
        createTime: item.finishTime,
        round: item.user.name,
      },
    ];
    // 特殊情况会有一个两个人同时签字才能走到下一步，这时候流程节点的nodeId和startTime相同
    const otherData = [];
    for (let i = index + 1; i < processData.length; i++) {
      if (
        processData[i].nodeId === item.nodeId &&
        processData[i].startTime === item.startTime
      ) {
        delIndex.push(i);
        otherData.push({
          result: processData[i].result === 'agree' ? '同意' : '不同意',
          signature: processData[i].signature,
          remark: processData[i].comment.length
            ? processData[i].comment[0].text
            : '',
          createTime: processData[i].finishTime,
          round: processData[i].user.name,
        });
      }
    }
    return {
      auditFormData: [...auditFormData, ...otherData],
    };
  });
  if (delIndex.length) {
    formProcessData.value = formProcessData.value.filter(
      (ele: any, i: number) => delIndex.indexOf(i) === -1
    );
  }
  formProcessData.value.reverse();

  // 没有数据的时候展示的临时数据
  const tempData = ref<any[]>([{}]);
  if (!formProcessData.value.length) {
    tempData.value[0].tableData = personArr.value.map((item: any) => {
      return {
        createTime: '',
        result: '',
        round: item.name,
        resultCode: 0,
        deptName: '',
      };
    });
  }

  // 根据当前的作业证状态判断显示什么按钮
  const buttonList = computed<any>(() => {
    if (store.needAnalysis) {
      switch (props.certificateStatus as fireStatusEnum) {
        case fireStatusEnum.现场核查中: {
          if (currentProcess.value && !props.formProcessData.isTimeout) {
            return [
              {
                key: 'operationAnalyze',
                text: '确定',
                type: 'primary',
                permission: store.currentOperationTypeName + 'SiteCheck',
              },
            ];
          }
        }
      }
    } else {
      switch (props.certificateStatus as blindPlateStatusEnum) {
        case blindPlateStatusEnum.现场核查中: {
          if (currentProcess.value && !props.formProcessData.isTimeout) {
            return [
              {
                key: 'operationAnalyze',
                text: '确定',
                type: 'primary',
                permission: store.currentOperationTypeName + 'SiteCheck',
              },
            ];
          }
        }
      }
    }
  });

  const submitForm = async (formData: any) => {
    const imgAttach = auditFormData.value.imageFile.map((ele: any) => ({
      name: ele.name,
      url: ele.url,
      isImage: true,
    }));
    const fileAttach = auditFormData.value.uploadFile.map((ele: any) => ({
      name: ele.name,
      url: ele.url,
      isImage: false,
    }));
    // todo 校验formData，并且把自己部分的formData提交
    const params = {
      action: auditFormData.value.result === '1' ? 'agree' : 'refuse',
      comment: {
        text: auditFormData.value.remark,
        attachments: [...imgAttach, ...fileAttach],
      },
      signature: auditFormData.value.signature,
      instanceId: props.formProcessData.instanceId,
      formData,
      // 看当前节点是不是常规节点，需要传过去更新状态
      processKey: currentProcess.value.processKey || '',
      taskId: currentProcess.value.taskId,
      nodeId: currentProcess.value.nodeId,
      updateSign: true,
    };
    await normalOperation(props.id, params);
    Message.success({
      content: '操作成功',
      onClose() {
        router.back();
      },
    });
  };

  // 点击按钮处理
  const handleButtonClick = async (key: string) => {
    if (key === 'operationAnalyze') {
      const result = await audtiForm.value.validate();
      if (!result) {
        if (formDesign.value) {
          formRender.value.handleSave(async (formData: any) => {
            const paramsFormData: any = {};
            formItemIds.forEach((item: string) => {
              paramsFormData[item] = formData[item];
            });
            submitForm(paramsFormData);
          });
        } else {
          submitForm({});
        }
      }
    }
  };
</script>
<style lang="less" scoped>
  .form-render-container {
    display: flex;
    flex-direction: column;
    .process-form {
      & > div {
        padding: 0 10px;
      }

      .el-form-item__label {
        min-width: 120px;
        justify-content: flex-end;
      }
    }
  }

  .operation-apply-form {
    flex-basis: 90%;
    padding-right: 20px;
  }

  .no-form-data {
    text-align: center;
    background-color: var(--bg2);
    line-height: 100px;
    height: 100px;
    margin-top: 5px;
  }

  .operation-apply-form-btn {
    flex: 1;
    justify-content: center;
    display: flex;
    text-align: center;
    .arco-btn {
      border-radius: 4px;
    }
    button + button {
      margin-left: 12px;
    }
  }

  :deep(.audit-part .arco-col.arco-form-item-label-col) {
    flex: 0 0 160px;
  }

  .audit-form-container-item {
    padding-bottom: 20px;
    .audit-item-title {
      padding-bottom: 20px;
      line-height: 28px;
      display: flex;
      align-items: center;
      .arco-divider-vertical {
        margin-right: 4px;
        border-left: 1px solid #409eff;
      }
      .audit-item-title-text {
        font-weight: bold;
        color: var(--color-text-grey1);
      }
    }
  }
  :deep(.process-form) {
    .el-form-item__label {
      width: 160px !important;
    }
  }

  .audit-form-container {
    padding: 0 50px 0 30px;
    .audit-content {
      width: calc(100% - 125px);
      display: block;
      margin-left: auto;
    }
  }
  .table-item {
    width: 50%;
    margin: 0 auto;
    padding: 14px 16px 16px 16px;
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-direction: column;
    overflow: hidden;
    gap: 20px;
    position: relative;
    .info-header {
      flex: 0 0 auto;
      display: flex;
      align-items: center;
      .audit-person {
        span:nth-child(1) {
          font-family: 'Alibaba-Medium';
          font-size: 14px;
          color: var(--color-text-black);
        }
        span:nth-child(2) {
          color: var(--color-text-2);
          font-weight: 400;
          font-size: 12px;
        }
        span + span {
          margin-left: 10px;
        }
      }
      .info-num {
        background-color: #357cf0;
        width: 18px;
        height: 18px;
        border-radius: 50%;
        color: #ffffff;
        text-align: center;
        font-size: 12px;
        margin-right: 5px;
        line-height: 18px;
      }
    }
    .detail-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 5px;
      width: 100%;
    }
    .no-data {
      text-align: center;
      background: #f5f7fa;
      border: 1px solid #e5e5e5;
      color: #4e5969;
      font-size: 14px;
      padding: 41px 0;
    }
  }
  .table-item + .table-item {
    margin-top: 10px;
  }
</style>
