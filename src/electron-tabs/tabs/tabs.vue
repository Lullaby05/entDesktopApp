<template>
  <ul class="tabrow">
    <!-- <li class="noShow">
      <tabItem style="color: var(--bg1) !important"></tabItem>
    </li> -->
    <draggable
      style="width: 100%; text-align: left"
      :list="list"
      :disabled="!enabled"
      item-key="name"
      filter=".forbid"
      :move="checkMove"
      @start="dragging = true"
      @end="dragging = false"
    >
      <template #item="{ element, index }">
        <li
          :key="element.key"
          :class="{
            'selected': nowKey === element.key,
            'only-tag': list.length === 1,
            'forbid': element.modelName === 'dashboard',
          }"
          :style="`--tabWidth: ${tabWidth}`"
        >
          <tabItem
            :index="index"
            :item-data="element"
            @close-tab="closeTab"
            @tag-change="click"
            style="color: rgb(92 94 96)"
            :style="`--linkMaxWidth:${linkMaxWidth}`"
          ></tabItem>
        </li>
      </template>
    </draggable>
    <!-- <li class="noShow">
      <addTabItem></addTabItem>
    </li> -->
  </ul>

  <!-- 旧版本嵌套多层--无意义 9.14 修改为一层 -->
  <!--  <div class="content">
    <div class="center">
      <div class="tabs">
        <div class="tabrow">
          <div class="noShow">
            <tabItem style="color: var(--bg1) !important"></tabItem>
          </div>
          <draggable
            :list="list"
            :disabled="!enabled"
            item-key="name"
            :move="checkMove"
            @start="dragging = true"
            @end="dragging = false"
          >
            <template #item="{ element, index }">
              <div
                :key="element.key"
                :class="{
                  'selected': nowKey === element.key,
                  'only-tag': list.length === 1,
                }"
              >
                <tabItem
                  :index="index"
                  :item-data="element"
                  @close-tab="closeTab"
                  @tag-change="click"
                ></tabItem>
              </div>
            </template>
          </draggable>
          <div class="noShow">
            <addTabItem></addTabItem>
          </div>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script lang="ts" setup>
  import { ref, onMounted, computed } from 'vue';
  import draggable from 'vuedraggable';
  import { cloneDeep } from 'lodash';
  import { tabStore } from '@/store';
  import tabItem from './tabItem.vue';
  import addTabItem from './addTabItem.vue';

  const tabs = tabStore();
  const list = computed(() => tabs.getTabsList);

  const nowKey = ref(list.value[0].key);
  const enabled = ref(true); // 允许移动或选择tab标签
  const dragging = ref(false);

  const tabWidth = computed(() => {
    return `calc(100% / ${list.value.length})`;
  });

  const linkMaxWidth = computed(() => {
    return `calc(100% - ${list.value.length * 3}%)`;
  });

  const click = async (tab: any) => {
    if (tab.key === nowKey.value) {
      return;
    }
    console.log('切换tab点击事件');
    nowKey.value = tab.key;
    window.main.setTab(cloneDeep(tab));
  };

  const closeTab = (tab: any) => {
    console.log('关闭tab标签', tab);
    const closeIndex = list.value.findIndex((item) => item.key === tab.key);
    if (tab.key === nowKey.value) {
      nowKey.value = list.value[closeIndex - 1].key;
    } else if (tab.key > nowKey.value) {
      nowKey.value = nowKey.value;
    } else {
      nowKey.value = nowKey.value - 1 + '';
    }

    list.value.slice(closeIndex, 1);
    tabs.deleteTabs(closeIndex);
    window.main.closeTab(cloneDeep(tab));
    // console.log('关闭tab标签', list.value);
    // console.log('关闭tab标签', nowKey.value);
    // console.log('closeTab',tabs.tabList);
  };
  const checkMove = (e: any) => {
    window.console.log('Future index: ', e);
    if (e.relatedContext.element.modelName === 'dashboard') return false;
    return true;
  };

  const jumpRouter = async (tab: any) => {
    if (tab.key === nowKey.value) {
      return;
    }
    nowKey.value = tab.key;
    window.main.tabJumpRouter(cloneDeep(tab));
  };

  onMounted(() => {
    console.log('onMounted', list.value);
    // 监听 view发起的新增/切换 Tab指令
    window.main.viewNewTag((tab: any) => {
      console.log('newTab =', tab);
      list.value.push(tab);
      nowKey.value = tab.key;
      window.main.newTab(cloneDeep(tab));
    });

    window.main.viewSetTag((tab: any) => {
      console.log('setTab =', tab);
      click(tab);
    });

    window.main.viewJumpRouterTab((tab: any) => {
      jumpRouter(tab);
    });
    window.main.onLogin((userInfo: any) => {
      list.value = tabs.getTabsList;
    });
  });
</script>

<style lang="less" scoped>
  .content {
    display: flex;
    width: 100%;
    height: 40px;
    overflow: hidden;
  }
  .center {
    position: relative;
    flex: 1;
  }
  .tabs {
    bottom: 0;
    left: 10px;
    display: flex;
    align-items: center;
    height: 100%;
    position: absolute;
  }

  .list-group {
    position: relative;
  }

  .tabrow {
    position: relative;
    // height: 26px;
    height: 100%;
    overflow: hidden;
    font-size: 12px;
    font-family: 'Alibaba';
    // line-height: 24px;  // 9.14 打包后文字偏上的修改
    line-height: 40px; // 9.14 修改
    margin: 0; // 9.14 修改
    text-align: center;
    list-style: none;
    display: flex;
    flex-direction: row;
  }

  .tabrow li {
    position: relative;
    z-index: 0;
    /* background: -ms-linear-gradient(top, #ECECEC 50%, #D1D1D1 100%);
    background: -moz-linear-gradient(top, #ECECEC 50%, #D1D1D1 100%);
    background: -webkit-linear-gradient(top, #ECECEC 50%, #D1D1D1 100%);
    background: linear-gradient(top, #ECECEC 50%, #D1D1D1 100%); */
    display: inline-block;
    height: 100%;
    line-height: 40px; // ? 9.14 打包后文字偏上的修改
    margin: 0 -5px;
    // padding: 0 30px;
    max-width: 200px;
    min-width: 20px;
    width: var(--tabWidth);
    text-align: center;

    /* box-shadow: 0 3px 3px rgba(0, 0, 0, 0.4), inset 0 1px 0 #FFF; */
    text-shadow: 0 1px #fff;

    /* border: 1px solid #AAA; */

    /* background: #D1D1D1; */
    background: var(--bg1);
    border-top-left-radius: 6px;
    border-top-right-radius: 6px;
    font-size: 0.75rem;
  }

  .tabrow a {
    color: #555;
    text-decoration: none;
  }

  .tabrow li.selected {
    z-index: 2;
    color: #333;
    background: #fff;
    :deep(.tag-link) {
      color: rgb(53, 124, 240);
      font-weight: 500;
    }
    /* border-bottom-color: #FFF; */
  }

  .tabrow::before {
    position: absolute;
    bottom: 0;
    left: 0;

    /* border-bottom: 1px solid #AAA; */
    z-index: 1;
    width: 100%;
    content: ' ';
  }

  .tabrow li::before,
  .tabrow li::after {
    /* border: 1px solid #AAA; */
    position: absolute;
    bottom: 0;
    width: 5px;
    height: 10px;
    content: ' ';
  }

  .tabrow li::before {
    left: -6px;
    border-width: 0 1px 1px 0;
    border-bottom-right-radius: 6px;

    /* box-shadow: 2px 2px 0 #D1D1D1; */
  }

  .tabrow li::after {
    right: -6px;
    border-width: 0 0 1px 1px;
    border-bottom-left-radius: 6px;

    /* box-shadow: -2px 2px 0 #D1D1D1; */
  }

  .tabrow li:hover {
    background: #d7d8da;
    /* z-index: 4; */
  }
  .tabrow .noShow:hover {
    background: var(--bg1);
    /* z-index: 4; */
  }

  .tabrow .noShow {
    padding: 0;
    /* z-index: 4; */
  }

  .tabrow .selected:hover {
    background: #fff;
    /* z-index: 4; */
  }

  .tabrow li.selected::before {
    box-shadow: 2px 2px 0 #fff;
  }

  .tabrow li.selected::after {
    box-shadow: -2px 2px 0 #fff;
  }

  .tabrow .only-tag {
    /* background-color: var(--color-fill-2) !important; */
  }
</style>
