<template>
  <div class="todo-card-container" @click="jumpToUrl">
    <div class="todo-title-time">
      <div class="title">
        <div class="title-icon">
          <img
            :src="typeToFields[configItem.type as keyof typeof typeToFields].icon"
            alt=""
          />
        </div>
        <span class="title-span">{{
          typeToFields[configItem.type as keyof typeof typeToFields].title
        }}</span>
        <span
          v-if="configItem.isTimeout"
          class="title-span"
          style="color: #d9001b"
          >（已超时）</span
        >
      </div>
      <div class="task-status">
        <a-tag
          :color="
            configItem.isError
              ? 'rgba(245, 63, 63, 0.2)'
              : 'rgba(53, 124, 240, 0.2)'
          "
          :style="{
            '--tag-primary-color': configItem.isError ? '#F53F3F' : '#357CF0',
            'border-radius': '5px',
            'border-color': 'transparent',
          }"
          >{{ configItem.status }}</a-tag
        >
      </div>
    </div>
    <div class="todo-taskname-status">
      <div class="task-name">{{ configItem.taskName }}</div>
      <div class="time">
        <span class="time-span">{{ configItem.time }}</span>
      </div>
    </div>
    <div class="todo-content">
      <div class="flex">
        <div
          v-for="(item, index) in typeToFields[configItem.type as keyof typeof typeToFields].configs"
          :key="index"
          :class="item.row ? 'row' : 'field'"
        >
          <span v-if="item.valueKey !== 'timeRange'"
            ><span v-if="item.label" class="label" :style="item.labelStyle">{{
              item.label + '：'
            }}</span
            ><span :style="item.valueStyle">{{
              configItem[item.valueKey]
            }}</span></span
          >
          <span v-else
            ><span class="label">{{ item.label + '：' }}</span
            ><span v-if="configItem[item.timeStartKey!]">{{
              configItem[item.timeStartKey!] +
              '至' +
              configItem[item.timeEndKey!]
            }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { todoTypeEnum, typeToFields } from '../types';
  import { formatRelativeDate } from '@/utils/utils';
  import useRouterJump from '@/hooks/routerJump';

  const props = defineProps({
    item: {
      type: Object,
      default: () => ({}),
    },
  });
  let item = props.item;
  item.type = item.type.replace('TODO', 'NOTICE');

  const configItem = ref<any>({});

  if (item.type === todoTypeEnum.PITFALL) {
    typeToFields[item.type as keyof typeof typeToFields].configs[0].valueStyle =
      item.dangerLevelCode === '1' ? 'color: #d9001b' : 'color: #357CF0';
  }

  configItem.value = Object.assign(
    {
      ...item,
      time: formatRelativeDate(item.startTime),
      taskName: item.title,
      isError: item.status.includes('不通过') || item.status.includes('逾期'),
    },
    typeToFields[item.type as keyof typeof typeToFields]
  );

  const { jumpWithTab } = useRouterJump();

  const jumpToUrl = () => {
    if (configItem.value.jump) {
      jumpWithTab(configItem.value.jump.apply(configItem.value));
    }
  };
</script>
<style lang="less" scoped>
  .todo-card-container {
    --tag-primary-color: #1989fa;
    padding: 5px;
    background-color: var(--bg2);
    border-bottom: 1px solid var(--bg4);
    font-size: 0.86rem;
    line-height: 2rem;
    cursor: pointer;
    font-family: 'Alibaba';
    padding-left: 10px;

    .title-icon {
      font-size: 1.43rem;
      img {
        width: 1.43rem;
        height: 1.43rem;
        border-radius: 50%;
      }
      // .iconfont {
      //   border-radius: 50%;
      //   padding: 0.5rem;
      //   background-color: #f2f3f6;
      // }
    }

    .todo-title-time {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title {
        display: flex;
        align-items: center;
        gap: 5px;
        box-sizing: border-box;
        font-size: 1rem;
        line-height: 1;
        font-family: 'Alibaba-Medium';
        color: var(--color-text-black);
      }
      .task-status .arco-tag-size-medium {
        font-size: 0.86rem;
      }
    }

    .todo-taskname-status {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      padding-left: 25px;
      gap: 10px;
      .time {
        flex: 0 0 auto;
        font-size: 0.79rem;
        color: var(--color-text-grey1);
      }

      .task-name {
        word-break: break-all;
        font-family: 'Alibaba';
        font-weight: 400;
        color: var(--color-text-black);
      }
    }

    .todo-content {
      font-size: 0.86rem;
      padding-left: 25px;
      color: var(--color-text-grey1);

      .flex {
        display: flex;
        flex-wrap: wrap;

        .field {
          flex: 0 0 50%;
        }

        .row {
          flex: 0 0 100%;
        }
      }
    }
  }
  :deep(.arco-tag-checked) {
    background-color: transparent;
    color: var(--tag-primary-color);
    border-color: var(--tag-primary-color);
  }
</style>
