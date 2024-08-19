<template>
  <div class="container" style="-webkit-app-region: no-drag">
    <div class="tabs" style="-webkit-app-region: drag">
      <div class="center-side">
        <!-- <tab></tab> -->
      </div>
      <ul class="right-side" style="-webkit-app-region: no-drag">
        <li>
          <svg-icon
            name="min"
            style="width: 16px; height: 16px; opacity: 1"
            @click="windowMin"
          />
        </li>
        <li>
          <svg-icon
            v-if="!isMaximizedRef"
            name="fullscreen"
            style="width: 16px; height: 16px; opacity: 1"
            @click="windowMax"
          />
          <svg
            t="1723696811489"
            class="icon icon-fullscreen"
            viewBox="0 0 1024 1024"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            p-id="7648"
            width="16"
            height="16"
            v-else
            style="width: 16px; height: 16px; opacity: 1"
            @click="windowMax"
          >
            <path
              d="M900 64H360c-33.137 0-60 26.863-60 60v146H124c-33.137 0-60 26.863-60 60v570c0 33.137 26.863 60 60 60h570c33.137 0 60-26.863 60-60V724h146c33.137 0 60-26.863 60-60V124c0-33.137-26.863-60-60-60zM664 634v176c0 33.137-26.863 60-60 60H214c-33.137 0-60-26.863-60-60V420c0-33.137 26.863-60 60-60h390c33.137 0 60 26.863 60 60v214z m206-60c0 33.137-26.863 60-60 60h-56V330c0-33.137-26.863-60-60-60H390v-56c0-33.137 26.863-60 60-60h360c33.137 0 60 26.863 60 60v360z"
              p-id="7649"
            ></path>
          </svg>
          <!-- <i
            class="iconfont icon-zuidahua1"
            style="font-size: 12px; color: #333"
            @click="windowMax"
          /> -->
        </li>
        <li>
          <svg-icon
            name="close"
            style="width: 16px; height: 16px; opacity: 1"
            @click="close"
          />
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { useFullscreen } from '@vueuse/core';
  import tab from './tabs/tabs.vue';
  import fullscreen1 from '../icons/fullscreen2.svg';

  const { toggle: toggleFullScreen, isFullscreen } = useFullscreen();

  const isMaximizedRef = ref(false);

  window.main.getWindowMaximized((isMaximized: boolean) => {
    isMaximizedRef.value = isMaximized;
  });

  window.main.os().then((result: any) => {
    // ...
    console.log('os.type():', result);
  });
  // 窗口关闭事件
  const close = () => {
    window.main.mainQuit();
  };
  // 窗口缩放事件
  const windowMin = () => {
    window.main.windowMin();
  };

  // 窗口最大化事件
  const windowMax = () => {
    window.main.toggleMaximumWindow();
  };

  window.main.changeTheme((theme: any) => {
    if (theme === 'dark') {
      document.body.setAttribute('arco-theme', 'dark');
      document.documentElement.classList.add('dark');
    } else {
      document.body.removeAttribute('arco-theme');
      document.documentElement.classList.remove('dark');
    }
  });
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    height: 100vh;
    padding: 0;
    background: rgba(255, 255, 255, 0);
    .tabs {
      height: 40px;
      width: 100%;
      background: var(--bg1);
      display: flex;
      position: relative;
      .center-side {
        flex: 1;
        width: 50%;
        height: 100%;
        padding-left: 70px;
      }
      .right-side {
        display: flex;
        padding-right: 20px;
        list-style: none;
        :deep(.locale-select) {
          border-radius: 20px;
        }

        li {
          display: flex;
          align-items: center;
          padding: 0 10px;
        }

        a {
          color: var(--color-text-1);
          text-decoration: none;
        }

        .nav-btn {
          color: rgb(var(--gray-8));
          font-size: 16px;
          border-color: rgb(var(--gray-2));
        }

        .trigger-btn,
        .ref-btn {
          position: absolute;
          bottom: 14px;
        }

        .trigger-btn {
          margin-left: 14px;
        }
      }
    }
  }
  :root {
    font-size: 16px;
  }
  .icon-fullscreen {
    fill: var(--color-icon) !important;
  }
</style>
