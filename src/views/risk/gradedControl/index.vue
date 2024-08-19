<!-- 风险管控--风险分级管控 -->
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
              v-model:model-value="tempSearchForm.riskPointName"
              placeholder="请输入风险点名称"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="riskLevelCode" label="风险等级">
            <a-select
              v-model="tempSearchForm.riskLevelCode"
              placeholder="请选择风险等级"
              :fallback-option="false"
              allow-clear
              allow-search
            >
              <a-option v-for="(value, key) of levelEnum" :value="+key">{{
                value
              }}</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="controlLevelCode" label="管控层级">
            <a-select
              v-model:model-value="tempSearchForm.controlLevelCode"
              :fallback-option="false"
              placeholder="请选择管控层级"
              allow-clear
              allow-search
            >
              <a-option v-for="(value, key) of deptTypeData" :value="+key">{{
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
                getRiskPointData();
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
          :data="riskPointData.list"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :span-method="spanMethod"
          :pagination="false"
        >
          <template #riskLevelCode="{ record }">
            <a-tooltip content="一级高风险，四级低风险，从一级到四级逐级递减。">
              <div class="span">{{
                record.riskLevelCode ? levelEnum[record.riskLevelCode] : ''
              }}</div>
            </a-tooltip>
          </template>
          <template #controlLevelCode="{ record }">
            {{ formatDeptType(record.controlLevelCode) }}
          </template>

          <template #option="{ record }">
            <a-button
              type="text"
              size="mini"
              @click="toControlPage(record.id)"
              v-permission="'GradedControl'"
            >
              管控
            </a-button>
            <a-button
              v-permission="'ControlCard'"
              type="text"
              size="mini"
              @click="showCard(record.id, record.controlLevelCode)"
            >
              风险告知卡
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
          :total="(riskPointData.total as number)"
          @change="currentChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>
    <GuideCard
      width="65vw"
      title="风险分级管控流程"
      v-model:visible="guideVisible"
      :guideItems="guideItems"
    />
  </div>
</template>

<script lang="ts">
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { cloneDeep } from 'lodash';
  import { Message } from '@arco-design/web-vue';
  import { getEnumListAPI, getMapDictionaryAPI } from '@/api/index';
  import {
    getRiskUnitTeeBodyAPI,
    getRiskPointControlAPI,
    riskPointCardAPI,
  } from '@/api/risk';
  import type { GetRiskPointContaolBody } from '@/api/risk';
  import type {
    RiskUnitDataItem,
    RiskPointData,
  } from '@/views/risk/identificationAndEvaluation/index';
  import type { TableColumnData, TableData } from '@arco-design/web-vue';
  import { handleOnKeyup } from '@/utils/event';
  import GuideCard from '@/components/operationGuide/guideCard.vue';
  export default {
    name: 'GradedControl',
  };
</script>

<script lang="ts" setup>
  const router = useRouter();

  // ------------------- 前置数据 --------------------------

  const deptTypeData = ref<any>({});

  const getDeptType = async () => {
    const { data } = await getMapDictionaryAPI('control_level');
    deptTypeData.value = data;
  };

  getDeptType();

  const formatDeptType = (code: string) => {
    if (Object.keys(deptTypeData.value).length && code) {
      return deptTypeData.value[code];
    }
    return code;
  };

  const riskUnitData = ref<RiskUnitDataItem[]>([]);

  const getRiskUnitData = async () => {
    const { data } = await getRiskUnitTeeBodyAPI();
    riskUnitData.value = data;
    riskUnitDataClone = cloneDeep(data);
  };

  getRiskUnitData();

  const levelEnum = ref<any>({});

  const getLevelEnum = async () => {
    const { data } = await getMapDictionaryAPI('risk_level');
    levelEnum.value = data;
  };

  getLevelEnum();

  // -------------------搜索--------------------------

  const selectForm = ref<GetRiskPointContaolBody>({
    pageNo: 1,
    pageSize: 10,
  });
  const tempSearchForm = ref<GetRiskPointContaolBody>({
    pageNo: 1,
    pageSize: 10,
  });
  const selectFormDom = ref();

  const getRiskPointData = async () => {
    const { data } = await getRiskPointControlAPI(selectForm.value);
    riskPointData.value = data;
  };

  getRiskPointData();

  onActivated(() => {
    getRiskPointData();
  });

  const resetSelectForm = () => {
    selectFormDom.value.resetFields();
    selectForm.value = {
      pageNo: 1,
      pageSize: 10,
    };
    getRiskPointData();
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getRiskPointData();
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
  const riskPointData = ref<RiskPointData>({ list: [], total: 0 });

  const columns: TableColumnData[] = [
    {
      title: '风险点名称',
      dataIndex: 'riskPointName',
    },
    {
      title: '所属风险单元',
      dataIndex: 'riskUnitName',
    },
    {
      title: '风险等级',
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
      title: '管控层级',
      slotName: 'controlLevelCode',
      dataIndex: 'controlLevelCode',
    },
    {
      title: '责任部门',
      dataIndex: 'controlDeptName',
      width: 150,
      cellStyle: { width: '12%' },
    },
    {
      title: '责任人',
      dataIndex: 'controlPersonName',
      width: 150,
      cellStyle: { width: '12%' },
    },
    {
      title: '操作',
      align: 'center',
      slotName: 'option',
      dataIndex: 'option',
    },
  ];

  const spanColumns: string[] = [
    'riskPointName',
    'riskUnitName',
    'riskLevelCode',
    'option',
  ];

  const spanMethod = (data: {
    record: TableData;
    column: any;
    rowIndex: number;
    columnIndex: number;
  }): { rowspan?: number; colspan?: number } | void => {
    const riskPointFlag = data.rowIndex
      ? data.record.id !== riskPointData.value.list[data.rowIndex - 1].id
      : true;

    if (spanColumns.includes(data.column.dataIndex) && riskPointFlag) {
      const arr = riskPointData.value.list.filter(
        (item) => item.id === data.record.id
      );
      return {
        rowspan: arr.length,
      };
    }
  };

  const refresh = async () => {
    await getRiskPointData();
  };

  const toControlPage = (id: string) => {
    const item = riskPointData.value.list.find((item) => item.id === id);
    const data = JSON.stringify({
      riskPointId: item?.id,
      riskPointName: item?.riskPointName,
      riskUnitId: item?.riskUnitId,
      riskLevelCode: item?.riskLevelCode,
      dutyDeptId: item?.dutyDeptId,
    });
    router.push({
      name: 'GradedControlControl',
      query: {
        id,
        data,
      },
    });
  };

  const showCard = async (id: string, controlLevelCode: string) => {
    if (!controlLevelCode) {
      Message.warning('请先进行管控');
      return;
    }
    const response = await riskPointCardAPI(id);
    const res = response.data;
    if (res.type !== 'application/pdf') {
      let data: any;
      const reader = new FileReader();
      reader.readAsText(res as any, 'utf-8');
      reader.onload = function (e) {
        data = JSON.parse(reader.result as string);
        if (data.code) {
          Message.error({
            content: '获取失败' + data.data || data.msg,
          });
        }
      };
      return;
    }
    const pdfUrl = window.URL.createObjectURL(
      new Blob([res as any], { type: 'application/pdf;charset-UTF-8' })
    );
    window.open(pdfUrl);
  };

  // ------------------ 分页 ----------------------

  const currentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getRiskPointData();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getRiskPointData();
  };

  // 指引
  const guideVisible = ref(false);
  const guideItems = [
    {
      title: '基础数据维护',
      img: 'icon-shujuweihu',
      description: '进行事故类型及安全标志基础数据的管理，',
      description1: '立即去维护',
      onclick: () => {
        router.push({
          name: 'AccidentType',
        });
      },
    },
    {
      title: '风险评估方法设置',
      img: 'icon-zhipingguanli',
      description: '根据企业使用的风险评估方式进行设置，便于后续风险评估',
    },
    {
      title: '风险辨识与评价',
      img: 'icon-fengxianbianshiguankong',
      description:
        '按照“新增风险单元（或选中风险单元）-->新增风险点-->风险辨识与评价”进行风险点的辨识与评价',
    },
    {
      title: '风险分级管控',
      img: 'icon-guankongchuli',
      description:
        '完成风险辨识与评价后，可在”风险分级管控“中对辨识出的风险进行管控',
    },
  ];
  const handleOperationGuide = () => {
    guideVisible.value = true;
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
</style>
