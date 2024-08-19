<!--
*@fileName import.vue
*@author wml
*@date 2023-07-17
*@description 设备设施 -- 批量导入页面
!-->
<template>
  <div
    class="container"
    :style="{ display: 'flex', width: '100%', height: '100%' }"
  >
    <a-card style="margin-bottom: 20px">
      <icon-left @click="backClick" /> <a-divider direction="vertical" />
      <span> 设 备 设 施 批 量 导 入 </span>
      <div class="import-box">
        <a-steps :current="stepIndex" class="steps">
          <a-step>操作说明</a-step>
          <a-step>数据上传</a-step>
          <a-step>数据确认</a-step>
          <a-step>完成</a-step>
        </a-steps>
        <div v-if="stepIndex === 1" class="operation">
          <div class="title">请仔细阅读以下操作说明：</div>
          <div class="text-part"
            >1. 请点击这里下载
            <a-link :disabled="false" @click="modelClick"
              >设备设施批量导入Excel模版</a-link
            >，并按照模板中的格式整理设备设施数据；</div
          >
          <div class="text-part">2. 上传整理好设备设施数据的Excel文件；</div>
          <div class="text-part">3. 在线确认设备设施数据是否正确；</div>
          <div class="text-part">4. 确认无误并提交。</div>
          <div class="text-part"
            >注意：为避免大数据量导入出错，一次导入数据条数不要超过5000条！</div
          >
          <div class="foo">
            <a-button class="item-btn" @click="stepNext(2)"
              >我已经整理好数据，点击进入下一步</a-button
            >
          </div>
        </div>
        <div v-if="stepIndex === 2" class="upload">
          <a-upload
            draggable
            action="/dev/businessApi/business/equipment/import-excel"
            :headers="headers"
            :show-file-list="false"
            @success="success"
          />
          <div class="hint">只能上传.xls/.xlsx文件，且不超过500kb</div>
          <a-button class="item-btn-white" @click="stepNext(1)"
            >上一步</a-button
          >
        </div>
        <div v-if="stepIndex === 3" class="excelData">
          <div class="excelData-title">
            读取到共
            <span class="font-bule">{{ excelData.num }}</span> 条记录</div
          >
          <div v-if="!excelData.flag" class="error-hint">
            <icon-close-circle-fill
              style="
                color: rgb(216, 0, 27);
                margin-right: 10px;
                width: 25px;
                height: 25px;
              "
            />
            其中 {{ excelData.errorNumber }}
            条记录未通过校验，请查看错误信息，并在excel文件中修改后再次导入
          </div>
          <div class="excelData-table">
            <a-table
              :data="excelData.excelReqVO"
              row-key="name"
              :pagination="false"
              :scroll="scroll"
              :scrollbar="true"
              :bordered="{ wrapper: true, cell: true }"
            >
              <template #columns>
                <a-table-column title="序号" :width="60">
                  <!-- 给每一行的索引起名称 可以使用数组或迭代器或其他方 -->
                  <template #cell="{ rowIndex }">
                    {{ rowIndex + 1 }}
                  </template>
                </a-table-column>
                <a-table-column
                  title="类型"
                  data-index="equipmentType"
                ></a-table-column>
                <a-table-column
                  title="设备名称"
                  data-index="name"
                ></a-table-column>
                <a-table-column title="重量" data-index="weight" :width="100">
                  <template #cell="{ record }">
                    {{ record.weight }} KG
                  </template>
                </a-table-column>
                <a-table-column
                  title="来源"
                  data-index="source"
                ></a-table-column>
                <a-table-column
                  title="状态"
                  data-index="statusName"
                ></a-table-column>
                <a-table-column
                  title="部门名称"
                  data-index="deptName"
                ></a-table-column>
                <a-table-column
                  title="企业名称"
                  data-index="enterpriseName"
                ></a-table-column>
                <a-table-column
                  title="负责人"
                  data-index="masterName"
                ></a-table-column>
                <a-table-column
                  title="自编号"
                  data-index="equipmentNumber"
                ></a-table-column>
                <a-table-column
                  title="自编号"
                  data-index="equipmentNumber"
                ></a-table-column>
                <a-table-column
                  title="安装位置"
                  data-index="location"
                ></a-table-column>
                <a-table-column
                  title="规格"
                  data-index="specification"
                ></a-table-column>
                <a-table-column
                  title="制造厂家"
                  data-index="manufacturer"
                ></a-table-column>
                <a-table-column
                  title="出厂编号"
                  data-index="factoryNumber"
                ></a-table-column>
                <a-table-column
                  title="出厂日期"
                  data-index="dateOfProduction"
                ></a-table-column>
                <a-table-column
                  title="备注"
                  data-index="remark"
                ></a-table-column>
                <a-table-column
                  title="年检"
                  data-index="annualinspectionName"
                ></a-table-column>
                <a-table-column
                  title="投用时间"
                  data-index="operationDate"
                ></a-table-column>
                <a-table-column
                  title="变更原因"
                  data-index="reason"
                ></a-table-column>
                <a-table-column
                  title="变更原因"
                  data-index="reason"
                ></a-table-column>
                <a-table-column
                  title="登记编号"
                  data-index="registrationNumber"
                ></a-table-column>
                <a-table-column
                  title="登记证书"
                  data-index="registrationCertificate"
                ></a-table-column>
                <a-table-column
                  title="注册/检验日期"
                  data-index="checkDate"
                ></a-table-column>
                <a-table-column
                  title="下次检验日期"
                  data-index="nextCheckDate"
                ></a-table-column>
                <a-table-column
                  title="证书备注"
                  data-index="certificateRemark"
                ></a-table-column>
                <a-table-column
                  title="特种设备分类"
                  data-index="equipmentSpecialTypeName"
                ></a-table-column>
                <a-table-column title="错误信息" fixed="right" :width="250">
                  <template #cell="{ rowIndex }">
                    <span v-if="excelData.errors[rowIndex] !== ''">{{
                      excelData.errors[rowIndex]
                    }}</span>
                    <span v-if="excelData.errors[rowIndex] === ''">
                      <icon-check style="color: rgb(112, 181, 3)" />
                    </span>
                  </template>
                </a-table-column>
              </template>
            </a-table>
          </div>
          <div class="excelData-foo">
            <a-button class="item-btn-white" @click="stepNext(2)"
              >上一步</a-button
            >
            <a-button class="item-btn" @click="uploadSubmitClick"
              >确认无误，立即导入</a-button
            >
          </div>
        </div>
        <a-spin :loading="loading" tip="正在上传数据">
          <div v-if="stepIndex === 4">
            <div v-if="submitResult.flag" class="result-success successData">
              <span
                ><icon-check-circle-fill
                  style="color: rgb(112, 181, 3); width: 100px; height: 100px"
              /></span>

              <div>成功导入{{ successData }}条数据</div>

              <div class="successData-foo">
                <a-button class="item-btn-white" @click="stepNext(2)"
                  >继续导入数据</a-button
                >
                <a-button class="item-btn" @click="backClick"
                  >返回设备设施列表</a-button
                >
              </div>
            </div>
            <div v-if="!submitResult.flag" class="result-error successData">
              <span
                ><icon-close-circle-fill
                  style="color: rgb(216, 0, 27); width: 100px; height: 100px"
              /></span>

              <div>导入数据失败</div>

              <div class="successData-foo">
                <a-button class="item-btn-white" @click="backLook()"
                  >返回查看数据列表</a-button
                >
                <a-button class="item-btn" @click="backClick"
                  >返回设备设施列表</a-button
                >
              </div>
            </div>
          </div>
        </a-spin>
      </div>
    </a-card>
    <model :model-flag="modelFlag" @close="modelCloseClick"></model>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import { uploadData } from '@/api/equipment';
  import { FileItem } from '@arco-design/web-vue/es/upload/interfaces';
  import model from '@/components/equipment/model.vue';
  import { Notification } from '@arco-design/web-vue';

  const router = useRouter();
  const modelFlag = ref(false);

  const headers = ref<Record<string, string>>({
    Authorization: 'Bearer testSec_1_1',
  });

  const stepIndex = ref(1);

  const scroll = {
    x: '300%',
    y: '90%',
  };

  const excelData = ref<any>({
    flag: true,
    excelReqVO: [],
    num: 0,
    errors: [''],
    errorNumber: 0,
  });

  const successData = ref(0);

  const submitResult = ref({
    successData: 0,
    flag: true,
  });

  // 解析数据
  const analysisloading = ref(false);

  const loading = ref(false);

  const backClick = () => {
    console.log('点击返回');
    router.go(-1);
  };

  const stepNext = (index: any) => {
    stepIndex.value = index;
  };

  const modelClick = () => {
    modelFlag.value = true;
  };

  const modelCloseClick = () => {
    modelFlag.value = false;
  };

  // 表格--上传成功
  const success = (fileItem: FileItem) => {
    stepIndex.value = 3;
    excelData.value = fileItem.response.data;
    console.log('analysisloading=', analysisloading.value);
  };

  // 数据上传
  const uploadSubmitClick = async () => {
    if (!excelData.value.flag) {
      Notification.error({
        title: '上 传 数 据 失 败',
        content: '表格数据有问题，请检查后修改后，再次上传',
      });
      return;
    }

    stepIndex.value = 4;
    loading.value = true;
    const res: any = await uploadData(excelData.value.excelReqVO);
    console.log('res=', res);
    if (res.code > 200) {
      submitResult.value.flag = false;
      loading.value = false;
    } else {
      successData.value = res.data;
      submitResult.value.flag = true;
      submitResult.value.successData = res.data;
      loading.value = false;
    }
  };

  const backLook = () => {
    stepIndex.value = 3;
    submitResult.value.flag = true;
  };

  watch(
    () => router.currentRoute.value.path,
    (toPath) => {
      console.log(toPath);
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
  .import-box {
    margin-top: 20px;
  }

  .steps {
    margin: 0 200px;
  }

  .operation {
    display: flex;
    flex-direction: column;
    margin-top: 40px;
    margin-left: 400px;
    margin-right: 200px;
    height: 70vh;
  }

  .title {
    font-weight: 900;
  }

  .text-part {
    margin-top: 15px;
    font-size: 12px;
  }

  .foo {
    margin-top: 80px;
    margin-left: 150px;
  }

  .item-btn {
    background: rgb(0, 126, 180);
    color: aliceblue;
    border-radius: 4.5px;
  }

  .item-btn-white {
    margin-top: 50px;
    margin-bottom: 50px;
    background: var(--color-bg-2);
    border: 1px solid rgb(143, 142, 142);
    border-radius: 4.5px;
    width: 150px;
    margin-right: 50px;
  }

  .upload {
    display: flex;
    align-items: center;
    margin: 40px 100px 0px 100px;
    flex-direction: column;
    height: 70vh;
  }

  .hint {
    margin: 10px 0;
  }

  .arco-upload-wrapper {
    width: 70%;
  }

  .excelData {
    display: flex;
    align-items: center;
    margin: 20px 20px 0px 20px;
    flex-direction: column;
    height: 100vh;
  }

  .excelData-title {
    font-weight: 500;
    font-size: 18px;
    line-height: 40px;
    letter-spacing: 5px;
  }

  .font-bule {
    line-height: 40px;
    color: rgb(1, 167, 240);
    font-weight: bold;
    text-align: center;
  }

  .error-hint {
    height: 40px;
    text-align: center;
    display: flex;
    align-items: center;
    background: rgba(216, 0, 27, 0.19);
    padding: 0 30px;
    border-radius: 4.5px;
  }

  .excelData-table {
    margin-top: 20px;
  }

  .excelData-foo {
    display: flex;
    align-items: center;
  }

  .successData {
    display: flex;
    flex-direction: column;
    align-items: center;
    height: 80vh;
    margin-top: 80px;
  }

  .successData-foo {
    display: flex;
    align-items: center;
  }

  .arco-spin {
    width: 100%;
  }
</style>
