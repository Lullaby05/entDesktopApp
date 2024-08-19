<template>
  <div class="container">
    <a-card class="content-card">
      <FormDesignForRisk ref="controlFormDesign" />
      <div class="btn">
        <a-button @click="goBack">取消</a-button>
        <a-button type="primary" @click="submit">确定</a-button>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts">
  export default {
    name: 'ControlFormDesign',
  };
</script>
<script lang="ts" setup>
  import FormDesignForRisk from '@/components/form-design/design/FormDesignForRisk.vue';
  import { onBeforeMount, ref } from 'vue';
  import { useStore } from 'vuex';
  import { useRouter, useRoute } from 'vue-router';
  import SnowflakeId from 'snowflake-id'; // 生成雪花id
  import { defaultFormConfig } from './composition/defaultFormConfig';

  const router = useRouter();
  const route = useRoute();
  const store = useStore();
  const controlFormDesign = ref<InstanceType<typeof FormDesignForRisk>>(null);
  const snowflake = new SnowflakeId({
    mid: 42,
    offset: (2019 - 1970) * 31536000 * 1000,
  });
  const { id, formId = '' } = route.query;
  const beforeForm = JSON.parse(JSON.stringify(store.state.design));

  onBeforeMount(() => {
    loadInitFrom();
  });

  const submit = () => {
    store.commit('setFormId', formId || snowflake.generate());
    router.back();
  };

  // 初始化表单配置
  const loadInitFrom = () => {
    store.commit(
      'loadForm',
      store.state.design.formId ? store.state.design : defaultFormConfig()
    );
  };

  const goBack = () => {
    store.commit('loadForm', beforeForm);
    router.back();
  };
</script>
<style lang="less" scoped>
  .arco-card.content-card {
  }

  .btn {
    margin-top: 12px;
    width: 100%;
    text-align: center;

    button + button {
      margin-left: 12px;
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
