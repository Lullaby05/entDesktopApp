<!-- 应急资源--应急专家 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
          <a-form-item field="name" label="专家姓名">
            <a-input
              v-model.trim="tempSearchForm.name"
              placeholder="请输入专家姓名"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="expertise" label="专业领域">
            <a-input
              v-model.trim="tempSearchForm.expertise"
              placeholder="请输入专业领域"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="education" label="学历">
            <a-select
              v-model="tempSearchForm.education"
              placeholder="请选择学历"
              allow-clear
              allow-search
              :fallback-option="false"
            >
              <a-option
                v-for="(value, key) of educationEnum"
                :label="value"
                :value="key"
              ></a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="major" label="专业">
            <a-input
              v-model.trim="tempSearchForm.major"
              placeholder="请输入专业"
              allow-clear
            ></a-input>
          </a-form-item>
        </a-form>
      </template>
      <template #headerBtn>
        <div class="header-btn">
          <a-button
            type="primary"
            @click="
              () => {
                selectForm = tempSearchForm;
                getExportData();
              }
            "
          >
            <icon-search class="icon" />
            查询
          </a-button>
          <a-button @click="resetSelectForm">
            <icon-refresh class="icon" />
            重置
          </a-button>
        </div>
      </template>
      <template #primaryBtn>
        <a-space>
          <a-button
            v-permission="'ExpertAdd'"
            type="primary"
            @click="openModal('add')"
          >
            <icon-plus class="icon" />
            新增
          </a-button>
        </a-space>
      </template>
      <template #minorBtn>
        <a-space>
          <icon-refresh class="minor-icon" size="20" @click="refresh" />
        </a-space>
      </template>

      <template #table>
        <a-table
          :data="exportData.list"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
          @page-change="currentChange"
          @page-size-change="pageSizeChange"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #education="{ record }">
            {{ educationEnum && educationEnum[record.education] }}
          </template>
          <template #option="{ record }">
            <a-button
              v-permission="'ExpertEdit'"
              type="text"
              size="mini"
              @click="openModal('edit', record.id)"
            >
              编辑
            </a-button>
            <a-button
              v-permission="'ExpertDelete'"
              type="text"
              status="danger"
              size="mini"
              @click="deleteRow(record.id, record.name)"
            >
              删除
            </a-button>
          </template>
        </a-table>
      </template>
      <template #pagination>
        <a-pagination
          :current="selectForm.pageNo"
          :page-size="selectForm.pageSize"
          show-total
          show-page-size
          :page-size-options="[10, 20, 50, 100]"
          :base-size="3"
          :buffer-size="1"
          :total="(exportData.total as number)"
          @change="currentChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>

    <!-- 弹窗 -->
    <a-modal
      :visible="visible"
      :width="600"
      ok-text="保存"
      title-align="start"
      :title="modalTitle"
      @ok="submitModal"
      @cancel="closeModal"
    >
      <a-form ref="form" :model="formData" :rules="rules">
        <a-form-item field="name" label="专家姓名" required>
          <a-input
            v-model.trim="formData.name"
            placeholder="请输入专家姓名"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="telphone" label="手机号码" required>
          <a-input
            v-model.trim="formData.telphone"
            placeholder="请输入手机号码"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="expertise" label="专业领域" required>
          <a-input
            v-model.trim="formData.expertise"
            placeholder="请输入专业领域"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="education" label="学历">
          <a-select
            v-model="formData.education"
            placeholder="请选择学历"
            allow-clear
            allow-search
            :fallback-option="false"
          >
            <a-option
              v-for="(value, key) of educationEnum"
              :label="value"
              :value="key"
            ></a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="major" label="专业">
          <a-input
            v-model.trim="formData.major"
            placeholder="请输入专业"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="remark" label="备注">
          <a-textarea
            v-model.trim="formData.remark"
            placeholder="请输入内容"
            :auto-size="{ maxRows: 6, minRows: 6 }"
            show-word-limit
            :max-length="300"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { ref, h, computed, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message, Modal } from '@arco-design/web-vue';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { useUserStore } from '@/store';
  import { phoneRegExp } from '@/utils/index';
  import { getEnumListAPI } from '@/api/index';
  import {
    getExportListPageAPI,
    addExportItemAPI,
    detailExportItemAPI,
    updateExportItemAPI,
    deleteExportItemAPI,
  } from '@/api/emergency';
  import type {
    GetExportListPageData,
    AddExportItemData,
  } from '@/api/emergency';
  import type { ExportItem } from '@/views/emergency/emergencyResource/index.d.ts';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { handleOnKeyup } from '@/utils/event';
  export default {
    name: 'Expert',
  };
</script>

<script lang="ts" setup>
  const router = useRouter();
  const userStore = useUserStore();
  // ----------------- 前置数据 -------------------------
  const educationEnum = ref<any>();

  const getEducationEnum = async () => {
    const { data } = await getEnumListAPI('EDUCATION');
    educationEnum.value = data;
  };
  getEducationEnum();

  // ----------------- 查询-------------------------------

  const selectForm = ref<GetExportListPageData>({
    pageNo: 1,
    pageSize: 10,
    tenantId: userStore.tenantId as string,
  });
  const tempSearchForm = ref<GetExportListPageData>({
    pageNo: 1,
    pageSize: 10,
    tenantId: userStore.tenantId as string,
  });
  const selectFormDom = ref();

  const getExportData = async () => {
    const { data: res } = await getExportListPageAPI(selectForm.value);
    exportData.value = res;
  };

  getExportData();

  onActivated(() => {
    getExportData();
  });

  const resetSelectForm = () => {
    selectFormDom.value.resetFields();
    tempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
      tenantId: userStore.tenantId as string,
    };
    getExportData();
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getExportData();
    });
  });
  // ----------------- table -------------------------

  const exportData = ref<{ list: ExportItem[]; total: number }>({
    list: [],
    total: 0,
  });
  const columns: TableColumnData[] = [
    {
      title: '序号',
      width: 60,
      slotName: 'number',
    },
    {
      title: '专家姓名',
      dataIndex: 'name',
    },

    {
      title: '手机号码',
      dataIndex: 'telphone',
    },
    {
      title: '专业领域',
      dataIndex: 'expertise',
    },
    {
      title: '学历',
      slotName: 'education',
      dataIndex: 'education',
    },
    {
      title: '专业',
      dataIndex: 'major',
    },
    {
      title: '操作',
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];

  const deleteRow = (id: string, name: string) => {
    Modal.open({
      title: '提示',
      content: () =>
        h(ConfirmModalBody, {
          text: name,
          info: '删除数据不可恢复，请谨慎操作！',
        }),
      titleAlign: 'start',
      onOk: async () => {
        await deleteExportItemAPI(id);
        Message.success('删除成功');
        let totalPage = Math.ceil(
          (exportData.value.total! - 1) / selectForm.value.pageSize!
        );
        let currentPage =
          selectForm.value.pageNo! > totalPage
            ? totalPage
            : selectForm.value.pageNo;
        selectForm.value.pageNo = currentPage! < 1 ? 1 : currentPage;
        getExportData();
      },
    });
  };

  const refresh = async () => {
    getExportData();
  };

  // ------------------ 弹窗 ----------------------

  const visible = ref(false);
  const modalType = ref('');
  const modalTitle = computed(() =>
    modalType.value === 'add' ? '新增专家' : '编辑专家'
  );
  const formData = ref<AddExportItemData>({
    tenantId: userStore.tenantId as string,
    name: '',
    telphone: '',
    expertise: '',
  });
  const form = ref();

  const rules = ref({
    name: [
      { required: true, message: '请输入专家姓名' },
      { maxLength: 25, message: '不能超过25字符' },
    ],
    telphone: [
      { required: true, message: '请输入手机号码' },
      { match: phoneRegExp, message: '请输入正确的手机号码' },
    ],
    expertise: [
      { required: true, message: '请输入专业领域' },
      { maxLength: 50, message: '不能超过50字符' },
    ],
    major: [
      { required: true, message: '请输入专业' },
      { maxLength: 20, message: '不能超过20字符' },
    ],
    education: [{ required: true, message: '请选择学历' }],
  });

  const openModal = async (type: string, id?: string) => {
    modalType.value = type;
    visible.value = true;
    if (id) {
      const { data: res } = await detailExportItemAPI({
        tenantId: userStore.tenantId as string,
        id: id as string,
      });
      formData.value = res;
    }
  };

  const submitModal = async () => {
    const value = await form.value.validate();
    if (value) return;
    modalType.value === 'add' ? await addSubmit() : await updateSubmit();
    closeModal();
  };

  const closeModal = () => {
    visible.value = false;
    form.value.resetFields();
    formData.value = {
      tenantId: userStore.tenantId as string,
      name: '',
      telphone: '',
      expertise: '',
    };
  };

  const addSubmit = async () => {
    await addExportItemAPI(formData.value);
    Message.success('新增成功');
    resetSelectForm();
  };

  const updateSubmit = async () => {
    await updateExportItemAPI(formData.value);
    Message.success('编辑成功');
    getExportData();
  };

  // ------------------ 分页 ----------------------
  const currentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getExportData();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getExportData();
  };
</script>

<style lang="less" scoped>
  .header-btn {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    .arco-btn + .arco-btn {
      margin-top: 12px;
    }
  }
</style>
