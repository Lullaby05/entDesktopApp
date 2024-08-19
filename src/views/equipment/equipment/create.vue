<!--
*@fileName create.vue
*@author wml
*@date 2023-07-07
*@description 设备设施--创建设备
!-->
<template>
  <div class="container">
    <a-card style="margin-bottom: 20px">
      <icon-left @click="backClick" /> <a-divider direction="vertical" />
      <span> 新 增 设 备 设 施 </span>
      <div class="create-box">
        <a-form :model="form">
          <a-descriptions title="基础信息" layout="inline-horizontal" />
          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item label="设备名称" field="name" label-col-flex="100px">
                <a-input
                  v-model="form.name"
                  placeholder="不能为空，最长为25字符"
                  class="input-cell"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item
                label="设备类型"
                field="equipmentType"
                label-col-flex="100px"
              >
                <a-select
                  v-model="form.equipmentTypeId"
                  class="input-cell"
                  allow-clear
                  placeholder="设备类型"
                >
                  <a-option
                    v-for="item in equipmentTypeList"
                    :key="item.id"
                    :value="item.id"
                    >{{ item.name }}</a-option
                  >
                </a-select>
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
                <a-input
                  v-model="form.equipmentNumber"
                  placeholder="不能为空，最长为25字符"
                  class="input-cell"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item label="来源" field="source" label-col-flex="100px">
                <a-select
                  v-model="form.source"
                  class="input-cell"
                  allow-clear
                  placeholder="设备来源"
                >
                  <a-option value="自用/购买">自用/购买</a-option>
                  <a-option value="租赁/借用">租赁/借用</a-option>
                </a-select>
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
                <a-tree-select
                  v-model="form.deptId"
                  :data="treeData"
                  placeholder="所属部门"
                  class="input-cell"
                  allow-clear
                ></a-tree-select>
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item
                label="设备责任人"
                field="masterId"
                label-col-flex="100px"
              >
                <a-select
                  v-model="form.masterId"
                  class="input-cell"
                  allow-clear
                  placeholder="设备责任人"
                >
                  <a-option value="1666013288207725176">设备责任人</a-option>
                </a-select>
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
                <a-input
                  v-model="form.location"
                  placeholder="不能为空，最长为25字符"
                  class="input-cell"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-descriptions title="设备状态" layout="inline-horizontal" />
          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item label="投用时间" field="operationDate">
                <a-date-picker
                  value-format="YYYY-MM-DD"
                  allow-clear
                  @change="operationDateChange"
                />
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item label="设备状态" field="status">
                <a-select
                  v-model="form.status"
                  class="input-cell"
                  allow-clear
                  placeholder="设备状态"
                >
                  <a-option :value="0">在用</a-option>
                  <a-option :value="1">停用</a-option>
                  <a-option :value="2">维修中</a-option>
                  <a-option :value="3">报废</a-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item label="是否年检" field="annualinspection">
                <a-radio-group v-model="form.annualinspection" @change="radio">
                  <a-radio :value="1">需要年检</a-radio>
                  <a-radio :value="0">不需要年检</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
          </a-row>
          <a-descriptions
            v-if="form.annualinspection === 1"
            title="设备年检信息"
            layout="inline-horizontal"
          />
          <a-row v-if="form.annualinspection === 1" :gutter="16">
            <a-col :span="10">
              <a-form-item label="登记编号" field="registrationNumber">
                <a-input
                  v-model="equipmentCertificate.registrationNumber"
                  class="input-cell"
                  allow-clear
                  placeholder="登记编号"
                />
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item label="登记证书" field="registrationCertificate">
                <a-input
                  v-model="equipmentCertificate.registrationCertificate"
                  class="input-cell"
                  allow-clear
                  placeholder="登记证书"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="form.annualinspection === 1" :gutter="16">
            <a-col :span="10">
              <a-form-item
                label="注册/检验日期"
                field="checkDate"
                label-col-flex="100px"
              >
                <a-date-picker
                  value-format="YYYY-MM-DD"
                  allow-clear
                  @change="checkDateChange"
                />
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item
                label="下次检验日期"
                field="nextCheckDate"
                label-col-flex="100px"
              >
                <a-date-picker
                  value-format="YYYY-MM-DD"
                  allow-clear
                  @change="nextCheckDateChange"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row v-if="form.annualinspection === 1" :gutter="16">
            <a-col :span="20">
              <a-form-item label="附件(登记证书、检验报告等)" field="accessory">
                <span class="description"
                  >仅限png、jpg、zip、rar、doc、docx、pdf、xls、xlsx格式，单个文件大小8m以内</span
                >
              </a-form-item>
              <a-form-item label-col-flex="1px">
                <a-upload
                  :headers="headers"
                  list-type="picture-card"
                  :action="action"
                  :file-list="fileList"
                  image-preview
                  @success="(fileItem:FileItem)=>onSuccess(fileItem,'fileList')"
                  @before-remove="(fileItem:FileItem)=>beforeRemove(fileItem,'fileList')"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-descriptions title="生产制造信息" layout="inline-horizontal" />
          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item label="制造厂家" field="manufacturer">
                <a-input
                  v-model="form.manufacturer"
                  class="input-cell"
                  allow-clear
                  placeholder="制造厂家"
                />
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item label="规格型号" field="specification">
                <a-input
                  v-model="form.specification"
                  class="input-cell"
                  allow-clear
                  placeholder="规格型号"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item label="设备重量" field="weight">
                <a-input
                  v-model="form.weight"
                  class="input-cell"
                  allow-clear
                  placeholder="设备重量"
                >
                  <template #append> KG </template>
                </a-input>
              </a-form-item>
            </a-col>
            <a-col :span="10">
              <a-form-item label="出厂编号" field="factoryNumber">
                <a-input
                  v-model="form.factoryNumber"
                  class="input-cell"
                  allow-clear
                  placeholder="出厂编号"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item label="出厂日期" field="dateOfProduction">
                <a-date-picker
                  value-format="YYYY-MM-DD"
                  allow-clear
                  @change="onDateChange"
                />
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
                label-col-flex="80px"
              >
                <span class="description"
                  >仅限png、jpg格式，单个文件大小8m以内</span
                >
              </a-form-item>
              <a-form-item label-col-flex="1px">
                <a-upload
                  :headers="headers"
                  list-type="picture-card"
                  :action="action"
                  :file-list="pictureList"
                  image-preview
                  @success="(fileItem:FileItem)=>onSuccess(fileItem,'pictureList')"
                  @before-remove="(fileItem:FileItem)=>beforeRemove(fileItem,'pictureList')"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="20">
              <a-form-item
                label="设备铭牌图片"
                field="namePlat"
                label-col-flex="100px"
              >
                <span class="description"
                  >仅限png、jpg格式，单个文件大小8m以内</span
                >
              </a-form-item>
              <a-form-item label-col-flex="1px">
                <a-upload
                  :headers="headers"
                  list-type="picture-card"
                  :action="action"
                  :file-list="namePlatList"
                  image-preview
                  @success="(fileItem:FileItem)=>onSuccess(fileItem,'namePlatList')"
                  @before-remove="(fileItem:FileItem)=>beforeRemove(fileItem,'namePlatList')"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="20">
              <a-form-item
                label="其他附件"
                field="accessory"
                label-col-flex="80px"
              >
                <span class="description"
                  >仅限png、jpg、zip、rar、doc、docx、pdf、xls、xlsx格式，单个文件大小8m以内</span
                >
              </a-form-item>
              <a-form-item label-col-flex="1px">
                <a-upload
                  :headers="headers"
                  list-type="picture-card"
                  :action="action"
                  :file-list="accessoryList"
                  image-preview
                  @success="(fileItem:FileItem)=>onSuccess(fileItem,'accessoryList')"
                  @before-remove="(fileItem:FileItem)=>beforeRemove(fileItem,'accessoryList')"
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :span="10">
              <a-form-item>
                <a-button type="text" class="btn-item" @click="createClick"
                  >保存</a-button
                >
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { create, typeList } from '@/api/equipment';
  import type { TreeNodeData } from '@arco-design/web-vue/es/tree/interface';
  import { EquipmentFrom, EquipmentCertificate } from '@/types/equipment';
  import { FileItem } from '@arco-design/web-vue/es/upload/interfaces';
  import { Notification } from '@arco-design/web-vue';
  const equipmentTypeList = ref<any>([]);

  const headers = ref<Record<string, string>>({
    Authorization: 'Bearer testSec_1_1',
  });
  const action =
    import.meta.env.VITE_API_BASE_URL +
    '/dev/businessApi/business/upload/uploadFile';

  const router = useRouter();

  const fetchData = async () => {
    try {
      const res: any = await typeList();
      equipmentTypeList.value = res.data;
    } catch (err) {
      console.log(err);
      // you can report use errorHandler or other
    }
  };
  fetchData();

  const fileList = ref<FileItem[]>([]);
  const pictureList = ref<FileItem[]>([]);
  const namePlatList = ref<FileItem[]>([]);
  const accessoryList = ref<FileItem[]>([]);

  const equipmentCertificate = ref<EquipmentCertificate>({
    registrationNumber: '',
    registrationCertificate: '',
    checkDate: '',
    nextCheckDate: '',
    remark: '',
    accessory: '',
  });
  const form = ref<EquipmentFrom>({
    name: '',
    source: '',
    weight: '',
    status: '',
    deptId: '',
    masterId: '1666013288207725176',
    enterpriseId: '1666013288207826105',
    equipmentTypeId: '',
    equipmentSpecialTypeId: '',
    deptName: '',
    masterName: '',
    enterpriseName: '',
    equipmentTypeName: '',
    equipmentSpecialTypeName: '',
    equipmentNumber: '',
    location: '',
    specification: '',
    manufacturer: '',
    factoryNumber: '',
    dateOfProduction: '',
    remark: '',
    picture: '',
    namePlat: '',
    annualinspection: 1,
    accessory: '',
    operationDate: '',
    reason: '',
    equipmentCertificateCreateReqVO: equipmentCertificate.value,
  });

  const treeData: TreeNodeData[] = [
    {
      key: '100',
      title: '财务部',
      disabled: true,
      children: [
        { key: '101', title: '会计' },
        { key: '102', title: '出纳' },
        { key: '103', title: '财务' },
      ],
    },
    {
      key: '200',
      title: 'IT研发部',
      children: [
        { key: '201', title: '硬件研发组' },
        { key: '202', title: '前端研发组' },
        { key: '203', title: '后端研发组' },
      ],
    },
    {
      key: '300',
      title: '行政部',
      children: [
        { key: '301', title: '内务组' },
        { key: '302', title: '前台' },
        { key: '303', title: 'HR' },
      ],
    },
    {
      key: '400',
      title: '市场部',
      children: [
        { key: '401', title: '销售' },
        { key: '40055', title: '售后' },
        { key: '40056', title: '售前' },
      ],
    },
  ]; // 树形数据，用于展示分组树形结构。或者使用展示树形结

  const operationDateChange = (
    value: Date | string | number | undefined,
    date: Date | undefined,
    dateString: string
  ) => {
    form.value.operationDate = dateString;
  };
  const checkDateChange = (
    value: Date | string | number | undefined,
    date: Date | undefined,
    dateString: string | undefined
  ) => {
    equipmentCertificate.value.checkDate = dateString;
  };
  const nextCheckDateChange = (
    value: Date | string | number | undefined,
    date: Date | undefined,
    dateString: string | undefined
  ) => {
    equipmentCertificate.value.nextCheckDate = dateString;
  };

  const onDateChange = (
    value: Date | string | number | undefined,
    date: Date | undefined,
    dateString: string | undefined
  ) => {
    form.value.dateOfProduction = dateString;
  };

  const radio = (value: string | number | boolean) => {
    form.value.annualinspection = value as number;
    if (value === 0) {
      equipmentCertificate.value = {
        registrationNumber: '',
        registrationCertificate: '',
        checkDate: '',
        nextCheckDate: '',
        remark: '',
        accessory: '',
      };
    }
  };

  const createClick = async () => {
    form.value.picture = pictureList.value
      .map((item) => item.response.data[0].fileName)
      .toString();
    form.value.namePlat = namePlatList.value
      .map((item) => item.response.data[0].fileName)
      .toString();
    form.value.accessory = accessoryList.value
      .map((item) => item.response.data[0].fileName)
      .toString();
    equipmentCertificate.value.accessory = fileList.value
      .map((item) => item.response.data[0].fileName)
      .toString();

    const res: any = await create(form.value);
    console.log('create=', res.data);

    if (res.code > 200) {
      Notification.error({
        title: '创 建 设 备 失 败',
        content: '原因为=' + res.msg,
      });
      return;
    }
    Notification.info({
      title: '创 建 设 备 成 功',
      content: '',
    });
    router.go(-1);
  };

  const backClick = () => {
    console.log('点击返回');
    router.go(-1);
  };

  // 上传成功回调函数
  const onSuccess = (fileItem: FileItem, type: string) => {
    console.log('fileItem=', fileItem);
    const result = fileItem.response;
    const code = result.code;

    let copyFileList: FileItem[] = [];

    switch (type) {
      case 'fileList':
        copyFileList = fileList.value;
        break;
      case 'pictureList':
        copyFileList = pictureList.value;
        break;
      case 'namePlatList':
        copyFileList = namePlatList.value;
        break;
      case 'accessoryList':
        copyFileList = accessoryList.value;
        break;
      default:
        copyFileList = fileList.value;
        break;
    }

    if (code > 200) {
      Notification.error({
        title: '上 传 失 败 ',
        content: '原因为=' + result.msg,
      });
      fileItem.status = 'error';

      // 过滤相同的文件
      const flag = copyFileList.find((item) => item.uid === fileItem.uid);
      if (flag) {
        return;
      }

      copyFileList.push(fileItem);
      return;
    }

    Notification.info({
      title: '上 传 成 功',
      content: '',
    });

    // 过滤相同的文件
    const flag = copyFileList.find((item) => item.uid === fileItem.uid);
    if (flag) {
      return;
    }

    fileItem.url = result.data[0].filePath;
    copyFileList.push(fileItem);
  };

  // 删除回调函数
  const beforeRemove = (fileItem: FileItem, type: string) => {
    return new Promise<boolean>((resolve) => {
      let copyFileList: FileItem[] = [];

      switch (type) {
        case 'fileList':
          copyFileList = fileList.value;
          break;
        case 'pictureList':
          copyFileList = pictureList.value;
          break;
        case 'namePlatList':
          copyFileList = namePlatList.value;
          break;
        case 'accessoryList':
          copyFileList = accessoryList.value;
          break;
        default:
          copyFileList = fileList.value;
          break;
      }

      const index = copyFileList.findIndex((item) => item.uid === fileItem.uid);
      copyFileList.splice(index, 1);

      resolve(true);
    });
  };
</script>

<style lang="less" scoped>
  .create-box {
    margin-top: 20px;
    margin-left: 100px;
  }

  .arco-form-item-label-col > .arco-form-item-label {
    color: rgb(191 191 191);
  }

  :deep(.arco-descriptions-title) {
    font-size: 12px;
    font-weight: 600;
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
</style>
