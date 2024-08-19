<!-- 应急管理--应急预案 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
          <a-form-item field="emergencyType" label="预案类型">
            <a-select
              v-model:model-value="tempSearchForm.emergencyType"
              placeholder="请选择预案类型"
              allow-clear
              allow-search
            >
              <a-option v-for="(value, key) of planBType" :value="key">{{
                value
              }}</a-option>
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
                getEmergencyPlanB();
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
            v-permission="'EmergencyPlanAdd'"
            type="primary"
            @click="toAddPage('add')"
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
          :data="planBData.list"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #emergencyType="{ record }">
            {{ planBType ? planBType[record.emergencyType] : '' }}
          </template>
          <template #agreement="{ record }">
            <a-popover v-if="record.agreement" title="附件列表">
              <a-button size="mini" status="success"> 查看 </a-button>
              <template #content>
                <div v-for="item in record.agreementList">
                  <a-button
                    type="text"
                    target="blank"
                    @click="downloadFile(item.fileUrl)"
                  >
                    {{ item.fileName.split('//')[0] }}
                  </a-button>
                </div>
              </template>
            </a-popover>

            <span v-else>暂无附件</span>
          </template>

          <template #recorded="{ record }">
            {{ record.recorded ? '是' : '否' }}
          </template>
          <template #option="{ record }">
            <a-button
              v-permission="'EmergencyPlanEdit'"
              type="text"
              size="mini"
              @click="toAddPage('edit', record.id)"
            >
              编辑
            </a-button>
            <a-button
              v-permission="'EmergencyPlanDelete'"
              type="text"
              status="danger"
              size="mini"
              @click="deleteRow(record.id, record.emergencyPlanName)"
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
          :total="(planBData.total as number)"
          @change="currentChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>
  </div>
</template>

<script lang="ts">
  import { Message, Modal } from '@arco-design/web-vue';
  import { ref, h, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/store';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { getEnumListAPI } from '@/api/index';
  import { getPlanBListPageAPI, deletePlanBItemAPI } from '@/api/emergency';
  import type { GetPlanBListPageData } from '@/api/emergency';
  import type { PlanBItem } from '@/views/emergency/emergencyPlan/index';
  import type { TableColumnData } from '@arco-design/web-vue';
  import { handleOnKeyup } from '@/utils/event';
  import { downloadFile } from '@/utils/utils';
  export default {
    name: 'EmergencyPlan',
  };
</script>

<script lang="ts" setup>
  const router = useRouter();
  const userStore = useUserStore();

  // -------------------- 前置数据 --------------------
  const planBType = ref<any>();

  const getPlanBType = async () => {
    const { data } = await getEnumListAPI('EMANAGEMENT_TYPE');
    planBType.value = data;
  };

  getPlanBType();

  // --------------------搜索---------------------
  const selectForm = ref<GetPlanBListPageData>({
    tenantId: userStore.tenantId as string,
    pageNo: 1,
    pageSize: 10,
  });
  const tempSearchForm = ref<GetPlanBListPageData>({
    tenantId: userStore.tenantId as string,
    pageNo: 1,
    pageSize: 10,
  });
  const selectFormDom = ref();

  const getEmergencyPlanB = async () => {
    const { data } = await getPlanBListPageAPI(selectForm.value);
    data.list &&
      data.list.length &&
      data.list.forEach((item: PlanBItem) => {
        item.eventTypeName = item.eventTypeName
          .replace(/,/g, '，')
          .replace(/，*$/, '');
      });
    planBData.value = data;
  };

  getEmergencyPlanB();

  onActivated(() => {
    getEmergencyPlanB();
  });

  const resetSelectForm = () => {
    selectFormDom.value.resetFields();
    tempSearchForm.value = {
      tenantId: userStore.tenantId as string,
      pageNo: 1,
      pageSize: 10,
    };
    getEmergencyPlanB();
  };

  const refresh = async () => {
    getEmergencyPlanB();
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getEmergencyPlanB();
    });
  });

  // --------------------表格---------------------

  const planBData = ref<{ list: PlanBItem[]; total: number }>({
    list: [],
    total: 0,
  });
  const columns: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
    },
    {
      title: '预案类型',
      slotName: 'emergencyType',
      dataIndex: 'emergencyType',
    },
    {
      title: '预案名称',
      // width: 120,
      dataIndex: 'emergencyPlanName',
      cellStyle: { width: '11%' },
    },
    {
      title: '事故类型',
      // width: 300,
      dataIndex: 'eventTypeName',
      cellStyle: { width: '23%' },
    },
    {
      title: '是否备案',
      slotName: 'recorded',
      dataIndex: 'recorded',
    },
    {
      title: '备案号',
      // width: 180,
      dataIndex: 'recordedNumber',
      cellStyle: { width: '14%' },
    },
    {
      title: '附件',
      dataIndex: 'agreement',
      slotName: 'agreement',
    },
    {
      title: '操作',
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];

  const toAddPage = (type: string, id?: any) => {
    router.push({
      name: 'EmergencyPlanAdd',
      query: {
        type,
        id,
      },
    });
  };
  const deleteRow = (id: any, name: string) => {
    Modal.open({
      title: '提示',
      content: () =>
        h(ConfirmModalBody, {
          text: name,
          info: '删除数据不可恢复，请谨慎操作！',
        }),
      titleAlign: 'start',
      onOk: async () => {
        await deletePlanBItemAPI(id);
        Message.success('删除成功');
        let totalPage = Math.ceil(
          (planBData.value.total! - 1) / selectForm.value.pageSize!
        );
        let currentPage =
          selectForm.value.pageNo! > totalPage
            ? totalPage
            : selectForm.value.pageNo;
        selectForm.value.pageNo = currentPage! < 1 ? 1 : currentPage;
        getEmergencyPlanB();
      },
    });
  };

  // ------------------ 分页 ----------------------
  const currentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getEmergencyPlanB();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getEmergencyPlanB();
  };
</script>

<style lang="less" scoped></style>
