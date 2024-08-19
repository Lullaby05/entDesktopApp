<template>
  <div class="box">
    <div v-show="!loginFlag" class="logo">
      <svg-icon name="logo" style="width: 125px; height: 64.7px; opacity: 1" />
      <!-- <img
        style="width: 125px; height: 64.7px; opacity: 0.9; z-index: 1"
        src="../../assets/image/logo-inswin-white.png"
      /> -->
      <!-- <img alt="logo" :src="logoUrl"  /> -->
      <!-- <div class="logo-text">task manager</div> -->
    </div>
    <LoginBanner v-show="!loginFlag" />
    <div class="content">
      <div class="content-inner">
        <LoginForm @login-click="login" />
      </div>
      <div class="footer">
        <Footer />
      </div>
    </div>
    <div class="quit">
      <a-button type="text" style="-webkit-app-region: no-drag" @click="quit">
        <template #icon>
          <icon-close style="color: #878a8f" size="32" :stroke-width="2" />
        </template>
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import Footer from '@/components/footer/index.vue';
  import LoginBanner from './components/banner.vue';
  import LoginForm from './components/login-form.vue';
  const loginFlag = ref(false);

  const quit = () => {
    window.versions.loginQuit();
  };

  // 登录点击事件
  const login = (e: any) => {
    console.log('备用', e);
  };
</script>

<style lang="less" scoped>
  .box {
    display: flex;
    height: 100vh;
    .banner {
      width: 550px;
      // background: linear-gradient(163.85deg, #1d2129 0%, #00308f 100%);
    }

    .content {
      position: relative;
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
      padding-bottom: 40px;
    }

    .footer {
      position: absolute;
      right: 0;
      bottom: 0;
      width: 100%;
    }
  }

  .logo {
    position: fixed;
    top: 28px;
    left: 22px;
    z-index: 1;
    display: inline-flex;
    align-items: center;
  }

  .quit {
    width: 32px;
    height: 32px;
    margin-top: 20px;
    margin-right: 20px;
  }
</style>

<style lang="less" scoped>
  // responsive
  @media (max-width: @screen-lg) {
    .container {
      .banner {
        width: 25%;
      }
    }
  }
</style>
