import { ref } from 'vue';
import {
  FileItem,
  UploadRequest,
} from '@arco-design/web-vue/es/upload/interfaces';
import { Message } from '@arco-design/web-vue';
import { useCustomUpload } from '@/hooks/customUpload';

export const useUpload = (formData: any, field: string) => {
  const headers = ref<Record<string, string>>({
    Authorization: 'Bearer testSec_1_1',
  });

  // 上传
  const { customRequest, beforeUpload } = useCustomUpload();
  // const action =
  //   import.meta.env.VITE_API_BASE_URL +
  //   '/businessApi/business/upload/upload-video';
  const action = 'https://up-z2.qiniup.com';
  let fileList = formData.value[field];

  // 上传成功回调函数
  const onSuccess = (fileItem: FileItem) => {
    const result = fileItem.response;
    const code = result.code;

    let copyFileList: FileItem[] = fileList;

    if (code > 200) {
      Message.error({
        content: '上传失败，原因为=' + result.msg,
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

    // 过滤相同的文件
    const flag = copyFileList.find(
      (item: any) => item.fileName === result.data[0].fileName
    );
    if (flag) {
      return;
    }

    fileItem.url = result.data[0].filePath;
    copyFileList.push(fileItem);
    fileList.map((item: any) => {
      const type = item.file.type.includes('images') ? 'image' : 'video';
      if (type === 'image') {
        return {
          name: item.fileName,
          url: item.filePath,
          sourceUrl: item.filePath,
          fileType: 'image',
        };
      }
      return {
        name: item.fileName,
        url: item.coverUrl,
        sourceUrl: item.filePath,
        fileType: 'video',
      };
    });
  };

  // 删除回调函数
  const beforeRemove = (fileItem: FileItem) => {
    return new Promise<boolean>((resolve) => {
      let copyFileList: FileItem[] = fileList;

      const index = copyFileList.findIndex((item) => item.uid === fileItem.uid);
      copyFileList.splice(index, 1);

      resolve(true);
    });
  };

  return {
    headers,
    action,
    fileList,
    onSuccess,
    beforeRemove,
    customRequest,
    beforeUpload,
  };
};
