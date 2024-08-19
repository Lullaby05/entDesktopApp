<template>
  <div class="container" v-loading="loading">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">风险分级管控</span>
      </div>
      <div class="title">
        <!-- <a-divider direction="vertical" :size="6" /> -->
        基本信息
      </div>
      <a-form
        ref="form"
        :model="formData"
        :label-col-props="{ span: 5 }"
        :rules="rules"
      >
        <a-row>
          <a-form-item field="riskUnitId" label="风险单元" required>
            <a-tree-select
              v-model:model-value="formData.riskUnitId"
              disabled
              :data="riskUnitData"
              :fallback-option="false"
              placeholder="请选择风险单元"
              :field-names="{
                key: 'id',
                title: 'name',
              }"
            >
            </a-tree-select>
          </a-form-item>

          <a-form-item field="riskPointId" label="风险点" required>
            <a-input
              v-model:model-value="formData.riskPointName"
              disabled
              placeholder="请输入风险点名称"
            >
            </a-input>
          </a-form-item>
          <a-form-item field="riskLevelCode" label="风险等级" required>
            <a-select
              v-model="formData.riskLevelCode"
              disabled
              placeholder="请选择风险等级"
              :fallback-option="false"
            >
              <a-option v-for="(value, key) of levelEnum" :value="key">{{
                value
              }}</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="dutyDeptId" label="责任部门" required>
            <a-tree-select
              v-model:model-value="formData.dutyDeptId"
              disabled
              :fallback-option="false"
              placeholder="请选择部门"
              :field-names="{
                key: 'id',
                title: 'name',
              }"
              :data="organizationTree"
            ></a-tree-select>
          </a-form-item>
        </a-row>
      </a-form>

      <!-- table -->
      <div class="title control">
        <!-- <a-divider direction="vertical" :size="6" /> -->
        分级管控
      </div>
      <div style="margin: 0 25px 10px">
        <a-alert banner center class="alert">
          若选择了管控层级，则每一个管控层级都须选择相应的管控部门、管控周期和责任人！
        </a-alert>
      </div>
      <a-table
        :data="formData.controlItemList"
        row-key="controlLevelId"
        :columns="columns"
        :bordered="{ cell: true }"
        :style="{ minHeight: '320px', padding: '0 25px' }"
        :span-method="spanMethod"
        :pagination="false"
      >
        <!-- 风险等级 -->
        <template #riskLevelCode="{ record }">
          {{ record.riskLevel }}
        </template>
        <!-- 管控措施 -->
        <template #controlMeasure="{ record }">
          <div class="icon-content">
            <span class="left">{{ record.controlMeasure }}</span>
            <span class="right">
              <a-button
                v-permission="'ControlForm'"
                type="text"
                size="mini"
                @click="handleEditForm(record)"
                >表单管理</a-button
              ></span
            >
          </div>
        </template>

        <!-- 管控层级 -->
        <template #controlLevelCode="{ record, rowIndex }">
          <div class="icon-content">
            <span class="left">
              <a-select
                v-if="!record.controlLevelCode"
                v-model:model-value="record.controlLevelCode"
                :fallback-option="false"
                allow-clear
                placeholder="请选择管控层级"
                @change="controlLevelChange($event, rowIndex)"
              >
                <a-option v-for="(value, key) of controlLevelMenu" :value="key">
                  {{ value }}
                </a-option>
              </a-select>
              <a-select
                v-else
                disabled
                v-model:model-value="record.controlGradeCode"
                :fallback-option="false"
                allow-clear
                placeholder="请选择管控层级"
              >
                <a-option v-for="(value, key) of deptTypeData" :value="key">
                  {{ value }}
                </a-option>
              </a-select>
            </span>
            <span class="right">
              <a-button
                v-if="
                  record.controlMeasureCode !==
                    formData.controlItemList[rowIndex - 1]
                      ?.controlMeasureCode && record.controlLevelCode
                "
                type="text"
                size="mini"
                @click="
                  reCheckControlLevel(
                    record.controlMeasureCode,
                    rowIndex,
                    record.id
                  )
                "
                >重新选择</a-button
              >
            </span>
          </div>
        </template>

        <!-- 管控部门 -->
        <template #controlDeptId="{ record, rowIndex }">
          <a-tree-select
            v-model:model-value="record.controlDeptId"
            :fallback-option="false"
            :placeholder="`${placeholder[0]}${
              deptTypeData[record.controlGradeCode]
                ? deptTypeData[record.controlGradeCode]
                : ''
            }${placeholder[1]}`"
            allow-clear
            allow-search
            :field-names="{
              key: 'id',
              title: 'name',
            }"
            :data="deptData"
            :disable-filter="true"
            @search="onDeptSearch"
            @blur="clearSearchKey"
            @clear="clearSearchKey"
            @change="controlDeptChange(record, rowIndex)"
          ></a-tree-select>
        </template>

        <!-- 管控周期 -->
        <template #controlCycleCode="{ record, rowIndex }">
          <a-select
            v-model:model-value="record.controlCycleCode"
            :fallback-option="false"
            :placeholder="`${placeholder[0]}${
              deptTypeData[record.controlGradeCode]
                ? deptTypeData[record.controlGradeCode]
                : ''
            }${placeholder[2]}`"
            allow-clear
            allow-search
            @change="changeFlag(record, rowIndex)"
          >
            <a-option v-for="(value, key) of controlCycleEnum" :value="key">
              {{ value }}
            </a-option>
          </a-select>
        </template>

        <!-- 责任人 -->
        <template #controlPersonId="{ record, rowIndex }">
          <a-select
            v-model:model-value="record.controlPersonId"
            :options="staffDataMap.get(record.controlDeptId)"
            :fallback-option="false"
            allow-clear
            allow-search
            :placeholder="`${placeholder[0]}${
              deptTypeData[record.controlGradeCode]
                ? deptTypeData[record.controlGradeCode]
                : ''
            }${placeholder[3]}`"
            :field-names="{
              value: 'id',
              label: 'userName',
            }"
            @change="changePerson(record, rowIndex)"
          >
          </a-select>
        </template>
      </a-table>
      <div class="btn">
        <a-space>
          <a-button @click="goBack">取消</a-button>
          <a-button type="primary" @click="submit">保存</a-button>
        </a-space>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
  import SnowflakeId from 'snowflake-id'; // 生成雪花id
  import { h, onActivated, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { storeToRefs } from 'pinia';
  import { cloneDeep } from 'lodash';
  import { useUserStore, useEnterpriseStore, useAppStore } from '@/store';
  import useLoading from '@/hooks/loading';
  import { Message, Modal } from '@arco-design/web-vue';
  import {
    getStaffDataAllAPI,
    getOrganizationTreeAPI,
    getStaffDataMapAll,
  } from '@/api/enterpriseManage';
  import {
    getEnumListAPI,
    getMapDictionaryAPI,
    getSystemDicAPI,
  } from '@/api/index';
  import {
    getRiskUnitTeeBodyAPI,
    detailRiskPointControlAPI,
    updateRiskPointControlAPI,
    deleteRiskPointControlAPI,
    getRiskInfluceCount,
    createRiskPointControlAPI,
  } from '@/api/risk';
  import type { RiskPointControl, ControlItem } from '@/api/risk';
  import type { StaffItem } from '@/views/enterpriseManage/staffManage/index';
  import type { RiskUnitDataItem } from '@/views/risk/identificationAndEvaluation/index';
  import type { TableColumnData, TableData } from '@arco-design/web-vue';
  import type { OrganizationTreeData } from '@/store/modules/enterprise/types';
  import { useRiskStore } from '@/store';
  import useJudgeBindingUser from '@/hooks/judgeBindingUser';
  import { defaultFormConfig } from './composition/defaultFormConfig';

  export default {
    name: 'GradedControlControl',
  };
</script>

<script lang="ts" setup>
  const route = useRoute();
  const router = useRouter();

  const userStore = useUserStore();
  const enterpriseStore = useEnterpriseStore();
  const riskStore = useRiskStore();

  enterpriseStore.getOrganizationTree({
    enterpriseId: userStore.userInfo.enterpriseId as string,
  });

  // 使用map来获取对应部门下面的员工数据
  const staffDataMap = ref<Map<string, any>>(new Map()); // 用来存放不同部门对应的员工下拉数据

  const delRowIds = ref<string[]>([]);
  const delRowControlIds = ref<string[]>([]);
  let tableDataClone: any[] = [];

  const { organizationTree } = storeToRefs(enterpriseStore);

  const goBack = () => {
    let isEdit = false;
    for (let value of riskStore.riskFormMap.values()) {
      if (value.isEdit) {
        isEdit = value.isEdit;
        break;
      }
    }
    if (isEdit) {
      Modal.open({
        title: '提示',
        content: '您当前填写了分级管控表单数据，退出将会丢失，是否继续？',
        titleAlign: 'start',
        onOk: () => {
          riskStore.clearRiskForm();
          delRowIds.value = [];
          delRowControlIds.value = [];
          router.back();
        },
      });
    } else {
      riskStore.clearRiskForm();
      delRowIds.value = [];
      delRowControlIds.value = [];
      router.back();
    }
  };
  const placeholder = ['请选择', '管控部门', '管控周期', '管控责任人'];

  const snowflake = new SnowflakeId({
    mid: 42,
    offset: (2019 - 1970) * 31536000 * 1000,
  });
  // -------------------- 前置数据 ----------------------
  const pageData = JSON.parse(route.query.data as string);
  enterpriseStore.getOrganizationTree({
    enterpriseId: userStore.userInfo.enterpriseId as string,
  });

  // 管控层级：班组 车间-班组 部门-车间-班组 企业-部门-车间-班组

  const controlLevelMenu = ref<any>({});

  const getControlLevelMenu = async () => {
    const { data } = await getMapDictionaryAPI('control_level');
    controlLevelMenu.value = data;
  };

  const deptTypeData = ref<any>({});

  const getDeptType = async () => {
    const { data } = await getMapDictionaryAPI('organize_level');
    deptTypeData.value = data;
  };

  // 风险单元
  const riskUnitData = ref<RiskUnitDataItem[]>([]);

  const getRiskUnitData = async () => {
    const { data } = await getRiskUnitTeeBodyAPI();
    riskUnitData.value = data;
  };

  getRiskUnitData();

  // 风险等级
  const levelEnum = ref<any>({});

  const getLevelEnum = async () => {
    const { data } = await getMapDictionaryAPI('risk_level');
    levelEnum.value = data;
  };

  // 管控措施单元格点击事件
  const handleEditForm = (tableData: TableData) => {
    const { id, formItems } = tableData;
    riskStore.setRiskForm(id, {
      formItems: formItems,
      isEdit: false,
    });
    router.push({
      name: 'ControlForm',
      query: {
        id,
      },
    });
  };

  getLevelEnum();

  // 管控周期
  const controlCycleEnum = ref<any>();

  const getControlCycleEnum = async () => {
    const { data } = await getMapDictionaryAPI('control_cycle');
    controlCycleEnum.value = data;
  };

  // 员工列表
  const staffData = ref<StaffItem[]>([]);

  const getStaffData = async () => {
    // const { data: res } = await getStaffDataAllAPI({
    //   enterpriseId: userStore.userInfo.enterpriseId as string,
    // });
    const { data: res } = await getStaffDataMapAll({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });

    // staffData.value = res;
    for (let key in res) {
      staffDataMap.value.set(key, res[key]);
    }
  };

  // const getStaff = async () => {
  //   const { data: res } = await getStaffDataAllAPI({
  //     enterpriseId: userStore.userInfo.enterpriseId as string,
  //   });
  //   staffData.value = res;
  // };

  // getStaff();

  // 处理编辑时先获取前置数据成功在进行详情数据赋值

  // 部门下拉搜索
  const deptData = ref<OrganizationTreeData[]>([]);
  let depatTree: OrganizationTreeData[] = [];

  const getDeptData = async () => {
    const { data } = await getOrganizationTreeAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    deptData.value = data;
    depatTree = cloneDeep(deptData.value);
  };

  const searchData = (keyword: string, arr: any) => {
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

    return loop(arr);
  };

  // 根据id在树形表里搜索对应名称
  function searchNameById(id: string, data: any[]) {
    let result = '';
    const loop = (data: any) => {
      data.forEach((item: any) => {
        if (item.id === id) {
          result = item.name;
        } else if (item.children) {
          result = loop(item.children);
        }
      });
      return result;
    };
    return loop(data);
  }

  const onDeptSearch = (searchKey: string) => {
    setTimeout(() => {
      deptData.value = searchData(searchKey, depatTree);
    }, 200);
  };

  const clearSearchKey = () => {
    onDeptSearch('');
  };

  const controlDeptChange = (record: any, index: number) => {
    record.controlPersonId = '';
    changeFlag(record, index);
  };

  const { judgeBinding, judgeHasPermission } = useJudgeBindingUser();

  const changePerson = async (record: any, index: number) => {
    const { controlPersonId, controlDeptId } = record;
    const personObj = staffData.value.find(
      (ele) => ele.id === record.controlPersonId
    );
    const userName = personObj && personObj.userName;
    const deptName = searchNameById(record.controlDeptId, deptData.value);
    const result = await judgeBinding({
      record: {
        id: controlPersonId,
        userName: userName || '',
        deptId: controlDeptId,
        deptName: deptName || '',
      },
    });
    if (result) {
      if (result.hasBindingUser) {
        const hasPermission = await judgeHasPermission({
          id: controlPersonId,
          moduleNamesPC: 'ExecuteDailyTask',
          moduleNamesWX: 'CheckTaskExecute',
        });
        if (!hasPermission) return;
      }
      changeFlag(record, index);
    } else {
      record.controlPersonId = '';
    }
  };

  const changeFlag = (record: any, index: number) => {
    if (!record.controlId) return;
    const obj: any = {
      controlPersonId: record.controlPersonId,
      controlDeptId: record.controlDeptId,
      controlCycleCode: record.controlCycleCode,
    };
    const keys = Object.keys(obj);
    for (let i = 0; i < keys.length; i++) {
      if (tableDataClone[index][keys[i]] !== obj[keys[i]]) {
        formData.value.controlItemList[index].flag = true;
      }
    }
  };

  //  ------------------- 表单 --------------------------
  const formData = ref<RiskPointControl>({
    tenantId: userStore.tenantId as string,
    riskPointId: '', // 风险点
    riskUnitId: '',
    dutyDeptId: '', // 责任部门
    riskLevelCode: '', // 风险等级
    controlItemList: [],
  });
  const form = ref();

  const rules = ref({
    riskUnitId: [{ required: true, message: '请选择风险单元' }],
    riskPointId: [{ required: true, message: '请输入风险点名称' }],
    riskLevelCode: [{ required: true, message: '请选择风险等级' }],
    dutyDeptId: [{ required: true, message: '请选择责任部门' }],
  });

  const columns: TableColumnData[] = [
    {
      title: '风险点',
      width: 100,
      fixed: 'left',
      dataIndex: 'riskPointName',
    },
    {
      title: '危险源',
      width: 100,
      fixed: 'left',
      dataIndex: 'dangerName',
    },
    {
      title: '事故类型',
      width: 100,
      fixed: 'left',
      dataIndex: 'accTypeName',
    },
    {
      title: '不安全因素大类',
      width: 200,
      dataIndex: 'factorType',
    },
    {
      title: '具体不安全因素',
      width: 200,
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
      width: 300,
      dataIndex: 'controlMeasure',
      slotName: 'controlMeasure',
    },
    {
      title: '管控层级',
      width: 300,
      slotName: 'controlLevelCode',
      dataIndex: 'controlLevelCode',
    },
    {
      title: '管控部门',
      width: 200,
      slotName: 'controlDeptId',
      dataIndex: 'controlDeptId',
    },
    {
      title: '管控周期',
      width: 200,
      slotName: 'controlCycleCode',
      dataIndex: 'controlCycleCode',
    },
    {
      title: '责任人',
      width: 200,
      slotName: 'controlPersonId',
      dataIndex: 'controlPersonId',
    },
  ];

  const spanMethod = (data: {
    record: TableData;
    column: any;
    rowIndex: number;
    columnIndex: number;
  }): { rowspan?: number; colspan?: number } | void => {
    // -------------------------- 合并行 ------------------------------

    // 合并风险点
    const riskPointFlag = data.rowIndex
      ? data.record.riskPointId !==
        formData.value.controlItemList[data.rowIndex - 1].riskPointId
      : true;

    if (data.column.dataIndex === 'riskPointName' && riskPointFlag) {
      const arr = formData.value.controlItemList.filter(
        (item) => item.riskPointId === data.record.riskPointId
      );
      return {
        rowspan: arr.length,
      };
    }

    // 合并危险源
    const dangerPointFlag = data.rowIndex
      ? data.record.dangerFactorId !==
        formData.value.controlItemList[data.rowIndex - 1].dangerFactorId
      : true;

    if (data.column.dataIndex === 'dangerName' && dangerPointFlag) {
      const arr = formData.value.controlItemList.filter(
        (item) => item.dangerFactorId === data.record.dangerFactorId
      );
      return {
        rowspan: arr.length,
      };
    }

    // 合并  事故类型行

    const eventFlag = data.rowIndex
      ? data.record.dangerFactorId !==
          formData.value.controlItemList[data.rowIndex - 1].dangerFactorId ||
        data.record.accTypeCode !==
          formData.value.controlItemList[data.rowIndex - 1].accTypeCode
      : true;

    if (data.column.dataIndex === 'accTypeName' && eventFlag) {
      let arr = formData.value.controlItemList.filter(
        (item) => item.dangerFactorId === data.record.dangerFactorId
      );
      arr = arr.filter((item) => item.accTypeCode === data.record.accTypeCode);
      return {
        rowspan: arr.length,
      };
    }

    // 合并  不安全因素大类行
    const desFlag = data.rowIndex
      ? data.record.dangerFactorId !==
          formData.value.controlItemList[data.rowIndex - 1].dangerFactorId ||
        data.record.accTypeCode !==
          formData.value.controlItemList[data.rowIndex - 1].accTypeCode ||
        data.record.factorTypeCode !==
          formData.value.controlItemList[data.rowIndex - 1].factorTypeCode
      : true;

    if (data.column.dataIndex === 'factorType' && desFlag) {
      let arr = formData.value.controlItemList.filter(
        (item) => item.dangerFactorId === data.record.dangerFactorId
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
        formData.value.controlItemList[data.rowIndex - 1].factorDescCode
      : true;

    if (
      (data.column.dataIndex === 'factorDesc' ||
        data.column.dataIndex === 'riskLevelCode') &&
      measureFlag
    ) {
      const arr = formData.value.controlItemList.filter(
        (item) => item.factorDescCode === data.record.factorDescCode
      );
      return {
        rowspan: arr.length,
      };
    }

    // 合并  管控措施
    const controlMeasureFlag = data.rowIndex
      ? data.record.controlMeasureCode !==
        formData.value.controlItemList[data.rowIndex - 1].controlMeasureCode
      : true;

    if (data.column.dataIndex === 'controlMeasure' && controlMeasureFlag) {
      const arr = formData.value.controlItemList.filter(
        (item) => item.controlMeasureCode === data.record.controlMeasureCode
      );

      return {
        rowspan: arr.length,
      };
    }
  };

  const controlLevelChange = (
    value:
      | string
      | number
      | boolean
      | Record<string, any>
      | (string | number | boolean | Record<string, any>)[],
    index: number
  ) => {
    let levelCodeName =
      controlLevelMenu.value[value as keyof typeof controlLevelMenu.value];
    let arr = levelCodeName.split('-');
    arr.forEach((item: string) => {
      let placeholderCycle = '请选择' + item + '管控周期';
      let placeholderPerson = '请选择' + item + '责任人';
      let controlItem: any = {};
      controlItem = cloneDeep(formData.value.controlItemList[index]);
      let i = 0;
      for (let key in deptTypeData.value) {
        if (deptTypeData.value[key] === item) {
          controlItem.controlGradeCode = key;
          controlItem.controlLevel = item;
          if (i !== Object.keys(deptTypeData.value).length - 1) {
            controlItem.controlDeptId = '';
            controlItem.controlCycleCode = '';
            controlItem.controlPersonId = '';
          }
          // controlItem.controlLevelName = deptTypeData.value[key];
          controlItem.controlLevelId = snowflake.generate() + '';
          formData.value.controlItemList.splice(index + 1, 0, controlItem);
        }
        i++;
      }
    });
    formData.value.controlItemList.splice(index, 1);
  };

  const reCheckControlLevel = (
    controlMeasureCode: string,
    index: any,
    id: string
  ) => {
    // 重新选择的时候记录重新选择的id，需要先删除这些id再进行新增
    const delIndex: number = formData.value.controlItemList.findIndex(
      (ele: any) => ele.id === id && ele.controlId
    );
    // 点击重新选择的时候需要记录一下需要删除的id
    if (delIndex > -1 && !delRowIds.value.includes(id)) {
      delRowIds.value.push(id);
    }

    const controlIds = formData.value.controlItemList
      .filter((ele: any) => ele.id === id)
      .map((ele: any) => ele.controlId);

    if (delIndex > -1) {
      delRowControlIds.value = Array.from(
        new Set([...delRowControlIds.value, ...controlIds])
      );
    }

    let obj = formData.value.controlItemList.find(
      (item) => item.controlMeasureCode === controlMeasureCode
    );
    formData.value.controlItemList = formData.value.controlItemList.filter(
      (item) => item.controlMeasureCode !== controlMeasureCode
    );
    if (obj) {
      obj.controlLevelCode = '';
      // 添加一条数据
      obj.controlGradeCode = null;
      obj.controlCycleCode = '';
      obj.controlCycle = '';
      obj.controlDeptId = '';
      obj.controlLevel = '';
      obj.controlPersonId = '';
      obj.controlPersonName = '';
      obj.controlId = null;
      obj.flag = null;
      formData.value.controlItemList.splice(index, 0, obj as any);
    }
    // tableDataClone = cloneDeep(formData.value.controlItemList);
  };

  onActivated(() => {
    if (riskStore.riskFormMap.size === 0) {
      getDetail();
    }
    formData.value.controlItemList = formData.value.controlItemList.map(
      (item: any) => {
        const hasFormItem = riskStore.getRiskForm(item.id);
        if (riskStore.riskFormMap.size && hasFormItem) {
          return {
            ...item,
            formItems: riskStore.getRiskForm(item.id).formItems,
            formFlag: item.controlId ? true : null,
            flag: item.controlId ? true : null,
          };
        }
        return { ...item };
      }
    );
  });

  const getDetail = async () => {
    Promise.all([
      getOrganizationTreeAPI({
        enterpriseId: userStore.userInfo.enterpriseId as string,
      }),
      getMapDictionaryAPI('organize_level'),
      getMapDictionaryAPI('control_level'),
      getMapDictionaryAPI('control_cycle'),
      getStaffDataAllAPI({
        enterpriseId: userStore.userInfo.enterpriseId as string,
      }),
      getStaffDataMapAll({
        enterpriseId: userStore.userInfo.enterpriseId as string,
      }),
    ])
      .then(async (result) => {
        const { data: res } = await detailRiskPointControlAPI({
          id: route.query.id as string,
        });
        deptData.value = result[0].data;
        depatTree = cloneDeep(deptData.value);
        deptTypeData.value = result[1].data;
        controlLevelMenu.value = result[2].data;
        controlCycleEnum.value = result[3].data;
        staffData.value = result[4].data;
        for (let key in result[5].data) {
          staffDataMap.value.set(key, result[5].data[key]);
        }
        formData.value = pageData;
        const valueMap = new Map();
        formData.value.controlItemList = res.map((item: TableData) => {
          if (!valueMap.has(item.id)) {
            const defaultConfig = defaultFormConfig(true);
            valueMap.set(item.id, JSON.stringify({ design: defaultConfig }));
          }
          if (!item.formItems) {
            item.formItems = valueMap.get(item.id);
          }
          return item;
        });
        tableDataClone = cloneDeep(res);
      })
      .catch(async (err) => {
        Message.error({
          content: '数据获取失败' + err,
        });
        // 某个未知的前置数据获取失败，不让其影响页面的使用，仅仅是没有数据
        getDeptData();
        getControlLevelMenu();
        getStaffData();
        getControlCycleEnum();
        getDeptType();

        const { data: res } = await detailRiskPointControlAPI({
          id: route.query.id as string,
        });
        formData.value = pageData;
        const valueMap = new Map();
        formData.value.controlItemList = res.map((item: TableData) => {
          if (!valueMap.has(item.id)) {
            const defaultConfig = defaultFormConfig(true);
            valueMap.set(item.id, JSON.stringify({ design: defaultConfig }));
          }
          item.formItems = valueMap.get(item.id);
          return item;
        });
      });
  };

  getDetail();

  // 10-24 修改需求后没有使用
  const addControlLevel = (row: TableData, rowIndex: number) => {
    let item: ControlItem = {};
    item = cloneDeep(row as ControlItem);

    // 如果采用时间戳作为id ?
    item.controlLevelId = (+new Date()).toString();
    item.controlLevelCode = '';
    item.controlDeptId = '';
    item.controlCycleCode = '';
    item.controlPersonId = '';

    formData.value.controlItemList.splice(rowIndex + 1, 0, item);
  };

  const deleteRow = (rowIndex: number) => {
    formData.value.controlItemList.splice(rowIndex, 1);
  };

  const { loading, setLoading } = useLoading();
  const submit = async () => {
    const res = await form.value.validate();
    if (res) {
      return;
    }
    let controlItemList = cloneDeep(formData.value.controlItemList);
    let controlDeptIdFlag = 0;
    let controlPersonIdFlag = 0;
    let controlCycleCodeFlag = 0;
    // 按照后端的要求把每条数据的dangerFactorId替换为id
    controlItemList = controlItemList.map((item) => {
      // 有选择管控层级时
      if (item.controlLevelCode) {
        const level = deptTypeData.value[item.controlGradeCode];
        // 校验管控部门是否为空
        if (!item.controlDeptId) {
          controlDeptIdFlag += 1;
        }

        // 校验管控周期是否为空
        if (!item.controlCycleCode) {
          controlCycleCodeFlag += 1;
        }

        // 校验管控人是否为空
        if (!item.controlPersonId) {
          controlPersonIdFlag += 1;
        }
      } else {
        // 没选管控层级的话清空管控部门、管控周期、责任人
        item.controlDeptId = '';
        item.controlCycleCode = '';
        item.controlPersonId = '';
      }
      // item.dangerFactorId = item.id;
      // item.id = undefined;
      const personObj = staffData.value.find(
        (ele) => ele.id === item.controlPersonId
      );
      item.controlPersonName = personObj && personObj.userName;
      item.controlDeptName = searchNameById(item.controlDeptId, deptData.value);
      return item;
    });
    // 校验管控部门,管控周期,管控人是否为空
    if (
      controlDeptIdFlag > 0 ||
      controlCycleCodeFlag > 0 ||
      controlPersonIdFlag > 0
    ) {
      Message.warning({
        content:
          '若选择了管控层级，则每一个管控层级都须选择相应的管控部门、管控周期和责任人！',
      });
      return;
    }
    const editIds: string[] = controlItemList.map((item: any) => {
      if (item.flag && item.controlId) {
        // 原本没有formItems的情况下不添加id
        const hasForm =
          tableDataClone.findIndex(
            (ele) => ele.controlId === item.controlId && ele.formItems
          ) > -1;
        if (hasForm) {
          return item.controlId;
        }
      }
    });
    let count = 0;
    const paramsList = judgeIsEdit(controlItemList, editIds);
    if (paramsList.length) {
      const { data } = await getRiskInfluceCount(paramsList);
      count = data;
    }
    const handledControlItemList = handleControlList(controlItemList);
    try {
      setLoading(true);
      // 所有controlId都为空说明是第一次管控
      if (tableDataClone.every((item) => !item.controlId)) {
        // 新增API
        await createRiskPointControlAPI(controlItemList);
        Message.success({
          content: '提交成功',
        });
        setLoading(false);
        riskStore.clearRiskForm();
        delRowIds.value = [];
        delRowControlIds.value = [];
        router.back();
        return;
      }
      if (count) {
        Modal.open({
          title: '提示',
          content: h('div', null, [
            `进行该操作不会生成新任务，只会更新已经生成的`,
            h('span', { style: { color: 'red' } }, count),
            `个待完成任务内容，不影响已完成任务内容，请求确认是否进行该操作？`,
          ]) as any,
          titleAlign: 'start',
          onOk: async () => {
            // 删除API
            // if (delRowIds.value.length) {
            //   const { code } = await deleteRiskPointControlAPI(delRowIds.value);
            //   if (code !== 0) return;
            // }
            // 提交 API
            await updateRiskPointControlAPI(handledControlItemList);
            setLoading(false);
            Message.success({
              content: '提交成功',
            });
            riskStore.clearRiskForm();
            delRowIds.value = [];
            delRowControlIds.value = [];
            router.back();
          },
        });
      } else {
        // 删除API
        // if (delRowIds.value.length) {
        //   const { code } = await deleteRiskPointControlAPI(delRowIds.value);
        //   if (code !== 0) return;
        // }
        // 提交 API
        await updateRiskPointControlAPI(handledControlItemList);
        Message.success({
          content: '提交成功',
        });
        setLoading(false);
        riskStore.clearRiskForm();
        delRowIds.value = [];
        delRowControlIds.value = [];
        router.back();
      }
    } finally {
      setLoading(false);
    }
  };
  // 处理需要更新的数据
  const judgeIsEdit = (controlItemList: any[], editIds: any[]) => {
    const mapFn = (item: any) => {
      return {
        controlPersonId: item.controlPersonId,
        controlCycleCode: item.controlCycleCode,
        controlPersonName: item.controlPersonName,
      };
    };
    // 纯删除的
    const delList = tableDataClone
      .filter((item) => delRowControlIds.value.includes(item.controlId))
      .map(mapFn);
    // 纯新增的
    const addList = controlItemList
      .filter(
        (ele: any) =>
          !ele.controlId && ele.controlPersonId && ele.controlCycleCode
      )
      .map(mapFn);
    // 编辑删除的
    const editDelList = tableDataClone
      .filter((item) => editIds.includes(item.controlId))
      .filter((item) => {
        // 找相同id下面的相同责任人和管控周期的数据,如果有相同的则不需要删除也不需要新增
        const sameFormIdList = controlItemList.filter(
          (ele: any) => ele.id === item.id && ele.controlId !== item.controlId
        );
        return !sameFormIdList.some(
          (ele: any) =>
            ele.controlPersonId + ele.controlCycleCode ===
            item.controlPersonId + item.controlCycleCode
        );
      })
      .map(mapFn);
    // 编辑新增的
    const editAddList = controlItemList
      .filter((item: any) => editIds.includes(item.controlId))
      .filter((item: any) => {
        // 找相同id下面的相同责任人和管控周期的数据,如果有相同的则不需要删除也不需要新增
        const sameFormIdList = controlItemList.filter(
          (ele: any) => ele.id === item.id && ele.controlId !== item.controlId
        );
        return !sameFormIdList.some(
          (ele: any) =>
            ele.controlPersonId + ele.controlCycleCode ===
            item.controlPersonId + item.controlCycleCode
        );
      })
      .map(mapFn);
    // 只修改了表单的
    const editFormList: any = controlItemList.filter(
      (item: any) => item.formFlag
    );
    // 取删除和新增的交集
    const delListFiltered = [...delList, ...editDelList].filter((item) => {
      return [...addList, ...editAddList].some(
        (ele) =>
          ele.controlPersonId + ele.controlCycleCode ===
          item.controlPersonId + item.controlCycleCode
      );
    });
    // 在删除和新增中都删除这些交集部分
    const paramsList = [...delList, ...addList, ...editDelList, ...editAddList]
      .filter((item) => {
        return !delListFiltered.some(
          (ele) =>
            ele.controlPersonId + ele.controlCycleCode ===
            item.controlPersonId + item.controlCycleCode
        );
      })
      .concat(...editFormList);
    return paramsList;
  };
  // 处理需要提交给后端的数据
  const handleControlList = <T>(controlItemList: T[]): T[] => {
    const indexMap = new Map();
    const editIds = controlItemList
      .filter((item: any) => item.flag || item.formFlag)
      .map((item: any) => item.id);
    const handledControlItemList = controlItemList
      .map((item: any) => {
        if (indexMap.has(item.id)) {
          indexMap.set(item.id, indexMap.get(item.id));
        } else {
          indexMap.set(item.id, 0);
        }
        // 先判断是否是删除的
        if (delRowIds.value.includes(item.id)) {
          // 如果管控周期和责任人有数据说明是先删除了再新增的，把controlId给加回去
          if (item.controlCycleCode && item.controlPersonId) {
            const controlIds = tableDataClone
              .filter((ele) => ele.id === item.id)
              .map((ele) => ele.controlId);
            // 查找当前这条数据在这个id里是第几个
            const index = indexMap.get(item.id);
            indexMap.set(item.id, index + 1);
            item.controlId = controlIds[index] ?? null;
            item.delFlag = false;
          } else {
            item.delFlag = true;
          }
        } else if (
          editIds.includes(item.id) ||
          (!item.controlId && item.controlPersonId && item.controlCycleCode)
        ) {
          // 判断是否是编辑的或者新增的
          item.delFlag = false;
        } else {
          item.delFlag = null;
        }
        return item;
      })
      .filter((ele: any) => {
        return ele.delFlag !== null;
      });
    return handledControlItemList;
  };
</script>

<style lang="less" scoped>
  .arco-card.content-card {
    // min-height: 96%;
    // min-height: calc(100vh - 265px);
    .header {
      font-size: 18px;
      // font-weight: 700;
      margin-bottom: 20px;

      .title {
        margin-left: 8px;
      }
    }

    div.title {
      padding-left: 25px;
      margin: 30px 0 20px;
      font-family: 'Alibaba-Medium';
      font-size: 16px;
      font-weight: 500;

      &.control {
        margin-top: 40px;
      }

      .arco-divider-vertical {
        margin-right: 2px;
        border-left: 1px solid #409eff;
      }
    }

    .arco-row {
      padding-right: 20px;
    }

    .icon-content {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .left {
        flex: 1;
      }

      .right {
        width: 60px;
      }

      .icon {
        margin-left: 16px;
        color: rgb(var(--arcoblue-6));
        font-size: 14px;
      }
    }

    .arco-form-item {
      width: calc(100% / 2);

      .arco-input-prepend {
        color: #aeb2c2;
      }
    }

    .form-item-space {
      margin-top: 14px;

      .icon {
        margin-right: 8px;
      }
    }

    .alert {
      margin-bottom: 10px;
    }
  }

  .btn {
    width: 100%;
    margin-top: 12px;
    text-align: center;
  }
</style>
