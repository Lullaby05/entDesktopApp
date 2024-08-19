<template>
  <div class="message-list-container">
    <div class="header">
      <span class="header-title">{{ $t('dashboard.message') }}</span>
      <div class="filter-tags">
        <div
          :class="[
            'filter-tag',
            'not-read-tag',
            { active: !active },
            { noReadCount: notReadCount === 0 },
          ]"
          :style="{ '--message-list-count': `'${notReadCount}'` }"
          @click="changeRead(false)"
          >未读</div
        >
        <div
          :class="['filter-tag', { active: active }]"
          @click="changeRead(true)"
          >已读</div
        >
      </div>
      <div class="jump" @click="jumpToMessageCenter"
        >{{ $t('dashboard.viewMore') }}
      </div>
    </div>
    <div class="latest-news-content">
      <div
        v-if="messageList.length"
        class="latest-news-item"
        v-for="(item, index) in messageList"
        :key="index"
        @click="jumpToMessageCenter(item)"
      >
        <div class="news-icon">
          <img :src="item.icon" alt="" />
          <!-- <i class="iconfont" :class="item.icon"></i> -->
        </div>
        <div class="news-content-title">
          <div class="news-title">
            <span class="title">{{ item.title }}</span>
          </div>
          <div class="news-content">
            <div class="message">{{ item.message }}</div>
            <div class="time">{{ item.time }}</div>
          </div>
        </div>
      </div>
      <div v-else class="no-data">
        <img src="@/assets/images/no-message.png" alt="" />
        <span>{{
          !active
            ? $t('dashboard.noUnreadMessage')
            : $t('dashboard.noReadMessage')
        }}</span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { messageLeastList } from '@/api/messageCenter';
  import { messageTypeEnum } from '../types';
  import { formatRelativeDate } from '@/utils/utils';
  import { useRouter } from 'vue-router';

  const router = useRouter();

  const messageList = ref<any[]>([]);
  const notReadCount = ref(0);

  const active = ref(false);
  const changeRead = (name: boolean) => {
    active.value = name;
    initData();
  };
  const initData = async () => {
    const { data } = await messageLeastList({
      limit: 7,
      isResult: active.value,
    });
    notReadCount.value = data.length && data[0].count;
    messageList.value = data.map((item: any) => {
      return {
        icon: messageTypeEnum[item.notifType as keyof typeof messageTypeEnum]
          .icon,
        title:
          messageTypeEnum[item.notifType as keyof typeof messageTypeEnum].title,
        message: (item.title + '！点击查看详情！').substring(0, 23),
        time: formatRelativeDate(item.taskStartTime),
        notifType: item.notifType,
      };
    });
  };

  initData();

  const jumpToMessageCenter = (item: any) => {
    router.push({
      name: 'MessageCenter',
      query: {
        notifyType: item.notifType,
      },
    });
  };
</script>
<style lang="less" scoped>
  .message-list-container {
    border-radius: 4px;
    background-color: var(--bg2);
    width: 36.43%;
    height: 47.56vh;
    box-shadow: var(--color-box-shadow);
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.94rem 1.43rem;
      border-bottom: 1px solid var(--bg4);
      .header-title {
        font-size: 1.14rem;
        font-family: 'Alibaba-Medium';
        color: var(--color-text-black);
      }
      .filter-tags {
        margin-left: auto;
        display: flex;
        align-items: center;
        margin-right: 10px;
        gap: 5px;
        .filter-tag {
          cursor: pointer;
          font-size: 12px;
          border-radius: 10px;
          color: var(--color-text-black);
          background-color: var(--bg4);
          padding: 4px 15px;
          transition: color 0.3s ease-in-out, background-color 0.3s ease-in-out;
          &.active {
            background-color: #d9ebff;
            color: #0079fe;
          }
        }
        .not-read-tag {
          --message-list-count: 0;
          position: relative;
          &::after {
            content: var(--message-list-count);
            width: 1.07rem;
            height: 1.07rem;
            color: #ffffff;
            font-size: 0.71rem;
            background-color: var(--color-red);
            border-radius: 50%;
            position: absolute;
            box-sizing: border-box;
            top: -20%;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          &.noReadCount::after {
            display: none;
          }
        }
      }
      .jump {
        font-size: 1rem;
        cursor: pointer;
        color: #357cf0;
      }
    }
    .latest-news-content {
      padding: 0 17px 10px 15px;
      display: flex;
      flex-direction: column;
      font-size: 0.86rem;
      height: 100%;
      width: 100%;
      overflow: hidden;
      font-family: 'Alibaba';
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
          line-height: 0.86rem;
        }
      }

      .latest-news-item {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 5px;
        cursor: pointer;
        line-height: 1;
        padding: 1.07rem 0;
        border-bottom: 1px solid var(--bg4);
        .news-icon {
          flex: 0 0 auto;
          img {
            width: 1.43rem;
            height: 1.43rem;
            border-radius: 50%;
          }

          .iconfont {
            background-color: #f2f3f6;
          }
        }

        .news-content-title {
          flex: 1;
          display: flex;
          column-gap: 1rem;
          font-size: 0.86rem;
          .news-title {
            flex: 0 0 auto;
            font-size: 1rem;
            font-family: 'Alibaba-Medium';
            color: var(--color-text-black);
          }

          .news-content {
            flex: 1 1 auto;
            display: flex;
            justify-content: space-between;
            align-items: center;
            color: var(--color-text-black);
            .message {
              width: 20rem;
              overflow: hidden;
              white-space: nowrap;
            }
            .time {
              flex: 0 0 auto;
              color: var(--color-text-grey1);
              font-size: 0.79rem;
            }
          }
        }
      }
      .latest-news-item:nth-last-of-type(1) {
        border-bottom: none;
      }
    }
  }
</style>
