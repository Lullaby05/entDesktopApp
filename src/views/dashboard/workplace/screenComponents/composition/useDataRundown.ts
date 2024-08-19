import useLoading from '@/hooks/loading';
import { formatDate } from '@/utils/utils';
import { cloneDeep } from 'lodash';

// 数据下钻，每一个dataBlock都有一个单独的下钻方法，根据不同的数据类型进行不同的下钻逻辑
export const useDataRundown = (options: {
  apis: any[];
  timeParams?: any;
  isNeedTimeParams?: boolean;
}) => {
  Object.assign(options, {
    isNeedTimeParams: true,
  });
  const { apis, timeParams, isNeedTimeParams } = options;
  const { timeRange, timeRangeToScopeObj, timeArr } = timeParams;

  const apiMap = new Map();

  const { loading, setLoading } = useLoading();

  // 需要一个闭包保存传递过来的参数，后续如果需要刷新还需要这个参数
  const handleSearch = async (params: any, callback?: Function) => {
    if (loading.value) return;
    const step = cloneDeep(rundownStep.value);
    const handleParamsSearch = async () => {
      const timeParam = getTimeParam();
      if (Array.isArray(params)) {
        const { data } = await apis[step](params);
        rundownData.value = data;
      } else {
        const { data } = await apis[step]({
          ...params,
          ...timeParam,
        });
        rundownData.value = data;
      }
      callback && callback();
    };
    setLoading(true);
    await handleParamsSearch();
    setLoading(false);
    rundownStep.value++;
    // 每请求一次就往当前步骤下面加上这次请求的方法和参数
    apiMap.set(rundownStep.value, handleParamsSearch);
    return handleParamsSearch;
  };

  const getTimeParam = () => {
    if (!isNeedTimeParams) return {};
    return {
      timeScope: timeRange.value,
      scale:
        timeRangeToScopeObj[
          timeRange.value as keyof typeof timeRangeToScopeObj
        ] ?? 'Day',
      startTime:
        timeRange.value === 'other' || timeRange.value.includes('--')
          ? formatDate(new Date(timeArr.value[0]).setHours(0, 0, 0, 0))
          : undefined,
      endTime:
        timeRange.value === 'other' || timeRange.value.includes('--')
          ? formatDate(new Date(timeArr.value[1]).setHours(23, 59, 59, 0))
          : undefined,
    };
  };

  // 下钻数据
  const rundownData: any = ref();

  // 具体下钻的层级，默认为1
  const rundownStep = ref(1);

  const back = async () => {
    if (rundownStep.value === 1) return;
    // 返回的时候从apiMap取出上一步的请求方法，然后执行
    if (apiMap.has(rundownStep.value - 1)) {
      const handleParamsSearch = apiMap.get(rundownStep.value - 1);
      await handleParamsSearch();
    }
    rundownStep.value--;
  };

  return {
    rundownData,
    rundownStep,
    handleSearch,
    back,
  };
};
