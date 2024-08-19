import _ from 'lodash';

export const useTableList = () => {
  const handleTableHeight = _.debounce(() => {
    // 获取表格，不包括分页高度
    const tableContainer: HTMLDivElement | null = document.querySelector(
      '.list-card-table .arco-table-container'
    );
    const pageContainer: HTMLDivElement | null =
      document.querySelector('.arco-table-pagination') ||
      document.querySelector('.arco-pagination');
    if (tableContainer && pageContainer) {
      const tableTop = tableContainer.getBoundingClientRect().top;
      const documentHeight = document.body.offsetHeight;
      const pageHeight = pageContainer.offsetHeight;
      tableContainer.style.minHeight =
        documentHeight - tableTop - pageHeight - 12 - 20 - 36 + 'px';
      window.scrollTo(0, 0);
    }
  });

  const handleLabelWidth = () => {
    const label: NodeListOf<HTMLDivElement> = document.querySelectorAll(
      '.arco-form-item-label-col'
    );
    const labelLength = label.length / 2 + (label.length % 3);
    for (let i = 0; i < labelLength; i++) {
      if (label[i].style.width || !label[i + 3]) return;
      if (label[i].offsetWidth > label[i + 3].offsetWidth) {
        label[i + 3].style.width = Math.ceil(label[i].offsetWidth) + 1 + 'px';
      } else if (label[i].offsetWidth <= label[i + 3].offsetWidth) {
        label[i].style.width = Math.ceil(label[i + 3].offsetWidth) + 1 + 'px';
      }
    }
  };

  return {
    handleTableHeight,
    handleLabelWidth,
  };
};
