<template>
  <TableListCard>
    <template #headerInput>
      <a-form :model="selectForm" layout="inline">
        <a-form-item field="" label="计划名称">
          <a-input placeholder="请输入排查计划名称"></a-input>
        </a-form-item>
        <a-form-item field="" label="计划编号">
          <a-input placeholder="请输入排查计划编号"></a-input>
        </a-form-item>
        <a-form-item field="" label="隐患描述">
          <a-input placeholder="请输入隐患描述"></a-input>
        </a-form-item>
        <a-form-item field="" label="隐患级别">
          <a-tree-select
            :data="[]"
            placeholder="请选择隐患级别"
          ></a-tree-select>
        </a-form-item>
        <a-form-item field="" label="排查人">
          <a-tree-select :data="[]" placeholder="请选择排查人"></a-tree-select>
        </a-form-item>
      </a-form>
    </template>
    <template #headerBtn>
      <a-space direction="vertical" :size="[0, 10]">
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
        <a-button
          type="primary"
          status="success"
          :disabled="!selectedKeys.length"
          @click="operateRow('batchDistribution')"
        >
          批量派发
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
        v-if="props.tabKey === '1'"
        v-model:selectedKeys="selectedKeys"
        :data="props.tableData.rows"
        row-key="id"
        :columns="props.columns"
        :bordered="false"
        :scroll="{ x: '140%', y: 400 }"
        :row-selection="{
          type: 'checkbox',
          onlyCurrent: false,
          showCheckedAll: true,
        }"
        :pagination="{
          total: tableData.total,
          showTotal: true,
          showPageSize: true,
          pageSizeOptions: [10, 20, 50, 100],
        }"
      >
        <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
        <template #option="{ record }">
          <a-button type="text" size="mini" @click="operateRow('edit', record)">
            编辑
          </a-button>
          <a-button
            type="text"
            status="success"
            size="mini"
            @click="operateRow('view', record)"
          >
            查看
          </a-button>
          <a-button
            type="text"
            status="danger"
            size="mini"
            @click="deleteRow(record)"
          >
            删除
          </a-button>
          <a-popover position="br">
            <a-button type="text" size="mini"> 更多 </a-button>
            <template #content>
              <a-space direction="vertical">
                <a-button
                  type="text"
                  status="warning"
                  size="mini"
                  @click="operateRow('distribution', record)"
                >
                  派发
                </a-button>
              </a-space>
            </template>
          </a-popover>
        </template>
      </a-table>
      <a-table
        v-else
        :data="props.tableData.rows"
        row-key="id"
        :columns="props.columns"
        :bordered="false"
        :scroll="{ x: '140%', y: 400 }"
        :pagination="{
          total: tableData.total,
          showTotal: true,
          showPageSize: true,
          pageSizeOptions: [10, 20, 50, 100],
        }"
      >
        <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
        <template #option="{ record }">
          <a-button type="text" size="mini"> 编辑 </a-button>
          <a-button type="text" status="success" size="mini"> 查看 </a-button>
          <a-button
            type="text"
            status="danger"
            size="mini"
            @click="deleteRow(record)"
          >
            删除
          </a-button>
          <a-popover position="br">
            <a-button type="text" size="mini"> 更多 </a-button>
            <template #content>
              <a-space direction="vertical">
                <a-button type="text" status="warning" size="mini">
                  派发
                </a-button>
              </a-space>
            </template>
          </a-popover>
        </template>
      </a-table>
    </template>
  </TableListCard>
</template>

<script lang="ts">
  import { ref, h } from 'vue';
  import { Modal } from '@arco-design/web-vue';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  export default {};
</script>

<script lang="ts" setup>
  interface Props {
    tableData: { rows: any[]; total: number };
    columns?: TableColumnData[];
    tabKey: string | number;
  }
  const props = withDefaults(defineProps<Props>(), {
    columns: () => [
      {
        title: '序号',
        slotName: 'number',
        width: 60,
      },
      {
        title: '隐患描述',
        dataIndex: 'inspectionDesc',
      },
      {
        title: '隐患位置',
        dataIndex: 'inspectionSite',
      },
      {
        title: '隐患所属部门单位',
        width: 120,
        dataIndex: 'departmentName',
      },
      {
        title: '隐患级别',
        dataIndex: 'levelName',
      },
      {
        title: '达标标准',
        width: 300,
        dataIndex: 'standard',
      },
      {
        title: '排查人',
        dataIndex: 'checkUserName',
      },
      {
        title: '排查日期',
        dataIndex: 'checkDate',
      },
      {
        title: '排查计划编号',
        dataIndex: 'code',
      },
      {
        title: '排查性质',
        dataIndex: 'nature',
      },
      {
        title: '上次操作时间',
        dataIndex: 'inspectionDate',
      },
      {
        title: '操作',
        width: 240,
        align: 'center',
        fixed: 'right',
        // headerCellStyle: { paddingLeft: '14px' },
        slotName: 'option',
        dataIndex: '',
      },
    ],
  });
  const emit = defineEmits(['openModal']);
  const selectForm = ref<any>({});
  // ------------------- table ------------------
  const selectedKeys = ref([]);
  const deleteRow = (id: string | number) => {
    Modal.open({
      title: '提示',
      content: () => h(ConfirmModalBody),
      titleAlign: 'start',
      onCancel: () => {
        console.log('取消');
      },
      onOk: () => {
        console.log('欧克');
      },
    });
  };
  const operateRow = (type: string, row?: object) => {
    emit('openModal', { type, row });
  };
</script>

<style></style>
