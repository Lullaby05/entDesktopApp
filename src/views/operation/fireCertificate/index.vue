<!-- 动火安全作业证管理-列表 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form :model="tempSearchForm" layout="inline">
          <a-form-item field="certNum" label="作业证编号">
            <a-input
              v-model="tempSearchForm.certNum"
              placeholder="请输入作业证编号"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="operationLevel" label="动火作业级别">
            <a-select
              v-model="tempSearchForm.operationLevel"
              allow-search
              allow-clear
              placeholder="请选择动火作业级别"
            >
              <a-option
                v-for="item in fireLevelDict"
                :key="item.dictValue"
                :value="item.dictValue"
                :label="item.dictKey"
              ></a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="applyDeptId" label="申请单位">
            <a-tree-select
              v-model="tempSearchForm.applyDeptId"
              :fallback-option="false"
              placeholder="请选择申请单位"
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
            ></a-tree-select>
          </a-form-item>
          <a-form-item field="operationMasterId" label="作业负责人">
            <a-select
              v-model="tempSearchForm.operationMasterId"
              allow-clear
              allow-search
              placeholder="请选择作业负责人"
            >
              <a-option
                v-for="item in staffData"
                :key="item.id"
                :value="item.id"
                :label="item.userName"
              ></a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="operationDeptId" label="作业单位">
            <a-select
              v-model="tempSearchForm.operationDeptId"
              allow-clear
              allow-search
              placeholder="请选择作业单位"
            >
              <a-option
                v-for="item in operationCompanyDict"
                :key="item"
                :value="item"
                :label="item"
              ></a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="status" label="作业证状态">
            <a-select
              v-model="tempSearchForm.status"
              allow-clear
              allow-search
              placeholder="请选择作业证状态"
            >
              <a-option
                v-for="item in fireStatusDict"
                :key="item.dictValue"
                :value="item.dictValue"
                :label="item.dictKey"
              ></a-option>
            </a-select>
          </a-form-item>
        </a-form>
      </template>
      <template #headerBtn>
        <div class="header-btn">
          <a-button
            type="primary"
            @click="
              () => {
                searchForm = tempSearchForm;
                getTableList();
              }
            "
          >
            <icon-search class="icon" />
            查询
          </a-button>
          <a-button @click="handleReset">
            <icon-refresh class="icon" @click="handleReset" />
            重置
          </a-button>
        </div>
      </template>
      <template #primaryBtn>
        <a-button
          v-permission="'FireCertificateAdd'"
          type="primary"
          @click="handleAdd"
          ><icon-plus class="icon" />新增</a-button
        >
      </template>
      <template #minorBtn>
        <a-space>
          <icon-question-circle
            style="cursor: pointer"
            size="20"
            @click="handleOperationGuide"
          />
          <icon-refresh class="minor-icon" size="20" @click="getTableList" />
        </a-space>
      </template>
      <template #table>
        <a-table
          :data="tableData.list"
          row-key="id"
          :columns="tableColumns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #certificateStatus="{ record }">
            <div
              class="color-red"
              :class="
                record.status === fireStatusEnum.已关闭
                  ? 'cursor-pointer close-reason-modal'
                  : ''
              "
              :style="{
                '--contentText': `'关闭原因：${record.closeDesc}'`,
              }"
            >
              <span
                >{{ record.statusName
                }}{{
                  record.status !== fireStatusEnum.已撤回 && record.timeStatus
                    ? '（已超时）'
                    : ''
                }}</span
              >
            </div>
          </template>
          <template #option="{ record }">
            <div>
              <a-button type="text" size="mini" @click="handelDetail(record)"
                >详情</a-button
              >
              <a-button
                v-permission="'FireCertificateHandling'"
                type="text"
                size="mini"
                @click="certificateHandling(record)"
                >办理</a-button
              >
            </div>
          </template>
        </a-table>
      </template>
      <template #pagination>
        <a-pagination
          :current="searchForm.pageNo"
          :page-size="searchForm.pageSize"
          show-total
          show-page-size
          :page-size-options="[10, 20, 50, 100]"
          :base-size="3"
          :buffer-size="1"
          :total="(tableData.total as number)"
          @change="pageChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>
    <!-- 指引弹窗 -->
    <GuideProgress
      title="特殊作业审批流程"
      v-model:visible="guideVisible"
      :guideItems="guideItems"
    />
  </div>
</template>
<script lang="ts" setup name="FireCertificateIndex">
  import { onBeforeMount, onMounted, ref } from 'vue';
  import { TableColumnData, TableData } from '@arco-design/web-vue';
  import {
    getCertificateList,
    getOperationTypeEnum,
    getWorkUnitList,
  } from '@/api/operation/operationApi';
  import {
    changeMapToDict,
    fireStatusEnum,
    operationTypeEnum,
  } from '../composition/useCertificateDict';
  import { useSafetyCertificationStore } from '@/store';
  import { useRouter } from 'vue-router';
  import GuideProgress from '@/components/operationGuide/guideProgress.vue';
  import { useOperationGuide } from '../composition/useOperationGuide';
  import { getMapDictionaryAPI } from '@/api';
  import { handleOnKeyup } from '@/utils/event';
  import { useSearch } from '@/views/pitfall/snapshot/composition/useSearch';
  // 获取作业证状态数据字典
  const operationCompanyDict = ref<any>([]);
  getWorkUnitList(operationTypeEnum.FIRE).then((res: any) => {
    operationCompanyDict.value = res.data;
  });
  const { staffData, deptData, onDeptSearch, clearSearchKey } = useSearch([
    'staffData',
    'deptData',
  ]);
  const fireStatusDict = ref<any>([]);
  const fireLevelDict = ref<any>([]);
  getOperationTypeEnum(operationTypeEnum.FIRE).then((res) => {
    fireStatusDict.value = changeMapToDict(res.data);
  });
  getMapDictionaryAPI('HOT_LEVEL').then((res) => {
    fireLevelDict.value = changeMapToDict(res.data);
  });

  const store = useSafetyCertificationStore();
  const router = useRouter();

  const searchForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
  });
  const tempSearchForm = ref<any>({
    pageNo: 1,
    pageSize: 10,
  });

  const tableData = ref<{ total: number; list: TableData[] }>({
    total: 0,
    list: [],
  });

  const tableColumns: TableColumnData[] = [
    {
      title: '序号',
      width: 60,
      slotName: 'number',
    },
    {
      title: '作业证编号',
      dataIndex: 'certNum',
    },
    {
      title: '动火作业级别',
      dataIndex: 'operationLevelName',
    },
    {
      title: '申请单位',
      dataIndex: 'applyDeptName',
    },
    {
      title: '作业单位',
      dataIndex: 'operationDeptId',
    },
    {
      title: '作业负责人',
      dataIndex: 'operationMasterName',
    },
    {
      title: '作业证申请时间',
      dataIndex: 'createTime',
    },
    {
      title: '作业证状态',
      dataIndex: 'certificateStatusName',
      cellStyle: {
        position: 'relative',
      },
      slotName: 'certificateStatus',
    },
    {
      title: '操作',
      // width: 200,
      slotName: 'option',
      align: 'center',
    },
  ];

  const getTableList = async () => {
    const { data } = await getCertificateList(operationTypeEnum.FIRE, {
      ...searchForm.value,
    });
    store.setCurrentOperationType(operationTypeEnum.FIRE);
    tableData.value = data;
  };

  onBeforeMount(async () => {
    getTableList();
  });

  onActivated(() => {
    getTableList();
  });

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      searchForm.value = tempSearchForm.value;
      getTableList();
    });
  });

  const pageChange = (pageNo: number) => {
    searchForm.value.pageNo = pageNo;
    getTableList();
  };
  const handleReset = () => {
    searchForm.value = {
      pageNo: 1,
      pageSize: 10,
      safetyMesure: '',
      operationType: '',
    };
    tempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
      safetyMesure: '',
      operationType: '',
    };
    getTableList();
  };
  const pageSizeChange = (pageSize: number) => {
    searchForm.value.pageSize = pageSize;
    getTableList();
  };

  // 跳转到办理
  const certificateHandling = (record: any) => {
    router.push({
      name: 'FireCertificateHandling',
      query: {
        id: record.certBaseId,
        status: record.status,
        statusName: record.statusName,
        guardianUserId: record.guardianUserId, // 作业监护人
        applyUserId: record.applyUserId, // 申请人
      },
    });
  };
  // 跳转到新增
  const handleAdd = (record: any) => {
    router.push({
      name: 'FireCertificateAdd',
      query: {
        id: record.certBaseId,
        type: 'add',
      },
    });
  };
  // 跳转到详情
  const handelDetail = (record: any) => {
    router.push({
      name: 'FireCertificateDetail',
      query: {
        id: record.certBaseId,
        status: 'detail',
      },
    });
  };
  const { guideVisible, guideItems, handleOperationGuide } = useOperationGuide(
    operationTypeEnum.FIRE
  );
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
  .color-red {
    color: #f76560;
  }
  .cursor-pointer {
    cursor: pointer;
  }
  .close-reason-modal {
    --contentText: '';
    &:hover::before {
      content: var(--contentText);
      position: absolute;
      color: #f7ba1e;
      top: -20px;
      left: 50%;
      transform: translate(-50%);
      height: 30px;
      line-height: 30px;
      background-color: var(--bg2);
      overflow: hidden;
      white-space: nowrap;
      border: 1px solid #6b7785;
      border-radius: 2px;
      padding: 0 10px;
      z-index: 10;
    }
  }
</style>
