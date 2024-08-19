<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" />
        <span class="title">{{ title }}</span>
      </div>

      <div class="form">
        <a-form
          ref="form"
          :model="formData"
          :rules="rules"
          :label-col-props="{ span: 4 }"
        >
          <a-form-item field="teamType" label="队伍类型" required>
            <a-select
              v-model:model-value="formData.teamType"
              allow-clear
              allow-search
              placeholder="请选择队伍类型"
              :field-names="{
                label: 'jobName',
                value: 'id',
              }"
            >
              <a-option v-for="(value, key) of troopsTypeData" :value="key">{{
                value
              }}</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="teamName" label="队伍名称">
            <a-input
              v-model.trim="formData.teamName"
              placeholder="请输入队伍名称"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="teamLeaderId" label="主要负责人" required>
            <a-select
              v-model:model-value="formData.teamLeaderId"
              allow-clear
              allow-search
              :options="staffData"
              :fallback-option="false"
              placeholder="请选择主要负责人"
              :field-names="{
                value: 'id',
                label: 'userName',
              }"
              @change="leaderChange($event, 'teamLeaderId')"
            >
            </a-select>
          </a-form-item>
          <a-form-item
            field="teamLeaderTel"
            label="主要负责人手机号码"
            required
          >
            <a-input
              v-model:model-value="formData.teamLeaderTel"
              disabled
              placeholder="请输入主要负责人手机号码"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="divisionLeaderId" label="分管负责人">
            <a-select
              v-model:model-value="formData.divisionLeaderId"
              allow-clear
              allow-search
              :options="staffData"
              :fallback-option="false"
              placeholder="请选择分管负责人"
              :field-names="{
                value: 'id',
                label: 'userName',
              }"
              @change="leaderChange($event, 'divisionLeaderTel')"
            >
            </a-select>
          </a-form-item>
          <a-form-item field="divisionLeaderTel" label="分管负责人手机号码">
            <a-input
              v-model:model-value="formData.divisionLeaderTel"
              disabled
              placeholder="手机号码"
              allow-clear
            ></a-input>
          </a-form-item>
          <a-form-item field="agreement" label="协议附件">
            <a-upload
              v-model:file-list="formData.agreementList"
              action=""
              :custom-request="customRequest"
              multiple
              accept=".doc,.docx,.pdf"
              :limit="5"
              @beforeUpload="(e) => beforeUpload(e, '.doc,.docx,.pdf')"
              @success="uploadPicSuccess"
              @before-remove="beforeRemove"
            >
            </a-upload>
          </a-form-item>

          <a-form-item field="employeeIds" label="">
            <a-button type="primary" @click="openDrawer">
              <icon-plus class="icon" />
              选择队伍成员
            </a-button>
            <template #extra>
              <a-table
                :data="formData.teamEmployees"
                :bordered="false"
                :pagination="false"
              >
                <template #columns>
                  <a-table-column
                    align="center"
                    title="成员姓名"
                    data-index="userName"
                  ></a-table-column>
                  <a-table-column
                    align="center"
                    title="手机号码"
                    data-index="tel"
                  ></a-table-column>

                  <a-table-column align="center" title="操作">
                    <template #cell="{ record }">
                      <a-button
                        type="text"
                        status="danger"
                        @click="deleteTableItem(record.id)"
                      >
                        移除
                      </a-button>
                    </template>
                  </a-table-column>
                </template>
              </a-table>
            </template>
          </a-form-item>
        </a-form>
      </div>
      <div class="btn">
        <a-space>
          <a-button @click="goBack">取消</a-button>
          <a-button type="primary" @click="submit">保存</a-button>
        </a-space>
      </div>
    </a-card>

    <!-- 抽屉 -->
    <a-drawer
      :width="600"
      :visible="visible"
      unmount-on-close
      class="troopsDrawer"
      @ok="drawerOk"
      @cancel="drawerCancel"
    >
      <template #title> 选择队伍成员 </template>
      <TableListCard :autoTableHeight="false">
        <template #headerInput>
          <a-space>
            <a-input
              v-model.trim="tempSearchForm.userName"
              allow-clear
              placeholder="请输入成员姓名"
            >
            </a-input>
          </a-space>
        </template>
        <template #headerBtn>
          <a-space>
            <a-button
              type="primary"
              @click="
                () => {
                  selectForm = tempSearchForm;
                  getDrawerData();
                }
              "
            >
              <icon-search class="icon" />
              查询
            </a-button>
          </a-space>
        </template>

        <template #table>
          <a-table
            v-model:selected-keys="selectedKeys"
            :data="drawerData.list"
            row-key="id"
            :bordered="false"
            :row-selection="{
              type: 'checkbox',
              title: '选择',
              width: 60,
              onlyCurrent: false,
            }"
            :pagination="false"
          >
            <template #columns>
              <a-table-column title="成员姓名" data-index="userName">
              </a-table-column>
              <a-table-column title="手机号码" data-index="tel">
              </a-table-column>
            </template>
          </a-table>
        </template>
        <template #pagination>
          <a-pagination
            :current="selectForm.pageNo"
            :page-size="selectForm.pageSize"
            show-total
            show-page-size
            :page-size-options="[10, 20, 50, 100]"
            :base-size="3"
            :buffer-size="1"
            :total="(drawerData.total as number)"
            @change="drawerCurrentChange"
            @page-size-change="drawerPageSizeChange"
          ></a-pagination>
        </template>
      </TableListCard>
    </a-drawer>
  </div>
</template>

<script lang="ts">
  import { ref, h, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useUserStore } from '@/store';
  import { FileItem, Modal, Message, TableData } from '@arco-design/web-vue';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { UploadPath, getEnumListAPI } from '@/api/index';
  import { getStaffDataAllAPI, getStaffDataAPI } from '@/api/enterpriseManage';
  import {
    addTroopsItemAPI,
    detailTroopsItemAPI,
    updateTroopsItemAPI,
  } from '@/api/emergency';
  import type { AddTroopsItemData } from '@/api/emergency';
  import type { GetStaffData } from '@/api/enterpriseManage';
  import type {
    StaffItem,
    StaffData,
  } from '@/views/enterpriseManage/staffManage/index';
  import { handleOnKeyup } from '@/utils/event';
  import { useCustomUpload } from '@/hooks/customUpload';

  export default {
    name: 'TroopsEditPage',
  };
</script>

<script lang="ts" setup>
  // 上传
  const { customRequest, beforeUpload } = useCustomUpload();

  const router = useRouter();
  const route = useRoute();

  const title = computed(() => {
    if (route.query.type === 'add') {
      return '新增队伍';
    }
    getDetail();
    return '编辑队伍';
  });

  const goBack = () => {
    form.value.resetFields();
    router.back();
  };

  const userStore = useUserStore();

  // ----------------------- 前置数据 ---------------------------

  const staffData = ref<StaffItem[]>([]);

  const getStaffData = async () => {
    const { data: res } = await getStaffDataAllAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });

    staffData.value = res;
  };

  getStaffData();

  const troopsTypeData = ref<any>();

  const getTroopsTypeData = async () => {
    const { data } = await getEnumListAPI('EMERGENCY_TEAM_TYPE');
    troopsTypeData.value = data;
  };

  getTroopsTypeData();
  // ------------------------ 表单 -------------------------------

  const formData = ref<AddTroopsItemData>({
    tenantId: userStore.tenantId as string,
    teamType: '',
    teamName: '',
    teamLeaderId: '',
    teamLeaderTel: '',
    teamEmployeeIds: '',
    teamEmployees: [],
    agreementList: [],
  });
  const form = ref();

  const rules = ref({
    teamType: [{ required: true, message: '请选择队伍类型' }],
    teamName: [
      { required: true, message: '请输入队伍名称' },
      { maxLength: 25, message: '不能超过25字符' },
    ],
    teamLeaderId: [{ required: true, message: '请选择主要负责人' }],
    teamLeaderTel: [{ required: true, message: '请先选择主要负责人' }],
  });

  const leaderChange = (
    e:
      | string
      | number
      | Record<string, any>
      | (string | number | Record<string, any>)[],
    text: string
  ) => {
    const obj = staffData.value.find((item) => item.id === e);
    text === 'divisionLeaderTel'
      ? (formData.value.divisionLeaderTel = obj?.tel)
      : (formData.value.teamLeaderTel = obj?.tel as string);
    if (text === 'teamLeaderId') {
      form.value.validateField('teamLeaderTel');
    }
  };

  const uploadPicSuccess = (e: FileItem) => {
    const {
      response: { data, code, msg },
      file,
    } = e;

    if (code < 200 && file?.size) {
      const arr = formData.value.agreement
        ? formData.value.agreement.split(',')
        : [];
      data.forEach((item: any) => {
        arr.push(item.fileName);
      });
      formData.value.agreement = arr.join(',');
    } else {
      Message.error('上传失败，原因为' + msg);
    }
  };

  const beforeRemove = (file: any): Promise<boolean> => {
    return new Promise((resolve, reject) => {
      Modal.open({
        title: '提示',
        titleAlign: 'start',
        content: () =>
          h(ConfirmModalBody, {
            text: '附件',
            info: '删除数据不可恢复，请谨慎操作！',
          }),
        onOk: () => {
          let fileName = file.response
            ? file.response.data[0].fileName
            : file.fileName;
          let arr = formData.value.agreement?.split(',');
          arr = arr?.filter((item: any) => item !== fileName);
          // 转化为字符串，通过逗号分割
          formData.value.agreement = arr?.join(',');
          return resolve(true);
        },
        onCancel: () => reject('cancel'),
      });
    });
  };

  const uploadPreview = (fileItem: FileItem) => {
    // console.log(fileItem);
    window.open(fileItem.response.data[0].filePath);
  };

  const getDetail = async () => {
    const { data: res } = await detailTroopsItemAPI({
      id: route.query.id as string,
      tenantId: userStore.tenantId as string,
    });

    formData.value = res;
    formData.value.teamEmployees = res.teamEmployees ? res.teamEmployees : [];
    res.agreementList = res.agreementList ? res.agreementList : [];
    formData.value.agreementList = res.agreementList.map((item: any) => {
      // console.log(item.filePath);
      const fileName = item.fileName.split('//')[0];
      return { name: fileName, url: item.fileUrl, fileName: item.fileName };
    });
  };

  const submit = async () => {
    const value = await form.value.validate();
    if (value) return;
    route.query.type === 'add' ? await addSubmit() : await editSubmit();
    goBack();
  };

  const addSubmit = async () => {
    await addTroopsItemAPI(formData.value);
    Message.success({
      content: '新增成功',
    });
  };

  const editSubmit = async () => {
    await updateTroopsItemAPI(formData.value);
    Message.success({
      content: '编辑成功',
    });
  };

  const deleteTableItem = (id: string) => {
    formData.value.teamEmployees = formData.value.teamEmployees.filter(
      (item: any) => item.id !== id
    );

    let arr = formData.value.teamEmployeeIds.split(',');
    arr = arr.filter((val: string) => val !== id);
    formData.value.teamEmployeeIds = arr.join(',');
  };
  // ----------------------- 抽屉 -------------------------------

  const visible = ref(false);
  const selectForm = ref<GetStaffData>({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    userName: '',
    pageNo: 1,
    pageSize: 10,
  });
  const tempSearchForm = ref<GetStaffData>({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    userName: '',
    pageNo: 1,
    pageSize: 10,
  });
  const drawerData = ref<StaffData>({ list: [], total: 0 });
  const allTableData = ref<TableData[]>([]);
  const selectedKeys = ref<(string | number)[]>([]);

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getDrawerData();
    });
  });

  const openDrawer = () => {
    const arr = formData.value.teamEmployeeIds
      ? formData.value.teamEmployeeIds.split(',')
      : [];
    selectedKeys.value = arr;

    getDrawerData();
    visible.value = true;
  };

  const getDrawerData = async () => {
    const { data } = await getStaffDataAPI(selectForm.value);
    drawerData.value = data;
    allTableData.value = deduplicateByProperty(
      [...data.list, ...allTableData.value],
      'id'
    );
  };

  const deduplicateByProperty = (arr: any[], property: string) => {
    return arr.reduce((uniqueArr, item) => {
      if (
        !uniqueArr.some(
          (i: { [x: string]: any }) => i[property] === item[property]
        )
      ) {
        uniqueArr.push(item);
      }
      return uniqueArr;
    }, []);
  };

  const drawerOk = () => {
    formData.value.teamEmployees = [];
    selectedKeys.value.forEach((item) => {
      const obj = allTableData.value.find((val) => val.id === item);
      obj ? formData.value.teamEmployees.push(obj) : '';
    });

    formData.value.teamEmployeeIds = selectedKeys.value.join(',');

    drawerCancel();
  };

  const drawerCancel = () => {
    selectedKeys.value = [];
    selectForm.value = tempSearchForm.value = {
      enterpriseId: userStore.userInfo.enterpriseId as string,
      userName: '',
      pageNo: 1,
      pageSize: 10,
    };
    visible.value = false;
  };
  const drawerCurrentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getDrawerData();
  };

  const drawerPageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getDrawerData();
  };
</script>

<style lang="less" scoped>
  .upload-tip {
    color: #f59b22;
  }
  .arco-card.content-card {
    .header {
      font-size: 18px;
      margin-bottom: 30px;
      .title {
        margin-left: 8px;
      }
    }
    .form {
      width: 100%;
      min-height: calc(100vh - 265px);
      margin-bottom: 20px;

      .arco-form-item {
        // width: 70%;
        // margin: 10px 50px;
        &.double-width {
          width: calc((100% / 3 - 100px) * 2 + 100px);
        }
        .arco-input-prepend {
          color: #aeb2c2;
        }
        :deep(.arco-form-item-extra) {
          margin-top: 14px;
          width: 100%;
        }
      }

      .form-item-space {
        margin-top: 14px;
        .icon {
          margin-right: 8px;
        }
      }
    }
  }
  .btn {
    margin-top: 12px;
    width: 100%;
    text-align: center;
  }
</style>
<style lang="less">
  .troopsDrawer {
    .arco-drawer-body .arco-card-bordered {
      border: none;
      .arco-card-body {
        padding: 0;
      }
    }

    .arco-drawer-footer {
      border-top: none;
    }
  }
</style>
