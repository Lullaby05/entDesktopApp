import axios from 'axios';
import type { InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import { Message } from '@arco-design/web-vue';
import {
  getToken,
  getRefreshToken,
  setToken,
  setRefreshToken,
  setMonitorToken,
  setMonitorRefreshToken,
} from '@/utils/auth';
import { refreshToken } from './user';

let requestArr: any[] = []; //请求队列，是否正在刷新token
let isRefreshing: boolean = false;

export interface HttpResponse extends AxiosResponse {
  status: number;
  msg: string;
  code: number;
  data: any;
  type: string;
}

declare module 'axios' {
  interface AxiosResponse<T = any> {
    status: number;
    msg: string;
    code: number;
    data: T;
    type: string;
  }
  export function create(config?: AxiosRequestConfig): AxiosInstance;
}

const Axios = axios.create({
  baseURL: import.meta.env.VITE_API_UAA_URL,
  timeout: 30 * 1000,
});

Axios.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // instance = ElLoading.service({
    //   lock: true,
    //   text: '加载中...',
    //   background: 'rgba(0, 0, 0, 0.3)',
    // });
    // let each request carry token
    // this example using the JWT token
    // Authorization is a custom headers key
    // please modify it according to the actual situation
    const token = getToken();
    // if (token) {
    //   if (!config.headers) {
    //     config.headers = {};
    //   }
    //   config.headers.Authorization = `Bearer testSec_2_3${token}`;
    // }

    /* if (!config.headers) {
      config.headers = {};
    } */
    const url = config.url;
    const flag =
      url.indexOf('get-pag') > -1
        ? true
        : url.indexOf('get-liat') > -1
        ? true
        : false;
    if (config.data !== undefined && flag) {
      const params = config.data;
      const keys = Object.keys(params);
      // 清除数据为空的参数
      keys.forEach((e) => {
        if (params[e] === null || params[e] === undefined || params[e] === '') {
          delete params[e];
        }
      });
    }

    config.headers.Authorization = token;

    return config;
  },
  (error) => {
    // do something
    return Promise.reject(error);
  }
);

// add response interceptors
Axios.interceptors.response.use(
  (response: AxiosResponse<HttpResponse>) => {
    const res = response.data;
    // console.log('res=', res);
    // if the custom code is not 20000, it is judged as an error.
    if (res.code === 401) {
      const token = getToken();
      if (token) {
        //刷新token
        return refreshTokenFn(response.config);
      } else {
        Message.error({
          content: '请登录后重试',
          duration: 3 * 1000,
          async onClose() {
            await window.versions.logout();
          },
        });
      }
      return;
    }
    if (res.code > 200) {
      Message.error({
        content: res.msg || 'Error',
        duration: 5 * 1000,
      });
      // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
      // if (
      //   [50008, 50012, 50014].includes(res.code) &&
      //   response.config.url !== '/api/user/info'
      // ) {
      //   // Modal.error({
      //   //   title: 'Confirm logout',
      //   //   content:
      //   //     'You have been logged out, you can cancel to stay on this page, or log in again',
      //   //   okText: 'Re-Login',
      //   //   async onOk() {
      //   //     const userStore = useUserStore();

      //   //     await userStore.logout();
      //   //     window.location.reload();
      //   //   },
      //   // });

      // }
      return Promise.reject(new Error(res.msg));
    }
    return res;
  },
  (error) => {
    Message.error({
      content: error.msg || 'Request Error',
      duration: 5 * 1000,
    });
    return Promise.reject(error);
  }
);

async function refreshTokenFn(options: any) {
  if (!isRefreshing) {
    isRefreshing = true;
    const token = getRefreshToken();
    return refreshToken(token as string)
      .then((res: any) => {
        switch (res.data.code) {
          case 0:
            setToken(`Bearer ${res.data.data.accessToken}`);
            setRefreshToken(res.data.data.refreshToken);
            if (res.data.data.tbToken) {
              setMonitorToken(res.data.data.tbToken.token);
              setMonitorRefreshToken(res.data.data.tbToken.refreshToken);
            }
            // 重新请求队列
            requestArr.map((MT) => {
              MT();
            });
            requestArr = []; //清空队列
            return Axios(options);
          default:
            Message.error({
              content: '登录过期，请重新登录',
              duration: 3 * 1000,
              async onClose() {
                await window.versions.logout();
              },
            });
        }
      })
      .finally(() => {
        //解除正在刷新
        isRefreshing = false;
      });
  } else {
    // 返回未执行 resolve 的 Promise
    return new Promise((resolve) => {
      // 用函数形式将 resolve 存入，等待刷新后再执行
      requestArr.push((token) => {
        resolve(Axios(options));
      });
    });
  }
}

export default Axios;
