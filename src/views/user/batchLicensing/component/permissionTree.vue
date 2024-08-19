<template>
  <div>
    <a-table
      v-model:selected-keys="selectKeys"
      v-model:expanded-keys="expandKey"
      ref="treeDomRef"
      :data="props.treeData"
      row-key="id"
      :columns="columns"
      :bordered="false"
      :pagination="false"
    >
      <template #options="{ record }">
        <a-button type="text" @click="handleBatchAuth(record)"
          >批量授权</a-button
        >
      </template>
    </a-table>
  </div>
</template>
<script lang="ts" setup>
  import { TableColumnData, TableData } from '@arco-design/web-vue';
  import { computed, ref } from 'vue';

  const props = defineProps({
    treeData: {
      type: Array<TableData>,
      default: () => [],
    },
    expandedKeys: {
      type: Array<string | number>,
      default: () => [],
    },
  });

  const emits = defineEmits(['batchAuth', 'update:expandedKeys']);

  const columns: TableColumnData[] = [
    {
      title: '权限名称',
      dataIndex: 'name',
      width: 360,
      cellStyle: { width: '28%' },
    },
    {
      title: '权限说明',
      dataIndex: 'menuDesc',
      width: 480,
      cellStyle: { width: '37%' },
    },
    {
      title: '操作',
      dataIndex: 'options',
      slotName: 'options',
      align: 'center',
    },
  ];

  const selectKeys = ref([]);
  const expandKey = computed({
    get() {
      return props.expandedKeys;
    },
    set(val) {
      emits('update:expandedKeys', val);
    },
  });
  const handleBatchAuth = (record: any) => {
    emits('batchAuth', record);
  };
</script>
<style></style>
