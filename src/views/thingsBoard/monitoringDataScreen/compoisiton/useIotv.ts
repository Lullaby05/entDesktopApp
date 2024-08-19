import { getDeviceInfo, getEventListScreen } from '@/api/thingsBoard';
//@ts-ignore
import IOTV from '@hyman.young/iotv';
import { computed, onMounted, reactive, ref, watch } from 'vue';
import { eventTypeLevelDict } from '../../eventConfig/eventConfigManagement/type';
import {
  calculateTime,
  timeUnitsType,
} from '../../eventConfig/eventManagement/composition/calculateTime';
export const useIotv = (needInit = true) => {
  // IOTV
  let _IOTV = new IOTV();
  onMounted(async () => {});

  const initIOTV = () => {
    // _IOTV.init({
    //   dataPath: 'http://140.210.193.47:56001/iotv-data/',
    //   // dataPath: '/iotv-demo-data-1/',
    //   parkCode: 'a8df73fe-a38b-48e7-b764-ccb6e644f289', // 园区ID
    //   screenContainerId: '', // 大屏最外层的容器，如果未使用style.transform的scale函数，则可不定义此项
    //   containerId: 'visual-container', // 3D场景容器id
    //   infoBubbleContainerId: 'object-info-bubble', // 信息气泡容器id
    //   showStats: false, //是否显示性能工具
    //   style: {
    //     cityBuildings: 'gradient',
    //     cityBuildingsOuterFrame: true,
    //     parkObjectsOuterFrame: false,
    //   },
    //   onInitComplete: onInitComplete, // 场景初始化完成后回调
    //   clickObjectCallback: clickObjectCallback, //  3D场景中对象点击事件回调
    // });
  };

  const currentObjectType = ref(0);
  const currentObject = ref<any>({});
  const now = ref(new Date());
  const onInitComplete = async () => {
    if (!needInit) return;
    // 初始化告警设备
    const { data: listData } = await getEventListScreen({});
    // listData根据deviceId去重
    const list = listData.sort(
      (a: any, b: any) =>
        a.eventLevel.split('-')[1] - b.eventLevel.split('-')[1] ||
        new Date(b.createTime).getTime() - new Date(a.createTime).getTime()
    );
    const uniqueData: any[] = Object.values(
      list.reduce((prev: any, next: any) => {
        if (!prev[next.deviceId]) {
          prev[next.deviceId] = next;
        }
        return prev;
      }, {})
    );
    const data = uniqueData.map((ele: any) => {
      const eventDict = eventTypeLevelDict.find(
        (item) => item.dictValue === ele.eventType
      );
      const levelDict = eventDict?.children?.find(
        (item) => item.dictValue === ele.eventLevel
      );
      return {
        ...ele,
        color: levelDict?.color,
        reportTime: computed(() =>
          calculateTime({
            now: now.value,
            time: ele.createTime,
            leastUnit: timeUnitsType.seconds,
            status: false,
          })
        ),
        eventTypeName: eventDict?.dictKey,
        eventLevelName: levelDict?.dictKey,
      };
    });
    if (data.length) {
      setTimeout(() => {
        data.forEach((ele: any) => {
          addEvent(ele.deviceId);
        });
        Object.assign(currentObject.value, {
          // 更新信息气泡内容
          ...data[0],
        });
      }, 1000);
    }
  };
  setInterval(() => {
    now.value = new Date();
  }, 1000);

  const convertDeviceId = (deviceId: string) => {
    const deviceIdObj = {
      'dee00710-433b-11ef-84bf-2b24da36026c': '6', // 弗迪灭火器
      '1d1e4e80-5a00-11ef-8fbe-11769b452df0': '5', // 波粒摄像机
      '0e409cb0-5a00-11ef-8fbe-11769b452df0': '8', //波粒摄像机2
      '10d0b0c0-2ac9-11ef-b89e-2b0780770e2c': '9', //温湿度
      'fd6141d0-2ac8-11ef-b89e-2b0780770e2c': '10', //防爆气体
      'cf39e3e0-4335-11ef-84bf-2b24da36026c': '11', //烟感
      '635a6c20-4336-11ef-84bf-2b24da36026c': '12', //烟感1
    };
    return deviceIdObj[deviceId as keyof typeof deviceIdObj];
  };

  const deconvertDeviceId = (id: string) => {
    const deviceIdObj = {
      '6': 'dee00710-433b-11ef-84bf-2b24da36026c', // 弗迪灭火器
      '5': '1d1e4e80-5a00-11ef-8fbe-11769b452df0', // 波粒摄像机
      '8': '0e409cb0-5a00-11ef-8fbe-11769b452df0', //波粒摄像机2
      '9': '10d0b0c0-2ac9-11ef-b89e-2b0780770e2c', //温湿度
      '10': 'fd6141d0-2ac8-11ef-b89e-2b0780770e2c', //防爆气体
      '11': 'cf39e3e0-4335-11ef-84bf-2b24da36026c', //烟感
      '12': '635a6c20-4336-11ef-84bf-2b24da36026c', //烟感1
    };
    return deviceIdObj[id as keyof typeof deviceIdObj];
  };

  const clickObjectCallback = async (params: any) => {
    currentObjectType.value = params.type; // 0设备，1人员

    const deviceId = deconvertDeviceId(params.deviceID);
    if (!deviceId) return;
    const {
      data: { telemetryData, deviceInfo },
    } = await getDeviceInfo({
      deviceId,
    });
    const blackList = [
      'id',
      'lastActivityTime',
      'lastConnectTime',
      'lastDisconnectTime',
      'lastInactivityAlarmTime',
      'inactivityTimeout',
      'online',
      'heartbeat_cmd',
      'warning_time',
    ];
    Object.assign(currentObject.value, {
      telemetryData: telemetryData
        .filter((item: any) => !blackList.includes(item.key))
        .sort((a: any, b: any) => b.ts - a.ts)
        .slice(0, 6)
        .map((ele: any) => ({
          key: ele.key,
          value: ele.valueAsString,
          id: ele.ts,
        })),
      deviceName: deviceInfo.name.split('_')[0],
      deviceStatus: deviceInfo.active,
      deviceStatusName: deviceInfo.active ? '在线' : '离线',
      deviceType: params.deviceID === '5' ? 'camera' : 'other',
    });
  };
  /**
   * 查找物联网对象
   * @param {String} deviceID 物联网设备唯一ID
   */
  const find = (deviceID: string) => {
    currentObjectType.value = 0;
    // Object.assign(state.currentObject, {
    //   // 更新信息气泡内容
    //   id: deviceID,
    // });
    const id = convertDeviceId(deviceID);
    if (!id) return;
    _IOTV.find(id);
  };

  /**
   * 添加事件（应急等）
   * @param {*} deviceID
   */
  const addEvent = (deviceID: string) => {
    currentObjectType.value = 2;
    // Object.assign(state.currentObject, {
    //   // 更新信息气泡内容
    //   id: deviceID,
    // });
    const id = convertDeviceId(deviceID);
    if (!id) return;
    _IOTV.addEvent(id);
  };

  /**
   * 清除事件（应急等）
   * @param {*} deviceID
   */
  const removeEvent = (deviceID: string) => {
    const id = convertDeviceId(deviceID);
    if (!id) return;
    _IOTV.removeEvent(id);
  };

  /**
   * 查找人员
   * @param {*} twinId
   */
  const findPerson = (twinId: string) => {
    currentObjectType.value = 1;
    Object.assign(currentObject.value, {
      // 更新信息气泡内容
      id: twinId,
    });
    _IOTV.find(twinId);
  };

  return {
    find,
    addEvent,
    removeEvent,
    findPerson,
    currentObject,
    currentObjectType,
    initIOTV,
  };
};
