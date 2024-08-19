<!-- 企业管理--安全部门管理 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
          <a-form-item field="name" label="安全部门名称">
            <a-input
              v-model:model-value="tempSearchForm.name"
              placeholder="请输入安全部门名称"
              allow-clear
            ></a-input>
          </a-form-item>
        </a-form>
      </template>
      <template #headerBtn>
        <a-space>
          <a-button
            type="primary"
            @click="
              () => {
                selectForm = tempSearchForm;
                getSecurityDepartmentTree();
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
            v-permission="'securityDepartmentAddPermission'"
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
          :data="safeDeptData.list"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>

          <template #employeeCount="{ record }">
            <a-button type="text" @click="toStaffManage(record.id)">{{
              record.count
            }}</a-button>
          </template>
          <template #createTime="{ record }">
            {{ record.createTime }}
          </template>
          <template #option="{ record }">
            <a-button
              v-permission="'securityDepartmentEditPermission'"
              type="text"
              size="mini"
              @click="toEditPage('edit', record.id)"
            >
              编辑
            </a-button>
            <a-button
              v-permission="'securityDepartmentDeletePermission'"
              type="text"
              status="danger"
              size="mini"
              @click="deleteRow(record.id, record.name)"
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
          :total="(safeDeptData.total as number)"
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
  import { Message, Modal } from '@arco-design/web-vue';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { useUserStore } from '@/store';
  import { getSafeDeptAPI, deleteSafeDeptAPI } from '@/api/enterpriseManage';
  import type { GetSafeDeptData } from '@/api/enterpriseManage';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import dayjs from 'dayjs';
  import type { SafeDeptData } from './index';
  import { handleOnKeyup } from '@/utils/event';
  export default {
    name: 'SecurityDepartment',
  };
</script>

<script lang="ts" setup>
  const router = useRouter();
  const userStore = useUserStore();

  // ----------------- 查询-------------------------------
  const selectForm = ref<GetSafeDeptData>({
    pageNo: 1,
    pageSize: 10,
    enterpriseId: userStore.userInfo.enterpriseId as string,
  });
  const tempSearchForm = ref<GetSafeDeptData>({
    pageNo: 1,
    pageSize: 10,
    enterpriseId: userStore.userInfo.enterpriseId as string,
  });
  const selectFormDom = ref();

  const getSecurityDepartmentTree = async () => {
    const { data: res } = await getSafeDeptAPI(selectForm.value);
    safeDeptData.value = res;
  };

  const resetSelectForm = () => {
    selectFormDom.value.resetFields();
    tempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
      enterpriseId: userStore.userInfo.enterpriseId as string,
    };
    getSecurityDepartmentTree();
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getSecurityDepartmentTree();
    });
  });
  // ----------------- table -------------------------

  const safeDeptData = ref<SafeDeptData>({ list: [], total: 0 });
  const columns: TableColumnData[] = [
    {
      title: '序号',
      width: 60,
      slotName: 'number',
    },
    {
      title: '安全部门名称',
      width: 240,
      dataIndex: 'name',
      cellStyle: { width: '19%' },
    },

    {
      title: '安全部门负责人',
      dataIndex: 'leaderName',
    },
    {
      title: '负责人手机号码',
      dataIndex: 'leaderTel',
    },
    {
      title: '次要负责人',
      dataIndex: 'leaderSecondName',
    },
    {
      title: '次要负责人手机号码',
      dataIndex: 'leaderSecondTel',
    },
    {
      title: '部门人数',
      slotName: 'employeeCount',
      dataIndex: 'count',
    },
    {
      title: '创建时间',
      slotName: 'createTime',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];

  getSecurityDepartmentTree();

  const toEditPage = (type: string, id?: string) => {
    router.push({
      name: 'SecurityDepartmentEdit',
      query: {
        id,
        type,
      },
    });
  };

  const refresh = async () => {
    getSecurityDepartmentTree();
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
        await deleteSafeDeptAPI(id);
        // console.log('删除部门', res);
        Message.success({
          content: '删除成功',
        });
        let totalPage = Math.ceil(
          (safeDeptData.value.total! - 1) / selectForm.value.pageSize!
        );
        let currentPage =
          selectForm.value.pageNo! > totalPage
            ? totalPage
            : selectForm.value.pageNo;
        selectForm.value.pageNo = currentPage! < 1 ? 1 : currentPage;
        getSecurityDepartmentTree();
      },
    });
  };

  const toStaffManage = (id: string) => {
    router.push({
      name: 'StaffManage',
      query: {
        safeDeptId: id,
      },
    });
  };

  // ------------------ 分页 ----------------------
  const currentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getSecurityDepartmentTree();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getSecurityDepartmentTree();
  };
</script>

<style lang="less" scoped></style>
