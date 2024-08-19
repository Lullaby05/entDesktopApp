<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">{{ title }}</span>
      </div>
      <div class="content-card-form">
        <a-form
          ref="formRef"
          :model="formData"
          auto-label-width
          :rules="formRules"
        >
          <a-form-item field="checkName" label="排查表名称">
            <a-input
              v-model="formData.checkName"
              allow-clear
              placeholder="请输入排查表名称"
            ></a-input>
          </a-form-item>
          <a-form-item field="deptId" label="所属部门">
            <a-tree-select
              v-model:model-value="formData.deptId"
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
          <a-form-item field="status" label="状态">
            <a-switch
              v-model="formData.status"
              :checked-value="1"
              :unchecked-value="0"
            >
              <template #checked> 启用 </template>
              <template #unchecked> 停用 </template>
            </a-switch>
          </a-form-item>
          <a-form-item field="remark" label="描述">
            <a-textarea
              v-model="formData.remark"
              :max-length="500"
              :auto-size="{
                minRows: 6,
                maxRows: 6,
              }"
              show-word-limit
              allow-clear
              placeholder="请输入排查表名称"
            ></a-textarea>
          </a-form-item>
          <a-form-item field="checkContentIds" label="排查内容">
            <a-space>
              <a-button type="primary" @click="addRow">新增</a-button>
              <a-button type="primary" @click="drawerVisible = true"
                >引入</a-button
              >
            </a-space>
          </a-form-item>
        </a-form>
      </div>
      <div class="content-table">
        <a-form ref="tableFormRef" :model="formData">
          <a-table
            class="table-content"
            row-key="key"
            :data="
              contentTableData.map((ele) => ({
                ...ele,
                key: ele.key || ele.id,
              }))
            "
            :columns="contentTableColumn"
            :bordered="false"
            :pagination="false"
            :draggable="{ type: 'handle', width: 30 }"
            @change="handleChange"
          >
            <template #number="{ rowIndex }">
              {{ rowIndex + 1 }}
            </template>
            <template #checkItemTitle>
              <strong style="color: rgb(245, 63, 63)">*</strong> 排查项目
            </template>
            <template #problemSpotTitle>
              <strong style="color: rgb(245, 63, 63)">*</strong> 问题点
            </template>
            <template #checkStandardTitle>
              <strong style="color: rgb(245, 63, 63)">*</strong> 排查标准
            </template>
            <template #checkItem="{ record, rowIndex }">
              <a-form-item
                no-style
                field="contentTableData[rowIndex].checkItem"
                :rules="[
                  {
                    validator: (value, callback) => {
                      if (!record.checkItem) {
                        callback('请输入排查项目');
                      } else {
                        callback();
                      }
                    },
                  },
                ]"
              >
                <a-input
                  :disabled="!record.edit"
                  v-model="contentTableData[rowIndex].checkItem"
                  allow-clear
                  placeholder="请输入排查项目"
                ></a-input>
              </a-form-item>
            </template>
            <template #problemSpot="{ record, rowIndex }">
              <a-form-item
                no-style
                field="contentTableData[rowIndex].problemSpot"
                :rules="[
                  {
                    validator: (value, callback) => {
                      if (!record.problemSpot) {
                        callback('请输入问题点');
                      } else {
                        callback();
                      }
                    },
                  },
                ]"
              >
                <a-input
                  :disabled="!record.edit"
                  v-model="contentTableData[rowIndex].problemSpot"
                  allow-clear
                  placeholder="请输入问题点"
                ></a-input>
              </a-form-item>
            </template>
            <template #checkStandard="{ record, rowIndex }">
              <a-form-item
                no-style
                field="contentTableData[rowIndex].checkStandard"
                :rules="[
                  {
                    validator: (value, callback) => {
                      if (!record.checkStandard) {
                        callback('请输入排查标准');
                      } else {
                        callback();
                      }
                    },
                  },
                ]"
              >
                <a-input
                  :disabled="!record.edit"
                  v-model="contentTableData[rowIndex].checkStandard"
                  allow-clear
                  placeholder="请输入排查标准"
                ></a-input>
              </a-form-item>
            </template>
            <template #options="{ record, rowIndex }">
              <a-button
                status="danger"
                type="text"
                @click="removeRow(record, updateContentTable, rowIndex)"
                >移除</a-button
              >
            </template>
          </a-table>
        </a-form>
      </div>
      <div class="btn">
        <a-button @click="goBack">取消</a-button>
        <a-button type="primary" @click="handleSave">保存</a-button>
      </div>
    </a-card>
    <a-drawer
      :width="600"
      :visible="drawerVisible"
      class="detailDrawer"
      :render-to-body="false"
      @ok="handleOk(updateContentTable)"
      @cancel="handleCancel"
    >
      <template #title> 添加排查内容 </template>
      <div class="drawer-container">
        <a-form :model="drawerTempSearchForm" class="drawerForm">
          <a-input
            v-model="drawerTempSearchForm.checkItem"
            allow-clear
            placeholder="排查项目"
          ></a-input>
          <a-input
            v-model="drawerTempSearchForm.problemSpot"
            allow-clear
            placeholder="问题点/排查标准"
          ></a-input>
          <a-button
            type="primary"
            class="formBtn"
            @click="
              () => {
                drawerFormData = drawerTempSearchForm;
                getDrawerTableData();
              }
            "
            >查询</a-button
          >
        </a-form>
        <a-table
          class="drawerTable"
          :row-selection="rowSelection"
          :selectedKeys="selectedKeys"
          :data="drawerTableData.list"
          row-key="id"
          :columns="drawerTableColumns"
          :bordered="false"
          :pagination="{
            total: drawerTableData.total,
            showTotal: true,
            showPageSize: true,
            pageSizeOptions: [10, 20, 30],
            baseSize: 3,
            bufferSize: 1,
          }"
          @page-change="pageChange"
          @page-size-change="pageSizeChange"
          @select="selectionChange"
          @select-all="selectionAllChange"
        ></a-table>
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'FormulateChecklistAdd',
  };
</script>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useDrawer } from './composition/useDrawer';
  import type {
    TableColumnData,
    TableData,
  } from '@arco-design/web-vue/es/table/interface';
  import {
    checkListAdd,
    checkListEdit,
    getCheckListContent,
    getCheckListDetail,
  } from '@/api/pitfall';
  import { Message } from '@arco-design/web-vue';
  import { onBeforeMount } from 'vue';
  import { usePitfallStore } from '@/store';
  import { onMounted } from 'vue';
  import { handleOnKeyup } from '@/utils/event';
  import { cloneDeep } from 'lodash';
  import { useSearch } from '../snapshot/composition/useSearch';
  import { defaultFormConfig } from '@/views/risk/gradedControl/composition/defaultFormConfig';
  import useRouterJump from '@/hooks/routerJump';
  import { v4 as uuidv4 } from 'uuid';

  const route = useRoute();
  const router = useRouter();
  const { clearContentList, contentList, addContentList } = usePitfallStore();
  const formRef = ref<any>(null);
  const tableFormRef = ref<any>(null);

  const { type, id } = route.query;

  const title = computed(() => {
    if (type === 'add') return '新增排查表';
    if (type === 'edit') return '编辑排查表';
    return '查看';
  });

  const formData = ref<any>({
    checkName: '',
    checkContentIds: [],
    status: 1,
  });

  const formRules = {
    checkName: [
      { required: true, message: '请输入排查表名称' },
      { maxLength: 20, message: '不能超过20字符' },
    ],
    deptId: [{ required: true, message: '请选择所属部门' }],
    status: [{ required: true, message: '请选择状态' }],
    checkContentIds: [
      {
        required: true,
        validator: (value: any, callback: any) => {
          if (contentTableData.value.length === 0) {
            callback('请选择或填写排查内容');
          }
          callback();
        },
      },
    ],
  };

  const { deptData, onDeptSearch, clearSearchKey } = useSearch(['deptData']);

  const contentTableData = ref<TableData[]>([]);

  const {
    drawerVisible,
    drawerFormData,
    drawerTempSearchForm,
    handleOk,
    handleCancel,
    drawerTableData,
    drawerTableColumns,
    rowSelection,
    selectedKeys,
    selectionChange,
    selectionAllChange,
    toFormDesign,
    getDrawerTableData,
    pageChange,
    pageSizeChange,
    removeRow,
  } = useDrawer(formData, contentTableData);

  const contentTableColumn: TableColumnData[] = [
    {
      title: '序号',
      width: 60,
      align: 'center',
      slotName: 'number',
    },
    ...drawerTableColumns.map((item) => ({
      ...item,
      cellStyle: { width: '30%' },
    })),
    {
      title: '操作',
      align: 'center',
      width: 100,
      slotName: 'options',
    },
  ];

  const getDetailData = async () => {
    const { data } = await getCheckListDetail(id as string);
    formData.value = cloneDeep({ ...data, status: data.status ? 1 : 0 });
    selectedKeys.value = data.checkContentIds;
    if (data.checkContentIds.length) {
      const { data: tableData } = await getCheckListContent(
        data.checkContentIds
      );
      contentTableData.value = tableData;
    }
  };

  onBeforeMount(() => {
    formData.value = { ...formData.value, ...contentList };
    contentTableData.value = contentList.contentTableData;
    if (type === 'edit') {
      getDetailData();
    }
  });

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      drawerFormData.value = drawerTempSearchForm.value;
      getDrawerTableData();
    });
  });

  const updateContentTable = async (
    keys: string[],
    tableData: TableData[],
    type: string = 'push'
  ) => {
    if (type === 'delAdd') {
      contentTableData.value = tableData;
    } else if (type === 'del') {
      formData.value.checkContentIds = keys;
      contentTableData.value = tableData.filter(
        (item) => keys.includes(item.id) || !item.id
      );
    } else {
      const contentTableIds = contentTableData.value.map((item) => item.id);
      const defferenceId = keys.filter((item) => {
        return !contentTableIds.includes(item);
      });
      // 筛选出来那些原本没有id的，说明是新增的数据
      const newContent = contentTableData.value.filter((item) => !item.id);
      formData.value.checkContentIds = keys;
      contentTableData.value = [
        ...newContent,
        ...tableData.filter((item) => defferenceId.includes(item.id)), // 这部分是之前的数据和key的差集，即之前的数据没有，会加进来
        ...contentTableData.value.filter((item) => keys.includes(item.id)), // 这部分是之前的数据和当前的key的交集，即如果之前数据有但key中没有则会被删除，否则会保留
      ];
    }
    tableFormRef.value.clearValidate();
    tableFormRef.value.validate();
  };

  // 保存
  const { jumpWithTab } = useRouterJump();
  const handleSave = async () => {
    const params = {
      ...formData.value,
      checkContentIds: Array.from(new Set(formData.value.checkContentIds)),
      temporaryCreates: contentTableData.value
        .filter((item) => !item.id)
        .map((ele) => {
          const defaultConfig = defaultFormConfig(true);
          return {
            ...ele,
            formItems: JSON.stringify({
              design: defaultConfig,
            }),
          };
        }),
    };
    const result = await formRef.value.validate();
    const tableResult = await tableFormRef.value.validate();
    if (!result && !tableResult) {
      const reqObj = type === 'add' ? checkListAdd : checkListEdit;
      const { data } = await reqObj(params);
      Message.success({
        content: h('div', [
          h('span', type === 'add' ? '新增成功！' : '编辑成功！'),
          h(
            'span',
            {
              style: { color: '#357cf0', cursor: 'pointer' },
              onClick: () => {
                jumpWithTab({
                  routerName: 'CheckPlanManageAdd',
                  redirectName: 'CheckPlanManageList',
                  params: {
                    checkListId: data,
                  },
                });
              },
            },
            '点击前往制定排查计划'
          ),
        ]),
        duration: 3000,
      });
      goBack();
    }
  };

  const goBack = () => {
    clearContentList();
    router.back();
  };

  const addRow = () => {
    const uuid = uuidv4();
    contentTableData.value.unshift({
      checkItem: '',
      problemSpot: '',
      checkStandard: '',
      edit: true,
      key: uuid,
    });
  };
  const handleChange = (_data: any) => {
    tableFormRef.value.clearValidate();
    contentTableData.value = _data;
    tableFormRef.value.validate();
  };
</script>

<style lang="less" scoped>
  .arco-card.content-card {
    .header {
      font-size: 18px;
      margin-bottom: 30px;

      .title {
        margin-left: 8px;
      }
    }

    .content-card-form {
      margin: 0 auto;
      width: 880px;

      .item-slot {
        margin-top: 20px;
        box-shadow: 0px 0px 7px -3px rgba(0, 0, 0, 0.5);
        border-bottom: 1px solid var(--bg4);
        border-radius: 10px;
        width: 99%;

        .form-render-title {
          line-height: 30px;
          font-size: 14px;
          padding: 5px 10px;
          background-color: var(--bg4);
        }
      }
    }

    .content-table {
      min-height: calc(100vh - 595px);

      .table-content {
        width: 880px;
        margin: 0 auto;
      }
    }
  }

  .detailDrawer .drawer-container {
    padding: 0;
    margin: 0;

    .drawerForm {
      flex-direction: row;
      justify-content: space-between;
      padding: 16px;
      margin-bottom: 20px;
      background-color: var(--bg2);

      .arco-input-wrapper {
        width: 200px;
      }
    }

    .drawerTable {
      padding: 16px;
      background-color: var(--bg2);
      margin-top: 20px;
    }
  }

  .btn {
    margin-top: 20px;
    text-align: center;

    button + button {
      margin-left: 12px;
    }
  }
</style>
