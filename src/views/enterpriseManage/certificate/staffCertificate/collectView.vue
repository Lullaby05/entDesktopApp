<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">员工证照详情</span>
      </div>
      <div class="form">
        <div class="title"> 证照信息 </div>
        <div class="content">
          <a-row justify="center">
            <a-col :span="7" class="item-col">
              <div class="label">姓名：</div>
              <div class="value">{{ formData.employeeName }}</div>
            </a-col>
            <a-col :span="7" class="item-col">
              <div class="label">部门：</div>
              <div class="value">{{ formData.deptName }}</div>
            </a-col>
            <a-col :span="7" class="item-col">
              <div class="label">岗位：</div>
              <div class="value">{{ formData.jobName }}</div>
            </a-col>
          </a-row>
          <a-row justify="center">
            <a-col :span="7" class="item-col">
              <div class="label">证照类型：</div>
              <div class="value">{{
                staffTypeMenu[
                  formData.cardTypeCode as keyof typeof staffTypeMenu
                ]
              }}</div>
            </a-col>
            <a-col :span="7" class="item-col">
              <div class="label">证照名称：</div>
              <div class="value">{{ formData.cardName }}</div>
            </a-col>
            <a-col :span="7" class="item-col">
              <div class="label">证照号码：</div>
              <div class="value">{{ formData.cardNo }}</div>
            </a-col>
          </a-row>
          <a-row justify="center">
            <a-col :span="7" class="item-col">
              <div class="label">有效日期：</div>
              <div class="value"
                >{{ formData.effectiveStartDate }} 至
                {{ formData.effectiveEndDate }}</div
              >
            </a-col>
            <a-col :span="7" class="item-col">
              <div class="label">下次复审日期：</div>
              <div class="value">{{ formData.nextReviewDate }}</div>
            </a-col>
            <a-col :span="7" class="item-col">
              <div class="label">附件：</div>
              <div v-if="img" class="value">
                <a :href="img" target="_blank">
                  <a-button type="text" style="height: 21px"
                    >点击查看附件</a-button
                  ></a
                >
              </div>
              <div v-else class="value">暂无附件</div>
            </a-col>
          </a-row>
        </div>

        <div class="title"> 证照复审记录 </div>
        <div style="display: flex; justify-content: center; margin-left: -20px">
          <a-table
            style="width: 80%"
            :data="examineRecord"
            row-key="id"
            :columns="columns"
            :bordered="false"
            :pagination="false"
          >
            <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
            <template #reviewResult="{ record }">
              {{ record.reviewResult === '1' ? '合格' : '不合格' }}
            </template>
            <template #attachment="{ record }">
              <a
                v-if="record.attachment"
                :href="record.attachmentList[0]"
                target="_blank"
              >
                <a-button type="text">查看</a-button>
              </a>
              <span v-else> 无 </span>
            </template>
          </a-table>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
  import { storeToRefs } from 'pinia';
  import { ref } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useEnterpriseStore, useUserStore } from '@/store';
  import {
    getStaffExamineListAPI,
    detailStaffCertificateAPI,
  } from '@/api/enterpriseManage';
  import { getEnumListAPI } from '@/api/index';
  import type { StaffCetificateList } from '@/views/enterpriseManage/certificate/index';
  import type { StaffCertificateBody } from '@/api/enterpriseManage';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  export default {
    name: 'StaffCollectView',
  };
</script>

<script lang="ts" setup>
  const route = useRoute();
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const attachment = ref(null);

  const userStore = useUserStore();

  const staffTypeMenu = ref({});
  const enumList = async () => {
    const { data } = await getEnumListAPI('EMPLOYEE_CERT_TYPE');
    staffTypeMenu.value = data;
  };

  enumList();

  // ------------------------ 数据 -------------------------------
  const formData = ref<StaffCertificateBody>({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    cardTypeCode: '',
    employeeId: '',
    effectiveTime: [],
    attachmentList: [],
    cardName: '',
    cardNo: '',
    nextReviewDate: '',
    effectiveEndDate: '',
    effectiveStartDate: '',
  });
  const img = ref('');

  const examineRecord = ref<StaffCetificateList[]>([]);
  const columns: TableColumnData[] = [
    {
      title: '序号',
      width: 60,
      slotName: 'number',
    },
    {
      title: '复审时间',
      dataIndex: 'reviewDate',
      width: 110,
    },
    {
      title: '复审结果',
      slotName: 'reviewResult',
      dataIndex: 'reviewResult',
      width: 90,
    },
    {
      title: '附件',
      align: 'center',
      slotName: 'attachment',
      dataIndex: 'attachment',
      width: 90,
    },
    {
      title: '有效开始日期',
      dataIndex: 'effectiveStartDate',
      width: 120,
    },
    {
      title: '有效截止日期',
      dataIndex: 'effectiveEndDate',
      width: 120,
    },
    {
      title: '下次复审日期',
      dataIndex: 'nextReviewDate',
      width: 120,
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];

  const getExamineRecord = async () => {
    const { data: res } = await getStaffExamineListAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
      licenseId: route.query.id as string,
    });
    examineRecord.value = res;
  };

  getExamineRecord();

  const getDetail = async () => {
    const { data: res } = await detailStaffCertificateAPI({
      id: route.query.id as string,
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });

    formData.value = res;
    img.value = res.attachmentList && res.attachmentList[0];
  };

  getDetail();
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
      // width: 100%;
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
        justify-content: space-evenly;
        width: 100%;
        line-height: 2;
        .arco-row {
          width: 100%;
        }
        .item-col {
          display: flex;
          .label {
            color: #999;
            font-size: 14px;
            text-align: right;
            width: 120px;
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
          }
        }
        .specil-row {
          .item-col {
            .label {
              width: 200px;
            }
          }
        }
      }
    }
  }
  .arco-card.btn-card {
    height: 66px;
    margin-top: 4px;
    padding-right: 40px;

    .btn {
      width: 100%;
      text-align: right;
    }
  }
</style>
