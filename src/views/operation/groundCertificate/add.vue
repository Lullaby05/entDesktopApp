<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="router.back()" /><span class="title"
          >{{ type === 'edit' ? '编辑' : '新增' }}动土安全作业证</span
        >
      </div>
      <div class="add-form-render-container">
        <formRenderContent
          ref="addFormRender"
          v-if="design"
          class="form-render-content"
          :design="design"
          status="edit"
        />
        <div class="form-render-btns">
          <a-button @click="router.back()">取消</a-button>
          <a-button type="primary" @click="handleAddCertification"
            >保存</a-button
          >
        </div>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router';
  import formRenderContent from '../components/formRenderContent.vue';
  import { onBeforeMount, ref } from 'vue';
  import { useCertificate } from '../composition/useCertificate';
  import { cloneDeep } from 'lodash';
  import { useUserStore } from '@/store';
  import {
    addCertificate,
    getCertificateDetail,
    getFormModel,
    getNewCertificateCode,
    normalOperation,
  } from '@/api/operation/operationApi';
  import { Message } from '@arco-design/web-vue';
  import { getUserDepts } from '@/api/org';
  import { operationTypeEnum } from '../composition/useCertificateDict';

  const router = useRouter();
  const route = useRoute();
  const { id = '', type = '' } = route.query;
  const userStore = useUserStore();
  const dept = ref<any>({});

  const {
    flatObject,
    searchFormItemForAdd,
    searchFormItem,
    generateValueKeyMap,
  } = useCertificate();
  const design = ref<any>();
  const addFormRender = ref<any>();
  let defaultData: any = {}; // 保存默认数据，新增的时候只需要发formData
  let valueKeyMap: any = {}; // valueKey对应的真实formItemId
  let saveType = '';

  onBeforeMount(async () => {
    if (type === 'edit') {
      // 编辑，获取所有数据
      saveType = 'edit';
      const res = await getCertificateDetail(id as string);
      const data = res.data.processProgress;
      dept.value = await getUserDepts(userStore.enterPriseUserId);
      design.value = searchFormItem(data, 'apply');
      valueKeyMap = generateValueKeyMap(design.value.formItems);
      design.value.formData = {
        ...design.value.formData,
        [valueKeyMap['applyDeptId']]: dept.value[0].name,
      };
    } else if (type === 'reApply') {
      // 重新生成
      const { data } = await getFormModel(operationTypeEnum.GROUND);
      defaultData = cloneDeep(data);
      const res = await getCertificateDetail(id as string);
      const newestCode = (await getNewCertificateCode(operationTypeEnum.GROUND))
        .data;
      saveType = 'reApply';
      dept.value = await getUserDepts(userStore.enterPriseUserId);
      data.progress = flatObject(data.process);
      data.formData = res.data.processProgress.formData;
      design.value = searchFormItemForAdd(data, 'apply');
      if (!design.value) {
        Message.warning('暂无数据');
        return;
      }
      valueKeyMap = generateValueKeyMap(design.value.formItems);
      design.value.formData = {
        ...design.value.formData,
        [valueKeyMap['certNum']]: newestCode,
        [valueKeyMap['applyDeptId']]: dept.value[0].name,
      };
    } else if (type === 'add') {
      // 新增，获取默认数据
      saveType = 'add';
      const { data } = await getFormModel(operationTypeEnum.GROUND);
      defaultData = cloneDeep(data);
      const newestCode = (await getNewCertificateCode(operationTypeEnum.GROUND))
        .data;
      dept.value = await getUserDepts(userStore.enterPriseUserId);
      data.progress = flatObject(data.process);
      design.value = searchFormItemForAdd(data, 'apply');
      if (!design.value) {
        Message.warning('暂无数据');
        return;
      }
      valueKeyMap = generateValueKeyMap(design.value.formItems);
      design.value.formData = {
        [valueKeyMap['certNum']]: newestCode,
        [valueKeyMap['applyDeptId']]: dept.value[0].name,
      };
    }
  });

  const handleAddCertification = () => {
    addFormRender!.value.handleSave(async (formData: any) => {
      // 调接口新增作业证
      const formParamData = {
        ...formData,
        [valueKeyMap['applyDeptId']]: dept.value[0].id,
      };
      if (saveType === 'reApply' || saveType === 'add') {
        const params = {
          ...defaultData,
          formData: formParamData,
          deptId: '1486186',
          processUsers: {},
        };
        await addCertificate(
          operationTypeEnum.GROUND,
          defaultData.processDefId,
          params
        );
        Message.success('新增成功');
        router.push({
          name: 'GroundCertificateIndex',
        });
      } else {
        // 编辑作业证，不改变原有流程
        const params = {
          action: 'agree',
          formData: formParamData,
          instanceId: design.value.instanceId,
          processKey: 'apply',
          taskId:
            design.value.progress[design.value.progress.length - 1].taskId,
          userId: userStore.enterPriseUserId,
          nodeId:
            design.value.progress[design.value.progress.length - 1].nodeId,
        };
        await normalOperation(id as string, params);
        Message.success('编辑成功');
        router.push({
          name: 'GroundCertificateIndex',
        });
      }
    });
  };
</script>
<style lang="less" scoped>
  .header {
    font-size: 18px;
    margin-bottom: 30px;

    .title {
      margin-left: 8px;
    }
  }
  .add-form-render-container {
    padding: 0px 20px 20px 20px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    .form-render-content {
      height: 100%;
      :deep(.el-form-item__content .el-input) {
        width: 22.25vw;
      }
    }
  }

  .form-render-btns {
    margin-top: 16px;
    text-align: center;

    button + button {
      margin-left: 12px;
    }
  }
</style>
