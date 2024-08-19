<template>
  <span
    class="arco-tag arco-tag-size-medium arco-tag-checked"
    style="-webkit-app-region: no-drag; text-align: left"
  >
    <span class="tag-link" @click="tagChange(itemData)" style="cursor: pointer">
      <i :class="`iconfont ${itemData.icon}`"></i>
      {{ $t(itemData.name) }}
    </span>
    <span
      v-if="index !== 0"
      class="arco-icon-hover arco-tag-icon-hover arco-icon-hover-size-medium arco-tag-close-btn"
    >
      <icon-close @click="closeTab(itemData)" size="14" />
    </span>
  </span>
</template>

<script lang="ts" setup>
  defineProps({
    itemData: {
      type: Object,
      default() {
        return {
          key: 'nokey',
          name: '默认',
          route: '/dashboard/workplace',
        };
      },
    },
    index: {
      type: Number,
      default: 0,
    },
  });
  const emit = defineEmits(['closeTab', 'tagChange']);
  const closeTab = (tab: any) => {
    emit('closeTab', tab);
  };

  const tagChange = (tab: any) => {
    emit('tagChange', tab);
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

  .tag-link {
    margin-right: 10px;
    letter-spacing: 2px;
    font-family: 'Alibaba-Medium';
    font-size: 12px;
    max-width: var(--linkMaxWidth);
    overflow: hidden;
  }
  .arco-tag-close-btn {
    flex: 0 0 auto;
  }
  .tag {
    width: 100px;
  }
  :deep(.iconfont) {
    font-size: 13px;
  }
</style>
