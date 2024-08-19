<template>
  <div class="quick-navigation-container">
    <div class="header">
      <span>{{ $t('dashboard.quickNavigation.title') }}</span>
    </div>
    <div class="content">
      <div
        v-for="link in links"
        :key="link.text"
        :span="8"
        class="wrapper"
        @click="link.jump"
      >
        <div class="icon">
          <img :src="link.icon" alt="" />
        </div>
        <span class="text">
          {{ link.text }}
        </span>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import control from '@/assets/images/icon-风险辨识.png';
  import controlMeasure from '@/assets/images/icon-风险分级管控.png';
  import snapshot from '@/assets/images/icon-随手拍.png';
  import pitfall from '@/assets/images/icon-隐患处理.png';
  import emergency from '@/assets/images/icon-应急预案.png';
  import checktask from '@/assets/images/icon-排查计划管理.png';
  import useRouterJump from '@/hooks/routerJump';
  import { useAppStore } from '@/store';
  import i18n from '@/locale';

  const { jumpWithTab } = useRouterJump();

  const links = [
    {
      text: i18n.global.t('menu.identificationAndEvaluation'),
      icon: control,
      jump: () => {
        jumpWithTab({
          routerName: 'IdentificationAndEvaluation',
        });
      },
    },
    {
      text: i18n.global.t('menu.gradedControl'),
      icon: controlMeasure,
      jump: () => {
        jumpWithTab({
          routerName: 'GradedControl',
        });
      },
    },
    {
      text: i18n.global.t('menu.snapshot'),
      icon: snapshot,
      jump: () => {
        jumpWithTab({
          routerName: 'Snapshot',
        });
      },
    },
    {
      text: i18n.global.t('menu.pitfallManage'),
      icon: pitfall,
      jump: () => {
        jumpWithTab({
          routerName: 'PitfallManage',
        });
      },
    },
    {
      text: i18n.global.t('menu.emergencyPlan'),
      icon: emergency,
      jump: () => {
        jumpWithTab({
          routerName: 'EmergencyPlan',
        });
      },
    },
    {
      text: i18n.global.t('menu.checkPlanManage'),
      icon: checktask,
      jump: () => {
        jumpWithTab({
          routerName: 'CheckPlanManageList',
        });
      },
    },
  ];
</script>
<style lang="less" scoped>
  .quick-navigation-container {
    border-radius: 4px;
    background-color: var(--bg2);
    width: 100%;
    height: 27.8vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    box-shadow: var(--color-box-shadow);
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 1rem;
      font-family: 'Alibaba-Medium';
      color: var(--color-text-black);
      padding: 1.07rem;
    }
    .content {
      padding: 10px 10px 10px 5px;
      flex: 1;
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      .wrapper {
        display: flex;
        align-items: center;
        flex-direction: column;
        gap: 10px;
        cursor: pointer;
        .icon {
          // padding: 5px;
          // font-size: 40px;
          border-radius: 10px;
          color: #357cf0;
          // border: 1px solid #d4e4ff;
          padding-bottom: 0;
          img {
            width: 3.13vw;
            height: 3.13vw;
          }
        }
        .text {
          text-align: center;
          font-size: 0.86rem;
          width: 100%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-weight: 400;
          font-family: 'Alibaba';
          color: var(--color-text-black);
          &:hover {
            width: 100%;
          }
        }
      }
    }
  }
</style>
