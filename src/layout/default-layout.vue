<template>
  <a-layout
    class="layout"
    :class="{ mobile: appStore.hideMenu }"
    style="-webkit-app-region: no-drag"
  >
    <a-layout>
      <a-layout>
        <!-- 左侧菜单区域 -->
        <a-layout-sider
          v-if="renderMenu"
          class="layout-sider"
          breakpoint="xl"
          :collapsed="collapsed"
          :collapsible="true"
          :width="menuWidth"
          :style="{ paddingTop: '1rem' }"
          :hide-trigger="true"
          @collapse="setCollapsed"
        >
          <div
            :class="{
              'menu-wrapper': true,
              'menuCollapse': appStore.menuCollapse
                ? false
                : !appStore.isPadding,
            }"
          >
            <MenuHeard
              :style="{
                flex: '0 0 auto',
                opacity: appStore.menuCollapse ? '0' : '1',
              }"
            />
            <Menu style="overflow: auto; flex: 1" />
          </div>
        </a-layout-sider>
        <a-drawer
          v-if="hideMenu"
          :visible="drawerVisible"
          placement="left"
          :footer="false"
          mask-closable
          :closable="false"
          @cancel="drawerCancel"
        >
          <Menu />
        </a-drawer>
        <!-- 右侧视图区域 -->
        <a-layout class="layout-content" :style="paddingStyle">
          <div v-if="navbar" class="layout-navbar">
            <Tool />
          </div>
          <TabBar v-if="appStore.tabBar && route.meta.layout !== 'page'" />
          <!-- <BreadCrumb v-if="route.meta.layout !== 'page'"></BreadCrumb> -->
          <a-layout-content class="layout-container">
            <div
              class="iframe-container"
              :class="route.meta.isIframe ? 'no-padding' : ''"
              v-if="route.meta.isIframe"
            >
              <iframe id="iframe-content"></iframe>
            </div>
            <PageLayout
              :key="route.meta.isIframe ? Math.random() : ''"
              ref="pageLayoutRef"
            />
          </a-layout-content>
          <Footer v-if="footer" />
        </a-layout>
      </a-layout>
    </a-layout>
  </a-layout>
</template>

<script lang="ts" setup>
  import {
    ref,
    computed,
    watch,
    provide,
    onMounted,
    inject,
    nextTick,
  } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useAppStore, useTabBarStore, useUserStore } from '@/store';
  import Tool from '@/components/navbar/tool.vue';
  import TabBar from '@/components/tab-bar/index.vue';
  import Menu from '@/components/menu/index.vue';
  import Footer from '@/components/footer/index.vue';
  import usePermission from '@/hooks/permission';
  import useResponsive from '@/hooks/responsive';
  import PageLayout from './page-layout.vue';
  import BreadCrumb from '@/components/breadcrumb/index.vue';
  import MenuHeard from '@/components/menu/menuHeard.vue';

  const isInit = ref(false);
  const appStore = useAppStore();
  const userStore = useUserStore();
  const router = useRouter();
  const route = useRoute();
  const permission = usePermission();
  useResponsive(true);
  const navbarHeight = `50px`;
  const navbar = computed(() => {
    if (route.matched.some((record) => record.meta.layout === 'page')) {
      return false;
    } else {
      return appStore.navbar;
    }
  });
  const renderMenu = computed(() => {
    if (route.matched.some((record) => record.meta.layout === 'page')) {
      return false;
    } else {
      return appStore.menu && !appStore.topMenu;
    }
  });
  const hideMenu = computed(() => appStore.hideMenu);
  const footer = computed(() => appStore.footer);
  const menuWidth = computed(() => {
    return appStore.menuCollapse ? 48 : appStore.menuWidth;
  });
  const collapsed = computed(() => {
    return appStore.menuCollapse;
  });
  const paddingStyle = computed(() => {
    const paddingLeft =
      renderMenu.value && !hideMenu.value
        ? { paddingLeft: `${menuWidth.value}px` }
        : {};
    const paddingTop = navbar.value ? { paddingTop: navbarHeight } : {};
    return { ...paddingLeft, ...paddingTop };
  });
  const setCollapsed = (val: boolean) => {
    if (!isInit.value) return; // for page initialization menu state problem
    appStore.updateSettings({ menuCollapse: val });
  };
  watch(
    () => userStore.role,
    (roleValue) => {
      if (roleValue && !permission.accessRouter(route))
        router.push({ name: 'notFound' });
    }
  );
  const drawerVisible = ref(false);
  const drawerCancel = () => {
    drawerVisible.value = false;
  };
  provide('toggleDrawerMenu', () => {
    drawerVisible.value = !drawerVisible.value;
  });
  onMounted(() => {
    isInit.value = true;
  });

  if (navigator.userAgent.includes('Electron')) {
    window.main.getUserInfo().then((arg: any) => {
      userStore.setInfo(arg.info);
    });

    window.main.onLogin((userInfo: any) => {
      location.reload();
    });
  }
</script>

<style scoped lang="less">
  @nav-size-height: 50px;
  @layout-max-width: 1100px;

  .layout {
    width: 100%;
    height: 100%;
    overflow: hidden;
  }

  .layout-navbar {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 100;
    width: 100%;
    height: @nav-size-height;
  }

  .layout-sider {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 101;
    height: 100%;
    transition: all 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
    &::after {
      position: absolute;
      top: 0;
      right: -1px;
      display: none;
      width: 1px;
      height: 100%;
      background-color: var(--color-border);
      content: '';
    }

    > :deep(.arco-layout-sider-children) {
      overflow-y: hidden;
    }
  }

  .menuCollapse {
    padding: 0 20px;
  }

  .menu-wrapper {
    display: flex;
    flex-direction: column;
    gap: 16px;
    height: 100%;
    overflow: hidden;
    // overflow-x: hidden;

    .left-side {
      margin-left: -20px;
    }
    &::-webkit-scrollbar {
      width: 0;
    }

    :deep(.arco-menu) {
      ::-webkit-scrollbar {
        width: 12px;
        height: 4px;
      }

      ::-webkit-scrollbar-thumb {
        background-color: var(--color-text-4);
        background-clip: padding-box;
        border: 4px solid transparent;
        border-radius: 7px;
      }

      ::-webkit-scrollbar-thumb:hover {
        background-color: var(--color-text-3);
      }
    }
  }

  .layout-content {
    height: 100vh;
    overflow-y: hidden;
    background-color: rgb(242, 243, 245);
    transition: padding 0.2s cubic-bezier(0.34, 0.69, 0.1, 1);
    .layout-container {
      overflow-y: auto;
      background-color: var(--bg1);
      &::-webkit-scrollbar {
        display: block;
        width: 10px;
        background: transparent;
      }
      &::-webkit-scrollbar-thumb:hover {
        background-color: #999999;
      }
      &::-webkit-scrollbar-thumb {
        background: rgb(201, 205, 212) content-box;
        border: 2px solid transparent;
        border-radius: 5px;
      }
    }
  }
  :deep(.arco-layout-sider-light) {
    box-shadow: none;
  }

  .iframe-container {
    width: 100%;
    height: 100%;
    // margin-top: 45px;
    app-region: no-drag;
    #iframe-content {
      width: 100%;
      height: calc(100% - 3px);
      // height: 100%;
      border: none;
    }
  }
  .no-padding {
    padding: 0;
  }
</style>
