<!-- 企业管理：基础信息 -->
<template>
  <div class="container">
    <a-card class="base-info">
      <div class="header">
        <div>
          <img
            class="img"
            style="object-fit: fill"
            :src="enterpriseInfo.baseInfo?.logoList[0]"
            alt=""
          />
        </div>
        <div class="title-box">
          <div class="title">{{ enterpriseInfo.baseInfo?.companyName }}</div>
          <div class="code">{{
            '统一社会信用代码：' + enterpriseInfo.baseInfo?.socialcreditCode
          }}</div>
        </div>
        <div class="btn">
          <a-button type="primary" @click="editBaseInfo">信息编辑</a-button>
        </div>
      </div>
      <div class="info">
        <a-row :gutter="[0, 20]">
          <a-col :span="7" class="item-col">
            <div class="label">所属行业：</div>
            <div class="value">{{
              enterpriseInfo.baseInfo?.industryInvolvedName
            }}</div>
          </a-col>
          <a-col :span="7" class="item-col">
            <div class="label">企业类型：</div>
            <div class="value">{{
              enterpriseInfo.baseInfo?.companyTypeName
            }}</div>
          </a-col>
          <a-col :span="7" class="item-col">
            <div class="label">注册地址：</div>
            <div class="value">{{
              enterpriseInfo.baseInfo?.registeredAddress
            }}</div>
          </a-col>
          <a-col :span="3" class="item-col">
            <div
              class="label"
              style="color: var(--color-text-grey1); font-weight: 700"
              >企业状态：</div
            >
            <div class="value">{{
              enterpriseInfo.baseInfo?.status ? '禁用' : '启用'
            }}</div>
          </a-col>
        </a-row>
        <a-row :gutter="[0, 20]">
          <a-col :span="7" class="item-col">
            <div class="label">成立时间：</div>
            <div class="value">{{
              enterpriseInfo.baseInfo?.establishmentDate
            }}</div>
          </a-col>
          <a-col :span="7" class="item-col">
            <div class="label">所属集团：</div>
            <div class="value">{{ enterpriseInfo.baseInfo?.parentName }}</div>
          </a-col>
          <a-col :span="7" class="item-col">
            <div class="label">归属区域：</div>
            <div class="value">{{ '深圳南山区' }}</div>
          </a-col>
        </a-row>
      </div>
    </a-card>
    <!-- 风险分级 -->
    <a-card class="risk-lever" title="风险分级">
      <a-timeline direction="horizontal">
        <a-timeline-item
          dot-color="#95F204"
          dot-type="hollow"
          line-color="#008fcc"
        >
          低下风险
          <template #label>
            <span class="label one">13</span>
          </template>
        </a-timeline-item>
        <a-timeline-item
          dot-color="#008FCC"
          dot-type="hollow"
          line-color="#008fcc"
        >
          一般风险
          <template #label>
            <span class="label two">20</span>
          </template>
        </a-timeline-item>
        <a-timeline-item
          dot-color="#F59A23"
          dot-type="hollow"
          line-color="#008fcc"
        >
          较大风险
          <template #label>
            <span class="label three">5</span>
          </template>
        </a-timeline-item>
        <a-timeline-item
          dot-color="#D9001B"
          dot-type="hollow"
          class="last-time-line"
        >
          重大风险
          <template #label>
            <span class="label four">0</span>
          </template>
        </a-timeline-item>
      </a-timeline>
    </a-card>
    <!-- 详细信息卡片 -->
    <a-card class="detail-info" title="详细信息">
      <div class="base-info">
        <div class="title">
          <!-- <a-divider direction="vertical" :size="6" /> -->
          基本信息
        </div>
        <div class="content">
          <a-row :gutter="[0, 30]">
            <a-col :span="8" class="item-col">
              <div class="label">企业地址：</div>
              <div class="value">{{
                enterpriseInfo.baseInfo?.enterpriseAddress
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">员工总数：</div>
              <div class="value">{{
                enterpriseInfo.baseInfo?.employeesNum
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">所属专业：</div>
              <div class="value">{{
                enterpriseInfo.baseInfo?.majorInvolvedName
              }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="[0, 30]">
            <a-col :span="8" class="item-col">
              <div class="label">所属小专业：</div>
              <div class="value">{{
                enterpriseInfo.baseInfo?.smallMajorInvolvedName
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">企业传真：</div>
              <div class="value">{{ enterpriseInfo.contactInfo?.fax }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">企业网址：</div>
              <div class="value">{{
                enterpriseInfo.contactInfo?.officialUrl
              }}</div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="cancat">
        <div class="title">
          <!-- <a-divider direction="vertical" :size="6" /> -->
          手机号码
        </div>
        <div class="content">
          <a-row :gutter="[0, 30]">
            <a-col :span="8" class="item-col">
              <div class="label">安全第一责任人：</div>
              <div class="value">{{
                enterpriseInfo.contactInfo?.safeMainPerson
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">手机号码：</div>
              <div class="value">{{
                enterpriseInfo.contactInfo?.safeMainPersonTel
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">当前职位：</div>
              <div class="value">{{
                enterpriseInfo.contactInfo?.position
              }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="[0, 30]">
            <a-col :span="8" class="item-col">
              <div class="label">联系人：</div>
              <div class="value">{{
                enterpriseInfo.contactInfo?.contacts
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">手机号码：</div>
              <div class="value">{{
                enterpriseInfo.contactInfo?.contactsTel
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">当前职位：</div>
              <div class="value">{{
                enterpriseInfo.contactInfo?.contactsPosition
              }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="[0, 30]">
            <a-col :span="8" class="item-col">
              <div class="label">安全办公室：</div>
              <div class="value">{{ enterpriseInfo.contactInfo?.office }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">手机号码：</div>
              <div class="value">{{
                enterpriseInfo.contactInfo?.officeTel
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">当前职位：</div>
              <div class="value">{{
                enterpriseInfo.contactInfo?.officePosition
              }}</div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="safety-info">
        <div class="title">
          <!-- <a-divider direction="vertical" :size="6" /> -->
          安全信息
        </div>
        <div class="content">
          <a-row :gutter="[0, 30]" class="specil-row">
            <a-col :span="8" class="item-col">
              <div class="label">是否具备预案及备案：</div>
              <div class="value">{{
                enterpriseInfo.safeInfo?.planFlag ? '是' : '否'
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">是否具备三同时资料：</div>
              <div class="value">{{
                enterpriseInfo.safeInfo?.threeSimultaneousFlag ? '是' : '否'
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">是否进行安全生产标准化建设：</div>
              <div class="value">{{
                enterpriseInfo.safeInfo?.safetyProductionFlag ? '是' : '否'
              }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="[0, 30]" class="specil-row">
            <a-col :span="8" class="item-col">
              <div class="label">安全主管单位：</div>
              <div class="value">{{
                enterpriseInfo.safeInfo?.safeRegulator
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">安全主管人员：</div>
              <div class="value">{{
                enterpriseInfo.safeInfo?.safeRegulatorPerson
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">手机号码：</div>
              <div class="value">{{
                enterpriseInfo.safeInfo?.safeRegulatorTel
              }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="[0, 30]" class="specil-row">
            <a-col :span="8" class="item-col">
              <div class="label">社区巡检员：</div>
              <div class="value">{{
                enterpriseInfo.safeInfo?.communityInspector
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">手机号码：</div>
              <div class="value">{{
                enterpriseInfo.safeInfo?.communityInspectorTel
              }}</div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="extra-info">
        <div class="title">
          <!-- <a-divider direction="vertical" :size="6" /> -->
          附件信息
        </div>
        <div class="content">
          <a-row :gutter="[0, 30]">
            <a-col :span="8" class="item-col">
              <div class="label">营业执照：</div>
              <div class="value">
                <img
                  class="img"
                  src="http://static.test.xkrsecure.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240123142604.png%2F%2F4134a7f4-f39b-4595-af2d-ac2b7d612d38.png?e=4166663203&token=mMpWMB4QmZWyWB8A1_18YKAIpg_YS2GpNmk3y9z2:Pp1F-dbf9NOYUY4nahtyr-iXsBQ="
                  alt=""
                />
              </div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">企业总平面图：</div>
              <div class="value">
                <img
                  class="img"
                  src="http://static.test.xkrsecure.com/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20240123142612.png%2F%2F9838a119-eadf-4425-8987-3b31f21f99b2.png?e=4166663220&token=mMpWMB4QmZWyWB8A1_18YKAIpg_YS2GpNmk3y9z2:TPK-VAMYLI46TGc_T6CSeBxk6lo="
                  alt=""
                />
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-card>
    <!-- 资质信息 -->
    <a-card class="certificate" title="资质信息">
      <div class="img">
        <img
          src="http://static.test.xkrsecure.com/%E8%B5%84%E8%B4%A85.jpg%2F%2F8db82aed-345d-4dcc-8029-90692519511e.jpg?e=4159670512&token=mMpWMB4QmZWyWB8A1_18YKAIpg_YS2GpNmk3y9z2:G4DtAeSmhQ0HPB90bM5oIuE01Bs="
          alt="资质信息"
        />
      </div>
      <div class="img">
        <img
          src="http://static.test.xkrsecure.com/%E8%B5%84%E8%B4%A84.jpg%2F%2F04a92c2a-a622-4a14-a425-861f8da6ce5f.jpg?e=4159670512&token=mMpWMB4QmZWyWB8A1_18YKAIpg_YS2GpNmk3y9z2:1Wi1r0AH4VLtxboCSm5WoqRHai4="
          alt="资质信息"
        />
      </div>
      <div class="img">
        <img
          src="http://static.test.xkrsecure.com/%E8%B5%84%E8%B4%A83.jpg%2F%2F0ce0b0c3-7438-4da4-944d-947578038f57.jpg?e=4159670512&token=mMpWMB4QmZWyWB8A1_18YKAIpg_YS2GpNmk3y9z2:34-ZXk4jp3YFxOX41RF_BgYXS3o="
          alt="资质信息"
        />
      </div>
      <div class="img">
        <img
          src="http://static.test.xkrsecure.com/%E8%B5%84%E8%B4%A82.jpg%2F%2Fa83c7957-40c4-4520-ba3b-af5858562290.jpg?e=4159670512&token=mMpWMB4QmZWyWB8A1_18YKAIpg_YS2GpNmk3y9z2:LWvAV03tR9BVXc9UnJKVW3pW2so="
          alt="资质信息"
        />
      </div>
      <div class="img">
        <img
          src="http://static.test.xkrsecure.com/%E8%B5%84%E8%B4%A81.jpg%2F%2Fe44c1d02-f99b-4dc8-8530-fc2301a49e14.jpg?e=4159670513&token=mMpWMB4QmZWyWB8A1_18YKAIpg_YS2GpNmk3y9z2:rzEwyNgnyNzK6zygbNNOIbQ7Z6Y="
          alt="资质信息"
        />
      </div>
    </a-card>
    <!-- 安全事故记录 -->
    <a-card class="accident-record" title="安全事故记录">
      <a-timeline>
        <a-timeline-item
          v-for="index in 5"
          :key="index"
          dot-color="#008FCC"
          dot-type="hollow"
        >
          08-23
          <template #label>
            <a-card class="item-card">
              <div class="img"><icon-user /></div>
              <div class="info">
                <span class="event-name">机械割伤</span>
                <span class="event-level">小型事故</span>
                <div class="event-detail">手臂割伤。有否人受伤： 1人伤。</div>
                <div class="event-time">
                  <icon-clock-circle /> 2023-01-23 22:23
                </div>
              </div>
              <div class="btn">
                <a-button type="text" size="mini">详情</a-button>
              </div>
            </a-card>
          </template>
        </a-timeline-item>
      </a-timeline>
    </a-card>
  </div>
</template>

<script lang="ts">
  import { storeToRefs } from 'pinia';
  import { useRouter } from 'vue-router';
  import { useEnterpriseStore, useUserStore } from '@/store';
  export default {
    name: 'BaseInfo',
  };
</script>

<script lang="ts" setup>
  const router = useRouter();
  const enterpriseStore = useEnterpriseStore();
  const userStore = useUserStore();
  const { enterpriseInfo } = storeToRefs(enterpriseStore);

  enterpriseStore.getEnterpriseInfo(userStore.id as string);

  const editBaseInfo = () => {
    router.push({
      name: 'EnterpriseBaseInfoEdit',
    });
  };
</script>

<style lang="less" scoped>
  .container {
    .arco-card.base-info {
      margin-bottom: 16px;
      .header {
        width: 100%;
        height: 60px;
        display: flex;
        margin-bottom: 10px;
        .img {
          height: 30px;
        }
        .title-box {
          display: flex;
          align-items: baseline;
          flex: 1;
          .title {
            font-size: 24px;
            font-weight: 700;
          }
          .code {
            margin-left: 10px;
            font-size: 12px;
            color: #d9001b;
          }
        }
        .btn {
          width: 80px;
        }
      }
      .info {
        padding-right: 16px;
        .item-col {
          display: flex;
          .label {
            color: #7e7e7e;
            font-size: 14px;
            text-align: right;
            width: 70px;
          }
          .value {
            color: var(--color-text-black);
            font-size: 14px;
            text-align: left;
          }
        }
      }
    }
    .arco-card.risk-lever {
      margin-bottom: 16px;
      height: 200px;
      :deep(.arco-card-body) {
        padding: 40px 80px;
      }

      :deep(.arco-timeline-item-horizontal-top) {
        flex: 3;
        .arco-timeline-item-content-wrapper {
          margin-left: -24px;
          .arco-timeline-item-label {
            margin-left: 20px;
          }
        }
        .arco-timeline-item-dot {
          width: 14px;
          height: 14px;
          top: -50%;
          left: -50%;
        }
      }
      :deep(.last-time-line.arco-timeline-item-horizontal-top) {
        flex: 1;
      }
      .label {
        font-size: 20px;
        &.one {
          color: #95f204;
        }
        &.two {
          color: #008fcc;
        }
        &.three {
          color: #f59a23;
        }
        &.four {
          color: #d9001b;
        }
      }
    }
    .arco-card.detail-info {
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      :deep(.arco-divider-vertical) {
        margin-right: 2px;
        border-left: 1px solid #409eff;
      }
      .arco-descriptions {
        margin: 30px;
        padding: 0 20px;
        :deep(.arco-descriptions-row) {
          margin: 10px 0;
        }
      }
      .title {
        margin: 20px 0;
      }
      .content {
        padding: 0 20px;
        .item-col {
          display: flex;
          .label {
            color: #7e7e7e;
            font-size: 14px;
            text-align: right;
            width: 200px;
          }
          .value {
            flex: 1;
            color: var(--color-text-black);
            font-size: 14px;
            text-align: left;
          }
        }
        .specil-row {
          .item-col {
            .label {
              width: 200px;
            }
          }
        }
      }
    }
    .arco-card.certificate {
      margin-bottom: 16px;
      :deep(.arco-card-body) {
        display: flex;
        flex-wrap: wrap;
        .img {
          width: calc(100% / 4 - 20px);
          height: 240px;
          margin: 10px;
          img {
            width: 100%;
            height: 100%;
            object-fit: contain;
          }
        }
      }
    }
    .arco-card.accident-record {
      margin-bottom: 16px;
      :deep(.arco-card-body) {
        .arco-timeline-item-content {
          font-size: 12px;
          color: var(--color-text-3);
        }
        .arco-timeline-item-label {
          margin: 6px 0;
          .arco-card.item-card {
            border-radius: 4px;
            box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
            .arco-card-body {
              padding: 6px 10px;
              display: flex;
              .img {
                width: 30px;
                height: 30px;
                font-size: 26px;
                color: #ccc;
              }
              .info {
                flex: 1;
                margin: 0 8px;
                color: #999;
                font-size: 12px;
                .event-name {
                  margin-right: 4px;
                  color: #666;
                  font-size: 14px;
                }
                .event-detail {
                  color: #666;
                }
              }
            }
          }
        }
      }
    }
    .extra-info {
      .img {
        width: 160px;
        height: 160px;
        object-fit: contain;
      }
    }
    //
    :deep(.arco-card) {
      // min-height: 94%;
      .header {
        .arco-input-wrapper {
          width: 200px;
        }
        .search {
          margin-left: 20px;
        }
      }
      .content {
        margin-top: 20px;
        .column-btn {
          border-radius: 4px;
        }
      }
    }
  }
</style>
