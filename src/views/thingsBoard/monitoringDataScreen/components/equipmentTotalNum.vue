<template>
  <div class="equipment-total-container">
    <div class="event-description"> 设备总数 </div>
    <div>
      <span class="event-num">{{ currentData || 0 }}</span>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, toRef } from 'vue';

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({
        typeGroup: [],
      }),
    },
  });

  const data = toRef(props, 'data');
  const currentData = computed<any>(() => {
    return data.value.all;
  });
</script>
<style lang="less" scoped>
  .equipment-total-container {
    flex: 0 0 auto;
    width: fit-content;
    height: fit-content;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-radius: 0.3rem;
    padding: 0.9rem 1.2rem;
    gap: 0.4rem;
    font-size: 1.14rem;
    margin-top: 0.3rem;
    color: #ffffff;
    .event-num {
      font-size: 2.14rem;
      font-weight: 700;
      color: #00ddff;
      font-family: 'Roboto';
    }
  }
</style>
