<template>
  <div class="emergency-resource-container">
    <div class="search">
      <a-input
        v-model="searchValue"
        placeholder="请输入物资名称/物资类型"
        allow-clear
      ></a-input>
      <a-button type="primary" @click="search">搜索</a-button>
    </div>
    <div class="supplies-content">
      <div class="grid">
        <div class="label">物资名称</div>
        <div class="label">物资类型</div>
        <div class="label">数量</div>
        <div class="label">存放地点</div>
      </div>
      <div class="table-value">
        <div class="grid" v-for="item in data" :key="item.id">
          <div class="content">{{ item.suppliesCodeName }}</div>
          <div class="content">{{ item.emergencySuppliesName }}</div>
          <div class="content">{{ item.number }}</div>
          <div class="content">{{ item.place }}</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { cloneDeep } from 'lodash';
  import { ref, toRef } from 'vue';

  const props = defineProps({
    data: {
      type: <any>Object,
      require: true,
    },
  });
  const allData = cloneDeep(props.data.suppliesDataList);
  const data = ref(allData);
  const searchValue = ref('');
  const search = () => {
    if (!searchValue.value) {
      data.value = allData;
    } else {
      data.value = allData.filter((item: any) => {
        return (
          item.suppliesCodeName.includes(searchValue.value) ||
          item.emergencySuppliesName.includes(searchValue.value)
        );
      });
    }
  };
</script>
<style lang="less" scoped>
  .emergency-resource-container {
    .search {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      :deep(.arco-input-wrapper) {
        width: 166px;
        background-color: transparent;
        color: #ffffff;
        border: 0.5px solid #2a82e4;
      }
      button {
        background-color: #2a82e4;
      }
    }
    .supplies-content {
      margin-top: 1rem;
      .grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.5rem;
        align-items: center;
        justify-content: center;
        padding: 0.71rem 1.07rem;
        .label {
          font-size: 0.86rem;
          font-weight: 700;
          letter-spacing: 0px;
          line-height: 0.86rem;
          color: rgba(48, 201, 201, 1);
          text-align: center;
        }
        .content {
          text-align: center;
        }
      }
      & > .grid {
        background-color: #0a1454;
      }
    }
    .table-value .grid {
      padding: 0.71rem 1.07rem;
      &:nth-of-type(2n + 2) {
        background-color: #0a1454;
      }
    }
  }
</style>
