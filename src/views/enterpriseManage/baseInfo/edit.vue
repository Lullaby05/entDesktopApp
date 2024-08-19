<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">{{
          $t('enterprise.editBusinessInformation')
        }}</span>
      </div>
      <div class="form">
        <a-form ref="form" :model="formData" layout="vertical" :rules="rules">
          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            {{ $t('enterprise.baseInfo.title') }}
          </div>
          <a-row>
            <a-form-item
              field="companyName"
              :label="$t('enterprise.enterpriseName')"
            >
              <a-input v-model="formData.companyName" disabled></a-input>
            </a-form-item>
            <a-form-item
              field="socialcreditCode"
              :label="$t('enterprise.unifiedSocialCreditCode')"
            >
              <a-input v-model="formData.socialcreditCode" disabled></a-input>
            </a-form-item>
            <a-form-item
              field="establishmentDate"
              :label="$t('enterprise.establishmentDate')"
            >
              <a-input v-model="formData.establishmentDate" disabled></a-input>
            </a-form-item>
            <a-form-item
              field="registeredAddress"
              :label="$t('enterprise.registerAddress')"
            >
              <a-input v-model="formData.registeredAddress" disabled></a-input>
            </a-form-item>
            <a-form-item
              field="companyType"
              :label="$t('enterprise.enterpriseType')"
            >
              <!-- <a-input
                disabled
                v-if="formData.parentId === '-1'"
                :model-value="'{{ $t('enterprise.thereIsNo') }}'"
              ></a-input> -->
              <a-select
                v-model="formData.companyType"
                disabled
                :fallback-option="false"
              >
                <a-option v-for="(value, key) of companyTypeEnum" :value="key">
                  {{ value }}
                </a-option>
              </a-select>
            </a-form-item>
            <a-form-item
              field="companyArea"
              :label="$t('enterprise.companyArea')"
            >
              <a-input v-model="formData.companyArea" disabled></a-input>
              <!-- <a-cascader
                disabled
                :options="[]"
                default-value="{{ $t('enterprise.defaultAddress') }}"
                expand-trigger="hover"
                :placeholder=" $t('enterprise.pleaseSelectAddress') }}"
              /> -->
            </a-form-item>
            <a-form-item
              field="enterpriseAddress"
              :label="$t('enterprise.baseInfo.address')"
            >
              <a-input v-model="formData.enterpriseAddress" disabled></a-input>
            </a-form-item>
            <a-form-item
              field="belongGroup"
              :label="$t('enterprise.belongGroup')"
            >
              <a-input v-model="formData.belongGroup" disabled></a-input>
            </a-form-item>
            <a-form-item
              field="employeesNum"
              :label="$t('enterprise.baseInfo.employeesNum')"
            >
              <a-input v-model="formData.employeesNum" disabled></a-input>
            </a-form-item>
            <a-form-item
              field="industryInvolvedName"
              :label="$t('enterprise.industry')"
            >
              <a-input
                v-model="formData.industryInvolvedName"
                disabled
              ></a-input>
            </a-form-item>
            <a-form-item
              field="majorInvolvedName"
              :label="$t('enterprise.baseInfo.major')"
            >
              <a-input v-model="formData.majorInvolvedName" disabled></a-input>
            </a-form-item>
            <a-form-item
              field="smallMajorInvolvedName"
              :label="$t('enterprise.baseInfo.smallMajor')"
            >
              <a-input
                v-model="formData.smallMajorInvolvedName"
                disabled
              ></a-input>
            </a-form-item>
            <a-form-item
              field="logo"
              :label="$t('enterprise.enterprise') + 'LOGO'"
            >
              <a-upload
                v-model:file-list="formData.logoList"
                list-type="picture-card"
                :custom-request="customRequest"
                accept="image/*"
                :limit="1"
                image-preview
                @before-upload="(e) => beforeUpload(e, 'image/*')"
                @success="uploadLogoSuccess"
                @before-remove="(e:FileItem)=>beforeRemove(e, 'logo')"
              >
                <a-tooltip
                  :content="
                    $t('enterprise.onlyOneImageCanBeUploaded') +
                    '，' +
                    $t('enterprise.theSizeCannotExceed') +
                    '20M。'
                  "
                  position="right"
                >
                  <icon-question-circle-fill class="upload-tip" />
                </a-tooltip>
              </a-upload>
            </a-form-item>
            <a-form-item
              field="businessScope"
              :label="$t('enterprise.businessContent')"
              class="double-width"
            >
              <a-textarea
                v-model="formData.businessScope"
                disabled
                :auto-size="{ maxRows: 6, minRows: 4 }"
                :max-length="300"
                show-word-limit
              ></a-textarea>
            </a-form-item>
          </a-row>

          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            {{ $t('enterprise.contact.title') }}
          </div>
          <a-row>
            <a-form-item
              field="safeMainPerson"
              :label="$t('enterprise.safetyFirstResponsiblePerson')"
            >
              <a-input
                v-model="formData.safeMainPerson"
                placeholder="请输入安全第一责任人"
                allow-clear
              ></a-input>
            </a-form-item>
            <a-form-item
              field="safeMainPersonTel"
              :label="$t('enterprise.contact.safeMainPersonTel')"
            >
              <a-input
                v-model.trim="formData.safeMainPersonTel"
                :placeholder="$t('enterprise.pleaseInputPhone')"
                allow-clear
              ></a-input>
            </a-form-item>
            <a-form-item
              field="position"
              :label="$t('enterprise.currentPosition')"
            >
              <a-input
                v-model.trim="formData.position"
                :placeholder="$t('enterprise.pleaseInputPosition')"
                allow-clear
              ></a-input>
            </a-form-item>
            <a-form-item
              field="contacts"
              :label="$t('enterprise.contact.contacts')"
            >
              <a-input
                v-model="formData.contacts"
                :placeholder="'请输入' + $t('enterprise.contact.contacts')"
                allow-clear
              ></a-input>
            </a-form-item>
            <a-form-item
              field="contactsTel"
              :label="$t('enterprise.contact.safeMainPersonTel')"
            >
              <a-input
                v-model.trim="formData.contactsTel"
                allow-clear
                :placeholder="
                  '请输入' + $t('enterprise.contact.safeMainPersonTel')
                "
              ></a-input>
            </a-form-item>
            <a-form-item
              field="contactsPosition"
              :label="$t('enterprise.currentPosition')"
            >
              <a-input
                v-model.trim="formData.contactsPosition"
                allow-clear
                :placeholder="$t('enterprise.pleaseInputPosition')"
              ></a-input>
            </a-form-item>
            <a-form-item field="fax" :label="$t('enterprise.baseInfo.fax')">
              <a-input
                v-model.trim="formData.fax"
                allow-clear
                :placeholder="'请输入' + $t('enterprise.baseInfo.fax')"
              ></a-input>
            </a-form-item>
            <a-form-item
              field="officialUrl"
              :label="$t('enterprise.baseInfo.officialUrl')"
            >
              <a-input
                v-model.trim="formData.officialUrl"
                allow-clear
                :placeholder="'请输入' + $t('enterprise.baseInfo.officialUrl')"
              >
                <template #prepend> https:// </template>
              </a-input>
            </a-form-item>
          </a-row>

          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            {{ $t('enterprise.safetyInformation') }}
          </div>
          <a-row>
            <a-form-item
              field="planFlag"
              :label="$t('enterprise.safety.planFlag')"
            >
              <a-select
                v-model:model-value="formData.planFlag"
                :placeholder="$t('enterprise.pleaseSelect')"
                :fallback-option="false"
                allow-clear
              >
                <a-option :value="1">{{ $t('common.yes') }}</a-option>
                <a-option :value="0">{{ $t('common.no') }}</a-option>
              </a-select>
            </a-form-item>
            <a-form-item
              field="threeSimultaneousFlag"
              :label="$t('enterprise.whetherThreeSimultaneousDataIsAvailable')"
            >
              <a-select
                v-model:model-value="formData.threeSimultaneousFlag"
                :fallback-option="false"
                :placeholder="$t('enterprise.pleaseSelect')"
                allow-clear
              >
                <a-option :value="1">{{ $t('common.yes') }}</a-option>
                <a-option :value="0">{{ $t('common.no') }}</a-option>
              </a-select>
            </a-form-item>
            <a-form-item
              field="safetyProductionFlag"
              :label="
                $t(
                  'enterprise.whetherToCarryOutSafetyProductionStandardizationConstruction'
                )
              "
            >
              <a-select
                v-model:model-value="formData.safetyProductionFlag"
                :fallback-option="false"
                :placeholder="$t('enterprise.pleaseSelect')"
                allow-clear
              >
                <a-option :value="1">{{ $t('common.yes') }}</a-option>
                <a-option :value="0">{{ $t('common.no') }}</a-option>
              </a-select>
            </a-form-item>
            <a-form-item
              field="safeRegulator"
              :label="$t('enterprise.safety.safeRegulator')"
            >
              <a-input
                v-model.trim="formData.safeRegulator"
                allow-clear
                :placeholder="$t('enterprise.pleaseEnterTheSecuritySupervisor')"
              ></a-input>
            </a-form-item>
            <a-form-item
              field="safeRegulatorPerson"
              :label="$t('enterprise.safetySupervisor')"
            >
              <a-input
                v-model.trim="formData.safeRegulatorPerson"
                allow-clear
                :placeholder="$t('enterprise.pleaseEnterTheSecuritySupervisor')"
              ></a-input>
            </a-form-item>
            <a-form-item
              field="safeRegulatorTel"
              :label="$t('enterprise.contact.safeMainPersonTel')"
            >
              <a-input
                v-model.trim="formData.safeRegulatorTel"
                allow-clear
                :placeholder="
                  '请输入' + $t('enterprise.contact.safeMainPersonTel')
                "
              ></a-input>
            </a-form-item>
            <a-form-item
              field="communityInspector"
              :label="$t('enterprise.safety.communityInspector')"
            >
              <a-input
                v-model.trim="formData.communityInspector"
                allow-clear
                :placeholder="
                  '请输入' + $t('enterprise.safety.communityInspector')
                "
              ></a-input>
            </a-form-item>
            <a-form-item
              field="communityInspectorTel"
              :label="$t('enterprise.contact.safeMainPersonTel')"
            >
              <a-input
                v-model.trim="formData.communityInspectorTel"
                allow-clear
                :placeholder="
                  '请输入' + $t('enterprise.contact.safeMainPersonTel')
                "
              ></a-input>
            </a-form-item>
          </a-row>

          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            附件信息
          </div>
          <a-row>
            <a-form-item
              field="businessLicense"
              :label="$t('enterprise.attachment.businessLicense')"
            >
              <a-upload
                v-model:fileList="formData.businessLicenseList"
                disabled
                list-type="picture-card"
                action=""
                :custom-request="customRequest"
                :limit="1"
                image-preview
                accept="image/*"
                @before-upload="(e) => beforeUpload(e, 'image/*')"
              />
            </a-form-item>
            <a-form-item
              field="emergency"
              :label="$t('enterprise.attachment.enterpriseMap')"
            >
              <a-upload
                v-model:fileList="formData.emergencyList"
                list-type="picture-card"
                action=""
                :custom-request="customRequest"
                :limit="1"
                image-preview
                accept="image/*"
                @before-upload="(e) => beforeUpload(e, 'image/*')"
                @success="uploadPicSuccess"
                @before-remove="(e:FileItem)=>beforeRemove(e, 'emergency')"
              >
                <a-tooltip
                  :content="
                    $t('enterprise.onlyOneImageCanBeUploaded') +
                    '，' +
                    $t('enterprise.theSizeCannotExceed') +
                    '20M。'
                  "
                  position="right"
                >
                  <icon-question-circle-fill class="upload-tip" />
                </a-tooltip>
              </a-upload>
            </a-form-item>
            <a-form-item
              field="qualificationInfo"
              :label="$t('enterprise.qualificationInformation')"
            >
              <a-upload
                v-model:fileList="formData.qualificationInfoList"
                list-type="picture-card"
                action=""
                :custom-request="customRequest"
                :limit="9"
                image-preview
                accept="image/*"
                @before-upload="(e) => beforeUpload(e, 'image/*')"
                @success="uploadQualificationSuccess"
                @before-remove="(e:FileItem)=>beforeRemove(e, 'qualificationInfo')"
              >
                <a-tooltip
                  :content="
                    '只能上传九张图片，' +
                    $t('enterprise.theSizeCannotExceed') +
                    '20M。'
                  "
                  position="right"
                >
                  <icon-question-circle-fill class="upload-tip" />
                </a-tooltip>
              </a-upload>
            </a-form-item>
          </a-row>
        </a-form>
      </div>
      <div class="btn">
        <a-space>
          <a-button @click="goBack">{{ $t('common.cancel') }}</a-button>
          <a-button type="primary" @click="submit">{{
            $t('common.save')
          }}</a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
  import { phoneRegExp, faxRegExp } from '@/utils/index';
  import { storeToRefs } from 'pinia';
  import { ref, h } from 'vue';
  import { useRouter } from 'vue-router';
  import { useEnterpriseStore } from '@/store';
  import { Modal, Message } from '@arco-design/web-vue';
  import { cloneDeep } from 'lodash';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { getEnumListAPI } from '@/api/index';
  import {
    companyDetailByIdAPI,
    updatCompanyDetailAPI,
  } from '@/api/enterpriseManage';
  import type { UpdateCompanyDetailData } from '@/api/enterpriseManage';
  import type { FileItem } from '@arco-design/web-vue/es/upload/interfaces';
  import { useCustomUpload } from '@/hooks/customUpload';

  export default {
    name: 'EnterpriseBaseInfoEdit',
  };
</script>

<script lang="ts" setup>
  // 请求头？ 应该来自store
  // 上传
  const { customRequest, beforeUpload } = useCustomUpload();

  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const enterpriseStore = useEnterpriseStore();
  const { enterpriseInfo } = storeToRefs(enterpriseStore);

  // -------------------------- 前置数据 ----------------------

  const companyTypeEnum = ref<any>({});

  const getCompanyTypeEnum = async () => {
    const { data } = await getEnumListAPI('COMPANY_TYPE');
    companyTypeEnum.value = data;
  };

  getCompanyTypeEnum();

  // ------------------------ 表单 -------------------------------

  const formData = ref<UpdateCompanyDetailData & BaseInfo>({
    id: enterpriseInfo.value.id,
    businessLicenseList: [],
    emergencyList: [],
    logoList: [],
    qualificationInfoList: [],
  });

  interface BaseInfo {
    businessScope?: string;
    companyArea?: string;
    companyName?: string;
    companyType?: string;
    companyTypeName?: string;
    employeesNum?: string;
    enterpriseAddress?: string;
    establishmentDate?: string;
    industryInvolved?: string;
    industryInvolvedName?: string;
    logo?: string;
    logoList: [];
    majorInvolved?: string;
    majorInvolvedName?: string;
    parentName?: string;
    registeredAddress?: string;
    smallMajorInvolved?: string;
    smallMajorInvolvedName?: string;
    socialcreditCode?: string;
    status?: string;
    belongGroup?: string;
  }
  const baseInfo = ref<BaseInfo>({
    logoList: [],
  });

  const form = ref();

  const getDetail = async () => {
    const { data } = await companyDetailByIdAPI(enterpriseInfo.value.id);

    // 数据接收 赋值
    baseInfo.value = cloneDeep(data.baseInfo);
    const obj = {
      ...data.accessoryInfo,
      ...data.contactInfo,
      ...data.safeInfo,
      ...data.baseInfo,
    };
    for (const key in data) {
      if (typeof data[key] !== 'object') {
        obj[key] = data[key];
      }
    }
    obj.logo = baseInfo.value.logo;
    obj.logoList = baseInfo.value.logoList;

    // 处理数据类型
    obj.logoList = obj.logoList ? obj.logoList : [];
    obj.businessLicenseList = obj.businessLicenseList
      ? obj.businessLicenseList
      : [];
    obj.emergencyList = obj.emergencyList ? obj.emergencyList : [];

    obj.threeSimultaneousFlag = obj.threeSimultaneousFlag ? 1 : 0; // 三同时
    obj.safetyProductionFlag = obj.safetyProductionFlag ? 1 : 0; // 安全标准
    obj.planFlag = obj.planFlag ? 1 : 0; // 预案备案

    // 处理图片显示
    obj.logoList = obj.logoList.map((item: string) => {
      return {
        url: item,
      };
    });
    obj.businessLicenseList = obj.businessLicenseList.map((item: string) => {
      return { url: item };
    });
    obj.emergencyList = obj.emergencyList.map((item: string) => {
      return { url: item };
    });

    obj.qualificationInfoList = (obj.qualificationInfoList || []).map(
      (item: string) => {
        return { url: item };
      }
    );

    formData.value = obj;
  };

  getDetail();

  const rules = ref({
    companyName: [
      { required: true, message: '请输入企业名称' },
      { maxLength: 25, message: '不能超过25字符' },
    ],
    socialcreditCode: [
      {
        validator: (value: string, callback: Function) => {
          const reg = /^[0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}$/;
          if (value && !reg.test(value)) {
            callback('请输入正确的统一社会信用代码');
          } else {
            callback();
          }
        },
      },
    ],
    establishmentDate: [
      {
        validator: (value: string, callback: Function) => {
          if (value && +new Date(value) > +new Date()) {
            callback('不能选择当前日期之后的时间');
          } else {
            callback();
          }
        },
      },
    ],
    registeredAddress: [{ maxLength: 60, message: '不能超过60字符' }],
    companyArea: [{ maxLength: 60, message: '不能超过60字符' }],
    enterpriseAddress: [{ maxLength: 60, message: '不能超过60字符' }],
    belongGroup: [{ maxLength: 25, message: '不能超过25字符' }],
    safeMainPerson: [{ maxLength: 25, message: '不能超过25字符' }],
    safeMainPersonTel: [
      {
        validator: (value: string, callback: Function) => {
          if (value && !phoneRegExp.test(value)) {
            callback('请输入正确的手机号');
          } else {
            callback();
          }
        },
      },
    ],
    position: [{ maxLength: 20, message: '不能超过20字符' }],
    contactsPosition: [{ maxLength: 20, message: '不能超过20字符' }],
    officialUrl: [{ maxLength: 100, message: '不能超过100字符' }],
    fax: [
      {
        match: faxRegExp,
        message: '请输入正确的传真号码：区号-电话号码-分机号，分机号可以没有',
      },
    ],
    //  安全信息
    safeRegulator: [{ maxLength: 40, message: '不能超过40字符' }],
    safeRegulatorPerson: [{ maxLength: 25, message: '不能超过25字符' }],
    safeRegulatorTel: [
      {
        validator: (value: string, callback: Function) => {
          if (value && !phoneRegExp.test(value)) {
            callback('请输入正确的手机号');
          } else {
            callback();
          }
        },
      },
    ],
    communityInspector: [{ maxLength: 25, message: '不能超过25字符' }],
    communityInspectorTel: [
      {
        validator: (value: string, callback: Function) => {
          if (value && !phoneRegExp.test(value)) {
            callback('请输入正确的手机号');
          } else {
            callback();
          }
        },
      },
    ],
    // 联系方式
    contacts: [{ maxLength: 25, message: '不能超过25字符' }],
    contactsTel: [
      {
        validator: (value: string, callback: Function) => {
          if (value && !phoneRegExp.test(value)) {
            callback('请输入正确的手机号');
          } else {
            callback();
          }
        },
      },
    ],
  });

  // 附件上传
  const uploadLogoSuccess = (e: FileItem) => {
    const {
      response: { data, code, msg },
    } = e;

    if (code < 200) {
      console.log('model:', formData.value.logoList);

      formData.value.logo = data[0].fileName;
    } else {
      Message.error({
        content: '上传失败，原因为=' + msg,
      });
    }
  };

  const uploadPicSuccess = (e: FileItem) => {
    const {
      response: { data, code, msg },
    } = e;

    if (code < 200) {
      formData.value.emergency = data[0].fileName;
    } else {
      Message.error({
        content: '上传失败，原因为=' + msg,
      });
    }
  };

  const uploadQualificationSuccess = (e: FileItem) => {
    const { response } = e;

    if (response.code < 200) {
      formData.value.qualificationInfoList =
        formData.value.qualificationInfoList?.map((item: any) => {
          return {
            ...item,
            response,
          };
        });
      formData.value.qualificationInfo = formData.value.qualificationInfo
        ? formData.value.qualificationInfo + ',' + response.data[0].fileName
        : response.data[0].fileName;
    } else {
      Message.error({
        content: '上传失败，原因为=' + response.msg,
      });
    }
  };

  const beforeRemove = (
    file: FileItem,
    attribute: string
  ): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      Modal.open({
        title: '提示',
        titleAlign: 'start',
        content: () =>
          h(ConfirmModalBody, {
            info: '删除数据不可恢复，请谨慎操作！',
          }),
        onOk: () => {
          switch (attribute) {
            case 'logo':
              formData.value.logo = '';
              break;
            case 'emergency':
              formData.value.emergency = '';
              break;
            case 'qualificationInfo':
              const fileArr = formData.value.qualificationInfo
                ?.toString()
                .split(',');
              let delFileThumb = '';
              if (file.response) {
                delFileThumb =
                  file.response.data[0].filePath.match(/%2F%2F(.+?)\?/)[1];
              } else {
                delFileThumb = (file.url as any).match(/%2F%2F(.+?)\?/)[1];
              }
              formData.value.qualificationInfo = fileArr
                ?.filter((item: string) => item.split('//')[1] !== delFileThumb)
                .join(',');
              break;
            default:
              break;
          }

          return resolve(true);
        },
        onCancel: () => reject('cancel'),
      });
    });
  };

  const uploadPreview = (fileItem: FileItem) => {
    window.open(fileItem.url || fileItem.response.data[0].filePath);
  };

  const submit = async () => {
    const value = await form.value.validate();
    if (value) return;
    await updatCompanyDetailAPI(formData.value);
    Message.success({
      content: '编辑成功',
    });
    goBack();
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
      width: 100%;
      min-height: 400px;
      margin-bottom: 20px;
      .title {
        margin: 30px 0 20px;
        .arco-divider-vertical {
          margin-right: 2px;
          border-left: 1px solid #409eff;
        }
      }

      .arco-form-item {
        width: calc(100% / 3 - 100px);
        margin: 10px 50px;
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
</style>
