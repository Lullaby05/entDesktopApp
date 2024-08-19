<!--
*@fileName list.vue
*@author wml
*@date 2023-06-29
*@description 管理设备类型 列表页面
!-->
<template>
  <div class="create-box">
    <a-modal
      :visible="manageTypeFlag"
      title-align="start"
      width="50%"
      :footer="false"
      unmount-on-close
      modal-class="dialog-class"
      :render-to-body="false"
      popup-container="create-box"
      @cancel="close"
    >
      <template #title> 管 理 设 备 类 型 </template>

      <div class="add">
        <a-button type="text" @click="creadClick">
          <icon-plus style="width: 24px; height: 24px" />
        </a-button>
      </div>

      <a-table
        :data="list"
        row-key="id"
        :bordered="{ wrapper: true, cell: true }"
        :pagination="false"
      >
        <template #columns>
          <a-table-column title="序号" :width="100">
            <!-- 给每一行的索引起名称 可以使用数组或迭代器或其他方 -->
            <template #cell="{ rowIndex }">
              {{ rowIndex + 1 }}
            </template>
          </a-table-column>
          <a-table-column title="设备类型ID" data-index="id"></a-table-column>
          <a-table-column
            title="设备类型名称"
            data-index="name"
          ></a-table-column>
          <a-table-column title="备注" data-index="remark"></a-table-column>
          <a-table-column title="操作" data-index="id">
            <template #cell="{ record }">
              <a-button type="text" @click="editClick(record)">编辑</a-button>
              <a-button type="text" status="danger" @click="deleteClick(record)"
                >删除</a-button
              >
            </template>
          </a-table-column>
        </template>
      </a-table>
    </a-modal>
  </div>
  <div class="edit-box">
    <a-modal
      :visible="dialogFlag.editFlag"
      title-align="start"
      width="40%"
      :render-to-body="false"
      popup-container="edit-box"
      unmount-on-close
      @cancel="editClose"
      @before-ok="editCommit"
    >
      <template #title> 编 辑 </template>
      <a-form :model="form">
        <a-form-item
          label="设备类型名称"
          field="name"
          validate-trigger="input"
          :rules="[{ required: true, message: 'firstname is required' }]"
        >
          <a-input
            v-model="form.name"
            placeholder="不能为空，最长为25字符"
            class="input-cell"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
  <div class="delete-box">
    <a-modal
      :visible="dialogFlag.deleteFlag"
      title-align="start"
      :render-to-body="false"
      popup-container="delete-box"
      unmount-on-close
      @cancel="deleteClose"
      @before-ok="deleteCommit"
    >
      <template #title> 删 除 </template>
      <div>是否确定删除该设备类型</div>
    </a-modal>
  </div>
  <div class="cread-box">
    <a-modal
      :visible="dialogFlag.createFlag"
      title-align="start"
      :render-to-body="false"
      width="40%"
      popup-container="cread-box"
      unmount-on-close
      @cancel="creadClose"
      @before-ok="creadCommit"
    >
      <template #title> 新 增 设 备 类 型 </template>
      <a-form :model="creadForm">
        <a-form-item
          label="设备类型名称"
          field="name"
          validate-trigger="input"
          :rules="[{ required: true, message: 'firstname is required' }]"
        >
          <a-input
            v-model="creadForm.name"
            placeholder="不能为空，最长为25字符"
            class="input-cell"
            allow-clear
          />
        </a-form-item>
        <a-form-item label="备注" field="remark" validate-trigger="input">
          <a-input v-model="creadForm.remark" class="input-cell" allow-clear />
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts" setup>
  import { defineEmits, ref, watch } from 'vue';
  import { cloneDeep } from 'lodash';
  import { Notification } from '@arco-design/web-vue';
  import { typeList, typeEdit, typeDelete, typeCreate } from '@/api/equipment';
  import useLoading from '@/hooks/loading';

  const prpos = defineProps({
    manageTypeFlag: { type: Boolean, default: false },
  });
  const form = ref({
    name: '',
  });
  const creadForm = ref({
    name: '',
    remark: '',
  });

  const emit = defineEmits(['commit', 'close']);

  const list = ref([]);
  const dialogFlag = ref({
    editFlag: false,
    deleteFlag: false,
    createFlag: false,
  });

  const { setLoading } = useLoading();

  const close = () => {
    emit('close', 'close');
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res: any = await typeList();
      list.value = res.data;
    } catch (err) {
      console.log(err);
      // you can report use errorHandler or other
    } finally {
      setLoading(false);
    }
  };

  const editClick = (row: any) => {
    console.log(row);
    form.value = cloneDeep(row);
    dialogFlag.value.editFlag = true;
  };

  const deleteClick = (row: any) => {
    console.log(row);
    form.value = cloneDeep(row);
    dialogFlag.value.deleteFlag = true;
  };

  const creadClick = () => {
    dialogFlag.value.createFlag = true;
  };

  const editClose = () => {
    dialogFlag.value.editFlag = false;
  };

  const editCommit = async () => {
    const res: any = await typeEdit(form.value);
    console.log('typeEdit=', res.data);

    if (res.code > 200) {
      Notification.error({
        title: '更 新 设 备 类 型 信 息 失 败',
        content: '原因为=' + res.msg,
      });
      return;
    }
    Notification.info({
      title: '更 新 设 备 类 型 信 息 成 功',
      content: '',
    });
    console.log('form= ', form.value);
    dialogFlag.value.editFlag = false;
    fetchData();
  };

  const deleteClose = () => {
    dialogFlag.value.deleteFlag = false;
  };

  const deleteCommit = async () => {
    const res: any = await typeDelete(form.value);
    console.log('typeDelete=', res.data);

    if (res.code > 200) {
      Notification.error({
        title: '更 新 设 备 类 型 信 息 失 败',
        content: '原因为=' + res.msg,
      });
      return;
    }
    Notification.info({
      title: '删 除 设 备 类 型 信 息 成 功',
      content: '',
    });
    console.log('form= ', form.value);
    dialogFlag.value.deleteFlag = false;
    fetchData();
  };

  const creadClose = () => {
    dialogFlag.value.createFlag = false;
  };

  const creadCommit = async () => {
    if (creadForm.value.name.length === 0) {
      Notification.error({
        title: '新 增 设 备 类 型 信 息 失 败',
        content: '请输入类型名称',
      });
      return;
    }
    const res: any = await typeCreate(creadForm.value);
    console.log('typeDelete=', res.data);

    if (res.code > 200) {
      Notification.error({
        title: '更 新 设 备 类 型 信 息 失 败',
        content: '原因为=' + res.msg,
      });
      return;
    }
    Notification.info({
      title: '删 除 设 备 类 型 信 息 成 功',
      content: '',
    });
    console.log('form= ', form.value);
    dialogFlag.value.createFlag = false;
    fetchData();
  };

  fetchData();

  watch(
    () => prpos.manageTypeFlag,
    () => {
      if (prpos.manageTypeFlag) {
        fetchData();
      }
    }
  );
</script>

<style lang="less" scoped>
  .create-box {
    :deep(.dialog-class) {
      position: relative;
    }
    :deep(.arco-modal-body) {
      padding: 0px;
    }
    :deep(.add) {
      width: 100%;
      display: flex;
      justify-content: end;
      position: absolute;
      z-index: 5;
      top: 0.3rem;
    }
  }
  .edit-box {
    :deep(.arco-modal-body) {
      padding: 24px 20px;
    }
  }

  .delete-box {
    :deep(.arco-modal-body) {
      padding: 24px 20px;
    }
  }
</style>
