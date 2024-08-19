<!-- 企业管理：基础信息 -->
<template>
  <div class="container">
    <a-card class="base-info">
      <div class="header">
        <div class="title-box">
          <div class="title">{{ enterpriseInfo.baseInfo?.companyName }}</div>
          <div class="code">{{
            $t('enterprise.unifiedSocialCreditCode') +
            '：' +
            (enterpriseInfo.baseInfo?.socialcreditCode || '')
          }}</div>

          <div
            class="preview"
            v-if="
              (enterpriseInfo.accessoryInfo?.businessLicenseList || []).length
            "
            @click="preview"
            >{{ $t('enterprise.businessLicenseView') }}</div
          >
          <a-image-preview-group
            :srcList="enterpriseInfo.accessoryInfo?.businessLicenseList || []"
            v-model:visible="visible"
          />
        </div>
        <div>
          <a-button
            v-permission="'EnterpriseBaseInfoEdit'"
            type="primary"
            @click="editBaseInfo"
            >{{ $t('enterprise.infoEdit') }}</a-button
          >
        </div>
      </div>
      <div class="crad-list">
        <div class="item">
          <div class="title">{{ $t('enterprise.enterpriseLogo') }}</div>
          <div class="picture">
            <a-image-preview-group
              infinite
              v-if="(enterpriseInfo.baseInfo?.logoList || []).length"
            >
              <a-image
                width="100%"
                height="75%"
                :src="enterpriseInfo.baseInfo?.logoList[0]"
                fit="contain"
              />
            </a-image-preview-group>
          </div>
        </div>
        <div class="item">
          <div class="title"> {{ $t('enterprise.enterpriseStatus') }} </div>
          <div class="content">{{ $t('enterprise.normalOperation') }}</div>
        </div>
        <div class="item">
          <div class="title">{{ $t('enterprise.enterpriseType') }}</div>
          <div class="title second">
            {{ enterpriseInfo.baseInfo?.companyTypeName }}
          </div>
          <div class="title" style="margin-top: 24px">
            {{ $t('enterprise.establishmentDate') }}
          </div>
          <div class="title second">
            {{ enterpriseInfo.baseInfo?.establishmentDate }}
          </div>
        </div>
        <div class="item">
          <div class="title">{{ $t('enterprise.industry') }}</div>
          <div class="title second">
            {{ enterpriseInfo.baseInfo?.industryInvolvedName }}
          </div>
          <div class="title" style="margin-top: 24px">
            {{ $t('enterprise.belongGroup') }}
          </div>
          <div class="title second">
            {{ enterpriseInfo.baseInfo?.belongGroup }}
          </div>
        </div>
        <div class="item">
          <div class="title"> {{ $t('enterprise.registerAddress') }} </div>
          <div class="title second">
            {{ enterpriseInfo.baseInfo?.registeredAddress }}
            <i class="iconfont icon-weizhi icon" style="color: #357cf0"></i
          ></div>
          <div class="title" style="margin-top: 24px">
            {{ $t('enterprise.companyArea') }}
          </div>
          <div class="title second">
            {{ enterpriseInfo.baseInfo?.companyArea }}
          </div>
        </div>
      </div>
    </a-card>
    <!-- 风险分级 -->
    <a-card class="risk-lever" :title="$t('enterprise.riskpointLevel')">
      <div class="crad-list">
        <div class="item">
          <div class="title one">
            <i
              class="iconfont icon-fengxianpinggu-orange one"
              style="margin-right: 15px"
            ></i>
            {{ $t('dashboard.majorRisk') }}
          </div>
          <div class="content">{{ riskData.largerRiskNum }}</div>
          <div class="desc">{{ $t('enterprise.riskPoint') }}</div>
        </div>
        <div class="item">
          <div class="title two">
            <i
              class="iconfont icon-fengxianpinggu-orange two"
              style="margin-right: 15px"
            ></i>
            {{ $t('dashboard.largerRisk') }}
          </div>
          <div class="content">{{ riskData.majorRiskNum }}</div>
          <div class="desc">{{ $t('enterprise.riskPoint') }}</div>
        </div>
        <div class="item">
          <div class="title three"
            ><i
              class="iconfont icon-fengxianpinggu-orange three"
              style="margin-right: 15px"
            ></i>
            {{ $t('dashboard.ordinaryRisk') }}
          </div>
          <div class="content">{{ riskData.ordinaryRiskNum }}</div>
          <div class="desc">{{ $t('enterprise.riskPoint') }}</div>
        </div>
        <div class="item">
          <div class="title four"
            ><i
              class="iconfont icon-fengxianpinggu-orange four"
              style="margin-right: 15px"
            ></i>
            {{ $t('dashboard.lowRisk') }}
          </div>
          <div class="content">{{ riskData.lowRiskNum }}</div>
          <div class="desc">{{ $t('enterprise.riskPoint') }}</div>
        </div>
      </div>
    </a-card>
    <!-- 详细信息卡片 -->
    <a-card class="detail-info" title="详细信息">
      <div class="base-info">
        <div class="title"> {{ $t('enterprise.baseInfo.title') }} </div>
        <div class="content">
          <a-row :gutter="[0, 30]">
            <a-col :span="8" class="item-col">
              <div class="label">{{ $t('enterprise.baseInfo.address') }}：</div>
              <div class="value">{{
                enterpriseInfo.baseInfo?.enterpriseAddress
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.baseInfo.employeesNum') }}：</div
              >
              <div class="value">{{
                enterpriseInfo.baseInfo?.employeesNum
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">{{ $t('enterprise.baseInfo.major') }}：</div>
              <div class="value">{{
                enterpriseInfo.baseInfo?.majorInvolvedName
              }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="[0, 30]">
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.baseInfo.smallMajor') }}：</div
              >
              <div class="value">{{
                enterpriseInfo.baseInfo?.smallMajorInvolvedName
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">{{ $t('enterprise.baseInfo.fax') }}：</div>
              <div class="value">{{ enterpriseInfo.contactInfo?.fax }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.baseInfo.officialUrl') }}：</div
              >
              <div class="value">{{
                enterpriseInfo.contactInfo?.officialUrl
              }}</div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="cancat">
        <div class="title">{{ $t('enterprise.contact.title') }}</div>
        <div class="content">
          <a-row :gutter="[0, 30]">
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.contact.safeMainPerson') }}：</div
              >
              <div class="value">{{
                enterpriseInfo.contactInfo?.safeMainPerson
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.contact.safeMainPersonTel') }}：</div
              >
              <div class="value">{{
                enterpriseInfo.contactInfo?.safeMainPersonTel
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label">{{ $t('enterprise.contact.position') }}：</div>
              <div class="value">{{
                enterpriseInfo.contactInfo?.position
              }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="[0, 30]">
            <a-col :span="8" class="item-col">
              <div class="label">{{ $t('enterprise.contact.contacts') }}：</div>
              <div class="value">{{
                enterpriseInfo.contactInfo?.contacts
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.contact.contactsTel') }}：</div
              >
              <div class="value">{{
                enterpriseInfo.contactInfo?.contactsTel
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.contact.contactsPosition') }}：</div
              >
              <div class="value">{{
                enterpriseInfo.contactInfo?.contactsPosition
              }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="[0, 30]">
            <a-col :span="8" class="item-col">
              <div class="label">{{ $t('enterprise.contact.office') }}：</div>
              <div class="value">{{ enterpriseInfo.contactInfo?.office }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.contact.officeTel') }}：</div
              >
              <div class="value">{{
                enterpriseInfo.contactInfo?.officeTel
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.contact.officePosition') }}：</div
              >
              <div class="value">{{
                enterpriseInfo.contactInfo?.officePosition
              }}</div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="safety-info">
        <div class="title">{{ $t('enterprise.safety.title') }}</div>
        <div class="content">
          <a-row :gutter="[0, 30]" class="specil-row">
            <a-col :span="8" class="item-col">
              <div class="label">{{ $t('enterprise.safety.planFlag') }}：</div>
              <div class="value">{{
                enterpriseInfo.safeInfo?.planFlag
                  ? $t('common.yes')
                  : $t('common.no')
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.safety.threeSimultaneousFlag') }}：</div
              >
              <div class="value">{{
                enterpriseInfo.safeInfo?.threeSimultaneousFlag
                  ? $t('common.yes')
                  : $t('common.no')
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.safety.safetyProductionFlag') }}：</div
              >
              <div class="value">{{
                enterpriseInfo.safeInfo?.safetyProductionFlag
                  ? $t('common.yes')
                  : $t('common.no')
              }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="[0, 30]" class="specil-row">
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.safety.safeRegulator') }}：</div
              >
              <div class="value">{{
                enterpriseInfo.safeInfo?.safeRegulator
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.safety.safeRegulatorPerson') }}：</div
              >
              <div class="value">{{
                enterpriseInfo.safeInfo?.safeRegulatorPerson
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.safety.safeRegulatorTel') }}：</div
              >
              <div class="value">{{
                enterpriseInfo.safeInfo?.safeRegulatorTel
              }}</div>
            </a-col>
          </a-row>
          <a-row :gutter="[0, 30]" class="specil-row">
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.safety.communityInspector') }}：</div
              >
              <div class="value">{{
                enterpriseInfo.safeInfo?.communityInspector
              }}</div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.safety.communityInspectorTel') }}：</div
              >
              <div class="value">{{
                enterpriseInfo.safeInfo?.communityInspectorTel
              }}</div>
            </a-col>
          </a-row>
        </div>
      </div>
      <div class="extra-info">
        <div class="title">{{ $t('enterprise.attachment.title') }}</div>
        <div class="content">
          <a-row :gutter="[0, 30]">
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.attachment.businessLicense') }}：</div
              >
              <div class="value">
                <a-image-preview-group
                  infinite
                  v-if="
                    (enterpriseInfo.accessoryInfo?.businessLicenseList || [])
                      .length
                  "
                >
                  <a-image
                    v-for="img in enterpriseInfo.accessoryInfo
                      ?.businessLicenseList || []"
                    width="100%"
                    height="100%"
                    fit="contain"
                    :src="img"
                    alt=""
                  />
                </a-image-preview-group>
              </div>
            </a-col>
            <a-col :span="8" class="item-col">
              <div class="label"
                >{{ $t('enterprise.attachment.enterpriseMap') }}：</div
              >
              <div class="value">
                <a-image-preview-group
                  infinite
                  v-if="
                    (enterpriseInfo.accessoryInfo?.emergencyList || []).length
                  "
                >
                  <a-image
                    width="100%"
                    height="100%"
                    fit="contain"
                    :src="enterpriseInfo.accessoryInfo?.emergencyList || []"
                    alt=""
                  />
                </a-image-preview-group>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </a-card>
    <!-- 资质信息 -->
    <a-card class="certificate" :title="$t('enterprise.qualification.title')">
      <div
        class="img"
        v-for="(item, index) in enterpriseInfo.accessoryInfo
          ?.qualificationInfoList || []"
        :key="index"
      >
        <a-image-preview-group infinite>
          <a-image
            width="100%"
            height="100%"
            :alt="$t('enterprise.qualification.title')"
            :src="item"
            fit="contain"
          />
        </a-image-preview-group>
      </div>
    </a-card>
    <!-- 安全事故记录 -->
    <!-- <a-card
      class="accident-record"
      title="{{ $t('enterprise.accident.title') }}"
    >
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
                <a-button type="text" size="mini">{{
                  $t('common.detail')
                }}</a-button>
              </div>
            </a-card>
          </template>
        </a-timeline-item>
      </a-timeline>
    </a-card> -->
  </div>
</template>

<script lang="ts">
  import { storeToRefs } from 'pinia';
  import { useRouter } from 'vue-router';
  import { useEnterpriseStore, useUserStore } from '@/store';
  import { ref } from 'vue';
  import { getPitfallStatistics } from '@/api/dashboard';
  import { getDataScreenRiskControl } from '@/api/dataScreen';
  export default {
    name: 'BaseInfo',
  };
</script>

<script lang="ts" setup>
  const router = useRouter();
  const enterpriseStore = useEnterpriseStore();
  const userStore = useUserStore();
  const { enterpriseInfo } = storeToRefs(enterpriseStore);
  const visible = ref(false);
  enterpriseStore.getEnterpriseInfo();

  const editBaseInfo = () => {
    router.push({
      name: 'EnterpriseBaseInfoEdit',
    });
  };

  const preview = () => {
    visible.value = true;
  };

  const riskData = ref<any>({});

  const getRiskData = async () => {
    const { data } = await getDataScreenRiskControl({
      scale: 'Day',
      timeScope: 'month',
    });
    riskData.value = data;
  };
  getRiskData();
</script>

<style lang="less" scoped>
  :deep(.arco-card-header) {
    font-size: 20px;
    background-color: var(--bg2) !important;
    border-bottom: none !important;
  }
  .container {
    font-family: 'Alibaba';
    .arco-card.base-info {
      margin-bottom: 16px;
      .arco-card-size-medium .arco-card-body {
        padding: 20px;
      }
      .header {
        padding-bottom: 24px;
        width: 100%;
        display: flex;
        .title-box {
          display: flex;
          align-items: baseline;
          flex: 1;
          .title {
            font-size: 20px;
            font-weight: 500;
            font-family: 'Alibaba-Medium';
            line-height: 28px;
            margin-right: 20px;
            color: var(--color-text-black1);
          }
          .code {
            margin-left: 10px;
            font-size: 12px;
            color: #808080;
          }
          .preview {
            cursor: pointer;
            font-size: 12px;
            line-height: 16px;
            font-weight: 400;
            margin-left: 20px;
            text-decoration: underline;
            color: var(--color-blue);
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
            color: var(--color-text-3);
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
      :deep(.arco-card-body) {
        padding-top: 0px !important;
      }
      margin-bottom: 16px;
      .item {
        height: 135px;
        width: 24%;
      }
      .one {
        color: rgb(212, 48, 48) !important;
      }
      .two {
        color: rgb(245, 154, 35) !important;
      }
      .three {
        color: rgb(255, 223, 37) !important;
      }
      .four {
        color: rgb(53, 124, 240) !important;
      }
      :deep(.arco-card-header) {
        margin-top: 10px;
        margin-bottom: 2px;
        font-family: 'Alibaba-Medium';
        font-weight: 500;
      }
      .content {
        font-family: 'Alibaba-Medium';
        font-weight: 500;
        font-size: 28px;
      }
      .desc {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--color-text-2);
        font-family: 'Alibaba';
        font-size: 12px;
        font-weight: 400;
        line-height: 20px;
      }
    }
    .arco-card.detail-info {
      :deep(.arco-card-body) {
        padding-top: 0px !important;
      }
      :deep(.arco-card-header) {
        font-family: 'Alibaba-Medium';
        font-weight: 500;
        margin-top: 10px;
        margin-bottom: -10px;
      }
      :deep(.arco-card-body) {
        padding-left: 40px !important;
      }
      margin-bottom: 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      :deep(.arco-divider-vertical) {
        margin-right: 2px;
        border-left: 1px solid var(--color-blue);
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
        font-family: 'Alibaba-Medium';
        font-weight: 500;
        font-size: 16px;
        color: var(--color-text-black1);
      }
      .content {
        padding: 0 20px;
        .item-col {
          display: flex;
          .label {
            color: var(--color-text-3);
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
      :deep(.arco-card-header) {
        font-family: 'Alibaba-Medium';
        font-weight: 500;
        margin-top: 10px;
        margin-bottom: 2px;
      }
      :deep(.arco-card-body) {
        padding-top: 0px !important;
      }
      margin-bottom: 16px;
      :deep(.arco-card-body) {
        display: flex;
        flex-wrap: wrap;
        .img {
          width: calc(100% / 4 - 20px);
          height: 162px;
          margin: 10px;
          border: 1px rgba(229, 232, 239, 1) solid;
          border-radius: 4px;
          padding: 5px;
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
            // box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.1);
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
      :deep(.arco-card-header) {
        font-family: 'Alibaba-Medium';
        font-weight: 500;
        margin-top: 10px;
        margin-bottom: 2px;
      }
      :deep(.arco-card-body) {
        padding-top: 0px !important;
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
  .crad-list {
    display: flex;
    align-items: center;
    justify-content: space-between;
    .item {
      width: 19%;
      height: 162px;
      border: 1px solid var(--color-border);
      display: flex;
      flex-direction: column;
      padding: 16px;
      border-radius: 4px;
      background-color: var(--bg3);
      .title {
        font-size: 14px;
        font-weight: 500;
        height: 10%;
        margin-bottom: 10px;
        color: var(--color-text-black1);
      }
      .picture {
        display: flex;
        justify-content: center;
        align-items: end;
        height: 90%;
      }
      .content {
        display: flex;
        justify-content: center;
        align-items: center;
        color: var(--color-text-black1);
        font-family: 'Alibaba-Medium';
        font-size: 20px;
        font-weight: 500;
        height: 40%;
      }
      .second {
        margin-top: 5px;
        color: var(--color-text-3);
        font-size: 12px;
        font-weight: 400;
      }
    }
  }
</style>
