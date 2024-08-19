<template>
  <a-breadcrumb class="container-breadcrumb" :routes="routes">
    <template #item-render="{ route }">
      <a-link
        v-if="
          activeLink &&
          activeLink.index === route.index &&
          route.index === routes.length - 2
        "
        @click="router.back()"
      >
        {{ route.label }}
      </a-link>
      <span v-else>
        {{ route.label }}
      </span>
    </template>
  </a-breadcrumb>
</template>

<script lang="ts" setup>
  import { BreadcrumbRoute } from '@arco-design/web-vue';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();
  const routes = ref<BreadcrumbRoute[]>([]);
  const route = useRoute();
  const router = useRouter();

  const activeLink = ref<(BreadcrumbRoute & { index: number }) | undefined>(
    undefined
  );

  // 监听路由变化
  watch(
    () => route,
    (newVal) => {
      let matched = newVal.matched;
      if (matched.length) {
        matched = [...matched];
      }
      routes.value = matched.map((item: any, index) => {
        return {
          path: item.path,
          label: t(item.meta.locale || ''),
          index,
        };
      });
      if (activeLink.value) {
        routes.value.splice(activeLink.value.index, 0, activeLink.value);
        // 重新设置routes的index属性
        routes.value = routes.value.map((item, index) => ({ ...item, index }));
      }
    },
    { deep: true, immediate: true }
  );

  router.afterEach((to, from) => {
    // 说明路由的上一个节点都相同,并且跳转到的目标菜单是不显示的，即视为从列表页跳转到新增/编辑页
    if (
      to.matched[to.matched.length - 2] &&
      from.matched[to.matched.length - 2] &&
      to.matched[to.matched.length - 2].name ===
        from.matched[to.matched.length - 2].name &&
      to.meta.hideInMenu
    ) {
      // 这个时候需要在routes的倒数第二个位置加入前一个路由
      activeLink.value = {
        path: from.path,
        label: t(from.meta.locale || ''),
        index: routes.value.length - 1,
      };
    } else {
      activeLink.value = undefined;
    }
  });
</script>

<style scoped lang="less">
  .container-breadcrumb {
    padding: 16px 0 1px 30px;
    margin: 0;
    width: 100%;
    background-color: var(--bg1);

    :deep(.arco-breadcrumb-item) {
      color: rgb(var(--gray-6));

      &:last-child {
        color: rgb(var(--gray-8));
      }
    }
  }
</style>
