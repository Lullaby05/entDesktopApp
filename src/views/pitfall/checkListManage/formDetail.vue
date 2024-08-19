<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title"
          >{{ type === 'form' ? '排查表查看' : '排查内容查看' }}
        </span>
      </div>
      <div class="content-card-form">
        <card-display :card-items="cardItems">
          <template #form>
            <div class="form-lists">
              <div class="item-slot" v-for="item in formLists" :key="item.id">
                <div class="form-render-title">{{ item.checkStandard }}</div>
                <form-render
                  :disabled="true"
                  v-model="item.formRenderData"
                  :forms="item.formsTemp"
                  mode="PC"
                  :config="item.formConfigTemp"
                />
              </div>
            </div>
          </template>
          <template #content>
            <div class="item-slot-table">
              <a-table
                :columns="tableColumns"
                :data="tableData"
                :pagination="false"
                :bordered="{ cell: true }"
              >
                <template #number="{ rowIndex }">
                  {{ rowIndex + 1 }}
                </template>
                <template #options="{ record }">
                  <a-button type="text" @click="toDetail(record)"
                    >详情</a-button
                  >
                </template>
              </a-table>
            </div>
          </template>
        </card-display>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
  import cardDisplay from '../snapshot/components/cardDisplay.vue';
  import { useFormRender } from '@/views/risk/gradedControl/composition/useFormRender';
  import FormRender from '@/components/form-design/components/FormRender.vue';
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { TableColumnData } from '@arco-design/web-vue';
  import { getCheckListContent } from '@/api/pitfall';
  import { onBeforeMount } from 'vue';
  import { computed } from 'vue';

  const route = useRoute();
  const router = useRouter();

  const { type, checkContentIds, checkName } = route.query;

  // 卡片配置
  const cardItems = ref({
    items: [
      { id: 1, field: '排查表名称', value: computed(() => checkName) },
      {
        id: 2,
        field: '排查内容',
        type: 'slot',
        visible: type === 'content',
        slotName: 'content',
      },
      {
        id: 3,
        field: '排查表单',
        type: 'slot',
        visible: type === 'form',
        slotName: 'form',
      },
    ],
  });

  // 表格配置
  const tableColumns: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
    },
    {
      title: '排查项目',
      dataIndex: 'checkItem',
    },
    {
      title: '问题点',
      dataIndex: 'problemSpot',
    },
    {
      title: '排查标准',
      dataIndex: 'checkStandard',
    },
    {
      title: '操作',
      slotName: 'options',
    },
  ];

  const formLists = ref<any[]>([]);

  const tableData = ref([]);

  const getContentData = async () => {
    const res = await getCheckListContent(checkContentIds as string[]);
    tableData.value = res.data;

    if (type === 'form') {
      formLists.value = tableData.value.map((ele: any) => {
        const formItem = JSON.parse(ele.formItems).design;
        const formRender = useFormRender(formItem);
        return {
          id: formItem.formId,
          checkStandard: ele.checkStandard,
          formRenderData: formRender.formData,
          formsTemp: formRender.formsTemp,
          formConfigTemp: formRender.formConfigTemp,
        };
      });
    }
  };

  onBeforeMount(() => {
    getContentData();
  });

  const toDetail = (record: any) => {
    router.push({
      name: 'CheckContentEdit',
      query: { id: record.id, type: 'isDetail' },
    });
  };

  const goBack = () => {
    router.back();
  };
</script>
<style lang="less" scoped>
  .arco-card.content-card {
    .header {
      font-size: 18px;
      margin-bottom: 30px;

      .title {
        margin-left: 8px;
      }
    }

    .content-card-form {
      margin: 0 auto;
      min-height: calc(100vh - 213px);

      :deep(.card-display-content) {
        width: 80%;
        height: 100%;

        .content-items div {
          line-height: 42px;
        }
      }

      .form-lists {
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      .item-slot {
        margin-top: 20px;
        box-shadow: 0px 0px 7px -3px rgba(0, 0, 0, 0.5);
        border-bottom: 1px solid var(--bg4);
        border-radius: 10px;
        width: 99%;

        .form-render-title {
          line-height: 30px;
          font-size: 14px;
          padding: 5px 10px;
          background-color: var(--bg4);
        }

        :deep(.process-form) {
          padding: 10px;
        }
      }

      .item-slot-table {
        margin-top: 20px;
        width: 80%;
      }
    }
  }
</style>
