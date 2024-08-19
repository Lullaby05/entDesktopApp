<template>
  <TableListCard>
    <template #headerInput>
      <a-form :model="selectForm" layout="inline">
        <a-form-item field="" label="检查表">
          <a-input placeholder="请输入检查表编号或检查表名称"></a-input>
        </a-form-item>
      </a-form>
    </template>
    <template #headerBtn>
      <a-space>
        <a-button type="primary">
          <icon-search class="icon" />
          查询
        </a-button>
      </a-space>
    </template>
    <template #table>
      <a-table
        :data="checkListData.rows"
        row-key="id"
        :columns="columns"
        :bordered="false"
        :row-selection="{
          type: 'radio',
          title: '选择',
          width: 60,
          onlyCurrent: false,
        }"
        :pagination="{
          total: checkListData.total,
          showTotal: true,
          showPageSize: true,
          pageSizeOptions: [10, 20, 50, 100],
        }"
        @select="selectCheckList"
      >
        <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
      </a-table>
    </template>
  </TableListCard>
</template>

<script lang="ts">
  import { ref } from 'vue';
  import type {
    TableColumnData,
    TableData,
  } from '@arco-design/web-vue/es/table/interface';
</script>

<script lang="ts" setup>
  // -----------------------搜索--------------------------
  const selectForm = ref<any>({});
  // -----------------------表格-----------------------
  const columns: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
      dataIndex: '',
      align: 'left',
    },
    {
      title: '编号',
      dataIndex: 'code',
    },
    {
      title: '名称',
      dataIndex: 'listName',
    },
    {
      title: '隐患数量',
      dataIndex: 'itemCount',
    },
  ];

  //   获取隐患数据列表
  const checkListData = {
    total: 186,
    rows: [
      {
        id: 1696,
        enterpriseId: 80,
        code: '202308183003',
        listName: '防火防爆',
        status: 1,
        createBy: 196,
        createDate: 1692327950000,
        updateBy: 196,
        updateDate: 1692327950000,
        repositoryIds: [15997, 15994, 15830],
        itemCount: 3,
        investigationIds: [30998],
        schedule: null,
      },
      {
        id: 1693,
        enterpriseId: 80,
        code: '202308108795',
        listName: 'test',
        status: 1,
        createBy: 172,
        createDate: 1691647170000,
        updateBy: 172,
        updateDate: 1691647170000,
        repositoryIds: [20924, 20921],
        itemCount: 2,
        investigationIds: [30978],
        schedule: null,
      },
      {
        id: 1681,
        enterpriseId: 80,
        code: '202306023324',
        listName: '周检',
        status: 1,
        createBy: 30958,
        createDate: 1685680437000,
        updateBy: 30958,
        updateDate: 1685680437000,
        repositoryIds: [20887, 20878],
        itemCount: 2,
        investigationIds: [
          30693, 30754, 30793, 30818, 30828, 30976, 30979, 30980,
        ],
        schedule: null,
      },
      {
        id: 1680,
        enterpriseId: 80,
        code: '202305317729',
        listName: '检查表表',
        status: 1,
        createBy: 196,
        createDate: 1685521761000,
        updateBy: 196,
        updateDate: 1685521797000,
        repositoryIds: [20910, 20909],
        itemCount: 2,
        investigationIds: [30730],
        schedule: null,
      },
      {
        id: 1678,
        enterpriseId: 80,
        code: '202305246384',
        listName: '防火防爆',
        status: 1,
        createBy: 196,
        createDate: 1684894413000,
        updateBy: 196,
        updateDate: 1684894413000,
        repositoryIds: [
          20910, 20909, 20908, 20907, 20906, 20905, 20904, 20903, 20902, 20901,
        ],
        itemCount: 10,
        investigationIds: [30658],
        schedule: null,
      },
      {
        id: 1674,
        enterpriseId: 80,
        code: '202305128654',
        listName: '测试',
        status: 1,
        createBy: 30740,
        createDate: 1683873198000,
        updateBy: 30740,
        updateDate: 1683873198000,
        repositoryIds: [20875, 20874, 20873],
        itemCount: 3,
        investigationIds: [30657],
        schedule: null,
      },
      {
        id: 1672,
        enterpriseId: 80,
        code: '擦拭啊',
        listName: '测试测试测试',
        status: 1,
        createBy: 233,
        createDate: 1683187011000,
        updateBy: 233,
        updateDate: 1683187011000,
        repositoryIds: [19270, 18473],
        itemCount: 2,
        investigationIds: [30551, 30630, 31012],
        schedule: null,
      },
      {
        id: 1671,
        enterpriseId: 80,
        code: '测试催催催',
        listName: '菜市场',
        status: 1,
        createBy: 18377,
        createDate: 1683184885000,
        updateBy: 18377,
        updateDate: 1683184885000,
        repositoryIds: [19367, 19270],
        itemCount: 2,
        investigationIds: [30550],
        schedule: null,
      },
      {
        id: 1648,
        enterpriseId: 80,
        code: '202304125886',
        listName: '1',
        status: 1,
        createBy: 22935,
        createDate: 1681283727000,
        updateBy: 22935,
        updateDate: 1681283727000,
        repositoryIds: [19270],
        itemCount: 1,
        investigationIds: [30431, 30440, 30534],
        schedule: null,
      },
      {
        id: 1647,
        enterpriseId: 80,
        code: '202303212703',
        listName: '锅炉',
        status: 1,
        createBy: 30546,
        createDate: 1679380023000,
        updateBy: 30546,
        updateDate: 1679380023000,
        repositoryIds: [16236],
        itemCount: 1,
        investigationIds: null,
        schedule: null,
      },
    ],
  };

  const selectedItem = ref<any>({});
  const selectCheckList = (
    rowKeys: (string | number)[],
    rowKey: string | number,
    record: TableData
  ) => {
    // console.log('record', record);
    selectedItem.value = record;
  };
  // ------------------ 对付组件共享 ------------------
  defineExpose({
    selectedItem,
  });
</script>

<style lang="less" scoped></style>
