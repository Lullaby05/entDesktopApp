<template>
  <div class="control-measure-container">
    <div class="control-measure-description">
      {{ $t('dashboard.controlMeasureCount') }}
    </div>
    <div class="control-measure-num"> {{ currentData || 0 }} </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, toRef } from 'vue';

  const props = defineProps({
    data: {
      type: Object,
      default: () => {},
    },
  });

  const data = toRef(props, 'data');
  const currentData = computed<any>(() => {
    return (
      data.value['dangerCount'] && data.value['dangerCount'].controlMeasureNum
    );
  });
</script>
<style lang="less" scoped>
  .control-measure-container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    color: #ffffff;
    gap: 0.64rem;
    line-height: 1;
    .control-measure-description {
      font-size: 0.85rem;
      font-family: 'Alibaba';
      font-weight: 400;
      color: var(--color-text-grey);
    }
    .control-measure-num {
      font-size: 1.43rem;
      font-family: 'Roboto';
      color: var(--color-blue);
      font-weight: 700;
    }
  }
</style>
