<!--
*@fileName infoCard.vue
*@author wml
*@date 2023-06-27
*@description 设备身份证卡
!-->
<template>
  <div class="info-card-box"> </div>
  <a-modal
    :visible="infoCardFlag"
    title="设 备 身 份 卡"
    width="65%"
    modal-class="dialog-class"
    :render-to-body="false"
    popup-container="detail-box"
    :footer="false"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-table
      :data="renderList"
      :span-method="spanMethod"
      :bordered="{ wrapper: true, cell: true }"
      :show-header="false"
      :hoverable="false"
      :pagination="false"
    >
      <template #columns>
        <a-table-column
          data-index="nameFirst"
          title="名称"
          :width="100"
          cell-class="name"
        />
        <a-table-column data-index="valueFirst" title="值" :width="260" />
        <a-table-column
          data-index="nameSecond"
          title="名称"
          :width="100"
          :body-cell-class="cellClass"
        >
          <template #cell="{ record }">
            <a-image
              v-if="record.nameSecond === 'code'"
              width="400"
              height="400"
              :src="record.valueSecond"
              alt="暂无图片"
            >
            </a-image>
            <div v-if="record.nameSecond !== 'code'">
              {{ record.nameSecond }}</div
            >
          </template>
        </a-table-column>
        <a-table-column data-index="valueSecond" title="值" :width="260" />
      </template>
    </a-table>
  </a-modal>
</template>

<script lang="ts" setup>
  import { defineEmits, ref, watch } from 'vue';
  import type {
    TableData,
    TableColumnData,
    TableOperationColumn,
  } from '@arco-design/web-vue/es/table/interface';
  import useLoading from '@/hooks/loading';

  const props = defineProps({
    infoCardFlag: {
      type: Boolean,
      default: false,
    },
    formRecord: {
      type: Object,
      default: null,
    },
  });

  const { setLoading } = useLoading();
  const renderList = ref<any>();
  const fetchData = async (record:any) => {
    try {
      setLoading(true)
      console.log("fetchData! props.formRecord=",record)
      const certificate = record.equipmentCertificateRespVO
      const data = [
        {
          nameFirst: '设备名称',
          valueFirst: record.name,
          nameSecond: '所属部门',
          valueSecond: record.deptName,
        },
        {
          nameFirst: '设备类型',
          valueFirst: record.equipmentTypeName,
          nameSecond: '设备责任人',
          valueSecond: record.masterName,
        },
        {
          nameFirst: '规格型号',
          valueFirst: record.specification,
          nameSecond: '特种设备证书',
          valueSecond: certificate ?  record.equipmentCertificateRespVO.registrationCertificate : '',
          // valueSecond: '特种设备证书',
        },
        {
          nameFirst: '制造厂家',
          valueFirst: record.manufacturer,
          nameSecond: '特种设备分类',
          valueSecond: record.equipmentSpecialTypeName,
        },
        {
          nameFirst: '安装位置',
          valueFirst: record.location,
          nameSecond: 'code',
          valueSecond: record.code,
        },
        {
          nameFirst: '投用时间',
          valueFirst: record.operationDate,
        },
        {
          nameFirst: '出厂编号',
          valueFirst: record.factoryNumber,
        },
        {
          nameFirst: '厂内编号',
          valueFirst: record.equipmentNumber,
        },
        {
          nameFirst: '设备重量(kg)',
          valueFirst: record.weight,
        },
        {
          nameFirst: '出厂日期',
          valueFirst: record.dateOfProduction,
        },
        {
          nameFirst: '来源',
          valueFirst: record.source,
        },
        {
          nameFirst: '设备状态',
          valueFirst: record.status,
        },
      ];
      renderList.value = data
    } catch (err) {
      console.log(err);
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };
  console.log('formRecord', props.formRecord);

  const emit = defineEmits(['commit', 'close']);

  const handleOk = () => {
    emit('commit', 'commit');
  };

  const handleCancel = () => {
    emit('close', 'close');
  };

  const spanMethod = (data: {
    record: TableData;
    column: TableColumnData | TableOperationColumn;
    rowIndex: number;
    columnIndex: number;
  }) => {
    const columns = data.column as TableColumnData;
    if (
      data.record.nameSecond === 'code' &&
      columns.dataIndex === 'nameSecond'
    ) {
      return {
        rowspan: 8,
        colspan: 2,
      };
    }
    return {
      rowspan: 1,
      colspan: 1,
    };
  };

  const cellClass = (record: TableData) => {
    if (record.nameSecond === 'code') {
      return 'name-img';
    }
    return 'name';
  };

  watch(
    () => props.infoCardFlag,
    () => {
      if (props.infoCardFlag) {
        console.log("watch! props.formRecord=",props.formRecord)
        fetchData(props.formRecord)
      }
    }
  );
</script>

<style lang="less" scoped>
  .arco-modal {
    font-size: 12px;
  }
  :deep(.name) {
    background-color: var(--color-neutral-2);
  }

  :deep(.name-img) {
    .arco-table-td-content {
      display: flex;
      justify-content: center;
    }
  }
</style>
