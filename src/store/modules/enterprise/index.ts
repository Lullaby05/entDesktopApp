import { defineStore } from 'pinia';
import { EnterpriseInfoData, OrganizationTreeData } from './types';
import {
  businessTreeAPI,
  companyDetailByUserIdAPI,
  getOrganizationTreeAPI,
  getOrganizationTreeListAPI,
} from '@/api/enterpriseManage';
import type { GetOrganizationTreeData } from '@/api/enterpriseManage';

interface EnterpriseStore {
  enterpriseInfo: EnterpriseInfoData;
  organizationTree: OrganizationTreeData[];
  staffInfo: any;
}
const useEnterpriseStore = defineStore('enterprise', {
  state: (): EnterpriseStore => ({
    enterpriseInfo: { id: '' },
    organizationTree: [],
    staffInfo: {
      selectKeys: [],
    },
  }),

  getters: {},

  actions: {
    setEnterpriseInfo(info: EnterpriseInfoData) {
      this.enterpriseInfo = info;
    },
    // 根据用户id 获取企业详情
    async getEnterpriseInfo() {
      const { data: res } = await companyDetailByUserIdAPI();
      this.setEnterpriseInfo(res);
    },

    setOrganizationTree(tree: OrganizationTreeData[]) {
      this.organizationTree = tree;
    },
    async getOrganizationTree(params: GetOrganizationTreeData) {
      const { data: res } = await getOrganizationTreeAPI(params);
      this.setOrganizationTree(res);
    },
    async getOrganizationTreeList(params: GetOrganizationTreeData) {
      const { data: res } = await getOrganizationTreeListAPI(params);
      this.setOrganizationTree(res);
    },
    setStaffInfo(info: any) {
      this.staffInfo = info;
    },
    clearStaffInfo() {
      this.staffInfo = {
        selectKeys: [],
      };
    },
  },
  persist: {
    enabled: true,
  },
});

export default useEnterpriseStore;
