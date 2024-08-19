<!-- 隐患管理--排查表管理 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form :model="selectForm" layout="inline">
          <a-form-item field="checkName" label="排查表名称">
            <a-input
              v-model="selectForm.checkName"
              allow-clear
              placeholder="请输入排查表名称"
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
        </a-space>
      </template>
      <template #primaryBtn>
        <a-space>
          <a-button
            v-permission="'FormulateChecklistDetailAdd'"
            type="primary"
            @click="toAddPage('add')"
          >
            <icon-plus class="icon" />
            新增
          </a-button>
          <a-button
            type="primary"
            @click="
              downloadFile(
                'https://business.api.xkrsecure.com/exportFiles/01每天安全检查.doc'
              )
            "
            >导出</a-button
          >
        </a-space>
      </template>
      <template #minorBtn>
        <a-space>
          <icon-refresh class="minor-icon" size="20" @click="getTableList" />
        </a-space>
      </template>
      <template #table>
        <a-table
          :data="formulateData.list"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #option="{ record }">
            <a-button
              v-if="!record.status"
              type="text"
              size="mini"
              @click="toggleStatus(record)"
              >启用</a-button
            >
            <a-button
              v-if="record.status"
              type="text"
              size="mini"
              status="danger"
              @click="toggleStatus(record)"
              >停用</a-button
            >
            <a-button
              v-permission="'FormulateChecklistFormContent'"
              type="text"
              size="mini"
              @click="toCheckContent('content', record)"
            >
              排查内容
            </a-button>
            <a-button
              v-permission="'FormulateChecklistFormForm'"
              type="text"
              size="mini"
              @click="toCheckContent('form', record)"
            >
              排查表单
            </a-button>
            <a-button
              v-permission="'FormulateChecklistDetailEdit'"
              type="text"
              size="mini"
              @click="toAddPage('edit', record)"
            >
              编辑
            </a-button>
            <a-button
              v-permission="'FormulateChecklistDetailDelete'"
              type="text"
              size="mini"
              status="danger"
              @click="deleteRow(record)"
              >删除</a-button
            >
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
          :total="(formulateData.total as number)"
          @change="pageChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>
  </div>
</template>

<script lang="ts" name="CheckListManage">
  import { Message, Modal } from '@arco-design/web-vue';
  import { ref, h, onMounted, onBeforeMount } from 'vue';
  import { useRouter } from 'vue-router';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import type {
    TableColumnData,
    TableData,
  } from '@arco-design/web-vue/es/table/interface';
  import { handleOnKeyup } from '@/utils/event';
  import { checkListDel, checkListEdit, getCheckList } from '@/api/pitfall';
  import { downloadFile } from '@/utils/utils';
  export default {
    // name: 'FormulateChecklist',
  };
</script>

<script lang="ts" setup>
  const formulateData = ref<{ total?: number; list?: TableData[] }>({
    total: 0,
    list: [],
  });
  // --------------------搜索---------------------
  const selectForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
  });
  const tempSearchForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
  });
  // --------------------表格---------------------
  const columns: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
      align: 'center',
    },
    {
      title: '排查表名称',
      dataIndex: 'checkName',
    },
    {
      title: '排查内容数',
      dataIndex: 'checkContent',
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
    },
    {
      title: '状态',
      dataIndex: 'statusName',
      bodyCellStyle(record) {
        return {
          color: record.status ? '#43cf7c' : '#f53f3f',
        };
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      // width: 330,
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];

  const router = useRouter();

  // 获取表格数据
  const getTableList = () => {
    const params = {
      ...selectForm.value,
      pageNo: selectForm.value.pageNo,
      pageSize: selectForm.value.pageSize,
    };
    getCheckList(params).then((res) => {
      formulateData.value.total = res.data.total;
      formulateData.value.list = res.data.list.map((ele: any) => {
        return {
          ...ele,
          statusName: ele.status ? '启用' : '停用',
        };
      });
    });
  };

  onBeforeMount(() => {
    getTableList();
  });

  onActivated(() => {
    getTableList();
  });

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getTableList();
    });
  });

  // 分页处理
  const pageChange = (currentPage: Number) => {
    selectForm.value.pageNo = currentPage;
    getTableList();
  };
  const pageSizeChange = (currentPageSize: Number) => {
    selectForm.value.pageSize = currentPageSize;
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

  const toAddPage = (type: string, row?: any) => {
    const query = row ? { type, id: row.id } : { type };
    router.push({
      name: 'FormulateChecklistDetail',
      query,
    });
  };
  const toCheckContent = (type: string, record: any) => {
    if (record.checkContent < 1) {
      Message.warning({
        content: '该排查表下无排查内容',
      });
      return;
    }
    router.push({
      name: 'FormulateChecklistForm',
      query: {
        type,
        checkContentIds: record.checkContentIds,
        checkName: record.checkName,
      },
    });
  };
  const deleteRow = (row: any) => {
    Modal.open({
      title: '提示',
      content: () =>
        h(ConfirmModalBody, {
          text: row.checkName,
        }),
      titleAlign: 'start',
      onOk: async () => {
        await checkListDel(row.id);
        Message.success({
          content: '删除成功',
        });
        let totalPage = Math.ceil(
          (formulateData.value.total! - 1) / selectForm.value.pageSize
        );
        let currentPage =
          selectForm.value.pageNo > totalPage
            ? totalPage
            : selectForm.value.pageNo;
        selectForm.value.pageNo = currentPage < 1 ? 1 : currentPage;
        getTableList();
      },
    });
  };

  const toggleStatus = async (form: any) => {
    await checkListEdit({
      ...form,
      status: form.status ? 0 : 1,
    });
    Message.success({
      content: `${form.status ? '停用' : '启用'}成功`,
    });
    getTableList();
  };
</script>

<style lang="less" scoped></style>
