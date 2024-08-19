<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">{{ title }}</span>
      </div>
      <div class="form">
        <a-form :model="formData">
          <a-form-item field="" label="排查计划名称" required>
            <a-input
              :disabled="disabled"
              :model-value="formData.name"
            ></a-input>
          </a-form-item>
          <a-form-item field="" label="检查类型" required>
            <a-tree-select
              :disabled="disabled"
              :data="[]"
              :model-value="formData.checkTypeName"
            ></a-tree-select>
          </a-form-item>
          <a-form-item field="" label="发起人部门" required>
            <a-tree-select
              :disabled="disabled"
              :data="[]"
              :model-value="formData.startPersonDeptName"
            ></a-tree-select>
          </a-form-item>
          <a-form-item field="" label="发起人" required>
            <a-tree-select
              :disabled="disabled"
              :data="[]"
              :model-value="formData.startPersonName"
            ></a-tree-select>
          </a-form-item>
          <a-form-item field="" label="排查人所在部门" required>
            <a-tree-select
              :disabled="disabled"
              :data="[]"
              :model-value="formData.checkPeopleDeptName"
            ></a-tree-select>
          </a-form-item>
          <a-form-item field="" label="排查人" required>
            <a-tree-select
              :disabled="disabled"
              :data="[]"
              :model-value="formData.checkPeopleName"
            ></a-tree-select>
          </a-form-item>
          <a-form-item field="" label="排查日期" required>
            <a-date-picker
              v-model="formData.checkTime"
              placeholder="选择日期"
              :disabled="disabled"
            ></a-date-picker>
          </a-form-item>

          <a-form-item field="" label="">
            <a-space>
              <a-button
                type="primary"
                :disabled="disabled"
                @click="openModal('checklist')"
              >
                {{ chooseCheckListText }}
              </a-button>
              <a-button
                type="primary"
                :disabled="disabled"
                @click="openModal('pitfall')"
              >
                添加隐患数据
              </a-button>
              <a-button type="primary" :disabled="disabled"> 导入 </a-button>
            </a-space>
          </a-form-item>
        </a-form>
      </div>
      <div class="table">
        <a-divider>排查单隐患数据</a-divider>
        <a-table
          :data="pitfallList"
          row-key="id"
          :columns="pitfallColumns"
          :bordered="false"
          :pagination="false"
        >
          <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
          <template #option="{ record }">
            <a-button
              type="text"
              status="danger"
              :disabled="disabled"
              @click="deleteRow(record)"
              >删除</a-button
            >
          </template>
        </a-table>
      </div>
      <div class="btn">
        <a-space v-if="!disabled">
          <a-button>重置</a-button>
          <a-button type="primary" @click="submit">保存</a-button>
        </a-space>
      </div>
    </a-card>
    <!-- 选择隐患/检查表 弹窗 -->
    <a-modal
      :visible="showModal"
      :title="modalTitle"
      :modal-style="{ width: '1400px', maxHeight: '800px', overflow: 'auto' }"
      ok-text="保存"
      title-align="start"
      @cancel="closeModal"
      @ok="submitModal"
    >
      <div v-show="modalType === 'pitfall'">
        <AddPitfall ref="addPitfallDom"></AddPitfall>
      </div>
      <div v-show="modalType === 'checklist'">
        <Choosechecklist ref="choosechecklistDom"></Choosechecklist>
      </div>
    </a-modal>
  </div>
</template>

<script lang="ts">
  import { Modal } from '@arco-design/web-vue';
  import { ref, h, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { cloneDeep } from 'lodash';
  import ConfirmModalBody from '@/components/confirm/index.vue';
  import AddPitfall from '@/views/pitfall/components/addPitfall.vue';
  import Choosechecklist from '@/views/pitfall/components/chooseCheckList.vue';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';

  export default {
    // name: 'CheckAccordingToTheListAdd',
  };
</script>

<script lang="ts" setup>
  const route = useRoute();
  const router = useRouter();
  const title = computed(() => {
    if (route.query.type === 'add') return '新 增 排 查 计 划';
    return '查 看 排 查 计 划';
  });
  const disabled = computed(() => route.query.type === 'view');
  const goBack = () => {
    router.back();
  };
  // -----------------------  表单  --------------------------
  const formData = ref<any>({});
  formData.value = JSON.parse(route.query.data as string);
  // ----------------------- table ----------------------------
  // 通过id 请求 pitfallList
  const pitfallList = ref<any>([]);
  pitfallList.value = [
    {
      id: 15997,
      code: '',
      enterpriseId: 80,
      inspectionType: '01',
      status: 1,
      checkTypeText: null,
      point: '卫生间与食品生产、包装或贮存等区域直接连通',
      basis: '《茶叶加工良好规范》（GB/T 32744-2016）第5.3.6.4条',
      standard:
        '应根据需要设置卫生间，卫生间的结构、设施与内部材质应易于保持清洁；卫生间内的适当位置应设置洗手设施卫生间不得与食品生产、包装或贮存等区域直接连通出入口不能正对车间门，要避开通道，卫生间门应设自动关闭装置，要有良好的排风及照明设施',
      level: '01',
      dangerBasis: '',
      checkType: null,
      createBy: 11877,
      createDate: 1649236591000,
      updateBy: 11877,
      updateDate: 1649236591000,
      levelName: null,
      levelText: null,
      inspectionSite: null,
      inspectionCount: null,
    },
    {
      id: 15994,
      code: '',
      enterpriseId: 80,
      inspectionType: '01',
      status: 1,
      checkTypeText: null,
      point:
        '危险废物的容器和包装物以及收集、贮存、运输、处置危险废物的设施、场所，未设置危险废物识别标志',
      basis:
        '《中华人民共和国固体废物污染环境防治法》（中华人民共和国主席令第58号）第五十二条',
      standard:
        '对危险废物的容器和包装物以及收集、贮存、运输、处置危险废物的设施、场所，必须设置危险废物识别标志',
      level: '01',
      dangerBasis: '',
      checkType: null,
      createBy: 185,
      createDate: 1648117464000,
      updateBy: 185,
      updateDate: 1648117464000,
      levelName: null,
      levelText: null,
      inspectionSite: null,
      inspectionCount: null,
    },
    {
      id: 15830,
      code: '',
      enterpriseId: 80,
      inspectionType: '01',
      status: 1,
      checkTypeText: null,
      point: '未采用防锈、防潮、易清洗的密封框架',
      basis: '《茶叶加工良好规范》（GB/T 32744-2016）第5.2.5.1条',
      standard:
        '应采用防锈、防潮、易清洗的密封框架，设置位置适当，并便于卫生防护设施的设置',
      level: '01',
      dangerBasis: '',
      checkType: null,
      createBy: 11877,
      createDate: 1646880792000,
      updateBy: 11877,
      updateDate: 1646880792000,
      levelName: null,
      levelText: null,
      inspectionSite: null,
      inspectionCount: null,
    },
  ];
  const pitfallColumns: TableColumnData[] = [
    {
      title: '序号',
      slotName: 'number',
      width: 60,
      dataIndex: '',
      align: 'left',
    },
    {
      title: '问题点',
      width: 180,
      dataIndex: 'point',
    },
    {
      title: '隐患类型',
      width: 100,
      dataIndex: 'checkType',
    },
    {
      title: '检查标准',
      dataIndex: 'standard',
    },
    {
      title: '检查依据',
      width: 160,
      dataIndex: 'basis',
    },
    {
      title: '隐患级别',
      width: 100,
      dataIndex: 'levelText',
    },
    {
      title: '重大隐患判定依据',
      width: 160,
      dataIndex: 'dangerBasis',
    },

    {
      title: '操作',
      width: 140,
      align: 'center',
      slotName: 'option',
      dataIndex: '',
    },
  ];
  const deleteRow = (row: any) => {
    Modal.open({
      title: '提示',
      content: () => h(ConfirmModalBody),
      titleAlign: 'start',
      onOk: () => {
        pitfallList.value = pitfallList.value.filter(
          (values: any) => values.id !== row.id
        );
      },
    });
  };
  const submit = () => {
    console.log('等待');
  };
  // ----------------------  弹窗 ------------------------------
  const addPitfallDom = ref();
  const choosechecklistDom = ref();
  const chooseItem = ref<any>({});
  const showModal = ref(false);
  const modalType = ref('');
  const modalTitle = computed(() =>
    modalType.value === 'checkList' ? '选择检查表' : '添加隐患数据'
  );
  const chooseCheckListText = computed(() => {
    if (Object.keys(chooseItem.value).length) {
      return `已选择：${chooseItem.value.code} ${chooseItem.value.listName}`;
    }
    return '选择检查表';
  });
  const openModal = (type: string) => {
    modalType.value = type;
    showModal.value = true;
  };
  const closeModal = () => {
    showModal.value = false;
  };
  const submitModal = () => {
    // console.log('addPitfallDom', addPitfallDom.value.selectedList);
    if (modalType.value === 'checklist') {
      // 选择检查表
      chooseItem.value = cloneDeep(choosechecklistDom.value.selectedItem);
    } else {
      // 选择隐患
      const { itemList, selectedIdList } =
        addPitfallDom.value.addPitfallSubmit();
      // 去重
      pitfallList.value = pitfallList.value.filter(
        (item: any) =>
          !selectedIdList.some((key: number | string) => item.id === key)
      );
      pitfallList.value = [...pitfallList.value, ...cloneDeep(itemList)];
      addPitfallDom.value.addPitfallClose();
    }
    closeModal();
  };
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
      // min-height: 400px;
      margin-bottom: 20px;
      .upload-tip {
        color: #f59b22;
      }
    }
    .table {
      width: 100%;
    }
  }
  .btn {
    margin-top: 12px;
    width: 100%;
    text-align: center;
  }
</style>
