<template>
  <div class="bending-step-container">
    <!-- 按照列来进行渲染 -->
    <div
      :class="['column', { notLastRow: index !== stepsArr.length - 1 }]"
      v-for="(item, index) in stepsArr"
      :key="index"
    >
      <a-steps label-placement="vertical">
        <a-step
          v-for="step in item"
          :key="step.index"
          :description="step.description"
          status="process"
        >
          <template #icon> {{ step.index }} </template>{{ step.title }}</a-step
        >
      </a-steps>
      <!-- 构造一条线来连接两行，如果是最后一行则没有线 -->
    </div>
  </div>
</template>
<script lang="ts" setup>
  const props = defineProps({
    steps: {
      type: Array<any>,
      default: () => [],
    },
  });
  const steps = computed(() => {
    return props.steps.map((ele, index) => ({ ...ele, index: index + 1 }));
  });
  // 处理数组
  const stepsArr = computed(() => {
    const arr: any = [];
    // 单数行是三个一组，双数行是四个一组
    for (let i = 0; i < steps.value.length; ) {
      if (i % 2 === 0) {
        arr.push(steps.value.slice(i, i + 3));
        i += 3;
      } else {
        arr.push(steps.value.slice(i, i + 4).reverse());
        i += 4;
      }
    }
    return arr;
  });
</script>
<style lang="less" scoped>
  .bending-step-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 2rem;
    :deep(.arco-steps-item-tail) {
      --color-neutral-3: #357cf0;
    }
  }
</style>
