<!-- 风险管控：风险辨识与评价 -->
<template>
  <div class="container">
    <TableListCard :title="'风险辨识与评价'" :reload-cache-list="['id']">
      <template #headerTips>
        <div class="header">
          <div class="item">
            <div class="label">风险点：</div>
            <div class="value">{{ headerInfo.riskPointName }}</div>
          </div>
          <div class="item">
            <div class="label">风险点位置：</div>
            <div class="value">{{ headerInfo.riskPointAddr }}</div>
          </div>
          <div class="item">
            <div class="label">风险责任部门：</div>
            <div class="value">{{ headerInfo.dutyDeptName }}</div>
          </div>
          <div class="item">
            <div class="label">风险责任人：</div>
            <div class="value">{{ headerInfo.personName }}</div>
          </div>
        </div>
      </template>
      <template #headerInput>
        <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
          <a-form-item field="dangerName" label="危险源">
            <a-input
              v-model="tempSearchForm.dangerName"
              placeholder="请输入危险源"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="accTypeCode" label="事故类型">
            <a-select
              v-model="tempSearchForm.accTypeCode"
              placeholder="请选择事故类型"
              allow-clear
              allow-search
              :field-names="{
                value: 'accTypeCode',
                label: 'accTypeName',
              }"
              :options="accidentTypeData.list"
            ></a-select>
          </a-form-item>
          <a-form-item field="riskLevelCode" label="风险等级">
            <a-select
              v-model="tempSearchForm.riskLevelCode"
              placeholder="请选择风险等级"
              allow-clear
              allow-search
            >
              <a-option v-for="(value, key) of levelEnum" :value="key">{{
                value
              }}</a-option>
            </a-select>
          </a-form-item>
        </a-form>
      </template>
      <template #headerBtn>
        <a-space>
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
      <template #primaryBtn>
        <a-space v-if="!route.query.type">
          <a-button
            v-permission="'EvaluationPageAdd'"
            type="primary"
            @click="toAddDangerPointPage('add')"
          >
            <icon-plus class="icon" />
            新增
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
          :span-method="spanMethod"
          :bordered="{ cell: true }"
          :pagination="false"
          @page-change="currentChange"
          @page-size-change="pageSizeChange"
        >
          <template #riskLevelCode="{ record }">
            <a-tooltip content="一级高风险，四级低风险，从一级到四级逐级递减。">
              <div class="span">{{ record.riskLevel }}</div>
            </a-tooltip>
          </template>
          <template #option="{ record }">
            <a-button
              v-permission="'DangerPointManageEdit'"
              type="text"
              size="mini"
              @click="toAddDangerPointPage('edit', record.dangerId)"
              >编辑</a-button
            >
            <a-button
              v-permission="'DangerPointManageDelete'"
              type="text"
              status="danger"
              size="mini"
              @click="deleteRow(record.dangerName, record.dangerId)"
              >删除</a-button
            >
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
          @change="currentChange"
          @page-size-change="pageSizeChange"
        />
      </template>
    </TableListCard>
  </div>
</template>

<script lang="ts">
  import { ref, h, onMounted } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { Message, Modal } from '@arco-design/web-vue';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { getMapDictionaryAPI } from '@/api/index';
  import {
    getAccidentTypeListAPI,
    detailRiskPointAPI,
    getDangerPointAPI,
    deleteDangerPointAPI,
  } from '@/api/risk';
  import type { GetDangerPointParams } from '@/api/risk';
  import type { AccidentTypeData } from '@/views/risk/accidentType/index';
  import type { TableColumnData, TableData } from '@arco-design/web-vue';
  import { formatDate } from '@vueuse/core';
  import type { RiskPointItem, DangerPointData } from './index';
  import { handleOnKeyup } from '@/utils/event';
  export default {
    name: 'EvaluationPage',
  };
</script>

<script lang="ts" setup name="EvaluationPage">
  const route = useRoute();
  const router = useRouter();

  // ------------------- 前置数据----------------------

  const headerInfo = ref<RiskPointItem>({});

  const accidentTypeData = ref<AccidentTypeData>({ list: [], total: 10 });

  const getEventTypeData = async () => {
    // 事故类型固定最多 20 条
    const { data } = await getAccidentTypeListAPI({ pageSize: 100 });
    accidentTypeData.value = data;
  };

  getEventTypeData();

  const levelEnum = ref<any>({});

  const getlevelEnum = async () => {
    const { data } = await getMapDictionaryAPI('risk_level');
    levelEnum.value = data;
  };

  const getDetail = async () => {
    const { data } = await detailRiskPointAPI({ id: route.query.id as string });
    headerInfo.value = data;
    selectForm.value.riskUnitId = headerInfo.value.riskUnitId as string;
    await getlevelEnum();
    getDangerPointData();
  };

  getDetail();

  onActivated(() => {
    getDangerPointData();
  });

  // -------------------搜索--------------------------

  const selectForm = ref<GetDangerPointParams>({
    riskPointId: route.query.id as string,
    riskUnitId: '',
    pageNo: 1,
    pageSize: 10,
  });
  const tempSearchForm = ref<GetDangerPointParams>({
    riskPointId: route.query.id as string,
    riskUnitId: '',
    pageNo: 1,
    pageSize: 10,
  });

  const selectFormDom = ref();

  const resetSelectForm = () => {
    selectFormDom.value.resetFields();
    selectForm.value.riskUnitId = headerInfo.value.riskUnitId as string;
    tempSearchForm.value = {
      riskPointId: route.query.id as string,
      pageNo: 1,
      pageSize: 10,
    };
    getDangerPointData();
  };

  const getDangerPointData = async () => {
    const { data } = await getDangerPointAPI(selectForm.value);
    dangerPointData.value = data;
    // console.log(data);
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getDangerPointData();
    });
  });

  // -----------------------表格-----------------------

  const dangerPointData = ref<DangerPointData>({ list: [], total: 0 });

  const columns: TableColumnData[] = [
    {
      title: '危险源',
      dataIndex: 'dangerName',
      // width: 120,
      cellStyle: { width: '9%' },
    },
    {
      title: '事故类型',
      // width: 100,
      dataIndex: 'accTypeName',
      cellStyle: { width: '8%' },
    },
    {
      title: '不安全因素大类',
      // width: 140,
      dataIndex: 'factorType',
      cellStyle: { width: '11%' },
    },
    {
      title: '具体不安全因素描述',
      // width: 200,
      dataIndex: 'factorDesc',
      cellStyle: { width: '16%' },
    },
    {
      title: '风险等级',
      // width: 100,
      slotName: 'riskLevelCode',
      dataIndex: 'riskLevelCode',
      cellStyle: { width: '7%' },
    },
    {
      title: '管控措施',
      // width: 200,
      dataIndex: 'controlMeasure',
      cellStyle: { width: '16%' },
    },
    {
      title: '应急处置措施',
      // width: 100,
      dataIndex: 'emergMeasure',
    },
    {
      title: '操作',
      align: 'center',
      slotName: 'option',
      cellStyle: { width: '13%' },
    },
  ];

  const spanMethod = (data: {
    record: TableData;
    column: any;
    rowIndex: number;
    columnIndex: number;
  }): { rowspan?: number; colspan?: number } | void => {
    // -------------------------- 合并行 ------------------------------
    // 合并危险源
    const dangerPointFlag = data.rowIndex
      ? data.record.dangerId !==
        dangerPointData.value.list[data.rowIndex - 1].dangerId
      : true;

    if (data.column.dataIndex === 'dangerName' && dangerPointFlag) {
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
        (item) => item.factorTypeCode == data.record.factorTypeCode
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

    // 合并  操作
    if (data.column.slotName === 'option' && dangerPointFlag) {
      const arr = dangerPointData.value.list.filter(
        (item) => item.dangerId === data.record.dangerId
      );
      return {
        rowspan: arr.length,
      };
    }
  };

  const refresh = async () => {
    await getDangerPointData();
  };

  const toAddDangerPointPage = (type: string, dangerId?: string) => {
    router.push({
      name: 'AddDangerPointPage',
      query: {
        dangerId,
        type,
        riskUnitId: headerInfo.value.riskUnitId,
        riskPointId: headerInfo.value.id,
        riskPointName: headerInfo.value.riskPointName,
      },
    });
  };

  const deleteRow = (name: string, dangerId: string) => {
    Modal.open({
      title: '提示',
      content: () =>
        h(ConfirmModalBody, {
          content: `是否确认删除危险源 <span style="color: red">${name}</span> ，删除数据，危险源相关隐患排查数据也会删除，是否确认删除？`,
          info: '删除数据不可恢复，请谨慎操作！',
        }),
      titleAlign: 'start',
      onOk: async () => {
        await deleteDangerPointAPI(dangerId);
        Message.success({
          content: '删除成功',
        });
        if (
          dangerPointData.value.list.length === 1 &&
          selectForm.value.pageNo !== 1
        ) {
          (selectForm.value.pageNo as number) - 1;
        }
        getDangerPointData();
      },
    });
  };

  // ------------------------ 分页 --------------------------
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
  .header {
    display: flex;
    align-items: center;
    width: 100%;
    height: 30px;
    padding: 0 10px;
    margin-bottom: 13px;
    background-color: var(--bg4);
    .item {
      display: flex;
    }
    .item + .item {
      margin-left: 12%;
    }
  }
  :deep(.arco-radio-group-button) {
    padding: 0;
    .arco-radio-button {
      border: 1px solid #dcdfe6;
    }
    .arco-radio-button:hover {
      color: rgb(var(--arcoblue-6));
    }
    .arco-radio-button.arco-radio-checked {
      color: #fff;
      background-color: rgb(var(--arcoblue-6));
    }
  }
  .table-img {
    width: 46px;
    height: 60px;
  }
</style>
