<template>
  <a-modal
    :visible="showModal"
    :title="props.modalTitle"
    :modal-style="{ width: '900px', maxHeight: '700px', overflow: 'auto' }"
    ok-text="保存"
    title-align="start"
    @cancel="closePublicModal"
    @ok="submitPitfallPoint"
  >
    <a-form :model="formData">
      <a-form-item field="" label="问题点" required>
        <a-input v-model:model-value="formData.point"></a-input>
      </a-form-item>
      <a-form-item field="" label="检查依据">
        <a-input v-model:model-value="formData.basis"></a-input>
      </a-form-item>
      <a-form-item field="" label="达标标准" required>
        <a-input v-model:model-value="formData.standard"></a-input>
      </a-form-item>
      <a-form-item field="" label="隐患类型" required>
        <a-tree-select :data="[]"></a-tree-select>
      </a-form-item>
      <a-form-item field="" label="隐患级别" required>
        <a-tree-select :data="[]"></a-tree-select>
      </a-form-item>
      <a-form-item field="" label="重大危险源判断依据">
        <a-textarea
          v-model:model-value="formData.dangerBasis"
          :auto-size="{ maxRows: 4 }"
        ></a-textarea>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script lang="ts">
  import { ref } from 'vue';
  export default {};
</script>

<script lang="ts" setup>
  const props = defineProps({
    modalTitle: {
      type: String,
      default: '新增',
    },
  });
  // ---------------- 弹窗 ----------------------
  const formData = ref<any>({});
  const showModal = ref(false);
  const emit = defineEmits(['returnFormData']);
  const closePublicModal = () => {
    showModal.value = false;
  };
  const submitPitfallPoint = () => {
    // console.log('提交');
    emit('returnFormData', { item: formData.value });
    closePublicModal();
  };
  // ---------------- 对付组件共享 ----------------
  defineExpose({
    showModal,
  });
</script>
