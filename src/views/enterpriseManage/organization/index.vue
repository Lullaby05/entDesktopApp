<!-- 企业管理--组织架构 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
          <a-form-item field="name" label="部门名称">
            <a-input
              v-model.trim="tempSearchForm.name"
              placeholder="请输入部门名称"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="type" label="部门类型">
            <a-select
              v-model.trim="tempSearchForm.type"
              placeholder="请选择部门类型"
              :fallback-option="false"
              allow-search
              allow-clear
            >
              <a-option
                v-for="(value, key) of deptType"
                :value="key"
                :label="value"
              ></a-option>
            </a-select>
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
                getOrganizationTree();
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
      <template #primaryBtn>
        <a-space>
          <a-button
            v-permission="'organizationAddPermission'"
            type="primary"
            @click="addOrEditClick('add')"
          >
            <icon-plus class="icon" />
            新增
          </a-button>
        </a-space>
      </template>
      <template #minorBtn>
        <a-space>
          <icon-refresh class="minor-icon" size="20" @click="refresh" />
        </a-space>
      </template>

      <template #table>
        <a-table
          ref="organizationTreeTableDom"
          :data="organizationTree"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #type="{ record }">
            {{ record.enterpriseFlag ? '企业' : deptType[record.type] }}
          </template>
          <template #employeeCount="{ record }">
            <a-button type="text" @click="toStaffManage(record.id)">{{
              record.employeeCount
            }}</a-button>
          </template>
          <template #option="{ record }">
            <a-button
              type="text"
              size="mini"
              v-permission="'organizationEditPermission'"
              @click="addOrEditClick('edit', record.id)"
            >
              编辑
            </a-button>
            <a-button
              type="text"
              status="danger"
              size="mini"
              v-permission="'organizationDeletePermission'"
              @click="deleteRow(record.id, record.name)"
            >
              删除
            </a-button>
          </template>
        </a-table>
      </template>
    </TableListCard>

    <!-- 添加组织架构 -->
    <a-modal
      :visible="addIsShow"
      :width="600"
      ok-text="保存"
      title-align="start"
      :title="modalTitle"
      @ok="submitModal"
      @cancel="closeModal"
    >
      <a-form ref="form" :model="formData" :rules="rules">
        <a-form-item label="部门名称" field="name">
          <a-input
            v-model.trim="formData.name"
            placeholder="请输入部门名称"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="parentId" label="上级部门" required>
          <a-input
            v-if="formData.parentId === '-1'"
            disabled
            :default-value="formData.name"
          ></a-input>
          <a-tree-select
            v-else
            v-model:model-value="formData.parentId"
            :data="deptData"
            allow-search
            allow-clear
            :fallback-option="false"
            placeholder="请选择上级部门"
            :field-names="{
              title: 'name',
              key: 'id',
            }"
            :disable-filter="true"
            @search="onDeptSearch"
            @blur="clearSearchKey"
            @clear="clearSearchKey"
            @change="onDeptChange"
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item field="type" label="部门类型" required>
          <a-radio-group
            v-model:model-value="formData.type"
            @change="changeDeptType"
          >
            <template v-for="(name, code) of deptType">
              <a-radio
                v-if="name !== '企业'"
                :value="+code"
                :disabled="formData.parentType! > +code || formData.childrenType! < +code"
              >
                {{ name }}
              </a-radio>
            </template>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="deptNumber" label="部门编码" disabled>
          <a-input v-model.trim="formData.deptNumber" disabled></a-input>
        </a-form-item>
        <a-form-item label="部门负责人" :content-flex="false">
          <a-row>
            <a-col :span="12">
              <a-form-item field="leaderId" :wrapper-col-props="{ span: 23 }">
                <a-select
                  v-model:model-value="formData.leaderId"
                  :options="staffData"
                  :fallback-option="false"
                  allow-clear
                  allow-search
                  placeholder="请选择部门负责人"
                  :field-names="{
                    value: 'id',
                    label: 'userName',
                  }"
                  @change="dutyEmployeeIdChange"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="leaderTel" :wrapper-col-props="{ span: 23 }">
                <a-input
                  v-model.trim="formData.leaderTel"
                  disabled
                  placeholder="手机号码"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>

        <a-form-item field="deptDesc" label="部门描述">
          <a-textarea
            v-model.trim="formData.deptDesc"
            placeholder="请输入部门描述"
            :auto-size="{ minRows: 4, maxRows: 6 }"
            :max-length="300"
            show-word-limit
          >
          </a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { ref, h, computed } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message, Modal } from '@arco-design/web-vue';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { storeToRefs } from 'pinia';
  import { OrganizationTreeData } from '@/store/modules/enterprise/types';
  import { useEnterpriseStore, useUserStore } from '@/store';
  import { getEnumListAPI } from '@/api/index';
  import {
    getStaffDataAllAPI,
    getOrganizationTreeAPI,
    addOrganizationAPI,
    updateOrganizationAPI,
    getOrganizationDetailAPI,
    deleteOrganizationAPI,
    getOrganizationTreeListAPI,
    getDeptNumberAPI,
  } from '@/api/enterpriseManage';

  import type {
    GetOrganizationTreeData,
    AddOrganizationData,
  } from '@/api/enterpriseManage';
  import type { StaffItem } from '@/views/enterpriseManage/staffManage/index';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { cloneDeep } from 'lodash';
  import { onMounted } from 'vue';
  import { handleOnKeyup } from '@/utils/event';
  export default {
    name: 'Organization',
  };
</script>

<script lang="ts" setup>
  const router = useRouter();
  const userStore = useUserStore();
  const enterpriseStore = useEnterpriseStore();
  const { organizationTree } = storeToRefs(enterpriseStore);
  const organizationTreeTableDom = ref<any>(null);

  // ----------------- 查询-------------------------------

  const selectForm = ref<GetOrganizationTreeData>({
    enterpriseId: userStore.userInfo.enterpriseId as string,
  });
  const tempSearchForm = ref<GetOrganizationTreeData>({
    enterpriseId: userStore.userInfo.enterpriseId as string,
  });

  const selectFormDom = ref();

  const getOrganizationTree = async () => {
    await enterpriseStore.getOrganizationTreeList(selectForm.value);
    // await enterpriseStore.getOrganizationTree(selectForm.value);
    const data = filterEmptyChildren(organizationTree.value);
    organizationTreeTableDom?.value.expandAll();
    // 对organizationTree重新赋值
    (organizationTree as any).value(data);
  };

  // 数组对象扁平化  暂时弃用
  const Fn = (result: any[], arr: any[]): any => {
    for (let i = 0; i < arr.length; i++) {
      const item = arr[i];
      if (!item.children.length) {
        result.push(item);
      } else {
        result.push(item);
        Fn(result, item.children);
      }
    }
    return result;
  };

  getOrganizationTree();

  const resetSelectForm = () => {
    selectFormDom.value.resetFields();
    tempSearchForm.value = {
      enterpriseId: userStore.userInfo.enterpriseId as string,
    };
    getOrganizationTree();
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getOrganizationTree();
    });
  });

  // ----------------- table -------------------------

  const columns: TableColumnData[] = [
    {
      title: '部门名称',
      width: 240,
      dataIndex: 'name',
      cellStyle: { width: '19%' },
    },
    {
      title: '部门类型',
      dataIndex: 'type',
      slotName: 'type',
    },
    {
      title: '部门编码',
      dataIndex: 'deptNumber',
    },
    {
      title: '部门负责人',
      dataIndex: 'leaderName',
    },
    {
      title: '手机号码',
      dataIndex: 'leaderTel',
    },
    {
      title: '部门人数',
      slotName: 'employeeCount',
      dataIndex: 'employeeCount',
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];

  const deptType = ref<any>({});

  const getDeptType = async () => {
    const { data } = await getEnumListAPI('DEPT_TYPE');
    // 过滤掉key为0的选项
    delete data[0];
    deptType.value = data;
  };
  // 修改部门的时候获取部门编码
  const changeDeptType = async (record: any) => {
    const { data } = await getDeptNumberAPI(record.toString());
    formData.value.deptNumber = data;
  };

  getDeptType();

  const refresh = async () => {
    getOrganizationTree();
  };

  const deleteRow = (id: string, name: string) => {
    Modal.open({
      title: '提示',
      content: () =>
        h(ConfirmModalBody, {
          text: name,
          info: '删除数据不可恢复，请谨慎操作！',
        }),
      titleAlign: 'start',

      onOk: async () => {
        const { data: res } = await deleteOrganizationAPI(id);
        Message.success({
          content: '删除成功' + res,
        });
        getOrganizationTree();
      },
    });
  };

  const toStaffManage = (id: string) => {
    router.push({
      name: 'StaffManage',
      query: {
        id,
      },
    });
  };

  // 清除空白节点
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
  };

  // ----------------------- 弹窗 --------------------------

  const addIsShow = ref(false);
  const modalType = ref('');
  const deptData = ref<OrganizationTreeData[]>([]);

  const formData = ref<AddOrganizationData>({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    name: '',
    parentId: '',
    leaderId: undefined,
    type: 0,
    deptNumber: '',
  });
  const form = ref();

  const modalTitle = computed(() =>
    modalType.value === 'add' ? '新增部门' : '编辑部门'
  );

  const staffData = ref<StaffItem[]>([]);

  const rules = ref({
    name: [
      { required: true, message: '请输入部门名称' },
      { maxLength: 40, message: '不能超过40字符' },
      {
        match: /^[a-zA-Z_\u4e00-\u9fa5][a-zA-Z0-9_\u4e00-\u9fa5]*$/,
        message:
          '只能以字母、汉字、下划线作为开头，并且只能包含字母、汉字、数字、下划线',
      }, // 正则表达式，只能以字母、汉字、下划线作为开头，并且只能包含字母、汉字、数字、下划线
    ],
    type: [
      {
        required: true,
        validator: (
          value: any | undefined,
          callback: (error?: string) => void
        ) => {
          if (!value) callback('请选择部门类型');
          callback();
        },
      },
    ],
    parentId: [{ required: true, message: '请选择上级部门' }],
  });

  const onDeptChange = () => {
    if (formData.value.parentId) {
      formData.value.type = 0;
      const deptType = searchTypeById(formData.value.parentId, deptData.value);
      if (deptType) {
        formData.value.parentType = deptType;
      }
    }
  };

  let depatTree: OrganizationTreeData[] = [];

  const getDeptData = async () => {
    const { data } = await getOrganizationTreeAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    deptData.value = data;
    depatTree = cloneDeep(deptData.value);
  };

  // -------------- 树形下拉  搜索 start-----------------

  function searchData(keyword: string) {
    const loop = (data: any) => {
      const result: OrganizationTreeData[] = [];
      data.forEach((item: any) => {
        if (item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
          result.push({ ...item });
        } else if (item.children) {
          const filterData = loop(item.children);
          if (filterData.length) {
            result.push({
              ...item,
              children: filterData,
            });
          }
        }
      });
      // console.log(result);

      return result;
    };

    return loop(depatTree);
  }

  function searchTypeById(id: string, data: any[]) {
    let result: number = 0;
    const loop = (data: any) => {
      data.forEach((item: any) => {
        if (item.id === id) {
          result = item.type;
        } else if (item.children) {
          result = loop(item.children);
        }
      });
      return result;
    };
    return loop(data);
  }

  const onDeptSearch = (searchKey: string) => {
    setTimeout(() => {
      deptData.value = searchData(searchKey);
    }, 200);
  };

  const clearSearchKey = () => {
    onDeptSearch('');
  };
  // -------------- 树形下拉  搜索 end-----------------

  const getStaffList = async () => {
    const { data: res } = await getStaffDataAllAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    staffData.value = res;
  };

  const dutyEmployeeIdChange = (
    value:
      | string
      | number
      | Record<string, any>
      | (string | number | Record<string, any>)[]
  ) => {
    formData.value.leaderTel = staffData.value.find((item) => item.id === value)
      ?.tel as string;
  };

  const addOrEditClick = async (type: string, id?: string) => {
    modalType.value = type;
    addIsShow.value = true;
    getStaffList();
    await getDeptData();
    if (id) {
      getDetail(id as string);
    }
  };

  const getDetail = async (id: string) => {
    const { data } = await getOrganizationDetailAPI(id);
    formData.value = data;
    formData.value.parentType = searchTypeById(data.parentId, deptData.value);
    formData.value.childrenType = findMaxChildrenLevel(data.children);
    filterTreeById(formData.value.id as string, deptData.value);
  };

  const findMaxChildrenLevel = (tree: any[]) => {
    return Math.min(...tree.map((item) => item.type));
  };

  // 编辑的时候下拉需要排除当前部门以及当前部门的子部门
  const filterTreeById = (id: string, treeData: any[]) => {
    for (let i = 0; i < treeData.length; i++) {
      if (treeData[i].id === id) {
        delete treeData[i];
        break;
      }
      if (treeData[i].children.length) {
        filterTreeById(id, treeData[i].children);
      }
    }
  };

  const closeModal = () => {
    form.value.resetFields();
    form.value.clearValidate();
    addIsShow.value = false;
    formData.value.parentType = undefined;
    formData.value.childrenType = undefined;
  };

  const submitModal = async () => {
    const valid = await form.value.validate();
    if (valid) return;
    // console.log('提交', formData.value);
    modalType.value === 'add' ? await addSubmit() : await editSubmit();
    closeModal();
  };

  const addSubmit = async () => {
    await addOrganizationAPI(formData.value);
    Message.success({
      content: '新增成功！',
    });
    refresh();
  };

  const editSubmit = async () => {
    await updateOrganizationAPI(formData.value);
    // console.log('编辑', res);
    Message.success({
      content: '编辑成功！',
    });
    refresh();
  };
</script>

<style lang="less" scoped></style>
