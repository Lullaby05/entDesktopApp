import { getFileUrlAPI } from '@/api';
import { Message, UploadRequest } from '@arco-design/web-vue';
//@ts-ignore
import { v4 as uuidv4 } from 'uuid';
const action = 'https://up-z2.qiniup.com';
// arco自定义上传文件
export const useCustomUpload = () => {
  //@ts-ignore
  const customRequest = async (option: any): UploadRequest => {
    const { fileItem } = option;
    const name = fileItem.name;
    const uuid = uuidv4();

    const formData = new FormData();
    formData.append('file', fileItem.file);
    formData.append(
      'token',
      'mMpWMB4QmZWyWB8A1_18YKAIpg_YS2GpNmk3y9z2:3VWoVvUskFr7bqLO4Ibz9EjPdm4=:eyJzY29wZSI6InhrcnRlc3QiLCJwZXJzaXN0ZW50T3BzIjoidmZyYW1lL2pwZy9vZmZzZXQvNyIsImRlYWRsaW5lIjo0MTg0MTI0NTg2fQ=='
    );
    formData.append(
      'key',
      name + '//' + uuid + name.substring(name.lastIndexOf('.'))
    );
    const { key } = await fetch(action, {
      method: 'POST',
      body: formData,
    }).then((res) => res.json());

    const {
      data: { url, coverUrl },
    } = await getFileUrlAPI(key);

    option.onSuccess({
      code: 0,
      data: [
        {
          fileName: key,
          filePath: url,
          coverUrl: coverUrl,
        },
      ],
    });
    return {
      abort: () => {},
    };
  };
  // 限制文件上传格式
  const beforeUpload = (file: File, fileAcceptStr: string = '') => {
    const fileAcceptStrWithBlank = fileAcceptStr.replaceAll(' ', '');
    if (fileAcceptStrWithBlank.includes('/')) {
      // 如果有/，则说明需要判断的是文件类型，但是也可能有多种文件类型
      const fileAcceptList = fileAcceptStrWithBlank
        .split(',')
        .map((item) => item.split('/').shift())
        .filter(Boolean);
      const isAccept = fileAcceptList.some((item: any) => {
        return file.type.includes(item);
      });
      if (!isAccept) {
        Message.warning('上传失败！上传文件格式有误，请重新上传');
        return false;
      }
    } else {
      const fileAcceptList = fileAcceptStrWithBlank.split(',');
      const isAccept = fileAcceptList.some((item) => {
        return file.name.endsWith(item);
      });
      if (!isAccept) {
        Message.warning('上传失败！上传文件格式有误，请重新上传');
        return false;
      }
    }
    if (!file.size) {
      Message.warning('上传失败，不能上传空文件！');
      return false;
    }
    return true;
  };
  return {
    customRequest,
    beforeUpload,
  };
};
