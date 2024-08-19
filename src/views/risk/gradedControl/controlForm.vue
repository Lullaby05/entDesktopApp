<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">表单管理</span>
      </div>
      <div class="edit-btn">
        <a-button
          v-permission="'ControlFormDesign'"
          type="text"
          @click="editFormRender"
          >编辑</a-button
        >
      </div>
      <div
        v-if="formItems || formStore.state.design.formId"
        class="content-card-form"
      >
        <form-render
          :disabled="true"
          v-model="formRenderData"
          :forms="formsTemp"
          mode="PC"
        />
      </div>
      <div v-else>
        <div class="no-form">
          <img src="" alt="" />
          <span class="empty-form-text"
            >该管控措施对应表单为空，请点击右上角按钮编辑表单</span
          >
        </div>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts">
  export default {
    name: 'ControlForm',
  };
</script>
<script lang="ts" setup>
  import FormRender from '@/components/form-design/components/FormRender.vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useFormRender } from './composition/useFormRender'; // 表单设计器相关
  import { useStore } from 'vuex';
  import { useRiskStore } from '@/store';
  import { onBeforeMount, ref } from 'vue';

  const router = useRouter();
  const route = useRoute();
  const formStore = useStore();
  const riskFormStore = useRiskStore();
  const { id } = route.query;

  const formItems = JSON.parse(
    riskFormStore.getRiskForm(id as string).formItems
  );

  let formRenderData = ref({});
  let formsTemp = ref([]);
  let formConfigTemp = ref({});
  let formRender: any = {};

  if (formStore.state.design.formId) {
    formRender = useFormRender(formStore.state.design);
  } else {
    formRender = useFormRender(formItems && formItems.design);
  }

  formRenderData.value = formRender.formData;
  formsTemp.value = formRender.formsTemp;
  formConfigTemp.value = formRender.formConfigTemp;

  const editFormRender = formRender.editFormRender;

  onBeforeMount(async () => {
    // 从编辑页回来之后会有formId
    const formId = formStore.state.design.formId;
    const beforeFormId =
      formItems && formItems.design && formItems.design.formId;
    if (!formItems || (formId && formId === beforeFormId)) {
      riskFormStore.setRiskForm(id as string, {
        formItems: JSON.stringify({ design: formStore.state.design }),
        isEdit: false,
      });
    }
  });

  const goBack = () => {
    formStore.commit('loadForm', {});
    router.back();
  };
</script>
<style lang="less" scoped>
  .arco-card.content-card {
    .header {
      font-size: 18px;
      // font-weight: 700;
      margin-bottom: 20px;

      .title {
        margin-left: 8px;
      }
    }

    .edit-btn {
      text-align: right;
    }

    .content-card-form {
      margin: 0 auto;
      width: 600px;
    }
  }

  .arco-card.btn-card {
    height: 66px;
    margin-top: 4px;
    padding-right: 40px;

    .btn {
      width: 100%;
      text-align: center;
    }
  }

  .no-form {
    text-align: center;

    .empty-form-text {
      color: gray;
      font-size: 18px;
      width: 100%;
    }
  }
</style>
