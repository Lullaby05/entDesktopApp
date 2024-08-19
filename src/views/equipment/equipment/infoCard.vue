<!--
*@fileName infoCard.vue
*@autdor wml
*@date 2023-07-14
*@description 展示身份证卡
!-->
<template>
  <div
    class="container"
    :style="{ display: 'flex', width: '100%', height: '100%' }"
  >
    <a-card style="margin-bottom: 20px">
      <div class="heard">
        <div class="heard-left">
          <icon-left @click="backClick" /> <a-divider direction="vertical" />
          <span> 设 备 设 施 身 份 卡 </span>
        </div>
        <div class="heard-right">
          <a-button v-print="printObj" type="text">打印标识卡</a-button>
        </div>
      </div>
      <div id="printDiv" class="info-card-box">
        <table border="1" cellspacing="0" class="print">
          <tr class="title">
            <th colspan="4" rowspan="1" class="title-td">
              <div class="title-cell">
                <div class="title-font">设备设施标识卡</div>
                <!-- <div class="title-company">英智源智能系统有限公司</div> -->
                <div class="title-company"
                  >祥开瑞（深圳）智能安全技术有限公司</div
                >
              </div>
            </th>
          </tr>
          <tr>
            <th colspan="1" rowspan="1">
              <div class="field"> 设备名称 </div>
            </th>
            <td colspan="2" rowspan="1">
              <div class="value">
                {{ form.name ? form.name : '-' }}
              </div>
            </td>
            <th colspan="1" rowspan="5">
              <a-image :src="form.code" width="300" />
            </th>
          </tr>
          <tr>
            <th colspan="1" rowspan="1">
              <div class="field"> 自编号 </div>
            </th>
            <td colspan="2" rowspan="1"
              ><div class="value">{{
                form.factoryNumber ? form.factoryNumber : '-'
              }}</div></td
            >
          </tr>
          <tr>
            <th colspan="1" rowspan="1"><div class="field">规格型号</div></th>
            <td colspan="2" rowspan="1"
              ><div class="value">
                {{ form.specification ? form.specification : '-' }}
              </div></td
            >
          </tr>
          <tr>
            <th colspan="1" rowspan="1"><div class="field">出厂编号</div></th>
            <td colspan="2" rowspan="1"
              ><div class="value">{{
                form.factoryNumber ? form.factoryNumber : '-'
              }}</div></td
            >
          </tr>
          <tr>
            <th colspan="1" rowspan="1"
              ><div class="field">特种设备证书</div></th
            >
            <td colspan="2" rowspan="1">
              <div class="value">
                {{
                  equipmentCertificate
                    ? equipmentCertificate.registrationNumber
                      ? equipmentCertificate.registrationNumber
                      : '-'
                    : '-'
                }}
              </div></td
            >
          </tr>
          <tr>
            <th colspan="1" rowspan="1"><div class="field">设备类型</div></th>
            <td colspan="1" rowspan="1"
              ><div class="value">{{
                form.equipmentTypeName ? form.equipmentTypeName : '-'
              }}</div></td
            >
            <th colspan="1" rowspan="1"><div class="field">所属部门</div></th>
            <td colspan="1" rowspan="1"
              ><div class="value">{{
                form.deptName ? form.deptName : '-'
              }}</div></td
            >
          </tr>
          <tr>
            <th colspan="1" rowspan="1"
              ><div class="field">特种设备分类</div></th
            >
            <td colspan="1" rowspan="1"
              ><div class="value">{{
                form.equipmentSpecialTypeName
                  ? form.equipmentSpecialTypeName
                  : '-'
              }}</div></td
            >
            <th colspan="1" rowspan="1"><div class="field">责任人</div></th>
            <td colspan="1" rowspan="1"
              ><div class="value">{{
                form.masterNick ? form.masterNick : '-'
              }}</div></td
            >
          </tr>
          <tr>
            <th colspan="1" rowspan="1"><div class="field">制造厂家</div></th>
            <td colspan="1" rowspan="1"
              ><div class="value">{{
                form.manufacturer ? form.manufacturer : '-'
              }}</div></td
            >
            <th colspan="1" rowspan="1"><div class="field">安装位置</div></th>
            <td colspan="1" rowspan="1"
              ><div class="value">{{
                form.location ? form.location : '-'
              }}</div></td
            >
          </tr>
          <tr>
            <th colspan="1" rowspan="1"><div class="field">出厂日期</div></th>
            <td colspan="1" rowspan="1"
              ><div class="value">{{
                form.dateOfProduction ? form.dateOfProduction : '-'
              }}</div></td
            >
            <th colspan="1" rowspan="1"><div class="field">投用时间</div></th>
            <td colspan="1" rowspan="1"
              ><div class="value">{{
                form.operationDate ? form.operationDate : '-'
              }}</div></td
            >
          </tr>
          <tr>
            <th colspan="1" rowspan="1"><div class="field">设备重量</div></th>
            <td colspan="1" rowspan="1"
              ><div class="value"
                >{{ form.weight ? form.weight : '-' }} KG
              </div></td
            >
            <th colspan="1" rowspan="1"><div class="field">来源</div></th>
            <td colspan="1" rowspan="1"
              ><div class="value">{{
                form.source ? form.source : '-'
              }}</div></td
            >
          </tr>
        </table>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts" setup>
  import { ref, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { getDetail } from '@/api/equipment';
  const form = ref<any>({});
  const equipmentCertificate = ref<any>({});

  const detail = async (id: string) => {
    const res = await getDetail({ id });
    console.log('detail=', res.data);
    form.value = res.data;
    equipmentCertificate.value = form.value.equipmentCertificateRespVO;
  };

  const router = useRouter();
  const route = useRoute();

  const backClick = () => {
    console.log('点击返回');
    router.go(-1);
  };

  const printObj = {
    id: 'printDiv', //  需要打印区域
    popTitle: '设备设施标识卡',
    preview: false,
    previewTitle: '设备设施标识卡',
    previewPrintBtnLabel: '预览结束，开始打印',
    zIndex: 20002,
    previewBeforeOpenCallback() {
      console.log('正在加载预览窗口！');
    }, // 预览窗口打开之前的callback
    previewOpenCallback() {
      console.log('已经加载完预览窗口，预览打开了！');
    }, // 预览窗口打开时的callback
    beforeOpenCallback() {
      console.log('开始打印之前！');
    }, // 开始打印之前的callback
    openCallback() {
      console.log('执行打印了！');
    }, // 调用打印时的callback
    closeCallback() {
      console.log('关闭了打印工具！');
    }, // 关闭打印的callback(无法区分确认or取消)
    clickMounted() {
      console.log('点击v-print绑定的按钮了！');
    },
  };

  watch(
    () => router.currentRoute.value.path,
    (toPath) => {
      if (toPath === '/equipment/equipmentInfoCard') {
        detail(route.query.record as string);
      }
    },
    { immediate: true, deep: true }
  );
</script>

<style lang="less" scoped>
  .container {
    display: flex;
    padding: 16px 20px;
    padding-bottom: 0;
    background-color: var(--color-fill-2);
    flex-direction: column;
    // justify-content: center;
    // align-items: center;
  }
  .heard {
    display: flex;
    justify-content: space-between; // justify-content: space-evenly;  // justify-content: space-around;  //
  }
  .info-card-box {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    margin-bottom: 100px;
  }
  .title {
    height: 64px;
    overflow: hidden;
  }
  .title-td {
    height: 64px;
    width: 238px;
  }

  .title-cell {
    width: 1000px;
    height: 113px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 15px;
  }

  .title-bold {
    font-weight: bold;
  }
  .title-font {
    font-size: 58px;
    font-weight: bold;
  }

  .title-company {
    font-size: 24px;
    font-weight: 600;
  }

  .cell {
    position: absolute;
    overflow: hidden;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
  }

  .field {
    font-weight: 900;
    font-size: 17px;
    margin: 10px 25px;
  }

  .value {
    margin-left: 20px;
  }

  @page {
    /* 打印A4大小 */
    size: auto A4 landscape;
    margin: 10mm;
  }
</style>
