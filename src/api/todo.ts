import Axios from '@/api/interceptor';

// 获取待办列表
export const getTodoList = () => {
  return Axios({
    url: `/businessApi/business/todo/get-list`,
    method: "POST",
  });
};

// 获取待办列表（条件）
export const getTodoListByCondition = (data: string) => {
  return Axios({
    url: `/businessApi/business/todo/get-list?condition=${data}`,
    method: "POST",
  });
};

type todoFilterType = {
  sort?: number;
  status?: number;
  type: number;
};

// 获取待办列表（筛选）
export const getTodoListByFilter = (data: todoFilterType) => {
  return Axios({
    url: `/businessApi/business/todo/select`,
    method: "POST",
    data,
  });
};

// 获取待办列表统计数量
export const getTodoListNum = (data: any) => {
  return Axios({
    url: `/businessApi/business/todo/select-num`,
    method: "POST",
    data
  });
};