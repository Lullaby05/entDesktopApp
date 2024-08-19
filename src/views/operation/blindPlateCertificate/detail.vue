<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="router.back()" /><span class="title"
          >盲板抽堵安全作业证</span
        >
      </div>
      <div class="process" v-if="status === 'detail'">
        <processCertificate
          v-if="processList.length"
          :key="initComopnent"
          :processList="processList"
          :dataProcess="dataProcess"
          :certificateStatus="(certificateStatus as string)"
        />
      </div>
      <div class="preview-container">
        <previewCertificate
          v-if="id"
          :form-process-data="formProcessData"
          :key="initComopnent"
          status="preview"
          :id="(id as string)"
          :current-step="currentStep"
        />
      </div>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import previewCertificate from '../components/previewCertificate.vue';
  // import formProcessData from '../formProcessData.json';
  import { useRoute } from 'vue-router';
  import processCertificate from '../components/processCertificate.vue';
  import { onBeforeMount, ref } from 'vue';
  import { getCertificateDetail } from '@/api/operation/operationApi';
  import { cloneDeep } from 'lodash';

  const router = useRouter();
  const route = useRoute();
  const { status = 'detail', id } = route.query;

  const processList = ref<any[]>([]);
  const formProcessData = ref<any>({});
  let currentStep = ref<number>(0);
  const initComopnent = ref<number>(1);
  let dataProcess = ref<any>({});
  let certificateStatus = ref<string>('');

  onBeforeMount(async () => {
    const { data } = await getCertificateDetail(id as string);
    processList.value = data.originalProgress;
    formProcessData.value = data.processProgress;
    dataProcess.value = cloneDeep(data.processProgress);
    certificateStatus = data.status;
    const lastProgress =
      data.processProgress.progress[data.processProgress.progress.length - 1];
    currentStep.value =
      data.originalProgress.findIndex(
        (ele: any) => ele.id === lastProgress.nodeId
      ) + 1;
  });
</script>
<style lang="less" scoped>
  .header {
    font-size: 18px;
    margin-bottom: 30px;

    .title {
      margin-left: 8px;
    }
  }
  .preview-container {
    padding: 0px 20px 20px 20px;
    display: flex;
    flex-direction: column;
  }
  .process {
    width: 100%;
    border-radius: 10px;
    background-color: var(--bg2);
    position: relative;
    display: flex;
    align-items: center;
    justify-content: flex-start;
  }
</style>
