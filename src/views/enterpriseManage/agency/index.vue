<!-- 企业管理--机构管理 -->
<template>
  <div class="container">
    <a-card>
      <div class="header">
        <div class="tree-group">
          <a-input-group>
            <a-tree-select
              v-model:model-value="selectedItem"
              :data="companyTree"
              :field-names="{
                key: 'id',
                title: 'text',
              }"
              placeholder="所属企业"
              @change="selectedChange"
            ></a-tree-select>
            <a-button type="primary">全部</a-button>
            <a-button type="outline">本级</a-button>
          </a-input-group>
        </div>
        <a-space>
          <a-input
            v-model:model-value="agencyName"
            placeholder="机构名称"
          ></a-input>
          <a-button type="primary">查询</a-button>
          <a-button type="primary" @click="resetData">重置</a-button>
          <a-button type="primary" @click="addOrEditClick('add')"
            >新增</a-button
          >
        </a-space>
      </div>
      <div class="content">
        <a-table
          :data="agencyData.records"
          :pagination="{ total: agencyData.total, showTotal: true }"
        >
          <template #columns>
            <a-table-column title="序号">
              <template #cell="{ rowIndex }">
                {{ rowIndex + 1 }}
              </template>
            </a-table-column>
            <a-table-column
              data-index="enterpriseName"
              title="机构名称"
            ></a-table-column>
            <a-table-column
              data-index="organizationName"
              title="所属企业"
            ></a-table-column>
            <a-table-column
              data-index="leaderName"
              title="主要负责人"
            ></a-table-column>
            <a-table-column
              data-index="leaderPhone"
              title="主要负责人电话"
            ></a-table-column>
            <a-table-column
              data-index="secondaryLeaderName"
              title="次要负责人"
            ></a-table-column>
            <a-table-column
              data-index="secondaryLeaderPhone"
              title="次要负责人电话"
            ></a-table-column>
            <a-table-column data-index="name" title="操作">
              <template #cell="{ record }">
                <a-space>
                  <a-button
                    type="primary"
                    status="success"
                    size="mini"
                    @click="toPersonnelManage(record)"
                    >人员管理</a-button
                  >
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
    </a-card>
    <!-- 弹窗 -->
    <a-modal
      v-model:visible="showPopup"
      title-align="start"
      :title="popupTitle"
      ok-text="保存"
      :modal-style="{ width: '1400px', maxHeight: '600px', overflow: 'auto' }"
      @cancel="handleCancel"
      @ok="submit"
    >
      <div class="form-table">
        <a-form ref="form" :model="formData">
          <a-row>
            <a-col :span="12">
              <a-form-item field="name" required label="机构名称">
                <a-input
                  v-model:model-value="formData.organizationName"
                ></a-input>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="organizationDuty" label="机构职责">
                <a-textarea
                  v-model:model-value="formData.organizationDuty"
                ></a-textarea>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item
                label="主要负责人"
                field="['leaderName','leaderPhone']"
              >
                <a-space>
                  <a-input
                    v-model:model-value="formData.leaderName"
                    :style="{ width: '226px' }"
                  ></a-input>
                  <a-input
                    v-model:model-value="formData.leaderPhone"
                    :style="{ width: '226px' }"
                  ></a-input>
                  <a-button type="outline">选择</a-button>
                </a-space>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item
                label="次要负责人"
                field="['secondaryLeaderName','secondaryLeaderPhone']"
              >
                <a-space>
                  <a-input
                    v-model:model-value="formData.secondaryLeaderName"
                    :style="{ width: '226px' }"
                  ></a-input>
                  <a-input
                    v-model:model-value="formData.secondaryLeaderPhone"
                    :style="{ width: '226px' }"
                  ></a-input>
                  <a-button type="outline">选择</a-button>
                </a-space>
              </a-form-item>
            </a-col>
          </a-row>
          <a-row>
            <a-col :span="12">
              <a-form-item label="机构成立日期">
                <a-date-picker
                  v-model:picker-value="formData.establishDate"
                  placeholder="机构成立日期"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="附件">
                <a-button type="outline" @click="uploadFile">上传附件</a-button>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </a-modal>
    <!-- 上传组件 -->
    <UploadModal
      :show-upload-modal="showUploadModal"
      :message="'附件大小不能超过20M'"
      :title="'文件上传窗口'"
      @close-upload-modal="closeUploadModal"
    ></UploadModal>
  </div>
</template>

<script lang="ts">
  import { ref, Ref } from 'vue';
  import { useRouter } from 'vue-router';
  import UploadModal from '@/components/upload-modal/index.vue';
  import agency from './data.json';
  export default {
    name: 'Agency',
  };
</script>

<script lang="ts" setup>
  // 筛选区域
  const companyTree = ref<any>([]);
  companyTree.value = [];
  const agencyData = ref<any>({});
  agencyData.value = agency.page;
  const selectedItem = ref();
  const agencyName = ref('');
  const selectedChange = (value: any) => {
    console.log(value); // 选中项的id
    selectedItem.value = value;
  };
  const resetData = () => {
    selectedItem.value = 0;
    agencyName.value = '';
  };
  // 操作--按钮点击事件
  const form = ref<any>({});
  const formData = ref<any>({});
  const popupTitle: Ref<string | undefined> = ref();
  const router = useRouter();
  const showPopup = ref(false);
  const toPersonnelManage = (row?: any) => {
    router.push({
      name: 'PersonnelManage',
      query: { isCompanyName: row.enterpriseName },
    });
  };
  const addOrEditClick = (title: string, row?: any) => {
    popupTitle.value = title === 'add' ? '新增' : '编辑';
    showPopup.value = true;
    if (row) {
      // 编辑
      formData.value = row;
    } else {
      // 新增
      formData.value = {};
    }
  };
  const deleteRow = (row: any) => {
    console.log('删除');
  };
  const handleCancel = () => {
    form.value.resetFields({});
    showPopup.value = false;
  };
  const submit = () => {
    console.log('等待');
  };
  // 上传文件 弹窗
  const showUploadModal = ref(false);
  const closeUploadModal = () => {
    showUploadModal.value = false;
  };
  const uploadFile = () => {
    showUploadModal.value = true;
  };
</script>

<style lang="less" scoped>
  .container {
    .arco-card {
      min-height: 94%;
      .header {
        display: flex;
        margin-bottom: 20px;
        .tree-group {
          :deep(.arco-select-view) {
            width: 300px;
          }
          margin-right: 16px;
        }
      }
    }
  }
  .arco-picker {
    width: 100% !important;
  }
</style>
