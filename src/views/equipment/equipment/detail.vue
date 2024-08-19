<!--
*@fileName detail.vue
*@author wml
*@date 2023-07-12
*@description 设备设施--设备详情
!-->
<template>
  <div
    class="container"
    :style="{ display: 'flex', width: '100%', height: '100%' }"
  >
    <a-card style="margin-bottom: 20px">
      <icon-left @click="backClick" /> <a-divider direction="vertical" />
      <span> 设 备 设 施 详 情 </span>
      <div class="detail-box">
        <a-form :model="form">
          <a-descriptions title="基础信息" layout="inline-horizontal" />
          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item label="设备名称" field="name" label-col-flex="100px">
                <span>{{ form.name ? form.name : '-' }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item
                label="设备类型"
                field="equipmentType"
                label-col-flex="100px"
              >
                <span>{{
                  form.equipmentTypeName ? form.equipmentTypeName : '-'
                }}</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item
                label="自编号"
                field="equipmentNumber"
                label-col-flex="100px"
              >
                <span>{{
                  form.equipmentNumber ? form.equipmentNumber : '-'
                }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item label="来源" field="source" label-col-flex="100px">
                <span>{{ form.source ? form.source : '-' }}</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-descriptions title="设备使用信息" layout="inline-horizontal" />
          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item
                label="所属部门"
                field="deptId"
                label-col-flex="100px"
              >
                <span>{{ form.deptName ? form.deptName : '-' }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item
                label="设备责任人"
                field="masterNick"
                label-col-flex="100px"
              >
                <span>{{ form.masterNick ? form.masterNick : '-' }}</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="20">
              <a-form-item
                label="安装位置"
                field="location"
                label-col-flex="100px"
              >
                <span>{{ form.location ? form.location : '-' }}</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-descriptions title="设备状态" layout="inline-horizontal" />
          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item
                label="投用时间"
                field="operationDate"
                label-col-flex="100px"
              >
                <span>{{ form.operationDate ? form.operationDate : '-' }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item
                label="设备状态"
                field="status"
                label-col-flex="100px"
              >
                <span>{{ form.statusName ? form.statusName : '-' }}</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="20">
              <a-form-item
                label="是否需年检"
                field="annualinspection"
                label-col-flex="100px"
              >
                <span>{{
                  form.annualinspection === 0 ? '不需要年检' : '需要年检'
                }}</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-descriptions
            v-if="form.annualinspection"
            title="设备年检信息"
            layout="inline-horizontal"
          />
          <a-row v-if="form.annualinspection" :gutter="16">
            <a-col :span="10">
              <a-form-item
                label="登记编号"
                field="registrationNumber"
                label-col-flex="100px"
              >
                <span>{{
                  equipmentCertificate.registrationNumber
                    ? equipmentCertificate.registrationNumber
                    : '-'
                }}</span>
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item
                label="登记证书"
                field="registrationCertificate"
                label-col-flex="100px"
              >
                <span>
                  {{
                    equipmentCertificate.registrationCertificate
                      ? equipmentCertificate.registrationCertificate
                      : '-'
                  }}
                </span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="form.annualinspection" :gutter="16">
            <a-col :span="10">
              <a-form-item
                label="注册/检验日期"
                field="checkDate"
                label-col-flex="100px"
              >
                <span>
                  {{
                    equipmentCertificate.checkDate
                      ? equipmentCertificate.checkDate
                      : '-'
                  }}
                </span>
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item
                label="下次检验日期"
                field="nextCheckDate"
                label-col-flex="100px"
              >
                <span>
                  {{
                    equipmentCertificate.nextCheckDate
                      ? equipmentCertificate.nextCheckDate
                      : '-'
                  }}
                </span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="form.annualinspection" :gutter="16">
            <a-col :span="20">
              <a-form-item label="附件(登记证书、检验报告等)" field="accessory">
                <a-image-preview-group infinite> </a-image-preview-group>
              </a-form-item>
              <a-form-item v-if="equipmentCertificate.accessoryList" label="" field="accessory" label-col-flex="0px">
                <div class="image-group">
                  <a-image-preview-group>
                    <a-image
                      v-for="(item, index) in equipmentCertificate.accessoryList"
                      :key="index"
                      :src="item"
                      width="200"
                    />
                  </a-image-preview-group>
                </div>
              </a-form-item>
              <a-form-item v-if="!equipmentCertificate.accessoryList" label="" label-col-flex="0px">
                <span>无</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-descriptions title="生产制造信息" layout="inline-horizontal" />
          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item
                label="制造厂家"
                field="manufacturer"
                label-col-flex="100px"
              >
                <span> {{ form.manufacturer ? form.manufacturer : '-' }} </span>
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item
                label="规格型号"
                field="specification"
                label-col-flex="100px"
              >
                <span>
                  {{ form.specification ? form.specification : '-' }}
                </span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item
                label="设备重量"
                field="weight"
                label-col-flex="100px"
              >
                <span> {{ form.weight ? form.weight : '-' }} KG </span>
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item
                label="出厂编号"
                field="factoryNumber"
                label-col-flex="100px"
              >
                <span>
                  {{ form.factoryNumber ? form.factoryNumber : '-' }}
                </span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item
                label="出厂日期"
                field="dateOfProduction"
                label-col-flex="100px"
              >
                <span> {{ form.dateOfProduction }} </span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-descriptions
            title="设备相关图片/文件"
            layout="inline-horizontal"
          />
          <a-row :gutter="16">
            <a-col :span="20">
              <a-form-item
                label="设备图片"
                field="picture"
                label-col-flex="100px"
              >
              </a-form-item>
              <a-form-item v-if="form.pictureList" label="" label-col-flex="0px"> 
                <div class="image-group">
                  <a-image-preview-group>
                    <a-image
                      v-for="(item, index) in form.pictureList"
                      :key="index"
                      :src="item"
                      width="200"
                    />
                  </a-image-preview-group>
                </div>
              </a-form-item>
              <a-form-item v-if="!form.pictureList" label="" label-col-flex="0px">
                <span>无</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="20">
              <a-form-item
                label="设备铭牌"
                field="namePlat"
                label-col-flex="100px"
              >
              </a-form-item>
              <a-form-item v-if="form.namePlatList" label="" label-col-flex="0px"> 
                <div class="image-group">
                  <a-image-preview-group>
                    <a-image
                      v-for="(item, index) in form.namePlatList"
                      :key="index"
                      :src="item"
                      width="200"
                    />
                  </a-image-preview-group>
                </div>
              </a-form-item>
              <a-form-item v-if="!form.namePlatList" label="" label-col-flex="0px">
                <span>无</span>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="20">
              <a-form-item
                label="其他附件"
                field="accessory"
                label-col-flex="100px"
              >
              </a-form-item>
              <a-form-item v-if="form.accessoryList" label="" label-col-flex="0px"> 
                <div class="image-group">
                  <a-image-preview-group>
                    <a-image
                      v-for="(item, index) in form.accessoryList"
                      :key="index"
                      :src="item"
                      width="200"
                    />
                  </a-image-preview-group>
                </div>
              </a-form-item>
              <a-form-item v-if="!form.accessoryList" label="" label-col-flex="0px">
                <span>无</span>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { getDetail } from '@/api/equipment';
  const router = useRouter();
  const route = useRoute();
  const form = ref<any>({});
  const equipmentCertificate = ref<any>({});

  const backClick = () => {
    console.log('点击返回');
    router.go(-1);
  };

  const detail = async (id: string) => {
    const res = await getDetail({ id });
    console.log('detail=', res.data);
    form.value = res.data;
    equipmentCertificate.value = form.value.equipmentCertificateRespVO;
  };

  watch(
    () => router.currentRoute.value.path,
    (toPath) => {
      if (toPath === '/equipment/equipmentDetail') {
        detail(route.query.record as string);
      }
    },
    { immediate: true, deep: true }
  );
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    padding: 16px 20px;
    padding-bottom: 0;
    background-color: var(--color-fill-2);
    flex-direction: column;
    // justify-content: center;
    // align-items: center;
  }
  .detail-box {
    margin-top: 20px;
    margin-left: 100px;
  }

  .arco-form-item-label-col > .arco-form-item-label {
    color: rgb(191 191 191);
  }

  :deep(.arco-form-item-label-col) {
    justify-content: flex-start;
  }

  :deep(.arco-descriptions-title) {
    font-size: 12px;
    font-weight: 600;
  }

  :deep(.arco-form) {
    margin-left: 100px;
  }

  .description {
    color: rgb(245, 155, 34);
  }

  .btn-item {
    border-radius: 4.5px;
    border: 1px solid rgb(225 225 225);
    margin-right: 20px;
    color: rgb(121, 121, 121);
    width: 120px;
    margin-left: 240px;
  }

  .image-group {
    flex-flow: row wrap;
  }
</style>
