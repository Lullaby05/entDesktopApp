<template>
  <span
    class="arco-tag arco-tag-size-medium arco-tag-checked"
    style="-webkit-app-region: no-drag"
  >
    <span
      class="arco-icon-hover arco-tag-icon-hover arco-icon-hover-size-medium arco-tag-close-btn"
    >
      <IconPlus style="width: 32px" @click="addTabItemclick" />
    </span>
  </span>
</template>

<script lang="ts" setup>
  const addTabItemclick = () => {
    console.log('addTabItemclick');
  };
</script>

<style lang="less" scoped>
  .sperate-line {
    border-bottom: 1px solid var(--color-neutral-3);
  }

  .arco-tag-size-medium {
    height: 100% !important;
  }

  .arco-tag-checked {
    background-color: #fff0 !important;
  }
</style>
