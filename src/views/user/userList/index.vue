<!-- 用户管理-用户管理列表 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form :model="tempSearchForm" layout="inline">
          <a-form-item field="nickname" label="用户姓名">
            <a-input
              v-model="tempSearchForm.nickname"
              placeholder="请输入用户姓名"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="mobile" label="登录手机号">
            <a-input
              v-model="tempSearchForm.mobile"
              placeholder="请输入登录手机号"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="deptId" label="所属部门">
            <a-tree-select
              v-model:model-value="tempSearchForm.deptId"
              :data="deptData"
              allow-search
              allow-clear
              :disable-filter="true"
              :field-names="{
                key: 'id',
                title: 'name',
              }"
              placeholder="请选择所属部门"
              @search="onDeptSearch"
              @blur="clearSearchKey"
              @clear="clearSearchKey"
            ></a-tree-select>
          </a-form-item>
          <a-form-item field="roleId" label="所属角色">
            <a-select
              v-model="tempSearchForm.roleId"
              placeholder="请选择所属角色"
              allow-search
              allow-clear
            >
              <a-option
                v-for="item in roleList"
                :key="item.dictValue"
                :value="item.dictValue"
                >{{ item.dictKey }}</a-option
              >
            </a-select>
          </a-form-item>
          <a-form-item field="accountType" label="账号类型">
            <a-select
              v-model="tempSearchForm.accountType"
              placeholder="请选择账号类型"
              allow-search
              allow-clear
            >
              <a-option
                v-for="item in accountTypeList"
                :key="item.dictValue"
                :value="item.dictValue"
                >{{ item.dictKey }}</a-option
              >
            </a-select>
          </a-form-item>
          <a-form-item field="status" label="账号状态">
            <a-select
              v-model="tempSearchForm.status"
              placeholder="请选择账号状态"
              allow-search
              allow-clear
            >
              <a-option
                v-for="item in accountStatusList"
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
            v-permission="'UserListAdd'"
            type="primary"
            @click="jumpToAdd"
          >
            <icon-plus class="icon" />
            新增
          </a-button>
          <a-button
            v-permission="'UserListSendAccount'"
            type="primary"
            @click="jumpToBatchSendAccount"
          >
            批量发送账号
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
          v-model:selected-keys="selectKeys"
          :data="userList.list"
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
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #accountType="{ record }">
            {{
              accountTypeList.find(
                (item: any) => item.dictValue === record.accountType
              )?.dictKey
            }}
          </template>
          <template #status="{ record }">
            {{
              accountStatusList.find(
                (item: any) => item.dictValue === record.status
              )?.dictKey
            }}
          </template>
          <template #lastSendAccountTimeTitle>
            <span style="margin-right: 2px">最后发送账号时间</span>
            <a-tooltip content="最后向用户发送用户账号信息的时间">
              <icon-exclamation-circle color="#86909C" />
            </a-tooltip>
          </template>
          <template #relatedInfo="{ record }">
            <div class="related-info">
              <span
                v-if="record.accountType === 1"
                :style="{
                  color: '#357cf0',
                  cursor: 'pointer',
                }"
                @click="jumpToStaff(record)"
                >{{
                  record.relatedInfo.userName +
                  '(' +
                  record.relatedInfo.deptName +
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
                v-permission="'UserRelatedPerson'"
                type="primary"
                size="mini"
                @click="editModal(record)"
                >{{
                  record.accountType === 1 ? '编辑' : '点击关联人员'
                }}</a-button
              >
            </div>
          </template>
          <template #option="{ record }">
            <div>
              <a-button
                v-permission="'UserListEdit'"
                type="text"
                size="mini"
                @click="toEditPage(record)"
              >
                编辑
              </a-button>
              <a-button
                v-permission="'UserListDelete'"
                type="text"
                size="mini"
                status="danger"
                @click="deleteUserFn(record)"
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
          :total="(userList.total as number)"
          @change="pageChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>
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
        <div class="title">用户信息</div>
        <div class="user-info-content">
          <div class="user-info-item">
            <div>用户姓名：</div>
            <div>{{ userInfo.nickname }}</div>
          </div>
          <!-- <div class="user-info-item">
            <div>自定义账号：</div>
            <div>{{ userInfo.username }}</div>
          </div> -->
          <div class="user-info-item">
            <div>手机号码：</div>
            <div>{{ userInfo.mobile }}</div>
          </div>
          <div class="user-info-item">
            <div>所属部门：</div>
            <div>{{ userInfo.deptName }}</div>
          </div>
          <div class="user-info-item">
            <div>所属角色：</div>
            <div>{{ userInfo.roleNames }}</div>
          </div>
        </div>
      </div>
      <div class="modal-related-info">
        <div class="title">
          <span>关联人员信息</span>
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
          <div class="related-info-item">
            <div>员工姓名：</div>
            <div>{{ modalRelatedInfo.userName }}</div>
          </div>
          <div class="related-info-item">
            <div>手机号码：</div>
            <div>{{ modalRelatedInfo.tel }}</div>
          </div>
          <div class="related-info-item">
            <div>所属部门：</div>
            <div>{{ modalRelatedInfo.deptName }}</div>
          </div>
          <div class="related-info-item">
            <div>所属岗位：</div>
            <div>{{ modalRelatedInfo.jobName }}</div>
          </div>
        </div>
        <div class="no-data" v-else>
          未选择关联人员，请选择上面按钮进行关联人员选择
        </div>
      </div>
    </a-modal>
    <relatedPersonDrawer
      v-if="userInfo"
      :key="userInfo.id"
      tips="列表仅展示与用户姓名及所属部门相同的未关联用户的员工数据"
      :visible="relatedPersonDrawerVisible"
      :select-keys="relatedPersonKeys"
      :dept-id="userInfo.deptId"
      :user-name="userInfo.nickname"
      @cancel="drawerCancel"
      @confirm="drawerConfirm"
    />
  </div>
</template>
<script lang="ts" setup name="UserList">
  import {
    deleteUser,
    getRoleList,
    getRoleListApi,
    getUserList,
    userBindEmployee,
    userUnbindEmployee,
  } from '@/api/user';
  import {
    Message,
    Modal,
    TableColumnData,
    TableData,
  } from '@arco-design/web-vue';
  import { h, onMounted, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { useSearch } from '@/views/pitfall/snapshot/composition/useSearch';
  import relatedPersonDrawer from './component/relatedPersonDrawer.vue';
  import { handleOnKeyup } from '@/utils/event';
  import useRouterJump from '@/hooks/routerJump';
  import { formatDate } from '@/utils/utils';
  import CheckModal from '@/views/enterpriseManage/staffManage/components/checkModal.vue';
  import { useAppStore } from '@/store';

  const route = useRoute();
  const { roleId = undefined, name, id } = route.query;

  // 账号状态下拉
  const accountStatusList = ref<any>([
    {
      dictKey: '启用',
      dictValue: 0,
    },
    {
      dictKey: '禁用',
      dictValue: 1,
    },
  ]);
  // 账号类型下拉
  const accountTypeList = ref<any>([
    {
      dictKey: '员工账号',
      dictValue: 1,
    },
    {
      dictKey: '其他',
      dictValue: 2,
    },
  ]);
  // 角色下拉
  const roleList = ref<any>([]);
  const getUserRoleList = async () => {
    const { data } = await getRoleListApi({});
    roleList.value = data.map((ele: any) => {
      return {
        dictKey: ele.name,
        dictValue: ele.id,
      };
    });
  };
  getUserRoleList();

  const tempSearchForm = ref<any>({
    roleId: roleId,
    nickname: name,
    deptId: id,
    pageNo: 1,
    pageSize: 10,
  });
  const selectForm = ref<any>({
    roleId: roleId,
    nickname: name,
    deptId: id,
    pageNo: 1,
    pageSize: 10,
  });

  const { deptData, onDeptSearch, clearSearchKey } = useSearch(['deptData']);

  const columns: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
    },
    {
      title: '用户姓名',
      dataIndex: 'nickname',
      width: 90,
      cellStyle: { width: '7%' },
    },
    {
      title: '登录手机号',
      dataIndex: 'mobile',
      width: 120,
      cellStyle: { width: '9%' },
    },
    // {
    //   title: '自定义账号',
    //   dataIndex: 'username',
    //   width: 110,
    // },
    {
      title: '所属部门',
      dataIndex: 'deptName',
    },
    {
      title: '所属角色',
      dataIndex: 'roleNames',
    },
    {
      title: '账号类型',
      dataIndex: 'accountType',
      slotName: 'accountType',
    },
    {
      title: '关联人员信息',
      dataIndex: 'relatedInfo',
      slotName: 'relatedInfo',
      width: 200,
      cellStyle: { width: '17%' },
    },
    {
      title: '最后发送账号时间',
      dataIndex: 'sendAccountTime',
      titleSlotName: 'lastSendAccountTimeTitle',
    },
    {
      title: '账号状态',
      dataIndex: 'status',
      slotName: 'status',
      bodyCellStyle: (record: TableData) => {
        return {
          color: record.status === 0 ? '#43cf7c' : '#f53f3f',
        };
      },
    },
    {
      title: '创建时间',
      dataIndex: 'createTime',
      cellStyle: { width: '9%' },
    },
    {
      title: '操作',
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];

  const allTableData = ref<TableData[]>([]);

  const userList = ref<any>({ total: 0, list: [] });

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getTableList();
    });
  });

  const getTableList = async () => {
    const { data } = await getUserList(selectForm.value);
    userList.value.total = data.total;
    userList.value.list = data.list.map((ele: any) => {
      return {
        ...ele,
        createTime: formatDate(ele.createTime),
        deptId: ele.dept ? ele.dept.id : '',
        deptName: ele.dept ? ele.dept.name : '',
        relatedInfo: ele.employee,
      };
    });
    allTableData.value = deduplicateByProperty(
      [...data.list, ...allTableData.value],
      'id'
    );
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

  const { jumpWithTab } = useRouterJump();

  const jumpToStaff = (record: any) => {
    jumpWithTab({
      routerName: 'StaffManage',
      params: {
        name: record.employee.userName,
        id: record.employee.deptId,
      },
    });
  };
  const toEditPage = (record: any) => {
    router.push({
      name: 'UserListEdit',
      query: {
        id: record.id,
      },
    });
  };
  const jumpToAdd = (record: any) => {
    router.push({
      name: 'UserListAdd',
    });
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
    if (record.accountType === 1) {
      modalTitle.value = '编辑关联关系';
      modalRelatedInfo.value = record.relatedInfo;
    }
    userInfo.value = record;
    modalVisible.value = true;
  };
  const updateRelatedFn = async () => {
    const api = modalRelatedInfo.value ? userBindEmployee : userUnbindEmployee;
    const params = {
      employeeId: modalRelatedInfo.value
        ? modalRelatedInfo.value.id
        : userInfo.value.employee.id,
      userId: userInfo.value.id,
    };
    await api(params);
    Message.success(modalRelatedInfo.value ? `绑定成功` : `解绑成功`);
    getTableList();
    closeModal();
  };

  const cancelRelated = () => {
    modalRelatedInfo.value = null;
  };

  const router = useRouter();
  // 批量发送账号事件
  const selectKeys = ref<any[]>([]);
  const jumpToBatchSendAccount = () => {
    if (!selectKeys.value.length) {
      Message.warning('请先选择用户');
      return;
    }
    let limitCount = 0;
    let limitDesc = '';
    let limitIds: string[] = [];
    selectKeys.value.forEach((ele: any) => {
      const item = allTableData.value.find((data) => data.id === ele);
      if (!item) return;
      if (item.count > 5) {
        limitCount++;
        limitDesc += `${item.nickname}-${item.dept.name}、`;
        limitIds.push(item.id);
      }
    });
    let detailTitle: string[] = [];
    let detailContent: string[] = [];
    if (limitCount) {
      detailTitle.push('今日发送账号信息次数已达上限员工');
      detailContent.push(limitDesc.substring(0, limitDesc.length - 1));
    }
    if (!limitCount) {
      router.push({
        name: 'UserListSendAccount',
        query: {
          userIds: selectKeys.value.join(','),
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
          info: `您选中的${limitCount}位员工${
            limitCount ? '今日发送账号信息次数已达上限' : ''
          }，不可发送账号信息。您可点击“重新选择”重新进行员工选择；若您点击“继续”，系统将自动忽略此${limitCount}条员工数据，继续批量发送账号信息短信至用户手机号。`,
          detailTitle,
          detailContent,
        }),
      onOk: () => {
        if (
          !selectKeys.value.filter((item: any) => !limitIds.includes(item))
            .length
        ) {
          Message.warning('没有需要发送账号的员工，请重新选择');
          return;
        }
        router.push({
          name: 'UserListSendAccount',
          query: {
            userIds: selectKeys.value
              .filter((item: any) => !limitIds.includes(item))
              .join(','),
          },
        });
      },
    });
  };

  // 删除事件
  const deleteUserFn = async (record: any) => {
    Modal.open({
      title: '提示',
      content: () =>
        h(ConfirmModalBody, {
          text: record.nickname,
          info: '删除用户后无法恢复，是否确认删除',
        }),
      titleAlign: 'start',
      onOk: async () => {
        if (record.status === 0) {
          Message.warning(
            `该用户为启用状态，无法删除，若仍要删除，请先禁用用户`
          );
          return;
        }
        await deleteUser(record.id);
        Message.success('删除成功');
        getTableList();
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
      tel: employeeInfo.mobile || employeeInfo.tel,
    };
    relatedPersonDrawerVisible.value = false;
  };
</script>
<style lang="less" scoped>
  .header-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    .arco-btn + .arco-btn {
      margin-top: 12px;
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
      .user-info-item:first-of-type {
        flex: 0 0 100%;
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
</style>
