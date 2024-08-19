<template>
  <div class="season-event-num-container">
    <div class="event-description"> 季度事件数 </div>
    <div>
      <span class="event-num">{{ currentData || 0 }}</span> 个
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, toRef } from 'vue';

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({
        timeSegmentNumber: [],
      }),
    },
  });

  const data = toRef(props, 'data');
  const currentData = computed<any>(() => {
    const result =
      data.value.timeSegmentNumber &&
      data.value.timeSegmentNumber.find((item: any) => item.type === 'QUARTER');
    return result ? result.count : 0;
  });
</script>
<style lang="less" scoped>
  .season-event-num-container {
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
    .event-num {
      font-size: 2.14rem;
      font-weight: 700;
      color: #00ddff;
      font-family: 'Roboto';
    }
  }
</style>
