<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">企业证照详情</span>
      </div>
      <div class="form">
        <div class="title"> 证照信息 </div>
        <div class="content">
          <a-row justify="center">
            <a-col :span="7" class="item-col">
              <div class="label">证照类型：</div>
              <div class="value">{{
                enterpriseTypeMenu[
                  formData.type as keyof typeof enterpriseTypeMenu
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
              <div class="label">证照负责人：</div>
              <div class="value">{{ formData.employeeName }}</div>
            </a-col>
            <a-col :span="7" class="item-col">
              <div class="label">手机号码：</div>
              <div class="value">{{ formData.tel }}</div>
            </a-col>
            <a-col :span="7" class="item-col">
              <div class="label">发证部门：</div>
              <div class="value">{{ formData.cardAuthority }}</div>
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
  import type { EnterpriseCetificateList } from '@/views/enterpriseManage/certificate/index';
  import {
    getEnterpriseExamineListAPI,
    detailEnterpriseCertificateAPI,
  } from '@/api/enterpriseManage';
  import type { EnterpriseCertificateBody } from '@/api/enterpriseManage';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { getEnumListAPI } from '@/api/index';
  export default {
    // name: 'EnterpriseCollectView',
  };
</script>

<script lang="ts" setup>
  const enterpriseTypeMenu = ref({});
  const route = useRoute();
  const router = useRouter();

  const goBack = () => {
    router.back();
  };

  const userStore = useUserStore();

  const enumList = async () => {
    const { data } = await getEnumListAPI('ENT_CERT_TYPE');
    enterpriseTypeMenu.value = data;
  };

  enumList();

  // ------------------------ 数据 -------------------------------
  const formData = ref<EnterpriseCertificateBody>({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    type: 0,
    cardName: '',
    cardNo: '',
    effectiveTime: [],
    dutyEmployeeId: '',
    attachmentList: [],
    effectiveEndDate: '',
    effectiveStartDate: '',
  });
  const img = ref<string>('');
  const examineRecord = ref<EnterpriseCetificateList[]>([]);
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
    const { data: res } = await getEnterpriseExamineListAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
      licenseId: route.query.id as string,
    });

    examineRecord.value = res;
  };

  getExamineRecord();

  const getDetail = async () => {
    const { data: res } = await detailEnterpriseCertificateAPI({
      id: route.query.id as string,
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    formData.value = res;
    img.value = res.attachment && res.attachmentList[0];
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
      min-height: 670px;
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
