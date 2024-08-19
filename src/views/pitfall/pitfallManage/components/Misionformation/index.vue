<!-- 隐患管理：隐患管理--误报 -->
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
        <a-form-item field="checkItem" label="排查项目">
          <a-input
            v-model="tempSearchForm.checkItem"
            placeholder="请输入排查项目"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="inspectorId" label="排查人">
          <a-select
            v-model="tempSearchForm.inspectorId"
            allow-clear
            allow-search
            placeholder="请选择排查人"
          >
            <a-option
              v-for="item in staffData"
              :key="item.id"
              :value="item.id"
              :label="item.userName"
            ></a-option>
          </a-select>
          <!-- <a-input
            v-model="selectForm.inspectorName"
            placeholder="请输入排查人"
            allow-clear
          ></a-input> -->
        </a-form-item>
        <a-form-item field="inspectTime" label="排查时间">
          <a-range-picker
            allow-clear
            v-model="tempSearchForm.inspectTime"
            show-time
            :time-picker-props="{
              defaultValue: ['00:00:00', '23:59:59'],
            }"
            format="YYYY-MM-DD HH:mm:ss"
            :placeholder="['开始时间', '结束时间']"
          />
        </a-form-item>
        <a-form-item field="dangerSourceCode" label="隐患数据来源">
          <a-select
            allow-search
            v-model:model-value="tempSearchForm.dangerSourceCode"
            placeholder="请选择隐患数据来源"
            allow-clear
          >
            <a-option
              v-for="item in dataSourceList"
              :key="item.dictKey"
              :value="item.dictKey"
              >{{ item.dictValue }}</a-option
            >
          </a-select>
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
  import { useUserStore } from '@/store';
  import { getStaffDataAllAPI } from '@/api/enterpriseManage';
  import type { StaffItem } from '@/views/enterpriseManage/staffManage/index';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { dictResponseType, getPitfallDicApi } from '@/api';
  import { useRouter } from 'vue-router';
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
    },
  });
  const emits = defineEmits(['getTableData']);
  const router = useRouter();
  const userStore = useUserStore();

  //  ----------------- 前置数据 ----------------------
  const staffData = ref<StaffItem[]>([]);

  const getStaffData = async () => {
    const { data: res } = await getStaffDataAllAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });

    staffData.value = res;
  };

  getStaffData();

  // ----------------- 查询-------------------------------
  // 隐患数据来源字典
  const dataSourceList = ref<dictResponseType[]>([]);
  // 隐患等级字典
  const dangerLevel = ref<dictResponseType[]>([]);
  onBeforeMount(async () => {
    const res = await getPitfallDicApi('hid_danger_source');
    dataSourceList.value = res.data;
    const dangerLevelRes = await getPitfallDicApi('hid_danger_level');
    dangerLevel.value = dangerLevelRes.data;
  });

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
      inspectStartTime:
        selectForm.value.inspectTime && selectForm.value.inspectTime[0],
      inspectEndTime:
        selectForm.value.inspectTime && selectForm.value.inspectTime[1],
    };
    delete params.inspectTime;
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
      title: '排查人',
      dataIndex: 'inspectorName',
    },
    {
      title: '排查时间',
      dataIndex: 'inspectTime',
    },
    {
      title: '隐患数据来源',
      dataIndex: 'dangerSourceName',
    },
    {
      title: '排查项目',
      dataIndex: 'checkItem',
    },
    {
      title: '排查标准',
      dataIndex: 'checkStandard',
      width: 150,
    },
    {
      title: '隐患确认人',
      dataIndex: 'confirmName',
    },
    {
      title: '隐患确认时间',
      dataIndex: 'createTime',
    },
    {
      title: '操作',
      width: 160,
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];

  getPageData();

  onActivated(() => {
    getPageData();
  });

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

  const toEditPage = (type: 'toDetail', row?: any) => {
    const obj = {
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
  const { guideVisible, guideItems, handleOperationGuide } =
    useOperationGuide();
</script>

<style lang="less" scoped></style>
