<template>
  <div class="emergency-expert-team-container">
    <div class="emergency-group">
      <div class="title">应急队伍</div>
      <div
        class="team-content"
        v-for="(item, index) in data.teamDataList"
        :key="item.id"
      >
        <div class="team-name"
          >#{{ index + 1 }}
          <span>{{ item.teamName }}（{{ item.teamTypeName }}）</span></div
        >
        <div class="team-member-flex-row">
          <div class="team-member">
            <div class="member-title">主要负责人</div>
            <div class="member-content">
              <div class="flex">
                <span class="person-name">{{ item.teamLeaderName }}</span>
                <div class="person-description">{{
                  item.teamLeaderDeptName +
                  (item.teamLeaderJobName && '-') +
                  item.teamLeaderJobName
                }}</div>
                <div class="person-phone">
                  <img src="@/assets/image/call.png" alt="" />
                  {{ item.teamLeaderTel }}
                </div>
              </div>
            </div>
            <div class="team-member" v-if="item.divisionLeaderName">
              <div class="member-title">分管负责人</div>
              <div class="member-content">
                <div class="flex">
                  <span class="person-name">{{ item.divisionLeaderName }}</span>
                  <div class="person-description">{{
                    item.divisionLeaderDeptName +
                    (item.divisionLeaderJobName && '-') +
                    item.divisionLeaderJobName
                  }}</div>
                  <div class="person-phone">
                    <img src="@/assets/image/call.png" alt="" />
                    {{ item.divisionLeaderTel }}
                  </div>
                </div>
              </div>
            </div>
            <div class="team-member">
              <div class="member-title">队伍成员</div>
              <div
                class="member-content"
                v-for="member in item.teamEmployees"
                :key="member.id"
              >
                <div class="flex">
                  <span class="person-name">{{ member.userName }}</span>
                  <div class="person-description">{{
                    member.deptName + (member.jobName && '-') + member.jobName
                  }}</div>

                  <div class="person-phone">
                    <img src="@/assets/image/call.png" alt="" />
                    {{ member.tel }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="emergency-experts">
      <div class="title">应急专家</div>
      <div class="team-content">
        <div class="team-member">
          <div
            class="member-content"
            v-for="member in data.expertDataList"
            :key="member.id"
          >
            <div class="flex">
              <span class="person-name">{{ member.name }}</span>
              <div class="person-description">{{
                member.expertise +
                '-' +
                member.major +
                '专业' +
                '(' +
                member.educationName +
                ')'
              }}</div>
              <div class="person-phone">
                <img src="@/assets/image/call.png" alt="" />
                {{ member.telphone }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { toRef } from 'vue';

  const props = defineProps({
    data: {
      type: <any>Object,
      require: true,
    },
  });
  const data = toRef(props, 'data');
</script>
<style lang="less" scoped>
  .emergency-expert-team-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    .title {
      font-size: 1.29rem;
      font-weight: 700;
      letter-spacing: -0.29px;
      line-height: 1.29rem;
      color: rgba(48, 201, 201, 1);
      margin-bottom: 1rem;
    }
    .team-content {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      .team-name {
        background: linear-gradient(217.34deg, #57ddff 0%, #1692f7 100%);
        -webkit-background-clip: text;
        color: transparent;
        font-size: 1.14rem;
        font-weight: 700;
        letter-spacing: -0.29px;
        line-height: 1.14rem;
      }
      .flex {
        display: flex;
        align-items: center;
        .person-name {
          width: 5rem;
        }
        .person-description {
          width: 12rem;
          font-size: 0.86rem;
          line-height: 0.86rem;
        }
      }
      .person-phone {
        display: flex;
        align-items: center;
        gap: 0.3rem;
        img {
          width: 1rem;
          height: 1rem;
        }
      }
      .team-member-flex-row {
        display: flex;
        gap: 1rem;
        .member-title {
          font-size: 1.1rem;
          font-weight: 600;
        }
      }
      .team-member {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        .team-member-flex {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .member-content {
          // margin-left: 1rem;
        }
      }
    }
    .emergency-experts {
      padding-top: 10px;
    }
  }
</style>
