<!-- 隐患管理--计划排查任务 -->
<template>
  <div class="container">
    <a-tabs
      v-model:active-key="searchForm.taskStateCode"
      type="card-gutter"
      :hide-content="true"
      @change="
        () => {
          searchForm.pageNo = 1;
          pitfallStore.$patch({
            planCheckListTab: searchForm.taskStateCode,
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
          :label-col-props="{ span: 3 }"
        >
          <a-form-item field="taskName" label="任务名称">
            <a-input
              v-model="tempSearchForm.taskName"
              placeholder="请输入任务名称"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="planName" label="所属计划名称">
            <a-input
              v-model="tempSearchForm.planName"
              placeholder="请输入所属计划名称"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="checkCycleCode" label="排查周期">
            <a-select
              v-model="tempSearchForm.checkCycleCode"
              placeholder="请选择排查周期"
              allow-search
              allow-clear
            >
              <a-option
                v-for="item in checkRoutines"
                :key="item.dictKey"
                :value="item.dictKey"
                >{{ item.dictValue }}</a-option
              >
            </a-select>
          </a-form-item>
          <a-form-item field="checkPerson" label="排查责任人">
            <a-input
              v-model="tempSearchForm.checkPerson"
              placeholder="请选择排查责任人"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="startTimeRange" label="任务开始时间">
            <a-range-picker
              v-model="tempSearchForm.startTimeRange"
              show-time
              :time-picker-props="{
                defaultValue: ['00:00:00', '23:59:59'],
              }"
              format="YYYY-MM-DD HH:mm:ss"
              :placeholder="['开始时间', '结束时间']"
              allow-clear
            ></a-range-picker>
          </a-form-item>
          <a-form-item field="endTimeRange" label="任务截止时间">
            <a-range-picker
              v-model="tempSearchForm.endTimeRange"
              show-time
              :time-picker-props="{
                defaultValue: ['00:00:00', '23:59:59'],
              }"
              format="YYYY-MM-DD HH:mm:ss"
              :placeholder="['开始时间', '结束时间']"
              allow-clear
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
        <a-space>
          <a-button
            type="primary"
            @click="
              downloadFile(
                'https://business.api.xkrsecure.com/exportFiles/05季节性安全检查表.doc'
              )
            "
            >导出</a-button
          >
        </a-space>
      </template>
      <template #minorBtn>
        <a-space>
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
              v-permission="'ExecutePlanTask'"
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
            <a-button type="text" size="mini" @click="toCheckPlanPage(record)"
              >详情</a-button
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
  </div>
</template>

<script lang="ts" setup name="PlanToCheckTask">
  import { useList } from './composition/useList';
  import { usePitfallStore, useUserStore } from '@/store';
  import { downloadFile } from '@/utils/utils';

  const pitfallStore = usePitfallStore();
  const userStore = useUserStore();

  const userInfo = userStore.userInfo;

  const {
    tabLists,
    searchForm,
    tempSearchForm,
    columns,
    toTaskPage,
    toCheckPlanPage,
    pageData,
    checkRoutines,
    pageChange,
    pageSizeChange,
    getTableList,
    handleReset,
  } = useList(pitfallStore);
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
