<!-- 企业管理--证照管理：员工证照管理 -->
<template>
  <div class="container">
    <div class="guide">
      <a-space :size="[24, 0]">
        <div
          class="item normal"
          :class="selectForm.queryCondition === 1 ? 'active' : ''"
          @click="getStaffCertificateData(1)"
        >
          <div class="number">{{ staffCount.allNum || 0 }}</div>
          <div class="text">全部证照</div>
        </div>
        <div
          class="item success"
          :class="selectForm.queryCondition === 2 ? 'active' : ''"
          @click="getStaffCertificateData(2)"
        >
          <div class="number">{{ staffCount.validNum || 0 }}</div>
          <div class="text">有效证照</div>
        </div>
        <div
          class="item danger"
          :class="selectForm.queryCondition === 3 ? 'active' : ''"
          @click="getStaffCertificateData(3)"
        >
          <div class="number">{{ staffCount.invalidNum || 0 }}</div>
          <div class="text">无效证照</div>
        </div>
        <div
          class="item warning"
          :class="selectForm.queryCondition === 4 ? 'active' : ''"
          @click="getStaffCertificateData(4)"
        >
          <div class="number">{{ staffCount.adventNum || 0 }}</div>
          <div class="text">临期证照</div>
        </div>
        <div
          class="item warning"
          :class="selectForm.queryCondition === 5 ? 'active' : ''"
          @click="getStaffCertificateData(5)"
        >
          <div class="number">{{ staffCount.waitReviewNum || 0 }}</div>
          <div class="text">待复审证照</div>
        </div>
      </a-space>
    </div>
    <TableListCard>
      <template #headerInput>
        <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
          <a-form-item field="employeeName" label="员工姓名">
            <a-input
              v-model.trim="tempSearchForm.employeeName"
              placeholder="请输入员工姓名"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="cardName" label="证照名称">
            <a-input
              v-model.trim="tempSearchForm.cardName"
              placeholder="请输入证照名称"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="cardNo" label="证照号码">
            <a-input
              v-model.trim="tempSearchForm.cardNo"
              placeholder="请输入证照号码"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="cardTypeCode" label="证照类型">
            <a-select
              v-model:model-value="tempSearchForm.cardTypeCode"
              placeholder="请选择证照类型"
              allow-clear
            >
              <a-option v-for="(value, key) of staffTypeMenu" :value="key">
                {{ value }}
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="status" label="是否有效">
            <a-select
              v-model:model-value="tempSearchForm.status"
              placeholder="请选择是否有效"
              allow-clear
            >
              <a-option :value="0">无效</a-option>
              <a-option :value="1">有效</a-option>
            </a-select>
          </a-form-item>
        </a-form>
      </template>
      <template #headerBtn>
        <a-space direction="vertical" :span="[0, 10]">
          <a-button
            type="primary"
            @click="
              () => {
                selectForm = tempSearchForm;
                getStaffCertificateData();
              }
            "
          >
            <icon-search class="icon" />
            查询
          </a-button>
          <a-button @click="resetSelectForm">
            <icon-refresh class="icon" />
            重置
          </a-button>
        </a-space>
      </template>
      <template #primaryBtn>
        <a-space>
          <a-button
            v-permission="'StaffCollectAdd'"
            type="primary"
            @click="toEditPage('add')"
          >
            <icon-plus class="icon" />
            新增
          </a-button>
        </a-space>
      </template>
      <template #minorBtn>
        <a-space>
          <icon-refresh class="minor-icon" size="20" @click="refresh" />
        </a-space>
      </template>

      <template #table>
        <a-table
          :data="staffCertificateData.list"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #cardTypeCode="{ record }">
            {{
              staffTypeMenu[record.cardTypeCode as keyof typeof staffTypeMenu]
            }}
          </template>
          <template #status="{ record }">
            <div style="color: rgb(var(--green-6))" v-if="record.status"
              >有效</div
            >
            <div style="color: red" v-if="!record.status">无效</div>
          </template>
          <template #nextReviewDate="{ record }">
            {{ dayjs(record.nextReviewDate).format('YYYY-MM-DD') }}
          </template>
          <template #effectiveEndDate="{ record }">
            {{ dayjs(record.effectiveEndDate).format('YYYY-MM-DD') }}
          </template>
          <template #option="{ record }">
            <a-button
              v-permission="'StaffCollectEdit'"
              type="text"
              size="mini"
              @click="toEditPage('edit', record.id, record.employeeId)"
            >
              编辑
            </a-button>
            <a-button type="text" size="mini" @click="toViewPage(record.id)">
              查看
            </a-button>
            <a-button
              v-permission="'StaffCollectDelete'"
              type="text"
              status="danger"
              size="mini"
              @click="deleteRow(record.id, record.cardName)"
            >
              删除
            </a-button>
          </template>
        </a-table>
      </template>
      <template #pagination>
        <a-pagination
          :current="selectForm.pageNo"
          :page-size="selectForm.pageSize"
          show-total
          show-page-size
          :page-size-options="[10, 20, 50, 100]"
          :base-size="3"
          :buffer-size="1"
          :total="(staffCertificateData.total as number)"
          @change="currentChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>
  </div>
</template>

<script lang="ts">
  import { ref, h, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import dayjs from 'dayjs';
  import { Message, Modal } from '@arco-design/web-vue';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { useUserStore } from '@/store';
  import {
    getStaffCertificateListAPI,
    deleteStaffCertificateAPI,
    getStaffCountAPI,
  } from '@/api/enterpriseManage';
  import { getEnumListAPI } from '@/api/index';
  import type { StaffCetificateData } from '@/views/enterpriseManage/certificate/index';
  import type { GetStaffCertificateList } from '@/api/enterpriseManage';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { handleOnKeyup } from '@/utils/event';
  export default {
    name: 'StaffCollect',
  };
</script>

<script lang="ts" setup>
  const router = useRouter();
  const userStore = useUserStore();
  const staffTypeMenu = ref();
  const enumList = async () => {
    const { data } = await getEnumListAPI('EMPLOYEE_CERT_TYPE');
    staffTypeMenu.value = data;
  };

  enumList();

  // ----------------- 前置数据 -----------------
  const staffCount = ref<any>({});

  const getStaffCount = async () => {
    const { data } = await getStaffCountAPI();
    staffCount.value = data;
  };

  getStaffCount();

  // ----------------- 查询-------------------------------

  const selectForm = ref<GetStaffCertificateList>({
    pageNo: 1,
    pageSize: 10,
    queryCondition: 1,
    enterpriseId: userStore.userInfo.enterpriseId as string,
  });
  const tempSearchForm = ref<GetStaffCertificateList>({
    pageNo: 1,
    pageSize: 10,
    queryCondition: 1,
    enterpriseId: userStore.userInfo.enterpriseId as string,
  });
  const selectFormDom = ref();

  const getStaffCertificateData = async (queryCondition?: number) => {
    if (queryCondition) {
      selectFormDom.value.resetFields();
      selectForm.value.queryCondition = queryCondition;
    }
    selectForm.value.queryCondition = queryCondition || 1;
    const { data: res } = await getStaffCertificateListAPI(selectForm.value);

    staffCertificateData.value = res;
  };

  const resetSelectForm = async () => {
    selectFormDom.value.resetFields();
    tempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
      queryCondition: 1,
      enterpriseId: userStore.userInfo.enterpriseId as string,
    };
    getStaffCertificateData();
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getStaffCertificateData();
    });
  });
  // ----------------- table -------------------------

  const staffCertificateData = ref<StaffCetificateData>({
    list: [],
    total: 0,
  });
  const columns: TableColumnData[] = [
    {
      title: '序号',
      width: 60,
      slotName: 'number',
    },
    {
      title: '员工姓名',
      width: 100,
      dataIndex: 'employeeName',
      cellStyle: { width: '8%' },
    },
    {
      title: '手机号码',
      dataIndex: 'tel',
    },
    {
      title: '证照名称',
      width: 100,
      dataIndex: 'cardName',
      cellStyle: { width: '8%' },
    },

    {
      title: '证照类型',
      slotName: 'cardTypeCode',
      dataIndex: 'cardTypeCode',
    },
    {
      title: '证照号码',
      dataIndex: 'cardNo',
    },
    {
      title: '是否有效',
      width: 100,
      slotName: 'status',
      dataIndex: 'status',
      cellStyle: { width: '8%' },
    },
    {
      title: '有效截止日期',
      slotName: 'effectiveEndDate',
      dataIndex: 'effectiveEndDate',
    },
    {
      title: '下次复审日期',
      slotName: 'nextReviewDate',
      dataIndex: 'nextReviewDate',
    },

    {
      title: '操作',
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];

  getStaffCertificateData();

  const toEditPage = (type: string, id?: string, employeeId?: string) => {
    router.push({
      name: 'StaffCollectAdd',
      query: {
        id,
        employeeId,
        type,
      },
    });
  };

  const toViewPage = (id: string) => {
    router.push({
      name: 'StaffCollectView',
      query: {
        id,
      },
    });
  };

  const refresh = async () => {
    getStaffCertificateData();
  };

  const deleteRow = (id: string, name: string) => {
    Modal.open({
      title: '提示',
      content: () =>
        h(ConfirmModalBody, {
          text: name,
          info: '删除数据不可恢复，请谨慎操作！',
        }),
      titleAlign: 'start',
      onOk: async () => {
        await deleteStaffCertificateAPI(id);
        Message.success({
          content: '删除成功',
        });
        let totalPage = Math.ceil(
          (staffCertificateData.value.total! - 1) / selectForm.value.pageSize!
        );
        let currentPage =
          selectForm.value.pageNo! > totalPage
            ? totalPage
            : selectForm.value.pageNo;
        selectForm.value.pageNo = currentPage! < 1 ? 1 : currentPage;
        getStaffCertificateData();
      },
    });
  };

  // ------------------ 分页 ----------------------
  const currentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getStaffCertificateData();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getStaffCertificateData();
  };
</script>

<style lang="less" scoped>
  .arco-card.card-table {
    min-height: 84%;
  }
  .guide {
    margin-bottom: 12px;
    .item {
      display: flex;
      cursor: pointer;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 110px;
      height: 70px;
      border-radius: 10px;
      border: 1px solid var(--color-border);
      background-color: var(--bg2);
      &.active {
        border: 1px solid var(--color-blue);
        background: var(--color-bg-active);
      }
      font-size: 14px;
      &.normal {
        color: rgb(var(--arcoblue-6));
      }
      &.success {
        color: rgb(var(--green-6));
      }
      &.danger {
        color: rgb(var(--red-6));
      }
      &.warning {
        color: rgb(var(--orange-6));
      }
      .number {
        margin-bottom: 6px;
        font-size: 24px;
        font-weight: 700;
      }
      .text {
        color: var(--color-text-grey);
        font-size: 14px;
      }
    }
  }
</style>
