<!-- 风险管控--事故类型 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
          <a-form-item field="accTypeCode" label="事故类型名称">
            <a-select
              v-model:model-value="tempSearchForm.accTypeCode"
              :options="accidentNameData.list"
              :fallback-option="false"
              allow-search
              allow-clear
              placeholder="请选择事故类型名称"
              :field-names="{
                value: 'accTypeCode',
                label: 'accTypeName',
              }"
              @change="accidentChange"
            >
            </a-select>
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
                getAccidentTypeData();
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
            v-permission="'AccidentTypeAdd'"
            type="primary"
            @click="addOrEditClick('add')"
          >
            <icon-plus class="icon" />
            新增
          </a-button>
          <a-button type="primary" @click="openDrawer">
            从行业公有库中引用
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
          :data="accidentTypeData.list"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #option="{ record }">
            <a-button
              v-permission="'AccidentTypeEdit'"
              type="text"
              size="mini"
              @click="addOrEditClick('edit', record.id)"
              >编辑</a-button
            >
            <a-button
              v-permission="'AccidentTypeDelete'"
              type="text"
              status="danger"
              size="mini"
              @click="deleteRow(record.accTypeName, record.id)"
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
          :total="(accidentTypeData.total as number)"
          @change="currentChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>

    <!--  新增/编辑 -->
    <a-modal
      :visible="showAddModal"
      :title="modalTitle"
      :modal-style="{ width: '600px', maxHeight: '900px', overflow: 'auto' }"
      title-align="start"
      ok-text="保存"
      @cancel="handleClose"
      @ok="submit"
    >
      <a-form ref="form" :model="formData">
        <a-form-item
          field="accTypeCode"
          label="事故类型名称"
          required
          :rules="rules.accTypeCode"
        >
          <a-select
            v-model:model-value="formData.accTypeCode"
            :disabled="disabled"
            :options="accidentTypeList"
            :fallback-option="false"
            allow-search
            allow-clear
            placeholder="请选择事故类型名称"
            :field-names="{
              value: 'accTypeCode',
              label: 'accTypeName',
            }"
            @change="accidentChange"
          >
          </a-select>
        </a-form-item>
        <a-form-item field="accTypeCode" label="事故类型编码">
          <a-input
            v-model.trim="formData.accTypeCode"
            disabled
            placeholder="事故类型编码"
          ></a-input>
        </a-form-item>
        <a-form-item
          field="disposalMeth"
          label="应急处置措施"
          :rules="rules.disposalMeth"
        >
          <a-textarea
            v-model.trim="formData.disposalMeth"
            :auto-size="{ maxRows: 6, minRows: 6 }"
            :max-length="500"
            show-word-limit
            placeholder="请输入应急处置措施"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 行业共有库 / 抽屉 -->
    <a-drawer
      :width="600"
      :visible="drawerVisibale"
      class="accidentTypeDrawer"
      unmount-on-close
      @ok="drawerOk"
      @cancel="drawerCancel"
    >
      <template #title> 事故类型引用 </template>
      <TableListCard>
        <template #headerInput>
          <a-space>
            <a-input
              v-model.trim="drawerTempSearchForm.accTypeName"
              placeholder="请输入事故类型名称"
              allow-clear
            ></a-input>
          </a-space>
        </template>
        <template #headerBtn>
          <a-space>
            <a-button
              type="primary"
              @click="
                () => {
                  drawerSelectForm = drawerTempSearchForm;
                  getPublicAccidentData();
                }
              "
            >
              <icon-search class="icon" />
              查询
            </a-button>
          </a-space>
        </template>

        <template #table>
          <a-table
            v-model:selected-keys="selectKeys"
            :data="publicAccidentData.list"
            row-key="id"
            :columns="drawerColumns"
            :bordered="false"
            :pagination="false"
            :row-selection="{
              type: 'checkbox',
              width: 60,
              onlyCurrent: false,
              showCheckedAll: true,
            }"
            @select="selectionChange"
            @select-all="selectionAllChange"
          >
          </a-table>
        </template>
        <template #pagination>
          <a-pagination
            :current="drawerSelectForm.pageNo"
            :page-size="drawerSelectForm.pageSize"
            show-total
            show-page-size
            :page-size-options="[10, 20, 50, 100]"
            :base-size="3"
            :buffer-size="1"
            :total="(publicAccidentData.total as number)"
            @change="drawerCurrentChange"
            @page-size-change="drawerPageSizeChange"
          ></a-pagination>
        </template>
      </TableListCard>
    </a-drawer>
  </div>
</template>

<script lang="ts">
  import { ref, h, computed, onMounted } from 'vue';
  import { Message, Modal } from '@arco-design/web-vue';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { useUserStore } from '@/store';
  import {
    getAccidentTypeListAPI,
    getPublicAccidentTypeListAPI,
    detailAccidentTypeAPI,
    addAccidentTypeAPI,
    updateAccidentTypeAPI,
    deleteAccidentTypeAPI,
    getPublicAccidentTypeListFilterAPI,
    getPublicAccidentTypeListFilterAllAPI,
    batchCreateAccidentType,
  } from '@/api/risk';
  import type { GetAccidentTypeListBody, AccidentTypeBody } from '@/api/risk';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { AccidentTypeData } from './index';
  import { handleOnKeyup } from '@/utils/event';

  export default {
    name: 'AccidentType',
  };
</script>

<script lang="ts" setup>
  const userStore = useUserStore();

  // -------------------搜索--------------------------
  const selectForm = ref<GetAccidentTypeListBody>({
    pageNo: 1,
    pageSize: 10,
  });
  const tempSearchForm = ref<GetAccidentTypeListBody>({
    pageNo: 1,
    pageSize: 10,
  });
  const selectFormDom = ref();
  const accidentTypeData = ref<AccidentTypeData>({ list: [], total: 10 });
  const accidentTypeList = ref<any[]>([]);

  const getAccidentTypeData = async () => {
    const { data } = await getAccidentTypeListAPI(selectForm.value);
    accidentTypeData.value = data;
  };

  const getAccidentTypeList = async () => {
    const { data } = await getPublicAccidentTypeListFilterAllAPI();
    accidentTypeList.value = data;
  };

  getAccidentTypeData();
  getAccidentTypeList();

  const resetSelectForm = async () => {
    selectFormDom.value.resetFields();
    selectForm.value.accTypeName = '';
    tempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
    };
    getAccidentTypeData();
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      if (drawerVisibale.value) {
        drawerSelectForm.value = drawerTempSearchForm.value;
        getPublicAccidentData();
      } else {
        selectForm.value = tempSearchForm.value;
        getAccidentTypeData();
      }
    });
  });

  const getAcctypeNameData = async () => {
    const { data } = await getPublicAccidentTypeListAPI({
      pageNo: 1,
      pageSize: 100,
    });
    accidentNameData.value = data;
  };

  getAcctypeNameData();
  // -----------------------表格-----------------------

  const columns: TableColumnData[] = [
    {
      title: '事故类型编码',
      dataIndex: 'accTypeCode',
      width: 120,
    },
    {
      title: '事故类型名称',
      dataIndex: 'accTypeName',
      width: 120,
    },
    {
      title: '应急处置措施',
      dataIndex: 'disposalMeth',
    },
    {
      title: '操作',
      width: 140,
      align: 'center',
      slotName: 'option',
    },
  ];

  const refresh = async () => {
    getAccidentTypeData();
  };

  const deleteRow = (name: string, id: string) => {
    Modal.open({
      title: '提示',
      titleAlign: 'start',
      content: () =>
        h(ConfirmModalBody, {
          text: name,
          info: '删除数据不可恢复，请谨慎操作！',
        }),
      onOk: async () => {
        await deleteAccidentTypeAPI(id);
        Message.success({
          content: '删除成功',
        });
        let totalPage = Math.ceil(
          (accidentTypeData.value.total! - 1) / selectForm.value.pageSize!
        );
        let currentPage =
          selectForm.value.pageNo! > totalPage
            ? totalPage
            : selectForm.value.pageNo;
        selectForm.value.pageNo = currentPage! < 1 ? 1 : currentPage;
        getAccidentTypeData();
      },
    });
  };
  // ---------------新增/编辑------------------

  const modalType = ref('');
  const showAddModal = ref(false);
  const formData = ref<AccidentTypeBody>({
    accTypeCode: '',
    accTypeName: '',
    disposalMeth: '',
    tenantId: userStore.tenantId as string,
  });
  const form = ref();

  const modalTitle = computed(() =>
    modalType.value === 'add' ? '新增事故类型' : '编辑事故类型'
  );
  const disabled = computed(() => modalType.value === 'edit');
  const accidentNameData = ref<AccidentTypeData>({ list: [], total: 10 });

  const rules = ref({
    // accTypeName: [{ required: true, message: '请选择事故类型名称' }],
    accTypeCode: [{ required: true, message: '请选择事故类型名称' }],
    disposalMeth: [{ required: true, message: '请输入应急处置措施' }],
  });

  const addOrEditClick = async (type: string, id?: string) => {
    modalType.value = type;
    showAddModal.value = true;

    if (id) {
      const { data: res } = await detailAccidentTypeAPI({ id: id as string });
      formData.value = res;
    }
  };

  const accidentChange = (
    value:
      | string
      | number
      | Record<string, any>
      | (string | number | Record<string, any>)[]
  ) => {
    const item = accidentNameData.value.list.find(
      (item: any) => item.accTypeCode === (value as string)
    );
    tempSearchForm.value.accTypeName = item?.accTypeName;
    selectForm.value.accTypeName = item?.accTypeName;
    formData.value.accTypeName = item?.accTypeName;
  };

  const submit = async () => {
    const value = await form.value.validate();
    if (value) return;
    modalType.value === 'add' ? await addSubmit() : await updateSubmit();
    handleClose();
  };

  const addSubmit = async () => {
    await addAccidentTypeAPI(formData.value);
    Message.success({
      content: '新增成功',
    });
    resetSelectForm();
  };

  const updateSubmit = async () => {
    await updateAccidentTypeAPI(formData.value);
    Message.success({
      content: '编辑成功',
    });
    getAccidentTypeData();
  };

  const handleClose = () => {
    form.value.resetFields();
    showAddModal.value = false;
  };

  // ------------------- 抽屉 -------------------------

  const drawerVisibale = ref(false);
  const drawerSelectForm = ref<GetAccidentTypeListBody>({
    pageNo: 1,
    pageSize: 10,
  });
  const drawerTempSearchForm = ref<GetAccidentTypeListBody>({
    pageNo: 1,
    pageSize: 10,
  });
  const publicAccidentData = ref<any>({ list: [], total: 0 });
  const drawerColumns: TableColumnData[] = [
    {
      title: '编码',
      dataIndex: 'accTypeCode',
    },
    {
      title: '事故类型名称',
      dataIndex: 'accTypeName',
    },
    {
      title: '应急处置措施',
      width: 200,
      dataIndex: 'disposalMeth',
    },
  ];
  const selectKeys = ref<string[]>([]);
  const allTableData = ref<any[]>([]);

  const deduplicateByProperty = (arr: any[], property: string) => {
    return arr.reduce((uniqueArr, item) => {
      if (!uniqueArr.some((i: any) => i[property] === item[property])) {
        uniqueArr.push(item);
      }
      return uniqueArr;
    }, []);
  };

  const getPublicAccidentData = async () => {
    const { data } = await getPublicAccidentTypeListAPI(drawerSelectForm.value);
    publicAccidentData.value = data;
    allTableData.value = deduplicateByProperty(
      [...data.list, ...allTableData.value],
      'id'
    );
  };

  const openDrawer = async () => {
    drawerVisibale.value = true;
    getPublicAccidentData();
  };

  const drawerOk = async () => {
    // const result = publicAccidentData.value.list.find(
    //   (item: any) => item.id === selectKeys.value[0]
    // );
    // if (result) formData.value = result;
    // formData.value.tenantId = userStore.tenantId as string;
    // formData.value.id = undefined;
    const params = allTableData.value
      .filter((ele: any) => {
        return selectKeys.value.includes(ele.id);
      })
      .map((ele: any) => ({
        ...ele,
        id: undefined,
      }));
    const { code, data } = await batchCreateAccidentType(params);
    if (code === 0) {
      Message.success(data);
    }
    getAccidentTypeData();
    drawerCancel();
  };

  const drawerCancel = () => {
    drawerSelectForm.value = drawerTempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
    };
    selectKeys.value = [];
    drawerVisibale.value = false;
  };

  const drawerCurrentChange = (current: number) => {
    drawerSelectForm.value.pageNo = current;
    getPublicAccidentData();
  };

  const drawerPageSizeChange = (pageSize: number) => {
    drawerSelectForm.value.pageSize = pageSize;
    getPublicAccidentData();
  };
  // ------------------ 分页 ----------------------

  const currentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getAccidentTypeData();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getAccidentTypeData();
  };

  const selectionChange = (rowKeys: any[], rowKey: any) => {
    if (selectKeys.value.includes(rowKey)) {
      const index = selectKeys.value.findIndex(
        (item: string) => item === rowKey
      );
      selectKeys.value.splice(index, 1);
    } else {
      selectKeys.value.push(rowKey);
    }
  };

  const selectionAllChange = (checked: Boolean) => {
    const ids = publicAccidentData.value.list!.map((item: any) => item.id);
    if (checked) {
      selectKeys.value.push(...ids);
    } else {
      selectKeys.value = selectKeys.value.filter((ele) => !ids.includes(ele));
    }
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
  .tip {
    display: flex;
    margin-bottom: 20px;
    justify-content: flex-end;
  }
</style>
<style lang="less">
  .accidentTypeDrawer {
    .arco-drawer-body .arco-card-bordered {
      border: none;
      .arco-card-body {
        padding: 0;
      }
    }

    .arco-drawer-footer {
      border-top: none;
    }
  }
</style>
