<template>
  <div class="no-permission-container">
    <img
      class="no-workplace-img"
      src="/src/assets/images/no-workplace.png"
      alt=""
    />
    <div class="no-permission-text">暂无权限，请联系管理员添加权限</div>
  </div>
</template>
<script lang="ts" setup></script>
<style lang="less" scoped>
  .no-permission-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 100px;
    height: 100%;
    width: 100%;
    background-color: #f9f9f9;
  }
  .no-workplace-img {
    width: 100vw;
    object-fit: contain;
    height: calc(65vh - 50px);
  }
  .no-permission-text {
    font-size: 28px;
    letter-spacing: 0.1em;
    color: var(--color-text-black);
  }
</style>
