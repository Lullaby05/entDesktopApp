<template>
  <router-view
    v-if="isRouterAlive"
    v-slot="{ Component, route }"
    style="-webkit-app-region: no-drag"
  >
    <transition name="fade" mode="out-in" appear>
      <component
        :is="Component"
        v-if="route.meta.ignoreCache"
        :key="route.fullPath"
      />
      <keep-alive v-else :include="cacheList">
        <component :is="Component" :key="route.fullPath" />
      </keep-alive>
    </transition>
  </router-view>
</template>

<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { useTabBarStore } from '@/store';
  import { provide } from 'vue';
  import { nextTick } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const isRouterAlive = ref<boolean>(true);

  const route = useRoute();
  const router = useRouter();
  const reload = (cacheQueryList: string[] = []) => {
    isRouterAlive.value = false;
    nextTick(() => {
      // 点击刷新的时候需要把查询条件都清空，仅第一次跳转过来的时候才需要把条件放到查询框中
      const query: any = {};
      if (cacheQueryList.length) {
        cacheQueryList.forEach((key: string) => {
          query[key] = route.query[key];
        });
      }
      router.replace({ path: route.path, query });
      isRouterAlive.value = true;
    });
  };

  provide('reload', reload);

  const tabBarStore = useTabBarStore();

  const cacheList = computed(() => tabBarStore.getCacheList);
</script>

<style scoped lang="less"></style>
<style lang="less">
  .container {
    background: var(--bg1);
    & > .arco-card-bordered {
      border: none;
    }
    .arco-table .arco-table-th {
      font-family: 'Alibaba-Medium';
      font-weight: 500;
    }
    .arco-table .arco-table-td {
      font-family: 'Alibaba';
      font-weight: 400;
    }
  }
  .arco-tooltip-content {
    background-color: rgb(92, 92, 92);
    font-size: 0.875rem;
  }
</style>
