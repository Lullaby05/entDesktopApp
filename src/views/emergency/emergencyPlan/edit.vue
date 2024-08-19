<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">{{ title }}</span>
      </div>
      <div class="form">
        <a-form ref="form" :model="formData" :rules="rules">
          <a-form-item field="emergencyPlanName" label="应急预案名称" required>
            <a-input
              v-model.trim="formData.emergencyPlanName"
              :disabled="disabled"
              allow-clear
              placeholder="请输入应急预案名称"
            ></a-input>
          </a-form-item>
          <a-form-item field="emergencyType" label="应急预案类型" required>
            <a-select
              v-model:model-value="formData.emergencyType"
              placeholder="请选择应急预案类型"
              allow-clear
              allow-search
            >
              <a-option v-for="(value, key) of planBType" :value="key">{{
                value
              }}</a-option>
            </a-select>
          </a-form-item>
          <a-form-item field="recorded" label="是否已备案" required>
            <a-select
              v-model:model-value="formData.recorded"
              allow-clear
              placeholder="请选择是否已备案"
            >
              <a-option :value="1" label="是">是</a-option>
              <a-option :value="0" label="否">否</a-option>
            </a-select>
          </a-form-item>

          <a-form-item
            v-if="formData.recorded"
            field="recordedDept"
            label="备案部门"
            required
          >
            <a-input
              v-model.trim="formData.recordedDept"
              :disabled="disabled"
              allow-clear
              placeholder="请输入备案部门"
            ></a-input>
          </a-form-item>

          <a-form-item
            v-if="formData.recorded"
            field="recordedNumber"
            label="备案登记号"
            required
          >
            <a-input
              v-model.trim="formData.recordedNumber"
              :disabled="disabled"
              allow-clear
              placeholder="请输入备案登记号"
            ></a-input>
          </a-form-item>

          <a-form-item field="eventTypeId" label="事故类型" required>
            <a-select
              v-model:model-value="formData.eventTypeId"
              multiple
              allow-clear
              allow-search
              placeholder="请选择事故类型"
              :disabled="disabled"
              :options="accidentTypeData.list"
              :fallback-option="false"
              :field-names="{
                label: 'accTypeName',
                value: 'accTypeCode',
              }"
            ></a-select>
          </a-form-item>
          <a-form-item field="agreement" label="附件">
            <a-space>
              <a-upload
                v-model:file-list="formData.agreementList"
                action=""
                :custom-request="customRequest"
                multiple
                accept=".doc,.docx,.pdf"
                :limit="5"
                @before-upload="(e) => beforeUpload(e, '.doc,.docx,.pdf')"
                @success="uploadPicSuccess"
                @before-remove="beforeRemove"
              >
              </a-upload>
            </a-space>
          </a-form-item>
          <a-form-item field="commander" label="指挥长" required>
            <a-row :gutter="8">
              <a-col :span="7">
                <a-form-item field="" no-style :wrapper-col-props="{ span: 4 }">
                  <a-select
                    ref="selectDom"
                    v-model:model-value="formData.commander"
                    allow-clear
                    allow-search
                    :options="staffData"
                    :fallback-option="false"
                    placeholder="请选择指挥长"
                    :field-names="{
                      value: 'id',
                      label: 'userName',
                    }"
                    @change="leaderChange($event, 'commanderTel', 0)"
                  >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item field="" no-style>
                  <a-input
                    v-model="formData.commanderTel"
                    disabled
                    placeholder="手机号码"
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="10"> </a-col>
            </a-row>
          </a-form-item>
          <!-- <a-form-item field="commanderTel" label="指挥长手机号码" required>

          </a-form-item> -->

          <a-form-item
            v-for="(item, index) in telData.associateConductorList"
            :key="index"
            :field="index ? '' : 'associateConductor'"
            :label="index ? '' : '副指挥长'"
            :required="index ? false : true"
          >
            <a-row :gutter="8">
              <a-col :span="7">
                <a-form-item field="" no-style :wrapper-col-props="{ span: 4 }">
                  <a-select
                    ref="selectDom"
                    v-model:model-value="item.id"
                    allow-clear
                    allow-search
                    :fallback-option="false"
                    placeholder="请选择副指挥长"
                    @change="
                      leaderChange($event, 'associateConductorList', index)
                    "
                  >
                    <a-option
                      v-for="staffItem in staffData"
                      :key="staffItem.id"
                      :value="staffItem.id"
                      v-show="
                        telData.associateConductorList.findIndex((ele:any) => ele.id === staffItem.id) ===
                        -1
                      "
                      :label="staffItem.userName"
                    ></a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item field="" no-style>
                  <a-input
                    v-model="item.tel"
                    placeholder="手机号码"
                    disabled
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="10">
                <a-button
                  v-if="index === 0"
                  type="primary"
                  @click="addItem('associateConductorList')"
                  >新增</a-button
                >
                <a-button
                  v-else
                  type="primary"
                  status="danger"
                  @click="deleteItem(index, 'associateConductorList')"
                  >移除</a-button
                >
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item
            v-for="(item, index) in telData.otherMembersList"
            :key="index"
            :field="index ? '' : 'otherMembers'"
            :label="index ? '' : '其他成员'"
            :required="index ? false : true"
          >
            <a-row :gutter="8">
              <a-col :span="7">
                <a-form-item field="" no-style :wrapper-col-props="{ span: 4 }">
                  <a-select
                    ref="selectDom"
                    v-model:model-value="item.id"
                    allow-clear
                    allow-search
                    :fallback-option="false"
                    placeholder="请选择其他成员"
                    @change="leaderChange($event, 'otherMembersList', index)"
                  >
                    <a-option
                      v-for="staffItem in staffData"
                      :key="staffItem.id"
                      :value="staffItem.id"
                      v-show="
                        telData.otherMembersList.findIndex((ele:any) => ele.id === staffItem.id) ===
                        -1
                      "
                      :label="staffItem.userName"
                    ></a-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item field="" no-style>
                  <a-input
                    v-model="item.tel"
                    placeholder="手机号码"
                    disabled
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="10">
                <a-button
                  v-if="index === 0"
                  type="primary"
                  @click="addItem('otherMembersList')"
                  >新增</a-button
                >
                <a-button
                  v-else
                  type="primary"
                  status="danger"
                  @click="deleteItem(index, 'otherMembersList')"
                  >移除</a-button
                >
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item
            v-for="(item, index) in telData.participateUnitsList"
            :key="index"
            :field="index ? '' : 'participateUnits'"
            :label="index ? '' : '参与单位'"
          >
            <a-row :gutter="8">
              <a-col :span="7">
                <a-form-item field="" no-style :wrapper-col-props="{ span: 4 }">
                  <a-tree-select
                    :fallback-option="false"
                    v-model:model-value="item.id"
                    placeholder="请选择参与单位"
                    allow-search
                    allow-clear
                    :disable-filter="true"
                    :field-names="{
                      key: 'id',
                      title: 'name',
                    }"
                    :data="deptData"
                    @search="onDeptSearch"
                    @blur="clearSearchKey"
                    @clear="clearSearchKey"
                    @change="
                      leaderChange($event, 'participateUnitsList', index)
                    "
                  ></a-tree-select>
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item field="" no-style>
                  <a-input
                    v-model="item.leaderName"
                    placeholder="单位负责人"
                    disabled
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="7">
                <a-form-item field="" no-style>
                  <a-input
                    v-model="item.leaderTel"
                    placeholder="手机号码"
                    disabled
                  ></a-input>
                </a-form-item>
              </a-col>
              <a-col :span="3">
                <a-button
                  v-if="index === 0"
                  type="primary"
                  @click="addItem('participateUnitsList')"
                  >新增</a-button
                >
                <a-button
                  v-else
                  type="primary"
                  status="danger"
                  @click="deleteItem(index, 'participateUnitsList')"
                  >移除</a-button
                >
              </a-col>
            </a-row>
          </a-form-item>
          <a-form-item field="measures" label="处置措施">
            <a-textarea
              v-model.trim="formData.measures"
              :max-length="300"
              :auto-size="{
                minRows: 6,
                maxRows: 6,
              }"
              show-word-limit
              placeholder="请输入处置措施"
              :disabled="disabled"
            ></a-textarea>
          </a-form-item>
        </a-form>
      </div>
      <a-tabs
        type="card"
        size="large"
        default-active-key="1"
        lazy-load
        @change="tabsChange"
      >
        <a-tab-pane key="1" title="应急物资">
          <a-form
            ref="selectFormDom"
            :model="selectForm"
            layout="inline"
            @keydown.enter="getTableData('1')"
          >
            <a-form-item field="suppliesCode" label="物资类型">
              <a-tree-select
                style="width: 256px"
                v-model:model-value="selectForm.suppliesCode"
                :data="metarialSeachData"
                allow-search
                allow-clear
                :disable-filter="true"
                :field-names="{
                  title: 'name',
                }"
                placeholder="请选择物资类型"
                @search="onMetarialTypeSearch"
                @blur="clearMetarialSearchKey"
                @clear="clearMetarialSearchKey"
              ></a-tree-select>
            </a-form-item>
            <a-form-item field="emergencySuppliesName" label="物资名称">
              <a-input
                v-model.trim="selectForm.emergencySuppliesName"
                allow-clear
                placeholder="请输入物资名称"
              ></a-input>
            </a-form-item>
            <a-button type="primary" @click="getTableData('1')">查询</a-button>
          </a-form>
          <AddTable
            :data="tableData.metarial"
            :columns="materialsColumns"
            :selected-keys="formData.suppliesIds"
            @selectedKeys="selectedChange($event, '1')"
          ></AddTable>
        </a-tab-pane>
        <a-tab-pane key="2" title="应急队伍">
          <a-form
            ref="selectFormDom"
            :model="selectForm"
            layout="inline"
            @keydown.enter="getTableData('2')"
          >
            <a-form-item
              field="teamType"
              label="队伍类型"
              @keydown.enter="getTableData('2')"
            >
              <a-select
                style="width: 256px"
                v-model:model-value="selectForm.teamType"
                allow-clear
                allow-search
                placeholder="请选择队伍类型"
              >
                <a-option v-for="(value, key) of troopsTypeData" :value="key">{{
                  value
                }}</a-option>
              </a-select>
            </a-form-item>
            <a-form-item field="teamName" label="队伍名称">
              <a-input
                v-model.trim="selectForm.teamName"
                placeholder="请输入队伍名称"
                allow-clear
              ></a-input>
            </a-form-item>
            <a-button type="primary" @click="getTableData('2')">查询</a-button>
          </a-form>
          <AddTable
            :data="tableData.troops"
            :columns="troopsColumns"
            :selected-keys="formData.teamIds"
            @selectedKeys="selectedChange($event, '2')"
          ></AddTable>
        </a-tab-pane>
        <a-tab-pane key="3" title="应急专家">
          <a-form
            ref="selectFormDom"
            :model="selectForm"
            layout="inline"
            @keydown.enter="getTableData('3')"
          >
            <a-form-item field="name" label="专家姓名">
              <a-input
                v-model.trim="selectForm.name"
                placeholder="请输入专家姓名"
                allow-clear
              ></a-input>
            </a-form-item>
            <a-button type="primary" @click="getTableData('3')">查询</a-button>
          </a-form>
          <AddTable
            :data="tableData.export"
            :columns="expertColumns"
            :selected-keys="formData.expertIds"
            @selectedKeys="selectedChange($event, '3')"
          ></AddTable>
        </a-tab-pane>
      </a-tabs>
      <div class="btn">
        <div v-if="!disabled">
          <a-space>
            <a-button @click="goBack">取消</a-button>
            <a-button type="primary" @click="submit">保存</a-button>
          </a-space>
        </div>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
  import { ref, computed, h } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useUserStore } from '@/store';
  import { cloneDeep } from 'lodash';
  import AddTable from '@/views/emergency/emergencyPlan/components/addTable.vue';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { Modal, Message } from '@arco-design/web-vue';
  import {
    getEnumListAPI,
    getSystemDicAPI,
    getMapDictionaryAPI,
  } from '@/api/index';
  import { getAccidentTypeListAPI } from '@/api/risk';
  import {
    getExportListPageAPI,
    getMaterialListPageAPI,
    getTroopsListPageAPI,
    detailPlanBItemAPI,
    addPlanBItemAPI,
    updatePlanBItemAPI,
  } from '@/api/emergency';
  import type { AddPlanBItemData } from '@/api/emergency';
  import {
    getStaffDataAllAPI,
    getOrganizationTreeAPI,
  } from '@/api/enterpriseManage';
  import type { AccidentTypeData } from '@/views/risk/accidentType/index';
  import type { StaffItem } from '@/views/enterpriseManage/staffManage/index';
  import type { OrganizationTreeData } from '@/store/modules/enterprise/types';
  import type { TableColumnData, FileItem } from '@arco-design/web-vue';
  import { useCustomUpload } from '@/hooks/customUpload';
  export default {
    name: 'EmergencyPlanAdd',
  };
</script>

<script lang="ts" setup>
  // 上传
  const { customRequest, beforeUpload } = useCustomUpload();

  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const title = computed(() => {
    if (route.query.type === 'add') return '新增应急预案';
    if (route.query.type === 'edit') {
      getDetail();
      return '编辑应急预案';
    }
    return '查看应急预案';
  });
  const disabled = computed(() => route.query.type === 'view');
  const goBack = () => {
    router.back();
  };

  // ------------------ 前置数据 -----------------
  const planBType = ref<any>();

  const getPlanBType = async () => {
    const { data } = await getEnumListAPI('EMANAGEMENT_TYPE');
    planBType.value = data;
  };

  getPlanBType();

  const accidentTypeData = ref<AccidentTypeData>({ list: [], total: 10 });

  const getAccidentTypeData = async () => {
    const { data } = await getAccidentTypeListAPI({
      pageNo: 1,
      pageSize: 1000,
    });
    accidentTypeData.value = data;
  };

  getAccidentTypeData();

  const staffData = ref<StaffItem[]>([]);

  const getStaffData = async () => {
    const { data: res } = await getStaffDataAllAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });

    staffData.value = res;
    if (staffCallBack) {
      staffCallBack();
      staffCallBack = null;
    }
  };

  getStaffData();

  const deptData = ref<OrganizationTreeData[]>([]);
  let depatTree: OrganizationTreeData[] = [];
  let flatDeptData: any[] = []; // 扁平化部门树形数据

  const getDeptData = async () => {
    const { data } = await getOrganizationTreeAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    deptData.value = data;
    depatTree = cloneDeep(deptData.value);
    flatDeptData = flatten(depatTree);
    if (deptCallBack) {
      deptCallBack();
      deptCallBack = null;
    }
  };

  getDeptData();

  // 扁平化对象数组
  const flatten = (arr: any) => {
    return arr.reduce((result: any, item: any) => {
      return result.concat(
        item,
        Array.isArray(item.children) ? flatten(item.children) : []
      );
    }, []);
  };

  // 部门下拉搜索
  function searchData(keyword: string, data: any[]) {
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

    return loop(data);
  }

  const onDeptSearch = (searchKey: string) => {
    setTimeout(() => {
      deptData.value = searchData(searchKey, depatTree);
    }, 200);
  };

  const clearSearchKey = () => {
    onDeptSearch('');
  };

  const metarialTypeData = ref<any>([]);

  const getMetarialTypeData = async () => {
    const { data } = await getSystemDicAPI('EMERGENCY_SUPPLIES');
    metarialTypeData.value = data;
    metarialSeachData.value = cloneDeep(data);
  };

  getMetarialTypeData();

  const educationDict = ref<any>([]);

  const getEducationTypeData = async () => {
    const { data } = await getMapDictionaryAPI('EDUCATION');
    educationDict.value = data;
  };

  getEducationTypeData();

  // 物资类型下拉搜索
  const metarialSeachData = ref<any>([]);

  const onMetarialTypeSearch = (searchKey: string) => {
    setTimeout(() => {
      metarialSeachData.value = searchData(searchKey, metarialTypeData.value);
    }, 200);
  };

  const clearMetarialSearchKey = () => {
    onMetarialTypeSearch('');
  };

  const troopsTypeData = ref<any>();

  const getTroopsTypeData = async () => {
    const { data } = await getEnumListAPI('EMERGENCY_TEAM_TYPE');
    troopsTypeData.value = data;
  };

  getTroopsTypeData();

  let deptCallBack: any = null;
  let staffCallBack: any = null;

  // ------------------- 表单 ---------------------

  const formData = ref<AddPlanBItemData>({
    tenantId: userStore.tenantId as string,
    emergencyPlanName: '',
    emergencyType: '',
    eventTypeId: [],
    agreementList: [],
    commander: '',
    commanderTel: '',
    associateConductor: '',
    otherMembers: '',
    participateUnits: '',
    suppliesIds: [],
    teamIds: [],
    expertIds: [],
  });
  const form = ref();

  const rules = ref({
    emergencyPlanName: [
      { required: true, message: '请输入应急预案名称' },
      { maxLength: 25, message: '不能超过25字符' },
    ],
    emergencyType: [{ required: true, message: '请选择应急预案类型' }],
    recorded: [{ required: true, message: '请选择是否已备案' }],
    recordedDept: [
      { required: true, message: '请输入备案部门' },
      { maxLength: 25, message: '不能超过25字符' },
    ], // 备案部门
    recordedNumber: [
      { required: true, message: '请输入备案登记号' },
      { maxLength: 20, message: '不能超过20字符' },
    ], // 备案登记号
    eventTypeId: [{ required: true, message: '请选择事故类型' }],
    commander: [{ required: true, message: '请选择指挥长' }],
    // commanderTel: [{ required: true, message: '请先选择指挥长' }],
    associateConductor: [{ required: true, message: '请选择副指挥长' }],
    otherMembers: [{ required: true, message: '请选择其他成员' }],
  });

  const getDetail = async () => {
    const { data: res } = await detailPlanBItemAPI({
      tenantId: userStore.tenantId as string,
      id: route.query.id as string,
    });
    // 转换数据
    res.agreementList = res.agreementList ? res.agreementList : [];

    res.associateConductor = res.associateConductor
      ? res.associateConductor.split(',')
      : [];
    telData.value.associateConductorList = res.associateConductor.map(
      (item: any) => {
        return { id: item, tel: '' };
      }
    );

    res.otherMembers = res.otherMembers ? res.otherMembers.split(',') : [];
    telData.value.otherMembersList = res.otherMembers.map((item: any) => {
      return { id: item, tel: '' };
    });

    res.participateUnits = res.participateUnits
      ? res.participateUnits.split(',')
      : [{}];
    telData.value.participateUnitsList = (
      res.participateUnitsList.length ? res.participateUnitsList : [{}]
    ).map((item: any) => {
      return {
        id: item.id || '',
        leaderName: item.leaderName || '',
        leaderTel: item.leaderTel || '',
      };
    });

    // 判断员工和部门数据是否成功获取
    const Fn = () => {
      telData.value.associateConductorList.forEach((item, index) => {
        leaderChange(item.id, 'associateConductorList', index);
      });
      telData.value.otherMembersList.forEach((item, index) => {
        leaderChange(item.id, 'otherMembersList', index);
      });
    };
    if (staffData.value.length) {
      Fn();
    } else {
      staffCallBack = () => {
        Fn();
      };
    }

    if (deptData.value.length) {
      telData.value.participateUnitsList.forEach((item, index) => {
        leaderChange(item.id, 'participateUnitsList', index);
      });
    } else {
      deptCallBack = () => {
        telData.value.participateUnitsList.forEach((item, index) => {
          leaderChange(item.id, 'participateUnitsList', index);
        });
      };
    }

    res.expertIds = res.expertIds ? res.expertIds.split(',') : [];
    res.suppliesIds = res.suppliesIds ? res.suppliesIds.split(',') : [];
    res.teamIds = res.teamIds ? res.teamIds.split(',') : [];
    res.eventTypeId = res.eventTypeId ? res.eventTypeId.split(',') : [];
    res.recorded = res.recorded ? 1 : 0;

    formData.value = cloneDeep(res);

    formData.value.agreementList = res.agreementList.map((item: any) => {
      const fileName = item.fileName.split('//')[0];
      return { name: fileName, url: item.fileUrl };
    });
  };

  const submit = async () => {
    // formData.value.eventTypeId = formData.value.eventTypeId.join(',');
    // formData.value.suppliesIds = formData.value.suppliesIds.join(',');
    // formData.value.teamIds = formData.value.teamIds.join(',');
    // formData.value.expertIds = formData.value.expertIds.join(',');
    formData.value.associateConductor = telData.value.associateConductorList
      .filter((item) => item.id)
      .map((item) => item.id)
      .join(',');

    formData.value.otherMembers = telData.value.otherMembersList
      .filter((item) => item.id)
      .map((item) => item.id)
      .join(',');

    formData.value.participateUnits = telData.value.participateUnitsList
      .filter((item) => {
        if (JSON.stringify(item.id) === '{}') return false;
        else return item.id;
      })
      .map((item) => item.id)
      .join(',');

    const tableMetarial = tableData.value.metarial.list.map(
      (ele: any) => ele.id
    );
    const tableExport = tableData.value.export.list.map((ele: any) => ele.id);
    const tableTroops = tableData.value.troops.list.map((ele: any) => ele.id);

    const params = {
      ...formData.value,
      eventTypeId: formData.value.eventTypeId.join(','),
      suppliesIds: intersect(formData.value.suppliesIds, tableMetarial).join(
        ','
      ),
      teamIds: intersect(formData.value.teamIds, tableTroops).join(','),
      expertIds: intersect(formData.value.expertIds, tableExport).join(','),
    };

    const value = await form.value.validate();
    if (value) return;

    route.query.type === 'add'
      ? await addSubmit(params)
      : await editSubmit(params);
    goBack();
  };

  // 取两个数组的交集
  const intersect = (arr1: number[], arr2: number[]) => {
    return arr1.filter(function (v: number) {
      return arr2.indexOf(v) > -1;
    });
  };

  const addSubmit = async (params: AddPlanBItemData) => {
    await addPlanBItemAPI(params);
    Message.success('新增成功');
  };

  const editSubmit = async (params: AddPlanBItemData) => {
    await updatePlanBItemAPI(params);
    Message.success('编辑成功');
  };

  const uploadPicSuccess = (e: FileItem) => {
    const {
      response: { data, code, msg },
    } = e;

    if (code < 200) {
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

  const beforeRemove = (file: FileItem): Promise<boolean> => {
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
          let arr = formData.value.agreement?.split(',');
          arr = arr?.filter((item: any) => item.split('//')[0] !== file.name);
          formData.value.agreement = arr?.join(',');
          return resolve(true);
        },
        onCancel: () => reject('cancel'),
      });
    });
  };

  const uploadPreview = (fileItem: FileItem) => {
    window.open(fileItem.response.data[0].filePath);
  };

  const telData = ref<{
    associateConductorList: any[];
    participateUnitsList: any[];
    otherMembersList: any[];
  }>({
    associateConductorList: [{ id: '', tel: '' }],
    otherMembersList: [{ id: '', tel: '' }],
    participateUnitsList: [{ id: '', leaderName: '', leaderTel: '' }],
  }); // 用于显示不同对象的手机号码，但不提交至数据库

  const leaderChange = (e: any, text: string, index: number) => {
    if (!staffData.value.length) return;
    const obj = staffData.value.find((item) => item.id === e);
    switch (text) {
      case 'commanderTel':
        formData.value.commanderTel = obj?.tel as string;
        form.value.validateField('commander');
        form.value.validateField('commanderTel');
        break;
      case 'associateConductorList':
        telData.value.associateConductorList[index].tel = obj?.tel;
        form.value.clearValidate('associateConductor');
        break;
      case 'participateUnitsList':
        const treeItem = flatDeptData.find((item) => item.id === e);
        const leaderId = treeItem?.leaderId;
        const leaderObj = staffData.value.find((item) => item.id === leaderId);
        telData.value.participateUnitsList[index].leaderName =
          leaderObj?.userName;
        telData.value.participateUnitsList[index].leaderTel = leaderObj?.tel;
        break;
      case 'otherMembersList':
        telData.value.otherMembersList[index].tel = obj?.tel;
        form.value.clearValidate('otherMembers');
        break;
      default:
        break;
    }
  };

  const addItem = (text: string) => {
    switch (text) {
      case 'associateConductorList':
        telData.value.associateConductorList.push({ id: '', tel: '' });
        break;
      case 'participateUnitsList':
        telData.value.participateUnitsList.push({
          id: '',
          leaderName: '',
          leaderTel: '',
        });
        break;
      case 'otherMembersList':
        telData.value.otherMembersList.push({ id: '', tel: '' });
        break;
      default:
        break;
    }
  };

  const deleteItem = (index: number, text: string) => {
    switch (text) {
      case 'associateConductorList':
        telData.value.associateConductorList.splice(index, 1);
        break;
      case 'participateUnitsList':
        telData.value.participateUnitsList.splice(index, 1);
        break;
      case 'otherMembersList':
        telData.value.otherMembersList.splice(index, 1);
        break;
      default:
        break;
    }
  };
  // ------------------ table ------------

  const selectForm = ref<any>({});
  const selectFormDom = ref();

  const tabsChange = () => {
    selectFormDom.value.resetFields();
  };

  const getTableData = async (key: string) => {
    switch (key) {
      case '1':
        getMaterialsData();
        break;
      case '2':
        getTroopsData();
        break;
      case '3':
        getExportData();
        break;
      default:
        break;
    }
  };

  const selectedChange = (e: any, key: string) => {
    switch (key) {
      case '1':
        formData.value.suppliesIds = e;
        break;
      case '2':
        formData.value.teamIds = e;
        break;
      case '3':
        formData.value.expertIds = e;
        break;
      default:
        break;
    }
  };
  // 应急物资
  const materialsColumns: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
    },
    {
      title: '物资类型',
      dataIndex: 'suppliesCodeName',
    },
    {
      title: '物资名称',
      dataIndex: 'emergencySuppliesName',
    },
    {
      title: '数量',
      dataIndex: 'number',
    },
    {
      title: '存放地点',
      dataIndex: 'place',
    },
    {
      title: '备注',
      dataIndex: 'remarks',
    },
  ];
  // 应急队伍
  const troopsColumns: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
    },
    {
      title: '队伍类型',
      dataIndex: 'teamTypeName',
    },
    {
      title: '队伍名称',
      dataIndex: 'teamName',
    },
    {
      title: '负责人姓名',
      dataIndex: 'teamLeaderName',
    },
    {
      title: '负责人手机号码',
      dataIndex: 'teamLeaderTel',
    },
    {
      title: '分管负责人姓名',
      dataIndex: 'divisionLeaderName',
    },
    {
      title: '分管负责人手机号码',
      dataIndex: 'divisionLeaderTel',
    },
  ];
  // 应急专家
  const expertColumns: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
    },
    {
      title: '专家姓名',
      dataIndex: 'name',
    },
    {
      title: '手机号码',
      dataIndex: 'telphone',
    },
    {
      title: '专业领域',
      dataIndex: 'expertise',
    },
    {
      title: '学历',
      dataIndex: 'education',
    },
    {
      title: '专业',
      dataIndex: 'major',
    },
    {
      title: '备注',
      dataIndex: 'remark',
    },
  ];

  const tableData = ref({
    metarial: { list: [], total: 0 },
    troops: { list: [], total: 0 },
    export: { list: [], total: 0 },
  });

  const getExportData = async () => {
    const params = { ...selectForm.value, pageSize: 100, pageNo: 1 };
    const { data: res } = await getExportListPageAPI(params);
    tableData.value.export = res;
    tableData.value.export.list = res.list.map((item: any) => {
      return {
        ...item,
        education: educationDict.value[item.education],
      };
    });
  };

  getExportData();

  const getMaterialsData = async () => {
    const params = { ...selectForm.value, pageSize: 100, pageNo: 1 };
    const { data: res } = await getMaterialListPageAPI(params);
    tableData.value.metarial = res;
  };

  getMaterialsData();

  const getTroopsData = async () => {
    const params = { ...selectForm.value, pageSize: 100, pageNo: 1 };
    const { data: res } = await getTroopsListPageAPI(params);
    tableData.value.troops = res;
  };

  getTroopsData();
</script>

<style lang="less" scoped>
  .arco-card.content-card {
    // min-height: 96%;
    .header {
      font-size: 18px;
      // font-weight: 700;
      margin-bottom: 20px;
      .title {
        margin-left: 8px;
      }
    }
    .form {
      width: 80%;
      min-height: calc(100vh - 265px);
      margin-bottom: 20px;
      .upload-tip {
        color: #f59b22;
      }
      .arco-row {
        width: 100%;
      }
    }

    .table {
      width: 100%;
    }
    .arco-tabs {
      .arco-form {
        padding: 0 20px;
      }
    }
  }

  .btn {
    margin-top: 12px;
    width: 100%;
    text-align: center;
  }

  .upload-tip {
    color: #f59b22;
  }
</style>
