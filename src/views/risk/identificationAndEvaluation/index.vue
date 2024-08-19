<template>
  <div class="container">
    <div class="title">
      操作指引：新增风险单元（或选中风险单元）--&gt; 新增风险点 --&gt;
      风险辨识与评价
    </div>
    <div class="content">
      <div
        class="collapse-icon"
        :class="{ collapse: collapsed }"
        @click="onCollapse"
      >
        <icon-right />
      </div>
      <div class="left" :class="{ boxCollapse: collapsed }">
        <a-space
          style="width: 100%; margin-bottom: 10px"
          lass="header"
          direction="vertical"
        >
          <a-button
            v-permission="'dangerUnitAdd'"
            type="primary"
            @click="openUnitModal('add')"
          >
            <icon-plus class="icon" style="margin-right: 10px" />
            新增风险单元
          </a-button>
          <a-input
            allow-clear
            v-model="searchKey"
            placeholder="请输入风险单元名称"
          />
          <a-space direction="horizontal">
            <a-button size="mini" type="primary" @click="expandAll">
              展开/收起
            </a-button>
            <a-button
              size="mini"
              type="primary"
              :disabled="!selectForm.riskUnitId"
              @click="cancelSelectTreeNode"
            >
              取消选中
            </a-button>
          </a-space>
        </a-space>

        <!-- 风险单元树 -->
        <a-tree
          ref="unitTreeRef"
          v-model:selected-keys="selectedUnit"
          :data="treeData"
          default-expand-all
          :field-names="{ key: 'id', title: 'name' }"
          @select="selectTreeNode"
        >
          <template #title="nodeData">
            <template v-if="getMatchIndex(nodeData?.name) < 0">{{
              nodeData?.name
            }}</template>
            <span v-else>
              {{ nodeData?.name?.substr(0, getMatchIndex(nodeData?.name)) }}
              <span style="color: var(--color-primary-light-4)">
                {{
                  nodeData?.name?.substr(
                    getMatchIndex(nodeData?.name),
                    searchKey.length
                  )
                }} </span
              >{{
                nodeData?.name?.substr(
                  getMatchIndex(nodeData?.name) + searchKey.length
                )
              }}
            </span>
          </template>
          <template #extra="nodeData">
            <a-tooltip content="添加下级风险单元">
              <icon-plus
                v-permission="'dangerUnitAdd'"
                class="tree-icon add"
                @click="openUnitModal('add', nodeData)"
              />
            </a-tooltip>
            <a-tooltip content="编辑当前风险单元">
              <icon-edit
                v-permission="'dangerUnitEdit'"
                class="tree-icon edit"
                @click="openUnitModal('edit', nodeData)"
              />
            </a-tooltip>
            <a-tooltip content="删除当前风险单元">
              <icon-delete
                v-permission="'dangerUnitDelete'"
                class="tree-icon delete"
                @click="deteleUnit(nodeData.name, nodeData)"
              />
            </a-tooltip>
          </template>
        </a-tree>
      </div>
      <div class="right">
        <TableListCard>
          <template #headerInput>
            <a-form ref="selectFormDom" :model="tempSearchForm" layout="inline">
              <a-form-item field="riskPointName" label="风险点名称">
                <a-input
                  v-model.trim="tempSearchForm.riskPointName"
                  placeholder="请输入风险点名称"
                  allow-clear
                ></a-input>
              </a-form-item>
              <a-form-item field="riskPointAddr" label="风险点位置">
                <a-input
                  v-model.trim="tempSearchForm.riskPointAddr"
                  placeholder="请输入风险点位置"
                  allow-clear
                ></a-input>
              </a-form-item>
              <a-form-item field="riskLevelCode" label="风险等级">
                <a-select
                  v-model="tempSearchForm.riskLevelCode"
                  placeholder="请选择风险等级"
                  allow-clear
                  allow-search
                >
                  <a-option v-for="(value, key) of levelEnum" :value="+key">{{
                    value
                  }}</a-option>
                </a-select>
              </a-form-item>
              <a-form-item field="dutyDeptId" label="责任部门">
                <a-tree-select
                  v-model="tempSearchForm.dutyDeptId"
                  :fallback-option="false"
                  placeholder="请选择责任部门"
                  allow-clear
                  allow-search
                  :field-names="{
                    key: 'id',
                    title: 'name',
                  }"
                  :data="deptData"
                  :disable-filter="true"
                  @search="onDeptSearch"
                  @clear="clearSearchKey"
                  @blur="clearSearchKey"
                ></a-tree-select>
              </a-form-item>
              <a-form-item field="personId" label="责任人">
                <a-select
                  v-model="tempSearchForm.personId"
                  allow-clear
                  allow-search
                  placeholder="请选择责任人"
                >
                  <a-option
                    v-for="item in staffDataDropdown"
                    :key="item.id"
                    :value="item.id"
                    :label="item.userName"
                  ></a-option>
                </a-select>
                <!-- <a-input
                  v-model.trim="tempSearchForm.personName"
                  placeholder="请输入责任人"
                  allow-clear
                ></a-input> -->
              </a-form-item>
            </a-form>
          </template>
          <template #headerBtn>
            <a-space direction="vertical" :size="[0, 10]">
              <a-button
                type="primary"
                @click="
                  () => {
                    selectForm = tempSearchForm;
                    getRiskPointData();
                  }
                "
              >
                <icon-search class="icon" />
                查询
              </a-button>
              <a-button @click="resetSelectForm">
                <icon-refresh class="icon" />
                重置
              </a-button>
            </a-space>
          </template>
          <template #primaryBtn>
            <a-space>
              <a-button
                v-permission="'dangerPointAdd'"
                type="primary"
                @click="addPointModal('add')"
              >
                <icon-plus class="icon" />
                新增风险点
              </a-button>
            </a-space>
          </template>
          <template #minorBtn>
            <a-space>
              <icon-question-circle
                style="cursor: pointer"
                size="20"
                @click="handleOperationGuide"
              />
              <icon-refresh class="minor-icon" size="20" @click="refresh" />
            </a-space>
          </template>
          <template #table>
            <a-table
              :data="riskPointData.list"
              row-key="id"
              :columns="columns"
              :bordered="false"
              :scroll="{ x: '200%' }"
              :pagination="false"
            >
              <template #riskLevelCode="{ record }">
                <div class="span">{{ record.riskLevel }}</div>

                <!-- <span v-else style="color: ;">需要去辨识与评价中添加危险源</span> -->
              </template>

              <template #option="{ record }">
                <a-space>
                  <a-button
                    v-permission="'EvaluationPage'"
                    type="text"
                    size="mini"
                    status="success"
                    @click="toEvaluationPage(record.id)"
                    >辨识与评价</a-button
                  >
                  <a-button
                    v-permission="'dangerPointEdit'"
                    type="text"
                    size="mini"
                    @click="updatePointModal('edit', record.id)"
                    >编辑</a-button
                  >
                  <a-button
                    v-permission="'dangerPointDelete'"
                    type="text"
                    status="danger"
                    size="mini"
                    @click="deletePoint(record.riskPointName, record.id)"
                    >删除</a-button
                  >
                </a-space>
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
              :total="(riskPointData.total as number)"
              @change="currentChange"
              @page-size-change="pageSizeChange"
            ></a-pagination>
          </template>
        </TableListCard>
      </div>
    </div>

    <!-- 风险单元弹窗 -->
    <a-modal
      :visible="unitModal"
      :width="600"
      ok-text="保存"
      title-align="start"
      :title="unitModalTitle"
      @ok="submitUnit"
      @cancel="closeUnit"
    >
      <a-form ref="unitFormDom" :model="unitFormData" :rules="rules">
        <a-form-item
          v-if="unitFormData.parentId !== '0'"
          field="parentId"
          label="上级风险单元"
          required
        >
          <a-tree-select
            v-model:model-value="unitFormData.parentId"
            disabled
            :data="riskUnitData"
            :field-names="{
              key: 'id',
              title: 'name',
            }"
          ></a-tree-select>
        </a-form-item>
        <a-form-item field="riskUnitName" label="风险单元名称" required>
          <a-input
            v-model:model-value="unitFormData.riskUnitName"
            placeholder="请输入风险单元名称"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="riskUnitDesc" label="风险单元描述">
          <a-textarea
            v-model.trim="unitFormData.riskUnitDesc"
            placeholder="请输入风险单元描述"
            :auto-size="{ maxRows: 6, minRows: 6 }"
            show-word-limit
            :max-length="300"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 风险点弹窗 -->
    <a-modal
      :visible="pointModal"
      :width="600"
      ok-text="保存"
      title-align="start"
      :title="pointModalTitle"
      @ok="submitPoint"
      @cancel="closePoint"
    >
      <a-form
        ref="pointFormDom"
        :model="pointFormData"
        class="point-form"
        :rules="rules"
      >
        <a-form-item field="riskUnitId" label="所属风险单元" required>
          <a-tree-select
            v-model="pointFormData.riskUnitId"
            disabled
            :data="riskUnitData"
            :fallback-option="false"
            :field-names="{
              key: 'id',
              title: 'name',
            }"
          >
          </a-tree-select>
        </a-form-item>
        <a-form-item field="riskPointName" label="风险点名称" required>
          <a-input
            v-model.trim="pointFormData.riskPointName"
            placeholder="请输入风险点名称"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="riskPointAddr" label="风险点位置" required>
          <a-input
            v-model.trim="pointFormData.riskPointAddr"
            placeholder="请输入风险点位置"
            allow-clear
          ></a-input>
        </a-form-item>
        <a-form-item field="dutyDeptId" label="责任部门" required>
          <a-tree-select
            v-model:model-value="pointFormData.dutyDeptId"
            :fallback-option="false"
            placeholder="请先选择责任部门"
            allow-clear
            allow-search
            :field-names="{
              key: 'id',
              title: 'name',
            }"
            :data="deptData"
            :disable-filter="true"
            @search="onDeptSearch"
            @blur="clearSearchKey"
            @clear="clearSearchKey"
            @change="dutyDeptChange"
          ></a-tree-select>
        </a-form-item>
        <a-form-item label="责任人" required :content-flex="false">
          <a-row align="start">
            <a-col :span="12">
              <a-form-item
                field="personId"
                :wrapper-col-props="{ span: 23 }"
                class="response-person"
              >
                <a-select
                  v-model:model-value="pointFormData.personId"
                  :options="staffData"
                  :fallback-option="false"
                  allow-clear
                  allow-search
                  placeholder="请选择责任人"
                  :field-names="{
                    value: 'id',
                    label: 'userName',
                  }"
                  @change="personIdChange"
                >
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item field="contact" :wrapper-col-props="{ span: 24 }">
                <a-input
                  v-model.trim="pointFormData.contact"
                  disabled
                  placeholder="手机号码"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
        <a-form-item field="remark" label="备注">
          <a-textarea
            v-model.trim="pointFormData.remark"
            placeholder="请输入内容"
            :auto-size="{ maxRows: 6, minRows: 6 }"
            show-word-limit
            :max-length="300"
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>

    <!-- 指引弹窗 -->
    <a-modal
      width="40vw"
      title-align="center"
      title="风险辨识与评价流程"
      :visible="guideVisible"
      :footer="false"
      @cancel="guideVisible = false"
    >
      <div class="guide-content">
        <div class="add-risk-unit">
          <a-button type="primary"
            ><icon-plus
              class="icon"
              style="margin-right: 10px"
            />新增风险单元</a-button
          >
          新增（选中）风险单元
        </div>
        <div class="division"><icon-arrow-fall size="40" /></div>
        <div class="add-risk-point">
          <a-button type="primary"
            ><icon-plus
              class="icon"
              style="margin-right: 10px"
            />新增风险点</a-button
          >
          新增风险点
        </div>
        <div class="division"><icon-arrow-fall size="40" /></div>
        <div class="risk-identify">
          <a-button type="text" status="success">辨识与评价</a-button>
          新增风险点
        </div>
      </div>
      <div class="footer-description">
        请根据企业实际情况，按照设施、部位、场所和区域等维度进行风险单元及风险点的辨识
      </div>
      <div style="text-align: center">
        <a-button type="primary" @click="guideVisible = false"
          >我知道了</a-button
        >
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import { ref, computed, h, onMounted } from 'vue';
  import { cloneDeep, flatten } from 'lodash';
  import { useRouter, useRoute } from 'vue-router';
  import { Message, Modal } from '@arco-design/web-vue';
  import { useEnterpriseStore, useUserStore } from '@/store';
  import { getMapDictionaryAPI } from '@/api/index';
  import {
    getStaffDataAllAPI,
    getOrganizationTreeAPI,
  } from '@/api/enterpriseManage';
  import {
    getRiskAssessmentMethodAPI,
    getRiskUnitTeeBodyAPI,
    addRiskUnitAPI,
    detailRiskUnitAPI,
    updateRiskUnitAPI,
    deleteRiskUnitAPI,
    getRiskPointAPI,
    addRiskPointAPI,
    detailRiskPointAPI,
    updateRiskPointAPI,
    deleteRiskPointAPI,
  } from '@/api/risk';
  import type {
    RiskUnitBody,
    GetRiskPointBody,
    RiskPointBody,
  } from '@/api/risk';
  import type { StaffItem } from '@/views/enterpriseManage/staffManage/index';
  import type { OrganizationTreeData } from '@/store/modules/enterprise/types';
  import type { TableColumnData } from '@arco-design/web-vue';
  import type { RiskUnitDataItem, RiskPointData } from './index';
  import { handleOnKeyup } from '@/utils/event';
  import { useSearch } from '@/views/pitfall/snapshot/composition/useSearch';

  export default {
    name: 'IdentificationAndEvaluation',
  };
</script>

<script lang="ts" setup>
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const enterpriseStore = useEnterpriseStore();
  // -------------------------- 前置数据 -----------------------
  const deptData = ref<OrganizationTreeData[]>([]);
  let depatTree: OrganizationTreeData[] = [];

  const staffDataMap: object = {};

  const getDeptData = async () => {
    const { data } = await getOrganizationTreeAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });
    deptData.value = data;
    depatTree = cloneDeep(deptData.value);
  };

  const { staffData: staffDataDropdown } = useSearch(['staffData']);

  getDeptData();

  // 部门下拉搜索
  const onDeptSearch = (searchKey: string) => {
    setTimeout(() => {
      deptData.value = searchData(searchKey, depatTree);
    }, 200);
  };

  const clearSearchKey = () => {
    onDeptSearch('');
  };

  // 风险等级 枚举
  const levelEnum = ref<any>();

  const getlevelEnum = async () => {
    const { data } = await getMapDictionaryAPI('risk_level');
    levelEnum.value = data;
  };

  getlevelEnum();

  const getStaffData = async () => {
    await enterpriseStore.getOrganizationTree({
      enterpriseId: userStore.userInfo.enterpriseId as string,
    });

    const { data: res } = await getStaffDataAllAPI({
      enterpriseId: userStore.userInfo.enterpriseId as string,
      deptId: pointFormData.value.dutyDeptId,
    });

    staffData.value = res;
  };

  const getEnterpriseMethod = async () => {
    setTimeout(async () => {
      const { data } = await getRiskAssessmentMethodAPI({
        id: userStore.userInfo.enterpriseId as string,
      });
      riskAssessCode.value = data.riskAssessCode;
    }, 0);
  };

  getEnterpriseMethod();

  const rules = ref({
    parentId: [{ required: true, message: '请选择上级风险单元' }],
    riskUnitName: [
      { required: true, message: '请输入风险单元名称' },
      { maxLength: 30, message: '不能超过30字符' },
    ],
    // riskUnitDesc: [{ required: true, message: '请输入风险单元描述' }],
    riskUnitId: [{ required: true, message: '请选择所属风险单元' }],
    riskPointName: [
      { required: true, message: '请输入风险点名称' },
      { maxLength: 30, message: '不能超过30字符' },
    ],
    riskPointAddr: [
      { required: true, message: '请输入风险点位置' },
      { maxLength: 60, message: '不能超过60字符' },
    ],
    personId: [
      {
        validator: (value: any, callback: (error?: string) => void) => {
          if (!value) callback('请选择责任人');
          callback();
        },
      },
    ],
    dutyDeptId: [{ required: true, message: '请先选择责任部门' }],
  });

  // -------------------------- tree ----------------------
  const unitTreeRef = ref<any>();

  const riskUnitData = ref<RiskUnitDataItem[]>([]);

  const getRiskUnitData = async () => {
    const { data } = await getRiskUnitTeeBodyAPI();
    riskUnitData.value = data;
  };

  getRiskUnitData();

  onActivated(() => {
    getRiskUnitData();
    getRiskPointData();
  });

  // 搜索树
  const searchKey = ref('');

  const treeData = computed((): any => {
    if (!searchKey.value) return riskUnitData.value;
    return searchData(searchKey.value, riskUnitData.value);
  });

  const searchData = (keyword: string, arr: any) => {
    const loop = (data: any) => {
      const result: any[] = [];
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
      return result;
    };

    return loop(arr);
  };

  const getMatchIndex = (title: string) => {
    if (!searchKey.value) return -1;
    return title.toLowerCase().indexOf(searchKey.value.toLowerCase());
  };

  // 风险单元操作
  const unitModal = ref(false);
  const unitModalType = ref('add');

  const unitFormData = ref<RiskUnitBody>({
    tenantId: userStore.tenantId as string,
    parentId: '',
    riskUnitName: '',
    riskUnitDesc: '',
  });

  const unitFormDom = ref();

  const unitModalTitle = computed(() =>
    unitModalType.value === 'add' ? '新增风险单元' : '编辑风险单元'
  );

  const deteleUnit = async (name: string, node?: any) => {
    Modal.open({
      title: '提示',
      content: () =>
        h(ConfirmModalBody, {
          text: name,
          info: '删除数据不可恢复，请谨慎操作！',
        }),
      titleAlign: 'start',
      onOk: async () => {
        await deleteRiskUnitAPI(node.id);
        getRiskUnitData();
        Message.success({
          content: '删除成功',
        });
      },
    });
  };

  const openUnitModal = async (type: string, node?: any) => {
    unitModal.value = true;
    unitModalType.value = type;
    unitFormData.value.parentId = '0';
    if (node) {
      unitFormData.value.parentId = node.id;
    }
    if (node && type === 'edit') {
      unitFormData.value.parentId = node.parentId;
      const { data } = await detailRiskUnitAPI({ id: node.id });
      unitFormData.value = data;
    }
  };

  const submitUnit = async () => {
    const value = await unitFormDom.value.validate();
    if (value) return;

    if (unitModalType.value === 'add') {
      await addRiskUnitAPI(unitFormData.value);
      Message.success({
        content: '新增成功',
      });
    } else {
      await updateRiskUnitAPI(unitFormData.value);
      Message.success({
        content: '编辑成功',
      });
    }

    getRiskUnitData();
    closeUnit();
  };

  const closeUnit = () => {
    unitFormDom.value.resetFields();
    unitModal.value = false;
    unitFormData.value = {
      tenantId: userStore.tenantId as string,
      parentId: '',
      riskUnitName: '',
      riskUnitDesc: '',
    };
  };

  const selectTreeNode = (selectedKeys: Array<string | number>) => {
    selectForm.value.riskUnitId = selectedKeys[0] as string;
    pointFormData.value.riskUnitId = selectedKeys[0] as string;
    selectForm.value.pageNo = 1;
    selectForm.value.pageSize = 10;
    getRiskPointData();
  };

  const cancelSelectTreeNode = () => {
    unitTreeRef.value.selectAll(false);
    selectForm.value.riskUnitId = '';
    pointFormData.value.riskUnitId = '';
    getRiskPointData();
  };

  const expandAll = () => {
    unitTreeRef.value.expandAll(!unitTreeRef.value.getExpandedNodes().length);
  };

  // ------------------------- select -----------------------------

  const selectedUnit = ref([]);

  const selectForm = ref<GetRiskPointBody>({
    riskUnitId: '',
    pageNo: 1,
    pageSize: 10,
  });
  const tempSearchForm = ref<GetRiskPointBody>({
    riskUnitId: '',
    pageNo: 1,
    pageSize: 10,
  });
  const selectFormDom = ref();

  const getRiskPointData = async () => {
    const { data } = await getRiskPointAPI(selectForm.value);
    riskPointData.value = data;
  };

  getRiskPointData();

  const resetSelectForm = () => {
    selectFormDom.value.resetFields();
    selectForm.value.riskUnitId = selectedUnit.value[0];
    tempSearchForm.value = {
      pageNo: 1,
      pageSize: 10,
    };
    getRiskPointData();
  };

  onMounted(() => {
    handleOnKeyup('Enter', () => {
      selectForm.value = tempSearchForm.value;
      getRiskPointData();
    });
  });

  // ------------------------- table -----------------------------

  const riskAssessCode = ref('');

  const riskPointData = ref<RiskPointData>({ list: [], total: 0 });

  const columns: TableColumnData[] = [
    {
      title: '风险点名称',
      fixed: 'left',
      dataIndex: 'riskPointName',
      // width: 180,
      cellStyle: { width: '10%' },
    },
    {
      title: '所属风险单元',
      // width: 160,
      dataIndex: 'riskUnitName',
      cellStyle: { width: '10%' },
    },
    {
      title: '风险点位置',
      dataIndex: 'riskPointAddr',
      // width: 160,
      cellStyle: { width: '13%' },
    },
    {
      title: '风险等级',
      slotName: 'riskLevelCode',
      dataIndex: 'riskLevelCode',
      // width: 90,
      bodyCellStyle: (record: TableData) => {
        if (record.riskLevelCode === '1') {
          return { color: 'rgb(212, 48, 48)' };
        }
        if (record.riskLevelCode === '2') {
          return { color: 'rgb(245, 154, 35)' };
        }
        if (record.riskLevelCode === '3') {
          return { color: 'rgb(255, 223, 37)' };
        }
        if (record.riskLevelCode === '4') {
          return { color: 'rgb(53, 124, 240)' };
        }
      },
      cellStyle: { width: '6%' },
    },
    {
      title: '危险源数',
      dataIndex: 'dangerNum',
      // width: 90,
      cellStyle: { width: '6%' },
    },
    {
      title: '诱发事故类型数',
      dataIndex: 'acctypeNum',
      // width: 130,
      cellStyle: { width: '10%' },
    },
    {
      title: '管控措施数',
      dataIndex: 'controlMeasureNum',
      // width: 105,
      cellStyle: { width: '7%' },
    },
    {
      title: '责任部门',
      dataIndex: 'dutyDeptName',
      // width: 120,
      cellStyle: { width: '9%' },
    },
    {
      title: '责任人',
      dataIndex: 'personName',
      // width: 120,
      cellStyle: { width: '9%' },
    },
    {
      title: '手机号码',
      dataIndex: 'contact',
      // width: 120,
      cellStyle: { width: '9%' },
    },
    {
      title: '操作',
      fixed: 'right',
      align: 'center',
      slotName: 'option',
      cellStyle: { width: '12%' },
    },
  ];

  const refresh = async () => {
    getRiskPointData();
  };

  const toEvaluationPage = (id: string) => {
    router.push({
      name: 'EvaluationPage',
      query: {
        id,
      },
    });
  };

  const deletePoint = (name: string, id: string) => {
    Modal.open({
      title: '提示',
      content: () =>
        h(ConfirmModalBody, {
          text: name,
          info: '删除数据不可恢复，请谨慎操作！',
        }),
      titleAlign: 'start',
      onOk: async () => {
        await deleteRiskPointAPI(id);
        Message.success({
          content: '删除成功',
        });
        let totalPage = Math.ceil(
          (riskPointData.value.total! - 1) / selectForm.value.pageSize!
        );
        let currentPage =
          selectForm.value.pageNo! > totalPage
            ? totalPage
            : selectForm.value.pageNo;
        selectForm.value.pageNo = currentPage! < 1 ? 1 : currentPage;
        refresh();
      },
    });
  };

  // 风险点操作
  const pointModal = ref(false);
  const pointModalType = ref('');
  const pointFormData = ref<RiskPointBody>({
    tenantId: userStore.tenantId as string,
    riskUnitId: '',
    riskUnitName: '',
    riskPointName: '',
    riskPointAddr: '',
    dutyDeptId: '',
    dutyDeptName: '',
    personId: '',
    personName: '',
  });

  const pointModalTitle = computed(() =>
    pointModalType.value === 'add' ? '新增风险点' : '编辑风险点'
  );

  const pointFormDom = ref();

  const staffData = ref<StaffItem[]>([]);

  const addPointModal = async (type: string) => {
    pointFormData.value.riskUnitId = selectedUnit.value[0];
    // 判断是否有风险单元
    if (!pointFormData.value.riskUnitId) {
      Message.warning({
        content: '请先选择左侧风险单元',
      });
      return;
    }
    // 判断是否设置了方法
    if (!riskAssessCode.value) {
      Message.warning({
        content: '请先设置风险评估方法',
        duration: 1500,
      });

      const timerId = setTimeout(() => {
        router.push({
          name: 'RiskAssessment',
          query: {
            pageName: route.name as string,
          },
        });
        clearTimeout(timerId);
      }, 1500);
      return;
    }

    pointModalType.value = type;
    pointModal.value = true;
  };

  const updatePointModal = async (type: string, id?: string) => {
    const { data } = await detailRiskPointAPI({ id: id as string });
    pointFormData.value = data;
    pointModalType.value = type;
    pointModal.value = true;
    if (data.dutyDeptId) {
      getStaffData();
    }
  };

  const submitPoint = async () => {
    const value = await pointFormDom.value.validate();
    if (value) return;

    pointModalType.value === 'add' ? await addSubmit() : await updateSubmit();

    closePoint();
  };

  const addSubmit = async () => {
    await addRiskPointAPI(pointFormData.value);

    Message.success({
      content: '新增成功',
    });

    resetSelectForm();
  };

  const updateSubmit = async () => {
    await updateRiskPointAPI(pointFormData.value);
    Message.success({
      content: '编辑成功',
    });

    getRiskPointData();
  };

  const closePoint = () => {
    pointFormDom.value.resetFields();
    staffData.value = [];
    // pointFormData.value.riskUnitId = selectedUnit.value[0];
    pointModal.value = false;
    pointFormData.value = {
      tenantId: userStore.tenantId as string,
      riskUnitId: '',
      riskUnitName: '',
      riskPointName: '',
      riskPointAddr: '',
      dutyDeptId: '',
      dutyDeptName: '',
      personId: '',
      personName: '',
    };
  };

  const dutyDeptChange = () => {
    pointFormData.value.personId = '';
    pointFormData.value.contact = '';
    getStaffData();
  };

  const personIdChange = (
    value:
      | string
      | number
      | Record<string, any>
      | (string | number | Record<string, any>)[]
  ) => {
    const item = staffData.value.find((item) => item.id === (value as string));

    pointFormData.value.contact = item?.tel;
  };

  // ------------------------ 分页 --------------------------

  const currentChange = (current: number) => {
    selectForm.value.pageNo = current;
    getRiskPointData();
  };

  const pageSizeChange = (pageSize: number) => {
    selectForm.value.pageSize = pageSize;
    getRiskPointData();
  };

  const collapsed = ref<boolean>(false);

  const onCollapse = () => {
    collapsed.value = !collapsed.value;
  };

  // 指引
  const guideVisible = ref(false);
  const handleOperationGuide = () => {
    guideVisible.value = true;
  };
</script>

<style lang="less" scoped>
  :deep(.header .arco-form-item) {
    margin: 6px 5px;
    width: calc(100% / 3 - 10px);
    max-width: calc(100% / 3 - 10px);
  }

  .container {
    .title {
      width: 100%;
      height: 40px;
      line-height: 20px;
      font-size: 16px;
      // font-weight: 700;
      padding: 10px;
      margin-bottom: 10px;
      background-color: var(--color-bg-2);
    }

    .content {
      height: 100%;
      display: flex;
      position: relative;
    }
    .boxCollapse {
      width: 0;
      padding: 0;
      margin: 0;
    }
    .collapse-icon {
      position: absolute;
      width: 16px;
      height: 40px;
      text-align: center;
      border-radius: 5px;
      line-height: 40px;
      top: 50%;
      left: 20%;
      transform: translate(-15px, -50%);
      z-index: 999;
      background-color: #c9cdd4;
      color: #ffffff;
      cursor: pointer;
      transition: all 0.2s ease-in-out;
      .arco-icon {
        transition: all 0.2s ease-in-out;
        transform: rotate(180deg);
      }
      &.collapse {
        left: 0;
        transform: translate(0, -50%);
        .arco-icon {
          transform: rotate(0deg);
        }
      }
    }
  }

  .left {
    flex: 0 0 auto;
    width: 20%;
    padding: 20px 10px;
    margin-right: 10px;
    overflow: auto;
    background-color: var(--color-bg-2);
    position: relative;
    transition: all 0.2s;

    .header {
      margin-bottom: 20px;
    }

    :deep(.arco-tree-node-title) {
      margin-right: 4px;
      // white-space: nowrap;
      overflow: hidden;
      // text-overflow: ellipsis;
      width: 100%;
    }

    .tree-icon {
      margin: 0 2px;
      font-size: 20px;
      // top: 10px;
      color: #8c949c;
      opacity: 0;
    }

    :deep(.arco-tree-node:hover .tree-icon) {
      opacity: 1;
    }
  }

  .right {
    flex: 1;
    overflow: hidden;
    position: relative;
  }

  .tabs-layout {
    height: 94%;
    background-color: var(--color-bg-2);

    :deep(.arco-tabs-content) {
      height: 100%;
    }
  }

  .point-form {
    .arco-row {
      width: 100%;

      .arco-form-item {
        width: 100%;
        margin-bottom: 0;
      }
    }
  }

  :deep(.arco-form-item.arco-form-item-error.response-person) {
    margin-bottom: -20px;
  }
  :deep(.arco-card-bordered) {
    border: none;
  }
  .guide-content {
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 20px;
    .add-risk-unit,
    .add-risk-point,
    .risk-identify {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
      font-size: 16px;
    }
    .division {
      transform: rotate(-90deg);
    }
  }
  .footer-description {
    font-size: 16px;
    text-align: center;
    color: #357cf0;
    margin-bottom: 20px;
  }
</style>
