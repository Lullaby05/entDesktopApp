<template>
  <div class="check-table-container">
    <div class="title" v-if="props.title">
      {{ props.title }}
      <slot></slot>
    </div>
    <div class="table">
      <a-table
        class="hide"
        ref="tableRef"
        :bordered="{ cell: true }"
        :stripe="true"
        :data="props.tableData"
        :columns="props.tableColumn"
        :pagination="false"
      >
        <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
      </a-table>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import {
    TableColumnData,
    TableData,
  } from '@arco-design/web-vue/es/table/interface';
  import { onMounted, ref } from 'vue';

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    tableData: {
      type: Array<TableData>,
      default: () => [],
    },
    tableColumn: {
      type: Array<TableColumnData>,
      default: () => [],
    },
  });

  const tableRef = ref<any>(null);

  onMounted(() => {
    // 表格展开实现
    // 将表格最后一行放到第四行的位置
    if (props.tableData.length > 4) {
      const table = tableRef.value.$el;
      const tableBody = table?.querySelector('tbody');
      tableBody?.classList.add('canExpand');
      const lastRow = tableBody!.querySelector('.arco-table-tr:last-child');
      tableBody!.insertBefore(
        lastRow!,
        tableBody!.querySelector('tr:nth-child(4)')
      );
      const expandBtn = tableBody!.querySelector('tr:nth-child(3)');
      expandBtn?.addEventListener('click', function () {
        table?.classList.remove('hide');
        tableBody!
          .querySelector('tr:last-child')
          ?.insertAdjacentElement('afterend', lastRow!);
      });
    }
  });
</script>

<style lang="less" scoped>
  .check-table-container {
    margin: 0 6% 20px 10%;

    .title {
      color: var(--color-text-black);
      font-size: 14px;
      margin-bottom: 10px;
    }

    .table {
      // width: 800px;
      max-height: 100%;
      overflow: hidden;
      transition: height 0.5s;
    }

    .table > .hide {
      max-height: 206px;

      :deep(tbody.canExpand) {
        position: relative;

        &::before {
          content: '------ 点击展开 ------';
          position: absolute;
          color: rgb(64, 158, 255);
          text-align: center;
          line-height: 40px;
          font-size: 14px;
          top: 82px;
          left: 0;
          width: 100%;
          height: 40px;
          background-color: var(--bg2);
          cursor: pointer;
          pointer-events: none;
        }
      }
    }
  }
</style>
