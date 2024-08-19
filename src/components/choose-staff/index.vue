<!-- 选择员工--多页面共用弹窗组件 -->
<template>
  <a-modal
    :visible="props.showChooseStaffModal"
    title="选择员工"
    :footer="false"
    title-align="start"
    :modal-style="{ width: '1400px', maxHeight: '800px', overflow: 'auto' }"
    @cancel="handleCancel"
  >
    <div class="header">
      <a-space>
        <a-input
          placeholder="员工"
          :style="{
            backgroundColor: '#fff',
            width: '160px',
            borderRadius: '4px',
            border: '1px solid #dcdfe6',
          }"
        />
        <a-input
          placeholder="姓名"
          :style="{
            backgroundColor: '#fff',
            width: '160px',
            borderRadius: '4px',
            border: '1px solid #dcdfe6',
          }"
        />
        <a-button type="primary">查询</a-button>
      </a-space>
    </div>
    <div class="body">
      <a-table :data="userData.rows" :pagination="{ total: userData.total }">
        <template #columns>
          <a-table-column title="序号" :width="60">
            <template #cell="{ rowIndex }">{{ rowIndex + 1 }}</template>
          </a-table-column>
          <a-table-column data-index="userName" title="姓名"></a-table-column>
          <a-table-column data-index="deptId" title="工号"></a-table-column>
          <a-table-column data-index="postName" title="职务"></a-table-column>
          <a-table-column data-index="deptName" title="岗位"></a-table-column>
          <a-table-column
            data-index="sex"
            title="性别"
            :width="100"
          ></a-table-column>
          <a-table-column title="操作" :width="100">
            <template #cell="{ record }">
              <a-button type="primary" @click="chooseStaffConfirm(record)"
                >选择</a-button
              >
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
  </a-modal>
</template>

<script lang="ts">
  import { ref } from 'vue';
  import staff from './userData.json';
</script>

<script lang="ts" setup>
  const props = defineProps({
    showChooseStaffModal: {
      type: Boolean,
      default: false,
      required: true,
    },
  });
  const userData = ref<any>([]);
  userData.value = staff.page;
  //   选择员工
  const emit = defineEmits(['returnStaff', 'closeChooseStaffModal']);
  const chooseStaffConfirm = (row: any) => {
    console.log('ceshi');
    emit('returnStaff');
  };

  const handleCancel = () => {
    emit('closeChooseStaffModal');
  };
</script>

<style lang="less" scoped>
  .header {
    margin-bottom: 24px;
  }
</style>
