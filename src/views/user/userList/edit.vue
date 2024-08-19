<!-- 用户管理-编辑 -->
<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">编辑用户</span>
      </div>
      <div class="content-card-inner">
        <div class="person-info">
          <div class="title">个人信息</div>
          <div class="person-info-form">
            <a-form
              :disabled="editPhone == 'true'"
              ref="formRef"
              :model="accountFormData"
              :rules="formRules"
            >
              <a-form-item field="accountType" label="用户类型：">
                <a-radio-group v-model="accountFormData.accountType">
                  <a-radio :value="1">员工</a-radio>
                  <a-radio :value="2">其他</a-radio>
                </a-radio-group>
                <a-tooltip content="是否为已录入系统员工创建用户账号"
                  ><icon-exclamation-circle color="#86909C"
                /></a-tooltip>
              </a-form-item>
              <a-form-item
                field="relatedPerson"
                label="关联员工："
                v-if="accountFormData.accountType === 1"
              >
                <span
                  class="related-person"
                  style="margin-right: 10px"
                  v-if="accountFormData.relatedPerson"
                  >{{
                    `${accountFormData.relatedPerson.userName}(${accountFormData.relatedPerson.deptName})`
                  }}</span
                >
                <a-button type="primary" @click="openDrawer">选择</a-button>
              </a-form-item>
              <a-form-item
                field="nickname"
                label="用户姓名："
                v-if="accountFormData.accountType === 2"
              >
                <a-input
                  v-model="accountFormData.nickname"
                  placeholder="请输入用户姓名"
                  allow-clear
                ></a-input>
              </a-form-item>
              <a-form-item
                field="deptId"
                label="所属部门："
                v-if="accountFormData.accountType === 2"
              >
                <a-tree-select
                  v-model:model-value="accountFormData.deptId"
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
            </a-form>
          </div>
        </div>
        <div class="account-info">
          <div class="title">账号信息</div>
          <div class="account-info-form">
            <a-form
              :disabled="editPhone == 'true'"
              ref="accountFormRef"
              :model="accountFormData"
              :rules="formRules"
            >
              <a-form-item label="登录账号：" class="login-account">
                <!-- <a-form-item field="username" label="自定义账号：">
                  <a-input
                    v-model="accountFormData.username"
                    placeholder="请输入自定义账号"
                    allow-clear
                  ></a-input>
                </a-form-item> -->
                <a-form-item
                  :disabled="false"
                  field="mobile"
                  label="登录手机："
                >
                  <a-input
                    v-model="accountFormData.mobile"
                    placeholder="请输入登陆手机"
                    allow-clear
                  ></a-input>
                </a-form-item>
                <a-form-item field="email" label="登录邮箱：">
                  <a-input
                    v-model="accountFormData.email"
                    placeholder="请输入登陆邮箱"
                    allow-clear
                  ></a-input>
                </a-form-item>
              </a-form-item>
              <a-form-item field="cleartextPasswords" label="登录密码：">
                <div
                  class="value"
                  style="display: flex; align-items: center; gap: 10px"
                >
                  <span>{{ passwordText }}</span>
                  <icon-eye
                    v-if="!passwordVisible"
                    style="cursor: pointer; font-size: 20px"
                    @click="passwordVisible = !passwordVisible"
                  />
                  <icon-eye-invisible
                    v-if="passwordVisible"
                    style="cursor: pointer; font-size: 20px"
                    @click="passwordVisible = !passwordVisible"
                  />
                  <a-button
                    type="primary"
                    size="mini"
                    @click="passwordModalVisible = true"
                    >修改密码</a-button
                  >
                </div>
              </a-form-item>
              <a-form-item field="roleIds" label="用户角色：">
                <a-select
                  v-model="accountFormData.roleIds"
                  placeholder="请选择用户角色"
                  allow-clear
                  multiple
                >
                  <a-option
                    v-for="item in userRoleList"
                    :value="item.dictValue"
                    >{{ item.dictKey }}</a-option
                  >
                </a-select>
              </a-form-item>
              <a-form-item field="avatar" label="用户头像：">
                <a-upload
                  v-model:file-list="accountFormData.avatar"
                  list-type="picture-card"
                  :custom-request="customRequest"
                  accept="image/*"
                  :limit="1"
                  image-preview
                  @before-upload="(e) => beforeUpload(e, 'image/*')"
                  @success="uploadSuccess"
                  @before-remove="beforeRemove"
                ></a-upload>
              </a-form-item>
              <a-form-item field="status" label="账号状态：">
                <a-switch
                  v-model="accountFormData.status"
                  :checked-value="0"
                  :unchecked-value="1"
                >
                  <template #checked> 启用 </template>
                  <template #unchecked> 禁用 </template>
                </a-switch>
              </a-form-item>
            </a-form>
          </div>
        </div>
      </div>
      <div class="btn">
        <a-button @click="goBack">取消</a-button>
        <a-button type="primary" @click="handleSubmit">保存</a-button>
      </div>
      <a-modal
        :visible="passwordModalVisible"
        title="修改密码"
        title-align="start"
        @ok="changePassword"
        @cancel="closePasswordModal"
      >
        <a-form ref="passwordFormRef" :model="passwordForm">
          <a-form-item
            field="newPassword"
            label="新密码"
            :rules="formRules.cleartextPasswords"
          >
            <a-input-password
              v-model="passwordForm.newPassword"
              allow-clear
              placeholder="输入大小写字母、数字、特殊字符至少两种，8-16字符"
            ></a-input-password>
          </a-form-item>
          <a-form-item
            field="rePassword"
            label="新密码确认"
            :rules="[
              {
                required: true,
                validator(value, callback) {
                  //@ts-ignore
                  if (value !== passwordForm.newPassword) {
                    callback('两次密码不一致');
                  } else {
                    callback();
                  }
                },
              },
            ]"
          >
            <a-input-password
              v-model="passwordForm.rePassword"
              allow-clear
              placeholder="请再次输入密码"
            ></a-input-password>
          </a-form-item>
        </a-form>
      </a-modal>
    </a-card>
    <relatedPersonDrawer
      tips="列表仅展示未关联用户的人员信息"
      :needSearch="true"
      :visible="relatedPersonDrawerVisible"
      :select-keys="relatedPersonKeys"
      @cancel="drawerCancel"
      @confirm="drawerConfirm"
    />
  </div>
</template>
<script lang="ts" setup>
  import { useSearch } from '@/views/pitfall/snapshot/composition/useSearch';
  import { h, computed, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import relatedPersonDrawer from './component/relatedPersonDrawer.vue';
  import {
    changePasswordApi,
    getRoleList,
    getRoleListApi,
    getUserDetailApi,
    updateUserApi,
  } from '@/api/user';
  import { FileItem, Form, Message, Modal } from '@arco-design/web-vue';
  import { UploadPath } from '@/api/index';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { useCustomUpload } from '@/hooks/customUpload';

  const router = useRouter();
  const route = useRoute();

  const { id, editPhone = 'false' } = route.query;

  const { deptData, onDeptSearch, clearSearchKey } = useSearch(['deptData']);

  const accountFormData = ref<{ relatedPerson: null | any; [x: string]: any }>({
    accountType: '',
    relatedPerson: null,
    userName: '',
    deptId: '',
    username: '',
    mobile: '',
    email: '',
    password: '',
    userRole: '',
    status: 0,
  });
  const formRef = ref<any>(null);
  const accountFormRef = ref<any>(null);
  const formRules = {
    accountType: [
      {
        required: true,
        message: '请选择用户类型',
        trigger: 'blur',
      },
    ],
    relatedPerson: [
      {
        required: true,
        message: '请选择关联员工',
        trigger: 'blur',
      },
    ],
    nickname: [
      {
        required: true,
        message: '请输入用户姓名',
        trigger: 'blur',
      },
      { maxLength: 25, message: '不能超过25字符' },
    ],
    deptId: [
      {
        required: true,
        message: '请选择所属部门',
        trigger: 'blur',
      },
    ],
    // username: [
    //   {
    //     required: true,
    //     validator: (value: any, callback: Function) => {
    //       const regexp = /^[\u4E00-\u9FA5a-zA-Z0-9_]{2,25}$/;
    //       if (!value) {
    //         callback('请输入自定义账号');
    //       } else if (!regexp.test(value)) {
    //         callback('自定义账号仅由英文、数字、中文及下划线组成，2-25字符');
    //       }
    //       callback();
    //     },
    //   },
    // ],
    mobile: [
      {
        required: true,
        message: '请输入登录手机',
        trigger: 'blur',
      },
      {
        validator: (value: any, callback: Function) => {
          const phoneRegexp = /^(?:(?:\+|00)86)?1[3-9]\d{9}$/;
          if (!phoneRegexp.test(value)) {
            callback('请输入正确的手机号码');
          }
          callback();
        },
      },
    ],
    email: [
      {
        validator: (value: any, callback: Function) => {
          const emailRegexp =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
          if (value && !emailRegexp.test(value)) {
            callback('请输入正确的邮箱');
          }
          callback();
        },
      },
    ],
    cleartextPasswords: [
      {
        required: true,
        validator: (value: any, callback: Function) => {
          const regexp =
            /^(((?=.*[0-9])(?=.*[a-zA-Z])|(?=.*[0-9])(?=.*[^\s0-9a-zA-Z])|(?=.*[a-zA-Z])(?=.*[^\s0-9a-zA-Z]))[^\s]{8,16})$/;
          if (!value) {
            callback('请输入登录密码');
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
        message: '请选择用户角色',
        trigger: 'blur',
      },
    ],
    status: [
      {
        required: true,
        message: '请选择账号状态',
        trigger: 'blur',
      },
    ],
  };

  const goBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    const valid = await formRef.value.validate();
    const result = await accountFormRef.value.validate();
    if (valid || result) return;
    const params = {
      ...accountFormData.value,
      nickname:
        accountFormData.value.accountType === 1
          ? accountFormData.value.relatedPerson.userName
          : accountFormData.value.nickname,
      roleIds: accountFormData.value.roleIds.join(','),
      password: accountFormData.value.cleartextPasswords,
      employeeId:
        accountFormData.value.accountType === 1
          ? accountFormData.value.relatedPerson.id
          : null,
      avatar: avatarRef.value,
    };
    await updateUserApi(params);
    Message.success('保存成功');
    goBack();
  };

  // 抽屉事件
  const relatedPersonDrawerVisible = ref(false);
  const relatedPersonKeys = ref<any[]>([]);
  const openDrawer = () => {
    relatedPersonKeys.value = accountFormData.value.relatedPerson
      ? [accountFormData.value.relatedPerson.id]
      : [];
    relatedPersonDrawerVisible.value = true;
  };
  const drawerCancel = () => {
    relatedPersonDrawerVisible.value = false;
  };
  const drawerConfirm = (employeeInfo: any) => {
    accountFormData.value = {
      ...accountFormData.value,
      relatedPerson: employeeInfo,
      nickname: employeeInfo.userName,
      deptId: employeeInfo.deptId,
    };
    relatedPersonDrawerVisible.value = false;
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

  // 获取详情
  const getUserDetail = async () => {
    const { data } = await getUserDetailApi(id as string);
    accountFormData.value = {
      ...data,
      roleIds: data.roleIds ? data.roleIds.split(',') : undefined,
      relatedPerson: data.employee.id ? data.employee : null,
      deptId: data.dept?.id,
      avatar: data.avatar ? [{ url: data.avatar }] : [],
    };
  };
  getUserDetail();

  // 密码相关
  const passwordVisible = ref(true);
  const password = computed(
    () => accountFormData.value.cleartextPasswords || ''
  );
  const passwordText = computed(() => {
    return passwordVisible.value
      ? password.value.replace(/./g, '*')
      : password.value;
  });
  // 修改密码弹窗
  const passwordFormRef = ref<InstanceType<typeof Form> | null>(null);
  const passwordModalVisible = ref(false);
  const passwordForm = ref<any>({
    newPassword: '',
    rePassword: '',
  });
  const changePassword = async () => {
    const result = await passwordFormRef.value?.validate();
    if (result) return;
    await changePasswordApi({
      userId: accountFormData.value.id,
      newPassword: passwordForm.value.newPassword,
    });
    Message.success('修改成功');
    accountFormData.value.cleartextPasswords = passwordForm.value.newPassword;
    closePasswordModal();
  };
  const closePasswordModal = () => {
    passwordModalVisible.value = false;
    passwordForm.value = {
      newPassword: '',
      rePassword: '',
    };
  };

  const avatarRef = ref<any>('');

  const { beforeUpload, customRequest } = useCustomUpload();

  // 附件上传
  const uploadSuccess = (e: FileItem) => {
    const {
      response: { data, code, msg },
    } = e;

    if (code < 200) {
      avatarRef.value = data[0].filePath;
    } else {
      Message.error({
        content: '上传失败，原因为=' + msg,
      });
    }
  };

  const beforeRemove = (file: FileItem): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      Modal.open({
        title: '提示',
        titleAlign: 'start',
        content: () =>
          h(ConfirmModalBody, {
            info: '删除数据不可恢复，请谨慎操作！',
          }),
        onOk: () => {
          avatarRef.value = '';
          return resolve(true);
        },
        onCancel: () => reject('cancel'),
      });
    });
  };
</script>
<style lang="less" scoped>
  .arco-card.content-card {
    .header {
      font-size: 18px;

      .title {
        margin-left: 8px;
      }
    }
  }
  .content-card-inner {
    margin: 0 25px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    .title {
      margin: 30px 0 20px;
      font-family: 'Alibaba-Medium';
      font-size: 16px;
      font-weight: 500;
    }
    :deep(.arco-form) {
      align-items: center;
      .arco-form-item {
        width: 70%;
      }
    }
    .account-info-form {
      .login-account {
        margin-bottom: 0px;
        flex-direction: column;
        :deep(.arco-form-item-content-flex) {
          flex-direction: column;
        }
        :deep(.arco-form-item) {
          width: 100%;
        }
        :deep(& > .arco-form-item-wrapper-col) {
          width: 100%;
          padding-left: 10%;
        }
      }
    }
  }

  .btn {
    margin-top: 20px;
    text-align: center;

    button + button {
      margin-left: 12px;
    }
  }
</style>
