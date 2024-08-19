<!-- 风险管控--巡查记录 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form :model="selectForm" layout="inline">
          <a-form-item field="" label="责任人">
            <a-input placeholder="管控责任人"></a-input>
          </a-form-item>
          <a-form-item field="" label="巡查情况">
            <a-tree-select
              placeholder="最新巡查情况"
              :data="[]"
            ></a-tree-select>
          </a-form-item>
          <a-form-item field="" label="巡查部门">
            <a-tree-select placeholder="巡查部门" :data="[]"></a-tree-select>
          </a-form-item>
          <a-form-item field="" label="责任人">
            <a-range-picker
              style="width: 360px; margin: 0 24px 24px 0"
              show-time
              :placeholder="['巡查开始日期', '巡查结束日期']"
              format="YYYY-MM-DD HH:mm"
            />
          </a-form-item>
          <a-form-item field="" label="巡查人">
            <a-tree-select placeholder="巡查人" :data="[]"></a-tree-select>
          </a-form-item>
          <a-form-item field="" label="风险单元">
            <a-input placeholder="风险单元"></a-input>
          </a-form-item>
        </a-form>
      </template>
      <template #headerBtn>
        <a-space direction="vertical" :size="[0, 10]">
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
      <template #primaryBtn> </template>
      <template #minorBtn></template>
      <template #table>
        <a-table
          :data="inspectionRecordData.rows"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="{
            total: inspectionRecordData.total,
            showTotal: true,
            showPageSize: true,
            pageSizeOptions: [10, 20, 50, 100],
          }"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>

          <template #option="{ record }">
            <a-button
              type="text"
              status="success"
              size="mini"
              @click="inspectionRecord(record)"
              >巡查记录</a-button
            >
          </template>
        </a-table>
      </template>
    </TableListCard>

    <!-- 巡查记录 -->
    <a-modal
      :visible="showAddModal"
      title="巡查记录"
      :modal-style="{ width: '1200px', maxHeight: '800px', overflow: 'auto' }"
      title-align="start"
      @cancel="handleClose"
    >
      <a-table
        :data="inspectionRecordList.rows"
        row-key="id"
        :columns="recordListColumns"
        :bordered="false"
        :pagination="{
          total: inspectionRecordList.total,
          showTotal: true,
        }"
      >
        <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
        <template #picture="{ record }">
          <span
            v-if="record.patrolImg"
            class="picture"
            @click="showPDF(record)"
          >
            查看附件
          </span>
          <span v-else>暂无图片</span>
        </template>
      </a-table>
      <template #footer>
        <a-button @click="handleClose">取消</a-button>
      </template>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { ref } from 'vue';
  import data from './data.json';
  import list from './record.json';
  export default {
    name: 'InspectionRecored',
  };
</script>

<script lang="ts" setup>
  // -------------------搜索--------------------------
  const selectForm = ref<any>({});
  // -----------------------表格-----------------------
  const columns: any[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
      dataIndex: '',
      align: 'left',
    },
    {
      title: '风险单元',
      dataIndex: 'unitName',
    },
    {
      title: '风险点',
      dataIndex: 'pointName',
    },
    {
      title: '最新巡查情况',
      dataIndex: 'patrolNumber',
    },
    {
      title: '巡查部门',
      dataIndex: 'createByDeptName',
    },
    {
      title: '巡查人',
      dataIndex: 'createByName',
    },
    {
      title: '管控责任人',
      width: 120,
      dataIndex: 'contactPersonName',
      cellStyle: { width: '10%' },
    },
    {
      title: '巡查次数',
      dataIndex: 'patrolNumber',
    },
    {
      title: '最新巡查时间',
      dataIndex: 'createDate',
    },
    {
      title: '最新巡查备注',
      width: 140,
      dataIndex: 'remark',
      cellStyle: { width: '12%' },
    },
    {
      title: '操作',
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];
  const inspectionRecordData = ref<any>({});
  inspectionRecordData.value = data.page;
  // ---------------巡查记录------------------
  const recordListColumns: any[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
      dataIndex: '',
      align: 'left',
    },
    {
      title: '巡查人',
      dataIndex: 'createByName',
    },
    {
      title: '最新巡查情况',
      dataIndex: 'type',
    },
    {
      title: '巡查类型',
      dataIndex: 'sourceStatus',
    },
    {
      title: '巡查时间',
      dataIndex: 'createDate',
    },
    {
      title: '巡查备注',
      dataIndex: 'remark',
    },
    {
      title: '巡查图片',
      width: 120,
      dataIndex: 'patrolImg',
      slotName: 'picture',
      cellStyle: { width: '10%' },
    },
  ];
  const showAddModal = ref(false);
  const inspectionRecordList = ref<any>([]);
  const inspectionRecord = (row?: any) => {
    showAddModal.value = true;
    // 根据id查询纪录列表
    inspectionRecordList.value = list.page;
  };
  const handleClose = () => {
    showAddModal.value = false;
  };
  const showPDF = (row: any) => {
    console.log('daying');
  };
</script>

<style lang="less" scoped>
  .upload-tip {
    color: #f59b22;
  }
  .table-img {
    width: 46px;
    height: 60px;
  }
  .picture {
    color: #85ce61;
    cursor: pointer;
  }
</style>
