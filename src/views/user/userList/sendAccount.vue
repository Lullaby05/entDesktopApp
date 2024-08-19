<!-- 用户管理-批量发送账号 -->
<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title"
          >批量发送账号信息
        </span>
      </div>
      <div class="content-card-inner">
        <div class="content-header">
          以下列表人员的账号登录信息将按照如下所示短信示例批量发送至人员各自手机号上
        </div>
        <div class="content-example">
          <span>发送短信示例：</span>
          <div class="example-part">
            XXX，您好！您的登录手机号为：18230998912；登录密码为：Aa123456</div
          >
        </div>
        <div class="content-footer">
          <span>接收短信人员列表：（共{{ tableData.total || 0 }}条数据）</span>
          <div class="table-part">
            <a-table
              :data="tableData.list"
              row-key="id"
              :columns="columns"
              :bordered="false"
              :pagination="false"
            />
            <a-pagination
              :current="formData.pageNo"
              :page-size="formData.pageSize"
              show-total
              show-page-size
              :page-size-options="[10, 20, 50, 100]"
              :base-size="3"
              :buffer-size="1"
              :total="(tableData.total as number)"
              @change="pageChange"
              @page-size-change="pageSizeChange"
            ></a-pagination>
          </div>
        </div>
      </div>
      <div class="btn">
        <a-button @click="goBack">取消</a-button>
        <a-button type="primary" @click="handleSubmit">确定</a-button>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
  import { getUserPhone, sendUserAccount } from '@/api/user';
  import { Message, TableColumnData } from '@arco-design/web-vue';
  import { ref } from 'vue';
  import { useRoute, useRouter } from 'vue-router';

  const router = useRouter();
  const route = useRoute();

  const { userIds = '', staffIds = '' } = route.query;

  const formData = ref({
    employeeIds: staffIds ? (staffIds as string).split(',') : undefined,
    userIds: userIds ? (userIds as string).split(',') : undefined,
    pageNo: 1,
    pageSize: 10,
  });

  const tableData = ref<any>({ list: [], total: 0 });

  const columns: TableColumnData[] = [
    { title: '姓名', dataIndex: 'account' },
    { title: '接收手机号码', dataIndex: 'tel' },
  ];

  const getTableList = async () => {
    const { data } = await getUserPhone(formData.value);
    tableData.value = data;
  };
  getTableList();

  const pageChange = (page: number) => {
    formData.value.pageNo = page;
    getTableList();
  };

  const pageSizeChange = (pageSize: number) => {
    formData.value.pageSize = pageSize;
    getTableList();
  };

  const goBack = () => {
    router.back();
  };

  const handleSubmit = async () => {
    const params = tableData.value.list.map((item: any) => {
      return {
        ...item,
      };
    });
    await sendUserAccount(params);
    Message.success('发送成功');
    goBack();
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
  }
  .content-card-inner {
    min-height: calc(100vh - 265px);
    margin-bottom: 20px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 0 32px;
    .content-header {
      flex: 0 0 auto;
    }
    .content-example {
      flex: 0 0 auto;
      display: flex;
      .example-part {
        padding: 8px 16px;
        line-height: 32px;
        max-width: 400px;
        border: 1px solid #e5e5ea;
        border-radius: 5px;
      }
    }
    .content-footer {
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: 900px;
      .table-part {
        display: flex;
        flex-direction: column;
        gap: 16px;
        :deep(.arco-pagination) {
          justify-content: flex-end;
        }
      }
    }
  }

  .btn {
    margin-top: 20px;
    text-align: center;

    button + button {
      margin-left: 12px;
    }
  }
</style>
