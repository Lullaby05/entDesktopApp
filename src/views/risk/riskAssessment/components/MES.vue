<template>
  <div class="content">
    <div class="risk-lever">
      <div class="label">风险等级设置：</div>
      <div class="value">
        <div class="title">风险值 R=M*E*S</div>
        <a-table
          :data="props.MESLever"
          :pagination="false"
          :bordered="{ cell: true }"
        >
          <template #columns>
            <a-table-column
              align="center"
              data-index="record"
              title="风险值R"
              :width="200"
            >
              <template #cell="{ record }">
                <div v-if="record.record[1]">
                  {{ record.record[0] }} &lt; R ≤ {{ record.record[1] }}
                </div>
                <div v-else> R ﹥ {{ record.record[0] }} </div>
              </template>
            </a-table-column>
            <a-table-column
              align="center"
              data-index="lever"
              title="风险等级"
              :width="120"
            ></a-table-column>
            <a-table-column
              align="center"
              body-cell-class="color"
              data-index="color"
              title="颜色"
              :width="120"
            >
              <template #cell="{ record }">
                <div
                  class="div"
                  :style="{
                    width: '100%',
                    height: '100%',
                    color: record.color.style === 'yellow' ? '#000' : '#fff',
                    backgroundColor: record.color.style,
                  }"
                >
                  {{ record.color.text }}
                </div>
              </template>
            </a-table-column>
          </template>
        </a-table>
      </div>
    </div>
    <div class="record">
      <div class="label">分值设置：</div>
      <div class="value">
        <div style="display: flex">
          <div class="m" style="flex: 1; margin-right: 10px">
            <div class="title">（1）管控措施状态（M）</div>
            <a-table
              :data="props.MData"
              :pagination="false"
              :bordered="{ cell: true }"
            >
              <template #columns>
                <a-table-column
                  data-index="record"
                  title="分值"
                  :width="100"
                ></a-table-column>
                <a-table-column
                  data-index="info"
                  title="描述信息"
                ></a-table-column>
              </template>
            </a-table>
          </div>
          <div class="e" style="flex: 1">
            <div class="title">（2）人员暴露时间（E）</div>
            <a-table
              :data="props.EData"
              :pagination="false"
              :bordered="{ cell: true }"
            >
              <template #columns>
                <a-table-column
                  data-index="record"
                  title="分值"
                  :width="100"
                ></a-table-column>
                <a-table-column
                  data-index="info"
                  title="描述信息"
                ></a-table-column>
              </template>
            </a-table>
          </div>
        </div>
        <div class="s">
          <div class="title">（3）发生事故产生的后果（S）</div>
          <a-table
            :data="props.SData"
            :bordered="{ cell: true }"
            :pagination="false"
          >
            <template #columns>
              <a-table-column
                data-index="record"
                title="分值"
                :width="100"
              ></a-table-column>
              <a-table-column
                data-index="info"
                title="描述信息"
              ></a-table-column>
            </template>
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { PropType } from 'vue';
  export default {};
</script>

<script lang="ts" setup>
  const props = defineProps({
    MESLever: {
      type: Array as PropType<any[]>,
      // required: true,
      default: [
        { id: 1, record: [17, 25], lever: '一级', color: 'red' },
        { id: 2, record: [13, 16], lever: '二级', color: 'orange' },
        { id: 3, record: [8, 12], lever: '三级', color: 'yellow' },
        { id: 4, record: [0, 7], lever: '四级', color: 'blue' },
      ],
    },
    MData: {
      type: Array as PropType<any[]>,
      // required:true,
      default: [
        {
          id: 1,
          record: 10,
          info: '',
        },
        {
          id: 2,
          record: 6,
          info: '',
        },
        {
          id: 3,
          record: 3,
          info: '',
        },
      ],
    },
    EData: {
      type: Array as PropType<any[]>,
      default: [
        {
          id: 1,
          record: 10,
          info: '',
        },
        {
          id: 2,
          record: 6,
          info: '',
        },
        {
          id: 3,
          record: 2,
          info: '',
        },
      ],
    },
    SData: {
      type: Array as PropType<any[]>,
      // required:true,
      default: [
        {
          id: 1,
          record: 100,
          info: '',
        },
        {
          id: 2,
          record: 40,
          info: '',
        },
        {
          id: 3,
          record: 20,
          info: '',
        },
      ],
    },
  });
</script>

<style lang="less" scoped>
  .content {
    .risk-lever,
    .record {
      display: flex;
      .value {
        flex: 1;
        .title {
          margin-bottom: 16px;
        }
      }
      .label {
        width: 140px;
        margin-right: 10px;
        text-align: right;
        font-size: 15px;
        font-weight: 700;
      }
    }
    .risk-lever {
      .value {
        :deep(.arco-table) {
          width: 460px;
          // min-width: 500px;

          .color {
            .arco-table-cell {
              // padding: 0;
              height: 100%;
            }
          }
        }
      }
    }
    .record {
      margin-top: 20px;
      .value {
        margin-right: 60px;
      }
    }
  }
</style>
