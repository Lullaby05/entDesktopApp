<!-- 隐患管理--隐患管理 -->
<template>
  <div class="container">
    <a-tabs
      v-model:active-key="activeKey"
      type="card-gutter"
      :hide-content="true"
      @change="(key: string | number) => {
          pitfallStore.$patch({
            pitfallListTab: activeKey,
          });
        tabChange(key)
      }"
    >
      <a-tab-pane v-for="item in tabsList" :key="item.code">
        <template #title> {{ item.name }}({{ item.count }}) </template>
      </a-tab-pane>
    </a-tabs>
    <a-card class="tabs-card">
      <keep-alive>
        <component
          :is="componentId"
          :permission="permission"
          :tableData="tableData"
          @get-table-data="getTableData"
        />
      </keep-alive>
    </a-card>
  </div>
</template>

<script lang="ts">
  import { ref } from 'vue';
  // import TreatmentType from '@/views/pitfall/pitfallManage/components/TreatmentType.vue';
  // 组件
  import All from '@/views/pitfall/pitfallManage/components/All/index.vue';
  import ToBeConfirmed from '@/views/pitfall/pitfallManage/components/ToBeConfirmed/index.vue';
  import ToBeReform from '@/views/pitfall/pitfallManage/components/ToBeReform/index.vue';
  import ToBeDelivery from '@/views/pitfall/pitfallManage/components/ToBeDelivery/index.vue';
  import ToBeReExamine from '@/views/pitfall/pitfallManage/components/ToBeReExamine/index.vue';
  import HadReform from '@/views/pitfall/pitfallManage/components/HadReform/index.vue';
  import Misionformation from '@/views/pitfall/pitfallManage/components/Misionformation/index.vue';

  import { usePitfallStore } from '@/store';

  import { onBeforeMount } from 'vue';
  import {
    getPitfallConfigByUser,
    getPitfallList,
    getPitfallTabs,
  } from '@/api/pitfall';
  import { TableData } from '@arco-design/web-vue';

  export default {
    // name:'PitfallTreatment'
  };
</script>

<script lang="ts" setup name="PitfallManage">
  const pitfallStore = usePitfallStore();

  const tabsList = ref<{ code: string; name: string; count: number }[]>([]);

  const tableData = ref<{ total?: number; list?: TableData[] }>({
    total: 0,
    list: [],
  });

  const activeKey = ref(pitfallStore.pitfallListTab);

  const permission = ref<number>(0b000);

  onBeforeMount(async () => {
    const tabsListRes = await getPitfallTabs();
    const allTabsCounts = tabsListRes.data.reduce((pre: number, cur: any) => {
      return pre + cur.count;
    }, 0);
    tabsList.value = tabsListRes.data;
    tabsList.value.unshift({ code: '', name: '全部', count: allTabsCounts });

    const { data } = await getPitfallConfigByUser();
    permission.value = parseInt(data, 2);
  });

  onActivated(async () => {
    const tabsListRes = await getPitfallTabs();
    const allTabsCounts = tabsListRes.data.reduce((pre: number, cur: any) => {
      return pre + cur.count;
    }, 0);
    tabsList.value = tabsListRes.data;
    tabsList.value.unshift({ code: '', name: '全部', count: allTabsCounts });
  });

  const tabChange = (key: any) => {
    activeKey.value = key;
  };

  const componentId = computed(() => {
    const obj = {
      '1': ToBeConfirmed,
      '2': Misionformation,
      '3': ToBeReform,
      '5': ToBeDelivery,
      '6': ToBeReExamine,
      '7': HadReform,
    };
    return obj[activeKey.value as keyof typeof obj] ?? All;
  });

  const getTableData = async (params: any) => {
    params = {
      ...params,
      dangerStateCode: activeKey.value,
    };
    const { data } = await getPitfallList(params);
    tableData.value = data;
  };
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
  .arco-card.tabs-card {
    width: 100%;
    height: 94%;

    // overflow-y: auto;
    :deep(.arco-card-bordered) {
      border: none;
    }

    :deep(.arco-tabs-content) {
      min-height: 700px;
    }

    :deep(.arco-card-body) {
      padding: 0 !important;
    }
  }

  .info-card {
    margin: 10px;

    .line {
      margin: 16px 0 30px;

      :deep(&.arco-divider-horizontal) {
        border-bottom: 2px solid var(--color-neutral-3);
      }

      :deep(.arco-divider-text) {
        font-size: 20px;
        font-weight: 700;
      }
    }
  }
</style>
