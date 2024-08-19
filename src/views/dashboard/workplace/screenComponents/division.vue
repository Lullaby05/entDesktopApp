<template>
  <div
    class="division-container"
    :style="{
      backgroundColor: props.color,
      width: props.width,
      height: props.height,
    }"
  >
  </div>
</template>

<script lang="ts" setup>
  const props = defineProps({
    color: {
      type: String,
      default: '#ffffff',
    },
    width: {
      type: String,
      default: '1px',
    },
    height: {
      type: String,
      default: '100%',
    },
  });
</script>
<style lang="less" scoped></style>
