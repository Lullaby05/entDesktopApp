<!-- 隐患管理--排查计划管理 -->
<template>
  <div class="container">
    <a-tabs
      v-model:active-key="selectForm.checkPlanStateCode"
      type="card-gutter"
      :hide-content="true"
      @change="
        () => {
          selectForm.pageNo = 1;
          pitfallStore.$patch({
            checkPlanListTab: selectForm.checkPlanStateCode,
          });
          getTableList();
        }
      "
    >
      <a-tab-pane
        v-for="item in tabLists"
        :key="item.code"
        :title="item.name + `(${item.count})`"
      >
      </a-tab-pane>
    </a-tabs>
    <TableListCard>
      <template #headerInput>
        <a-form
          :model="tempSearchForm"
          layout="inline"
          :label-col-props="{ span: 2 }"
        >
          <a-form-item field="planName" label="排查计划名称">
            <a-input
              v-model="tempSearchForm.planName"
              allow-clear
              placeholder="请输入排查计划名称"
            ></a-input>
          </a-form-item>
          <a-form-item field="checkTypeCode" label="排查类型">
            <a-select
              v-model="tempSearchForm.checkTypeCode"
              allow-clear
              placeholder="请选择排查类型"
              allow-search
            >
              <a-option
                v-for="item in checkTypes"
                :key="item.dictKey"
                :value="item.dictKey"
                >{{ item.dictValue }}</a-option
              >
            </a-select>
          </a-form-item>
          <a-form-item field="organizeLevelCode" label="组织层级">
            <a-select
              v-model="tempSearchForm.organizeLevelCode"
              allow-search
              allow-clear
              placeholder="请选择组织层级"
            >
              <a-option
                v-for="item in organizeLevelDict"
                :key="item.dictKey"
                :value="item.dictKey"
                >{{ item.dictValue }}</a-option
              ></a-select
            >
          </a-form-item>
          <a-form-item field="deptId" label="排查部门">
            <a-tree-select
              :fallback-option="false"
              v-model:model-value="tempSearchForm.deptId"
              placeholder="请选择排查部门"
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
          <!-- <a-form-item field="checkPerson" label="排查负责人">
            <a-select
              v-model="tempSearchForm.checkPerson"
              allow-clear
              allow-search
              placeholder="请选择排查负责人"
            >
              <a-option
                v-for="item in staffData"
                :key="item.id"
                :value="item.id"
                :label="item.userName"
              ></a-option>
            </a-select>
          </a-form-item> -->
          <a-form-item field="checkCycleCode" label="排查周期">
            <a-select
              allow-clear
              v-model="tempSearchForm.checkCycleCode"
              placeholder="请选择排查周期"
              allow-search
            >
              <a-option
                v-for="item in checkRoutines"
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
                selectForm = tempSearchForm;
                getTableList();
              }
            "
          >
            <icon-search class="icon" />
            查询
          </a-button>
          <a-button @click="handleReset">
            <icon-refresh class="icon" />
            重置
          </a-button>
        </a-space>
      </template>
      <template #primaryBtn>
        <a-space>
          <a-button
            v-permission="'CheckPlanManageAdd'"
            type="primary"
            @click="toAddPage"
          >
            <icon-plus class="icon" />
            新增
          </a-button>
          <a-button
            type="primary"
            @click="
              downloadFile(
                'https://business.api.xkrsecure.com/exportFiles/2024安全检查计划.doc'
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
          <icon-refresh class="minor-icon" size="20" @click="getTableList" />
        </a-space>
      </template>
      <template #table>
        <a-table
          :data="pageData.list"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #option="{ record }">
            <a-button
              v-if="!record.status && record.showToggleStatus"
              type="text"
              size="mini"
              @click="toggleStatus(record)"
              >启用</a-button
            >
            <a-button
              v-if="record.status && record.showToggleStatus"
              type="text"
              size="mini"
              status="danger"
              @click="toggleStatus(record)"
              >停用</a-button
            >
            <a-button
              v-if="record.checkTypeCode !== '0'"
              v-permission="'CheckPlanManageEdit'"
              :style="{ color: record.isExecute ? '#999' : '' }"
              type="text"
              size="mini"
              @click="toEdit(record)"
              >编辑</a-button
            >
            <a-button type="text" size="mini" @click="toDetail(record)">
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
          :base-size="3"
          :buffer-size="1"
          :total="(pageData.total as number)"
          @change="pageChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>
    <GuideCard
      title="新增计划流程"
      v-model:visible="guideVisible"
      :guideItems="guideItems"
    />
  </div>
</template>

<script lang="ts">
  import { onBeforeMount, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import type {
    TableColumnData,
    TableData,
  } from '@arco-design/web-vue/es/table/interface';
  import {
    checkPlanEditStatus,
    checkPlanStart,
    checkPlanStop,
    getCheckPlanList,
    getCheckPlanTabList,
  } from '@/api/pitfall';
  import { dictResponseType, getPitfallDicApi } from '@/api';
  import { handleOnKeyup } from '@/utils/event';
  import { usePitfallStore } from '@/store';
  import { downloadFile } from '@/utils/utils';
  import { Message } from '@arco-design/web-vue';
  import { useSearch } from '@/views/pitfall/snapshot/composition/useSearch';
  import GuideCard from '@/components/operationGuide/guideCard.vue';
  export default {
    // name: 'SelfInspection',
  };
</script>

<script lang="ts" setup name="CheckPlanManageList">
  const pitfallStore = usePitfallStore();
  const tabLists = ref<{ code: string; name: string; count: number }[]>([]);
  // 任务状态字典
  const taskState = ref<dictResponseType[]>([]);
  const stateColorObj = ref<any>({});
  const pageData = ref<{ total?: number; list?: TableData[] }>({
    list: [],
    total: 0,
  });
  const { deptData, onDeptSearch, clearSearchKey } = useSearch(['deptData']);
  // --------------------搜索---------------------
  const selectForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
    taskType: 2,
    checkPlanStateCode: pitfallStore.checkPlanListTab,
  });
  const tempSearchForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
    taskType: 2,
    checkPlanStateCode: pitfallStore.checkPlanListTab,
  });
  // 排查类型字典
  const checkTypes = ref<dictResponseType[]>([]);
  // 排查周期字典
  const checkRoutines = ref<dictResponseType[]>([]);
  // 排查状态字典
  const checkPlanStatus = ref<dictResponseType[]>([]);
  // 组织层级字典
  const organizeLevelDict = ref<dictResponseType[]>([]);
  // --------------------表格---------------------
  const columns: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
    },
    {
      title: '排查计划名称',
      dataIndex: 'planName',
    },
    {
      title: '排查类型',
      dataIndex: 'checkType',
    },
    // {
    //   title: '组织层级',
    //   // width: 80,
    //   dataIndex: 'organizeLevel',
    //   cellStyle: { width: '6%' },
    // },
    {
      title: '排查部门',
      dataIndex: 'deptName',
    },
    // {
    //   title: '排查负责人',
    //   dataIndex: 'checkPersonName',
    // },
    {
      title: '排查周期',
      dataIndex: 'checkCycle',
    },
    {
      title: '开始时间',
      dataIndex: 'checkStartTime',
    },
    {
      title: '结束时间',
      dataIndex: 'checkEndTime',
    },
    {
      title: '排查计划状态',
      dataIndex: 'checkPlanState',
      bodyCellStyle: (record: TableData) => {
        return { color: stateColorObj.value[record.checkPlanStateCode] };
      },
    },
    // {
    //   title: '按时排查任务数',
    //   dataIndex: 'onTimeNum',
    // },
    // {
    //   title: '逾期排查任务数',
    //   dataIndex: 'overdueNum',
    // },
    {
      title: '未完成排查任务数',
      dataIndex: 'unFinishNum',
    },
    {
      title: '排查完成率（%）',
      dataIndex: 'finishingRate',
    },
    {
      title: '状态',
      dataIndex: 'statusName',
      bodyCellStyle(record) {
        return {
          color: record.status ? '#43cf7c' : '#f53f3f',
        };
      },
    },
    {
      title: '操作',
      // width: 130,
      align: 'center',
      slotName: 'option',
      dataIndex: '',
      cellStyle: { width: '16%' },
    },
  ];

  const router = useRouter();

  const getTableList = () => {
    const params = {
      ...selectForm.value,
      pageNo: selectForm.value.pageNo,
      pageSize: selectForm.value.pageSize,
    };
    getCheckPlanList(params).then((res) => {
      pageData.value.total = res.data.total;
      pageData.value.list = res.data.list.map((ele: any) => ({
        ...ele,
        statusName: ele.status ? '启用' : '停用',
        showToggleStatus: ele.checkEndTime
          ? +new Date() < +new Date(ele.checkEndTime)
          : true,
      }));
    });
  };

  const getTabList = () => {
    getCheckPlanTabList().then((res) => {
      tabLists.value = res.data;
      tabLists.value.unshift({
        code: '',
        name: '全部',
        count: res.data.reduce(
          (pre: number, cur: { count: number }) => pre + cur.count,
          0
        ),
      });
    });
  };

  onBeforeMount(async () => {
    // 字典值获取
    checkTypes.value = (await getPitfallDicApi('check_plan_type')).data;
    checkPlanStatus.value = (await getPitfallDicApi('check_plan_state')).data;
    checkRoutines.value = (await getPitfallDicApi('check_cycle')).data;
    organizeLevelDict.value = (await getPitfallDicApi('organize_level')).data;

    taskState.value = checkPlanStatus.value;
    // 将需要渲染的颜色值保存到stateColorObj中
    const colorObj: any = {
      gray: '#666',
      green: '#03bf16',
      blue: '#357cf0',
      red: '#F76560',
      orange: '#f59a23',
    };
    for (const i of taskState.value) {
      stateColorObj.value[i.dictKey] = colorObj[i.remark as string];
    }

    getTabList();

    getTableList();
  });

  onActivated(() => {
    getTabList();

    getTableList();
  });

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getTableList();
    });
  });

  // 分页操作
  const pageChange = (currentPage: Number) => {
    selectForm.value.pageNo = currentPage;
    getTableList();
  };
  const pageSizeChange = (currentPageSize: Number) => {
    selectForm.value.pageSize = currentPageSize;
    getTableList();
  };
  // 重置操作
  const handleReset = () => {
    selectForm.value = {
      pageNo: selectForm.value.pageNo,
      pageSize: selectForm.value.pageSize,
      taskType: selectForm.value.taskType,
      checkPlanStateCode: '',
    };
    tempSearchForm.value = {
      pageNo: selectForm.value.pageNo,
      pageSize: selectForm.value.pageSize,
      taskType: selectForm.value.taskType,
      checkPlanStateCode: '',
    };
    getTableList();
  };

  const toAddPage = () => {
    router.push({
      name: 'CheckPlanManageAdd',
    });
  };
  const toEdit = async (row?: any) => {
    if (row.isExecute) {
      Message.warning(
        `${row.planName}检查计划已发生业务数据记录，无法进行编辑，如需编辑请停用后新增检查计划`
      );
      return;
    }
    const { data } = await checkPlanEditStatus(row.id);
    if (data) {
      Message.warning(
        `${row.planName}检查计划已发生业务数据记录，无法进行编辑，如需编辑请停用后新增检查计划`
      );
      return;
    }
    router.push({
      name: 'CheckPlanManageEdit',
      query: {
        record: JSON.stringify(row),
      },
    });
  };
  const toDetail = (row?: any) => {
    router.push({
      name: 'PlanExecuteSituation',
      // query: {
      //   id: row.id,
      //   checkPerson: row.checkPersonName,
      // },
      query: {
        record: JSON.stringify(row),
      },
    });
  };

  const toggleStatus = async (record: any) => {
    if (record.status) {
      // 停用
      const { data } = await checkPlanStop(record.id);
      Message.success(data);
    } else {
      // 启用
      const { data } = await checkPlanStart(record.id);
      Message.success(data);
    }
    getTableList();
  };

  const guideVisible = ref(false);
  const guideItems = [
    {
      title: '排查内容管理',
      img: 'icon-fengxianchuzhichaxun',
      description: '对需要排查的项目、排查标准等内容进行管理，',
      description1: '立即去维护',
      onclick: () => {
        router.push({
          name: 'CheckContentManage',
        });
      },
    },
    {
      title: '排查表管理',
      img: 'icon-thin-_notebook_to_do_bullets_list',
      description: '引用排查内容形成诸如《电气检查表》之类的固定主题的检查表',
    },
    {
      title: '排查计划管理',
      img: 'icon-jihua',
      description: '根据排查性质、排查人、排查内容及时间等新增计划',
    },
  ];
  const handleOperationGuide = () => {
    guideVisible.value = true;
  };
</script>

<style lang="less" scoped>
  .container :deep(.arco-tabs-nav-type-card-gutter) {
    &::before {
      display: none;
    }
    margin-bottom: 0px;
    .arco-tabs-tab {
      border-radius: 5px;
      background-color: var(--bg2);
      border-bottom: 1px solid var(--color-neutral-3);
    }
    .arco-tabs-tab-active {
      background-color: #357cf0;
      color: #ffffff;
    }
  }
</style>
