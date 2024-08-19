<template>
  <a-table
    v-model:selectedKeys="selectedKeys"
    :data="props.data.list"
    row-key="id"
    :columns="props.columns"
    :bordered="false"
    :row-selection="{
      type: 'checkbox',
      onlyCurrent: false,
      showCheckedAll: true,
    }"
    :pagination="{
      defaultPageSize: 5,
      total: props.data.total,
      showTotal: true,
      showPageSize: true,
      pageSizeOptions: [5, 10, 20, 50, 100],
    }"
  >
    <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
  </a-table>
</template>

<script lang="ts">
  import { ref, watch, computed } from 'vue';
  import type {
    ExportItem,
    MetarialItem,
    TroopsItem,
  } from '@/views/emergency/emergencyResource/index';
  import type { TableColumnData } from '@arco-design/web-vue';

  export default {};
</script>

<script lang="ts" setup>
  interface Props {
    data: { list: (ExportItem | MetarialItem | TroopsItem)[]; total: number };
    columns: TableColumnData[];
    selectedKeys: (string | number)[];
  }
  const props = withDefaults(defineProps<Props>(), {});

  const emit = defineEmits(['selectedKeys']);

  const selectedKeys = computed({
    get() {
      if (
        Object.prototype.toString.call(props.selectedKeys) === '[object Array]'
      ) {
        return props.selectedKeys;
      }
      return [];
    },
    set(val) {
      return emit('selectedKeys', val);
    },
  });
</script>

<style lang="less" scoped>
  :deep(.arco-table-pagination) {
    padding: 0 12px 12px 0;
  }
</style>
