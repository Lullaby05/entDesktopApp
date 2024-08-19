import { defineStore } from 'pinia';
import {
  login as userLogin,
  getUserInfo,
  LoginData,
  login,
  loginByPhone,
  getMenu,
  getBtnPermission,
  loginV2,
  loginByPhoneV2,
  getTokenByTenant,
} from '@/api/user';
import {
  setToken,
  clearToken,
  setRefreshToken,
  setMonitorToken,
  setMonitorRefreshToken,
} from '@/utils/auth';
import { useAppStore } from '@/store';
import { reject } from 'lodash';

const useUserStore = defineStore('user', {
  state: (): any => ({
    deptId: '',
    deptName: '',
    enterpriseId: '',
    enterpriseName: '',
    entryDate: '',
    enterPriseUserId: '',
    incumbencyStatus: undefined,
    jobId: '',
    jobName: '',
    jobNumber: '',
    postName: '',
    safeDeptId: '',
    sex: undefined,
    sexName: '',
    tel: '',
    updateTime: '',
    userId: '',
    userName: '',
    workTypeId: '',
    workTypeName: '',
    avatar: '',
    email: '',
    id: undefined,
    mobile: '',
    name: '',
    nickname: '',
    postIds: [],
    sign: undefined,
    status: 0,
    username: '',
    loginEnterpriseList: [],
  }),

  getters: {
    userInfo(state: any): any {
      return this.$state;
      // return { ...state };
    },
    enterpriseList(state: any): any {
      return state.loginEnterpriseList;
    },
  },

  actions: {
    setName(name: string) {
      this.name = name;
    },
    switchRoles() {
      return new Promise((resolve) => {
        this.role = this.role === 'user' ? 'admin' : 'user';
        resolve(this.role);
      });
    },
    // Set user's information
    setInfo(partial: any) {
      this.$patch(partial);
    },
    setEnterpriseList(enterpriseList: any[]) {
      this.loginEnterpriseList = enterpriseList;
    },
    // Reset user's information
    resetInfo() {
      this.$reset();
    },

    // Get user's information
    async info() {
      const res = await getUserInfo();
      console.log('userstore-info-res:', res);
      // this.setInfo(res.data);
    },

    // Login
    async login(loginForm: LoginData, title: string) {
      try {
        // 调接口登录获取数据
        const loginApi = title === '1' ? loginV2 : loginByPhoneV2;
        const params = {
          condition: encodeURIComponent(loginForm.username),
          password: encodeURIComponent(loginForm.password),
          mobile: loginForm.phone,
          code: loginForm.verifyCode,
        };
        const { data: enterpriseList } = await loginApi(params);
        if (enterpriseList.length === 1) {
          const { data } = await getTokenByTenant(enterpriseList[0]);
          await this.getUserBasicInfo(data);
          return true;
        } else {
          return { enterpriseList };
        }
      } catch (err) {
        clearToken();
        // throw err;
        // setToken(`Bearer testSec_1_1`);
        console.log('err=', err);
        // this.setInfo(userInfo.user);
        return false;
      }
    },
    getUserBasicInfo(data: any) {
      return new Promise(async (resolve, reject) => {
        try {
          // 保存token，请求用户信息
          setToken(`Bearer ${data.accessToken}`);
          setRefreshToken(data.refreshToken);
          if (data.tbToken) {
            setMonitorToken(data.tbToken.token);
            setMonitorRefreshToken(data.tbToken.refreshToken);
          }

          // setToken(`Bearer testSec_1_1`);
          // 获取并保存，保存用户信息和员工信息
          const { data: info } = await getUserInfo();

          const { data: menu } = await getMenu();
          // const { data: menu } = dataTree;
          // const res: any = await userLogin(loginForm);
          const { data: btn } = await getBtnPermission();
          console.log('success', data, info);
          // this.$state = info
          this.setInfo({
            ...info.employeeInfo,
            ...info.userInfo,
            avatar:
              info.userInfo.avatar ||
              'https://prodapi.xkrsecure.com/icon/icon-default-avatar.png',
            deptName: info.userInfo.deptName || info.employeeInfo.deptName,
            enterPriseUserId: info.employeeInfo.id || -1,
            tenantId: info.tenantId,
            menu,
            btn,
          });
          resolve(true);
        } catch (err) {
          reject();
        }
      });
    },
    logoutCallBack() {
      const appStore = useAppStore();
      this.resetInfo();
      clearToken();
      appStore.clearServerMenu();
    },
    // Logout
    async logout() {
      try {
        // await userLogout();
      } finally {
        this.logoutCallBack();
      }
    },
  },
  persist: {
    enabled: true,
  },
});

export default useUserStore;
