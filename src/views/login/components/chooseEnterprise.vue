<template>
  <div class="choose-enterprise-container">
    <div class="choose-content">
      <div
        class="enterprise-item"
        :class="
          selectEnterprise &&
          selectEnterprise.enterpriseId === item.enterpriseId
            ? 'active'
            : ''
        "
        v-for="item in enterpriseList"
        :key="item.enterpriseId"
        @click="changeEnterprise(item)"
      >
        <div class="enterprise-name">
          {{ item.companyName }}
        </div>
        <div class="user-info">
          <span>{{ item.nickname }}</span>
          <span>{{ item.deptName }}</span>
        </div>
      </div>
    </div>
    <div class="btn-group">
      <a-button @click="cancel">取消</a-button>
      <a-button type="primary" @click="confirm">进入</a-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { Message } from '@arco-design/web-vue';
  import { computed, toRef } from 'vue';

  const props = defineProps({
    enterpriseList: {
      type: Array<any>,
      default: () => [],
    },
    selectEnterprise: {
      type: Object,
      default: () => ({}),
    },
  });

  const emits = defineEmits(['cancel', 'confirm', 'update:selectEnterprise']);

  const enterpriseList = toRef(props, 'enterpriseList');

  const selectEnterprise = computed({
    get() {
      return props.selectEnterprise;
    },
    set(val: any) {
      emits('update:selectEnterprise', val);
    },
  });

  const changeEnterprise = (item: any) => {
    selectEnterprise.value = item;
  };

  const cancel = () => {
    emits('cancel');
  };

  const confirm = () => {
    if (!selectEnterprise.value.enterpriseId) {
      Message.warning('请先选择进入身份');
      return;
    }
    emits('confirm');
  };
</script>
<style lang="less" scoped>
  .choose-enterprise-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    height: 100%;
    app-region: no-drag;
    --webket-app-region: no-drag;
    width: fit-content;
    margin: 0 auto;
    .choose-content {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      overflow: auto;
      height: 100%;
      gap: 15px;
      .enterprise-item {
        cursor: pointer;
        width: 540px;
        // margin: 10px;
        margin: 3px 3px;
        padding: 16px;
        border-radius: 10px;
        box-shadow: 0px 0px 7px -3px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        background-color: var(--bg2);
        .enterprise-name {
          color: var(--color-text-grey3);
          font-family: 'Alibaba-Medium';
        }
        .user-info {
          color: var(--color-text-grey3);
          font-weight: 400;
          font-family: 'Alibaba';
          display: flex;
          align-items: center;
          gap: 10px;
        }
      }
      .active {
        background-color: var(--color-bg-active1);
        .enterprise-name {
          color: var(--color-text-black);
        }
        .user-info {
          color: var(--color-text-black);
        }
      }
    }
    .btn-group {
      padding-top: 20px;
      flex: 0 0 auto;
      display: flex;
      justify-content: center;
      width: 100%;
      gap: 20px;
    }
  }
</style>
