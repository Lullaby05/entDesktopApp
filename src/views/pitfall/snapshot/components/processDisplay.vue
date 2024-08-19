<template>
  <div>
    <a-steps
      :current="currentStep"
      label-placement="vertical"
      v-if="stepData.length"
    >
      <a-step v-for="item in totalStepItems" :key="item.value">
        <div class="flex-column">
          <span>{{ item.description }}</span>
          <div
            class="persons"
            v-for="person in item.auditPersons.slice(0, 2)"
            :key="person.employeeId"
          >
            {{ person.employeeName + '-' + person.deptName }}
          </div>
          <a-tooltip v-if="item.auditPersons.length > 2">
            <div style="cursor: pointer">...</div>
            <template #content>
              <div
                class="persons"
                v-for="(person, index) in item.auditPersons"
                :key="index"
              >
                {{ person.employeeName + '-' + person.deptName }}
              </div>
              （{{ item.auditPersons.length + '人或签' }}）
            </template>
          </a-tooltip>
          <div class="persons" v-if="item.auditPersons.length > 1">
            （{{ item.auditPersons.length + '人或签' }}）
          </div>
        </div>
      </a-step>
    </a-steps>
    <div class="steps-content">
      <a-steps
        :current="finalStep ? stepData.length + 1 : stepData.length"
        direction="vertical"
      >
        <a-step
          v-for="item in stepData"
          :key="item.sort"
          :class="item.overdue && 'overdue-report'"
        >
          <template v-if="item.nextKey && item.nextKey !== 'misstatement'" #icon
            >{{ currentStep }}
          </template>
          <div v-if="item.nextKey === 'misstatement'" class="detail-content">
            <div class="detail-time">
              <span>{{ item.misdecTime }}</span>
              <a-tag class="detail-tag" color="red" bordered>{{
                '误报'
              }}</a-tag>
            </div>
            <div class="detail-process">
              <span>{{ item.misdecName }}</span>
              <span>{{ item.name }}</span>
            </div>
          </div>
          <div v-if="item.nextKey && item.nextKey !== 'misstatement'">
            <div class="detail-time">
              <span>{{ item.name }}</span>
            </div>
          </div>
          <div
            v-if="item.key === 'dangerReport'"
            class="detail-content"
            :key="item.sort"
          >
            <div class="detail-time">
              <span>{{ item.reportTime }}</span>
            </div>
            <div class="detail-process">
              <span>{{ item.inspectorName }}</span>
              <span>{{ item.name }}</span>
            </div>
            <div class="detail-description">
              <div class="content-items last-content-items">
                <span>隐患描述：{{ item.hazardDesc }}</span>
              </div>
              <div class="img-container" v-if="item.sceneImages">
                <a-upload
                  :show-remove-button="false"
                  :show-upload-button="false"
                  list-type="picture-card"
                  action="/"
                  :default-file-list="item.sceneImages"
                  image-preview
                />
              </div>
            </div>
          </div>
          <div
            v-if="item.key === 'rectify'"
            :key="item.sort"
            class="detail-content"
          >
            <div class="detail-time">
              <span>{{ item.createTime }}</span>
              <a-tag
                class="detail-tag"
                :color="item.dangerLevelCode === '1' ? 'red' : 'blue'"
                bordered
                >{{ item.dangerLevel }}</a-tag
              >
            </div>
            <div class="detail-process">
              <span>{{ item.confirmName }}</span>
              <span>{{ item.name }}</span>
            </div>
            <div class="detail-description">
              <div class="content-items">
                <span>整改责任部门：{{ item.rectifyDepartName }}</span>
              </div>
              <div class="content-items">
                <span>整改责任人：{{ item.rectifyName }}</span>
              </div>
              <div class="content-items">
                <span>整改措施：{{ item.rectifyMeasures }}</span>
              </div>
              <div class="content-items">
                <span>整改限期时间：{{ item.rectifyTime }}</span>
              </div>
              <div class="img-container" v-if="item.sceneImages">
                <a-upload
                  :show-remove-button="false"
                  :show-upload-button="false"
                  list-type="picture-card"
                  action="/"
                  :default-file-list="item.sceneImages"
                  image-preview
                />
              </div>
            </div>
          </div>
          <div
            v-if="item.key === 'report'"
            :key="item.sort"
            class="detail-content"
          >
            <div class="detail-time">
              <span>{{ item.rectifyTime }}</span>
              <a-tag
                v-if="item.overdue"
                class="detail-tag"
                color="red"
                bordered
                >{{ item.overdue && '逾期' }}</a-tag
              >
            </div>
            <div class="detail-process">
              <span>{{ item.rectifyName }}</span>
              <span>{{ item.name }}</span>
            </div>
            <div class="detail-description">
              <div class="content-items">
                <span>整改责任部门：{{ item.rectifyDepartName }}</span>
              </div>
              <div class="content-items">
                <span>整改责任人：{{ item.rectifyName }}</span>
              </div>
              <div class="content-items last-content-items">
                <span>整改情况：{{ item.rectifySituation }}</span>
              </div>
              <div class="img-container" v-if="item.rectifyImages">
                <a-upload
                  :show-remove-button="false"
                  :show-upload-button="false"
                  list-type="picture-card"
                  action="/"
                  :default-file-list="item.rectifyImages"
                  image-preview
                />
              </div>
            </div>
          </div>
          <div
            v-if="item.key === 'accept'"
            :key="item.sort"
            class="detail-content"
          >
            <div class="detail-time">
              <span>{{ item.checkAcceptTime }}</span>
            </div>
            <div class="detail-process">
              <span>{{ item.checkAcceptName }}</span>
              <span>{{ item.name }}</span>
            </div>
            <div class="detail-description">
              <div
                v-if="item.checkAcceptResult !== undefined"
                class="content-items full-line"
                :class="item.checkAcceptResult ? 'text-blue' : 'text-red'"
              >
                <span>{{
                  item.checkAcceptResult ? '整改合格' : '整改不合格'
                }}</span>
              </div>
              <div class="img-container" v-if="item.checkAcceptImages">
                <a-upload
                  :show-remove-button="false"
                  :show-upload-button="false"
                  list-type="picture-card"
                  action="/"
                  :default-file-list="item.checkAcceptImages"
                  image-preview
                />
              </div>
            </div>
          </div>
          <div
            v-if="item.key === 'recheck'"
            :key="item.sort"
            class="detail-content"
          >
            <div class="detail-time">
              <span>{{ item.createTime }}</span>
            </div>
            <div class="detail-process">
              <span>{{ item.verifierName }}</span>
              <span>{{ item.name }}</span>
            </div>
            <div class="detail-description">
              <div
                v-if="item.isRecheck !== undefined"
                class="content-items full-line"
                :class="item.isRecheck ? 'text-blue' : 'text-red'"
              >
                <span>{{ item.isRecheck ? '复审通过' : '复审拒绝' }}</span>
              </div>
              <div class="img-container" v-if="item.recheckImages">
                <a-upload
                  :show-remove-button="false"
                  :show-upload-button="false"
                  list-type="picture-card"
                  action="/"
                  :default-file-list="item.recheckImages"
                  image-preview
                />
              </div>
            </div>
          </div>
        </a-step>
      </a-steps>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { getPitfallProcess } from '@/api/pitfall';
  import { computed, ref, onBeforeMount, toRef } from 'vue';
  import { statusEnum } from '../composition/useDict';
  const props = defineProps({
    id: {
      type: String,
      required: true,
    },
    status: {
      type: String,
    },
    dangerLevelCode: {
      type: String,
    },
    rectifyInfo: {
      type: Object,
      default: () => ({}),
    },
  });

  // 确认当前是否是最后一个步骤
  const finalStep = computed(() => {
    return (
      props.status === statusEnum.RECTIFIED ||
      props.status === statusEnum.MISSTATEMENT
    );
  });

  const rectifyInfo = toRef(props, 'rectifyInfo');

  // 所有节点
  const totalStepItems = ref<any>([
    { value: 1, description: '隐患上报', auditPersons: [] },
    { value: 2, description: '隐患确认下发', auditPersons: [] },
    { value: 3, description: '隐患整改上报', auditPersons: [] },
    { value: 4, description: '隐患整改验收', auditPersons: [] },
    { value: 5, description: '整改验收复审', auditPersons: [] },
  ]);

  const stepData = ref<any>([]);

  // 当前的步骤
  const currentStep = computed(() => {
    return stepObj[props.status as string];
  });

  // 取数组中的最后一项的key作为最后一个步骤
  const stepObj: any = {
    [statusEnum.CONFIRMED]: 2,
    [statusEnum.MISSTATEMENT]: 2,
    [statusEnum.TOBERECTIFY]: 3,
    [statusEnum.TOBEACCEPTANCE]: 4,
    [statusEnum.REEXAMINE]: 5,
    [statusEnum.RECTIFIED]: 6,
  };
  // 根据当前状态获取下一步的key和name
  const nextStepObj: any = {
    [statusEnum.CONFIRMED]: {
      key: 'rectify',
      name: '隐患信息下发',
    },
    [statusEnum.MISSTATEMENT]: {
      key: 'misstatement',
      name: '隐患确认',
    },
    [statusEnum.TOBERECTIFY]: {
      key: 'report',
      name: '整改信息上报',
    },
    [statusEnum.TOBEACCEPTANCE]: {
      key: 'accept',
      name: '整改验收',
    },
    [statusEnum.REEXAMINE]: {
      key: 'recheck',
      name: '验收复审',
    },
    [statusEnum.RECTIFIED]: {
      key: 'recheck',
      name: '验收复审',
    },
  };

  const getProcessData = async () => {
    const { data } = await getPitfallProcess(props.id);
    let resData: any = [];
    // 给arr数组对象中的key字段去重，仅保留第一项（最近一项）的对象
    const filterSameObj = (arr: any[], key: string) => {
      return arr.filter((obj) => {
        return arr.findLast((obj) => obj[key] === obj[key]) === obj;
      });
    };
    const timeKeys: any = {
      dangerReport: 'reportTime',
      rectify: 'createTime',
      report: 'rectifyTime',
      accept: 'checkAcceptTime',
      recheck: 'createTime',
    };
    for (let [key, value] of Object.entries<any>(data)) {
      if (key === 'report' && value.length > 1) {
        data[key] = value.reverse().map((ele: any, index: number) => {
          return {
            ...ele,
            name: ele.name + `（第${index + 1}次）`,
          };
        });
      }
    }
    const imgFields: any = {
      dangerReport: 'sceneImages',
      rectify: 'sceneImages',
      report: 'rectifyImages',
      accept: 'checkAcceptImages',
      recheck: 'recheckImages',
    };
    // 只遍历timeKeys中有的key
    for (const [key, value] of Object.entries<any>(data)) {
      if (!timeKeys[key]) break;
      if (Array.isArray(value) && value.length) {
        // 数组情况
        let val = key === 'rectify' ? filterSameObj(value, 'sort') : value;
        resData.push(
          ...val.map((item: any) => {
            return {
              ...item,
              [imgFields[key]]:
                item[imgFields[key]] &&
                item[imgFields[key]].length &&
                item[imgFields[key]].map((url: any) => {
                  if (url.fileType === 'video') {
                    return {
                      url: url.postUrl,
                    };
                  }
                  return {
                    url: url.fileUrl,
                  };
                }),
              key,
              confirmName:
                key === 'rectify'
                  ? rectifyInfo.value.items
                    ? rectifyInfo.value.items[5].value
                    : ''
                  : '',
              overdue:
                key === 'report' && data.rectify[0].rectifyStateCode === '4',
            };
          })
        );
      }
    }
    stepData.value = resData.sort(
      (a: any, b: any) =>
        +new Date(a[timeKeys[a.key]]) - +new Date(b[timeKeys[b.key]])
    );
    // 一般隐患不展示最后一个节点
    if (props.dangerLevelCode === '2') {
      totalStepItems.value.pop();
    }
    const keyObj = {
      1: 'dangerReportPermissionInfos',
      2: 'rectifyPermissionInfos',
      3: 'reportPermissionInfos',
      4: 'checkPermissionInfos',
      5: 'recheckPermissionInfos',
    };
    for (let i of totalStepItems.value) {
      if (keyObj[i.value as keyof typeof keyObj]) {
        i.auditPersons = (
          data[keyObj[i.value as keyof typeof keyObj]] || []
        ).filter(Boolean);
      }
    }
    if (props.status === statusEnum.RECTIFIED) return;
    // 处理误报的情况
    if (props.status === statusEnum.MISSTATEMENT) {
      stepData.value.push({
        nextKey: nextStepObj[props.status as string].key,
        name: nextStepObj[props.status as string].name,
        key: '',
        misdecName: stepData.value[0].misdecName,
        misdecTime: stepData.value[0].misdecTime,
      });
      return;
    }
    stepData.value.push({
      nextKey: nextStepObj[props.status as string].key,
      name: nextStepObj[props.status as string].name,
      key: '',
    });
  };

  onBeforeMount(() => {
    getProcessData();
  });
</script>
<style lang="less" scoped>
  .flex-column {
    display: flex;
    flex-direction: column;
    .persons {
      font-size: 14px;
      color: var(--color-text-grey);
      max-width: 140px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
  .steps-content {
    margin-top: 30px;
    margin-left: 60px;

    :deep(.arco-steps-vertical) {
      align-items: flex-start;
      flex-direction: column-reverse;

      .arco-steps-item {
        margin: 0;
        min-height: 90px;
      }

      .overdue-report {
        background-color: var(--color-bg-2);

        .arco-steps-item-node > .arco-steps-icon {
          color: #f53f3f;
          border: 1px solid #f53f3f;
          background-color: var(--bg2);
        }
      }

      .arco-steps-item:not(:first-child) .arco-steps-item-tail {
        position: absolute;
        top: 0;
        left: 13.5px;
        box-sizing: border-box;
        width: 1px;
        height: 100%;
        padding: 34px 0 6px;
      }

      .arco-steps-item:not(:first-child) .arco-steps-item-tail::after {
        content: '';
        display: block;
        width: 100%;
        height: 100%;
        background-color: rgb(var(--primary-6));
      }

      .arco-steps-item:first-child .arco-steps-item-tail::after {
        display: none;
      }
    }

    .detail-content {
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;

      .detail-time {
        color: var(--color-neutral-6);
        font-size: 16px;
        font-weight: bold;

        .detail-tag {
          margin-left: 10px;
          border-radius: 5px;
        }
      }

      .detail-process {
        color: var(--color-neutral-6);
        font-size: 14px;

        span + span {
          margin-left: 40px;
        }
      }

      .detail-description {
        font-size: 12px;
        color: var(--color-neutral-4);
        display: flex;
        width: 300px;
        flex-wrap: wrap;

        .content-items {
          min-width: 150px;

          &:last-child {
            width: 100%;
          }
        }

        .full-line {
          width: 100%;
        }
        .last-content-items {
          width: 100%;
        }

        .img-container {
          margin-top: 5px;
        }

        .text-blue {
          color: #357cf0;
        }

        .text-red {
          color: #f76560;
        }

        .content-items span {
          flex-basis: auto;
          height: auto;
          line-height: 1.5;
          margin-right: 5px;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }

      .detail-result {
        color: #1a91ff;
        font-size: 14px;
      }
    }
  }
</style>
<style lang="less">
  .image-modal-body {
    text-align: center;

    .modalImage {
      width: 500px;
      height: 500px;
    }
  }
</style>
