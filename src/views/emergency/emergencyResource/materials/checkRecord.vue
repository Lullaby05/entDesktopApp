<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" />
        <span class="title">物资检查记录</span>
      </div>

      <div class="table">
        <a-table
          :data="checkRecordList"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="{
            total: checkRecordList.length,
            showTotal: true,
            showPageSize: true,
            pageSizeOptions: [10, 20, 50, 100],
          }"
          @page-change="currentChange"
          @page-size-change="pageSizeChange"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
        </a-table>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { getMaterialCheckRecordAPI } from '@/api/emergency';
  import { RecordItem } from '@/views/emergency/emergencyResource/index';
  import type { TableColumnData } from '@arco-design/web-vue';

  export default {
    name: 'CheckRecordPage',
  };
</script>

<script lang="ts" setup>
  const router = useRouter();
  const route = useRoute();

  const goBack = () => {
    router.back();
  };

  const columns: TableColumnData[] = [
    {
      title: '序号',
      width: 60,
      slotName: 'number',
    },
    {
      title: '检查内容',
      width: 220,
      dataIndex: 'checkDesc',
    },

    {
      title: '检查人',
      width: 220,
      dataIndex: 'checkUserName',
    },
    {
      title: '检查时间',
      dataIndex: 'checkTime',
      width: 220,
    },

    {
      title: '操作',
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];

  const checkRecordList = ref<RecordItem[]>([]);

  const getDetail = async () => {
    const { data } = await getMaterialCheckRecordAPI(route.query.id as string);
    checkRecordList.value = data;
  };

  getDetail();

  const currentChange = (current: number) => {
    // selectForm.value.pageNo = current;
    // getMaterialsData();
  };

  const pageSizeChange = (pageSize: number) => {
    // selectForm.value.pageSize = pageSize;
    // getMaterialsData();
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
    .table {
      width: clac(100% - 26px);
      min-height: 600px;
      margin-bottom: 20px;
      margin-left: 26px;
    }
  }
  .arco-card.btn-card {
    height: 66px;
    margin-top: 4px;
    padding-right: 40px;

    .btn {
      width: 100%;
      text-align: right;
    }
  }
</style>
