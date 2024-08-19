<template>
  <div class="navbar">
    <!-- <ul class="left" style="-webkit-app-region: no-drag">
      <li>
        <a-tooltip :content="$t('settings.add')">
          <a-button class="nav-btn" type="outline" :shape="'circle'">
            <template #icon>
              <IconPlus />
            </template>
          </a-button>
        </a-tooltip>
      </li>
    </ul> -->
    <ul class="right-side" style="-webkit-app-region: no-drag">
      <!-- <li>
        <a-tooltip :content="$t('settings.search')">
          <a-button class="nav-btn" type="outline" :shape="'circle'">
            <template #icon>
              <icon-search />
            </template>
          </a-button>
        </a-tooltip>
      </li> -->
      <!-- <li>
        <a-tooltip :content="$t('settings.language')">
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="setDropDownVisible"
          >
            <template #icon>
              <icon-language />
            </template>
          </a-button>
        </a-tooltip>
        <a-dropdown trigger="click" @select="changeLocale as any">
          <div ref="triggerBtn" class="trigger-btn"></div>
          <template #content>
            <a-doption
              v-for="item in locales"
              :key="item.value"
              :value="item.value"
            >
              <template #icon>
                <icon-check v-show="item.value === currentLocale" />
              </template>
              {{ item.label }}
            </a-doption>
          </template>
        </a-dropdown>
      </li> -->
      <li>
        <a-tooltip
          :content="
            theme === 'light'
              ? $t('settings.navbar.theme.toDark')
              : $t('settings.navbar.theme.toLight')
          "
        >
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="handleToggleTheme"
          >
            <template #icon>
              <darkIcon v-if="theme === 'dark'" />
              <lightIcon v-else />
              <!-- <img v-if="theme === 'dark'" :src="darkIcon" alt="" />
              <img v-else :src="lightIcon" alt="" /> -->
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li>
        <a-tooltip content="帮助中心">
          <a-button
            class="nav-btn"
            type="outline"
            :shape="'circle'"
            @click="jumpToHelpCenter"
          >
            <template #icon>
              <!-- <img :src="helpIcon" alt="" /> -->
              <helpIcon />
            </template>
          </a-button>
        </a-tooltip>
      </li>
      <li v-permission="'MonitoringDataScreen'">
        <a-tooltip
          :content="$t('dashboard.intelligentMonitoringDisposalCenter')"
        >
          <div
            class="message-dataScreen-trigger"
            @click="jumpToMonitorDataScreen"
          >
            <!-- <img :src="dataScreenIcon" alt="" /> -->
            <dataScreenIcon />
          </div>
        </a-tooltip>
      </li>
      <li v-permission="'DataScreen'">
        <a-tooltip :content="$t('dashboard.securityData')">
          <div class="message-dataScreen-trigger" @click="jumpToDataScreen">
            <!-- <img :src="monitoringIcon" alt="" /> -->
            <monitoringIcon />
          </div>
        </a-tooltip>
      </li>
      <!-- <li>
        <a-tooltip :content="$t('settings.navbar.alerts')">
          <div class="message-box-trigger">
            <a-badge :count="9" dot>
              <a-button
                class="nav-btn"
                type="outline"
                :shape="'circle'"
                @click="setPopoverVisible"
              >
                <icon-notification />
              </a-button>
            </a-badge>
          </div>
        </a-tooltip>
        <a-popover
          trigger="click"
          :arrow-style="{ display: 'none' }"
          :content-style="{ padding: 0, minWidth: '400px' }"
          content-class="message-popover"
        >
          <div ref="refBtn" class="ref-btn"></div>
          <template #content>
            <message-box />
          </template>
        </a-popover>
      </li> -->
      <!-- <li>
                <a-tooltip :content="$t('settings.title')">
                    <a-button class="nav-btn" type="outline" :shape="'circle'" @click="setVisible">
                        <template #icon>
                            <icon-settings />
                        </template>
                    </a-button>
                </a-tooltip>
            </li> -->
      <li>
        <a-dropdown trigger="click">
          <a-avatar
            :size="32"
            :style="{ marginRight: '8px', cursor: 'pointer' }"
          >
            <img alt="avatar" :src="avatar" />
          </a-avatar>
          <span>{{ userInfo.userName || userInfo.nickname }}</span>
          <template #content>
            <!-- <a-doption>
              <a-space @click="switchRoles">
                <icon-tag />
                <span>
                  {{ $t('messageBox.switchRoles') }}
                </span>
              </a-space>
            </a-doption> -->
            <!-- <a-doption>
              <a-space @click="$router.push({ name: 'Info' })">
                <icon-user />
                <span>
                  {{ $t('messageBox.userCenter') }}
                </span>
              </a-space>
            </a-doption> -->
            <a-doption v-if="enterpriseList.length > 1">
              <a-space @click="swapEnterprise">
                <icon-user-group />
                <span>
                  {{ $t('dashboard.switchEnterprise') }}
                </span>
              </a-space>
            </a-doption>
            <!-- <a-doption>
              <a-space @click="$router.push({ name: 'Setting' })">
                <icon-settings />
                <span>
                  {{ $t('messageBox.userSettings') }}
                </span>
              </a-space>
            </a-doption> -->
            <a-doption>
              <a-space @click="handleLogout">
                <icon-export />
                <span>
                  {{ $t('messageBox.logout') }}
                </span>
              </a-space>
            </a-doption>
          </template>
        </a-dropdown>
      </li>
    </ul>
  </div>
  <a-modal
    class="enterprise-choose-modal"
    width="600px"
    v-model:visible="enterpriseChooseVisible"
    title-align="start"
    :mask="true"
    :title="$t('dashboard.selectEnterprise')"
    :footer="false"
  >
    <choose-enterprise
      :enterpriseList="enterpriseList"
      v-model:selectEnterprise="selectEnterprise"
      @cancel="cancelChooseEnterprise"
      @confirm="confirmChooseEnterprise"
    />
  </a-modal>
</template>

<script lang="ts" setup>
  import { computed, ref, onMounted, onBeforeMount, inject } from 'vue';
  import { Message } from '@arco-design/web-vue';
  import { useDark, useToggle } from '@vueuse/core';
  import {
    tabStore,
    useAppStore,
    useModelStore,
    useTabBarStore,
    useUserStore,
  } from '@/store';
  import i18n, { LOCALE_OPTIONS } from '@/locale';
  import useLocale from '@/hooks/locale';
  import useUser from '@/hooks/user';
  import MessageBox from '../message-box/index.vue';
  import { getTenantList, getTokenByTenant } from '@/api/user';
  import chooseEnterprise from '@/views/login/components/chooseEnterprise.vue';
  import MenuHeard from '@/components/menu/menuHeard.vue';
  import darkIcon from '@/assets/images/menuIcon/icon-暗夜模式.svg';
  import lightIcon from '@/assets/images/menuIcon/icon-白昼模式.svg';
  import helpIcon from '@/assets/images/menuIcon/icon-帮助中心.svg';
  import dataScreenIcon from '@/assets/images/menuIcon/icon-安全态势大数据.svg';
  import monitoringIcon from '@/assets/images/menuIcon/icon-智能监测处置中心.svg';

  const appStore = useAppStore();
  const userStore = useUserStore();
  const { logout } = useUser();
  const { changeLocale, currentLocale } = useLocale();
  const locales = [...LOCALE_OPTIONS];
  const avatar = computed(() => {
    return userStore.userInfo.avatar;
  });
  const userInfo = computed(() => {
    return userStore.userInfo;
  });
  const theme = computed(() => {
    return appStore.theme;
  });
  const isDark = useDark({
    selector: 'body',
    attribute: 'arco-theme',
    valueDark: 'dark',
    valueLight: 'light',
    storageKey: 'arco-theme',
    onChanged(dark: boolean) {
      // overridden default behavior
      appStore.toggleTheme(dark);
      window?.main.changeTheme(dark ? 'dark' : 'light');
    },
  });
  const toggleTheme = useToggle(isDark);
  const handleToggleTheme = () => {
    toggleTheme();
  };
  const refBtn = ref();
  const triggerBtn = ref();
  const setPopoverVisible = () => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    refBtn.value.dispatchEvent(event);
  };
  const jumpToDataScreen = () => {
    const param = {
      url: '/dashboard/dataScreen', // 路由路径
      width: 1920,
      height: 1080,
    };
    if (navigator.userAgent.includes('Electron')) {
      window.main.openWindow(param);
    } else {
      router.push({
        name: 'DataScreen',
      });
    }
    return;
  };
  const jumpToMonitorDataScreen = () => {
    const param = {
      url: '/thingsBoard/monitoringDataScreen', // 路由路径
      width: 1920,
      height: 1080,
    };
    if (navigator.userAgent.includes('Electron')) {
      window.main.openWindow(param);
    } else {
      router.push({
        name: 'MonitoringDataScreen',
      });
    }
    return;
  };
  const handleLogout = () => {
    logout();
  };
  const router = useRouter();
  const route = useRoute();
  const jumpToHelpCenter = () => {
    if (route.name === 'HelpCenter') {
      router.back();
      return;
    }
    router.push({
      name: 'HelpCenter',
      query: { name: route.name as string },
    });
  };
  const setDropDownVisible = () => {
    const event = new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    });
    triggerBtn.value.dispatchEvent(event);
  };

  //! 测试用，手动切换并且把信息保存到store
  const userList = ref<any>([]);
  const currentUser = ref<any>();
  currentUser.value = userStore.userId;

  // onBeforeMount(async () => {
  //   const { data } = await getUserList();
  //   userList.value = data;
  // });

  // appStyle();
  const enterpriseList = computed(() => {
    return userStore.enterpriseList;
  });
  const enterpriseChooseVisible = ref(false);
  const selectEnterprise = ref<any>({});
  const swapEnterprise = () => {
    selectEnterprise.value = {
      companyName: userInfo.value.companyName,
      deptId: userInfo.value.deptId,
      deptName: userInfo.value.deptName,
      enterpriseId: userInfo.value.enterpriseId,
      nickname: userInfo.value.nickname,
      tenantId: userInfo.value.tenantId,
      userId: userInfo.value.userId,
    };
    enterpriseChooseVisible.value = true;
  };
  const { resetTabs } = tabStore();
  const { resetTabList } = useTabBarStore();
  const confirmChooseEnterprise = async () => {
    if (!selectEnterprise.value.enterpriseId) {
      Message.warning(i18n.global.t('dashboard.pleaseSelectEnterprise'));
      return;
    }
    if (selectEnterprise.value.enterpriseId === userInfo.value.enterpriseId)
      return;
    const { data } = await getTokenByTenant(selectEnterprise.value);
    await userStore.getUserBasicInfo(data);
    const info = {
      info: JSON.parse(JSON.stringify(userInfo.value)),
    };
    resetTabs();
    resetTabList();
    if (navigator.userAgent.includes('Electron')) {
      window.main.reopenWindow(info);
    }
  };
  const cancelChooseEnterprise = () => {
    enterpriseChooseVisible.value = false;
  };
</script>

<style lang="less">
  .enterprise-choose-modal {
    .choose-content {
      max-height: 240px;
    }
  }
</style>
<style lang="less" scoped>
  .navbar {
    --leftMenuWidth: 210px;
    transition: all 0.2s ease-in-out;
    // position: fixed;
    z-index: 99;
    display: flex;
    justify-content: space-between;
    // float: left;
    // width: calc(100% - var(--leftMenuWidth));
    width: 100%;
    height: 50px;
    overflow-y: hidden;
    line-height: 1;
    background-color: var(--bg2);
    border-bottom: 1px solid var(--color-border2);
  }

  .right-side {
    display: flex;
    justify-content: flex-end;
    width: 100%;
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
      width: 30px;
      height: 30px;
      // border-color: rgb(var(--gray-2));
    }
    .message-box-trigger {
      line-height: 1;
    }
    .message-dataScreen-trigger {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      border: 1px solid rgb(var(--primary-5));
      border-radius: 50%;
      width: 30px;
      height: 30px;
    }

    // .trigger-btn,
    // .ref-btn {
    //   position: absolute;
    //   bottom: 14px;
    // }

    // .trigger-btn {
    //   margin-left: 14px;
    // }
  }

  .left {
    display: flex;
    justify-content: flex-start;
    width: 100%;
    padding-left: 20px;
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
      // border-color: rgb(var(--gray-2));
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
</style>
