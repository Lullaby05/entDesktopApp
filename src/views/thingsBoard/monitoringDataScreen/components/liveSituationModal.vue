<template>
  <a-modal
    v-model:visible="visible"
    :footer="false"
    simple
    modal-class="live-modal"
    width="33.18vw"
  >
    <div class="live-modal-container">
      <div class="title">
        <span>现场情况</span>
      </div>
      <div class="content">
        <a-form
          :label-col-props="{ span: 6 }"
          :wrapper-col-props="{ span: 18 }"
          ref="formRef"
          :model="form"
          layout="vertical"
        >
          <a-form-item field="taskContent" label="现场情况">
            <a-textarea
              :max-length="500"
              :auto-size="{
                minRows: 6,
                maxRows: 6,
              }"
              show-word-limit
              v-model="form.taskContent"
              allow-clear
              placeholder="请输入现场情况"
            />
          </a-form-item>
          <a-form-item field="agreement" label="现场图片/视频">
            <a-space>
              <a-upload
                v-model:file-list="form.agreement"
                action=""
                :custom-request="customRequest"
                accept=".jpg,.png,.jpeg,.mp4,.mkv,.avi"
                tip="支持扩展名：.jpg   .png   .jpeg   .mp4   .mkv   .avi..."
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
        <a-button type="primary" @click="handleBeforeOk">保存</a-button>
      </div>
      <div class="close-icon" @click="handleCancel">
        <img src="@/assets/image/close-btn-icon.png" alt="" />
      </div>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { FileItem, Form, Message, Modal } from '@arco-design/web-vue';
  import { addEventRecord } from '@/api/thingsBoard';
  import { useUpload } from '@/views/pitfall/snapshot/composition/useUpload';

  const form = ref<any>({
    agreement: [],
  });
  const id = ref<string>('');
  const formRef = ref<InstanceType<typeof Form> | null>(null);
  const visible = ref(false);
  const emits = defineEmits(['ok']);
  const open = (eventRecordId: string) => {
    visible.value = true;
    form.value = {
      agreement: [],
    };
    id.value = eventRecordId;
  };
  const handleCancel = () => {
    visible.value = false;
    form.value = {
      agreement: [],
    };
  };
  const handleBeforeOk = async () => {
    const { taskContent, agreement } = form.value;
    if (!taskContent && !agreement.length) {
      Message.warning('现场情况和现场图片/视频至少填写一项');
      return;
    }
    const params = {
      ...form.value,
      eventRecordId: id.value,
      agreement: form.value.agreement.map((item: FileItem) => {
        const type = item.file?.type.includes('image') ? 'image' : 'video';
        return {
          filePath: item.url,
          fileName: item.name,
          coverUrl: item.response.data[0].coverUrl,
          fileType: type,
        };
      }),
    };
    await addEventRecord(params);
    Message.success('新增成功');
    visible.value = false;
    form.value = {
      agreement: [],
    };
    emits('ok');
  };

  const { beforeUpload, customRequest, onSuccess, beforeRemove } = useUpload(
    form,
    'agreement'
  );
  defineExpose({
    open,
  });
</script>
<style lang="less" scoped>
  .live-modal-container {
  }
</style>
<style lang="less">
  .live-modal {
    padding: 0;
    border-radius: 4px;
    background: rgb(29, 38, 80);
    border: 0.5px solid rgba(48, 97, 219, 1);
    box-shadow: 0px 0px 3px rgba(3, 255, 246, 0.34);
    .arco-modal-header {
      margin: 0;
    }
    .live-modal-container {
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
            height: 250px;
            width: 30vw;
            overflow-x: hidden;
            overflow-y: auto;
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
