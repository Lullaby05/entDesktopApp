<!--
*@fileName upload.vue
*@author wml
*@date 2023-06-16
*@description 
!-->
<template>
  <div class="upload-dialog-box">
    <a-modal
      :visible="modelFlag"
      title="文 件 模 板 下 载"
      width="50%"
      modal-class="dialog-class"
      :render-to-body="false"
      :footer="false"
      popup-container="upload-dialog-box"
      unmount-on-close
      @cancel="handleCancel"
    >
      <div class="download">
        <a-link v-if="linkList" :href="linkList[0]" class="link">
          <template #icon>
            <icon-to-bottom />
          </template>
          设备设施（一般设备）模板.xlsx
        </a-link>
        <a-link v-if="linkList" :href="linkList[1]" class="link">
          <template #icon>
            <icon-to-bottom />
          </template>
          设备设施（特殊设备）模板.xlsx
        </a-link>
        <a-link v-if="linkList" :href="linkList[2]" class="link">
          <template #icon>
            <icon-to-bottom />
          </template>
          设备设施（特种设备）模板.xlsx
        </a-link>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { defineEmits, ref, watch } from 'vue';
  import { getFiles } from '@/api/equipment';

  interface Props {
    modelFlag: boolean;
  }

  const prop = withDefaults(defineProps<Props>(), {
    modelFlag: false,
  });

  const fileList = [
    '41d03099-dc54-494b-b160-1360e9a42706.xlsx',
    '79537b3e-8963-40bb-b249-ab249650b60a.xlsx',
    '572dd290-b681-469f-a718-ce7768345b35.xlsx',
  ];

  const linkList = ref([]);

  const emit = defineEmits(['close']);

  const getFilesFun = async () => {
    const list = await getFiles({ fileNames: fileList.toString() });
    linkList.value = list.data;
    console.log(list);
  };

  const handleCancel = () => {
    emit('close', 'close');
  };

  watch(
    () => prop.modelFlag,
    () => {
      if (prop.modelFlag) {
        getFilesFun();
      }
    }
  );
</script>

<style lang="less" scoped>
  .download {
    display: flex;
    flex-direction: column;
    align-items: start;
  }
  :deep(.arco-link) {
    margin-top: 10px;
  }
  .link {
    margin-top: 20px;
  }
</style>
