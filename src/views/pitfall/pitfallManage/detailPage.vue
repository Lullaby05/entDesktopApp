<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">查看排查计划</span>
      </div>
      <div class="form">
        <a-form :model="formData" :label-col-props="{ span: 3 }">
          <a-form-item field="name" label="排查计划名称" required>
            <a-input disabled :model-value="formData.name"></a-input>
          </a-form-item>
          <a-form-item field="checkTypeName" label="检查类型" required>
            <a-input disabled :model-value="formData.checkTypeName"></a-input>
          </a-form-item>
          <a-form-item field="startPersonDeptName" label="发起人部门" required>
            <a-input
              disabled
              :model-value="formData.startPersonDeptName"
            ></a-input>
          </a-form-item>
          <a-form-item field="startPersonName" label="发起人" required>
            <a-input disabled :model-value="formData.startPersonName"></a-input>
          </a-form-item>

          <a-form-item
            field="checkPeopleDeptName"
            label="排查人所在部门"
            required
          >
            <a-input
              disabled
              :model-value="formData.checkPeopleDeptName"
            ></a-input>
          </a-form-item>
          <a-form-item field="checkPeopleName" label="排查人" required>
            <a-input disabled :model-value="formData.checkPeopleName"></a-input>
          </a-form-item>
          <a-form-item field="createDate" label="排查日期">
            <a-input disabled :model-value="formData.createDate"></a-input>
          </a-form-item>
          <a-divider orientation="left">排查单隐患数据</a-divider>
          <a-table
            :data="tableData"
            :columns="columns"
            :pagination="false"
            :bordered="{ cell: true }"
          >
            <template #number="{ rowIndex }">{{ rowIndex + 1 }}</template>
            <template #option>
              <a-button disabled type="text" status="danger">删除</a-button>
            </template>
          </a-table>
        </a-form>
      </div>
    </a-card>
  </div>
</template>

<script lang="ts">
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import data from './data.json';
  export default {
    name: '',
  };
</script>

<script lang="ts" setup>
  const route = useRoute();
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  // 根据id获取 排查单隐患数据
  //   console.log(route.query.id);
  const formData = ref<any>({});
  formData.value = JSON.parse(route.query.row as string);
  const tableData = ref();
  tableData.value = data.records;
  const columns = [
    {
      title: '序号',
      width: 60,
      slotName: 'number',
    },
    {
      title: '问题点',
      width: 100,
      dataIndex: 'point',
    },
    {
      title: '隐患类型',
      width: 120,
      dataIndex: 'inspectionTypeName',
    },
    {
      title: '检查标准',
      //   width: 180,
      dataIndex: 'standard',
    },
    {
      title: '检查依据',
      //   width: 180,
      dataIndex: 'basis',
    },
    {
      title: '隐患级别',
      width: 100,
      dataIndex: 'levelText',
    },
    {
      title: '重大隐患判定标准',
      width: 140,
      dataIndex: 'dangerBasis',
    },
    {
      title: '操作',
      width: 100,
      slotName: 'option',
    },
  ];
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
      width: auto;
      min-height: 400px;
      margin-bottom: 20px;
      .upload-tip {
        color: #f59b22;
      }
    }
  }
  .arco-card.btn-card {
    height: 66px;
    margin-top: 4px;
    padding-right: 40px;

    .btn {
      width: 100%;
      text-align: right;
    }
  }
</style>
