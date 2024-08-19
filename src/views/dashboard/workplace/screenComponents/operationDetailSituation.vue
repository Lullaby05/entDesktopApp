<template>
  <div class="operation-detail-situation-container">
    <div class="title">{{ props.title }}</div>
    <div class="table-content">
      <DetailTableComponent
        :tableColumns="tableColumns"
        :tableData="tableData"
      />
    </div>
    <icon-reply class="icon-reply" @click="handleBackDataRundown" />
  </div>
</template>
<script lang="ts" setup>
  import DetailTableComponent from './detailTableComponent.vue';

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    data: {
      type: Array,
      default: () => [],
    },
    type: {
      type: String,
      default: '',
    },
  });

  const columnList: any = {
    动火: [
      {
        label: '作业位置',
        dataIndex: 'operationaddress',
      },
      {
        label: '动火作业级别',
        dataIndex: 'operationLevelName',
      },
      {
        label: '动火方式',
        dataIndex: 'operationMode',
      },
      {
        label: '作业负责人',
        dataIndex: 'operationMasterName',
      },
      {
        label: '作业单位',
        dataIndex: 'operationDeptId',
      },
    ],
    动土: [
      {
        label: '作业地点',
        dataIndex: 'operationAddress',
      },
      {
        label: '作业负责人',
        dataIndex: 'operationMasterName',
      },
      {
        label: '作业单位',
        dataIndex: 'operationDeptId',
      },
    ],
    盲板抽堵: [
      {
        label: '设备、管道名称',
        dataIndex: 'deviceName',
      },
      {
        label: '作业类别',
        dataIndex: 'operationTypeName',
      },
      {
        label: '作业负责人',
        dataIndex: 'operationMasterName',
      },
      {
        label: '作业单位',
        dataIndex: 'operationDeptId',
      },
    ],
    受限空间: [
      {
        label: '受限空间名称',
        dataIndex: 'spaceName',
      },
      {
        label: '受限空间原有介质',
        dataIndex: 'mediumName',
      },
      {
        label: '作业负责人',
        dataIndex: 'operationMasterName',
      },
      {
        label: '作业单位',
        dataIndex: 'operationDeptId',
      },
    ],
    高处: [
      {
        label: '作业地点',
        dataIndex: 'operationAddress',
      },
      {
        label: '作业高度(m)',
        dataIndex: 'height',
      },
      {
        label: '高处作业级别',
        dataIndex: 'operationLevelName',
      },
      {
        label: '作业负责人',
        dataIndex: 'operationMasterName',
      },
      {
        label: '作业单位',
        dataIndex: 'operationDeptId',
      },
    ],
    吊装: [
      {
        label: '吊装地点',
        dataIndex: 'operationAddress',
      },
      {
        label: '吊装作业级别',
        dataIndex: 'operationLevelName',
      },
      {
        label: '作业负责人',
        dataIndex: 'operationMasterName',
      },
      {
        label: '作业单位',
        dataIndex: 'operationDeptId',
      },
    ],
    断路: [
      {
        label: '断路地段相关说明',
        dataIndex: 'relevantExplain',
      },
      {
        label: '涉及相关部门(单位)',
        dataIndex: 'relevantDept',
      },
      {
        label: '作业负责人',
        dataIndex: 'operationMasterName',
      },
      {
        label: '作业单位',
        dataIndex: 'operationDeptId',
      },
    ],
    临时用电: [
      {
        label: '作业地点',
        dataIndex: 'operationAddress',
      },
      {
        label: '工作电压',
        dataIndex: 'operatingVoltage',
      },
      {
        label: '作业负责人',
        dataIndex: 'operationMasterName',
      },
      {
        label: '作业人',
        dataIndex: 'operatingUser',
      },
    ],
  };

  const curColumn = computed(() => columnList[props.type]);

  const tableColumns = computed(() => {
    let column = curColumn.value;
    if (props.title.includes('异常')) {
      column.push({
        label: '异常关闭原因',
        dataIndex: 'closeDesc',
        cellStyle: () => ({
          color: '#FF0000',
        }),
      });
    }
    return column;
  });

  const tableData = computed(() =>
    props.data.map((val: any) => {
      const obj = val;
      val.extendList &&
        val.extendList.forEach((item: any) => {
          obj[item.key] = item.value;
        });
      return obj;
    })
  );

  const emits = defineEmits(['handleBackDataRundown', 'handleClickEchart']);
  const handleBackDataRundown = () => {
    emits('handleBackDataRundown');
  };
</script>
<style lang="less" scoped>
  .operation-detail-situation-container {
    width: 100%;
    height: 100%;
    position: relative;
    .title {
      position: absolute;
      top: 0.5rem;
      font-size: 1rem;
      color: #ffffff;
    }
    .table-content {
      padding-top: 2rem;
      height: 100%;
    }
    .icon-reply {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      font-size: 1.5rem;
      color: #ffffff;
      cursor: pointer;
    }
  }
</style>
