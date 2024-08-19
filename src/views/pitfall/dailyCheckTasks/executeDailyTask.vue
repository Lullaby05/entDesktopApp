<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">{{
          type !== 'detail' ? '任务执行' : '任务执行详情'
        }}</span>
      </div>
      <div class="content-card-form" v-if="!hasNotData">
        <div
          v-if="type === 'detail'"
          class="content-item-tabs"
          style="margin-bottom: 10px"
        >
          <a-tabs
            v-model:active-key="activeKey"
            type="card-gutter"
            :hide-content="true"
            @change="tabChange"
          >
            <a-tab-pane v-for="item in tabsList" :key="item.code">
              <template #title> {{ item.name }}({{ item.count }}) </template>
            </a-tab-pane>
          </a-tabs>
        </div>
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
            <div class="form-render-title">
              {{ item.checkStandard }}
            </div>
            <form-render
              :disabled="type === 'detail'"
              ref="form"
              v-model="item.formRenderData"
              :forms="item.formsTemp"
              mode="PC"
              :config="item.formConfigTemp"
              @click="handleClick"
            />
          </div>
        </div>
      </div>
      <div class="btn" v-if="type !== 'detail' && !hasNotData">
        <a-button @click="goBack">取消</a-button>
        <a-button type="primary" @click="handleSave">保存</a-button>
      </div>
      <div class="no-data" v-if="hasNotData">
        <img src="@/assets/images/no-check-task.png" alt="" />
        <span>该排查任务已被撤销，无需执行</span>
      </div>
    </a-card>
    <a-modal
      :visible="signModalVisible"
      title="请工整书写您的名字"
      :footer="false"
      @cancel="closeSignModal"
    >
      <div class="sign-modal-content">
        <canvas
          ref="signRef"
          width="480"
          style="background-color: #ffffff; border: 1px dashed #999999"
        ></canvas>
      </div>
      <div class="sign-modal-footer">
        <a-button type="primary" @click="clearSign()">重写</a-button>
        <a-button type="primary" @click="closeSignModal">取消</a-button>
        <a-button type="primary" @click="handleConfirm">确定</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script lang="ts">
  export default {
    name: 'ExecuteDailyTask',
  };
</script>
<script lang="ts" setup>
  import { useRoute } from 'vue-router';
  import FormRender from '@/components/form-design/components/FormRender.vue';
  import { useFormRender } from '@/views/risk/gradedControl/composition/useFormRender';
  import { useRouter } from 'vue-router';
  import { computed, onBeforeMount, reactive, ref } from 'vue';
  import { formatDate } from '@/utils/utils';

  import {
    checkPlanDetailForm,
    checkPlanDetailForms,
    dailyCheckExecute,
    getDailyCheckDetail,
    pitfallAdd,
    pitfallAddOne,
  } from '@/api/pitfall';
  import { Message } from '@arco-design/web-vue';
  import { useSign } from '../snapshot/composition/useSign';

  const route = useRoute();
  const router = useRouter();
  const {
    checkTableIds,
    type = 'detail',
    taskType,
    taskId,
    taskName,
    checkPerson,
    checkPersonId,
    id,
  } = route.query;

  const hasNotData = computed(() => {
    return !checkTableIds;
  });

  let checkStartTime: string | undefined = undefined;

  const handleClick = () => {
    if (!checkStartTime) {
      checkStartTime = formatDate(new Date());
    }
  };

  const form = ref<any>(null);

  const checkListAll = ref<any>({});
  const checkItemList = ref<any>({});
  const checkListMap = ref<Map<string, any>>(new Map());

  // const formLists = ref<any[]>([]);

  const getContentData = async () => {
    let data: any = {};
    if (type !== 'detail') {
      if (hasNotData.value) return;
      // const res = await checkPlanDetailForm(
      //   taskType as string,
      //   checkTableIds as string[]
      // );
      const res = await checkPlanDetailForms(taskId as string);
      data = res.data;
    } else {
      const res = await getDailyCheckDetail(id as string);
      data = [res.data];
    }
    checkListAll.value = data;
    generateCheckList(data);
  };

  const generateCheckList = (data: any[], needFilter: boolean = false) => {
    if (checkListMap.value.has(activeKey.value)) {
      checkItemList.value = checkListMap.value.get(activeKey.value);
      return;
    }
    const result: any = {};
    const obj = {
      all: '全部',
      1: '合格',
      2: '不合格',
    };
    if (!needFilter) {
      allCount.value = 0;
      qualifiedCount.value = 0;
      unqualifiedCount.value = 0;
    }
    for (let i = 0; i < data.length; i++) {
      const resFormList = data[i].formList;
      resFormList.forEach((item: any) => {
        const formItem = JSON.parse(item.formItems).design;
        const formRender = useFormRender(formItem);
        if (
          needFilter &&
          activeKey.value !== 'all' &&
          formRender.formData.field_isQualified !==
            obj[activeKey.value as keyof typeof obj]
        ) {
          return;
        }
        if (result[item.checkItem]) {
          // 如果result中已经有了这个id,则不加入进去
          // if (
          //   result[item.checkItem].some(
          //     (ele: any) => ele.id === formItem.formId
          //   )
          // )
          //   return;
          result[item.checkItem].push({
            id: item.checkContentId,
            checkContentId: item.checkContentId,
            checkStandard: item.checkStandard,
            problemSpot: item.problemSpot,
            checkItem: item.checkItem,
            design: formItem,
            formRenderData: formRender.formData,
            formsTemp: formRender.formsTemp,
            formConfigTemp: formRender.formConfigTemp,
          });
        } else {
          result[item.checkItem] = [
            {
              id: item.checkContentId,
              checkContentId: item.checkContentId,
              checkStandard: item.checkStandard,
              problemSpot: item.problemSpot,
              checkItem: item.checkItem,
              design: formItem,
              formRenderData: formRender.formData,
              formsTemp: formRender.formsTemp,
              formConfigTemp: formRender.formConfigTemp,
            },
          ];
        }
        if (!needFilter) {
          allCount.value++;
          if (formRender.formData.field_isQualified === '合格') {
            qualifiedCount.value++;
          } else if (formRender.formData.field_isQualified === '不合格') {
            unqualifiedCount.value++;
          }
        }
      });
    }
    checkListMap.value.set(activeKey.value, result);
    checkItemList.value = result;
  };

  onBeforeMount(() => {
    getContentData();
  });

  const allCount = ref(0);
  const qualifiedCount = ref(0);
  const unqualifiedCount = ref(0);
  const tabsList = reactive([
    { code: 'all', name: '全部', count: computed(() => allCount.value) },
    { code: '1', name: '合格', count: computed(() => qualifiedCount.value) },
    {
      code: '2',
      name: '不合格',
      count: computed(() => unqualifiedCount.value),
    },
  ]);
  const activeKey = ref('all');
  const tabChange = (key: any) => {
    activeKey.value = key;
    generateCheckList(checkListAll.value, true);
  };

  const handleSave = async () => {
    if (form.value && form.value.length) {
      let formList = form.value.map((f: any) => {
        // if (!f.modelValue.field_isQualified) {
        //   return;
        // }
        return f.validate();
      });
      Promise.all(formList)
        .then(() => {
          openSignModal();
          // saveData();
        })
        .catch(() => {});
    }
  };

  const saveData = async () => {
    const keys = Object.keys(checkItemList.value);
    const formLists: any[] = [];
    for (const item of keys) {
      formLists.push(...checkItemList.value[item]);
    }
    // 调接口保存
    const params: any = formLists.map((ele: any, index: number) => {
      const design = {
        settings: ele.design.settings,
        logo: ele.design.logo,
        process: ele.design.process,
        remark: ele.design.remark,
        formName: ele.design.formName,
        formId: ele.design.formId,
        formItems: ele.formsTemp,
        formConfig: ele.formConfigTemp,
        formData: ele.formRenderData,
      };
      const qualifyObj = {
        不合格: 0,
        合格: 1,
        不涉及: 2,
      };
      return {
        taskId,
        taskName,
        checkItem: ele.checkItem,
        checkContentId: ele.checkContentId,
        checkStartTime: checkStartTime,
        checkStandard: ele.checkStandard,
        isQualified:
          qualifyObj[
            ele.formRenderData.field_isQualified as keyof typeof qualifyObj
          ],
        formItems: JSON.stringify({ design }),
        sign: index === 0 ? taskSign.value : undefined,
      };
    });
    const unchecked: any = formLists
      .filter((ele: any) => {
        return ele.formRenderData.field_isQualified === '不合格';
      })
      .map((ele: any) => {
        const rectifyFlag =
          ele.formRenderData.field_rectifyFlag === '立即整改' ? 1 : 0;
        return {
          taskId,
          taskName,
          dangerSourceCode: type === 'dailyExecute' ? '2' : '3',
          hazardDesc: ele.formRenderData.field_hazardDesc,
          hazardAddr: ele.formRenderData.field_hazardAddr,
          sceneImages: ele.formRenderData.field_sceneImages
            ? ele.formRenderData.field_sceneImages.map((item: any) => {
                return {
                  fileUrl: item.sourceUrl,
                  postUrl: item.url,
                  fileType: item.fileType,
                };
              })
            : [],
          hidRiskLevelCode:
            ele.formRenderData.field_hidRiskLevelCode === '一般隐患'
              ? '2'
              : '1',
          dangerLevelCode:
            ele.formRenderData.field_hidRiskLevelCode === '一般隐患'
              ? '2'
              : '1',
          rectifyTime: ele.formRenderData.field_rectifyTime + ':00',
          prefillRectifyId: ele.formRenderData.field_rectifyPerson[0].id,
          prefillCheckAcceptId:
            ele.formRenderData.field_checkAcceptPerson[0].id,
          prefillVerifierId: ele.formRenderData.field_verifierPerson
            ? ele.formRenderData.field_verifierPerson[0].id
            : '',
          rectifyAdvise: ele.formRenderData.field_rectifyAdvise,
          dangerStateCode: rectifyFlag ? '7' : '3',
          inspectorName: checkPerson,
          inspectorId: checkPersonId,
          inspectTime: checkStartTime,
          confirmId: checkPersonId,
          confirmName: checkPerson,
          checkItem: ele.checkItem,
          problemSpot: ele.problemSpot,
          checkStandard: ele.checkStandard,
          rectifyFlag: rectifyFlag,
          rectifyImages: rectifyFlag
            ? (ele.formRenderData.field_rectifyImages || []).map(
                (item: any) => {
                  return {
                    fileUrl: item.url,
                    postUrl: item.postUrl,
                    fileType: item.fileType,
                  };
                }
              )
            : undefined,
          rectifySituation: rectifyFlag
            ? ele.formRenderData.field_rectifySituation
            : undefined,
        };
      });
    await dailyCheckExecute(params);
    if (unchecked.length > 0) {
      await pitfallAddOne(unchecked);
    }
    Message.success({
      content: '保存成功',
    });
    goBack();
  };

  const goBack = () => {
    router.back();
  };

  const signRef = ref<HTMLCanvasElement | null>(null); // 签名画布Refc
  const {
    signModalVisible,
    openSignModal,
    closeSignModal,
    clearSign,
    confirmSign,
  } = useSign(signRef);
  const taskSign = ref('');
  const handleConfirm = () => {
    taskSign.value = confirmSign();
    if (!taskSign.value) {
      Message.warning('请完成签名');
      return;
    }
    saveData();
  };
</script>
<style lang="less" scoped>
  .arco-card.content-card {
    overflow: hidden;

    .header {
      font-size: 18px;
      margin-bottom: 30px;

      .title {
        margin-left: 8px;
      }
    }

    .content-card-form {
      min-height: 595px;
      margin-left: 10%;
      margin-bottom: 20px;
      :deep(.arco-tabs-nav-type-card-gutter) {
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

      :deep(.card-display-content) {
        width: 100%;
        height: 100%;

        .content-items div {
          line-height: 42px;
        }
      }

      .check-item {
        font-size: 16px;
      }

      .check-item + .check-item {
        margin-top: 20px;
      }

      .item-slot {
        margin-top: 20px;
        box-shadow: 0px 0px 7px -3px rgba(0, 0, 0, 0.5);
        border-bottom: 1px solid var(--bg4);
        border-radius: 10px;
        width: 80%;

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
      margin-top: 20px;
      text-align: center;

      button + button {
        margin-left: 12px;
      }
    }
    .no-data {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      img {
        height: 25vw;
        width: 25vw;
      }
    }
  }
  .sign-container {
    display: flex;
    flex-direction: column;
    align-items: flex-start;

    img {
      width: 200px;
      height: 100px;
    }
  }

  .sign-modal-footer {
    text-align: right;

    button {
      margin-left: 20px;
    }
  }

  .sign-img {
    border: 1px solid #999999;
    width: 200px;
    height: 100px;
    object-fit: fill;
    background-color: #ffffff;
  }
</style>
