<template>
  <div class="container">
    <a-card class="content-card">
      <div class="header">
        <icon-left @click="goBack" /><span class="title">权限配置</span>
      </div>
      <div class="content-card-inner">
        <div class="desc">
          <div>角色名称：</div>
          <div>{{ roleName }}</div>
        </div>
        <div class="desc">
          <div>角色说明：</div>
          <div>{{ roleDesc }}</div>
        </div>
        <div class="permission-list">
          <permissionConfig
            v-model:pc-permission-list="pcPermissionList"
            v-model:wx-permission-list="wxPermissionList"
          />
        </div>
      </div>
      <div class="btn">
        <a-button @click="goBack">取消</a-button>
        <a-button type="primary" @click="handleSubmit">保存</a-button>
      </div>
    </a-card>
  </div>
</template>
<script lang="ts" setup>
  import { useRoute, useRouter } from 'vue-router';
  import permissionConfig from '../userList/component/permissionConfig.vue';
  import { ref } from 'vue';
  import { getMenuListByRole, updateRolePerission } from '@/api/user';
  import { Message } from '@arco-design/web-vue';

  const route = useRoute();
  const router = useRouter();

  const { id, roleName = '', roleDesc = '' } = route.query;

  const goBack = () => {
    router.back();
  };

  const pcPermissionList = ref<string[]>([]);
  const wxPermissionList = ref<string[]>([]);

  const getPermissionList = async () => {
    const { data: pcPermission } = await getMenuListByRole(2, id as string);
    const { data: wxPermission } = await getMenuListByRole(3, id as string);
    pcPermissionList.value = pcPermission;
    wxPermissionList.value = wxPermission;
  };

  getPermissionList();

  const handleSubmit = async () => {
    const params = {
      roleId: id,
      menuIds: [...pcPermissionList.value, ...wxPermissionList.value].join(','),
    };
    await updateRolePerission(params);
    Message.success('保存成功');
    goBack();
  };
</script>
<style lang="less" scoped>
  .arco-card.content-card {
    .header {
      font-size: 18px;

      .title {
        margin-left: 8px;
      }
    }
  }
  .content-card-inner {
    min-height: calc(100vh - 265px);
    margin: 20px 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    .desc {
      display: flex;
      align-items: center;
      & > div:nth-of-type(1) {
        color: var(--color-text-2);
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
