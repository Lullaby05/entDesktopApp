<!-- 
    @author wml
    @date 2023-06-12
    @name 搜索组件
 -->
<template>
  <div class="box" :class="boxClass">
    <div class="form">
      <!-- 正常情况下普通插槽显示内容即可 -->
      <slot class="slotSearch" name="form"></slot>
    </div>
    <div class="tools">
      <a-button type="text" title="确认搜索" class="item" @click="search">
        <icon-search />
        查询
      </a-button>
      <a-button type="text" title="清除" class="item" @click="reset">
        <icon-refresh />
        重置
      </a-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import { ref, defineEmits } from 'vue';
  const boxClass = ref('collapse');

  const emit = defineEmits(['search', 'reset']); // defineEmits is a function. It takes an array of strings. The first

  const search = () => {
    emit('search', 'search');
  };

  const reset = () => {
    emit('reset', 'reset');
  };
</script>

<style lang="less" scoped>
  .collapse {
    height: 80px;
    overflow: hidden;
  }
  .box {
    display: flex;
    justify-content: space-between;
    .tools {
      // width: 230px;
      // height: 32px;
      // min-width: 230px;
      display: flex;
      // align-items: center;
      justify-content: right;

      .arco-btn {
        margin-right: 10px;
      }
      .arco-icon {
        margin-right: 5px;
      }
      .item {
        border-radius: 4.5px;
        border: 1px solid rgb(225 225 225);
        color: rgb(121, 121, 121);
      }
      .item:hover {
        background-color: #0b80e521;
      }
      .more:hover {
        background-color: var(--color-white);
      }
    }

    .slotSearch {
      background: #000;
    }
  }
  .form {
    flex: 1;
  }
  :deep(.arco-form-item) {
    width: calc(100% / 3 - 30px);
  }
  :deep(.arco-form-item-label-col) {
    width: 120px;
  }
</style>
