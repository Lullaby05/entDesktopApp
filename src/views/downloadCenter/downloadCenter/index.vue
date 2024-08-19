<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form :model="tempSearchForm" layout="inline">
          <a-form-item field="content" label="内容描述">
            <a-input
              v-model="tempSearchForm.content"
              placeholder="请输入内容描述"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="statisticTime" label="统计时间">
            <a-date-picker
              v-model="tempSearchForm.statisticTime"
              show-time
              placeholder="请选择导出时间"
              allow-clear
            ></a-date-picker>
          </a-form-item>
          <a-form-item field="name" label="导出场景名称">
            <a-input
              v-model="tempSearchForm.name"
              placeholder="请输入导出场景名称"
              allow-clear
            ></a-input>
          </a-form-item>
        </a-form>
      </template>
      <template #headerBtn>
        <div class="header-btn">
          <a-button
            type="primary"
            @click="
              () => {
                selectForm = tempSearchForm;
                getTableList();
              }
            "
          >
            <icon-search class="icon" />
            查询
          </a-button>
          <a-button @click="handleReset">
            <icon-refresh class="icon" />
            重置
          </a-button>
        </div>
      </template>
      <template #primaryBtn>
        <a-space>
          <a-button type="primary" @click="showModal">
            <icon-plus class="icon" />
            新增
          </a-button>
        </a-space>
      </template>
      <template #minorBtn>
        <a-space>
          <icon-refresh class="minor-icon" size="20" />
        </a-space>
      </template>
      <template #table>
        <a-table
          :data="tableData.list"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #option="{ record }">
            <div>
              <a-button type="text" size="mini" @click="download(record)">
                下载
              </a-button>
            </div>
          </template>
        </a-table>
      </template>
      <template #pagination>
        <a-pagination
          :current="selectForm.pageNo"
          :page-size="selectForm.pageSize || 20"
          show-total
          show-page-size
          :page-size-options="[10, 20, 50, 100]"
          :base-size="3"
          :buffer-size="1"
          :total="(tableData.total as number)"
          @change="pageChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>
    <a-modal
      v-if="modalVisible"
      width="1200px"
      title-align="start"
      class="modal-info"
      :visible="modalVisible"
      title="增加数据应用场景"
      ok-text="提交"
      @ok="submitDownloadScreen"
      @cancel="closeModal"
    >
      <a-form :model="modalForm" :rules="modalFormRules">
        <a-form-item field="name" label="导出场景名称">
          <a-input
            v-model="modalForm.name"
            placeholder="请输入导出场景名称"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="content" label="内容描述">
          <a-input
            v-model="modalForm.content"
            placeholder="请输入内容描述"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="addReport" label="添加报表">
          <a-table
            v-model:selected-keys="selectKeys"
            row-key="id"
            style="width: 100%"
            :columns="modalTableColumns"
            :data="modalTableData"
            :pagination="false"
            :bordered="false"
            :row-selection="{
              type: 'checkbox',
              width: 30,
              onlyCurrent: false,
              showCheckedAll: true,
            }"
          >
            <template #format="{ record }">
              <a-checkbox-group :default-value="record.addReport">
                <a-checkbox value="1">pdf</a-checkbox>
                <a-checkbox value="2">docx</a-checkbox>
                <a-checkbox value="3">xls</a-checkbox>
              </a-checkbox-group>
            </template>
          </a-table>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { downloadFile, formatDate } from '@/utils/utils';
  import { Message, TableColumnData, TableData } from '@arco-design/web-vue';
  import { ref } from 'vue';

  const tempSearchForm = ref<any>({});
  const selectForm = ref<any>({});

  const tableData = ref<any>({
    list: [
      {
        id: 0,
        name: '日常安全工作',
        exportTime: '2024-05-21 15:15:20',
        reportName: '每天-安全检查内容',
        content: '包含日常表、检查内容、任务执行情况等数据',
        url: 'https://business.api.xkrsecure.com/exportFiles/%E6%97%A5%E5%B8%B8%E5%B7%A5%E4%BD%9C%E6%B1%87%E6%8A%A5.rar',
      },
      {
        id: 1,
        name: '隐患治理报告',
        exportTime: '2024-05-20 19:00:58',
        reportName: '每月-隐患治理报告',
        content: '包含隐患治理台账了列表、隐患整改情况内容',
        url: 'https://business.api.xkrsecure.com/exportFiles/%E6%97%A5%E5%B8%B8%E5%B7%A5%E4%BD%9C%E6%B1%87%E6%8A%A5.rar',
      },
      {
        id: 2,
        name: '安全隐患整改记录',
        exportTime: '2024-05-20 17:21:00',
        reportName: '每周-安全隐患整改记录',
        content: '记录每周安全隐患整改、验证闭环数据',
        url: 'https://business.api.xkrsecure.com/exportFiles/%E6%97%A5%E5%B8%B8%E5%B7%A5%E4%BD%9C%E6%B1%87%E6%8A%A5.rar',
      },
      {
        id: 3,
        name: '危险源列表',
        exportTime: '2024-05-19 18:00:08',
        reportName: '每年-危险源列表',
        content: '风险辨识与评价列表',
        url: 'https://business.api.xkrsecure.com/exportFiles/%E6%97%A5%E5%B8%B8%E5%B7%A5%E4%BD%9C%E6%B1%87%E6%8A%A5.rar',
      },
      {
        id: 4,
        name: '排查计划安排',
        exportTime: '2024-05-10 17:24:08',
        reportName: '每季度-排查计划安排',
        content: '每个季度车间排查计划安排表',
        url: 'https://business.api.xkrsecure.com/exportFiles/%E6%97%A5%E5%B8%B8%E5%B7%A5%E4%BD%9C%E6%B1%87%E6%8A%A5.rar',
      },
      {
        id: 5,
        name: '计划排查任务',
        exportTime: '2024-05-09 18:00:00',
        reportName: '每月-计划排查任务',
        content: '每个月计划排查任务',
        url: 'https://business.api.xkrsecure.com/exportFiles/%E6%97%A5%E5%B8%B8%E5%B7%A5%E4%BD%9C%E6%B1%87%E6%8A%A5.rar',
      },
      {
        id: 6,
        name: '外部工作检查',
        exportTime: '2024-05-09 08:41:37',
        reportName: '每季度-隐患治理报告',
        content: '包含隐患治理验证、整改内容以及隐患分布情况和等级',
        url: 'https://business.api.xkrsecure.com/exportFiles/%E6%97%A5%E5%B8%B8%E5%B7%A5%E4%BD%9C%E6%B1%87%E6%8A%A5.rar',
      },
      {
        id: 7,
        name: '安全工作汇报',
        exportTime: '2024-05-09 08:41:37',
        reportName: '每周-隐患检查报告',
        content: '每周的逾期未整改内容',
        url: 'https://business.api.xkrsecure.com/exportFiles/%E6%97%A5%E5%B8%B8%E5%B7%A5%E4%BD%9C%E6%B1%87%E6%8A%A5.rar',
      },
      {
        id: 8,
        name: '工作进度情况跟进',
        exportTime: '2024-05-05 16:24:07',
        reportName: '每月-隐患治理台账列表',
        content: '隐患整改报告、隐患整改内容',
        url: 'https://business.api.xkrsecure.com/exportFiles/%E6%97%A5%E5%B8%B8%E5%B7%A5%E4%BD%9C%E6%B1%87%E6%8A%A5.rar',
      },
      {
        id: 9,
        name: '日常工作安排',
        exportTime: '2024-05-04 08:41:37',
        reportName: '每日-隐患检查计划安排',
        content: '5月份隐患检查计划内容',
        url: 'https://business.api.xkrsecure.com/exportFiles/%E6%97%A5%E5%B8%B8%E5%B7%A5%E4%BD%9C%E6%B1%87%E6%8A%A5.rar',
      },
      {
        id: 10,
        name: '政府部门检查',
        exportTime: '2024-05-04 07:11:17',
        reportName: '每年-隐患治理报告',
        content: '2024年检查表、检查内容、任务执行情况等数据',
        url: 'https://business.api.xkrsecure.com/exportFiles/%E6%97%A5%E5%B8%B8%E5%B7%A5%E4%BD%9C%E6%B1%87%E6%8A%A5.rar',
      },
      {
        id: 11,
        name: '隐患排查工作',
        exportTime: '2024-05-03 07:12:36',
        reportName: '每季度-隐患排查计划',
        content: '包含日常表、检查内容、任务执行情况等数据',
        url: 'https://business.api.xkrsecure.com/exportFiles/%E6%97%A5%E5%B8%B8%E5%B7%A5%E4%BD%9C%E6%B1%87%E6%8A%A5.rar',
      },
    ],
    total: 12,
  });

  const columns: TableColumnData[] = [
    {
      title: '序号',
      dataIndex: 'number',
      width: 60,
      slotName: 'number',
    },
    {
      title: '导出场景名称',
      dataIndex: 'name',
    },
    {
      title: '导出时间',
      dataIndex: 'exportTime',
    },
    {
      title: '报表名称',
      dataIndex: 'reportName',
    },
    {
      title: '内容描述',
      dataIndex: 'content',
    },
    {
      title: '操作',
      dataIndex: 'option',
      slotName: 'option',
    },
  ];

  const getTableList = async () => {};
  const pageChange = (page: number) => {
    selectForm.value.pageNo = page;
    getTableList();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getTableList();
  };
  // 重置操作
  const handleReset = () => {
    selectForm.value = {
      pageNo: selectForm.value.pageNo,
      pageSize: selectForm.value.pageSize,
    };
    tempSearchForm.value = {
      pageNo: selectForm.value.pageNo,
      pageSize: selectForm.value.pageSize,
    };
    getTableList();
  };

  const download = (record: TableData) => {
    downloadFile(record.url);
    Message.success('下载成功');
  };

  // 弹窗
  const modalVisible = ref(false);
  const modalForm = ref<any>({});
  const modalFormRules = ref<any>({
    name: [{ required: true, message: '请输入导出场景名称', trigger: 'blur' }],
    addReport: [{ required: true, message: '请选择报表', trigger: 'change' }],
  });
  const modalTableColumns: TableColumnData[] = [
    {
      dataIndex: 'name',
      title: '报表名称',
    },
    {
      dataIndex: 'content',
      title: '内容描述',
    },
    {
      dataIndex: 'format',
      title: '下载格式',
      slotName: 'format',
    },
  ];
  const modalTableData = ref([
    {
      id: '0',
      name: '隐患排查',
      content: '包含日常表、检查内容、任务执行情况等数据',
      format: 'xls',
      addReport: ['3'],
    },
    {
      id: '1',
      name: '隐患排查',
      content: '包含日常表、检查内容、任务执行情况等数据',
      format: 'xls',
      addReport: ['3'],
    },
    {
      id: '2',
      name: '隐患检查',
      content: '包含日常检查计划制定',
      format: 'xls',
      addReport: ['3'],
    },
    {
      id: '3',
      name: '政府部门检查',
      content: '隐患整改报告、隐患整改内容',
      format: 'xls',
      addReport: ['3'],
    },
    {
      id: '4',
      name: '工作进度情况',
      content: '逾期未整改的隐患及部门信息',
      format: 'xls',
      addReport: ['3'],
    },
    {
      id: '5',
      name: '隐患排查',
      content: '包含日常表、检查内容、任务执行情况等数据',
      format: 'xls',
      addReport: ['3'],
    },
    {
      id: '6',
      name: '隐患排查',
      content: '包含日常表、检查内容、任务执行情况等数据',
      format: 'xls',
      addReport: ['3'],
    },
    {
      id: '7',
      name: '隐患检查',
      content: '包含日常检查计划制定',
      format: 'xls',
      addReport: ['3'],
    },
  ]);
  const showModal = () => {
    modalForm.value = {};
    modalVisible.value = true;
  };
  const submitDownloadScreen = () => {
    setTimeout(() => {
      tableData.value.list.unshift({
        id: tableData.value.list.length,
        name: modalForm.value.name,
        exportTime: formatDate(new Date(), 'yyyy-MM-DD HH:mm:ss'),
        reportName: '每天-安全检查内容',
        content: modalForm.value.content,
        url: 'https://business.api.xkrsecure.com/exportFiles/%E6%97%A5%E5%B8%B8%E5%B7%A5%E4%BD%9C%E6%B1%87%E6%8A%A5.rar',
      });
      Message.success('提交成功');
      closeModal();
    }, 500);
  };
  const selectKeys = ref([]);
  const closeModal = () => {
    modalVisible.value = false;
    modalForm.value = {};
  };
</script>

<style lang="less" scoped>
  .header-btn {
    display: flex;
    justify-content: center;
    align-items: flex-start;

    .arco-btn + .arco-btn {
      margin-left: 12px;
    }
  }
  .modal-info {
    .title {
      font-family: 'Alibaba-Medium';
    }
  }
</style>
