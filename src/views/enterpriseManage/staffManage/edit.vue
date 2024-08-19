<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" />
        <span class="title">{{ title }}员工</span>
      </div>
      <div class="form">
        <a-form
          ref="form"
          :disabled="editPhone == 'true'"
          :model="formData"
          :rules="rules"
          :label-col-props="{ span: 4 }"
        >
          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            基本信息
          </div>

          <div class="content">
            <a-form-item :help="helpText" field="userName" label="员工姓名">
              <a-input
                v-model.trim="formData.userName"
                allow-clear
                placeholder="请输入员工姓名"
                @change="changeFlag('userName')"
                @blur="changeStaffName(formData.userName)"
              ></a-input>
            </a-form-item>
            <a-form-item field="deptId" label="所属部门" required>
              <a-tree-select
                :fallback-option="false"
                v-model:model-value="formData.deptId"
                placeholder="请选择部门"
                allow-search
                allow-clear
                :disable-filter="true"
                :field-names="{
                  key: 'id',
                  title: 'name',
                }"
                :data="deptData"
                @search="onDeptSearch"
                @blur="clearSearchKey"
                @clear="clearSearchKey"
                @change="(e) => {
                  formData.jobId = ''
                  changeFlag('deptId')
                  getPostData(e as string)
                }"
              ></a-tree-select>
            </a-form-item>
            <a-form-item field="jobId" label="员工岗位">
              <a-select
                v-model:model-value="formData.jobId"
                :fallback-option="false"
                :options="postData"
                allow-clear
                allow-search
                placeholder="请选择员工岗位"
                :field-names="{
                  label: 'jobName',
                  value: 'id',
                }"
              ></a-select>
            </a-form-item>
            <a-form-item field="workTypeId" label="员工工种">
              <a-select
                v-model:model-value="formData.workTypeId"
                :fallback-option="false"
                :options="workTypeData"
                allow-clear
                allow-search
                placeholder="请选择员工工种"
                :field-names="{
                  label: 'name',
                  value: 'id',
                }"
              ></a-select>
            </a-form-item>
            <a-form-item field="jobNumber" label="员工工号">
              <a-input
                v-model.trim="formData.jobNumber"
                allow-clear
                placeholder="请输入员工工号"
              ></a-input>
            </a-form-item>
            <a-form-item
              field="tel"
              label="手机号码"
              required
              :disabled="false"
            >
              <a-input
                v-model.trim="formData.tel"
                allow-clear
                placeholder="请输入手机号码"
              ></a-input>
            </a-form-item>
            <a-form-item field="entryDate" label="入职日期">
              <a-date-picker
                v-model:model-value="formData.entryDate"
                placeholder="请选择入职日期"
                format="YYYY-MM-DD"
              />
            </a-form-item>
            <a-form-item field="sex" label="性别">
              <a-radio-group v-model:model-value="formData.sex">
                <a-radio :value="1">男性</a-radio>
                <a-radio :value="2">女性</a-radio>
                <a-radio :value="3">保密</a-radio>
              </a-radio-group>
            </a-form-item>
          </div>

          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            详细信息
          </div>
          <div class="content">
            <a-form-item field="nativePlaceCode" label="籍贯">
              <a-input
                v-model.trim="formData.nativePlaceCode"
                allow-clear
                placeholder="请输入籍贯"
              ></a-input>
            </a-form-item>
            <a-form-item field="educationBackground" label="学历">
              <a-select
                v-model.trim="formData.educationBackground"
                placeholder="请选择学历"
                allow-clear
                :fallback-option="false"
              >
                <a-option
                  v-for="(value, key) of educationEnum"
                  :label="value"
                  :value="+key"
                ></a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="major" label="专业">
              <a-input
                v-model.trim="formData.major"
                allow-clear
                placeholder="请输入专业"
              ></a-input>
            </a-form-item>
            <a-form-item field="graduationSchool" label="毕业院校">
              <a-input
                v-model.trim="formData.graduationSchool"
                allow-clear
                placeholder="请输入毕业院校"
              ></a-input>
            </a-form-item>

            <a-form-item field="graduationTime" label="毕业时间">
              <a-date-picker
                v-model:model-value="formData.graduationTime"
                placeholder="请选择毕业时间"
                format="YYYY-MM-DD"
              />
            </a-form-item>
            <a-form-item field="remark" label="个人简介">
              <a-textarea
                v-model.trim="formData.remark"
                placeholder="请输入个人简介"
                :auto-size="{ maxRows: 6, minRows: 6 }"
                show-word-limit
                :max-length="300"
              ></a-textarea>
            </a-form-item>
          </div>
        </a-form>
      </div>
      <div class="btn">
        <a-space>
          <a-button @click="goBack">取消</a-button>
          <a-button type="primary" @click="submit">保存</a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
  import { phoneRegExp } from '@/utils/index';
  import { ref, computed, h } from 'vue';
  import { cloneDeep } from 'lodash';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useUserStore } from '@/store';
  import { Message, Modal } from '@arco-design/web-vue';
  import { getEnumListAPI } from '@/api/index';
  import {
    addStaffDataAPI,
    detailStaffDataAPI,
    uploadStaffDataAPI,
    getPostDataAllAPI,
    getWorkTypeDataAllAPI,
    getOrganizationTreeAPI,
    validateUserNameAPI,
  } from '@/api/enterpriseManage';
  import type { AddStaffData } from '@/api/enterpriseManage';
  import { OrganizationTreeData } from '@/store/modules/enterprise/types';
  import type { PostList } from '@/views/enterpriseManage/postManage/index';
  import type { WorkTypeList } from '@/views/enterpriseManage/workType/index';
  export default {
    name: 'StaffManageEdit',
  };
</script>

<script lang="ts" setup>
  const router = useRouter();
  const route = useRoute();

  const { editPhone = 'false' } = route.query;

  const title = computed(() => {
    if (route.query.type === 'add') {
      (formData.value.deptId = route.query.deptId as string),
        getPostData(route.query.deptId as string);
      return '新增';
    }
    getDetail();

    return '编辑';
  });

  const goBack = () => {
    form.value.resetFields();
    router.back();
  };

  const userStore = useUserStore();

  // --------------------- 前置数据 ------------------------------
  const deptData = ref<OrganizationTreeData[]>([]);
  let depatTree: OrganizationTreeData[] = [];

  const getDeptData = async () => {
    const { data } = await getOrganizationTreeAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    deptData.value = data;
    depatTree = cloneDeep(deptData.value);
  };

  getDeptData();

  const educationEnum = ref();

  const getEducationEnum = async () => {
    const { data } = await getEnumListAPI('EDUCATION');
    educationEnum.value = data;
  };
  getEducationEnum();

  // ------------- 树选择器 搜索 start------------

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

  const onDeptSearch = (searchKey: string) => {
    setTimeout(() => {
      deptData.value = searchData(searchKey);
    }, 200);
  };

  const clearSearchKey = () => {
    onDeptSearch('');
  };

  // --------------- 树选择器 搜索 end -------------

  const postData = ref<PostList[]>([]);
  const workTypeData = ref<WorkTypeList[]>([]);

  const getPostData = async (deptid?: string) => {
    const { data: res } = await getPostDataAllAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
      deptId: deptid,
    });
    postData.value = res;
  };

  const getWorkTypeData = async () => {
    const { data: res } = await getWorkTypeDataAllAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    workTypeData.value = res;
  };

  getWorkTypeData();

  // ------------------------ 表单 -------------------------------

  const formData = ref<AddStaffData>({
    incumbencyStatus: 1,
    enterpriseId: userStore.userInfo.enterpriseId as string,
    userName: '',
    deptId: '',
    jobId: '',
    jobNumber: '',
    tel: '',
    sex: 3,
  });
  const cloneForm = ref<any>({});
  const form = ref();

  const rules = ref({
    userName: [
      { required: true, message: '请输入员工姓名' },
      { maxLength: 25, message: '不能超过25字符' },
    ],
    deptId: [{ required: true, message: '请选择所属部门' }],
    // jobId: [{ required: true, message: '请选择员工岗位' }],
    jobNumber: [
      { message: '请输入员工工号' },
      { maxLength: 30, message: '不能超过30字符' },
    ],
    tel: [
      { required: true, message: '请输入手机号码' },
      { match: phoneRegExp, message: '请输入正确的手机号' },
    ],
    major: [{ maxLength: 20, message: '不能超过20字符' }],
    graduationSchool: [{ maxLength: 40, message: '不能超过40字符' }],
  });

  const getDetail = async () => {
    const { data: res } = await detailStaffDataAPI(
      route.query.id as string,
      userStore.userInfo.enterpriseId as string
    );
    formData.value = res;
    cloneForm.value = cloneDeep(res);
    await getPostData(res.deptId);
    formData.value.jobId = res.jobId;
  };

  const changeNameOrDept = ref(false);
  const changeFlag = (str: string) => {
    if (
      formData.value[str as keyof typeof formData.value] !==
      cloneForm.value[str]
    ) {
      changeNameOrDept.value = true;
    }
  };
  const helpText = ref('');
  const changeStaffName = async (name: string) => {
    const { data } = await validateUserNameAPI(name);
    if (data) {
      helpText.value = `${name}已存在`;
      form.value.setFields({
        userName: {
          status: 'warning',
        },
      });
    } else {
      helpText.value = '';
      form.value.validateField(['userName']);
    }
  };

  const submit = async () => {
    if (helpText.value) {
      form.value.setFields({
        userName: {
          status: 'warning',
        },
      });
    }
    // 没有userId说明没有绑定员工，或者没有修改员工姓名或者部门，直接提交
    if (!formData.value.userId || !changeNameOrDept.value) {
      const value = await form.value.validate();
      if (value) return;
      route.query.type === 'add' ? await addSubmit() : await editSubmit();
      goBack();
      return;
    }
    if (changeNameOrDept.value) {
      Modal.open({
        title: '提示',
        content: () =>
          h(ConfirmModalBody, {
            content: '关联用户的姓名/所属部门将同步修改，是否确认修改？',
            info: '',
          }),
        titleAlign: 'start',
        onOk: async () => {
          const value = await form.value.validate();
          if (value) return;
          route.query.type === 'add' ? await addSubmit() : await editSubmit();
          goBack();
        },
      });
    }
  };

  const addSubmit = async () => {
    await addStaffDataAPI(formData.value);
    // console.log('新增安全部门res:'), res;
    Message.success({
      content: '新增成功',
    });
  };

  const editSubmit = async () => {
    await uploadStaffDataAPI(formData.value);
    Message.success({
      content: '编辑成功',
    });
  };
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
    .form {
      min-height: calc(100vh - 265px);
      margin-bottom: 20px;
      margin-left: 26px;

      .title {
        margin: 30px 0 20px;
        font-family: 'Alibaba-Medium';
        font-size: 16px;
        font-weight: 500;
        .arco-divider-vertical {
          margin-right: 2px;
          border-left: 1px solid #409eff;
        }
      }

      .content {
        display: flex;
        flex-direction: column;
        align-items: center;
        // 联系人 两列布局
        .arco-row {
          .arco-form-item {
            width: 100%;
          }
        }
        // 普通布局
        .arco-form-item {
          .arco-form-item-wrapper-col {
            .arco-form-item-extra {
              width: 100%;
              margin-top: 10px;
            }
          }
        }
        .icon {
          margin-right: 6px;
        }
      }

      .arco-form-item {
        width: 70%;
        // margin: 10px 50px;
        &.double-width {
          width: calc((100% / 3 - 100px) * 2 + 100px);
        }
        .arco-input-prepend {
          color: #aeb2c2;
        }
      }
      .form-item-space {
        margin-top: 14px;
        .icon {
          margin-right: 8px;
        }
      }
    }
  }

  .btn {
    margin-top: 12px;
    width: 100%;
    text-align: center;
  }

  .arco-drawer {
    .arco-drawer-body {
      .header {
        .input {
          .arco-select-view-single {
            width: auto;
          }
        }
      }
    }
  }
</style>
