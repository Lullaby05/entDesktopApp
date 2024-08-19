<template>
  <a-modal
    :width="width"
    title-align="start"
    :title="title"
    :visible="guideVisible"
    :footer="false"
    @cancel="guideVisible = false"
  >
    <div class="guide-content">
      <Steps v-if="guideVisible" :steps="guideItems" />
      <div
        :style="`--notLastRowHeight: calc(${notLastRowHeight}px + 2rem)`"
        class="division"
      >
      </div>
    </div>
    <div style="text-align: center">
      <a-button type="primary" @click="guideVisible = false">我知道了</a-button>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
  import Steps from './bendingStep.vue';
  const props = defineProps({
    title: {
      type: String,
      default: '',
    },
    visible: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '60vw',
    },
    guideItems: {
      type: Array<any>,
      default: () => [],
    },
  });

  const emit = defineEmits(['update:visible']);
  const guideVisible = computed<boolean>({
    set(val) {
      emit('update:visible', val);
    },
    get() {
      if (props.visible) {
        setTimeout(() => {
          const notLastRow = document.querySelector(
            '.guide-content .notLastRow'
          );
          if (notLastRow) {
            notLastRowHeight.value = notLastRow.clientHeight;
          }
        }, 100);
      }
      return props.visible;
    },
  });

  const notLastRowHeight = ref(0);

  onMounted(() => {
    setTimeout(() => {
      const notLastRow = document.querySelector('.guide-content .notLastRow');
      if (notLastRow) {
        const resizeObserver = new ResizeObserver((entries) => {
          for (let entry of entries) {
            notLastRowHeight.value = entry.contentRect.height;
          }
        });
        resizeObserver.observe(notLastRow);

        onBeforeUnmount(() => {
          resizeObserver.unobserve(notLastRow);
        });
      }
    }, 100);
  });
</script>
<style lang="less" scoped>
  .guide-content {
    padding: 10px;
    display: flex;
    // gap: 1rem;
    margin-bottom: 20px;
    position: relative;
    --notLastRowHeight: 13rem;
    .division {
      // position: absolute;
      flex: 0 0 auto;
      width: 100px; /* 设置宽度以便看到半圆 */
      height: var(--notLastRowHeight); /* 设置高度以便看到半圆 */
      &::before {
        content: '';
        position: absolute;
        right: 3rem;
        width: 100px; /* 设置宽度以便看到半圆 */
        height: var(--notLastRowHeight); /* 设置高度以便看到半圆 */
        // margin-right: auto;
        margin-top: 14px;
        border: 1px solid #357cf0; /* 设置边框为透明 */
        border-left: none;
        // border-bottom: none;
        border-right-color: #357cf0; /* 设置右边框的颜色 */
        border-top-right-radius: 100px; /* 设置右上角的半圆 */
        border-bottom-right-radius: 100px; /* 设置右下角的半圆 */
      }
    }
  }
</style>
