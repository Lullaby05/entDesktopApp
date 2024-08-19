<!-- 企业管理--岗位管理 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
          <a-form-item field="jobName" label="岗位名称">
            <a-input
              v-model.trim="tempSearchForm.jobName"
              allow-clear
              placeholder="请输入岗位名称"
            ></a-input>
          </a-form-item>
          <a-form-item field="deptId" label="所属部门">
            <a-tree-select
              v-model:model-value="tempSearchForm.deptId"
              :data="deptData"
              allow-search
              allow-clear
              :disable-filter="true"
              :field-names="{
                key: 'id',
                title: 'name',
              }"
              placeholder="请选择所属部门"
              @search="onDeptSearch"
              @blur="clearSearchKey"
              @clear="clearSearchKey"
            ></a-tree-select>
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
                getPostData();
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
            v-permission="'PostManageAddPermission'"
            type="primary"
            @click="openModal('add')"
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
          :data="postData.list"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>

          <template #option="{ record }">
            <a-button
              v-permission="'PostManageEditPermission'"
              type="text"
              size="mini"
              @click="openModal('edit', record.id)"
            >
              编辑
            </a-button>
            <a-button
              v-permission="'PostManageDeletePermission'"
              type="text"
              status="danger"
              size="mini"
              @click="deleteRow(record.id, record.jobName)"
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
          :total="(postData.total as number)"
          @change="currentChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>

    <!-- 弹窗 -->
    <a-modal
      :visible="visible"
      :width="600"
      ok-text="保存"
      title-align="start"
      :title="modalTitle"
      @ok="submitModal"
      @cancel="closeModal"
    >
      <a-form ref="form" :model="formData" :rules="rules">
        <a-form-item field="jobName" label="岗位名称" required>
          <a-input
            v-model:model-value="formData.jobName"
            placeholder="请输入岗位名称"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="deptId" label="所属部门" required>
          <a-tree-select
            :disabled="!!formData.id"
            v-model:model-value="formData.deptId"
            :fallback-option="false"
            :data="deptData"
            allow-search
            allow-clear
            :disable-filter="true"
            :field-names="{
              key: 'id',
              title: 'name',
            }"
            placeholder="请选择所属部门"
            @search="onDeptSearch"
            @blur="clearSearchKey"
            @clear="clearSearchKey"
          ></a-tree-select>
        </a-form-item>
        <a-form-item field="jobDesc" label="岗位描述">
          <a-textarea
            v-model:model-value="formData.jobDesc"
            placeholder="请输入岗位描述"
            :auto-size="{ maxRows: 6, minRows: 6 }"
            show-word-limit
            :max-length="300"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { ref, h, computed, onMounted } from 'vue';
  import { cloneDeep } from 'lodash';
  import { Message, Modal } from '@arco-design/web-vue';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { useUserStore } from '@/store';
  import {
    getOrganizationTreeAPI,
    getPostDataAPI,
    addPostDataAPI,
    detailPostDataAPI,
    updatePostDataAPI,
    deletePostDataAPI,
  } from '@/api/enterpriseManage';
  import type { GetPostList, AddPostData } from '@/api/enterpriseManage';
  import { OrganizationTreeData } from '@/store/modules/enterprise/types';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import type { PostData } from './index';
  import { handleOnKeyup } from '@/utils/event';
  export default {
    name: 'PostManage',
  };
</script>

<script lang="ts" setup>
  const userStore = useUserStore();

  // ----------------- 前置数据 -----------------------
  const deptData = ref<OrganizationTreeData[]>([]);

  let depatTree: OrganizationTreeData[] = [];

  const getDeptData = async () => {
    const { data } = await getOrganizationTreeAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    data;
    deptData.value = data;
    depatTree = cloneDeep(deptData.value);
  };

  getDeptData();

  // ----------------- 查询-------------------------------
  const selectForm = ref<GetPostList>({
    pageNo: 1,
    pageSize: 10,
    enterpriseId: userStore.userInfo.enterpriseId as string,
  });
  const tempSearchForm = ref<GetPostList>({
    pageNo: 1,
    pageSize: 10,
    enterpriseId: userStore.userInfo.enterpriseId as string,
  });
  const selectFormDom = ref();

  const getPostData = async () => {
    const { data: res } = await getPostDataAPI(selectForm.value);
    postData.value = res;
  };

  const resetSelectForm = async () => {
    selectFormDom.value.resetFields();
    tempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
      enterpriseId: userStore.userInfo.enterpriseId as string,
    };
    getPostData();
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getPostData();
    });
  });

  // ----------------- table -------------------------

  const postData = ref<PostData>({ list: [], total: 0 });
  const columns: TableColumnData[] = [
    {
      title: '序号',
      width: 60,
      slotName: 'number',
    },
    {
      title: '岗位名称',
      width: 240,
      dataIndex: 'jobName',
      cellStyle: { width: '19%' },
    },

    {
      title: '所属部门',
      dataIndex: 'deptName',
    },
    {
      title: '岗位描述',
      dataIndex: 'jobDesc',
      width: 500,
      cellStyle: { width: '39%' },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },

    {
      title: '操作',
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];

  getPostData();

  const refresh = async () => {
    getPostData();
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
        await deletePostDataAPI(id);
        // console.log('删除部门', res);
        Message.success({
          content: '删除成功',
        });
        let totalPage = Math.ceil(
          (postData.value.total! - 1) / selectForm.value.pageSize!
        );
        let currentPage =
          selectForm.value.pageNo! > totalPage
            ? totalPage
            : selectForm.value.pageNo;
        selectForm.value.pageNo = currentPage! < 1 ? 1 : currentPage;
        getPostData();
      },
    });
  };

  // ------------------ 分页 ----------------------
  const currentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getPostData();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getPostData();
  };

  // -------------- 树形下拉  搜索 start-----------------

  function searchData(keyword: string) {
    const loop = (data: any) => {
      const result: OrganizationTreeData[] = [];
      data.forEach((item: any) => {
        if (item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
          result.push({ ...item });
        } else if (item.children) {
          const filterData = loop(item.children);
          if (filterData.length) {
            result.push({
              ...item,
              children: filterData,
            });
          }
        }
      });
      // console.log(result);

      return result;
    };

    return loop(depatTree);
  }

  const onDeptSearch = (searchKey: string) => {
    setTimeout(() => {
      deptData.value = searchData(searchKey);
    }, 200);
  };

  const clearSearchKey = () => {
    onDeptSearch('');
  };
  // -------------- 树形下拉  搜索 end-----------------

  // --------------------- 弹窗 -------------------------
  const visible = ref(false);
  const modalType = ref('');
  const modalTitle = computed(() =>
    modalType.value === 'add' ? '新增岗位' : '编辑岗位'
  );
  const formData = ref<AddPostData>({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    deptId: '',
    jobName: '',
  });
  const form = ref();

  const rules = ref({
    jobName: [
      { required: true, message: '请输入岗位名称' },
      { maxLength: 20, message: '不能超过20字符' },
    ],
    deptId: [{ required: true, message: '请选择所属部门' }],
  });

  const openModal = async (type: string, id?: string) => {
    modalType.value = type;
    visible.value = true;
    if (type === 'edit') {
      const { data: res } = await detailPostDataAPI({
        enterpriseId: userStore.userInfo.enterpriseId as string,

        id: id as string,
      });
      formData.value = res;
    }
  };

  const submitModal = async () => {
    const value = await form.value.validate();
    if (value) return;
    modalType.value === 'add' ? await addSubmit() : await updateSubmit();
    closeModal();
  };

  const closeModal = () => {
    visible.value = false;
    form.value.resetFields();
    formData.value = {
      enterpriseId: userStore.userInfo.enterpriseId as string,
      deptId: '',
      jobName: '',
    };
  };

  const addSubmit = async () => {
    await addPostDataAPI(formData.value);
    await resetSelectForm();
    getPostData();
    Message.success({
      content: '新增成功',
    });
  };

  const updateSubmit = async () => {
    await updatePostDataAPI(formData.value);
    getPostData();
    Message.success({
      content: '编辑成功',
    });
  };
</script>

<style lang="less" scoped>
  :deep(.arco-table-td-content) {
    white-space: pre-wrap;
  }
</style>
