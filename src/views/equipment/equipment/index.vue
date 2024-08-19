<!-- 
    @author wml
    @date 2023-06-14
    @name 设备设施管理
 -->
<template>
  <div class="container">
    <a-card style="margin-bottom: 20px">
      <template #title>
        <span>设 备 设 施 检 索 </span>
      </template>
      <Search @reset="resetSearch" @search="handleSearch">
        <template #form>
          <!-- form 插槽的内容放这里 -->
          <a-form
            layout="inline"
            :model="searchParams"
            @keyup.enter="handleSearch"
            @keyup.esc="resetSearch"
          >
            <a-form-item field="deptId1" label="选择所属部门">
              <a-tree-select
                v-model="searchParams.deptId"
                :data="treeData"
                placeholder="所属部门"
              ></a-tree-select>
            </a-form-item>
            <a-form-item field="name" label="设备名称">
              <a-input
                v-model="searchParams.name"
                placeholder="设备名称"
              ></a-input>
            </a-form-item>
            <a-form-item field="masterNick" label="责任人">
              <a-input
                v-model="searchParams.masterId"
                placeholder="责任人"
              ></a-input>
            </a-form-item>
            <a-form-item field="equipmentTypeId" label="设备设施类型">
              <a-select
                v-model="searchParams.equipmentTypeId"
                placeholder="所有分类"
              >
                <a-option value="1666013288107824106">环保设备</a-option>
                <a-option value="1666013288107825106">消防设备</a-option>
                <a-option value="1666013288107827106">特种设备</a-option>
                <a-option value="1666013288107826106">特殊设备</a-option>
                <a-option value="1666013288107813106">一般设备</a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="status" label="设备设施状态">
              <a-select v-model="searchParams.status" placeholder="设备状态">
                <a-option value="0">在用</a-option>
                <a-option value="1">停用</a-option>
                <a-option value="2">维修中</a-option>
                <a-option value="3">报废</a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="location" label="安装位置">
              <a-input
                v-model="searchParams.location"
                placeholder="安装位置"
              ></a-input>
            </a-form-item>
          </a-form>
        </template>
      </Search>
      <a-divider />
      <div class="tool">
        <div class="tool-left">
          <a-button type="text" class="btn-item" @click="add">新增</a-button>
          <a-button type="text" class="btn-item" @click="deleteClick"
            >删除</a-button
          >
          <a-button type="text" class="btn-item" @click="upload"
            >批量导入</a-button
          >
        </div>
        <div class="tool-right">
          <a-button type="text" class="btn-item" @click="resetSearch"
            ><icon-refresh
          /></a-button>
          <a-button type="text" class="btn-item" @click="exportFile"
            >导出</a-button
          >
        </div>
      </div>
      <a-table
        v-model:selectedKeys="selectedKeys"
        :data="renderList"
        :row-selection="rowSelection"
        row-key="id"
        stripe
        :pagination="false"
        :bordered="false"
        :style="{ height: '100%' }"
        :draggable="{}"
        @change="handleChange"
        @select="selectClick"
        @select-all="selectAllClick"
        @selection-change="selectionChangeClick"
      >
        <template #columns>
          <a-table-column title="序号" :width="60">
            <!-- 给每一行的索引起名称 可以使用数组或迭代器或其他方 -->
            <template #cell="{ rowIndex }">
              {{ rowIndex + 1 }}
            </template>
          </a-table-column>
          <a-table-column
            title="设备名称"
            data-index="name"
            :width="150"
          ></a-table-column>
          <a-table-column
            title="设备类型"
            data-index="equipmentTypeName"
            :width="150"
          ></a-table-column>
          <a-table-column
            title="规格型号"
            data-index="specification"
            :width="150"
          ></a-table-column>
          <a-table-column
            title="安装位置"
            data-index="location"
            :width="150"
          ></a-table-column>
          <a-table-column
            title="自编号"
            data-index="equipmentNumber"
            :width="150"
          ></a-table-column>
          <a-table-column
            title="所属部门"
            data-index="deptName"
            :width="150"
          ></a-table-column>
          <a-table-column
            title="设备责任人"
            data-index="masterNick"
            :width="150"
          ></a-table-column>
          <a-table-column title="设备状态" data-index="status" :width="100">
            <template #cell="{ record }">
              <a-tag
                :color="$G.EQUIPMENT_STATUS_COLOR[record.status]"
                style="width: 50px"
              >
                {{
                  $G.EQUIPMENT_STATUS[record.status] == null
                    ? record.status
                    : $G.EQUIPMENT_STATUS[record.status]
                }}
              </a-tag>
            </template>
          </a-table-column>
          <a-table-column
            title="操作"
            fixed="right"
            :scroll="scroll"
            :width="270"
          >
            <template #cell="{ record }">
              <a-button type="text" @click="tableDetailClick(record)"
                >详情</a-button
              >
              <a-button type="text" @click="tableEditClick(record)"
                >编辑</a-button
              >
              <a-button type="text" @click="tableInfoCardClick(record)"
                >标识卡</a-button
              >
              <a-popover position="bottom">
                <a-button type="text">...</a-button>
                <template #content>
                  <a-button type="text" @click="deleteOneClick(record)"
                    >删除</a-button
                  >
                </template>
              </a-popover>
            </template>
          </a-table-column>
        </template>
      </a-table>
      <div class="pagination">
        <a-pagination
          :total="total"
          show-total
          show-jumper
          show-page-size
          :style="{ justifyContent: 'center' }"
          @change="((current: number) => pageChange(current))"
          @page-size-change="((pageSize: number) => pageSizeChange(pageSize))"
        />
      </div>
    </a-card>
    <ExportFileDialog
      :export-flag="dialogFlags.exportFlag"
      :search-params="searchParams"
      @commit="exportCommit"
      @close="exportclose"
    ></ExportFileDialog>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { cloneDeep } from 'lodash';
  import type {
    TableData,
    TableRowSelection,
    TableChangeExtra,
  } from '@arco-design/web-vue/es/table/interface';
  import type { TreeNodeData } from '@arco-design/web-vue/es/tree/interface';
  import { Modal, Notification } from '@arco-design/web-vue';
  import { getPage, deleteFun } from '@/api/equipment';

  import useLoading from '@/hooks/loading';
  import Search from '@/components/search/Search.vue';
  import ExportFileDialog from '@/components/equipment/ExportFileDialog.vue';

  const router = useRouter();
  // 表格多选框配置
  const rowSelection = ref<TableRowSelection>({
    type: 'checkbox',
    showCheckedAll: true,
    onlyCurrent: false,
  });
  const renderList = ref<any>();
  const searchParams = ref({
    name: '',
    deptId: '',
    masterId: '',
    equipmentTypeId: '',
    location: '',
    status: '',
    pageNo: 1,
    pageSize: 10,
  });
  // 总条目数量，初始化为0。记得计算显示条目数量时间。
  const total = ref(0);
  // 每页显示条目数量。记得计算显示条目数量时间。或
  // const pageSize = ref(10);
  // 树形数据，用于展示分组树形结构。或者使用展示树形结
  const treeData: TreeNodeData[] = [
    {
      key: '10',
      title: '财务部',
      disabled: true,
      children: [
        { key: '12', title: '会计' },
        { key: '13', title: '出纳' },
        { key: '14', title: '财务' },
      ],
    },
    {
      key: '30',
      title: 'IT研发部',
      children: [
        { key: '34', title: '硬件研发组' },
        { key: '35', title: '前端研发组' },
        { key: '36', title: '后端研发组' },
      ],
    },
    {
      key: '40',
      title: '行政部',
      children: [
        { key: '44', title: '内务组' },
        { key: '45', title: '前台' },
        { key: '46', title: 'HR' },
      ],
    },
    {
      key: '50',
      title: '市场部',
      children: [
        { key: '54', title: '销售' },
        { key: '55', title: '售后' },
        { key: '56', title: '售前' },
      ],
    },
  ];
  const selectedKeys = ref([]);
  const dialogFlags = ref({
    createFlag: false, // 创建页面弹窗标识
    exportFlag: false, // 导出页面弹窗标识
    uploadFlag: false, // 上传页面弹窗标识
    deletesFlag: false, // 删除页面弹窗标识
    manageTypeFlag: false, // 管理设备类别列表页面弹窗标识
    editFlag: false, // 编辑页面弹窗标识
    detailFlag: false, // 详情页面弹窗标识
    infoCardFlag: false, // 设备身份卡弹窗标识
  });
  // excel上传路径
  // const uploadUrl = ref('/dev/businessApi/business/equipment/import-excel');

  const { setLoading } = useLoading();
  const defaultSearchParams = {
    name: '',
    deptId: '',
    masterId: '',
    equipmentTypeId: '',
    location: '',
    status: '',
    pageNo: 1,
    pageSize: 10,
  };

  const scroll = {
    x: 2000,
    y: 200,
  };

  // --请求 start-------------------------------------------------------------
  const deleteRequst = async () => {
    const res: any = await deleteFun({ ids: selectedKeys.value.toString() });
    console.log('deleteFun=', res.data);
    return res.data;
  };

  const deleteOneRequst = async (id: any) => {
    const res: any = await deleteFun({ ids: id });
    console.log('deleteFun=', res.data);
    return res.data;
  };
  // --请求 end-------------------------------------------------------------

  // 表格渲染事件------------------------------------------------
  const fetchData = async (type: string) => {
    try {
      console.log(type);
      setLoading(true);
      const res: TableData = await getPage(searchParams.value);
      renderList.value = res.data.list;
      total.value = res.data.total;
    } catch (err) {
      console.log(err);
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const pageChange = async (currentChange: number) => {
    console.log('current', currentChange);
    searchParams.value.pageNo = currentChange; // 当前页码 （从1开始） （当currentChange为1时，不需要传
    fetchData('');
  };

  const pageSizeChange = async (sizeChange: number) => {
    console.log('pageSize', sizeChange);
    searchParams.value.pageSize = sizeChange;
    searchParams.value.pageNo = 1;
    fetchData('');
  };

  // 表格 行拖拽事件
  const handleChange = (
    tableData: TableData[],
    extra: TableChangeExtra,
    currentData: TableData[]
  ) => {
    console.log('行拖拽事件: ', tableData, extra, currentData);
    renderList.value = tableData;
    // window.print();
  };
  // 表格渲染事件  end-------------------------------------------------------

  // 表格操作栏  点击事件 statr-------------------------------------------------------
  const tableEditClick = async (record: any) => {
    router.push({
      path: 'equipmentEdit',
      query: {
        record: record.id, // 将数组转换为字符串形式的字符串参数
      },
    });
  };

  const tableDetailClick = (record: any) => {
    router.push({
      path: 'equipmentDetail',
      query: {
        record: record.id,
      },
    });
  };

  const tableInfoCardClick = async (record: any) => {
    router.push({
      path: 'equipmentInfoCard',
      query: {
        record: record.id,
      },
    });
  };
  // 表格操作栏  点击事件 end-------------------------------------------------------

  // --搜索组件 搜索事件 statr------------------------------------------------
  const handleSearch = () => {
    console.log('搜索');
    fetchData('开始渲染');
    Notification.info({
      title: '查 询 成 功',
      content: '',
    });
  };

  const resetSearch = () => {
    searchParams.value = cloneDeep(defaultSearchParams);
    selectedKeys.value = [];
    console.log(
      'searchParams.value =',
      searchParams.value,
      defaultSearchParams
    );
    fetchData('开始渲染');
    Notification.info({
      title: '刷 新 成 功',
      content: '',
    });
  };
  // --搜索组件 搜索事件  end------------------------------------------------

  // --工具栏菜单 点击事件 statr------------------------------------------------
  const add = () => {
    console.log('add');
    router.push({
      path: 'equipmentCreate',
    });
  };

  const exportFile = () => {
    console.log('exportFile');
    dialogFlags.value.exportFlag = true;
  };

  const exportCommit = () => {
    dialogFlags.value.exportFlag = false;
  };

  const exportclose = () => {
    dialogFlags.value.exportFlag = false;
  };

  const upload = () => {
    console.log('upload');
    router.push({
      path: 'equipmentImport',
    });
  };

  const deleteClick = () => {
    if (selectedKeys.value.length === 0) {
      Notification.warning({
        title: '请选择要删除的设备',
        content: '',
      });
      return;
    }
    console.log('deletes');
    Modal.info({
      title: '删除设备',
      content: '是否删除已选择的设备',
      closable: true,
      okText: '确定',
      cancelText: '取消',
      hideCancel: false,
      onOk: async () => {
        const res = await deleteRequst();
        if (res.code > 200) {
          Notification.error({
            title: '删 除 设 备 失 败',
            content: '原因为=' + res.msg,
          });
          return false;
        }
        Notification.info({
          title: '删 除 设 备 成 功',
          content: '',
        });
        fetchData('删除设备成功，重新渲染');
        return true;
      },
    });
  };

  const deleteOneClick = (record: any) => {
    Modal.info({
      title: '删除设备',
      content: '是否删除已选择的设备',
      closable: true,
      okText: '确定',
      cancelText: '取消',
      hideCancel: false,
      onOk: async () => {
        const res = await deleteOneRequst(record.id);
        if (res.code > 200) {
          Notification.error({
            title: '删 除 设 备 失 败',
            content: '原因为=' + res.msg,
          });
          return false;
        }
        Notification.info({
          title: '删 除 设 备 成 功',
          content: '',
        });
        fetchData('删除设备成功，重新渲染');
        return true;
      },
    });
  };
  // --下拉菜单 点击事件 end------------------------------------------------

  // --表格选择事件 statr------------------------------------------------
  const selectClick = (
    rowKeys: (string | number)[],
    rowKey: string | number,
    record: TableData
  ) => {
    console.log('select', rowKeys, rowKey, record);
  };

  const selectAllClick = (flag: boolean) => {
    console.log('selectAll', flag);
  };

  const selectionChangeClick = (rowKeys: (string | number)[]) => {
    console.log('selectionChange', rowKeys);
    console.log('sss');
  };

  watch(
    () => router.currentRoute.value.path,
    (toPath) => {
      if (toPath === '/equipment/equipmentIndex') {
        fetchData('刷新渲染');
      }
    },
    { immediate: true, deep: true }
  );
</script>

<style lang="less" scoped>
  .pagination {
    position: fixed;
    bottom: 0px;
    right: 30px;
    width: calc(100% - 280px);
    background: var(--color-white);
    border: 1px solid var(--color-neutral-3);
    border-radius: var(--border-radius-small);
    z-index: 99;
  }
  .arco-pagination {
    margin: 15px 0;
  }
  .arco-form {
    .arco-form-item-content {
      span {
        border-radius: 3px;
      }
    }
  }
  :deep(.arco-select-view-single) {
    border-radius: 3px;
  }
  .table-box {
    margin-bottom: 44px;
  }
  .tool {
    display: flex;
    margin-bottom: 10px;
    justify-content: space-between;
    color: rgb(121, 121, 121);
  }

  .btn-item {
    border-radius: 4.5px;
    border: 1px solid rgb(225 225 225);
    margin-right: 20px;
    color: rgb(121, 121, 121);
  }
</style>
