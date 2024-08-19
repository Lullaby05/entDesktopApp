<!-- 隐患管理--排查计划管理 -->
<template>
  <div class="container">
    <TableListCard>
      <template #headerInput>
        <a-form
          :model="selectForm"
          layout="inline"
          :label-col-props="{ span: 2 }"
        >
          <a-form-item field="" label="编号">
            <a-input placeholder="请选择自检自查编号"></a-input>
          </a-form-item>
          <a-form-item field="" label="名称">
            <a-input placeholder="请选择自检自查名称"></a-input>
          </a-form-item>
          <a-form-item field="" label="排查状态">
            <a-tree-select
              :data="[]"
              placeholder="请选择排查状态"
            ></a-tree-select>
          </a-form-item>
          <a-form-item field="" label="发起人">
            <a-input placeholder="请选择发起人部门"></a-input>
          </a-form-item>
          <a-form-item field="" label="排查人">
            <a-tree-select
              :data="[]"
              placeholder="请选择排查人部门"
            ></a-tree-select>
          </a-form-item>
          <a-form-item field="" label="检查类型">
            <a-tree-select
              :data="[]"
              placeholder="请选择检查类型"
            ></a-tree-select>
          </a-form-item>
        </a-form>
      </template>
      <template #headerBtn>
        <a-space direction="vertical" :size="[0, 10]">
          <a-button type="primary">
            <icon-search class="icon" />
            查询
          </a-button>
          <a-button>
            <icon-refresh class="icon" />
            重置
          </a-button>
        </a-space>
      </template>
      <template #primaryBtn>
        <a-space>
          <a-button type="primary" status="success" @click="toAddPage('add')">
            <icon-plus class="icon" />
            表单设计器
          </a-button>
        </a-space>
      </template>
      <template #minorBtn>
        <a-space>
          <icon-refresh class="minor-icon" size="20" />
        </a-space>
      </template>
      <template #table>
        <form-design ref="formDesign"></form-design>
        <!-- <Test /> -->
      </template>
    </TableListCard>
  </div>
</template>

<script lang="ts">
  import { ref, created } from 'vue';
  import { useRouter } from 'vue-router';
  import type { TableColumnData } from '@arco-design/web-vue/es/table/interface';
  //
  export default {
    name: 'form-design-test',
    created() {
      this.loadInitFrom();
    },
    methods: {
      // 初始化表单配置
      loadInitFrom() {
        this.$store.commit('loadForm', {
          formId: null,
          formName: '未命名表单',
          logo: {
            icon: 'el-icon-eleme',
            background: '#1e90ff',
          },
          settings: {
            commiter: [],
            admin: [],
            sign: false,
            notify: {
              types: ['APP'],
              title: '消息通知标题',
            },
          },
          groupId: undefined,
          formItems: [],
          formConfig: this.getDfFormConfig(),
          process: {
            id: 'root',
            parentId: null,
            type: 'ROOT',
            name: '发起人',
            desc: '任何人',
            props: {
              assignedUser: [],
              formPerms: [],
            },
            children: {},
          },
          remark: '备注说明',
        });
      },
      getDfFormConfig() {
        return {
          labelPos: 'top',
          ruleType: 'SIMPLE',
          labelWidth: '',
          rules: [],
          ruleJs:
            '//formData: 表单数据  formMap: 表单字段id -> 字段json配置\r\nfunction doChange(formData, formMap){\r\n\t\r\n}',
        };
      },
    },
  };
</script>

<script lang="ts" setup>
  import FormDesign from '@/components/form-design/design/FormDesign.vue';
  import data from '@/components/form-design/components/modelGroup.json';
  import Test from '@/components/form-design/test.vue';
  import storeDesign from '@/store_design';
  console.log('data:', data.data);

  const toAddPage = (type: string, row?: any) => {
    console.log('this.from:', storeDesign.state);
  };
</script>

<style lang="less" scoped>
  .layout-body {
    padding-top: 60px;
    min-width: 980px;
  }
</style>
