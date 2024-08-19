<template>
  <a-table
    :data="props.riskListData.rows"
    row-key="id"
    :columns="columns"
    :bordered="false"
    :pagination="{
      total: props.riskListData.total,
      showTotal: true,
      showPageSize: true,
      pageSizeOptions: [10, 20, 50, 100],
    }"
  >
    <template #option="{ record }">
      <a-button type="text" size="mini" @click="showDetail(record)"
        >查看详情</a-button
      >
    </template>
  </a-table>
</template>

<script lang="ts">
  export default {};
</script>

<script lang="ts" setup>
  const props = defineProps({
    riskListData: { type: Object, required: true },
  });
  // -----------表格-------------
  const columns: any[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
      dataIndex: '',
      align: 'left',
    },
    {
      title: '风险单元',
      dataIndex: 'name',
    },
    {
      title: '风险点',
      dataIndex: 'pointName',
    },
    {
      title: '风险点位置',
      dataIndex: 'picture',
    },
    {
      title: '危险因素描述',
      dataIndex: 'pointDesc',
    },
    {
      title: '风险等级',
      dataIndex: 'riskLevel',
    },
    {
      title: '事故类型',
      dataIndex: 'eventText',
    },
    {
      title: '管控层级',
      dataIndex: 'picture',
    },
    {
      title: '管控措施',
      dataIndex: 'riskControlManagers',
    },
    {
      title: '应急处置措施',
      dataIndex: 'emergencyMeasures',
    },
    {
      title: '管控周期',
      dataIndex: 'picture',
    },
    {
      title: '操作',
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];
  const emit = defineEmits(['showDetail']);
  const showDetail = (row: any) => {
    emit('showDetail', row);
  };
  // ---------对父组件共享--------
  defineExpose({});
</script>

<style></style>
