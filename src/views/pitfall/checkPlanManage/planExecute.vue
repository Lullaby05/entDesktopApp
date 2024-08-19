<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">{{
          '计划执行情况'
        }}</span>
      </div>
      <div class="content">
        <div class="responsePerson">
          <span>排查负责人：</span>
          <span>{{ checkPerson }}</span>
        </div>
        <div class="table">
          <a-tabs
            v-model:active-key="activeKey"
            class="table-tabs"
            type="card-gutter"
            :hide-content="true"
          >
            <a-tab-pane
              v-for="item in tabsConfig"
              :key="item.code"
              :title="`${item.name}(${item.count})`"
            >
            </a-tab-pane>
          </a-tabs>
          <a-table
            :bordered="{ cell: true }"
            :data="tableDataFilter"
            :columns="tableColumns"
            :pagination="false"
          >
            <template #number="{ rowIndex }">
              {{ rowIndex + 1 }}
            </template>
            <template #options="{ record }">
              <a-button type="text" @click="toDetail(record)">详情</a-button>
            </template>
          </a-table>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { getCheckPlanDetail, getPlanTaskTabs } from '@/api/pitfall';
  import { TableColumnData, TableData } from '@arco-design/web-vue';
  import { computed, onBeforeMount } from 'vue';
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { dictResponseType, getPitfallDicApi } from '@/api';

  const route = useRoute();
  const router = useRouter();

  const { id, checkPerson } = route.query;
  const taskState = ref<dictResponseType[]>([]);
  const stateColorObj = ref<any>({});

  const tableColumns: TableColumnData[] = [
    { title: '序号', slotName: 'number', width: 62 },
    { title: '任务名称', dataIndex: 'taskName' },
    {
      title: '任务状态',
      dataIndex: 'taskState',
      bodyCellStyle: (record: TableData) => {
        return { color: stateColorObj.value[record.taskStateCode] };
      },
    },
    { title: '任务开始时间', dataIndex: 'taskStartTime' },
    { title: '任务截止时间', dataIndex: 'taskEndTime' },
    { title: '合格数', dataIndex: 'checkedItem' },
    { title: '不合格数', dataIndex: 'unCheckedItem' },
    { title: '排查开始时间', dataIndex: 'actualStartTime' },
    { title: '排查完成时间', dataIndex: 'actualEndTime' },
    { title: '操作', slotName: 'options', width: 100 },
  ];
  const tableData = ref<TableData[]>([]);

  const activeKey = ref<string | 'all'>('all');
  const tabsConfig = ref<{ code: string; name: string; count: number }[]>([]);

  const getTabList = async () => {
    // 字典值获取
    const checkPlanStateRes = await getPitfallDicApi('check_plan_state');
    taskState.value = checkPlanStateRes.data;
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

    const res = await getPlanTaskTabs(id as string);
    const totalCount = res.data.reduce(
      (cur: number, prev: { count: number }) => prev.count + cur,
      0
    );
    tabsConfig.value = res.data;
    tabsConfig.value.unshift({
      code: 'all',
      name: '全部',
      count: totalCount,
    });
  };

  const getTableData = async () => {
    const res = await getCheckPlanDetail(id as string);

    tableData.value = res.data;
  };

  onBeforeMount(() => {
    getTabList();

    getTableData();
  });

  const toDetail = (row: any) => {
    router.push({
      name: 'ExecuteDailyTask',
      query: {
        id: row.id,
        taskType: row.taskType,
        checkTableIds: row.checkTableIds,
      },
    });
  };

  const tableDataFilter = computed(() => {
    if (activeKey.value === 'all') {
      return tableData.value;
    }
    return tableData.value.filter(
      (item) => item.taskStateCode === activeKey.value
    );
  });

  // const handleTabChange = () => {
  //   // getTableData();
  // };

  const goBack = () => {
    router.back();
  };
</script>

<style lang="less" scoped>
  .arco-card.content-card {
    .header {
      font-size: 18px;
      // font-weight: 700;
      margin-bottom: 20px;

      .title {
        margin-left: 8px;
      }
    }

    .content {
      padding: 0 20px;
      margin: 0 auto;
      min-height: calc(100vh - 165px);
      .responsePerson {
        font-size: 16px;
        margin-bottom: 20px;
      }

      .table-tabs {
        margin-bottom: -1px;

        :deep(.arco-tabs-nav)::before {
          display: none;
        }

        :deep(.arco-tabs-tab) {
          background-color: var(--bg2);
          border-radius: 5px 5px 0 0;

          &.arco-tabs-tab-active {
            background-color: #357cf0;
            color: #ffffff;
          }
        }
      }
    }
  }
</style>
