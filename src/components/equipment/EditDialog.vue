<!--
*@fileName EditDialog.vue
*@author wml
*@date 2023-06-20
*@description 设备设施设备编辑页面
!-->
<template>
  <div class="edit-box">
    <a-modal
      :visible="editFlag"
      title="编 辑 设 备 信 息"
      width="65%"
      modal-class="dialog-class"
      :render-to-body="false"
      popup-container="edit-box"
      unmount-on-close
      @cancel="handleCancel"
      @before-ok="handleBeforeOk"
    >
      <a-form :model="form">
        <a-row :gutter="8">
          <a-col :span="12">
            <a-form-item
              label="设备名称"
              field="name"
              validate-trigger="input"
              :rules="[{ required: true, message: 'firstname is required' }]"
            >
              <a-input
                v-model="form.name"
                placeholder="不能为空，最长为25字符"
                class="input-cell"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="安装位置"
              field="location"
              validate-trigger="input"
              :rules="[{ required: true, message: 'lastname is required' }]"
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
        <a-row :gutter="8">
          <a-col :span="12">
            <a-form-item label="设备类型" field="equipmentType">
              <a-select
                v-model="form.equipmentTypeId"
                class="input-cell"
                allow-clear
              >
                <a-option v-for="item in equipmentTypeList" :key="item.id" :value="item.id">{{ item.name }}</a-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item
              label="自编号"
              field="equipmentNumber"
              validate-trigger="input"
              :rules="[{ required: true, message: 'lastname is required' }]"
            >
              <a-input
                v-model="form.equipmentNumber"
                placeholder="不能为空，最长为25字符"
                class="input-cell"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :span="12">
            <a-form-item label="所属部门" field="deptId">
              <a-tree-select
                v-model="form.deptId"
                :data="treeData"
                placeholder="所属部门"
                class="input-cell"
                allow-clear
              ></a-tree-select>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备责任人" field="masterId">
              <a-select v-model="form.masterId" class="input-cell" allow-clear>
                <a-option :value="0">设备责任人</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :span="12">
            <a-form-item label="规格型号" field="specification">
              <a-input
                v-model="form.specification"
                class="input-cell"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备重量" field="weight">
              <a-input v-model="form.weight" class="input-cell" allow-clear>
                <template #append> KG </template>
              </a-input>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :span="12">
            <a-form-item label="出厂编号" field="factoryNumber">
              <a-input
                v-model="form.factoryNumber"
                class="input-cell"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="出厂日期" field="dateOfProduction">
              <a-date-picker
                value-format="YYYY-MM-DD"
                allow-clear
                @change="onDateChange"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :span="12">
            <a-form-item label="制造厂家" field="manufacturer">
              <a-input
                v-model="form.manufacturer"
                class="input-cell"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="来源" field="source">
              <a-select v-model="form.source" class="input-cell" allow-clear>
                <a-option :value="0">自用/购买</a-option>
                <a-option :value="2">租赁/借用</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :span="12">
            <a-form-item label="投用时间" field="operationDate">
              <a-date-picker
                value-format="YYYY-MM-DD"
                allow-clear
                @change="operationDateChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备状态" field="status">
              <a-select v-model="form.status" class="input-cell" allow-clear>
                <a-option :value="0">在用</a-option>
                <a-option :value="1">停用</a-option>
                <a-option :value="2">维修中</a-option>
                <a-option :value="3">报废</a-option>
              </a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :span="12">
            <a-form-item label="设备图片" field="picture">
              <a-badge
                :count="
                  form.picture === '' || form.picture === undefined 
                    ? 0 : form.picture?.split(',').length
                "
              >
                <a-tag
                  :style="tagStyle"
                  bordered
                  @click="uploadDialogClick('picture')"
                  >上传文件</a-tag
                >
              </a-badge>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="设备铭牌图片" field="namePlat">
              <a-badge
                :count="
                  form.namePlat === ''  || form.namePlat === undefined 
                    ? 0 : form.namePlat?.split(',').length
                "
              >
                <a-tag
                  :style="tagStyle"
                  bordered
                  @click="uploadDialogClick('namePlat')"
                  >上传文件</a-tag
                >
              </a-badge>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="8">
          <a-col :span="12">
            <a-form-item label="设备附件" field="accessory">
              <a-badge
                :count="
                  form.accessory === '' || form.accessory === undefined 
                   ? 0 : form.accessory?.split(',').length
                "
              >
                <a-tag
                  :style="tagStyle"
                  bordered
                  @click="uploadDialogClick('accessory')"
                  >上传文件</a-tag
                >
              </a-badge>
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="是否年检" field="annualinspection">
              <a-checkbox @change="checkboxChange"></a-checkbox>
            </a-form-item>
          </a-col>
        </a-row>

        <!--年检信息部分-->
        <a-row v-if="form.annualinspection" :gutter="8">
          <a-col :span="12">
            <a-form-item label="登记编号" field="registrationNumber">
              <a-input
                v-model="equipmentCertificate.registrationNumber"
                class="input-cell"
                allow-clear
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="登记证书" field="registrationCertificate">
              <a-input
                v-model="equipmentCertificate.registrationCertificate"
                class="input-cell"
                allow-clear
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="form.annualinspection" :gutter="8">
          <a-col :span="12">
            <a-form-item label="注册/检验日期" field="checkDate">
              <a-date-picker
                value-format="YYYY-MM-DD"
                allow-clear
                @change="checkDateChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="12">
            <a-form-item label="下次检验日期" field="nextCheckDate">
              <a-date-picker
                value-format="YYYY-MM-DD"
                allow-clear
                @change="nextCheckDateChange"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row v-if="form.annualinspection" :gutter="8">
          <a-col :span="24">
            <a-form-item
              label="附件(登记证书、检验报告等)"
              field="equipmentCertificate.accessory"
            >
              <a-badge :count="0">
                <a-tag
                  :style="tagStyle"
                  bordered
                  @click="uploadDialogClick('equipmentCertificate.accessory')"
                  >上传文件</a-tag
                >
              </a-badge>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
    <Upload
      :upload-flag="uploadFlag"
      :upload-files="uploadFiles"
      @close="uploadCloseClick"
    >
    </Upload>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineEmits, watch } from 'vue';
  import { cloneDeep } from 'lodash';
  import type { TreeNodeData } from '@arco-design/web-vue/es/tree/interface';
  import { EquipmentEditFrom, EquipmentCertificate } from '@/types/equipment';
  import { update, typeList } from '@/api/equipment';
  import { Notification } from '@arco-design/web-vue';
  import Upload from '@/components/equipment/Upload.vue';

  const props = defineProps({
    editFlag: {
      type: Boolean,
      default: false,
    },
    formRecord:{
        type:Object,
        default:null
    }
  });

  const tagStyle = {
    'width': '100px',
    'height': '30px',
    'background-color': 'var(--color-white)',
  };

  const treeData: TreeNodeData[] = [
    {
      key: 'node10',
      title: '财务部',
      disabled: true,
      children: [
        { key: 'node12', title: '会计' },
        { key: 'node13', title: '出纳' },
        { key: 'node14', title: '财务' },
      ],
    },
    {
      key: 'node30',
      title: 'IT研发部',
      children: [
        { key: 'node34', title: '硬件研发组' },
        { key: 'node35', title: '前端研发组' },
        { key: 'node36', title: '后端研发组' },
      ],
    },
    {
      key: 'node40',
      title: '行政部',
      children: [
        { key: 'node44', title: '内务组' },
        { key: 'node45', title: '前台' },
        { key: 'node46', title: 'HR' },
      ],
    },
    {
      key: 'node50',
      title: '市场部',
      children: [
        { key: 'node54', title: '销售' },
        { key: 'node55', title: '售后' },
        { key: 'node56', title: '售前' },
      ],
    },
  ]; // 树形数据，用于展示分组树形结构。或者使用展示树形结

  const equipmentCertificate = ref<EquipmentCertificate>({
    registrationNumber: '',
    registrationCertificate: '',
    checkDate: '',
    nextCheckDate: '',
    remark: '',
    accessory: '',
  });
  const form = ref<EquipmentEditFrom>({
    name: '',
    source: '',
    weight: '',
    status: '',
    deptId: '',
    masterId: '',
    enterpriseId: '',
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
    annualinspection: false,
    accessory: '',
    operationDate: '',
    reason: '',
    equipmentCertificateUpdateReqVO: equipmentCertificate.value,
  });
  const equipmentCertificateDefault = ref<EquipmentCertificate>({
    registrationNumber: '',
    registrationCertificate: '',
    checkDate: '',
    nextCheckDate: '',
    remark: '',
    accessory: '',
  });
  const formDefault = ref<EquipmentEditFrom>({
    name: '',
    source: '',
    weight: '',
    status: '',
    deptId: '',
    masterId: '',
    enterpriseId: '',
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
    annualinspection: false,
    accessory: '',
    operationDate: '',
    reason: '',
    equipmentCertificateUpdateReqVO: equipmentCertificate.value,
  });

  // 上传相关
  const uploadFlag = ref(false);
  const uploadFiles = ref('');
  // 当前上传的字段
  const uploadField = ref('');
  const equipmentTypeList = ref<any>([])
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

  // modal组件 确认，取消事件-----------------------------------------------
  const emit = defineEmits(['commit', 'close']);

  const handleBeforeOk = async (done: any) => {
    const res: any = await update(form.value);
    console.log('update=', res.data);

    if (res.code > 200) {
      Notification.error({
        title: '更 新 设 备 信 息 失 败',
        content: '原因为=' + res.msg,
      });
      return;
    }
    Notification.info({
      title: '更 新 设 备 信 息 成 功',
      content: '',
    });
    console.log('form= ', form.value);
    emit('commit', 'commit');
    window.setTimeout(() => {
      done();
      // prevent close
      // done(false)
    }, 1000);
  };
  const handleCancel = () => {
    form.value = cloneDeep(formDefault.value);
    console.log('form= ', form.value);
    emit('close', 'close');
  };
  // modal组件 确认，取消事件-----------------------------------------------

  // 日期选择组件  选择事件-----------------------------------------------
  const onDateChange = (
    value: Date | string | number | undefined,
    date: Date | undefined,
    dateString: string | undefined
  ) => {
    console.log(value);
    console.log(date);
    console.log(dateString);
    form.value.dateOfProduction = dateString;
  };
  const operationDateChange = (
    value: Date | string | number | undefined,
    date: Date | undefined,
    dateString: string | undefined
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
  // 日期选择组件  选择事件-----------------------------------------------

  // 上传组件  事件 start-----------------------------------------------
  const uploadCloseClick = (e: any) => {
    uploadFlag.value = false;
    console.log(uploadField.value, '=', e);
    form.value[uploadField.value] = e;
  };

  const uploadDialogClick = (type: string) => {
    console.log(type, '=', form.value[type]);
    uploadFiles.value = form.value[type];
    uploadField.value = type;
    uploadFlag.value = true;
    console.log(type, '=', form.value[type]);
  };

  // 上传组件  事件 ent-----------------------------------------------

  const checkboxChange = (value: boolean | (string | number | boolean)[]) => {
    if (value) {
      form.value.annualinspection = true;
    } else {
      form.value.annualinspection = false;
      equipmentCertificate.value = cloneDeep(equipmentCertificateDefault.value);
    }
    console.log(form.value.annualinspection);
  };

  watch(
    () => props.editFlag,
    () => {
      if (props.editFlag) {
        form.value = cloneDeep(props.formRecord as any);
      }
    }
  );
</script>

<style lang="less" scoped>
  .input-cell {
    background-color: var(--color-white);
    border-style: solid;
    border-width: 1px;
    border-color: var(--color-gray-1);
    border-radius: 5px;
  }

  :deep(.arco-input-wrapper),
  :deep(.arco-input-append) {
    background-color: var(--color-white);
  }

  :deep(.arco-select-view-single) {
    background-color: var(--color-white);
    border-style: solid;
    border-width: 1px;
    border-color: var(--color-gray-1);
    border-radius: 5px;
  }

  :deep(.arco-picker) {
    width: 100%;
    background-color: var(--color-white);
    border-style: solid;
    border-width: 1px;
    border-color: var(--color-gray-1);
    border-radius: 5px;
  }

  :deep(.arco-modal-container) {
    .arco-modal-header {
      background-color: var(--color-border-2);
    }
  }
</style>
