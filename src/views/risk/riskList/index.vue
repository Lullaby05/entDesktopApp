<!-- 风险管控--风险清单 -->
<template>
  <div class="container">
    <a-card class="tabs-card">
      <a-tabs type="card" size="large" default-active-key="1" lazy-load>
        <template v-for="item in tabs" :key="item.key">
          <a-tab-pane :ref_key="item.key">
            <template #title>
              {{ item.title }}({{ riskListData.total }})</template
            >
            <Table
              :risk-list-data="riskListData"
              @show-detail="showDetail"
            ></Table
          ></a-tab-pane>
        </template>
        <!-- <a-tab-pane key="8" title="测试"> hahhahah </a-tab-pane> -->
      </a-tabs>
    </a-card>
    <!-- 详情 -->
    <a-modal
      :visible="showModal"
      title="查看详情"
      :modal-style="{ width: '1200px', maxHeight: '900px', overflow: 'auto' }"
      title-align="start"
      @cancel="handleClose"
    >
      <template #footer>
        <a-button @click="handleClose">取消</a-button></template
      >
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { ref } from 'vue';
  import data from './data.json';
  import Table from './table.vue';
  export default {
    name: 'RiskList',
  };
</script>

<script lang="ts" setup>
  const riskListData = ref<any>({});
  riskListData.value = data.page;
  const showModal = ref(false);
  const tabs = [
    {
      key: '1',
      title: '每小时',
    },
    {
      key: '2',
      title: '每天',
    },
    {
      key: '3',
      title: '每周',
    },
    {
      key: '4',
      title: '每月',
    },
    {
      key: '5',
      title: '每季度',
    },
    {
      key: '6',
      title: '全程',
    },
    {
      key: '7',
      title: '半月',
    },
  ];
  const showDetail = (event: any) => {
    showModal.value = true;
  };
  const handleClose = () => {
    showModal.value = false;
  };
</script>

<style lang="less" scoped>
  .arco-card.tabs-card {
    width: 100%;
    min-height: 94%;
    overflow-y: auto;
  }

  /** 
      把分页器固定在table固定最小高度的底部 效果不如预期
      **/

  // :deep(.arco-table-container) {
  //   min-height: 550px;
  // }
  // :deep(.arco-table-pagination) {
  //   padding-top: 10px;
  // }
</style>
