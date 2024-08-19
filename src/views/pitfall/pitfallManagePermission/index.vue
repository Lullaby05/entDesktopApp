<!-- 隐患管理-隐患处理配置 -->
<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <span class="title">隐患处理配置</span>
        <icon-refresh class="minor-icon" size="20" @click="reload" />
      </div>
      <div class="content-card-form">
        <div class="confirm-person">
          <div class="title">
            <span>隐患确认人：</span>
            <a-button
              v-permission="'PitfallManagePermissionSave'"
              type="primary"
              size="small"
              @click="openDrawer('confirm')"
              >选择</a-button
            >
          </div>
          <div class="table">
            <a-table
              :data="confirmTable"
              row-key="id"
              :columns="columns"
              :bordered="false"
              :pagination="false"
            >
              <template #option="{ record }">
                <a-button
                  v-permission="'PitfallManagePermissionSave'"
                  type="text"
                  size="mini"
                  status="danger"
                  @click="handleDelete('confirm', record)"
                >
                  移除
                </a-button>
              </template>
            </a-table>
          </div>
        </div>
        <div class="acceptance-person">
          <div class="title">
            <span>隐患验收人：</span>
            <a-button
              v-permission="'PitfallManagePermissionSave'"
              type="primary"
              size="small"
              @click="openDrawer('acceptance')"
              >选择</a-button
            >
          </div>
          <div class="table">
            <a-table
              :data="acceptanceTable"
              row-key="id"
              :columns="columns"
              :bordered="false"
              :pagination="false"
            >
              <template #option="{ record }">
                <a-button
                  v-permission="'PitfallManagePermissionSave'"
                  type="text"
                  size="mini"
                  status="danger"
                  @click="handleDelete('acceptance', record)"
                >
                  移除
                </a-button>
              </template>
            </a-table>
          </div>
        </div>
        <div class="recheck-person">
          <div class="title">
            <span>隐患复审人：</span>
            <a-button
              v-permission="'PitfallManagePermissionSave'"
              type="primary"
              size="small"
              @click="openDrawer('recheck')"
              >选择</a-button
            >
          </div>
          <div class="table">
            <a-table
              :data="recheckTable"
              row-key="id"
              :columns="columns"
              :bordered="false"
              :pagination="false"
            >
              <template #option="{ record }">
                <a-button
                  v-permission="'PitfallManagePermissionSave'"
                  type="text"
                  size="mini"
                  status="danger"
                  @click="handleDelete('recheck', record)"
                >
                  移除
                </a-button>
              </template>
            </a-table>
          </div>
        </div>
      </div>
      <div class="btn">
        <a-button
          v-permission="'PitfallManagePermissionSave'"
          type="primary"
          @click="handleSave"
          >保存</a-button
        >
      </div>
    </a-card>
    <staffDrawer
      ref="confirmDrawer"
      type="confirm"
      v-model:table-data="confirmTable"
      :dept-data="deptData"
      :on-dept-search="onDeptSearch"
      :clear-search-key="clearSearchKey"
    />
    <staffDrawer
      ref="acceptanceDrawer"
      type="acceptance"
      v-model:table-data="acceptanceTable"
      :dept-data="deptData"
      :on-dept-search="onDeptSearch"
      :clear-search-key="clearSearchKey"
    />
    <staffDrawer
      ref="recheckDrawer"
      type="recheck"
      v-model:table-data="recheckTable"
      :dept-data="deptData"
      :on-dept-search="onDeptSearch"
      :clear-search-key="clearSearchKey"
    />
  </div>
</template>
<script lang="ts" setup>
  import { TableColumnData, TableData, Message } from '@arco-design/web-vue';
  import { inject, ref } from 'vue';
  import staffDrawer from './components/staffDrawer.vue';
  import { getPitfallConfigList, pitfallConfigSave } from '@/api/pitfall';
  import { useSearch } from '../snapshot/composition/useSearch';

  const reload: () => void = inject('reload')!;

  const { deptData, onDeptSearch, clearSearchKey } = useSearch(['deptData']);

  const columns: TableColumnData[] = [
    { title: '员工姓名', dataIndex: 'userName', width: 120 },
    { title: '所属部门', dataIndex: 'deptName', width: 140 },
    { title: '岗位', dataIndex: 'jobName', width: 140 },
    { title: '手机号码', dataIndex: 'tel', width: 150 },
    {
      title: '操作',
      dataIndex: 'option',
      slotName: 'option',
      align: 'center',
      width: 100,
    },
  ];

  type permissionType = 'confirm' | 'acceptance' | 'recheck';
  type instanceDrawerType = InstanceType<typeof staffDrawer> | null;

  const confirmTable = ref([]);
  const acceptanceTable = ref([]);
  const recheckTable = ref([]);

  const confirmDrawer = ref<instanceDrawerType>(null);
  const acceptanceDrawer = ref<instanceDrawerType>(null);
  const recheckDrawer = ref<instanceDrawerType>(null);

  const getTableList = async () => {
    const { data } = await getPitfallConfigList();
    confirmTable.value = data.confirmPerm || [];
    acceptanceTable.value = data.acceptancePerm || [];
    recheckTable.value = data.reviewPerm || [];
  };

  getTableList();

  const openDrawer = (str: permissionType) => {
    const obj = {
      confirm: confirmDrawer,
      acceptance: acceptanceDrawer,
      recheck: recheckDrawer,
    };
    obj[str].value?.open();
  };

  const handleDelete = (str: permissionType, record: TableData) => {
    const obj = {
      confirm: confirmTable,
      acceptance: acceptanceTable,
      recheck: recheckTable,
    };

    obj[str].value = obj[str].value.filter(
      (item: TableData) => item.id !== record.id
    );
  };

  const handleSave = async () => {
    if (
      confirmTable.value.length === 0 ||
      acceptanceTable.value.length === 0 ||
      recheckTable.value.length === 0
    ) {
      Message.warning('请完善隐患处理配置');
      return;
    }
    const params = {
      confirmPermList: confirmTable.value.map((item: TableData) => item.id),
      acceptancePermList: acceptanceTable.value.map(
        (item: TableData) => item.id
      ),
      reviewPermList: recheckTable.value.map((item: TableData) => item.id),
    };
    await pitfallConfigSave(params);
    Message.success('保存成功');
    getTableList();
  };
</script>
<style lang="less" scoped>
  .arco-card.content-card {
    overflow: hidden;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 18px;
      margin-bottom: 30px;

      .title {
        margin-left: 8px;
      }
      .minor-icon {
        color: #8c8c8c;
        cursor: pointer;
      }
    }

    .content-card-form {
      min-height: 595px;
      width: 70%;
      margin: 20px auto 0;
      display: flex;
      flex-direction: column;
      gap: 20px;
      & > div {
        display: flex;
        flex-direction: column;
        gap: 10px;
        .title {
          &::before {
            content: '*';
            color: #f56c6c;
            margin-right: 4px;
          }
        }
      }
    }

    .btn {
      margin-top: 20px;
      text-align: center;

      button + button {
        margin-left: 12px;
      }
    }
  }
</style>
