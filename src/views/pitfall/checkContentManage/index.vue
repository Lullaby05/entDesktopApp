<!-- 隐患管理--排查内容管理 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form :model="tempSearchForm" layout="inline">
          <a-form-item field="checkItem" label="排查项目">
            <a-input
              v-model="tempSearchForm.checkItem"
              allow-clear
              placeholder="请输入排查项目"
            ></a-input>
          </a-form-item>
          <a-form-item field="problemSpot" label="问题点">
            <a-input
              allow-clear
              v-model="tempSearchForm.problemSpot"
              placeholder="请输入问题点"
            ></a-input>
          </a-form-item>
          <a-form-item field="checkStandard" label="排查标准">
            <a-input
              allow-clear
              v-model="tempSearchForm.checkStandard"
              placeholder="请输入排查标准"
            ></a-input>
          </a-form-item>
        </a-form>
      </template>
      <template #primaryBtn>
        <a-space>
          <a-button
            v-permission="'CheckContentAdd'"
            type="primary"
            @click="handleEvent('add')"
          >
            <icon-plus />
            <span>&nbsp;新增</span>
          </a-button>
          <a-button type="primary" @click="handleEvent('import')"
            >导入</a-button
          >
          <a-button type="primary" @click="handleEvent('export')"
            >导出</a-button
          >
          <!-- <a-button  v-permission="'BatchChooseContent'" type="primary" @click="handleEvent('batchImport')">
            <icon-plus /><span>&nbsp; 批量选择引入</span></a-button
          > -->
        </a-space>
      </template>
      <template #headerBtn>
        <a-space class="header-btn">
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
      </template>
      <template #minorBtn>
        <a-space>
          <icon-refresh class="minor-icon" size="20" @click="getTableList" />
        </a-space>
      </template>
      <template #table>
        <a-table
          :bordered="false"
          :data="tableData.list"
          row-key="id"
          :columns="tableColumn"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #option="{ record }">
            <div>
              <a-button
                v-permission="'CheckContentEdit'"
                type="text"
                size="mini"
                @click="handleEvent('edit', record)"
                >编辑</a-button
              >
              <a-button
                v-permission="'CheckContentDelete'"
                type="text"
                size="mini"
                status="danger"
                @click="handleEvent('delete', record)"
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
    <ImportDataModal
      v-model:visible="importModalVisible"
      templateUrl="排查内容导入模板.xlsx"
      :tableColumns="modalTableColumns"
      :previewApi="checkContentImportCheck"
      :import-api="checkContentImport"
      :import-callback="checkContentImportCallback"
      @success="getTableList"
    >
      <template #tips> </template>
    </ImportDataModal>
  </div>
</template>

<script lang="ts" setup name="CheckContentManage">
  import { useList } from './composition/useList';
  import ImportDataModal from '@/components/importDataModal/index.vue';
  import { checkContentImportCheck, checkContentImport } from '@/api/pitfall';

  const {
    tableColumn,
    searchForm,
    tableData,
    handleEvent,
    pageChange,
    getTableList,
    handleReset,
    tempSearchForm,
    pageSizeChange,
    importModalVisible,
    modalTableColumns,
    checkContentImportCallback,
  } = useList();
</script>

<style lang="less" scoped>
  .arco-card.tabs-card {
    width: 100%;
    min-height: 94%;
    overflow-y: auto;

    :deep(.arco-card-bordered) {
      border: none;
    }
  }
</style>
