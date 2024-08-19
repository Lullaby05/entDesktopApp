import { useUserStore } from '@/store';
import { cloneDeep } from 'lodash';
import {
  getStaffDataAllAPI,
  getOrganizationTreeAPI,
  getStaffDataMapAll,
} from '@/api/enterpriseManage';
import { OrganizationTreeData } from '@/store/modules/enterprise/types';
import { onBeforeMount, ref } from 'vue';
import { StaffItem } from '@/views/enterpriseManage/staffManage';

export const useSearch = (initList = ['staffData', 'deptData', 'staffMap']) => {
  const userStore = useUserStore();
  //  ----------------- 获取员工数据 ----------------------
  // 全局只有一个staffData，但是这个staffData会根据不同的整改部门获取对应的员工列表
  const staffData = ref<StaffItem[]>([]);
  const staffDataMap = ref<Map<string, StaffItem[]>>(new Map());

  const getStaffData = async () => {
    const { data: resMap } = await getStaffDataMapAll({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });

    for (const key in resMap) {
      staffDataMap.value.set(key, resMap[key]);
    }
  };

  const getStaff = async () => {
    const { data: res } = await getStaffDataAllAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    staffData.value = res;
  };

  //  部门下拉查询相关
  const deptData = ref<OrganizationTreeData[]>([]);
  let depatTree: OrganizationTreeData[] = [];

  const getDeptData = async () => {
    const { data } = await getOrganizationTreeAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    deptData.value = data;
    depatTree = cloneDeep(deptData.value);
  };

  onBeforeMount(() => {
    initList.forEach((item) => {
      if (item === 'staffData') {
        getStaff();
      } else if (item === 'deptData') {
        getDeptData();
      } else if (item === 'staffMap') {
        getStaffData();
      }
    });
  });

  // 部门下拉搜索----------------start----------------
  function searchData(keyword: string, data: any[]) {
    const loop = (data: any) => {
      const result: OrganizationTreeData[] = [];
      data.forEach((item: any) => {
        if (item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
          result.push({ ...item });
        } else if (item.children) {
          const filterData = loop(item.children);
          if (filterData.length) {
            result.push({
              ...item,
              children: filterData,
            });
          }
        }
      });

      return result;
    };

    return loop(data);
  }

  // 根据id在树形表里搜索对应名称
  function searchNameById(id: string, data: any[]) {
    let result = '';
    const loop = (data: any) => {
      data.forEach((item: any) => {
        if (item.id === id) {
          result = item.name;
        } else if (item.children) {
          result = loop(item.children);
        }
      });
      return result;
    };
    return loop(data);
  }

  const onDeptSearch = (searchKey: string) => {
    setTimeout(() => {
      deptData.value = searchData(searchKey, depatTree);
    }, 200);
  };

  const clearSearchKey = () => {
    onDeptSearch('');
  };
  // 部门下拉搜索-----------------end---------------------

  return {
    staffData,
    deptData,
    searchData,
    onDeptSearch,
    clearSearchKey,
    searchNameById,
    staffDataMap,
  };
};
