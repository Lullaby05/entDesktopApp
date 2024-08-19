<template>
  <div class="banner">
    <div class="banner-inner">
      <div class="carousel-item">
        <!-- <img class="carousel-image" :src="name" /> -->
        <span class="title-img">安全生产数智化管理平台</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import name from './assets/name.png';
</script>

<style lang="less" scoped>
  .banner {
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff0;
    background-image: url('./assets/background.png');

    &-inner {
      flex: 1;
      height: 100%;
    }
  }
  .title-img {
    // width: 104px;
    font-family: '优设标题黑';
    font-weight: 400;
    font-size: 5rem;
    color: #ffffff;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }

  .carousel {
    height: 100%;

    &-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    &-image {
      width: 320px;
      margin-top: 30px;
    }
  }
</style>
