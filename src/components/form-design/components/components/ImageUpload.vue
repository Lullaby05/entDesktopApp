<template>
  <div>
    <div v-if="mode === 'DESIGN'">
      <div class="design">
        <icon name="el-icon-plus"></icon>
      </div>
      <p>{{ placeholder }} {{ sizeTip }}</p>
    </div>
    <div v-else-if="mode === 'PC' && !readonly">
      <el-upload
        v-model:file-list="fileList"
        action="#"
        :limit="maxNumber"
        accept="image/*,video/*"
        :data="uploadParams"
        with-credentials
        :multiple="maxNumber > 1"
        :on-success="uploadSuccess"
        :on-preview="handlePictureCardPreview"
        :on-remove="handleRemove"
        :on-exceed="overLimit"
        :on-error="uploadFail"
        list-type="picture-card"
        auto-upload
        :before-upload="beforeUpload"
        :http-request="uploadFile"
      >
        <template #default>
          <icon name="el-icon-plus"></icon>
        </template>
        <template #tip>
          <div class="el-upload__tip">{{ placeholder }} {{ sizeTip }}</div>
        </template>
      </el-upload>
    </div>
    <div v-else-if="mode === 'MOBILE' && !readonly">
      <uploader
        :disabled="disabled"
        v-model="fileList"
        accept="image/*,video/*"
        :multiple="maxNumber > 1"
        :max-count="maxNumber > 0 ? maxNumber : 99"
        :deletable="!disabled"
        :before-delete="handleRemove"
        :before-read="beforeUpload"
        upload-text="选择图片"
        :after-read="afterRead"
        :max-size="maxSize * 1024 * 1024"
        @oversize="onOversize"
      />
      <div style="color: #9b9595">{{ placeholder }} {{ sizeTip }}</div>
    </div>
    <div v-else class="img-preview">
      <div class="img-preview-pc">
        <el-image
          :alt="img.name"
          :src="$getRes(img.url)"
          v-for="img in _value"
          :preview-src-list="pcImgList"
        />
      </div>
    </div>
  </div>
</template>

<script>
  import { Uploader, showSuccessToast, showFailToast } from 'vant';
  import componentMinxins from '../ComponentMinxins';
  import Axios from '@/api/interceptor';
  import { v4 as uuidv4 } from 'uuid';
  import { getFileUrlAPI } from '@/api';
  const UPLOAD_URL = 'https://up-z2.qiniup.com';
  const UPLOAD_TOKEN =
    'mMpWMB4QmZWyWB8A1_18YKAIpg_YS2GpNmk3y9z2:3VWoVvUskFr7bqLO4Ibz9EjPdm4=:eyJzY29wZSI6InhrcnRlc3QiLCJwZXJzaXN0ZW50T3BzIjoidmZyYW1lL2pwZy9vZmZzZXQvNyIsImRlYWRsaW5lIjo0MTg0MTI0NTg2fQ==';

  export default {
    mixins: [componentMinxins],
    name: 'ImageUpload',
    components: { Uploader },
    props: {
      modelValue: {
        type: Array,
        default: () => {
          return [];
        },
      },
      placeholder: {
        type: String,
        default: '请选择图片',
      },
      maxSize: {
        type: Number,
        default: 100,
      },
      videoMaxSize: {
        type: Number,
        default: 100,
      },
      maxNumber: {
        type: Number,
        default: 9,
      },
      enableZip: {
        type: Boolean,
        default: true,
      },
    },
    computed: {
      sizeTip() {
        return this.maxSize > 0 ? `| 每张图不超过${this.maxSize}MB` : '';
      },
      pcImgList() {
        return this._value.map((v) => this.$getRes(v.url));
      },
      fileList() {
        return this._value.map((f) => {
          return {
            name: f.name,
            url: f.url,
            sourceUrl: f.sourceUrl,
            isImage: f.fileType === 'image',
            status: 'success',
          };
        });
      },
    },
    data() {
      return {
        loading: false,
        uploadUrl: `/businessApi/business/upload/upload-video`,
        uploadParams: { isImg: true },
        catchList: [],
        alows: [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/jpg',
          'video/mp4',
        ],
      };
    },
    methods: {
      beforeUpload(file) {
        this.catchList.length = 0;
        if (Array.isArray(file)) {
          for (let i = 0; i < file.length; i++) {
            if (!this.validImage(file[i])) {
              return false;
            }
          }
          return true;
        } else {
          return this.validImage(file);
        }
      },
      validImage(img) {
        const imageType = img.type.includes('image') ? 'image' : 'video';
        if (this.alows.indexOf(img.type) === -1) {
          showFailToast('存在不支持的格式');
        } else if (
          imageType === 'image' &&
          this.maxSize > 0 &&
          img.size / 1024 / 1024 > this.maxSize
        ) {
          showFailToast(`单张图片最大不超过 ${this.maxSize}MB`);
        } else if (
          imageType === 'video' &&
          this.videoMaxSize > 0 &&
          img.size / 1024 / 1024 > this.videoMaxSize
        ) {
          showFailToast(`单个视频最大不超过 ${this.videoMaxSize}MB`);
        } else {
          this.loading = true;
          return true;
        }
        return false;
      },
      removeFile(fileName) {
        Axios.post(
          `/businessApi/business/upload/remove?fileName=${fileName}`
        ).then((rsp) => {
          // this.$message.success('移除文件成功');
        });
      },
      uploadSuccess(response, file, fileList) {
        this.loading = false;
        this.catchList.push(response);
        let ft = fileList.filter((f) => f.size !== undefined);
        if (this.catchList.length === ft.length) {
          this._value.push(...this.catchList);
          this.$emit('update:modelValue', this._value);
        }
        // this.$message.success(response.name + '上传成功');
      },
      uploadFail(err) {
        this.loading = false;
        // this.$message.error('图片上传失败 ' + err);
      },
      afterRead(file) {
        if (Array.isArray(file)) {
          file.forEach((fl) => {
            this.uploadFile(fl);
          });
        } else {
          this.uploadFile(file);
        }
      },
      async uploadFile(file) {
        //上传文件
        const uuid = uuidv4();
        const imageType = file.file.type.includes('image') ? 'image' : 'video';
        const formData = new FormData();
        formData.append('file', file.file);
        formData.append('token', UPLOAD_TOKEN);
        formData.append(
          'key',
          file.file.name +
            '//' +
            uuid +
            file.file.name.substring(file.file.name.lastIndexOf('.'))
        );
        try {
          const { key } = await fetch(UPLOAD_URL, {
            method: 'POST',
            body: formData,
          }).then((res) => res.json());

          const {
            data: { url, coverUrl },
          } = await getFileUrlAPI(key);

          if (imageType === 'video') {
            this._value.push({
              name: key,
              url: coverUrl,
              sourceUrl: url,
              fileType: 'video',
            });
          } else {
            this._value.push({
              name: key,
              url,
              sourceUrl: url,
              fileType: 'image',
            });
          }
          this.$emit('update:modelValue', this._value);
          showSuccessToast('上传成功');
        } catch (err) {
          showFailToast('上传失败');
          console.log(err);
        }

        // Axios.post(this.uploadUrl, formData, {
        //   'Content-type': 'multipart/form-data',
        // }).then(
        //   (res) => {

        //   },
        //   (err) => {
        //     showFailToast('上传失败');
        //     console.log(err);
        //   }
        // );
      },
      overLimit() {
        if (this.mode === 'PC') {
          this.$message.warning('最多只能上传' + this.maxNumber + '张图片');
        } else {
          showFailToast('数量超出限制');
        }
      },
      onOversize(file) {
        showFailToast('图片过大');
      },
      handleRemove(file, fileList) {
        let i = this._value.findIndex((v) => v.name === file.name);
        if (i > -1) {
          this.removeFile(this._value[i].name);
          this._value.splice(i, 1);
          this.$emit('update:modelValue', this._value);
        }
        console.log('删除文件', file);
      },
      handlePictureCardPreview(file) {
        window.open(file.sourceUrl, '_blank');
      },
      handleDownload(file) {
        console.log(file);
      },
    },
    emits: ['update:modelValue'],
  };
</script>

<style lang="less" scoped>
  .design {
    :deep(.icon) {
      padding: 10px;
      font-size: xx-large;
      background: var(--color-bg-2);
      border: 1px dashed #8c8c8c;
    }
  }
  :deep(.el-upload--picture-card) {
    width: 80px;
    height: 80px;
    line-height: 87px;
  }
  :deep(.el-upload-list__item) {
    width: 80px;
    height: 80px;
    transition: none;
    .el-upload-list__item-actions {
      & > span + span {
        margin: 1px;
      }
    }
  }
  // :deep(.el-upload-list__item-preview) {
  //   display: none !important;
  // }
  .img-preview {
    :deep(.img-preview-pc) {
      .el-image {
        width: 80px;
        height: 80px;
        margin: 5px;
      }
    }
  }
</style>
