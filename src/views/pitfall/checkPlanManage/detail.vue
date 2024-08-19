<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">{{
          '计划执行情况'
        }}</span>
      </div>
      <div class="content">
        <div class="form">
          <div class="title">排查计划基本信息</div>
          <a-form disabled ref="formRef" :model="formData">
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
        <div class="plan-execution-situation">
          <div class="title">计划执行情况</div>
          <div class="content">
            <div
              class="check-table-list"
              v-if="basicInfo.checkTypeCode !== '0'"
            >
              <a-space>
                <span>检查表：</span>
                <a-button
                  type="primary"
                  size="small"
                  v-for="item in checkTableDataRef"
                  :key="item.id"
                  @click="jumpToCheckTable(item)"
                  >{{ item.checkName }}</a-button
                >
              </a-space>
            </div>
            <div class="table">
              <a-table
                :columns="taskDataColumns"
                :data="taskDataRef"
                :pagination="false"
              >
                <template #number="{ rowIndex }">
                  {{ rowIndex + 1 }}
                </template>
                <template #employeeName="{ record }">
                  <a-link @click="jumpToTask(record)">{{
                    record.employeeName
                  }}</a-link>
                </template>
              </a-table>
            </div>
          </div>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { onBeforeMount } from 'vue';
  import { dictResponseType, getPitfallDicApi } from '@/api';
  import {
    checkPlanDataType,
    getCheckTableByPlanId,
    getCheckTaskByPlanId,
  } from '@/api/pitfall';
  import { useSearch } from '../snapshot/composition/useSearch';
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

  const { deptData, clearSearchKey, onDeptSearch } = useSearch(['deptData']);

  // 检查表
  const checkTableDataRef = ref<any[]>([]); // 检查表数据
  // 任务执行情况表格
  const taskDataRef = ref<any[]>([]);
  const taskDataColumns = ref<any[]>([
    {
      title: '序号',
      dataIndex: 'number',
      align: 'center',
      width: 60,
      slotName: 'number',
    },
    {
      title: '员工姓名',
      align: 'center',
      slotName: 'employeeName',
      dataIndex: 'employeeName',
    },
    {
      title: '所属部门',
      align: 'center',
      dataIndex: 'deptName',
    },
    {
      title: '任务数量',
      align: 'center',
      dataIndex: 'missionNum',
    },
    {
      title: '排查完成率（%）',
      align: 'center',
      dataIndex: 'finishingRate',
    },
    {
      title: '未开始',
      align: 'center',
      dataIndex: 'createNum',
      bodyCellStyle: { color: '#666' },
    },
    {
      title: '待完成',
      align: 'center',
      dataIndex: 'runningNum',
      bodyCellStyle: { color: '#357cf0' },
    },
    {
      title: '按时完成',
      align: 'center',
      dataIndex: 'onTimeNum',
      bodyCellStyle: { color: '#f59a23' },
    },
    {
      title: '逾期未完成',
      align: 'center',
      dataIndex: 'overdueNum',
      bodyCellStyle: { color: '#F76560' },
    },
  ]);

  // 初始化数据
  onBeforeMount(async () => {
    Object.assign(formData.value, JSON.parse(record as string), {
      status: JSON.parse(record as string).status ? 1 : 0,
    });
    // 初始化排查表
    if (basicInfo.value.checkTypeCode !== '0') {
      const { data: checkTableData } = await getCheckTableByPlanId(
        basicInfo.value.id
      );
      checkTableDataRef.value = checkTableData;
    }
    // 初始化任务情况
    const { data: taskData } = await getCheckTaskByPlanId(basicInfo.value.id);
    taskDataRef.value = taskData;
  });

  // 数据字典
  const checkTypeDict = ref<dictResponseType[]>();
  const organizeLevelDict = ref<dictResponseType[]>();
  const checkCycleDict = ref<dictResponseType[]>();
  const customCycleDict = ref<dictResponseType[]>();

  onBeforeMount(async () => {
    // 获取数据字典
    checkTypeDict.value = (await getPitfallDicApi('check_plan_type')).data;
    organizeLevelDict.value = (await getPitfallDicApi('organize_level')).data;
    checkCycleDict.value = (await getPitfallDicApi('check_cycle')).data;
    customCycleDict.value = (await getPitfallDicApi('custom_cycle')).data;
  });

  const goBack = () => {
    router.back();
  };

  const jumpToCheckTable = (record: any) => {
    router.push({
      name: 'FormulateChecklistForm',
      query: {
        type: 'content',
        checkContentIds: record.checkContentIds,
        checkName: record.checkName,
      },
    });
  };
  const jumpToTask = (record: any) => {
    router.push({
      name: 'DailyCheckTasks',
      query: { checkPersonId: record.employeeId },
    });
  };
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
    > .content {
      min-height: calc(100vh - 228px);
    }

    .btnGroup {
      text-align: center;
    }
    .form,
    .plan-execution-situation {
      margin-left: 52px;
      .title {
        font-size: 16px;
        font-family: 'Alibaba-Medium';
        margin-bottom: 20px;
        span {
          display: inline-block;
          width: 100px;
          margin-right: 20px;
        }
      }
    }
    .plan-execution-situation {
      .content {
        margin: 0 5%;
        .check-table-list {
          margin-bottom: 20px;
        }
        .table {
          .ant-table {
            margin-top: 20px;
          }
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
