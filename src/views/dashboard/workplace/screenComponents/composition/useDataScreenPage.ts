export const useDataScreenPage = (options: {
  defaultPageNo?: number;
  defaultPageSize?: number;
  currentData: any;
  chartOption: (currentData: any) => void;
}) => {
  options = Object.assign(
    {
      defaultPageNo: 0,
      defaultPageSize: 5,
    },
    options
  );
  const { defaultPageNo, defaultPageSize, currentData, chartOption } = options;
  // 分页
  const currentPage = ref(defaultPageNo);
  const pageSize = ref(defaultPageSize);
  const totalPages = computed(() => {
    return Math.ceil(currentData.value.length / pageSize.value!);
  });
  // 总数
  const total = computed(() => {
    return currentData.value.length;
  });
  const paginatedData = computed(() => {
    const start = currentPage.value! * pageSize.value!;
    const end = start + pageSize.value!;
    return currentData.value.slice(start, end);
  });
  const prevPage = () => {
    if (currentPage.value! > 0) {
      currentPage.value!--;
      chartOption(currentData.value);
    }
  };
  const nextPage = () => {
    if (currentPage.value! < totalPages.value - 1) {
      currentPage.value!++;
      chartOption(currentData.value);
    }
  };
  // 跳转到指定页数
  const jumpPage = (pageNum: number) => {
    let pageNo = pageNum - 1;
    if (pageNo >= 0 && pageNo < totalPages.value) {
      currentPage.value = pageNo;
      chartOption(currentData.value);
    }
  };
  return {
    currentPage,
    pageSize,
    totalPages,
    total,
    paginatedData,
    prevPage,
    nextPage,
    jumpPage,
  };
};
