<template>
  <div
    class="transition"
    :class="{
      'left-side': true,
      'margin': appStore.isPadding,
    }"
  >
    <!-- <img alt="logo" src="../../assets/image/logo-inswin.png" class="logo-img" /> -->
    <img alt="logo" src="../../assets/image/logo-xkr.png" class="logo-img" />
    <!-- <img alt="title" src="../../assets/image/title-xkr.png" class="title-img" /> -->
    <span class="title-img">安全生产数智化管理平台</span>
    <!-- <a-typography-title :style="{ margin: 0, fontSize: '20px' }" :heading="5">
      安全预警智能工具
    </a-typography-title> -->
  </div>
</template>

<script lang="ts" setup>
  import { useAppStore } from '@/store';

  const appStore = useAppStore();
</script>

<style lang="less" scoped>
  .left-side {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 210px;
    gap: 10px;
    margin-left: 40px;
    // padding-bottom: 10px;

    img {
      // padding: 10px;
    }

    .title-img {
      // width: 104px;
      font-family: '优设标题黑';
      font-weight: 400;
      font-size: 1rem;
      color: var(--color-blue);
    }
    .logo-img {
      width: 100px;
      height: 60px;
    }
    .hide {
      opacity: 0;
    }

    h5.arco-typography {
      color: #666;
      font-weight: 700;
      line-height: 28px;
      text-align: center;
    }
  }
  .transition {
    transition: opacity 0.3s;
  }
  .margin {
    margin-left: 0px !important;
  }
  .show-logo {
    opacity: 0;
  }
</style>
