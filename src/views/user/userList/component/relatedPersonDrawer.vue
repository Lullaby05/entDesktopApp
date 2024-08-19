<!-- 获取关联人员 -->
<template>
  <a-drawer
    :width="600"
    :visible="drawerVisible"
    unmount-on-close
    class="securityDepartMentDrawer"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title> {{ title }} </template>
    <TableListCard :autoTableHeight="false">
      <template #headerTips v-if="props.tips">
        <div class="tips">
          <icon-info-circle size="20" />
          <span>{{ props.tips }}</span>
        </div>
      </template>
      <template #headerInput v-if="props.needSearch">
        <a-form :model="drawerTempSearchForm" layout="inline">
          <a-form-item field="deptId" hide-label label="">
            <a-tree-select
              v-model:model-value="drawerTempSearchForm.deptId"
              :data="deptData"
              allow-search
              allow-clear
              :disable-filter="true"
              :field-names="{
                key: 'id',
                title: 'name',
              }"
              placeholder="请选择部门"
              @search="onDeptSearch"
              @blur="clearSearchKey"
              @clear="clearSearchKey"
            ></a-tree-select>
          </a-form-item>
          <a-form-item field="userName" hide-label label="">
            <a-input
              v-model="drawerTempSearchForm.userName"
              placeholder="员工姓名/手机号码"
              allow-clear
            ></a-input>
          </a-form-item>
        </a-form>
      </template>
      <template #headerBtn v-if="props.needSearch">
        <div class="header-btn">
          <a-button
            type="primary"
            @click="
              () => {
                drawerSelectForm = drawerTempSearchForm;
                getDrawerStaffData();
              }
            "
          >
            <icon-search class="icon" />
            查询
          </a-button>
        </div>
      </template>
      <template #table>
        <a-table
          v-model:selected-keys="currentSelectKeys"
          :data="drawerStaffData.list"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
          :row-selection="{
            type: 'radio',
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
          :total="(drawerStaffData.total as number)"
          @change="currentChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>
  </a-drawer>
</template>
<script lang="ts" setup>
  import { getStaffDataAPI, getStaffDataAllAPI } from '@/api/enterpriseManage';
  import {
    getNotRelatedEmployee,
    getNotRelatedEmployeeByName,
  } from '@/api/user';
  import { useUserStore } from '@/store';
  import { handleOnKeyup } from '@/utils/event';
  import { StaffData } from '@/views/enterpriseManage/staffManage';
  import { useSearch } from '@/views/pitfall/snapshot/composition/useSearch';
  import { TableColumnData } from '@arco-design/web-vue';
  import {
    computed,
    onBeforeMount,
    onMounted,
    reactive,
    ref,
    watch,
  } from 'vue';

  const userStore = useUserStore();

  const props = defineProps({
    title: {
      type: String,
      default: '关联人员选择',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    tips: {
      type: String,
      default: '',
    },
    selectKeys: {
      type: Array,
      default: () => [],
    },
    deptId: {
      type: String,
      default: '',
    },
    userName: {
      type: String,
      default: '',
    },
    needSearch: {
      type: Boolean,
      default: false,
    },
  });

  const emits = defineEmits(['cancel', 'confirm']);

  // 抽屉相关
  const drawerVisible = computed(() => {
    if (props.visible) {
      currentSelectKeys.value = props.selectKeys;
    }
    return props.visible;
  });

  const { deptData, onDeptSearch, clearSearchKey } = useSearch(['deptData']);

  const drawerSelectForm = ref({
    deptId: props.deptId || '',
    userName: props.userName || '',
    pageNo: 1,
    pageSize: 10,
  });
  const drawerTempSearchForm = ref({
    deptId: props.deptId || '',
    userName: props.userName || '',
    pageNo: 1,
    pageSize: 10,
  });

  const drawerStaffData = ref<StaffData>({ list: [], total: 0 });

  const columns: TableColumnData[] = [
    {
      title: '员工姓名',
      width: 100,
      dataIndex: 'userName',
      cellStyle: { width: '9%' },
    },
    {
      title: '手机号码',
      dataIndex: 'tel',
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
    },
    {
      title: '所属岗位',
      dataIndex: 'jobName',
    },
  ];

  const currentSelectKeys = ref<any[]>([]);

  const handleOk = () => {
    let employeeInfo = {};
    if (currentSelectKeys.value.length) {
      employeeInfo =
        drawerStaffData.value.list.find((item) => {
          return currentSelectKeys.value.includes(item.id!);
        }) || {};
    }
    handleCancel();
    emits('confirm', employeeInfo);
  };
  const handleCancel = () => {
    drawerSelectForm.value = {
      deptId: props.deptId || '',
      userName: props.userName || '',
      pageNo: 1,
      pageSize: 10,
    };
    drawerTempSearchForm.value = {
      deptId: props.deptId || '',
      userName: props.userName || '',
      pageNo: 1,
      pageSize: 10,
    };
    emits('cancel');
  };

  const getDrawerStaffData = async () => {
    const api = props.needSearch
      ? getNotRelatedEmployee
      : getNotRelatedEmployeeByName;
    const { data: res } = await api(drawerSelectForm.value);
    drawerStaffData.value = res;
  };

  onBeforeMount(() => {
    getDrawerStaffData();
  });

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      drawerSelectForm.value = drawerTempSearchForm.value;
      getDrawerStaffData();
    });
  });

  // 分页处理
  const currentChange = (current: number) => {
    drawerSelectForm.value.pageNo = current;
    getDrawerStaffData();
  };

  const pageSizeChange = (pageSize: number) => {
    drawerSelectForm.value.pageSize = pageSize;
    getDrawerStaffData();
  };
</script>
<style lang="less" scoped>
  .tips {
    border: 1px solid #d6ebff;
    background-color: #ebf5ff;
    color: var(--color-text-grey1);
    font-size: 12px;
    line-height: 1;
    padding: 10px 0;
    display: flex;
    align-items: center;
    gap: 10px;
    padding-left: 12px;
    border-radius: 8px;
  }
  .arco-card.card-table {
    :deep(.header) {
      margin-top: 10px;
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
    .header .input {
      .arco-form-layout-inline {
        gap: 20px;
      }
      .arco-form-item {
        width: calc((100% - 32px) / 2);
        max-width: calc((100% - 32px) / 2);
      }
    }
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
