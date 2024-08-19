<!-- 隐患管理：隐患管理--全部隐患 -->
<template>
  <TableListCard>
    <template #headerInput>
      <a-form ref="selectFormDom" :model="selectForm" layout="inline">
        <a-form-item field="hazardAddr" label="隐患位置">
          <a-input
            v-model="selectForm.hazardAddr"
            allow-clear
            placeholder="请输入隐患位置"
          ></a-input>
        </a-form-item>
        <a-form-item field="dangerLevelCode" label="隐患等级">
          <a-select
            v-model="selectForm.dangerLevelCode"
            placeholder="请选择隐患等级"
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
        <a-form-item field="reportTime" label="隐患上报时间">
          <a-range-picker
            v-model="selectForm.reportTime"
            :placeholder="['开始时间', '结束时间']"
            show-time
            :time-picker-props="{
              defaultValue: ['00:00:00', '23:59:59'],
            }"
            format="YYYY-MM-DD HH:mm:ss"
            allow-clear
          />
        </a-form-item>
        <a-form-item field="dangerSourceCode" label="隐患数据来源">
          <a-select
            allow-search
            v-model="selectForm.dangerSourceCode"
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
        <a-form-item field="rectifyFlag" label="整改方式">
          <a-select
            allow-search
            v-model="selectForm.rectifyFlag"
            placeholder="请选择整改方式"
            allow-clear
          >
            <a-option
              v-for="item in rectifyTypeList"
              :key="item.dictKey"
              :value="item.dictKey"
              >{{ item.dictValue }}</a-option
            >
          </a-select>
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
        <template #dangerLevelName="{ record }">{{
          record.dangerLevelName || record.hidRiskLevel
        }}</template>
        <template #rectifyTypeName="{ record }">
          {{
            rectifyTypeList.find((item) => item.dictKey == record.rectifyFlag)
              ?.dictValue
          }}
        </template>
        <template #option="{ record }">
          <div>
            <a-button
              v-permission="'PitfallManageUrge'"
              v-if="
                record.dangerStateCode === statusEnum.TOBERECTIFY &&
                record.rectifyStateCode === '4'
              "
              type="text"
              size="mini"
              status="danger"
              @click="handleButtonClick('urge', record)"
            >
              催办
            </a-button>
            <a-button
              v-permission="'PitfallDetailReport'"
              v-if="
                [statusEnum.TOBERECTIFY, statusEnum.OVERDUE].includes(
                  record.dangerStateCode
                ) && record.rectifyId === userInfo.enterPriseUserId
              "
              type="text"
              size="mini"
              @click="handleButtonClick('report', record)"
            >
              整改上报
            </a-button>
            <a-button
              v-permission="'PitfallDetailEdit'"
              v-if="
                [statusEnum.TOBERECTIFY, statusEnum.OVERDUE].includes(
                  record.dangerStateCode
                ) && userInfo.enterPriseUserId === record.confirmId
              "
              type="text"
              size="mini"
              @click="handleButtonClick('edit', record)"
            >
              编辑
            </a-button>
            <a-button
              v-permission="'PitfallDetailConfirm'"
              v-if="
                record.dangerStateCode === statusEnum.CONFIRMED &&
                (confirmPermission & props.permission) === confirmPermission
              "
              type="text"
              size="mini"
              @click="handleButtonClick('confirm', record)"
            >
              隐患确认
            </a-button>
            <a-button
              v-permission="'PitfallManageAcceptance'"
              v-if="
                record.dangerStateCode === statusEnum.TOBEACCEPTANCE &&
                (!record.prefillCheckAcceptId
                  ? (acceptancePermission & props.permission) ===
                    acceptancePermission
                  : record.prefillCheckAcceptId === userInfo.enterPriseUserId)
              "
              type="text"
              size="mini"
              @click="handleButtonClick('acceptance', record)"
            >
              整改验收
            </a-button>
            <a-button
              v-permission="'PitfallManageRecheck'"
              v-if="
                record.dangerStateCode === statusEnum.REEXAMINE &&
                (!record.prefillVerifierId
                  ? (recheckPermission & props.permission) === recheckPermission
                  : record.prefillVerifierId === userInfo.enterPriseUserId)
              "
              type="text"
              size="mini"
              @click="handleButtonClick('reexamine', record)"
            >
              复审
            </a-button>
            <a-button
              type="text"
              size="mini"
              @click="handleButtonClick('toDetail', record)"
            >
              详情
            </a-button>
          </div>
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
  import { computed, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { onBeforeMount } from 'vue';
  import { onMounted } from 'vue';
  import { handleOnKeyup } from '@/utils/event';
  import { dictResponseType, getPitfallDicApi } from '@/api';
  import { statusEnum } from '@/views/pitfall/snapshot/composition/useDict';
  import { useUserStore } from '@/store';
  import { useSearch } from '@/views/pitfall/snapshot/composition/useSearch';
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
  const router = useRouter();
  const emits = defineEmits(['getTableData']);
  const confirmPermission = 0b100;
  const acceptancePermission = 0b010;
  const recheckPermission = 0b001;

  const userStore = useUserStore();
  const userInfo = computed(() => {
    return userStore.userInfo;
  });

  // ----------------- 查询-------------------------------
  // 隐患数据来源字典
  const dataSourceList = ref<dictResponseType[]>([]);
  // 隐患等级字典
  const dangerLevel = ref<dictResponseType[]>([]);
  // 整改方式字典
  const rectifyTypeList = ref<dictResponseType[]>([
    { dictKey: 0, dictValue: '正常整改' },
    { dictKey: 1, dictValue: '立即整改' },
  ]);

  const { deptData, onDeptSearch, clearSearchKey } = useSearch(['deptData']);

  const selectForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
  });
  const tempSearchForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
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

  // ----------------- table -------------------------

  const columns: TableColumnData[] = [
    {
      title: '序号',
      width: 60,
      slotName: 'number',
    },
    {
      title: '隐患描述',
      dataIndex: 'hazardDesc',
    },
    {
      title: '隐患位置',
      dataIndex: 'hazardAddr',
      width: 130,
    },
    {
      title: '隐患状态',
      dataIndex: 'dangerStateName',
      width: 120,
    },
    {
      title: '隐患等级',
      dataIndex: 'dangerLevelName',
      bodyCellStyle(record) {
        const dangerLevelCode = record.dangerLevelName
          ? record.dangerLevelCode
          : record.hidRiskLevelCode;
        return {
          color: dangerLevelCode === '1' ? '#F76560' : '#357cf0',
        };
      },
      slotName: 'dangerLevelName',
      width: 130,
    },
    {
      title: '隐患上报时间',
      dataIndex: 'reportTime',
      // width: 170,
      cellStyle: { width: '9%' },
    },
    {
      title: '整改责任部门',
      dataIndex: 'rectifyDepartName',
      width: 120,
    },
    {
      title: '隐患数据来源',
      dataIndex: 'dangerSourceName',
      width: 120,
    },
    {
      title: '整改方式',
      dataIndex: 'rectifyTypeName',
      width: 120,
      slotName: 'rectifyTypeName',
    },
    {
      title: '操作',
      // width: 160,
      align: 'center',
      slotName: 'option',
      dataIndex: '',
      cellStyle: { width: '15%' },
    },
  ];

  onBeforeMount(async () => {
    const res = await getPitfallDicApi('hid_danger_source');
    dataSourceList.value = res.data;

    const dangerLevelRes = await getPitfallDicApi('hid_danger_level');
    dangerLevel.value = dangerLevelRes.data;

    getPageData();
  });

  onActivated(() => {
    getPageData();
  });

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getPageData();
    });
  });

  type btnType =
    | 'report'
    | 'urge'
    | 'edit'
    | 'confirm'
    | 'acceptance'
    | 'reexamine'
    | 'toDetail';
  const handleButtonClick = (btnType: btnType, record?: any): void => {
    const obj = {
      report: '整改上报',
      confirm: '隐患确认',
      acceptance: '隐患验收',
      edit: '隐患编辑',
      reexamine: '隐患复审',
      toDetail: '隐患详情',
    };
    switch (btnType) {
      case 'urge': {
        urgeModalVisible.value = true;
        break;
      }
      case 'report':
      case 'edit':
      case 'confirm':
      case 'acceptance':
      case 'reexamine':
      case 'toDetail': {
        router.push({
          name: 'PitfallDetail',
          query: {
            type: record.rectifyFlag ? 'immediate' : btnType,
            title: obj[btnType],
            source: 'pitfallDetail',
            id: record.id,
            dangerStateCode: record.dangerStateCode,
            dangerLevelCode: record.dangerLevelCode
              ? record.dangerLevelCode
              : record.hidRiskLevelCode,
            rectifyCount: record.rectifyCount,
          },
        });
      }
    }
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
