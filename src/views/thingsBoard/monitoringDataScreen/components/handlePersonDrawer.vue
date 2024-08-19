<template>
  <div>
    <!-- 员工抽屉 -->
    <a-drawer
      :width="600"
      :visible="visible"
      unmount-on-close
      class="securityDepartMentDrawer"
      @ok="drawerOk"
      @cancel="drawerCancel"
    >
      <template #title>
        <span>处置人员选择</span>
        <div class="close-icon" @click="drawerCancel">
          <img src="@/assets/image/close-btn-icon.png" alt="" />
        </div>
      </template>
      <TableListCard :autoTableHeight="false">
        <template #headerInput>
          <a-space :size="[10, 0]">
            <a-tree-select
              v-model.trim="drawerTempSearchForm.deptId"
              :data="(props.deptData as any[])"
              :disable-filter="true"
              :fallback-option="false"
              :field-names="{
                title: 'name',
                key: 'id',
              }"
              allow-clear
              allow-search
              placeholder="请选择所属部门"
              @search="props.onDeptSearch"
              @blur="props.clearSearchKey"
              @clear="props.clearSearchKey"
            ></a-tree-select>
            <a-input
              v-model.trim="drawerTempSearchForm.name"
              placeholder="请输入员工姓名"
              allow-clear
            ></a-input>
          </a-space>
        </template>
        <template #headerBtn>
          <a-button
            type="primary"
            @click="
              () => {
                drawerSelectForm = drawerTempSearchForm;
                drawerSelectForm.pageNo = 1;
                getDrawerStaffData();
              }
            "
          >
            <icon-search class="icon" />
            查询
          </a-button>
        </template>
        <template #primaryBtn>
          <a-tabs
            v-model:active-key="activeKey"
            :hide-content="true"
            type="capsule"
            @change="changeTab"
          >
            <a-tab-pane v-for="item in tabList" :key="item.code">
              <template #title> {{ item.name }} </template>
            </a-tab-pane>
          </a-tabs>
        </template>
        <template #table>
          <a-table
            v-model:selected-keys="selectKeys"
            :data="drawerStaffData.list"
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
            <template #remark="{ record }">
              {{ record.remark }}
            </template>
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
            :total="(drawerStaffData.total as number)"
            @change="currentChange"
            @page-size-change="pageSizeChange"
          ></a-pagination>
        </template>
      </TableListCard>
    </a-drawer>
  </div>
</template>
<script lang="ts" setup>
  import { computed, onMounted } from 'vue';
  import { useDrawer } from '../compoisiton/useDrawer';
  import { handleOnKeyup } from '@/utils/event';

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

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      drawerSelectForm.value = drawerTempSearchForm.value;
      drawerSelectForm.value.pageNo = 1;
      getDrawerStaffData();
    });
  });

  const {
    columns: drawerColumns,
    visible,
    drawerSelectForm,
    drawerTempSearchForm,
    drawerStaffData,
    selectKeys,
    openDrawer,
    drawerOk,
    drawerCancel,
    getDrawerStaffData,
    currentChange,
    pageSizeChange,
    tabList,
    activeKey,
    changeTab,
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
            margin-top: 0;
            .arco-select-view-single,
            .arco-input-wrapper {
              --color-text-1: #ffffff;
              --color-fill-2: #1d2650;
              --color-fill-3: #1d2650;
              --color-bg-2: #1d2650;
              height: 22px;
              font-size: 12px;
              line-height: 12px;
              border: 0.5px solid rgba(42, 130, 228, 1);
              border-radius: 2px;
              width: 100%;
              .arco-select-view-value {
                min-height: 0;
              }
            }
          }
        }
      }

      .input-btn {
        padding-left: 10px;
        button {
          width: 90px;
          height: 22px;
          opacity: 1;
          border-radius: 2px;
          background: rgba(42, 130, 228, 1);
          font-size: 12px;
        }
      }
    }
  }
</style>
<style lang="less">
  .securityDepartMentDrawer {
    .arco-drawer-header {
      width: 100%;
      background-color: rgb(29, 38, 80);
      border: none;
      .arco-drawer-title {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin: 0;
        font-size: 1.29rem;
        font-weight: 700;
        letter-spacing: -0.29px;
        line-height: 1.29rem;
        color: rgba(255, 255, 255, 0.9);
        --color-text-1: #ffffff;
        .close-icon {
          line-height: 1;
          cursor: pointer;
          img {
            width: 20px;
            height: 20px;
          }
        }
      }
    }
    .arco-drawer {
      --color-bg-3: rgb(29, 38, 80);
    }
    .arco-drawer-close-btn {
      display: none;
    }
    .arco-drawer-body .arco-card-bordered {
      border: none;

      .arco-card-body {
        padding: 0;
        background-color: rgb(29, 38, 80);
        .header .input-btn {
          border: none;
        }
        .arco-divider-horizontal {
          display: none;
        }
        .arco-tabs-nav-type-capsule {
          .arco-tabs-nav-tab-list {
            margin-top: 0.5rem;
            padding: 0.86rem 0.36rem;
            font-family: 'Alibaba-Medium';
            background: transparent;
            font-weight: 700;
            letter-spacing: -0.29px;
            --color-text-2: rgba(230, 247, 255, 1);
            .arco-tabs-tab {
              font-size: 1.14rem;
              line-height: 1.14rem;
              padding: 0 1.07rem;
            }
            .arco-tabs-tab:hover {
              background-color: transparent;
              font-weight: 700;
            }
          }
          .arco-tabs-nav-tab:not(.arco-tabs-nav-tab-scroll) {
            justify-content: flex-start;
          }
          .arco-tabs-tab-active {
            background-color: transparent;
            color: #30c9c9;
            font-weight: 700;
            &::before {
              opacity: 1;
            }
          }
          .arco-tabs-tab-active + .arco-tabs-tab::before {
            opacity: 1;
          }
        }
        .list-card-table {
          .arco-checkbox-icon {
            --color-bg-2: transparent;
          }
          .arco-table-tr > .arco-table-th {
            --color-neutral-2: rgba(14, 30, 135, 0.9);
            --gray-10: 255, 255, 255;
          }
          .arco-table-tr:nth-of-type(2n + 1) > .arco-table-td {
            --color-bg-2: #131d52;
            --color-fill-1: #131d52;
            --gray-10: 255, 255, 255;
            border: none;
          }
          .arco-table-tr:nth-of-type(2n) > .arco-table-td {
            --color-bg-2: #0c1654;
            --color-fill-1: #0c1654;
            --gray-10: 255, 255, 255;
            border: none;
          }
        }
        .pagination {
          justify-content: center;
          .arco-pagination-total {
            --color-text-1: #ffffff;
          }
          .arco-pagination-item-active {
            --color-primary-light-1: rgba(42, 130, 228, 1);
            --primary-6: 255, 255, 255;
          }
        }
      }
    }

    .arco-drawer-footer {
      border-top: none;
      button {
        width: 100px;
        height: 22px;
        opacity: 1;
        border-radius: 2px;
        background: rgba(42, 130, 228, 1);
        &:nth-of-type(1) {
          --color-text-2: #ffffff;
          background: rgba(128, 128, 128, 1);
        }
      }
    }
  }
</style>
