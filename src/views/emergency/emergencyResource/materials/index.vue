<!-- 应急资源--应急物资 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
          <a-form-item field="emergencySuppliesName" label="物资名称">
            <a-input
              v-model.trim="tempSearchForm.emergencySuppliesName"
              placeholder="请输入物资名称"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="suppliesCode" label="物资类型">
            <a-tree-select
              v-model:model-value="tempSearchForm.suppliesCode"
              :data="metarialSeachData"
              allow-search
              allow-clear
              :disable-filter="true"
              :field-names="{
                title: 'name',
              }"
              placeholder="请选择物资类型"
              @search="onMetarialTypeSearch"
              @blur="clearSearchKey"
              @clear="clearSearchKey"
            ></a-tree-select>
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
                getMaterialsData();
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
            v-permission="'MaterialsAdd'"
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
          :data="metarialData.list"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #option="{ record }">
            <a-button
              v-permission="'MaterialsEdit'"
              type="text"
              size="mini"
              @click="openModal('edit', record.id)"
            >
              编辑
            </a-button>
            <!-- <a-button
              type="text"
              size="mini"
              status="warning"
              @click="toCheckRecordPage(record.id)"
            >
              检查记录
            </a-button> -->
            <a-button
              v-permission="'MaterialsDelete'"
              type="text"
              status="danger"
              size="mini"
              @click="deleteRow(record.id, record.emergencySuppliesName)"
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
          :total="(metarialData.total as number)"
          @change="currentChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>

    <!-- 弹窗 -->
    <a-modal
      :visible="visible"
      :width="800"
      ok-text="保存"
      title-align="start"
      :title="modalTitle"
      @ok="submitModal"
      @cancel="closeModal"
    >
      <a-form ref="form" :model="formData" :rules="rules">
        <a-form-item field="emergencySuppliesName" label="物资名称" required>
          <a-input
            v-model.trim="formData.emergencySuppliesName"
            placeholder="请输入物资名称"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="suppliesCode" label="物资类型" required>
          <a-tree-select
            v-model:model-value="formData.suppliesCode"
            :data="metarialSeachData"
            allow-search
            allow-clear
            :disable-filter="true"
            :field-names="{
              title: 'name',
            }"
            placeholder="请选择物资类型"
            @search="onMetarialTypeSearch"
            @blur="clearSearchKey"
            @clear="clearSearchKey"
          ></a-tree-select>
        </a-form-item>
        <a-form-item field="number" label="物资数量" required>
          <a-input-number
            v-model.trim.number="formData.number"
            placeholder="请输入物资数量"
            allow-clear
            :max-length="9"
          ></a-input-number>
        </a-form-item>

        <a-form-item field="lnglat" label="经纬度">
          <a-input
            v-model.trim="formData.lnglat"
            placeholder="请输入经纬度"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="place" label="存放地点">
          <a-input
            v-model.trim="formData.place"
            placeholder="请输入存放地点"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="mainUser" label="主要负责人">
          <a-select
            v-model:model-value="formData.mainUser"
            allow-clear
            allow-search
            :options="staffData"
            :fallback-option="false"
            placeholder="请选择主要负责人"
            :field-names="{
              value: 'id',
              label: 'userName',
            }"
            @change="leaderChange($event, 'mainUser')"
          >
          </a-select>
        </a-form-item>
        <a-form-item field="mainUserPhone" label="主要负责人手机号码">
          <a-input
            v-model.trim="formData.mainUserPhone"
            disabled
            placeholder="主要负责人手机号码"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="viceUser" label="副负责人">
          <a-select
            v-model:model-value="formData.viceUser"
            allow-clear
            allow-search
            :options="staffData"
            :fallback-option="false"
            placeholder="请选择副负责人"
            :field-names="{
              value: 'id',
              label: 'userName',
            }"
            @change="leaderChange($event, 'viceUser')"
          >
          </a-select>
        </a-form-item>
        <a-form-item field="viceUserPhone" label="副负责人手机号码">
          <a-input
            v-model.trim="formData.viceUserPhone"
            disabled
            placeholder="副负责人手机号码"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="remarks" label="备注">
          <a-textarea
            v-model.trim="formData.remarks"
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
  import { getEnumListAPI, getSystemDicAPI } from '@/api/index';
  import { getStaffDataAllAPI } from '@/api/enterpriseManage';
  import {
    getMaterialListPageAPI,
    addMaterialItemAPI,
    detailMaterialItemAPI,
    updateMaterialItemAPI,
    deleteMaterialItemAPI,
  } from '@/api/emergency';
  import type {
    GetMaterialListPageData,
    AddMaterialItemData,
  } from '@/api/emergency';
  import type { MetarialItem } from '@/views/emergency/emergencyResource/index.d.ts';
  import type { StaffItem } from '@/views/enterpriseManage/staffManage/index';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { cloneDeep } from 'lodash';
  import { handleOnKeyup } from '@/utils/event';
  export default {
    name: 'Materials',
  };
</script>

<script lang="ts" setup>
  const router = useRouter();
  const userStore = useUserStore();
  // ----------------- 前置数据 -------------------------
  const educationEnum = ref();

  const getEducationEnum = async () => {
    const { data } = await getEnumListAPI('EDUCATION');
    educationEnum.value = data;
  };
  getEducationEnum();

  const staffData = ref<StaffItem[]>([]);

  const getStaffData = async () => {
    const { data: res } = await getStaffDataAllAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });

    staffData.value = res;
  };

  getStaffData();

  const metarialTypeData = ref<any>([]);

  const getMetarialTypeData = async () => {
    const { data } = await getSystemDicAPI('EMERGENCY_SUPPLIES');
    metarialTypeData.value = data;
    metarialSeachData.value = cloneDeep(data);
  };

  getMetarialTypeData();

  // 物资类型下拉搜索
  const metarialSeachData = ref<any>([]);

  function searchData(keyword: string) {
    const loop = (data: any) => {
      const result: any[] = [];
      data.forEach((item: any) => {
        if (item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
          result.push({ ...item });
        } else if (item.children) {
          const filterData = loop(item.children);
          if (filterData.length) {
            result.push({
              ...item,
              children: filterData,
            });
          }
        }
      });
      // console.log(result);

      return result;
    };

    return loop(metarialTypeData.value);
  }

  const onMetarialTypeSearch = (searchKey: string) => {
    setTimeout(() => {
      metarialSeachData.value = searchData(searchKey);
      console.log('@', metarialSeachData.value);
    }, 200);
  };

  const clearSearchKey = () => {
    onMetarialTypeSearch('');
  };
  // ----------------- 查询-------------------------------

  const selectForm = ref<GetMaterialListPageData>({
    pageNo: 1,
    pageSize: 10,
    tenantId: userStore.tenantId as string,
  });
  const tempSearchForm = ref<GetMaterialListPageData>({
    pageNo: 1,
    pageSize: 10,
    tenantId: userStore.tenantId as string,
  });
  const selectFormDom = ref();

  const getMaterialsData = async () => {
    const { data: res } = await getMaterialListPageAPI(selectForm.value);
    metarialData.value = res;
  };

  getMaterialsData();

  onActivated(() => {
    getMaterialsData();
  });

  const resetSelectForm = () => {
    selectFormDom.value.resetFields();
    tempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
      tenantId: userStore.tenantId as string,
    };
    getMaterialsData();
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getMaterialsData();
    });
  });
  // ----------------- table -------------------------

  const metarialData = ref<{ list: MetarialItem[]; total: number }>({
    list: [],
    total: 0,
  });
  const columns: TableColumnData[] = [
    {
      title: '序号',
      width: 60,
      slotName: 'number',
      cellStyle: { width: '1%' },
    },
    {
      title: '物资名称',
      // width: 120,
      dataIndex: 'emergencySuppliesName',
      cellStyle: { width: '15%' },
    },
    {
      title: '物资类型',
      // width: 100,
      dataIndex: 'suppliesCodeName',
      cellStyle: { width: '20%' },
    },
    {
      title: '数量',
      dataIndex: 'number',
      // width: 80,
      cellStyle: { width: '7%' },
    },
    {
      title: '经纬度',
      // width: 120,
      dataIndex: 'lnglat',
      cellStyle: { width: '9%' },
    },
    {
      title: '存放地点',
      // width: 160,
      dataIndex: 'place',
      cellStyle: { width: '12%' },
    },
    {
      title: '主要负责人',
      // width: 105,
      dataIndex: 'mainUserName',
      cellStyle: { width: '8%' },
    },
    {
      title: '主要负责人手机号码',
      // width: 120,
      dataIndex: 'mainUserPhone',
      cellStyle: { width: '10%' },
    },
    // {
    //   title: '副负责人',
    //   width: 100,
    //   dataIndex: 'viceUserName',
    //   cellStyle: { width: '8%' },
    // },
    // {
    //   title: '副负责人手机号码',
    //   width: 120,
    //   dataIndex: 'viceUserPhone',
    //   cellStyle: { width: '9%' },
    // },
    // {
    //   title: '备注',
    //   width: 200,
    //   dataIndex: 'remarks',
    // },

    {
      title: '操作',
      align: 'center',
      slotName: 'option',
      cellStyle: { width: '14%' },
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
        await deleteMaterialItemAPI(id);
        Message.success('删除成功');
        let totalPage = Math.ceil(
          (metarialData.value.total! - 1) / selectForm.value.pageSize!
        );
        let currentPage =
          selectForm.value.pageNo! > totalPage
            ? totalPage
            : selectForm.value.pageNo;
        selectForm.value.pageNo = currentPage! < 1 ? 1 : currentPage;
        getMaterialsData();
      },
    });
  };

  const refresh = async () => {
    getMaterialsData();
  };

  const toCheckRecordPage = (id: string) => {
    router.push({
      name: 'CheckRecordPage',
      query: {
        id,
      },
    });
  };
  // ------------------ 弹窗 ----------------------
  const visible = ref(false);
  const modalType = ref('');
  const modalTitle = computed(() =>
    modalType.value === 'add' ? '新增物资' : '编辑物资'
  );
  const formData = ref<AddMaterialItemData>({
    tenantId: userStore.tenantId as string,
    emergencySuppliesName: '',
    suppliesCodeName: '',
    suppliesCode: '',
    number: 0,
  });
  const form = ref();

  const rules = ref({
    emergencySuppliesName: [
      { required: true, message: '请输入物资名称' },
      { maxLength: 25, message: '不能超过25字符' },
    ],
    suppliesCode: [{ required: true, message: '请选择物资类型' }],
    lnglat: [{ maxLength: 30, message: '不能超过30字符' }],
    place: [
      { required: true, message: '请输入存放地点' },
      { maxLength: 60, message: '不能超过60字符' },
    ],
    number: [
      { required: true, message: '请输入物资数量' },
      // 正则，只能输入数字
      { match: /\d/, message: '请输入数字' },
      { type: 'number', min: 0, message: '不能小于0', trigger: 'blur' },
    ],
  });

  const leaderChange = (
    e:
      | string
      | number
      | Record<string, any>
      | (string | number | Record<string, any>)[],
    text: string
  ) => {
    const obj = staffData.value.find((item) => item.id === e);
    text === 'mainUser'
      ? (formData.value.mainUserPhone = obj?.tel)
      : (formData.value.viceUserPhone = obj?.tel);
  };

  const openModal = async (type: string, id?: string) => {
    modalType.value = type;
    visible.value = true;
    if (id) {
      const { data: res } = await detailMaterialItemAPI({
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
      emergencySuppliesName: '',
      suppliesCodeName: '',
      suppliesCode: '',
      number: '',
    };
  };

  const addSubmit = async () => {
    await addMaterialItemAPI(formData.value);
    Message.success('新增成功');
    resetSelectForm();
  };

  const updateSubmit = async () => {
    await updateMaterialItemAPI(formData.value);
    Message.success('编辑成功');
    getMaterialsData();
  };

  // ------------------ 分页 ----------------------
  const currentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getMaterialsData();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getMaterialsData();
  };
</script>

<style lang="less" scoped></style>
