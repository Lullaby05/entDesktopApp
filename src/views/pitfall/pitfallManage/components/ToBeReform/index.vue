<!-- 隐患管理：隐患管理--待整改隐患 -->
<template>
  <TableListCard>
    <template #headerInput>
      <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
        <a-form-item field="hazardDesc" label="隐患描述">
          <a-input
            v-model="tempSearchForm.hazardDesc"
            placeholder="请输入隐患描述"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="hazardAddr" label="隐患位置">
          <a-input
            v-model="tempSearchForm.hazardAddr"
            placeholder="请输入隐患位置"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="dangerLevelCode" label="隐患级别">
          <a-select
            v-model="tempSearchForm.dangerLevelCode"
            placeholder="请选择隐患级别"
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
            v-model="tempSearchForm.rectifyDepartId"
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
        <a-form-item field="rectifyTime" label="限期整改时间">
          <a-range-picker
            allow-clear
            v-model="tempSearchForm.rectifyTime"
            show-time
            :time-picker-props="{
              defaultValue: ['00:00:00', '23:59:59'],
            }"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="['整改开始时间', '整改结束时间']"
          />
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
            v-permission="'PitfallManageUrge'"
            v-if="
              record.dangerStateCode === statusEnum.TOBERECTIFY &&
              record.rectifyStateCode === '4'
            "
            type="text"
            size="mini"
            status="danger"
            @click="urgeModalVisible = true"
          >
            催办
          </a-button>
          <a-button
            v-if="record.rectifyId === userInfo.enterPriseUserId"
            v-permission="'PitfallDetailReport'"
            type="text"
            size="mini"
            @click="toEditPage('report', record)"
          >
            整改上报
          </a-button>
          <a-button
            v-permission="'PitfallDetailEdit'"
            v-if="userInfo.enterPriseUserId == record.confirmId"
            type="text"
            size="mini"
            @click="toEditPage('edit', record)"
          >
            编辑
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
  <!-- 催办弹窗 -->
  <a-modal
    v-model:visible="urgeModalVisible"
    title="隐患催办提醒"
    title-align="start"
    @cancel="handleCancel"
    @before-ok="handleBeforeOk"
    :width="700"
  >
    <a-form :model="urgeForm">
      <a-form-item field="content" label="督促整改内容提醒">
        <a-textarea
          v-model="urgeForm.content"
          :max-length="200"
          :auto-size="{
            minRows: 6,
            maxRows: 6,
          }"
          allow-clear
          show-word-limit
          placeholder="请输入督促整改内容提醒"
        />
      </a-form-item>
    </a-form>
  </a-modal>
  <!-- 指引弹窗 -->
  <GuideProgress
    title="隐患处理流程"
    v-model:visible="guideVisible"
    :guideItems="guideItems"
  />
</template>

<script lang="ts">
  import { computed, onBeforeMount, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { cloneDeep } from 'lodash';
  import { useUserStore } from '@/store';
  import {
    getStaffDataAllAPI,
    getOrganizationTreeAPI,
  } from '@/api/enterpriseManage';
  import type { StaffItem } from '@/views/enterpriseManage/staffManage/index';
  import type { OrganizationTreeData } from '@/store/modules/enterprise/types';
  import type { TableColumnData, TableData } from '@arco-design/web-vue';
  import { dictResponseType, getPitfallDicApi } from '@/api';
  import { handleOnKeyup } from '@/utils/event';
  import { statusEnum } from '@/views/pitfall/snapshot/composition/useDict';
  import { downloadFile } from '@/utils/utils';
  import GuideProgress from '@/components/operationGuide/guideProgress.vue';
  import { useOperationGuide } from '../../composition/operationGuide';
  export default {
    // name: 'WorkType',
  };
</script>

<script lang="ts" setup>
  const router = useRouter();
  const userStore = useUserStore();
  const userInfo = computed(() => {
    return userStore.userInfo;
  });
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
    },
  });

  const emits = defineEmits(['getTableData']);

  //  ----------------- 前置数据 ----------------------
  // 隐患状态字典
  const dangerState = ref<dictResponseType[]>([]);
  // 隐患等级字典
  const dangerLevel = ref<dictResponseType[]>([]);
  const stateColorObj = ref<any>({});
  onBeforeMount(async () => {
    // 字典值获取
    const dangerStateRes = await getPitfallDicApi('hid_danger_state');
    dangerState.value = dangerStateRes.data;

    const dangerLevelRes = await getPitfallDicApi('hid_danger_level');
    dangerLevel.value = dangerLevelRes.data;

    // 将需要渲染的颜色值保存到stateColorObj中
    const colorObj: any = {
      gray: '#666',
      green: '#03bf16',
      blue: '#357cf0',
      red: '#F76560',
      orange: '#f59a23',
    };
    for (const i of dangerState.value) {
      stateColorObj.value[i.dictKey] = colorObj[i.remark as string];
    }
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
      rectifyStartTime:
        selectForm.value.rectifyTime && selectForm.value.rectifyTime[0],
      rectifyEndTime:
        selectForm.value.rectifyTime && selectForm.value.rectifyTime[1],
    };
    delete params.rectifyTime;
    emits('getTableData', params);
  };

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
      title: '整改下发时间',
      dataIndex: 'createTime',
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
      title: '限期整改时间',
      dataIndex: 'rectifyTime',
    },
    {
      title: '状态',
      dataIndex: 'rectifyStateName',
      bodyCellStyle: (record: TableData) => {
        return {
          color: stateColorObj.value[record.rectifyStateCode],
        };
      },
    },
    {
      title: '整改次数',
      dataIndex: 'rectifyCount',
    },

    {
      title: '操作',
      width: 200,
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];

  getPageData();

  onActivated(() => {
    getPageData();
  });

  const toEditPage = (type: 'report' | 'edit' | 'toDetail', row?: any) => {
    const obj = {
      report: '整改上报',
      edit: '隐患编辑',
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

  // ------------------ 催办弹窗相关 ----------------------
  const urgeModalVisible = ref(false);
  const urgeForm = ref<{ content: string }>({
    content: '',
  });
  const handleCancel = () => {
    urgeForm.value.content = '';
    urgeModalVisible.value = false;
  };
  const handleBeforeOk = () => {
    handleCancel();
  };

  const { guideVisible, guideItems, handleOperationGuide } =
    useOperationGuide();
</script>

<style lang="less" scoped></style>
