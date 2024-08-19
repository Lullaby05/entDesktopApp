<!-- 隐患管理--快照 -->
<template>
  <div class="container">
    <!-- <a-tabs
      v-model:active-key="selectForm.dangerStateCode"
      type="card-gutter"
      :hide-content="true"
      @change="
        () => {
          selectForm.pageNo = 1;
          pitfallStore.$patch({ snapShotListTab: selectForm.dangerStateCode });
          getTableList();
        }
      "
    >
      <a-tab-pane v-for="item in tabsList" :key="item.code">
        <template #title> {{ item.name }}({{ item.count }}) </template>
      </a-tab-pane>
    </a-tabs> -->
    <TableListCard>
      <template #headerInput>
        <a-form :model="tempSearchForm" layout="inline">
          <a-form-item field="hazardDesc" label="隐患描述">
            <a-input
              v-model="tempSearchForm.hazardDesc"
              placeholder="请输入隐患描述"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="hazardAddr" label="隐患位置">
            <a-input
              v-model="tempSearchForm.hazardAddr"
              allow-clear
              placeholder="请输入隐患位置"
            ></a-input>
          </a-form-item>
          <a-form-item field="inspectorId" label="排查人">
            <a-select
              v-model="tempSearchForm.inspectorId"
              allow-clear
              allow-search
              placeholder="请选择排查人"
            >
              <a-option
                v-for="item in staffData"
                :key="item.id"
                :value="item.id"
                :label="item.userName"
              ></a-option>
            </a-select>
            <!-- <a-input
              v-model="tempSearchForm.inspectorName"
              placeholder="请输入排查人"
              allow-clear
            ></a-input> -->
          </a-form-item>
          <a-form-item field="dangerLevelCode" label="隐患等级">
            <a-select
              v-model="tempSearchForm.dangerLevelCode"
              placeholder="请选择隐患等级"
              allow-search
              allow-clear
            >
              <a-option
                v-for="item in dangerLevel"
                :key="item.dictKey"
                :value="item.dictKey"
                >{{ item.dictValue }}</a-option
              >
            </a-select>
          </a-form-item>
          <a-form-item field="inspectTime" label="排查时间">
            <a-range-picker
              v-model="tempSearchForm.inspectTime"
              :placeholder="['开始时间', '结束时间']"
              show-time
              :time-picker-props="{
                defaultValue: ['00:00:00', '23:59:59'],
              }"
              format="YYYY-MM-DD HH:mm:ss"
              allow-clear
            />
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
                getTableList();
              }
            "
          >
            <icon-search class="icon" />
            查询
          </a-button>
          <a-button @click="handleReset">
            <icon-refresh class="icon" />
            重置
          </a-button>
        </div>
      </template>
      <template #primaryBtn>
        <a-button
          type="primary"
          @click="
            downloadFile(
              'https://business.api.xkrsecure.com/exportFiles/安全隐患整改记录 .doc'
            )
          "
          >导出</a-button
        >
      </template>
      <template #minorBtn>
        <a-space>
          <icon-refresh class="minor-icon" size="20" @click="getTableList" />
        </a-space>
      </template>
      <template #table>
        <a-table
          :data="snapshotData.list"
          row-key="id"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #dangerState="{ record }">
            {{
              record.dangerStateCode === '3'
                ? record.rectifyStateName
                : record.dangerState
            }}
          </template>
          <template #dangerLevel="{ record }">
            {{ record.dangerLevel ? record.dangerLevel : record.hidRiskLevel }}
          </template>
          <template #option="{ record }">
            <div>
              <!-- <a-button
                v-permission="'SnapshotUrge'"
                v-if="
                  record.dangerStateCode === statusEnum.TOBERECTIFY &&
                  record.rectifyStateCode === '4'
                "
                type="text"
                size="mini"
                status="danger"
                @click="handleButtonClick('urge', record)"
              >
                催办
              </a-button>
              <a-button
                v-permission="'SnapshotDetailReport'"
                v-if="
                  [statusEnum.TOBERECTIFY, statusEnum.OVERDUE].includes(
                    record.dangerStateCode
                  ) && record.rectifyId === userInfo.enterPriseUserId
                "
                type="text"
                size="mini"
                @click="handleButtonClick('report', record)"
              >
                整改上报
              </a-button>
              <a-button
                v-permission="'SnapshotEdit'"
                v-if="
                  [statusEnum.TOBERECTIFY, statusEnum.OVERDUE].includes(
                    record.dangerStateCode
                  ) && userInfo.enterPriseUserId === record.confirmId
                "
                type="text"
                size="mini"
                @click="handleButtonClick('edit', record)"
              >
                编辑
              </a-button>
              <a-button
                v-permission="'SnapshotDetailConfirm'"
                v-if="
                  record.dangerStateCode === statusEnum.CONFIRMED &&
                  confirmPermission
                "
                type="text"
                size="mini"
                @click="handleButtonClick('confirm', record)"
              >
                隐患确认
              </a-button>
              <a-button
                v-permission="'SnapshotDetailAcceptance'"
                v-if="
                  record.dangerStateCode === statusEnum.TOBEACCEPTANCE &&
                  (!record.prefillCheckAcceptId
                    ? acceptancePermission
                    : record.prefillCheckAcceptId === userInfo.enterPriseUserId)
                "
                type="text"
                size="mini"
                @click="handleButtonClick('acceptance', record)"
              >
                整改验收
              </a-button>
              <a-button
                v-permission="'SnapshotDetailRecheck'"
                v-if="
                  record.dangerStateCode === statusEnum.REEXAMINE &&
                  (!record.prefillVerifierId
                    ? recheckPermission
                    : record.prefillVerifierId === userInfo.enterPriseUserId)
                "
                type="text"
                size="mini"
                @click="handleButtonClick('reexamine', record)"
              >
                复审
              </a-button> -->
              <a-button
                type="text"
                size="mini"
                @click="handleButtonClick('toDetail', record)"
              >
                详情
              </a-button>
            </div>
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
          :total="snapshotData.total || 0"
          @change="pageChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>
    <!-- 催办弹窗 -->
    <a-modal
      v-model:visible="urgeModalVisible"
      title="隐患催办提醒"
      title-align="start"
      @cancel="handleCancel"
      @before-ok="handleBeforeOk"
      :width="700"
    >
      <a-form :model="urgeForm">
        <a-form-item field="content" label="督促整改内容提醒">
          <a-textarea
            v-model="urgeForm.content"
            :max-length="200"
            :auto-size="{
              minRows: 6,
              maxRows: 6,
            }"
            allow-clear
            show-word-limit
            placeholder="请输入督促整改内容提醒"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup name="Snapshot">
  import { computed, onBeforeMount, ref } from 'vue';
  import { statusEnum } from './composition/useDict';
  import { useList } from './composition/useList';
  import { StaffItem } from '@/views/enterpriseManage/staffManage';
  import { getStaffDataAllAPI } from '@/api/enterpriseManage';
  import { useUserStore, usePitfallStore } from '@/store';
  import { getPitfallConfigByUser } from '@/api/pitfall';
  import { downloadFile } from '@/utils/utils';

  const pitfallStore = usePitfallStore();

  // 搜索和表格内容
  const {
    selectForm,
    tempSearchForm,
    columns,
    snapshotData,
    handleButtonClick,
    urgeModalVisible,
    handleCancel,
    handleBeforeOk,
    urgeForm,
    pageChange,
    getTableList,
    handleReset,
    pageSizeChange,
    dangerLevel,
    tabsList,
  } = useList(pitfallStore);

  const userStore = useUserStore();
  const userInfo = computed(() => userStore.userInfo);

  const staffData = ref<StaffItem[]>([]);

  const getStaffData = async () => {
    const { data: res } = await getStaffDataAllAPI({
      enterpriseId: userInfo.value.enterpriseId,
    });

    staffData.value = res;
  };

  const permission = ref<number>(0b000);

  const confirmPermission = computed(() => {
    return (0b100 & permission.value) === 0b100;
  });
  const acceptancePermission = computed(() => {
    return (0b010 & permission.value) === 0b010;
  });
  const recheckPermission = computed(() => {
    return (0b001 & permission.value) === 0b001;
  });

  onBeforeMount(async () => {
    const { data } = await getPitfallConfigByUser();
    permission.value = parseInt(data, 2);
  });

  getStaffData();
</script>

<style lang="less" scoped>
  .container :deep(.arco-tabs-nav-type-card-gutter) {
    &::before {
      display: none;
    }
    margin-bottom: 0px;
    .arco-tabs-tab {
      border-radius: 5px;
      background-color: var(--bg2);
      border-bottom: 1px solid var(--color-neutral-3);
    }
    .arco-tabs-tab-active {
      background-color: #357cf0;
      color: #ffffff;
    }
  }
  .modal-btn-text {
    margin-left: 6px;
  }

  :deep(.content) {
    .line {
      margin: 8px 0;
      display: flex;

      .label {
        width: 80px;
        margin-right: 10px;
      }

      .value {
        flex: 1;
      }

      .value.img {
        width: 100px;
        height: 200px;
        vertical-align: bottom;
      }
    }

    .arco-table-container {
      min-height: 538px;
    }

    .pagination {
      padding: 0 !important;
    }
  }

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
