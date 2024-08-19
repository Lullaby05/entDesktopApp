<!-- 风险管控--危险源管理 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
          <a-form-item field="riskUnitId" label="风险单元">
            <a-tree-select
              v-model:model-value="tempSearchForm.riskUnitId"
              :data="riskUnitData"
              :fallback-option="false"
              :disable-filter="true"
              placeholder="请选择风险单元"
              :field-names="{
                key: 'id',
                title: 'name',
              }"
              allow-search
              allow-clear
              @search="onRiskUnitSearch"
              @blur="clearSearchKey"
              @clear="clearSearchKey"
            >
            </a-tree-select>
          </a-form-item>
          <a-form-item field="riskPointName" label="风险点名称">
            <a-input
              v-model.trim="tempSearchForm.riskPointName"
              placeholder="请输入风险点名称"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="dangerName" label="危险源">
            <a-input
              v-model.trim="tempSearchForm.dangerName"
              placeholder="请输入危险源"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="accTypeCode" label="事故类型">
            <a-select
              v-model:model-value="tempSearchForm.accTypeCode"
              :options="accidentTypeData.list"
              :fallback-option="false"
              allow-search
              allow-clear
              placeholder="请选择事故类型"
              :field-names="{
                value: 'accTypeCode',
                label: 'accTypeName',
              }"
            >
            </a-select>
          </a-form-item>
          <a-form-item field="riskLevelCode" label="风险等级">
            <a-select
              v-model="tempSearchForm.riskLevelCode"
              placeholder="请选择风险等级"
              allow-clear
              allow-search
            >
              <a-option v-for="(value, key) of levelEnum" :value="+key">{{
                value
              }}</a-option>
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
                getDangerPointData();
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
      <template #minorBtn>
        <a-space>
          <icon-refresh class="minor-icon" size="20" @click="refresh" />
        </a-space>
      </template>
      <template #table>
        <a-table
          :data="dangerPointData.list"
          row-key="controlMeasureCode"
          :columns="columns"
          :bordered="{ cell: true }"
          :span-method="spanMethod"
          :pagination="false"
        >
          <template #riskLevelCode="{ record }">
            <a-tooltip
              content="一级高风险，四级低风险，从一级到四级逐级递减。"
              background-color="rgb(var(--arcoblue-5))"
            >
              <div class="span">{{ record.riskLevel }}</div>
            </a-tooltip>
          </template>
          <template #emergMeasure="{ record }">
            <a-tooltip :content="record.emergMeasure">
              <div class="span-emergMeasure">{{ record.emergMeasure }}</div>
            </a-tooltip>
          </template>
        </a-table>
      </template>
      <template #pagination>
        <a-pagination
          :total="dangerPointData.total"
          show-total
          show-page-size
          :page-size-options="[10, 20, 50, 100]"
          :base-size="3"
          :buffer-size="1"
          @change="((current: number) => currentChange(current))"
          @page-size-change="((pageSize: number) => pageSizeChange(pageSize))"
        />
      </template>
    </TableListCard>
  </div>
</template>

<script lang="ts">
  import { onMounted, ref } from 'vue';
  import { cloneDeep } from 'lodash';
  import { getMapDictionaryAPI } from '@/api/index';
  import {
    getRiskUnitTeeBodyAPI,
    getAccidentTypeListAPI,
    getDangerPointAPI,
  } from '@/api/risk';
  import type { GetDangerPointParams } from '@/api/risk';
  import type {
    RiskUnitDataItem,
    DangerPointData,
  } from '@/views/risk/identificationAndEvaluation/index';
  import type { AccidentTypeData } from '@/views/risk/accidentType/index';

  import type { TableColumnData, TableData } from '@arco-design/web-vue';
  import { handleOnKeyup } from '@/utils/event';

  export default {
    name: 'DangerPointManage',
  };
</script>

<script lang="ts" setup>
  // --------------------- 前置数据 --------------------------

  const riskUnitData = ref<RiskUnitDataItem[]>([]);

  const getRiskUnitData = async () => {
    const { data } = await getRiskUnitTeeBodyAPI();
    riskUnitData.value = data;
    riskUnitDataClone = cloneDeep(data);
  };

  getRiskUnitData();

  const accidentTypeData = ref<AccidentTypeData>({ list: [], total: 10 });

  const getEventTypeData = async () => {
    // 事故类型固定最多 20 条
    const { data } = await getAccidentTypeListAPI({ pageSize: 100 });
    accidentTypeData.value = data;
  };

  getEventTypeData();

  const levelEnum = ref<any>({});

  const getLevelEnum = async () => {
    const { data } = await getMapDictionaryAPI('risk_level');
    levelEnum.value = data;
  };

  getLevelEnum();

  // -------------------搜索--------------------------

  const selectForm = ref<GetDangerPointParams>({
    pageNo: 1,
    pageSize: 10,
  });
  const tempSearchForm = ref<GetDangerPointParams>({
    pageNo: 1,
    pageSize: 10,
  });
  const selectFormDom = ref();

  const resetSelectForm = () => {
    selectFormDom.value.resetFields();
    tempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
    };
    getDangerPointData();
  };

  const getDangerPointData = async () => {
    const { data } = await getDangerPointAPI(selectForm.value);
    dangerPointData.value = data;
  };

  getDangerPointData();

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getDangerPointData();
    });
  });
  // -------------- 树形下拉  搜索 start-----------------
  let riskUnitDataClone: any = [];

  function searchData(keyword: string) {
    const loop = (data: any) => {
      const result: any[] = [];
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

    return loop(riskUnitDataClone);
  }

  const onRiskUnitSearch = (searchKey: string) => {
    setTimeout(() => {
      riskUnitData.value = searchData(searchKey);
    }, 200);
  };

  const clearSearchKey = () => {
    onRiskUnitSearch('');
  };
  // -------------- 树形下拉  搜索 end-----------------
  // -----------------------表格-----------------------

  const dangerPointData = ref<DangerPointData>({ list: [], total: 0 });

  const columns: TableColumnData[] = [
    {
      title: '危险源',
      dataIndex: 'dangerName',
      width: 140,
    },
    {
      title: '所属风险点',
      dataIndex: 'riskPointName',
      width: 140,
    },
    {
      title: '事故类型',
      width: 100,
      dataIndex: 'accTypeName',
    },
    {
      title: '不安全因素大类',
      width: 160,
      dataIndex: 'factorType',
    },
    {
      title: '具体不安全因素描述',
      dataIndex: 'factorDesc',
    },
    {
      title: '风险等级',
      width: 100,
      slotName: 'riskLevelCode',
      dataIndex: 'riskLevelCode',
      bodyCellStyle: (record: any) => {
        if (record.riskLevelCode === '1') {
          return { color: 'rgb(212, 48, 48)' };
        }
        if (record.riskLevelCode === '2') {
          return { color: 'rgb(245, 154, 35)' };
        }
        if (record.riskLevelCode === '3') {
          return { color: 'rgb(255, 223, 37)' };
        }
        if (record.riskLevelCode === '4') {
          return { color: 'rgb(53, 124, 240)' };
        }
      },
    },
    {
      title: '管控措施',
      width: 160,
      dataIndex: 'controlMeasure',
    },
    {
      title: '应急处置措施',
      width: 180,
      dataIndex: 'emergMeasure',
      slotName: 'emergMeasure',
    },
  ];

  const spanMethod = (data: {
    record: TableData;
    column: any;
    rowIndex: number;
    columnIndex: number;
  }): { rowspan?: number; colspan?: number } | void => {
    // -------------------------- 合并行 ------------------------------
    // 合并危险源 及 所属风险点行
    const dangerPointFlag = data.rowIndex
      ? dangerPointData.value.list[data.rowIndex].dangerId !==
        dangerPointData.value.list[data.rowIndex - 1].dangerId
      : true;
    if (
      (data.column.dataIndex === 'dangerName' ||
        data.column.dataIndex === 'riskPointName') &&
      dangerPointFlag
    ) {
      const arr = dangerPointData.value.list.filter(
        (item) => item.dangerId === data.record.dangerId
      );
      return {
        rowspan: arr.length,
      };
    }
    // 合并  事故类型行
    const eventFlag = data.rowIndex
      ? data.record.dangerId !==
          dangerPointData.value.list[data.rowIndex - 1].dangerId ||
        data.record.accTypeCode !==
          dangerPointData.value.list[data.rowIndex - 1].accTypeCode
      : true;
    if (data.column.dataIndex === 'accTypeName' && eventFlag) {
      let arr = dangerPointData.value.list.filter(
        (item) => item.dangerId === data.record.dangerId
      );
      arr = arr.filter((item) => item.accTypeCode === data.record.accTypeCode);
      return {
        rowspan: arr.length,
      };
    }
    // 合并  不安全因素大类行
    const desFlag = data.rowIndex
      ? data.record.dangerId !==
          dangerPointData.value.list[data.rowIndex - 1].dangerId ||
        data.record.accTypeCode !==
          dangerPointData.value.list[data.rowIndex - 1].accTypeCode ||
        data.record.factorTypeCode !==
          dangerPointData.value.list[data.rowIndex - 1].factorTypeCode
      : true;
    if (data.column.dataIndex === 'factorType' && desFlag) {
      let arr = dangerPointData.value.list.filter(
        (item) => item.dangerId === data.record.dangerId
      );
      arr = arr.filter((item) => item.accTypeCode === data.record.accTypeCode);
      arr = arr.filter(
        (item) => item.factorTypeCode === data.record.factorTypeCode
      );
      return {
        rowspan: arr.length,
      };
    }
    // 合并  具体不安全因素描述行 及 同一层级其他行
    const measureFlag = data.rowIndex
      ? data.record.factorDescCode !==
        dangerPointData.value.list[data.rowIndex - 1].factorDescCode
      : true;
    if (
      (data.column.dataIndex === 'factorDesc' ||
        data.column.dataIndex === 'riskLevelCode') &&
      measureFlag
    ) {
      const arr = dangerPointData.value.list.filter(
        (item) => item.factorDescCode === data.record.factorDescCode
      );
      return {
        rowspan: arr.length,
      };
    }
    // 合并  应急处置措施
    if (data.column.dataIndex === 'emergMeasure' && eventFlag) {
      let arr = dangerPointData.value.list.filter(
        (item) => item.dangerId === data.record.dangerId
      );
      arr = arr.filter((item) => item.accTypeCode === data.record.accTypeCode);
      return {
        rowspan: arr.length,
      };
    }
  };

  const refresh = async () => {
    getDangerPointData();
  };

  // ------------------ 分页 ----------------------

  const currentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getDangerPointData();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getDangerPointData();
  };
</script>

<style lang="less" scoped>
  .upload-tip {
    color: #f59b22;
  }
  .table-img {
    width: 46px;
    height: 60px;
  }
  .tip {
    display: flex;
    margin-bottom: 20px;
    justify-content: flex-end;
  }
  .span-emergMeasure {
    display: -webkit-box;
    overflow: hidden;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 10;
  }
</style>
