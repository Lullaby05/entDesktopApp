<template>
  <TableListCard>
    <template #headerInput>
      <a-form
        v-show="props.type === '1'"
        :model="selectForm"
        layout="inline"
        :label-col-props="{ span: 2 }"
      >
        <a-form-item field="" label="依据或标准">
          <a-input placeholder="检查依据/达标标准"></a-input>
        </a-form-item>
        <a-form-item field="" label="隐患类型">
          <a-tree-select placeholder="隐患类型" :data="[]"></a-tree-select>
        </a-form-item>
      </a-form>
      <a-form
        v-show="props.type === '2'"
        :model="selectForm"
        :label-col-props="{ span: 2 }"
        layout="inline"
      >
        <a-form-item field="" label="行业">
          <a-tree-select placeholder="请选择行业" :data="[]"></a-tree-select>
        </a-form-item>
        <a-form-item field="" label="问题点">
          <a-input placeholder="问题点"></a-input>
        </a-form-item>

        <a-form-item field="" label="检查依据">
          <a-input placeholder="检查依据"></a-input>
        </a-form-item>
        <a-form-item field="" label="达标标准">
          <a-input placeholder="达标标准"></a-input>
        </a-form-item>
        <a-form-item field="" label="隐患类型">
          <a-tree-select
            placeholder="请选择隐患类型"
            :data="[]"
          ></a-tree-select>
        </a-form-item>
        <a-form-item field="" label="隐患级别">
          <a-tree-select
            placeholder="请选择隐患级别"
            :data="[]"
          ></a-tree-select>
        </a-form-item>
      </a-form>
    </template>
    <template #headerBtn>
      <a-space v-if="props.type === '1'">
        <a-button type="primary">
          <icon-search class="icon" />
          查询
        </a-button>
        <a-button>
          <icon-refresh class="icon" />
          重置
        </a-button>
      </a-space>
      <a-space v-else direction="vertical" :size="[0, 10]">
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
      <a-space v-show="props.type === '1'">
        <a-button type="primary" @click="operatePitfallPoint('add')">
          <icon-plus class="icon" />
          新增
        </a-button>
      </a-space>
    </template>
    <template #minorBtn>
      <a-space v-show="props.type === '1'">
        <icon-refresh class="minor-icon" size="20" />
        <a-button type="primary"><icon-upload class="icon" />导入</a-button>
        <a-button type="primary"><icon-download class="icon" />导出</a-button>
      </a-space>
    </template>
    <template #table>
      <a-table
        :data="tableData.rows"
        row-key="id"
        :columns="columns"
        :bordered="false"
        :pagination="{
          total: 1,
          showTotal: true,
          showPageSize: true,
          pageSizeOptions: [10, 20, 50, 100],
        }"
      >
        <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
        <template #option="{ record }">
          <template v-if="props.type === '1'">
            <a-button
              type="text"
              size="mini"
              @click="operatePitfallPoint('edit', record)"
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
          <template v-else>
            <a-button
              type="text"
              status="success"
              size="mini"
              @click="openPublicModal(record)"
            >
              查看
            </a-button>
            <a-button type="text" status="success" size="mini">
              导入企业库
            </a-button>
          </template>
        </template>
      </a-table>
    </template>
  </TableListCard>
</template>

<script lang="ts">
  import { ref, computed, h } from 'vue';
  import { Modal } from '@arco-design/web-vue';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import type {
    TableColumnData,
    TableData,
  } from '@arco-design/web-vue/es/table/interface';
  import data from './data.json';
  export default {};
</script>

<script lang="ts" setup>
  const props = defineProps({
    type: {
      type: String,
      default: '1',
    },
  });
  const selectForm = ref();
  // -----------表格-------------
  const columns = computed((): TableColumnData[] => {
    if (props.type === '1')
      return [
        {
          title: '序号',
          slotName: 'number',
          width: 60,
          dataIndex: '',
          align: 'left',
        },
        {
          title: '问题点',
          width: 180,
          dataIndex: 'point',
        },
        {
          title: '隐患类型',
          width: 100,
          dataIndex: 'checkType',
        },
        {
          title: '达标标准',
          dataIndex: 'standard',
        },
        {
          title: '检查依据',
          width: 160,
          dataIndex: 'basis',
        },
        {
          title: '隐患级别',
          width: 100,
          dataIndex: 'levelText',
        },
        {
          title: '重大隐患判定依据',
          width: 160,
          dataIndex: 'dangerBasis',
        },

        {
          title: '操作',
          width: 140,
          align: 'center',
          slotName: 'option',
          dataIndex: '',
        },
      ];
    return [
      {
        title: '序号',
        slotName: 'number',
        width: 60,
        dataIndex: '',
        align: 'left',
      },
      {
        title: '行业',
        width: 140,
        dataIndex: 'industryName',
      },
      {
        title: '专业',
        width: 100,
        dataIndex: 'industryitemName',
      },
      {
        title: '问题点',
        width: 180,
        dataIndex: 'point',
      },
      {
        title: '检查依据',
        width: 160,
        dataIndex: 'basis',
      },
      {
        title: '达标标准',
        dataIndex: 'standard',
      },
      {
        title: '隐患类型',
        width: 100,
        dataIndex: 'checkType',
      },
      {
        title: '隐患级别',
        width: 100,
        dataIndex: 'levelText',
      },

      {
        title: '操作',
        width: 180,
        align: 'center',
        slotName: 'option',
        dataIndex: '',
      },
    ];
  });
  const tableData = computed((): TableData => {
    if (props.type === '1') return data.public;
    return data.page;
  });
  const emit = defineEmits(['openPublicModal', 'operatePitfallPoint']);
  const deleteRow = (row: any) => {
    Modal.open({
      title: '提示',
      content: () => h(ConfirmModalBody),
      titleAlign: 'start',
    });
  };
  const openPublicModal = (row: any) => {
    emit('openPublicModal', row);
  };
  const operatePitfallPoint = (type: string, row?: any) => {
    emit('operatePitfallPoint', { type, row });
  };
  // ---------对父组件共享--------
  defineExpose({});
</script>

<style lang="less" scoped></style>
