<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">{{
          '编辑排查计划'
        }}</span>
      </div>
      <div class="content">
        <div class="form">
          <div class="title">排查计划基本信息</div>
          <a-form ref="formRef" :model="formData">
            <a-form-item
              field="planName"
              label="排查计划名称"
              :rules="formRules.planName"
            >
              <a-input
                allow-clear
                v-model="formData.planName"
                placeholder="请输入排查计划名称"
              ></a-input>
            </a-form-item>
            <a-form-item
              field="checkTypeCode"
              label="排查类型"
              :rules="formRules.checkTypeCode"
            >
              <a-select
                allow-search
                allow-clear
                v-model="formData.checkTypeCode"
                placeholder="请选择排查类型"
              >
                <a-option
                  v-for="item in checkTypeDict"
                  :key="item.dictKey"
                  :value="item.dictKey"
                  >{{ item.dictValue }}</a-option
                >
              </a-select>
            </a-form-item>
            <a-form-item
              field="organizeLevelCode"
              label="组织层级"
              :rules="formRules.organizeLevelCode"
            >
              <a-select
                allow-clear
                allow-search
                v-model="formData.organizeLevelCode"
                placeholder="请选择组织层级"
              >
                <a-option
                  v-for="item in organizeLevelDict"
                  :key="item.dictKey"
                  :value="item.dictKey"
                  >{{ item.dictValue }}</a-option
                ></a-select
              >
            </a-form-item>
            <a-form-item
              field="checkAddr"
              label="地点"
              :rules="formRules.checkAddr"
            >
              <a-input
                allow-clear
                v-model="formData.checkAddr"
                placeholder="请输入地点"
              ></a-input>
            </a-form-item>
            <a-form-item
              field="checkCycleCode"
              label="排查周期"
              :rules="formRules.checkCycleCode"
            >
              <a-select
                allow-clear
                allow-search
                v-model="formData.checkCycleCode"
                placeholder="请选择排查周期"
              >
                <a-option
                  v-for="item in checkCycleDict"
                  :key="item.dictKey"
                  :value="item.dictKey"
                  >{{ item.dictValue }}</a-option
                >
              </a-select>
            </a-form-item>
            <a-form-item
              field="customCycleCode"
              :class="formData.checkCycleCode !== '8' ? 'opacityRow' : ''"
              label="自定义周期"
              :rules="
                formData.checkCycleCode === '8' ? formRules.customCycleCode : []
              "
            >
              <a-input-number
                allow-clear
                v-model="formData.customNum"
                :min="0"
                :max="10"
                class="customInput"
              ></a-input-number
              >次/
              <a-input-number
                allow-clear
                v-model="formData.customTime"
                :min="0"
                :max="10"
                class="customInput"
              ></a-input-number>
              <a-select
                allow-clear
                v-model="formData.customCycleCode"
                allow-search
                class="customInput"
                placeholder="请选择"
              >
                <a-option
                  v-for="item in customCycleDict"
                  :key="item.dictKey"
                  :value="item.dictKey"
                  >{{ item.dictValue }}</a-option
                >
              </a-select>
            </a-form-item>
            <a-form-item
              field="checkStartTime"
              label="开始时间"
              :rules="formRules.checkStartTime"
            >
              <a-date-picker
                allow-clear
                v-model="formData.checkStartTime"
                show-time
                :time-picker-props="{ defaultValue: '00:00:00' }"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
            <a-form-item
              field="checkEndTime"
              label="结束时间"
              :rules="formRules.checkEndTime"
            >
              <a-date-picker
                allow-clear
                v-model="formData.checkEndTime"
                show-time
                :time-picker-props="{ defaultValue: '23:59:59' }"
                format="YYYY-MM-DD HH:mm:ss"
              />
            </a-form-item>
            <a-form-item
              field="deptId"
              label="排查部门"
              :rules="formRules.deptId"
            >
              <a-tree-select
                v-model="formData.deptId"
                :fallback-option="false"
                placeholder="请先选择排查部门"
                allow-search
                allow-clear
                :disable-filter="true"
                :field-names="{
                  key: 'id',
                  title: 'name',
                }"
                :data="deptData"
                @search="onDeptSearch"
                @blur="clearSearchKey"
                @clear="clearSearchKey"
                @change="
                  (val) => {
                    formData.checkPersonId = '';
                  }
                "
              ></a-tree-select>
            </a-form-item>
            <!-- <a-form-item
            field="checkPersonId"
            label="排查负责人"
            :rules="formRules.checkPersonId"
          >
            <a-select
              v-model="formData.checkPersonId"
              allow-clear
              allow-search
              :options="staffDataMap.get(formData.deptId as string)"
              :fallback-option="false"
              placeholder="请选择排查负责人"
              :field-names="{
                value: 'id',
                label: 'userName',
              }"
              @change="personChange($event)"
            />
          </a-form-item> -->
            <a-form-item field="holidayType" label="节假日设置">
              <template #label>
                <a-tooltip position="top">
                  <icon-info-circle />
                  <template #content>
                    <div style="font-size: 1rem">
                      设置后，将自动跳过节假日期，如在计划期限内遇节假日则不生成检查任务。
                    </div>
                  </template>
                </a-tooltip>
                <span> 节假日设置 </span>
              </template>
              <a-checkbox-group
                v-model="formData.holidayType"
                :options="holiDayTypeList"
              />
            </a-form-item>
            <a-form-item field="mode" label="排查方式" :rules="formRules.mode">
              <template #label>
                <a-tooltip position="top">
                  <icon-info-circle />
                  <template #content>
                    <div style="font-size: 1rem">
                      1.结束时间到期自动提交:无需人员参与排查，结束时间到期后系统自动提交排查任务；
                      <br />
                      2.逐项检查后手动提交：需要人员参与排查，将每项检查结果手动录入后提交排查任务。
                    </div>
                  </template>
                </a-tooltip>
                <span> 排查方式 </span>
              </template>
              <a-radio-group v-model="formData.mode">
                <a-radio :value="1">结束时间到期自动提交</a-radio>
                <a-radio :value="2">逐项检查</a-radio>
              </a-radio-group>
            </a-form-item>
            <a-form-item
              field="status"
              label="启用状态"
              :rules="formRules.status"
            >
              <a-switch
                v-model="formData.status"
                :checked-value="1"
                :unchecked-value="0"
              >
                <template #checked> 启用 </template>
                <template #unchecked> 停用 </template>
              </a-switch>
            </a-form-item>
            <!-- <a-form-item
            class="fullRow"
            field="checkTableIds"
            label="排查内容"
            :rules="formRules.checkTableIds"
            style="width: 100%"
          >
          </a-form-item> -->
          </a-form>
        </div>
        <div class="persons-table">
          <div class="title">
            <span>添加排查人员</span>
            <a-button type="primary" size="small" @click="openPersonDrawer"
              >添加</a-button
            >
          </div>
          <div class="table-list">
            <checkTable
              v-if="formData.checkTableDatas?.length"
              :tableData="formData.checkTableDatas"
              :table-column="personColumns"
            >
            </checkTable>
          </div>
        </div>
        <div class="check-table">
          <div class="title">
            <span>添加排查表</span>
            <a-button type="primary" size="small" @click="drawerVisible = true"
              >添加</a-button
            >
          </div>
          <div
            class="table-list"
            v-for="item in contentTableData"
            :key="item.id"
          >
            <checkTable
              :tableData="item.tableData"
              :title="item.checkName"
              :table-column="checkTableColumn"
            >
              <a-button
                type="primary"
                status="danger"
                size="small"
                style="margin-left: 12px"
                @click="handleDelTable(item.id, updateContentTable)"
                >移除</a-button
              >
            </checkTable>
          </div>
        </div>
      </div>
      <div class="btnGroup">
        <a-space>
          <a-button @click="goBack">取消</a-button>
          <a-button type="primary" @click="handleSave">保存</a-button>
        </a-space>
      </div>
    </a-card>
    <staffDrawer
      ref="personDrawerRef"
      v-model:table-data="formData.checkTableDatas"
      :dept-data="deptData"
      :is-need-user="false"
    />
    <a-drawer
      :width="525"
      :visible="drawerVisible"
      class="detailDrawer"
      @ok="handleOk(updateContentTable)"
      @cancel="handleCancel"
    >
      <template #title> 选择排查表 </template>
      <div class="drawer-container">
        <a-form :model="drawerFormData" class="drawerForm">
          <a-input
            allow-clear
            v-model="drawerFormData.checkName"
            placeholder="排查表名称"
          ></a-input>
          <a-button
            type="primary"
            class="formBtn"
            @click="
              () => {
                drawerFormData = tempDrawerFormData;
                getDrawerTableData();
              }
            "
            >查询</a-button
          >
        </a-form>
        <a-table
          class="drawerTable"
          :row-selection="rowSelection"
          :selectedKeys="selectedKeys"
          :data="drawerTableData.list"
          row-key="id"
          :columns="drawerTableColumns"
          :bordered="false"
          :pagination="{
            total: drawerTableData.total,
            showTotal: true,
            showPageSize: true,
            pageSizeOptions: [10, 20, 50, 100],
          }"
          @select="selectionChange"
          @select-all="selectionAllChange"
          @page-change="pageChange"
          @page-size-change="pageSizeChange"
        ></a-table>
        <!-- <a-pagination
          :current="drawerFormData.pageNo"
          :page-size="drawerFormData.pageSize"
          show-total
          show-page-size
          :page-size-options="[10, 20, 50, 100]"
          :base-size="3"
          :buffer-size="1"
          :total="(drawerTableData.total as number)"
          @change="pageChange"
          @page-size-change="pageSizeChange"
        ></a-pagination> -->
      </div>
    </a-drawer>
  </div>
</template>

<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import checkTable from './components/checkTable.vue';
  import { useDrawer } from './composition/useDrawer';
  import { onBeforeMount } from 'vue';
  import { dictResponseType, getPitfallDicApi } from '@/api';
  import { TableData, Message, TableColumnData } from '@arco-design/web-vue';
  import {
    checkPlanAdd,
    checkPlanDataType,
    checkPlanEdit,
    checkPlanEditDetail,
    getCheckListContent,
    getCheckPlanPerson,
  } from '@/api/pitfall';
  import { useSearch } from '../snapshot/composition/useSearch';
  import { handleOnKeyup } from '@/utils/event';
  import useJudgeBindingUser from '@/hooks/judgeBindingUser';
  import staffDrawer from '@/views/pitfall/pitfallManagePermission/components/staffDrawer.vue';
  const router = useRouter();
  const route = useRoute();

  const { record } = route.query;

  const basicInfo = computed(() => JSON.parse(record as string));

  // 表单dom、验证、数据
  const formRef = ref();
  const formData = ref<checkPlanDataType>({
    planName: '',
    checkTypeCode: '',
    organizeLevelCode: '',
    checkAddr: '',
    checkCycleCode: '',
    customNum: 0,
    customTime: 0,
    customCycleCode: '',
    checkStartTime: '',
    checkEndTime: '',
    checkPerson: '',
    // checkPersonId: undefined,
    checkPersonIds: [],
    checkTableDatas: [],
    checkTableIds: [],
    deptId: '',
    status: 1,
    mode: undefined,
    holidayType: [],
  });
  const holiDayTypeList: any = [
    { label: '跳过周六', value: '10' },
    { label: '跳过周日', value: '11' },
    { label: '跳过法定节假日', value: '2' },
  ];
  const formRules = {
    planName: [
      { required: true, message: '请输入排查计划名称', trigger: 'change' },
      { maxLength: 20, message: '不能超过20字符', trigger: 'change' },
    ],
    checkAddr: [
      { maxLength: 60, message: '不能超过60字符', trigger: 'change' },
    ],
    checkTypeCode: [
      { required: true, message: '请选择排查类型', trigger: 'change' },
    ],
    organizeLevelCode: [
      { required: true, message: '请选择组织层级', trigger: 'change' },
    ],
    checkCycleCode: [
      { required: true, message: '请选择排查周期', trigger: 'change' },
    ],
    customCycleCode: [
      { required: true, message: '请选择自定义周期', trigger: 'change' },
    ],
    checkStartTime: [
      {
        required: true,
        validator: (
          value: Date | undefined,
          callback: (error?: string) => void
        ) => {
          if (!value) {
            callback('请选择开始时间');
          } else {
            if (+new Date(value) < +new Date()) {
              callback('开始时间不能小于当前时间');
            }
            callback();
          }
        },
        trigger: 'change',
      },
    ],
    checkEndTime: [
      {
        validator: (
          value: Date | undefined,
          callback: (error?: string) => void
        ) => {
          if (!value) {
            callback();
          } else {
            if (
              formData.value.checkStartTime &&
              +new Date(value) < +new Date(formData.value.checkStartTime)
            ) {
              callback('结束时间不能小于开始时间');
            }
            if (+new Date(value) < +new Date()) {
              callback('结束时间不能小于当前时间');
            }
            callback();
          }
        },
        trigger: 'change',
      },
    ],
    checkPersonId: [
      { required: true, message: '请选择排查负责人', trigger: 'change' },
    ],
    checkTableIds: [
      { required: true, message: '请选择排查内容', trigger: 'change' },
    ],
    deptId: [{ required: true, message: '请选择排查部门', trigger: 'change' }],
    mode: [{ required: true, message: '请选择排查方式', trigger: 'change' }],
    status: [{ required: true, message: '请选择启用状态', trigger: 'change' }],
  };

  const {
    drawerVisible,
    drawerFormData,
    tempDrawerFormData,
    handleOk,
    handleCancel,
    drawerTableData,
    drawerTableColumns,
    rowSelection,
    selectedKeys,
    selectionChange,
    selectionAllChange,
    pageChange,
    pageSizeChange,
    getDrawerTableData,
    handleDelTable,
  } = useDrawer(formData.value);
  const checkTableColumn: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      align: 'center',
      width: 70,
    },
    {
      title: '排查项目',
      dataIndex: 'checkItem',
      width: 150,
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '问题点',
      dataIndex: 'problemSpot',
      ellipsis: true,
      tooltip: true,
      align: 'center',
    },
    {
      title: '排查标准',
      dataIndex: 'checkStandard',
      ellipsis: true,
      tooltip: true,
      align: 'center',
    },
  ];

  const { deptData, clearSearchKey, onDeptSearch } = useSearch(['deptData']);

  // 初始化数据
  onBeforeMount(async () => {
    Object.assign(formData.value, basicInfo.value, {
      status: basicInfo.value.status ? 1 : 0,
    });
    // 初始化人员
    getCheckPlanPerson(basicInfo.value.id).then((res: any) => {
      const { data: personData } = res;
      formData.value.checkTableDatas = personData;
    });
    // 初始化排查表
    checkPlanEditDetail(basicInfo.value.id).then((res: any) => {
      const { data: checkTableData } = res;
      contentTableData.value = checkTableData.map((ele: any) => ({
        ...ele,
        tableData: ele.checkContentPOList,
      }));
      selectedKeys.value = checkTableData.map((ele: any) => ele.id);
    });
  });

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      drawerFormData.value = tempDrawerFormData.value;
      getDrawerTableData();
    });
  });

  // 表格
  const contentTableData = ref<TableData[]>([]);

  // 数据字典
  const checkTypeDict = ref<dictResponseType[]>();
  const organizeLevelDict = ref<dictResponseType[]>();
  const checkCycleDict = ref<dictResponseType[]>();
  const customCycleDict = ref<dictResponseType[]>();

  onBeforeMount(async () => {
    // 获取数据字典
    checkTypeDict.value = (
      await getPitfallDicApi('check_plan_type')
    ).data.filter((ele: any) => ele.dictKey !== '0');
    organizeLevelDict.value = (await getPitfallDicApi('organize_level')).data;
    checkCycleDict.value = (await getPitfallDicApi('check_cycle')).data;
    customCycleDict.value = (await getPitfallDicApi('custom_cycle')).data;
  });

  // 侧边抽屉点击确认回调
  const updateContentTable = async (
    keys: string[],
    tableData: TableData[],
    type: string = 'push'
  ) => {
    if (type === 'del') {
      (formData.value.checkTableIds as string[]) = keys;
      contentTableData.value = contentTableData.value.filter((item) =>
        keys.includes(item.id)
      );
    } else {
      // 将选中的排查表id保存到checkTableIds中
      (formData.value.checkTableIds as string[]) = keys;
      // 将选中数据的checkContentIds、排查表名称作为数组对象保存起来
      const selectedTableData: TableData[] = []; // 保存已选择的表格数据，用于匹配请求过来的数据
      let selectedContents: string[] = []; // 保存已选择的contentIds，用来请求接口获取全部数据
      tableData.forEach((item) => {
        if (keys.includes(item.id)) {
          // 说明数据被选中
          selectedTableData.push({
            id: item.id,
            checkName: item.checkName,
            checkContentIds: item.checkContentIds,
          });
          selectedContents = Array.from(
            new Set([...selectedContents, ...item.checkContentIds])
          );
        }
      });
      if (selectedTableData.length) {
        const res = await getCheckListContent(selectedContents);

        contentTableData.value = [];

        selectedTableData.forEach((item: any, index: number) => {
          // 根据contentIds匹配到数据后保存起来
          const matchResult = [];
          for (let ele of res.data) {
            if (item.checkContentIds.includes(ele.id)) {
              matchResult.push(ele);
            }
          }
          contentTableData.value.push({
            id: item.id,
            checkName: `排查表${index + 1}:${item.checkName}`,
            tableData: matchResult,
          });
        });
      } else {
        contentTableData.value = [];
      }
    }
  };

  const handleSave = async () => {
    if (formData.value.checkTableDatas?.length === 0) {
      Message.warning('请添加排查人员');
      return;
    }
    if (formData.value.checkTableIds?.length === 0) {
      Message.warning('请添加排查表');
      return;
    }
    const params: any = {
      ...formData.value,
      customNum:
        formData.value.checkCycleCode === '8' ? formData.value.customNum : null,
      customTime:
        formData.value.checkCycleCode === '8'
          ? formData.value.customTime
          : null,
      customCycleCode:
        formData.value.checkCycleCode !== '8'
          ? formData.value.checkCycleCode
          : formData.value.customCycleCode,
      taskType: 2,
      checkPersonIds: formData.value.checkTableDatas?.map((item) => item.id),
    };
    const result = await formRef.value.validate();
    if (!result) {
      await checkPlanEdit(basicInfo.value.id, params);
      Message.success({
        content: '编辑成功',
      });
      goBack();
    }
  };

  const goBack = () => {
    router.back();
  };

  const personDrawerRef = ref<InstanceType<typeof staffDrawer> | null>(null);
  const openPersonDrawer = () => {
    personDrawerRef.value?.open();
  };
  const personColumns: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      align: 'center',
      width: 70,
    },
    {
      title: '员工姓名',
      dataIndex: 'userName',
      width: 150,
      align: 'center',
      ellipsis: true,
      tooltip: true,
    },
    {
      title: '所属部门',
      dataIndex: 'deptName',
      ellipsis: true,
      tooltip: true,
      align: 'center',
    },
    {
      title: '所属岗位',
      dataIndex: 'jobName',
      ellipsis: true,
      tooltip: true,
      align: 'center',
    },
  ];
</script>

<style lang="less" scoped>
  .arco-card.content-card {
    // min-height: 96%;
    .header {
      font-size: 18px;
      // font-weight: 700;
      margin-bottom: 20px;

      .title {
        margin-left: 8px;
      }
    }

    .form {
      margin-bottom: 20px;
      // min-height: calc(100vh - 217px);

      &:deep(.arco-form) {
        flex-wrap: wrap;
        flex-direction: row;
        margin: 0 auto;
        width: 1100px;

        .arco-row-justify-start {
          flex: 0 1 50%;
        }

        .customInput + .customInput {
          margin-left: 20px;
        }

        .fullRow {
          flex: 0 0 100%;

          .arco-col-5 {
            flex-basis: 10.4%;
          }
        }

        .opacityRow {
          opacity: 0;
        }
      }
    }
    .content {
      min-height: calc(100vh - 228px);
    }

    .btnGroup {
      text-align: center;
    }
    .form,
    .persons-table,
    .check-table {
      .title {
        font-size: 16px;
        font-family: 'Alibaba-Medium';
        margin-bottom: 20px;
        margin-left: 52px;
        span {
          display: inline-block;
          width: 100px;
          margin-right: 20px;
        }
      }
    }
  }

  .detailDrawer .drawer-container {
    padding: 0;
    margin: 0;

    .drawerForm {
      flex-direction: row;
      justify-content: space-between;
      padding: 16px;
      margin-bottom: 20px;
      background-color: var(--bg2);

      .arco-input-wrapper {
        width: 200px;
      }
    }

    .drawerTable {
      padding: 16px;
      background-color: var(--bg2);
      margin-top: 20px;
    }
  }
</style>
