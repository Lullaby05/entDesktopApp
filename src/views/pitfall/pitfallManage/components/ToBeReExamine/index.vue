<!-- 隐患管理：隐患管理--整改待复审 -->
<template>
  <TableListCard>
    <template #headerInput>
      <a-form ref="selectFormDom" :model="selectForm" layout="inline">
        <a-form-item field="hazardDesc" label="隐患描述">
          <a-input
            v-model.trim="selectForm.hazardDesc"
            placeholder="请输入隐患描述"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="hazardAddr" label="隐患位置">
          <a-input
            v-model.trim="selectForm.hazardAddr"
            placeholder="请输入隐患位置"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="dangerLevelCode" label="隐患级别">
          <a-select
            v-model="selectForm.dangerLevelCode"
            placeholder="请选择隐患级别"
            allow-search
            allow-clear
          >
            <a-option
              v-for="item in dangerLevel"
              :key="item.dictKey"
              :value="item.dictKey"
              >{{ item.dictValue }}</a-option
            >
          </a-select>
        </a-form-item>
        <a-form-item field="rectifyId" label="整改责任人">
          <a-select
            v-model="tempSearchForm.rectifyId"
            allow-clear
            allow-search
            placeholder="请选择整改责任人"
          >
            <a-option
              v-for="item in staffData"
              :key="item.id"
              :value="item.id"
              :label="item.userName"
            ></a-option>
          </a-select>
          <!-- <a-input
            v-model="selectForm.rectifyName"
            placeholder="请输入整改责任人"
            allow-clear
          ></a-input> -->
        </a-form-item>
        <a-form-item field="rectifyDepartId" label="整改责任部门">
          <a-tree-select
            v-model="selectForm.rectifyDepartId"
            :fallback-option="false"
            placeholder="请选择整改责任部门"
            allow-search
            allow-clear
            :disable-filter="true"
            :field-names="{
              key: 'id',
              title: 'name',
            }"
            :data="deptData"
            @search="onDeptSearch"
            @blur="clearSearchKey"
            @clear="clearSearchKey"
          ></a-tree-select>
        </a-form-item>
        <a-form-item field="rectifyCount" label="整改次数">
          <a-input
            v-model.trim="selectForm.rectifyCount"
            placeholder="请输入整改次数"
            allow-clear
          ></a-input>
        </a-form-item>
      </a-form>
    </template>
    <template #headerBtn>
      <a-space direction="vertical" :size="[0, 10]">
        <a-button
          type="primary"
          @click="
            () => {
              selectForm.value = tempSearchForm.value;
              getPageData();
            }
          "
        >
          <icon-search class="icon" />
          查询
        </a-button>
        <a-button @click="resetSelectForm">
          <icon-refresh class="icon" />
          重置
        </a-button>
      </a-space>
    </template>
    <template #primaryBtn>
      <a-space>
        <a-button
          type="primary"
          @click="
            downloadFile(
              'https://business.api.xkrsecure.com/exportFiles/2024年第一季度隐患检查治理报告.doc'
            )
          "
          >导出</a-button
        >
      </a-space>
    </template>
    <template #minorBtn>
      <a-space>
        <icon-question-circle
          style="cursor: pointer"
          size="20"
          @click="handleOperationGuide"
        />
        <icon-refresh class="minor-icon" size="20" @click="refresh" />
      </a-space>
    </template>
    <template #table>
      <a-table
        :data="props.tableData.list"
        row-key="id"
        :columns="columns"
        :bordered="false"
        :pagination="false"
      >
        <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
        <template #option="{ record }">
          <a-button
            v-if="
              !record.prefillVerifierId
                ? (recheckPermission & props.permission) === recheckPermission
                : record.prefillVerifierId === userInfo.enterPriseUserId
            "
            v-permission="'PitfallManageRecheck'"
            type="text"
            size="mini"
            @click="toEditPage('reexamine', record)"
          >
            复审
          </a-button>
          <a-button
            type="text"
            size="mini"
            @click="toEditPage('toDetail', record)"
          >
            详情
          </a-button>
        </template>
      </a-table>
    </template>
    <template #pagination>
      <a-pagination
        :current="selectForm.pageNo"
        :page-size="selectForm.pageSize"
        show-total
        show-page-size
        :page-size-options="[10, 20, 50, 100]"
        :total="props.tableData.total"
        @change="currentChange"
        @page-size-change="pageSizeChange"
      ></a-pagination>
    </template>
  </TableListCard>
  <!-- 指引弹窗 -->
  <GuideProgress
    title="隐患处理流程"
    v-model:visible="guideVisible"
    :guideItems="guideItems"
  />
</template>

<script lang="ts">
  import { onBeforeMount, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { cloneDeep } from 'lodash';
  import { useUserStore } from '@/store';
  import {
    getStaffDataAllAPI,
    getOrganizationTreeAPI,
  } from '@/api/enterpriseManage';
  import type { WorkTypeData } from '@/views/enterpriseManage/workType/index';
  import type { StaffItem } from '@/views/enterpriseManage/staffManage/index';
  import type { OrganizationTreeData } from '@/store/modules/enterprise/types';
  import type { TableColumnData } from '@arco-design/web-vue';
  import { dictResponseType, getPitfallDicApi } from '@/api';
  import { handleOnKeyup } from '@/utils/event';
  import { downloadFile } from '@/utils/utils';
  import GuideProgress from '@/components/operationGuide/guideProgress.vue';
  import { useOperationGuide } from '../../composition/operationGuide';
  export default {
    // name: 'WorkType',
  };
</script>

<script lang="ts" setup>
  const props = defineProps({
    tableData: {
      type: Object,
      default: () => {
        return {
          total: 0,
          list: [],
        };
      },
    },
    permission: {
      type: Number,
      default: 0b000,
    },
  });
  const emits = defineEmits(['getTableData']);
  const router = useRouter();
  const userStore = useUserStore();
  const userInfo = computed(() => {
    return userStore.userInfo;
  });

  const recheckPermission = 0b001;

  //  ----------------- 前置数据 ----------------------
  // 隐患等级字典
  const dangerLevel = ref<dictResponseType[]>([]);
  onBeforeMount(async () => {
    // 字典值获取
    const dangerLevelRes = await getPitfallDicApi('hid_danger_level');
    dangerLevel.value = dangerLevelRes.data;
  });
  const staffData = ref<StaffItem[]>([]);

  const getStaffData = async () => {
    const { data: res } = await getStaffDataAllAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });

    staffData.value = res;
  };

  getStaffData();

  const deptData = ref<OrganizationTreeData[]>([]);
  let depatTree: OrganizationTreeData[] = [];

  const getDeptData = async () => {
    const { data } = await getOrganizationTreeAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    deptData.value = data;
    depatTree = cloneDeep(deptData.value);
  };

  getDeptData();

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
      // console.log(result);

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

  // ----------------- 查询-------------------------------

  const selectForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
    enterpriseId: userStore.userInfo.enterpriseId as string,
  });
  const tempSearchForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
    enterpriseId: userStore.userInfo.enterpriseId as string,
  });
  const selectFormDom = ref();

  const getPageData = async () => {
    const params = {
      ...selectForm.value,
    };
    emits('getTableData', params);
  };

  getPageData();

  onActivated(() => {
    getPageData();
  });

  const resetSelectForm = () => {
    selectFormDom.value.resetFields();
    getPageData();
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getPageData();
    });
  });
  // ----------------- table -------------------------

  const columns: TableColumnData[] = [
    {
      title: '序号',
      width: 80,
      slotName: 'number',
    },
    {
      title: '隐患描述',
      dataIndex: 'hazardDesc',
    },
    {
      title: '隐患位置',
      dataIndex: 'hazardAddr',
    },
    {
      title: '隐患级别',
      dataIndex: 'dangerLevelName',
      bodyCellStyle(record) {
        return {
          color: record.dangerLevelCode === '1' ? '#F76560' : '#357cf0',
        };
      },
    },
    {
      title: '整改责任部门',
      dataIndex: 'rectifyDepartName',
    },
    {
      title: '整改责任人',
      dataIndex: 'rectifyName',
    },
    {
      title: '整改措施',
      width: 300,
      dataIndex: 'rectifyMeasures',
    },
    {
      title: '整改情况',
      dataIndex: 'rectifySituation',
    },
    {
      title: '整改次数',
      dataIndex: 'rectifyCount',
    },
    {
      title: '审核人',
      dataIndex: 'verifierName',
    },
    {
      title: '操作',
      width: 160,
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];

  const toEditPage = (type: 'reexamine' | 'toDetail', row?: any) => {
    const obj = {
      reexamine: '隐患复审',
      toDetail: '隐患详情',
    };
    router.push({
      name: 'PitfallDetail',
      query: {
        type: type,
        title: obj[type],
        source: 'pitfallDetail',
        id: row.id,
        dangerStateCode: row.dangerStateCode,
        rectifyCount: row.rectifyCount,
        dangerLevelCode: row.dangerLevelCode
          ? row.dangerLevelCode
          : row.hidRiskLevelCode,
      },
    });
  };

  const refresh = async () => {
    getPageData();
  };

  // ------------------ 分页 ----------------------
  const currentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getPageData();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getPageData();
  };

  const { guideVisible, guideItems, handleOperationGuide } =
    useOperationGuide();
</script>

<style lang="less" scoped></style>
