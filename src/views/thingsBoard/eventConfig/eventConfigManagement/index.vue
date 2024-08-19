<!-- 监测预警管理-事件配置管理列表 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form :model="tempSearchForm" layout="inline">
          <a-form-item field="eventName" label="事件名称">
            <a-input
              v-model="tempSearchForm.eventName"
              placeholder="请输入事件名称"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="typeNLevel" label="事件类型等级">
            <a-cascader
              :options="eventTypeList"
              v-model="tempSearchForm.typeNLevel"
              :field-names="{ label: 'dictKey', value: 'dictValue' }"
              placeholder="请选择事件类型等级"
              check-strictly
              allow-clear
              allow-search
            />
          </a-form-item>
          <!-- <a-form-item field="method" label="通知方式">
            <a-select
              v-model="tempSearchForm.method"
              placeholder="请选择所属角色"
              allow-search
              allow-clear
            >
              <a-option
                v-for="item in methodList"
                :key="item.dictValue"
                :value="item.dictValue"
                >{{ item.dictKey }}</a-option
              >
            </a-select>
          </a-form-item> -->
          <!-- <a-form-item field="personConfirm" label="人工确认">
            <a-select
              v-model="tempSearchForm.personConfirm"
              placeholder="请选择账号类型"
              allow-search
              allow-clear
            >
              <a-option
                v-for="item in personConfigList"
                :key="item.dictValue"
                :value="item.dictValue"
                >{{ item.dictKey }}</a-option
              >
            </a-select>
          </a-form-item> -->
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
      <template #minorBtn>
        <a-space>
          <icon-refresh class="minor-icon" size="20" />
        </a-space>
      </template>
      <template #primaryBtn>
        <a-space v-permission="'EventMessageConfigDefault'">
          <a-button
            type="primary"
            @click="() => router.push({ name: 'EventMessageConfig' })"
          >
            默认通知策略配置
          </a-button>
          <a-tooltip content="若事件未设置告警通知策略，默认启动此通知策略">
            <icon-info-circle size="20" />
          </a-tooltip>
        </a-space>
      </template>
      <template #table>
        <a-table
          :data="eventConfigList.list"
          :columns="columns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #typeNLevel="{ record }">
            <div class="type-and-level">
              <span>{{ record.eventTypeName }}</span>
              <a-tag v-if="record.eventLevel" :color="record.color">{{
                record.eventLevelName
              }}</a-tag>
            </div>
          </template>
          <template #option="{ record }">
            <div>
              <a-button
                v-permission="'EventConfigManagementEdit'"
                type="text"
                size="mini"
                @click="toEditPage(record)"
              >
                编辑
              </a-button>
              <a-button type="text" size="mini" @click="toDetailPage(record)">
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
          :total="(eventConfigList.total as number)"
          @change="pageChange"
          @page-size-change="pageSizeChange"
        ></a-pagination>
      </template>
    </TableListCard>
  </div>
</template>
<script lang="ts" setup name="EventConfigManagement">
  import { ref, onMounted } from 'vue';
  import { eventTypeLevelDict, searchType } from './type';
  import { TableColumnData, TableData } from '@arco-design/web-vue';
  import { getEventConfigList } from '@/api/thingsBoard';
  import { dictResponseType } from '@/api';
  import { useRouter } from 'vue-router';
  import { formatDate } from '@/utils/utils';
  import { handleOnKeyup } from '@/utils/event';

  const selectForm = ref<searchType>({
    pageNo: 1,
    pageSize: 10,
  });
  const tempSearchForm = ref<searchType>({
    pageNo: 1,
    pageSize: 10,
  });

  const eventTypeList = ref<dictResponseType[]>(eventTypeLevelDict);

  const eventConfigList = ref<{ list: TableData[]; total: number }>({
    list: [],
    total: 0,
  });
  const columns: TableColumnData[] = [
    {
      dataIndex: 'number',
      title: '序号',
      slotName: 'number',
    },
    {
      dataIndex: 'eventName',
      title: '事件名称',
    },
    {
      dataIndex: 'eventDesc',
      title: '事件说明',
    },
    {
      dataIndex: 'typeNLevel',
      title: '事件类型等级',
      slotName: 'typeNLevel',
      width: 150,
      cellStyle: { width: '12%' },
    },
    // {
    //   dataIndex: 'personConfirm',
    //   title: '人工确认',
    // },
    // {
    //   dataIndex: 'method',
    //   title: '通知方式',
    // },
    {
      dataIndex: 'updateTime',
      title: '最后修改时间',
    },
    {
      dataIndex: 'option',
      title: '操作',
      slotName: 'option',
      align: 'center',
    },
  ];

  const getTableList = async () => {
    const params = {
      ...selectForm.value,
      eventType: selectForm.value.typeNLevel
        ? selectForm.value.typeNLevel?.split('-')[0]
        : selectForm.value.eventType,
      eventLevel: selectForm.value.typeNLevel?.split('-')[1]
        ? selectForm.value.typeNLevel
        : undefined,
    };
    const { data } = await getEventConfigList(params);
    eventConfigList.value = data;
    eventConfigList.value.list = data.list.map((ele: TableData) => {
      const eventDict = eventTypeList.value.find(
        (item) => item.dictValue === ele.eventType
      );
      const levelDict = eventDict?.children?.find(
        (item) => item.dictValue === ele.eventLevel
      );
      return {
        ...ele,
        color: levelDict?.color,
        updateTime: formatDate(ele.updateTime),
        eventTypeName: eventDict?.dictKey,
        eventLevelName: levelDict?.dictKey,
      };
    });
  };
  const handleReset = () => {
    tempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
    };
    selectForm.value = {
      pageNo: 1,
      pageSize: 10,
    };
    getTableList();
  };
  const pageChange = (page: number) => {
    selectForm.value.pageNo = page;
    getTableList();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getTableList();
  };

  getTableList();

  const router = useRouter();
  const toEditPage = (record: TableData) => {
    router.push({
      name: 'EventConfigManagementEdit',
      query: {
        id: record.eventId,
      },
    });
  };
  const toDetailPage = (record: TableData) => {
    router.push({
      name: 'EventConfigManagementDetail',
      query: {
        id: record.eventId,
      },
    });
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getTableList();
    });
  });
</script>
<style lang="less" scoped>
  .header-btn {
    display: flex;
    // flex-direction: column;
    justify-content: center;
    align-items: center;

    .arco-btn + .arco-btn {
      margin-left: 12px;
    }
  }
  .type-and-level {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
</style>
