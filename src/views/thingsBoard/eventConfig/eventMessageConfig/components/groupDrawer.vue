<template>
  <div>
    <!-- 岗位抽屉 -->
    <a-drawer
      :width="600"
      :visible="visible"
      unmount-on-close
      class="securityDepartMentDrawer"
      @ok="drawerOk"
      @cancel="drawerCancel"
    >
      <template #title> 选择岗位 </template>
      <TableListCard :autoTableHeight="false">
        <template #headerInput>
          <a-space :size="[10, 0]">
            <a-input
              v-model="drawerTempSearchForm.groupPlanName"
              allow-clear
              placeholder="请输入排班计划名称"
            >
            </a-input>
          </a-space>
        </template>
        <template #headerBtn>
          <a-button
            type="primary"
            @click="
              () => {
                drawerSelectForm = drawerTempSearchForm;
                drawerSelectForm.pageNo = 1;
                getDrawerGroupData();
              }
            "
          >
            <icon-search class="icon" />
            查询
          </a-button>
        </template>

        <template #table>
          <a-table
            v-model:selected-keys="selectKeys"
            :data="drawerGroupData.list"
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
            :total="(drawerGroupData.total as number)"
            @change="currentChange"
            @page-size-change="pageSizeChange"
          ></a-pagination>
        </template>
      </TableListCard>
    </a-drawer>
  </div>
</template>
<script lang="ts" setup>
  import { computed } from 'vue';
  import { useDrawer } from '../composition/useGroupDrawer';

  const emits = defineEmits(['update:tableData']);

  const props = defineProps({
    tableData: {
      require: true,
      type: Array,
    },
    type: {
      type: String,
    },
    deptData: {
      require: true,
      type: Array,
    },
    onDeptSearch: {
      type: Function,
    },
    clearSearchKey: {
      type: Function,
    },
  });

  const tableData = computed({
    get() {
      return props.tableData;
    },
    set(val) {
      emits('update:tableData', val);
    },
  });

  const {
    columns: drawerColumns,
    visible,
    drawerSelectForm,
    drawerTempSearchForm,
    drawerGroupData,
    selectKeys,
    openDrawer,
    drawerOk,
    drawerCancel,
    getDrawerGroupData,
    currentChange,
    pageSizeChange,
  } = useDrawer(tableData, props.type as string);

  // 父组件调用
  const open = () => {
    openDrawer();
  };

  defineExpose({
    open,
  });
</script>
<style lang="less" scoped>
  .arco-card.card-table {
    :deep(.header) {
      .input {
        .arco-space {
          width: 100%;

          .arco-space-item {
            width: calc(100% / 2 - 20px);

            .arco-select-view-single,
            .arco-input-wrapper {
              width: 100%;
            }
          }
        }
      }

      .input-btn {
        padding-left: 10px;
      }
    }
  }
</style>
<style lang="less">
  .securityDepartMentDrawer {
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
