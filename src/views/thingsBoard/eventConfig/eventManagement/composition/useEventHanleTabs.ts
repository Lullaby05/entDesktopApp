import { computed, reactive, ref } from 'vue';
import { calculateTime, timeUnitsType } from './calculateTime';

export const useEventHandleTabs = (
  allTabList: any,
  status: boolean = false
) => {
  const filterData = ref<string | number>('all');
  const now = ref(new Date());
  allTabList.value = allTabList.value?.map((item: any) => {
    const content: any[] = [];
    if (item.taskType === 1) {
      content.push(
        ...[
          {
            label: '处置任务',
            value: item.taskContent,
            visible: !!item.taskContent,
          },
          {
            label: '处置人',
            value: item.disposeName,
            visible: !!item.disposeName,
          },
          {
            label: '',
            value: item.agreement.map((ele: any) => ({
              ...ele,
              url: ele.filePath,
            })),
            type: 'attachment',
            visible: item.agreement && item.agreement.length > 0,
          },
        ]
      );
    }
    if (item.taskType === 2) {
      content.push(
        ...[
          {
            label: '现场情况',
            value: item.taskContent,
            visible: !!item.taskContent,
          },
          {
            label: '图片/视频',
            value: item.agreement.map((ele: any) => ({
              ...ele,
              url: ele.fileType === 'video' ? ele.coverUrl : ele.filePath,
            })),
            type: 'image',
            visible: item.agreement && item.agreement.length > 0,
          },
        ]
      );
    }
    if (item.taskType === 3) {
      content.push({
        label: '',
        value: item.taskContent,
        type: 'emergencyPlan',
        id: item.emanagementId,
        visible: !!item.taskContent,
      });
    }
    return {
      ...item,
      time: computed(() =>
        calculateTime({
          now: now.value,
          time: item.createTime,
          leastUnit: timeUnitsType.minutes,
          status,
        })
      ),
      content: content.filter((ele: any) => ele.visible),
      taskOperationHistory: (item.taskOperationHistory || [])
        .filter((ele: any) => ele.taskStatus === 2)
        .map((ele: any) => ({
          ...ele,
          time: calculateTime({
            now: now.value,
            time: ele.operationTime,
            leastUnit: timeUnitsType.minutes,
            status,
          }),
        })),
    };
  });
  if (!status) {
    setInterval(() => {
      now.value = new Date();
    }, 60 * 1000);
  }
  // const allTabList: any[] = reactive([
  //   {
  //     id: 'task',
  //     time: computed(() =>
  //       calculateTime({
  //         now: now.value,
  //         time: '2024-05-15 15:00:00',
  //         leastUnit: timeUnitsType.minutes,
  //         status,
  //       })
  //     ),
  //     person: '汪德',
  //     dept: '安全部门',
  //     title: '处置任务',
  //     content: [
  //       {
  //         label: '处置任务',
  //         value: '请立刻赶赴现场并按照文档所示内容进行处置',
  //       },
  //       {
  //         label: '',
  //         value: [
  //           {
  //             url: 'https://fastly.picsum.photos/id/172/200/300.jpg?hmac=Z5LhQNM9g-UdcCGfryluTaIrxwIaAD_pMo_izKB2nuA',
  //             sourceUrl:
  //               'https://fastly.picsum.photos/id/172/200/300.jpg?hmac=Z5LhQNM9g-UdcCGfryluTaIrxwIaAD_pMo_izKB2nuA',
  //           },
  //         ],
  //         type: 'image',
  //       },
  //     ],
  //   },
  //   {
  //     id: 'live',
  //     time: computed(() =>
  //       calculateTime({
  //         now: now.value,
  //         time: '2024-05-15 15:01:00',
  //         leastUnit: timeUnitsType.minutes,
  //         status,
  //       })
  //     ),
  //     person: '汪德',
  //     dept: '安全部门',
  //     title: '上报现场情况',
  //     content: [
  //       {
  //         label: '现场情况',
  //         value: '值班人员已到达现场',
  //       },
  //       {
  //         label: '图片/视频',
  //         value: [
  //           {
  //             url: 'https://fastly.picsum.photos/id/172/200/300.jpg?hmac=Z5LhQNM9g-UdcCGfryluTaIrxwIaAD_pMo_izKB2nuA',
  //             sourceUrl:
  //               'https://fastly.picsum.photos/id/172/200/300.jpg?hmac=Z5LhQNM9g-UdcCGfryluTaIrxwIaAD_pMo_izKB2nuA',
  //           },
  //         ],
  //         type: 'image',
  //       },
  //     ],
  //   },
  //   {
  //     id: 'task',
  //     time: computed(() =>
  //       calculateTime({
  //         now: now.value,
  //         time: '2024-05-15 15:02:00',
  //         leastUnit: timeUnitsType.minutes,
  //         status,
  //       })
  //     ),
  //     person: '汪德',
  //     dept: '安全部门',
  //     title: '启动应急预案',
  //     content: [
  //       {
  //         label: '',
  //         value: [
  //           {
  //             url: 'https://fastly.picsum.photos/id/172/200/300.jpg?hmac=Z5LhQNM9g-UdcCGfryluTaIrxwIaAD_pMo_izKB2nuA',
  //             sourceUrl:
  //               'https://fastly.picsum.photos/id/172/200/300.jpg?hmac=Z5LhQNM9g-UdcCGfryluTaIrxwIaAD_pMo_izKB2nuA',
  //           },
  //         ],
  //         type: 'attachment',
  //       },
  //     ],
  //   },
  //   {
  //     id: 'task',
  //     time: computed(() =>
  //       calculateTime({
  //         now: now.value,
  //         time: '2024-05-15 15:03:00',
  //         leastUnit: timeUnitsType.minutes,
  //         status,
  //       })
  //     ),
  //     person: '汪德',
  //     dept: '安全部门',
  //     title: '处置任务',
  //     content: [
  //       {
  //         label: '处置任务',
  //         value: '请立刻赶赴现场并按照文档所示内容进行处置',
  //       },
  //       {
  //         label: '处置人',
  //         value: '王德',
  //       },
  //       {
  //         label: '',
  //         value: [
  //           {
  //             url: 'https://fastly.picsum.photos/id/172/200/300.jpg?hmac=Z5LhQNM9g-UdcCGfryluTaIrxwIaAD_pMo_izKB2nuA',
  //             sourceUrl:
  //               'https://fastly.picsum.photos/id/172/200/300.jpg?hmac=Z5LhQNM9g-UdcCGfryluTaIrxwIaAD_pMo_izKB2nuA',
  //           },
  //         ],
  //         type: 'attachment',
  //       },
  //       {
  //         label: '完成情况',
  //         value: '请立刻赶赴现场并按照文档所示内容进行处置',
  //       },
  //       {
  //         label: '完成时间',
  //         value: '2024-05-15 16:00:00',
  //       },
  //     ],
  //   },
  // ]);
  const tabList = computed<any[]>(() => {
    if (filterData.value === 'all') return allTabList.value;
    return allTabList.value.filter((item: any) => {
      if (filterData.value === 1) {
        return item.taskType === 1 || item.taskType === 3;
      }
      return item.taskType === filterData.value;
    });
  });
  return {
    tabList,
    filterData,
  };
};
