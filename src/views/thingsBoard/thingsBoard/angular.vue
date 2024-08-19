<template>
  <!-- <div class="container">
    <iframe ref="iframe" :src="currentUrl" class="container-iframe"></iframe>
  </div> -->
</template>

<script lang="ts" setup>
  // import { getMonitorRefreshToken, getMonitorToken } from '@/utils/auth';
  import { useAppStore } from '@/store';
  import { getMonitorRefreshToken, getMonitorToken } from '@/utils/auth';
  import { Message, MessageReturn } from '@arco-design/web-vue';
  import { storeToRefs } from 'pinia';
  import {
    computed,
    defineComponent,
    onMounted,
    onUnmounted,
    ref,
    watch,
  } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  defineComponent({
    name: 'Angular',
  });

  const thingsBoardBaseUrl = 'https://prodapi.xkrsecure.com';
  // const thingsBoardBaseUrl = 'http://localhost:4200';

  const route = useRoute();
  const router = useRouter();

  const currentUrl = computed(() => {
    // 如果是本地需要把/thingsBoard去掉
    // return `${thingsBoardBaseUrl}${lowercaseFirstLetter(
    //   route.path.replace('/thingsBoard', '').replace('xkriot', '')
    // )}`;
    return `${thingsBoardBaseUrl}/xkriot${lowercaseFirstLetter(
      route.path.replace('/thingsBoard', '').replace('xkriot', '')
    )}`;
  });

  const messageInstance = ref<MessageReturn | null>(null);

  watch(
    () => route.path,
    (val) => {
      initIframe();
    }
  );

  onMounted(() => {
    initIframe();
  });

  const initIframe = () => {
    const token = getMonitorToken();
    const refreshToken = getMonitorRefreshToken();
    if (!token) {
      if (!messageInstance.value) {
        messageInstance.value =
          Message.warning('暂无查看权限，请联系管理员添加权限');
      }
      return;
    }
    window.addEventListener('message', receiveMessage);
    const iframeContainer: HTMLIFrameElement | null = document.querySelector(
      '.iframe-container #iframe-content'
    );
    const iframeDocument = iframeContainer?.contentDocument;

    if (iframeContainer && iframeContainer.contentWindow) {
      if (iframeDocument) {
        // 获取所有的样式表
        const styleSheets = iframeDocument.styleSheets;

        // 遍历所有的样式表
        for (let i = 0; i < styleSheets.length; i++) {
          let styleSheet = styleSheets[i];

          // 遍历样式表中的所有规则
          for (let j = 0; j < styleSheet.cssRules.length; j++) {
            let rule = styleSheet.cssRules[j];

            // 如果规则是媒体查询规则，那么删除它
            if (rule.type === CSSRule.MEDIA_RULE) {
              styleSheet.deleteRule(j);
              j--; // 因为删除了一个规则，所以需要调整索引
            }
          }
        }
      }
      iframeContainer.onload = () => {
        iframeContainer.contentWindow!.postMessage(
          {
            token,
            refreshToken,
          },
          '*'
        );
        iframeContainer?.contentWindow?.postMessage(
          {
            type: 'changeTheme',
            theme: theme.value,
          },
          '*'
        );
      };
      if (
        iframeContainer.getAttribute('src') &&
        iframeContainer.getAttribute('src')?.includes(thingsBoardBaseUrl)
      ) {
        iframeContainer.contentWindow.postMessage(
          {
            type: 'changeRouter',
            url: lowercaseFirstLetter(
              route.path.replaceAll('/thingsBoard', '').replace('xkriot', '')
            ),
          },
          '*'
        );
        return;
      }
      iframeContainer?.setAttribute('src', currentUrl.value);
    }
  };

  function lowercaseFirstLetter(string: string) {
    return string[0].toLowerCase() + string.slice(1);
  }

  const appStore = useAppStore();
  const { theme } = storeToRefs(appStore);
  watch(
    () => theme.value,
    (val) => {
      const iframeContainer: HTMLIFrameElement | null = document.querySelector(
        '.iframe-container #iframe-content'
      );
      iframeContainer?.contentWindow?.postMessage(
        {
          type: 'changeTheme',
          theme: val,
        },
        '*'
      );
    },
    { immediate: true }
  );

  function receiveMessage(event: any) {
    // 检查发送消息的源
    if (event.origin !== thingsBoardBaseUrl) {
      return;
    }
    if (event.data.type === 'changeRouter') {
      let path = event.data.url;
      if (path === '/dashboards') {
        path = '/thingsBoardDashboards';
      }
      if (path.includes('/dashboards/')) {
        path = path.replace('/dashboards/', '/thingsBoardDashboards/');
      }
      router.push(`/thingsBoard${path}`);
    }
  }
</script>
<style lang="less" scoped>
  .container {
    width: 100%;
    height: 100%;
    .container-iframe {
      width: 100%;
      height: calc(100% - 32px);
      border: none;
    }
  }
</style>
