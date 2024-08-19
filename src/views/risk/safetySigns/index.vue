<!-- 风险管控--安全标志 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
          <a-form-item field="signName" label="标志名称">
            <a-input
              v-model.trim="tempSearchForm.signName"
              placeholder="请输入标志名称"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="signTypeCode" label="标志类型">
            <a-select
              v-model.trim="tempSearchForm.signTypeCode"
              placeholder="请选择标志类型"
              :fallback-option="false"
              allow-clear
              allow-search
            >
              <a-option v-for="(value, key) of signsMenu" :value="key">
                {{ value }}
              </a-option>
            </a-select>
          </a-form-item>
        </a-form>
      </template>
      <template #headerBtn>
        <a-space>
          <a-button
            type="primary"
            @click="
              () => {
                selectForm = tempSearchForm;
                getSafetySignsData();
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
        </a-space>
      </template>
      <template #primaryBtn>
        <a-space>
          <a-button
            v-permission="'SafetySignsAdd'"
            type="primary"
            @click="addOrEditClick('add')"
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
        <a-spin :loading="loading" tip="数据加载中...">
          <a-table
            :data="safetySignsData.list"
            row-key="id"
            :columns="columns"
            :bordered="false"
            :pagination="false"
          >
            <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
            <template #pictureUrl="{ record }">
              <img
                v-if="record.pictureUrl"
                class="table-img"
                :src="record.pictureUrl"
                alt=""
              />
              <span v-else>暂无图片</span>
            </template>
            <template #option="{ record }">
              <a-button
                v-permission="'SafetySignsEdit'"
                type="text"
                size="mini"
                @click="addOrEditClick('edit', record.id)"
                >编辑</a-button
              >
              <a-button
                v-permission="'SafetySignsDelete'"
                type="text"
                status="danger"
                size="mini"
                @click="deleteRow(record.signName, record.id)"
                >删除</a-button
              >
            </template>
          </a-table>
        </a-spin>
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
          :total="(safetySignsData.total as number)"
          @change="currentChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>

    <!--  新增/编辑 -->
    <a-modal
      :visible="showAddModal"
      :title="modalTitle"
      :modal-style="{ width: '600px', maxHeight: '900px', overflow: 'auto' }"
      title-align="start"
      ok-text="保存"
      @cancel="handleClose"
      @ok="submit"
    >
      <a-form ref="form" :model="formData" :rules="rules">
        <a-form-item field="signName" label="安全标志名称" required>
          <a-input
            v-model.trim="formData.signName"
            placeholder="请输入安全标志名称"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="signTypeCode" label="安全标志类型" required>
          <a-select
            v-model.trim="formData.signTypeCode"
            placeholder="请选择安全标志类型"
            allow-clear
            allow-search
            :fallback-option="false"
            @change="signTypeCodeChange"
          >
            <a-option v-for="(value, key) of signsMenu" :value="key">
              {{ value }}
            </a-option>
          </a-select>
        </a-form-item>
        <a-form-item field="pictureName" label="安全标志图片" required>
          <a-space>
            <a-upload
              v-model:file-list="formData.pictureUrl"
              list-type="picture-card"
              action=""
              :custom-request="customRequest"
              accept="image/*"
              :limit="1"
              image-preview
              @before-upload="(e) => beforeUpload(e, 'image/*')"
              @success="uploadPicSuccess"
              @before-remove="beforeRemove"
            />
            <a-tooltip
              content="只能上传格式[.jpg,.png],附件大小不能超过20M"
              position="right"
            >
              <icon-question-circle-fill class="upload-tip" />
            </a-tooltip>
          </a-space>
        </a-form-item>
        <a-form-item field="remark" label="备注">
          <a-textarea
            v-model.trim="formData.remark"
            placeholder="请输入内容"
            :max-length="300"
            show-word-limit
            :auto-size="{ maxRows: 6, minRows: 6 }"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { ref, h, computed, onMounted } from 'vue';
  import { Modal, TableColumnData, Message } from '@arco-design/web-vue';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { useUserStore } from '@/store';

  // import { safetySignsMenu } from './menu';
  import { UploadPath, getMapDictionaryAPI } from '@/api/index';
  import {
    getSafetySignsListAPI,
    addSafetySignsAPI,
    detailSafetySignsAPI,
    updateSafetySignsAPI,
    deleteSafetySignsAPI,
  } from '@/api/risk';
  import type { GetSafetySignsListBody, SafetySignsBody } from '@/api/risk';
  import type { FileItem } from '@arco-design/web-vue/es/upload/interfaces';

  import { useRouter } from 'vue-router';
  import type { SafetySignsData } from './index';
  import { handleOnKeyup } from '@/utils/event';
  import { useCustomUpload } from '@/hooks/customUpload';
  export default {
    name: 'SafetySigns',
  };
</script>

<script lang="ts" setup>
  const userStore = useUserStore();
  // 上传
  const { customRequest, beforeUpload } = useCustomUpload();

  const router = useRouter();
  // -------------------搜索--------------------------
  const signsMenu = ref<any>({});

  const selectForm = ref<GetSafetySignsListBody>({
    pageNo: 1,
    pageSize: 10,
  });
  const tempSearchForm = ref<GetSafetySignsListBody>({
    pageNo: 1,
    pageSize: 10,
  });
  const selectFormDom = ref();

  const getSafetySignsData = async () => {
    const { data } = await getSafetySignsListAPI(selectForm.value);
    safetySignsData.value = data;
  };

  getSafetySignsData();

  const resetSelectForm = async () => {
    selectFormDom.value.resetFields();
    tempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
    };
    getSafetySignsData();
  };

  const getSignsType = async () => {
    const { data } = await getMapDictionaryAPI('safety_sign_type');
    signsMenu.value = data;
  };

  getSignsType();

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getSafetySignsData();
    });
  });

  // -----------------------表格-----------------------
  const loading = ref(false);
  const columns: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
    },
    {
      title: '安全标志名称',
      dataIndex: 'signName',
    },
    {
      title: '安全标志类型',
      dataIndex: 'signType',
    },
    {
      title: '安全标志图片',
      dataIndex: 'pictureUrl',
      slotName: 'pictureUrl',
    },
    {
      title: '操作',
      align: 'center',
      slotName: 'option',
    },
  ];
  const safetySignsData = ref<SafetySignsData>({ list: [], total: 0 });

  const refresh = async () => {
    getSafetySignsData();
  };

  const deleteRow = (name: string, id: string) => {
    Modal.open({
      title: '提示',
      titleAlign: 'start',
      content: () =>
        h(ConfirmModalBody, {
          text: name,
          info: '删除数据不可恢复，请谨慎操作！',
        }),
      onOk: async () => {
        await deleteSafetySignsAPI(id);
        Message.success({
          content: '删除成功',
        });
        let totalPage = Math.ceil(
          (safetySignsData.value.total! - 1) / selectForm.value.pageSize!
        );
        let currentPage =
          selectForm.value.pageNo! > totalPage
            ? totalPage
            : selectForm.value.pageNo;
        selectForm.value.pageNo = currentPage! < 1 ? 1 : currentPage;
        getSafetySignsData();
      },
    });
  };

  // ---------------------- 弹窗 ----------------------

  const modalType = ref('');
  const showAddModal = ref(false);
  const modalTitle = computed(() =>
    modalType.value === 'add' ? '新增安全标志' : '编辑安全标志'
  );
  const formData = ref<SafetySignsBody>({
    tenantId: userStore.tenantId as string,
    signName: '',
    signType: '',
    signTypeCode: '',
  });
  const form = ref();

  const rules = ref({
    signName: [
      { required: true, message: '请输入安全标志名称' },
      { maxLength: 30, message: '不能超过30字符' },
    ],
    signTypeCode: [{ required: true, message: '请选择安全标志类型' }],
    pictureName: [{ required: true, message: '请上传安全标志图片' }],
  });

  // 附件上传
  const uploadPicSuccess = (e: FileItem) => {
    const {
      response: { data, code, msg },
    } = e;

    if (code < 200) {
      formData.value.pictureName = data[0].fileName;
    } else {
      Message.error({
        content: '上传失败，原因为=' + msg,
      });
    }
  };

  const beforeRemove = (file: FileItem): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      Modal.open({
        title: '提示',
        titleAlign: 'start',
        content: () =>
          h(ConfirmModalBody, {
            info: '删除数据不可恢复，请谨慎操作！',
          }),
        onOk: () => {
          formData.value.pictureName = '';
          return resolve(true);
        },
        onCancel: () => reject('cancel'),
      });
    });
  };

  const uploadPreview = (fileItem: FileItem) => {
    window.open(fileItem.url || fileItem.response.data[0].filePath);
  };

  const addOrEditClick = async (type: string, id?: any) => {
    modalType.value = type;
    showAddModal.value = true;
    if (id) {
      const { data } = await detailSafetySignsAPI({ id });
      formData.value = data;
      formData.value.tenantId = userStore.tenantId as string;
      formData.value.pictureUrl = data.pictureUrl ? data.pictureUrl : [];
      formData.value.pictureUrl = data.pictureUrl.map((item: string) => {
        return { url: item };
      });
    }
  };

  const handleClose = () => {
    form.value.resetFields();

    // formData.value.tenantId = userStore.tenantId as string;
    showAddModal.value = false;
    formData.value = {
      tenantId: userStore.tenantId as string,
      signName: '',
      signType: '',
      signTypeCode: '',
    };
    formData.value.pictureUrl = [];
  };

  const signTypeCodeChange = (
    value:
      | string
      | number
      | boolean
      | Record<string, any>
      | (string | number | boolean | Record<string, any>)[]
  ) => {
    formData.value.signType =
      signsMenu.value[value as keyof typeof signsMenu.value];
  };

  const submit = async () => {
    formData.value.pictureUrl = undefined;

    const value = await form.value.validate();
    if (value) return;
    modalType.value === 'add' ? await addSubmit() : await updateSubmit();
    handleClose();
  };

  const addSubmit = async () => {
    await addSafetySignsAPI(formData.value);
    Message.success({
      content: '新增成功',
    });
    resetSelectForm();
  };

  const updateSubmit = async () => {
    await updateSafetySignsAPI(formData.value);
    Message.success({
      content: '编辑成功',
    });
    getSafetySignsData();
  };

  // ------------------------- 分页 -------------------------

  const currentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getSafetySignsData();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getSafetySignsData();
  };
</script>

<style lang="less" scoped>
  .upload-tip {
    color: #f59b22;
  }
  .table-img {
    width: 46px;
    height: 60px;
  }
</style>

<style lang="less">
  .safetySignsDrawer {
    .arco-drawer-body .arco-card-bordered {
      border: none;
      .arco-card-body {
        padding: 0;
      }
    }

    .arco-drawer-footer {
      border-top: none;
    }
  }
</style>
