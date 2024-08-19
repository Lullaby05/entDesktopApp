<!-- 隐患管理--排查内容新增/编辑 -->
<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">{{ title }}</span>
      </div>
      <div class="content-card-form">
        <a-form
          ref="formRef"
          :model="formData"
          v-if="['isAdd', 'isEdit'].includes(type as string)"
        >
          <a-form-item
            field="checkItem"
            label="排查项目"
            :rules="formRules.checkItem"
          >
            <a-input
              v-model="formData.checkItem"
              allow-clear
              placeholder="请输入排查项目"
            ></a-input>
          </a-form-item>
          <a-form-item
            field="problemSpot"
            label="问题点"
            :rules="formRules.problemSpot"
          >
            <a-input
              v-model="formData.problemSpot"
              allow-clear
              placeholder="请输入问题点"
            ></a-input>
          </a-form-item>
          <a-form-item
            field="checkStandard"
            label="排查标准"
            :rules="formRules.checkStandard"
          >
            <a-textarea
              v-model="formData.checkStandard"
              allow-clear
              placeholder="请输入排查标准"
              :max-length="200"
              :auto-size="{
                minRows: 6,
                maxRows: 6,
              }"
              show-word-limit
            >
            </a-textarea>
          </a-form-item>
          <a-form-item
            field="formItems"
            label="排查表单"
            class="formItems"
            :rules="formRules.formItems"
          >
            <a-button @click="handleForm" type="primary">{{ '编辑' }}</a-button>
            <div v-if="formsTemp.length" class="item-slot">
              <form-render
                :disabled="true"
                v-model="formRenderData"
                :forms="formsTemp"
                mode="PC"
              />
            </div>
          </a-form-item>
        </a-form>
        <div v-else>
          <card-display v-if="cardItems?.items.length" :card-items="cardItems">
            <template #default>
              <div class="item-slot">
                <form-render
                  v-model="formData"
                  :forms="formsTemp"
                  mode="PC"
                  :disabled="true"
                />
              </div>
            </template>
          </card-display>
        </div>
      </div>
      <div class="btn" v-if="type !== 'isDetail'">
        <a-button @click="goBack">取消</a-button>
        <a-button type="primary" @click="handleSubmit">保存</a-button>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'ChecksContentDetail',
  };
</script>

<script lang="ts" setup>
  import { useRouter, useRoute } from 'vue-router';
  import { useFormRender } from '@/views/risk/gradedControl/composition/useFormRender';
  import FormRender from '@/components/form-design/components/FormRender.vue';
  import cardDisplay from '../snapshot/components/cardDisplay.vue';
  import { ref } from 'vue';
  import { onBeforeMount } from 'vue';
  import {
    checkContentAdd,
    checkContentEdit,
    getCheckContentDetail,
  } from '@/api/pitfall';
  import { useStore } from 'vuex';
  import { usePitfallStore } from '@/store';
  import { Message } from '@arco-design/web-vue';
  import storeDesign from '@/store_design';
  import { defaultFormConfig } from '@/views/risk/gradedControl/composition/defaultFormConfig';

  const router = useRouter();
  const route = useRoute();
  const formStore = useStore();
  const { addCheckContent, checkContent, clearCheckContent } =
    usePitfallStore();

  const { type, id } = route.query;
  let title = '';
  if (type === 'isAdd') {
    title = '新增排查内容';
  } else if (type === 'isEdit') {
    title = '编辑排查内容';
  } else {
    title = '详情查看';
  }
  const formRef = ref<any>(null);

  const formData = ref<any>({
    checkItem: '',
    problemSpot: '',
    checkStandard: '',
    formItems: undefined,
    id: '',
  });
  const formRules =
    type !== 'isDetail'
      ? {
          checkItem: [
            { required: true, message: '请输入排查项目', trigger: 'blur' },
            { maxLength: 30, message: '不能超过30字符', trigger: 'blur' },
          ],
          problemSpot: [
            { required: true, message: '请输入问题点', trigger: 'blur' },
            { maxLength: 100, message: '不能超过100字符', trigger: 'blur' },
          ],
          checkStandard: [
            { required: true, message: '请输入排查标准', trigger: 'blur' },
          ],
          formItems: [
            { required: true, message: '请编辑表单', trigger: 'blur' },
          ],
        }
      : {};

  let formRenderData = ref({});
  let formsTemp = ref([]);
  let formConfigTemp = ref({});

  const cardItems = ref<{ title?: string; items: any[] }>();

  onBeforeMount(async () => {
    let formRender: any = {};
    if (type === 'isDetail' || type === 'isEdit') {
      const res = await getCheckContentDetail(id as string);
      const detailData = res.data;
      formData.value = detailData;
      formData.value.formItems = JSON.parse(detailData.formItems).design;
      cardItems.value = {
        items: [
          { id: 1, field: '排查项目', value: detailData.checkItem },
          { id: 2, field: '问题点', value: detailData.problemSpot },
          { id: 3, field: '排查标准', value: detailData.checkStandard },
          { id: 4, field: '排查表单', type: 'slot' },
        ],
      };
      formRender = useFormRender(formData.value.formItems);
      if (
        Object.keys(storeDesign.state.design).length &&
        (storeDesign.state.design as any).formId ===
          formData.value.formItems.formId
      ) {
        formData.value.formItems = storeDesign.state.design;
      }
    } else if (type === 'isAdd') {
      const defaultConfig = defaultFormConfig(true);
      formData.value = checkContent;
      formData.value.formItems = Object.keys(formStore.state.design).length
        ? { ...formStore.state.design }
        : defaultConfig;
      formRender = useFormRender(formData.value.formItems);
    }
    formRenderData.value = formRender.formData;
    formsTemp.value = formRender.formsTemp;
    formConfigTemp.value = formRender.formConfigTemp;
  });

  const handleForm = () => {
    addCheckContent(formData.value);
    formStore.commit('loadForm', formData.value.formItems);
    router.push({
      name: 'CheckContentFormDesign',
      query: {
        formId: formData.value.formItems.formId,
      },
    });
  };

  const handleSubmit = async () => {
    const params = {
      ...formData.value,
      formItems: JSON.stringify({
        design: {
          ...formData.value.formItems,
          formData: formRenderData.value,
        },
      }),
      isDangerControl: !formData.value.id ? 0 : undefined,
    };
    formRef.value.clearValidate();
    const result = await formRef.value.validate();
    if (!result) {
      const reqObj = formData.value.id ? checkContentEdit : checkContentAdd;
      await reqObj(params);
      Message.success({
        content: formData.value.id ? '编辑成功' : '新增成功',
      });
      clearCheckContent();
      formStore.commit('loadForm', {});
      router.back();
    }
  };

  const goBack = () => {
    clearCheckContent();
    formStore.commit('loadForm', {});
    router.back();
  };
</script>

<style lang="less" scoped>
  .arco-card.content-card {
    .header {
      font-size: 18px;
      margin-bottom: 30px;

      .title {
        margin-left: 8px;
      }
    }

    .content-card-form {
      min-height: calc(100vh - 265px);
      width: 80%;

      :deep(.card-display-content) {
        width: 80%;
        height: 100%;

        .content-items div {
          line-height: 42px;
        }
      }

      .formItems :deep(.arco-form-item-content-flex) {
        flex-direction: column;
        align-items: flex-start;
      }

      .item-slot {
        margin-top: 20px;
        box-shadow: 0px 0px 7px -3px rgba(0, 0, 0, 0.5);
        border-bottom: 1px solid var(--bg4);
        border-radius: 10px;
        width: 99%;
        padding: 0 10px;

        .form-render-title {
          line-height: 30px;
          font-size: 14px;
          padding: 5px 10px;
          background-color: var(--bg4);
        }
      }
    }
  }

  .btn {
    margin-top: 20px;
    text-align: center;

    button + button {
      margin-left: 12px;
    }
  }
</style>
