<template>
  <div class="confirm-container">
    <IconExclamationCircleFill :style="props.style" style="flex: 0 0 auto" />
    <div>
      <div class="text">
        <span class="name">{{ props.info }}</span>
      </div>
      <div
        class="detail"
        v-if="props.detailTitle"
        v-for="(item, index) in props.detailContent"
      >
        <div class="detail-title">{{ props.detailTitle[index] }}</div>
        <div class="detail-description">{{ item }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  const props = defineProps({
    info: {
      type: String,
      default: '',
    },
    style: {
      type: String,
      default: 'color: #e6a23c;fontSize: 30px',
    },
    detailTitle: {
      type: Array<string>,
      default: () => [],
    },
    detailContent: {
      type: Array<string>,
      default: () => [],
    },
  });
</script>
<style lang="less" scoped>
  .confirm-container {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    gap: 12px;
    line-height: 24px;
  }

  .text {
    font-size: 16px;
    font-family: 'Alibaba-Medium';
  }

  .name {
    color: rgb(var(--red-6));
    font-family: 'Alibaba-Medium';
  }
  .detail {
    margin-top: 12px;
    .detail-title {
      font-size: 15px;
      font-family: 'Alibaba-Medium';
    }
  }
</style>
