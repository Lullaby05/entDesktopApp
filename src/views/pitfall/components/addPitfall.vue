<template>
  <TableListCard>
    <template #headerInput>
      <a-form :model="selectForm" layout="inline">
        <a-form-item field="" label="关键字">
          <a-input placeholder="编号/问题点/检查依据/达标标准"></a-input>
        </a-form-item>
        <a-form-item field="" label="隐患类型">
          <a-tree-select placeholder="隐患类型" :data="[]"></a-tree-select>
        </a-form-item>
        <a-form-item field="" label="隐患级别">
          <a-tree-select placeholder="请选择" :data="[]"></a-tree-select>
        </a-form-item>
      </a-form>
    </template>
    <template #headerBtn>
      <a-space>
        <a-button type="primary">
          <icon-search class="icon" />
          查询
        </a-button>
        <a-button>
          <icon-refresh class="icon" />
          重置
        </a-button>
      </a-space>
    </template>
    <template #primaryBtn>
      <a-space>
        <a-button type="primary" @click="openModal">
          <icon-plus class="icon" />
          新增
        </a-button>
      </a-space>
    </template>
    <template #minorBtn>
      <a-space>
        <icon-refresh class="minor-icon" size="20" />
      </a-space>
    </template>
    <template #table>
      <a-table
        v-model:selected-keys="selectedIdList"
        :data="pitfallData.rows"
        row-key="id"
        :columns="columns"
        :bordered="false"
        :row-selection="{
          type: 'checkbox',
          width: 60,
          onlyCurrent: false,
          showCheckedAll: true,
        }"
        :pagination="{
          total: pitfallData.total,
          showTotal: true,
          showPageSize: true,
          pageSizeOptions: [10, 20, 50, 100],
        }"
      >
        <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
      </a-table>
    </template>
  </TableListCard>

  <!--  新增 -->
  <AddPitfallPoint
    ref="addPitfallPointDom"
    :modal-title="'新增风险点'"
  ></AddPitfallPoint>
</template>

<script lang="ts">
  import { ref } from 'vue';
  import AddPitfallPoint from '@/views/pitfall/components/addPitfallPoint.vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
</script>

<script lang="ts" setup>
  // -----------------------表单--------------------------
  const selectForm = ref<any>({});
  // -----------------------table-----------------------
  const columns: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
      dataIndex: '',
      align: 'left',
    },
    {
      title: '问题点',
      dataIndex: 'point',
      width: 200,
    },
    {
      title: '隐患类型',
      width: 120,
      dataIndex: 'checkTypeText',
    },
    {
      title: '达标标准',
      dataIndex: 'standard',
    },
    {
      title: '检查依据',
      width: 200,
      dataIndex: 'basis',
    },
    {
      title: '隐患级别',
      width: 140,
      dataIndex: 'level',
    },
    {
      title: '重大风险判定标准',
      width: 160,
      dataIndex: 'dangerBasis',
    },
  ];
  //   获取隐患数据列表
  const pitfallData = {
    total: 386,
    rows: [
      {
        id: 20935,
        code: '',
        enterpriseId: 80,
        inspectionType: '03',
        status: 1,
        checkTypeText: '方法与工艺',
        point:
          '不达标的送检机动车，机动车安全技术检验机构未告知送检人整改，未在符合要求后再进行安全技术检验',
        basis: '《机动车安全技术检验项目和方法》（GB 21861-2014）第5.1.2.1条',
        standard:
          '送检机动车应清洁，无明显漏油、漏水、漏气现象，轮胎完好，轮胎气压正常且胎冠花纹中无异物，发动机应运转平稳，怠速稳定，无异响；装有车载诊断系统（OBD）的车辆，不应有与防抱死制动系统（ABS）、电动助力转向系统（EPS）及其他与行车安全相关的故障信息对达不到以上基本要求的送检机动车，机动车安全技术检验机构应告知送检人整改，符合要求后再进行安全技术检验',
        level: '01',
        dangerBasis: '',
        checkType: null,
        createBy: 172,
        createDate: 1692755529000,
        updateBy: 172,
        updateDate: 1692755529000,
        levelName: null,
        levelText: null,
        inspectionSite: null,
        inspectionCount: null,
      },
      {
        id: 20933,
        code: '',
        enterpriseId: 80,
        inspectionType: '03',
        status: 1,
        checkTypeText: '方法与工艺',
        point:
          '不达标的送检机动车，机动车安全技术检验机构未告知送检人整改，未在符合要求后再进行安全技术检验',
        basis: '《机动车安全技术检验项目和方法》（GB 21861-2014）第5.1.2.1条',
        standard:
          '送检机动车应清洁，无明显漏油、漏水、漏气现象，轮胎完好，轮胎气压正常且胎冠花纹中无异物，发动机应运转平稳，怠速稳定，无异响；装有车载诊断系统（OBD）的车辆，不应有与防抱死制动系统（ABS）、电动助力转向系统（EPS）及其他与行车安全相关的故障信息对达不到以上基本要求的送检机动车，机动车安全技术检验机构应告知送检人整改，符合要求后再进行安全技术检验',
        level: '01',
        dangerBasis: '',
        checkType: null,
        createBy: 172,
        createDate: 1691895672000,
        updateBy: 172,
        updateDate: 1691895672000,
        levelName: null,
        levelText: null,
        inspectionSite: null,
        inspectionCount: null,
      },
      {
        id: 20932,
        code: '',
        enterpriseId: 80,
        inspectionType: '03',
        status: 1,
        checkTypeText: '方法与工艺',
        point:
          '不达标的送检机动车，机动车安全技术检验机构未告知送检人整改，未在符合要求后再进行安全技术检验',
        basis: '《机动车安全技术检验项目和方法》（GB 21861-2014）第5.1.2.1条',
        standard:
          '送检机动车应清洁，无明显漏油、漏水、漏气现象，轮胎完好，轮胎气压正常且胎冠花纹中无异物，发动机应运转平稳，怠速稳定，无异响；装有车载诊断系统（OBD）的车辆，不应有与防抱死制动系统（ABS）、电动助力转向系统（EPS）及其他与行车安全相关的故障信息对达不到以上基本要求的送检机动车，机动车安全技术检验机构应告知送检人整改，符合要求后再进行安全技术检验',
        level: '01',
        dangerBasis: '',
        checkType: null,
        createBy: 25025,
        createDate: 1691824913000,
        updateBy: 25025,
        updateDate: 1691824913000,
        levelName: null,
        levelText: null,
        inspectionSite: null,
        inspectionCount: null,
      },
      {
        id: 20924,
        code: '',
        enterpriseId: 80,
        inspectionType: '01',
        status: 1,
        checkTypeText: '设备与设施',
        point: '含粉尘的排风管道未采用法兰连接的圆形管道敷设',
        basis: '《家具制造业防尘防毒技术规范》（AQ 4211-2010）第7.6条',
        standard: '含粉尘的排风管道应采用法兰连接的圆形管道敷设',
        level: '01',
        dangerBasis: '',
        checkType: null,
        createBy: 18377,
        createDate: 1689298312000,
        updateBy: 18377,
        updateDate: 1689298312000,
        levelName: null,
        levelText: null,
        inspectionSite: null,
        inspectionCount: null,
      },
      {
        id: 20921,
        code: '',
        enterpriseId: 80,
        inspectionType: '01',
        status: 1,
        checkTypeText: '设备与设施',
        point: '含粉尘的排风管道未采用法兰连接的圆形管道敷设',
        basis: '《家具制造业防尘防毒技术规范》（AQ 4211-2010）第7.6条',
        standard: '含粉尘的排风管道应采用法兰连接的圆形管道敷设',
        level: '01',
        dangerBasis: '',
        checkType: null,
        createBy: 172,
        createDate: 1687248318000,
        updateBy: 172,
        updateDate: 1687248318000,
        levelName: null,
        levelText: null,
        inspectionSite: null,
        inspectionCount: null,
      },
      {
        id: 20920,
        code: '',
        enterpriseId: 80,
        inspectionType: '01',
        status: 1,
        checkTypeText: '设备与设施',
        point: '含粉尘的排风管道未采用法兰连接的圆形管道敷设',
        basis: '《家具制造业防尘防毒技术规范》（AQ 4211-2010）第7.6条',
        standard: '含粉尘的排风管道应采用法兰连接的圆形管道敷设',
        level: '01',
        dangerBasis: '',
        checkType: null,
        createBy: 172,
        createDate: 1687242424000,
        updateBy: 172,
        updateDate: 1687242424000,
        levelName: null,
        levelText: null,
        inspectionSite: null,
        inspectionCount: null,
      },
      {
        id: 20919,
        code: '',
        enterpriseId: 80,
        inspectionType: '01',
        status: 1,
        checkTypeText: '设备与设施',
        point: '含粉尘的排风管道未采用法兰连接的圆形管道敷设',
        basis: '《家具制造业防尘防毒技术规范》（AQ 4211-2010）第7.6条',
        standard: '含粉尘的排风管道应采用法兰连接的圆形管道敷设',
        level: '01',
        dangerBasis: '',
        checkType: null,
        createBy: 172,
        createDate: 1686657656000,
        updateBy: 172,
        updateDate: 1686657656000,
        levelName: null,
        levelText: null,
        inspectionSite: null,
        inspectionCount: null,
      },
      {
        id: 20916,
        code: '',
        enterpriseId: 80,
        inspectionType: '01',
        status: 1,
        checkTypeText: '设备与设施',
        point: '粉尘污染危害严重的设施未远离非污染设施',
        basis:
          '《人造板工业生产性粉尘控制技术规程》（LY/T 1659-2006）第4.1.1.1条',
        standard:
          '厂区总平面布置，在满足主体工程需要的前提下，应将粉尘污染危害严重的设施远离非污染设施，产生粉尘的车间与产生毒物的车间分开',
        level: '01',
        dangerBasis: null,
        checkType: null,
        createBy: 30958,
        createDate: 1685680354000,
        updateBy: 30958,
        updateDate: 1685680354000,
        levelName: null,
        levelText: null,
        inspectionSite: null,
        inspectionCount: null,
      },
      {
        id: 20915,
        code: '',
        enterpriseId: 80,
        inspectionType: '01',
        status: 1,
        checkTypeText: '设备与设施',
        point: '含粉尘的排风管道未采用法兰连接的圆形管道敷设',
        basis: '《家具制造业防尘防毒技术规范》（AQ 4211-2010）第7.6条',
        standard: '含粉尘的排风管道应采用法兰连接的圆形管道敷设',
        level: '01',
        dangerBasis: '',
        checkType: null,
        createBy: 30958,
        createDate: 1685680352000,
        updateBy: 30958,
        updateDate: 1685680352000,
        levelName: null,
        levelText: null,
        inspectionSite: null,
        inspectionCount: null,
      },
      {
        id: 20910,
        code: '',
        enterpriseId: 87,
        inspectionType: '05',
        status: 1,
        checkTypeText: '人力与管理',
        point: '检查除尘器布袋或更换布袋时，没有专人监护，未系好安全带',
        basis: '《铝电解安全生产规范》（GB29741-2013）第4.2.2.3 条',
        standard:
          '检查除尘器布袋或更换布袋时，应有人监护，应系好安全带，谨防从高空坠落',
        level: '01',
        dangerBasis: '',
        checkType: null,
        createBy: 30661,
        createDate: 1683947395000,
        updateBy: 30661,
        updateDate: 1683947395000,
        levelName: null,
        levelText: null,
        inspectionSite: null,
        inspectionCount: null,
      },
    ],
  };
  const selectedIdList = ref<string[] | number[]>([]);
  // ----------------------- 弹窗 --------------------
  const addPitfallPointDom = ref();
  const openModal = () => {
    addPitfallPointDom.value.showModal = true;
  };
  const addPitfallSubmit = () => {
    const itemList: any[] = [];
    selectedIdList.value.forEach((key) => {
      const obj = pitfallData.rows.find((item: any) => item.id === key);
      if (obj) itemList.push(obj);
    });
    return { itemList, selectedIdList: selectedIdList.value };
  };
  const addPitfallClose = (): any => {
    selectedIdList.value = [];
  };
  // ------------------ 对付组件共享 ------------------
  defineExpose({
    addPitfallSubmit,
    addPitfallClose,
  });
</script>

<style lang="less" scoped></style>
