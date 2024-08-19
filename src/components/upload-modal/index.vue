<!-- 批量导入 / 文件图片上传 弹窗 -->
<template>
  <a-modal
    :visible="props.showUploadModal"
    :title="props.title"
    :footer="false"
    title-align="start"
    :modal-style="{ maxWidth: '800px', maxHeight: '800px', overflow: 'auto' }"
    @cancel="handleCancel"
  >
    <div class="box">
      <a-upload action="/">
        <template #upload-button>
          <div class="upload-button">
            <div class="img"><icon-upload size="60px" /></div>
            <div class="text">点击上传</div>
          </div>
        </template>
      </a-upload>

      <div class="message">
        <div v-if="props.message" ref="message">{{ props.message }}</div>
        <div v-else>
          1、只能上传与平台模板匹配的xlsx的Excel文件，且大小不能超过20M。<br />
          2、导入前必须配置好平台部门、岗位，否则将会导入失败。<br />
          3、工号作为唯一标识，相同工号的用户数据重复导入将会进行数据更新。<br />
        </div>
        <div v-if="needDownload" class="download">
          <icon-to-bottom />模板下载
        </div>
      </div>
      <div class="btn">
        <a-space>
          <a-button type="primary" status="success" @click="handleCancel"
            >关闭</a-button
          >
        </a-space>
      </div>
    </div>
  </a-modal>
</template>

<script lang="ts">
  export default {};
</script>

<script lang="ts" setup>
  const props = defineProps({
    showUploadModal: {
      type: Boolean,
      default: false,
      required: true,
    },
    title: {
      type: String,
      default: '文件上传窗口',
    },
    needDownload: {
      type: Boolean,
      default: false,
    },
    message: {
      type: String,
    },
  });
  const emit = defineEmits(['closeUploadModal']);
  const handleCancel = () => {
    emit('closeUploadModal');
  };
</script>

<style lang="less" scoped>
  .box {
    .upload-button {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 480px;
      height: 200px;
      margin-bottom: 20px;
      border: 1px dashed #409eff;
      border-radius: 6px;
      .img {
        color: #c0c4cc;
        margin-bottom: 10px;
      }
      .text {
        color: #409eff;
      }
    }
    .message {
      font-size: 14px;
      color: #606266;
      .download {
        color: #409eff;
      }
    }
    .btn {
      margin-top: 30px;
      display: flex;
      justify-content: center;
    }
  }
</style>
