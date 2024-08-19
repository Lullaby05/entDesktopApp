<template>
  <div class="rehearsal-container">
    <div class="rehearsal-plan-num">
      <img src="/src/assets/images/drill-plan.png" alt="" />
      <div class="rehearsal-plan-content">
        <div class="rehearsal-plan-description"> 计划演练次数 </div>
        <div class="rehearsal-plan-plan-num">
          {{ currentData.total.count }}
        </div>
      </div>
    </div>
    <div class="rehearsed-num">
      <img src="/src/assets/images/record-drill.png" alt="" />
      <div class="rehearsal-content">
        <div class="rehearsal-description"> 已演练次数 </div>
        <div class="rehearsal-num"> {{ currentData.recordTotal.count }} </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, toRef } from 'vue';
  import { getArrByName, getCurrentByName } from './composition/useDataScreen';
  import { computed } from 'vue';

  const props = defineProps({
    data: {
      type: Array,
      default: () => [],
    },
  });

  const data = toRef(props, 'data');
  const currentData = computed<any>(() => {
    const curData = getArrByName(data.value, [
      'drillPlanCount',
      'drillRecordCount',
    ]);
    return {
      total: getCurrentByName(curData, 'drillPlanCount'),
      recordTotal: getCurrentByName(curData, 'drillRecordCount'),
    };
  });
</script>
<style lang="less" scoped>
  .rehearsal-container {
    width: fit-content;
    height: fit-content;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.14rem;
    gap: 4.43rem;
    color: #e6f7ff;
    img {
      height: 5.29rem;
      object-fit: cover;
    }
    .rehearsal-plan-plan-num {
      color: #00ddff;
      font-size: 2.14rem;
    }
    .rehearsal-plan-num,
    .rehearsed-num {
      display: flex;
      align-items: center;
      gap: 1.43rem;
    }
    .rehearsal-num {
      color: #41e4bb;
      font-size: 2.14rem;
    }
    .rehearsal-plan-content,
    .rehearsal-content {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
    }
  }
</style>
