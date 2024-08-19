<!-- 用户管理-批量授权 -->
<template>
  <div class="container">
    <TableListCard :autoTableHeight="false">
      <template #headerInput>
        <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
          <a-form-item field="permissionName" label="权限名称">
            <a-input
              v-model.trim="tempSearchForm.permissionName"
              placeholder="请输入权限名称"
              allow-clear
            ></a-input>
          </a-form-item>
        </a-form>
      </template>
      <template #headerBtn>
        <a-space>
          <a-button
            type="primary"
            @click="
              () => {
                selectForm = tempSearchForm;
                getSearchData();
              }
            "
          >
            <icon-search class="icon" />
            查询
          </a-button>
          <a-button @click="resetSelectForm">
            <icon-refresh class="icon" />
            重置
          </a-button>
        </a-space>
      </template>
      <template #minorBtn>
        <a-space>
          <icon-refresh class="minor-icon" size="20" />
        </a-space>
      </template>
      <template #primaryBtn>
        <a-tabs
          v-model:active-key="platform"
          type="card-gutter"
          :hide-content="true"
          @change="handleChange"
        >
          <a-tab-pane
            v-for="item in tabLists"
            :key="item.code"
            :title="item.name"
          >
          </a-tab-pane>
        </a-tabs>
      </template>
      <template #table>
        <div class="tips">
          <icon-info-circle size="20" />
          <span>支持为多个角色批量配置权限</span>
        </div>
        <permissionTree
          v-model:expanded-keys="expandedKeys"
          :treeData="treeData"
          @batchAuth="batchAuth"
        />
      </template>
    </TableListCard>
    <roleListDrawer
      ref="roleListDrawerRef"
      v-model:visible="roleListVisible"
      v-model:select-keys="roleListKeys"
      @cancel="drawerCancel"
      @confirm="drawerConfirm"
    />
  </div>
</template>
<script lang="ts" setup>
  import {
    batchAuthPermission,
    getMenuListEnum,
    getRoleListByMenuId,
  } from '@/api/user';
  import { Message, TableData } from '@arco-design/web-vue';
  import { onMounted, ref } from 'vue';
  import permissionTree from './component/permissionTree.vue';
  import roleListDrawer from './component/roleListDrawer.vue';
  import { handleOnKeyup } from '@/utils/event';

  const tempSearchForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
  });
  const selectForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
  });
  const expandedKeys = ref<(string | number)[]>([]);

  const resetSelectForm = () => {
    selectForm.value = {
      pageNo: selectForm.value.pageNo,
      pageSize: selectForm.value.pageSize,
    };
    tempSearchForm.value = {
      pageNo: selectForm.value.pageNo,
      pageSize: selectForm.value.pageSize,
    };
    getTableList();
  };
  const treeData = ref<TableData[]>([]);

  const filterEmptyChildren = (data: any) => {
    data.forEach((node: any) => {
      if (node.children && node.children.length > 0) {
        // 如果有子节点，递归处理子节点
        filterEmptyChildren(node.children);
      } else {
        // 如果 children 数组为空，删除它
        delete node.children;
      }
    });
    return data;
  };

  const allDataMap = ref<any>(new Map());
  const platform = ref(2);
  const getTableList = async () => {
    if (!allDataMap.value.get(platform.value)) {
      const { data } = await getMenuListEnum(platform.value);
      allDataMap.value.set(platform.value, data);
    }
    const data = allDataMap.value.get(platform.value);
    const filterData = filterEmptyChildren(data);
    treeData.value = filterData;
  };

  getTableList();

  const roleListDrawerRef = ref<any>(null);
  onMounted(() => {
    handleOnKeyup('Enter', () => {
      if (roleListVisible.value) {
        roleListDrawerRef.value.handleSearch();
      } else {
        selectForm.value = tempSearchForm.value;
        getSearchData();
      }
    });
  });

  const selectPermission = ref<any>({});

  const batchAuth = async (data: any) => {
    selectPermission.value = data;
    const { data: res } = await getRoleListByMenuId(platform.value, data.id);
    roleListKeys.value = res;
    openDrawer();
  };

  // 抽屉事件
  const roleListVisible = ref(false);
  const roleListKeys = ref<any[]>([]);
  const openDrawer = () => {
    roleListVisible.value = true;
  };
  const drawerCancel = () => {
    roleListVisible.value = false;
  };
  // 保存接口
  const drawerConfirm = async (ids: any) => {
    const roleIdsSet = ids
      .filter((item: any) => item.status === 2)
      .map((item: any) => item.id);
    const notDeleteRoleIds = ids
      .filter((item: any) => item.status === 1)
      .map((item: any) => item.id);
    let selectedKey = [];
    if (
      selectPermission.value.children &&
      selectPermission.value.children.length
    ) {
      selectedKey = getAllSelectIds(selectPermission.value.children);
    } else {
      selectedKey.push(selectPermission.value.id);
    }
    const params = {
      menuIdSet: selectedKey.join(','),
      roleIdSet: roleIdsSet.join(','),
      notDeleteRoleIds: notDeleteRoleIds.join(','),
    };
    await batchAuthPermission(platform.value, params);
    Message.success('授权成功');
    roleListVisible.value = false;
  };

  function getAllSelectIds(tree: any[], leafIds = []) {
    // 遍历树结构的每一项
    tree.forEach((node) => {
      // 如果当前节点没有子节点，则它是一个叶子节点
      if (!node.children || node.children.length === 0) {
        // 将叶子节点的id添加到结果数组中
        leafIds.push(node.id);
      } else {
        // 如果当前节点还有子节点，那么继续递归遍历子节点
        getAllSelectIds(node.children, leafIds);
      }
    });

    // 返回收集到的所有叶子节点id数组
    return leafIds;
  }

  const getSearchData = () => {
    const data = allDataMap.value.get(platform.value);
    const filterData = filterEmptyChildren(data);
    expandedKeys.value = [];
    treeData.value = searchData(
      selectForm.value.permissionName || '',
      filterData
    );
  };

  function searchData(keyword: string, data: any[]) {
    if (!keyword) {
      return data;
    }
    const loop = (data: any) => {
      const result: any[] = [];
      data.forEach((item: any) => {
        if (item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
          result.push({
            ...item,
          });
        }
        if (item.children) {
          const filterData = loop(item.children);
          if (filterData.length) {
            const index = result.findIndex((i) => i.id === item.id);
            if (item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
              result[index] = {
                ...item,
                children: filterData,
              };
            } else {
              result.push({
                ...item,
                children: filterData,
              });
            }
            expandedKeys.value.push(item.id);
          }
        }
      });

      return result;
    };

    return loop(data);
  }

  const tabLists = [
    // {code: '0', name: '后台'},
    // {code: '1', name: '移动端'},
    { code: 2, name: 'PC管理端' },
    { code: 3, name: '微信小程序端' },
  ];
  const handleChange = () => {
    getTableList();
  };
</script>
<style lang="less" scoped>
  .container {
    .card-table {
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .header-btn {
          display: flex;
          gap: 12px;
          padding-left: 20px;
          border-left: 1px solid var(--bg1);
        }
      }
      .table-btn {
        text-align: right;
        .minor-icon {
          color: #8c8c8c;
          cursor: pointer;
        }
      }
    }
    :deep(.arco-tabs-nav-type-card-gutter) {
      &::before {
        display: none;
      }
      margin-bottom: 0px;
      .arco-tabs-tab {
        border-radius: 5px;
        background-color: var(--bg2);
        border-bottom: 1px solid var(--color-neutral-3);
      }
      .arco-tabs-tab-active {
        background-color: #357cf0;
        color: #ffffff;
      }
    }
  }
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
    margin-bottom: 10px;
    border-radius: 8px;
  }
</style>
