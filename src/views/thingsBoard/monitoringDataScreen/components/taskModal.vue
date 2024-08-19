<template>
  <a-modal
    v-model:visible="visible"
    :footer="false"
    simple
    width="33.18vw"
    modal-class="task-modal"
  >
    <div class="task-modal-container">
      <div class="title">
        <span>新增处置任务</span>
      </div>
      <div class="content">
        <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
          <a-form-item field="taskContent" label="任务内容">
            <a-textarea
              :max-length="500"
              :auto-size="{
                minRows: 6,
                maxRows: 6,
              }"
              show-word-limit
              v-model="form.taskContent"
              allow-clear
              placeholder="请输入任务内容"
            />
          </a-form-item>
          <a-form-item field="disposeIds" label="处置人">
            <div class="dispose-person-tags">
              <a-button type="primary" @click="openDrawer">选择</a-button>
              <div class="tags">
                <a-tag
                  color="#07113f"
                  v-for="(item, index) in form.disposeIds"
                  :key="item.id"
                  closable
                  @close="
                    () => {
                      form.disposeIds.splice(index, 1);
                    }
                  "
                  >{{ item.userName }}</a-tag
                >
              </div>
            </div>
          </a-form-item>
          <a-form-item field="agreement" label="附件">
            <a-space>
              <a-upload
                v-model:file-list="form.agreement"
                action=""
                :custom-request="customRequest"
                multiple
                accept=".rar,.zip,.doc,.docx,.pdf,.jpg,.png"
                tip="支持扩展名：.rar   .zip   .doc   .docx   .pdf   .jpg   .png..."
                @before-upload="
                  (e) => beforeUpload(e, '.rar,.zip,.doc,.docx,.pdf,.jpg,.png')
                "
                @success="onSuccess"
                @before-remove="beforeRemove"
              >
              </a-upload>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
      <div class="btn-group">
        <a-button @click="handleCancel">取消</a-button>
        <a-button type="primary" @click="handleBeforeOk">{{
          form.disposeIds.length ? '下发' : '保存'
        }}</a-button>
      </div>
      <div class="close-icon" @click="handleCancel">
        <img src="@/assets/image/close-btn-icon.png" alt="" />
      </div>
    </div>
  </a-modal>
  <handlePersonDrawer
    v-model:tableData="form.disposeIds"
    ref="personDrawerRef"
    :deptData="deptData"
  />
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { FileItem, Form, Message } from '@arco-design/web-vue';
  import { addTask } from '@/api/thingsBoard';
  import handlePersonDrawer from './handlePersonDrawer.vue';
  import { useSearch } from '@/views/pitfall/snapshot/composition/useSearch';
  import { useUpload } from '@/views/pitfall/snapshot/composition/useUpload';

  const form = ref<any>({
    disposeIds: [],
    agreement: [],
  });
  const id = ref<string>('');
  const formRef = ref<InstanceType<typeof Form> | null>(null);
  const visible = ref(false);
  const emits = defineEmits(['ok']);
  const rules = {
    taskContent: [
      { required: true, message: '请输入任务内容', trigger: 'blur' },
    ],
  };
  const open = (eventRecordId: string) => {
    visible.value = true;
    form.value = {
      disposeIds: [],
      agreement: [],
    };
    id.value = eventRecordId;
  };
  const handleCancel = () => {
    visible.value = false;
    form.value = {
      disposeIds: [],
      agreement: [],
    };
  };
  const handleBeforeOk = async () => {
    const result = await formRef.value?.validate();
    if (result) return false;
    const params = {
      ...form.value,
      disposeId: form.value.disposeIds.map((item: any) => item.id).join(','),
      eventRecordId: id.value,
      agreement: form.value.agreement.map((item: FileItem) => {
        return {
          filePath: item.url,
          fileName: item.name,
          coverUrl: item.response.data[0].coverUrl,
          fileType: 'attachment',
        };
      }),
    };
    await addTask(params);
    Message.success('新增成功');
    visible.value = false;
    form.value = {
      disposeIds: [],
      agreement: [],
    };
    emits('ok');
  };

  const { customRequest, beforeUpload, onSuccess, beforeRemove } = useUpload(
    form,
    'agreement'
  );
  defineExpose({
    open,
  });

  const { deptData } = useSearch(['deptData']);
  const personDrawerRef = ref<InstanceType<typeof handlePersonDrawer> | null>(
    null
  );
  const openDrawer = () => {
    // do something
    personDrawerRef.value?.open();
  };
</script>
<style lang="less" scoped>
  .task-modal-container {
    .dispose-person-tags {
      display: flex;
      gap: 1rem;
      .tags {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
      }
    }
  }
</style>
<style lang="less">
  .task-modal {
    padding: 0;
    border-radius: 4px;
    background: rgb(29, 38, 80);
    border: 0.5px solid rgba(48, 97, 219, 1);
    box-shadow: 0px 0px 3px rgba(3, 255, 246, 0.34);
    .arco-modal-header {
      margin: 0;
    }
    .task-modal-container {
      padding: 2.14rem;
      position: relative;
      font-size: 1rem;
      color: #ffffff;
      overflow: hidden;
      .title {
        font-size: 1.29rem;
        font-weight: 700;
        letter-spacing: -0.29px;
        line-height: 1.29rem;
        margin-bottom: 2.14rem;
        color: rgba(255, 255, 255, 0.9);
      }
      .content {
        height: 50vh;
        .arco-form-item-label {
          --color-text-2: #fffffff;
          font-weight: 700;
          font-family: 'Alibaba-Medium';
        }
        .arco-textarea-wrapper {
          --color-text-1: #ffffff;
          --color-fill-2: rgb(7, 17, 63);
          --color-bg-2: rgb(7, 17, 63);
          &:hover {
            --color-fill-3: rgb(7, 17, 63);
          }
        }
        .dispose-person-tags button {
          width: 80px;
          height: 22px;
          opacity: 1;
          border-radius: 2px;
          background: rgba(42, 130, 228, 1);
          font-size: 12px;
        }
        .arco-upload-wrapper {
          .arco-upload button {
            height: 22px;
            opacity: 1;
            border-radius: 2px;
            background: rgba(42, 130, 228, 1);
            font-size: 12px;
          }
          .arco-upload-tip {
            margin-top: 10px;
            font-size: 12px;
            font-weight: 400;
            letter-spacing: 0px;
            line-height: 12px;
            color: rgba(255, 255, 255, 1);
          }
          .arco-upload-list {
            height: 160px;
            width: 30vw;
            overflow-x: hidden;
            overflow-y: auto;
            .arco-upload-list-item:first-of-type {
              margin-top: 12px;
            }
          }
          .arco-upload-list-item-content {
            --color-fill-1: rgb(7, 17, 63);
            --color-text-1: #ffffff;
            --link-6: 255, 255, 255;
            --primary-6: 255, 255, 255;
          }
        }
      }
      .close-icon {
        position: absolute;
        top: 30px;
        right: 30px;
        cursor: pointer;
        img {
          width: 20px;
          height: 20px;
        }
      }
      .btn-group {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-top: 1rem;
        gap: 1rem;
        button {
          width: 100px;
          height: 22px;
          opacity: 1;
          border-radius: 2px;
          background: rgba(42, 130, 228, 1);
          font-size: 12px;
          color: #ffffff;
          &:nth-of-type(1) {
            background: rgba(128, 128, 128, 1);
          }
        }
      }
    }
  }
</style>
