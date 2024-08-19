<!-- 企业管理--员工管理 -->
<template>
  <div class="container">
    <a-layout class="layout-box">
      <div
        class="collapse-icon"
        :class="{ collapse: collapsed }"
        @click="onCollapse"
      >
        <icon-right />
      </div>
      <a-layout-sider
        class="box-sider"
        :class="{ boxCollapse: collapsed }"
        hide-trigger
        breakpoint="xs"
        collapsible
        :collapsed="collapsed"
        :collapsed-width="0"
        :width="300"
      >
        <div class="left">
          <div class="search">
            <a-input
              allow-clear
              v-model:model-value="searchKey"
              placeholder="请输入关键字"
            />
            <a-space direction="horizontal" style="margin-top: 10px">
              <a-button size="mini" type="primary" @click="expandAll">
                展开/收起
              </a-button>
              <a-button
                size="mini"
                type="primary"
                :disabled="!treeSelected.length"
                @click="cancelSelectTreeNode"
              >
                取消选中
              </a-button>
            </a-space>
          </div>
          <a-tree
            ref="treeRef"
            v-model:selected-keys="treeSelected"
            :data="treeData"
            default-expand-all
            :field-names="{ key: 'id', title: 'name' }"
            @select="select"
          >
            <template #title="nodeData">
              <template v-if="getMatchIndex(nodeData?.name) < 0">{{
                nodeData?.name
              }}</template>
              <span v-else>
                {{ nodeData?.name?.substr(0, getMatchIndex(nodeData?.name)) }}
                <span style="color: var(--color-primary-light-4)">
                  {{
                    nodeData?.name?.substr(
                      getMatchIndex(nodeData?.name),
                      searchKey.length
                    )
                  }} </span
                >{{
                  nodeData?.name?.substr(
                    getMatchIndex(nodeData?.name) + searchKey.length
                  )
                }}
              </span>
            </template>
          </a-tree>
        </div>
      </a-layout-sider>
      <a-layout-content class="box-content">
        <TableListCard>
          <template #headerInput>
            <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
              <a-form-item field="userName" label="员工姓名">
                <a-input
                  v-model.trim="tempSearchForm.userName"
                  placeholder="请输入员工姓名"
                  allow-clear
                ></a-input>
              </a-form-item>
              <a-form-item field="tel" label="手机号码">
                <a-input
                  v-model.trim="tempSearchForm.tel"
                  placeholder="请输入手机号码"
                  allow-clear
                ></a-input>
              </a-form-item>
              <!-- <a-form-item field="jobNumber" label="员工工号">
                <a-input
                  v-model.trim="tempSearchForm.jobNumber"
                  placeholder="请输入员工工号"
                  allow-clear
                ></a-input>
              </a-form-item> -->
              <a-form-item field="jobId" label="所属岗位">
                <a-select
                  v-model:model-value="tempSearchForm.jobId"
                  :options="postData"
                  allow-clear
                  allow-search
                  placeholder="请选择所属岗位"
                  :field-names="{
                    label: 'jobName',
                    value: 'id',
                  }"
                ></a-select>
              </a-form-item>
              <a-form-item field="entryDate" label="入职日期">
                <a-range-picker
                  v-model:model-value="tempSearchForm.entryDate"
                  :placeholder="['开始日期', '结束日期']"
                  format="YYYY-MM-DD"
                />
              </a-form-item>
            </a-form>
          </template>
          <template #headerBtn>
            <a-space direction="vertical" :span="[0, 10]">
              <a-button
                type="primary"
                @click="
                  () => {
                    selectForm = tempSearchForm;
                    getStaffData();
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
                v-permission="'StaffManageAddPermission'"
                type="primary"
                @click="addOrEditClick('add')"
              >
                <icon-plus class="icon" />
                新增
              </a-button>
              <a-button
                v-permission="'StaffManageAddPermission'"
                type="primary"
                @click="importModalVisible = true"
              >
                批量新增
              </a-button>
              <a-button
                v-permission="'StaffListCreateAccount'"
                type="primary"
                @click="batchCreateAccount"
              >
                批量创建账号
              </a-button>
              <a-button
                v-permission="'StaffListSendAccount'"
                type="primary"
                @click="batchSendAccount"
              >
                批量发送账号
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
              v-model:selected-keys="selectKeys"
              :data="staffData.list"
              row-key="id"
              :columns="columns"
              :bordered="false"
              :pagination="false"
              :row-selection="{
                type: 'checkbox',
                width: 30,
                onlyCurrent: false,
                showCheckedAll: true,
              }"
            >
              <template #lastSendAccountTimeTitle>
                <span style="margin-right: 2px">最后发送账号时间</span>
                <a-tooltip content="最后向员工发送用户账号信息的时间">
                  <icon-exclamation-circle color="#86909C" />
                </a-tooltip>
              </template>
              <template #relatedInfo="{ record }">
                <div class="related-info">
                  <span
                    v-if="record.relatedInfo"
                    :style="{
                      color: '#357cf0',
                      cursor: 'pointer',
                    }"
                    @click="jumpToStaff(record)"
                    >{{
                      (record.relatedInfo.nickname || '') +
                      '(' +
                      (record.relatedInfo.deptName || '') +
                      ')'
                    }}</span
                  >
                  <span
                    v-else
                    :style="{
                      color: '#f53f3f',
                    }"
                    >未关联</span
                  >
                  <a-button
                    v-permission="'StaffRelatedPerson'"
                    type="primary"
                    size="mini"
                    @click="editModal(record)"
                    >{{
                      record.relatedInfo ? '编辑' : '点击关联人员'
                    }}</a-button
                  >
                </div>
              </template>
              <template #option="{ record }">
                <a-button
                  v-permission="'StaffManageEditPermission'"
                  type="text"
                  size="mini"
                  @click="addOrEditClick('edit', record.id)"
                >
                  编辑
                </a-button>
                <a-button
                  v-permission="'StaffManageDeletePermission'"
                  type="text"
                  status="danger"
                  size="mini"
                  @click="deleteRow(record)"
                >
                  删除
                </a-button>
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
              :total="(staffData.total as number)"
              @change="currentChange"
              @page-size-change="pageSizeChange"
            ></a-pagination>
          </template>
        </TableListCard>
      </a-layout-content>
    </a-layout>

    <a-modal
      v-if="modalVisible"
      title-align="start"
      class="related-info-modal"
      :visible="modalVisible"
      :title="modalTitle"
      ok-text="保存"
      @ok="updateRelatedFn"
      @cancel="closeModal"
    >
      <div class="user-info">
        <div class="title">员工信息</div>
        <div class="user-info-content">
          <div class="related-info-item">
            <div>员工姓名：</div>
            <div>{{ userInfo.userName }}</div>
          </div>
          <div class="related-info-item">
            <div>手机号码：</div>
            <div>{{ userInfo.tel }}</div>
          </div>
          <div class="related-info-item">
            <div>所属部门：</div>
            <div>{{ userInfo.deptName }}</div>
          </div>
          <div class="related-info-item">
            <div>所属岗位：</div>
            <div>{{ userInfo.jobName }}</div>
          </div>
        </div>
      </div>
      <div class="modal-related-info">
        <div class="title">
          <span>关联用户信息</span>
          <a-button
            size="mini"
            type="primary"
            status="normal"
            @click="openDrawer"
            >选择</a-button
          >
          <a-button
            v-if="modalRelatedInfo"
            type="primary"
            size="mini"
            status="danger"
            @click="cancelRelated"
            >取消关联</a-button
          >
        </div>
        <div class="related-info-content" v-if="modalRelatedInfo">
          <div class="user-info-item">
            <div>用户姓名：</div>
            <div>{{ modalRelatedInfo.nickname }}</div>
          </div>
          <div class="user-info-item">
            <div>手机号码：</div>
            <div>{{ modalRelatedInfo.tel }}</div>
          </div>
          <div class="user-info-item">
            <div>所属部门：</div>
            <div>{{ modalRelatedInfo.deptName }}</div>
          </div>
          <div class="user-info-item">
            <div>所属角色：</div>
            <div>{{ modalRelatedInfo.roleNames }}</div>
          </div>
        </div>
        <div class="no-data" v-else>
          未选择关联用户，请选择上面按钮进行关联用户选择
        </div>
      </div>
    </a-modal>
    <relatedPersonDrawer
      v-if="userInfo && relatedPersonDrawerVisible"
      :key="userInfo.id"
      title="关联用户选择"
      tips="列表仅展示与员工姓名及所属部门相同的未关联员工的用户账号"
      :visible="relatedPersonDrawerVisible"
      :select-keys="relatedPersonKeys"
      :dept-id="userInfo.deptId"
      :user-name="userInfo.userName"
      @cancel="drawerCancel"
      @confirm="drawerConfirm"
    />
    <ImportDataModal
      v-model:visible="importModalVisible"
      :tableColumns="modalTableColumns"
      :import-api="staffImportAPI"
      :preview-api="staffImportPreviewAPI"
      :template-api="staffImportTemplateAPI"
      :import-callback="staffImportCallback"
      @success="getStaffData"
    >
      <template #tips>
        <div class="tips">
          <icon-exclamation-circle size="30px" style="color: #ff8d1a" />
          <div class="tip-content">
            <span>特别提示</span>
            <span
              >导入过程中如发现两员工手机号码相同，则这条数据无法导入成功</span
            >
          </div>
        </div>
      </template>
    </ImportDataModal>
  </div>
</template>

<script lang="ts">
  import { ref, computed, h, onMounted } from 'vue';
  import { storeToRefs } from 'pinia';
  import { useRoute, useRouter } from 'vue-router';
  import { useAppStore, useEnterpriseStore, useUserStore } from '@/store';
  import { Message, Modal } from '@arco-design/web-vue';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import {
    getStaffDataAPI,
    deleteStaffDataAPI,
    getPostDataAllAPI,
    staffImportAPI,
    staffImportPreviewAPI,
    staffImportTemplateAPI,
  } from '@/api/enterpriseManage';
  import type { GetStaffData } from '@/api/enterpriseManage';
  import type {
    TableColumnData,
    TableData,
  } from '@arco-design/web-vue/es/table/interface';
  import type { StaffData } from './index';
  import { handleOnKeyup } from '@/utils/event';
  import relatedPersonDrawer from './components/relatedPersonDrawer.vue';
  import useRouterJump from '@/hooks/routerJump';
  import CheckModal from '@/views/enterpriseManage/staffManage/components/checkModal.vue';
  import { employeeUnbindUser, userBindEmployee } from '@/api/user';
  import ImportDataModal from '@/components/importDataModal/index.vue';

  export default {
    name: 'StaffManage',
  };
</script>

<script lang="ts" setup>
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const enterpriseStore = useEnterpriseStore();
  const { organizationTree } = storeToRefs(enterpriseStore);
  // 获取组织架构树
  enterpriseStore.getOrganizationTree({
    enterpriseId: userStore.userInfo.enterpriseId as string,
  });

  // ---------------------------- 左侧搜索树 ------------------------------
  const searchKey = ref('');
  const treeSelected = ref<any>([]);
  const treeRef = ref<any>();

  const select = (selectedKeys: (string | number)[]) => {
    treeSelected.value = selectedKeys;
    selectForm.value.deptId = treeSelected.value[0];
    selectForm.value.safeDeptId = '';
    tempSearchForm.value.deptId = treeSelected.value[0];
    tempSearchForm.value.safeDeptId = '';
    getStaffData();
  };

  const cancelSelectTreeNode = () => {
    treeRef.value.selectAll(false);
    treeSelected.value = [];
    selectForm.value.deptId = '';
    selectForm.value.safeDeptId = '';
    tempSearchForm.value.deptId = '';
    tempSearchForm.value.safeDeptId = '';
    getStaffData();
  };

  const expandAll = () => {
    treeRef.value.expandAll(!treeRef.value.getExpandedNodes().length);
  };

  const treeData = computed((): any => {
    if (!searchKey.value) return organizationTree.value;
    return searchData(searchKey.value);
  });

  const searchData = (keyword: string) => {
    const loop = (data: any) => {
      const result: any[] = [];
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
      return result;
    };

    return loop(organizationTree.value);
  };

  const getMatchIndex = (title: string) => {
    if (!searchKey.value) return -1;
    return title.toLowerCase().indexOf(searchKey.value.toLowerCase());
  };

  // --------------------------右侧 搜索区域 -----------------------

  const selectForm = ref<GetStaffData>({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    pageNo: 1,
    pageSize: 10,
    userName: route.query.name as string,
    deptId: route.query.id as string,
    safeDeptId: route.query.safeDeptId as string,
  });
  const tempSearchForm = ref<GetStaffData>({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    pageNo: 1,
    pageSize: 10,
    userName: route.query.name as string,
    deptId: route.query.id as string,
    safeDeptId: route.query.safeDeptId as string,
  });
  const selectFormDom = ref();
  const postData = ref<any[]>([]);

  const getPostData = async () => {
    const { data: res } = await getPostDataAllAPI(selectForm.value);
    postData.value = res;
  };

  const allTableData = ref<TableData[]>([]);
  const getStaffData = async () => {
    const params = {
      ...selectForm.value,
      entryDateStart:
        selectForm.value.entryDate && selectForm.value.entryDate[0],
      entryDateEnd: selectForm.value.entryDate && selectForm.value.entryDate[1],
    };
    delete params.entryDate;
    const { data: res } = await getStaffDataAPI(params);
    staffData.value.total = res.total || 0;
    staffData.value.list = res.list.map((ele: any) => {
      return {
        ...ele,
        relatedInfo: ele.user,
        sendAccountTime: ele.user ? ele.user.sendAccountTime : '',
      };
    });
    allTableData.value = deduplicateByProperty(
      [...res.list, ...allTableData.value],
      'id'
    );
    enterpriseStore.clearStaffInfo();
  };

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

  const resetSelectForm = async () => {
    selectFormDom.value.resetFields();
    tempSearchForm.value = {
      enterpriseId: userStore.userInfo.enterpriseId as string,
      pageNo: 1,
      pageSize: 10,
      userName: route.query.name as string,
      deptId: route.query.id as string,
      safeDeptId: route.query.safeDeptId as string,
    };
    getStaffData();
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getStaffData();
    });
  });

  getPostData();
  getStaffData();

  onActivated(() => {
    getStaffData();
  });

  // -------------------------- table ----------------------------

  const staffData = ref<StaffData>({ list: [], total: 0 });
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
    // {
    //   title: '员工工号',
    //   dataIndex: 'jobNumber',
    // },
    {
      title: '所属部门',
      dataIndex: 'deptName',
    },
    {
      title: '所属岗位',
      dataIndex: 'jobName',
    },
    {
      title: '入职日期',
      dataIndex: 'entryDate',
    },
    {
      title: '关联用户信息',
      dataIndex: 'relatedInfo',
      slotName: 'relatedInfo',
    },
    {
      title: '最后发送账号时间',
      dataIndex: 'sendAccountTime',
      titleSlotName: 'lastSendAccountTimeTitle',
    },
    {
      title: '操作',
      align: 'center',
      slotName: 'option',
      dataIndex: '',
      cellStyle: { width: '14%' },
    },
  ];

  const refresh = async () => {
    getStaffData();
  };

  const addOrEditClick = (type: string, id?: string) => {
    if (!selectForm.value.deptId && type === 'add') {
      Message.warning({
        content: '请先选择左侧的部门',
      });
      return;
    }
    router.push({
      name: 'StaffManageEdit',
      query: {
        type,
        id,
        deptId: selectForm.value.deptId,
      },
    });
  };

  const deleteRow = (record: TableData) => {
    const { id, userName: name, user } = record;
    Modal.open({
      title: '提示',
      content: () =>
        h(ConfirmModalBody, {
          text: name,
          info: '删除数据不可恢复，请谨慎操作！',
        }),
      titleAlign: 'start',
      onOk: async () => {
        if (user) {
          Message.warning(
            '该员工存在关联用户账号，无法删除，若仍要删除，请先解除与用户关联关系或删除关联用户账号'
          );
          return;
        }
        await deleteStaffDataAPI(id);
        Message.success({
          content: '删除成功',
        });
        let totalPage = Math.ceil(
          (staffData.value.total! - 1) / selectForm.value.pageSize!
        );
        let currentPage =
          selectForm.value.pageNo! > totalPage
            ? totalPage
            : selectForm.value.pageNo;
        selectForm.value.pageNo = currentPage! < 1 ? 1 : currentPage;
        getStaffData();
      },
    });
  };

  // ------------------------ 分页 --------------------------
  const currentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getStaffData();
  };

  const pageSizeChange = (pageSize: number) => {
    // console.log('pagesize:', pageSize);
    selectForm.value.pageSize = pageSize;
    getStaffData();
  };

  // ---------------------------- 页面跳转数据 ----------------------------
  if (route.query.id) {
    // 从组织架构来
    select([route.query.id as string]);
  } else if (route.query.safeDeptId) {
    // 从安全部门来
    selectForm.value.safeDeptId = route.query.safeDeptId as string;
  }

  // 折叠
  const collapsed = ref<boolean>(false);

  const onCollapse = () => {
    collapsed.value = !collapsed.value;
  };

  // 弹窗关联、编辑部分
  const modalVisible = ref(false);
  const modalTitle = ref('关联人员');
  const userInfo = ref<any>(null);
  const modalRelatedInfo = ref<any>(null);

  const closeModal = () => {
    modalVisible.value = false;
    userInfo.value = null;
    modalRelatedInfo.value = null;
    modalTitle.value = '关联人员';
  };
  const editModal = (record: any) => {
    if (record.relatedInfo) {
      modalTitle.value = '编辑关联关系';
      modalRelatedInfo.value = record.relatedInfo;
    }
    userInfo.value = record;
    modalVisible.value = true;
  };
  const updateRelatedFn = async () => {
    const api = modalRelatedInfo.value ? userBindEmployee : employeeUnbindUser;
    const params = {
      employeeId: userInfo.value.id,
      userId: modalRelatedInfo.value
        ? modalRelatedInfo.value.id
        : userInfo.value.user.id,
    };
    await api(params);
    Message.success(modalRelatedInfo.value ? `绑定成功` : `解绑成功`);
    getStaffData();
    closeModal();
  };

  const cancelRelated = () => {
    modalRelatedInfo.value = null;
  };

  const { jumpWithTab } = useRouterJump();

  const jumpToStaff = (record: any) => {
    jumpWithTab({
      routerName: 'UserList',
      params: {
        name: record.user.nickname,
        id: record.user.deptId,
      },
    });
  };

  // 批量发送账号事件
  const selectKeys = ref<any[]>(enterpriseStore.staffInfo.selectKeys || []); // 从缓存里拿，因为可能会有重新选择
  const batchSendAccount = () => {
    if (!selectKeys.value.length) {
      Message.warning('请先选择员工');
      return;
    }
    let noAccountCount = 0;
    let limitCount = 0;
    let noAccountDesc = '';
    let limitDesc = '';
    let noAccountIds: string[] = [];
    let limitIds: string[] = [];
    selectKeys.value.forEach((ele: any) => {
      const item = allTableData.value.find((data) => data.id === ele);
      if (!item) return;
      if (!item.user) {
        // 没有用户账号
        noAccountCount++;
        noAccountDesc += `${item.userName}-${item.deptName}、`;
        noAccountIds.push(item.id);
      }
      if (item.user && item.user.count > 5) {
        limitCount++;
        limitDesc += `${item.userName}-${item.deptName}、`;
        limitIds.push(item.id);
      }
    });
    let detailTitle: string[] = [];
    let detailContent: string[] = [];
    if (noAccountCount) {
      detailTitle.push('无用户账号员工');
      detailContent.push(noAccountDesc.substring(0, noAccountDesc.length - 1));
    }
    if (limitCount) {
      detailTitle.push('今日发送账号信息次数已达上限员工');
      detailContent.push(limitDesc.substring(0, limitDesc.length - 1));
    }
    if (!noAccountCount && !limitCount) {
      router.push({
        name: 'StaffListSendAccount',
        query: {
          staffIds: selectKeys.value.join(','),
        },
      });
      return;
    }
    Modal.open({
      title: '提示',
      titleAlign: 'start',
      okText: '继续',
      cancelText: '重新选择',
      content: () =>
        h(CheckModal, {
          info: `您选中的${noAccountCount + limitCount}位员工${
            noAccountCount ? '没有用户账号' : ''
          }${noAccountCount && limitCount ? '或' : ''}${
            limitCount ? '今日发送账号信息次数已达上限' : ''
          }，不可发送账号信息。您可点击“重新选择”重新进行员工选择；若您点击“继续”，系统将自动忽略此${
            noAccountCount + limitCount
          }条员工数据，继续批量发送账号信息短信至用户手机号。`,
          detailTitle,
          detailContent,
        }),
      onOk: () => {
        router.push({
          name: 'StaffListSendAccount',
          query: {
            staffIds: selectKeys.value
              .filter(
                (item: any) =>
                  !noAccountIds.includes(item) || !limitIds.includes(item)
              )
              .join(','),
          },
        });
      },
    });
  };

  // 批量创建账号事件
  const batchCreateAccount = () => {
    if (!selectKeys.value.length) {
      Message.warning('请先选择员工');
      return;
    }
    let hasAccountCount = 0;
    let hasAccountDesc = '';
    let hasAccountIds: string[] = [];
    selectKeys.value.forEach((ele: any) => {
      const item = allTableData.value.find((data) => data.id === ele);
      if (!item) return;
      if (item.user) {
        // 已有用户账号
        hasAccountCount++;
        hasAccountDesc += `${item.userName}-${item.deptName}、`;
        hasAccountIds.push(item.id);
      }
    });
    let detailTitle: string[] = [];
    let detailContent: string[] = [];
    if (hasAccountCount) {
      detailTitle.push('已有用户账号员工');
      detailContent.push(
        hasAccountDesc.substring(0, hasAccountDesc.length - 1)
      );
    } else {
      router.push({
        name: 'StaffListCreateAccount',
        query: {
          ids: selectKeys.value.join(','),
        },
      });
      return;
    }
    Modal.open({
      title: '提示',
      titleAlign: 'start',
      okText: '继续',
      cancelText: '重新选择',
      content: () =>
        h(CheckModal, {
          info: `您选中的${hasAccountCount}位员工已有用户账号。您可点击“重新选择”重新进行员工选择；若您点击“继续”，系统将自动忽略此${hasAccountCount}条员工数据，继续创建账号。`,
          detailTitle,
          detailContent,
        }),
      onOk: () => {
        router.push({
          name: 'StaffListCreateAccount',
          query: {
            ids: selectKeys.value
              .filter((item: any) => !hasAccountIds.includes(item))
              .join(','),
          },
        });
      },
    });
  };

  // 抽屉事件
  const relatedPersonDrawerVisible = ref(false);
  const relatedPersonKeys = ref<any[]>([]);
  const openDrawer = () => {
    relatedPersonKeys.value = modalRelatedInfo.value
      ? [modalRelatedInfo.value.id]
      : [];
    relatedPersonDrawerVisible.value = true;
  };
  const drawerCancel = () => {
    relatedPersonDrawerVisible.value = false;
  };
  const drawerConfirm = (employeeInfo: any) => {
    modalRelatedInfo.value = {
      ...employeeInfo,
      deptName: employeeInfo.dept ? employeeInfo.dept.name : '',
      tel: employeeInfo.mobile || employeeInfo.tel,
    };
    relatedPersonDrawerVisible.value = false;
  };

  // 导入
  const importModalVisible = ref(false);
  const modalTableColumns = [
    { title: '员工姓名', dataIndex: 'userName' },
    { title: '手机号码', dataIndex: 'tel' },
    { title: '所属部门', dataIndex: 'deptName' },
    { title: '所属岗位', dataIndex: 'jobName' },
  ];
  const staffImportCallback = (data: any[]) => {
    return data;
  };
</script>

<style lang="less" scoped>
  :deep(.header .arco-form-item) {
    margin: 6px 5px;
    width: calc(100% / 3 - 10px);
    max-width: calc(100% / 3 - 10px);
  }
  .container {
    .layout-box {
      width: 100%;
      // background-color: var(--color-fill-2);
      position: relative;

      .box-sider {
        // height: 87.5vh;
        padding: 16px;
        position: relative;
        margin-right: 6px;
        background-color: var(--color-bg-2);
        overflow: auto;
        transition: all 0.2s;
        .left {
          .search {
            margin-bottom: 20px;
          }
        }
        :deep(.arco-layout-sider-children) {
          overflow-y: auto;
          overflow-x: hidden;
        }
      }
      .box-content {
        width: 100%;
        position: relative;
        // padding: 16px;
        background-color: var(--color-bg-2);
        :deep(.arco-card-bordered) {
          border: none;
        }
        :deep(.arco-card-size-medium .arco-card-body) {
          padding-bottom: 12px;
        }
        .header {
          margin-bottom: 20px;
        }
      }
    }
  }
  :deep(.arco-picker-separator) {
    padding: 0 5px;
  }

  :deep(.layout-box .box-sider) {
    &.boxCollapse {
      width: 0 !important;
      height: 0 !important;
      padding: 0;
      margin: 0;
    }
  }
  .collapse-icon {
    position: absolute;
    width: 16px;
    height: 40px;
    text-align: center;
    border-radius: 5px;
    line-height: 40px;
    top: 50%;
    left: 0;
    transform: translate(285px, -50%);
    z-index: 999;
    background-color: #c9cdd4;
    color: #ffffff;
    cursor: pointer;
    transition: all 0.2s ease-in-out;
    .arco-icon {
      transition: all 0.2s ease-in-out;
      transform: rotate(180deg);
    }
    &.collapse {
      transform: translate(0, -50%);
      .arco-icon {
        transform: rotate(0deg);
      }
    }
  }
  .related-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    :deep(.arco-btn-primary) {
      width: 96px;
    }
  }
  .related-info-modal {
    .title {
      font-family: 'Alibaba-Medium';
    }
    .user-info {
      .user-info-content {
        padding: 0 20px;
        display: flex;
        flex-wrap: wrap;
      }
    }
    .modal-related-info {
      margin-top: 10px;
      .title {
        display: flex;
        align-items: center;
        gap: 12px;
      }
      .related-info-content {
        padding: 0 20px;
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        .user-info-item:first-of-type {
          flex: 0 0 100%;
        }
      }
    }
    .user-info-item,
    .related-info-item {
      flex: 0 0 50%;
      display: flex;
      flex-wrap: wrap;
      line-height: 32px;
      div:nth-of-type(1) {
        color: var(--color-text-2);
        width: 90px;
        text-align: right;
      }
      div:nth-of-type(2) {
        flex: 1;
        white-space: wrap;
        word-break: break-all;
      }
    }
    .no-data {
      margin-top: 10px;
      text-align: center;
      background: #f5f7fa;
      border: 1px solid #e5e5e5;
      color: #4e5969;
      font-size: 14px;
      padding: 41px 0;
    }
  }
  .tips {
    background-color: lighten(#ff8d1a, 40%);
    padding: 15px;
    border: 0.5px solid var(--color-orange);
    border-radius: 4px;
    display: flex;
    align-items: center;
    gap: 1rem;
    .tip-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      span:nth-of-type(1) {
        font-size: 14px;
        font-weight: 500;
        font-family: 'Alibaba-Medium';
        color: #333333;
      }
      span:nth-of-type(2) {
        font-size: 12px;
        font-weight: 400;
        color: var(--color-text-grey1);
      }
    }
  }
</style>
