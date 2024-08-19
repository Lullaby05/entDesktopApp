<!-- 应急管理--应急演练--演练记录 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form
          :model="selectForm"
          layout="inline"
          :label-col-props="{ span: 2 }"
        >
          <a-form-item field="" label="演练状态">
            <a-tree-select
              :data="[]"
              placeholder="请选择演练状态"
            ></a-tree-select>
          </a-form-item>
          <a-form-item field="" label="演练内容">
            <a-input placeholder="演练内容"></a-input>
          </a-form-item>
          <a-form-item field="" label="所属企业">
            <a-tree-select
              :data="[]"
              placeholder="请选择所属企业"
            ></a-tree-select>
          </a-form-item>
        </a-form>
      </template>
      <template #headerBtn>
        <a-space>
          <a-button type="primary">
            <icon-search class="icon" />
            查询
          </a-button>
          <a-button>
            <icon-refresh class="icon" />
            重置
          </a-button>
        </a-space>
      </template>
      <template #primaryBtn>
        <a-space>
          <a-button type="primary" @click="toAddPage('add')">
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
          :data="pageData.rows"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #option="{ record }">
            <a-button
              type="text"
              status="success"
              size="mini"
              @click="toAddPage('view', record)"
            >
              查看
            </a-button>
            <a-button
              type="text"
              size="mini"
              @click="toAddPage('edit', record)"
            >
              编辑
            </a-button>
            <a-button
              type="text"
              status="danger"
              size="mini"
              @click="deleteRow(record)"
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
          :total="(pageData.total as number)"
        ></a-pagination>
      </template>
    </TableListCard>
  </div>
</template>

<script lang="ts">
  import { Modal } from '@arco-design/web-vue';
  import { ref, h } from 'vue';
  import { useRouter } from 'vue-router';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import data from './data.json';
  export default {
    // name: 'ExerciseRecords',
  };
</script>

<script lang="ts" setup>
  const pageData = ref<any>({});
  pageData.value = data.page;
  // --------------------搜索---------------------
  const selectForm = ref<any>({});
  // --------------------表格---------------------
  const columns: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
    },
    {
      title: '演练时间',
      dataIndex: 'drillTime',
    },
    {
      title: '演练状态',
      dataIndex: 'drillStatusText',
    },
    {
      title: '演练内容',
      width: 160,
      dataIndex: 'drillContent',
    },
    {
      title: '演练计划',
      dataIndex: 'drillplanName',
    },
    {
      title: '人员数量',
      dataIndex: 'participant',
    },
    {
      title: '演练地点',
      dataIndex: 'drillSite',
    },
    {
      title: '操作',
      width: 180,
      align: 'center',
      // headerCellStyle: { paddingLeft: '14px' },
      slotName: 'option',
      dataIndex: '',
    },
  ];

  const router = useRouter();
  const toAddPage = (type: string, row?: any) => {
    const data = JSON.stringify(row || {});
    router.push({
      name: 'ExerciseRecordsAdd',
      query: { type, row: data },
    });
  };
  const deleteRow = (row: any) => {
    Modal.open({
      title: '提示',
      content: () => h(ConfirmModalBody),
      titleAlign: 'start',
    });
  };
</script>

<style lang="less" scoped></style>
