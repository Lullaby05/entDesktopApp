<template>
  <div class="legend-container">
    <div class="legend-title" v-if="props.title">{{ props.title }}</div>
    <div class="legend-item" v-for="(item, index) in data" :key="index">
      <div class="color-block" :style="{ background: item.color }"></div>
      <div class="item-name">{{ item.name }}</div>
      <div class="item-data">{{ item.data }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { toRef } from 'vue';

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    data: {
      type: <any>Array,
      default: () => [
        {
          color:
            'linear-gradient(270deg, rgba(212, 48, 48, 0.35) 0%, rgba(255, 87, 51, 1) 100%)',
          name: '应急事件',
          data: '18',
        },
        {
          color:
            'linear-gradient(270deg, rgba(255, 141, 26, 0.35) 0%, rgba(255, 141, 26, 1) 100%)',
          name: '隐患',
          data: '7',
        },
        {
          color:
            'linear-gradient(270deg, rgba(255, 195, 0, 0.35) 0%, rgba(255, 195, 0, 1) 100%)',
          name: '设备故障',
          data: '2',
        },
      ],
    },
  });
  const data = toRef(props, 'data');
</script>
<style lang="less" scoped>
  .legend-container {
    position: absolute;
    bottom: 0;
    right: 0;
    height: fit-content;
    width: fit-content;
    border-radius: 4px;
    padding: 0.71rem;
    background: linear-gradient(
      180deg,
      rgba(4, 60, 149, 1) 0%,
      rgba(4, 33, 68, 0.74) 14.22%,
      rgba(4, 23, 62, 0.8) 51.46%,
      rgba(7, 45, 94, 0.77) 87.86%,
      rgba(4, 62, 151, 1) 100%
    );
    border: 0.5px solid rgba(48, 97, 219, 1);
    box-shadow: 0px 0px 3px rgba(3, 255, 246, 0.34);
    filter: backdrop(0px 0px 3px rgba(3, 255, 246, 0.34));
    .legend-title {
      font-size: 1rem;
      font-weight: 700;
      line-height: 1rem;
      color: rgba(255, 255, 255, 1);
      text-align: left;
      font-family: 'Roboto';
      margin-bottom: 0.71rem;
    }
    .legend-item + .legend-item {
      margin-top: 1.07rem;
    }
    .legend-item {
      display: flex;
      align-items: center;
      color: #ffffff;
      font-size: 0.86rem;
      font-weight: 400;
      width: 6.77vw;
      .color-block {
        width: 0.71rem;
        height: 0.71rem;
        margin-right: 0.57rem;
      }
      .item-data {
        margin-left: auto;
      }
    }
  }
</style>
