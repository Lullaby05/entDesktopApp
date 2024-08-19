<!-- 应急资源--应急队伍 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
          <a-form-item field="teamName" label="队伍名称">
            <a-input
              v-model.trim="tempSearchForm.teamName"
              placeholder="请输入队伍名称"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="teamType" label="队伍类型">
            <a-select
              v-model:model-value="tempSearchForm.teamType"
              allow-clear
              allow-search
              placeholder="请选择队伍类型"
            >
              <a-option v-for="(value, key) of troopsTypeData" :value="key">{{
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
                getTroopsData();
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
            v-permission="'TroopsAdd'"
            type="primary"
            @click="toEditPage('add')"
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
          :data="troopsData.list"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>

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
          <template #option="{ record }">
            <a-button
              v-permission="'TroopsEdit'"
              type="text"
              size="mini"
              @click="toEditPage('edit', record.id)"
            >
              编辑
            </a-button>
            <a-button
              v-permission="'TroopsDelete'"
              type="text"
              status="danger"
              size="mini"
              @click="deleteRow(record.id, record.teamName)"
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
          :total="(troopsData.total as number)"
          @change="currentChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>
  </div>
</template>

<script lang="ts">
  import { ref, h, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import { Message, Modal } from '@arco-design/web-vue';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { useUserStore } from '@/store';
  import { getEnumListAPI } from '@/api/index';
  import { getStaffDataAllAPI } from '@/api/enterpriseManage';
  import { getTroopsListPageAPI, deleteTroopsItemAPI } from '@/api/emergency';
  import type { GetTroopsListPageData } from '@/api/emergency';
  import type { StaffItem } from '@/views/enterpriseManage/staffManage/index';
  import type { TroopsItem } from '@/views/emergency/emergencyResource/index.d.ts';
  import type { TableColumnData, FileItem } from '@arco-design/web-vue';
  import { handleOnKeyup } from '@/utils/event';
  import { downloadFile } from '@/utils/utils';
  export default {
    name: 'Troops',
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

  const troopsTypeData = ref<any>();

  const getTroopsTypeData = async () => {
    const { data } = await getEnumListAPI('EMERGENCY_TEAM_TYPE');
    troopsTypeData.value = data;
  };

  getTroopsTypeData();

  // ----------------- 查询-------------------------------

  const selectForm = ref<GetTroopsListPageData>({
    pageNo: 1,
    pageSize: 10,
    tenantId: userStore.tenantId as string,
  });
  const tempSearchForm = ref<GetTroopsListPageData>({
    pageNo: 1,
    pageSize: 10,
    tenantId: userStore.tenantId as string,
  });
  const selectFormDom = ref();

  const getTroopsData = async () => {
    for (let key in selectForm.value) {
      if (selectForm.value[key as keyof typeof selectForm.value] === '') {
        selectForm.value[key as keyof typeof selectForm.value] = undefined;
      }
    }
    const { data: res } = await getTroopsListPageAPI(selectForm.value);
    troopsData.value = res;
  };

  getTroopsData();

  onActivated(() => {
    getTroopsData();
  });

  const resetSelectForm = () => {
    selectFormDom.value.resetFields();
    tempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
      tenantId: userStore.tenantId as string,
    };
    getTroopsData();
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getTroopsData();
    });
  });
  // ----------------- table -------------------------

  const troopsData = ref<{ list: TroopsItem[]; total: number }>({
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
      title: '队伍名称',
      dataIndex: 'teamName',
    },
    {
      title: '队伍类型',
      dataIndex: 'teamTypeName',
    },
    {
      title: '负责人姓名',
      dataIndex: 'teamLeaderName',
    },
    {
      title: '负责人手机号码',
      dataIndex: 'teamLeaderTel',
    },
    {
      title: '分管负责人姓名',
      dataIndex: 'divisionLeaderName',
    },
    {
      title: '分管负责人手机号码',
      dataIndex: 'divisionLeaderTel',
    },
    {
      title: '协议附件',
      slotName: 'agreement',
      dataIndex: 'agreement',
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
        await deleteTroopsItemAPI(id);
        Message.success({
          content: '删除成功',
        });
        let totalPage = Math.ceil(
          (troopsData.value.total! - 1) / selectForm.value.pageSize!
        );
        let currentPage =
          selectForm.value.pageNo! > totalPage
            ? totalPage
            : selectForm.value.pageNo;
        selectForm.value.pageNo = currentPage! < 1 ? 1 : currentPage;
        getTroopsData();
      },
    });
  };

  const refresh = async () => {
    getTroopsData();
  };

  // ------------------ 弹窗 ----------------------
  const toEditPage = (type: string, id?: string) => {
    router.push({
      name: 'TroopsEditPage',
      query: {
        type,
        id,
      },
    });
  };

  // ------------------ 分页 ----------------------
  const currentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getTroopsData();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getTroopsData();
  };
</script>

<style lang="less" scoped></style>
