<template>
  <div class="message-center-container">
    <div class="top">
      <icon-left class="title-icon" @click="back" />
      <span class="todo-title">消息中心</span>
    </div>
    <div class="bottom">
      <div class="left">
        <div class="left-filter">
          <div class="message-center-header">
            <div
              :class="['filter-tag', { active: active === 'all' }]"
              @click="changeRead('all')"
              >全部</div
            >
            <div
              :class="['filter-tag', { active: active === 'unread' }]"
              @click="changeRead('unread')"
              >未读</div
            >
            <div
              :class="['filter-tag', { active: active === 'read' }]"
              @click="changeRead('read')"
              >已读</div
            >
          </div>
          <div class="message-center-content">
            <div v-for="(item, index) in messageCenterList" :key="index">
              <div
                v-if="item.title"
                class="message-list-item"
                :class="{ active: activeType === item.notif_type }"
                @click="changeActiveType(index)"
              >
                <div class="message-icon">
                  <img :src="item.icon" alt="" />
                </div>
                <div class="message-content">
                  <div class="message-title">{{ item.taskName }}</div>
                  <div class="message-warning-span">{{ item.title }}</div>
                </div>
                <div class="message-description">
                  <div class="message-time">{{ item.time }}</div>
                  <div
                    class="message-unread-num"
                    :class="{ unreadRound: item.count.length === 1 }"
                    v-if="item.count != '0'"
                    >{{ item.count > 99 ? '99+' : item.count }}</div
                  >
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <div class="right-header">
          <div class="message-icon" v-if="activeTypeListIcon">
            <img :src="activeTypeListIcon" alt="" />
          </div>
          <div class="message-title">{{ activeTypeListTitle }}</div>
        </div>
        <div class="right-message-content" ref="messageContentRef">
          <div class="message-detail-list">
            <div
              class="message-item"
              v-for="(item, index) in activeTypeList"
              :class="{ 'first-not-read': index === firstNotRead }"
              :key="index"
            >
              <div class="message-time">
                <span class="time-text">{{ item.createTime }}</span>
              </div>
              <div class="message-content">
                <div class="message-icon">
                  <img :src="activeTypeListIcon" alt="" />
                </div>
                <div class="message-card" @click="jumpToDetail(item)">
                  <div class="message-title">{{ item.title }}</div>
                  <div class="message-warning-text" style="color: #f59a23">{{
                    item.warning
                  }}</div>
                  <div class="flex">
                    <div
                      v-for="(ele, i) in item.contentObject"
                      :key="i"
                      class="row"
                    >
                      <span v-if="!ele.isHidden"
                        ><span class="label">{{ ele.name + '：' }}</span
                        >{{ ele.value }}</span
                      >
                    </div>
                  </div>
                  <div
                    class="message-btn"
                    v-if="!item.isCompleted && item.buttonDesc && !item.hideBtn"
                  >
                    <a-button type="primary" size="small">{{
                      item.buttonDesc
                    }}</a-button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div
            class="not-read-jump"
            v-if="hasNotRead"
            @click="jumpToFirstNotRead"
          >
            <icon-double-up />
            <span class="not-read-text">{{ notReadCountRef }}条新消息</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import {
    formatRelativeDate,
    formatRelativeDateForMessage,
  } from '@/utils/utils';
  import { ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { messageTypeEnum } from './types';
  import {
    messageCenterListApi,
    messageCenterTypeList,
  } from '@/api/messageCenter';
  import { nextTick } from 'vue';
  import useRouterJump from '@/hooks/routerJump';
  import { useRoute } from 'vue-router';

  const router = useRouter();
  const route = useRoute();
  const active = ref('all');

  const messageCenterList = ref<any[]>([]);
  const messageAllCenterList = ref<any[]>([]);
  const activeType = ref('');

  const activeTypeList = ref<any[]>([]);
  const activeTypeListIcon = ref();
  const activeTypeListTitle = ref();

  const messageContentRef = ref<any>(null);

  const firstNotRead = ref<any>(null);
  const hasNotRead = ref(false);
  const notReadCountRef = ref(0);
  const firstEnter = ref(false);

  const { notifyType } = route.query;

  const initData = async () => {
    const { data } = await messageCenterListApi();
    messageAllCenterList.value = data
      .filter((ele: any) => ele.title)
      .sort((a: any, b: any) => {
        if (!a.time || !b.time) {
          return true;
        }
        return new Date(b.time).getTime() - new Date(a.time).getTime();
      })
      .map((ele: any) => {
        return {
          ...ele,
          time: formatRelativeDate(ele.time),
          icon: messageTypeEnum[ele.notif_type as keyof typeof messageTypeEnum]
            .icon,
          taskName:
            messageTypeEnum[ele.notif_type as keyof typeof messageTypeEnum]
              .title,
        };
      });
    messageCenterList.value = messageAllCenterList.value;
    let index = 0;
    if (notifyType) {
      index = messageCenterList.value.findIndex(
        (ele: any) => ele.notif_type === notifyType
      );
    }
    messageCenterList.value.length && changeActiveType(index);
  };

  initData();

  const changeActiveType = async (index: number) => {
    messageContentRef.value.removeEventListener('scroll', judgeInSite);
    // 左边消息列表为空
    if (!messageCenterList.value.length) {
      activeTypeList.value = [];
      activeTypeListIcon.value = '';
      activeTypeListTitle.value = '';
      return;
    }
    activeType.value = messageCenterList.value[index].notif_type;
    messageCenterList.value[index].count = '0';
    const { data } = await messageCenterTypeList(activeType.value);
    let notReadCount = 0;
    const messageList = data.map((ele: any, index: number) => {
      if (!ele.isResult) {
        notReadCount++;
        if (firstNotRead.value === null) {
          firstNotRead.value = index;
        }
      }
      let warning = '';
      let warningType = '';
      if (activeType.value === 'NOTICE_CHECK') {
        ele.hideBtn = false;
        const startTimeDis = Math.floor(
          (+new Date(ele.taskStartTime) - +new Date()) / (1000 * 60)
        ); //开始时间和当前时间的距离(分钟)
        const endTimeDis = Math.floor(
          (+new Date(ele.taskEndTime) - +new Date()) / (1000 * 60)
        ); // 截止时间和当前时间的距离(分钟)
        if (startTimeDis <= 30 && startTimeDis > 0) {
          // 距离开始时间还有三十分钟以内
          warning = `距离任务开始时间还有${startTimeDis}分钟`;
          warningType = 'warning';
          ele.hideBtn = true;
        }
        if (endTimeDis <= 30 && endTimeDis >= 0) {
          warning = `距离任务截止时间还有${endTimeDis}分钟`;
          warningType = 'warning';
        }
        if (endTimeDis < 0 && endTimeDis >= -30) {
          warning = `已经逾期${-endTimeDis}分钟`;
          warningType = 'error';
        }
      }
      if (
        activeType.value === 'NOTICE_HAZARD_REPORT' ||
        activeType.value === 'NOTICE_SNAPSHOT'
      ) {
        ele.isCompleted = false;
      }
      return {
        ...ele,
        contentObject: ele.contentObject.sort(
          (a: any, b: any) => a.sort - b.sort
        ),
        warning,
        warningType,
        createTime: formatRelativeDateForMessage(ele.createTime),
        jump: messageTypeEnum[activeType.value as keyof typeof messageTypeEnum]
          .jump,
      };
    });
    const icon =
      messageTypeEnum[activeType.value as keyof typeof messageTypeEnum].icon;
    const title =
      messageTypeEnum[activeType.value as keyof typeof messageTypeEnum].title;
    notReadCountRef.value = notReadCount;
    firstEnter.value = true;
    activeTypeList.value = messageList;
    activeTypeListIcon.value = icon;
    activeTypeListTitle.value = title;
    if (messageContentRef.value) {
      nextTick(() => {
        messageContentRef.value.scrollTop =
          messageContentRef.value.scrollHeight;
        messageContentRef.value.addEventListener('scroll', judgeInSite);
        judgeInSite();
        firstEnter.value = false;
      });
    }
  };

  const judgeInSite = () => {
    if (!notReadCountRef.value) return;
    if (!firstEnter.value && !hasNotRead.value) return;
    const firstNotReadDom = document.querySelector('.first-not-read');
    if (!firstNotReadDom) return;
    const { top, height } = firstNotReadDom!.getBoundingClientRect();
    if (
      top < messageContentRef.value.getBoundingClientRect().height &&
      top + height > 0
    ) {
      hasNotRead.value = false;
    } else {
      hasNotRead.value = notReadCountRef.value > 0;
    }
  };

  const jumpToFirstNotRead = () => {
    hasNotRead.value = false;
    messageContentRef.value.scrollTo({
      top:
        messageContentRef.value.scrollHeight +
        document.querySelector('.first-not-read').getBoundingClientRect().top -
        messageContentRef.value.offsetHeight -
        120,
      behavior: 'smooth',
    });
  };

  const changeRead = (name: string) => {
    active.value = name;
    messageCenterList.value = messageAllCenterList.value.filter((ele: any) => {
      if (name === 'all') {
        return true;
      } else {
        return name === 'unread' ? ele.count > 0 : ele.count <= 0;
      }
    });
    changeActiveType(0);
  };

  const { jumpWithTab } = useRouterJump();

  const jumpToDetail = (item: any) => {
    const obj: any = {};
    item.contentObject.forEach((item: any) => {
      obj[item.key] = item.value;
    });
    if (item.jump) {
      jumpWithTab(item.jump.apply({ ...item, ...obj }));
    }
  };

  const back = () => {
    router.back();
  };
</script>
<style lang="less" scoped>
  .message-center-container {
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
      flex: 0 0 315px;
      width: 315px;
      display: flex;
      flex-direction: column;
      border-right: 1px solid var(--bg4);
      .left-filter {
        overflow: hidden;
        display: flex;
        flex-direction: column;
        .message-center-header {
          background-color: var(--bg2);
          flex: 0 0 auto;
          display: flex;
          padding: 10px;
          gap: 15px;
          border-bottom: 0.5px solid var(--bg4);

          .filter-tag {
            cursor: pointer;
            font-size: 13px;
            border-radius: 10px;
            background-color: var(--bg4);
            padding: 4px 15px;
            transition: color 0.3s ease-in-out,
              background-color 0.3s ease-in-out;
            color: var(--color-text-black);
            &.active {
              background-color: #d9ebff;
              color: var(--color-blue);
            }
          }
        }
        .message-center-content {
          overflow: auto;
          flex: 1;
          &::-webkit-scrollbar {
            width: 0;
          }
          .message-list-item {
            cursor: pointer;
            background-color: var(--bg2);
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 15px;
            margin: 0px 7px;
            padding: 13px 8px 13px 17px;
            border-radius: 10px;
            // border-bottom: 0.5px solid var(--bg4);
            font-size: 12px;
            line-height: 20px;

            .message-icon {
              img {
                width: 3.14rem;
                height: 3.14rem;
                border-radius: 50%;
              }
              .iconfont {
                border-radius: 50%;
                padding: 0.5rem;
                background-color: #f2f3f6;
              }
            }

            .message-content {
              flex: 1;
              line-height: 1;

              .message-title {
                font-family: 'Alibaba-Medium';
                font-weight: 500;
                font-size: 14px;
                color: var(--color-text-black);
                padding-bottom: 10px;
              }

              .message-warning-span {
                width: 155px;
                color: var(--color-text-grey1);
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              }
            }

            .message-description {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              align-items: flex-end;
              height: 40px;

              .message-time {
                color: #7f7f7f;
              }

              .message-unread-num {
                font-size: 0.71rem;
                width: fit-content;
                color: #ffffff;
                background-color: #d9001b;
                border-radius: 15px;
                padding: 0 6px;
                line-height: 20px;
                &.unreadRound {
                  border-radius: 50%;
                }
              }
            }

            &.active {
              background-color: var(--color-bg-active1);
              .message-title {
                color: var(--color-text-black);
              }
            }
          }
        }
      }
    }
    .right {
      flex: 1;
      display: flex;
      flex-direction: column;
      position: relative;
      .right-header {
        flex: 0 0 44px;
        height: 44px;
        display: flex;
        align-items: center;
        padding: 10px 10px;
        border-bottom: 1px solid var(--bg4);
        gap: 10px;
        .message-icon {
          img {
            width: 2.5rem;
            height: 2.5rem;
            border-radius: 50%;
          }
          .iconfont {
            line-height: 38px;
            border-radius: 50%;
            padding: 0.5rem;
            background-color: #f2f3f6;
          }
        }
        .message-title {
          // font-weight: bold;
          font-family: 'Alibaba-Medium';
          font-size: 1.2rem;
        }
      }
      .right-message-content {
        background-color: var(--bg2);
        flex: 1;
        overflow: auto;
        /* 定义滚动条整体宽度 */
        &::-webkit-scrollbar {
          width: 10px; /* 水平滚动条宽度 */
          height: 10px; /* 垂直滚动条高度 */
        }

        /* 定义滚动条轨道（背景）样式 */
        &::-webkit-scrollbar-track {
          background-color: rgba(0, 0, 0, 0.1); /* 轨道颜色为半透明黑色 */
          border-radius: 6px; /* 边缘圆角 */
        }

        /* 定义滚动条拇指（拖动部分）样式 */
        &::-webkit-scrollbar-thumb {
          background-color: #888; /* 滚动条主体颜色 */
          border-radius: 6px; /* 滚动条滑块圆角 */
          border: 2px solid transparent; /* 滚动条滑块边框，这里设置为透明以保持简洁 */
          box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3); /* 给滑块添加阴影效果，增加立体感 */

          /* 鼠标悬停时的滚动条样式 */
          &:hover {
            background-color: #555;
          }

          /* 鼠标点击或激活时的滚动条样式 */
          &:active {
            background-color: #333;
          }
        }
        .message-detail-list {
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          justify-content: center;
          gap: 30px;

          .message-item {
            display: flex;
            flex-direction: column;
            gap: 20px;

            .message-time {
              color: #7f7f7f;
              text-align: center;
              font-size: 12px;

              .time-text {
                padding: 2.5px 10px;
                border-radius: 5px;
                box-sizing: border-box;
                color: #6f7173;
              }
            }

            .message-content {
              padding: 0 15% 0 13px;
              display: flex;
              gap: 10px;
              width: 50%;

              .message-icon {
                img {
                  width: 2.5rem;
                  height: 2.5rem;
                  border-radius: 50%;
                }
                .iconfont {
                  border-radius: 50%;
                  padding: 0.5rem;
                  background-color: #f2f3f6;
                }
              }

              .message-card {
                width: 100%;
                background-color: var(--bg2);
                border-radius: 10px;
                padding: 15px;
                line-height: 28px;
                font-size: 12px;
                cursor: pointer;
                border: 1px solid var(--color-card-border);

                .message-title,
                .message-warning-text {
                  font-size: 14px;
                  font-weight: bold;
                }

                .message-btn {
                  text-align: center;
                  padding-top: 10px;

                  button {
                    width: 100%;
                  }
                }

                .flex {
                  display: flex;
                  flex-wrap: wrap;
                  font-size: 13px;

                  .field {
                    flex: 0 0 50%;
                  }

                  .row {
                    flex: 0 0 100%;
                  }
                }
              }
            }
          }
        }
        .not-read-jump {
          cursor: pointer;
          background-color: var(--bg7);
          position: absolute;
          top: 69px;
          right: 15px;
          // transform: translate(-50%, -50%);
          width: fit-content;
          padding: 7.5px 10px;
          height: 30px;
          border-radius: 25px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 5px;
          // border: 0.5px solid var(--color-text-grey);
          // border-right: none;
          color: #23c343;
          box-shadow: 0 -2px 8px 1px var(--color-box-shadow);
          z-index: 99;
        }
      }
    }
  }
</style>
