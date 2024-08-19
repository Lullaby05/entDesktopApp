<template>
  <div class="container">
    <a-card>
      <div class="container-title">批量选择引用</div>
    </a-card>
    <TableListCard>
      <template #headerInput>
        <a-form :model="searchForm" layout="inline">
          <a-form-item field="" label="排查项目">
            <a-input placeholder="请输入排查项目名称" allow-clear></a-input>
          </a-form-item>
          <a-form-item field="" label="问题点">
            <a-input placeholder="请输入问题点关键词" allow-clear></a-input>
          </a-form-item>
          <a-form-item field="" label="排查标准">
            <a-input placeholder="请输入排查标准关键词" allow-clear></a-input>
          </a-form-item>
        </a-form>
      </template>
      <template #headerBtn>
        <a-space class="header-btn">
          <a-button type="primary">
            <icon-search class="icon" />
            查询
          </a-button>
          <a-button>
            <icon-refresh class="icon" />
            重置
          </a-button>
        </a-space>
      </template>
      <template #table>
        <a-table
          :bordered="{ cell: true }"
          :data="tableData.rows"
          row-key="id"
          :columns="tableColumn"
          :row-selection="rowSelection"
          v-model:selectedKeys="selectedKeys"
          :pagination="false"
        >
          <template #option="{ record }">
            <div>
              <a-button type="text" @click="toDetail(record)">详情</a-button>
            </div>
          </template>
        </a-table>
        <div class="btn">
          <a-button @click="goBack">取消</a-button>
          <a-button type="primary" @click="goBack">确定</a-button>
        </div>
      </template>
    </TableListCard>
  </div>
</template>
<script lang="ts">
  export default {};
</script>
<script lang="ts" setup>
  import { reactive, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import data from './data.json';
  import {
    TableColumnData,
    TableRowSelection,
  } from '@arco-design/web-vue/es/table/interface';
  import { usePitfallStore } from '@/store';

  const router = useRouter();
  const store = usePitfallStore();

  const searchForm = ref({});

  const rowSelection = reactive<TableRowSelection>({
    type: 'checkbox',
    showCheckedAll: true,
  });

  const selectedKeys = ref(store.batchChooseKeys);

  const tableColumn: TableColumnData[] = [
    {
      title: '排查项目',
      dataIndex: 'checkType',
      width: 150,
    },
    {
      title: '问题点',
      dataIndex: 'point',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '排查标准',
      dataIndex: 'standard',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '内容表单数量',
      dataIndex: 'createBy',
      width: 150,
    },
    {
      title: '操作',
      slotName: 'option',
      // width: 160,
      align: 'center',
    },
  ];

  // 表格数据
  const tableData = ref<any>([]);
  tableData.value = data.page;

  const toDetail = (record: any) => {
    store.addChooseKeys(selectedKeys.value);
    router.push({
      name: 'CheckContentEdit',
      query: { id: record.id, type: 'isDetail' },
    });
  };

  const goBack = () => {
    store.clearChooseKeys();
    router.back();
  };
</script>
<style lang="less" scoped>
  .container-title {
    font-size: 18px;
    font-weight: 500;
    color: #000000;
  }
  .arco-card.tabs-card {
    width: 100%;
    min-height: 94%;
    overflow-y: auto;
    :deep(.arco-card-bordered) {
      border: none;
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
