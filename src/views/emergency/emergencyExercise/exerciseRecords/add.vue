<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">{{ title }}</span>
      </div>
      <div class="form">
        <a-form ref="form" :model="formData" :rules="rules">
          <a-form-item field="planTitle" label="计划名称" required>
            <a-input
              v-model.trim="formData.planTitle"
              disabled
              placeholder="请输入计划名称"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="drillTime" label="演练时间" required>
            <a-date-picker
              v-model="formData.drillTime"
              placeholder="请选择演练时间"
              show-time
              :disabled="disabled"
              allow-clear
            ></a-date-picker>
          </a-form-item>
          <a-form-item field="participant" label="人员数量" required>
            <a-input
              v-model="formData.participant"
              :disabled="disabled"
              placeholder="请输入人员数量"
              allow-clear
              :max-length="9"
            ></a-input>
          </a-form-item>
          <a-form-item field="drillSite" label="演练地点" required>
            <a-input
              v-model.trim="formData.drillSite"
              :disabled="disabled"
              placeholder="请输入演练地点"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="drillContent" label="演练内容" required>
            <a-textarea
              v-model.trim="formData.drillContent"
              :auto-size="{ maxRows: 6, minRows: 6 }"
              show-word-limit
              :max-length="300"
              placeholder="请输入演练内容"
              :disabled="disabled"
            ></a-textarea>
          </a-form-item>

          <a-form-item field="drillAssess" label="演练评估">
            <a-space>
              <a-upload
                v-model:file-list="formData.drillAssessList"
                action=""
                :custom-request="customRequest"
                :disabled="disabled"
                multiple
                accept=".doc,.docx,.pdf"
                :limit="5"
                :show-remove-button="!disabled"
                @success="uploadPicSuccess($event, 'drillAssess')"
                @before-remove="(e:FileItem)=>beforeRemove(e, 'drillAssess')"
                @before-upload="(e) => beforeUpload(e, '.doc,.docx,.pdf')"
              >
              </a-upload>
            </a-space>
          </a-form-item>
          <a-form-item field="agreement" label="附件">
            <a-space>
              <a-upload
                v-model:file-list="formData.agreementList"
                action=""
                :custom-request="customRequest"
                :disabled="disabled"
                multiple
                accept=".doc,.docx,.pdf"
                :limit="5"
                :show-remove-button="!disabled"
                @success="uploadPicSuccess($event, 'agreement')"
                @before-remove="(e:FileItem)=>beforeRemove(e, 'agreement')"
                @before-upload="(e) => beforeUpload(e, '.doc,.docx,.pdf')"
              >
              </a-upload>
            </a-space>
          </a-form-item>
          <a-form-item field="drillPic" label="演练照片">
            <a-space>
              <a-upload
                v-model:file-list="formData.drillPicList"
                list-type="picture-card"
                action=""
                :custom-request="customRequest"
                :limit="10"
                image-preview
                :show-upload-button="!disabled"
                :disabled="disabled"
                accept="image/*"
                @success="uploadPicSuccess($event, 'drillPic')"
                @before-remove="(e:FileItem)=>beforeRemove(e, 'drillPic')"
                @before-upload="(e) => beforeUpload(e, 'image/*')"
              />
            </a-space>
          </a-form-item>
        </a-form>
      </div>
      <div class="btn">
        <a-space>
          <a-button v-if="!disabled" @click="goBack">{{
            title === '新增演练记录' ? '取消' : '返回'
          }}</a-button>
          <a-button v-if="!disabled" type="primary" @click="submit">
            保存
          </a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
  import { ref, computed, h } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from '@/store';
  import { FieldRule, FileItem, Message, Modal } from '@arco-design/web-vue';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import {
    getExerciseRecordListAPI,
    addExerciseRecordItemAPI,
    detailExerciseRecordItemAPI,
    updateExerciseRecordItemAPI,
  } from '@/api/emergency';
  import type { AddExerciseRecordItemData } from '@/api/emergency';
  import { useCustomUpload } from '@/hooks/customUpload';
  export default {
    name: 'ExerciseRecordPage',
  };
</script>

<script lang="ts" setup>
  // 上传
  const { customRequest, beforeUpload } = useCustomUpload();

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const type = route.query.type as string;
  const title = computed(() => {
    if (route.query.type === 'add') return '新增演练记录';
    if (route.query.type === 'edit') {
      getDetail();
      return '编辑演练记录';
    }
    getDetail();
    return '查看演练记录';
  });
  const disabled = computed(() => type === 'view');
  const goBack = () => {
    router.back();
  };

  // -------------------- 数据 --------------------
  const getDetail = async () => {
    const { data: res } = await detailExerciseRecordItemAPI({
      drillplanId: route.query.id as string,
    });
    formData.value = res;
    formData.value.planTitle = route.query.planTitle as string;

    // 处理附件数据
    res.agreementList = res.agreementList ? res.agreementList : [];
    formData.value.agreementList = res.agreementList.map((item: any) => {
      const fileName = item.fileName.split('//')[0];
      return { name: fileName, url: item.fileUrl, fileName: item.fileName };
    });

    res.drillAssessList = res.drillAssessList ? res.drillAssessList : [];
    formData.value.drillAssessList = res.drillAssessList.map((item: any) => {
      const fileName = item.fileName.split('//')[0];
      return { name: fileName, url: item.fileUrl, fileName: item.fileName };
    });

    res.drillPicList = res.drillPicList ? res.drillPicList : [];
    formData.value.drillPicList = res.drillPicList.map((item: any) => {
      const fileName = item.fileName.split('//')[0];
      return { name: fileName, url: item.fileUrl, fileName: item.fileName };
    });
  };

  // -------------------- 表单 --------------------
  const formData = ref<AddExerciseRecordItemData>({
    tenantId: userStore.tenantId as string,
    drillplanId: route.query.id as string,
    participant: '',
    drillPicList: [],
    drillAssessList: [],
    agreementList: [],
  });
  formData.value.planTitle = route.query.planTitle as string;

  const form = ref();

  const rules = ref<any>({
    planTitle: [
      { required: true, message: '请输入计划名称' },
      { maxLength: 25, message: '不能超过25字符' },
    ],
    drillTime: [{ required: true, message: '请选择演练时间' }],
    participant: [
      { required: true, message: '请输入人员数量' },
      { match: /\d/, message: '请输入数字' },
      { type: 'number', min: 0, message: '不能小于0', trigger: 'blur' },
    ],
    drillSite: [
      { required: true, message: '请输入演练地点' },
      { maxLength: 60, message: '不能超过60字符' },
    ],
    drillContent: [{ required: true, message: '请输入演练内容' }],
  });

  const uploadPicSuccess = (e: FileItem, text: string) => {
    const {
      response: { data, code, msg },
    } = e;

    if (code < 200) {
      switch (text) {
        case 'drillAssess':
          const drillAssessList = formData.value.drillAssess
            ? formData.value.drillAssess.split(',')
            : [];
          data.forEach((item: any) => {
            drillAssessList.push(item.fileName);
          });
          formData.value.drillAssess = drillAssessList.join(',');
          break;
        case 'agreement':
          const agreementList = formData.value.agreement
            ? formData.value.agreement.split(',')
            : [];
          data.forEach((item: any) => {
            agreementList.push(item.fileName);
          });
          formData.value.agreement = agreementList.join(',');
          break;
        case 'drillPic':
          const drillPicList = formData.value.drillPic
            ? formData.value.drillPic.split(',')
            : [];
          data.forEach((item: any) => {
            drillPicList.push(item.fileName);
          });
          formData.value.drillPic = drillPicList.join(',');
          break;
        default:
          break;
      }
    } else {
      Message.error('上传失败，原因为' + msg);
    }
  };

  const beforeRemove = (file: any, text: string): Promise<boolean> => {
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
          let fileName = file.response
            ? file.response.data[0].fileName
            : file.fileName;
          switch (text) {
            case 'drillAssess':
              let drillAssessList = formData.value.drillAssess
                ? formData.value.drillAssess.split(',')
                : [];

              drillAssessList = drillAssessList.filter(
                (item: any) => item !== fileName
              );
              formData.value.drillAssess = drillAssessList.join(',');
              break;
            case 'agreement':
              let agreementList = formData.value.agreement
                ? formData.value.agreement.split(',')
                : [];
              agreementList = agreementList.filter(
                (item: any) => item !== fileName
              );
              formData.value.agreement = agreementList?.join(',');
              break;
            case 'drillPic':
              let drillPicList = formData.value.drillPic
                ? formData.value.drillPic.split(',')
                : [];
              drillPicList = drillPicList.filter(
                (item: any) => item !== fileName
              );
              formData.value.drillPic = drillPicList?.join(',');
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

    type === 'add' ? await addSubmit() : await editSubmit();
    goBack();
  };

  const addSubmit = async () => {
    await addExerciseRecordItemAPI(formData.value);
    Message.success('新增成功');
  };

  const editSubmit = async () => {
    await updateExerciseRecordItemAPI(formData.value);
    Message.success('编辑成功');
  };
</script>

<style lang="less" scoped>
  .arco-card.content-card {
    // min-height: 96%;
    .header {
      font-size: 18px;
      // font-weight: 700;
      margin-bottom: 20px;
      .title {
        margin-left: 8px;
      }
    }
    .form {
      width: 80%;
      min-height: calc(100vh - 265px);
      margin-bottom: 20px;
      .upload-tip {
        color: #f59b22;
      }
    }
    .table {
      width: 100%;
    }
  }

  .btn {
    margin-top: 12px;
    width: 100%;
    text-align: center;
  }

  .upload-tip {
    color: #f59b22;
  }
</style>
