<template>
  <div class="emergency-plan-container">
    <div class="search">
      <div class="search-content">
        <a-input
          allow-clear
          v-model="searchValue"
          placeholder="请输入应急预案名称"
        ></a-input>
        <a-button type="primary" @click="search()">搜索</a-button>
      </div>
    </div>
    <div class="emergency-list">
      <div class="list">
        <div class="list-item" v-for="item in dataList.list" :key="item.id">
          <div class="type-and-name">
            <div class="type">#{{ item.emergencyTypeName }}</div>
            <div :class="['name', { isEnabled: item.isEnabled }]">{{
              item.emergencyName
            }}</div>
          </div>
          <div class="btn">
            <a-button
              type="primary"
              :status="item.isEnabled ? 'success' : 'normal'"
              @click="openDrawer(item)"
              >{{ item.isEnabled ? '正在执行' : '一键启动' }}</a-button
            >
          </div>
        </div>
      </div>
      <div class="pagination">
        <a-pagination
          :page-size="6"
          :total="dataList.total"
          size="mini"
          @change="search"
        >
          <template #page-item="{ page }">{{ page }}</template>
        </a-pagination>
      </div>
    </div>
  </div>
  <emergencyModal ref="emergencyModalRef" @success="success" />
</template>
<script lang="ts" setup>
  import { ref, toRef } from 'vue';
  import emergencyModal from './emergencyModal.vue';

  const props = defineProps({
    data: {
      type: Array,
      default: () => [],
    },
  });
  const dataList: any = toRef(props, 'data');

  const emits = defineEmits(['search', 'success']);
  const searchValue = ref('');
  const search = (e?: any) => {
    emits('search', searchValue.value, e);
  };
  const success = () => {
    search();
    emits('success');
  };

  const emergencyModalRef = ref<InstanceType<typeof emergencyModal> | null>(
    null
  );
  const openDrawer = (item: any) => {
    emergencyModalRef.value?.open(item.id, item.isEnabled);
  };
</script>
<style lang="less" scoped>
  .emergency-plan-container {
    height: 100%;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    .search {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      .search-content {
        width: 20rem;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        gap: 0.5rem;
        :deep(.arco-input-wrapper .arco-input.arco-input-size-medium) {
          font-size: 1rem;
        }
        .arco-input-wrapper {
          height: 1.5rem;
          background-color: #040e3d;
          border-radius: 2px;
          border: 0.5px solid #2a82e4;
          color: #ffffff;
          input {
            line-height: 1;
            font-size: 0.8rem;
          }
        }
        button {
          --primary-6: 42, 130, 228;
          height: 1.57rem;
          font-size: 1rem;
        }
      }
    }
    .emergency-list {
      height: 100%;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      overflow: hidden;
      .list {
        flex: 1;
        overflow: auto;
        color: #ffffff;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        font-size: 1rem;
        .list-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.64rem 1.79rem;
          background-color: #0a1454;
          .btn {
            --primary-6: 42, 130, 228;
            --success-6: 67, 207, 124;
            button {
              height: 1.5rem;
              line-height: 1;
              font-size: 1rem;
            }
          }
          .type-and-name {
            display: flex;
            align-items: center;
            .type {
              color: #2a82e4;
              width: 11.82rem;
            }
            .name {
              &.isEnabled {
                text-decoration: underline;
              }
            }
          }
        }
      }
      .pagination {
        margin-top: auto;
        padding-top: 0.2rem;
        display: flex;
        align-items: center;
        justify-content: center;
        --color-primary-light-1: #2a82e4;
        --primary-6: 255, 255, 255;
        --border-radius-small: 50%;
        :deep(.arco-pagination-size-mini .arco-pagination-item) {
          min-width: 1.6rem;
          height: 1.6rem;
          line-height: 1.6rem;
          font-size: 0.87rem;
          padding: 0;
        }
        :deep(.arco-pagination-item-previous) {
          display: none !important;
        }
        :deep(.arco-pagination-item-next) {
          display: none !important;
        }
      }
    }
  }
</style>
