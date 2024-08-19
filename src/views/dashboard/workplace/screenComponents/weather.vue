<template>
  <div class="weather-container">
    <div class="weather-temperature">
      <div class="icon">
        <img
          src="https://assets.msn.cn/weathermapdata/1/static/weather/Icons/taskbar_v10/Condition_Card/MostlyCloudyDayV2.svg"
          alt=""
        />
      </div>
      <div class="temperature-class">
        <div class="temperature-text">16~24°C</div>
        <div class="temperature-description">多云</div>
      </div>
    </div>
    <div class="temperature-detail">
      <div class="weather-quality">
        <div class="text">
          <span class="label-text">空气指数</span>
          <span class="value-text">32 优</span>
        </div>
        <div class="text">
          <span class="label-text">PM2.5</span>
          <span class="value-text">20</span>
        </div>
      </div>
      <div class="weather-wind">
        <div class="text">
          <span class="label-text">风向</span>
          <span class="value-text">北风 2级</span>
        </div>
        <div class="text">
          <span class="label-text">湿度</span>
          <span class="value-text">92%</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup></script>
<style lang="less" scoped>
  .weather-container {
    float: left;
    display: flex;
    gap: 1rem;
    align-items: center;
    line-height: 4.07rem;
    .weather-temperature {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .icon {
        img {
          width: 1.86rem;
          height: 1.86rem;
          margin-bottom: 0.2rem;
          margin-right: 0.5rem;
        }
      }
      .temperature-class {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 0.5rem;
        .temperature-text {
          font-size: 0.8rem;
          line-height: 0.8rem;
          font-weight: 600;
          color: #16ceb9;
        }
        .temperature-description {
          font-size: 0.8rem;
          line-height: 0.8rem;
          font-weight: 400;
          color: #ffffff;
        }
      }
    }
    .divide {
      width: 0.1rem;
      height: 4rem;
      background-color: #5d940d;
    }
    .temperature-detail {
      display: flex;
      font-size: 1.1rem;
      .weather-quality {
        width: 12.98vw;
        height: 2.57rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1.42rem;
        opacity: 0.82;
      }
      .weather-wind {
        width: 12.98vw;
        height: 2.57rem;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1.42rem;
        opacity: 0.82;
      }
      .text {
        display: flex;
        gap: 0.36rem;
        font-size: 1rem;
        .label-text {
          color: #e6f7ff;
        }
        .value-text {
          color: #16ceb9;
        }
      }
    }
  }
</style>
