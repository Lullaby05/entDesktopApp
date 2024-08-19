<!-- vue实现实时数据，新增一条数据就添加到最上面去 -->
<template>
  <div class="real-time-container">
    <div class="real-time-content">
      <div class="real-time-table">
        <div class="real-time-table-header">
          <span>最后更新时间</span>
          <span>上报设备</span>
          <span>上报值</span>
        </div>
        <div class="real-time-table-content">
          <TransitionGroup name="list">
            <div class="table-item" v-for="item in tableValue" :key="item.id">
              <div>{{ item.time }}</div>
              <a-tooltip
                content-class="report-data-tooltip"
                :content="item.reportDevice"
              >
                <div>{{ item.reportDevice }}</div>
              </a-tooltip>
              <a-tooltip
                content-class="report-data-tooltip"
                :content="
                  item.data
                    .map((ele) => ele.name + ':' + ele.value)
                    .join('&nbsp;&nbsp;&nbsp;&nbsp;')
                "
              >
                <div class="report-data"
                  ><span v-for="(data, index) in item.data" :key="index"
                    >{{ data.name + ':' }}
                    <span :style="{ color: data.warning ? '#ff5733' : '' }">{{
                      data.value
                    }}</span></span
                  >
                </div>
              </a-tooltip>
            </div>
          </TransitionGroup>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import { getCustomerId } from '@/api/thingsBoard';
  import { formatDate } from '@/utils/utils';
  import { computed, onBeforeMount, onBeforeUnmount, ref } from 'vue';

  type TableValueType = {
    id: number;
    time: string;
    reportDevice: string;
    data: {
      name: string;
      value: any;
      warning: boolean;
    }[];
  };
  const tableValue = ref<TableValueType[]>([]);
  const tenantId = ref('');
  const customerId = ref('');

  onBeforeMount(async () => {
    window.main.getUserInfo().then((arg: any) => {
      tenantId.value = arg.info.tenantId;
      // 从localStorage中获取数据
      const tableValueStr = localStorage.getItem('tableValue');
      if (tableValueStr) {
        const dataToSave = JSON.parse(tableValueStr);
        if (dataToSave[tenantId.value]) {
          if (
            dataToSave[tenantId.value].expirationTime < new Date().getTime()
          ) {
            delete dataToSave[tenantId.value];
          } else {
            tableValue.value = dataToSave[tenantId.value].tableValue;
          }
        }
      }
    });
    setTimeout(async () => {
      const { data } = await getCustomerId();
      customerId.value = data;
      initWebSocket();
    }, 0);
  });

  // websocket
  const websock = ref();
  const initWebSocket = async () => {
    if (typeof WebSocket === 'undefined') {
      console.log('您的浏览器不支持WebSocket');
    } else {
      const wsurl =
        import.meta.env.MODE !== 'development'
          ? `${
              import.meta.env.VITE_API_WS_URL
            }/business/ws/websocket/telemetry/${customerId.value}`
          : `ws://localhost:3000/business/ws/websocket/telemetry/${customerId.value}`; //服务器
      // 实例化 WebSocket
      websock.value = new WebSocket(wsurl);
      // 监听 WebSocket 连接
      websock.value.onopen = websocketonopen;
      // 监听 WebSocket 错误信息
      websock.value.onerror = websocketonerror;
      // 监听 WebSocket 消息
      websock.value.onmessage = websocketonmessage;
      // 监听 WebSocket 关闭消息
      websock.value.onclose = websocketclose;
    }
  };
  // 连接建立之后执行send方法发送数据
  function websocketonopen() {
    console.log('socket连接成功');
  }
  // 连接建立失败重连
  function websocketonerror() {
    console.log('连接错误');
  }
  // 数据接收
  function websocketonmessage(e: any) {
    try {
      const { metadata, telemetryData } = JSON.parse(e.data);
      // 最多保存一千条，超过的就把最后面的删除
      if (tableValue.value.length > 1000) {
        tableValue.value.pop();
      }
      tableValue.value.unshift({
        id: tableValue.value.length,
        time: formatDate(new Date(+metadata.ts), 'yyyy-MM-DD HH:mm:ss'),
        reportDevice: metadata.deviceName,
        data: Object.entries(telemetryData).map(([key, value]) => ({
          name: key,
          value: value,
          warning: false,
        })),
      });
      // 每加入一条就放到localStorage里面
      handleSave();
    } catch (e) {}
  }
  // 关闭
  function websocketclose(e: any) {
    console.log('WebSocket 断开连接', e);
    console.log('尝试重新连接...');
    setTimeout(initWebSocket, 1000);
  }
  const handleSave = () => {
    const expirationTime = new Date().getTime() + 30 * 24 * 60 * 60 * 1000; // 一个月没有新的数据就过期
    const dataToSave = {
      tableValue: tableValue.value,
      tenantId: tenantId.value,
      expirationTime: expirationTime,
    };
    const existingData = localStorage.getItem('tableValue');
    let newData = {};
    if (existingData) {
      const parsedData = JSON.parse(existingData);
      newData = {
        ...parsedData,
        [tenantId.value]: dataToSave,
      };
    } else {
      newData = {
        [tenantId.value]: dataToSave,
      };
    }
    localStorage.setItem('tableValue', JSON.stringify(newData));
  };
</script>
<style lang="less">
  .list-move,
  .list-enter-active,
  .list-leave-active {
    transition: all 0.5s ease;
  }

  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateX(30px);
  }

  /* 确保将离开的元素从布局流中删除
  以便能够正确地计算移动的动画。 */
  .list-leave-active {
    position: absolute;
  }

  .report-data-tooltip {
    background: linear-gradient(
      180deg,
      rgba(4, 60, 149, 1) 0%,
      rgba(4, 33, 68, 0.74) 14.22%,
      rgba(4, 23, 62, 0.8) 51.46%,
      rgba(7, 45, 94, 0.77) 87.86%,
      rgba(4, 62, 151, 1) 100%
    );
    border: 0.5px solid rgba(48, 97, 219, 1);
    box-shadow: 0px 0px 3px rgba(3, 255, 246, 0.34);
    filter: backdrop(0px 0px 3px rgba(3, 255, 246, 0.34));
  }
</style>
<style lang="less" scoped>
  .real-time-container {
    height: 100%;
    width: 100%;
    overflow: hidden;
    color: #ffffff;
    font-size: 0.86rem;
    line-height: 0.86rem;
    font-family: 'Roboto';
    .real-time-content {
      height: 100%;
    }
    .real-time-table-content {
      height: 100%;
      width: 100%;
      display: flex;
      flex-direction: column;
      overflow-y: auto;
      overflow-x: hidden;
      &::-webkit-scrollbar {
        width: 0px;
      }
      .table-item {
        display: grid;
        grid-template-columns: 1fr 0.7fr 1.3fr;
        align-items: center;
        text-align: left;
        padding: 0.71rem 0.36rem;
        gap: 0.36rem;
        > div {
          max-width: 200px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        &:nth-of-type(odd) {
          background: #0a1454;
        }
        .report-data {
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          span + span {
            margin-left: 1rem;
          }
        }
      }
    }
    .real-time-table-header {
      display: grid;
      grid-template-columns: 1fr 0.7fr 1.3fr;
      text-align: left;
      padding: 0.71rem 0.36rem;
    }
    .real-time-table {
      display: flex;
      flex-direction: column;
      height: 100%;
    }
  }
</style>
