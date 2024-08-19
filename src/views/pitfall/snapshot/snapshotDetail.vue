<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">{{ title }}</span>
      </div>
      <div class="content-card-form">
        <!-- 隐患信息部分 -->
        <cardDisplay
          :card-items="checkInfoItems"
          :key="checkInfoItems?.items.length"
        />

        <!-- 排查信息部分 -->
        <cardDisplay
          v-if="domDisplay.troubleInfo"
          :card-items="troubleInfoItems"
          :key="troubleInfoItems?.items.length"
        />

        <!-- 整改下发表单 -->
        <div v-if="domDisplay.troubleForm">
          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            整改下发信息
          </div>
          <div class="content">
            <a-form ref="troubleInfoRef" :model="troubleInfoFormData">
              <a-form-item
                field="rectifyDepartId"
                label="整改责任部门"
                :rules="troubleInfoFormRules.rectifyDepartId"
              >
                <a-tree-select
                  v-model="troubleInfoFormData.rectifyDepartId"
                  :fallback-option="false"
                  placeholder="请先选择整改责任部门"
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
                    (val) => {
                      troubleInfoFormData.rectifyId = '';
                    }
                  "
                ></a-tree-select>
              </a-form-item>
              <a-form-item
                field="rectifyId"
                label="整改责任人"
                :rules="troubleInfoFormRules.rectifyId"
              >
                <a-select
                  ref="selectDom"
                  v-model="troubleInfoFormData.rectifyId"
                  allow-clear
                  allow-search
                  :options="
                    staffDataMap.get(troubleInfoFormData.rectifyDepartId)
                  "
                  :fallback-option="false"
                  placeholder="请选择整改责任人"
                  :field-names="{
                    value: 'id',
                    label: 'userName',
                  }"
                >
                </a-select>
              </a-form-item>
              <a-form-item
                field="rectifyTime"
                label="限期整改时间"
                :rules="troubleInfoFormRules.rectifyTime"
              >
                <a-date-picker
                  allow-clear
                  v-model="troubleInfoFormData.rectifyTime"
                  show-time
                  :time-picker-props="{ defaultValue: '23:59:59' }"
                  format="YYYY-MM-DD HH:mm:ss"
                />
              </a-form-item>
              <a-form-item
                field="rectifyMeasures"
                label="整改措施"
                :rules="troubleInfoFormRules.rectifyMeasures"
              >
                <a-textarea
                  v-model="troubleInfoFormData.rectifyMeasures"
                  :max-length="300"
                  :auto-size="{
                    minRows: 6,
                    maxRows: 6,
                  }"
                  show-word-limit
                  allow-clear
                ></a-textarea>
              </a-form-item>
              <a-form-item label="整改状态">
                {{ troubleInfoFormData.rectifyStateName }}
              </a-form-item>
              <a-form-item label="整改下发时间">
                {{ troubleInfoFormData.createTime }}
              </a-form-item>
            </a-form>
          </div>
        </div>

        <!-- 隐患确认表单部分 -->
        <div v-if="domDisplay.troubleConfirm">
          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            隐患确认
          </div>
          <div class="content">
            <a-form ref="troubleFormRef" :model="troubleFormData">
              <a-form-item
                field="isHiddenDanger"
                label="隐患确认"
                :rules="troubleFormRules.isHiddenDanger"
              >
                <a-radio-group v-model="troubleFormData.isHiddenDanger">
                  <a-radio :value="1">隐患</a-radio>
                  <a-radio :value="0">非隐患</a-radio>
                </a-radio-group>
              </a-form-item>
              <!-- 隐患 -->
              <template v-if="troubleFormData.isHiddenDanger === 1">
                <a-form-item
                  field="dangerLevelCode"
                  label="隐患级别"
                  :rules="troubleFormRules.dangerLevelCode"
                >
                  <a-select
                    v-model="troubleFormData.dangerLevelCode"
                    placeholder="请选择隐患级别"
                    allow-search
                    allow-clear
                  >
                    <a-option
                      v-for="item in dangerLevelDict"
                      :key="item.dictKey"
                      :value="item.dictKey"
                      >{{ item.dictValue }}</a-option
                    >
                  </a-select>
                </a-form-item>
                <a-form-item
                  field="rectifyDepartId"
                  label="整改责任部门"
                  :rules="troubleFormRules.rectifyDepartId"
                >
                  <a-tree-select
                    v-model="troubleFormData.rectifyDepartId"
                    :fallback-option="false"
                    placeholder="请选择整改责任部门"
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
                      (val) => {
                        troubleFormData.rectifyId = '';
                      }
                    "
                  ></a-tree-select>
                </a-form-item>
                <a-form-item
                  field="rectifyId"
                  label="整改责任人"
                  :rules="troubleFormRules.rectifyId"
                >
                  <a-select
                    ref="selectDom"
                    v-model="troubleFormData.rectifyId"
                    allow-clear
                    allow-search
                    :options="staffDataMap.get(troubleFormData.rectifyDepartId)"
                    :fallback-option="false"
                    placeholder="请选择整改责任人"
                    :field-names="{
                      value: 'id',
                      label: 'userName',
                    }"
                    @change="personChange(troubleFormData)"
                  >
                  </a-select>
                </a-form-item>
                <a-form-item
                  field="rectifyTime"
                  label="限期整改时间"
                  :rules="troubleFormRules.rectifyTime"
                >
                  <a-date-picker
                    v-model="troubleFormData.rectifyTime"
                    show-time
                    :time-picker-props="{ defaultValue: '23:59:59' }"
                    format="YYYY-MM-DD HH:mm:ss"
                    allow-clear
                  />
                </a-form-item>
                <a-form-item
                  field="rectifyMeasures"
                  label="整改措施"
                  :rules="troubleFormRules.rectifyMeasures"
                >
                  <a-textarea
                    v-model="troubleFormData.rectifyMeasures"
                    :max-length="300"
                    :auto-size="{
                      minRows: 6,
                      maxRows: 6,
                    }"
                    show-word-limit
                    allow-clear
                  ></a-textarea>
                </a-form-item>
              </template>
              <!-- 非隐患 -->
              <template v-if="troubleFormData.isHiddenDanger === 0">
                <a-form-item field="remark" label="备注">
                  <a-textarea
                    v-model="troubleFormData.remark"
                    :max-length="300"
                    :auto-size="{
                      minRows: 6,
                      maxRows: 6,
                    }"
                    show-word-limit
                    allow-clear
                  ></a-textarea>
                </a-form-item>
              </template>
            </a-form>
          </div>
        </div>

        <!-- 整改下发信息部分 -->
        <cardDisplay
          v-if="domDisplay.rectifyDelivery"
          :card-items="rectifyDeliveryInfoItems"
          :key="rectifyDeliveryInfoItems?.items.length"
        />

        <!-- 整改上报信息部分 -->
        <cardDisplay
          v-if="domDisplay.rectifyReport"
          :card-items="rectifyReportInfoItems"
          :key="rectifyReportInfoItems?.items.length"
        />

        <div v-if="domDisplay.troubleReport" class="content">
          <div class="title"> 上报整改情况 </div>
          <a-form ref="rectifyReportRef" :model="rectifyReportFormData">
            <a-form-item
              field="rectifySituation"
              label="整改情况"
              :rules="rectifyReportFormRules.rectifySituation"
            >
              <a-textarea
                v-model="rectifyReportFormData.rectifySituation"
                placeholder="请输入整改情况"
                :max-length="300"
                :auto-size="{
                  minRows: 6,
                  maxRows: 6,
                }"
                show-word-limit
                allow-clear
              ></a-textarea>
            </a-form-item>
            <a-form-item
              field="rectifyImages"
              label="整改图片"
              :rules="rectifyReportFormRules.rectifyImages"
            >
              <a-upload
                :headers="rectifyHeaders"
                list-type="picture-card"
                :custom-request="rectifyCustomRequest"
                :limit="9"
                :file-list="rectifyReportFormData.rectifyImages"
                image-preview
                accept="image/*"
                @before-upload="(e) => beforeUpload(e, 'image/*')"
                @success="(fileItem:FileItem)=>onRectifySuccess(fileItem)"
                @before-remove="(fileItem:FileItem)=>beforeRectifyRemove(fileItem)"
              />
            </a-form-item>
          </a-form>
        </div>

        <!-- 整改验收表单部分 -->
        <div v-if="domDisplay.rectifyAcceptance" class="acceptance">
          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            整改验收
          </div>
          <div class="content">
            <a-form
              ref="rectifyAcceptanceRef"
              :model="rectifyAcceptanceFormData"
            >
              <a-form-item
                field="checkAcceptResult"
                label="验收结果"
                :rules="rectifyAcceptanceFormRules.checkAcceptResult"
              >
                <a-select
                  v-model="rectifyAcceptanceFormData.checkAcceptResult"
                  placeholder="请确认是否整改完成"
                  allow-search
                  allow-clear
                >
                  <a-option
                    v-for="item in rectifyResultDict"
                    :key="item.value"
                    :value="item.value"
                    >{{ item.description }}</a-option
                  >
                </a-select>
              </a-form-item>
              <a-form-item
                field="checkAcceptSignature"
                label="验收签名"
                :rules="rectifyAcceptanceFormRules.checkAcceptSignature"
              >
                <div class="sign-container">
                  <a-button type="primary" @click="openSignModal">{{
                    rectifyAcceptanceFormData.checkAcceptSignature
                      ? '重签'
                      : '签名'
                  }}</a-button>
                  <img
                    v-if="rectifyAcceptanceFormData.checkAcceptSignature"
                    :src="rectifyAcceptanceFormData.checkAcceptSignature"
                  />
                </div>
              </a-form-item>
              <a-form-item field="checkAcceptImages" label="上传相关图片">
                <a-upload
                  :headers="headers"
                  list-type="picture-card"
                  action=""
                  :custom-request="customRequest"
                  :limit="9"
                  :file-list="rectifyAcceptanceFormData.checkAcceptImages"
                  image-preview
                  accept="image/*"
                  @before-upload="(e) => beforeUpload(e, 'image/*')"
                  @success="(fileItem:FileItem)=>onSuccess(fileItem)"
                  @before-remove="(fileItem:FileItem)=>beforeRemove(fileItem)"
                />
              </a-form-item>
              <a-form-item field="checkRemark" label="备注">
                <a-textarea
                  v-model="rectifyAcceptanceFormData.checkRemark"
                  :max-length="300"
                  :auto-size="{
                    minRows: 6,
                    maxRows: 6,
                  }"
                  show-word-limit
                  allow-clear
                ></a-textarea>
              </a-form-item>
            </a-form>
          </div>
          <div class="other-btn">
            <a-button
              v-permission="transformPermission"
              type="primary"
              @click="transformVisible = true"
              >转发</a-button
            >
          </div>
        </div>

        <!-- 验收信息部分 -->
        <cardDisplay
          v-if="domDisplay.rectifyInfo"
          :card-items="acceptanceInfoItems"
          :key="acceptanceInfoItems?.items.length"
        />

        <!-- 复审信息部分 -->
        <cardDisplay
          v-if="domDisplay.reexamine"
          :card-items="reexamineInfoItems"
          :key="reexamineInfoItems?.items.length"
        />

        <!-- 复审验收表单部分 -->
        <div v-if="domDisplay.rectifyReexamine" class="acceptance">
          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            复审验收
          </div>
          <div class="content">
            <a-form ref="rectifyReexamineRef" :model="rectifyReexamineFormData">
              <a-form-item
                field="isRecheck"
                label="复审结果"
                :rules="rectifyReexamineFormRules.isRecheck"
              >
                <a-select
                  allow-search
                  allow-clear
                  v-model="rectifyReexamineFormData.isRecheck"
                  placeholder="请确认是否整改完成"
                >
                  <a-option
                    v-for="item in reexamineResultDict"
                    :key="item.value"
                    :value="item.value"
                    >{{ item.description }}</a-option
                  >
                </a-select>
              </a-form-item>
              <a-form-item
                field="recheckSignature"
                label="复审签名"
                :rules="rectifyReexamineFormRules.recheckSignature"
              >
                <div class="sign-container">
                  <a-button type="primary" @click="openSignModal">{{
                    rectifyReexamineFormData.recheckSignature ? '重签' : '签名'
                  }}</a-button>
                  <img
                    v-if="rectifyReexamineFormData.recheckSignature"
                    :src="rectifyReexamineFormData.recheckSignature"
                  />
                </div>
              </a-form-item>
              <a-form-item field="recheckImages" label="上传相关图片">
                <a-upload
                  :headers="recheckHeaders"
                  list-type="picture-card"
                  action=""
                  :custom-request="recheckCustomRequest"
                  :limit="9"
                  :file-list="rectifyReexamineFormData.recheckImages"
                  image-preview
                  accept="image/*"
                  @before-upload="(e) => beforeUpload(e, 'image/*')"
                  @success="(fileItem:FileItem)=>onRecheckSuccess(fileItem)"
                  @before-remove="(fileItem:FileItem)=>onRecheckRemove(fileItem)"
                />
              </a-form-item>
              <a-form-item field="recheckRemark" label="备注">
                <a-textarea
                  v-model="rectifyReexamineFormData.recheckRemark"
                  :max-length="300"
                  :auto-size="{
                    minRows: 6,
                    maxRows: 6,
                  }"
                  show-word-limit
                  allow-clear
                ></a-textarea>
              </a-form-item>
            </a-form>
          </div>
          <div class="other-btn">
            <a-button
              v-permission="transformPermission"
              type="primary"
              @click="transformVisible = true"
              >转发</a-button
            >
          </div>
        </div>

        <!-- 隐患处理流程相关 -->
        <div v-if="domDisplay.process">
          <div class="title">
            <!-- <a-divider direction="vertical" :size="6" /> -->
            隐患处理进程
          </div>
          <div class="content">
            <processDisplay
              :key="rectifyDeliveryInfoItems?.items"
              :id="(id as string)"
              :status="(dangerStateCode as string)"
              :rectifyInfo="rectifyDeliveryInfoItems"
              :dangerLevelCode="(dangerLevelCode as string)"
            />
          </div>
        </div>
      </div>

      <div class="btn" v-if="domDisplay.btnDisplay">
        <a-button @click="goBack">取消</a-button>
        <a-button type="primary" @click="handleSave">保存</a-button>
      </div>
    </a-card>
    <a-modal
      :visible="signModalVisible"
      title="请工整书写您的名字"
      :footer="false"
      @cancel="closeSignModal"
    >
      <div class="sign-modal-content">
        <canvas
          ref="signRef"
          width="480"
          style="border: 1px dashed #999999"
        ></canvas>
      </div>
      <div class="sign-modal-footer">
        <a-button type="primary" @click="handleClearSign">重写</a-button>
        <a-button type="primary" @click="closeSignModal">取消</a-button>
        <a-button
          type="primary"
          @click="
            handleConfirm(
              domDisplay.rectifyReexamine
                ? 'reexamineSignature'
                : 'checkSignature',
              domDisplay.rectifyReexamine
                ? rectifyReexamineRef
                : rectifyAcceptanceRef
            )
          "
          >确定</a-button
        >
      </div>
    </a-modal>
    <a-modal
      :visible="transformVisible"
      title="转发"
      @ok="transformSuccess"
      @cancel="transformClose"
    >
      <a-form ref="transformRef" :model="transformData">
        <a-form-item
          field="acceptorId"
          label="验收人"
          :rules="[{ required: true, message: '请选择验收人' }]"
        >
          <a-select
            ref="selectDom"
            v-model="transformData.acceptorId"
            allow-clear
            allow-search
            :options="staffData"
            :fallback-option="false"
            placeholder="请选择验收人"
            :field-names="{
              value: 'id',
              label: 'userName',
            }"
            @change="acceptUserChange"
          >
          </a-select>
        </a-form-item>
        <a-form-item field="acceptorRemark" label="备注">
          <a-textarea
            v-model="transformData.acceptorRemark"
            :max-length="300"
            :auto-size="{
              minRows: 6,
              maxRows: 6,
            }"
            show-word-limit
            allow-clear
          ></a-textarea>
        </a-form-item>
      </a-form>
    </a-modal>
  </div>
</template>

<script lang="ts">
  export default {
    name: 'SnapshotDetail',
  };
</script>

<script lang="ts" setup>
  import { FileItem } from '@arco-design/web-vue/es/upload/interfaces';
  import cardDisplay from './components/cardDisplay.vue';
  import processDisplay from './components/processDisplay.vue';
  import { useDetail } from './composition/useDetail';
  import { useSearch } from './composition/useSearch';
  import { useDict } from './composition/useDict';
  import { useUpload } from './composition/useUpload';
  import { computed, onBeforeMount, reactive, ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { dictResponseType, getPitfallDicApi } from '@/api';
  import {
    getPitfallConfigById,
    getPitfallConfigByUser,
    pitfallEdit,
    pitfallExecute,
    pitfallReport,
  } from '@/api/pitfall';
  import { Message } from '@arco-design/web-vue';
  import { formatDate } from '@/utils/utils';
  import { statusEnum } from './composition/useDict';
  import { useAppStore, useUserStore } from '@/store';
  import useJudgeBindingUser from '@/hooks/judgeBindingUser';
  import { useCustomUpload } from '@/hooks/customUpload';

  const signRef = ref<HTMLCanvasElement | null>(null); // 签名画布Ref
  const troubleInfoRef = ref(null);
  const troubleFormRef = ref(null);
  const rectifyReportRef = ref(null);
  const rectifyAcceptanceRef = ref(null);
  const transformRef = ref(null);
  const rectifyReexamineRef = ref(null);

  const userStore = useUserStore();

  const route = useRoute();
  const router = useRouter();
  const {
    type,
    title = '隐患详情',
    id,
    dangerStateCode,
    dangerLevelCode,
    source = 'snapshotDetail',
    rectifyCount = 0,
  } = route.query;

  const {
    // 基础信息部分
    troubleInfoItems,
    checkInfoItems,
    rectifyDeliveryInfoItems,
    rectifyReportInfoItems,
    acceptanceInfoItems,
    reexamineInfoItems,
    totalData,
    // 隐患确认表单部分
    troubleFormData,
    troubleFormRules,
    // 整改验收表单部分
    rectifyAcceptanceFormData,
    rectifyAcceptanceFormRules,
    // 整改复审表单部分
    rectifyReexamineFormData,
    rectifyReexamineFormRules,
    goBack, // 返回
    // 签名弹窗部分
    signModalVisible,
    openSignModal,
    closeSignModal,
    handleClearSign,
    handleConfirm,
    // 整改下发表单部分
    troubleInfoFormData,
    troubleInfoFormRules,
  } = useDetail(
    signRef,
    id as string,
    dangerStateCode === statusEnum.TOBERECTIFY
  );

  const {
    staffData,
    staffDataMap,
    deptData,
    onDeptSearch,
    clearSearchKey,
    searchNameById,
  } = useSearch();

  const { rectifyResultDict, reexamineResultDict } = useDict();

  const { headers, action, onSuccess, beforeRemove, customRequest } = useUpload(
    rectifyAcceptanceFormData,
    'checkAcceptImages'
  );
  const { beforeUpload } = useCustomUpload();

  const appStore = useAppStore();
  const userInfo = computed(() => userStore.userInfo);

  const {
    headers: recheckHeaders,
    onSuccess: onRecheckSuccess,
    beforeRemove: onRecheckRemove,
    customRequest: recheckCustomRequest,
  } = useUpload(rectifyReexamineFormData, 'recheckImages');

  const permission = ref<number>(0b0000);

  const confirmPermission = computed(() => {
    return (0b1000 & permission.value) === 0b1000;
  });
  const reportPermission = computed(() => {
    return (0b0100 & permission.value) === 0b0100;
  });
  const acceptancePermission = computed(() => {
    return (0b0010 & permission.value) === 0b0010;
  });
  const recheckPermission = computed(() => {
    return (0b0001 & permission.value) === 0b0001;
  });

  const dangerLevelDict = ref<dictResponseType[]>();
  onBeforeMount(async () => {
    // 获取数据字典
    dangerLevelDict.value = (await getPitfallDicApi('hid_danger_level')).data;
    const { data } = await getPitfallConfigById(id as string);
    permission.value = parseInt(data, 2);
  });

  const btnPermission = appStore.appPermissionList;
  const obj: any = computed(() => {
    const confirm =
      btnPermission.includes(
        source === 'pitfallDetail'
          ? 'PitfallDetailConfirm'
          : 'SnapshotDetailConfirm'
      ) && confirmPermission.value;
    const acceptance =
      btnPermission.includes(
        source === 'pitfallDetail'
          ? 'PitfallManageAcceptance'
          : 'SnapshotDetailAcceptance'
      ) && acceptancePermission.value;
    const recheck =
      btnPermission.includes(
        source === 'pitfallDetail'
          ? 'PitfallManageRecheck'
          : 'SnapshotDetailRecheck'
      ) && recheckPermission.value;
    const report =
      btnPermission.includes(
        source === 'pitfallDetail'
          ? 'PitfallDetailReport'
          : 'SnapshotDetailReport'
      ) && reportPermission.value;
    return {
      confirm,
      report,
      acceptance,
      edit: btnPermission.includes(
        source === 'pitfallDetail' ? 'PitfallDetailEdit' : 'SnapshotEdit'
      ),
      reexamine: recheck,
    };
  });
  const domDisplay = reactive({
    troubleInfo: computed(() => {
      return (
        source === 'pitfallDetail' &&
        totalData.value.danger &&
        totalData.value.danger.dangerSourceCode !== '4' &&
        totalData.value.checkItem
      );
    }),
    troubleForm: type === 'edit',
    troubleReport: type === 'report',
    troubleConfirm: type === 'confirm',
    rectifyDelivery: !['confirm', 'edit', 'immediate'].includes(type as string),
    rectifyReport: !['report', 'confirm', 'edit'].includes(type as string),
    rectifyAcceptance: ![
      'report',
      'confirm',
      'edit',
      'toDetail',
      'reexamine',
      'immediate',
    ].includes(type as string),
    rectifyReexamine: type === 'reexamine',
    rectifyInfo: ['toDetail', 'reexamine'].includes(type as string),
    reexamine: type === 'toDetail',
    process: type === 'toDetail',
    btnDisplay: computed(function () {
      return (
        !['toDetail', 'immediate'].includes(type as string) &&
        obj.value[type as string]
      );
    }),
  });

  // 转发弹窗部分
  const transformVisible = ref<boolean>(false);
  const transformPermission = computed(() => {
    return source === 'pitfallDetail'
      ? dangerStateCode === statusEnum.TOBEACCEPTANCE
        ? 'PitfallManageAcceptanceTransfer'
        : 'PitfallManageRecheckTransfer'
      : dangerStateCode === statusEnum.TOBEACCEPTANCE
      ? 'SnapshotDetailAcceptanceTransfer'
      : 'SnapshotDetailRecheckTransfer';
  });
  const transformData = ref({
    acceptorId: '',
    acceptorRemark: '',
  });
  const transformSuccess = async () => {
    const params = {
      ...transformData.value,
      acceptorName: staffData.value.find(
        (item: any) => item.id === transformData.value.acceptorId
      )?.userName,
      id: id as string,
      isForward: 1,
      dangerStateCode: dangerStateCode as string,
    };
    await pitfallExecute(params);
    Message.success({
      content: '转发成功',
    });
    transformClose();
  };
  const transformClose = () => {
    transformData.value = { acceptorId: '', acceptorRemark: '' };
    transformVisible.value = false;
    router.back();
  };
  /**
   * 根据当前状态判断下一个流转到哪个状态并格式化数据
   * @param state 当前状态
   */
  const handleStateFlow = (
    state: string
  ): { nextState: string; formData: object } => {
    const formObj: any = {
      '1': troubleFormData.value,
      '2': troubleFormData.value,
      '3': troubleInfoFormData.value,
      '4': troubleInfoFormData.value,
      '5': rectifyAcceptanceFormData.value,
      '6': rectifyReexamineFormData.value,
    };
    const currentFormData = formObj[state as string];
    if (state === statusEnum.CONFIRMED) {
      // 待确认
      const nextState = currentFormData.isHiddenDanger
        ? statusEnum.TOBERECTIFY
        : statusEnum.MISSTATEMENT; // 判断是否隐患状态，是隐患则到 3（待整改），否则到2（误报）
      const formData: any = formObj[state];
      if (nextState === statusEnum.TOBERECTIFY) {
        formData.rectifyName = staffData.value.find(
          (ele: any) => ele.id === formData.rectifyId
        )!.userName;
        formData.rectifyDepartName = searchNameById(
          formData.rectifyDepartId,
          deptData.value
        );
        formData.rectifyStateCode = '8';
      }
      // confirmId和name需要从token取
      formData.confirmId = userInfo.value.enterPriseUserId;
      formData.confirmName = userInfo.value.userName;
      return { nextState, formData };
    } else if (state === statusEnum.TOBERECTIFY) {
      // 仅编辑，不修改状态
      const formData: any = formObj[state];
      formData.isHiddenDanger = 1;
      formData.dangerLevelCode = dangerLevelCode;
      formData.confirmId = userInfo.value.enterPriseUserId;
      formData.confirmName = userInfo.value.userName;
      formData.rectifyName = staffData.value.find(
        (ele: any) => ele.id === formData.rectifyId
      )!.userName;
      formData.rectifyDepartName = searchNameById(
        formData.rectifyDepartId,
        deptData.value
      );
      delete formData.createTime;
      return { formData, nextState: state };
    } else if (state === statusEnum.TOBEACCEPTANCE) {
      // 整改待验收
      const formData: any = {
        ...formObj[state],
        ...troubleInfoFormData.value,
        dangerLevelCode,
      };
      // 判断是否重大隐患，重大隐患则改为6，否则改为7
      let nextState = statusEnum.REEXAMINE;
      formData.checkAcceptImages = formData.checkAcceptImages.map(
        (ele: any) => {
          const type = ele.file.type.includes('image') ? 'image' : 'video';
          return {
            fileUrl: ele.response.data[0].filePath,
            postUrl: ele.response.data[0].coverUrl,
            fileType: type,
          };
        }
      );
      formData.rectifyCount = Number(rectifyCount);
      formData.isForward = 0;
      formData.checkAcceptId = userInfo.value.enterPriseUserId;
      formData.checkAcceptName = userInfo.value.userName;

      return { nextState, formData };
    } else if (state === statusEnum.REEXAMINE) {
      // 验收待复审
      // 复审通过则为7，否则变为待整改（3）
      const formData: any = {
        ...formObj[state],
        ...troubleInfoFormData.value,
        dangerLevelCode,
      };
      let nextState = statusEnum.RECTIFIED;
      if (formData.isRecheck === 0) {
        // 复审不通过
        nextState = statusEnum.RECTIFIED;
      }
      formData.rectifyCount = Number(rectifyCount);
      formData.recheckImages = formData.recheckImages.map((ele: any) => {
        const type = ele.file.type.includes('image') ? 'image' : 'video';
        return {
          fileUrl: ele.response.data[0].filePath,
          postUrl: ele.response.data[0].coverUrl,
          fileType: type,
        };
      });
      formData.verifierId = userInfo.value.enterPriseUserId;
      formData.verifierName = userInfo.value.userName;
      return { nextState, formData };
    }
    return {
      nextState: state,
      formData: formObj[state],
    };
  };

  const handleSave = async () => {
    // 如果是上报直接调用上报的方法
    if (type === 'report') {
      submitRectifyReport();
    }
    const refObj: any = {
      '1': troubleFormRef.value,
      '2': troubleFormRef.value,
      '3': troubleInfoRef.value,
      '4': troubleInfoRef.value,
      '5': rectifyAcceptanceRef.value,
      '6': rectifyReexamineRef.value,
    };
    const validResult = await refObj[dangerStateCode as string].validate();
    if (validResult) return;
    const { nextState, formData } = handleStateFlow(dangerStateCode as string);
    const params: any = {
      id,
      dangerStateCode: nextState,
      ...formData,
    };
    const reqObj = type === 'edit' ? pitfallEdit : pitfallExecute;
    await reqObj(params);
    Message.success({
      content: type === 'edit' ? '编辑成功' : '保存成功',
    });
    goBack();
  };

  // 整改上报信息表单和提交（测试用）
  const rectifyReportFormData = ref<any>({
    rectifySituation: '',
    rectifyImages: [],
  });
  const rectifyReportFormRules = {
    rectifySituation: [
      { required: true, message: '请输入整改情况', trigger: 'change' },
      { maxLength: 300, message: '不能超过300字符' },
    ],
    rectifyImages: [
      { required: true, message: '请上传整改图片', trigger: 'change' },
    ],
  };
  const {
    headers: rectifyHeaders,
    action: rectifyAction,
    onSuccess: onRectifySuccess,
    beforeRemove: beforeRectifyRemove,
    customRequest: rectifyCustomRequest,
  } = useUpload(rectifyReportFormData, 'rectifyImages');
  const submitRectifyReport = async () => {
    const validResult = await (rectifyReportRef.value as any).validate();
    if (validResult) return;
    const params: any = {
      id,
      ...rectifyReportFormData.value,
      rectifyImages: rectifyReportFormData.value.rectifyImages.map(
        (ele: any) => {
          const type = ele.file.type.includes('image') ? 'image' : 'video';
          return {
            fileUrl: ele.response.data[0].filePath,
            postUrl: ele.response.data[0].coverUrl,
            fileType: type,
          };
        }
      ),
      reportCreateId: userInfo.value.enterPriseUserId,
      reportCreateName: userInfo.value.userName,
      rectifyDepartId: troubleInfoFormData.value.rectifyDepartId,
      rectifyName: troubleInfoFormData.value.rectifyName,
      rectifyId: troubleInfoFormData.value.rectifyId,
      rectifyDepartName: troubleInfoFormData.value.rectifyDepartName,
      createTime: formatDate(new Date()),
    };
    await pitfallReport(params);
    Message.success({
      content: '整改上报信息提交成功',
    });
    goBack();
  };

  const { judgeBinding, judgeHasPermission } = useJudgeBindingUser();

  const personChange = async (e: any) => {
    const { rectifyId, rectifyDepartId } = e;
    const personObj = staffData.value.find((ele: any) => ele.id === rectifyId);
    const result = await judgeBinding({
      record: {
        id: rectifyId,
        userName: (personObj && personObj.userName) || '',
        deptId: rectifyDepartId,
        deptName: searchNameById(rectifyDepartId, deptData.value),
      },
    });
    if (result && result.hasBindingUser) {
      const hasPermission = await judgeHasPermission({
        id: rectifyId,
        moduleNamesPC: 'PitfallDetailReport',
        moduleNamesWX: 'PitfallReport',
      });
      if (!hasPermission) {
        troubleFormData.value.rectifyId = '';
        return;
      }
    }
    if (!result) {
      troubleFormData.value.rectifyId = '';
    }
  };

  const acceptUserChange = async (val: string) => {
    const obj = {
      [statusEnum.TOBEACCEPTANCE]:
        source === 'snapshotDetail'
          ? 'SnapshotDetailAcceptance'
          : 'PitfallManageAcceptance',
      [statusEnum.REEXAMINE]:
        source === 'snapshotDetail'
          ? 'SnapshotDetailRecheck'
          : 'PitfallManageRecheck',
    };
    const objWX = {
      [statusEnum.TOBEACCEPTANCE]: 'PitfallAccept',
      [statusEnum.REEXAMINE]: 'PitfallRecheck',
    };
    const hasPermission = await judgeHasPermission({
      id: val,
      moduleNamesPC: obj[dangerStateCode as keyof typeof obj],
      moduleNamesWX: objWX[dangerStateCode as keyof typeof objWX],
    });
    if (!hasPermission) {
      transformData.value.acceptorId = '';
      return;
    }
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
    .content-card-form {
      width: 100%;
      min-height: 600px;
      margin-bottom: 20px;
      margin-left: 26px;
      :deep(.card-display-title) {
        font-family: 'Alibaba-Medium';
        font-size: 16px;
        font-weight: 500;
        .arco-divider-vertical {
          margin-right: 2px;
          border-left: 1px solid #409eff;
        }
      }

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
        :deep(.arco-form .arco-col.arco-form-item-label-col) {
          flex: 0 0 140px;
          width: 140px;
        }
        :deep(.arco-form .arco-col.arco-form-item-wrapper-col) {
          flex: 0 0 400px;
          width: 400px;
        }
        .form-item-uploadTag {
          width: 100px;
          height: 30px;
          background-color: var(--color-white);
        }
        :deep(.arco-steps) {
          width: 80%;
          margin-left: 10px;
        }
      }
      .acceptance {
        position: relative;
        .other-btn {
          position: absolute;
          right: 50%;
          top: 0;
        }
      }

      .sign-container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        img {
          width: 200px;
          height: 100px;
        }
      }
    }
    .btn {
      text-align: center;
      button + button {
        margin-left: 12px;
      }
    }
  }
  .sign-modal-footer {
    text-align: right;
    button {
      margin-left: 20px;
    }
  }
</style>
