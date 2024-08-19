<template>
  <div class="hazard-control-container">
    <div class="title">
      <i class="iconfont icon-icon-yinhuanzhili"></i>
      {{ $t('dashboard.hazardControl.title') }}
    </div>
    <div class="content">
      <div style="display: flex; align-items: center; height: 100%">
        <div class="exist-hazard-num-container">
          <div class="progress-content">
            <a-progress
              :show-text="false"
              :color="
                !noData ? '#d9001b' : theme === 'dark' ? '#4b515e' : '#e0e0e0'
              "
              :track-color="
                !noData ? '#357CF0' : theme === 'dark' ? '#4b515e' : '#e0e0e0'
              "
              class="progress"
              size="medium"
              type="circle"
              :stroke-width="strokeWidth"
              :percent="formatHazardRate"
            />
            <div class="description-text">
              <span class="rate-text">{{
                $t('dashboard.hazardControl.existHazardNum')
              }}</span>
              <span
                ><span class="rate-num">{{ total || 0 }}</span></span
              >
            </div>
          </div>
          <div class="legend">
            <div class="normal">
              {{ $t('dashboard.hazardControl.normalHazard') }}
              <span class="num">
                {{
                  (data['rectifyFinishCount'] &&
                    data['rectifyFinishCount'].lowDangerNum) ||
                  0
                }}
              </span>
            </div>
            <div class="large">
              {{ $t('dashboard.hazardControl.largeHazard') }}
              <span class="num">
                {{
                  (data['rectifyFinishCount'] &&
                    data['rectifyFinishCount'].highDangerNum) ||
                  0
                }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, toRef } from 'vue';
  import {
    findFontSize,
    getRandomInt,
  } from '../screenComponents/composition/useDataScreen';
  import { computed } from 'vue';
  import { useAppStore } from '@/store';
  import { storeToRefs } from 'pinia';

  const strokeWidth = findFontSize(6);

  const props = defineProps({
    data: {
      type: Object,
      default: () => ({}),
    },
  });

  const data = toRef(props, 'data');

  const total = computed(() => {
    if (!data.value['rectifyFinishCount']) return 0;
    return data.value['rectifyFinishCount'].hidSumNum;
  });

  const formatHazardRate = computed(() => {
    if (!data.value['rectifyFinishCount']) return 0;
    if (data.value['rectifyFinishCount'].highDangerNum === 0) return 0;
    return data.value['rectifyFinishCount'].highDangerNum / total.value;
  });

  // 两个都是0说明没有数据
  const noData = computed(() => {
    return (
      data.value['rectifyFinishCount'] &&
      data.value['rectifyFinishCount'].highDangerNum === 0 &&
      data.value['rectifyFinishCount'].lowDangerNum === 0
    );
  });

  const appStore = useAppStore();
  const { theme } = storeToRefs(appStore);
</script>
<style lang="less" scoped>
  .hazard-control-container {
    border-radius: 4px;
    background-color: var(--bg2);
    display: flex;
    flex-direction: column;
    padding: 1.07rem;
    width: 21.43%;
    height: 24.42vh;
    box-shadow: var(--color-box-shadow);
    .title {
      font-size: 1rem;
      font-family: 'Alibaba-Medium';
      color: var(--color-text-black);
      display: flex;
      align-items: center;
      gap: 0.71rem;
      line-height: 1;
      .iconfont {
        border-radius: 4px;
        background-color: var(--color-red);
        font-size: 1rem;
        padding: 3px;
        color: #ffffff;
      }
    }
    .content {
      margin-top: 1rem;
      height: 100%;
    }
    .exist-hazard-num-container {
      height: fit-content;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      :deep(.arco-progress-circle-wrapper) {
        width: 7.5vw !important;
        height: 7.5vw !important;
      }
      .progress-content {
        position: relative;
      }
      .description-text {
        position: absolute;
        width: 7rem;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        font-size: 0.86rem;
        color: var(--color-text-grey2);
        gap: 0.5rem;
        .rate-num {
          font-family: 'Roboto';
          color: var(--color-black-dark1);
          font-weight: 700;
          font-size: 1.43rem;
        }
      }
    }
    .legend {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      align-self: center;
      margin: auto 0px 7px 3rem;
      color: var(--color-text-grey);
      .num {
        font-family: 'Alibaba-Medium';
        font-weight: 700;
        font-size: 0.86rem;
        margin-left: 0.86rem;
        color: var(--color-black-dark1);
      }
      .normal {
        font-size: 0.86rem;
        position: relative;
        &::before {
          content: '';
          width: 0.86rem;
          height: 0.86rem;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(-1.43rem, -50%);
          background-color: var(--color-blue);
        }
      }
      .large {
        font-size: 0.86rem;
        position: relative;
        &::before {
          content: '';
          width: 0.86rem;
          height: 0.86rem;
          position: absolute;
          top: 50%;
          left: 0;
          transform: translate(-1.43rem, -50%);
          background-color: var(--color-red);
        }
      }
    }
  }
</style>
