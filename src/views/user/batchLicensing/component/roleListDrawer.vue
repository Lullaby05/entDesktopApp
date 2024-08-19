<!-- 获取关联人员 -->
<template>
  <a-drawer
    :width="600"
    :visible="drawerVisible"
    class="securityDepartMentDrawer"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title> 批量授权 </template>
    <TableListCard :autoTableHeight="false">
      <template #headerInput>
        <a-space :size="[10, 0]">
          <a-input
            v-model.trim="drawerTempSearchForm.name"
            placeholder="角色名称"
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

      <template #table>
        <a-table
          :data="drawerRoleData.list"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #selectionAll>
            <a-checkbox
              :model-value="checkboxAll"
              :indeterminate="checkboxIndeterminate"
              @change="checkboxChangeAll"
            ></a-checkbox>
          </template>
          <template #selection="{ record }">
            <a-checkbox
              :model-value="record.status === 2"
              :indeterminate="record.status === 1"
              @change="checkboxChange(record)"
            ></a-checkbox>
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
          :total="(drawerRoleData.total as number)"
          @change="currentChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>
  </a-drawer>
</template>
<script lang="ts" setup>
  import { getRoleList } from '@/api/user';
  import { handleOnKeyup } from '@/utils/event';
  import { TableColumnData, TableData } from '@arco-design/web-vue';
  import { computed, onMounted, ref, watch } from 'vue';

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false,
    },
    selectKeys: {
      type: Array,
      default: () => [],
    },
  });

  const emits = defineEmits([
    'cancel',
    'confirm',
    'update:selectKeys',
    'update:visible',
  ]);

  // 抽屉相关
  const drawerVisible = computed({
    get() {
      return props.visible;
    },
    set(val) {
      emits('update:visible', val);
    },
  });

  watch(
    () => props.visible,
    (val) => {
      if (val) {
        drawerSelectForm.value = {
          name: '',
          pageNo: 1,
          pageSize: 10,
        };
        drawerTempSearchForm.value = {
          name: '',
          pageNo: 1,
          pageSize: 10,
        };
        getDrawerStaffData();
      }
    }
  );

  const drawerSelectForm = ref({
    name: '',
    pageNo: 1,
    pageSize: 10,
  });
  const drawerTempSearchForm = ref({
    name: '',
    pageNo: 1,
    pageSize: 10,
  });

  const drawerRoleData = ref<any>({ list: [], total: 0 });
  const allTableData = ref<TableData[]>([]);

  const deduplicateByProperty = (arr: any[], property: string) => {
    return arr.reduce((uniqueArr, item) => {
      if (
        !uniqueArr.some(
          (i: { [x: string]: any }) => i[property] === item[property]
        )
      ) {
        uniqueArr.push(item);
      }
      return uniqueArr;
    }, []);
  };

  const columns: TableColumnData[] = [
    {
      title: '',
      width: 60,
      slotName: 'selection',
      titleSlotName: 'selectionAll',
    },
    {
      title: '角色名称',
      width: 200,
      dataIndex: 'name',
      cellStyle: { width: '17%' },
    },
    {
      title: '角色说明',
      dataIndex: 'remark',
    },
  ];

  const currentSelectKeys = computed({
    get() {
      return props.selectKeys;
    },
    set(val) {
      emits('update:selectKeys', val);
    },
  });

  const handleSearch = () => {
    drawerSelectForm.value = drawerTempSearchForm.value;
    drawerSelectForm.value.pageNo = 1;
    getDrawerStaffData();
  };
  defineExpose({
    handleSearch,
  });

  const handleOk = () => {
    // let employeeInfo = {};
    // if (currentSelectKeys.value.length) {
    //   employeeInfo =
    //     drawerRoleData.value.list.find((item: any) => {
    //       return currentSelectKeys.value.includes(item.id!);
    //     }) || {};
    // }
    // handleCancel();
    const keys = currentSelectKeys.value.map((ele: any) => {
      const record: any = allTableData.value.find(
        (item: any) => item.id === ele.id
      );
      return {
        ...ele,
        status: record ? record.status : ele.status,
      };
    });
    emits('confirm', keys);
  };
  const handleCancel = () => {
    emits('cancel');
  };

  const getDrawerStaffData = async () => {
    const { data: res } = await getRoleList(drawerSelectForm.value);
    drawerRoleData.value.total = res.total;
    drawerRoleData.value.list = res.list.map((ele: any) => {
      const obj: any = currentSelectKeys.value.find(
        (item: any) => item.id === ele.id
      );
      return {
        ...ele,
        status: obj ? obj.status : 0,
      };
    });
    allTableData.value = deduplicateByProperty(
      [...drawerRoleData.value.list, ...allTableData.value],
      'id'
    );
  };

  // 分页处理
  const currentChange = (current: number) => {
    drawerSelectForm.value.pageNo = current;
    getDrawerStaffData();
  };

  const pageSizeChange = (pageSize: number) => {
    drawerSelectForm.value.pageSize = pageSize;
    getDrawerStaffData();
  };

  const checkboxAll = computed(() => {
    return drawerRoleData.value.list.length
      ? drawerRoleData.value.list.every((ele: any) => ele.status === 2)
      : false;
  });

  const checkboxIndeterminate = computed(() => {
    return drawerRoleData.value.list.length
      ? drawerRoleData.value.list.some((ele: any) => ele.status !== 2) &&
          drawerRoleData.value.list.some((ele: any) => ele.status !== 0)
      : false;
  });

  const checkboxChange = (record: any) => {
    // 模拟多选框的点击事件（可半选）
    record.status = record.status === 2 ? 0 : 2;
  };

  const checkboxChangeAll = () => {
    if (checkboxAll.value) {
      const list = drawerRoleData.value.list.map((ele: any) => ({
        ...ele,
        status: 0,
      }));
      drawerRoleData.value.list = list;
      allTableData.value = deduplicateByProperty(
        [...list, ...allTableData.value],
        'id'
      );
    } else {
      const list = drawerRoleData.value.list.map((ele: any) => ({
        ...ele,
        status: 2,
      }));
      drawerRoleData.value.list = list;
      allTableData.value = deduplicateByProperty(
        [...list, ...allTableData.value],
        'id'
      );
    }
  };
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
