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
      <div class="step-item" v-for="(item, index) in guideItems" :key="index">
        <div class="number">{{ index + 1 }}</div>
        <div class="icon">
          <i :class="['iconfont', item.img]"></i>
        </div>
        <div class="title">{{ item.title }}</div>
        <div class="description">
          <span>{{ item.description }}</span>
          <span
            style="color: #357cf0; cursor: pointer"
            v-if="item.description1"
            @click="item.onclick"
            >{{ item.description1 }}</span
          >
        </div>
      </div>
    </div>
    <div style="text-align: center">
      <a-button type="primary" @click="guideVisible = false">我知道了</a-button>
    </div>
  </a-modal>
</template>
<script lang="ts" setup>
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
      default: '50vw',
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
      return props.visible;
    },
  });
</script>
<style lang="less" scoped>
  .guide-content {
    display: flex;
    gap: 1rem;
    margin-bottom: 20px;
    .step-item {
      background-color: #f7fcff;
      padding: 30px;
      overflow: hidden;
      .number {
        font-style: italic;
        color: #357cf0;
        font-size: 20px;
      }
      .title {
        font-family: 'Alibaba-Medium';
        font-size: 16px;
        margin-bottom: 1rem;
      }
      .icon {
        text-align: center;
        .iconfont {
          font-size: 106px;
          color: #357cf0;
        }
      }
    }
  }
</style>
<style lang="less">
  .arco-modal-container .arco-modal-header {
    // background-color: var(--bg2);
  }
</style>
