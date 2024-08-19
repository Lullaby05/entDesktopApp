<template>
  <div class="event-container">
    <div class="event-description"> 现存事件数 </div>
    <div class="event-num"> {{ currentData || 0 }} </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, toRef } from 'vue';

  const props = defineProps({
    data: {
      type: Object,
      default: () => [],
    },
  });

  const data = toRef(props, 'data');
  const currentData = computed<any>(() => {
    return data.value.reduce((prev: number, cur: any) => {
      return prev + cur.num;
    }, 0);
  });
</script>
<style lang="less" scoped>
  .event-container {
    flex: 0 0 auto;
    width: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 0.3rem;
    // border: 0.1rem solid #000000;
    padding: 0.4rem 1.1rem;
    gap: 0.4rem;
    font-size: 1.14rem;
    margin-top: 1.1rem;
    color: #ffffff;
    .event-num {
      font-size: 2.14rem;
      font-weight: 700;
      color: #ee3e3e;
      font-family: 'Roboto';
    }
  }
</style>
