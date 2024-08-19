<!-- 用户管理-角色管理列表 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form :model="tempSearchForm" layout="inline">
          <a-form-item field="name" label="角色名称">
            <a-input
              v-model="tempSearchForm.name"
              placeholder="请输入角色名称"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="status" label="角色状态">
            <a-select
              v-model="tempSearchForm.status"
              placeholder="请选择角色状态"
              allow-search
              allow-clear
            >
              <a-option
                v-for="item in roleStatusList"
                :key="item.dictValue"
                :value="item.dictValue"
                >{{ item.dictKey }}</a-option
              >
            </a-select>
          </a-form-item>
        </a-form>
      </template>
      <template #headerBtn>
        <div class="header-btn">
          <a-button
            type="primary"
            @click="
              () => {
                selectForm = tempSearchForm;
                getTableList();
              }
            "
          >
            <icon-search class="icon" />
            查询
          </a-button>
          <a-button @click="handleReset">
            <icon-refresh class="icon" />
            重置
          </a-button>
        </div>
      </template>
      <template #primaryBtn>
        <a-space>
          <a-button
            v-permission="'RoleListAdd'"
            type="primary"
            @click="modalVisible = true"
          >
            <icon-plus class="icon" />
            新增
          </a-button>
        </a-space>
      </template>
      <template #minorBtn>
        <a-space>
          <icon-refresh class="minor-icon" size="20" />
        </a-space>
      </template>
      <template #table>
        <a-table
          :data="roleList.list"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #userCount="{ record }">
            <a-button type="text" @click="toUserPage(record)">{{
              record.userCount
            }}</a-button>
          </template>
          <template #status="{ record }">
            {{
              roleStatusList.find(
                (item: any) => item.dictValue === record.status
              )?.dictKey
            }}
          </template>
          <template #option="{ record }">
            <div>
              <a-button
                v-permission="'RoleListEdit'"
                type="text"
                size="mini"
                @click="editModal(record)"
              >
                编辑
              </a-button>
              <a-button
                v-permission="'RoleListLicensing'"
                v-if="record.code !== 'tenant_admin'"
                type="text"
                size="mini"
                @click="toPermissionEditPage(record)"
              >
                权限分配
              </a-button>
              <a-button
                v-permission="'RoleListDelete'"
                type="text"
                size="mini"
                status="danger"
                @click="deleteRoleFn(record)"
              >
                删除
              </a-button>
            </div>
          </template>
        </a-table>
      </template>
      <template #pagination>
        <a-pagination
          :current="selectForm.pageNo"
          :page-size="selectForm.pageSize"
          show-total
          show-page-size
          :page-size-options="[10, 20, 50, 100]"
          :base-size="3"
          :buffer-size="1"
          :total="(roleList.total as number)"
          @change="pageChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>
    <a-modal
      title-align="start"
      class="safetyMeasureModal"
      :visible="modalVisible"
      :title="modalTitle"
      ok-text="保存"
      @ok="updateRoleFn"
      @cancel="closeModal"
    >
      <a-form ref="modalFormRef" :model="modalForm">
        <a-form-item field="name" label="角色名称" :rules="modalFormRule.name">
          <a-input
            v-model="modalForm.name"
            placeholder="请输入角色名称"
            allow-clear
            allow-search
          ></a-input>
        </a-form-item>
        <a-form-item
          field="status"
          label="角色状态"
          :rules="modalFormRule.status"
        >
          <a-switch
            v-model="modalForm.status"
            :checked-value="0"
            :unchecked-value="1"
            :before-change="changeStatus"
          >
            <template #checked> 启用 </template>
            <template #unchecked> 禁用 </template>
          </a-switch>
        </a-form-item>
        <a-form-item
          field="remark"
          label="角色说明"
          :rules="modalFormRule.remark"
        >
          <a-textarea
            v-model="modalForm.remark"
            allow-clear
            show-word-limit
            :auto-size="{
              minRows: 6,
              maxRows: 6,
            }"
            :max-length="200"
            placeholder="请输入角色说明"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>
<script lang="ts" setup name="RoleList">
  import { addRoleApi, deleteRole, getRoleList, updateRole } from '@/api/user';
  import {
    Message,
    Modal,
    TableColumnData,
    TableData,
  } from '@arco-design/web-vue';
  import { h, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { cloneDeep } from 'lodash';
  import { handleOnKeyup } from '@/utils/event';

  // 角色状态下拉
  const roleStatusList = ref<any>([
    {
      dictValue: 0,
      dictKey: '启用',
    },
    {
      dictValue: 1,
      dictKey: '禁用',
    },
  ]);
  const tempSearchForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
  });
  const selectForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
  });

  const columns: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
    },
    {
      title: '角色名称',
      dataIndex: 'name',
    },
    {
      title: '角色说明',
      dataIndex: 'remark',
    },
    {
      title: '用户数',
      dataIndex: 'userCount',
      slotName: 'userCount',
    },
    {
      title: '权限数量',
      dataIndex: 'menuCount',
    },
    {
      title: '角色状态',
      dataIndex: 'status',
      bodyCellStyle: (record: TableData) => {
        return {
          color: record.status === 0 ? '#43cf7c' : '#f53f3f',
        };
      },
      slotName: 'status',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '最后修改时间',
      dataIndex: 'updateTime',
    },
    {
      title: '操作',
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];

  const roleList = ref<any>({ total: 0, list: [] });

  const getTableList = async () => {
    const { data } = await getRoleList(selectForm.value);
    roleList.value = data;
  };

  getTableList();

  // 重置操作
  const handleReset = () => {
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

  const pageChange = (page: number) => {
    selectForm.value.pageNo = page;
    getTableList();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getTableList();
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getTableList();
    });
  });

  // 弹窗新增、编辑部分
  const modalVisible = ref(false);
  const modalFormRef = ref<any>(null);
  const modalTitle = ref('新增角色');
  const modalForm = ref<{
    id?: string;
    name: string;
    status: number;
    remark: string;
    [x: string]: any;
  }>({
    name: '',
    status: 0,
    remark: '',
  });
  const modalFormRule = ref({
    name: [
      { required: true, message: '请输入角色名称', trigger: 'blur' },
      { maxLength: 20, message: '不能超过20字符' },
    ],
    status: [{ required: true, message: '请选择角色状态', trigger: 'blur' }],
    remark: [{ maxLength: 200, message: '请输入角色说明', trigger: 'blur' }],
  });
  const closeModal = () => {
    modalVisible.value = false;
    modalForm.value = {
      name: '',
      status: 0,
      remark: '',
    };
    modalFormRef.value.clearValidate();
    modalTitle.value = '新增角色';
  };
  const editModal = (record: any) => {
    modalTitle.value = '编辑角色';
    modalForm.value = cloneDeep(record);
    modalVisible.value = true;
  };
  const updateRoleFn = async () => {
    const valid = await modalFormRef.value!.validate();
    if (!valid) {
      const params = {
        ...modalForm.value,
        code: modalForm.value.name,
        sort: 0,
      };
      const api = modalForm.value.id ? updateRole : addRoleApi;
      const { data: id } = await api(params);
      Message.success(!modalForm.value?.id ? '新增成功' : '编辑成功');
      getTableList();
      if (!modalForm.value.id) {
        Modal.open({
          title: '提示',
          titleAlign: 'start',
          content: '新增角色成功，是否立即为此角色进行权限配置？',
          okText: '前往配置',
          cancelText: '暂不配置',
          onOk: () => {
            const record = {
              id,
              name: params.name,
              remark: params.remark,
            };
            toPermissionEditPage(record);
          },
        });
      }
      closeModal();
    }
  };

  const changeStatus = (
    val: string | number | boolean
  ): Promise<boolean | void> | boolean | void => {
    if (val && modalForm.value.userCount > 0) {
      Message.warning(
        '有用户为该角色，不可禁用，若仍要禁用，请先修改相关用户角色'
      );
      return false;
    }
  };

  const router = useRouter();
  // 点击用户数量事件
  const toUserPage = (record: TableData) => {
    router.push({
      name: 'UserList',
      query: {
        roleId: record.id,
      },
    });
  };

  const toPermissionEditPage = (record: any) => {
    router.push({
      name: 'RoleListLicensing',
      query: {
        id: record.id,
        roleName: record.name,
        roleDesc: record.remark,
      },
    });
  };

  // 删除事件
  const deleteRoleFn = async (record: any) => {
    Modal.open({
      title: '提示',
      content: () =>
        h(ConfirmModalBody, {
          text: record.name,
          info: '删除数据不可恢复，请谨慎操作！',
        }),
      titleAlign: 'start',
      onOk: async () => {
        await deleteRole(record.id);
        Message.success('删除成功');
        getTableList();
      },
    });
  };
</script>
<style lang="less" scoped>
  .header-btn {
    display: flex;
    justify-content: center;
    align-items: flex-start;

    .arco-btn + .arco-btn {
      margin-left: 12px;
    }
  }
</style>
