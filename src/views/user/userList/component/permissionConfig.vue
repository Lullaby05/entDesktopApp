<template>
  <div class="permission-config-container">
    <a-tabs
      v-model:active-key="searchForm.platform"
      type="card-gutter"
      :hide-content="true"
      @change="handleChange"
    >
      <a-tab-pane v-for="item in tabLists" :key="item.code" :title="item.name">
      </a-tab-pane>
    </a-tabs>
    <div class="permission-tree">
      <div>
        <div class="label">功能权限：</div>
        <a-checkbox v-if="props.needEdit" v-model="isFold"
          >展开/折叠</a-checkbox
        >
        <a-checkbox v-if="props.needEdit" v-model="isCheckAll"
          >全选/全不选</a-checkbox
        >
      </div>
      <div class="tree">
        <a-table
          v-if="searchForm.platform === 2"
          v-model:selected-keys="pcPermissionList"
          v-model:expanded-keys="pcExpandKeys"
          ref="treeDomRef"
          :data="treeData"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
          :row-selection="{
            type: 'checkbox',
            width: 30,
            checkStrictly: false,
            onlyCurrent: false,
            showCheckedAll: false,
          }"
          @select="handleSelect"
        >
        </a-table>
        <a-table
          v-if="searchForm.platform === 3"
          v-model:selected-keys="wxPermissionList"
          v-model:expanded-keys="wxExpandKeys"
          ref="treeDomRef"
          :data="treeData"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
          :row-selection="{
            type: 'checkbox',
            width: 30,
            checkStrictly: false,
            onlyCurrent: false,
            showCheckedAll: false,
          }"
          @select="handleSelect"
        >
        </a-table>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { getMenuListEnum } from '@/api/user';
  import {
    Message,
    Table,
    TableColumnData,
    TableData,
  } from '@arco-design/web-vue';
  import { nextTick } from 'vue';
  import { computed, ref } from 'vue';

  const props = defineProps({
    pcPermissionList: {
      type: Array<string | number>,
      default: () => [],
    },
    wxPermissionList: {
      type: Array<string | number>,
      default: () => [],
    },
    needEdit: {
      type: Boolean,
      default: true,
    },
  });

  const tabLists = [
    // {code: '0', name: '后台'},
    // {code: '1', name: '移动端'},
    { code: 2, name: 'PC管理端' },
    { code: 3, name: '微信小程序端' },
  ];

  const searchForm = ref({ platform: 2 });
  const treeDomRef = ref<InstanceType<typeof Table> | null>(null);

  const handleChange = async () => {
    getTreeData();
  };

  const isFold = computed({
    get() {
      if (searchForm.value.platform === 2) {
        return pcExpandKeys.value.length === allExpandIds.value.length;
      } else {
        return wxExpandKeys.value.length === allExpandIds.value.length;
      }
    },
    set(val) {
      changeFold(val);
    },
  });
  const isCheckAll = computed({
    get() {
      const obj = {
        2: pcPermissionList,
        3: wxPermissionList,
      };
      if (
        !obj[searchForm.value.platform as 2 | 3].value ||
        obj[searchForm.value.platform as 2 | 3].value.length === 0
      )
        return false;
      return (
        (obj[searchForm.value.platform as 2 | 3].value || []).length ===
        allSelectIds.value.length
      );
    },
    set(val) {
      changeCheckAll(val);
    },
  });
  const changeFold = (val: boolean) => {
    const obj = {
      2: pcExpandKeys,
      3: wxExpandKeys,
    };
    if (val) {
      obj[searchForm.value.platform as 2 | 3].value = allExpandIds.value;
    } else {
      obj[searchForm.value.platform as 2 | 3].value = [];
    }
  };
  const changeCheckAll = (val: boolean) => {
    const obj = {
      2: pcPermissionList,
      3: wxPermissionList,
    };
    if (val) {
      obj[searchForm.value.platform as 2 | 3].value = allSelectIds.value;
    } else {
      obj[searchForm.value.platform as 2 | 3].value = [];
    }
  };

  const emits = defineEmits([
    'update:pcPermissionList',
    'update:wxPermissionList',
  ]);
  const allSelectIds = ref<string[]>([]);
  const allExpandIds = ref<string[]>([]);
  const pcPermissionList = computed({
    get() {
      return props.pcPermissionList;
    },
    set(val) {
      emits('update:pcPermissionList', val);
    },
  });
  const wxPermissionList = computed({
    get() {
      return props.wxPermissionList;
    },
    set(val) {
      emits('update:wxPermissionList', val);
    },
  });
  const pcExpandKeys = ref<string[]>([]);
  const wxExpandKeys = ref<string[]>([]);
  const allDataMap = ref<any>(new Map());
  const treeData = ref([]);
  const columns: TableColumnData[] = [
    { title: '权限名称', dataIndex: 'name', width: 200 },
    { title: '权限说明', dataIndex: 'menuDesc', width: 500 },
  ];

  const getTreeData = async () => {
    if (!allDataMap.value.get(searchForm.value.platform)) {
      const { data } = await getMenuListEnum(searchForm.value.platform);
      allDataMap.value.set(searchForm.value.platform, data);
    }
    treeData.value = allDataMap.value.get(searchForm.value.platform);
    allExpandIds.value = getAllExpandIds(treeData.value);
    allSelectIds.value = getAllSelectIds(treeData.value);
  };

  function getAllExpandIds(tree: any[]) {
    let rootNodesWithChildren: any = [];
    function traverseTree(node: any) {
      if (Array.isArray(node.children) && node.children.length > 0) {
        rootNodesWithChildren.push(node.id);
        for (const child of node.children) {
          traverseTree(child);
        }
      }
    }
    for (const node of tree) {
      traverseTree(node);
    }
    return rootNodesWithChildren;
  }

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

  getTreeData();

  const getTotalSubTree = () => {
    return {
      pcPermissionList: pcPermissionList.value,
      wxPermissionList: wxPermissionList.value,
    };
  };

  const handleSelect = (
    rowKeys: (string | number)[],
    _rowKey: string | number,
    record: TableData
  ) => {
    const obj = {
      2: pcPermissionList,
      3: wxPermissionList,
    };
    // listData是改变前的数据
    // record是当前点击的节点
    // rowKeys是改变后的数据
    const listData = obj[searchForm.value.platform as 2 | 3];
    const siblings = findNodeById(record.parentId, treeData.value); // 同级的所有节点

    // 如果是查看节点则需要判断当前同级节点是否有其他节点被选中（包括同级节点中的子节点），有则不可取消选中
    function judgePeerNodeSelected() {
      const siblingNodeSelected = hasOtherNodeSelected(
        siblings.children.slice(1),
        rowKeys
      );
      return siblingNodeSelected;
    }
    if (record.name === '查看' && !rowKeys.includes(record.id)) {
      if (judgePeerNodeSelected()) {
        Message.warning('该角色拥有此模块其他操作权限，无法取消查看权限');
        setTimeout(() => {
          listData.value.push(record.id);
        }, 0);
      }
    }

    // 如果选中的是其他节点
    function handleOtherNodeSelected(record: any, siblings: any) {
      listData.value.push(record.id);
      if (record.name !== '查看' && listData.value.includes(record.id)) {
        if (siblings && siblings.children[0].name === '查看') {
          if (!rowKeys.includes(siblings.children[0].id)) {
            setTimeout(() => {
              listData.value.push(siblings.children[0].id);
            });
          }
        }
        setTimeout(() => {
          if (record.children && record.children.length) {
            listData.value = listData.value.filter((id) => id !== record.id);
          }
        }, 0);
      }
    }
    // 1.如果选中的是同级节点，则把该节点的查看节点一起选中
    handleOtherNodeSelected(record, siblings);

    // 2.如果选中的是子节点，则把该子节点的查看节点和父级所有的查看节点一起选中
    function handleParentSelected(record: any) {
      if (!record.parentId) return;
      const parent = findNodeById(record.parentId, treeData.value);
      if (!parent || (parent && !parent.parentId)) return;
      const siblings = findNodeById(parent.parentId, treeData.value);
      handleOtherNodeSelected(parent, siblings);
      handleParentSelected(parent);
    }
    if (rowKeys.includes(record.id)) {
      handleParentSelected(record);
    }

    // 通过id查找到对应节点
    function findNodeById(id: string | number, tree: any[]): any {
      for (let node of tree) {
        if (node.id === id) {
          return node;
        }
        if (node.children) {
          let result = findNodeById(id, node.children);
          if (result) {
            return result;
          }
        }
      }
      return null;
    }
    // 一个数组除了name为查看的节点外，其他节点是否有选中（包括子节点的选中）
    function hasOtherNodeSelected(nodes: any[], rowKeys: (string | number)[]) {
      for (let node of nodes) {
        if (rowKeys.includes(node.id)) {
          return true;
        }
        if (node.children) {
          let result = hasOtherNodeSelected(node.children, rowKeys);
          if (result) {
            return true;
          }
        }
      }
      return false;
    }
  };

  defineExpose({
    getTotalSubTree,
  });
</script>
<style lang="less" scoped>
  .permission-config-container :deep(.arco-tabs-nav-type-card-gutter) {
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
  .permission-config-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
    .permission-tree {
      display: flex;
      flex-direction: column;
      gap: 24px;
      & > div:nth-of-type(1) {
        display: flex;
      }
      .label {
        color: var(--color-text-2);
      }
    }
  }
</style>
