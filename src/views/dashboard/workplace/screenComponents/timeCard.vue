<template>
  <div class="time-card-container">
    <div class="time-card">
      <div class="time-card-item"
        ><span class="hour">{{ hour[0] }}</span></div
      >
      <div class="time-card-item"
        ><span class="hour">{{ hour[1] }}</span></div
      >
      <div class="divide">:</div>
      <div class="time-card-item"
        ><span class="minute">{{ minute[0] }}</span></div
      >
      <div class="time-card-item"
        ><span class="minute">{{ minute[1] }}</span></div
      >
      <div class="divide">:</div>
      <div class="time-card-item"
        ><span class="second">{{ second[0] }}</span></div
      >
      <div class="time-card-item"
        ><span class="second">{{ second[1] }}</span></div
      >
    </div>
    <div class="date-part">
      <div class="date">{{ date }}</div>
      <div class="day-for-week">{{ weekday }}</div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { formatDate } from '@/utils/utils';
  import { computed } from 'vue';
  import { ref } from 'vue';

  const now = ref(new Date());
  const date = computed(() => {
    return formatDate(now.value, 'yyyy-MM-DD');
  });
  const daysOfWeek = [
    '星期日',
    '星期一',
    '星期二',
    '星期三',
    '星期四',
    '星期五',
    '星期六',
  ];
  const dayOfWeek = computed(() => {
    return now.value.getDay();
  });

  const weekday = computed(() => {
    return daysOfWeek[dayOfWeek.value];
  });
  const hour = computed(() => {
    return formatDate(now.value, 'HH').split('');
  });
  const minute = computed(() => {
    return formatDate(now.value, 'mm').split('');
  });
  const second = computed(() => {
    return formatDate(now.value, 'ss').split('');
  });

  const initDate = () => {
    now.value = new Date();
  };

  setInterval(() => {
    initDate();
  }, 1000);
</script>
<style lang="less" scoped>
  .time-card-container {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    justify-content: center;
    width: fit-content;
    height: fit-content;
    margin-left: auto;
    .time-card {
      display: flex;
      align-items: center;
      .time-card-item {
        width: 1.71rem;
        height: 2.43rem;
        line-height: 2.14rem;
        font-size: 2.14rem;
        font-weight: 700;
        color: #ffffff;
        text-align: center;
        background: linear-gradient(
          180deg,
          rgba(54, 98, 164, 1) 0%,
          rgba(10, 26, 66, 1) 50.33%,
          rgba(54, 98, 164, 1) 100%
        );
      }
      .time-card-item + .time-card-item {
        margin-left: 0.36rem;
      }
      .divide {
        width: 1rem;
        height: 2.43rem;
        line-height: 2.14rem;
        font-size: 2.14rem;
        font-weight: 700;
        color: #ffffff;
        text-align: center;
      }
    }
    .date-part {
      display: flex;
      // gap: 1rem;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      letter-spacing: -0.37px;
      font-size: 1rem;
      .date {
        font-weight: 400;
        color: rgba(230, 247, 255, 1);
      }
      .day-for-week {
        font-family: 'Inter';
        font-weight: 600;
        color: rgba(22, 206, 185, 1);
      }
    }
  }
</style>
