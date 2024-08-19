<!-- 企业管理--证照管理：员工证照复核 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
          <a-form-item field="cardName" label="证照名称">
            <a-input
              v-model.trim="tempSearchForm.cardName"
              placeholder="请输入证照名称"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="cardNo" label="证照号码">
            <a-input
              v-model.trim="tempSearchForm.cardNo"
              placeholder="请输入证照号码"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="cardTypeCode" label="证照类型">
            <a-select
              v-model:model-value="tempSearchForm.cardTypeCode"
              placeholder="请选择证照类型"
              allow-clear
              allow-search
            >
              <a-option v-for="(value, key) of staffTypeMenu" :value="key">
                {{ value }}
              </a-option>
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
                getStaffCertificateData();
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

      <template #minorBtn>
        <a-space>
          <icon-refresh class="minor-icon" size="20" @click="refresh" />
        </a-space>
      </template>

      <template #table>
        <a-spin :loading="loading" tip="数据加载中...">
          <a-table
            :data="enterpriseCetificateData.list"
            row-key="id"
            :columns="columns"
            :bordered="false"
            :pagination="false"
          >
            <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
            <template #cardTypeCode="{ record }">
              {{
                staffTypeMenu[record.cardTypeCode as keyof typeof staffTypeMenu]
              }}
            </template>
            <template #status="{ record }">
              <div style="color: rgb(var(--green-6))" v-if="record.status"
                >有效</div
              >
              <div style="color: red" v-if="!record.status">无效</div>
            </template>
            <template #option="{ record }">
              <a-button
                type="text"
                size="mini"
                @click="toEditPage('view', record.id)"
              >
                查看
              </a-button>
              <a-button
                v-permission="'staffExamineRecheck'"
                type="text"
                size="mini"
                @click="openModal(record.id)"
              >
                复核
              </a-button>
            </template>
          </a-table>
        </a-spin>
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
          :total="(enterpriseCetificateData.total as number)"
          @change="currentChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>

    <!-- 弹窗 -->
    <a-modal
      :visible="visible"
      :width="600"
      ok-text="保存"
      title-align="start"
      title="证照复核"
      @ok="submitModal"
      @cancel="closeModal"
    >
      <a-form ref="form" :model="formData" :rules="rules">
        <a-form-item field="effectiveTime" label="有效日期" required>
          <a-range-picker
            v-model:model-value="formData.effectiveTime"
            allow-clear
            format="YYYY-MM-DD"
            :placeholder="['有效开始日期', '有效截止日期']"
          >
          </a-range-picker>
        </a-form-item>
        <a-form-item field="reviewResult" label="复审结果" required>
          <a-radio-group v-model:model-value="formData.reviewResult">
            <a-radio :value="1">合格</a-radio>
            <a-radio :value="2">不合格</a-radio>
          </a-radio-group>
        </a-form-item>
        <a-form-item field="nextReviewDate" label="下次复审日期" required>
          <a-date-picker
            v-model:model-value="formData.nextReviewDate"
            format="YYYY-MM-DD"
            placeholder="请选择下次复审日期"
          ></a-date-picker>
        </a-form-item>
        <a-form-item field="attachment" label="附件">
          <a-space>
            <a-upload
              v-model:file-list="formData.attachmentList"
              list-type="picture-card"
              action=""
              :custom-request="customRequest"
              accept="image/*"
              image-preview
              :limit="1"
              @before-upload="(e) => beforeUpload(e, 'image/*')"
              @success="(e:FileItem)=>uploadPicSuccess(e)"
              @before-remove="beforeRemove"
            />
            <a-tooltip content="附件大小不能超过20M" position="right">
              <icon-question-circle-fill class="upload-tip" />
            </a-tooltip>
          </a-space>
        </a-form-item>
        <a-form-item field="remark" label="备注">
          <a-textarea
            v-model.trim="formData.remark"
            placeholder="请输入内容"
            :auto-size="{ maxRows: 6, minRows: 6 }"
            show-word-limit
            :max-length="300"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import dayjs from 'dayjs';
  import { ref, h } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useUserStore } from '@/store';
  import { FileItem, Modal, Message } from '@arco-design/web-vue';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { formatDate } from '@/utils/utils';
  import { UploadPath, getEnumListAPI } from '@/api/index';
  import {
    getStaffCertificateListAPI,
    detailStaffCertificateAPI,
    submitStaffExamineAPI,
  } from '@/api/enterpriseManage';
  import type { EnterpriseCetificateData } from '@/views/enterpriseManage/certificate/index';
  import type {
    GetStaffCertificateList,
    AddStaffExamineBody,
  } from '@/api/enterpriseManage';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { useCustomUpload } from '@/hooks/customUpload';
  export default {
    name: 'StaffExamine',
  };
</script>

<script lang="ts" setup>
  // 上传
  const { customRequest, beforeUpload } = useCustomUpload();

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();

  const staffTypeMenu = ref();
  const enumList = async () => {
    const { data } = await getEnumListAPI('EMPLOYEE_CERT_TYPE');
    staffTypeMenu.value = data;
  };

  enumList();
  // ----------------- 查询-------------------------------
  // 获取临期企业证书列表（临期--审核）
  const selectForm = ref<GetStaffCertificateList>({
    pageNo: 1,
    pageSize: 10,
    queryCondition: 5,
    enterpriseId: userStore.userInfo.enterpriseId as string,
  });
  const tempSearchForm = ref<GetStaffCertificateList>({
    pageNo: 1,
    pageSize: 10,
    queryCondition: 5,
    enterpriseId: userStore.userInfo.enterpriseId as string,
  });
  const selectFormDom = ref();

  const getStaffCertificateData = async () => {
    const { data: res } = await getStaffCertificateListAPI(selectForm.value);
    enterpriseCetificateData.value = res;
  };

  const resetSelectForm = () => {
    selectFormDom.value.resetFields();
    tempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
      queryCondition: 5,
      enterpriseId: userStore.userInfo.enterpriseId as string,
    };
    getStaffCertificateData();
  };

  // ----------------- table -------------------------

  const loading = ref(false);
  const enterpriseCetificateData = ref<EnterpriseCetificateData>({
    list: [],
    total: 0,
  });
  const columns: TableColumnData[] = [
    {
      title: '序号',
      width: 60,
      slotName: 'number',
    },
    {
      title: '姓名',
      width: 100,
      dataIndex: 'employeeName',
      cellStyle: { width: '8%' },
    },
    {
      title: '手机号码',
      dataIndex: 'tel',
    },
    {
      title: '证照名称',
      width: 100,
      dataIndex: 'cardName',
      cellStyle: { width: '8%' },
    },

    {
      title: '证照类型',
      slotName: 'cardTypeCode',
      dataIndex: 'cardTypeCode',
    },
    {
      title: '证照号码',
      dataIndex: 'cardNo',
    },
    {
      title: '是否有效',
      width: 100,
      slotName: 'status',
      dataIndex: 'status',
      cellStyle: { width: '8%' },
    },
    {
      title: '有效截止日期',
      dataIndex: 'effectiveEndDate',
    },
    {
      title: '下次复审日期',
      dataIndex: 'nextReviewDate',
    },

    {
      title: '操作',
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];

  getStaffCertificateData();

  const toEditPage = (type: string, id?: string) => {
    router.push({
      name: 'StaffCollectAdd',
      query: {
        id,
        type,
      },
    });
  };

  const refresh = async () => {
    // 加载效果
    loading.value = true;
    await getStaffCertificateData();
    loading.value = false;
  };

  // ------------------ 弹窗 ----------------------
  const visible = ref(false);
  const formData = ref<AddStaffExamineBody>({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    licenseId: '',
    nextReviewDate: '',
    reviewResult: 1,
    reviewDate: '',
    effectiveEndDate: '',
    effectiveStartDate: '',
    effectiveTime: [],
    attachmentList: [],
  });

  const form = ref();

  const rules = ref({
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
            if (+new Date(value) < +new Date()) {
              callback('下次复审日期不能小于当前日期');
            }
            callback();
          }
        },
      },
    ],
    reviewResult: [{ required: true, message: '请选择复审结果' }],
    effectiveTime: [{ required: true, message: '请选择证照有效期' }],
  });

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

  const openModal = async (id: string) => {
    visible.value = true;
    const { data: res } = await detailStaffCertificateAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
      id,
    });

    formData.value = { ...formData.value, ...res };
    formData.value.attachmentList = res.attachmentList
      ? res.attachmentList
      : [];
    formData.value.effectiveTime[0] = res.effectiveStartDate;
    formData.value.effectiveTime[1] = res.effectiveEndDate;

    formData.value.licenseId = id;
    formData.value.attachmentList = formData.value.attachmentList.map(
      (item: string) => {
        return { url: item };
      }
    );
  };

  const submitModal = async () => {
    formData.value.effectiveStartDate = formData.value.effectiveTime[0];
    formData.value.effectiveEndDate = formData.value.effectiveTime[1];
    formData.value.reviewDate = formatDate(new Date());
    await submitStaffExamineAPI(formData.value);
    Message.success({
      content: '提交成功！',
    });
    getStaffCertificateData();
    closeModal();
  };

  const closeModal = () => {
    form.value.resetFields();
    // console.log('reset', formData.value.effectiveTime);

    visible.value = false;
  };

  // ------------------ 分页 ----------------------
  const currentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getStaffCertificateData();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getStaffCertificateData();
  };
</script>

<style lang="less" scoped>
  .upload-tip {
    color: #f59b22;
  }
</style>
