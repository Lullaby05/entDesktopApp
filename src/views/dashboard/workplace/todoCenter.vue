<template>
  <div class="todo-center-container" v-loading="loading">
    <div class="top">
      <icon-left class="title-icon" @click="back" />
      <span class="todo-title">待办</span>
    </div>
    <div class="bottom">
      <div class="left">
        <div class="left-search">
          <a-input
            allow-clear
            v-model="searchCondition"
            placeholder="搜索待办"
            @clear="getFilterData"
            @keyup.enter="search"
          ></a-input>
        </div>
        <div class="left-filter">
          <div
            v-for="item in option2"
            :key="item.value"
            :class="{ active: todoStatus === item.value }"
            @click="changeStatus(item.value)"
          >
            <div class="text">{{ item.text }}</div>
            <div class="count">{{ item.count }}</div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="right-filter">
          <!-- <div class="popup-todo">
            <a-dropdown>
              <span class="popup-text"
                >{{ filterObj[activeFilter as keyof typeof filterObj]
                }}<icon-caret-down
              /></span>
              <template #content>
                <a-doption
                  v-for="item in option1"
                  :key="item.value"
                  :class="{ active: activeFilter === item.value }"
                  @click="changeFilter(item.value)"
                  ><div class="filter-status">
                    <div>{{ item.text }}</div
                    ><div>{{ item.count }}</div>
                  </div></a-doption
                >
              </template>
            </a-dropdown>
          </div> -->
          <div class="popup-status">
            <a-dropdown>
              <span class="popup-text"
                >{{ filterObj[activeFilter as keyof typeof filterObj]
                }}<icon-caret-down
              /></span>
              <template #content>
                <a-doption
                  v-for="item in option1"
                  :key="item.value"
                  :class="{ active: activeFilter === item.value }"
                  @click="changeFilter(item.value)"
                  ><div class="filter-status">
                    <div>{{ item.text }}</div
                    ><div>{{ item.count }}</div>
                  </div></a-doption
                >
              </template>
            </a-dropdown>
          </div>
          <div class="popup-sort">
            <a-dropdown>
              <span class="popup-text">排序<icon-caret-down /></span>
              <template #content>
                <a-doption
                  v-for="item in option3"
                  :key="item.value"
                  :class="{ active: todoSort === item.value }"
                  @click="changeSort(item.value)"
                >
                  {{ item.text }}</a-doption
                >
              </template>
            </a-dropdown>
          </div>
          <!-- <div class="batch-operation popup-text">批量</div> -->
        </div>
        <div class="todo-content">
          <div
            class="todo-content-item"
            v-for="(item, index) in todoList"
            :key="Math.random()"
          >
            <todo-card :item="item" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { useRouter } from 'vue-router';
  import todoCard from './components/todoCard.vue';
  import { ref } from 'vue';
  import {
    getTodoList,
    getTodoListByCondition,
    getTodoListByFilter,
    getTodoListNum,
  } from '@/api/todo';
  import { todoTypeEnum } from './types';

  const router = useRouter();

  const activeFilter = ref(0);
  const searchCondition = ref('');
  const todoStatus = ref(0);
  const todoSort = ref(0);

  const filterObj = {
    0: '全部',
    1: '隐患排查',
    2: '隐患处理',
    3: '作业申请',
  };

  const statusObj = {
    0: '全部',
    1: '我发起的',
    2: '我参与的',
    3: '已完成',
  };

  const todoList = ref<any[]>([]);

  const option1 = ref<any>([
    { text: '全部', value: 0, count: 0 },
    { text: '隐患排查', value: 1, count: 0 },
    { text: '隐患处理', value: 2, count: 0 },
    { text: '作业申请', value: 3, count: 0 },
  ]);

  const option2 = ref<any>([
    { text: '待我处理', value: 0, count: 0 },
    { text: '我发起的', value: 1, count: 0 },
    { text: '我参与的', value: 2, count: 0 },
    { text: '已完成', value: 3, count: 0 },
  ]);

  const option3 = ref<any>([
    { text: '创建时间从近到远', value: 0 },
    { text: '创建时间从远到近', value: 1 },
    { text: '截止时间从近到远', value: 2 },
    { text: '截止时间从远到近', value: 3 },
  ]);

  const loading = ref(false);
  const getFilterData = async () => {
    loading.value = true;
    try {
      const { data } = await getTodoListByFilter({
        sort: todoSort.value,
        status: todoStatus.value,
        type: activeFilter.value,
        condition: searchCondition.value,
      });
      todoList.value = data.map((ele: any) => {
        return {
          ...ele,
          ...ele.content,
          needEdit: todoStatus.value !== 3,
        };
      });
    } catch (error) {
      // console.log(error)
    } finally {
      loading.value = false;
    }
  };

  const getConditionData = async () => {
    loading.value = true;
    try {
      const { data } = await getTodoListByCondition(searchCondition.value);
      todoList.value = data.map((ele: any) => {
        return {
          ...ele,
          ...ele.content,
          needEdit: todoStatus.value !== 3,
        };
      });
    } catch (error) {
      // console.log(error)
    } finally {
      loading.value = false;
    }
  };

  const getCount = async () => {
    loading.value = true;
    try {
      const { data: tabNum } = await getTodoListNum({
        status: todoStatus.value,
        type: activeFilter.value,
        condition: searchCondition.value,
      });
      const typeOption = option1.value.map((ele: any) => {
        const obj = {
          0: 'typeAll',
          1: 'check',
          2: 'hazard',
          3: 'operation',
        };
        return {
          ...ele,
          count: tabNum[obj[ele.value as keyof typeof obj]],
        };
      });
      const statusOption = option2.value.map((ele: any) => {
        const obj = {
          0: 'statusAll',
          1: 'apply',
          2: 'ido',
          3: 'done',
        };
        return {
          ...ele,
          count: tabNum[obj[ele.value as keyof typeof obj]],
        };
      });
      option1.value = typeOption;
      option2.value = statusOption;
    } catch (error) {
      // console.log(error)
    } finally {
      loading.value = false;
    }
  };

  const initData = async () => {
    getCount();
    getFilterData();
  };

  initData();

  const changeFilter = (index: number) => {
    activeFilter.value = index;
    getFilterData();
    getCount();
  };

  const changeStatus = (index: number) => {
    todoStatus.value = index;
    getFilterData();
    getCount();
  };

  const changeSort = (index: number) => {
    todoSort.value = index;
    getFilterData();
  };

  const search = () => {
    // getConditionData();
    getFilterData();
    getCount();
  };

  const back = () => {
    router.back();
  };
</script>
<style lang="less" scoped>
  .todo-center-container {
    // padding: 1rem;
    height: calc(100vh - 2rem - 100px);
    overflow: hidden;
    margin: 10px 1rem 1rem 1rem !important;
    display: flex;
    flex-direction: column;
    background-color: var(--bg2);
    .top {
      font-size: 18px;
      padding: 10px 10px;
      border-bottom: 1px solid var(--bg1);
      .todo-title {
        font-family: 'Alibaba-Medium';
        margin-left: 10px;
      }
    }
    .bottom {
      flex: 1;
      display: flex;
      overflow: hidden;
    }
    .left {
      width: 196px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--bg4);
      .left-search {
        padding: 10px 0;
        border-bottom: 1px solid var(--bg4);
        text-align: center;
        :deep(.arco-input-wrapper) {
          width: 90%;
          border: 1px solid var(--bg4);
        }
      }
      .left-filter {
        display: flex;
        flex-direction: column;
        > div {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          line-height: 48px;
          padding: 0 1rem;
          .count {
            font-size: 12px;
            width: 20px;
            height: 20px;
            line-height: 20px;
            text-align: center;
          }
          &.active {
            background-color: var(--color-bg-active1);
            color: #357cf0;
            .count {
              box-sizing: border-box;
              border-radius: 50%;
              background-color: #d9001b;
              color: #ffffff;
            }
          }
        }
      }
    }
    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      .right-filter {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        padding: 10px 2rem;
        line-height: 32px;
        gap: 60px;
        border-bottom: 1px solid var(--bg4);
        > div {
          width: 80px;
        }
        .popup-text {
          cursor: pointer;
        }
      }
      .todo-content {
        padding: 5px;
        overflow-y: scroll;
        .todo-content-item {
          :deep(.todo-card-container) {
            font-size: 16px;
            padding: 10px;
          }
          :deep(.todo-content .flex) {
            font-size: 14px;
            .field {
              flex: 0 0 auto;
              min-width: 20%;
            }
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .arco-dropdown-option-content {
    width: 100%;
    .filter-status {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 50px;
    }
  }
  .arco-dropdown-option.active {
    background-color: var(--color-bg-active1);
    color: #357cf0;
    &:hover {
      color: #357cf0;
    }
  }
</style>
