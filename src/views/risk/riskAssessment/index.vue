<!-- 风险管控：风险评估方法设置 -->
<template>
  <div class="container">
    <a-card class="content-card">
      <div class="method-choose">
        <div class="label">方法设置：</div>
        <div class="value">
          <a-radio-group
            v-model="riskAssess.riskAssessCode"
            @change="methodChange"
          >
            <a-radio v-for="(value, key) of assessmentMethodsMenu" :value="key">
              {{ value }}
            </a-radio>
          </a-radio-group>
        </div>
        <div class="btn">
          <a-space>
            <a-button
              v-permission="'RiskAssessmentSet'"
              type="primary"
              @click="submit"
              >保存</a-button
            >
          </a-space>
        </div>
      </div>

      <LS
        v-show="riskAssess.riskAssessCode === 'LS'"
        :LData="methodData.L"
        :SData="methodData.S"
        :LSLever="methodLever"
      ></LS>
      <LEC
        v-show="riskAssess.riskAssessCode === 'LEC'"
        :LECLever="methodLever"
        :LData="methodData.L"
        :EData="methodData.E"
        :CData="methodData.C"
      ></LEC>
      <MES
        v-show="riskAssess.riskAssessCode === 'MES'"
        :MESLever="methodLever"
        :MData="methodData.M"
        :EData="methodData.E"
        :SData="methodData.S"
      ></MES>
      <div
        v-if="riskAssess.riskAssessCode === 'notSet'"
        class="no-selected-contain"
      >
        <img src="@/assets/images/un-selected.png" alt="" />
        <span>未设置风险评估方法，请先选择上面选项设置风险评估方法</span>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
  import { ref } from 'vue';
  import { useUserStore } from '@/store';
  import { Message, Modal } from '@arco-design/web-vue';
  import { getMapDictionaryAPI } from '@/api/index';
  import {
    setRiskAssessmentMethodAPI,
    getRiskAssessmentMethodAPI,
  } from '@/api/risk';
  import { useRoute, useRouter } from 'vue-router';
  import { cloneDeep } from 'lodash';
  import MES from './components/MES.vue';
  import LEC from './components/LEC.vue';
  import LS from './components/LS.vue';

  export default {
    name: 'RiskAssessment',
  };
</script>

<script lang="ts" setup>
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const riskAssess = ref({
    riskAssessCode: '',
    id: '',
    riskAssessType: '',
    enterpriseId: userStore.userInfo.enterpriseId as string,
    tenantId: userStore.tenantId as string,
    tenantNo: '',
  });
  const assessmentMethodsMenu = ref<any>({});
  const methodData = ref<any>({});
  const methodLever = ref<any>([]);

  const getAssessmentMethodMenu = async () => {
    const { data } = await getMapDictionaryAPI('risk_assess_type');
    assessmentMethodsMenu.value = data;
    await getEnterpriseMethod();
    methodChange(riskAssess.value.riskAssessCode);
  };

  const cloneRiskAccessCode = ref('');
  const getEnterpriseMethod = async () => {
    const { data } = await getRiskAssessmentMethodAPI({
      id: userStore.userInfo.enterpriseId as string,
    });
    if (!data) {
      riskAssess.value.riskAssessCode = 'notSet';
      return;
    }
    riskAssess.value = data;
    cloneRiskAccessCode.value = cloneDeep(riskAssess.value.riskAssessCode);
  };

  const getMethodData = async (methodName: string) => {
    // 根据方法名 切割传参 请求方法描述信息与分值
    const codeList = methodName.split('');
    codeList.forEach(async (name) => {
      const code = methodName + '_' + name;
      const { data } = await getMapDictionaryAPI(code);
      const arr: any[] = [];
      for (const key in data) {
        const listItem: { record?: number; info?: string } = {};
        listItem.record = +key;
        listItem.info = data[key];
        arr.push(listItem);
      }
      methodData.value[name as keyof typeof methodData.value] = arr.sort(
        (a, b) => a.record - b.record
      );
    });

    // 请求方法等级
    const { data: res } = await getMapDictionaryAPI(methodName + '_D');

    for (const key in res) {
      const leverItem: { record: string[]; lever?: string; color?: {} } = {
        record: [],
      };
      leverItem.record = res[key].split('-');
      leverItem.lever = key;
      switch (leverItem.lever) {
        case '重大风险':
          leverItem.color = { style: 'red', text: '红' };
          break;
        case '较大风险':
          leverItem.color = { style: 'orange', text: '橙' };
          break;
        case '一般风险':
          leverItem.color = { style: 'yellow', text: '黄' };
          break;
        case '低风险':
          leverItem.color = { style: 'blue', text: '蓝' };
          break;
        default:
          break;
      }
      methodLever.value.push(leverItem);
    }
  };

  const methodChange = (value: string | number | boolean) => {
    methodData.value = {};
    methodLever.value = [];
    riskAssess.value.riskAssessType =
      assessmentMethodsMenu.value[
        value as keyof typeof assessmentMethodsMenu.value
      ];
    getMethodData(value as string);
  };

  getAssessmentMethodMenu();

  const submit = async () => {
    if (riskAssess.value.riskAssessCode === 'notSet') {
      return;
    }
    await setRiskAssessmentMethodAPI(riskAssess.value);

    Message.success({
      content: '设置成功',
    });

    router.push({
      name: route.query.pageName as string,
    });
  };
  onBeforeRouteLeave((to, from, next) => {
    if (
      riskAssess.value.riskAssessCode !== 'notSet' &&
      cloneRiskAccessCode.value !== riskAssess.value.riskAssessCode
    ) {
      Modal.confirm({
        content: '当前页面有未保存的内容，是否确认离开？',
        onOk: () => {
          next();
        },
        onCancel: () => {
          next(false);
        },
      });
    } else {
      next();
    }
  });
</script>

<style lang="less" scoped>
  .arco-card.content-card {
    position: relative;
    .method-choose {
      display: flex;
      align-items: center;
      margin-bottom: 20px;
      .label {
        width: 140px;
        margin-right: 10px;
        text-align: right;
        font-size: 15px;
        font-weight: 700;
      }
      .value {
        display: flex;
        align-items: center;
        width: 700px;
      }
    }
    .no-selected-contain {
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      position: absolute;
      // margin-top: 50px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      align-items: center;
      font-size: 24px;
      img {
        height: 45vh;
      }
    }
  }
</style>
