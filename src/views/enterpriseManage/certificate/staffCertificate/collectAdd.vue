<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" />
        <span class="title">{{ title }}员工证照</span>
      </div>

      <div class="form" v-if="route.query.type !== 'view'">
        <a-form
          ref="form"
          :model="formData"
          :rules="rules"
          :label-col-props="{ span: 5 }"
        >
          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            人员信息
          </div>
          <a-row>
            <a-form-item field="employeeId" label="员工姓名" required>
              <a-select
                v-model:model-value="formData.employeeId"
                :disabled="type === 'edit' || disabled"
                :options="staffData"
                :fallback-option="false"
                allow-search
                allow-clear
                placeholder="请选择人员"
                :field-names="{
                  value: 'id',
                  label: 'userName',
                }"
                @change="employeeIdChange"
              >
              </a-select>
            </a-form-item>
            <a-form-item field="tel" label="手机号码">
              <a-input
                v-model:model-value="formData.tel"
                disabled
                placeholder="手机号码"
              ></a-input>
            </a-form-item>
            <a-form-item field="" label="所属部门" reqired>
              <a-input
                v-model:model-value="formData.deptName"
                disabled
                placeholder="员工所属部门"
              ></a-input>
            </a-form-item>
            <a-form-item field="jobName" label="岗位">
              <a-input
                v-model:model-value="formData.jobName"
                disabled
                placeholder="员工所在岗位"
              ></a-input>
            </a-form-item>
          </a-row>

          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            证照信息
          </div>
          <a-row>
            <a-form-item field="cardTypeCode" label="证照类型" required>
              <a-select
                v-model:model-value="formData.cardTypeCode"
                :disabled="type === 'edit' || disabled"
                :fallback-option="false"
                allow-clear
                allow-search
                placeholder="请选择证照类型"
              >
                <a-option v-for="(value, key) of staffTypeMenu" :value="key">
                  {{ value }}
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="cardName" label="证照名称" required>
              <a-input
                v-model.trim="formData.cardName"
                :disabled="type === 'edit' || disabled"
                placeholder="请输入证照名称"
                allow-clear
              ></a-input>
            </a-form-item>
            <a-form-item field="cardNo" label="证照号码" required>
              <a-input
                v-model.trim="formData.cardNo"
                :disabled="type === 'edit' || disabled"
                placeholder="请输入证照号码"
                allow-clear
              ></a-input>
            </a-form-item>
            <a-form-item field="cardAuthority" label="证照颁发机构">
              <a-input
                v-model.trim="formData.cardAuthority"
                :disabled="type === 'edit' || disabled"
                placeholder="请输入证照颁发机构"
                allow-clear
              ></a-input>
            </a-form-item>
            <a-form-item field="effectiveTime" label="有效日期" required>
              <a-range-picker
                v-model:model-value="formData.effectiveTime"
                :disabled="disabled || type === 'edit'"
                format="YYYY-MM-DD"
                :placeholder="['有效开始日期', '有效截止日期']"
              >
              </a-range-picker>
            </a-form-item>
            <a-form-item field="nextReviewDate" label="下次复审日期" required>
              <a-date-picker
                v-model:model-value="formData.nextReviewDate"
                :disabled="disabled || type === 'edit'"
                format="YYYY-MM-DD"
                placeholder="请选择复审日期"
              ></a-date-picker>
            </a-form-item>
            <a-form-item field="attachmentList" label="附件" required>
              <a-space v-if="!(disabled || route.query.type === 'edit')">
                <a-upload
                  v-model:file-list="formData.attachmentList"
                  :disabled="disabled || type === 'edit'"
                  action=""
                  :custom-request="customRequest"
                  accept="image/*"
                  :limit="1"
                  :show-remove-button="
                    !(disabled || route.query.type === 'edit')
                  "
                  @before-upload="(e) => beforeUpload(e, 'image/*')"
                  @success="(e:FileItem)=>uploadPicSuccess(e)"
                  @before-remove="beforeRemove"
                />
                <a-tooltip content="附件大小不能超过20M" position="right">
                  <icon-question-circle-fill class="upload-tip" />
                </a-tooltip>
              </a-space>
              <a-space v-else>
                <a
                  v-if="formData.attachmentList.length"
                  :href="formData.attachmentList[0].url"
                  target="_blank"
                >
                  <a-button type="text">点击查看附件</a-button></a
                >
                <div v-else>暂无附件</div>
              </a-space>
            </a-form-item>
            <a-form-item field="remarks" label="描述">
              <a-textarea
                v-model.trim="formData.remarks"
                :disabled="disabled"
                placeholder="请输入内容"
                :auto-size="{ maxRows: 6, minRows: 6 }"
                show-word-limit
                :max-length="300"
              ></a-textarea>
            </a-form-item>
          </a-row>
        </a-form>
      </div>
      <div class="description" v-else>
        <div class="person-info">
          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            人员信息
          </div>
          <a-row>
            <a-col :span="12" class="item-col">
              <div class="label">员工姓名：</div>
              <div class="value">{{ formData.employeeId }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">手机号码：</div>
              <div class="value">{{ formData.tel }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">所属部门：</div>
              <div class="value">{{ formData.deptName }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">岗位：</div>
              <div class="value">{{ formData.jobName }}</div>
            </a-col>
          </a-row>
        </div>
        <div class="certificate-info">
          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            证照信息
          </div>
          <a-row>
            <a-col :span="12" class="item-col">
              <div class="label">证照类型：</div>
              <div class="value">{{ formData.cardTypeCode }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">证照名称：</div>
              <div class="value">{{ formData.cardName }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">证照号码：</div>
              <div class="value">{{ formData.cardNo }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">证照颁发机构：</div>
              <div class="value">{{ formData.cardAuthority }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">有效日期：</div>
              <div class="value">{{
                formData.effectiveTime[0] + '至' + formData.effectiveTime[1]
              }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">下次复审日期：</div>
              <div class="value">{{ formData.nextReviewDate }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">附件：</div>
              <div class="value">
                <div v-if="formData.attachmentList.length > 0" class="value">
                  <a :href="formData.attachmentList[0].url" target="_blank">
                    <a-button type="text">点击查看附件</a-button></a
                  >
                </div>
                <span v-else>暂无附件</span>
              </div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">描述：</div>
              <div class="value">{{ formData.remarks }}</div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="btn">
        <a-space v-if="route.query.type !== 'view'">
          <a-button @click="goBack">取消</a-button>
          <a-button type="primary" @click="submit">保存</a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
  import { storeToRefs } from 'pinia';
  import { ref, computed, h } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useEnterpriseStore, useUserStore } from '@/store';
  import { FileItem, Modal, Message } from '@arco-design/web-vue';
  import ConfirmModalBody from '@/components/confirm/index.vue';

  import { UploadPath, getEnumListAPI } from '@/api/index';
  import {
    addStaffCertificateAPI,
    detailStaffCertificateAPI,
    updateStaffCertificateAPI,
    getStaffDataAllAPI,
  } from '@/api/enterpriseManage';
  import type { StaffCertificateBody } from '@/api/enterpriseManage';
  import type { StaffData } from '@/views/enterpriseManage/staffManage/index';
  import { phoneRegExp } from '@/utils';
  import { useCustomUpload } from '@/hooks/customUpload';
  export default {
    name: 'StaffCollectAdd',
  };
</script>

<script lang="ts" setup>
  // 上传
  const { customRequest, beforeUpload } = useCustomUpload();

  const router = useRouter();
  const route = useRoute();
  const type = route.query.type;
  const disabled = computed(() => route.query.type === 'view');
  const title = computed(() => {
    if (route.query.type === 'add') {
      return '新增';
    }
    if (route.query.type === 'edit') {
      return '编辑';
    }
    return '查看';
  });

  const goBack = () => {
    if (route.query.type !== 'view') {
      form.value.resetFields();
    }
    router.back();
  };

  const userStore = useUserStore();
  const enterpriseStore = useEnterpriseStore();
  const { enterpriseInfo } = storeToRefs(enterpriseStore);

  const staffTypeMenu = ref();
  const enumList = async () => {
    const { data } = await getEnumListAPI('EMPLOYEE_CERT_TYPE');
    staffTypeMenu.value = data;
  };

  enumList();

  // ------------------------ 表单 -------------------------------
  const formData = ref<StaffCertificateBody>({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    cardTypeCode: '',
    effectiveTime: [],
    attachmentList: [],
    employeeId: route.query.employeeId as string,
    cardName: '',
    cardNo: '',
    nextReviewDate: '',
    effectiveEndDate: '',
    effectiveStartDate: '',
  });
  const staffData = ref<any[]>([]); // 员工列表
  const staffFlag = ref(false);
  const form = ref();

  const rules = ref({
    employeeId: [{ required: true, message: '请选择员工' }],
    tel: [{ match: phoneRegExp, message: '请输入正确的手机号' }],
    cardTypeCode: [{ required: true, message: '请选择证照类型' }],
    cardName: [
      { required: true, message: '请输入证照名称' },
      { maxLength: 20, message: '不能超过20个字符' },
    ],
    cardNo: [
      { required: true, message: '请输入证照号码' },
      { maxLength: 30, message: '不能超过30个字符' },
      {
        validator: (
          value: any | undefined,
          callback: (error?: string) => void
        ) => {
          const regExp = /^[A-Za-z0-9]+$/;
          if (!regExp.test(value))
            callback('证照号码只包含数字及英文字母大小写');
          callback();
        },
      },
    ],
    cardAuthority: [{ maxLength: 40, message: '不能超过40个字符' }],
    nextReviewDate: [
      {
        required: true,
        validator: (
          value: Date | undefined,
          callback: (error?: string) => void
        ) => {
          if (!value) {
            callback('请选择下次复审日期');
          } else {
            const now = new Date().setHours(0, 0, 0, 0);
            if (+new Date(value) < +now) {
              callback('下次复审日期不能小于当前日期');
            }
            callback();
          }
        },
      },
    ],
    attachmentList: [{ required: true, message: '请上传附件' }],
    effectiveTime: [{ required: true, message: '请选择证照有效期' }],
  });

  const getDataFn = async () => {
    await getStaffList();
    if (type !== 'add') {
      await getDetail();
      employeeIdChange(formData.value.employeeId);
    }
  };

  const getStaffList = async () => {
    const { data: res } = await getStaffDataAllAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    staffData.value = res;
    staffFlag.value = true;
  };

  const getDetail = async () => {
    const { data: res } = await detailStaffCertificateAPI({
      id: route.query.id as string,
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    formData.value = { ...formData.value, ...res };
    formData.value.attachmentList = res.attachmentList
      ? res.attachmentList
      : [];
    formData.value.effectiveTime[0] = res.effectiveStartDate;
    formData.value.effectiveTime[1] = res.effectiveEndDate;

    formData.value.attachmentList = formData.value.attachmentList.map(
      (item: string) => {
        return { url: item };
      }
    );
  };

  getDataFn();

  const uploadPicSuccess = (e: FileItem) => {
    const {
      response: { data, code, msg },
    } = e;

    if (code < 200) {
      formData.value.attachment = data[0].fileName;
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
            text: '附件',
            info: '删除数据不可恢复，请谨慎操作！',
          }),
        onOk: () => {
          formData.value.attachment = '';
          return resolve(true);
        },
        onCancel: () => reject('cancel'),
      });
    });
  };

  const employeeIdChange = (
    value:
      | string
      | number
      | Record<string, any>
      | (string | number | Record<string, any>)[]
  ) => {
    const item = staffData.value.find((item) => item.id === (value as string));
    // console.log('item', item);
    formData.value.tel = item?.tel;
    formData.value.deptName = item?.deptName || formData.value.deptName;
    formData.value.jobName = item?.jobName || formData.value.jobName;
  };

  const submit = async () => {
    formData.value.effectiveStartDate = formData.value.effectiveTime[0];
    formData.value.effectiveEndDate = formData.value.effectiveTime[1];
    const value = await form.value.validate();
    if (value) return;
    route.query.type === 'add' ? await addSubmit() : await editSubmit();
    goBack();
  };

  const addSubmit = async () => {
    await addStaffCertificateAPI(formData.value);
    Message.success({
      content: '新增成功',
    });
  };

  const editSubmit = async () => {
    await updateStaffCertificateAPI(formData.value);
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
    .title {
      margin: 30px 0 20px;
      .arco-divider-vertical {
        margin-right: 2px;
        border-left: 1px solid #409eff;
      }
    }
    .description {
      margin: 0 auto;
      line-height: 2;
      margin-left: 26px;
      .person-info,
      .certificate-info {
        :deep(.arco-row) {
          width: 80%;
          margin: 0 auto;
        }
        padding-right: 16px;
        .item-col {
          display: flex;
          .label {
            color: #999;
            font-size: 14px;
            text-align: right;
            width: 102px;
          }
          .value {
            color: var(--color-text-black);
            font-size: 14px;
            text-align: left;
            flex: 1;
            white-space: break-spaces;
            overflow-wrap: anywhere;
          }
        }
      }
      .person-info .title,
      .certificate-info .title {
        font-size: 16px;
        font-family: 'Alibaba-Medium';
        font-weight: 500;
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
      .arco-row {
        padding-right: 10px;
      }

      .arco-form-item {
        width: calc(100% / 2);

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
  .upload-tip {
    color: #f59b22;
  }
</style>
