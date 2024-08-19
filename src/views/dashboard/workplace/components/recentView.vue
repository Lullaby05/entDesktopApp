<template>
  <div class="recent-view-container">
    <div class="header">
      <span>{{ $t('dashboard.recentVisit') }}</span>
    </div>
    <div class="content">
      <div
        class="recent-view-item"
        v-for="(item, index) in recentList"
        :key="index"
        @click="handleClick(item)"
      >
        <div class="text">{{ item.text }}</div>
        <div class="time">{{ item.time }}</div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { getRencentPage } from '@/api/dashboard';
  import useRouterJump from '@/hooks/routerJump';
  import { findModule } from '@/router/routes';
  import { formatRelativeDate } from '@/utils/utils';
  import { ref } from 'vue';
  import { useI18n } from 'vue-i18n';

  const recentList = ref<any[]>([]);

  const { t } = useI18n();

  const initData = async () => {
    const { data } = await getRencentPage();
    if (!data) return;
    recentList.value = data
      .slice(0, 3)
      .map((item: any) => {
        const module = findModule(item.menuName);
        if (!module.meta) return;
        const moduleName = module.meta.locale.includes('.')
          ? t(module.meta.locale)
          : module.meta.locale;
        return {
          text: moduleName,
          time: formatRelativeDate(item.visitedTime),
          menuName: item.menuName,
        };
      })
      .filter((item: any) => item);
  };

  const { jumpWithTab } = useRouterJump();

  const handleClick = (item: any) => {
    jumpWithTab({
      routerName: item.menuName,
    });
  };

  initData();
</script>
<style lang="less" scoped>
  .recent-view-container {
    border-radius: 4px;
    background-color: var(--bg2);
    width: 100%;
    height: 18.1vh;
    box-shadow: var(--color-box-shadow);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    .header {
      font-size: 1rem;
      font-family: 'Alibaba-Medium';
      color: var(--color-text-black);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.07rem 1.07rem 0 1.07rem;
      // border-bottom: 1px solid #fafafa;
    }
    .content {
      padding: 0 1.43rem 0.57rem 1.07rem;
      display: flex;
      flex-direction: column;
      font-size: 0.86rem;
      .recent-view-item {
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: space-between;
        line-height: 1.43rem;
        padding: 10px 0 10px;
        border-bottom: 0.5px solid var(--bg4);
        .time {
          color: var(--color-text-grey1);
        }
      }
      .recent-view-item:nth-last-of-type(1) {
        border-bottom: none;
      }
    }
  }
</style>
