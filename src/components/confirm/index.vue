<template>
  <div class="confirm-modal-content">
    <div class="title">
      <IconExclamationCircleFill v-if="props.icon" :style="props.style" />
      <slot v-else></slot>
      <span class="text">
        <span v-if="props.content" v-html="props.content"></span>
        <span v-else-if="props.text">
          确认删除<span class="name">{{ props.text }}</span
          >吗？</span
        >
      </span>
    </div>
    <div class="info" v-if="props.info">{{ props.info }}</div>
  </div>
</template>

<script lang="ts">
  export default {};
</script>

<script lang="ts" setup>
  const props = defineProps({
    icon: {
      type: Boolean,
      default: true,
    },
    content: {
      type: String,
      default: '',
    },
    text: {
      type: String,
      default: '图片',
    },
    info: {
      type: String,
      default: '删除数据不可恢复，请谨慎操作！',
    },
    style: {
      type: String,
      default: 'color:#e6a23c;fontSize:30px;',
    },
  });
</script>

<style lang="less" scoped>
  .title {
    display: flex;
    align-items: center;

    .text {
      font-size: 16px;
      font-weight: 700;
      margin-left: 12px;
    }

    .name {
      margin: 0 8px;
      color: rgb(var(--red-6));
      font-weight: 700;
    }
  }

  .info {
    font-size: 14px;
    margin-left: 42px;
  }
</style>
