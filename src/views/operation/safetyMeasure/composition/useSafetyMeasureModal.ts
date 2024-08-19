import {
  safetyMeasureDel,
  safetyMeasureAdd,
  safetyMeasureEdit,
} from '@/api/operation/safetyMeasure';
import { computed, h, onBeforeMount, ref } from 'vue';
import { Message, Modal } from '@arco-design/web-vue';
import ConfirmModalBody from '@/components/confirm/index.vue';
import { useUserStore } from '@/store';

export const useSafetyModal = (
  modalFormRef: any,
  getTableList: () => void,
  tableData: any,
  searchForm: any
) => {
  const modalVisible = ref<boolean>(false);
  const modalTitle = ref<string>('新增安全措施');

  const userStore = useUserStore();
  const userInfo = computed(() => {
    return userStore.userInfo;
  });
  const modalFormData = ref({
    id: '',
    operationType: '',
    securityMeasure: '',
  });

  const modalFormRules = {
    operationType: [
      {
        required: true,
        message: '请选择作业类型',
        trigger: 'change',
      },
    ],
    securityMeasure: [
      {
        required: true,
        message: '请输入作业安全措施',
        trigger: 'change',
      },
    ],
  };

  const onClose = async () => {
    modalVisible.value = false;
    await modalFormRef.value.clearValidate();
    modalTitle.value = '新增安全措施';
    modalFormData.value = {
      id: '',
      operationType: '',
      securityMeasure: '',
    };
  };

  const onSave = async () => {
    const isAdd = modalFormData.value.id ? false : true;
    const valid = await modalFormRef.value.validate();
    if (!valid) {
      const reqObj = isAdd ? safetyMeasureAdd : safetyMeasureEdit;
      const params = {
        ...modalFormData.value,
        id: modalFormData.value.id || undefined,
        tenantId: userInfo.value.tenantId,
      };
      await reqObj(params);
      Message.success({
        content: isAdd ? '新增成功' : '编辑成功',
      });
      getTableList();
      onClose();
    }
  };

  const handleDelete = async (name: string, id: string) => {
    Modal.open({
      title: '提示',
      titleAlign: 'start',
      content: () =>
        h(ConfirmModalBody, {
          content:
            '<span style="font-size: 16px;font-weight: 700;">确认删除该<span style="margin: 0 8px;color: rgb(var(--red-6));">作业安全措施</span>吗？</span>',
          info: '删除数据不可恢复，请谨慎操作！',
        }),
      onOk: async () => {
        await safetyMeasureDel(id);
        Message.success('删除成功');
        let totalPage = Math.ceil(
          (tableData.value.total! - 1) / searchForm.value.pageSize!
        );
        let currentPage =
          searchForm.value.pageNo! > totalPage
            ? totalPage
            : searchForm.value.pageNo;
        searchForm.value.pageNo = currentPage! < 1 ? 1 : currentPage;
        getTableList();
      },
    });
  };
  const handleEdit = (record: any) => {
    modalFormData.value = {
      id: record.id,
      operationType: record.operationType,
      securityMeasure: record.securityMeasure,
    };
    modalTitle.value = '编辑安全措施';
    modalVisible.value = true;
  };

  return {
    modalVisible,
    modalFormData,
    modalFormRules,
    onClose,
    handleDelete,
    handleEdit,
    modalTitle,
    onSave,
  };
};
