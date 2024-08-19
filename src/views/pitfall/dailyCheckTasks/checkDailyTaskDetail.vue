<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">排查任务详情</span>
      </div>
      <div class="content-card-form">
        <cardDisplay :card-items="cardItems" :key="cardItems?.items.length">
          <!-- <template #default>
            <div>
              <div
                class="check-item"
                v-for="(ele, index) in Object.keys(checkItemList)"
              >
                <span class="check-item-title">{{
                  `排查项目${index + 1}：${ele}`
                }}</span>
                <div
                  class="item-slot"
                  v-for="item in checkItemList[ele]"
                  :key="item.id"
                >
                  <div class="form-render-title">{{ item.checkStandard }}</div>
                  <form-render
                    :disabled="true"
                    v-model="item.formRenderData"
                    :forms="item.formsTemp"
                    :config="item.formConfigTemp"
                    mode="PC"
                  />
                </div>
              </div>
            </div>
          </template> -->
        </cardDisplay>
        <div class="check-table">
          <div class="title">检查记录</div>
          <div class="content">
            <div class="total-count-items">
              <div class="item">
                <span class="label">排查总项：</span>
                <span class="cursor" @click="filter('total')">{{
                  countItems.total
                }}</span>
              </div>
              <div class="item">
                <span class="label">合格项：</span>
                <span class="cursor green-text" @click="filter('qualify')">{{
                  countItems.qualify
                }}</span>
              </div>
              <div class="item">
                <span class="label">不合格：</span>
                <span class="cursor red-text" @click="filter('unQualify')">{{
                  countItems.unQualify
                }}</span>
              </div>
              <div class="item">
                <span class="label">不涉及：</span>
                <span class="cursor" @click="filter('notRelated')">{{
                  countItems.notRelated
                }}</span>
              </div>
            </div>
            <div class="table-list">
              <a-table
                :data="checkItemList"
                :bordered="false"
                :columns="tableColumns"
                :pagination="{
                  baseSize: 3,
                  bufferSize: 1,
                  pageSizeOptions: [10, 20, 50, 100],
                  current: searchForm.pageNo,
                  pageSize: searchForm.pageSize,
                  showPageSize: true,
                  total: checkItemList.length,
                }"
                @page-change="pageChange"
                @page-size-change="pageSizeChange"
              >
                <template #number="{ rowIndex }">
                  {{ rowIndex + 1 }}
                </template>
                <template #checkResult="{ record }">
                  <span
                    class="check-result"
                    :style="`--resultColor: ${record.checkResultColor}`"
                    >{{ record.checkResult }}</span
                  >
                </template>
                <template #option="{ record }">
                  <a-button
                    v-if="
                      record.formRenderData.field_isQualified &&
                      record.formRenderData.field_isQualified !== '不涉及'
                    "
                    type="text"
                    @click="viewCheckContent(record)"
                  >
                    查看
                  </a-button>
                </template>
              </a-table>
            </div>
          </div>
        </div>
      </div>
    </a-card>
    <a-modal
      title="检查记录"
      unmount-on-close
      width="40vw"
      :footer="false"
      :visible="checkContentVisible"
      @before-cancel="closeVisible"
    >
      <form-render
        :disabled="true"
        v-model="modalFormRenderData"
        :forms="modalFormsTemp"
        :config="modalFormConfigTemp"
        mode="PC"
      />
    </a-modal>
  </div>
</template>
<script lang="ts">
  export default {
    name: 'CheckDailyTaskDetail',
  };
</script>
<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router';
  import FormRender from '@/components/form-design/components/FormRender.vue';
  import cardDisplay from '../snapshot/components/cardDisplay.vue';
  import { useFormRender } from '@/views/risk/gradedControl/composition/useFormRender';
  import { onBeforeMount, ref } from 'vue';
  import { getDailyCheckDetail } from '@/api/pitfall';

  const route = useRoute();
  const router = useRouter();
  const { id, checkPerson } = route.query;

  const goBack = () => {
    router.back();
  };

  // const formLists = ref();
  const checkItemListAll = ref<any>([]);
  const cardItems = ref();

  const tempCheckItemList = ref<any>({});
  const getDetailData = async () => {
    const { data } = await getDailyCheckDetail(id as string);

    cardItems.value = {
      title: '任务信息',
      items: [
        { id: 1, field: '任务名称', value: data.taskName },
        { id: 2, field: '所属计划', value: data.planName },
        { id: 3, field: '排查周期', value: data.checkCycle },
        { id: 4, field: '排查责任人', value: checkPerson },
        {
          id: 5,
          field: '任务开始时间',
          value: data.taskStartTime,
        },
        {
          id: 6,
          field: '任务截止时间',
          value: data.taskEndTime,
        },
        { id: 7, field: '排查开始时间', value: data.checkStartTime },
        { id: 8, field: '排查结束时间', value: data.checkEndTime },
        { id: 9, field: '电子签名', type: 'sign', value: data.sign },
      ],
    };
    const colorObj = {
      合格: '#00C800',
      不合格: '#FF0000',
      不涉及: '#999999',
    };
    data.formList.forEach((item: any) => {
      const formItem = JSON.parse(item.formItems).design;
      const formRender = useFormRender(formItem);
      if (tempCheckItemList.value[item.checkItem]) {
        // 如果result中已经有了这个id,则不加入进去
        // if (
        //   tempCheckItemList.value[item.checkItem].some(
        //     (ele: any) => ele.id === formItem.formId
        //   )
        // )
        //   return;
        tempCheckItemList.value[item.checkItem].push({
          id: item.checkContentId,
          checkItem: item.checkItem,
          problemSpot: item.problemSpot,
          checkStandard: item.checkStandard,
          formRenderData: formRender.formData,
          formsTemp: formRender.formsTemp,
          formConfigTemp: formRender.formConfigTemp,
          checkResult: formRender.formData.field_isQualified,
          checkResultColor:
            colorObj[
              formRender.formData.field_isQualified as keyof typeof colorObj
            ],
        });
      } else {
        tempCheckItemList.value[item.checkItem] = [
          {
            id: item.checkContentId,
            checkStandard: item.checkStandard,
            checkItem: item.checkItem,
            problemSpot: item.problemSpot,
            formRenderData: formRender.formData,
            formsTemp: formRender.formsTemp,
            formConfigTemp: formRender.formConfigTemp,
            checkResult: formRender.formData.field_isQualified,
            checkResultColor:
              colorObj[
                formRender.formData.field_isQualified as keyof typeof colorObj
              ],
          },
        ];
      }
    });
    let tempList: any[] = [];
    Object.keys(tempCheckItemList.value).forEach((key) => {
      tempList.push(...tempCheckItemList.value[key]);
    });
    checkItemListAll.value = tempList;
  };

  // 表格
  const countItems = computed(() => {
    let total = 0;
    let qualify = 0;
    let unQualify = 0;
    let notRelated = 0;
    if (checkItemListAll.value.length) {
      checkItemListAll.value.forEach((item: any) => {
        total++;
        if (item.formRenderData.field_isQualified === '合格') {
          qualify++;
        } else if (item.formRenderData.field_isQualified === '不合格') {
          unQualify++;
        } else if (item.formRenderData.field_isQualified === '不涉及') {
          notRelated++;
        }
      });
    }
    return {
      total,
      qualify,
      unQualify,
      notRelated,
    };
  });
  const searchForm = ref({
    pageNo: 1,
    pageSize: 10,
  });
  const tableColumns = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
    },
    {
      title: '排查项目',
      dataIndex: 'checkItem',
      cellStyle: { width: '15%' },
    },
    {
      title: '问题点',
      dataIndex: 'problemSpot',
      cellStyle: { width: '15%' },
    },
    {
      title: '排查标准',
      dataIndex: 'checkStandard',
      cellStyle: { width: '25%' },
    },
    {
      title: '排查结果',
      dataIndex: 'checkResult',
      slotName: 'checkResult',
      cellStyle: { width: '15%' },
      align: 'center',
    },
    {
      title: '检查内容详情',
      dataIndex: 'option',
      slotName: 'option',
      align: 'center',
    },
  ];
  const pageChange = (pageNo: number) => {
    searchForm.value.pageNo = pageNo;
  };
  const pageSizeChange = (pageSize: number) => {
    searchForm.value.pageSize = pageSize;
  };
  const activeFilter = ref('total');
  const filter = (str: 'total' | 'qualify' | 'unQualify' | 'notRelated') => {
    activeFilter.value = str;
  };
  const checkItemList = computed(() => {
    if (activeFilter.value === 'qualify') {
      return checkItemListAll.value.filter(
        (item: any) => item.formRenderData.field_isQualified === '合格'
      );
    } else if (activeFilter.value === 'unQualify') {
      return checkItemListAll.value.filter(
        (item: any) => item.formRenderData.field_isQualified === '不合格'
      );
    } else if (activeFilter.value === 'notRelated') {
      return checkItemListAll.value.filter(
        (item: any) => item.formRenderData.field_isQualified === '不涉及'
      );
    }
    return checkItemListAll.value;
  });

  onBeforeMount(() => {
    getDetailData();
  });

  // 弹窗
  const checkContentVisible = ref(false);
  const modalFormRenderData = ref({});
  const modalFormsTemp = ref([]);
  const modalFormConfigTemp = ref({});
  const viewCheckContent = (record: any) => {
    checkContentVisible.value = true;
    modalFormRenderData.value = record.formRenderData;
    modalFormsTemp.value = record.formsTemp;
    modalFormConfigTemp.value = record.formConfigTemp;
  };
  const closeVisible = () => {
    checkContentVisible.value = false;
    modalFormRenderData.value = {};
    modalFormsTemp.value = [];
    modalFormConfigTemp.value = {};
    return true;
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
    :deep(.card-display-title) {
      margin: 0;
      margin-left: 24px;
      margin-bottom: 24px;
      font-family: 'Alibaba-Medium';
      font-size: 16px;
    }
    :deep(.card-display-content) {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      width: 100%;
      height: 100%;

      .content-items div {
        line-height: 42px;
      }
    }
    .content-card-form {
      width: 100%;
      min-height: 600px;
      margin-bottom: 20px;
      .check-table {
        margin: 24px 24px 0 24px;
        .title {
          margin-bottom: 10px;
          font-family: 'Alibaba-Medium';
          font-size: 16px;
        }
        .total-count-items {
          display: flex;
          align-items: center;
          gap: 24px;
          line-height: 3;
          .cursor {
            cursor: pointer;
          }
          .green-text {
            color: #00a854;
          }
          .red-text {
            color: #f76560;
          }
        }
        .check-result {
          position: relative;
          &::before {
            content: '';
            position: absolute;
            width: 1rem;
            height: 1rem;
            border-radius: 50%;
            top: 50%;
            left: 0;
            transform: translate(calc(-1em - 5px), -50%);
            background-color: var(--resultColor);
          }
        }
      }
      .check-item {
        font-size: 16px;
        margin-left: 80px;
        width: 800px;
      }

      .check-item + .check-item {
        margin-top: 20px;
      }
      .item-slot {
        margin-top: 20px;
        box-shadow: 0px 0px 7px -3px rgba(0, 0, 0, 0.5);
        border-bottom: 1px solid var(--bg4);
        border-radius: 10px;
        width: 100%;
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
    }
    .btn {
      text-align: center;
    }
  }
</style>
