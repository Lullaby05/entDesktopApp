<template>
  <div class="operation-detail-situation-container">
    <div class="title">{{ props.title }}</div>
    <div class="table-content">
      <eventLevelRate :data="data" type="rate" />
    </div>
    <icon-reply class="icon-reply" @click="handleBackDataRundown" />
  </div>
</template>
<script lang="ts" setup>
  import eventLevelRate from './eventLevelRate.vue';

  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    data: {
      type: Object,
      default: () => {},
    },
    type: {
      type: String,
      default: '',
    },
  });

  const data = computed(() => ({ eventLevelDistribution: props.data }));

  const emits = defineEmits(['handleBackDataRundown']);
  const handleBackDataRundown = () => {
    emits('handleBackDataRundown');
  };
</script>
<style lang="less" scoped>
  .operation-detail-situation-container {
    width: 100%;
    height: 100%;
    position: relative;
    .title {
      position: absolute;
      top: 0.5rem;
      font-size: 1rem;
      color: #ffffff;
    }
    .table-content {
      margin-top: 1rem;
      height: 100%;
    }
    .icon-reply {
      position: absolute;
      top: 0.5rem;
      right: 0.5rem;
      font-size: 1.5rem;
      color: #ffffff;
      cursor: pointer;
    }
  }
</style>
