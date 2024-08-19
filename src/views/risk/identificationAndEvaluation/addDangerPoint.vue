<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title"
          >{{ title }}危险源</span
        >
      </div>

      <a-form ref="form" :model="formData" :rules="rules">
        <div class="title">
          <!-- <a-divider direction="vertical" :size="6" /> -->
          基本信息
        </div>
        <div class="content">
          <a-form-item field="dangerName" label="危险源" required>
            <a-input
              v-model.trim="formData.dangerName"
              placeholder="请输入危险源"
              allow-clear
              @change="changeBasic('dangerName')"
            ></a-input>
          </a-form-item>
          <a-form-item field="emgcySures" label="事故类型" required>
            <a-checkbox-group
              v-model="formData.emgcySures"
              @change="eventTypeChange"
            >
              <a-grid :cols="5" :col-gap="24" :row-gap="16">
                <a-grid-item
                  v-for="item in accidentTypeData.list"
                  :key="item.id"
                >
                  <a-checkbox :value="item.id">{{
                    item.accTypeName
                  }}</a-checkbox>
                </a-grid-item>
              </a-grid>
            </a-checkbox-group>
          </a-form-item>
          <a-form-item
            field="safetySigns.ids"
            label="安全标志"
            required
            validate-trigger="change"
          >
            <a-space direction="vertical" :size="[10, 10]">
              <a-button type="primary" @click="openDrawer">选择</a-button>
              <a-upload
                v-model:file-list="formData.safetySigns.picPathList"
                disabled
                :show-remove-button="false"
                :show-preview-button="true"
                list-type="picture-card"
                action=""
                :custom-request="customRequest"
                :limit="10"
                image-preview
              />
            </a-space>
          </a-form-item>
          <a-form-item field="decisionMethod" label="风险评价方法" required>
            <a-radio-group
              v-if="route.query.type === 'add'"
              v-model="formData.decisionMethod"
              @change="decisionMethodChange"
            >
              <a-radio :value="system.method">
                风险评估方法 {{ system.method }}
              </a-radio>
              <a-radio value="DIRECT">直接判定法</a-radio>
            </a-radio-group>
            <a-radio-group
              v-else
              v-model="formData.decisionMethod"
              disabled
              @change="decisionMethodChange"
            >
              <a-radio :value="formData.decisionMethod">
                {{
                  formData.decisionMethod === 'DIRECT'
                    ? '直接判定法'
                    : `风险评估方法(${formData.decisionMethod})`
                }}
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </div>
        <!-- table -->
        <div class="title control">
          <!-- <a-divider direction="vertical" :size="6" /> -->
          危险因素信息
        </div>
        <a-alert banner center class="alert">
          如果填写了具体不安全因素描述，就必须选择风险情况(或选择风险等级)，填写管控措施！
        </a-alert>
        <a-table
          :data="formData.factorInfoList"
          row-key="controlMeasureCode"
          :columns="columns"
          :bordered="{ cell: true }"
          :pagination="false"
          :span-method="spanMethod"
          :scroll="{ x: '160%' }"
        >
          <!-- 具体不安全因素描述 -->
          <template #factorDesc="{ record, rowIndex }">
            <div class="icon-content">
              <span class="left">
                <a-textarea
                  v-model.trim="record.factorDesc"
                  show-word-limit
                  :auto-size="{ minRows: 1 }"
                  :max-length="100"
                  allow-clear
                  placeholder="请输入具体不安全因素描述"
                  @change="changeBasic('factorDesc', rowIndex)"
                ></a-textarea>
              </span>
              <span class="right">
                <icon-plus
                  v-if="
                    record.factorTypeCode !==
                    formData.factorInfoList[rowIndex - 1]?.factorTypeCode
                  "
                  class="icon"
                  @click="addFactorDesc(record, rowIndex)"
                />
                <icon-minus
                  v-else
                  class="icon"
                  :style="{ color: 'red' }"
                  @click="deleteRow(rowIndex)"
                />
              </span>
            </div>
          </template>

          <!-- 动态等级计算依赖分值 -->
          <template
            v-for="(item, index) in slotList"
            #[item]="{ record, column }"
          >
            <a-select
              v-model="record[column.dataIndex]"
              :fallback-option="false"
              placeholder="请选择风险情况"
              allow-clear
              allow-search
              @change="recordChange($event, record)"
            >
              <a-option
                v-for="ele in methodRecordDataList[item]"
                :value="ele.key"
                >{{ ele.key + ' (' + ele.value + ')' }}</a-option
              >
            </a-select>
          </template>
          <!-- 总得分 -->
          <template #score="{ record }">
            {{ getTotalScore(record) }}
          </template>
          <!-- 风险等级 -->
          <template #riskLevelCode="{ record }">
            <a-select
              v-model="record.riskLevelCode"
              :fallback-option="false"
              allow-clear
              allow-search
              :disabled="formData.decisionMethod !== 'DIRECT'"
              placeholder="请选择风险等级"
            >
              <a-option v-for="(value, key) of levelMenu" :value="key">
                {{ value }}
              </a-option>
            </a-select>
          </template>
          <!-- 管控措施 -->
          <template #controlMeasure="{ record, rowIndex }">
            <div class="icon-content">
              <span class="left">
                <a-textarea
                  v-model.trim="record.controlMeasure"
                  :max-length="200"
                  :auto-size="{ minRows: 1 }"
                  show-word-limit
                  allow-clear
                  placeholder="请输入管控措施"
                  @change="changeBasic('controlMeasure', rowIndex)"
                ></a-textarea>
              </span>
              <span class="right">
                <icon-plus
                  v-if="
                    record.factorDescCode !==
                    formData.factorInfoList[rowIndex - 1]?.factorDescCode
                  "
                  class="icon"
                  @click="addControlMeasure(record, rowIndex)"
                />
                <icon-minus
                  v-else
                  class="icon"
                  :style="{ color: 'red' }"
                  @click="deleteRow(rowIndex)"
                />
              </span>
            </div>
          </template>
        </a-table>
      </a-form>
      <div class="btn">
        <a-space>
          <a-button @click="goBack">取消</a-button>
          <a-button type="primary" @click="submit">保存</a-button>
        </a-space>
      </div>
    </a-card>

    <!-- 安全标志抽屉 -->
    <a-drawer
      :width="600"
      :visible="visible"
      unmount-on-close
      class="identificationDrawer"
      @ok="drawerOk"
      @cancel="drawerCancel"
    >
      <template #title> 选择安全标志 </template>
      <TableListCard>
        <template #headerInput>
          <a-space>
            <a-select
              v-model="drawerTempSearchForm.signTypeCode"
              placeholder="请选择标志类型"
              :fallback-option="false"
              allow-clear
              allow-search
            >
              <a-option v-for="(value, key) of signsMenu" :value="key">
                {{ value }}
              </a-option>
            </a-select>
            <a-input
              v-model.trim="drawerTempSearchForm.signName"
              placeholder="请输入安全标志名称"
              allow-clear
            ></a-input>
          </a-space>
        </template>
        <template #headerBtn>
          <a-space>
            <a-button
              type="primary"
              @click="
                () => {
                  drawerSelectForm = drawerTempSearchForm;
                  drawerSelectForm.pageNo = 1;
                  getSafetySignsData();
                }
              "
            >
              <icon-search class="icon" />
              查询
            </a-button>
          </a-space>
        </template>

        <template #table>
          <a-table
            v-model:selected-keys="selectKeys"
            :data="safetySignsData.list"
            row-key="id"
            :bordered="false"
            :pagination="false"
            :row-selection="{
              type: 'checkbox',
              width: 60,
              onlyCurrent: false,
              showCheckedAll: true,
            }"
          >
            <template #columns>
              <a-table-column
                title="安全标志名称"
                data-index="signName"
              ></a-table-column>
              <a-table-column
                title="安全标志类型"
                data-index="signType"
              ></a-table-column>
              <a-table-column title="图片" data-index="">
                <template #cell="{ record }">
                  <img class="table-img" :src="record.pictureUrl" alt="" />
                </template>
              </a-table-column>
            </template>
          </a-table>
        </template>
        <template #pagination>
          <a-pagination
            :current="drawerSelectForm.pageNo"
            :page-size="drawerSelectForm.pageSize"
            show-total
            show-page-size
            :page-size-options="[10, 20, 50, 100]"
            :base-size="3"
            :buffer-size="1"
            :total="(safetySignsData.total as number)"
            @change="currentChange"
            @page-size-change="pageSizeChange"
          ></a-pagination>
        </template>
      </TableListCard>
    </a-drawer>
  </div>
</template>

<script lang="ts">
  import { cloneDeep } from 'lodash';
  import { ref, computed, onMounted, h } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from '@/store';
  import { Message, Modal } from '@arco-design/web-vue';
  import { getMapDictionaryAPI } from '@/api/index';
  import {
    getAccidentTypeListAPI,
    getSafetySignsListAPI,
    addDangerPointAPI,
    getRiskAssessmentMethodAPI,
    detailDangerPointAPI,
    updateDangerPointAPI,
  } from '@/api/risk';
  import type {
    FactorInfo,
    DangerPointBody,
    GetSafetySignsListBody,
  } from '@/api/risk';
  // import type {} from './index';
  import type {
    SafetySignsData,
    SafetySignsList,
  } from '@/views/risk/safetySigns/index';
  import type { AccidentTypeData } from '@/views/risk/accidentType/index';
  import type { TableColumnData, TableData } from '@arco-design/web-vue';
  import { handleOnKeyup } from '@/utils/event';
  import { useComputed } from '@/utils/utils';
  import { useCustomUpload } from '@/hooks/customUpload';
  import Decimal from 'decimal.js';
  export default {
    name: 'AddDangerPointPage',
  };
</script>

<script lang="ts" setup>
  // 请求头？ 应该来自store
  // 上传
  const { customRequest } = useCustomUpload();

  const route = useRoute();
  const router = useRouter();

  const userStore = useUserStore();

  const title = computed(() => {
    getEventTypeData();
    getSystemMethod();
    if (route.query.type === 'add') {
      return '新增';
    } else {
      getDetail();
      return '编辑';
    }
  });

  const goBack = () => {
    router.back();
  };

  // -------------------- 前置数据 -------------------------------

  const accidentTypeData = ref<AccidentTypeData>({ list: [], total: 10 });

  const getEventTypeData = async () => {
    // 事故类型固定最多 20 条
    const { data } = await getAccidentTypeListAPI({ pageSize: 100 }); // 自有库
    // const { data } = await getPublicAccidentTypeListAPI({ pageSize: 100 });
    accidentTypeData.value = data;
  };

  const unsafeFactors = ref();

  const getUnsafeFactors = async () => {
    const { data } = await getMapDictionaryAPI('unsafe_factors');
    unsafeFactors.value = data;
  };

  getUnsafeFactors();

  const system = ref({ method: '', leverRange: {} });

  const getSystemMethod = async () => {
    const { data } = await getRiskAssessmentMethodAPI({
      id: userStore.userInfo.enterpriseId as string,
    });
    system.value.method = data.riskAssessCode;
    if (route.query.type === 'add') {
      formData.value.decisionMethod = system.value.method;
    }

    getMethodLeverRange();
  };

  let recordLevelCallBack: any; // 处理详情回显时分数未获取的情况

  // 获取某判定方法的风险等级字典
  const getMethodLeverRange = async () => {
    const { data } = await getMapDictionaryAPI(system.value.method + '_D');
    system.value.leverRange = data;
  };

  const methodRecordDataList = ref<any>({});

  // 获取某判定方法的各项分数范围
  const getMethodRecordData = async (code: string) => {
    const { data } = await getMapDictionaryAPI(code);
    return data;
  };

  const levelMenu = ref<any>();

  const getLevelMenu = async () => {
    const { data } = await getMapDictionaryAPI('risk_level');
    levelMenu.value = data;
  };

  getLevelMenu();

  //  -------------------------------- 表单 / 表格 --------------------------

  const slotList = ref<string[]>([]); // 用于渲染动态方法对应的列
  let oldEventTypeList: string[] = []; // 用于比对选中的事故类型，减少循环次数

  // 用于合并具体不安全因素描述 与 管控措施  之间的列
  const spanColumns = ref<string[]>(['factorDesc', 'riskLevelCode']);

  const form = ref();
  const formData = ref<DangerPointBody>({
    tenantId: userStore.tenantId as string,
    riskPointId: route.query.riskPointId as string, // 风险点
    riskPointName: route.query.riskPointName as string,
    riskUnitId: route.query.riskUnitId as string,
    dangerName: '', // 危险源名称
    emgcySures: [], // 事故类型
    safetySigns: {},
    decisionMethod: '', // 设置方法
    factorInfoList: [],
  });
  let count = false; // 用于回显数据标记select数据是否回来

  const rules = ref({
    'dangerName': [
      { required: true, message: '请输入危险源' },
      { maxLength: 30, message: '不能超过30字符' },
    ],
    'emgcySures': [{ required: true, message: '请选择事故类型' }],
    'safetySigns.ids': [{ required: true, message: '请选择安全标志' }],
  });

  const baseColumns: TableColumnData[] = [
    {
      title: '事故类型',
      fixed: 'left',
      width: 120,
      dataIndex: 'accTypeName',
      cellStyle: { width: '9%' },
    },
    {
      title: '不安全因素大类',
      fixed: 'left',
      width: 140,
      dataIndex: 'factorType',
      cellStyle: { width: '11%' },
    },
    {
      title: '具体不安全因素描述',
      fixed: 'left',
      width: 400,
      slotName: 'factorDesc',
      dataIndex: 'factorDesc',
      cellStyle: { width: '31%' },
    },
    {
      title: '风险等级(一级至四级 风险递减)',
      width: 200,
      slotName: 'riskLevelCode',
      dataIndex: 'riskLevelCode',
      cellStyle: { width: '15%' },
    },
    {
      title: '管控措施',
      width: 300,
      slotName: 'controlMeasure',
      dataIndex: 'controlMeasure',
      cellStyle: { width: '23%' },
    },
    {
      title: '应急处置措施',
      // width: 300,
      dataIndex: 'emergMeasure',
    },
  ];

  const columns = computed((): TableColumnData[] => {
    if (formData.value.decisionMethod === 'DIRECT') return baseColumns;

    const arr = cloneDeep(baseColumns);
    const nameList = formData.value.decisionMethod.split('').reverse();
    slotList.value = [];
    methodRecordDataList.value = {};
    count = false;
    nameList.forEach(async (item: string, index) => {
      // 创建table动态方法分值列
      const tableColumn: TableColumnData = {};
      tableColumn.title = item + '(严重程度)';
      if (item === 'L') {
        tableColumn.title =
          item +
          (nameList.join('') === 'CEL' ? '(可能性大小)' : '(发生的可能性)');
      }
      if (item === 'E') {
        tableColumn.title =
          item + (nameList.join('') === 'CEL' ? '(频繁程度)' : '(暴露时间)');
      }
      if (item === 'C') {
        tableColumn.title = item + '(产生的后果)';
      }
      if (item === 'M') {
        tableColumn.title = item + '(控制措施状态)';
      }
      if (item === 'S') {
        tableColumn.title =
          item + (nameList.join('') === 'SEM' ? '(可能的后果)' : '(严重程度)');
      }

      tableColumn.width = 200;
      tableColumn.dataIndex =
        formData.value.decisionMethod.toLowerCase() + item.toLowerCase();
      tableColumn.slotName = formData.value.decisionMethod + '-' + item;
      arr.splice(3, 0, tableColumn);

      slotList.value.unshift(formData.value.decisionMethod + '-' + item);

      // 获取动态列的select数据
      const code = formData.value.decisionMethod + '_' + item;
      const result = await getMethodRecordData(code);
      const resultObj = Object.keys(result)
        .map((key) => ({
          key,
          value: result[key],
        }))
        .sort((a, b) => Number(a.key) - Number(b.key));
      // methodRecordDataList.value[index] = resultObj;
      methodRecordDataList.value[formData.value.decisionMethod + '-' + item] =
        resultObj;

      if (index === nameList.length - 1) {
        count = true;
      }

      if (recordLevelCallBack && count) {
        recordLevelCallBack();
        recordLevelCallBack = null;
      }

      // 生成待合并的列名构成的数组
      spanColumns.value.push(tableColumn.dataIndex);
    });
    if (formData.value.decisionMethod !== 'DIRECT') {
      arr.splice(-3, 0, {
        dataIndex: 'score',
        title:
          formData.value.decisionMethod === 'LEC' ? 'D(风险值)' : 'R(风险值)',
        slotName: 'score',
        width: 100,
      });
      spanColumns.value.push('score');
    }
    return arr;
  });

  const getTotalScore = useComputed((record: TableData) => {
    let sum = 1;
    slotList.value.forEach((item) => {
      const key = item.split('-').join('').toLowerCase();
      if (+record[key] > 0) {
        sum = Decimal.mul(sum, +record[key]).toNumber();
        return;
      } else {
        sum = 0;
      }
    });
    return sum;
  });

  const spanMethod = (data: {
    record: TableData;
    column: any;
    rowIndex: number;
    columnIndex: number;
  }): { rowspan?: number; colspan?: number } | void => {
    // -------------------------- 合并行 ------------------------------
    // 合并  事故类型行
    const eventFlag = data.rowIndex
      ? data.record.accTypeCode !==
        formData.value.factorInfoList[data.rowIndex - 1].accTypeCode
      : true;

    if (data.column.dataIndex === 'accTypeName' && eventFlag) {
      const arr = formData.value.factorInfoList.filter(
        (item) => item.accTypeCode === data.record.accTypeCode
      );
      return {
        rowspan: arr.length,
      };
    }

    // 合并  不安全因素大类行
    const factorTypeFlag = data.rowIndex
      ? data.record.factorTypeCode !==
          formData.value.factorInfoList[data.rowIndex - 1].factorTypeCode &&
        data.record.accTypeCode ===
          formData.value.factorInfoList[data.rowIndex].accTypeCode
      : true;

    if (data.column.dataIndex === 'factorType' && factorTypeFlag) {
      let arr = formData.value.factorInfoList.filter(
        (item) => item.accTypeCode === data.record.accTypeCode
      );
      arr = arr.filter(
        (item) => item.factorTypeCode == data.record.factorTypeCode
      );
      return {
        rowspan: arr.length,
      };
    }

    // 合并  具体不安全因素描述行 及 同一层级其他行
    const dscFlag = data.rowIndex
      ? data.record.factorDescCode !==
        formData.value.factorInfoList[data.rowIndex - 1].factorDescCode
      : true;

    if (spanColumns.value.includes(data.column.dataIndex) && dscFlag) {
      const arr = formData.value.factorInfoList.filter(
        (item) => item.factorDescCode === data.record.factorDescCode
      );
      return {
        rowspan: arr.length,
      };
    }

    // 合并  应急处置措施
    if (data.column.dataIndex === 'emergMeasure' && eventFlag) {
      const arr = formData.value.factorInfoList.filter(
        (item) => item.accTypeCode === data.record.accTypeCode
      );
      return { rowspan: arr.length };
    }
  };

  const recordChange = (
    value:
      | string
      | number
      | boolean
      | Record<string, any>
      | (string | number | boolean | Record<string, any>)[],
    record: TableData
  ) => {
    // 清空风险情况时，也清空风险等级s
    if (value === '') {
      record.riskLevelCode = undefined;
      return;
    }
    // 判断是否都选择了 并 计算分值
    let flag = true;
    let sum = 1;
    console.log('value:', value);
    slotList.value.forEach((item) => {
      const key = item.split('-').join('').toLowerCase();
      // console.log('item:', item, 'record:', record[key]);

      if (+record[key] > 0) {
        sum *= +record[key];
        return;
      }
      flag = false;
      sum = 0;
    });
    // console.log('sum', sum, flag);

    if (!flag) return;

    // 确定分值范围 计算风险等级
    for (const key in system.value.leverRange) {
      const leverItem = system.value.leverRange[
        key as keyof typeof system.value.leverRange
      ] as string;

      const rangeArr = leverItem.split('-').map((item) => +item);
      if (!rangeArr[1]) rangeArr[1] = +Infinity;

      switch (system.value.method) {
        case 'LS':
          if (sum >= rangeArr[0] && sum <= rangeArr[1]) {
            for (const i in levelMenu.value) {
              if (levelMenu.value[i] === key) {
                record.riskLevelCode = i;
                // record.riskLevel = key;
                break;
              }
            }
          }
          break;
        case 'LEC':
          if (sum > rangeArr[0] && sum <= rangeArr[1]) {
            for (const i in levelMenu.value) {
              if (levelMenu.value[i] === key) {
                record.riskLevelCode = i;
                // record.riskLevel = key;
                break;
              }
            }
          }
          break;
        case 'MES':
          if (sum > rangeArr[0] && sum <= rangeArr[1]) {
            for (const i in levelMenu.value) {
              if (levelMenu.value[i] === key) {
                record.riskLevelCode = i;
                // record.riskLevel = key;
                break;
              }
            }
          }
          break;
        default:
          break;
      }
    }
  };

  const addControlMeasure = (row: TableData, rowIndex: number) => {
    let item: FactorInfo = {};
    item = cloneDeep(row as FactorInfo);

    // 如果采用时间戳作为id ?
    item.controlMeasureCode =
      item.factorDescCode + '-' + (+new Date()).toString();

    item.riskLevel = '';
    item.controlMeasure = '';

    formData.value.factorInfoList.splice(rowIndex + 1, 0, item);
    cloneData.value &&
      cloneData.value.factorInfoList.splice(rowIndex + 1, 0, item);
  };

  const addFactorDesc = (row: TableData, rowIndex: number) => {
    let item: FactorInfo = {};
    item = cloneDeep(row as FactorInfo);

    // 采用时间戳作为id
    item.factorDescCode =
      (((item.accTypeCode as string) + item.factorTypeCode) as string) +
      '-' +
      (+new Date()).toString();

    item.controlMeasureCode =
      item.factorDescCode + '-' + (+new Date()).toString();

    item.factorDesc = '';
    item.riskLevel = '';
    item.riskLevelCode = undefined;
    item.controlMeasure = '';
    item.lecc = '';
    item.lece = '';
    item.lecl = '';
    item.lsl = '';
    item.lss = '';
    item.mese = '';
    item.mesm = '';
    item.mess = '';
    // console.log('item', item);
    let arr = formData.value.factorInfoList.filter(
      (val) => val.accTypeCode === item.accTypeCode
    );
    arr = arr.filter((val) => val.factorTypeCode === item.factorTypeCode);

    formData.value.factorInfoList.splice(rowIndex + arr.length, 0, item);
    cloneData.value &&
      cloneData.value.factorInfoList.splice(rowIndex + arr.length, 0, item);
    // console.table(formData.value.factorInfoList);
  };

  const deleteRow = (rowIndex: number) => {
    formData.value.factorInfoList.splice(rowIndex, 1);
  };

  const cloneData = ref<any>(null); // 用来判断前后数据是否相同
  let cloneBasicData: any = null;

  // 用于给详情回显的回调函数调用
  const Fn = async (data: any) => {
    // 处理具体不安全因素的描述项为空的数据
    // 1、生成空项
    oldEventTypeList = [];
    // formData.value.factorInfoList = [];
    await getEventTypeData();
    eventTypeChange(data.emgcySures);

    // 2、合并空项与接口返回的数据项
    for (let index = 0; index < formData.value.factorInfoList.length; index++) {
      const item = formData.value.factorInfoList[index];

      let count = 0;
      data.factorInfoList.forEach((key: FactorInfo) => {
        // console.log(item);
        if (
          item.accTypeCode === key.accTypeCode &&
          item.factorTypeCode === key.factorTypeCode
        ) {
          count++;
          count === 1
            ? formData.value.factorInfoList.splice(index, 1, cloneDeep(key))
            : formData.value.factorInfoList.splice(
                index + count - 1,
                0,
                cloneDeep(key)
              );
        }
      });
      index = count ? index + count - 1 : index;
    }
    cloneData.value = cloneDeep(formData.value);
  };

  const getDetail = async () => {
    const { data } = await detailDangerPointAPI({
      id: route.query.dangerId as string,
    });
    cloneBasicData = cloneDeep(data);
    const {
      dangerName,
      decisionMethod,
      emgcySures,
      id,
      riskPointId,
      riskPointName,
      riskUnitId,
      safetySigns,
    } = data;

    formData.value = {
      ...formData.value,
      dangerName,
      decisionMethod,
      emgcySures,
      id,
      riskPointId,
      riskPointName,
      riskUnitId,
      safetySigns,
    };

    // 特殊赋值
    formData.value.safetySigns.picPathList = data.safetySigns.picPathList.map(
      (item: string) => {
        return {
          url: item,
        };
      }
    );

    // 处理table数据
    if (count || data.decisionMethod === 'DIRECT') {
      Fn(data);
    } else {
      recordLevelCallBack = () => {
        Fn(data);
      };
    }
  };

  const eventTypeChange = (value: (string | number | boolean)[]) => {
    const arr = [...new Set([...oldEventTypeList, ...value])];

    arr.forEach((i) => {
      // 新增 -- 旧项不包含
      if (!oldEventTypeList.includes(i as string)) {
        // 查找到新增项的事故类型数据
        const item = accidentTypeData.value.list.find((item) => item.id === i);
        if (!item) return;
        const tableItemList: FactorInfo[] = []; // 四项构成的数组

        for (const key in unsafeFactors.value) {
          const tableItem: FactorInfo = {
            lsl: '0',
            lss: '0',
            lecl: '0',
            lece: '0',
            lecc: '0',
            mesm: '0',
            mese: '0',
            mess: '0',
          };

          tableItem.accTypeId = item.id;
          tableItem.accTypeCode = item.accTypeCode;
          tableItem.factorTypeCode = key;
          tableItem.factorDescCode =
            item.accTypeCode + key + '-' + (+new Date()).toString();
          tableItem.controlMeasureCode =
            item.accTypeCode + key + '-' + (+new Date()).toString();
          tableItem.accTypeName = item.accTypeName;
          tableItem.factorType = unsafeFactors.value[key];
          tableItem.emergMeasure = item.disposalMeth;
          tableItem.factorDesc = '';

          tableItem.riskLevel = '';
          tableItem.controlMeasure = '';
          tableItemList.push(tableItem);
        }

        formData.value.factorInfoList = [
          ...formData.value.factorInfoList,
          ...tableItemList,
        ];
      }
      // 移除 -- 新项不包含
      else if (!value.includes(i)) {
        changeBasic('eventType');
        formData.value.factorInfoList = formData.value.factorInfoList.filter(
          (item) => item.accTypeId !== i
        );
      }
    });

    // console.log(oldEventTypeList, value);

    oldEventTypeList = cloneDeep(value as string[]);
  };

  const decisionMethodChange = (value: string | number | boolean) => {
    if (value === 'DIRECT') {
      formData.value.factorInfoList.forEach((item) => {
        item.lsl = '0';
        item.lss = '0';
        item.lecl = '0';
        item.lece = '0';
        item.lecc = '0';
        item.mesm = '0';
        item.mese = '0';
        item.mess = '0';
        item.riskLevel = '';
        item.riskLevelCode = undefined;
      });
    }
  };

  const submit = async () => {
    const value = await form.value.validate();
    if (value) {
      return;
    }
    // 同步表格数据
    const factorDescMap = new Map();
    const riskLevelMap = new Map();
    formData.value.factorInfoList = formData.value.factorInfoList.map(
      (item: any) => {
        if (item.factorDesc) {
          factorDescMap.set(item.factorDescCode, item.factorDesc);
        } else {
          if (factorDescMap.has(item.factorDescCode)) {
            item.factorDesc = factorDescMap.get(item.factorDescCode);
          }
        }
        if (item.riskLevelCode) {
          riskLevelMap.set(item.factorDescCode, item.riskLevelCode);
        } else {
          if (riskLevelMap.has(item.factorDescCode)) {
            item.riskLevelCode = riskLevelMap.get(item.factorDescCode);
          }
        }
        return item;
      }
    );

    // 校验表格数据
    let flag = true; // 标记表格校验的结果
    let count = 0;
    for (let i = 0; i < formData.value.factorInfoList.length; i++) {
      const item = formData.value.factorInfoList[i];
      if (item.factorDesc) count++;
      if (item.factorDesc && (!item.riskLevelCode || !item.controlMeasure)) {
        flag = false;
        break;
      }
    }

    if (!count) {
      Message.error({
        content: '提交失败，需要至少填写一项具体不安全因素描述',
        duration: 3000,
      });
      return;
    }

    if (!flag) {
      Message.error({
        content:
          '提交失败，如果填写了具体不安全因素描述，就必须选择风险情况，填写管控措施！',
        duration: 3000,
      });
      return;
    }
    if (route.query.type !== 'add' && basicInfoVisible.value) {
      Modal.open({
        title: '提示',
        content: h(
          'div',
          null,
          '进行该操作会影响此危险源相关的风险分级管控数据及排查任务内容，是否继续操作？'
        ) as any,
        titleAlign: 'start',
        onOk: async () => {
          handleBeforeSubmit();
        },
      });
    } else {
      handleBeforeSubmit();
    }
  };

  const handleBeforeSubmit = async () => {
    const params = cloneDeep(formData.value);
    params.factorInfoList = formData.value.factorInfoList.filter(
      (item) => item.factorDesc && item.controlMeasure
    );

    params.safetySigns.picPathList = undefined;
    route.query.type === 'add'
      ? await addSubmit(params)
      : await updateubmit(params);
    goBack();
  };

  const addSubmit = async (params: any) => {
    await addDangerPointAPI(params);
    Message.success({
      content: '新增成功',
    });
  };

  const updateubmit = async (params: any) => {
    await updateDangerPointAPI(params);
    Message.success({
      content: '编辑成功',
    });
  };

  // 修改危险源、删除事故类型、编辑具体不安全因素、编辑管控措施都会需要弹窗提醒，新增不弹窗
  const basicInfoVisible = ref(false);
  const changeBasic = (
    str: 'controlMeasure' | 'eventType' | 'factorDesc' | 'dangerName',
    rowIndex?: number
  ) => {
    if (basicInfoVisible.value || !cloneData.value) return;
    switch (str) {
      case 'dangerName': {
        //名称不相同则为编辑
        if (formData.value.dangerName !== cloneData.value.dangerName) {
          basicInfoVisible.value = true;
        }
        break;
      }
      case 'eventType': {
        // 对两个对象的emgcySures属性取差集
        const tempArr = [
          ...new Set(
            cloneData.value.emgcySures.filter(
              (item: any) => !formData.value.emgcySures.includes(item)
            )
          ),
        ];
        const infoArr = Array.from(
          new Set(
            cloneBasicData.factorInfoList.map((ele: any) => ele.accTypeId) //basicData是原始数据，如果有factorInfoList说明原本这条数据至少是有一条具体不安全因素
          )
        );
        // 取交集，如果有交集则说明删除的数据原本是有数据的，则会影响
        if (tempArr.filter((item) => infoArr.includes(item)).length) {
          basicInfoVisible.value = true;
        }
        break;
      }
      case 'factorDesc':
      case 'controlMeasure': {
        if (
          cloneData.value.factorInfoList[rowIndex!] &&
          cloneData.value.factorInfoList[rowIndex!][str] &&
          formData.value.factorInfoList[rowIndex!][str] !==
            cloneData.value.factorInfoList[rowIndex!][str]
        ) {
          basicInfoVisible.value = true;
        }
        break;
      }
    }
  };

  // ------------------------ 抽屉 -----------------------------
  const visible = ref(false);
  const drawerSelectForm = ref<GetSafetySignsListBody>({
    pageNo: 1,
    pageSize: 10,
  });
  const drawerTempSearchForm = ref<GetSafetySignsListBody>({
    pageNo: 1,
    pageSize: 10,
  });
  const safetySignsData = ref<SafetySignsData>({ list: [], total: 0 });
  const allTableData = ref<any[]>([]);
  const selectKeys = ref<string[]>([]);

  const openDrawer = () => {
    visible.value = true;
    selectKeys.value = formData.value.safetySigns.ids as string[];
    getSafetySignsData();
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      drawerSelectForm.value = drawerTempSearchForm.value;
      drawerSelectForm.value.pageNo = 1;
      getSafetySignsData();
    });
  });

  const signsMenu = ref<any>({});
  const getSignsType = async () => {
    const { data } = await getMapDictionaryAPI('safety_sign_type');
    signsMenu.value = data;
  };

  getSignsType();

  const getSafetySignsData = async () => {
    const { data } = await getSafetySignsListAPI(drawerSelectForm.value);
    safetySignsData.value = data;
    allTableData.value = deduplicateByProperty(
      [...data.list, ...allTableData.value],
      'id'
    );
  };

  const deduplicateByProperty = (arr: any[], property: string) => {
    return arr.reduce((uniqueArr, item) => {
      if (
        !uniqueArr.some(
          (i: { [x: string]: any }) => i[property] === item[property]
        )
      ) {
        uniqueArr.push(item);
      }
      return uniqueArr;
    }, []);
  };

  const drawerOk = async () => {
    const picPathList: any = [];
    const picNames: string[] = [];

    allTableData.value.forEach((item: SafetySignsList) => {
      if (selectKeys.value.includes(item.id as string)) {
        picPathList.push({ url: item.pictureUrl });
        picNames.push(item.pictureName as string);
      }
    });

    formData.value.safetySigns.ids = selectKeys.value;
    formData.value.safetySigns.picPathList = picPathList;
    formData.value.safetySigns.names = picNames.join(',');

    // 手动触发校验
    form.value.validateField('safetySigns.ids');

    drawerCancel();
  };

  const drawerCancel = () => {
    drawerSelectForm.value = drawerTempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
    };
    visible.value = false;
    selectKeys.value = [];
  };

  // ------------------ 抽屉table分页 ----------------------

  const currentChange = (current: number) => {
    drawerSelectForm.value.pageNo = current;
    getSafetySignsData();
  };

  const pageSizeChange = (pageSize: number) => {
    drawerSelectForm.value.pageSize = pageSize;
    getSafetySignsData();
  };
</script>

<style lang="less" scoped>
  .arco-card.content-card {
    // min-height: 96%;
    .header {
      font-size: 18px;
      // font-weight: 700;
      margin-bottom: 20px;
      .title {
        margin-left: 8px;
      }
    }
    .title {
      margin: 30px 0 20px;
      &.control {
        margin-top: 40px;
      }
      .arco-divider-vertical {
        margin-right: 2px;
        border-left: 1px solid #409eff;
      }
    }
    .arco-row {
      padding-right: 40px;
    }
    .icon-content {
      display: flex;
      justify-content: space-between;
      .left {
        flex: 1;
      }
      .right {
        width: 50px;
      }
      .icon {
        margin-left: 16px;
        color: rgb(var(--arcoblue-6));
        font-size: 14px;
      }
    }
    .alert {
      margin-bottom: 10px;
    }
  }

  .btn {
    margin-top: 12px;
    width: 100%;
    text-align: center;
  }

  .table-img {
    width: 46px;
    height: 60px;
  }
  :deep(.arco-form) {
    margin-left: 26px;
    width: calc(100% - 26px);
    .title {
      font-family: 'Alibaba-Medium';
      font-size: 16px;
      font-weight: 500;
    }
  }
</style>
<style lang="less">
  .identificationDrawer {
    .arco-drawer-body {
      padding: 0;
    }
    .arco-drawer-body .arco-card-bordered {
      border: none;
      .arco-card-body {
        padding: 0;
      }
    }
    .arco-drawer-footer {
      border-top: none;
    }
  }
</style>
