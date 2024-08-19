<script lang="tsx">
  import { defineComponent, ref, h, compile, computed } from 'vue';
  import { useI18n } from 'vue-i18n';
  import { useRoute, useRouter, RouteRecordRaw } from 'vue-router';
  import type { RouteMeta, RouteRecordNameGeneric } from 'vue-router';
  import { cloneDeep } from 'lodash';
  import { useAppStore, tabStore } from '@/store';
  import { listenerRouteChange } from '@/utils/route-listener';
  import { openWindow, regexUrl } from '@/utils';
  import useMenuTree from './use-menu-tree';
  import { setRencentPage } from '@/api/dashboard';
  import useRouterJump from '@/hooks/routerJump';
  import { findModule } from '@/router/routes';

  export default defineComponent({
    emit: ['collapse'],
    setup() {
      const { t } = useI18n();
      const appStore = useAppStore();
      const router = useRouter();
      const route = useRoute();
      const { menuTree } = useMenuTree();
      const { getPathByName } = useRouterJump();
      // 菜单是否收起
      const collapsed = computed({
        get() {
          if (appStore.device === 'desktop') return appStore.menuCollapse;
          return false;
        },
        set(value: boolean) {
          appStore.updateSettings({ menuCollapse: value });
        },
      });

      const topMenu = computed(() => appStore.topMenu);
      const openKeys = ref<string[]>([]);
      const selectedKey = ref<string[]>([]);
      // 菜单初始化
      const nowTree = ref<RouteRecordRaw[]>([]);
      const userModel = ref('');
      const tabs = tabStore();
      // 初始化菜单
      const initMenu = () => {
        nowTree.value = [];
        menuTree.value.forEach((el: RouteRecordRaw) => {
          const newMenu = cloneDeep(el) as RouteRecordRaw;
          if (el.name !== 'dashboard') {
            newMenu.children = [];
          }
          nowTree.value.push(newMenu);
        });
        userModel.value = 'dashboard';
      };

      // 切换模块
      const cutModel = (fullPath: any, meta: any) => {
        const { model } = meta;
        // 使用同个模块,不进行切换
        // if (model === 'safetyManage') {
        //   appStore.updateSettings({ isPadding: true });
        // } else {
        appStore.updateSettings({ isPadding: false });
        // }
        if (userModel.value === model) {
          return;
        }
        userModel.value = model;
        if (fullPath.indexOf('/dashboard') === -1) {
          // console.log("切换模块", isModel,path)
          nowTree.value = [];
          menuTree.value.forEach((el: RouteRecordRaw) => {
            if (el.name === model) {
              nowTree.value.push(el);
            }
          });
        } else if (fullPath.indexOf('/dashboard') !== -1) {
          initMenu();
        }
      };

      const goto = async (item: RouteRecordRaw) => {
        // Open external link
        if (item.name === 'DataScreen') {
          const param = {
            url: '/dashboard/dataScreen', // 路由路径
            width: 1600,
            height: 900,
          };
          window.main.openWindow(param);
          return;
        }
        if (item.name === 'MonitoringDataScreen') {
          const param = {
            url: '/thingsBoard/monitoringDataScreen', // 路由路径
            width: 1600,
            height: 900,
          };
          window.main.openWindow(param);
          return;
        }
        if (regexUrl.test(item.path)) {
          openWindow(item.path);
          selectedKey.value = [item.name as string];
          return;
        }
        // Eliminate external link side effects
        const {
          hideInMenu,
          activeMenu,
          isModel,
          model,
          locale,
          redirect,
          hideChildrenInMenu,
        } = item.meta as RouteMeta;
        if (route.name === item.name && !hideInMenu && !activeMenu) {
          selectedKey.value = [item.name as string];
          return;
        }

        // 如果children全部都隐藏的，点击这个菜单就直接跳转到redirect
        if (hideChildrenInMenu) {
          selectedKey.value = [item.name as string];
          setRencentPage(redirect as string);
          router.push({
            name: redirect as RouteRecordNameGeneric,
          });
          return;
        }
        // if (isModel) {
        //   const tabList = tabs.getTabsList;
        //   if (!tabList.some((itemTab) => itemTab.modelName === model)) {
        //     const tab: any = {
        //       key: String(tabList.length + 1),
        //       name: locale,
        //       modelName: model,
        //       route: redirectUrl,
        //       icon: item.meta && item.meta.icon,
        //     };
        //     tabs.update(tab);
        //     window.main.newTab(tab);
        //   } else {
        //     const cutTab = tabList.find(
        //       (itemTab) => itemTab.modelName === model
        //     );
        //     window.main.setTab(cloneDeep(cutTab));
        //   }
        //   return;
        // }
        // if (isModel) {
        //   const tabList = tabs.getTabsList;
        //   if (!tabList.some((itemTab) => itemTab.modelName === name)) {
        //     const tab: any = {
        //       key: String(tabList.length + 1),
        //       name: locale,
        //       modelName: name,
        //       route: getPathByName(name),
        //       icon: item.meta && item.meta.icon,
        //     };
        //     tabs.update(tab);
        //     window.main.newTab(tab);
        //   } else {
        //     const cutTab = tabList.find(
        //       (itemTab) => itemTab.modelName === name
        //     );
        //     window.main.setTab(cloneDeep(cutTab));
        //   }
        //   return;
        // }
        // 触发路由跳转之前需要放到最近访问的接口中去
        setRencentPage(item.name as string);
        // return;
        // Trigger router change
        router.push({
          name: item.name,
        });
      };

      const findMenuOpenKeys = (target: string) => {
        const result: string[] = [];
        let isFind = false;
        const backtrack = (item: RouteRecordRaw, keys: string[]) => {
          if (item.name === target) {
            isFind = true;
            result.push(...keys);
            return;
          }
          if (item.children?.length) {
            item.children.forEach((el) => {
              backtrack(el, [...keys, el.name as string]);
            });
          }
        };
        menuTree.value.forEach((el: RouteRecordRaw) => {
          if (isFind) return; // Performance optimization
          backtrack(el, [el.name as string]);
        });
        return result;
      };
      // 切换模块--侦听切换
      listenerRouteChange((newRoute) => {
        const { requiresAuth, activeMenu, hideInMenu, hideChildrenInMenu } =
          newRoute.meta;
        if (newRoute.name === 'HelpCenter') {
          return;
        }
        // cutModel(newRoute.fullPath, newRoute.meta);
        if (requiresAuth && (!hideInMenu || activeMenu || hideChildrenInMenu)) {
          // 如果hideChildrenInMenu说明这一个菜单是默认显示为没有子元素的菜单，这时候goto会跳转到redirectUrl，所以路由跳转的时候高亮到最顶级的菜单
          const menuOpenKeys = findMenuOpenKeys(
            !hideChildrenInMenu
              ? ((activeMenu || newRoute.name) as string)
              : (newRoute.matched[0].name as string)
          );

          const keySet = new Set([...menuOpenKeys]);
          openKeys.value = [...keySet];
          selectedKey.value = [
            activeMenu || menuOpenKeys[menuOpenKeys.length - 1],
          ];
        }
      }, true);

      const setCollapse = (val: boolean) => {
        if (appStore.device === 'desktop') {
          appStore.updateSettings({ menuCollapse: val });
        }
      };
      // 监听 view发起的新增/切换 Tab指令
      // window.main.closeHandle((tab: any) => {
      // 在tab页面进行了关闭，不需要重复触发deleteTabs,否则会多删除一个tab，因为添加了store同步的方法 2024/3/18
      // console.log('关闭视图=', tab.modelName);
      // const tabList = tabs.getTabsList;
      // const closeIndex = tabList.findIndex((item) => item.key === tab.key);
      // tabs.deleteTabs(closeIndex);
      // });
      // 监听 切换 tab指令
      // window.main.onTabChange((tab: any) => {
      //   if (tab.activeRouteUrl && tab.activeRouteUrl !== route.path) {
      //     setTimeout(() => {
      //       router.push({
      //         path: tab.activeRouteUrl,
      //         query: tab.activeRouteParams
      //           ? JSON.parse(tab.activeRouteParams)
      //           : undefined,
      //       });
      //     }, 500);
      //   }
      // });
      // 切换tab的时候跳转路由
      // window.main.onJumpRouter((tab: any) => {
      //   if (tab.route && route.path !== tab.route) {
      //     router.replace({
      //       path: tab.route,
      //     });
      //   }
      //   if (!tab.routeUrl) return;
      //   setTimeout(() => {
      //     // 路由重复跳转说明可能只是参数不同
      //     if (route.path === tab.routeUrl) {
      //       router.replace({
      //         path: tab.routeUrl,
      //         query: tab.routeParams ? JSON.parse(tab.routeParams) : undefined,
      //       });
      //     } else {
      //       router.push({
      //         path: tab.routeUrl,
      //         query: tab.routeParams ? JSON.parse(tab.routeParams) : undefined,
      //       });
      //     }
      //   }, 0);
      // });

      const renderSubMenu = (selectedKey: any) => {
        function travel(_route: RouteRecordRaw[], nodes = []) {
          if (_route) {
            _route.forEach((element) => {
              // This is demo, modify nodes as needed
              if (element?.meta?.showFlag) {
                return;
              }
              // 找element对应的model
              let activeModule = undefined;
              // 找element和selectedKey是否相同
              if (
                element.name === findModule(selectedKey.value[0]).meta.model
              ) {
                activeModule = findModule(
                  findModule(selectedKey.value[0]).meta.model
                );
              }
              //
              const icon = element?.meta?.icon
                ? () => {
                    const icon = new URL(
                      `../../assets/images/menuIcon/${
                        activeModule
                          ? activeModule?.meta?.activeIcon
                          : element?.meta?.icon
                      }.svg`,
                      import.meta.url
                    ).href;
                    return h(
                      compile(
                        `<img src="${icon}" />`
                        // `<i class="iconfont ${element?.meta?.icon} "></i>`
                      )
                    );
                  }
                : null;
              const node =
                element?.children && element?.children.length !== 0 ? (
                  <a-sub-menu
                    key={element?.name}
                    v-slots={{
                      icon,
                      title: () => h(compile(t(element?.meta?.locale || ''))),
                    }}
                    style="-webkit-app-region: no-drag"
                    class={
                      element.meta && element.meta.isModel
                        ? 'sub-menu1'
                        : 'sub-menu-item'
                    }
                  >
                    {travel(element?.children)}
                  </a-sub-menu>
                ) : (
                  <a-menu-item
                    key={element?.name}
                    v-slots={{ icon }}
                    onClick={() => goto(element)}
                    style="-webkit-app-region: no-drag"
                    class={
                      element.meta && element.meta.isModel
                        ? 'sub-menu1'
                        : 'sub-menu-item'
                    }
                  >
                    {t(element?.meta?.locale || '')}
                  </a-menu-item>
                );
              nodes.push(node as never);
            });
          }
          return nodes;
        }
        // return travel(nowTree.value); // 只展示当前model下的菜单及子菜单
        return travel(menuTree.value); // 一次性平铺全部菜单
      };

      return () => (
        <a-menu
          mode={topMenu.value ? 'horizontal' : 'vertical'}
          v-model:collapsed={collapsed.value}
          v-model:open-keys={openKeys.value}
          show-collapse-button={appStore.device !== 'mobile'}
          auto-open={false}
          selected-keys={selectedKey.value}
          auto-open-selected={true}
          level-indent={12}
          style="height: 100%;width:100%;"
          accordion={true}
          onCollapse={setCollapse}
        >
          {renderSubMenu(selectedKey)}
        </a-menu>
      );
    },
  });
</script>

<style lang="less" scoped>
  :deep(.arco-menu) {
    .arco-menu-inner {
      .arco-menu-inline-header {
        display: flex;
        align-items: center;
      }

      .arco-icon {
        &:not(.arco-icon-down) {
          font-size: 18px;
        }
      }
    }
  }
  :deep(.arco-menu-icon) {
    margin-right: 8px !important;
  }
  .sub-menu1 {
    font-weight: 500;
    font-family: 'Alibaba-Medium';
  }
  .sub-menu-item {
    font-weight: 400;
    color: rgb(173, 177, 186);
    :deep(.arco-menu-inline-header) {
      color: rgb(173, 177, 186);
    }
    font-family: 'Alibaba';
  }
  :deep(.arco-menu .arco-menu-inline-header.arco-menu-selected) {
    font-weight: 500;
    font-family: 'Alibaba-Medium';
    background-color: var(--color-menu-selected);
  }
  :deep(.arco-menu-item.arco-menu-selected) {
    background-color: var(--color-menu-selected) !important;
  }
  :deep(.arco-menu-inner .arco-menu-inline .arco-menu-item.arco-menu-selected) {
    border-radius: 4px;
    font-weight: 500;
    font-family: 'Alibaba-Medium';
    // margin: 0 20px;
    background-color: var(--color-menu-selected);
  }
  :deep(.arco-menu-inner) {
    &::-webkit-scrollbar {
      width: 0;
      display: none;
    }
  }
</style>
