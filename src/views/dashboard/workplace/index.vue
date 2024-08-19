<template>
  <div class="container">
    <div class="refresh-icon">
      <i
        class="iconfont minor-icon icon-refresh-icon"
        v-preventReClick
        @click="reload"
      ></i>
    </div>
    <div>
      <!-- <div class="container-title">
      <span>{{ $t('dashboard.areaSafetyOverview') }}</span>
      <a-space>
        <icon-refresh
          v-preventReClick
          class="minor-icon"
          size="20"
          @click="reload"
        />
      </a-space>
    </div> -->
      <div class="heard">
        <controlRisk :data="pitfallData" />
        <hazardCount :data="pitfallData" />
        <hazardControl :data="pitfallData" />
        <specialOperation />
      </div>
      <div class="center">
        <div class="left">
          <a-avatar :size="48">
            <img alt="avatar" :src="avatar" />
          </a-avatar>
          <div class="welcome-text">
            <div class="welcome-person-text">
              {{ userInfo.userName || userInfo.nickname }}
              {{ $t('dashboard.welcome') }}
            </div>
            <div class="welcome-job">
              <span>{{ userInfo.enterpriseName }}</span>
              <span v-if="userInfo.deptName"> - {{ userInfo.deptName }}</span>
              <span v-if="userInfo.jobName"> - {{ userInfo.jobName }}</span>
            </div>
          </div>
        </div>
        <!-- <div class="right">
        <div class="finish-rate">
          <div class="chart-title">
            <span class="chart-description" style="font-size: 1rem">{{
              $t('dashboard.workCompletionRate')
            }}</span>
            <span class="chart-value">
              <span style="font-size: 1.43rem; color: #000000">{{
                finishRateText.finishRate
              }}</span>
              <span>%</span>
            </span>
          </div>
          <div class="chart-content">
            <a-progress
              :show-text="false"
              color="rgb(233,233,233)"
              track-color="#357CF0"
              class="progress"
              size="large"
              type="circle"
              :stroke-width="6"
              :percent="1 - finishRateText.finishRate / 100"
            />
          </div>
        </div>
        <division color="rgb(217,217,217)" height="4rem" />
        <div class="finish-ontime-rate">
          <div class="chart-title">
            <span class="chart-description" style="font-size: 1rem">{{
              $t('dashboard.onTimeCompletionRate')
            }}</span>
            <span class="chart-value">
              <span style="font-size: 1.43rem; color: #000000">{{
                finishRateText.finishOntimeRate
              }}</span>
              <span>%</span>
            </span>
          </div>
          <div class="chart-content">
            <a-progress
              :show-text="false"
              color="rgb(233,233,233)"
              track-color="#98D87D"
              class="progress"
              size="large"
              type="circle"
              :stroke-width="6"
              :percent="1 - finishRateText.finishOntimeRate / 100"
            />
          </div>
        </div>
      </div> -->
      </div>
      <div class="bottom">
        <todoList />
        <messageCenter />
        <div
          style="display: flex; flex-direction: column; flex: 1; gap: 1.07rem"
        >
          <quickNavigation />
          <recentView />
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import controlRisk from './components/controlRisk.vue';
  import hazardCount from './components/hazardCount.vue';
  import hazardControl from './components/hazardControl.vue';
  import specialOperation from './components/specialOperation.vue';
  import { computed, inject, onMounted, ref } from 'vue';
  import { useAppStore, useUserStore } from '@/store';
  import division from './screenComponents/division.vue';
  import todoList from './components/todoList.vue';
  import messageCenter from './components/messageCenterList.vue';
  import quickNavigation from './components/quickNavigation.vue';
  import recentView from './components/recentView.vue';
  import { getFinishRate, getPitfallStatistics } from '@/api/dashboard';

  const reload: () => void = inject('reload')!;

  const userStore = useUserStore();
  const avatar = computed(() => {
    return userStore.userInfo.avatar;
  });
  const userInfo = computed(() => {
    return userStore.userInfo;
  });

  const pitfallData = ref({});

  const initPitfallData = async () => {
    const { data } = await getPitfallStatistics();
    pitfallData.value = data;
  };

  initPitfallData();
</script>

<script lang="ts">
  export default {
    name: 'Dashboard', // If you want the include property of keep-alive to take effect, you must name the component
  };
</script>
<style lang="less">
  // responsive
  .mobile {
    .container {
      display: block;
    }

    .right-side {
      // display: none;
      width: 100%;
      margin-top: 16px;
      margin-left: 0;
    }
  }
  @media screen and (min-width: 1366px) {
    :root {
      font-size: 12px !important;
    }
  }
  @media screen and (min-width: 1600px) {
    :root {
      font-size: 14px !important;
    }
  }
  @media screen and (min-width: 1920px) {
    :root {
      font-size: 14px !important;
    }
  }
  @media screen and (min-width: 2560px) {
    :root {
      font-size: 16px !important;
    }
  }
</style>
<style lang="less" scoped>
  .container {
    // padding: 2.14rem;
    height: calc(100vh - 100px);
    overflow: hidden;
    box-sizing: border-box;
    font-family: 'Alibaba';
  }
  .container-title {
    padding-bottom: 1.07rem;
    font-size: 1.14rem;
    font-family: 'Alibaba-Medium';
    color: var(--color-text-black);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .heard {
    display: flex;
    gap: 1.5%;
  }

  .center {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin: 1.43rem 0;
    padding: 0.71rem 1.43rem;
    background-color: var(--bg2);
    border-radius: 4px;
    box-shadow: var(--color-box-shadow);
    .left {
      display: flex;
      align-items: center;
      gap: 0.71rem;
      .welcome-text {
        height: 100%;
        display: flex;
        flex-direction: column;
        gap: 0.86rem;
        .welcome-person-text {
          font-size: 1.14rem;
          line-height: 1.14rem;
          font-family: 'Alibaba-Medium';
          color: var(--color-text-black);
        }
        .welcome-job {
          font-family: 'Alibaba';
          font-weight: 400;
          font-size: 0.86rem;
          line-height: 0.86rem;
          color: var(--color-text-grey1);
        }
      }
    }
    .right {
      display: flex;
      align-items: center;
      gap: 1.07rem;
      .finish-rate,
      .finish-ontime-rate {
        display: flex;
        align-items: center;
        gap: 1rem;
        :deep(.arco-progress-circle-wrapper) {
          width: 4rem !important;
          height: 4rem !important;
        }
        .chart-title {
          display: flex;
          flex-direction: column;
          align-items: center;
          line-height: 1.71rem;
        }
      }
    }
  }
  .bottom {
    display: flex;
    gap: 1.07rem;
  }
  .minor-icon {
    color: #8c8c8c;
    cursor: pointer;
  }
  .refresh-icon {
    position: absolute;
    top: 65px;
    right: 30px;
  }
</style>
