<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" />
        <span class="title">{{ title }}工种</span>
      </div>

      <div class="form">
        <a-form
          ref="form"
          :model="formData"
          :rules="rules"
          :label-col-props="{ span: 4 }"
        >
          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            基础信息
          </div>

          <div class="content">
            <a-form-item field="name" label="工种名称" required>
              <a-input
                v-model.trim="formData.name"
                allow-clear
                placeholder="请输入工种名称"
              ></a-input>
            </a-form-item>
            <a-form-item field="remark" label="工种描述">
              <a-textarea
                v-model.trim="formData.remark"
                :auto-size="{ maxRows: 6, minRows: 6 }"
                show-word-limit
                :max-length="300"
                placeholder="请输入工种描述"
              ></a-textarea>
            </a-form-item>
          </div>

          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            选择相关职业病
          </div>
          <div class="content">
            <a-form-item
              field="odDiseasesType"
              label=""
              :wrapper-col-props="{ span: 24 }"
            >
              <a-button type="primary" @click="openDrawer('odDiseasesType')">
                <icon-plus class="icon" />
                选择相关职业病
              </a-button>
              <template #extra>
                <a-table
                  :data="formData.odDiseasesTypeList"
                  :bordered="false"
                  :pagination="false"
                >
                  <template #columns>
                    <a-table-column
                      align="center"
                      title="职业病名称"
                      data-index="name"
                      :width="200"
                    ></a-table-column>
                    <a-table-column
                      align="center"
                      title="备注"
                      data-index="intro"
                    ></a-table-column>

                    <a-table-column align="center" title="操作" :width="100">
                      <template #cell="{ record }">
                        <a-button
                          type="text"
                          status="danger"
                          @click="deleteTableItem('odDiseasesType', record.id)"
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
            选择可能接触到的危害因素
          </div>
          <div class="content">
            <a-form-item
              field="harmfulFactor"
              label=""
              :wrapper-col-props="{ span: 24 }"
            >
              <a-button type="primary" @click="openDrawer('harmfulFactor')">
                <icon-plus class="icon" />
                选择危害因素
              </a-button>
              <template #extra>
                <a-table
                  :data="formData.harmfulFactorList"
                  :bordered="false"
                  :pagination="false"
                >
                  <template #columns>
                    <a-table-column
                      align="center"
                      title="危害类型"
                      data-index="harmfulTypeName"
                    ></a-table-column>

                    <a-table-column
                      align="center"
                      title="危害因素名称"
                      data-index="name"
                    ></a-table-column>
                    <a-table-column
                      align="center"
                      title="接触限值"
                      data-index="boundaryValue"
                    ></a-table-column>
                    <a-table-column
                      align="center"
                      title="备注（CAS号）"
                      data-index="remark"
                    ></a-table-column>
                    <a-table-column title="操作" align="center" :width="100">
                      <template #cell="{ record }">
                        <a-button
                          type="text"
                          status="danger"
                          @click="deleteTableItem('harmfulFactor', record.id)"
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
      class="workTypeDrawer"
      @ok="drawerOk"
      @cancel="drawerCancel"
    >
      <template #title> {{ drawerTitle }} </template>
      <TableListCard>
        <template #headerInput>
          <a-space>
            <a-input
              v-model.trim="tempSearchForm.name"
              allow-clear
              :placeholder="
                drawerType === 'odDiseasesType'
                  ? '职业病名称'
                  : '接触危害因素名称'
              "
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
            :data="filterDrawerData"
            row-key="id"
            :bordered="false"
            :pagination="false"
            :row-selection="{
              type: 'checkbox',
              title: '选择',
              width: 60,
              onlyCurrent: false,
            }"
          >
            <template #columns>
              <div v-if="drawerType === 'odDiseasesType'">
                <a-table-column
                  title="职业病名称"
                  :width="140"
                  data-index="name"
                >
                </a-table-column>
                <a-table-column title="备注" data-index="intro">
                </a-table-column>
              </div>
              <div v-else>
                <a-table-column
                  title="危害因素名称"
                  data-index="name"
                  :width="100"
                >
                </a-table-column>
                <a-table-column
                  title="危害类型"
                  data-index="harmfulTypeName"
                  :width="150"
                >
                </a-table-column>
                <a-table-column title="接触限值" data-index="boundaryValue">
                </a-table-column>
                <a-table-column title="备注(CAS号)" data-index="remark">
                </a-table-column>
              </div>
            </template>
          </a-table>
        </template>
      </TableListCard>
    </a-drawer>
  </div>
</template>

<script lang="ts">
  import { ref, computed, onMounted } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useUserStore } from '@/store';
  import { Message } from '@arco-design/web-vue';
  import {
    addWorkTypeAPI,
    detailWorkTypeAPI,
    updateWorkTypeAPI,
    getDiseasesTypeListAPI,
    getHarmfulListAPI,
  } from '@/api/enterpriseManage';
  import type {
    WorkTypeBody,
    GetWorkTypeDrawerList,
  } from '@/api/enterpriseManage';
  import { cloneDeep } from 'lodash';
  import { handleOnKeyup } from '@/utils/event';

  export default {
    name: 'WorkTypeEdit',
  };
</script>

<script lang="ts" setup>
  const router = useRouter();
  const route = useRoute();

  const title = computed(() => {
    if (route.query.type === 'add') {
      return '新增';
    }
    getDetail();
    return '编辑';
  });

  const goBack = () => {
    form.value.resetFields();
    router.back();
  };

  const userStore = useUserStore();

  // ------------------------ 表单 -------------------------------

  const formData = ref<WorkTypeBody>({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    name: '',
    harmfulFactorList: [],
    odDiseasesTypeList: [],
  });
  const form = ref();

  const rules = ref({
    name: [
      { required: true, message: '请输入工种名称' },
      { maxLength: 30, message: '不能超过30字符' },
    ],
  });

  const getDetail = async () => {
    const { data: res } = await detailWorkTypeAPI({
      id: route.query.id as string,
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });

    formData.value = res;
    formData.value.harmfulFactorList = res.harmfulFactorList
      ? res.harmfulFactorList
      : [];
    formData.value.odDiseasesTypeList = res.odDiseasesTypeList
      ? res.odDiseasesTypeList
      : [];
  };

  const submit = async () => {
    const value = await form.value.validate();
    if (value) return;
    route.query.type === 'add' ? await addSubmit() : await editSubmit();
    goBack();
  };

  const addSubmit = async () => {
    await addWorkTypeAPI(formData.value);
    Message.success({
      content: '新增成功',
    });
  };

  const editSubmit = async () => {
    await updateWorkTypeAPI(formData.value);
    Message.success({
      content: '编辑成功',
    });
  };

  const deleteTableItem = (type: string, id: string) => {
    if (type === 'odDiseasesType') {
      let arr = formData.value.odDiseasesType?.split(',');
      arr = arr?.filter((item) => item !== id.toString());
      formData.value.odDiseasesType = arr?.join(',');

      formData.value.odDiseasesTypeList =
        formData.value.odDiseasesTypeList?.filter((val) => val.id !== id);
    } else {
      let arr = formData.value.harmfulFactor?.split(',');
      arr = arr?.filter((item) => item !== id.toString());
      formData.value.harmfulFactor = arr?.join(',');

      formData.value.harmfulFactorList =
        formData.value.harmfulFactorList?.filter((val) => val.id !== id);
    }
  };
  // ----------------------- 抽屉 -------------------------------

  const visible = ref(false);
  const selectForm = ref<GetWorkTypeDrawerList>({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    name: '',
  });
  const tempSearchForm = ref<GetWorkTypeDrawerList>({
    enterpriseId: userStore.userInfo.enterpriseId as string,
    name: '',
  });
  const drawerType = ref('');

  const drawerTitle = computed(() =>
    drawerType.value === 'odDiseasesType' ? '选择相关职业病' : '选择危害因素'
  );

  const drawerData = ref<any>([]);
  const filterDrawerData = ref<any>([]);
  const selectedKeys = ref<(string | number)[]>([]);

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      drawerDataChange();
    });
  });

  const openDrawer = (type: string) => {
    tempSearchForm.value.name = '';
    selectForm.value.name = '';
    drawerType.value = type;
    getDrawerData();
    visible.value = true;
  };

  const getDrawerData = async () => {
    if (drawerType.value === 'odDiseasesType') {
      // 职业病
      const { data: res } = await getDiseasesTypeListAPI(selectForm.value);
      drawerData.value = res;
      selectedKeys.value = formData.value.odDiseasesTypeList.map(
        (ele: any) => ele.id
      );
    } else {
      // 危害因素
      const { data: res } = await getHarmfulListAPI(selectForm.value);
      drawerData.value = res;
      selectedKeys.value = formData.value.harmfulFactorList.map(
        (ele: any) => ele.id
      );
    }
    filterDrawerData.value = cloneDeep(drawerData.value);
  };

  const drawerDataChange = () => {
    filterDrawerData.value = drawerData.value.filter((item: any) =>
      item.harmfulTypeName.includes(selectForm.value.name)
    );
  };

  const drawerOk = () => {
    drawerType.value === 'odDiseasesType'
      ? odDiseasesTypeOk()
      : harmfulFactorOk();

    drawerCancel();
  };

  const odDiseasesTypeOk = () => {
    // const ids = formData.value.odDiseasesType
    //   ? formData.value.odDiseasesType?.split(',')
    //   : [];
    // 改动，打开弹窗选择的勾选和表格里的内容要对应，删除勾选即为删除数据
    const selected = selectedKeys.value.map((item) => item + '');
    const selectedTableData: any[] = [];
    // const setIds = [...new Set([...ids, ...selected])];

    selected.forEach((item) => {
      // if (!ids.includes(item)) {
      const obj = drawerData.value.find((val: any) => val.id === +item);
      obj ? selectedTableData.push(obj) : '';
      // }
    });

    formData.value.odDiseasesTypeList = selectedTableData;
    formData.value.odDiseasesType = selected.join(',');
  };

  const harmfulFactorOk = () => {
    // const ids = formData.value.harmfulFactor
    //   ? formData.value.harmfulFactor?.split(',')
    //   : [];
    const selected = selectedKeys.value.map((item) => item + '');
    const selectedTableData: any[] = [];
    // const setIds = [...new Set([...ids, ...selected])];

    selected.forEach((item) => {
      // if (!ids.includes(item)) {
      const obj = drawerData.value.find((val: any) => val.id === +item);
      obj ? selectedTableData.push(obj) : '';
      // }
    });
    formData.value.harmfulFactorList = selectedTableData;
    formData.value.harmfulFactor = selected.join(',');
  };

  const drawerCancel = () => {
    // selectedKeys.value = [];
    visible.value = false;
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
            flex: 0 0 84px;
            width: 84px;
          }
          :deep(.arco-form-item-wrapper-col.arco-col-19) {
            flex: 1;
          }
        }
        .icon {
          margin-right: 6px;
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
    margin-top: 12px;
    width: 100%;
    text-align: center;
  }

  .arco-drawer {
    .arco-drawer-body {
      .header {
        .input {
          .arco-select-view-single {
            width: auto;
          }
        }
      }
    }
  }
</style>
<style lang="less">
  .workTypeDrawer {
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
