<!-- 隐患管理--日常排查任务 -->
<template>
  <div class="container">
    <a-tabs
      v-model:active-key="searchForm.taskStateCode"
      type="card-gutter"
      :hide-content="true"
      @change="
        () => {
          searchForm.pageNo = 1;
          pitfallStore.$patch({ daliyCheckListTab: searchForm.taskStateCode });
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
          :label-col-props="{ span: 3 }"
        >
          <a-form-item field="taskName" label="任务名称">
            <a-input
              allow-clear
              v-model="tempSearchForm.taskName"
              placeholder="请输入任务名称"
            ></a-input>
          </a-form-item>
          <a-form-item field="planName" label="所属计划名称">
            <a-input
              allow-clear
              v-model="tempSearchForm.planName"
              placeholder="请输入所属计划名称"
            ></a-input>
          </a-form-item>
          <a-form-item field="checkCycleCode" label="任务来源">
            <a-select
              allow-clear
              v-model="tempSearchForm.taskType"
              placeholder="请选择任务来源"
              allow-search
            >
              <a-option
                v-for="item in taskTypeList"
                :key="item.dictKey"
                :value="item.dictKey"
                >{{ item.dictValue }}</a-option
              >
            </a-select>
          </a-form-item>
          <a-form-item field="checkPersonId" label="排查责任人">
            <a-select
              v-model="tempSearchForm.checkPersonId"
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
            <!-- <a-input
              allow-clear
              v-model="tempSearchForm.checkPerson"
              placeholder="请选择排查责任人"
            ></a-input> -->
          </a-form-item>
          <a-form-item field="startTimeRange" label="任务开始时间">
            <a-range-picker
              v-model="tempSearchForm.startTimeRange"
              allow-clear
              show-time
              :time-picker-props="{
                defaultValue: ['00:00:00', '23:59:59'],
              }"
              format="YYYY-MM-DD HH:mm:ss"
              :placeholder="['开始时间', '结束时间']"
            ></a-range-picker>
          </a-form-item>
          <a-form-item field="endTimeRange" label="任务截止时间">
            <a-range-picker
              v-model="tempSearchForm.endTimeRange"
              allow-clear
              show-time
              :time-picker-props="{
                defaultValue: ['00:00:00', '23:59:59'],
              }"
              format="YYYY-MM-DD HH:mm:ss"
              :placeholder="['开始时间', '结束时间']"
            ></a-range-picker>
          </a-form-item>
        </a-form>
      </template>
      <template #headerBtn>
        <a-space direction="vertical" :size="10">
          <a-button
            type="primary"
            @click="
              () => {
                searchForm = tempSearchForm;
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
        <a-button
          type="primary"
          @click="
            downloadFile(
              'https://business.api.xkrsecure.com/exportFiles/02综合性安全检查表.doc'
            )
          "
          >导出</a-button
        >
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
              v-permission="'ExecuteDailyTask'"
              v-if="
                ['2', '3'].includes(record.taskStateCode) &&
                record.checkPersonId === userInfo.enterPriseUserId
              "
              type="text"
              size="mini"
              @click="toTaskPage(record)"
            >
              任务执行
            </a-button>
            <a-button type="text" size="mini" @click="toCheckPlanPage(record)">
              详情</a-button
            >
          </template>
        </a-table>
      </template>
      <template #pagination>
        <a-pagination
          :current="searchForm.pageNo"
          :page-size="searchForm.pageSize"
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
      title="新增任务流程"
      v-model:visible="guideVisible"
      :guideItems="guideItems"
    />
  </div>
</template>

<script lang="ts" setup name="DailyCheckTasks">
  import { useList } from './composition/useList';
  import { usePitfallStore, useUserStore } from '@/store';
  import { downloadFile } from '@/utils/utils';
  import { useSearch } from '../snapshot/composition/useSearch';
  import GuideCard from '@/components/operationGuide/guideCard.vue';

  const pitfallStore = usePitfallStore();
  const userStore = useUserStore();

  const { staffData } = useSearch(['staffData']);

  const userInfo = userStore.userInfo;

  const {
    tabLists,
    searchForm,
    tempSearchForm,
    columns,
    toTaskPage,
    toCheckPlanPage,
    pageData,
    taskTypeList,
    getTableList,
    handleReset,
    pageChange,
    pageSizeChange,
  } = useList(pitfallStore);

  const router = useRouter();
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
      description:
        '根据排查性质、排查人、排查内容及时间等新增计划，新增后，系统会自动根据排查计划生成排查任务',
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
  .container :deep(.arco-card.card-table) {
    min-height: auto;
  }

  :deep(.content) {
    .arco-table-container {
      min-height: 507px;
    }
    .pagination {
      padding: 0 !important;
    }
  }

  .upload-tip {
    color: #f59b22;
  }

  .table-img {
    width: 46px;
    height: 60px;
  }
</style>
