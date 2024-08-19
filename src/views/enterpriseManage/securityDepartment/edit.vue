<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" />
        <span class="title">{{ title }}安全部门</span>
      </div>
      <div class="form">
        <a-form ref="form" :model="formData" :rules="rules">
          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            基本信息
          </div>

          <div class="content">
            <a-form-item field="name" label="安全部门名称" required>
              <a-input
                v-model.trim="formData.name"
                allow-clear
                placeholder="请输入安全部门名称"
              ></a-input>
            </a-form-item>
            <a-form-item required label="安全部门负责人" :content-flex="false">
              <a-row align="center" justify="center">
                <a-col :span="12">
                  <a-form-item
                    field="leaderId"
                    :wrapper-col-props="{ span: 23 }"
                    class="response-person"
                  >
                    <a-select
                      v-model:model-value="formData.leaderId"
                      :options="staffData"
                      :fallback-option="false"
                      placeholder="请选择安全部门负责人"
                      allow-search
                      allow-clear
                      :field-names="{
                        value: 'id',
                        label: 'userName',
                      }"
                      @change="leaderIdChange"
                    >
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    field="tel"
                    :wrapper-col-props="{ span: 24 }"
                    style="margin-bottom: 0"
                  >
                    <a-input
                      v-model.trim="formData.tel"
                      disabled
                      placeholder="手机号码"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form-item>
            <a-form-item label="次要负责人" :content-flex="false">
              <a-row align="center">
                <a-col :span="12">
                  <a-form-item
                    field="leaderSecondId"
                    :wrapper-col-props="{ span: 23 }"
                    class="response-person"
                  >
                    <a-select
                      v-model:model-value="formData.leaderSecondId"
                      :options="staffData"
                      :fallback-option="false"
                      allow-search
                      allow-clear
                      placeholder="请选择次要负责人"
                      :field-names="{
                        value: 'id',
                        label: 'userName',
                      }"
                      @change="leaderSecondIdChange"
                    >
                    </a-select>
                  </a-form-item>
                </a-col>
                <a-col :span="12">
                  <a-form-item
                    field=""
                    :wrapper-col-props="{ span: 24 }"
                    style="margin-bottom: 0"
                  >
                    <a-input
                      v-model.trim="formData.leaderSecondTel"
                      disabled
                      placeholder="手机号码"
                    />
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form-item>
          </div>

          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            选择部门人员
          </div>
          <div class="content">
            <a-form-item
              field="employeeIds"
              label=""
              :wrapper-col-props="{ span: 24 }"
            >
              <a-button type="primary" @click="openDrawer">
                <icon-plus class="icon" />
                选择部门人员
              </a-button>
              <template #extra>
                <a-table
                  :data="formData.employeeList"
                  :bordered="false"
                  :pagination="false"
                >
                  <template #columns>
                    <a-table-column
                      title="员工姓名"
                      align="center"
                      data-index="userName"
                    ></a-table-column>
                    <!-- <a-table-column
                      title="员工工号"
                      :width="240"
                      align="center"
                      data-index="jobNumber"
                    ></a-table-column> -->
                    <a-table-column
                      title="所属部门"
                      align="center"
                      data-index="deptName"
                    ></a-table-column>
                    <a-table-column
                      title="岗位"
                      align="center"
                      data-index="jobName"
                    ></a-table-column>
                    <a-table-column
                      title="手机号码"
                      align="center"
                      data-index="tel"
                    ></a-table-column>
                    <a-table-column title="操作" align="center">
                      <template #cell="{ record }">
                        <a-button
                          type="text"
                          status="danger"
                          @click="deleteEmployeeItem(record.id)"
                        >
                          移除
                        </a-button>
                      </template>
                    </a-table-column>
                  </template>
                </a-table>
              </template>
            </a-form-item>
          </div>

          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            其他信息
          </div>
          <div class="content other-content">
            <a-form-item field="safeDesc" label="部门描述">
              <a-textarea
                placeholder="请输入部门描述"
                v-model.trim="formData.safeDesc"
                :auto-size="{ maxRows: 6, minRows: 6 }"
                show-word-limit
                :max-length="300"
              ></a-textarea>
            </a-form-item>
          </div>
        </a-form>
      </div>
      <div class="btn">
        <a-space>
          <a-button @click="goBack">取消</a-button>
          <a-button type="primary" @click="submit">保存</a-button>
        </a-space>
      </div>
    </a-card>

    <!-- 员工抽屉 -->
    <a-drawer
      :width="600"
      :visible="visible"
      unmount-on-close
      class="securityDepartMentDrawer"
      @ok="drawerOk"
      @cancel="drawerCancel"
    >
      <template #title> 选择部门人员 </template>
      <TableListCard :autoTableHeight="false">
        <template #headerInput>
          <a-space :size="[10, 0]">
            <a-tree-select
              v-model.trim="drawerTempSearchForm.deptId"
              :data="deptData"
              :disable-filter="true"
              :fallback-option="false"
              :field-names="{
                title: 'name',
                key: 'id',
              }"
              allow-clear
              allow-search
              placeholder="请选择所属部门"
              @search="onDeptSearch"
              @blur="clearSearchKey"
              @clear="clearSearchKey"
            ></a-tree-select>

            <a-input
              v-model.trim="drawerTempSearchForm.condition"
              placeholder="请输入员工姓名/手机号码/岗位"
              allow-clear
            ></a-input>
          </a-space>
        </template>
        <template #headerBtn>
          <a-button
            type="primary"
            @click="
              () => {
                drawerSelectForm = drawerTempSearchForm;
                drawerSelectForm.pageNo = 1;
                getDrawerStaffData();
              }
            "
          >
            <icon-search class="icon" />
            查询
          </a-button>
        </template>

        <template #table>
          <a-table
            v-model:selected-keys="selectKeys"
            :data="drawerStaffData.list"
            row-key="id"
            :columns="columns"
            :bordered="false"
            :pagination="false"
            :row-selection="{
              type: 'checkbox',
              width: 60,
              onlyCurrent: false,
              showCheckedAll: true,
            }"
          >
          </a-table>
        </template>
        <template #pagination>
          <a-pagination
            :current="drawerSelectForm.pageNo"
            :page-size="drawerSelectForm.pageSize"
            show-total
            show-page-size
            :page-size-options="[10, 20, 50, 100]"
            :base-size="3"
            :buffer-size="1"
            :total="(drawerStaffData.total as number)"
            @change="currentChange"
            @page-size-change="pageSizeChange"
          ></a-pagination>
        </template>
      </TableListCard>
    </a-drawer>
  </div>
</template>

<script lang="ts">
  import { cloneDeep } from 'lodash';
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useUserStore } from '@/store';
  import { Message } from '@arco-design/web-vue';
  import {
    getOrganizationTreeAPI,
    addSafeDeptAPI,
    updateSafeDeptAPI,
    detailSafeDeptAPI,
    getStaffDataAllAPI,
    getStaffDataAPI,
  } from '@/api/enterpriseManage';
  import type { AddSafeDeptData } from '@/api/enterpriseManage';
  import type {
    StaffData,
    StaffItem,
  } from '@/views/enterpriseManage/staffManage/index';
  import type { OrganizationTreeData } from '@/store/modules/enterprise/types';
  import type {
    TableColumnData,
    TableData,
  } from '@arco-design/web-vue/es/table/interface';
  import { handleOnKeyup } from '@/utils/event';

  export default {
    name: 'SecurityDepartmentEdit',
  };
</script>

<script lang="ts" setup>
  const router = useRouter();
  const route = useRoute();

  const title = computed(() => {
    if (route.query.type === 'add') {
      return '新增';
    }
    return '编辑';
  });

  const goBack = () => {
    form.value.resetFields();
    router.back();
  };

  const userStore = useUserStore();

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      drawerSelectForm.value = drawerTempSearchForm.value;
      drawerSelectForm.value.pageNo = 1;
      getDrawerStaffData();
    });
  });

  // ------------------------ 表单 -------------------------------

  const formData = ref<AddSafeDeptData>({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    name: '',
    leaderId: '',
    employeeIds: [],
    employeeList: [],
  });
  const form = ref();

  const rules = ref({
    name: [
      { required: true, message: '请输入安全部门名称' },
      { maxLength: 40, message: '不能超过40字符' },
    ],
    leaderId: [
      {
        validator: (value: any, callback: (error?: string) => void) => {
          if (!value) callback('请选择安全部门负责人');
          callback();
        },
      },
    ],
  });

  const staffData = ref<StaffItem[]>([]);

  const getStaffData = async () => {
    const { data: res } = await getStaffDataAllAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    staffData.value = res;
  };

  const getDetail = async () => {
    const { data: res } = await detailSafeDeptAPI({
      id: route.query.id as string,
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    formData.value = res;
    formData.value.employeeIds = res.employeeIds ? res.employeeIds : [];
    formData.value.employeeList = res.employeeList ? res.employeeList : [];
  };

  const getDataFn = async () => {
    await getStaffData();
    if (route.query.type !== 'add') {
      await getDetail();
      leaderIdChange(formData.value.leaderId);
      leaderSecondIdChange(formData.value.leaderSecondId as string);
    }
  };

  getDataFn();

  const leaderIdChange = (
    value:
      | string
      | number
      | Record<string, any>
      | (string | number | Record<string, any>)[]
  ) => {
    const item = staffData.value.find((item) => item.id === (value as string));

    formData.value.tel = item?.tel;
  };

  const leaderSecondIdChange = (
    value:
      | string
      | number
      | Record<string, any>
      | (string | number | Record<string, any>)[]
  ) => {
    const item = staffData.value.find((item) => item.id === (value as string));

    formData.value.leaderSecondTel = item?.tel;
  };

  const deleteEmployeeItem = (id: string) => {
    formData.value.employeeList = formData.value.employeeList.filter(
      (item: any) => item.id !== id
    );
    formData.value.employeeIds = formData.value.employeeIds.filter(
      (item) => item !== id
    );
  };

  const submit = async () => {
    const value = await form.value.validate();
    if (value) return;

    route.query.type === 'add' ? await addSubmit() : await editSubmit();
    goBack();
  };

  const addSubmit = async () => {
    await addSafeDeptAPI(formData.value);
    Message.success({
      content: '新增成功',
    });
  };

  const editSubmit = async () => {
    await updateSafeDeptAPI(formData.value);
    Message.success({
      content: '编辑成功',
    });
  };

  // ----------------------- 抽屉 -------------------------------
  const visible = ref(false);
  const deptData = ref<OrganizationTreeData[]>([]);
  let depyTree: OrganizationTreeData[] = []; // 用于树形下拉搜索

  const drawerSelectForm = ref({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    deptId: '',
    condition: '',
    pageNo: 1,
    pageSize: 10,
  });
  const drawerTempSearchForm = ref({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    deptId: '',
    condition: '',
    pageNo: 1,
    pageSize: 10,
  });
  const allTableData = ref<TableData[]>([]);
  const drawerStaffData = ref<StaffData>({ list: [], total: 0 });

  const columns: TableColumnData[] = [
    {
      title: '员工姓名',
      width: 100,
      dataIndex: 'userName',
    },

    // {
    //   title: '员工工号',
    //   dataIndex: 'jobNumber',
    // },
    {
      title: '所属部门',
      dataIndex: 'deptName',
    },
    {
      title: '岗位',
      dataIndex: 'jobName',
    },
    {
      title: '手机号码',
      dataIndex: 'tel',
    },
  ];
  const selectKeys = ref<string[]>([]);

  const getDrawerStaffData = async () => {
    const { data: res } = await getStaffDataAPI(drawerSelectForm.value);
    drawerStaffData.value = res;
    allTableData.value = deduplicateByProperty(
      [...res.list, ...allTableData.value],
      'id'
    );
  };

  const getDeptTree = async () => {
    const { data } = await getOrganizationTreeAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    deptData.value = data;
    depyTree = cloneDeep(deptData.value);
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

  const openDrawer = () => {
    getDeptTree();
    getDrawerStaffData();
    visible.value = true;
    selectKeys.value = formData.value.employeeIds;
    console.log(selectKeys.value);
  };

  const drawerOk = () => {
    const ids = [...new Set([...selectKeys.value])];
    const list: any[] = [];

    ids.forEach((item) => {
      const obj = allTableData.value.find((val) => val.id === item);
      obj ? list.push(obj) : '';
    });

    formData.value.employeeList = list;

    formData.value.employeeIds = ids;

    drawerCancel();
  };

  const drawerCancel = () => {
    // 特意保留 抽屉的搜索条件
    /*  drawerSelectForm.value = {
    enterpriseId: userStore.userInfo.enterpriseId as string,
    deptId: '',
    userName: '',
    pageNo: 1,
    pageSize: 10,
  }; */
    drawerSelectForm.value = {
      enterpriseId: userStore.userInfo.enterpriseId as string,
      deptId: '',
      condition: '',
      pageNo: 1,
      pageSize: 10,
    };
    drawerTempSearchForm.value = {
      enterpriseId: userStore.userInfo.enterpriseId as string,
      deptId: '',
      condition: '',
      pageNo: 1,
      pageSize: 10,
    };
    selectKeys.value = [];
    visible.value = false;
  };

  // ------------------ 抽屉table分页 ----------------------

  // --------树形下拉  搜索 start-----------

  function searchData(keyword: string) {
    const loop = (data: any) => {
      const result: OrganizationTreeData[] = [];
      data.forEach((item: any) => {
        if (item.name.toLowerCase().indexOf(keyword.toLowerCase()) > -1) {
          result.push({ ...item });
        } else if (item.children) {
          const filterData = loop(item.children);
          if (filterData.length) {
            result.push({
              ...item,
              children: filterData,
            });
          }
        }
      });
      // console.log(result);

      return result;
    };

    return loop(depyTree);
  }

  const onDeptSearch = (searchKey: string) => {
    setTimeout(() => {
      deptData.value = searchData(searchKey);
    }, 200);
  };

  const clearSearchKey = () => {
    onDeptSearch('');
  };
  // -------- 树形下拉  搜索 end-----------

  const currentChange = (current: number) => {
    drawerSelectForm.value.pageNo = current;
    getDrawerStaffData();
  };

  const pageSizeChange = (pageSize: number) => {
    drawerSelectForm.value.pageSize = pageSize;
    getDrawerStaffData();
  };
</script>

<style lang="less" scoped>
  .arco-card.content-card {
    .header {
      font-size: 18px;
      margin-bottom: 30px;

      .title {
        margin-left: 8px;
      }
    }

    .form {
      min-height: calc(100vh - 265px);
      margin-bottom: 20px;
      margin-left: 26px;

      .title {
        margin: 30px 0 20px;
        font-family: 'Alibaba-Medium';
        font-size: 16px;
        font-weight: 500;
        .arco-divider-vertical {
          margin-right: 2px;
          border-left: 1px solid #409eff;
        }
      }

      .content {
        display: flex;
        flex-direction: column;
        align-items: center;

        // 联系人 两列布局
        .arco-row {
          .arco-form-item {
            width: 100%;
          }
        }

        // 普通布局
        .arco-form-item {
          :deep(.arco-form-item-extra) {
            width: 100%;
            margin-top: 10px;
          }
          :deep(.arco-form-item-label-col) {
            flex: 0 0 126px;
            width: 126px;
          }
          :deep(.arco-form-item-wrapper-col.arco-col-19) {
            flex: 1;
          }
        }

        .icon {
          margin-right: 6px;
        }
      }

      .other-content {
        :deep(.arco-form-item .arco-form-item-label-col) {
          flex: 0 0 72px;
          width: 72px;
        }
      }

      .arco-form-item {
        width: 70%;

        // margin: 10px 50px;
        &.double-width {
          width: calc((100% / 3 - 100px) * 2 + 100px);
        }

        .arco-input-prepend {
          color: #aeb2c2;
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
    text-align: center;
  }

  // 抽屉样式覆盖
  .arco-card.card-table {
    :deep(.header) {
      .input {
        .arco-space {
          width: 100%;

          .arco-space-item {
            width: calc(100% / 2 - 20px);

            .arco-select-view-single,
            .arco-input-wrapper {
              width: 100%;
            }
          }
        }
      }

      .input-btn {
        padding-left: 10px;
      }
    }
  }

  .response-person {
    margin-bottom: 0;
    &.arco-form-item.arco-form-item-error {
      margin-bottom: -20px;
    }
  }
</style>
<style lang="less">
  .securityDepartMentDrawer {
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
