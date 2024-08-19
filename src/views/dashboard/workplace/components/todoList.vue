<template>
  <div class="todo-list-container">
    <div class="header">
      <span
        class="header-title"
        :class="{ noReadCount: notHandledCount === 0 }"
        :style="{ '--todo-list-count': `'${notHandledCount}'` }"
        >{{ $t('dashboard.todo') }}</span
      >
      <div class="jump" @click="jumpToTodo"
        >{{ $t('dashboard.viewMore') }}
      </div>
    </div>
    <div class="content">
      <div
        v-if="todoList.length"
        class="todo-list-item"
        v-for="(item, index) in todoList"
        :key="index"
      >
        <todoCard :item="item" />
      </div>
      <div v-else class="no-data">
        <img src="@/assets/images/no-todo.png" alt="" />
        <span>{{ $t('dashboard.noTodo') }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { computed, ref } from 'vue';
  import { getRandomInt } from '../screenComponents/composition/useDataScreen';
  import { getTodoList } from '@/api/todo';
  import todoCard from './todoCard.vue';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const todoList = ref<any[]>([]);
  const notHandledCount = ref(0);

  const initData = async () => {
    const { data } = await getTodoList();
    notHandledCount.value = data.length;
    todoList.value = data
      .sort((a: any, b: any) => {
        return +new Date(b.startTime) - +new Date(a.startTime);
      })
      .map((ele: any) => {
        return {
          ...ele,
          ...ele.content,
          needEdit: true,
        };
      });
  };

  initData();

  const jumpToTodo = () => {
    router.push({
      name: 'TodoCenter',
    });
  };
</script>
<style lang="less" scoped>
  .todo-list-container {
    border-radius: 4px;
    background-color: var(--bg2);
    width: 36.43%;
    height: 47.56vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: var(--color-box-shadow);
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1.07rem 1.43rem;
      border-bottom: 1px solid var(--bg4);
      .header-title {
        font-size: 1.14rem;
        font-family: 'Alibaba-Medium';
        color: var(--color-text-black);
        --todo-list-count: 0;
        position: relative;
        &.noReadCount::after {
          display: none;
        }
        &::after {
          content: var(--todo-list-count);
          width: 1.07rem;
          height: 1.07rem;
          color: #ffffff;
          font-size: 0.71rem;
          text-align: center;
          line-height: 1.07rem;
          background-color: var(--color-red);
          border-radius: 50%;
          position: absolute;
          box-sizing: border-box;
          top: 50%;
          right: -50%;
          transform: translate(0.2rem, -50%);
        }
      }
      .jump {
        font-size: 1rem;
        cursor: pointer;
        color: #357cf0;
      }
    }
    .content {
      flex: 1;
      padding: 5px 12px 5px 10px;
      display: flex;
      flex-direction: column;
      gap: 5px;
      align-items: center;
      height: 100%;
      width: 100%;
      overflow: auto;
      // &::-webkit-scrollbar {
      //   width: 0;
      // }
      .no-data {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        img {
          width: 21.43rem;
          height: fit-content;
          object-fit: cover;
        }
        span {
          flex: 0 0 auto;
          color: var(--color-text-grey1);
          font-size: 0.86rem;
        }
      }
      .todo-list-item {
        width: 100%;
      }
    }
  }
</style>
