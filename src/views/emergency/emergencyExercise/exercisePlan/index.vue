<!-- 应急管理--应急演练--演练计划 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form
          ref="selectFormDom"
          :model="tempSearchForm"
          layout="inline"
          :label-col-props="{ span: 2 }"
        >
          <a-form-item field="planType" label="预案类型">
            <a-select
              v-model:model-value="tempSearchForm.planType"
              placeholder="请选择预案类型"
              allow-clear
              allow-search
            >
              <a-option v-for="(value, key) of planBType" :value="key">{{
                value
              }}</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="planTitle" label="计划名称">
            <a-input
              v-model.trim="tempSearchForm.planTitle"
              placeholder="请输入计划名称"
              allow-clear
            ></a-input>
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
                getExercisePlan();
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
            v-permission="'ExercisePlanAdd'"
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
          :data="exercisePlanData.list"
          row-key="id"
          :columns="column"
          :bordered="false"
          :pagination="false"
          @page-change="currentChange"
          @page-size-change="pageSizeChange"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #planType="{ record }">
            {{ planBType ? planBType[record.planType] : '' }}
          </template>
          <template #planTime="{ record }">
            {{ dayjs(record.planTime).format('YYYY-MM-DD') }}
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
          <template #option="{ record }">
            <a-space v-if="record.status === '未演练'">
              <a-button
                v-permission="'ExercisePlanEdit'"
                type="text"
                size="mini"
                @click="toAddPage('edit', record.id)"
              >
                编辑
              </a-button>
              <a-button
                v-permission="'ExerciseRecordPage'"
                type="text"
                size="mini"
                @click="toExerciseRecord('add', record.id, record.planTitle)"
              >
                新增演练记录
              </a-button>
              <a-button
                v-permission="'EmergencyExercisePlanDelete'"
                type="text"
                status="danger"
                size="mini"
                @click="deleteRow(record.id, record.planTitle)"
              >
                删除
              </a-button>
            </a-space>
            <a-space v-else>
              <a-button
                type="text"
                size="mini"
                @click="toAddPage('view', record.id)"
              >
                查看
              </a-button>
              <a-button
                v-permission="'ExerciseRecordPageView'"
                type="text"
                size="mini"
                @click="toExerciseRecord('view', record.id, record.planTitle)"
              >
                演练记录
              </a-button>
            </a-space>
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
          :total="(exercisePlanData.total as number)"
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
  import dayjs from 'dayjs';
  import { useRouter } from 'vue-router';
  import { useUserStore } from '@/store';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { getEnumListAPI } from '@/api/index';
  import {
    getExercisePlanListPageAPI,
    deleteExercisePlanItemAPI,
  } from '@/api/emergency';
  import type { GetExercisePlanListPageData } from '@/api/emergency';
  import type { ExercisePlanItem } from '@/views/emergency/emergencyExercise/index';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  import { handleOnKeyup } from '@/utils/event';
  import { downloadFile } from '@/utils/utils';
  export default {
    name: 'EmergencyExercisePlan',
  };
</script>

<script lang="ts" setup>
  const userStore = useUserStore();
  const router = useRouter();

  // -------------------- 前置数据 -------------------
  const planBType = ref<any>();

  const getPlanBType = async () => {
    const { data } = await getEnumListAPI('EMANAGEMENT_TYPE');
    planBType.value = data;
  };

  getPlanBType();
  // --------------------搜索---------------------
  const selectForm = ref<GetExercisePlanListPageData>({
    tenantId: userStore.tenantId as string,
    pageNo: 1,
    pageSize: 10,
  });
  const tempSearchForm = ref<GetExercisePlanListPageData>({
    tenantId: userStore.tenantId as string,
    pageNo: 1,
    pageSize: 10,
  });

  const selectFormDom = ref();

  const getExercisePlan = async () => {
    const { data } = await getExercisePlanListPageAPI(selectForm.value);
    exercisePlanData.value = data;
    exercisePlanData.value.list = data.list.map((item: any) => {
      if (item.status === 0) {
        item.status = '未演练';
      } else if (item.status === 1) {
        item.status = '演练中';
      } else if (item.status === 2) {
        item.status = '已演练';
      }
      return item;
    });
  };

  getExercisePlan();

  onActivated(() => {
    getExercisePlan();
  });

  const resetSelectForm = () => {
    selectFormDom.value.resetFields();
    tempSearchForm.value = {
      tenantId: userStore.tenantId as string,
      pageNo: 1,
      pageSize: 10,
    };
    getExercisePlan();
  };

  const refresh = async () => {
    getExercisePlan();
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getExercisePlan();
    });
  });
  // --------------------表格---------------------
  const exercisePlanData = ref<{ list: ExercisePlanItem[]; total: number }>({
    list: [],
    total: 0,
  });
  const column: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      dataIndex: '',
      width: 60,
    },
    {
      title: '计划名称',
      dataIndex: 'planTitle',
    },
    {
      title: '参演对象',
      dataIndex: 'planObject',
    },
    {
      title: '演练时间',
      slotName: 'planTime',
      dataIndex: 'planTime',
    },
    {
      title: '预案类型',
      slotName: 'planType',
      dataIndex: 'planType',
    },
    {
      title: '演练项目',
      dataIndex: 'planProject',
    },
    {
      title: '演练方式',
      dataIndex: 'planMode',
    },
    {
      title: '组织人员',
      dataIndex: 'planPerson',
    },
    {
      title: '负责人',
      dataIndex: 'principalUserName',
    },
    {
      title: '负责部门',
      dataIndex: 'principalDeptName',
    },
    {
      title: '演练状态',
      slotName: 'status',
      dataIndex: 'status',
      bodyCellStyle(record) {
        return {
          color: record.status === '未演练' ? '#F53f3f' : '#43cf7c',
        };
      },
    },
    {
      title: '附件',
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

  const toAddPage = (type: string, id?: any) => {
    // const data = JSON.stringify(row || {});
    router.push({
      name: 'ExercisePlanAdd',
      query: { type, id },
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
        await deleteExercisePlanItemAPI(id);
        Message.success('删除成功');
        let totalPage = Math.ceil(
          (exercisePlanData.value.total! - 1) / selectForm.value.pageSize!
        );
        let currentPage =
          selectForm.value.pageNo! > totalPage
            ? totalPage
            : selectForm.value.pageNo;
        selectForm.value.pageNo = currentPage! < 1 ? 1 : currentPage;
        getExercisePlan();
      },
    });
  };

  const toExerciseRecord = (type: string, id: string, name: string) => {
    router.push({
      name: 'ExerciseRecordPage',
      query: { id, planTitle: name, type },
    });
  };
  // ------------------ 分页 ----------------------
  const currentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getExercisePlan();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getExercisePlan();
  };
</script>

<style lang="less" scoped></style>
