<template>
  <div
    class="data-block-container"
    :style="{
      width: props.width,
      height: props.height,
    }"
  >
    <div class="data-block-title" v-if="!slotTitle && props.title">
      <div class="title">{{ props.title }}</div>
    </div>
    <div class="data-block-title" v-if="slotTitle">
      <slot name="title" />
    </div>
    <div class="data-block-content" :style="{ padding: props.padding }">
      <slot />
    </div>
    <div class="block left-top"></div>
    <div class="block right-top"></div>
    <div class="block left-bottom"></div>
    <div class="block right-bottom"></div>
  </div>
</template>
<script lang="ts" setup>
  const props = defineProps({
    title: {
      type: String,
      required: true,
    },
    width: {
      type: String,
    },
    height: {
      type: String,
    },
    padding: {
      type: String,
    },
  });

  // 判断是否有slot
  const slotTitle = useSlots().title;
</script>
<style lang="less" scoped>
  .data-block-container {
    padding: 0.79rem 1.29rem 0 1.43rem;
    background: rgba(14, 22, 95, 0.4);
    border: 0.5px solid rgba(14, 101, 187, 0.66);
    position: relative;
    box-sizing: border-box;
    .block {
      position: absolute;
      width: 0.36rem;
      height: 0.36rem;
      background: rgba(0, 221, 255, 1);
      &.left-top {
        top: 0;
        left: 0;
      }
      &.right-top {
        top: 0;
        right: 0;
      }
      &.left-bottom {
        left: 0;
        bottom: 0;
      }
      &.right-bottom {
        right: 0;
        bottom: 0;
      }
    }
    .data-block-title {
      border-bottom: 1px solid #144583;
      position: relative;
      width: 100%;
      &::before {
        margin-top: 0.36rem;
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 4.75rem;
        height: 2px;
        background: rgba(45, 153, 255, 1);
      }
      .title {
        font-family: '优设标题黑';
        font-size: 1.43rem;
        font-weight: 400;
        line-height: 1.79rem;
        letter-spacing: -0.02rem;
        color: #ffffff;
        text-align: left;
        vertical-align: top;
      }
    }
    .data-block-content {
      position: absolute;
      width: 100%;
      height: 100%;
      inset: 0;
      padding: 0.79rem 1.29rem 0 1.43rem;
      // padding-top: 2.15rem;
    }
  }
</style>
