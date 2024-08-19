<template>
  <div class="container">
    <div class="header">
      <a-space>
        <span>所属机构：{{ route.query.isCompanyName }}</span>
        <a-input v-model:model-value="staffName" placeholder="姓名"></a-input>
        <a-button type="primary">查询</a-button>
        <a-button type="primary" @click="addOrEditClick('add')">新增</a-button>
      </a-space>
    </div>
    <div class="content">
      <a-table
        :data="staffData.rows"
        :pagination="{ total: staffData.total, showTotal: true }"
      >
        <template #columns>
          <a-table-column title="序号">
            <template #cell="{ rowIndex }">
              {{ rowIndex + 1 }}
            </template>
          </a-table-column>
          <a-table-column data-index="userName" title="姓名"></a-table-column>
          <a-table-column data-index="sex" title="性别"></a-table-column>
          <a-table-column data-index="mobile" title="手机号码"></a-table-column>
          <a-table-column data-index="majorName" title="专业"></a-table-column>
          <a-table-column data-index="position" title="职务"></a-table-column>
          <a-table-column
            data-index="certificate"
            title="证书"
          ></a-table-column>
          <a-table-column
            data-index="name"
            title="操作"
            :cell-style="{ display: 'flex', justifyContent: 'center' }"
          >
            <template #cell="{ record }">
              <a-space>
                <a-button
                  type="primary"
                  size="mini"
                  @click="addOrEditClick('edit', record)"
                >
                  编辑
                </a-button>
                <a-button
                  type="primary"
                  status="danger"
                  size="mini"
                  @click="deleteRow(record)"
                >
                  删除
                </a-button>
              </a-space>
            </template>
          </a-table-column>
        </template>
      </a-table>
    </div>
    <!--  新增/编辑 弹窗 -->
    <a-modal
      v-model:visible="showPopup"
      title-align="start"
      :title="popupTitle"
      ok-text="保存"
      :modal-style="{ width: '800px', maxHeight: '600px', overflow: 'auto' }"
      @cancel="handleCancel"
      @ok="submit"
    >
      <div class="form-table">
        <a-form ref="form" :model="formData">
          <a-form-item label="姓名" field="userName" required>
            <a-space>
              <a-input
                v-model:model-value="formData.userName"
                :style="{ width: '520px' }"
              ></a-input>
              <a-button type="outline" @click="chooseUser">选择</a-button>
            </a-space>
          </a-form-item>
          <a-form-item field="sex" label="性别" required>
            <a-radio-group>
              <a-radio :value="1">男</a-radio>
              <a-radio :value="2">女</a-radio>
            </a-radio-group>
          </a-form-item>

          <a-form-item field="mobile" required label="手机号码">
            <a-input v-model:model-value="formData.mobile"></a-input>
          </a-form-item>
          <a-form-item label="专业" field="major">
            <a-tree-select
              v-model:model-value="formData.majorName"
              :data="majorTree"
              :field-names="{
                key: 'id',
                title: 'text',
              }"
              placeholder="专业"
            ></a-tree-select>
          </a-form-item>

          <a-form-item label="职务" field="position">
            <a-tree-select
              v-model:model-value="formData.position"
              :data="positionTree"
              :field-names="{
                key: 'id',
                title: 'text',
              }"
              placeholder="请选择"
            ></a-tree-select>
          </a-form-item>

          <a-form-item label="证书" field="certificate">
            <a-button type="outline">上传附件</a-button>
          </a-form-item>
        </a-form>
      </div>
    </a-modal>
    <!-- 选择用户弹窗 -->
    <ChooseStaff
      :show-choose-staff-modal="showChooseStaffModal"
      @close-choose-staff-modal="closeChooseStaffModal"
      @return-staff="returnStaff"
    ></ChooseStaff>
  </div>
</template>

<script lang="ts">
  import { ref } from 'vue';
  import { useRoute } from 'vue-router';
  import ChooseStaff from '@/components/choose-staff/index.vue';
  import agencyData from './data.json';
  export default {
    name: 'PersonnelManage',
  };
</script>

<script lang="ts" setup>
  const route = useRoute();
  const staffName = ref('');
  const staffData = ref<any>({});
  staffData.value = agencyData.staff;
  // 新增/编辑 弹窗
  const showPopup = ref(false);
  const popupTitle = ref('新增');
  const form = ref();
  const formData = ref<any>({});
  const positionTree = ref<any>([]);
  const majorTree = ref<any>([]);
  const addOrEditClick = (title: string, row?: any) => {
    popupTitle.value = title === 'add' ? '新增' : '编辑';
    showPopup.value = true;
    if (row) {
      // 编辑
      formData.value = row;
    } else {
      // 新增
    }
  };
  const deleteRow = (row: any) => {
    console.log('删除');
  };
  const handleCancel = () => {
    form.value.resetFields();
    showPopup.value = false;
  };
  const submit = () => {
    console.log('等待');
  };
  // 选择用户弹窗处理
  const showChooseStaffModal = ref(false);
  const chooseUser = () => {
    showChooseStaffModal.value = true;
  };
  const closeChooseStaffModal = () => {
    showChooseStaffModal.value = false;
  };
  const returnStaff = (staff: any) => {
    closeChooseStaffModal();
    formData.value.sex = staff.sex;
    formData.value.mobile = staff.phone;
    formData.value.userName = staff.userName;
  };
</script>

<style lang="less" scoped>
  .container {
    width: 100%;
    height: 100%;
    padding: 16px;
    background-color: #fff;
    .header {
      margin-bottom: 16px;
    }
  }
</style>
