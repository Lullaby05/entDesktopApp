<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">{{ title }}</span>
      </div>
      <div class="form" v-if="!disabled">
        <a-form ref="form" :model="formData" :rules="rules">
          <a-form-item field="planTitle" label="计划名称" required>
            <a-input
              v-model.trim="formData.planTitle"
              :disabled="disabled"
              allow-clear
              placeholder="请输入计划名称"
            ></a-input>
          </a-form-item>
          <a-form-item field="planObject" label="参演对象" required>
            <a-input
              v-model.trim="formData.planObject"
              :disabled="disabled"
              allow-clear
              placeholder="请输入参演对象"
            ></a-input>
          </a-form-item>
          <a-form-item field="planTime" label="演练时间" required>
            <a-date-picker
              v-model="formData.planTime"
              show-time
              allow-clear
              :disabled="disabled"
              placeholder="请选择演练时间"
            ></a-date-picker>
          </a-form-item>
          <a-form-item field="planType" label="预案类型" required>
            <a-select
              v-model:model-value="formData.planType"
              placeholder="请选择预案类型"
              allow-clear
              allow-search
              :disabled="disabled"
            >
              <a-option v-for="(value, key) of planBType" :value="key">
                {{ value }}
              </a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="planProject" label="演练项目">
            <a-input
              v-model.trim="formData.planProject"
              :disabled="disabled"
              allow-clear
              placeholder="请输入演练项目"
            ></a-input>
          </a-form-item>
          <a-form-item field="planMode" label="演练方式">
            <a-input
              v-model.trim="formData.planMode"
              :disabled="disabled"
              allow-clear
              placeholder="请输入演练方式"
            ></a-input>
          </a-form-item>
          <a-form-item field="planPerson" label="组织人员">
            <a-input
              v-model.trim="formData.planPerson"
              :disabled="disabled"
              allow-clear
              placeholder="请输入组织人员"
            ></a-input>
            <!-- <a-select
              allow-clear
              allow-search
              :options="staffData"
              :disabled="disabled"
              :fallback-option="false"
              placeholder="请选择组织人员"
              :fieldNames="{
                value: 'id',
                label: 'userName',
              }"
              v-model:model-value="formData.planPerson"
            >
            </a-select> -->
          </a-form-item>
          <a-form-item field="principalDeptId" label="负责部门" required>
            <a-tree-select
              :fallback-option="false"
              v-model:model-value="formData.principalDeptId"
              placeholder="请选择负责部门"
              allow-search
              allow-clear
              :field-names="{
                key: 'id',
                title: 'name',
              }"
              :data="deptData"
              :disabled="disabled"
              :disable-filter="true"
              @change="
                () => {
                  formData.principalUserId = '';
                }
              "
              @search="onDeptSearch"
              @blur="clearSearchKey"
              @clear="clearSearchKey"
            ></a-tree-select>
          </a-form-item>
          <a-form-item field="principalUserId" label="负责人" required>
            <a-select
              v-model:model-value="formData.principalUserId"
              allow-clear
              allow-search
              :disabled="disabled"
              :options="staffDataMap.get(formData.principalDeptId)"
              :fallback-option="false"
              placeholder="请选择负责人"
              :field-names="{
                value: 'id',
                label: 'userName',
              }"
            >
            </a-select>
          </a-form-item>
          <a-form-item field="agreement" label="附件">
            <a-space>
              <a-upload
                v-model:file-list="formData.agreementList"
                action=""
                :custom-request="customRequest"
                :disabled="disabled"
                :show-remove-button="!disabled"
                multiple
                accept=".doc,.docx,.pdf"
                :limit="5"
                @before-upload="(e) => beforeUpload(e, '.doc,.docx,.pdf')"
                @success="uploadPicSuccess"
                @before-remove="beforeRemove"
              >
              </a-upload>
            </a-space>
          </a-form-item>
          <a-form-item field="remark" label="备注">
            <a-textarea
              v-model.trim="formData.remark"
              :max-length="300"
              :auto-size="{
                minRows: 6,
                maxRows: 6,
              }"
              show-word-limit
              placeholder="请输入内容"
              :disabled="disabled"
            ></a-textarea>
          </a-form-item>
        </a-form>
      </div>
      <div v-else class="description">
        <div class="info">
          <a-row :gutter="[0, 20]">
            <a-col :span="12" class="item-col">
              <div class="label">计划名称：</div>
              <div class="value">{{ formData.planTitle }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">参演对象：</div>
              <div class="value">{{ formData.planObject }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="[0, 20]">
            <a-col :span="12" class="item-col">
              <div class="label">演练时间：</div>
              <div class="value">{{ formData.planTime }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">预案类型：</div>
              <div class="value">{{
                format(formData.planType, planBType)
              }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="[0, 20]">
            <a-col :span="12" class="item-col">
              <div class="label">演练项目：</div>
              <div class="value">{{ formData.planProject }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">演练方式：</div>
              <div class="value">{{ formData.planMode }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="[0, 20]">
            <a-col :span="12" class="item-col">
              <div class="label">组织人员：</div>
              <div class="value">{{ formData.planPerson }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">负责部门：</div>
              <div class="value">{{
                searchNameById(formData.principalDeptId, deptData)
              }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="[0, 20]">
            <a-col :span="12" class="item-col">
              <div class="label">负责人：</div>
              <div class="value">{{
                staffData.find(
                  (item: any) => item.id === formData.principalUserId
                )?.userName
              }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">备注：</div>
              <div class="value">{{ formData.remark }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="[0, 20]">
            <a-col :span="12" class="item-col">
              <div class="label">附件：</div>
              <div class="value">
                <a-upload
                  v-if="formData.agreementList.length > 0"
                  v-model:file-list="formData.agreementList"
                  action=""
                  :custom-request="customRequest"
                  :disabled="disabled"
                  :show-upload-button="!disabled"
                  multiple
                  accept=".doc,.docx,.pdf"
                  :limit="5"
                  :show-remove-button="!disabled"
                >
                </a-upload>
                <span v-else>暂无附件</span>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="btn">
        <a-space v-if="!disabled">
          <a-button @click="goBack">取消</a-button>
          <a-button type="primary" @click="submit"> 保存 </a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
  import { ref, computed, h } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from '@/store';
  import { cloneDeep } from 'lodash';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { Message, Modal } from '@arco-design/web-vue';
  import { getEnumListAPI } from '@/api/index';
  import {
    getStaffDataAllAPI,
    getOrganizationTreeAPI,
    getStaffDataMapAll,
  } from '@/api/enterpriseManage';
  import {
    addExercisePlanItemAPI,
    detailExercisePlanItemAPI,
    updateExercisePlanItemAPI,
  } from '@/api/emergency';

  import type { AddExercisePlanItemData } from '@/api/emergency';
  import type { StaffItem } from '@/views/enterpriseManage/staffManage/index';
  import type { OrganizationTreeData } from '@/store/modules/enterprise/types';
  import type { FileItem } from '@arco-design/web-vue';
  import { useCustomUpload } from '@/hooks/customUpload';
  export default {
    name: 'ExercisePlanAdd',
  };
</script>

<script lang="ts" setup>
  // 上传
  const { customRequest, beforeUpload } = useCustomUpload();

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const title = computed(() => {
    if (route.query.type === 'add') return '新增演练计划';
    if (route.query.type === 'edit') {
      getDetail();
      return '编辑演练计划';
    }
    getDetail();
    return '查看演练计划';
  });
  const disabled = computed(() => route.query.type === 'view');
  const goBack = () => {
    router.back();
  };
  // ----------------------- 前置数据 --------------------------
  const planBType = ref<any>();

  const getPlanBType = async () => {
    const { data } = await getEnumListAPI('EMANAGEMENT_TYPE');
    planBType.value = data;
  };

  getPlanBType();

  const staffData = ref<StaffItem[]>([]);

  const staffDataMap = ref<Map<string, StaffItem[]>>(new Map());

  const getStaffData = async () => {
    const { data: res } = await getStaffDataAllAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });

    const { data: resMap } = await getStaffDataMapAll({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });

    for (const key in resMap) {
      staffDataMap.value.set(key, resMap[key]);
    }

    staffData.value = res;
  };

  getStaffData();

  const deptData = ref<OrganizationTreeData[]>([]);
  let depatTree: OrganizationTreeData[] = [];

  const getDeptData = async () => {
    const { data } = await getOrganizationTreeAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    data;
    deptData.value = data;
    depatTree = cloneDeep(deptData.value);
  };

  getDeptData();

  function searchData(keyword: string, data: any[]) {
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

      return result;
    };

    return loop(data);
  }

  const onDeptSearch = (searchKey: string) => {
    setTimeout(() => {
      deptData.value = searchData(searchKey, depatTree);
    }, 200);
  };

  const clearSearchKey = () => {
    onDeptSearch('');
  };

  const format = (value: string, options: any) => {
    if (value) {
      return options[value];
    }
  };

  // 根据id在树形表里搜索对应名称
  function searchNameById(id: string, data: any[]) {
    let result = '';
    const loop = (data: any) => {
      data.forEach((item: any) => {
        if (item.id === id) {
          result = item.name;
        } else if (item.children) {
          result = loop(item.children);
        }
      });
      return result;
    };
    return loop(data);
  }
  // ----------------------- 表单 -----------------------------
  const formData = ref<AddExercisePlanItemData>({
    tenantId: userStore.tenantId as string,
    planTitle: '',
    planObject: '',
    planTime: '',
    planType: '',
    agreementList: [],
    principalDeptId: '',
    principalUserId: '',
  });
  const form = ref();

  const rules = ref({
    planTitle: [
      { required: true, message: '请输入计划名称' },
      { maxLength: 25, message: '不能超过25字符' },
    ],
    planObject: [
      { required: true, message: '请输入参演对象' },
      { maxLength: 100, message: '不能超过100字符' },
    ],
    planTime: [{ required: true, message: '请选择演练时间' }],
    planMode: [{ maxLength: 50, message: '不能超过50字符' }],
    planType: [{ required: true, message: '请选择预案类型' }],
    planProject: [{ maxLength: 50, message: '不能超过50字符' }],
    planPerson: [{ maxLength: 25, message: '不能超过25字符' }],
    principalDeptId: [{ required: true, message: '请选择负责部门' }],
    principalUserId: [{ required: true, message: '请选择负责人' }],
  });

  const getDetail = async () => {
    const { data: res } = await detailExercisePlanItemAPI({
      tenantId: userStore.tenantId as string,
      id: route.query.id as string,
    });
    formData.value = res;
    formData.value.agreementList =
      res.agreementList &&
      res.agreementList.map((item: any) => {
        const fileName = item.fileName.split('//')[0];
        return { name: fileName, url: item.fileUrl };
      });
  };

  const uploadPicSuccess = (e: FileItem) => {
    const {
      response: { data, code, msg },
    } = e;

    if (code < 200) {
      const arr = formData.value.agreement
        ? formData.value.agreement.split(',')
        : [];
      data.forEach((item: any) => {
        arr.push(item.fileName);
      });
      formData.value.agreement = arr.join(',');
    } else {
      Message.error('上传失败，原因为' + msg);
    }
  };

  const beforeRemove = (file: FileItem): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      Modal.open({
        title: '提示',
        titleAlign: 'start',
        content: () =>
          h(ConfirmModalBody, {
            text: '附件',
            info: '删除数据不可恢复，请谨慎操作！',
          }),
        onOk: () => {
          let arr = formData.value.agreement?.split(',');
          arr = arr?.filter((item: any) => item.split('//')[0] !== file.name);
          formData.value.agreement = arr?.join(',');
          return resolve(true);
        },
        onCancel: () => reject('cancel'),
      });
    });
  };

  const uploadPreview = (fileItem: FileItem) => {
    window.open(fileItem.response.data[0].filePath);
  };

  const submit = async () => {
    const value = await form.value.validate();
    if (value) return;

    route.query.type === 'add' ? await addSubmit() : await editSubmit();

    goBack();
  };

  const addSubmit = async () => {
    await addExercisePlanItemAPI(formData.value);
    Message.success('新增成功');
  };

  const editSubmit = async () => {
    await updateExercisePlanItemAPI(formData.value);
    Message.success('编辑成功');
  };
</script>

<style lang="less" scoped>
  .arco-card.content-card {
    // min-height: 96%;
    .header {
      font-size: 18px;
      // font-weight: 700;
      margin-bottom: 20px;
      .title {
        margin-left: 8px;
      }
    }
    .form {
      width: 80%;
      min-height: calc(100vh - 265px);
      margin-bottom: 20px;
      .upload-tip {
        color: #f59b22;
      }
    }
    .table {
      width: 100%;
    }
  }
  .description {
    height: 100%;
    width: 80%;
    margin: 0 auto;
    line-height: 28px;
    .info {
      padding-right: 16px;
      .item-col {
        display: flex;
        .label {
          color: #999;
          font-size: 14px;
          text-align: right;
          width: 140px;
        }
        .value {
          flex: 1;
          color: var(--color-text-black);
          font-size: 14px;
          text-align: left;
          img {
            width: 80px;
            height: 80px;
          }
          :deep(
              .arco-upload-list.arco-upload-list-type-text
                .arco-upload-list-item:first-of-type
            ) {
            margin-top: 0;
          }
        }
      }
    }
  }

  .btn {
    margin-top: 12px;
    width: 100%;
    text-align: center;
  }

  .upload-tip {
    color: #f59b22;
  }
</style>
