<!-- 企业管理--工种管理 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
          <a-form-item field="name" label="部门名称">
            <a-input
              v-model:model-value="tempSearchForm.name"
              placeholder="请输入部门名称"
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
                getWorkTypeData();
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
          <a-button type="primary" @click="toEditPage('add')">
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
          :data="workTypeData.list"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #option="{ record }">
            <a-button
              type="text"
              size="mini"
              @click="toEditPage('edit', record.id)"
            >
              编辑
            </a-button>
            <a-button
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
          :total="(workTypeData.total as number)"
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
  import {
    getWorkTypeDataAPI,
    deleteWorkTypeAPI,
  } from '@/api/enterpriseManage';
  import type { WorkTypeData } from '@/views/enterpriseManage/workType/index';
  import type { GetSafeDeptData } from '@/api/enterpriseManage';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { handleOnKeyup } from '@/utils/event';
  export default {
    name: 'WorkType',
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

  const getWorkTypeData = async () => {
    const { data: res } = await getWorkTypeDataAPI(selectForm.value);
    workTypeData.value = res;
  };

  const resetSelectForm = () => {
    selectFormDom.value.resetFields();
    tempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
      enterpriseId: userStore.userInfo.enterpriseId as string,
    };
    getWorkTypeData();
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getWorkTypeData();
    });
  });
  // ----------------- table -------------------------

  const workTypeData = ref<WorkTypeData>({ list: [], total: 0 });
  const columns: TableColumnData[] = [
    {
      title: '序号',
      width: 80,
      slotName: 'number',
    },
    {
      title: '工种名称',
      dataIndex: 'name',
    },

    {
      title: '相关职业病',
      width: 800,
      dataIndex: 'odDiseasesTypeText',
    },

    {
      title: '操作',
      width: 140,
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];

  getWorkTypeData();

  const toEditPage = (type: string, id?: string) => {
    router.push({
      name: 'WorkTypeEdit',
      query: {
        id,
        type,
      },
    });
  };

  const refresh = async () => {
    getWorkTypeData();
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
        await deleteWorkTypeAPI(id);
        Message.success({
          content: '删除成功',
        });
        let totalPage = Math.ceil(
          (workTypeData.value.total! - 1) / selectForm.value.pageSize!
        );
        let currentPage =
          selectForm.value.pageNo! > totalPage
            ? totalPage
            : selectForm.value.pageNo;
        selectForm.value.pageNo = currentPage! < 1 ? 1 : currentPage;
        getWorkTypeData();
      },
    });
  };

  // ------------------ 分页 ----------------------
  const currentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getWorkTypeData();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getWorkTypeData();
  };
</script>

<style lang="less" scoped></style>
