<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" />
        <span class="title">{{ title }}企业证照</span>
      </div>

      <div v-if="route.query.type !== 'view'" class="form">
        <a-form
          ref="form"
          :model="formData"
          :rules="rules"
          :label-col-props="{ span: 4 }"
        >
          <div class="content">
            <a-form-item field="type" label="证照类型" required>
              <a-select
                v-model:model-value="formData.type"
                :disabled="disabled || route.query.type === 'edit'"
                allow-search
                allow-clear
                :fallback-option="false"
                placeholder="请选择证照类型"
              >
                <a-option
                  v-for="(value, key) of enterpriseTypeMenu"
                  :value="+key"
                >
                  {{ value }}
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="cardName" label="证照名称" required>
              <a-input
                v-model.trim="formData.cardName"
                :disabled="disabled || route.query.type === 'edit'"
                allow-clear
                placeholder="请输入证照名称"
              ></a-input>
            </a-form-item>
            <a-form-item field="cardNo" label="证照号码" required>
              <a-input
                v-model.trim="formData.cardNo"
                :disabled="disabled || route.query.type === 'edit'"
                allow-clear
                placeholder="请输入证照号码"
              ></a-input>
            </a-form-item>
            <a-form-item
              required
              field="dutyEmployeeId"
              label="证照负责人"
              :content-flex="false"
              :merge-props="false"
            >
              <a-row>
                <a-col :span="12">
                  <a-form-item :wrapper-col-props="{ span: 23 }">
                    <a-select
                      v-model:model-value="formData.dutyEmployeeId"
                      :disabled="disabled"
                      :fallback-option="false"
                      :options="staffData"
                      allow-clear
                      allow-search
                      placeholder="请选择证照负责人"
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
                  <a-form-item field="" :wrapper-col-props="{ span: 24 }">
                    <a-input
                      v-model:model-value="formData.tel"
                      disabled
                      placeholder="手机号码"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item field="cardAuthority" label="证照颁发机构">
              <a-input
                v-model.trim="formData.cardAuthority"
                :disabled="disabled || route.query.type === 'edit'"
                allow-clear
                placeholder="请输入证照颁发机构"
              ></a-input>
            </a-form-item>
            <a-form-item field="effectiveTime" label="有效日期" required>
              <a-range-picker
                v-model:model-value="formData.effectiveTime"
                :disabled="disabled || route.query.type === 'edit'"
                format="YYYY-MM-DD"
                :placeholder="['有效开始日期', '有效截止日期']"
              >
              </a-range-picker>
            </a-form-item>
            <a-form-item field="nextReviewDate" label="下次复审日期" required>
              <a-date-picker
                v-model:model-value="formData.nextReviewDate"
                :disabled="disabled || route.query.type === 'edit'"
                format="YYYY-MM-DD"
                placeholder="请选择复审日期"
              ></a-date-picker>
            </a-form-item>
            <a-form-item field="attachmentList" label="附件" required>
              <a-space v-if="!(disabled || route.query.type === 'edit')">
                <a-upload
                  v-model:file-list="formData.attachmentList"
                  :disabled="disabled || route.query.type === 'edit'"
                  action=""
                  :custom-request="customRequest"
                  accept="image/*"
                  :limit="1"
                  :show-remove-button="
                    !(disabled || route.query.type === 'edit')
                  "
                  @before-upload="(e) => beforeUpload(e, 'image/*')"
                  @success="(e: FileItem) => uploadPicSuccess(e)"
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
            <a-form-item field="remark" label="描述">
              <a-textarea
                v-model.trim="formData.remark"
                :disabled="disabled"
                placeholder="请输入内容"
                :auto-size="{ maxRows: 6, minRows: 6 }"
                show-word-limit
                :max-length="300"
              ></a-textarea>
            </a-form-item>
          </div>
        </a-form>
      </div>
      <div v-else class="description">
        <div class="info">
          <a-row>
            <a-col :span="12" class="item-col">
              <div class="label">证照类型：</div>
              <div class="value">{{
                enterpriseTypeMenu[
                  formData.type as keyof typeof enterpriseTypeMenu
                ]
              }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">证照名称：</div>
              <div class="value">{{ formData.cardName }}</div>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12" class="item-col">
              <div class="label">证照号码：</div>
              <div class="value">{{ formData.cardNo }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">证照负责人：</div>
              <div class="value">{{
                staffData.find((item) => item.id === formData.dutyEmployeeId)
                  ?.userName
              }}</div>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12" class="item-col">
              <div class="label">手机号码：</div>
              <div class="value">{{ formData.tel }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">证照颁发机构：</div>
              <div class="value">{{ formData.cardAuthority }}</div>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12" class="item-col">
              <div class="label">有效时间：</div>
              <div class="value">{{
                formData.effectiveTime[0] + '至' + formData.effectiveTime[1]
              }}</div>
            </a-col>
            <a-col :span="12" class="item-col">
              <div class="label">下次复审时间：</div>
              <div class="value">{{ formData.nextReviewDate }}</div>
            </a-col>
          </a-row>
          <a-row>
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
              <div class="value">{{ formData.remark }}</div>
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
  import { ref, computed, h } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useUserStore } from '@/store';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { FileItem, Modal, Message } from '@arco-design/web-vue';
  import { UploadPath, getEnumListAPI } from '@/api/index';
  import {
    addEnterpriseCertificateAPI,
    detailEnterpriseCertificateAPI,
    updateEnterpriseCertificateAPI,
    getStaffDataAllAPI,
  } from '@/api/enterpriseManage';
  import type { EnterpriseCertificateBody } from '@/api/enterpriseManage';
  import type { StaffData } from '@/views/enterpriseManage/staffManage/index';
  import { useCustomUpload } from '@/hooks/customUpload';
  export default {
    name: 'EnterpriseCollectEdit',
  };
</script>

<script lang="ts" setup>
  const enterpriseTypeMenu = ref({});
  // 上传
  const { customRequest, beforeUpload } = useCustomUpload();

  const router = useRouter();
  const route = useRoute();

  const disabled = computed(() => route.query.type === 'view');
  const title = computed(() => {
    if (route.query.type === 'add') {
      return '新增';
    }
    if (route.query.type === 'edit') {
      getDetail();
      return '编辑';
    }
    getDetail();
    return '查看';
  });

  const goBack = () => {
    if (route.query.type !== 'view') {
      form.value.resetFields();
    }
    router.back();
  };

  const userStore = useUserStore();

  const enumList = async () => {
    const { data } = await getEnumListAPI('ENT_CERT_TYPE');
    enterpriseTypeMenu.value = data;
  };

  enumList();

  // ------------------------ 表单 -------------------------------

  const formData = ref<EnterpriseCertificateBody>({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    type: 0,
    cardName: '',
    effectiveTime: [],
    cardNo: '',
    dutyEmployeeId: '',
    effectiveEndDate: '',
    effectiveStartDate: '',
    attachmentList: [],
  });
  const staffData = ref<any[]>([]); // 员工列表
  const form = ref();

  const rules = ref({
    type: [
      {
        required: true,
        validator: (
          value: any | undefined,
          callback: (error?: string) => void
        ) => {
          if (!value) callback('请选择证照类型');
          callback();
        },
      },
    ],
    effectiveTime: [
      {
        required: true,
        message: '请选择有效日期',
      },
    ],
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
    dutyEmployeeId: [{ required: true, message: '请选择证照负责人' }],
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
  });

  const getStaffList = async () => {
    const { data: res } = await getStaffDataAllAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    staffData.value = res;
  };

  getStaffList();

  const getDetail = async () => {
    const { data: res } = await detailEnterpriseCertificateAPI({
      id: route.query.id as string,
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    formData.value = { ...formData.value, ...res };
    formData.value.attachmentList = res.attachmentList
      ? res.attachmentList
      : [];

    formData.value.effectiveTime.push(res.effectiveStartDate);
    formData.value.effectiveTime.push(res.effectiveEndDate);

    formData.value.attachmentList = formData.value.attachmentList.map(
      (item: string) => {
        return { url: item };
      }
    );
  };

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

  const dutyEmployeeIdChange = (
    value:
      | string
      | number
      | Record<string, any>
      | (string | number | Record<string, any>)[]
  ) => {
    formData.value.tel = staffData.value.find((item) => item.id === value)
      ?.tel as string;
    form.value.validateField('dutyEmployeeId');
  };

  const submit = async () => {
    formData.value.effectiveStartDate = formData.value.effectiveTime[0];
    formData.value.effectiveEndDate = formData.value.effectiveTime[1];
    console.log('表单数据', formData.value);

    const value = await form.value.validate();
    if (value) return;
    route.query.type === 'add' ? await addSubmit() : await editSubmit();
    goBack();
  };

  const addSubmit = async () => {
    await addEnterpriseCertificateAPI(formData.value);
    Message.success({
      content: '新增成功',
    });
  };

  const editSubmit = async () => {
    await updateEnterpriseCertificateAPI(formData.value);
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
            margin-bottom: 0;
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

  .upload-tip {
    color: #f59b22;
  }
  .description {
    height: 100%;
    width: 80%;
    margin: 0 auto;
    line-height: 2;
    .info {
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
  }
</style>
