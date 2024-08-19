<template>
  <div class="emergency-group-container">
    <div class="emergency-group-flex">
      <div class="commander">
        <div class="title">指挥长</div>
        <div class="content">
          <div class="content-item">
            <span class="name">{{ data.commanderName }}</span>
            <span class="dept">{{
              data.commanderDeptName +
              (data.commanderJobName && '-') +
              data.commanderJobName
            }}</span>
            <span class="tel"
              ><img src="@/assets/image/call.png" alt="" />
              {{ data.commanderTel }}</span
            >
          </div>
        </div>
      </div>
      <div class="deputy-commander">
        <div class="title">副指挥长</div>
        <div class="content">
          <div
            class="content-item"
            v-for="item in data.associateConductorList"
            :key="item.id"
          >
            <span class="name">{{ item.userName }}</span>
            <span class="dept">{{
              item.deptName + (item.jobName && '-') + item.jobName
            }}</span>
            <span class="tel"
              ><img src="@/assets/image/call.png" alt="" />{{ item.tel }}</span
            >
          </div>
        </div>
      </div>
      <div class="other-member">
        <div class="title">其他成员</div>
        <div class="content">
          <div
            class="content-item"
            v-for="item in data.otherMembersList"
            :key="item.id"
          >
            <span class="name">{{ item.userName }}</span>
            <span class="dept">{{
              item.deptName + (item.jobName && '-') + item.jobName
            }}</span>
            <span class="tel"
              ><img src="@/assets/image/call.png" alt="" />{{ item.tel }}</span
            >
          </div>
        </div>
      </div>
      <div class="participants" v-if="data.participateUnitsList.length">
        <div class="title">参与单位负责人</div>
        <div class="content">
          <div
            class="content-item"
            v-for="item in data.participateUnitsList"
            :key="item.id"
          >
            <span class="name">{{ item.userName || '' }}</span>
            <span class="dept">{{
              item.name || '' + (item.jobName && '-') + item.jobName || ''
            }}</span>
            <span class="tel"
              ><img src="@/assets/image/call.png" alt="" />{{
                item.tel || ''
              }}</span
            >
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { ref, toRef } from 'vue';

  const props = defineProps({
    data: {
      type: <any>Object,
      require: true,
    },
  });
  const data = ref(props.data);
  data.value = {
    ...data.value,
    participateUnitsList: data.value.participateUnitsList.filter(
      (ele: any) => ele.userName
    ),
  };
</script>
<style lang="less" scoped>
  .emergency-group-container {
    display: flex;
    // flex-direction: column;
    gap: 4.39rem;
    line-height: 1;
    .emergency-group-flex {
      display: flex;
      flex-direction: column;
      gap: 2.14rem;
    }
    .title {
      font-size: 1.14rem;
      font-weight: 700;
      margin-bottom: 1.14rem;
    }
    .tel {
      display: flex;
      align-items: center;
      gap: 1rem;
      img {
        width: 1rem;
        height: 1rem;
      }
    }
    .content {
      display: flex;
      .content-item {
        display: flex;
        align-items: center;
        font-size: 1rem;
        font-weight: 400;
        letter-spacing: 0px;
        line-height: 1rem;
        .name {
          width: 5rem;
        }
        .dept {
          width: 10rem;
          font-size: 0.86rem;
          line-height: 0.86rem;
        }
      }
    }
  }
</style>
