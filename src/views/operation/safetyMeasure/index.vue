<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form :model="tempSearchForm" layout="inline">
          <a-form-item field="operationType" label="作业类型">
            <a-select
              v-model="tempSearchForm.operationType"
              placeholder="请选择作业类型"
              allow-clear
              allow-search
            >
              <a-option
                v-for="item in operationTypeDict"
                :key="item.dictValue"
                :label="item.dictKey"
                :value="item.dictValue"
              ></a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="securityMeasure" label="安全措施">
            <a-input
              v-model="tempSearchForm.securityMeasure"
              allow-clear
              placeholder="请输入安全措施"
            ></a-input>
          </a-form-item>
        </a-form>
      </template>
      <template #headerBtn>
        <div class="header-btn">
          <a-space>
            <a-button
              type="primary"
              @click="
                () => {
                  searchForm = tempSearchForm;
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
        </div>
      </template>
      <template #primaryBtn>
        <a-space>
          <a-button
            v-permission="'OperationSafetyAdd'"
            type="primary"
            @click="modalVisible = true"
            ><icon-plus class="icon" />新增</a-button
          >
          <a-button
            v-permission="'OperationSafetyAdd'"
            type="primary"
            @click="openDrawer"
            >从公有库引用</a-button
          >
        </a-space>
      </template>
      <template #minorBtn>
        <a-space>
          <icon-refresh class="minor-icon" size="20" @click="" />
        </a-space>
      </template>
      <template #table>
        <a-table
          :data="tableData.list"
          row-key="id"
          :columns="tableColumns"
          :bordered="false"
          :pagination="false"
          @page-change="pageChange"
          @page-size-change="pageSizeChange"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #option="{ record }">
            <div>
              <a-button
                v-permission="'OperationSafetyEdit'"
                type="text"
                size="mini"
                @click="handleEdit(record)"
                >编辑</a-button
              >
              <a-button
                v-permission="'OperationSafetyDelete'"
                type="text"
                size="mini"
                status="danger"
                @click="handleDelete(record.securityMeasure, record.id)"
                >删除</a-button
              >
            </div>
          </template>
        </a-table>
      </template>
      <template #pagination>
        <a-pagination
          :current="searchForm.pageNo"
          :page-size="searchForm.pageSize"
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
      title-align="start"
      class="safetyMeasureModal"
      :visible="modalVisible"
      :title="modalTitle"
      ok-text="保存"
      @ok="onSave"
      @cancel="onClose"
    >
      <a-form ref="modalFormRef" :model="modalFormData">
        <a-form-item
          field="operationType"
          label="作业类型"
          :rules="modalFormRules.operationType"
        >
          <a-select
            v-model="modalFormData.operationType"
            placeholder="请选择作业类型"
            :disabled="modalFormData.id ? true : false"
            allow-clear
            allow-search
          >
            <a-option
              v-for="item in operationTypeDict"
              :key="item.dictValue"
              :label="item.dictKey"
              :value="item.dictValue"
            ></a-option>
          </a-select>
        </a-form-item>
        <a-form-item
          field="securityMeasure"
          label="安全措施"
          :rules="modalFormRules.securityMeasure"
        >
          <a-textarea
            v-model="modalFormData.securityMeasure"
            allow-clear
            show-word-limit
            :auto-size="{
              minRows: 6,
              maxRows: 6,
            }"
            :max-length="300"
            placeholder="请输入安全措施"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 行业共有库 / 抽屉 -->
    <a-drawer
      :width="600"
      :visible="drawerVisibale"
      class="safetyMeasureDrawer"
      unmount-on-close
      @ok="drawerOk"
      @cancel="drawerCancel"
    >
      <template #title> 安全措施引用 </template>
      <TableListCard>
        <template #headerInput>
          <a-space style="width: 100%">
            <a-select
              style="width: 200px"
              v-model="drawerTempSearchForm.operationType"
              placeholder="请选择作业类型"
              allow-clear
              allow-search
            >
              <a-option
                v-for="item in operationTypeDict"
                :key="item.dictValue"
                :label="item.dictKey"
                :value="item.dictValue"
              ></a-option>
            </a-select>
            <a-input
              style="width: 200px"
              v-model="drawerTempSearchForm.securityMeasure"
              allow-clear
              placeholder="请输入安全措施"
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
                  getPublicSafetyMeasureData();
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
            :data="publicSafetyMeasureData.list"
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
            :total="(publicSafetyMeasureData.total as number)"
            @change="drawerCurrentChange"
            @page-size-change="drawerPageSizeChange"
          ></a-pagination>
        </template>
      </TableListCard>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { onBeforeMount, onMounted, ref } from 'vue';
  import { getSafetyMeasureList } from '@/api/operation/safetyMeasure';
  import { TableColumnData, TableData } from '@arco-design/web-vue';
  import { useSafetyModal } from './composition/useSafetyMeasureModal';
  import { useSafetyDrawer } from './composition/useSafetyMeasureDrawer';
  import { operationTypeDict } from '../composition/useCertificateDict';
  import { handleOnKeyup } from '@/utils/event';

  const searchForm = ref({
    pageNo: 1,
    pageSize: 10,
    securityMeasure: '',
    operationType: '',
  });
  const tempSearchForm = ref({
    pageNo: 1,
    pageSize: 10,
    securityMeasure: '',
    operationType: '',
  });

  const tableData = ref<{ total: number; list: TableData[] }>({
    total: 0,
    list: [],
  });

  const tableColumns: TableColumnData[] = [
    {
      title: '序号',
      width: 60,
      slotName: 'number',
    },
    {
      title: '作业类型',
      dataIndex: 'operationTypeName',
      // width: 200,
      cellStyle: { width: '16%' },
    },
    {
      title: '安全措施',
      dataIndex: 'securityMeasure',
    },
    {
      title: '操作',
      // width: 200,
      slotName: 'option',
      align: 'center',
    },
  ];

  const getTableList = async () => {
    const { data } = await getSafetyMeasureList({
      ...searchForm.value,
    });
    tableData.value = data;
  };

  onBeforeMount(() => {
    getTableList();
  });

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      searchForm.value = tempSearchForm.value;
      getTableList();
    });
  });

  const pageChange = (pageNo: number) => {
    searchForm.value.pageNo = pageNo;
    getTableList();
  };

  const handleReset = () => {
    tempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
      securityMeasure: '',
      operationType: '',
    };
    searchForm.value = {
      pageNo: 1,
      pageSize: 10,
      securityMeasure: '',
      operationType: '',
    };
    getTableList();
  };

  const pageSizeChange = (pageSize: number) => {
    searchForm.value.pageSize = pageSize;
    getTableList();
  };

  const modalFormRef = ref(null);

  const {
    modalVisible,
    modalFormData,
    modalFormRules,
    modalTitle,
    onClose,
    onSave,
    handleEdit,
    handleDelete,
  } = useSafetyModal(modalFormRef, getTableList, tableData, searchForm);

  // 行业公有库
  const {
    drawerVisibale,
    drawerOk,
    drawerCancel,
    drawerTempSearchForm,
    drawerSelectForm,
    getPublicSafetyMeasureData,
    publicSafetyMeasureData,
    selectKeys,
    drawerColumns,
    drawerCurrentChange,
    drawerPageSizeChange,
    openDrawer,
  } = useSafetyDrawer(getTableList);
</script>

<style lang="less">
  .safetyMeasureModal .arco-modal-footer {
    border: none;
  }
  .safetyMeasureDrawer {
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
