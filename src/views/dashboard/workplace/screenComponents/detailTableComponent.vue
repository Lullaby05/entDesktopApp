<template>
  <div class="tableComponent-container">
    <div class="tableComponent-content">
      <div class="tableComponent-table">
        <div class="tableComponent-table-header">
          <span
            v-for="column in tableColumns"
            :key="column.dataIndex"
            :style="`--column-width: ${column.width}`"
            >{{ column.label }}</span
          >
        </div>
        <div class="tableComponent-table-content">
          <TransitionGroup name="list">
            <div
              class="table-item"
              v-for="(item, index) in tableData"
              :key="index"
            >
              <template v-for="column in tableColumns" :key="column.dataIndex">
                <a-tooltip
                  content-class="report-data-tooltip"
                  :content="item[column.dataIndex]"
                >
                  <div
                    :style="[
                      column.cellStyle && column.cellStyle(item),
                      `--column-width: ${column.width}`,
                    ]"
                    >{{ item[column.dataIndex] }}</div
                  >
                </a-tooltip>
              </template>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  const props = defineProps({
    tableColumns: {
      type: Array<{ label: string; dataIndex: string }>,
      default: () => [],
    },
    tableData: {
      type: Array<any>,
      default: () => [],
    },
  });

  const tableColumns = computed(() =>
    props.tableColumns.map((ele: any) => ({
      ...ele,
      width: !ele.width ? `${100 / props.tableColumns.length}%` : ele.width,
    }))
  );
  const tableData = computed(() => props.tableData);
</script>
<style lang="less">
  .list-move,
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  /* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
  .list-leave-active {
    position: absolute;
  }

  .report-data-tooltip {
    background: linear-gradient(
      180deg,
      rgba(4, 60, 149, 1) 0%,
      rgba(4, 33, 68, 0.74) 14.22%,
      rgba(4, 23, 62, 0.8) 51.46%,
      rgba(7, 45, 94, 0.77) 87.86%,
      rgba(4, 62, 151, 1) 100%
    );
    border: 0.5px solid rgba(48, 97, 219, 1);
    box-shadow: 0px 0px 3px rgba(3, 255, 246, 0.34);
    filter: backdrop(0px 0px 3px rgba(3, 255, 246, 0.34));
  }
</style>
<style lang="less" scoped>
  .tableComponent-container {
    --column-width: 20%;
    height: 100%;
    width: 100%;
    overflow: hidden;
    color: #ffffff;
    font-size: 0.86rem;
    line-height: 0.86rem;
    font-family: 'Roboto';
    .tableComponent-content {
      height: 100%;
    }
    .tableComponent-table-content {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      &::-webkit-scrollbar {
        width: 0px;
      }
      .table-item {
        display: flex;
        // grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
        align-items: center;
        text-align: center;
        padding: 0.71rem 0.36rem;
        > div {
          width: var(--column-width);
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:nth-of-type(odd) {
          background: #0a1454;
        }
        .report-data {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          span + span {
            margin-left: 1rem;
          }
        }
      }
    }
    .tableComponent-table-header {
      display: flex;
      // grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
      text-align: left;
      padding: 0.71rem 0.36rem;
      text-align: center;
      > span {
        width: var(--column-width);
      }
    }
    .tableComponent-table {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  }
</style>
