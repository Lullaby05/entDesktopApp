<!--
*@fileName ExportFileDialog.vue
*@author wml
*@date 2023-06-15
*@description 
!-->
<template>
  <div class="export">
    <a-modal
      :visible="exportFlag"
      modal-class="dialog-class"
      popup-container="export"
      :footer="false"
      :render-to-body="false"
      unmount-on-close
      @cancel="cancel"
    >
      <template #title> 导出信息 </template>
      <div class="padding"> 正在为您生成导出文件，这可能需要一点时间，请稍候... </div>
      <a-divider />
      <div class="foo padding">
        <a-button class="item-btn" @click="exportFun(true)">知道了</a-button>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { defineEmits } from 'vue';
  import { exportExcel } from '@/api/equipment';

  const prpos = defineProps({
    exportFlag: { type: Boolean, default: false },
    searchParams: { type: Object },
  });

  const emit = defineEmits(['commit', 'close']);

  const exportFun = async (exportType: boolean) => {
    await exportExcel({
      equipmentPageReqVO: prpos.searchParams,
      exportType,
    }).then((res: any) => {
      const blob = new Blob([res], { type: 'application/xlsx' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a'); // 创建a标签
      link.href = url;
      link.download = '设备设施列表.xlsx'; // 重命名文件
      link.click();
      URL.revokeObjectURL(url);
    });
    emit('commit', 'commit');
  };

  const cancel = () => {
    emit('close', 'close');
  }
</script>

<style lang="less" scoped>
  .arco-modal {
    font-size: 12px;
  }

  .foo {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }

  .item-btn {
    background: rgb(0, 126, 180);
    color: aliceblue;
  }

  :deep(.arco-modal-body){
    padding: 24px 0px;
  }
  :deep(.padding){
    padding-right: 20px;
    padding-left: 20px;
  }
</style>
