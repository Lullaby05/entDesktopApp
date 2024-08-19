<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" />
        <span class="title">批量创建账号</span>
      </div>
      <div class="create-account-container">
        <div class="steps">
          <a-steps :current="currentStep" label-placement="vertical">
            <a-step>
              <div class="step-desc">
                <div>选中员工数据确认</div>
                <div>预览并检查选中员工数据</div>
              </div>
            </a-step>
            <a-step>
              <div class="step-desc">
                <div>账号生成配置</div>
                <div>设置账号登录信息</div>
              </div>
            </a-step>
            <a-step>
              <div class="step-desc">
                <div>账号数据预览</div>
                <div>预览选中员工账号数据</div>
              </div>
            </a-step>
            <a-step>
              <div class="step-desc">
                <div>创建账号</div>
                <div>为选中员工创建账号</div>
              </div>
            </a-step>
            <a-step>
              <div class="step-desc">
                <div>创建成功</div>
                <div>完成账号创建</div>
              </div>
            </a-step>
          </a-steps>
        </div>
        <div class="first" v-if="currentStep === 1">
          <div class="warning-text" v-if="warningNum">
            <icon-close-circle style="color: #d43030; font-size: 16px" />
            {{
              warningNum
            }}条数据存在异常，详情请见下面列表中红色字体部分，并按照列表中异常说明及处理进行处理或者重新进行选择
          </div>
          <div class="total">共选中{{ tableData.total }}条员工数据</div>
          <div class="table">
            <a-table
              :data="tableData.list"
              row-key="id"
              :columns="columns"
              :bordered="false"
              :pagination="{
                total: tableData.total,
                showTotal: true,
                showPageSize: true,
                pageSizeOptions: [10, 20, 50, 100],
              }"
              @page-change="currentChange"
              @page-size-change="pageSizeChange"
            >
              <template #errorDesc="{ record }">
                <div class="error-desc" v-if="!record.result">
                  <span>该手机号已创建其他用户账号</span>
                  <div>
                    <a-button type="text" @click="changeUserTel(record)"
                      >修改用户手机</a-button
                    >
                    <a-button type="text" @click="changeStaffTel(record)"
                      >修改员工手机</a-button
                    >
                  </div>
                </div>
              </template>
            </a-table>
          </div>
        </div>
        <div class="second" v-if="currentStep === 2">
          <a-form ref="formRef" :model="accountForm" :rules="rules">
            <!-- <div>
              <div class="label">自定义登录账号：</div>
              <div class="content"
                >系统默认将员工姓名作为自定义账号，若姓名重复，将使用姓名+编号</div
              >
              <div class="description">首次登录时系统会提示修改账号</div>
            </div> -->
            <div>
              <!-- <div class="label">初始登录密码：</div> -->
              <div class="content">
                <a-form-item field="password" label="初始登录密码：">
                  <a-input
                    style="width: 256px"
                    v-model="accountForm.password"
                    allow-clear
                    placeholder="请输入初始登录密码"
                  />
                </a-form-item>
              </div>
              <div class="description"
                >8-16字符，包含大小写字母、数字、特殊字符至少两种</div
              >
              <div class="description"> 登录后系统会提示修改密码 </div>
            </div>
            <div>
              <!-- <div class="label">账号所属角色：</div> -->
              <div class="content">
                <a-form-item field="roleIds" label="账号所属角色：">
                  <a-select
                    style="width: 256px"
                    v-model="accountForm.roleIds"
                    allow-clear
                    allow-search
                    multiple
                    placeholder="请选择账号所属角色"
                  >
                    <a-option
                      v-for="item in userRoleList"
                      :key="item.dictValue"
                      :value="item.dictValue"
                      >{{ item.dictKey }}</a-option
                    >
                  </a-select>
                </a-form-item>
              </div>
              <div class="description"
                >当前选中员工创建账号的所属角色均为上述选中的账号所属角色</div
              >
            </div>
          </a-form>
        </div>
        <div class="third" v-if="currentStep === 3">
          <div class="total"> 共有{{ tableData.total }}条数据 </div>
          <div class="table">
            <a-table
              :data="previewTableData"
              row-key="id"
              :columns="previewTableColumns"
              :bordered="false"
              :pagination="{
                total: tableData.total,
                showTotal: true,
                showPageSize: true,
                pageSizeOptions: [10, 20, 50, 100],
              }"
              @page-change="previewCurrentChange"
              @page-size-change="previewPageSizeChange"
            ></a-table>
          </div>
        </div>
        <div class="forth" v-if="currentStep === 4">
          <a-progress
            size="large"
            :percent="Number((progressBarStatus / 100).toFixed(2))"
          />
          <div class="loading-text">正在创建账号，请勿关闭或刷新页面</div>
        </div>
        <div class="fifth" v-if="currentStep === 5">
          <icon-check-circle-fill style="font-size: 100px; color: #43cf7c" />
          <div class="success-text">已成功创建{{ tableData.total }}个账号</div>
        </div>
      </div>
      <div class="btn">
        <a-space>
          <a-button v-if="currentStep === 1" @click="reChoose"
            >重新选择</a-button
          >
          <a-button
            v-if="currentStep > 1 && currentStep < 4"
            @click="currentStep--"
            >上一步</a-button
          >
          <a-button v-if="currentStep === 3" type="primary" @click="nextStep"
            >确认创建</a-button
          >
          <a-button
            v-if="currentStep < 3"
            type="primary"
            :disabled="!!warningNum"
            @click="nextStep"
            >下一步</a-button
          >
          <a-button v-if="currentStep === 5" @click="goBack">返回列表</a-button>
          <a-button v-if="currentStep === 5" type="primary" @click="sendAccount"
            >发送账号信息</a-button
          >
        </a-space>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
  import { TableColumnData, TableData } from '@arco-design/web-vue';
  import { ref, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { getRoleList, getRoleListApi } from '@/api/user';
  import { batchCreateUserAPI, getAccountByIds } from '@/api/enterpriseManage';
  import { useEnterpriseStore } from '@/store';

  const enterpriseStore = useEnterpriseStore();

  const route = useRoute();
  const router = useRouter();

  const { ids } = route.query;

  const goBack = () => {
    router.back();
  };
  const reChoose = () => {
    enterpriseStore.setStaffInfo({
      selectKeys: (ids as string).split(','),
    });
    goBack();
  };

  const currentStep = ref(1);

  // 第一部分
  const warningNum = ref(0);
  const tableData = ref<any>({ list: [], total: 0 });
  const allTableData = ref<any[]>([]);
  const pageConfig = ref({
    pageNo: 1,
    pageSize: 10,
  });

  const columns = ref<TableColumnData[]>([
    {
      title: '员工姓名',
      dataIndex: 'userName',
      bodyCellStyle: (record) => {
        if (record.result) return {};
        return { color: '#d43030' };
      },
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      bodyCellStyle: (record) => {
        if (record.result) return {};
        return { color: '#d43030' };
      },
    },
    {
      title: '手机号码',
      dataIndex: 'tel',
      bodyCellStyle: (record) => {
        if (record.result) return {};
        return { color: '#d43030' };
      },
    },
    {
      title: '所属岗位',
      dataIndex: 'jobName',
      bodyCellStyle: (record) => {
        if (record.result) return {};
        return { color: '#d43030' };
      },
    },
  ]);

  const getDetailData = async () => {
    enterpriseStore.clearStaffInfo();
    const { data } = await getAccountByIds({
      employeeIds: (ids as string).split(','),
    });
    allTableData.value = data.sort((a: any, b: any) => a.result - b.result);
    getDetailTableData();
    warningNum.value = data.filter((item: any) => !item.result).length;
    if (warningNum.value) {
      columns.value.push({
        title: '异常说明及处理',
        dataIndex: 'errorDesc',
        slotName: 'errorDesc',
        align: 'center',
      });
    }
  };

  const getDetailTableData = () => {
    const { pageNo, pageSize } = pageConfig.value;
    tableData.value.list = allTableData.value.slice(
      (pageNo - 1) * pageSize,
      pageNo * pageSize
    );
    tableData.value.total = allTableData.value.length;
  };

  getDetailData();

  const currentChange = (current: number) => {
    pageConfig.value.pageNo = current;
    getDetailTableData();
  };

  const pageSizeChange = (pageSize: number) => {
    pageConfig.value.pageNo = 1;
    pageConfig.value.pageSize = pageSize;
    getDetailTableData();
  };

  const changeUserTel = (record: TableData) => {
    router.push({
      name: 'StaffUserListEdit',
      query: {
        id: record.repeatUserId,
        editPhone: 'true',
      },
    });
  };

  const changeStaffTel = (record: TableData) => {
    router.push({
      name: 'StaffManageEdit',
      query: {
        type: 'edit',
        id: record.id,
        editPhone: 'true',
      },
    });
  };

  // 第二部分
  const accountForm = ref({
    password: '',
    roleIds: [],
  });
  const rules = {
    password: [
      {
        required: true,
        validator: (value: any, callback: Function) => {
          const regexp =
            /^(((?=.*[0-9])(?=.*[a-zA-Z])|(?=.*[0-9])(?=.*[^\s0-9a-zA-Z])|(?=.*[a-zA-Z])(?=.*[^\s0-9a-zA-Z]))[^\s]{8,16})$/;
          if (!value) {
            callback('请输入初始登录密码');
          } else if (!regexp.test(value)) {
            callback('密码必须是大小写字母、数字、特殊字符至少两种，8-16字符');
          }
          callback();
        },
      },
    ],
    roleIds: [
      {
        required: true,
        message: '请选择账号所属角色',
        trigger: 'blur',
      },
    ],
  };
  const formRef = ref<any>(null);

  // 第三部分
  const previewTableData = computed(() => {
    let roleNames = '';
    accountForm.value.roleIds.forEach((item: string) => {
      const obj = userRoleList.value.find(
        (role: any) => role.dictValue === item
      );
      const name = obj ? obj.dictKey : '';
      roleNames += name + ',';
    });
    const { pageNo, pageSize } = previewPageConfig.value;
    return allTableData.value
      .slice((pageNo - 1) * pageSize, pageNo * pageSize)
      .map((ele: any) => {
        return {
          ...ele,
          employeeId: ele.id,
          accountType: 1,
          status: 0,
          nickname: ele.userName,
          mobile: ele.tel,
          password: accountForm.value.password,
          roleNames: roleNames.substring(0, roleNames.length - 1),
          roleIds: accountForm.value.roleIds.join(','),
          username: ele.userAccount,
        };
      });
  });
  const previewTableColumns: TableColumnData[] = [
    { title: '员工信息', dataIndex: 'staffInfo', children: columns.value },
    {
      title: '用户信息',
      dataIndex: 'userInfo',
      children: [
        { title: '用户姓名', dataIndex: 'nickname' },
        { title: '手机号码', dataIndex: 'mobile' },
        { title: '登录密码', dataIndex: 'password' },
        { title: '所属部门', dataIndex: 'deptName' },
        { title: '所属角色', dataIndex: 'roleNames' },
      ],
    },
  ];
  const previewPageConfig = ref({
    pageNo: 1,
    pageSize: 10,
  });
  const previewCurrentChange = (current: number) => {
    previewPageConfig.value.pageNo = current;
  };
  const previewPageSizeChange = (pageSize: number) => {
    previewPageConfig.value.pageNo = 1;
    previewPageConfig.value.pageSize = pageSize;
  };

  const nextStep = async () => {
    if (currentStep.value === 2) {
      const result = await formRef.value.validate();
      if (result) return;
    }
    if (currentStep.value === 3) {
      currentStep.value++;
      progressBarStatus.value = 0;
      await startRequest();
    }
    currentStep.value++;
  };

  const sendAccount = async () => {
    router.replace({
      name: 'StaffListSendAccount',
      query: {
        staffIds: ids,
      },
    });
  };

  const progressBarStatus = ref(0);
  const isRequestSucces = ref(false);

  let timer: any;
  const startRequest = async () => {
    return new Promise((resolve, reject) => {
      // 记录请求开始时间
      // const requestStartTime = Date.now();

      // 请求完成后立即启动定时器
      timer = setInterval(() => {
        if (progressBarStatus.value < 99) {
          progressBarStatus.value += 1;
        } else {
          // 清除定时器
          clearInterval(timer);
          if (isRequestSucces.value) {
            progressBarStatus.value = 100;
          }
        }
      }, 10);
      const params = allTableData.value.map((ele: any) => {
        return {
          ...ele,
          employeeId: ele.id,
          accountType: 1,
          status: 0,
          nickname: ele.userName,
          mobile: ele.tel,
          password: accountForm.value.password,
          roleIds: accountForm.value.roleIds.join(','),
          username: ele.userAccount,
        };
      });
      setTimeout(() => {
        batchCreateUserAPI(params)
          .then((res) => {
            isRequestSucces.value = true;
            resolve(void 0);
          })
          .catch(() => {
            isRequestSucces.value = false;
            currentStep.value = 3;
            reject();
          });
      }, 1000);
    });
  };

  // 获取用户角色
  const userRoleList = ref<any[]>([]);
  const getUserRoleList = async () => {
    const { data } = await getRoleListApi({});
    userRoleList.value = data.map((ele: any) => {
      return {
        dictKey: ele.name,
        dictValue: ele.id,
      };
    });
  };
  getUserRoleList();
</script>
<style lang="less" scoped>
  .arco-card.content-card {
    .header {
      font-size: 18px;
      margin-bottom: 30px;

      .title {
        margin-left: 8px;
      }
    }
  }

  .btn {
    margin-top: 12px;
    width: 100%;
    text-align: center;
  }

  .create-account-container {
    min-height: calc(100vh - 265px);
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 0 32px;

    .first {
      display: flex;
      flex-direction: column;
      gap: 24px;

      .warning-text {
        display: flex;
        align-items: center;
        gap: 5px;
        padding: 16px 32px;
        background-color: #ffece8;
        border-radius: 8px;
      }

      .total {
        font-family: 'Alibaba-Medium';
        font-size: 16px;
      }
    }

    .second {
      margin: 0 auto;

      :deep(.arco-form) {
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 30px;
        line-height: 1.5;
      }

      .label {
        font-size: 16px;
        color: var(--color-text-grey);
        font-family: 'Alibaba-Medium';
        margin-bottom: 5px;
      }

      .content {
        color: var(--color-text-black);
        font-size: 16px;

        :deep(.arco-row) {
          flex-direction: column;

          .arco-col-5 {
            flex: 0 0 auto;
            width: auto;
          }
        }

        :deep(.arco-form-item-label) {
          font-size: 16px;
          color: var(--color-text-grey);
          font-family: 'Alibaba-Medium';
        }
      }

      .description {
        color: var(--color-text-grey1);
        font-size: 14px;
      }
    }

    .third {
      display: flex;
      flex-direction: column;
      gap: 24px;

      .total {
        font-family: 'Alibaba-Medium';
        font-size: 16px;
      }
    }

    .forth,
    .fifth {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      .loading-text {
        font-size: 14px;
        color: var(--color-text-grey1);
      }

      .success-text {
        font-family: 'Alibaba-Medium';
        font-size: 20px;
        color: var(--color-text-grey);
      }
    }

    .step-desc {
      display: flex;
      flex-direction: column;
      align-items: center;
      font-size: 12px;

      div:nth-of-type(1) {
        color: var(--color-text-grey);
      }

      div:nth-of-type(2) {
        color: var(--color-text-grey1);
      }
    }
  }

  .error-desc {
    display: flex;
    flex-direction: column;
    gap: 5px;

    span {
      margin-left: -20px;
      color: #d43030;
    }
  }
</style>
